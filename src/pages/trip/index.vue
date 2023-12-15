<template>
<div class="index_ui" v-if="user&&user.memberId">
    <template v-if="isLoad">
        <div class="header" :style="{'paddingTop':navHeight+'px'}" :class="{'no-trip':!teamOrder.productCode,'trip-end':teamOrder.tripSta == '5'}" v-if="ajax">
            <div class="header-bg">
                <img :src="headerData.imgUrl" class="header-img">
            </div>
            <div class="header-box" v-if="teamOrder.tripSta == '5'">
                <img class="img" :src="headerData.imgUrl+'?imageView2/1/w/686/h/516&x-oss-process=image/resize,m_fill,w_686,h_516'">
                <div class="name">暂无行程</div>
                <div class="welcome">{{headerData.welcome}}</div>
                <div class="btns">
                    <div class="btn" @click="toPage('/pagesD/trip/tripList')">全部行程</div>
                    <div class="btn order-btn" @click="toPage('/pages/travel/index')">立即预订</div>
                </div>

            </div>
            <div class="header-box" v-else-if="!teamOrder.productCode">
                <div class="name">暂无行程</div>
                <div class="desc">松赞，期待与您相遇。</div>
                <div class="btn baseBtn" @click="toPage('/pages/travel/index')">立即预订</div>
            </div>
            <div class="header-box left" v-else @click="toTrip()">
                <div class="img-bg"></div>
                <img class="img" :src="headerData.imgUrl+'?imageView2/1/w/686/h/516&x-oss-process=image/resize,m_fill,w_686,h_516'">
                <div class="time-box" v-if="teamOrder.tripTime">
                    <div class="time">
                        {{teamOrder.tripTime}}
                    </div>
                </div>

                <div class="name">{{teamOrder.productDesc}}<i class="iconfont icon-a-16_youlajiantou_hei"></i></div>
                <div class="desc">{{headerData.welcome}}</div>
            </div>
        </div>
        <div style="margin-top: -8px;"></div>
        <div class="nav-warp" v-if="ajax&&teamOrder.productCode&&teamOrder.reserveList.length>0">
            <trip-nav ref="tripNavRef" :dayDiff="teamOrder.dayDiff" :dayEndDiff="teamOrder.dayEndDiff" :productCode="teamOrder.productCode" :teamNo="teamOrder.teamNo" :hotelCode="teamOrder.hotelCode" :orderNo="teamOrder.reserveList[0].orderNo" :teamOrder="teamOrder" page="index" @getActives="getActives" @getMasterInfo="getMasterInfo" @getOrderNo="getOrderNo"></trip-nav>

        </div>

        <div class="notice">
            <notice ref="noticeRef" showLocation="1" :teamNo="teamOrder.teamNo" :orderNo="orderNo" :masterInfo="masterInfo"></notice>
        </div>
        <div class="product_warp">
            <template v-for="(adTravel,i) in adTravels" :key="i">
                <div class="product" v-if="adTravel.items&&adTravel.items.length>0">
                    <div class="product-tl" @click="toMoreTipr(adTravel,i)" v-if="adTravel.title">
                        {{adTravel.title}}
                        <div class="more">
                            {{adTravel.desc}}
                            <i class="iconfont icon-a-16_youlajiantou_hei"></i>
                        </div>
                    </div>
                    <div class="product-scroll">

                        <div class="product-item" @click="toTripDetail(item)" v-for="(item,index) in adTravel.items" :key="index">
                            <div class="product-img product-img-mini">
                                <img class="img" :src="item.pics+'?imageView2/1/w/332/h/248&x-oss-process=image/resize,m_fill,w_322,h_248'">
                            </div>
                            <div class="product-info">
                                <div class="product-name">
                                    {{item.title}}
                                </div>

                                <div class="product-bt">
                                    <div class="product-price" v-if="item.price==-1">满房</div>
                                    <div class="product-price" v-else>¥{{item.price}}</div>
                                    <div class="product-btn baseBtn">详情</div>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </template>

        </div>
        <div class="all-trip-btn" @click="toAllTrip()">

            全部行程
            <i class="iconfont icon-a-16_youlajiantou_hei"></i>
        </div>
    </template>

</div>
<div class="no-login-page" v-else>
    <image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/SENBO/no-login-bg.png" mode="aspectFill" class="loginBg" />
    <div class="login-text" @click="toLogin()">登录查看行程<i class="icon-a-20_youlachangjiantou_bai iconfont jiantou"></i></div>
    <div class="login-desc">随时随地了解行程信息、获取服务帮助</div>
