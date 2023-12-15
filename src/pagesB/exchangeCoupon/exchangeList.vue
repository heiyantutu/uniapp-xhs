<template>
	<div class="exchangeList_ui">
		<!-- #ifdef MP -->
		<coustom-head title="选择可兑产品" nativeMode=true>
		</coustom-head>
		<!-- #endif -->
		<div class="product-info-box">

			<div class="exchange-list" >
				<div class="item"
					@click="goTravelDetail(item)"
					v-for="(item,index) in productDtoList" :key="index">
					<div class="img-box">
						<div class="lab" v-if="item.categorySub=='ButlerCustomized'||item.categorySub=='DestPackage'">套餐{{index+1}}</div>
						<div class="lab" v-else>路线{{index+1}}</div>
						<img mode="aspectFill" :src="item.urls[0].url" v-if="item.urls&&item.urls.length>0" class="img">
					</div>

					<div class="info">
						<div class="name">
							{{item.title}}
						</div>

					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted } from "vue";
	import api from "@/utils/api";
	import coustomHead from "@/components/coustomHead.vue";
	import { getStorage } from "@/utils/wxuser";
	import { goPage } from "@/utils/utils";
	import {
		onLoad
	} from "@dcloudio/uni-app";
	let config = getStorage("config");
	let couponNo = ref('')
	let travelList = ref([])
	let couponCodeUseConfigProductDtoList = ref([])
	let productDtoList:any = ref([])
	const goTravelDetail = (item:any) => {

		let code = item.couponNo||couponNo.value
		goPage('/pagesB/travel/travelDetail?travelType='+item.travelType+'&couponNo='+code)
	}
	const findCouponDetailByCouponNo = () => {
		api.interfaceTransfer({
			query: {
				"hotelGroupCode": config.hotelGroupCode,
				"couponNo": couponNo.value,
				"channel": "WECHAT"

			},
			config: {
				"interfaceType": "POST",
				"interfaceModule": "",
				"interfaceMethod": "/api/coupon/listCouponCodeUseConfigProductByCouponNo",
				"interfaceFrom": "coupon",
				"hotelGroupCode": config.hotelGroupCode
			}
		})
			.then((res : any) => {
				if (res.result == 1 && res.retVal.result == 0) {
					couponCodeUseConfigProductDtoList.value = res.retVal.retVal
					travelProductList()
				}
			});

	}
	const travelProductList = () => {
		productDtoList.value = []
		let travelGroupCodes: any = []
		let travelTypes:any= []
		let itineraryCodes:any= []
		let categorySubs:any= [] 
		var opt:any = {
			"unitCode":config.hotelGroupCode,
			"hotelGroupCode": config.hotelGroupCode
		}
		couponCodeUseConfigProductDtoList.value.forEach((item:any)=>{
			if(item.type=='4'){
				travelGroupCodes.push(item.productCode)
			}
			if(item.type=='3'){
				itineraryCodes.push(item.productCode)
			}
			if(item.type=='2'){
				if(item.productPrimaryClassification!='Custom'){
					categorySubs.push(item.productPrimaryClassification)
				}
			}
			if(item.type=='1'){
				travelTypes.push(item.productCode)
			}
		})
		if(itineraryCodes.length>0){
			opt.itineraryCodes = itineraryCodes
		}
		if(travelTypes.length>0){
			opt.travelTypes = travelTypes
		}
		if(categorySubs.length>0){
			opt.categorySubs = categorySubs
		}
		if(travelGroupCodes.length>0){
			opt.travelGroupCodes = travelGroupCodes
		}
		
	
		api.interfaceTransfer({
			query: opt,
			config: {
				"interfaceType": "POST",
				"interfaceModule": "GC_PRODUCT_JOURNEY",
				"interfaceMethod": "/api/travelGroup/listTravelProductForWechatTdq",
				"interfaceFrom": "GC",
				"hotelGroupCode": config.hotelGroupCode
			}
		})
			.then((res : any) => {
				if (res.result == 1 && res.retVal.result == 0) {
					let productList = res.retVal.retVal
					productList.forEach((item: any) => {
						item.couponNo = couponNo.value
						
						productDtoList.value.push(item)
					})
				
				}
			});

	}


	onLoad((options : any) => {
		couponNo.value = options.couponNo
	})
	onMounted(() => {

		if (couponNo.value) {
			findCouponDetailByCouponNo()
		} else {
			
			productDtoList.value = getStorage('productDtoList')
			// travelProductList()
		}

	});
</script>

<style lang="less" scoped>
	@import url("~@/styles/skin.less");

	.product-info-box {
		.exchange-list {
			padding: 0 16px 12px;
			padding-bottom: calc(12px + constant(safe-area-inset-bottom));
			padding-bottom: calc(12px + env(safe-area-inset-bottom));

			.item {
				position: relative;
				background: #fff;
				margin-top: 12px;
				display: flex;
				padding: 12px;
				border-radius: 8px;

				.lab {
					position: absolute;
					top: 8px;
					left: 8px;
					padding: 4px;
					border-radius: 4px;
					background: rgba(0, 0, 0, 0.90);
					font-size: 12px;
					color: #fff;
					line-height: 1;

				}

				.img-box {
					position: relative;
					width: 138px;
					height: 104px;
				}

				.img {
					width: 100%;
					height: 100%;
					border-radius: 4px;
				}

				.info {
					margin-left: 12px;
					flex: 1;

					.name {
						font-size: 16px;
						line-height: 24px;
						font-weight: bold;
						color: #000000;
					}

					.second-title {
						margin-top: 4px;
						font-size: 12px;
						line-height: 18px;
						display: flex;
						align-items: center;

						.iconfont {
							font-size: 12px;
							margin-right: 4px;
						}
					}

					.desc {
						margin-top: 8px;
						color: #808080;
						line-height: 18px;
						font-size: 12px;
					}
				}
			}
		}
	}
</style>