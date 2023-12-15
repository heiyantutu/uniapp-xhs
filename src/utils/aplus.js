// #ifdef MP
// import aplus_mini from './aplus_mini_cloud_um.js'; //1.x 版本 sdk
import { initQTSDK } from './qt_mini.esm.js';
// #endif
// #ifdef H5
import { initWebSDK } from './initWebSDK.js';
// #endif
import { getStorage } from "@/utils/wxuser";

let trackerInfo = {
	appKey: "bfnan1k58amyvbv4js5jy49p",
	trackDomain: "quickaplus-he-api-cn-shanghai.aliyuncs.com",
};
// #ifdef H5
trackerInfo = {
	appKey: "hf3e80lky0403up5lylnwlw6",
	trackDomain: "quickaplus-he-api-cn-shanghai.aliyuncs.com",
}
// #endif
let _anony_id = "";
let _user_id = "";
let _user_nick = "";
let wxuser = getStorage("wxuser");
if (wxuser && wxuser.openid) {
	_anony_id = wxuser.openid;
}
let user = getStorage("user");
if (user && user.memberId) {
	_user_id = user.memberId;
	_user_nick = user.name;
}
const aplusConfig = {
	metaInfo: {
		'appKey': trackerInfo.appKey,
		//'appInfoId': trackerInfo.appInfoId,
		'trackDomain': trackerInfo.trackDomain || 'log-api.aplus.emas-poc.com',
		//'aplus-vt-cfg-url': trackerInfo.aplusVtCfgUrl, // 已发布的配置地址
		//'aplus-api-host': trackerInfo.aplusApiHost, // 采集管理系统域名，用于可视化埋点验证

		'DEBUG': true,
		// 'aplus-waiting': 'MAN', //关闭自动pv
		'_anony_id': _anony_id, // 'testOpenId', //必填
		'globalproperty': {
			from: 'uniapp'
		},
		'aplus-auto-exp': [{
			'cssSelector': '.couponTrack',
			'logkey': 'cpp_coupon_exp',
			'props': ['data-coupon_name,data-coupon_type,data-price'],
		},
		{
			'cssSelector': '.trip-info-list',
			'logkey': 'before_leaving_pop_up_window',
			'props': [],
		}],
		'aplus-auto-clk': [{
			'cssSelector': '.test_auto_clk',
			'logkey': 'test_auto_clk',
			'props': ['data-product', 'data-productColor', 'data-productId'],
		}],
		'_user_id': _user_id,
		'_user_nick': _user_nick,
		// 设置每个页面的page_name
		'pageConfig': {
			'pages/member/memberLogin': {
				'pageName': 'login_pg'
			},
			'pages/member/memberCenter': {
				'pageName': 'my_pg',
				'skipMe': true
			},
			'pagesA/member/travelPreference': {
				'pageName': 'travel_preference_pg'
			},
			'pagesA/member/couponList': {
				'pageName': 'coupon_package_pg',
				'skipMe': true
			},
			'pagesA/member/memberListPoint': {
				'pageName': 'integral_pg',
				'skipMe': true
			},
			'pagesA/member/memberAuth': {
				'pageName': 'personal_information_pg',
			},
			'pages/member/orderList': {
				'pageName': 'hotel_product_order_pg',
				'skipMe': true
			},
			'pagesC/order/hotel': {
				'pageName': 'hotel_commodity_detail_pg',
				'skipMe': true
			},
			'pagesC/order/bookInfo': {
				'pageName': 'confirm_order_pg',
				'skipMe': true
			},
			'pages/trip/index': {
				'pageName': 'travel_cover_pg',
				'skipMe': true
			},
			'pagesD/trip/tripDetail': {
				'pageName': 'travel_detail_pg'
			},
			'pagesD/trip/hotelInfo': {
				'pageName': 'hotel_detail_pg'
			},
			'pagesD/trip/album': {
				'pageName': 'photo_pg',
				'skipMe': true
			},
			'pagesD/trip/houseKeep': {
				'pageName': 'team_member_pg',
				'skipMe': true
			},
			'pagesD/trip/takeInfo': {
				'pageName': 'pick_up_pg'
				
			},
			'pagesA/member/myCollection': {
				'pageName': 'my_collection_pg'
				
			},
			'pagesB/travel/travelersInfo': {
				'pageName': 'trip_people_pg'
				
			},
			'pages/travel/index': {
				'pageName': 'book_pg',
			},
			
			'pages/scenery/scenery': {
				'pageName': 'product_channel_pg'
				
			},
			'pagesB/travel/travelDetail': {
				'pageName': 'trip_detail_pg',
				'skipMe': true
				
			},
			'pagesB/travel/confirmOrder': {
				'pageName': 'confirm_order_pg',
				'skipMe': true
				
			},
			'pagesB/travel/orderDetail': {
				'pageName': 'order_detail_pg',
				'skipMe': true
				
			},
			'pagesB/exchangeCoupon/exchangeCouponDetail': {
				'pageName': 'coupon_detail_pg',
				'skipMe': true
				
			},
			'pagesB/travel/searchResult': {
				'pageName': 'coupon_detail_pg'
			},
			'pagesF/address/addressList': {
				'pageName': 'delivery_address'
			},
			'pagesF/address/addAddress': {
				'pageName': 'delivery_address'
			},
			'pagesF/prize/receivePrize': {
				'pageName': 'lucky_draw_pg'
			},
			
		}
	}
};
// #ifdef H5
delete aplusConfig.metaInfo._anony_id;
// #endif
// const aplus = aplus_mini(aplusConfig);
// #ifdef MP
var aplus = initQTSDK(aplusConfig).ctx.aplus;
// #endif

// #ifdef H5
var aplus = initWebSDK(aplusConfig)
// #endif
export default aplus;