</div>
<bottom-nav></bottom-nav>
</template>

<script setup lang="ts">
import {
    reactive,
    ref,
    computed,
    onMounted,
    watch
} from "vue";
import UmengSDK from "@/utils/umengAdaptor.js";
import notice from "@/components/notice.vue";
import bottomDialog from "@/components/bottomDialog.vue";
import bottomNav from "@/components/bottomNav.vue";
import tripNav from "@/components/tripNav.vue";

import {
    getStorage,
    removeStorage
} from '@/utils/wxuser';
import dayjs from "dayjs";
import api from "@/utils/api";
import {
    $ref
} from 'unplugin-vue-macros/macros';
import {
    getUrlParams,
    goPage,
    toLogin
} from "@/utils/utils";
import {
    onLoad,
    onShow,
	onPullDownRefresh
} from "@dcloudio/uni-app";
import defaultChannel from "@/utils/defaultChannel";
import {
    jAlert3
} from "@/base/jAlert/jAlert";
let user = $ref(getStorage("user") || {});
let config = getStorage('config')
const teamOrder: any = ref({});

const ajax = ref(false)
let headerData: any = ref({
    imgUrl: '',
    desc: ''
});
let isLoad = ref(false)
let navHeight = ref(48)
let teamNo = ref('')
let tripTeamNo = ref('')
let channel = ref(defaultChannel);
let fromDate = ref(dayjs().format("YYYY-MM-DD"));
let toDate = ref(dayjs().add(1, "days").format("YYYY-MM-DD"));
// let adTravel : any = ref({})
// let adTravel2 : any = ref({})
let adTravels: any = ref([])
let masterInfo: any = ref({})
let tripNavRef = ref()
let noticeRef = ref()
let orderNo = ref('')
let requestObj = reactive({
    // beginDate: '',
    // endDate: '',
    cardLevel: user.cardLevel,
    companyLevel: user.companyLevel,
    cardType: user.cardType,
    category: '',
    categorySub: '',
    companyCode: '',
    gcLevel: '',
    ota: '',
    otaChannel: 'WECHAT',
    dayNight: '',
    rendezvous: '',
    travelGroupCode: '',
    travelType: '',
    marketingId: "",
    hotelCode: config.hotelCode,
    hotelGroupCode: config.hotelGroupCode,

})

