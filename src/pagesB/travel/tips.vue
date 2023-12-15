<template>
	<!-- #ifdef MP -->
	<coustom-head title="温馨提示" nativeMode=true :coustomPage="coustomPage">
		</coustom-head>
		<!-- #endif -->
	<div class="tips_ui">
		
		<div class="text">
			<mp-html :content="warmPrompt"></mp-html>
		</div>
		<div class="footer">
			<div class="footer-btn baseBtn" @click="invokeExtSign()">
				我已知晓，去签约
			</div>

		</div>
	</div>
</template> 

<script setup lang="ts">
	import { reactive, ref, computed, onMounted } from "vue";
	import api from "@/utils/api";
	import { getStorage } from "@/utils/wxuser";
	import { onLoad } from "@dcloudio/uni-app";
	import { goPage } from "@/utils/utils";
	import { jAlert3 } from "@/base/jAlert/jAlert";
	import coustomHead from "@/components/coustomHead.vue";
	import defaultOtaChannel from "@/utils/defaultOtaChannel";
	let config = getStorage("config");
	let user = getStorage("user");
	let otaChannel = ref(defaultOtaChannel);
	const isAjax = ref(false)
	const orderNo = ref('')
	const productCode = ref('')
	const itineraryCode = ref('')
	const productType = ref('')
	const warmPrompt = ref('')
	const sta = ref('')
	const coustomPage = ref('')
	const invokeExtSign  = () => {
		if(isAjax.value){
			return
		}
		
		isAjax.value = true
		
		var returnUrl = `/pagesB/other/pay?orderNo=${orderNo.value}&productType=${productType.value}`
		// #ifdef H5
		returnUrl = `${location.origin}/tripV2/#/pagesB/other/pay?orderNo=${orderNo.value}&productType=${productType.value}`
		// #endif 
		if(sta.value!='R'){
			// #ifdef H5
			returnUrl = `${location.origin}/tripV2/#/pagesB/travel/orderDetail?orderNo=${orderNo.value}`
			// #endif 
			returnUrl = `/pagesB/travel/orderDetail?orderNo=${orderNo.value}`
		}
		api.invokeExtSign({
			hotelCode:config.hotelCode,
			hotelGroupCode:config.hotelGroupCode,
			memberNo:user.memberId,
			travelOrderNo:orderNo.value,
			returnUrl:returnUrl
		}).then((res:any)=>{
			isAjax.value = false
			if(res.result==1){
				goPage(res.msg)
				
			}else{
				jAlert3(res.msg)
			}
		})
	}
	const findTravelProductForWechatDetail = () => {
	
		api.interfaceTransfer({
			query: {
				"unitCode": config.hotelGroupCode,
				// "travelGroupCode": travelGroupCode.value,
				"travelType": productCode.value,
				"ota": "DIRECT",
				"otaChannel": otaChannel.value
			},
			config: {
				"interfaceType": "POST",
				"interfaceModule": "GC_PRODUCT_JOURNEY",
				"interfaceMethod": "/api/travelGroup/findTravelProductForWechatDetail",
				"interfaceFrom": "GC",
				"hotelGroupCode": config.hotelGroupCode
			}
		}).then((res : any) => {
				if (res.result == 1 && res.retVal.result == 0) {
					res.retVal.retVal.forEach((itineraryDto:any)=>{
						itineraryDto.itineraryDtos.forEach((item:any)=>{
							if(item.itineraryCode == itineraryCode.value){
		
								warmPrompt.value = item.warmPrompt
							}
						})
					})
					
				}
			});
	}
	const orderDetail = () => {
		api.orderDetail({
			memberNo: user.memberId,
			memberId:user.memberId,
			hotelGroupCode: config.hotelGroupCode,
			hotelCode: config.hotelCode,
			travelOrderNo: orderNo.value,
			mobile:user.mobile
		}).then((res : any) => {
			if (res.result == 1) {
				sta.value = res.retVal.reserveOrder.sta
				itineraryCode.value = res.retVal.reserveOrder.itineraryCode
				productCode.value = res.retVal.reserveOrder.productCode
				productType.value =  res.retVal.reserveOrder.orderType
				findTravelProductForWechatDetail()
			
			}
		});
	}
	onLoad((options:any) => { 
		orderNo.value = options.orderNo
		coustomPage.value = '/pagesB/travel/orderDetail?orderNo='+options.orderNo
		// travelGroupCode.value = options.travelGroupCode
	});
	onMounted(() => { 
		orderDetail()
	});
</script>

<style lang="less" scoped>
	@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");

	.tips_ui {
		padding: 16px 16px 80px;
		padding-bottom: calc(80px + constant(safe-area-inset-bottom));
		padding-bottom: calc(80px + env(safe-area-inset-bottom));
		.text {
			font-size: 14px;
			color: #808080;
			line-height: 22px;
		}

		.footer {
			border-top: 1px solid #EEEEEE;
			padding: 12px 16px;
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			background: #fff;
			padding-bottom: calc(12px + constant(safe-area-inset-bottom));
			padding-bottom: calc(12px + env(safe-area-inset-bottom));
			.footer-btn{
				display: flex;
				align-items: center;
				justify-content: center;
				height: 48px;
				
			}
		}
	}
</style>