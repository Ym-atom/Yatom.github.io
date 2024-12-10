import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { classNames, getUuiD, mergeOptions } from '@/utils/util';
import successIcon from "@/assets/success.png";
import failIcon from "@/assets/fail.png";
import LoadingIcon from '../loading-icon/loading-icon';

/** 每则消息的配置项类型 */
type MessageOptionsT = {
  /** Message 文本内容 */
  content: string | React.ReactNode;
  /** 提示持续时间（ms），默认 2000，若为 0 则不会自动关闭 */
  duration?: number;
  /** Message 图标 */
  icon?: 'success' | 'fail' | 'loading' | React.ReactNode;
  /** 当前提示的唯一标志 */
  key?: string | number;
  /** 遮罩类名，不会覆盖组件原本样式，加 !important 可覆盖 */
  maskClassName?: string;
  /** 遮罩样式，会覆盖组件原本样式 */
  maskStyle?: React.CSSProperties;
  /** 内容区域类名，不会覆盖组件原本样式，加 !important 可覆盖 */
  bodyClassName?: string;
  /** 内容区域样式，会覆盖组件原本样式 */
  bodyStyle?: React.CSSProperties;
  /** Message 消失时触发 */
  onClose?: () => void;
};

/** Message 列表中每条消息的类型 */
type MessageItemT = {
  id: string; // 每条的唯一标识
  options: MessageOptionsT; // 每条消息的配置
}

/** 消息的全局配置项类型 */
type MessageGlobalOptionsT = {
  /** 提示持续时间（ms），默认 2000，若为 0 则不会自动关闭 */
  duration?: number;
  /** 最大显示数, 超过限制时，最早的消息会被自动关闭 */
  maxCount?: number;
  /** Message 消失时触发 */
  onClose?: () => void;
};

/** 默认配置 */
const defaultOptions: Pick<MessageOptionsT, 'duration' | 'onClose'> = {
  duration: 2000,
  onClose: undefined,
}

/** 全局配置 */
const globalOptions: MessageGlobalOptionsT = {};

/** Message 列表 */
let messageList: MessageItemT[] = [];

/** 监听器列表 */
let listeners: (() => void)[] = [];

/** Message 列表的状态管理 */
const store = {
  addMessage(item: MessageItemT) {
    messageList = [...messageList, item];
    emitChange();
  },
  deleteMessage(id: string) {
    messageList.find((m) => m.id === id)?.options.onClose?.();
    messageList = messageList.filter((m) => m.id !== id);
    emitChange();
  },
  subscribe(listener: () => void) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener); // 取消订阅函数
    };
  },
  getSnapshot() {
    return messageList;
  }
};
function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}

/** 内部 Message 组件 */
const InternalMessage: React.FC<{ props: Pick<MessageOptionsT, 'maskClassName' | 'maskStyle'> }> = ({ props }) => {
  const messageList = useSyncExternalStore(store.subscribe, store.getSnapshot);
  useEffect(() => {
    if (messageList.length === 0) {
      // setTimeout(() => {
      //   removeMessageBox();
      // }, 1000);
    }
  }, [messageList]);
  return (
    <div
      id='message-body-mask'
      className={classNames('message-mask', props.maskClassName)}
      style={{ ...props.maskStyle }}
    >
      {messageList.map((item, index) => (
        <MessageNotice key={index} id={item.id} options={item.options} />
      ))}
    </div>
  );
};

/** 单条消息组件 */
const MessageNotice: React.FC<MessageItemT> = ({ id, options }) => {
  useEffect(() => {
    if (options.duration !== 0) {
      setTimeout(() => {
        removeDomByID(id); // 根据指定 id 移除指定消息
      }, options.duration);
    }
  }, []);
  const ShowIcon = useMemo(() => {
    if (!options.icon || ['number', 'boolean'].includes(typeof options.icon)) {
      return null;
    }
    switch (options.icon) {
      case 'success':
        return <img className={'message-icon'} src={successIcon} />;
      case 'fail':
        return <img className={'message-icon'} src={failIcon} />;
      case 'loading':
        return <LoadingIcon className={'message-icon'} />;
      default:
        return typeof options.icon === 'string' ? null : <>{options.icon}</>;
    }
  }, [options]);
  return (
    <div
      id={`message-${id}`}
      className={classNames('message', options.bodyClassName)}
      style={{ ...options.bodyStyle }}
    >
      {ShowIcon && (
        <div className={'message-icon-box'}>{ShowIcon}</div>
      )}
      {typeof options.content === 'string' ? (
        <div className={'message-text'}>{options.content}</div>
      ) : (
        options.content
      )}
    </div>
  );
};

