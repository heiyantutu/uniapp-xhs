<template>
<div class="ui_historyBaggage">
    <!-- #ifdef MP -->
    <coustom-head title="历史行李牌" nativeMode=true>
    </coustom-head>
    <!-- #endif -->
	<div class="empty" v-if="!isAjax&&baggageList.length==0">
    	<empty tips="暂无行李吊牌" ></empty>
		
	</div>
	<div class="baggageList">
		<div class="item" v-for="(item,i) in baggageList" :key="i">
			<img class="baggage-img" src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/baggage.jpg">
			<div class="no-info">
                <div class="no_desc">行李牌编号</div>
			    <div class="no">{{item.serialNo}}</div>
            </div>
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
let user = getStorage('user')
let config = getStorage('config')
import useScanCoupon from "@/hooks/useScanCoupon";
import {
    jAlert3
} from "@/base/jAlert/jAlert";

let guestId: any = ref("")
let isAjax: any = ref(true)
let baggageList:any = ref([])


const listForGuest = () => {
    api.interfaceTransfer({
            query: {
                "unitCode": config.hotelGroupCode,
                "memberGuestId": guestId.value
            },
            config: {
                "interfaceType": "GET",
                "interfaceModule": "GC_UCBASE_URL",
                "interfaceMethod": "/baggageBindInfo/historyForGuest",
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
   
})
onMounted(() => {
	listForGuest()
});
</script>

<style lang="less" scoped>
.ui_historyBaggage {
    padding-bottom: calc(100px + constant(safe-area-inset-bottom));
    padding-bottom: calc(100px + env(safe-area-inset-bottom));
    .baggageList{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 4px 16px;
        .item{
            margin-top: 12px;
            position: relative;
            .baggage-img{
                width: 166px;
                height: 238px;
                border-radius: 12px;
               
            }
            .no-info{
                position: absolute;
                width: 100%;
                left: 0;
                bottom: 15px;
                text-align: center;
                .no_desc{
                    font-size: 12px;
                    color: #fff;
                    opacity: 0.6;
                }
                .no{
                    margin-top: 4px;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 500;
                    color: #fff;
                    opacity: 0.8;
                }
            }
        }
    }
  
}
</style>
