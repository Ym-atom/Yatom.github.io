import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { classNames, getUuiD, judgeClient, mergeOptions } from '@/utils/util';

type placementType = 'top' | 'top-left' | 'top-right' | 'right' | 'right-top' | 'right-bottom' | 'bottom' | 'bottom-left' | 'bottom-right' | 'left' | 'left-top' | 'left-bottom';

type PopoverOptionsT = {
  /** 触发 popover 的元素 */
  children?: React.ReactElement;
  /** 弹出内容 */
  content?: React.ReactNode;
  /** 触发行为 */
  trigger?: 'click' | 'hover';
  /** 气泡框位置 */
  placement?: placementType;
  /** 默认是否显隐 */
  defaultVisible?: boolean;
  /** 受控模式下，是否展示弹出内容 */
  visible?: boolean;
  /** 隐藏时，是否销毁 popover 内容 */
  destroyOnHide?: boolean;
  /** popover 文本颜色，默认值 #000 */
  textColor?: string;
  /** popover 背景颜色，默认值 #fff */
  bodyBgColor?: string;
  /** 显示隐藏的回调 */
  onVisibleChange?: (visible: boolean) => void;
};

/** 默认配置 */
const defaultOptions = {
  placement: 'top',
  defaultVisible: false,
  destroyOnHide: false,
  textColor: '#000',
  bodyBgColor: '#fff',
}

/** 全局配置 */
const configOptions = {};

/** 动画时间，单位（ms） */
const animationTime = 150;

/** 淡入动画效果 */
const appearAnimation = [
  { width: 0, height: 0 },
  {}
];

/** 淡出动画效果 */
const disappearAnimation = [
  {},
  { width: 0, height: 0 }
];

/** 内部 Popover 组件 */
const InternalPopover: React.FC<{
  options: PopoverOptionsT;
  childRect: DOMRect;
}> = ({ options, childRect }) => {
  const popoverBodyRef = useRef(null);
  const [action, setAction] = useState<'appear' | 'disappear'>('appear');
  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);
  const arrowPosition = options.placement?.split('-')[1]; // 箭头偏移位置
  useEffect(() => {
    if (!popoverBodyRef.current) return;
    const popoverBodyDom: HTMLDivElement = popoverBodyRef.current;
    const { top, left } = getPopoverCoordinate({
      placement: options.placement,
      childRect,
      popoverRect: {
        width: popoverBodyDom.getBoundingClientRect().width,
        height: popoverBodyDom.getBoundingClientRect().height,
      }
    });
    setTop(top);
    setLeft(left);
  }, [])
  return (
    <div
      ref={popoverBodyRef}
      className={
        classNames(
          'popover-body',
          `popover-body-${options.placement}`,
          `popover-body-${action}`
        )}
      style={{
        top: top,
        left: left,
        // @ts-ignore
        '--text-color': options.textColor,
        '--body-bg-color': options.bodyBgColor,
      }}
    >
      <div
        className={classNames('popover-inner')}
        onClick={(e) => { e.stopPropagation() }}
      >
        <div className={'popover-inner-content'}>{options.content}</div>
      </div>
      <div className={
        classNames(
          'popover-arrow',
          `popover-arrow-${getArrowDirection(options.placement)}`,
          arrowPosition ? `popover-arrow-position-${arrowPosition}` : ''
        )}
      ></div>
    </div>
  );
};

/** Popover 气泡卡片，配置项说明
 * |  属性  |  类型  |  说明  |  默认值  |
 * | :----: | :----: | :----: | :----: |
 */
const Popover: React.FC<PopoverOptionsT> = (props) => {
  const options: PopoverOptionsT = mergeOptions(defaultOptions, configOptions, props);
  const childrenBoxRef = useRef(null);
  let isShowNow = options.defaultVisible;
  const [id] = useState(getUuiD(4));
  const [childrenDom, setChildrenDom] = useState<HTMLElement>();
  useEffect(() => {
    if (childrenBoxRef.current) {
      const childrenBoxDom: HTMLDivElement = childrenBoxRef.current;
      // @ts-ignore
      setChildrenDom(childrenBoxDom.children[0]);
    }
  }, [childrenBoxRef.current]);
  useEffect(() => {
    if (childrenDom) {
      if (options.defaultVisible) {
        showPopover(); // 默认显示
      }
      if (options.trigger === 'click' && options.visible === undefined) {
        childrenDom.onclick = () => {
          isShowNow ? hidePopover() : showPopover();
          isShowNow = !isShowNow;
        };
      }
      if (options.trigger === 'hover') {
        childrenDom.onmouseenter = showPopover;
        childrenDom.onmouseleave = hidePopover;
      }
    }
  }, [childrenDom]);
  useEffect(() => {
    if (childrenDom && typeof options.visible === 'boolean') {
      options.visible ? showPopover() : hidePopover();
    }
  }, [options.visible])
  /** 显示 Popover */
  const showPopover = function () {
    if (!childrenDom) return;
    setTimeout(() => {
      const domRect: DOMRect = childrenDom.getBoundingClientRect();
      showPopoverInBody({
        component:
          <InternalPopover
            options={options}
            childRect={domRect}
          />,
        id: id,
      });
    }, 66);
  }
  /** 隐藏 Popover */
  const hidePopover = function () {
    setTimeout(() => {
      hidePopoverInBody({
        id: id,
        destroyOnHide: options.destroyOnHide,
      });
    }, 66);
  }
  if (!options.children) {
    return null;
  }
  return (
    <div
      ref={childrenBoxRef}
      className={'popover-children-box'}
    >
      {options.children}
    </div>
  )
};

