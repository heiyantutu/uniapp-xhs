<template>
<div class="ui_tripChange">
    <!-- #ifdef MP -->
    <coustom-head title="行程变更" nativeMode=true>
    </coustom-head>
    <!-- #endif -->
    <div class="tripChange" v-if="!isAjax">
        <div class="change-warp" v-if="adjustList.length==1" v-for="(item,i) in adjustList" :key="i">
            <div class="info-box" v-if="item.adjustSta!='M'">
                <div class="state-box" v-if="item.adjustSta=='W'||item.adjustSta=='U'">
                    <div class="state"><i class="iconfont icon-a-20_jieguo_dengdai"></i>待出行人确认</div>
                    <div class="countdown">{{item.countdown}}后未确认将自动取消变更</div>
                </div>
                <div class="state-box" v-if="item.adjustSta=='X'">
                    <div class="state"><i class="iconfont icon-a-20_jieguo_dengdai"></i>行程变更已取消</div>

                </div>
                <div class="state-box" v-if="item.adjustSta=='P'">
                    <div class="state" v-if="item.isRsvMan!='T'"><i class="iconfont icon-a-20_jieguo_dengdai"></i>待预订人支付</div>
                    <div class="state" v-else><i class="iconfont icon-a-20_jieguo_dengdai"></i>待支付</div>
                </div>
                <div class="state-box" v-if="item.adjustSta=='D'">
                    <div class="state"><i class="iconfont icon-a-20_jieguo_dengdai"></i>待其他出行人确认</div>
                    <div class="countdown">{{item.countdown}}后未确认将自动取消变更</div>
                </div>
                <div class="state-box" v-if="item.adjustSta=='O'">
                    <div class="state"><i class="iconfont icon-a-20_jieguo_chenggong"></i>行程变更已完成</div>
                </div>

            </div>
            <div class="info-box">
                <div class="info-head">
                    变更项目
                </div>
                <div class="change-info">
                    <div class="change-info-item" v-if="item.hasAdd">
                        <div class="lable">新增/调整</div>
                        <div class="change-list">
                            <template v-for="(adjust,j) in item.adjustOrderDtos" :key="j">
                                <div class="change-item" v-if="adjust.adjustType=='ADD'||adjust.adjustType=='MODIFY'">
                                    <div class="name">
                                        {{adjust.activityName}}
                                    </div>
                                    <div class="time">DAY{{adjust.dayCount}} · {{adjust.changeTime}}</div>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="change-info-item" v-if="item.hasDelete">
                        <div class="lable">删除</div>
                        <div class="change-list">
                            <template v-for="(adjust,j) in item.adjustOrderDtos" :key="j">
                                <div class="change-item" v-if="adjust.adjustType=='DELETE'">
                                    <div class="name">
                                        {{adjust.activityName}}
                                    </div>
                                    <div class="time">DAY{{adjust.dayCount}} · {{adjust.changeTime}}</div>
                                </div>
                            </template>
                        </div>

                    </div>
                </div>
            </div>
            <template v-if="item.isRsvMan=='T'">
				<template v-if="item.adjustSta=='O'">
                <div class="info-box">
                    <div class="info-head">
                        费用明细
                    </div>
                    <div class="info-list">
                        <div class="info-item">
                            <div class="lable">修改后订单金额</div>
                            <div class="val">¥{{item.newSum}}</div>
                        </div>
                        <div class="info-item">
                            <div class="lable">原订单金额</div>
                            <div class="val">¥{{item.originSum}}</div>
                        </div>
                        <div class="info-item">
                            <div class="lable">需支付差价</div>
                            <div class="val weight">¥{{item.adjustMoneySum}}</div>
                        </div>
                    </div>
                </div>
				</template>
                <div class="info-box">
                    <div class="info-head">
                        出行人确认进度
                    </div>
                    <div class="info-list">
						<template v-for="(guest,j) in item.guestDtos" :key="j">
							<div class="info-item" v-if="guest.orderNo==orderNo">
							    <div class="lable black">{{guest.name}}</div>
							    <div class="val orange" v-if="guest.confirmSta=='WAIT'">待确认</div>
							    <div class="val grey" v-if="guest.confirmSta=='ONLINE'||guest.confirmSta=='OFFLINE'" @click="goGuestChange(item,guest)">已确认·{{guest.confirmDatetime}}<i class="iconfont icon-a-12_youlajiantou_hei"></i></div>
							</div>
						</template>
                       

                    </div>
                </div>
                <div class="tips">您可帮助其他出行人一并确认</div>
            </template>
            <template v-else-if="guestInfo.confirmSta=='ONLINE'||guestInfo.confirmSta=='OFFLINE'">
                <div class="tripChangeBtn" @click="goTripChangeLetter(item)">
                    行程变更确认书<i class="iconfont icon-a-16_youlajiantou_hei"></i>
                </div>
            </template>
        </div>

        <div class="change-warp" v-if="adjustList.length>1">
            <div class="info-box2" v-for="(item,i) in adjustList" key="i" @click="goTripChange(item)">
                <div class="info-head">
                    <div class="tl">
                        <i class="iconfont icon-a-20_hangchengbiangeng"></i>变更申请 {{adjustList.length-i}}
                    </div>
                    <div class="info-head-state" v-if="item.adjustSta=='W'||item.adjustSta=='U'">待出行人确认{{formatTime(item.countdown)}}</div>
                    <div class="info-head-state" v-if="item.adjustSta=='P'&&item.isRsvMan=='T'">待预订人支付</div>
                    <div class="info-head-state" v-if="item.adjustSta=='P'&&item.isRsvMan!='T'">待支付</div>
                    <div class="info-head-state" v-if="item.adjustSta=='D'">待其他出行人确认{{item.countdown}}</div>
                    <div class="info-head-state" v-if="item.adjustSta=='X'">行程变更已取消</div>
                    <div class="info-head-state black" v-if="item.adjustSta=='O'">已完成</div>
                </div>
                <div class="change-info">
                    <div class="change-info-item" v-if="item.hasAdd">
                        <div class="lable">新增/调整</div>
                        <div class="change-list">
                            <template v-for="(adjust,j) in item.adjustOrderDtos" :key="j">
                                <div class="change-item" v-if="adjust.adjustType=='ADD'||adjust.adjustType=='MODIFY'">
                                    <div class="name">
                                        {{adjust.activityName}}
                                    </div>

                                </div>
                            </template>

                        </div>
                    </div>
                    <div class="change-info-item" v-if="item.hasDelete">
                        <div class="lable">删除</div>
                        <div class="change-list">
                            <template v-for="(adjust,j) in item.adjustOrderDtos" :key="j">
                                <div class="change-item" v-if="adjust.adjustType=='DELETE'">
                                    <div class="name">
                                        {{adjust.activityName}}
                                    </div>

                                </div>
                            </template>

                        </div>
                    </div>
                    <div class="change-info-item">
                        <div class="lable">发起时间</div>
                        <div class="change-list">
                            <div class="change-item">{{item.submitDatetime}}</div>
                        </div>
                    </div>
                </div>
                <div class="btns">
                    <div class="btn">详情</div>
                    <div class="btn baseBtn" @click.stop="sureChange(item)" v-if="item.adjustSta=='W'||item.adjustSta=='U'">确认更变</div>
                </div>
            </div>

        </div>
        <div class="change-warp" v-if="adjustList.length==0">
            <div class="info-box">
                <div class="tl">计划赶不上变化？没关系！</div>
                <div class="desc">如果您需要调整活动项目、参与时间、参与成员，可联系管家申请变更，行程变更后可能会产生价格差。变更流程如下：</div>
                <div class="step">
                    <div class="step-item">
                        <div class="step-item-no">
                            1
                        </div>
                        <div class="step-item-desc">
                            联系管家，发起行程变更
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-item-no">
                            2
                        </div>
                        <div class="step-item-desc">
                            出行人同意变更
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-item-no">
                            3
                        </div>
                        <div class="step-item-desc">
                            预订人支付差价
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-item-no">
                            4
                        </div>
                        <div class="step-item-desc">
                            行程变更完成
                        </div>
                    </div>
                </div>
            </div>
            <div class="info-box" v-if="housekeepInfo.code">
                <div class="housekeepInfo">
                    <div class="head">
                        <img :src="housekeepInfo.mainPic" mode="aspectFill" v-if="housekeepInfo.mainPic" class="head-img" />
                        <img src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/head-def.png" class="head-img" v-else />
                    </div>
                    <div class="housekeepInfo-head">
                        <div class="left-part">
                            <div class="career">顾问</div>
                            <div class="name">{{ housekeepInfo.name}}</div>
                        </div>
                        <div class="iconfont icon-a-28_dianhua" @click.stop="makePhoneCall(housekeepInfo.mobile)" v-if="housekeepInfo.mobile"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer" v-if="isShowBtn">
        <div class="baseBtn" v-if="adjustList[0].adjustSta=='P'&&adjustList[0].isRsvMan=='T'" @click="toPay()">立即支付</div>
        <div class="baseBtn" @click="goTripChangeLetter(adjustList[0])" v-else>
            确认变更
        </div>
    </div>
