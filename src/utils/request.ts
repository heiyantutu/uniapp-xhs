import config from "@/utils/config";
// @ts-ignore
import signature from "@/utils/signature.js";

import { getStorage } from "@/utils/wxuser";
import { processRsApi } from "./requsetPostProcess";
enum HttpMethod {
	OPTIONS = 'OPTIONS',
	GET = 'GET',
	HEAD = 'HEAD',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
	TRACE = 'TRACE',
	CONNECT = 'CONNECT'
}

let baseURL = config.baseUrlmall;

let methods: HttpMethod[] = [
	HttpMethod.OPTIONS,
	HttpMethod.GET,
	HttpMethod.HEAD,
	HttpMethod.POST,
	HttpMethod.PUT,
	HttpMethod.DELETE,
	HttpMethod.TRACE,
	HttpMethod.CONNECT
];

let request: any = {};

methods.forEach((method: HttpMethod) => {
	request[method.toLowerCase()] = function (url: string, data: any, header: any = {}) {
		url = url.trim();
		// #ifndef H5
		if (url.indexOf('http') !== 0) {
			url = baseURL + url;
		}
		// #endif
		if (data && data.memberId) {
			let user = getStorage("user");
			if (user && user.memberToken) {
				data.memberToken = user.memberToken;
			}
		}
		if (url.indexOf("/api/cache/sysOptions/getMultiSysOptionCommon.json") > 0) {
			// #ifdef MP-ALIPAY
			data.clientType = "alipay_mini";
			// #endif
			// #ifdef MP-XHS
			data.clientType = "red_mini";
			// #endif
			// #ifdef H5
			data.clientType = "wechat";
			// #endif
		}
		if (url.indexOf("rsapi") >= 0) {
			header = Object.assign({
				hotelGroupCode: config.hotelGroupCode,
				hotelCode: uni.getStorageSync('hotelCode') || 0,
				usercode: 'guest',
				channel: 'HKApp'
			}, header)
		}
		return new Promise((resolve, reject) => {
			if (url.indexOf('baiduAk') == 1) {
				url = url.replace('api', 'map');
			}
			let appkey = '';
			let appsecret = '';
			let config = getStorage("config");
			if (config.appkey && config.appsecret) {
				appkey = config.appkey;
				appsecret = config.appsecret;
			}
			if (appkey && appsecret) {
				if (url.indexOf('http') !== 0) {
					url = `/guardian${url}`
				}
				function replaceUndefined(obj: any) {
					for (let key in obj) {
						if (obj.hasOwnProperty(key) && obj[key] === undefined) {
							obj[key] = '';
						}
					}
					return obj;
				}
				data = replaceUndefined(data);
				signature({
					url: url,
					data: data,
					method: method,
					header: header || {},
				}, {
					appkey: appkey,
					appsecret: appsecret,
					originQuery: (method == "GET" || header['Content-Type'] == 'application/x-www-form-urlencoded') ? data : {}
				})
			}

			uni.request({
				url: url,
				data: data,
				method: method,
				header: header || {},
				success: (res) => {
					console.log(`请求地址:${url}`);
					console.log(`请求头:${header ? JSON.stringify(header) : ""}`);
					console.log(`请求参数:${data ? JSON.stringify(data) : ""}`);
					console.log(res.data);
					processRsApi(url, res, reject)
					resolve(res.data)
				},
				fail: (err) => {
					console.log(err)
					return Promise.resolve(reject);
				},
			});
		})
	}
});

export default request;
