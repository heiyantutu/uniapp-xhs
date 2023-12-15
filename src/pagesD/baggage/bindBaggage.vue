<template>
<div class="ui_bindBaggage">
    <!-- #ifdef MP -->
    <coustom-head title="行李吊牌" nativeMode=true>
    </coustom-head>
    <!-- #endif -->
    <div class="baggage_box">
        <div class="tl">
            行李牌编号
        </div>
        <div class="no">{{serialNo}}</div>
        <img class="img" src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/baggage.jpg">
    </div>
    <bottom-btn @click="bindBaggage">确认绑定</bottom-btn>
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
    onLoad
} from "@dcloudio/uni-app";
import empty from "@/components/empty.vue";
import {
    jAlert3
} from "@/base/jAlert/jAlert";
let user = getStorage('user')
let config = getStorage('config')
let teamNo: any = ref("")
let guestId: any = ref("")
let serialNo: any = ref("")
let guestName: any = ref("")
let isAjax: any = ref(false)
const bindBaggage = () => {
    if (isAjax.value) {
        return;
    }
    isAjax.value = true
    api.interfaceTransfer({
            query: {
                "unitCode": config.hotelGroupCode,
                "teamNo": teamNo.value,
                "guestId": guestId.value,
                "serialNo":serialNo.value,
                "guestName":guestName.value
            },
            config: {
                "interfaceType": "POST",
                "interfaceModule": "GC_UCBASE_URL",
                "interfaceMethod": "/baggageBindInfo/bindForGuest",
                "interfaceFrom": "GC",
                "hotelGroupCode": config.hotelGroupCode
            }
        })
        .then((res: any) => {
            if (res.result == 1 && res.retVal.result == 0) {
               jAlert3('绑定成功')
               setTimeout(()=>{
                    uni.navigateBack({
						delta: 1
					})
               },2000)
            } else {
                isAjax.value = false
                jAlert3(res.msg||res.retVal.msg)
            }
            
        });
};

onLoad((options: any) => {
    guestId.value = options.guestId
    teamNo.value = options.teamNo
    serialNo.value = options.serialNo
    guestName.value = options.guestName
})
onMounted(() => {

});
</script>

<style lang="less" scoped>
.ui_bindBaggage {
    padding-bottom: calc(100px + constant(safe-area-inset-bottom));
    padding-bottom: calc(100px + env(safe-area-inset-bottom));

    .baggage_box {
        text-align: center;
        margin-top: 52px;

        .tl {
            font-size: 14px;
            color: #808080;

        }

        .no {
            margin-top: 8px;
            font-size: 18px;
            font-style: normal;
            font-weight: 500;
        }

        .img {
            margin-top: 16px;
            width: 278px;
            height: 396px;
            border-radius: 16px;
            overflow: hidden;
        }
    }
}
</style>
