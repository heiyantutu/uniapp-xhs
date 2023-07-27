import { getStorage, setStorage } from "@/utils/wxuser";
import api from "@/utils/api";

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
		uni.navigateTo({
			url: url,
		})
	} else {
		toLogin();
	}
}

export function goPage(url: string) {
	uni.switchTab({
		url: url,
		fail: () => {
			uni.navigateTo({
				url: url
			})
		}
	})
}

export function toLogin() {
	var pages = getCurrentPages()
	var currentPage: any = pages[pages.length - 1]
	var url = '/' + currentPage.route
	var options = currentPage.options
	var params = {
		redirect_url: `${url}?${createUrl(options)}`
	}
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

export function refreshMemberInfo(cb?: Function) {
	var user = getStorage("user");
	var wxuser = getStorage("wxuser");
	var config = getStorage("config");
	if (user && user.memberId && wxuser && wxuser.openid) {
		api.memberLoginOpen({
			hotelCode: config.hotelCode,
			hotelGroupCode: config.hotelGroupCode,
			hotelGroupId: config.hotelGroupId,
			memberId: user.memberId,
			openid: wxuser.openid,
			appid: config.appid,
			componentAppid: config.componentAppid,
		})
			.then(function (data: any) {
				if (data.result == 1) {
					setStorage("user", data.retVal);
					setTimeout(() => {
						cb && cb();
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
	const queryString = url.split("?")[1];
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

export function requestMsg(tmplIds:any){
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