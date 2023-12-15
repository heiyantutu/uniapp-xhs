import { createSSRApp } from "vue";
import { createPinia } from 'pinia'
import { getQueryStringFromUrl } from "@/utils/utils";
import App from "./App.vue";
// @ts-ignore
import aplus from '@/utils/aplus.js'

// #ifdef H5
let url = window.location.href;
let debug = getQueryStringFromUrl(url, 'debug') ? getQueryStringFromUrl(url, 'debug') : "";
if (!debug) {
  debug = sessionStorage['debug'];
}
if (debug == "T") {
  sessionStorage['debug'] = debug;
  // @ts-ignore
  (function () { var script = document.createElement('script'); script.src = "https://cdn-1251575231.cos.ap-shanghai.myqcloud.com/eruda/2.5.0/eruda.js"; document.body.appendChild(script); script.onload = function () { eruda.init() } })();
}
// #endif

const pinia = createPinia()

export function createApp() {
  const app = createSSRApp(App);
  // #ifdef MP
  app.use(aplus);
  // #endif
  app.use(pinia)
  return {
    app,
  };
}
