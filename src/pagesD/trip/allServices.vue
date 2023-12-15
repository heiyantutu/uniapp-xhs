<template>
<!-- #ifdef MP -->
<coustom-head title="全部服务" nativeMode="true"> </coustom-head>
<!-- #endif -->
<div class="ui_allServices" v-if="!isTeamAjax">
    <div class="services-box" v-if="iconList0.length > 0">
        <div class="tl">贴心服务</div>
        <div class="nav-list">
            <div class="nav" v-for="(item, i) in iconList0" :key="i" @click="goModulePage(item)">
                <div :class="'iconfont ' + item.icon">
                    <div class="sureDrop" v-if="item.sureDrop">待确认</div>
                </div>
                <div class="txt">{{ item.name }}</div>
            </div>
        </div>
    </div>
    <div class="services-box" v-if="iconList1.length > 0">
        <div class="tl">行程服务</div>
        <div class="nav-list">
            <div class="nav" v-for="(item, i) in iconList1" :key="i" @click="goModulePage(item)">
                <div :class="'iconfont ' + item.icon">
                    <div class="drop" v-if="item.drop"></div>
                </div>
                <div class="txt">{{ item.name }}</div>
            </div>
        </div>
    </div>
    <div class="services-box" v-if="iconList2.length > 0">
        <div class="tl">入住服务</div>
        <div class="nav-list">
            <div class="nav" v-for="(item, i) in iconList2" :key="i" @click="goModulePage(item)">
                <div :class="'iconfont ' + item.icon" v-if="item.icon"></div>
                <img class="icon-img" :src="item.logo" v-else />
                <div class="txt">{{ item.name }}</div>
            </div>
        </div>
    </div>
</div>
<bottom-dialog ref="tipsHelp" title="行程顾问">
    <div class="consultant">
        <img src="" class="head-img" />
        <div class="career">顾问</div>
        <div class="name">{{ consultant.name }}</div>
        <div class="tips">行程有任何疑问或需求，都可以向我咨询。</div>
    </div>
    <div class="layer-footer">
        <div class="layer-btn baseBtn" @click="makePhoneCall(consultant.mobile)">
            拨打电话
        </div>
    </div>
</bottom-dialog>
<bottom-dialog ref="tripInfo" title="" maxDialog>
    <div class="trip-info-list">
        <div class="name">
            尊敬的{{ guest.name }}<template v-if="guest.sex == 1">先生</template><template v-else>女士</template>
        </div>
        <div class="trip-info-item">欢迎来到松赞，以下为临行信息。</div>

        <template v-for="(item, i) in reserveBeforeInfo.reserveBeforePersonalizes" :key="i">
            <template v-if="item.teamGuestId == guest.id && item.description">
                <div class="trip-info-tl">
                    {{ itemNames[item.itemName] }}
                </div>
                <div class="trip-info-item">
                    {{ item.description }}
                </div>
            </template>
        </template>
        <template v-if="
          reserveBeforeInfo.weathersDtos &&
          reserveBeforeInfo.weathersDtos.length > 0
        ">
            <div class="trip-info-tl">出行期间的天气预报及海拔</div>
            <div class="trip-info-item">
                <div class="trip-info-item-table">
                    <div class="tr">
                        <div class="th">酒店</div>
                        <div class="th">天气</div>
                        <div class="th">海拔</div>
                    </div>
                    <template v-for="(item,i) in reserveBeforeInfo.weathersDtos[0].weathersDtos" :key="i">
						<div class="tr" v-if="item.hotelDesc">
                    
                            <div class="td">{{ item.hotelDesc }}</div>
                            <div class="td">
                                <template v-if="item.weatherFcEntity">↑{{ item.weatherFcEntity.low }} - ↓{{item.weatherFcEntity.high }}°C</template>
                            </div>
                            <div class="td">
                                <template v-if="item.altitude">{{ item.altitude }}m</template>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </template>
        <template v-if="reserveBeforeInfo.dressing">
            <div class="trip-info-tl">穿衣&建议</div>
            <div class="trip-info-item">
                {{ reserveBeforeInfo.dressing }}
            </div>
        </template>

        <template v-if="reserveBeforeInfo.health">
            <div class="trip-info-tl">高原反应与健康</div>
            <div class="trip-info-item">
                {{ reserveBeforeInfo.health }}
            </div>
        </template>
        <template v-if="reserveBeforeInfo.taboo">
            <div class="trip-info-tl">文化习惯及禁忌</div>
            <div class="trip-info-item">
                {{ reserveBeforeInfo.taboo }}
            </div>
        </template>
        <template v-if="reserveBeforeInfo.carInfo">
            <div class="trip-info-tl">路况&用车</div>
            <div class="trip-info-item">
                {{ reserveBeforeInfo.carInfo }}
            </div>
        </template>
        <template v-if="reserveBeforeInfo.roomDiningDesc">
            <div class="trip-info-tl">住宿餐饮注意事项</div>
            <div class="trip-info-item">
                {{ reserveBeforeInfo.roomDiningDesc }}
            </div>
        </template>
        <template v-if="
          reserveBeforeInfo.beforeInfoHotelsDtos &&
          reserveBeforeInfo.beforeInfoHotelsDtos.length > 0
        ">
            <div class="trip-info-tl">酒店所在区域最近医院</div>
            <div class="trip-info-item">
                <div class="trip-info-item-table table-big">
                    <div class="tr">
                        <div class="th">酒店</div>
                        <div class="th">医院</div>
                    </div>
                    <template v-for="(item,i) in reserveBeforeInfo.beforeInfoHotelsDtos" :key="i">
                        <div class="tr" v-if="item.nearestHospital">
                            <div class="td">{{item.hotelDesc}}</div>
                            <div class="td">{{item.nearestHospital}}</div>

                        </div>
                    </template>
                </div>
            </div>
        </template>
    </div>
