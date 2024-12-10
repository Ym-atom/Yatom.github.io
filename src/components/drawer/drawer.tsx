import React, { useEffect, useRef, useState } from 'react';
import closeIcon from "@/assets/close.png";
import { classNames, judgeClient, mergeOptions } from '@/utils/util';

/**
 * TODO:
 * bug: 多层抽屉时 document.body 的滑动禁用逻辑有问题
 * bug: 多类名样式优先级问题
 */

type DrawerOptionsT = {
  /** 抽屉是否显示 */
  visible?: boolean;
  /** 指定弹出位置 */
  position?: 'bottom' | 'top' | 'left' | 'right';
  /** 标题 */
  title?: React.ReactNode;
  /** 内容 */
  children?: React.ReactNode;
  /** 是否显示右上角的关闭按钮 */
  closable?: boolean;
  /** 自定义关闭图标 */
  closeIcon?: React.ReactNode;
  /** 是否展示遮罩 */
  mask?: boolean;
  /** 是否允许背景点击 */
  maskClosable?: boolean;
  /** 抽屉不可见时卸载内容 */
  destroyOnClose?: boolean;
  /** 遮罩类名，不会覆盖组件原本样式，加 !important 可覆盖 */
  maskClassName?: string;
  /** 遮罩样式，会覆盖组件原本样式 */
  maskStyle?: React.CSSProperties;
  /** 内容区域类名，不会覆盖组件原本样式，加 !important 可覆盖 */
  bodyClassName?: string;
  /** 内容区域样式，会覆盖组件原本样式 */
  bodyStyle?: React.CSSProperties;
  /** 关闭时触发 */
  onClose?: () => void;
};

/** 默认配置 */
const defaultOptions = {
  visible: false,
  position: judgeClient() === 'PC' ? 'right' : 'bottom',
  closable: false,
  mask: true,
  maskClosable: true,
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

/** Drawer 抽屉，配置项说明
 * |  属性  |  类型  |  说明  |  默认值  |
 * | :----: | :----: | :----: | :----: |
 * | visible | boolean | 抽屉是否显示 | false |
 * | position | 'bottom' | 'top' | 'left' | 'right' | 指定弹出位置 | 移动端是'bottom'，PC 端是'right' |
 * | title | React.ReactNode | 标题 | `提示` |
 * | titleCentered | boolean | 标题是否居中 | true |
 * | children | React.ReactNode | 内容 | - |
 * | closable | boolean | 是否显示右上角的关闭按钮 | true |
 * | closeIcon | React.ReactNode | 自定义关闭图标 | - |
 * | mask | boolean | 是否展示遮罩 | true |
 * | maskClickable | boolean | 是否允许背景点击 | true |
 * | destroyOnClose | boolean | 抽屉不可见时卸载内容 | false |
 * | maskClassName | string | 遮罩类名(不会覆盖组件原本样式，加 !important 可覆盖) | - |
 * | maskStyle | React.CSSProperties | 遮罩样式(会覆盖组件原本样式) | - |
 * | bodyClassName | string | 内容区域类名(不会覆盖组件原本样式，加 !important 可覆盖) | - |
 * | bodyStyle | React.CSSProperties | 内容区域样式(会覆盖组件原本样式) | - |
 * | onClose | () => void | 关闭时触发 | - |
 */
const Drawer: React.FC<DrawerOptionsT> = (props) => {
  const [firstLoaded, setFirstLoaded] = useState(false); // 是否第一次加载了
  const [action, setAction] = useState<'appear' | 'disappear'>('appear');
  const options: DrawerOptionsT = mergeOptions(defaultOptions, configOptions, props);
  const drawerMaskRef = useRef(null);
  useEffect(() => {
    if (!drawerMaskRef.current) return;
    const maskDom = drawerMaskRef.current as HTMLDivElement;
    if (options.visible) {
      setAction('appear');
      document.body.style.overflow = 'hidden';
      maskDom.style.visibility = 'inherit';
      maskDom.animate(appearAnimation, animationTime);
    } else {
      setAction('disappear');
      maskDom.animate(disappearAnimation, animationTime).onfinish = () => {
        document.body.style.overflow = 'auto';
        maskDom.style.visibility = 'hidden';
        if (options.destroyOnClose) {
          maskDom.remove(); // 抽屉不可见时卸载内容
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
    <div
      ref={drawerMaskRef}
      className={classNames('drawer-mask', options.maskClassName)}
      style={{
        ...options.mask ? {} : { background: 'transparent' },
        ...options.maskStyle,
      }}
      onClick={() => { options.maskClosable ? options.onClose?.() : () => { } }}
    >
      <div
        className={classNames('drawer', `drawer-${options.position}`, `drawer-${options.position}-${action}`, options.bodyClassName)}
        style={{
          // @ts-ignore
          '--top-line-height': (props.title || props.closable) ? '50px' : '0px',
          ...options.bodyStyle,
        }}
        onClick={(e) => { e.stopPropagation() }}
      >
        {/* 标题栏 */}
        <div
          className={'drawer-top-line'}
          style={{ borderWidth: (props.title || props.closable) ? '1px' : '0px', }}
        >
          {/* 标题栏 */}
          <div className={'drawer-title'}>
            {options.title}
          </div>
          {/* 右上角关闭按钮 */}
          {options.closable && (
            options.closeIcon ? options.closeIcon : (
              <div className={'drawer-close-icon-box'} onClick={() => { options.onClose?.() }}>
                <img className={'drawer-close-icon'} src={closeIcon} />
              </div>
            )
          )}
        </div>
        {/* 内容 */}
        <div className={'drawer-content'}>
          <div className={'drawer-custom-content'}>{options.children}</div>
        </div>
      </div>
    </div>
  )
};

export default Drawer;