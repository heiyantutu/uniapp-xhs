<template>
	<div class="nav-list">
		<div class="nav" v-for="(item,i) in iconList" :key="i" @click="goModulePage(item)">
			<div :class="'iconfont '+item.icon"></div>
			<div class="txt">{{item.name}}</div>
		</div>
	</div>
	<bottom-dialog ref="tipsHelp" title="行程帮助">
		<div class="consultant">
			<img src="" class="head-img">
			<div class="career">顾问</div>
			<div class="name">巴桑卓玛</div>
			<div class="tips">行程有任何疑问或需求，都可以向我咨询。</div>
		</div>
		<div class="layer-footer">
			<div class="layer-btn baseBtn">
				拨打电话
			</div>
		</div>
	</bottom-dialog>
	<bottom-dialog ref="tripInfo" title="">
		<div class="trip-info-list">
			<div class="name">
				尊敬的甄女士
			</div>
			<template v-for="(item,i) in reserveBeforePersonalizes" :key="i">
				<div class="trip-info-tl">
					{{item.itemName}}
				</div>
				<div class="trip-info-item">
					{{item.description}}
				</div>
			</template>

			<div class="trip-info-tl">
				出行期间的天气预报及海拔
			</div>
			<div class="trip-info-item">
				<div class="trip-info-item-table">
					<div class="tr">
						<div class="th">酒店</div>
						<div class="th">天气</div>
						<div class="th">海拔</div>

					</div>
					<div class="tr" v-for="(item,i) in reserveBeforeInfo.weathersDtos" :key="i">
						<div class="td">酒店</div>
						<div class="td">↑{{item.weatherFcEntity.low}}↓{{item.weatherFcEntity.high}}°C</div>
						<div class="td">{{item.altitude}}</div>

					</div>
				</div>
				<div class="table">
					<div class="table-hd">
						<div class=""></div>
					</div>
				</div>
			</div>
			<div class="trip-info-tl">
				穿衣&建议
			</div>
			<div class="trip-info-item">
				{{reserveBeforeInfo.dressing}}
			</div>
			<div class="trip-info-tl">
				高原反应与健康
			</div>
			<div class="trip-info-item">
				{{reserveBeforeInfo.health}}
			</div>
			<div class="trip-info-tl">
				文化习惯及禁忌
			</div>
			<div class="trip-info-item">
				{{reserveBeforeInfo.taboo}}
			</div>
			<div class="trip-info-tl">
				路况&用车
			</div>
			<div class="trip-info-item">
				{{reserveBeforeInfo.carInfo}}
			</div>
			<div class="trip-info-tl">
				住宿餐饮注意事项
			</div>
			<div class="trip-info-item">
				{{reserveBeforeInfo.roomDiningDesc}}
			</div>
			<div class="trip-info-tl">
				酒店所在区域最近医院
			</div>
			<div class="trip-info-item">
				<div class="trip-info-item-table table-big">
					<div class="tr">
						<div class="th">酒店</div>
						<div class="th">医院</div>
				
					</div>
					<div class="tr" v-for="(item,i) in reserveBeforeInfo.beforeInfoHotelsDtos" :key="i">
						<div class="td">{{item.hotelDesc}}</div>
						<div class="td">{{item.nearestHospital}}</div>
				
					</div>
				</div>
			</div>
		</div>
	</bottom-dialog>
	<bottom-dialog ref="serviceTeam" title="服务团队">
		<div class="serviceTeamList">
			<div class="item">
				<div class="head">
					<img src="" class="head-img">
				</div>
				<div class="info">
					<div class="info-head">
						<div class="left-part">
							<div class="career">顾问</div>
							<div class="name">巴桑卓玛<i class="iconfont icon-a-12_youlajiantou_hui"></i></div>
						</div>
						<div class="iconfont icon-a-28_dianhua"></div>
					</div>

					<div class="desc">
						来自四川甘孜藏族的仁青，在家人眼中待人友善、热诚，是当之无愧的松赞金牌管家。他和松赞的缘分，也是从十年前开始的。
						还是那一天，2011年的3月7日，仁青和洛桑一同到松赞香格里拉林卡报到上班。他俩都是有国外学习...
					</div>
				</div>
			</div>
			<div class="item">
				<div class="head">
					<img src="" class="head-img">
				</div>
				<div class="info">
					<div class="info-head">
						<div class="left-part">
							<div class="career">顾问</div>
							<div class="name">巴桑卓玛<i class="iconfont icon-a-12_youlajiantou_hui"></i></div>
						</div>
						<div class="iconfont icon-a-28_dianhua"></div>
					</div>

					<div class="desc">
						来自四川甘孜藏族的仁青，在家人眼中待人友善、热诚，是当之无愧的松赞金牌管家。他和松赞的缘分，也是从十年前开始的。
						还是那一天，2011年的3月7日，仁青和洛桑一同到松赞香格里拉林卡报到上班。他俩都是有国外学习...
					</div>
				</div>
			</div>
		</div>
	</bottom-dialog>
