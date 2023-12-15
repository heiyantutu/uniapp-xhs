import { getStorage, setStorage } from "@/utils/wxuser";
import api from "@/utils/api";
import * as R from 'ramda'
import { jAlert3 } from "@/base/jAlert/jAlert";

export function getBoundingClientRect(selector: any) {
	return new Promise((resolve) => {
		uni.createSelectorQuery().selectAll(selector).boundingClientRect().exec((rect = []) => resolve(rect[0]?.[0]));
	});
}

export function getRect(context: any, selector: any) {
	return new Promise((resolve) => {
		uni.createSelectorQuery()
			.in(context)
			.select(selector)
			.boundingClientRect()
			.exec((rect = []) => resolve(rect[0]));
	});
}
export function getAllRect(context: any, selector: any) {
	return new Promise((resolve) => {
		uni.createSelectorQuery()
			.in(context)
			.selectAll(selector)
			.boundingClientRect()
			.exec((rect = []) => resolve(rect[0]));
	});
}
export function login() {
	return new Promise((resolve, reject) => {
		uni.login({ success: resolve, fail: reject });
	});
}

export function goPageWithUser(url: string) {
	let user = getStorage("user");
	if (user && user.memberId) {
		goPage(url);
	} else {
		toLogin();
	}
}

export function goWebview(url: string) {
	if (!url) {
		return false;
	}
	uni.navigateTo({
		url: `/pages/mall/webview?url=${encodeURIComponent(url)}`
	})
}

export const isiOS = () => {
	var u = navigator.userAgent;
	return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
};
export function getQueryVariable(url:string, variable:string) {
	url = url.split('?')[1]
	if (url) {
		var vars = url.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] == variable) {
				return pair[1];
			}
		}
	} else {
		return false;
	}

};
export function goPage(url: string) {
	if (!url) {
		return false;
	}
	if (url.indexOf('http') != -1) {
		// #ifdef MP
		goWebview(url);
		// #endif

		// #ifdef H5
		if (isCmbchina()) {
			if (isiOS()) {
				window.location.href = url;
			} else {
				window.open(url);
			}
		} else {
			window.location.href = url;
		}
		// #endif
		return false;
	}
	// #ifdef MP
	var appid = getQueryVariable(url,'appid')
	if(appid){
		toMiniProgram(appid, url)
		return;
	}
	// #endif
	// #ifdef MP-XHS
	uni.navigateTo({
		url: url,
		fail: (res) => {
			uni.switchTab({
				url: url,
			})
		}
	})
	// #endif
	// #ifndef MP-XHS
	uni.switchTab({
		url: url,
		fail: (res) => {
			uni.navigateTo({
				url: url
			})
		}
	})
	// #endif
}
export function toMiniProgram(appid:string, path:string) {
	uni.navigateToMiniProgram({
		appId: appid,
		path: path,
		envVersion: 'release',
		success(res) {}
	});
	
};
export function toLogin() {
	var pages = getCurrentPages()
	var currentPage: any = pages[pages.length - 1]
	var url = '/' + currentPage.route
	var options = currentPage.options
	var params = {
		redirect_url: `${url}?${createUrl(options)}`
	}
	// #ifdef H5
	params.redirect_url = window.location.href;
	// #endif
	uni.navigateTo({
		url: "/pages/member/memberLogin?" + createUrl(params)
	});
}

export function createUrl(obj: any) {
	var length = obj && obj.length,
		idx = 0,
		url = "";
	for (var key in obj) {
		if (key != "url" && obj[key] !== null) {
			url += key + "=" + encodeURIComponent(obj[key]) + "&";
		}
	}
	return url.substring(0, url.lastIndexOf("&"));
}
export function refreshMember(cb?: Function) {
	var user = getStorage("user");
	var wxuser = getStorage("wxuser");
	var config = getStorage("config");
	if (user && user.memberId) {
		api.refreshMemberInfo({
			memberId: user.memberId,
			hotelCode: config.hotelCode,
			hotelGroupCode: config.hotelGroupCode,
			hotelGroupId: config.hotelGroupId,
			appid: config.appid,
			componentAppid: config.componentAppid,
		})
			.then(function (data: any) {
				if (data.result == 1) {

					setStorage("user", data.retVal);
					setTimeout(() => {
						cb && cb(data.retVal);
					}, 100);
				} else {
					setStorage("user", "");
				}
			})
	} else {
		if (!(wxuser && wxuser.openid)) {
			setStorage("user", "");
		}
	}
}

