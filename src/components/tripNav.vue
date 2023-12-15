<template>
	<div class="nav-list" :class="{'center':iconList.length<4}" v-if="iconList.length>0">
		<div class="nav" v-for="(item,i) in iconList" :key="i" @click="goModulePage(item)">
			<div :class="'iconfont '+item.icon" v-if="item.icon">
				<div class="drop" v-if="item.drop"></div>
			</div>
             <img class="icon-img" :src="item.logo" v-else />
			<div class="txt">{{item.name}}</div>
			
		</div>
	</div>
	<bottom-dialog ref="tipsHelp" title="行程顾问">
		<div class="consultant">
			<img src="" class="head-img">
			<div class="career">顾问</div>
			<div class="name">{{consultant.name}}</div>
			<div class="tips">行程有任何疑问或需求，都可以向我咨询。</div>
		</div>
		<div class="layer-footer">
			<div class="layer-btn baseBtn" @click="makePhoneCall(consultant.mobile)">
				拨打电话
			</div>
		</div>
	</bottom-dialog>
	<bottom-dialog ref="tripInfo" title="" maxDialog>
		<div class="trip-info-list">
			<div class="name">
				尊敬的{{guest.name}}<template v-if="guest.sex==1">先生</template><template v-else>女士</template>
			</div>
			<div class="trip-info-item">
				欢迎来到松赞，以下为临行信息。
			</div>

			<template v-for="(item,i) in reserveBeforeInfo.reserveBeforePersonalizes" :key="i">
				<template v-if="item.teamGuestId == guest.id&&item.description">
					<div class="trip-info-tl">
						{{itemNames[item.itemName]}}
					</div>
					<div class="trip-info-item">
						{{item.description}}
					</div>
				</template>
			</template>
			<template v-if="reserveBeforeInfo.weathersDtos&&reserveBeforeInfo.weathersDtos.length>0">
				<div class="trip-info-tl">
					入住酒店的天气预报及海拔
				</div>
				<div class="trip-info-item">
					<div class="trip-info-item-table">
						<div class="tr">
							<div class="th">酒店</div>
							<div class="th">天气</div>
							<div class="th">海拔</div>

						</div>
						<template v-for="(item,i) in reserveBeforeInfo.weathersDtos[0].weathersDtos" :key="i">
							<div class="tr" v-if="item.hotelDesc">
								<div class="td" v-if="item.hotelDesc">{{item.hotelDesc}}</div>
							
								<div class="td"><template v-if="item.weatherFcEntity">↑{{item.weatherFcEntity.low}} -
										↓{{item.weatherFcEntity.high}}°C</template></div>
								<div class="td"><template v-if="item.altitude">{{item.altitude}}m</template></div>

							</div>
						</template>
					</div>

				</div>
			</template>
			<template v-if="reserveBeforeInfo.dressing">
				<div class="trip-info-tl">
					穿衣&建议
				</div>
				<div class="trip-info-item">
					{{reserveBeforeInfo.dressing}}
				</div>
			</template>

			<template v-if="reserveBeforeInfo.health">
				<div class="trip-info-tl">
					高原反应与健康
				</div>
				<div class="trip-info-item">
					{{reserveBeforeInfo.health}}
				</div>
			</template>
			<template v-if="reserveBeforeInfo.taboo">
				<div class="trip-info-tl">
					文化习惯及禁忌
				</div>
				<div class="trip-info-item">
					{{reserveBeforeInfo.taboo}}
				</div>
			</template>
			<template v-if="reserveBeforeInfo.carInfo">
				<div class="trip-info-tl">
					路况&用车
				</div>
				<div class="trip-info-item">
					{{reserveBeforeInfo.carInfo}}
				</div>
			</template>
			<template v-if="reserveBeforeInfo.roomDiningDesc">
				<div class="trip-info-tl">
					住宿餐饮注意事项
				</div>
				<div class="trip-info-item">
					{{reserveBeforeInfo.roomDiningDesc}}
				</div>
			</template>
			<template v-if="reserveBeforeInfo.beforeInfoHotelsDtos&&reserveBeforeInfo.beforeInfoHotelsDtos.length>0">
				<div class="trip-info-tl">
					酒店所在区域最近医院
				</div>
				<div class="trip-info-item">
					<div class="trip-info-item-table table-big">
						<div class="tr">
							<div class="th">酒店</div>
							<div class="th">医院</div>

						</div>
						<template v-for="(item,i) in reserveBeforeInfo.beforeInfoHotelsDtos" :key="i">
						<div class="tr" v-if="item.nearestHospital">
							<div class="td">{{item.hotelDesc}}</div>
							<div class="td">{{item.nearestHospital}}</div>

						</div>
						</template>
					</div>
				</div>
			</template>


		</div>
	</bottom-dialog>
	<bottom-dialog ref="serviceTeam" title="服务团队">
		<div class="serviceTeamList">
			<div class="item" v-for="(item,index) in listDriverButler" :key="index" @click="toDriverButler(item)">
				<div class="head">
					<img :src="item.mainPic" mode="aspectFill" v-if="item.mainPic" class="head-img">
					<img class="head-img" src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/head-def.png"  v-else>
				</div>
				<div class="info">
					<div class="info-head">
						<div class="left-part">
							<div class="career" v-if="item.personType=='HOUSEKEEP'">管家</div>
							<div class="career" v-else-if="item.personType=='DRIVER'">司机</div>
							<div class="career" v-else-if="item.personType=='GW'">顾问</div>
							<div class="name">{{item.name}}<i class="iconfont icon-a-12_youlajiantou_hui" v-if="item.personType!='GW'"></i></div>
						</div>
						<div class="iconfont icon-a-28_dianhua" @click.stop="makePhoneCall(item.mobile)" v-if="item.mobile">
						</div>
					</div>

					<div class="desc">
						{{item.biographicalNotes}}
					</div>
				</div>
			</div>

		</div>
	</bottom-dialog>
	<bottom-dialog ref="timeSelect" :title="arrTitle">
		<div class="arriveChoose">
			<div class="tips" v-if="arrTitle=='预计到店时间'"><i class="icon iconfont icon-a-12_tishi"></i>房间整晚保留，12:00前到店可能需要等房，如需接机请联系酒店前台 <div class="phone" @click="showKf()">400-0000-830<i class="iconfont icon-a-12_youlajiantou_hei"></i> </div></div>
			<div class="tips" v-else><i class="icon iconfont icon-a-12_tishi"></i>如需送机请联系酒店前台 <div class="phone" @click="showKf()">400-0000-830<i class="iconfont icon-a-12_youlajiantou_hei"></i></div></div>
			<div class="picker-view">
				<div class="picker-view-bg"></div>
				<picker-view  indicator-style="height: 56px;" style="width: 100%; height: 280px;"  :value="chooseTimeIndex"
					mask-class="pickerMask" v-if="timeList.length>0">
					<picker-view-column>
						<view v-for="(time,timeIndex) in timeList" :key="timeIndex"
							style="line-height: 56px; text-align: center;">
							{{time.displayTime}}
						</view>
					</picker-view-column>
				</picker-view>
			</div>
		</div>
	</bottom-dialog>
	<kf-dialog ref="kf" title="一键咨询"></kf-dialog>
