import env from "@/utils/env"
import config from "@/utils/config";

export function setStorage(key: string, value: any) {
  return new Promise((resolve, reject) => {
    uni.setStorage({
      key: key,
      data: value,
      success: resolve,
      fail: reject
    });
  });
}

export function getStorage(key: string) {
  if (key == 'config') {
    if (env.NODE_ENV === 'songzan' || env.NODE_ENV === 'songzanProd') {
      return config
    } else {
      // #ifdef MP-WEIXIN || MP-ALIPAY
      return uni.getExtConfigSync ? uni.getExtConfigSync() : {}
      // #endif
      // #ifdef MP-TOUTIAO
      return uni.getExtConfigSync ? uni.getExtConfigSync().extConfig : {}
      // #endif
      // #ifndef MP-WEIXIN || MP-TOUTIAO
      return config
      // #endif
    }
  }
  try {
    var value = uni.getStorageSync(key);
    if (value) {
      return value;
    } else {
      return "";
    }
  } catch (e) {
    return "";
  }
}

export function removeStorage(key: string) {
  return new Promise((resolve, reject) => {
    uni.setStorage({
      key: key,
      data: "",
      success: resolve,
      fail: reject
    });
  });
}

export function getLocation(type: string) {
  return new Promise((resolve, reject) => {
    uni.getLocation({
      type: type,
      success: resolve,
      fail: reject
    });
  });
}