export function refreshMemberInfo(cb?: Function) {
	var user = getStorage("user");
	var wxuser = getStorage("wxuser");
	var config = getStorage("config");
	if (user && user.memberId) {
		var isWechatMini = false;
		// #ifdef MP-WEIXIN
		isWechatMini = true;
		console.log("是微信")
		// #endif
		if (!isWechatMini) {
			refreshMember();
			return false;
		}
		api.memberLoginOpen({
			hotelCode: config.hotelCode,
			hotelGroupCode: config.hotelGroupCode,
			hotelGroupId: config.hotelGroupId,
			memberId: user.memberId || "",
			openid: wxuser.openid,
			appid: config.appid,
			componentAppid: config.componentAppid,
		})
			.then(function (data: any) {
				if (data.result == 1) {

					setStorage("user", data.retVal);
					setTimeout(() => {
						cb && cb(data.retVal);
					}, 100);
				} else {
					setStorage("user", "");
				}
			})
	} else {
		if (!(wxuser && wxuser.openid)) {
			setStorage("user", "");
		}
	}
}

export const hexToRgba = (hex: string, opacity: number): string => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	if (result == null) return "rgba(0,0,0,0)";
	return `rgba(${parseInt(result[1], 16)},${parseInt(
		result[2],
		16
	)},${parseInt(result[3], 16)}, ${opacity})`;
};

export const getCurrentCard = () => {
	let cardIndex = getStorage("cardIndex");
	let user = getStorage("user");
	let cardNo = getStorage("cardNo");
	let currentCard = {};
	let currentCardIndex = {};
	if (user && user.memberId) {
		if (user.cardListDto[cardIndex]) {
			currentCard = user.cardListDto[cardIndex];
			currentCardIndex = cardIndex;
		} else {
			currentCard = user.cardListDto[0];
			currentCardIndex = 0;
			setStorage("cardIndex", 0);
		}
		if (cardNo) {
			user.cardListDto.forEach((n: any, i: number) => {
				if (n.cardNo == cardNo) {
					currentCard = n;
					currentCardIndex = i;
					setStorage("cardIndex", currentCardIndex);
				}
			})
		}
	} else {
		currentCard = {
			cardType: "",
			cardLevel: ""
		};
		currentCardIndex = 0;
		setStorage("cardIndex", 0);
	}
	return [currentCard, currentCardIndex];
}

export function getUrlParams(url: string): Record<string, string> {
	const params: Record<string, string> = {};
	const urls = url.split("?");
	const queryString = urls[urls.length - 1];
	if (queryString && queryString.includes("=")) {
		const paramPairs = queryString.split("&");
		paramPairs.forEach((pair) => {
			const [key, value] = pair.split("=");
			params[key] = value;
		});
	}
	return params;
}

export function addNum(num1: number, num2: number) {
	var sq1, sq2, m;
	try {
		sq1 = num1.toString().split(".")[1].length;
	}
	catch (e) {
		sq1 = 0;
	}
	try {
		sq2 = num2.toString().split(".")[1].length;
	}
	catch (e) {
		sq2 = 0;
	}
	m = Math.pow(10, Math.max(sq1, sq2));
	return (num1 * m + num2 * m) / m;
}

export function subtraction(arg1: number, arg2: number) {
	var r1, r2, m, n;
	try {
		r1 = arg1.toString().split(".")[1].length;
	}
	catch (e) {
		r1 = 0;
	}
	try {
		r2 = arg2.toString().split(".")[1].length;
	}
	catch (e) {
		r2 = 0;
	}
	m = Math.pow(10, Math.max(r1, r2)); //last modify by deeka //动态控制精度长度  
	n = (r1 >= r2) ? r1 : r2;
	return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
}

export function requestMsg(tmplIds: any) {
	return new Promise((resolve) => {
		if (typeof uni.requestSubscribeMessage === 'function') {
			uni.requestSubscribeMessage({
				tmplIds: tmplIds,
				complete(res) {
					resolve(res)
				}
			})
		} else {
			resolve("")
		}
	})
}

export const isCmbchina = () => {
	// #ifdef MP
	return false;
	// #endif

	// #ifdef H5
	if (navigator.userAgent.indexOf('MPBank') > -1) {
		return true;
	} else {
		return false;
	}
	// #endif
};

export const getUrl = (url: any) => {
	if (!url) {
		return "";
	}
	var params = {
		url: url
	};
	let openid = getStorage("openid");
	let query = getUrlParams(params.url);
	let config = getStorage("config");
	let queryLength = Object.keys(query);
	if (queryLength.length > 0) {
		params.url += `&miniProgramOpenid=${openid}&appid=${config.appid}`;
	} else {
		params.url += `?miniProgramOpenid=${openid}&appid=${config.appid}`;
	}
	return params.url;
};

export function urlEncode(param: any, key: any, encode: any) {
	if (param == null) return "";
	var paramStr = "";
	var t = typeof param;
	if (t == "string" || t == "number" || t == "boolean") {
		paramStr +=
			"&" +
			key +
			"=" +
			(encode == null || encode ? encodeURIComponent(param) : param);
	} else {
		for (var i in param) {
			var k =
				key == null
					? i
					: key + (param instanceof Array ? "[" + i + "]" : "." + i);
			paramStr += urlEncode(param[i], k, encode);
		}
	}
	return paramStr;
}
export const isWeChat = () => {
	const ua: any = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {
		return true;
	} else {
		return false;
	}
};

