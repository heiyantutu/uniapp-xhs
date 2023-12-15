<template>
	<div class="ui_tripHotel">
		<!-- #ifdef MP -->
		<coustom-head title="行程酒店" nativeMode=true>
		</coustom-head>
		<!-- #endif -->
		<div class="hotel-list">
			<template v-for="(item,i) in teamItineraries" :key="i">
				<div class="hotel-item"   v-if="item.teamRsvSrcs.length>0">
					<div class="day">DAY{{item.dayNum}}<template v-if="item.night>1"> - DAY{{item.dayNum+item.night-1}}</template></div>
					<template  v-for="(hotel,j) in item.teamRsvSrcs" :key="j">
					<div class="hotel" @click="toHotel(hotel)" v-if="j<1">
						<div class="left-part">
							<img class="img"
								:src="hotel.extraLogo">
						</div>
						<div class="right-part">
							<div class="info">
								<div class="time">{{hotel.arrDateF}}入住 - {{hotel.depDateF}}退房</div>
								<div class="name">{{hotel.hotelDesc}}</div>
								<div class="desc">{{hotel.rmtypeDesc}}</div>
							</div>
							<i class="iconfont icon-a-28_dianhua" @click.stop="makePhoneCall(hotel.phone)"></i>
						</div>
					</div>
					</template>
				</div>
			</template>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted } from "vue";
	import {
		onLoad
	} from "@dcloudio/uni-app";
	import api from "@/utils/api";
	import dayjs from "dayjs";
	import { getStorage } from "@/utils/wxuser";
	import coustomHead from "@/components/coustomHead.vue";
	let config = getStorage('config')
	let user = getStorage('user')
	let travelDetail : any = ref({})
	let teamItineraries = ref([])
	let teamNo = ref("")
	const toHotel = (hotel : any) => {
	
		uni.navigateTo({
			url: `/pagesD/trip/hotelInfo?rmtype=${hotel.rmtype}&hotelCode=${hotel.hotelCode}&arrDate=${hotel.arrDateF}&depDate=${hotel.depDateF}&rmtypeDesc=${hotel.rmtypeDesc}`
		})
	}
	const getTeamDetail = () => {
		api.interfaceTransfer({
			query: {
				"unitCode": config.hotelGroupCode,
				"mobile": user.mobile,
			},
			config: {
				"interfaceType": "GET",
				"interfaceModule": "GC_TRAVEL_ORDER",
				"interfaceMethod": `/api/team/order/detail/${teamNo.value}`,
				"interfaceFrom": "GC",
				"hotelGroupCode": config.hotelGroupCode
			}
		})
			.then((res : any) => {
				if (res.result == 1 && res.retVal.result == 0) {
					travelDetail.value = res.retVal.retVal
					let mergeRoom: any = []
					// teamItineraries.value = travelDetail.value.teamItineraryInfos[0].teamItineraries
					travelDetail.value.teamItineraryInfos[0].teamItineraries.forEach((item: any) => {
						if (item.teamRsvSrcs && item.teamRsvSrcs.length > 0) {
							let hotelInfo: any = {}
							hotelInfo = item
							hotelInfo.roomList = []
							item.teamRsvSrcs.forEach((room: any) => {
								hotelInfo.arrDate = room.arrDate
								hotelInfo.depDate = room.depDate
								hotelInfo.hotelDesc = room.hotelDesc
								hotelInfo.night = 1
								hotelInfo.roomList.push({
									rmtypeDesc: room.rmtypeDesc,
									rmtype: room.rmtype,
									rmnum: room.rmnum,
									hotelDesc: room.hotelDesc

								})
								// allteamRsvSrcs.push(room)
							})
							mergeRoom.push(hotelInfo)
						}
					})
					teamItineraries.value = mergeAndOverride(mergeRoom);
					console.log(teamItineraries.value )
					getHotelList()
				}
			})
	}
	const makePhoneCall = (phone : string) => {
		uni.makePhoneCall({
			phoneNumber: phone

		});
	}
	const arraysAreEqual = (arr1:any, arr2:any) => {
	const set1 = new Set(arr1);
	const set2 = new Set(arr2);

	// 比较 Set 对象
	return (
		set1.size === set2.size &&
		[...set1].every((value) => set2.has(value))
	);
	}
	const mergeAndOverride = (data: any) => {
		const result:any = [];

		for (const entry of data) {
			let mergedRoomList: any = {};
			entry.roomList.forEach((room: any) => {
				let key = `${entry.arrDate}_${room.rmtype}_${room.hotelDesc}`;
				if (mergedRoomList[key]) {
					mergedRoomList[key].rmnum += room.rmnum;
				} else {
					mergedRoomList[key] = {
						...room
					};
				}
			});
			entry.roomList = Object.values(mergedRoomList);
			entry.key = []
			entry.roomList.forEach((room: any) => {
				entry.key.push(`${room.rmtype}_${room.hotelDesc}_${room.rmnum}`)
			})
			let matchedEntry: any = result.find((resultEntry: any) =>
				entry.roomList.every((entryRoom: any) =>
					resultEntry.roomList.some((resultRoom: any, index: any) => {
						if ((entry.arrDate === resultEntry.depDate)&&arraysAreEqual(entry.key,resultEntry.key)) {
							resultEntry.roomList[index].rmnum += entryRoom.rmnum;
							return true;
						}
						return false;
					})
				)
			);
			if (matchedEntry) {
				matchedEntry.depDate = entry.depDate
				matchedEntry.night += entry.night
			} else {
				result.push(entry);
			}
		}

		return result;
	}
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
			.then(function (response : any) {
				if (response.result == 1) {

					teamItineraries.value.forEach((item : any) => {
						item.bizDateF = dayjs(item.bizDate).format('M月D日')
						item.moon = dayjs(item.bizDate).format('M')
						item.days = dayjs(item.bizDate).format('D')
						item.teamRsvSrcs.forEach((hotel : any) => {
							hotel.arrDateF = dayjs(item.arrDate).format('M月D日')
							hotel.depDateF = dayjs(item.depDate).format('M月D日')
							response.retVal.resultInfos.forEach((n : any, i:number) => {
								if (hotel.hotelCode == n.code) {
									hotel.extraLogo = n.extraLogo
									hotel.phone = n.phone
								}
							})

						})
					})


				}
			})
			.catch(function (error : any) {

				console.log(error);
			});
	};
	onLoad((options : any) => {
		teamNo.value = options.teamNo
	})
	onMounted(() => {
		getTeamDetail()
	});
