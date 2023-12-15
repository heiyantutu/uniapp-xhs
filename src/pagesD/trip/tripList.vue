<template>
	<div class="ui_tripList">
		<!-- #ifdef MP -->
		<coustom-head title="全部行程" nativeMode=true>
		</coustom-head>
		<!-- #endif -->
		<div class="tripList">
			<div class="trip-item" v-for="(item,i) in teamList" :key="i" @click="toTrip(item)" :class="{'active':item.teamNo == teamNo}">
				<img :src="item.reserveList[0].productUrl" class="trip-img" v-if="item.reserveList&&item.reserveList.length>0" mode='aspectFill'>
				<div class="trip-info">
					<div class="trip-date">
						{{item.tripTime}}
					</div>
					<div class="trip-name">
						{{item.productDesc}}<i class="iconfont icon-a-12_youlajiantou_hui"></i>
					</div>
				</div>

			</div>

		</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted } from "vue";
	import api from "@/utils/api";
	import { getStorage, setStorage } from "@/utils/wxuser";
	import { goPage } from "@/utils/utils";
	import dayjs from "dayjs";
	import coustomHead from "@/components/coustomHead.vue";
	import { onLoad } from "@dcloudio/uni-app";
	let user = getStorage('user')
	let config = getStorage('config')
	let teamNo:any = ref("");
	const hotelList : any = ref([]);
	const teamOrder : any = ref([]);
	const toTrip = (item : any) => {
		if (item.teamType == 'SingleRoom') {
			goPage(`/pagesD/trip/hotelInfo?teamNo=${item.teamNo}&hotelCode=${item.teamRsvSrcs[0].hotelCode}&arrDate=${dayjs(item.beginDate).format('M月D日')}&depDate=${dayjs(item.endDate).format('M月D日')}&rmtype=${item.teamRsvSrcs[0].rmtype}`)
		}else{
			goPage('/pagesD/trip/tripDetail?teamNo=' + item.teamNo)
		}
		
	}
	let teamList = computed(() => {
		let teamList = teamOrder.value;
		teamList.forEach((item : any) => {
			if (item.teamType == 'SingleRoom') {
				hotelList.value.forEach((hotel : any) => {
					if (item.teamRsvSrcs && item.teamRsvSrcs.length > 0) {
						if (item.teamRsvSrcs[0].hotelCode == hotel.code) {
							console.log(item)
							item.productDesc = hotel.descript
							if(item.reserveList.length>0){
								item.reserveList[0].productUrl = hotel.extraLogo
							}else{
								item.reserveList.push({
									productUrl: hotel.extraLogo
								})
							}
							
						}
					}
				})
			}
		})
		return teamList
	})
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
			memberNo: ""
		};
		api
			.findHotel(findHotelParameter)
			.then((res : any) => {
				if (res.result == 1) {
					hotelList.value = res.retVal.resultInfos
				}
			})
			.catch(function (error : any) {

				console.log(error);
			});
	};
	const getOrderList = () => {
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
		})
			.then((res : any) => {
				if (res.result == 1 && res.retVal.result == 0) {

					if (res.retVal.retVal.length > 0) {
						res.retVal.retVal.forEach((item : any) => {
							if(item.orderType=='Custom'){
								item.productCode = item.id
								item.productDesc = item.teamName
							}
							if (item.teamType == 'SingleRoom') {
								if (item.beginDate) {
									item.tripTime = `${dayjs(item.beginDate).format('YYYY年M月D日')}-${dayjs(item.endDate).format('M月D日')}`
								}
							}else{

								if (item.beginDate) {
									// item.dayEndDiff = dayjs().diff(item.teamOrder.endDate, 'day')
									item.dayDiff = dayjs().diff(item.beginDate, 'day')
									item.dayDiff = item.dayDiff
									if (item.dayDiff < 0) {
										item.tripTime = `${dayjs(item.beginDate).format('YYYY年M月D日')}出发`
									} else if (item.dayDiff >= 0) {
										item.tripTime = `${dayjs(item.beginDate).format('YYYY年M月D日')}-${dayjs(item.endDate).format('M月D日')}`
									}
								}
							}
							

						})
						console.log( res.retVal.retVal)
						teamOrder.value = res.retVal.retVal

					}


				}
			})
	}
	onLoad((options:any)=>{
		if(options.teamNo){
			teamNo.value = options.teamNo
		}
	})
	onMounted(() => {
		getOrderList()
		getHotelList()
	});
</script>

<style lang="less" scoped>
	.ui_tripList {
		padding: 4px 12px 30px;
		padding-bottom: calc(30px + constant(safe-area-inset-bottom));
		padding-bottom: calc(30px + env(safe-area-inset-bottom));

		.tripList {

			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.trip-item {
				margin-top: 4px;
				position: relative;
				width: calc(50% - 2px);
				border-radius: 12px;
				border:4px solid transparent;
				overflow: hidden;
				
				&.active{
					border:4px solid #A43127;
				}
				.trip-img {
					display: block;
					width: 100%;
					height: 33vw;
				}

				.trip-info {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: rgba(0, 0, 0, 0.4);
					padding: 12px;

					.trip-date {
						display: inline-flex;
						padding: 4px;
						border-radius: 4px;
						background: rgba(0, 0, 0, 0.32);
						color: #fff;
						font-size: 12px;
					}

					.trip-name {

						margin-top: 8px;
						font-size: 16px;
						font-family: Source Han Serif CN;
						font-weight: 900;
						line-height: 24px;
						color: #fff;

						.iconfont {
							display: inline-block;
							font-size: 12px;
							line-height: 24px;
							margin-left: 4px;
							vertical-align: top;
							font-weight: normal;
						}
					}
				}
			}
		}

	}
</style>