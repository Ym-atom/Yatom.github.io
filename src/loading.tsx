import React from 'react';

/** 定义懒加载过程中要显示的加载动画。 */
const Loading: React.FC<{}> = (props) => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000',
        fontSize: '16px',
      }}
    >
      加载中...
    </div>
  );
};
export default Loading;