</bottom-dialog>
<bottom-dialog ref="serviceTeam" title="服务团队">
    <div class="serviceTeamList">
        <div class="item" v-for="(item, index) in listDriverButler" :key="index" @click="toDriverButler(item)">
            <div class="head">
                <img :src="item.mainPic" mode="aspectFill" v-if="item.mainPic" class="head-img" />
                <img src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/head-def.png" class="head-img" v-else />
            </div>
            <div class="info">
                <div class="info-head">
                    <div class="left-part">
                        <div class="career" v-if="item.personType == 'HOUSEKEEP'">
                            管家
                        </div>
                        <div class="career" v-else-if="item.personType == 'DRIVER'">
                            司机
                        </div>
                        <div class="career" v-else-if="item.personType == 'GW'">顾问</div>
                        <div class="name">
                            {{ item.name
                }}<i class="iconfont icon-a-12_youlajiantou_hui" v-if="item.personType != 'GW'"></i>
                        </div>
                    </div>
                    <div class="iconfont icon-a-28_dianhua" @click.stop="makePhoneCall(item.mobile)" v-if="item.mobile"></div>
                </div>

                <div class="desc">
                    {{ item.biographicalNotes }}
                </div>
            </div>
        </div>
    </div>
</bottom-dialog>
<kf-dialog ref="kf" title="如需取消订单请联系客服"></kf-dialog>
<bottom-dialog ref="timeSelect" title="预计到店时间">
    <div class="arriveChoose">
        <p class="tips">
            <i class="icon iconfont icon-a-12_tishi"></i>房间整晚保留，12:00前到店可能需要等房
            <!-- ，如需接机请联系酒店前台 <div class="phone">400-0000-830<i class="iconfont icon-a-12_youlajiantou_hei"></i> </div>-->
        </p>
        <picker-view indicator-style="height: 56px;" style="width: 100%; height: 280px" :value="chooseTimeIndex" @change="bindChangeTime" mask-class="pickerMask">
            <picker-view-column>
                <view v-for="(time, timeIndex) in timeList" :key="timeIndex" style="line-height: 56px; text-align: center">
                    {{ time.displayTime }}
                </view>
            </picker-view-column>
        </picker-view>
        <div class="fixedBottom">
            <div class="fixedBottomBtn" @click="chooseTime">完成</div>
        </div>
    </div>
</bottom-dialog>
<center-dialog ref="checkIn">
    <div class="check_wrap">
        <div class="check_title">无法办理</div>
        <div class="tips">需在酒店2公里内才可办理入住</div>
        <div class="check-footer">
            <div class="check-btn" @click="closeCheck">我知道了</div>
        </div>
    </div>
</center-dialog>
</template>

