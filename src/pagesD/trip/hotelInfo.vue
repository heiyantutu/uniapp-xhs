<template>
	<div class="ui_hotelInfo">
		<coustom-head color="#fff"></coustom-head>
		<div class="header">
			<img class="img" :src="hotelInfo.logo" alt="">
			<div class="welcome">欢迎来到</div>
       		<div class="name">{{hotelInfo.descript}}</div>
		</div>
		<div class="nav-warp" v-if="!isAjax">
			<trip-nav :teamOrder="teamOrder" :teamNo="teamNo" :hotelCode="hotelCode"></trip-nav>
		</div>
		<div class="hotel-info">
			<div class="name" v-if="!teamNo">{{hotelInfo.descript}}</div>
			<div class="hotel-info-list">
				<div class="hotel-info-item">
					<div class="label">入住房型</div>
					<div class="val">{{rmtypeDesc||hotelInfo.roomDescript}}</div>
				</div>
				<div class="hotel-info-item inline">
					<div class="label">入住时间</div>
					<div class="val">{{arrDate}} {{arrTime}}</div>
				</div>
				<div class="hotel-info-item inline">
					<div class="label">退房时间</div>
					<div class="val">{{depDate}} 12:00</div>
				</div>
			</div>
			<div class="moreText" v-if="hotelInfo.abstracts">
				<more-text :content="hotelInfo.abstracts" openText="更多" maxLine="5"></more-text>
			</div>

			<div class="hotel-icon-list" v-for="(picType,i) in picTypeList" :key="i">
				<div class="title">
					{{picType.descript}}
				</div>
				<div class="icon-list" :style="{height:(picType.list.length>5?'140px':'50px')}">
					<swiper-box :slides="picType.listNew" :swiperConfig="swiperConfig" :isDot="picType.list.length>10?true:false">
						<template v-slot:item="{ item }">
							<div class="icons" >
								<div class="icon" v-for="(icon,i) in item" :key="i">
									<img class="img"
										:src="icon.logo">
									<div class="name">{{icon.descript}}</div>
								</div>
							</div> 
						</template>
					</swiper-box>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted } from "vue";
	import api from "@/utils/api";
	import swiperBox from "@/components/swiperBox.vue";
	import moreText from "@/components/moreText.vue";
	import coustomHead from "@/components/coustomHead.vue";
	import { jAlert3 } from "@/base/jAlert/jAlert";
	import tripNav from "@/components/tripNav.vue";
	import { getStorage } from "@/utils/wxuser";
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import dayjs from "dayjs";
	let config = getStorage('config')
	let hotelCode = ref("")
	let hotelInfo:any= ref({})
	let depDate = ref("")
	let arrDate = ref("")
	let arrTime = ref("")
	let roomType = ref("")
	let picTypeList = ref([])
	let fromDate = ref(dayjs().format("YYYY-MM-DD"));
	let toDate = ref(dayjs().add(1, "days").format("YYYY-MM-DD"));
	let rmtypeDesc = ref("")
	let teamNo = ref('');
	let user = getStorage('user');
	let teamOrder:any = ref({});
	let isAjax = ref(true)
	let swiperConfig = reactive({
		indicatorDots: false,
		autoplay: false,
		slot: true,
		dotPosStyle: `bottom:-14px;left:50%;transform: translate(-50%);background:rgba(204, 204, 204, 0.28);`,
		dotStyle: 'background:#000;'
	});
	const findPicTypeByRoomType = () => {
		api.interfaceTransfer({
			query: {
				"hotelGroupCode": config.hotelGroupCode,
				"hotelCode": hotelCode.value,
				"roomType": roomType.value
			},
			config: {
				"interfaceType": "POST",
				"interfaceModule": "GC_PRODUCT_JOURNEY",
				"interfaceMethod": `/api/travelGroup/findPicTypeByRoomType`,
				"interfaceFrom": "GC",
				"hotelGroupCode": config.hotelGroupCode
			}
		})
			.then((res : any) => {
				if (res.result == 1 && res.retVal.result == 0) {
					picTypeList.value = res.retVal.retVal
					picTypeList.value.forEach((item:any)=>{
						item.listNew = []
						item.list.forEach((list:any,i:number)=>{
							let index = Math.trunc(i/10)
							if(item.listNew[index]){
								item.listNew[index].push(list)
							}else{
								item.listNew[index] = []
								item.listNew[index].push(list)
							}
						})
					})

				}
			})
	}
	const showOrder = () => {
		api
			.showOrder({
				orderNo: teamOrder.value.reserveList[0].orderNo,
				hotelGroupCode: config.hotelGroupCode,
			})
			.then((res : any) => {
				isAjax.value = false
				if (res.result == 1) {
					teamOrder.value.guestList = res.retVal.guestList
					teamOrder.value.hotelCode = res.retVal.hotelCode
					teamOrder.value.arrivalFrom = res.retVal.arrStr
					arrTime.value = dayjs(res.retVal.arrStr).format("HH:mm")
					if (res.retVal.sta == "N" || (res.retVal.sta == 'R' && res.retVal.paySta == 2)) {
						teamOrder.value.orderSta = "W"
					}
					if (res.retVal.sta == "I") {
						teamOrder.value.orderSta = "I"
						
					}
					if (res.retVal.sta == "O") {
						teamOrder.value.orderSta = "O"
					
					}
					teamOrder.value.productDesc = res.retVal.hotelDescript
				
				} else {
					jAlert3(res.msg);
				}
			});
	};
	const getHotelInfo = () => {
		
		var obj = {
		  fromDate:fromDate.value,
		  toDate:toDate.value,
		  otaChannel: 'wechat',
		  hotelCodes: [hotelCode.value],
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
				hotelInfo.value.descript = res.retVal[0].gcHotel.descript
				teamOrder.value.productDesc = hotelInfo.value.descript
				hotelInfo.value.logo =  res.retVal[0].gcHotelExtra.logo
				res.retVal[0].productRoomList.forEach((item:any)=>{
					console.log(item)
					if(item.roomType==roomType.value){
						hotelInfo.value.roomDescript = item.roomDescript
						hotelInfo.value.abstracts = item.gcRoomExtra.abstracts
						
					}
				})
			} else {
				jAlert3(res.msg);
			}
			
		})
		
	};
	const getTeamDetail = (cb:any) => {
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
		}).then((res : any) => {
			if (res.result == 1 && res.retVal.result == 0) {
				if (res.retVal.retVal.length > 0) {
					res.retVal.retVal.forEach((item : any) => {
						if(item.teamNo == teamNo.value){
							teamOrder.value = item
							cb&&cb()
						}
					})
				}
			}
			
		})
		
	}
	onLoad((options : any) => {
		if(options.teamNo){
			teamNo.value = options.teamNo
		}
		if(options.depDate){
			depDate.value = decodeURIComponent(options.depDate)
		}
		if(options.arrDate){
			arrDate.value = decodeURIComponent(options.arrDate)
		}
		hotelCode.value = options.hotelCode
		roomType.value = options.rmtype
		rmtypeDesc.value = options.rmtypeDesc

	})
	onMounted(() => {
		findPicTypeByRoomType()
		if(teamNo.value){
			getTeamDetail(()=>{
				showOrder()
				getHotelInfo()
			})
		}else{
			arrTime.value = '12:00'
			getHotelInfo()
		}
		
	});