</div>
</template>
<script setup lang="ts">
import {
    reactive,
    ref,
    computed,
    onMounted
} from "vue";
import api from "@/utils/api";
import {
    getStorage,
    setStorage
} from "@/utils/wxuser";
import {
    goPage
} from "@/utils/utils";
import dayjs from "dayjs";
import coustomHead from "@/components/coustomHead.vue";
import {
    onLoad,
    onShow,
    onUnload
} from "@dcloudio/uni-app";
import {
    jAlert3
} from "@/base/jAlert/jAlert";
let user = getStorage('user');
let config = getStorage('config');
let teamNo = ref('');
let adjustNo = ref('');
let housekeepInfo: any = ref({});
let adjustList: any = ref([]);
let intervalId = ref();
let isAjax = ref(true);
let guestInfo: any = ref({});
let orderInfo: any = ref({});
let orderNo = ref("")
let isShowBtn = computed(() => {
    let isShowBtn = false
    if (adjustList.value.length == 1 && (adjustList.value[0].adjustSta == 'W' || adjustList.value[0].adjustSta == 'U' || (adjustList.value[0].adjustSta == 'P' && adjustList.value[0].isRsvMan == 'T'))) {
        isShowBtn = true
    }
    return isShowBtn
})
const toPay = () => {
    goPage(`/pagesB/other/pay?orderNo=${orderInfo.value.orderNo}&productType=${orderInfo.value.orderType}`)
}
const goTripChangeLetter = (item: any) => {
    if (guestInfo.value.guestNo && item.isRsvMan != 'T') {
        goGuestChange(item, guestInfo.value)
    } else {
        goPage(`/pagesD/trip/tripChangeLetter?teamNo=${teamNo.value}&adjustNo=${item.adjustNo}&orderNo=${orderNo.value}`)
    }

}
const sureChange = (adjust: any) => {
    goTripChangeLetter(adjust)

}
const formatTime = (val: string) => {

    try {
        return val.replace('分', ':').replace('秒', '')
    } catch (error) {
        return val
    }

}
const makePhoneCall = (phone: string) => {
    if (!phone) {
        jAlert3('暂无手机号')
        return;
    }
    uni.makePhoneCall({
        phoneNumber: phone

    });
}
const goTripChange = (item: any) => {
    goPage(`/pagesD/trip/tripChange?teamNo=${teamNo.value}&adjustNo=${item.adjustNo}&orderNo=${orderNo.value}`)

}
const queryPayDetail = (item: any) => {
    let obj: any = {
        "unitCode": config.hotelGroupCode,
        "otaChannel": "wechat",
        "ota": "DIRECT",
        "isGroup": 'T',
        "orderNo": orderNo.value,
        "cardLevel": user.cardLevel,
        "cardType": user.cardType,
        "memberId": user.memberId
    }

    api.interfaceTransfer({
            query: obj,
            config: {
                "interfaceType": "POST",
                "interfaceModule": "GC_TRAVEL_ORDER",
                "interfaceMethod": "/api/reserve/order/queryPayDetail",
                "interfaceFrom": "GC",
                "hotelGroupCode": config.hotelGroupCode
            }
        })
        .then((res: any) => {

            if (res.result == 1 && res.retVal.result == 0) {
                if (res.retVal.isChangeActivity == 'T' && res.retVal.activityChangeRateSum > 0) {
                    item.adjustSta = 'P'
                }
            }
        });
}
const getAdjustList = () => {

    api.interfaceTransfer({
            query: {
                "unitCode": config.hotelGroupCode,
                "phone": user.mobile,
                "teamNo": teamNo.value
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
                isAjax.value = false
                if (res.retVal.retVal.length > 0) {
                    adjustList.value = []
                    res.retVal.retVal.forEach((item: any) => {

                        item.adjustOrderDtos.forEach((adjust: any) => {
                            if (adjust.adjustType == 'ADD' || adjust.adjustType == 'MODIFY') {
                                item.hasAdd = true
                            }
                            if (adjust.adjustType == 'DELETE') {
                                item.hasDelete = true
                            }
                            adjust.changeTime = dayjs(adjust.bizDatetime).format('MM月DD日') + ' ' + adjust.activityBegin + '-' + adjust.activityEnd
                        })
                        let allConfirm = true
						let allConfirmOrder = true
                        item.guestDtos.forEach((guest: any) => {
                            if (guest.confirmSta != 'ONLINE' && guest.confirmSta != 'OFFLINE') {
                                allConfirm = false
                            }
							if(item.adjustSta == 'U'){
								if(item.isRsvMan == 'T'){
									if(guest.confirmSta == 'WAIT'&&guest.orderNo == orderNo.value){
										allConfirmOrder = false
									}
								}else{
									if (guest.guestPhone == user.mobile&&guest.confirmSta == 'WAIT'&&guest.orderNo == orderNo.value) {
										allConfirmOrder = false
									}
								}
							}
							
                        })
						
                        if (allConfirm&&item.adjustSta == 'U') {
                            item.adjustSta = 'M'
                        }else if(allConfirmOrder&&item.adjustSta == 'U'){
							item.adjustSta = 'D'
						}
                        // if (item.adjustSta == 'O') {
                        //     if (item.adjustMoneySum > 0) {
                        //         // queryPayDetail(item)
                        //         item.adjustSta = 'P'
                        //     }

                        // }

                        if (adjustNo.value == item.adjustNo) {
                            adjustList.value.push(item)
                        }
                    })
                    res.retVal.retVal = res.retVal.retVal.filter((item: any) => (item.adjustSta !== "S" && item.adjustSta !== "W" && item.adjustSta !== "M" && item.adjustSta !== "X"));
                    if (!adjustNo.value) {
                        adjustList.value = res.retVal.retVal
                    }
                    adjustList.value.forEach((item: any) => {
                        var payOvertime = dayjs(item.confirmDatetime).add(60, 'm').diff(dayjs(), 's')
                        intervalId.value = setInterval(() => {
                            if (payOvertime > 0) {
                                payOvertime--
                                item.countdown = formatSeconds(payOvertime)
                            }
                        }, 1000)
                        item.guestDtos.forEach((guest: any) => {

                            if (guest.guestPhone == user.mobile) {
                                guestInfo.value = guest

                            }

                        })

                    })
                    if (adjustList.value.length == 1 && (adjustList.value[0].adjustSta == 'P' && adjustList.value[0].isRsvMan == 'T')) {
                        orderNo.value = adjustList.value[0].guestDtos[0].orderNo
                    }

                } 

            }

        })
}