<script setup lang="ts">
import {
    defineComponent,
    ref,
    onMounted,
    watch
} from "vue";
import bottomDialog from "@/components/bottomDialog.vue";
import centerDialog from "@/components/centerDialog.vue";
import kfDialog from "@/components/kfDialog.vue";
import UmengSDK from "@/utils/umengAdaptor.js";
import {
    goPage
} from "@/utils/utils";
import {
    getStorage,
    removeStorage,
    setStorage
} from "@/utils/wxuser";
import api from "@/utils/api";
import {
    jAlert3
} from "@/base/jAlert/jAlert";
import dayjs from "dayjs";
import {
    onLoad,
    onShow
} from "@dcloudio/uni-app";
import coustomHead from "@/components/coustomHead.vue";
import useScroll from "@/hooks/useScroll";
const {
    scrollTop,
    onPageScroll
} = useScroll();
let navigationBarHeight = ref(40);
let user = getStorage("user");
let config = getStorage("config");
const iconList0 = ref([{
        name: "松赞相册",
        icon: "icon-a-20_lvhangxiangce_hei",
        type: "album",
    },
    {
        name: "行程问卷",
        icon: "icon-a-20_hangchengwenjuan1",
        type: "questionnaire",
    },
]);
const iconList1 = ref([{
        name: "出行提示",
        icon: "icon-a-20_linhangxinxi",
        type: "tips",
    },
    {
        name: "接送需求",
        icon: "icon-a-20_jiesonganpai1",
        type: "shuttle",
    },
    {
        name: "出行偏好",
        icon: "icon-a-20_chuhangpianhao",
        type: "preference",
    },
    {
        name: "行程顾问",
        icon: "icon-a-20_hangchengbangzhu1",
        type: "help",
    },
    {
        name: "行李吊牌",
        icon: "icon-a-20_hanglipai",
        type: "baggage",
    },
    {
        name: "服务团队",
        icon: "icon-a-20_tuanduijianli1",
        type: "team",
    }
    
]);
const iconList2: any = ref([{
    name: "移动入住",
    icon: "icon-a-20_yidongruzhu",
    type: "checkIn",
}]);
const checkIn = ref();
const teamOrder: any = ref({});
const teamNo = ref("");
const orderNo = ref("");
const isAjax = ref(false);
const guest: any = ref({});
const tripInfo = ref();
const serviceTeam = ref();
const tipsHelp = ref();
const kf = ref();
const listDriverButler = ref([]);
const consultant: any = ref({});
const reserveBeforeInfo: any = ref({});
const arrivalFrom = ref("");
const arriveTime = ref("");
const fromDate = ref("");
const chooseTimeIndex: any = ref([0]);
const timeList: any = ref([]);
const timeSelect = ref();
const otaChannel = ref("WECHAT");
const hotelFromDate = ref(dayjs().format("YYYY-MM-DD"));
const hotelToDate = ref(dayjs().add(1, "days").format("YYYY-MM-DD"));
const memberNo = ref("");
const mobile = ref("");
const masterInfo: any = ref({});
const isTeamAjax = ref(true);
const hotelMsg: any = ref({});
let hotelList: any = ref([]);
const currentHotel: any = ref({});
const questionnaireLink = ref("");
const checkHotelCode: any = ref("");
const hotelDesc = ref("");
const orderType = ref("")
const itemNames = ref({
    app: "实用app",
    bookMovie: "书籍与电影推荐",
    fightInfo: "推荐航班信息",
    kindReminder: "温馨提示",
});
watch(() => isTeamAjax.value, (newVal, oldVal) => {
    if(!isTeamAjax.value){
        uni.hideLoading()
    }
})
const toDriverButler = (item: any) => {
    if (item.personType != "GW") {
        goPage("/pagesD/trip/houseKeep?code=" + item.code);
    }
};
const dateFormat = (val: string) => {
    return dayjs(val).format("MM-DD");
};
const batchQueryShopConfig = () => {
    api
        .batchQueryShopConfig({
            hotelGroupCode: config.hotelGroupCode,
            hotelCode: config.hotelCode,
            configItem: "questionnaire",
        })
        .then((res: any) => {
            res.retVal.forEach((item: any) => {
                if (item.configItem == "questionnaire") {
                    if (item.itemValue) {
                        questionnaireLink.value = item.itemValue;
                    }
                }
            });
        });
};
const querySaveTag = () => {
    let query: any = {
        hotelCode: config.hotelCode,
        hotelGroupCode: config.hotelGroupCode,
        firstResult: 0,
        pageSize: 100,
        channel: "WECHAT",
        memberId: user.memberId,
        guestId: guest.value.guestId
    };

    api
        .interfaceTransfer({
            config: {
                interfaceFrom: "member",
                interfaceMethod: "/guest/v1/queryGuestTag",
                hotelGroupCode: config.hotelGroupCode,
                interfaceType: "POST",
            },
            query,
        })
        .then((res: any) => {
            if (res.result == 1) {
                if (res.retVal.result == 0) {

                    if (
                        res.retVal.retVal.totalRows == 0) {
                        iconList1.value.forEach((item: any, i: number) => {
                            if (item.type == 'preference') {
                                item.drop = true
                            }
                        })
                    } else {
                        iconList1.value.forEach((item: any, i: number) => {
                            if (item.type == 'preference') {
                                item.drop = false
                            }
                        })
                    }

                }
            }
        });
};
const showOrder = (cb: any) => {
    api
        .showOrder({
            orderNo: teamNo.value,
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
                hotelDesc.value = res.retVal.hotelDescript
                teamOrder.value.productDesc = res.retVal.hotelDescript
                teamOrder.value.tripTime = `${dayjs(teamOrder.value.beginDate).format('M月DD日')}-${dayjs(teamOrder.value.endDate).format('M月DD日')}丨共${dayjs(teamOrder.value.endDate).diff(teamOrder.value.beginDate, 'day')}晚`
                cb && cb()
            } else {
                jAlert3(res.msg);
            }
        });
};
const getTeamDetail = () => {
    hotelList.value = [];
    api
        .interfaceTransfer({
            query: {
                mobile: user.mobile,
                unitCode: config.hotelGroupCode,
            },
            config: {
                interfaceType: "GET",
                interfaceModule: "GC_TRAVEL_ORDER",
                interfaceMethod: `/api/team/order/detail/${teamNo.value}`,
                interfaceFrom: "GC",
                hotelGroupCode: config.hotelGroupCode,
            },
        })
        .then((res: any) => {
            if (res.result == 1 && res.retVal.result == 0) {
                let teamItineraries =
                    res.retVal.retVal.teamItineraryInfos[0].teamItineraries;
                let hotelCode = "";
                for (var i in teamItineraries) {
                    if (
                        dayjs(teamItineraries[i].bizDate).format("YYYY-MM-DD") ==
                        dayjs().format("YYYY-MM-DD")
                    ) {
                        if (
                            teamItineraries[i].teamRsvSrcs &&
                            teamItineraries[i].teamRsvSrcs.length > 0
                        ) {
                            hotelCode = teamItineraries[i].teamRsvSrcs[0].hotelCode;
                            hotelDesc.value = teamItineraries[i].teamRsvSrcs[0].hotelDesc;
                        }
                    }
                }

                teamOrder.value = res.retVal.retVal.teamOrder;
                orderType.value =  teamOrder.value.orderType;
                res.retVal.retVal.guests.forEach((item: any) => {
                    if (item.mobile == user.mobile) {
                        guest.value = item;
                        res.retVal.retVal.reserveOrders.forEach((order: any) => {
                            if (order.orderNo == item.orderNo) {
                                orderNo.value = order.orderNo;
                                memberNo.value = order.memberId;
                                mobile.value = order.mobile;
                            }
                        });
                    }
                });

                if (guest.value.idNo) {
                    queryMasterInfo();
                    getHotelCheck();
                }else{
                    isTeamAjax.value = false;
                }
                getAdjustList()
                querySaveTag()
                if (res.retVal.retVal.reserveBeforeInfo) {
                    reserveBeforeInfo.value = res.retVal.retVal.reserveBeforeInfo;
                }
                reserveBeforeInfo.value.weathersDtos = res.retVal.retVal.weathersDtos;
                reserveBeforeInfo.value.beforeInfoHotelsDtos =
                    res.retVal.retVal.beforeInfoHotelsDtos;

                let team =
                    res.retVal.retVal.teamItineraryInfos[0].teamItineraries || [];
                team.forEach((item: any) => {
                    if (item.actives && item.actives.length > 0) {
                        item.actives.forEach((active: any) => {
                            if (item.activesTl) {
                                item.activesTl += " - " + active.activeName;
                            } else {
                                item.activesTl = active.activeName;
                            }
                        });
                    }

                    item.bizDateF = dayjs(teamOrder.value.beginDate)
                        .add(item.dayNum - 1, "day")
                        .format("M月D日");
                    item.moon = dayjs(teamOrder.value.beginDate)
                        .add(item.dayNum - 1, "day")
                        .format("M");
                    item.days = dayjs(teamOrder.value.beginDate)
                        .add(item.dayNum - 1, "day")
                        .format("D");
                    if (item.teamRsvSrcs.length > 0) {
                        let hotel = item.teamRsvSrcs[0];
                        hotel.arrDateF = dayjs(hotel.arrDate).format("M月D日");
                        hotel.depDateF = dayjs(hotel.depDate).format("M月D日");
                        hotelList.value.push(hotel);
                    }
                });
            } else {
                jAlert3(res.retVal.msg || res.msg);
            }
        });
};
const getHotelCheck = () => {
    api
        .interfaceTransfer({
            query: {
                teamNo: teamNo.value,
                idNo: guest.value.idNo,
                // arr: "2023-11-01",
                arr: dayjs().format("YYYY-MM-DD"),
            },
            config: {
                interfaceType: "GET",
                interfaceModule: "GC_TRAVEL_ORDER",
                interfaceMethod: "/api/reserve/order/queryCheckInHotel",
                interfaceFrom: "GC",
                hotelGroupCode: config.hotelGroupCode,
            },
        })
        .then((res: any) => {
            if (res.result == 1 && res.retVal.result == 0) {
                if (res.retVal.retVal.length > 0) {
                    checkHotelCode.value = res.retVal.retVal;
                }
            }
        })
        .finally(function (e: any) {
            setStorage("checkHotelCode", checkHotelCode.value);
            getHotelList();
        });
};
const getHotelList = () => {
    var findHotelParameter = {
        fromDate: "",
        toDate: "",
        otaChannel: "WECHAT",
        hotelGroupCodes: config.hotelGroupCode,
        cardLevel: "",
        hasPriceMin: "T",
        clientLatitude: "",
        clientLongitude: "",
        position: "",
        positionValue: "",
        keyWord: "",
        radius: "",
        pageSize: 999,
        firstResult: 0,
        cardType: "",
        appid: config.appid,
        componentAppid: config.componentAppid,
        memberNo: "",
    };

    api
        .findHotel(findHotelParameter)
        .then((response: any) => {
            if (response.result == 1) {
                hotelList.value.forEach((hotel: any) => {
                    response.retVal.resultInfos.forEach((n: any, i: number) => {
                        if (hotel.hotelCode == n.code) {
                            hotel.extraLogo = n.extraLogo;
                            hotel.phone = n.phone;
                            hotel.pictures = n.pictures;
                            hotel.hotelLatitude = n.hotelLatitude;
                            hotel.hotelLongitude = n.hotelLongitude;
                        }
                    });
                });
                currentHotel.value = hotelList.value.find((citem: any) => {
                    return citem.hotelCode == checkHotelCode.value;
                });
            }
        })
        .catch(function (error: any) {
            console.log(error);
        })
        .finally(function (e: any) {
            hotelMsg.value = currentHotel.value;
            // setStorage("currentHotel", currentHotel.value);
        });
};
const makePhoneCall = (phone: string) => {
    if (!phone) {
        jAlert3("暂无手机号");
        return;
    }
    uni.makePhoneCall({
        phoneNumber: phone,
    });
};
const queryMasterInfo = () => {
    api
        .interfaceTransfer({
            query: {
                unitCode: config.hotelGroupCode,
                teamNo: teamNo.value,
                idNo: guest.value.idNo,
            },
            config: {
                interfaceType: "GET",
                interfaceModule: "GC_TRAVEL_ORDER",
                interfaceMethod: "/api/team/order/findHotelMasterInfoByTeamNo",
                interfaceFrom: "GC",
                hotelGroupCode: config.hotelGroupCode,
            },
        })
        .then((res: any) => {
            if (res.result == 1 && res.retVal.result == 0) {
                if (res.retVal.retVal.length > 0) {
                    masterInfo.value = res.retVal.retVal[0];
                    listHotelServiceBySta(masterInfo.value.hotelCode);
                }else{
                    isTeamAjax.value = false;
                }
            } else {
                // jAlert3(res.retVal.msg || res.msg)
            }
        });
};
const queryMasterInfoAll = () => {
    api
        .interfaceTransfer({
            query: {
                unitCode: config.hotelGroupCode,
                teamNo: teamNo.value,
                idNo: guest.value.idNo,
            },
            config: {
                interfaceType: "GET",
                interfaceModule: "GC_TRAVEL_ORDER",
                interfaceMethod: "/api/team/order/findHotelByTeamNo",
                interfaceFrom: "GC",
                hotelGroupCode: config.hotelGroupCode,
            },
        })
        .then((res: any) => {
            if (res.result == 1 && res.retVal.result == 0) {
                uni.setStorageSync(
                    "crossHotelList",
                    res.retVal.retVal.map((i: any) => ({
                        hotelCode: i.hotelCode,
                        masterId: i.masterId,
                    }))
                );
                goPage(`/pagesG/order/list/index`);
            } else {
                jAlert3(res.retVal.msg || res.msg);
            }
        });
};
const listHotelServiceBySta = (hotelCode: any) => {
    api
        .listHotelServiceBySta({
            hotelGroupCode: config.hotelGroupCode,
            hotelCode: hotelCode,
            sta: "N",
        })
        .then((res: any) => {
            isTeamAjax.value = false;
            res.retVal.forEach((item: any) => {
                item.type = "hotelService";
                item.name = item.serviceName;
            });
            iconList2.value = [...res.retVal, ...iconList2.value];
            iconList2.value.push({
                name: "服务记录",
                icon: "icon-a-20_fuwudan",
                type: "serviceRecord",
            })
        });
};
const listDriverButlerDto = (cb: any) => {
    if (isAjax.value) {
        return;
    }
    isAjax.value = true;
    api
        .interfaceTransfer({
            query: {
                teamNo: teamNo.value,
                unitCode: config.hotelGroupCode,
            },
            config: {
                interfaceType: "GET",
                interfaceModule: "GC_TRAVEL_ORDER",
                interfaceMethod: `/api/team/order/listDriverButlerDto`,
                interfaceFrom: "GC",
                hotelGroupCode: config.hotelGroupCode,
            },
        })
        .then((res: any) => {
            isAjax.value = false;
            if (res.result == 1 && res.retVal.result == 0) {
                listDriverButler.value = res.retVal.retVal;
                let mainConsultant:any = {}
                let partConsultant:any = {}
                listDriverButler.value.forEach((item: any) => {
                    if (item.personType == "GW"){
                        mainConsultant = item
                    }
                    if (item.isPartButler == "T"){
                        partConsultant = item
                    }
                    if (item.personType == "GW"&&item.isHostHousekeep=='T') {
                        consultant.value = item;
                    }
                });
                if(!consultant.value.code){
                   if(mainConsultant.code){
                     consultant.value = mainConsultant
                   }else{
                     consultant.value = partConsultant
                   }
                }
                cb && cb();
            } else {
                jAlert3(res.retVal.msg || res.msg);
            }
        });
};
const goModulePage = (item: any) => {
    if (item.type == "questionnaire") {
        goPage(questionnaireLink.value);
    }
    if (item.type == "tips") {
        tripInfo.value.showDialog();
    }
    if (item.type == "shuttle") {
        goPage(
            `/pagesD/trip/takeInfo?orderNo=${orderNo.value}&memberNo=${memberNo.value}&mobile=${mobile.value}`
        );
    }
    if (item.type == "preference") {

        goPage(`/pagesA/member/travelPreference?type=guest&guestId=${guest.value.guestId}&orderNo=${orderNo.value}&orderType=${orderType.value}`)
				
    }
    if (item.type == "trip") {
        goPage("/pagesD/trip/tripDetail?teamNo=" + teamNo.value);
    }
    if (item.type == "baggage") {
        goPage(
            `/pagesD/baggage/addBaggage?teamNo=${teamNo.value}&guestId=${guest.value.id}&guestName=${guest.value.name}&memberGuestId=${guest.value.guestId}`
        );
    }
    if (item.type == "serviceRecord") {
        if (guest.value.idNo) {
            queryMasterInfoAll();
        } else {
            removeStorage("crossHotelList");
            goPage(`/pagesG/order/list/index`);
        }
    }
    if (item.type == "hotelService") {
        if (item.link.indexOf("?") != -1) {
            goPage(
                `${item.link}&masterId=${masterInfo.value.masterId}&areaCode=${masterInfo.value.rmno}&name=${masterInfo.value.name}&serviceName=${item.serviceName}&serviceItemCode=${item.serviceItemCode}&pmsId=${masterInfo.value.pmsId}&floor=${masterInfo.value.floor}&floorDesc=${masterInfo.value.floorDesc}&building=${masterInfo.value.building}&hotelCode=${masterInfo.value.hotelCode}&hotelDesc=${hotelDesc.value}`
            );
        } else {
            goPage(
                `${item.link}?masterId=${masterInfo.value.masterId}&areaCode=${masterInfo.value.rmno}&name=${masterInfo.value.name}&serviceName=${item.serviceName}&serviceItemCode=${item.serviceItemCode}&pmsId=${masterInfo.value.pmsId}&floor=${masterInfo.value.floor}&floorDesc=${masterInfo.value.floorDesc}&building=${masterInfo.value.building}&hotelCode=${masterInfo.value.hotelCode}&hotelDesc=${hotelDesc.value}`
            );
        }
    }
    if (item.type == "checkIn") {
        if (hotelMsg.value) {
            getLocation();
        } else {
            jAlert3('暂无可办理入住酒店');
        }
        // if (item.type != "checkIn") {
        //   uni.showModal({
        //     title: "无法办理",
        //     content: "需在酒店2公里内才可办理入住",
        //     showCancel: false,
        //     confirmText: "我知道了",
        //     confirmColor: "#000000",
        //   });
        // } else {
        //   goPage(`/pagesD/mobileCheckIn/checkIn?hotelCode=`);
        // }
    }
    if (item.type == "contact") {
        kf.value.showDialog();
    }
    if (item.type == "album") {
        setStorage("teamInfo", {
            guestId: guest.value.id,
            guestName: guest.value.name,
            teamNo: teamOrder.value.teamNo,
            teamName: teamOrder.value.teamName,
            teamBeginTime: teamOrder.value.beginDate,
            teamEndTime: teamOrder.value.endDate,
        });
        goPage(
            "/pagesD/trip/album?teamNo=" + teamNo.value + "&guestId=" + guest.value.id
        );
    }
    if (item.type == "hotelAlbum") {
        goPage(`/pagesD/trip/hotelAlbumDetail?name=${teamOrder.value.productDesc}`);
    }
    if (item.type == "all") {
        goPage(
            `/pagesD/trip/allServices?teamNo=${teamNo.value}&guestId=${guest.value.id}`
        );
    }
    if (item.type == "help") {
        if (listDriverButler.value.length == 0) {
            listDriverButlerDto(() => {
                makePhoneCall(consultant.value.mobile);
            });
        } else {
            makePhoneCall(consultant.value.mobile);
        }
        // tipsHelp.value.showDialog();
    }
    if (item.type == "team") {
        if (listDriverButler.value.length == 0) {
            listDriverButlerDto(() => {
                serviceTeam.value.showDialog();
            });
        } else {
            serviceTeam.value.showDialog();
        }
    }
    if (item.type == "departureTime") {
        createArriveTime();
        timeSelect.value.showDialog();
    }
    if (item.type == 'extend') {
        goPage(`/pagesC/order/hotel?hotelCode=${teamOrder.value.hotelCode}&fromDate${hotelFromDate.value}&toDate=${hotelToDate.value}&otaChannel=${otaChannel.value}`)
    }
    if(item.type =='tripChange'){
         goPage(`/pagesD/trip/tripChange?teamNo=${teamNo.value}`)
    }
};

