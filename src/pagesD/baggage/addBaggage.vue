<template>
<div class="ui_addBaggage">
    <!-- #ifdef MP -->
    <coustom-head title="行李吊牌" nativeMode=true>
    </coustom-head>
    <!-- #endif -->
    <div class="empty" v-if="!isAjax&&baggageList.length==0">
        <empty tips="暂无行李吊牌"></empty>
        <div class="tips">
            联系管家或在酒店前台领取并<br>
            扫码添加属于您的行李牌
        </div>
    </div>
    <div class="baggageList" v-if="baggageList.length>=0">
        <div class="item" v-for="(item,i) in baggageList" :key="i">
            <img class="baggage-img" src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/baggage.jpg">
            <div class="baggage-rt">
                <div class="no_desc">行李牌编号</div>
                <div class="no">{{item.serialNo}}</div>
                <div class="desc">{{item.itineraryName}}</div>
                <div class="btn" @click="invalid(item)">申请作废</div>
            </div>

        </div>
    </div>
    <div class="historyBtn" @click="goBaggageHistory">
        查看历史行李牌
    </div>
    <bottom-btn @click="scan">扫码添加行李牌</bottom-btn>
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
import bottomBtn from "@/components/bottomBtn.vue";
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
    onShow
} from "@dcloudio/uni-app";
import empty from "@/components/empty.vue";
let user = getStorage('user')
let config = getStorage('config')
import useScanCoupon from "@/hooks/useScanCoupon";
import {
    jAlert12,
    jAlert3
} from "@/base/jAlert/jAlert";
const {
    scanCode,
    bindCoupon
} = useScanCoupon();
let teamNo: any = ref("")
let guestId: any = ref("")
let isAjax: any = ref(true)
let isRequest: any = ref(false)
let guestName: any = ref("")
let baggageList: any = ref([])
let memberGuestId: any = ref("")
const scan = () => {
    scanCode().then((res: any) => {
        goPage(`/pagesD/baggage/bindBaggage?guestId=${guestId.value}&teamNo=${teamNo.value}&guestName=${guestName.value}&serialNo=${res}`)
    });
};
const goBaggageHistory = () => {
    goPage(`/pagesD/baggage/historyBaggage?guestId=${memberGuestId.value}`)
}
const invalid = (item: any) => {
	if(isRequest.value){
		return
	}
	isRequest.value = true
    uni.showModal({
        title: "是否作废行李牌",
        content: "行李牌一经作废将无法使用",
        cancelText: "否",
        cancelColor: "#000",
        confirmText: "是",
        confirmColor: "#000",
        success(res) {
            if (res.confirm) {
                api.interfaceTransfer({
                        query: {
                            "unitCode": config.hotelGroupCode,
                            "serialNo": item.serialNo,

                        },
                        config: {
                            "interfaceType": "GET",
                            "interfaceModule": "GC_UCBASE_URL",
                            "interfaceMethod": "/baggageBindInfo/invalid",
                            "interfaceFrom": "GC",
                            "hotelGroupCode": config.hotelGroupCode
                        }
                    })
                    .then((res: any) => {
                        if (res.result == 1 && res.retVal.result == 0) {
							jAlert3('行李牌作废成功')
							listForGuest()
                        } else {
                            jAlert3(res.result.msg || res.msg)
                        }
						isRequest.value = false
                    });
            } else if (res.cancel) {
               isRequest.value = false
            }
        },
    });

}
const listForGuest = () => {
    api.interfaceTransfer({
            query: {
                "unitCode": config.hotelGroupCode,
                "teamNo": teamNo.value,
                "guestId": guestId.value
            },
            config: {
                "interfaceType": "GET",
                "interfaceModule": "GC_UCBASE_URL",
                "interfaceMethod": "/baggageBindInfo/listForGuest",
                "interfaceFrom": "GC",
                "hotelGroupCode": config.hotelGroupCode
            }
        })
        .then((res: any) => {
            if (res.result == 1 && res.retVal.result == 0) {
                baggageList.value = res.retVal.retVal
            } else {
                jAlert3(res.result.msg || res.msg)
            }
            isAjax.value = false
        });
}
onLoad((options: any) => {
    guestId.value = options.guestId
    teamNo.value = options.teamNo
    guestName.value = options.guestName
    memberGuestId.value = options.memberGuestId
})

onShow(() => {
    listForGuest()
});
</script>

<style lang="less" scoped>
.ui_addBaggage {

    padding-bottom: calc(100px + constant(safe-area-inset-bottom));
    padding-bottom: calc(100px + env(safe-area-inset-bottom));

    .tips {
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        color: #808080;
        text-align: center;
    }
    .empty{
        padding-top: 58px;
    }
    .historyBtn {
        font-size: 14px;
        color: #000000;
        border: 0.5px solid #ccc;
        height: 38px;
        width: 136px;
        text-align: center;
        line-height: 38px;
        border-radius: 20px;
        margin: 0 auto;
        margin-top: 24px;
    }

    .baggageList {
        padding: 4px 16px;

        .item {
            display: flex;
            margin-top: 12px;
            background: #fff;
            border-radius: 8px;
            overflow: hidden;

            .baggage-img {
                width: 118px;
                height: 170px;
                border-radius: 12px;
                overflow: hidden;

            }

            .baggage-rt {
                position: relative;
                margin-left: 12px;
                flex: 1;

                .no_desc {
                    color: #808080;
                    font-size: 12px;
                    margin-top: 16px;
                }

                .no {
                    margin-top: 8px;
                    color: #000;
                    font-family: PingFang SC;
                    font-size: 16px;
                    font-style: normal;
                    font-weight: 500;
                }

                .desc {
                    margin-top: 12px;
                    color: #808080;
                    font-size: 12px;
                }

                .btn {
                    position: absolute;
                    right: 16px;
                    bottom: 16px;
                    font-size: 14px;
                    color: #000;
                    width: 80px;
                    height: 30px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 0.5px solid #000;
                    border-radius: 4px;

                }
            }
        }

    }
}
</style>