</script>

<style lang="less" scoped>
	.ui_tripHotel {
		padding-bottom: 30px;
		padding-bottom: calc(30px + constant(safe-area-inset-bottom));
		padding-bottom: calc(30px + env(safe-area-inset-bottom));

		.hotel-list {
			padding: 0 16px;
			margin-top: -8px;

			.day {
				margin-top: 24px;
				font-size: 12px;
				color: #808080;
			}

			.hotel {
				display: flex;
				padding: 16px;
				background: #fff;
				border-radius: 8px;
				margin-top: 16px;

				.left-part {
					width: 107px;
					height: 80px;

					.img {
						width: 100%;
						height: 100%;
						border-radius: 4px;

					}
				}

				.right-part {
					display: flex;
					align-items: center;
					flex: 1;

					.info {
						line-height: 1;
						margin-left: 15px;
						flex: 1;

						.time {
							white-space: nowrap;
							font-size: 12px;
							overflow: hidden;
							color: #808080;
						}

						.name {
							margin-top: 12px;
							font-size: 18px;
							font-weight: bold;
							overflow: hidden;
						}

						.desc {
							margin-top: 8px;
							font-size: 14px;
							overflow: hidden;
						}
					}

					.icon-a-28_dianhua {
						font-size: 28px;
						color: #000;
					}
				}
			}
		}

	}
</style>