const getLocation = () => {
    let that = this;
    // 获取用户是否开启 授权获取当前的地理位置、速度的权限。
    uni.getSetting({
        success(res) {
            console.log(res);

            // 如果没有授权
            if (!res.authSetting["scope.userLocation"]) {
                // 则拉起授权窗口
                uni.authorize({
                    scope: "scope.userLocation",
                    success() {
                        //点击允许后--就一直会进入成功授权的回调 就可以使用获取的方法了
                        uni.getLocation({
                            type: "wgs84",
                            success: function (res) {
                                // console.log(res);
                                // console.log("当前位置的经度：" + res.longitude);
                                // console.log("当前位置的纬度：" + res.latitude);
                                checkPointCustomize(res);
                            },
                            fail(error) {
                                console.log("失败", error);
                            },
                        });
                    },
                    fail(error) {
                        //点击了拒绝授权后--就一直会进入失败回调函数--此时就可以在这里重新拉起授权窗口
                        console.log("拒绝授权", error);

                        uni.showModal({
                            title: "提示",
                            content: "若点击不授权，将无法使用位置功能",
                            cancelText: "不授权",
                            cancelColor: "#999",
                            confirmText: "授权",
                            confirmColor: "#f94218",
                            success(res) {
                                console.log(res);
                                if (res.confirm) {
                                    // 选择弹框内授权
                                    uni.openSetting({
                                        success(res) {
                                            console.log(res.authSetting);
                                        },
                                    });
                                } else if (res.cancel) {
                                    // 选择弹框内 不授权
                                    console.log("用户点击不授权");
                                }
                            },
                        });
                    },
                });
            } else {
                // 有权限则直接获取
                uni.getLocation({
                    type: "wgs84",
                    success: function (res) {
                        checkPointCustomize(res);
                        // that.x = res.longitude;
                        // that.y = res.latitude;
                    },
                    fail(error) {
                        uni.showToast({
                            title: "请勿频繁调用！",
                            icon: "none",
                        });
                        console.log("失败", error);
                    },
                });
            }
        },
    });
};
const checkPointCustomize = (item: any) => {
    var obj = {
        hotelCode: hotelMsg.value.hotelCode,
        hotelGroupCode: hotelMsg.value.hotelGroupCode,
        checkPointLongitude: item.longitude,
        checkPointLatitude: item.latitude,
        anoCheckPointLongitude: hotelMsg.value.hotelLongitude,
        anoCheckPointLatitude: hotelMsg.value.hotelLatitude,
        circleRadius: 2000,
    };
    api.checkPointCustomize(obj).then((res: any) => {
        // goPage(`/pagesD/mobileCheckIn/checkIn?hotelCode=${hotelMsg.value.hotelCode}&mobile=${user.mobile}&teamNo=${teamOrder.value.teamNo}`);
        // goPage(`/pagesD/mobileCheckIn/checkIn?hotelCode=${config.hotelCode}&mobile=${user.mobile}&teamNo=${teamNo.value}`);
        if (res.result == 1) {
            goPage(
                `/pagesD/mobileCheckIn/checkIn?hotelCode=${config.hotelCode}&mobile=${user.mobile}&teamNo=${teamNo.value}`
            );
        } else {
            checkIn.value.showDialog();
            // goPage(`/pagesD/mobileCheckIn/checkIn?hotelCode=${config.hotelCode}&mobile=${user.mobile}&teamNo=${teamNo.value}`);
            // uni.showModal({
            //   title: "无法办理",
            //   content: "需在酒店2公里内才可办理入住",
            //   showCancel: false,
            //   confirmText: "我知道了",
            //   confirmColor: "#000000",
            // });
            // jAlert3(res.msg);
        }
    });
};
const closeCheck = () => {
    checkIn.value.hideDialog();
};
const createArriveTime = () => {
    var times: any = [];
    let startTime = Number(arrivalFrom.value.split(":")[0]) || 12;
    let count = 25 - startTime;
    for (let i = 0; i < count; i++) {
        var hour: number | string = startTime + i;
        if (hour < 10) {
            hour = `0${hour}`;
        }
        times.push(`${fromDate.value} ${hour}:00`);
    }
    for (let j = 0; j < times.length; j++) {
        var canTap = true;
        if (dayjs(times[j]).isBefore(dayjs())) {
            canTap = false;
        }
        times[j] = {
            canTap: canTap,
            time: times[j],
            isTap: false,
            displayTime: times[j].split(" ")[1],
            chooseTime: times[j].split(" ")[1],
        };
    }
    timeList.value = times;
    console.log(timeList.value);
    setDefaultArrayTime();
};
const bindChangeTime = (e: any) => {
    chooseTimeIndex.value = e.detail.value;
};
const chooseTime = () => {
    let [index] = chooseTimeIndex.value;
    arriveTime.value = timeList.value[index].chooseTime;
    timeSelect.value.hideDialog();
};
const setDefaultArrayTime = () => {
    timeList.value.forEach(function (m: any, j: number) {
        if (arriveTime.value) {
            return false;
        }
        if (m.canTap) {
            m.isTap = true;
            arriveTime.value = m.chooseTime;
            setTimeout(() => {
                chooseTimeIndex.value = [j];
            }, 0);
        }
    });
};
const listGuestLinkExtraInfoWithMemberIdOrOpenId = (cb: any) => {
    api.listGuestLinkExtraInfoWithMemberIdOrOpenId({
        channel: 'WECHAT',
        hotelGroupCode: config.hotelGroupCode,
        hotelCode: config.hotelCode,
        memberId: user.memberId,
        openIdType: 'WECHAT'

    }).then((res: any) => {
        if (res.result == 1) {
            if (res.retVal.result == 0) {
                res.retVal.retVal.forEach((item: any) => {
                    if (user.mobile == item.mobile) {
                        guest.value.guestId = item.guestId
                    }

                })
                cb && cb()
            }

        }
    })
}
const getAdjustList = () => {

    api.interfaceTransfer({
            query: {
                "unitCode": config.hotelGroupCode,
                "phone":  user.mobile,
                "teamNo":  teamNo.value
            },
            config: {
                "interfaceType": "GET",
                "interfaceModule": "GC_TRAVEL_ORDER",
                "interfaceMethod": `/api/adjustCustomer/list`,
                "interfaceFrom": "GC",
                "hotelGroupCode": config.hotelGroupCode
            }
        })
        .then((res: any) => {
            if (res.result == 1 && res.retVal.result == 0) {
                res.retVal.retVal = res.retVal.retVal.filter((item:any) => (item.adjustSta !== "S"&&item.adjustSta !== "W"&&item.adjustSta !== "M"&&item.adjustSta !== "X"));
                if (res.retVal.retVal.length > 0) {
                    let needSure = false
                    res.retVal.retVal.forEach((item:any)=>{
                        if(item.adjustSta!='X'){
                            if(item.isRsvMan=='T'){
                                if(item.adjustSta=='U'){
                                    item.guestDtos.forEach((guest:any)=>{
                                       if(guest.confirmSta=='WAIT'&&guest.orderNo == orderNo.value){
                                            needSure = true
                                        }
                                    })
                                }
                            }else{
                                item.guestDtos.forEach((guest:any)=>{
                                    if(guest.guestPhone==user.mobile){
                                        if(guest.confirmSta=='WAIT'){
                                            needSure = true
                                        }
                                    }
                                })
                            }
                        }
                        
                    })
                    
                    iconList0.value.forEach((item:any)=>{
                        if(item.type=='tripChange'){
                            if(needSure){
                                item.sureDrop = true
                            }else{
                                item.sureDrop = false
                            }
                            
                        }
                    })
                    
                } 
            }

        })
}
onLoad((options: any) => {
    if (options.teamNo) {
        teamNo.value = options.teamNo;
    }
    if (options.orderType) {
        orderType.value = options.orderType;
    }

    // hotelMsg.value = getStorage("currentHotel");
});
onShow(() => {
    if (guest.value.guestId) {
        querySaveTag()
    }
    if(orderNo.value){
        getAdjustList()
    }
    
})
onMounted(() => {
    uni.showLoading({
        title: "加载中",
    });
    uni.getSystemInfo({
        success: (res) => {
            navigationBarHeight.value =
                (res.statusBarHeight || 0) + navigationBarHeight.value;
        },
        fail(err) {
            console.log(err);
        },
    });
    batchQueryShopConfig();
    if (orderType.value == 'SingleRoom') {
        iconList1.value = [{
                name: '出行偏好',
                icon: 'icon-a-20_chuhangpianhao',
                type: 'preference'
            }, {
                name: '离店时间',
                icon: 'icon-a-20_lidianshijian',
                type: 'departureTime'
            }, {
                name: '松赞相册',
                icon: 'icon-a-20_lvhangxiangce_hei',
                type: 'hotelAlbum'
            }, {
                name: '联系酒店',
                icon: 'icon-a-20_dianhua',
                type: 'contact'
            },
            {
                name: '续住',
                icon: 'icon-a-20_xuzhu',
                type: 'extend'
            }
           
        ]
        iconList2.value = []
        showOrder(() => {
            if (teamOrder.value.guestList) {
                teamOrder.value.guestList.forEach((item: any) => {
                    if (item.mobile == user.mobile) {
                        guest.value = item
                    }
                })
                if (guest.value.idNo) {
                    queryMasterInfo()
                }else{
                    isTeamAjax.value = false;
                }
                listGuestLinkExtraInfoWithMemberIdOrOpenId(() => {
                    querySaveTag()
                })
                
            }
        })
    } else {
        iconList0.value.push(
             {
                name: "行程变更",
                icon: "icon-a-20_hangchengbiangeng",
                type: "tripChange",
            }
        )
 
        getTeamDetail();
    }

});
</script>

