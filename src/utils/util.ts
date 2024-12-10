import { HeroInfoT } from "@/types/types";
import { heroInfoList } from "@/config/heroIdList";

/** 判断客户端 */
export function judgeClient() {
  const browser = {
    versions: (function () {
      let u = navigator.userAgent;
      return {
        // 移动终端浏览器版本信息
        trident: u.indexOf('Trident') > -1, // IE 内核
        presto: u.indexOf('Presto') > -1, // opera 内核
        webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
        mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios 终端
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android 终端或者 uc 浏览器
        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为 iPhone 或者 QQ HD 浏览器
        iPad: u.indexOf('iPad') > -1, //是否 iPad
        webApp: u.indexOf('Safari') == -1, //是否 web 应该程序，没有头部与底部
      };
    })(),
    language: navigator.language.toLowerCase(),
  };
  if (
    browser.versions.ios ||
    browser.versions.iPhone ||
    browser.versions.iPad
  ) {
    return 'IOS';
  } else if (browser.versions.android) {
    return 'Android';
  } else {
    return 'PC';
  }
};

/** 判断当前打开 H5 的是不是微信端 */
export function isWeixin() {
  var ua = window.navigator.userAgent.toLowerCase();
  // @ts-ignore
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
}

/**
 * 生成一个用不重复的ID
 * @param { Number } randomLength ID 字符长度
 */
export function getUuiD(randomLength: number) {
  return Number(Math.random().toString().slice(2) + Date.now())
    .toString(36)
    .slice(0, randomLength);
}

/** 合并类名 */
export function classNames(...names: any[]) {
  return names.filter((name) => ![undefined, null, false, "", 0].includes(name)).join(' ');
}

/** 合并 options 参数 */
export function mergeOptions(...options: any) {
  let res: any = {};
  options.forEach((option: any) => {
    res = Object.assign(res, option);
  })
  return res;
}

/** 等待一段时间 */
export const sleep = (time: number) => new Promise(resolve => setTimeout(resolve, time));

/** 拆分客户端路由url */
export function getParamsByUrl(url: string): {
  protocol: string;
  path?: string;
  params?: { [x: string]: string };
} {
  let idx1 = url.indexOf(':');
  // 仅唤起 APP，不打开特定页面
  if (idx1 < 0) {
    return { protocol: url };
  }
  let idx2 = url.indexOf('?');
  let s1 = url.slice(0, idx1);
  let s2 = url.slice(idx1 + 3, idx2);
  // 打开特定页面带参数
  if (idx2 > 0) {
    let s3 = url.slice(idx2 + 1);
    let arr = s3.split('&');
    let obj: { [x: string]: string } = {};
    arr.forEach((e: string) => {
      obj[e.split('=')[0]] = e.split('=')[1];
    });
    return {
      protocol: s1,
      path: s2,
      params: obj,
    };
  }
  // 打开特定页面不带参数
  return {
    protocol: s1,
    path: s2,
  };
}

/** 
 * 节流函数
 * @param fn 节流执行的函数
 * @param delay 时间间隔，单位ms
 */
export const throttle = function (fn: () => void, delay: number) {
  let flag = true
  return function () {
    if (!flag) {
      //休息时间 暂不接客
      return false
    }
    // 工作时间，执行函数并且在间隔期内把状态位设为无效
    flag = false
    setTimeout(() => {
      fn()
      flag = true;
    }, delay)
  }
}

/** 模拟网络请求，获取英雄信息列表 */
export const getHeroInfoList = function (intial: number, length?: number): Promise<HeroInfoT[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (length) {
        resolve(heroInfoList.slice(intial, intial + length));
      } else {
        resolve(heroInfoList.slice(intial));
      }
    }, 500);
  })
}