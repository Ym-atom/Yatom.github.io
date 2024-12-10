import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import closeIcon from "@/assets/close.png";
import { classNames, mergeOptions } from '@/utils/util';
import LoadingIcon from '../loading-icon/loading-icon';

type ModalOptionsT = {
  /** 弹窗是否显示 */
  visible?: boolean;
  /** 是否展示遮罩 */
  mask?: boolean;
  /** 是否允许背景点击 */
  maskClosable?: boolean;
  /** 弹窗宽度 */
  width?: number | string;
  /** 是否显示右上角的关闭按钮 */
  closable?: boolean;
  /** 自定义关闭图标 */
  closeIcon?: React.ReactNode;
  /** 标题 */
  title?: React.ReactNode;
  /** 标题是否居中 */
  titleCentered?: boolean;
  /** 弹窗内容 */
  children?: React.ReactNode;
  /** 确认按钮文字 */
  okText?: string;
  /** 确认按钮 loading */
  confirmLoading?: boolean;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 底部按钮区域，当不需要默认底部按钮时，可以设为 footer={null} */
  footer?: React.ReactNode;
  /** 底部按钮是否居中，默认居右 */
  footerCentered?: boolean;
  /** 弹窗不可见时卸载内容 */
  destroyOnClose?: boolean;
  /** 点击确定回调 */
  onOk?: () => void;
  /** 点击遮罩层或右上角叉或取消按钮的回调 */
  onCancel?: () => void;
  /** 关闭时触发 */
  onClose?: () => void;
};

type ModalFuncOptionsT = {
  /** 是否展示遮罩 */
  mask?: boolean;
  /** 是否允许背景点击 */
  maskClosable?: boolean;
  /** 弹窗宽度 */
  width?: number | string;
  /** 是否显示右上角的关闭按钮 */
  closable?: boolean;
  /** 自定义关闭图标 */
  closeIcon?: React.ReactNode;
  /** 标题 */
  title?: React.ReactNode;
  /** 标题是否居中 */
  titleCentered?: boolean;
  /** 弹窗内容 */
  content?: React.ReactNode;
  /** 确认按钮文字 */
  okText?: string;
  /** 确认按钮 loading */
  confirmLoading?: boolean;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 底部按钮区域，当不需要默认底部按钮时，可以设为 footer: null */
  footer?: React.ReactNode;
  /** 底部按钮是否居中，默认居右 */
  footerCentered?: boolean;
  /** 点击确定回调 */
  onOk?: () => void;
  /** 点击遮罩层或右上角叉或取消按钮的回调 */
  onCancel?: () => void;
  /** 关闭时触发 */
  onClose?: () => void;
};