/** 
 * options 配置项说明
 * |  属性  |  类型  |  说明  |  默认值  |
 * | :----: | :----: | :----: | :----: |
 * | content | string、React.ReactNode | Message 文本内容 | - |
 * | duration | number | 提示持续时间(ms)，为 0 则不会自动关闭 | 2000 |
 * | icon | `success`、`fail`、`loading`、React.ReactNode | Message 图标 | - |
 * | maskClassName | string | 遮罩类名(不会覆盖组件原本样式，加 !important 可覆盖) | - |
 * | maskStyle | React.CSSProperties | 遮罩样式(会覆盖组件原本样式) | - |
 * | bodyClassName | string | 内容区域类名(不会覆盖组件原本样式，加 !important 可覆盖) | - |
 * | bodyStyle | React.CSSProperties | 内容区域样式(会覆盖组件原本样式) | - |
 * | onClose | () => void | Message 消失时触发 | - |
 */
const show = (options: string | MessageOptionsT) => {
  let ops = options as MessageOptionsT;
  if (typeof options === 'string') {
    ops = {
      content: options,
    }
  }
  ops = mergeOptions(defaultOptions, ops);
  // 判断 body 下是否含有放置 Message 列表的容器
  const dom = document.getElementById('message-body');
  if (!dom) {
    createMessageBox(ops);
  }
  // 超过最大显示数限制时，最早的消息会被自动关闭
  if (globalOptions.maxCount && globalOptions.maxCount > 0) {
    if (messageList.length + 1 > globalOptions.maxCount) {
      removeDomByID(messageList[0].id);
    }
  }
  store.addMessage({
    id: String(ops.key ?? '') || getUuiD(4),
    options: ops,
  });
};

/** 
 * 关闭消息
 * - 不传 key 关闭所有消息
 * - 传 key 关闭指定一条消息
 */
const clear = (key?: string) => {
  if (key) {
    removeDomByID(key);
    return;
  }
  messageList.forEach((message) => {
    removeDomByID(message.id);
  })
}

/** 
 * 全局配置
 * |  属性  |  类型  |  说明  |  默认值  |
 * | :----: | :----: | :----: | :----: |
 * | duration | number | 提示持续时间(ms)，为 0 则不会自动关闭 | 2000 |
 * | maxCount | number | 最大显示数, 超过限制时，最早的消息会被自动关闭 | - |
 * | onClose | () => void | Message 消失时触发 | - |
 */
const config = (options: MessageGlobalOptionsT) => {
  if (options.duration !== undefined) {
    defaultOptions.duration = options.duration;
  }
  if (options.onClose !== undefined) {
    defaultOptions.onClose = options.onClose;
  }
  Object.assign(globalOptions, options);
}

/** Message 全局提示，只支持指令式调用 */
const Message: {
  show: typeof show;
  clear: typeof clear;
  config: typeof config;
} = { show, clear, config };

export default Message;

/** 创建一个放置 Message 列表的容器 */
const createMessageBox = function (options: Pick<MessageOptionsT, 'maskClassName' | 'maskStyle'>) {
  const $div = document.createElement('div');
  $div.id = 'message-body';
  document.body.appendChild($div);
  const root = createRoot($div);
  root.render(
    <InternalMessage props={options} />
  );
};

/** 移除一个放置 Message 列表的容器 */
const removeMessageBox = function () {
  const dom = document.getElementById('message-body');
  if (dom && document.body.contains(dom)) {
    document.body.removeChild(dom);
  }
};

/** 根据 id 移除指定 message 的 DOM 节点 */
const removeDomByID = function (id: string) {
  const msgDom = document.getElementById(`message-${id}`);
  if (!msgDom) return;
  const msgDomHeight = msgDom.offsetHeight;
  const keyframes = [
    { opacity: 1, },
    { opacity: 0, marginTop: `${-msgDomHeight}px`, marginBottom: 0 }
  ];
  msgDom.animate(keyframes, 300).onfinish = function () {
    store.deleteMessage(id);
  }
};