</template>
<script lang="ts">
	import { defineComponent, ref, onMounted,watch } from "vue";
	import bottomDialog from "@/components/bottomDialog.vue";
	import kfDialog from "@/components/kfDialog.vue";
	import UmengSDK from "@/utils/umengAdaptor.js";
	import { goPage } from "@/utils/utils";
	import { getStorage, setStorage } from "@/utils/wxuser";
	import api from "@/utils/api";
	import { jAlert3 } from "@/base/jAlert/jAlert";
	import dayjs from "dayjs";



	let user = getStorage('user')
	let config = getStorage('config')
	export default defineComponent({
		name: "travelItem",
		components: {
			bottomDialog,
			kfDialog
		},
		props: {
			teamNo: {
				type: String,
				default: ''
			},
			dayDiff: {
				type: Number,
				default: 0
			},
			productCode: {
				type: String,
				default: ''
			},
			teamOrder: {
				type: Object,
				default: {}
			},
			page: {
				type: String,
				default: ""
			},
			dayEndDiff: {
				type: Number,
				default: 0
			},
			type: {
				type: String,
				default: ""
			},
			hotelCode: {
				type: String,
				default: "0"
			},
		},
		setup(props : any, context) {
			const hotelMsg : any = ref({})
			const iconList : any = ref([])
			const masterInfo:any=ref({})
			const isAjax = ref(false)
			const guest : any = ref({})
			const tripInfo = ref()
			const serviceTeam = ref()
			const tipsHelp = ref()
			const kf = ref()
			const listDriverButler = ref([])
			const consultant : any = ref({})
			const reserveBeforeInfo : any = ref({})
			const arrivalFrom = ref("")
			const arriveTime = ref("")
			const fromDate = ref("")
			const chooseTimeIndex : any = ref([12])
			const timeList : any = ref([]);
			const timeSelect = ref()
			const otaChannel = ref("WECHAT");
			const hotelFromDate = ref(dayjs().format("YYYY-MM-DD"));
			const hotelToDate = ref(dayjs().add(1, "days").format("YYYY-MM-DD"));
			const memberNo = ref('');
			const teamOrder:any = ref({})
			const arrTitle =ref("")
			const orderNo = ref("")
			const itemNames = ref({
				app:'实用app',
				bookMovie:'书籍与电影推荐',
				fightInfo:'推荐航班信息',
				kindReminder:'温馨提示'
			})
			
			const toDriverButler = (item : any) => {
				if(item.personType!='GW'){
					goPage("/pagesD/trip/houseKeep?code=" + item.code)
				}
				
			}
			const dateFormat = (val : string) => {
				return dayjs(val).format("MM-DD");
			}
			const listByOrderNo = () => {
				api.interfaceTransfer({
					query: {
						"orderNo": orderNo.value,
						"unitCode": config.hotelGroupCode
					},
					config: {
						"interfaceType": "GET",
						"interfaceModule": "GC_TRAVEL_ORDER",
						"interfaceMethod": `/api/shuttle/listByOrderNo`,
						"interfaceFrom": "GC",
						"hotelGroupCode": config.hotelGroupCode
					}
				})
					.then((res : any) => {
						if (res.result == 1 && res.retVal.result == 0) {
							if(res.retVal.retVal.length<=0){
								iconList.value.forEach((item:any)=>{
									if(item.type == 'shuttle'){
										item.drop = true
									}
								})
							}else{
								iconList.value.forEach((item:any)=>{
									if(item.type == 'shuttle'){
										item.drop = false
									}
								})
							}

						} else {
							jAlert3(res.retVal.msg || res.msg)
						}
					})
			}
			const listGuestLinkExtraInfoWithMemberIdOrOpenId = (cb:any) => {
				api.listGuestLinkExtraInfoWithMemberIdOrOpenId({
					channel: 'WECHAT',
					hotelGroupCode: config.hotelGroupCode,
					hotelCode: config.hotelCode,
					memberId: user.memberId,
					openIdType: 'WECHAT'

				}).then((res : any) => {
					if (res.result == 1) {
						if (res.retVal.result == 0) {
							res.retVal.retVal.forEach((item : any) => {
								if(user.mobile == item.mobile){
									guest.value.guestId = item.guestId
								}
							
							
							})
							cb&&cb()
						}

					}
				})
			}
			const getTeamDetail = (cb : any) => {
	
				if (isAjax.value) {
					return;
				}
				isAjax.value = true
				api.interfaceTransfer({
					query: {
						"mobile": user.mobile,
						"unitCode": config.hotelGroupCode
					},
					config: {
						"interfaceType": "GET",
						"interfaceModule": "GC_TRAVEL_ORDER",
						"interfaceMethod": `/api/team/order/detail/${props.teamNo}`,
						"interfaceFrom": "GC",
						"hotelGroupCode": config.hotelGroupCode
					}
				})
					.then((res : any) => {
						isAjax.value = false
						if (res.result == 1 && res.retVal.result == 0) {
							let teamInfo = res.retVal.retVal
							res.retVal.retVal.guests.forEach((item : any) => {
								if (item.mobile == user.mobile) {
									guest.value = item
									res.retVal.retVal.reserveOrders.forEach((order:any)=>{
										if(order.orderNo == item.orderNo){
											orderNo.value = order.orderNo;
											memberNo.value = order.memberId;
											
										}
									})
									
								}
							})
							context.emit("getOrderNo",orderNo.value);
							if(teamInfo.teamItineraryInfos&&teamInfo.teamItineraryInfos.length>0){
								let activesTl = ""
								teamInfo.teamItineraryInfos[0].teamItineraries.forEach((item:any)=>{
									if (dayjs(item.bizDate).format('MM-DD') == dayjs().format('MM-DD')) {
										
										if (item.actives && item.actives.length > 0) {
											
											item.actives.forEach((active: any) => {
												if (activesTl) {
													activesTl += " - " + active.activeName
												} else {
													activesTl = active.activeName
												}
											})
										}
									}
									
								})
								context.emit("getActives",activesTl);
							}
							if(guest.value.idNo){
								queryMasterInfo('travel')
							}
							
							teamOrder.value = res.retVal.retVal.teamOrder
							
							
							if (res.retVal.retVal.reserveBeforeInfo) {
								reserveBeforeInfo.value = res.retVal.retVal.reserveBeforeInfo
							}
							reserveBeforeInfo.value.weathersDtos = res.retVal.retVal.weathersDtos
							reserveBeforeInfo.value.beforeInfoHotelsDtos = res.retVal.retVal.beforeInfoHotelsDtos
							
							cb && cb()

						} else {
							jAlert3(res.retVal.msg || res.msg)
						}
						
					})
			}
			const makePhoneCall = (phone : string) => {
				if (!phone) {
					jAlert3('暂无手机号')
					return;
				}
				uni.makePhoneCall({
					phoneNumber: phone

				});
			}
			const listDriverButlerDto = (cb : any) => {
				if (isAjax.value) {
					return;
				}
				isAjax.value = true
				api.interfaceTransfer({
					query: {
						"teamNo": props.teamNo,
						"unitCode": config.hotelGroupCode
					},
					config: {
						"interfaceType": "GET", 
						"interfaceModule": "GC_TRAVEL_ORDER",
						"interfaceMethod": `/api/team/order/listDriverButlerDto`,
						"interfaceFrom": "GC",
						"hotelGroupCode": config.hotelGroupCode
					}
				})
					.then((res : any) => {
						isAjax.value = false
						if (res.result == 1 && res.retVal.result == 0) {
							listDriverButler.value = res.retVal.retVal
							let mainConsultant:any = {}
							let partConsultant:any = {}
							listDriverButler.value.forEach((item: any) => {
								if (item.personType == "GW"){
									mainConsultant = item
								}
								if (item.isPartButler == "T"){
									partConsultant = item
								}
								if (item.personType == "GW"&&item.isHostHousekeep=='T') {
									consultant.value = item;
								}
							});
							if(!consultant.value.code){
							if(mainConsultant.code){
								consultant.value = mainConsultant
							}else{
								consultant.value = partConsultant
							}
							}
							
							cb && cb()
						} else {
							jAlert3(res.retVal.msg || res.msg)
						}
					})

			}
			const showKf= () => {
				timeSelect.value.hideDialog()
				kf.value.showDialog();
			}
			const queryMasterInfo = (type:string) => {
				api
					.interfaceTransfer({
					query: {
						unitCode: config.hotelGroupCode,
						teamNo: props.teamNo,
						idNo: guest.value.idNo,
					},
					config: {
						interfaceType: "GET",
						interfaceModule: "GC_TRAVEL_ORDER",
						interfaceMethod: "/api/team/order/findHotelMasterInfoByTeamNo",
						interfaceFrom: "GC",
						hotelGroupCode: config.hotelGroupCode,
					},
					})
					.then((res: any) => {
					if (res.result == 1 && res.retVal.result == 0) {
						if(res.retVal.retVal.length>0){
							masterInfo.value = res.retVal.retVal[0]
							context.emit("getMasterInfo",res.retVal.retVal[0]);
							if(type=='hotel'){
								listHotelServiceBySta(res.retVal.retVal[0].hotelCode);
							}
						}
					
					} else {
						// jAlert3(res.retVal.msg || res.msg)
					}
				});
			};
			const listHotelServiceBySta = (hotelCode: any) => {
				api.listHotelServiceBySta({
					hotelGroupCode: config.hotelGroupCode,
					hotelCode: hotelCode,
					sta: "N",
					})
					.then((res: any) => {
					res.retVal.forEach((item: any) => {
						item.type = "hotelService";
						item.name = item.serviceName;
					});
					iconList.value = [ ...iconList.value,...res.retVal];
					if(iconList.value.length>8){
						iconList.value = iconList.value.slice(0,7)
						iconList.value.push({
							name: '全部服务',
							icon: 'icon-a-20_quanbufuwu_hei',
							type: 'all'
						})
					}
				});
			};
			const goModulePage = (item : any) => {

				if(props.page=='detail'){
					UmengSDK.sendEvent("tdp_icon_clk", {
						page_name: "travel_detail_pg",
						page_id: "",
						page_title_name: props.teamOrder.pageTitle || '',
						button_id: item.type,
						button_name: item.name
					});
				}else{
					UmengSDK.sendEvent("tcp_icon_clk", {
						page_name: "travel_cover_pg",
						page_id: "",
						page_title_name: props.teamOrder.pageTitle || '',
						button_id: item.type,
						button_name: item.name
					});
				}
				
				if (item.type == 'tips') {
					if (!reserveBeforeInfo.value.id) {
						getTeamDetail(() => {
							tripInfo.value.showDialog();
						})
					} else {
						tripInfo.value.showDialog();
					}
					UmengSDK.sendEvent("tcp_icon_clk", {
						page_name: "travel_cover_pg",
						page_id: "",
						page_title_name: props.teamOrder.pageTitle || '',
						button_id: item.type,
						button_name: item.name
					});
				}
				if (item.type == 'shuttle') {
					if (!memberNo.value) {
						getTeamDetail(() => {
							goPage(`/pagesD/trip/takeInfo?orderNo=${orderNo.value}&memberNo=${memberNo.value}`)

						})
					} else {
						goPage(`/pagesD/trip/takeInfo?orderNo=${orderNo.value}&memberNo=${memberNo.value}`)
					}


				}
				if (item.type == 'preference') {
					
					goPage(`/pagesA/member/travelPreference?type=guest&guestId=${guest.value.guestId}&orderNo=${orderNo.value}&orderType=${props.teamOrder.orderType}`)
				
				}
				if (item.type == 'trip') {
					goPage("/pagesD/trip/tripDetail?teamNo=" + props.teamNo)
				}
				if (item.type == 'extend') {
					goPage(`/pagesC/order/hotel?hotelCode=${props.hotelCode}&fromDate${hotelFromDate.value}&toDate=${hotelToDate.value}&otaChannel=${otaChannel.value}`)
				}

				if (item.type == 'contact') {
					showKf()
				}
				if (item.type == 'album') {
					setStorage('teamInfo',{
						guestId:guest.value.id,
						guestName:guest.value.name,
						teamNo:teamOrder.value.teamNo,
						teamName:teamOrder.value.teamName,
						teamBeginTime:teamOrder.value.beginDate,
						teamEndTime:teamOrder.value.endDate
					})
					if (!guest.value.id) {
						getTeamDetail(() => {
							goPage("/pagesD/trip/album?teamNo=" + props.teamNo + '&guestId=' + guest.value.id)
						})
					} else {
						goPage("/pagesD/trip/album?teamNo=" + props.teamNo + '&guestId=' + guest.value.id)
					}

				}
				if (item.type == 'hotelAlbum') {
					goPage(`/pagesD/trip/hotelAlbumDetail?name=${props.teamOrder.productDesc}`)
				}
				if (item.type == 'all') {
					if(props.teamOrder.orderType == 'SingleRoom'){
						goPage(`/pagesD/trip/allServices?teamNo=${props.teamNo}&orderType=SingleRoom`)
					}else{
						goPage(`/pagesD/trip/allServices?teamNo=${props.teamNo}&guestId=${guest.value.id}`)
					}
					
				}
				if (item.type == 'help') {
					if (listDriverButler.value.length == 0) {
						listDriverButlerDto(() => {
							makePhoneCall(consultant.value.mobile)
						})
					} else {
						makePhoneCall(consultant.value.mobile)
					}
					// tipsHelp.value.showDialog();

				}
				if (item.type == 'team') {
					if (listDriverButler.value.length == 0) {
						listDriverButlerDto(() => {
							serviceTeam.value.showDialog();
						})
					} else {
						serviceTeam.value.showDialog();
					}



				}
				if (item.type == 'arrTime') {
					chooseTimeIndex.value = []
					chooseTimeIndex.value.push(Number(dayjs(props.teamOrder.arrivalFrom).format('H')))
					console.log(1111)
					console.log(chooseTimeIndex.value)
					
					arrTitle.value = '预计到店时间'
					createArriveTime()
					timeSelect.value.showDialog()
				}
				if (item.type == 'departureTime') {
					chooseTimeIndex.value = [12]
					arrTitle.value = '预计离店时间'
					createArriveTime()
					timeSelect.value.showDialog()
				}
				if (item.type == "checkIn") {
					getLocation();
					// if (item.type != "checkIn") {
					//   uni.showModal({
					//     title: "无法办理",
					//     content: "需在酒店2公里内才可办理入住",
					//     showCancel: false,
					//     confirmText: "我知道了",
					//     confirmColor: "#000000",
					//   });
					// } else {
					//   goPage(`/pagesD/mobileCheckIn/checkIn?hotelCode=`);
					// }
				}
				    if (item.type == "hotelService") {
						if (item.link.indexOf("?") != -1) {
							goPage(
								`${item.link}&masterId=${masterInfo.value.masterId}&areaCode=${masterInfo.value.rmno}&name=${masterInfo.value.name}&serviceName=${item.serviceName}&serviceItemCode=${item.serviceItemCode}&pmsId=${masterInfo.value.pmsId}&floor=${masterInfo.value.floor}&floorDesc=${masterInfo.value.floorDesc}&building=${masterInfo.value.building}&hotelCode=${masterInfo.value.hotelCode}&hotelDesc=${props.teamOrder.productDesc}`
							);
						} else {
							goPage(
								`${item.link}?masterId=${masterInfo.value.masterId}&areaCode=${masterInfo.value.rmno}&name=${masterInfo.value.name}&serviceName=${item.serviceName}&serviceItemCode=${item.serviceItemCode}&pmsId=${masterInfo.value.pmsId}&floor=${masterInfo.value.floor}&floorDesc=${masterInfo.value.floorDesc}&building=${masterInfo.value.building}&hotelCode=${masterInfo.value.hotelCode}&hotelDesc=${props.teamOrder.productDesc}`
							);
						}
					}
			}
			const getLocation = () => {
				let that = this;
				// 获取用户是否开启 授权获取当前的地理位置、速度的权限。
				uni.getSetting({
					success(res) {
						console.log(res);

						// 如果没有授权
						if (!res.authSetting["scope.userLocation"]) {
							// 则拉起授权窗口
							uni.authorize({
								scope: "scope.userLocation",
								success() {
									//点击允许后--就一直会进入成功授权的回调 就可以使用获取的方法了
									uni.getLocation({
										type: "wgs84",
										success: function (res) {
											// console.log(res);
											// console.log("当前位置的经度：" + res.longitude);
											// console.log("当前位置的纬度：" + res.latitude);
											checkPointCustomize(res)
										},
										fail(error) {
											console.log("失败", error);
										},
									});
								},
								fail(error) {
									//点击了拒绝授权后--就一直会进入失败回调函数--此时就可以在这里重新拉起授权窗口
									console.log("拒绝授权", error);

									uni.showModal({
										title: "提示",
										content: "若点击不授权，将无法使用位置功能",
										cancelText: "不授权",
										cancelColor: "#999",
										confirmText: "授权",
										confirmColor: "#f94218",
										success(res) {
											console.log(res);
											if (res.confirm) {
												// 选择弹框内授权
												uni.openSetting({
													success(res) {
														console.log(res.authSetting);
													},
												});
											} else if (res.cancel) {
												// 选择弹框内 不授权
												console.log("用户点击不授权");
											}
										},
									});
								},
							});
						} else {
							// 有权限则直接获取
							uni.getLocation({
								type: "wgs84",
								success: function (res) {
									checkPointCustomize(res)
									// that.x = res.longitude;
									// that.y = res.latitude;
								},
								fail(error) {
									uni.showToast({
										title: "请勿频繁调用！",
										icon: "none",
									});
									console.log("失败", error);
								},
							});
						}
					},
				});
			};
			const checkPointCustomize = (item : any) => {
				var obj = {
					hotelCode: config.hotelCode,
					hotelGroupCode: config.hotelGroupCode,
					checkPointLongitude: item.longitude,
					checkPointLatitude: item.latitude,
					anoCheckPointLongitude: hotelMsg.value.hotelLongitude,
					anoCheckPointLatitude: hotelMsg.value.hotelLatitude,
					circleRadius: 2000,
				};
				api.checkPointCustomize(obj).then((res : any) => {
					if (res.result == 1) {
						goPage(`/pagesD/mobileCheckIn/checkIn?hotelCode=${config.hotelCode}&mobile=${user.mobile}&teamNo=${props.teamNo}`);
					} else {
						// goPage(`/pagesD/mobileCheckIn/checkIn?hotelCode=${config.hotelCode}&mobile=${user.mobile}&teamNo=${props.teamNo}`);
						uni.showModal({
							title: "无法办理",
							content: "需在酒店2公里内才可办理入住",
							showCancel: false,
							confirmText: "我知道了",
							confirmColor: "#000000",
						});
						// jAlert3(res.msg);
					}
				});
			};
			const createArriveTime = () => {
				var times : any = [];
				let startTime = 0;
				let count = 25 - startTime;
				for (let i = 0; i < count; i++) {
					var hour : number | string = startTime + i;
					if (hour < 10) {
						hour = `0${hour}`;
					}
					times.push(`${fromDate.value} ${hour}:00`);
				}
				for (let j = 0; j < times.length; j++) {
					var canTap = true;
					if (dayjs(times[j]).isBefore(dayjs())) {
						canTap = false;
					}
					times[j] = {
						canTap: false,
						time: times[j],
						isTap: false,
						displayTime: times[j].split(" ")[1],
						chooseTime: times[j].split(" ")[1],
					};
				}
				timeList.value = times;
	
	
			}
			const querySaveTag = (item:any) => {
				let query: any = {
					hotelCode: config.hotelCode,
					hotelGroupCode: config.hotelGroupCode,
					firstResult: 0,
					pageSize: 100,
					channel: "WECHAT",
					memberId: user.memberId,
					guestId:guest.value.guestId
				};
				
				api
					.interfaceTransfer({
					config: {
						interfaceFrom: "member",
						interfaceMethod:"/guest/v1/queryGuestTag",
						hotelGroupCode: config.hotelGroupCode,
						interfaceType: "POST",
					},
					query,
					})
					.then((res: any) => {
					if (res.result == 1) {
						if (res.retVal.result == 0) {
						
						if (
							res.retVal.retVal.totalRows== 0
						) {
							item.drop = true
						}else{
							item.drop = false
						}
						
						}
					}
					});
			};
			const updateData =()=>{
				if (props.teamOrder.orderType == 'SingleRoom') {
					iconList.value.forEach((item:any,i:number)=>{
						if(item.type== 'preference'){
							listGuestLinkExtraInfoWithMemberIdOrOpenId(()=>{
								querySaveTag(item)
							})
						}
					})
				} else {
					iconList.value.forEach((item:any,i:number)=>{
						
						if(item.type== 'preference'){
							querySaveTag(item)
							
						}
						if(item.type== 'shuttle'){
							listByOrderNo()
						}
					})
				}
			}
			const initData = ()=>{
				user = getStorage("user");
				iconList.value = []
				hotelMsg.value = getStorage("currentHotel");
				if (props.teamOrder.orderType == 'SingleRoom') {
					if (props.teamOrder.orderSta == 'W') {
						iconList.value = [{
							name: '出行偏好',
							icon: 'icon-a-20_chuhangpianhao',
							type: 'preference'
						}, {
							name: '到店时间',
							icon: 'icon-a-20_daodianshijian',
							type: 'arrTime'
						}, {
							name: '松赞相册',
							icon: 'icon-a-20_lvhangxiangce_hei',
							type: 'hotelAlbum'
						}, {
							name: '联系酒店',
							icon: 'icon-a-20_dianhua',
							type: 'contact'
						}]
					}
					if (props.teamOrder.orderSta == 'I') {
						iconList.value = [{
							name: '出行偏好',
							icon: 'icon-a-20_chuhangpianhao',
							type: 'preference'
						}, {
							name: '离店时间',
							icon: 'icon-a-20_lidianshijian',
							type: 'departureTime'
						}, {
							name: '松赞相册',
							icon: 'icon-a-20_lvhangxiangce_hei',
							type: 'hotelAlbum'
						}, {
							name: '联系酒店',
							icon: 'icon-a-20_dianhua',
							type: 'contact'
						},
						{
							name: '续住',
							icon: 'icon-a-20_xuzhu',
							type: 'extend'
						}]
						if(props.teamOrder.guestList){
							props.teamOrder.guestList.forEach((item:any)=>{
								if(item.mobile == user.mobile){
									guest.value = item
								}
							})
							if(guest.value.idNo){
								queryMasterInfo('hotel')
							}
						}
					}
					if (props.teamOrder.orderSta == 'O') {
						iconList.value = [{
							name: '松赞相册',
							icon: 'icon-a-20_lvhangxiangce_hei',
							type: 'hotelAlbum'
						}, {
							name: '联系酒店',
							icon: 'icon-a-20_dianhua',
							type: 'contact'
						}]
					}
					
				
					iconList.value.forEach((item:any,i:number)=>{
							
							if(item.type== 'preference'){
								listGuestLinkExtraInfoWithMemberIdOrOpenId(()=>{
									querySaveTag(item)
								})
							}
						})
				} else {
					getTeamDetail(() => {
		
						
						
						context.emit("finish");
						iconList.value = [{
							name: '出行提示',
							icon: 'icon-a-20_linhangxinxi',
							type: 'tips'
						}, {
							name: '接送需求',
							icon: 'icon-a-20_jiesonganpai1',
							type: 'shuttle'
						}, {
							name: '出行偏好',
							icon: 'icon-a-20_chuhangpianhao',
							type: 'preference'
						}, {
							name: '行程详情',
							icon: 'icon-a-20_hangchengxiangqing1',
							type: 'trip'
						}, {
							name: '松赞相册',
							icon: 'icon-a-20_lvhangxiangce_hei',
							type: 'album'
						}, {
							name: '行程顾问',
							icon: 'icon-a-20_hangchengbangzhu1',
							type: 'help'
						}, {
							name: '服务团队',
							icon: 'icon-a-20_tuanduijianli1',
							type: 'team'
						}, {
							name: '全部服务',
							icon: 'icon-a-20_quanbufuwu_hei',
							type: 'all'
						}
						]
						let needShuttle = true
						if(props.teamOrder.orderSta != 'I'){
							if (props.dayDiff <= -2 ) {
								iconList.value = [{
									name: '出行提示',
									icon: 'icon-a-20_linhangxinxi',
									type: 'tips'
								}, {
									name: '接送需求',
									icon: 'icon-a-20_jiesonganpai1',
									type: 'shuttle'
								}, {
									name: '出行偏好',
									icon: 'icon-a-20_chuhangpianhao',
									type: 'preference'
								}, {
									name: '行程详情',
									icon: 'icon-a-20_hangchengxiangqing1',
									type: 'trip'
								}, {
									name: '松赞相册',
									icon: 'icon-a-20_lvhangxiangce_hei',
									type: 'album'
								}]
							} else if (props.dayEndDiff < 0 ) {
								iconList.value = [{
									name: '松赞相册',
									icon: 'icon-a-20_lvhangxiangce_hei',
									type: 'album'
								}, {
									name: '联系顾问',
									icon: 'icon-a-20_dianhua',
									type: 'help'
								}]
								needShuttle = false
							} 
							// else if (props.dayEndDiff < -7) {
							// 	iconList.value = []
							// 	needShuttle = false
							// }
							
						}
				
						iconList.value.forEach((item:any,i:number)=>{
							if(item.type == 'trip'&&props.page=='detail'){
								iconList.value.splice(i,1)
							}
							if(item.type== 'preference'){
								querySaveTag(item)
								
							}
						})
						
						if(needShuttle){
							
							listByOrderNo()
						}
					
					})

				}
			}
			
			onMounted(() => {
				initData()

			})
			return {
				goModulePage,
				hotelMsg,
				tipsHelp,
				serviceTeam,
				iconList,
				tripInfo,
				reserveBeforeInfo,
				getTeamDetail,
				guest,
				listDriverButlerDto,
				listDriverButler,
				makePhoneCall,
				consultant,
				toDriverButler,
				kf,
				timeSelect,
				createArriveTime,
				chooseTimeIndex,
				timeList,
				arrivalFrom,
				arriveTime,
				fromDate,
				otaChannel,
				hotelFromDate,
				hotelToDate,
				dateFormat,
				teamOrder,
				arrTitle,
				showKf,
				itemNames,
				orderNo,
				listByOrderNo,
				queryMasterInfo,
				querySaveTag,
				initData,
				updateData,
				masterInfo
			};
		},
	});