</template>
<script lang="ts">
	import { defineComponent, ref, onMounted } from "vue";
	import bottomDialog from "@/components/bottomDialog.vue";
	import { goPage } from "@/utils/utils";
	import { getStorage } from "@/utils/wxuser";
	import api from "@/utils/api";
	let user = getStorage('user')
	let config = getStorage('config')
	export default defineComponent({
		name: "travelItem",
		components: {
			bottomDialog
		},
		props: {
			teamNo: {
				type: String,
				default: ''
			},
			orderNo: {
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
		},
		setup(props, context) {
			const iconList = ref([{
				name: '出行提示',
				icon: 'icon-a-20_linhangxinxi',
				type: 'tips'
			}, {
				name: '接送需求',
				icon: 'icon-a-20_jiesonganpai1',
				type: 'shuttle'
			}, {
				name: '出行偏好',
				icon: 'icon-a-20_chuhangpianhao1',
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
				name: '行程帮助',
				icon: 'icon-a-20_hangchengbangzhu1',
				type: 'help'
			}, {
				name: '服务团队',
				icon: 'icon-a-20_tuanduijianli1',
				type: 'team'
			}])

			const tripInfo = ref()
			const tipsHelp = ref()
			const serviceTeam = ref()
			const beforeInfo = ref({})
			const reserveBeforeInfo : any = ref({})
			const getTeamDetail = () => {
				api.interfaceTransfer({
					query: {
						"mobile": 13333333333 || user.mobile,
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
						if (res.result == 1 && res.retVal.result == 0) {
							// res.retVal.retVal.
							reserveBeforeInfo.value = res.retVal.retVal.reserveBeforeInfo
							tripInfo.value.showDialog();

						}
					})
			}
			const goModulePage = (item : any) => {
				if (item.type == 'tips') {
					if (!reserveBeforeInfo.value.id) {
						getTeamDetail()
					} else {
						tripInfo.value.showDialog();
					}

				}
				if (item.type == 'shuttle') {
					goPage("/pagesD/trip/takeInfo?orderNo=" + props.orderNo)
				}
				if (item.type == 'preference') {

				}
				if (item.type == 'trip') {
					goPage("/pagesD/trip/tripDetail?teamNo=" + props.teamNo)
				}
				if (item.type == 'album') {
					goPage("/pagesD/trip/album?orderNo=" + props.orderNo)
				}
				if (item.type == 'help') {
					tipsHelp.value.showDialog();

				}
				if (item.type == 'team') {
					serviceTeam.value.showDialog();

				}
			}
			onMounted(() => {
				if (props.dayDiff < -2) {
					iconList.value.splice(-2)
				} else if (props.dayDiff > 7) {
					iconList.value = []
				}
			})
			return {
				goModulePage,
				tipsHelp,
				serviceTeam,
				iconList,
				tripInfo,
				reserveBeforeInfo,
				getTeamDetail
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
			color: #000000;
			font-size: 14px;
			line-height: 1;
			margin-top: 6px;
		}
	}

	.trip-info-list {
		height: calc(100vh - 210px);
		overflow-y: auto;
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
				&.table-big{
					.tr{
						.th,.td{
							width: 50%;
						}
					}
				}
				.tr {
					display: flex;
					border-bottom:1px solid #ccc;
					&:last-child{
						border-bottom:none;
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
						border-right:1px solid #ccc;
						&:last-child{
							border-right:none;
						}
					}

					.td {
						font-size: 12px;
						width: 33.3%;
						height: 38px;
						display: flex;
						color: #808080;
						justify-content: center;
						align-items: center;
						border-right:1px solid #ccc;
						&:last-child{
							border-right:none;
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
				.head-img {
					width: 82px;
					height: 82px;
					border-radius: 50%;
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
</style>