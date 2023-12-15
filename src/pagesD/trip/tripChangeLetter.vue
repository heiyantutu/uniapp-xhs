<template>
<div class="ui_tripChangeLetter">
    <!-- #ifdef MP -->
    <coustom-head title="行程变更确认书" nativeMode=true>
    </coustom-head>
    <!-- #endif -->
    <div class="tripChangeLetter">
        <div class="text">
            感谢您选择和松赞一起旅行，我们一直以来致力于为每位远道而来的客人提供超出预期的旅行体验。因协商一致，本人同意就以下行程做出调整：
        </div>
        <div class="tripChange_list">
            <div class="item" v-for="(item,i) in adjust.adjustOrderDtos" :key="i">
                <div class="no">{{i+1}}.</div>
                <template v-if="item.adjustType=='ADD'">新增</template><template v-if="item.adjustType=='MODIFY'">调整</template><template v-if="item.adjustType=='DELETE'">取消</template>{{item.activityName}}，活动时间：{{formatTime2(item.bizDatetime)}} {{item.activityBegin}}

            </div>
        </div>

        <div class="text">
            如您对以上行程变更无异议，烦请操作确认。 感谢您的理解与支持。
        </div>
        <div class="text marginTop">
            松赞旅行<br>
            团号：{{adjust.teamNo}}<br>
            管家：{{adjust.submitButlerDescript}}
        </div>
    </div>

    <div class="tripChangePeople" v-if="guestNo&&(guestInfo.confirmSta=='ONLINE'||guestInfo.confirmSta=='OFFLINE')">
        <div class="all-People">
            <div class="all-People-tl">
                确认人
            </div>
        </div>
        <div class="people-list">
            <div class="people-item">
                <div>{{guestInfo.name}}</div>
                <div class="people-state">
                    <div class="people-state-val" v-if="guestInfo.confirmSta=='ONLINE'">已线上确认·{{formatTime(guestInfo.confirmDatetime)}}</div>
                    <div class="people-state-val" v-else-if="guestInfo.confirmSta=='OFFLINE'">已线下确认·{{formatTime(guestInfo.confirmDatetime)}}</div>

                </div>
            </div>

        </div>
    </div>
    <div class="tripChangePeople" v-else-if="adjust.isRsvMan=='T'">
        <div class="all-People">
            <div class="all-People-tl">
                确认人
            </div>
            <div class="all-people-state" @click="checkedAll">
                全选
                <div class="iconfont icon-duoxuan_yixuan" v-if="allChecked"></div>
                <div class="iconfont icon-duoxuan_weixuan" v-else></div>
            </div>

        </div>
        <div class="people-list">
            <template v-for="(item,i) in adjust.guestDtos" :key="i">
                <div class="people-item" v-if="item.orderNo==orderNo" @click="checkedGuest(item)">
                    <div>{{item.name}}</div>
                    <div class="people-state">
                        <div class="people-state-val weight" v-if="item.confirmSta=='WAIT'">待确认</div>
                        <div class="people-state-val" v-else-if="item.confirmSta=='ONLINE'">已线上确认·{{formatTime(item.confirmDatetime)}}</div>
                        <div class="people-state-val" v-else-if="item.confirmSta=='OFFLINE'">已线下确认·{{formatTime(item.confirmDatetime)}}</div>
                        <div class="iconfont duoxuan_bukexuan" v-if="item.confirmSta=='ONLINE'||item.confirmSta=='OFFLINE'"></div>
                        <div class="iconfont icon-duoxuan_yixuan" v-else-if="item.checked"></div>
                        <div class="iconfont icon-duoxuan_weixuan" v-else></div>

                    </div>
                </div>
            </template>
        </div>
    </div>

    <div class="footer" v-if="((guestNo&&guestInfo.confirmSta=='WAIT')||(adjust.isRsvMan=='T'&&!guestNo&&!allCheckedOrder))&&adjust.adjustSta!='X'">
        <div class="baseBtn" @click="sureChange">
            我已知晓，并同意以上变更
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import {
    reactive,
    ref,
    computed,
    onMounted,
    watch
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
    onLoad
} from "@dcloudio/uni-app";
import {
    jAlert3
} from "@/base/jAlert/jAlert";
let user = getStorage('user');
let config = getStorage('config');
let teamNo = ref('');
let adjust: any = ref({});
let adjustNo = ref("");
let allChecked = ref(false);
let allCheckedOrder = ref(true);
let guestNo = ref("");
let guestInfo = ref({});
let isAjax = ref(false);
let orderNo = ref("");
onLoad((options: any) => {
    if (options.teamNo) {
        teamNo.value = options.teamNo
    }
    if (options.adjustNo) {
        adjustNo.value = options.adjustNo
    }
    if (options.guestNo) {
        guestNo.value = options.guestNo
    }
    if (options.orderNo) {
        orderNo.value = options.orderNo
    }

})
watch(() => adjust.value, (newVal, oldVal) => {
    var allSelect = true

    adjust.value.guestDtos.forEach((item: any) => {
        if (item.orderNo == orderNo.value) {
            if (item.confirmSta != 'ONLINE' && item.confirmSta != 'OFFLINE' && !item.checked) {
                allSelect = false
            }
        }

    })
    allChecked.value = allSelect
}, {
    deep: true
})
const formatTime2 = (val: string) => {
    return dayjs(val).format('YYYY-MM-DD')
}
const formatTime = (val: string) => {
    return dayjs(val).format('YYYY-MM-DD HH:mm')
}
const toPay = () => {
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
            isAjax.value = false
            if (res.result == 1 && res.retVal.result == 0) {
                res.retVal.retVal.reserveOrders.forEach((item: any) => {
                    if (orderNo.value == item.orderNo) {
                        if (item.orderType == 'Custom') {
                            goPage(`/pagesB/other/pay?orderNo=${item.orderNo}&productType=${item.orderType}`)
                        } else {
                            uni.navigateBack({
                                delta: 1
                            })
                        }

                    }
                })

            }
        })
}
const sureChange = () => {
    if (isAjax.value) {
        return;
    }
    isAjax.value = true
    var guestNoList: any = []
    if (adjust.value.isRsvMan == 'T') {
        adjust.value.guestDtos.forEach((item: any) => {
            if (item.checked && item.orderNo == orderNo.value) {
                guestNoList.push(item.guestNo)
            }

        })
        if (guestNoList.length == 0) {
            jAlert3('请选择确认人')
            return
        }
    } else {
        adjust.value.guestDtos.forEach((item: any) => {
            if (guestNo.value == item.guestNo) {
                guestNoList.push(item.guestNo)
            }

        })
    }

    api.interfaceTransfer({
            query: {
                dataList: guestNoList,
                adjustNo: adjustNo.value
            },
            config: {
                "interfaceType": "POST",
                "interfaceModule": "GC_TRAVEL_ORDER",
                "interfaceMethod": `/api/adjustCustomer/onlineConfirm`,
                "interfaceFrom": "GC",
                "hotelGroupCode": config.hotelGroupCode
            }
        })
        .then((res: any) => {
            if (res.result == 1 && res.retVal.result == 0) {
                jAlert3('确认完成')
                setTimeout(() => {

                    if (adjust.value.isRsvMan == 'T') {
                        var isAllChecked = true

                        adjust.value.guestDtos.forEach((item: any) => {
                            if (item.confirmSta != 'ONLINE' && item.confirmSta != 'OFFLINE' && !item.checked) {
                                isAllChecked = false
                            }
                        })

                        if (isAllChecked) {
                            uni.navigateBack({
                                delta: 1
                            })
                        }else {
                            getAdjustList('confirm')
                            isAjax.value = false
                        }

                    } else {
                        isAjax.value = false
                        uni.navigateBack({
                            delta: 1
                        })
                    }

                }, 2000);

            }

        })
}
const checkedGuest = (item: any) => {
    if (item.confirmSta == 'WAIT') {
        item.checked ? item.checked = false : item.checked = true
    }

}
const checkedAll = () => {
    adjust.value.guestDtos.forEach((item: any) => {
        if (item.orderNo == orderNo.value) {
            if (item.confirmSta == 'WAIT') {
                if (allChecked.value) {
                    item.checked = false
                } else {
                    item.checked = true
                }
            }
        }

    })
}
const getAdjustList = (type:string) => {
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
                allCheckedOrder.value = true
                res.retVal.retVal = res.retVal.retVal.filter((item: any) => (item.adjustSta !== "S" && item.adjustSta !== "W" && item.adjustSta !== "M" && item.adjustSta !== "X"));
                res.retVal.retVal.forEach((item: any) => {
                    if (item.adjustNo == adjustNo.value) {
                        adjust.value = item
                        item.guestDtos.forEach((guest: any) => {
                            if (guestNo.value) {
                                if (guestNo.value == guest.guestNo) {
                                    guestInfo.value = guest
                                }
                            } else {
                                if (guest.orderNo == orderNo.value) {
                                    if (guest.confirmSta == 'WAIT') {
                                        allCheckedOrder.value = false
                                    }

                                }
                            }

                        })

                    }

                })
                if (allCheckedOrder.value&&type=='confirm') {
                    uni.navigateBack({
                        delta: 1
                    })
                }

            }

        })
}
onMounted(() => {
    getAdjustList('init')
});
</script>