</script>

<style lang="less" scoped>
	.ui_hotelInfo {
		padding-bottom: 30px;
		padding-bottom: calc(30px + constant(safe-area-inset-bottom));
		padding-bottom: calc(30px + env(safe-area-inset-bottom));
		.header {
			position: relative;
			.img {
				width: 100%;
				height: 282px;
			}
			.welcome{
				position: absolute;
				top: 96px;
				left: 16px;
				font-size: 14px;
				line-height: 14px;
				opacity: 0.8;
				color: #fff;
			}
			.name{
				position: absolute;
				top: 126px;
				left: 16px;
				font-size: 24px;
				font-style: normal;
				font-weight: 900;
				font-family: Source Han Serif CN;
				color: #fff;
			}

		}
		.nav-warp {
			
			margin: -40px 16px 0;
			position: relative;
			background: #FFFFFF;
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
					color: #000;
					font-weight: normal;
					font-size: 12px;
					line-height: 1;
					margin-top: 6px;
				}
			}
		}
		.hotel-info {
			padding: 0 16px;

			.name {
				margin-top: 15px;
				font-size: 20px;
				line-height: 1;
				font-weight: bold;
			}

			.hotel-info-list {
				display: flex;
				flex-wrap: wrap;
				margin-top: 8px;

				.hotel-info-item {
					margin-top: 16px;
					display: flex;
					width: 100%;
					font-size: 14px;

					&.inline {
						width: 50%;
					}

					.label {
						white-space: nowrap;
						color: #808080;
					}

					.val {
						color: #000000;
						margin-left: 12px;
					}
				}
			}

			.moreText {
				margin-top: 16px;
				font-size: 14px;
				line-height: 22px;
				color: #808080;
			}
		}

		.hotel-icon-list {
			margin-top: 32px;

			.title {
				font-size: 18px;
				line-height: 1;
				font-weight: bold;
			}

			.icon-list {
				margin-top: 32px;
				height: 140px;
				position: relative;

				.icons {
					display: flex;
					flex-wrap: wrap;
					.icon {
						margin-bottom: 40px;
						
						width: 20%;
						text-align: center;

						.img {
							width: 18px;
							height: 18px;
						}

						.name {
							margin-top: 10px;
							font-size: 12px;
							font-style: normal;
							font-weight: 400;
							color: #808080;
						}
					}
				}
			}
		}
	}
</style>