</script>


<style lang="less" scoped>
	@import url("~@/styles/skin.less");
	@import url("~@/styles/mixin.less");

	.nav-list {
		padding: 8px 12px;
		display: flex;
		flex-wrap: wrap;

		&.center {
			justify-content: space-around;
		}

		.nav {

			// flex: 1;
			
			padding: 16px 0;
			min-width: 25%;
			display: flex;
			flex-direction: column;
			align-items: center;
			.drop{
				position: absolute;
				right: -2px;
				top:-2px;
				width:4px;
				height:4px;
				border-radius: 50%;
				background: #A43127;
			}
		}
		.icon-img {
			width: 24px;
			height: 24px;
		}
		.iconfont {
			position: relative;
			width: 24px;
			height: 24px;
			font-size: 20px;
		}

		.txt {
			color: #000000;
			font-size: 14px;
			line-height: 1;
			margin-top: 6px;
		}
	}

	.trip-info-list {
		padding: 16px;

		.name {
			font-size: 18px;
			font-style: normal;
			font-weight: bold;
		}

		.trip-info-item {
			margin-top: 16px;
			color: #808080;
			font-size: 14px;
			line-height: 22px;

			.trip-info-item-table {
				overflow: hidden;

				&.table-big {
					.tr {

						.th,
						.td {
							width: 50%;
						}
					}
				}

				.tr {
					display: flex;
					border-bottom: 1px solid #ccc;

					&:last-child {
						border-bottom: none;
					}

					.th {
						width: 33.3%;
						font-size: 14px;
						height: 38px;
						display: flex;
						justify-content: center;
						align-items: center;
						background: #eee;
						color: #000;
						border-right: 1px solid #ccc;

						&:last-child {
							border-right: none;
						}
					}

					.td {
						font-size: 12px;
						width: 33.3%;
						min-height: 38px;
						padding: 5px 10px;
						display: flex;
						color: #808080;
						justify-content: center;
						align-items: center;
						border-right: 1px solid #ccc;

						&:last-child {
							border-right: none;
						}

					}
				}

				border:1px solid #ccc;
				border-radius: 4px;
			}
		}

		.trip-info-tl {
			margin-top: 16px;
			font-weight: bold;
			line-height: 1;
		}
	}

	.serviceTeamList {
		padding: 16px;

		.item {
			margin-top: 12px;
			padding: 16px;
			background: #fff;
			display: flex;
			border-radius: 8px;
			line-height: 1;

			&:first-child {
				margin-top: 0;
			}

			.head {
				margin-right: 10px;
				.head-img {
					width: 82px;
					height: 82px;
					border-radius: 50%;
				}
				.icon-a-82_fuwutuanduimorentouxiang{
					font-size:82px;
				}
			}

			.info {
				flex: 1;

				.info-head {
					display: flex;
					align-items: center;
					justify-content: space-between;

					.left-part {
						.career {
							color: #808080;
							font-size: 14px;
						}

						.name {
							display: flex;

							align-items: center;
							margin-top: 8px;
							font-size: 16px;
							font-weight: bold;

							.iconfont {
								margin-left: 4px;
								font-size: 12px;
							}
						}
					}

					.icon-a-28_dianhua {
						font-size: 28px;
						color: #000;
					}

				}

				.desc {
					margin-top: 8px;
					color: #808080;
					line-height: 18px;
					font-size: 12px;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
					white-space: normal;
					word-break: break-all;
				}
			}
		}
	}

	.consultant {
		line-height: 1;
		padding: 32px 16px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.head-img {
			width: 82px;
			height: 82px;
			border-radius: 50%;
		}

		.name {
			margin-top: 8px;
			font-weight: bold;
			color: #000000;
			font-size: 16px;
		}

		.career {
			margin-top: 12px;
			color: #808080;
			font-size: 14px;
		}

		.tips {
			margin-top: 16px;
			font-size: 14px;
			line-height: 18px;
			color: #808080;
			


		}

	}

	.layer-footer {
		background: #fff;
		padding: 16px;

		.layer-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			height: 48px;
		}
	}

	.arriveChoose {
		height: 440px;
		overflow-y: scroll;
		padding: 10px;
		.picker-view{
			position: relative;
			.picker-view-bg{
				position: absolute;
				left: 0;
				top: 0;
				right: 0;
				bottom: 0;
				z-index: 9;
			}
		}
		.tips {
			color: #808080;
			font-size: 12px;
			padding: 16px 0px;	
			display: inline;
			.icon-a-12_tishi{
				font-size: 12px;
				font-weight: normal;
			}

			.phone {
				color: #000;
				display: inline;
				.icon-a-12_youlajiantou_hei{
					font-size: 12px;
				}
			}

		}

		.iconfont {
			display: inline;
			margin-right: 3px;
		}
	}

	/deep/.pickerMask {
		background-image: linear-gradient(180deg,
				#f8f8f8 0%,
				rgba(248, 248, 248, 0) 100%),
			linear-gradient(180deg, rgba(248, 248, 248, 0) 0%, #f8f8f8 100%);
	}
</style>