<style lang="less" scoped>
@import url("~@/styles/mixin.less");
@import url("~@/styles/skin.less");

.ui_tripChangeLetter {
    padding-bottom: calc(20px + constant(safe-area-inset-bottom));
    padding-bottom: calc(20px + env(safe-area-inset-bottom));

    .tripChangeLetter {
        word-break: break-all;
        padding: 16px 16px 0;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        /* 157.143% */
        color: #808080;

        .text {
            line-height: 22px;
        }

        .tripChange_list {

            padding: 5px 0;
            text-decoration-line: underline;

            .item {
                line-height: 22px;

                .no {
                    margin-right: 5px;
                    display: inline-block;
                }
            }
        }

        .marginTop {
            margin-top: 12px;
        }

    }

    .tripChangePeople {
        border-radius: 8px;
        margin: 28px 16px 0;
        background: #fff;

        .all-People {
            position: relative;
            padding: 16px 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                transform: scaleY(0.5);
                height: 1px;
                background: #eee;
            }

            .all-People-tl {
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                color: #000;
            }

            .all-people-state {
                display: flex;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;

                .iconfont {
                    margin-left: 12px;
                    font-size: 16px;

                    &.icon-duoxuan_weixuan {
                        color: #999;
                    }

                    &.icon-duoxuan_yixuan {
                        color: #A43127;
                    }

                    &.icon-duoxuan_bukexuan {
                        color: #eee;
                        border: 1px solid #999;
                    }
                }
            }
        }

        .people-list {
            padding: 16px 0;

            .people-item {

                padding: 16px 12px 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;

                color: #000;

                &:first-child {
                    padding-top: 0;
                }
            }

            .people-state {
                display: flex;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                color: #808080;

                .people-state-val {
                    &.weight {
                        color: #DB8900;
                    }
                }

                .iconfont {
                    margin-left: 12px;
                    font-size: 16px;

                    &.icon-duoxuan_weixuan {
                        color: #999;
                    }

                    &.icon-duoxuan_yixuan {
                        color: #A43127;
                    }

                    &.duoxuan_bukexuan {
                        background: #eee;
                        width: 16px;
                        height: 16px;
                        border-radius: 4px;

                        border: 1px solid #ccc;

                    }

                }
            }
        }
    }

    .footer {

        padding: 32px 16px;

        .baseBtn {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 48px;
        }
    }

}
</style>