<style lang="less" scoped>
.ui_allServices {
    background: #f8f8f8;
    padding: 4px 16px 30px;

    .services-box {
        margin-top: 12px;
        padding: 12px 11px;
        background: #fff;
        border-radius: 8px;

        .tl {
            font-size: 16px;
            font-style: normal;
            font-weight: 500;
        }
    }

    .nav-list {
        margin-top: 16px;
        display: flex;
        flex-wrap: wrap;

        &.center {
            justify-content: space-around;
        }

        .nav {

            // flex: 1;
            padding: 12px 0;
            min-width: 25%;
            display: flex;
            flex-direction: column;
            align-items: center;

            .drop {
                position: absolute;
                right: -2px;
                top: -2px;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: #A43127;
            }

            .icon-img {
                width: 24px;
                height: 24px;
            }
            .sureDrop{
                position: absolute;
                right: -25px;
                top: -10px;
                padding: 4px;
                font-size: 10px;
                word-break: keep-all;
                background: rgba(164, 49, 39, 0.12);
                color: #A43127;
                border-radius: 4px;
            }
        }

        .iconfont {
            position: relative;
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

.check_wrap {
    background: rgba(255, 255, 255, 1);
    text-align: center;

    .check_title {
        font-family: PingFang SC;
        font-size: 16px;
        font-weight: bold;
        line-height: 16px;
        letter-spacing: 0px;
        text-align: center;
        color: rgba(0, 0, 0, 1);
    }

    .tips {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        line-height: 22px;
        letter-spacing: 0px;
        text-align: center;
        color: rgba(128, 128, 128, 1);
        margin: 12px auto 32px auto;
    }

    .check-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        border-top: 1px solid rgba(238, 238, 238, 1);

        .check-btn {
            margin-top: 24px;
            font-family: PingFang SC;
            font-size: 16px;
            font-weight: 400;
            line-height: 16px;
            letter-spacing: 0px;
            text-align: center;
            color: rgba(0, 0, 0, 1);
        }
    }
}

.trip-info-list {
    padding: 16px;

    .name {
        font-size: 18px;
        font-style: normal;
        font-weight: bold;
    }

    .trip-info-item {
        margin-top: 16px;
        color: #808080;
        font-size: 14px;
        line-height: 22px;

        .trip-info-item-table {
            overflow: hidden;

            &.table-big {
                .tr {

                    .th,
                    .td {
                        width: 50%;
                    }
                }
            }

            .tr {
                display: flex;
                border-bottom: 1px solid #ccc;

                &:last-child {
                    border-bottom: none;
                }

                .th {
                    width: 33.3%;
                    font-size: 14px;
                    height: 38px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: #eee;
                    color: #000;
                    border-right: 1px solid #ccc;

                    &:last-child {
                        border-right: none;
                    }
                }

                .td {
                    font-size: 12px;
                    width: 33.3%;
                    height: 38px;
                    display: flex;
                    color: #808080;
                    justify-content: center;
                    align-items: center;
                    border-right: 1px solid #ccc;

                    &:last-child {
                        border-right: none;
                    }
                }
            }

            border: 1px solid #ccc;
            border-radius: 4px;
        }
    }

    .trip-info-tl {
        margin-top: 16px;
        font-weight: bold;
        line-height: 1;
    }
}

.serviceTeamList {
    padding: 16px;

    .item {
        margin-top: 12px;
        padding: 16px;
        background: #fff;
        display: flex;
        border-radius: 8px;
        line-height: 1;

        &:first-child {
            margin-top: 0;
        }

        .head {
            margin-right: 10px;

            .head-img {
                width: 82px;
                height: 82px;
                border-radius: 50%;
            }
        }

        .info {
            flex: 1;

            .info-head {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .left-part {
                    .career {
                        color: #808080;
                        font-size: 14px;
                    }

                    .name {
                        display: flex;

                        align-items: center;
                        margin-top: 8px;
                        font-size: 16px;
                        font-weight: bold;

                        .iconfont {
                            margin-left: 4px;
                            font-size: 12px;
                        }
                    }
                }

                .icon-a-28_dianhua {
                    font-size: 28px;
                    color: #000;
                }
            }

            .desc {
                margin-top: 8px;
                color: #808080;
                line-height: 18px;
                font-size: 12px;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                white-space: normal;
                word-break: break-all;
            }
        }
    }
}

.consultant {
    line-height: 1;
    padding: 32px 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .head-img {
        width: 82px;
        height: 82px;
        border-radius: 50%;
    }

    .name {
        margin-top: 8px;
        font-weight: bold;
        color: #000000;
        font-size: 16px;
    }

    .career {
        margin-top: 12px;
        color: #808080;
        font-size: 14px;
    }

    .tips {
        margin-top: 16px;
        font-size: 14px;
        line-height: 18px;
        color: #808080;
    }
}

.layer-footer {
    background: #fff;
    padding: 16px;

    .layer-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 48px;
    }
}

.arriveChoose {
    height: 440px;
    overflow-y: scroll;
    padding: 10px;

    .tips {
        color: #808080;
        font-size: 12px;
        padding: 12px 0px;
        display: inline;

        .phone {
            color: #000;
            display: inline;
        }
    }

    .iconfont {
        display: inline;
        margin-right: 3px;
    }
}

/deep/.pickerMask {
    background-image: linear-gradient(180deg,
            #f8f8f8 0%,
            rgba(248, 248, 248, 0) 100%),
        linear-gradient(180deg, rgba(248, 248, 248, 0) 0%, #f8f8f8 100%);
}
</style>
