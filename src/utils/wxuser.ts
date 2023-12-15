import env from "@/utils/env"
import config from "@/utils/config";
// #ifdef H5
import store from "store";
// #endif
export function login() {
	return new Promise((resolve, reject) => {
		uni.login({
			success: resolve,
			fail: reject
		});
	});
}
export function setStorage(key: string, value: any) {
  // #ifdef MP
  uni.setStorageSync(key, value);
  // #endif

  // #ifdef H5
  store.set(key, value);
  // #endif
}

export function getStorage(key: string) {
  if (key == 'config') {
    if (!config.componentAppid) {
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
  // #ifdef MP
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
  // #endif

  // #ifdef H5
  return store.get(key);
  // #endif
}

export function removeStorage(key: string) {
  // #ifdef MP
  return new Promise((resolve, reject) => {
    uni.setStorage({
      key: key,
      data: "",
      success: resolve,
      fail: reject
    });
  });
  // #endif

  // #ifdef H5
  return new Promise((resolve, reject) => {
    store.set(key, "");
    resolve(0)
  });
  // #endif
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