export const getQuery = (): Record<string, string> => {
	const current: any = R.last(getCurrentPages())
	const fullPath = current.$page.fullPath
	const qs = fullPath.split("?")[1]
	const o = Object.create(null)
	if (qs) {
		const pairs = qs.split("&")
		pairs.forEach((pair: string) => {
			const [k, v] = pair.split("=")
			o[k] = v
		})
	}
	return o
}
export function convertToCSSColor(hexColor: any) {
	// 将0xRRGGBB格式的颜色值分解成红、绿和蓝的分量
	const red = (hexColor >> 16) & 0xFF;
	const green = (hexColor >> 8) & 0xFF;
	const blue = hexColor & 0xFF;

	// 将分量转换为十六进制字符串，并确保它们都有两位
	const redHex = red.toString(16).padStart(2, '0');
	const greenHex = green.toString(16).padStart(2, '0');
	const blueHex = blue.toString(16).padStart(2, '0');

	// 创建CSS颜色表示法，格式为#RRGGBB
	const cssColor = `#${redHex}${greenHex}${blueHex}`;

	return cssColor;
}

export function goWmUrl(type?: string) {
	if (type) {
		if (type == "showCard") {
			// #ifdef MP-WEIXIN
			uni.navigateToMiniProgram({
				appId: 'wx5d94bb220d9d0234',
				path: '/hd_giftcard/mine?productInstanceId=13545842204&vid=0',
				success(res) { }
			})
			// #endif
			// #ifndef MP-WEIXIN
			jAlert3("风物卡仅支持松赞微信小程序环境内打开~");
			// #endif
		}
		if (type == "orderList") {
			// #ifdef MP-WEIXIN
			uni.navigateToMiniProgram({
				appId: 'wx5d94bb220d9d0234',
				path: '/ec_orderDetail/orderlist?productInstanceId=13545845204&vid=0',
				success(res) { }
			})
			// #endif
			// #ifdef MP-XHS
			jAlert3("仅支持松赞微信小程序环境内打开~");
			// #endif
			// #ifdef MP-H5
			window.location.href = "https://n.weimob.com/saas/payment/weixinpay/mall_orderlist?piid=13545845204&vid=0&cid=732418204"
			// #endif
		}
	} else {
		jAlert3("敬请期待~");
	}
	return false;
}
export function findMostFrequent(arr: Array) {
	let count = {};

	for (let i = 0; i < arr.length; i++) {
		let element = arr[i];
		count[element] = count[element] ? count[element] + 1 : 1;
	}

	let maxCount = 0;
	let mostFrequent;
	for (let element in count) {
		if (count[element] > maxCount) {
			maxCount = count[element];
			mostFrequent = element;
		}
	}
	return mostFrequent;
}

export function throttle(fn: Function, wait: number = 500) {
	let last: number, now: number;
	return function (this: any) {
		now = Date.now();
		if (last && now - last < wait) {
			last = now;
		} else {
			last = now;
			fn.call(this, ...arguments);
		}
	};
}

export function debounce(fn: Function, wait: number = 500) {
	let timer: NodeJS.Timeout;
	return function (this: any) {
		const context = this;
		const args = arguments;
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			fn.apply(context, args);
		}, wait);
	};
}
export function hideCode(str: string, beginStr: number, endStr: number) {
	var len = str.length;
	if (len < beginStr || len < endStr) {
		return str;
	}
	var leftStr = str.substring(0, beginStr);
	var rightStr = str.substring(endStr, len);
	var str = ''
	var i = 0;
	try {
		for (i = 0; i < endStr - beginStr; i++) {
			str = str + '*';
		}
	} catch (error) {

	}
	str = leftStr + str + rightStr;
	return str;
}

export function getMaxWidthContent(content: any) { //处理富文本图片宽度
	if (content) {
		return content.replace(/<img.*?src=['"](.*?)['"].*?>/gi, "<img style='max-width: 100%;' src='$1'>");
	}
}

export const getQueryStringFromUrl = function (fromUrl: string, name: string) {
	try {
		var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		var w = fromUrl.split("?");
		var url = w[w.length - 1]
		var r = url.match(reg);
		if (r != null) {
			return unescape(r[2]);
		}
		return "";
	} catch (e) {
		return "";
	}
}

export const getReallyPx = function (px: number) {
	var screenWidth = uni.getSystemInfoSync().windowWidth;
	// 将px转换为rpx
	var rpxValue = px * 750 / screenWidth;
	var realPxValue = rpxValue * screenWidth / 750;
	return realPxValue;
}