watch(() => tripTeamNo.value, (newVal, oldVal) => {

    if (tripNavRef.value) {
        tripNavRef.value.initData()
    }

})
const toMoreTipr = (item: any, i: number) => {
    if (i == 0) {
        UmengSDK.sendEvent("tcp_explore_more_clk", {
            page_name: "travel_cover_pg",
            page_title_name: teamOrder.value.pageTitle,
            page_id: "",
            price: 0,
            product_name: "",
            button_id: "moreTrip",
            button_name: "更多"
        });
    } else {
        UmengSDK.sendEvent("tcp_explore_product_clk", {
            page_name: "travel_cover_pg",
            page_title_name: teamOrder.value.pageTitle,
            page_id: "",
            price: 0,
            product_name: "",
            button_id: "moreTrip",
            button_name: "更多"
        });
    }

    goPage(item.link)
}
const getHotelInfo = () => {

    var obj = {
        fromDate: fromDate.value,
        toDate: toDate.value,
        otaChannel: 'wechat',
        hotelCodes: [teamOrder.value.hotelCode],
        hotelGroupCode: config.hotelGroupCode,
        cardLevel: "",
        cardType: "",
        appid: config.appid,
        memberNo: "",
        componentAppid: config.componentAppid,
        srcHotelGroupCode: config.hotelGroupCode,
        isWeeHour: "",
        couponNo: "",
    };

    api.hotelListAll(obj).then((res: any) => {
        if (res.result == 1) {
            headerData.value.welcome = res.retVal[0].gcHotel.remark

        } else {
            jAlert3(res.msg);
        }

    })

};
const toMoreTipr2 = (item: any) => {
    UmengSDK.sendEvent("tcp_explore_product_clk", {
        page_name: "travel_cover_pg",
        page_title_name: teamOrder.value.pageTitle,
        page_id: "",
        price: 0,
        product_name: "",
        button_id: "moreTrip",
        button_name: "更多"
    });
    goPage(item.link)
}
const getActives = (val: string) => {
    if (val) {
        headerData.value.welcome = "今日行程：" + val
    }

}
const toMoreScenery = () => {

}
const getMasterInfo = (val: any) => {
    masterInfo.value = val

}
const getOrderNo = (val: any) => {
    orderNo.value = val

}
const toAllTrip = () => {
    UmengSDK.sendEvent("tcp_other_button_clk", {
        page_name: "travel_cover_pg",
        page_title_name: teamOrder.value.pageTitle,
        page_id: "",
        button_id: "tripList",
        button_name: "全部行程"
    });
    toPage(`/pagesD/trip/tripList?teamNo=${teamOrder.value.teamNo}`)
}
const toTripDetail = (item: any) => {
    UmengSDK.sendEvent("tcp_explore_more_clk", {
        page_name: "travel_cover_pg",
        page_title_name: teamOrder.value.pageTitle,
        page_id: "",
        price: item.startingPrice,
        product_name: item.title,
        button_id: "travelDetail",
        button_name: "详情"
    });
    if (item.productType == 'tdq') {
        goPage(`/pagesB/exchangeCoupon/exchangeCouponDetail?id=${item.productId}`)
    } else if (item.productType == 'hotel') {
        goPage(`/pagesC/order/hotel?hotelCode=${item.productId}`)
    } else if (item.productType == 'daily') {
        goPage(`/pagesE/dailyActivity/dailyActivityDetail?activityCode=${item.productId}`)
    } else if (item.productType == 'weimob') {
        uni.navigateToMiniProgram({
            appId: 'wx5d94bb220d9d0234',
            path: `/ec_goods/detail?vid=0&productInstanceId=13545845204&id=${item.productId}`,
            success(res) {}
        })

    } else {
        goPage(`/pagesB/travel/travelDetail?travelType=${item.travelType}`)
    }

}
const toTrip = () => {
    UmengSDK.sendEvent("tcp_travel_card_clk", {
        page_name: "travel_cover_pg",
        page_title_name: teamOrder.value.pageTitle,
        page_id: "",
        card_id: "",
        card_name: "",
        button_id: teamOrder.value.teamNo,
        button_name: teamOrder.value.productDesc
    });
    if (headerData.value.link) {
        goPage(headerData.value.link)
    } else {
        if (teamOrder.value.orderType == 'SingleRoom') {
            goPage(`/pagesD/trip/hotelInfo?teamNo=${teamOrder.value.teamNo}&hotelCode=${teamOrder.value.teamRsvSrcs[0].hotelCode}&arrDate=${dayjs(teamOrder.value.beginDate).format('M月D日')}&depDate=${dayjs(teamOrder.value.endDate).format('M月D日')}&rmtype=${teamOrder.value.teamRsvSrcs[0].rmtype}`)
        } else {
            goPage(`/pagesD/trip/tripDetail?teamNo=${teamOrder.value.teamNo}`)
        }
    }

}
const getOrderList = () => {
    user = getStorage("user");
    api.interfaceTransfer({
            query: {
                "curPage": 1,
                "firstResult": 0,
                "isAgency": "T",
                "mobile": user.mobile,
                "pageSize": 999,
                "unitCode": config.hotelGroupCode
            },
            config: {
                "interfaceType": "POST",
                "interfaceModule": "GC_TRAVEL_ORDER",
                "interfaceMethod": "/api/team/order/teamList",
                "interfaceFrom": "GC",
                "hotelGroupCode": config.hotelGroupCode
            }
        })
        .then((res: any) => {
            if (res.result == 1 && res.retVal.result == 0) {
                if (res.retVal.retVal.length > 0) {
                    teamOrder.value = {}
                    res.retVal.retVal.forEach((item: any) => {
                        if (!teamOrder.value.productCode) {
                            if (item.orderType == 'Custom') {
                                item.productCode = item.id
                                item.productDesc = item.teamName
                            }

                            if (item.beginDate) {
                                item.dayDiff = dayjs().diff(item.beginDate, 'day')
                                item.dayEndDiff = dayjs(item.endDate).diff(dayjs(), 'day')
                            }

                            if ((item.dayDiff > 0 && teamOrder.value.dayEndDiff >= 0 && !teamOrder.value.productCode) || item.orderSta == 'I') {
                                teamOrder.value = item

                            }
                        }

                    })
                    if (!teamOrder.value.productCode) {
                        res.retVal.retVal.sort((a: any, b: any) => {
                            // 比较dayDiff的绝对值
                            const diffA = Math.abs(a.dayDiff);
                            const diffB = Math.abs(b.dayDiff);

                            // 如果a和b都小于零，按照绝对值升序排列
                            if (a.dayDiff < 0 && b.dayDiff < 0) {
                                return diffA - diffB;
                            }
                            // 如果a小于零而b大于等于零，优先返回a
                            else if (a.dayDiff < 0 && b.dayDiff >= 0) {
                                return -1;
                            }
                            // 如果a大于等于零而b小于零，优先返回b
                            else if (a.dayDiff >= 0 && b.dayDiff < 0) {
                                return 1;
                            }
                            // 如果a和b都大于等于零，按照绝对值升序排列
                            else {
                                return diffA - diffB;
                            }
                        });
                        res.retVal.retVal.forEach((team: any) => {
                            if (!teamOrder.value.productCode) {
                                if (team.orderType == 'SingleRoom') {

                                    if (team.dayDiff >= 0 && team.dayEndDiff >= 0) {
                                        teamOrder.value = team

                                    }
                                } else {
                                    if (team.orderSta == 'I') {
                                        teamOrder.value = team
                                    }
                                }
                            }

                        })
                        res.retVal.retVal.forEach((team: any) => {
                            if (!teamOrder.value.productCode) {
                                if (team.orderType == 'SingleRoom') {
                                    if (team.dayDiff < 0) {
                                        teamOrder.value = team
                                    }
                                } else {
                                    if (team.orderSta == 'W') {
                                        teamOrder.value = team
                                    }
                                }

                            }

                        })

                        // res.retVal.retVal.forEach((team : any) => {
                        // 	if (!teamOrder.value.productCode) {
                        // 		if (team.orderType == 'SingleRoom') {
                        // 		if (team.dayDiff > 0) {
                        // 		teamOrder.value = team
                        // 		}
                        // 		}else{
                        // 		if (team.orderSta == 'O') {
                        // 		teamOrder.value = team
                        // 		}
                        // 		}
                        // 	}
                        // })

                        if (!teamOrder.value.productCode) {
                            teamOrder.value = res.retVal.retVal[0]
                        }

                    }
                     if (teamOrder.value.orderType == 'SingleRoom') {
                        showOrder(() => {
                            ajax.value = true
                            if (teamOrder.value.tripSta == '5') {
                                advertisementPageEnd()
                            } else {
                                advertisementPage()
                            }
                        })
                    } else {
                        ajax.value = true
                        if (teamOrder.value.orderSta == 'W') {
                            if (teamOrder.value.dayDiff <= -2) {
                                teamOrder.value.tripSta = '1'
                                teamOrder.value.pageTitle = '行前2天以上'
                            } else {
                                teamOrder.value.tripSta = '2'
                                teamOrder.value.pageTitle = '行前2天内'
                            }
                            teamOrder.value.tripTime = `${dayjs(teamOrder.value.beginDate).format('M月DD日')}-${dayjs(teamOrder.value.endDate).format('M月DD日')}丨共${dayjs(teamOrder.value.endDate).add(1, 'day').diff(teamOrder.value.beginDate, 'day')}天`
                            if (dayjs(teamOrder.value.beginDate).add(1, 'day').diff(dayjs(), 'day') > 0) {
                                teamOrder.value.tripTime += `丨${dayjs(teamOrder.value.beginDate).add(1, 'day').diff(dayjs(), 'day')}天后出发`
                            }
                        } else if (teamOrder.value.orderSta == 'I') {
                            teamOrder.value.tripSta = '3'
                            teamOrder.value.pageTitle = '行中'
                            teamOrder.value.tripTime = `${dayjs(teamOrder.value.beginDate).format('M月DD日')}-${dayjs(teamOrder.value.endDate).format('M月DD日')}丨共${dayjs(teamOrder.value.endDate).add(1, 'day').diff(teamOrder.value.beginDate, 'day')}天`
                        } else if (teamOrder.value.orderSta == 'O') {
                            if (teamOrder.value.dayEndDiff >= -7) {
                                teamOrder.value.tripSta = '4'
                                teamOrder.value.pageTitle = '行后7天内'
                                teamOrder.value.tripTime = `${dayjs(teamOrder.value.beginDate).format('M月DD日')}-${dayjs(teamOrder.value.endDate).format('M月DD日')}丨共${dayjs(teamOrder.value.endDate).add(1, 'day').diff(teamOrder.value.beginDate, 'day')}天`
                            } else {
                                teamOrder.value.tripSta = '5'
                                teamOrder.value.pageTitle = '行后7天后'
                            }
                        }

                        if (teamOrder.value.tripSta == '5') {
                            advertisementPageEnd()
                        } else {
                            advertisementPage()
                        }
                    }
					tripTeamNo.value = teamOrder.value.teamNo
                } else {
					tripTeamNo.value = ""
                    ajax.value = true
                    headerData.value.imgUrl = 'https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/trip-head-bg.png'
                }
                if (!user || !user.memberId) {
                    teamOrder.value.pageTitle = '未登录'
                } else if (!teamOrder.value.pageTitle) {
                    teamOrder.value.pageTitle = '无行程'
                }
				uni.stopPullDownRefresh()
                if (teamNo.value) {
                    if (teamNo.value != teamOrder.value.teamNo) {
                        goPage('/pages/travel/index')
                        return;
                    }
                }
               
                isLoad.value = true

                UmengSDK.sendPV({
                    page_id: "",
                    page_name: "travel_cover_pg",
                    page_title_name: teamOrder.value.pageTitle
                });

            } else {
                jAlert3(res.msg || res.retVal.msg)
            }
        })
}
const showOrder = (cb: any) => {
    api
        .showOrder({
            orderNo: teamOrder.value.reserveList[0].orderNo,
            hotelGroupCode: config.hotelGroupCode,
        })
        .then((res: any) => {
            if (res.result == 1) {

                teamOrder.value.guestList = res.retVal.guestList
                teamOrder.value.arrivalFrom = res.retVal.arrStr
                teamOrder.value.hotelCode = res.retVal.hotelCode
                if (res.retVal.sta == "N" || (res.retVal.sta == 'R' && res.retVal.paySta == 2)) {
                    teamOrder.value.orderSta = "W"
                    if (teamOrder.value.dayDiff <= -2) {
                        teamOrder.value.tripSta = '1'
                        teamOrder.value.pageTitle = '行前2天以上'
                    } else {
                        teamOrder.value.tripSta = '2'
                        teamOrder.value.pageTitle = '行前2天内'
                    }
                }
                if (res.retVal.sta == "I") {
                    teamOrder.value.orderSta = "I"
                    teamOrder.value.tripSta = '3'
                    teamOrder.value.pageTitle = '行中'
                    getHotelInfo()
                }
                if (res.retVal.sta == "O") {
                    teamOrder.value.orderSta = "O"
                    if (teamOrder.value.dayEndDiff >= -7) {
                        teamOrder.value.tripSta = '4'
                        teamOrder.value.pageTitle = '行后7天内'
                    } else {
                        teamOrder.value.tripSta = '5'
                        teamOrder.value.pageTitle = '行后7天后'
                    }
                }
                teamOrder.value.productDesc = res.retVal.hotelDescript
                teamOrder.value.tripTime = `${dayjs(teamOrder.value.beginDate).format('M月DD日')}-${dayjs(teamOrder.value.endDate).format('M月DD日')}丨共${dayjs(teamOrder.value.endDate).diff(teamOrder.value.beginDate, 'day')}晚`
                cb && cb()
            } else {
                jAlert3(res.msg);
            }
        });
};
const advertisementPageEnd = () => {
    api
        .advertisementPage({
            hotelCode: config.hotelCode,
            hotelGroupCode: config.hotelGroupCode,
            clientTypes: channel.value,
            firstResult: 0,
            pageSize: 99,
            showLocation: '12'
        })
        .then((res: any) => {
            if (
                res.result == 0 &&
                res.retVal &&
                res.retVal.datas &&
                res.retVal.datas.length > 0
            ) {
                let data = res.retVal.datas[0]

                let infos = JSON.parse(data.infos);
                if (infos.length > 0) {

                    headerData.value = infos[0]
                    headerData.value.welcome = headerData.value.greetings
                }
            }
        });
}
const advertisementPage = () => {
    api
        .advertisementPage({
            hotelCode: config.hotelCode,
            hotelGroupCode: config.hotelGroupCode,
            clientTypes: channel.value,
            firstResult: 0,
            pageSize: 99,
            showLocation: '4'
        })
        .then((res: any) => {
            if (
                res.result == 0 &&
                res.retVal &&
                res.retVal.datas &&
                res.retVal.datas.length > 0
            ) {
                let data = res.retVal.datas[0]

                let infos = JSON.parse(data.infos);
                infos.forEach((item: any) => {
                    if (item.startTime == teamOrder.value.pageTitle) {
                        item.goodsType.forEach((type: string) => {
                            if (type == teamOrder.value.reserveList[0].orderType) {
                                if (item.goodsTags.length > 0) {
                                    item.goodsTags.forEach((type: string) => {
                                        if (teamOrder.value.theme == type || teamOrder.value.reserveList[0].orderType == 'SingleRoom') {
                                            // headerData.value = item

                                            headerData.value.imgUrl = item.imgUrl
                                            headerData.value.link = item.link
                                            if (item.startTime != '行中') {
                                                headerData.value.welcome = item.welcome
                                            }

                                        }
                                    })
                                } else {
                                    headerData.value.imgUrl = item.imgUrl
                                    headerData.value.link = item.link
                                    if (item.startTime != '行中') {
                                        headerData.value.welcome = item.welcome
                                    }

                                }
                            }
                        })
                    }

                })
            }
        });
};