export default Popover;

/** 
 * 【获取 Popover 的坐标】
 * @param placement 气泡框位置
 * @param childRect props.children 矩形相关信息
 * @param popoverRect popover 矩形相关信息
 */
const getPopoverCoordinate = function (props: {
  placement: placementType | undefined;
  childRect: DOMRect;
  popoverRect: { width: number, height: number };
}) {
  const placement = props.placement || defaultOptions.placement;
  const map: { [x: string]: { top: number; left: number } } = {
    "top": {
      top: props.childRect.top - props.popoverRect.height,
      left: props.childRect.left + props.childRect.width / 2 - props.popoverRect.width / 2
    },
    "top-left": {
      top: props.childRect.top - props.popoverRect.height,
      left: props.childRect.right - props.popoverRect.width,
    },
    "top-right": {
      top: props.childRect.top - props.popoverRect.height,
      left: props.childRect.left,
    },
    "right": {
      top: props.childRect.top + props.childRect.height / 2 - props.popoverRect.height / 2,
      left: props.childRect.right,
    },
    "right-top": {
      top: props.childRect.bottom - props.popoverRect.height,
      left: props.childRect.right,
    },
    "right-bottom": {
      top: props.childRect.top,
      left: props.childRect.right,
    },
    "bottom": {
      top: props.childRect.bottom,
      left: props.childRect.left + props.childRect.width / 2 - props.popoverRect.width / 2
    },
    "bottom-left": {
      top: props.childRect.bottom,
      left: props.childRect.right - props.popoverRect.width,
    },
    "bottom-right": {
      top: props.childRect.bottom,
      left: props.childRect.left,
    },
    "left": {
      top: props.childRect.top + props.childRect.height / 2 - props.popoverRect.height / 2,
      left: props.childRect.left - props.popoverRect.width,
    },
    "left-top": {
      top: props.childRect.bottom - props.popoverRect.height,
      left: props.childRect.left - props.popoverRect.width,
    },
    "left-bottom": {
      top: props.childRect.top,
      left: props.childRect.left - props.popoverRect.width,
    },
  }
  return map[placement];
}

/**
 * 【获取箭头 arrow 指向】
 * @param placement 气泡框位置
 */
const getArrowDirection = function (placement: placementType | undefined) {
  const pm = (placement || defaultOptions.placement).split('-')[0]
  const map: { [x: string]: string } = {
    top: "down",
    bottom: "up",
    left: "right",
    right: "left",
  }
  return map[pm];
}

/** 
 * 【显示 Popover】
 * 如果不存在这个节点，将 Popover 组件渲染到 body 里
 * @param component 气泡弹出层组件
 * @param id 气泡弹出层组件的唯一标识
 */
const showPopoverInBody = function (props: {
  component: JSX.Element;
  id: string;
}) {
  const popoverDom = document.getElementById(`popover-${props.id}`);
  if (popoverDom) {
    popoverDom.style.visibility = 'initial';
    // popoverDom.animate(appearAnimation, animationTime);
    return;
  }
  const newPopoverDom = document.createElement('div');
  newPopoverDom.id = `popover-${props.id}`;
  document.body.appendChild(newPopoverDom);

  const root = createRoot(newPopoverDom);
  root.render(props.component);
  // newPopoverDom.animate(appearAnimation, animationTime);
}

/** 
 * 【隐藏 Popover】
 * 如果设置 destroyOnHide 为 true，则移除当前的 Popover 组件
 * @param id 气泡弹出层组件的唯一标识
 * @param destroyOnHide 隐藏时，是否销毁 popover 内容
 */
const hidePopoverInBody = function (props: {
  id: string;
  destroyOnHide: boolean | undefined;
}) {
  const popoverDom = document.getElementById(`popover-${props.id}`);
  if (popoverDom && document.body.contains(popoverDom)) {
    popoverDom.animate(disappearAnimation, animationTime).onfinish = function () {
      popoverDom.style.visibility = 'hidden';
      if (props.destroyOnHide) {
        document.body.removeChild(popoverDom);
      }
    };
  }
}