onUnload(() => {
    clearInterval(intervalId.value);
})
const goGuestChange = (item: any, guest: any) => {
    goPage(`/pagesD/trip/tripChangeLetter?teamNo=${teamNo.value}&adjustNo=${item.adjustNo}&guestNo=${guest.guestNo}&orderNo=${orderNo.value}`)
}
const formatSeconds = (seconds: number) => {

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}分${formattedSeconds}秒`;
}

const getTeamDetail = (cb:any) => {

    api.interfaceTransfer({
            query: {
                "unitCode": config.hotelGroupCode
            },
            config: {
                "interfaceType": "GET",
                "interfaceModule": "GC_TRAVEL_ORDER",
                "interfaceMethod": `/api/team/order/detail/${teamNo.value}`,
                "interfaceFrom": "GC",
                "hotelGroupCode": config.hotelGroupCode
            }
        })
        .then((res: any) => {
            if (res.result == 1 && res.retVal.result == 0) {
				res.retVal.retVal.guests.forEach((item : any) => {
					if (item.mobile == user.mobile) {
						res.retVal.retVal.reserveOrders.forEach((order:any)=>{
							if(order.orderNo == item.orderNo){
								orderNo.value = order.orderNo;
							}
						})
						
					}
				})
                res.retVal.retVal.reserveOrders.forEach((item: any) => {
                    if (orderNo.value == item.orderNo) {
                        orderInfo.value = item
                    }
                })

                if (res.retVal.retVal.driverButlerDtos) {

                    res.retVal.retVal.driverButlerDtos.forEach((item: any) => {
                        if (item.personType == 'HOUSEKEEP') {
                            housekeepInfo.value = item

                        }
                    })
                }
				cb&&cb()
            }
        })
}
onLoad((options: any) => {
    if (options.teamNo) {
        teamNo.value = options.teamNo
    }
    if (options.adjustNo) {
        adjustNo.value = options.adjustNo
    }

})
onShow(() => {
	getTeamDetail(()=>{
		getAdjustList()
	})
    
});
</script>

<style lang="less" scoped>
@import url("~@/styles/mixin.less");
@import url("~@/styles/skin.less");

.ui_tripChange {
    padding-bottom: calc(100px + constant(safe-area-inset-bottom));
    padding-bottom: calc(100px + env(safe-area-inset-bottom));

    .tripChange {
        padding: 4px 16px 0;

        .tripChangeBtn {
            margin-top: 12px;
            height: 48px;
            padding: 0 12px;
            display: flex;
            align-items: center;
            color: #000;
            justify-content: space-between;
            background: #fff;
            border-radius: 8px;
            font-size: 14px;
        }

        .info-box {
            margin-top: 16px;
            background: #fff;
            border-radius: 8px;
            padding: 16px 12px;

            .tl {
                font-size: 16px;
                font-style: normal;
                color: #000;
                font-weight: 500;
                line-height: 24px;
                /* 150% */
            }

            .desc {
                margin-top: 12px;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                color: #808080;
            }

            .step {
                margin-bottom: 8px;
                position: relative;
                margin-top: 32px;

                &::after {
                    content: '';
                    position: absolute;
                    left: 10px;
                    top: 0;
                    bottom: 0;
                    width: 1px;
                    transform: scaleX(0.5);
                    background: #ccc;
                }

                .step-item {
                    margin-top: 28px;
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;

                    &:first-child {
                        margin-top: 0;
                    }

                    .step-item-no {
                        background: #fff;
                        position: relative;
                        z-index: 2;
                        margin-right: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        width: 20px;
                        height: 20px;
                        border: 1px solid #ccc;
                        border-radius: 50%;
                        color: #000;
                        font-size: 12px;
                    }
                }
            }

            .state-box {

                .state {
                    display: flex;
                    align-items: center;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 500;

                    .iconfont {
                        margin-right: 8px;
                        font-size: 20px;
                    }
                }

                .countdown {
                    padding-left: 24px;
                    font-size: 12px;
                    margin-top: 8px;
                    color: #808080;
                }
            }

            .info-head {
                position: relative;
                padding-bottom: 16px;
                font-size: 14px;
                font-style: normal;
                font-weight: 600;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: -12px;
                    right: -12px;
                    height: 1px;
                    background: #EEE;
                    transform: scaleY(0.5);
                }
            }

            .change-info {
                .change-info-item {
                    position: relative;
                    padding: 16px 0;
                    display: flex;

                    .lable {
                        min-width: 73px;
                        font-size: 14px;
                        color: #808080;
                        margin-right: 5px;
                    }

                    .change-list {
                        flex: 1;

                        .change-item {
                            margin-top: 16px;

                            &:first-child {
                                margin-top: 0;
                            }

                            .name {
                                color: #000;
                                font-size: 14px;
                            }

                            .time {
                                margin-top: 8px;
                                font-size: 12px;
                                color: #808080;
                            }
                        }
                    }

                    &:last-child {
                        padding: 16px 0 0;

                        &::after {
                            display: none;
                        }
                    }

                }

            }

            .info-list {
                .info-item {
                    margin-top: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .lable {
                        color: #808080;
                        font-size: 14px;

                        &.black {
                            color: #000;
                        }

                    }

                    .val {
                        display: flex;
                        align-items: center;
                        font-size: 14px;
                        color: #000;

                        &.weight {
                            font-family: Montserrat;
                            font-size: 14px;
                            font-style: normal;
                            font-weight: 600;
                        }

                        &.orange {
                            color: #DB8900;
                        }

                        &.grey {
                            color: #808080;
                        }

                        .icon-a-12_youlajiantou_hei {
                            font-size: 12px;
                        }
                    }

                }
            }

        }

        .info-box2 {
            margin-top: 16px;
            background: #fff;
            border-radius: 8px;
            padding: 16px 12px;

            .info-head {
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
                padding-bottom: 16px;
                font-size: 14px;
                font-style: normal;
                font-weight: 600;

                .tl {
                    display: flex;
                    align-items: center;
                }

                .icon-a-20_hangchengbiangeng {
                    font-size: 20px;
                    margin-right: 4px;
                }

                .info-head-state {
                    line-height: 20px;
                    color: #A43127;
                    text-align: right;
                    font-family: PingFang SC;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;

                    &.black {
                        color: #000;
                    }

                }

            }

            .change-info {
                .change-info-item {
                    position: relative;

                    display: flex;
                    line-height: 22px;
                    padding-top: 12px;

                    .lable {

                        width: 105px;
                        font-size: 14px;
                        color: #808080;

                    }

                    .change-list {
                        flex: 1;

                        .change-item {
                            margin-top: 16px;
                            text-align: right;
                            font-size: 14px;

                            &:first-child {
                                margin-top: 0;
                            }

                            .name {
                                color: #000;
                                font-size: 14px;
                            }

                            .time {
                                margin-top: 8px;
                                font-size: 12px;
                                color: #808080;
                            }
                        }
                    }

                }

            }

            .btns {
                justify-content: flex-end;
                display: flex;
                margin-top: 16px;

                .btn {
                    margin-left: 8px;
                    padding: 8px 12px;
                    border: 0.5px solid #000;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    color: #000;
                    border-radius: 4px;
                }

                .baseBtn {
                    color: #fff;
                }
            }
        }

        .tips {
            margin-top: 12px;
            color: #808080;
            font-size: 14px;
        }

        .housekeepInfo {
            display: flex;

            .head-img {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                margin-right: 12px;
            }

            .housekeepInfo-head {
                flex: 1;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .left-part {
                    display: flex;
                    justify-content: center;
                    flex-direction: column;

                    .career {
                        color: #808080;
                        font-size: 12px;
                        font-style: normal;
                        font-weight: 400;
                        line-height: 12px;
                        /* 100% */
                    }

                    .name {
                        display: flex;

                        align-items: center;
                        margin-top: 8px;
                        font-size: 14px;
                        font-style: normal;
                        font-weight: 400;

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

        }
    }

    .footer {
        position: fixed;
        bottom: 0;
        z-index: 9;
        left: 0;
        right: 0;
        background: #fff;
        padding: 12px 16px;

        .baseBtn {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 48px;
        }
    }

}
</style>
