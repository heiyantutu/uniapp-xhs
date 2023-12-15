<template>
	<div class="paySuccess_ui">
		<div class="pay-sta">
			<i class="icon iconfont icon-a-120_tijiaochenggong"></i>
			<div class="tl">支付完成</div>
			<div class="progress"></div>
			<div class="tips">松赞期待与你相遇，如需帮助请联系松赞顾问<br>400-0000-830</div>
			<image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/authBg.png" mode="widthFix"
				class="bg" />
			<div class="pay-btns">
				<div class="btn-def" @click="goOrderInfo()">订单详情</div>
				<div class="btn-def baseBtn" @click="goPage('/pages/travel/index')">返回主页</div>
			</div>
		</div>

		<div class="product" v-if="adTravel.items&&adTravel.items.length>0">
			<div class="product-tl" @click="toMoreTipr()" v-if="adTravel.title">
				{{adTravel.title}}
				<i class="iconfont icon-a-16_youlajiantou_hei" v-if="adTravel.link"></i>
			</div>
			<div class="product-list">

				<div class="product-item" v-for="(item,index) in adTravel.items" :key="index" @click="toPage(item)">
					<div class="product-img">
						<img class="img"
							:src="item.pics+'?imageView2/1/w/332/h/332&x-oss-process=image/resize,m_fill,w_322,h_332'">
					</div>
					<div class="product-info">
						<div class="product-name">
							{{item.title}}
						</div>

						<div class="product-bt">
							
							<div class="product-price" v-if="item.price==-1">满房</div>
							<div class="product-price" v-else>¥{{item.price}}</div>
							<div class="product-btn">详情</div>
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
	import { getStorage } from "@/utils/wxuser";
	import { goPage } from "@/utils/utils";
	import { onLoad } from "@dcloudio/uni-app";
	import { jAlert3 } from "@/base/jAlert/jAlert";
	import defaultChannel from "@/utils/defaultChannel";
	let config = getStorage("config");
	let user = getStorage("user")
	let orderNo = ref("");
	let productType = ref("");
	let adTravel : any = ref({})
	let channel = ref(defaultChannel);
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
	const goOrderInfo = () => {
		if (productType.value == "hotel") {
			goPage(`/pagesC/order/orderInfo?orderNo=${orderNo.value}`);
		} else if (productType.value == "shop") {
			goPage(`/pagesB/travel/orderDetail?orderNo=${orderNo.value}&productType=${productType.value}`);
		} else if (productType.value == "activity") {
			goPage(`/pagesE/dailyActivity/dailyOrderDetail?orderNo=${orderNo.value}&productType=${productType.value}`);
		} else {
			goPage(`/pagesB/travel/orderDetail?orderNo=${orderNo.value}`);
		}


	}
	const toMoreTipr = () => {
		goPage(adTravel.value.link)
	}
	const toPage = (item : any) => {
		if (item.productType == 'tdq') {
			goPage(`/pagesB/exchangeCoupon/exchangeCouponDetail?id=${item.productId}`)
		} else if (item.productType == 'hotel') {
			goPage(`/pagesC/order/hotel?hotelCode=${item.productId}`)
		} else if (item.productType == 'daily') {
			goPage(`/pagesE/dailyActivity/dailyActivityDetail?activityCode=${item.productId}`)
		} else {
			goPage(`/pagesB/travel/travelDetail?travelType=${item.travelType}`)
		}
	}
	const marketingPage = () => {
		let opt = {
			hotelGroupCode: config.hotelGroupCode,
			firstResult: 0,
			pageSize: 15,
			clientTypes: channel.value,
			showLocation: '1'
		}

		api.marketingPage(opt).then((res : any) => {
			if (res.result == 0) {
				if (res.retVal && res.retVal.datas && res.retVal.datas.length > 0) {
					let infos = JSON.parse(res.retVal.datas[0].infos)
					if (infos && infos.length > 0) {
						adTravel.value.id = infos[0].id
						adTravel.value.title = infos[0].title
						adTravel.value.link = infos[0].link
						adTravel.value.items = []
						api.queryMarketingProducts({
							hotelGroupCode: config.hotelGroupCode,
							hotelCode: config.hotelCode,
							products: infos[0].productChoose
						}).then((res : any) => {
							 res.retVal.forEach((item:any)=>{
								 if(item.pics){
									  item.pics = item.pics.split(",")[0]
								 }
								 if(item.productType=='daily'){
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
							adTravel.value.items = res.retVal
						})
					}


				}
			} else {
				jAlert3(res.msg, 2000)
			}
		})
	}
	onLoad((options : any) => {
		orderNo.value = options.orderNo;
		productType.value = options.productType;
	});
	onMounted(() => {
		marketingPage()
	});
</script>

<style lang="less" scoped>
	@import url("~@/styles/skin.less");
	@import url("~@/styles/mixin.less");

	.paySuccess_ui {
		padding-bottom: 60px;

		.bg {
			position: absolute;
			top: 0;
			left: 0;
			width: 100vw;
			z-index: 1;
		}

		.pay-sta {
			text-align: center;
			background: #fff;
			padding: 120px 10px 40px;

			.iconfont {
				font-size: 120px;
			}

			.paySuccess-img {
				width: 120px;
				height: 120px;
			}

			.tl {
				margin-top: 40px;
				font-size: 18px;
				line-height: 18px;
				font-weight: bold;
			}

			.tips {
				margin-top: 12px;
				font-size: 14px;
				line-height: 22px;
				text-align: center;

				color: #808080;
			}

			.pay-btns {
				position: relative;
				z-index: 2;
				margin-top: 32px;
				width: 100%;
				display: flex;

				.btn-def {
					display: flex;
					align-items: center;
					justify-content: center;

					font-size: 16px;
					height: 48px;
					border: 0.5px solid #1e1e1e;
					border-radius: 4px;
					flex: 1;
					margin: 0 6px;
				}
			}
		}

		.product-tl {
			display: flex;
			justify-content: space-between;
			font-weight: 600;
			font-size: 18px;
			line-height: 18px;
			padding: 24px 16px 12px;
		}

		.product-list {
			display: flex;
			flex-wrap: wrap;
			padding: 0 32rpx;
			justify-content: space-between;
			width: 100%;

			.product-item {
				margin-top: 12px;
				width: 44.3vw;
				border-radius: 8px;
				overflow: hidden;
				background: #fff;

				.product-img {
					width: 100%;
					height: 44.3vw;

					.img {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
				}

				.product-info {
					padding: 12px;

					.product-name {
						font-family: PingFangSC-Medium;
						font-size: 16px;
						color: #000000;
						font-weight: bold;
						line-height: 24px;
						height: 48px;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;

					}

					.product-desc {
						margin-top: 4px;
						padding: 4px;
						font-size: 12px;
						color: #a43127;
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
							font-family: Montserrat;
							font-size: 16px;
							color: #000000;
							font-weight: 600;
						}

						.product-btn {
							padding: 8px 12px;
							font-size: 14px;
							color: #ffffff;
							background: #000;
							border-radius: 4px;
						}
					}
				}
			}
		}
	}
</style>