import React, { useEffect } from 'react';

const listeners = [
  "DOMContentLoaded",
  "WeixinJSBridgeReady",
  "YixinJSBridgeReady",
  "touchstart",
  "click",
]

/** bg-music 组件 */
const BgMusic: React.FC<{}> = (props) => {
  const audioAutoPlay = function (id: string) {
    // @ts-ignore
    const audio: HTMLAudioElement = document.getElementById(id);
    if (!audio) return;
    const play = function () {
      audio.play().then(() => {
        console.log('成功播放背景音乐');
        listeners.forEach((listener) => {
          document.removeEventListener(listener, play);
        })
      });
    };
    audio.play();
    listeners.forEach((listener) => {
      document.addEventListener(listener, play);
    })
  }
  useEffect(() => {
    const audioDom = document.createElement('audio');
    audioDom.src = "https://dldir1.qq.com/INO/xiaoe/inline/kending.mp3"; // 背景音乐链接
    audioDom.id = "bg-music";
    audioDom.style.display = "none";
    audioDom.autoplay = true;
    audioDom.loop = true;
    document.body.appendChild(audioDom);
    audioAutoPlay("bg-music");
  }, [])
  return (
    <></>
  );
};
export default BgMusic;