const marketingPage = () => {
    let opt = {
        hotelGroupCode: config.hotelGroupCode,
        firstResult: 0,
        pageSize: 15,
        clientTypes: channel.value,
        // showLocation: '2'
    }

    api.marketingPage(opt).then((res: any) => {
        if (res.result == 0) {
            if (res.retVal && res.retVal.datas && res.retVal.datas.length > 0) {
                res.retVal.datas.forEach((item: any) => {
                    if (item.showLocation == '2') {

                        let infos = JSON.parse(item.infos)
                        if (infos && infos.length > 0) {
                            infos.forEach((info: any, i: number) => {
                                let adTravel = {
                                    id: info.id,
                                    title: info.title,
                                    link: info.link,
                                    desc: info.desc,
                                    items: []
                                }
                                adTravels.value.push(adTravel)
                                api.queryMarketingProducts({
                                    hotelGroupCode: config.hotelGroupCode,
                                    hotelCode: config.hotelCode,
                                    products: info.productChoose
                                }).then((res: any) => {
                                    res.retVal.forEach((item: any) => {
                                        if (item.pics) {
                                            item.pics = item.pics.split(",")[0]
                                        }
                                        if (item.productType == 'daily') {
                                            try {
                                                 item.payType = item.minPriceDto.payType.includes("INTEGRALCASH") ?
                                                    "mix" :
                                                    "money";
                                                item.price = item.minPriceDto.mixPrice || 0;
                                                item.credit = item.minPriceDto.mixCredit;
                                            } catch (error) {
                                                item.price = 0
                                            }
                                           
                                        }
                                    })
                                    adTravels.value[i].items = res.retVal
                                })
                            })

                            // adTravel.value.id = infos[0].id
                            // adTravel.value.title = infos[0].title
                            // adTravel.value.link = infos[0].link
                            // adTravel.value.desc = infos[0].desc
                            // adTravel.value.items = []

                        }
                    }
                    // if(item.showLocation=='4'){
                    // 	let infos = JSON.parse(item.infos)
                    // 	if (infos && infos.length > 0) {
                    // 		adTravel2.value.id = infos[0].id
                    // 		adTravel2.value.title = infos[0].title
                    // 		adTravel2.value.link = infos[0].link
                    // 		adTravel2.value.desc = infos[0].desc
                    // 		adTravel2.value.items = []
                    // 		api.queryMarketingProducts({
                    // 		hotelGroupCode: config.hotelGroupCode,
                    // 		hotelCode: config.hotelCode,
                    // 		products: infos[0].productChoose
                    // 		}).then((res : any) => {
                    // 		adTravel2.value.items = res.retVal
                    // 		})
                    // 	}
                    // }

                })
            }
        } else {
            jAlert3(res.msg, 2000)
        }
    })
}
const toPage = (url: any) => {
    if (!url) {
        return;
    }
    uni.navigateTo({
        url: url,
        fail: () => {
            uni.switchTab({
                url: url
            })
        }
    })
}
onLoad((options: any) => {
    if (options.scene) {
        let params = getUrlParams(decodeURIComponent(decodeURIComponent(options.scene)))
        if (params.teamNo) {
            teamNo.value = params.teamNo
        }

    }
})
onPullDownRefresh(()=>{
	getOrderList()
	if (!teamOrder.value.productCode) {
		marketingPage()
	} else {
		tripNavRef.value.updateData()
		noticeRef.value.updateData()
	}
})
onShow(() => {
    user = getStorage("user");

    if (!(user && user.memberId)) {
        // toLogin();
        return;
    } else {
        getOrderList()
        if (!teamOrder.value.productCode) {
            marketingPage()
        } else {
            tripNavRef.value.updateData()
			noticeRef.value.updateData()
        }

    }
})

