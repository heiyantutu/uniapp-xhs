import config from "@/utils/config";

import { getStorage } from "@/utils/wxuser";
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
	request[method.toLowerCase()] = function (url: string, data: any) {
		url = url.trim();
		// #ifndef H5
		if (url.indexOf('http') !== 0) {
			url = baseURL + url;
		}
		if (data&&data.memberId){
			let user = getStorage("user");
			if (user && user.memberToken) {
				data.memberToken = user.memberToken;
			}
		}
		// #endif
		console.log(url)
		if (url.indexOf("/api/cache/sysOptions/getMultiSysOptionCommon.json") > 0) {
			// #ifdef MP-ALIPAY
			data.clientType = "alipay_mini";
			// #endif
		}
		return new Promise((resolve, reject) => {
			if (url.indexOf('baiduAk') == 1) {
				url = url.replace('api', 'map');
			}
			uni.request({
				url: url,
				data: data,
				method: method,
				header: {},
				success: (res) => {
					console.log(res.data);
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
