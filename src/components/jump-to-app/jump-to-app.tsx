import CallApp from 'callapp-lib';
import React, { useEffect, useState } from 'react';
import { getParamsByUrl, isWeixin, judgeClient } from '@/utils/util';

/** 
 * 唤端组件
 * - 微信内唤端文档：https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_Open_Tag.html#22
 * - QQ 内唤端方案：https://github.com/suanmei/callapp-lib
 */
const JumpBtn: React.FC<{
  iosUrl: string;
  androidUrl: string;
  height: string;
  width?: string;
  children?: React.ReactNode;
}> = (props) => {
  const isWX = isWeixin();
  const system = judgeClient();
  const url = system === 'IOS' ? props.iosUrl : props.androidUrl;
  const appStoreUrl = ''; // APP 的 App Store 链接
  const officialSite = ''; //  APP 的 H5 官网
  // 针对微信客户端，采用微信原生标签去实现
  const [wxready, setWxready] = useState(false);
  useEffect(() => {
    // @ts-ignore
    wx.ready(() => {
      setWxready(true);
      let btn = document.getElementById('launch-btn');
      const interval = setInterval(() => {
        btn = document.getElementById('launch-btn');
        if (btn) {
          btn.addEventListener('launch', function (e) {
            console.log('success');
          });
          btn.addEventListener('error', function (e) {
            console.log('fail', e);
            window.location.href = system === 'IOS' ? appStoreUrl : officialSite;
          });
          clearInterval(interval);
        }
      }, 100);
    });
  }, []);
  // 针对非微信客户端（包括QQ、浏览器）
  const { protocol, path, params } = getParamsByUrl(url);
  const options = {
    scheme: {
      protocol: protocol, // 客户端路由
    },
    appstore: appStoreUrl, // App Store 链接
    fallback: officialSite, // 唤端失败后跳转的链接
    logFunc: () => {
      // 唤端埋点
    },
  };
  const callLib = new CallApp(options);
  const jump = () => {
    if (isWX) return;
    if (path && params) {
      callLib.open({
        path: path,
        param: params, // 打开特定页面带参数
      });
    } else if (path && !params) {
      callLib.open({
        path: path, // 打开特定页面不带参数
      });
    } else {
      callLib.open({ path: '' }); // 不打开特定页面
    }
  };
  return (
    <div style={{ position: 'relative', width: '100%' }} onClick={jump}>
      {props.children}
      {isWX && wxready && (
        // @ts-ignore
        <wx-open-launch-app
          id="launch-btn"
          appid="" // APP 标识 ID
          extinfo={url}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            zIndex: 99,
            top: 0,
          }}
        >
          <script type="text/wxtag-template">
            <div
              style={{
                width: props.width || '100vw',
                height: props.height || '100%',
              }}
            >
              &nbsp;
            </div>
          </script>
          {/* @ts-ignore */}
        </wx-open-launch-app>
      )}
    </div>
  );
};
export default JumpBtn;