/** 默认配置 */
const defaultOptions = {
  visible: false,
  mask: true,
  maskClosable: true,
  titleCentered: true,
  okText: '确定',
  confirmLoading: false,
  cancelText: '取消',
  footerCentered: false,
  closable: true,
  destroyOnClose: false,
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

/** 内部 Modal 组件 */
const InternalModal: React.FC<ModalOptionsT | ModalFuncOptionsT> = (props) => {
  let content: React.ReactNode;
  if ('children' in props) content = props.children;
  if ('content' in props) content = props.content;
  return (
    <div
      className={'modal-mask'}
      style={props.mask ? {} : { background: 'transparent' }}
      onClick={() => { props.maskClosable ? props.onCancel?.() : () => { } }}
    >
      <div
        className={'modal'}
        style={props.width ? { width: typeof props.width === 'number' ? `${props.width}px` : props.width } : {}}
        onClick={(e) => { e.stopPropagation() }}
      >
        {/* 标题 */}
        {props.title && (
          <div
            className={'modal-title'}
            style={{ textAlign: props.titleCentered ? 'center' : 'left' }}
          >{props.title}</div>
        )}
        {/* 右上角关闭按钮 */}
        {props.closable && (
          props.closeIcon ? props.closeIcon : (
            <div className={'modal-close-icon-box'} onClick={() => { props.onClose?.() }}>
              <img className={'modal-close-icon'} src={closeIcon} />
            </div>
          )
        )}
        {/* 内容 */}
        <div className={'modal-content'}>
          {content}
        </div>
        {/* 底部内容 */}
        <div
          className={'modal-footer'}
          style={{ justifyContent: props.footerCentered ? 'center' : 'flex-end' }}
        >
          {props.footer === undefined ? (
            <>
              <div
                className={classNames('modal-footer-cancel-button', 'button')}
                onClick={() => { props.onCancel?.() }}
              >
                {props.cancelText}
              </div>
              {props.confirmLoading ? (
                <div
                  className={classNames('modal-footer-ok-button', 'modal-footer-ok-button-disabled', 'primary-button')}
                >
                  <LoadingIcon className={'modal-footer-ok-button-loading'} size={20} />
                  <span>{props.okText}</span>
                </div>
              ) : (
                <div
                  className={classNames('modal-footer-ok-button', 'primary-button')}
                  onClick={() => { props.onOk?.() }}
                >
                  <span>{props.okText}</span>
                </div>
              )}
            </>
          ) : props.footer}
        </div>
      </div>
    </div>
  )
}

/** Modal 弹窗，声明式调用配置项说明
 * |  属性  |  类型  |  说明  |  默认值  |
 * | :----: | :----: | :----: | :----: |
 * | visible | boolean | 弹窗是否显示 | false |
 * | title | React.ReactNode | 标题 | `提示` |
 * | titleCentered | boolean | 标题是否居中 | true |
 * | children | React.ReactNode | 内容 | - |
 * | okText | string | 确认按钮文字 | `确定` |
 * | confirmLoading | boolean | 确认按钮 loading | false |
 * | cancelText | string | 取消按钮文字 | `取消` |
 * | footer | React.ReactNode | 底部按钮区域，当不需要默认底部按钮时，可以设为 footer={null} | - |
 * | footerCentered | boolean | 底部按钮是否居中，默认居右  | false |
 * | closable | boolean | 是否显示右上角的关闭按钮 | true |
 * | closeIcon | React.ReactNode | 自定义关闭图标 | - |
 * | mask | boolean | 是否展示遮罩 | true |
 * | maskClickable | boolean | 是否允许背景点击 | true |
 * | width | number、string | 弹窗宽度、默认单位 px | 60vw |
 * | destroyOnClose | boolean | 弹窗不可见时卸载内容 | false |
 * | onOk | () => void | 点击确定回调 | - |
 * | onCancel | () => void | 点击遮罩层或右上角叉或取消按钮的回调 | - |
 * | onClose | () => void | 关闭时触发 | - |
 */
const Modal: React.FC<ModalOptionsT> & {
  show: typeof show;
  clear: typeof clear;
  config: typeof config;
} = (props) => {
  const options = mergeOptions(defaultOptions, configOptions, props);
  const [firstLoaded, setFirstLoaded] = useState(false); // 是否第一次加载了
  const ref$ = useRef(null);
  useEffect(() => {
    if (!ref$.current) return;
    const dom = ref$.current as HTMLDivElement;
    if (options.visible) {
      document.body.style.overflow = 'hidden';
      dom.style.visibility = 'inherit';
      dom.animate(appearAnimation, animationTime);
    } else {
      dom.animate(disappearAnimation, animationTime).onfinish = () => {
        document.body.style.overflow = 'auto';
        dom.style.visibility = 'hidden';
        if (options.destroyOnClose) {
          dom.remove(); // 弹窗不可见时卸载内容
        }
      };
    }
  }, [options.visible]);
  useEffect(() => {
    if (!firstLoaded && options.visible) {
      setFirstLoaded(true);
    }
  }, [options.visible])
  if (!firstLoaded && !options.visible) {
    return null;
  }
  return (
    <div ref={ref$}>
      <InternalModal {...options} />
    </div>
  )
};

/** Modal 弹窗，指令式调用配置项说明
 * |  属性  |  类型  |  说明  |  默认值  |
 * | :----: | :----: | :----: | :----: |
 * | title | React.ReactNode | 标题 | `提示` |
 * | titleCentered | boolean | 标题是否居中 | true |
 * | content | React.ReactNode | 内容 | - |
 * | okText | string | 确认按钮文字 | `确定` |
 * | confirmLoading | boolean | 确认按钮 loading | false |
 * | cancelText | string | 取消按钮文字 | `取消` |
 * | footer | React.ReactNode | 底部按钮区域，当不需要默认底部按钮时，可以设为 footer: null | - |
 * | footerCentered | boolean | 底部按钮是否居中，默认居右  | false |
 * | closable | boolean | 是否显示右上角的关闭按钮 | true |
 * | closeIcon | React.ReactNode | 自定义关闭图标 | - |
 * | mask | boolean | 是否展示遮罩 | true |
 * | maskClickable | boolean | 是否允许背景点击 | true |
 * | width | number、string | 弹窗宽度、默认单位 px | 60vw |
 * | onOk | () => void | 点击确定回调 | - |
 * | onCancel | () => void | 点击遮罩层或右上角叉或取消按钮的回调 | - |
 * | onClose | () => void | 关闭时触发 | - |
 */
const show = (props: ModalFuncOptionsT) => {
  const options = mergeOptions(defaultOptions, configOptions, props);
  const close = renderModalInBody(
    <InternalModal
      {...{
        ...options,
        onClose: () => {
          close();
          options.onClose?.();
        },
        onCancel: () => {
          close();
          options.onCancel?.();
          options.onClose?.();
        },
      }}
    />
  );
};

/** 关闭当前显示中的 Modal */
const clear = () => {
  removeModalInBody();
}

/** 全局配置 */
const config = (options: ModalFuncOptionsT) => {
  Object.assign(configOptions, options);
}

Modal.show = show;
Modal.clear = clear;
Modal.config = config;

export default Modal;

/** 将 Modal 组件渲染上去 */
const renderModalInBody = function (component: JSX.Element) {
  document.body.style.overflow = 'hidden';
  const modalDom = document.createElement('div');
  modalDom.id = 'modal-body';
  document.body.appendChild(modalDom);
  const root = createRoot(modalDom);
  root.render(component);
  modalDom.animate(appearAnimation, animationTime);
  return () => {
    modalDom.animate(disappearAnimation, animationTime).onfinish = function () {
      document.body.style.overflow = 'auto';
      root.unmount();
      // 容错处理
      if (document.body.contains(modalDom)) document.body.removeChild(modalDom);
    };
  };
}

/** 移除当前的 Modal 组件 */
const removeModalInBody = function () {
  document.body.style.overflow = 'auto';
  const modalDom = document.getElementById('modal-body');
  if (modalDom && document.body.contains(modalDom)) {
    modalDom.animate(disappearAnimation, animationTime).onfinish = function () {
      document.body.removeChild(modalDom);
    };
  }
}