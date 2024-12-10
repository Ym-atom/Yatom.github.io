import React, { useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import successIcon from "@/assets/success.png";
import failIcon from "@/assets/fail.png";
import { classNames, mergeOptions } from '@/utils/util';
import LoadingIcon from '../loading-icon/loading-icon';

type ToastOptionsT = {
  /** Toast 文本内容 */
  content: React.ReactNode;
  /** 提示持续时间（ms），默认 2000，若为 0 则不会自动关闭 */
  duration?: number;
  /** Toast 图标 */
  icon?: React.ReactNode;
  /** 图标和文字布局，仅在参数 icon 合法时有效 */
  direction?: 'row' | 'column';
  /** 是否允许背景点击，默认为 true */
  maskClickable?: boolean;
  /** 遮罩类名，不会覆盖组件原本样式，加 !important 可覆盖 */
  maskClassName?: string;
  /** 遮罩样式，会覆盖组件原本样式 */
  maskStyle?: React.CSSProperties;
  /** 内容区域类名，不会覆盖组件原本样式，加 !important 可覆盖 */
  bodyClassName?: string;
  /** 内容区域样式，会覆盖组件原本样式 */
  bodyStyle?: React.CSSProperties;
  /** Toast 消失时触发 */
  onClose?: () => void;
};

/** 默认配置 */
const defaultOptions = {
  duration: 2000,
  maskClickable: true,
  direction: 'column',
}

/** 全局配置 */
const configOptions = {};

/** 动画时间，单位（ms） */
const animationTime = 300;

/** 淡入动画效果 */
const appearAnimation = [
  { opacity: 0 },
  { opacity: 1 }
];

/** 淡出动画效果 */
const disappearAnimation = [
  { opacity: 1 },
  { opacity: 0 }
];

/** 内部 Toast 组件 */
const InternalToast: React.FC<ToastOptionsT> = (props) => {
  useEffect(() => {
    if (props.duration !== 0) {
      setTimeout(() => {
        props.onClose?.();
      }, props.duration);
    }
  }, []);
  const ShowIcon = useMemo(() => {
    if (!props.icon || ['number', 'boolean'].includes(typeof props.icon)) {
      return null;
    }
    switch (props.icon) {
      case 'success':
        return <img className={'toast-icon'} src={successIcon} />;
      case 'fail':
        return <img className={'toast-icon'} src={failIcon} />;
      case 'loading':
        return <LoadingIcon className={'toast-icon'} />;
      default:
        return typeof props.icon === 'string' ? null : <>{props.icon}</>;
    }
  }, [props]);
  return (
    <div
      className={classNames('toast-mask', props.maskClassName)}
      style={{
        pointerEvents: props.maskClickable ? 'none' : 'auto',
        ...props.maskStyle,
      }}
    >
      <div
        className={classNames(
          'toast',
          ShowIcon ?
            props.direction === 'column' ? 'toast-with-icon-column' : 'toast-with-icon-row'
            :
            '',
          props.bodyClassName,
        )}
        style={{
          flexDirection: props.direction,
          ...props.bodyStyle,
        }}
      >
        {ShowIcon && (
          <div className={'toast-icon-box'}>{ShowIcon}</div>
        )}
        {typeof props.content === 'string' ? (
          <div className={'toast-text'}>{props.content}</div>
        ) : (
          props.content
        )}
      </div>
    </div>
  );
};

/** 
 * options 配置项说明
 * |  属性  |  类型  |  说明  |  默认值  |
 * | :----: | :----: | :----: | :----: |
 * | content | string、React.ReactNode | Toast 文本内容 | - |
 * | duration | number | 提示持续时间(ms)，为 0 则不会自动关闭 | 2000 |
 * | icon | `success`、`fail`、`loading`、React.ReactNode | Toast 图标 | - |
 * | direction | `row`、`column` | 图标和文字布局，仅在参数 `icon` 合法时有效 | `column` |
 * | maskClickable | boolean | 是否允许背景点击 | true |
 * | maskClassName | string | 遮罩类名(不会覆盖组件原本样式，加 !important 可覆盖) | - |
 * | maskStyle | React.CSSProperties | 遮罩样式(会覆盖组件原本样式) | - |
 * | bodyClassName | string | 内容区域类名(不会覆盖组件原本样式，加 !important 可覆盖) | - |
 * | bodyStyle | React.CSSProperties | 内容区域样式(会覆盖组件原本样式) | - |
 * | onClose | () => void | Toast 消失时触发 | - |
 */
const show = (options: string | ToastOptionsT) => {
  let ops = options as ToastOptionsT;
  if (typeof options === 'string') {
    ops = {
      content: options,
    }
  }
  ops = mergeOptions(defaultOptions, configOptions, ops);
  const close = renderToastInBody(
    <InternalToast
      {...{
        ...ops,
        onClose: () => {
          close();
          ops.onClose?.();
        },
      }}
    />
  );
};

/** 关闭当前显示中的 Toast */
const clear = () => {
  removeToastInBody();
}

/** 全局配置 */
const config = (options: Pick<ToastOptionsT, 'duration' | 'icon' | 'maskClickable' | 'onClose'>) => {
  Object.assign(configOptions, options);
}

/** Toast 轻提示，只支持指令式调用 */
const Toast: {
  show: typeof show;
  clear: typeof clear;
  config: typeof config;
} = { show, clear, config };

export default Toast;


/** 渲染一个 Toast 组件到 body 下面 */
const renderToastInBody = function (component: JSX.Element) {
  const nextToastDiv = document.createElement('div');
  nextToastDiv.id = 'toast-body';
  const presentToastDiv = document.getElementById('toast-body');
  if (presentToastDiv && document.body.contains(presentToastDiv)) {
    document.body.replaceChild(nextToastDiv, presentToastDiv);
  } else {
    document.body.appendChild(nextToastDiv);
    nextToastDiv.animate(appearAnimation, animationTime);
  }
  const root = createRoot(nextToastDiv);
  root.render(component);
  return () => {
    nextToastDiv.animate(disappearAnimation, animationTime).onfinish = function () {
      root.unmount();
      // 容错处理
      if (document.body.contains(nextToastDiv)) document.body.removeChild(nextToastDiv);
    };
  };
}

/** 移除当前的 Toast 组件 */
const removeToastInBody = function () {
  const presentToastDiv = document.getElementById('toast-body');
  if (presentToastDiv && document.body.contains(presentToastDiv)) {
    presentToastDiv.animate(disappearAnimation, animationTime).onfinish = function () {
      document.body.removeChild(presentToastDiv);
    };
  }
}