onMounted(() => {
    // #ifdef MP 
    uni.getSystemInfo({
        success: (res: any) => {

            let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
            navHeight.value = menuButtonInfo.bottom + 22;
        },
        fail(err) {
            console.log(err);
        },
    });
    // #endif
})
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");

.index_ui {
    padding-bottom: calc(80px + constant(safe-area-inset-bottom));
    padding-bottom: calc(80px + env(safe-area-inset-bottom));

    ::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
        color: transparent;
    }

    .header {
        padding: 102px 16px 24px;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;

        .welcome {
            margin-top: 6px;
            font-size: 14px;
            line-height: 22px;
            color: #FFFFFF;
            opacity: 0.8;
        }

        &.no-trip {
            .header-bg {
                opacity: 1;

                .header-img {
                    filter: none;
                }

                &::after {
                    background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, #f8f8f8 100%);
                }
            }

            .header-box {
                border-radius: 12px;
                overflow: hidden;
                text-align: center;

                &::before {
                    position: absolute;
                    z-index: -1;
                    background: #fff;
                    content: '';
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                }

                &::after {
                    position: absolute;
                    z-index: -1;
                    opacity: 0.2;
                    content: '';
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    background-size: 40px 37.5px !important;

                    background-image: url(https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/btnBlack.png);
                }

                .name {
                    justify-content: center;
                    font-family: PingFang SC;
                    font-size: 24px;
                    font-style: normal;
                    font-weight: 500;
                    margin-top: 40px;
                    color: #000000;
                }

                .desc {
                    color: #808080;
                }

                .btn {
                    line-height: 48px;
                    width: 180px;
                    height: 48px;
                    margin: 32px auto 0;

                }
            }

        }

        &.trip-end {

            .header-box {
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.16);

                text-align: center;
                box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.16);

                .name {
                    margin-top: 40px;
                    color: #fff;
                    justify-content: center;
                    font-family: PingFang SC;
                    font-size: 24px;
                    font-style: normal;
                    font-weight: 500;

                }

                .desc {
                    color: #808080;
                }

                .btns {
                    margin-top: 32px;
                    display: flex;
                    justify-content: center;
                }

                .btn {
                    border: 0.5px solid #fff;
                    border-radius: 4px;
                    color: #fff;
                    line-height: 48px;
                    margin-right: 6px;
                    height: 48px;

                    width: 142px;

                }

                .order-btn {

                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-left: 6px;
                    border-radius: 4px;
                    height: 48px;
                    color: #000;
                    font-size: 16px;

                    background-color: #fff;

                    &::after {
                        content: '';
                        position: absolute;

                        left: 0;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        background-size: 40px 37.5px;
                        opacity: 0.2;

                        background-image: url(https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/btnBlack.png);

                    }
                }
            }

        }

        .header-bg {
            position: absolute;
            z-index: -1;
            height: 200%;
            width: 200%;
            left: 0;
            top: 0;
            opacity: 0.2;

            .header-img {
                width: 100%;
                height: 100%;
                filter: blur(10px);
            }

            &::after {
                content: "";
                width: 100%;
                height: 50%;
                position: absolute;
                left: 0;
                top: 0;

                background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 1) 100%);
                z-index: 1;

            }
        }

        .header-box {
            border-radius: 12px;
            padding: 20px;
            position: relative;
            z-index: 2;
            width: 100%;
            height: 68.8vw;
            box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.16);

            .img-bg {
                left: 0;
                top: 0;
                position: absolute;
                z-index: -1;
                height: 100%;
                width: 100%;
                border-radius: 12px;
                background: linear-gradient(180deg, rgba(0, 0, 0, 0.40) 0%, rgba(0, 0, 0, 0.00) 100%);
            }

            &.left {
                text-align: left;
            }

            .img {
                left: 0;
                top: 0;
                position: absolute;
                z-index: -2;
                height: 100%;
                width: 100%;
                border-radius: 12px;
            }

            .time-box {
                .time {
                    display: inline-block;
                    background: rgba(0, 0, 0, 0.32);
                    border-radius: 4px;
                    color: #FFFFFF;
                    font-size: 12px;
                    line-height: 12px;
                    padding: 4px;
                }

            }

            .name {
                display: flex;
                align-items: center;
                margin-top: 6px;
                font-family: 'Source Han Serif CN';
                font-style: normal;
                font-weight: 900;
                font-size: 24px;
                line-height: 36px;
                color: #FFFFFF;

                .iconfont {
                    margin-left: 4px;
                    font-weight: normal;
                }
            }

            .desc {
                margin-top: 6px;
                font-size: 14px;
                line-height: 22px;
                color: #FFFFFF;
                opacity: 0.8;
            }
        }

    }

    .nav-warp {

        position: relative;

        border-radius: 8px;

        .nav-list {
            padding: 8px 12px;
            display: flex;
            flex-wrap: wrap;

            .nav {

                // flex: 1;
                padding: 16px 0;
                min-width: 25%;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .iconfont {
                width: 24px;
                height: 24px;
                font-size: 20px;
            }

            .txt {
                color: #000000;
                font-size: 14px;
                line-height: 1;
                margin-top: 6px;
            }
        }
    }

    .product {
        padding-top: 8px;

        &:first-child {
            padding-top: 0;
        }

        .product-tl {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            font-size: 18px;
            line-height: 18px;
            padding: 24px 16px 12px;

            .more {
                display: flex;
                align-items: center;
                font-weight: normal;
                font-size: 12px;
            }

            .icon-a-16_youlajiantou_hei {
                color: #000;
                font-weight: normal;
            }
        }

        .product-scroll {
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;
            padding: 0 32rpx;

            width: 100%;

            .product-item {
                display: inline-block;
                margin-top: 12px;
                width: 44.3vw;
                border-radius: 8px;
                overflow: hidden;
                background: #fff;
                margin-left: 8px;

                &:first-child {
                    margin-left: 0;
                }

                .product-img {
                    width: 100%;
                    height: 44.27vw;

                    &.product-img-mini {
                        height: 33vw;
                    }

                    .img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }

                .product-info {
                    padding: 12px 12px 16px;
                    white-space: normal;

                    .product-name {
                        overflow: hidden;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        word-break: break-all;
                        -webkit-line-clamp: 1;
                        font-family: PingFangSC-Medium;
                        font-size: 16px;
                        color: #000000;
                        font-weight: bold;
                        line-height: 24px;
                    }

                    .product-desc {
                        margin-top: 4px;
                        padding: 4px;
                        font-size: 12px;
                        color: #A43127;
                        background: rgba(164, 49, 39, 0.12);
                        border-radius: 4px;
                        display: inline-block;
                    }

                    .product-bt {
                        margin-top: 12px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        .product-price {
                            font-family: 'Montserrat';
                            font-size: 16px;
                            color: #000000;
                            font-weight: 600;
                        }

                        .product-btn {
                            padding: 8px 12px;
                            font-size: 14px;
                            color: #FFFFFF;

                            border-radius: 4px;
                        }
                    }
                }

            }

        }
    }

    .all-trip-btn {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 32px 16px 0;
        padding: 0 16px;
        border-radius: 8px;
        overflow: hidden;
        color: #000;
        font-size: 16px;
        height: 68px;
        font-weight: bold;
        background-color: #fff;

        .icon-a-16_youlajiantou_hei {
            font-weight: normal;
        }

        &::after {
            content: '';
            position: absolute;

            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            background-size: 40px 37.5px;
            opacity: 0.2;

            background-image: url(https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/btnBlack.png);

        }
    }

}

.no-login-page {
    height: 100vh;
    position: relative;

    .loginBg {
        position: absolute;
        width: 100vw;
        height: 100vh;
        left: 0;
        top: 0;
        pointer-events: none;
        overflow: hidden;
    }

    .login-text {
        display: flex;
        align-items: center;
        position: absolute;
        top: 25%;
        left: 32px;
        color: #fff;
        font-size: 24px;

        .jiantou {
            margin-left: 10px;

            font-size: 20px;
        }

    }

    .login-desc {
        position: absolute;
        color: #fff;
        left: 32px;
        top: 25%;
        margin-top: 36px;
        opacity: 0.6;

    }
}
</style>
