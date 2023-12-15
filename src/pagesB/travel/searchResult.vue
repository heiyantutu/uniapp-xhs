<template>
	<div class="searchResult_ui">
		<!-- #ifdef MP -->
		<coustom-head title="搜索结果" nativeMode=true>
		</coustom-head>
		<!-- #endif -->
		<div class="top-warp">
			<div class="topBox">
				<div class="searchBox">
					<div class="searchItem" @click="showDestination()">
						<i class="icon iconfont icon-a-12_dingwei"></i>
						<p class="searchDesc">{{rendezvousName}}</p>
					</div>
					<div class="searchItem" @click="showFilterComponent()">
						<i class="icon iconfont icon-a-12_riqi"></i>
						<p class="searchDesc" v-if="dayNight">旅行{{dayNight}}晚</p>
						<p class="searchDesc" v-else>不限</p>
					</div>
				</div>
			</div>
		</div>
		<productGroup :datas="travelList" v-if="travelList.length>0"></productGroup>
		<empty tips="暂无数据" v-if="travelList.length == 0 && !isAjax"></empty>
		<p class="moreHotel">更多产品敬请期待</p>
		<bottom-dialog ref="destination" title="旅行目的地" maxDialog=true>
			<div class="destination">
				<destination-box ref="dictionaryBox" @search="chooseDictionary" :dictionaryCode="rendezvous" :isAutoChooseCity="isAutoChooseCity"></destination-box>
			</div>

		</bottom-dialog>
		<bottom-dialog ref="filterComponent" title="筛选">
			<div class="filterBox">

				<radio-box :datas="days" ref="daysRadio" v-model:val="requestObj.dayNight" dataKey="date">

				</radio-box>
				<div class="bottomFilterBox">
					<div class="resetBtn" @click="resetting()">
						<i class="icon iconfont icon-a-20_zhongzhi"></i>
						<p class="resetDesc">重置</p>
					</div>
					<div class="finishBtn" @click="chooseDay()">
						完成
					</div>
				</div>
			</div>
		</bottom-dialog>
	</div>
</template>

<script lang="ts" setup>
	import {
		reactive,
		ref,
		computed,
		onMounted
	} from "vue";
	import api from "@/utils/api";
	import {
		getStorage
	} from "@/utils/wxuser";
	import UmengSDK from "@/utils/umengAdaptor.js";
	import productGroup from "@/components/productGroup.vue";
	import radioBox from "@/components/radioBox.vue";
	import destinationBox from "@/components/destinationBox.vue";
	import bottomDialog from "@/components/bottomDialog.vue";
	import empty from "@/components/empty.vue";
	import coustomHead from "@/components/coustomHead.vue";
	import useScroll from "@/hooks/useScroll";
	import {
		onLoad
	} from "@dcloudio/uni-app";
	let config = getStorage("config");
	let user = getStorage("user")||{};
	const travelList = ref([]);
	const canRequest = ref(true)
	const dictionaryBox = ref()
	const isAjax =  ref(true)
	const isChange = ref('T')
	const dayNight = ref("")
	let requestObj = reactive({
		cardLevel: user.cardLevel,
		companyLevel: user.companyLevel,
		cardType: user.cardType,
		category: "",
		categorySub: "",
		companyCode: "",
		gcLevel: "",
		ota: "",
		otaChannel: "WECHAT",
		dayNight: "",
		rendezvous: "",
		travelGroupCode: "",
		travelType: "",
		marketingId: "",
		hotelCode: config.hotelCode,
		hotelGroupCode: config.hotelGroupCode,
		unitCode: config.hotelGroupCode,

	})
	const isAutoChooseCity = ref(false)
	//目的地窗口
	const destination = ref();
	//住宿晚数窗口
	const filterComponent = ref();
	const { scrollTop, onPageScroll } = useScroll();
	let navigationBarHeight = ref(40);
	let days = reactive([{
		active: false,
		date: '',
		name: '不限'
	},
	{
		active: false,
		date: '2',
		name: '2晚'
	},
	{
		active: false,
		date: '3',
		name: '3晚'
	},
	{
		active: false,
		date: '4',
		name: '4晚'
	},
	{
		active: false,
		date: '5',
		name: '5晚'
	},
	{
		active: false,
		date: '6',
		name: '6晚'
	},
	{
		active: false,
		date: '7',
		name: '7晚'
	},
	{
		active: false,
		date: '8',
		name: '8晚'
	},
	{
		active: false,
		date: '9',
		name: '9晚'
	}

	])
	onPageScroll((e) => {
		scrollTop.value = e.scrollTop;
	});
	const rendezvous = ref("")
	const rendezvousName = ref("")
	const daysRadio = ref();
	const chooseDictionary = (val : any) => {
		
		rendezvous.value = val.dictionaryCode
		rendezvousName.value = val.dictionaryDesc
		requestObj.rendezvous = rendezvous.value
		destination.value.hideDialog();
		travelProductList()
		isChange.value= 'F'
	}
	const resetting = () => {
		daysRadio.value.clear()

	};
	const chooseDay = () => {
		
		filterComponent.value.hideDialog();
		travelProductList()
		isChange.value= 'F'
	}
	const showDestination = () => {
		if (!canRequest.value) {
			return;
		}
		UmengSDK.sendPV({
			page_name: "search_pg",
		});
		destination.value.showDialog();
		dictionaryBox.value.updataHis()
	};
	const showFilterComponent = () => {
		if (!canRequest.value) {
			return;
		}
		requestObj.dayNight =  dayNight.value
		filterComponent.value.showDialog();
	};
	onLoad((options : any) => {
		if (options.rendezvousName) {
			rendezvousName.value = decodeURIComponent(options.rendezvousName)
			rendezvous.value = options.rendezvous
		}
		requestObj.rendezvous = options.rendezvous
		requestObj.dayNight = options.dayNight
		dayNight.value = options.dayNight

	})
	const travelProductList = () => {
		if (!canRequest.value) {
			return;
		}
		canRequest.value = false
		isAjax.value = true
		dayNight.value = requestObj.dayNight
		api.travelProductList(requestObj)
			.then((res : any) => {
				if (
					res.result == 0 &&
					res.retVal
				) {
					
					travelList.value = res.retVal
					UmengSDK.sendEvent("sp_intiate_search", {
						page_name: "search_pg",
						page_title_name:rendezvousName.value,
						Key_word:rendezvousName.value,
						is_preset:isChange.value
					},'OTHER');
					UmengSDK.sendEvent("sp_search_result", {
						page_name: "search_pg",
						result_is_null:travelList.value.length>0?'否':'是',
						Key_word:rendezvousName.value,
						is_preset:isChange.value,
						result_count:travelList.value.length
					},'OTHER');
				}
				isAjax.value = false
				canRequest.value = true
			});
	}
	onMounted(() => {
		uni.getSystemInfo({
			success: (res) => {
			navigationBarHeight.value =
				(res.statusBarHeight || 0) + navigationBarHeight.value;
			},
			fail(err) {
			console.log(err);
			},
		});
		travelProductList()
	});
</script>

<style lang="less" scoped>
	@import url("~@/styles/skin.less");
	@import url("~@/styles/mixin.less");


	.searchResult_ui {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		.moreHotel {
			color: #ccc;
			font-size: 14px;
			padding: 30px 0;
			text-align: center;
			position: relative;
			&::before {
			content: "";
			width: 40px;
			height: 1px;
			background: #ccc;
			position: absolute;
			left: 50px;
			top: 37px;
			}
			&::after {
			content: "";
			width: 40px;
			height: 1px;
			background: #ccc;
			position: absolute;
			right: 50px;
			top: 37px;
			}
		}
		.top-warp{
			height: 62px;
		
			background: #ffffff;
		}
		.topBox {
			position: fixed;
			z-index: 9;
			width: 100%;
			height: 62px;
			padding: 12px 16px;
			background: #ffffff;

			.searchBox {
				background: #f8f8f8;
				height: 38px;
				display: flex;
				align-items: center;
				border-radius: 4px;

				.searchItem {
					flex: 1;
					height: 100%;
					padding-left: 16px;
					align-items: center;
					color: #000000;
					display: flex;
					position: relative;

					&:first-of-type {
						&::after {
							content: "";
							left: 100%;
							top: 9px;
							position: absolute;
							width: 1px;
							height: 20px;
							background: #ededed;
							
						}
					}

					.iconfont {
						font-size: 14px;
						margin-right: 5px;
					}

					.searchDesc {
						font-size: 14px;
						position: relative;

						&:after {
							content: "";
							border-top: 4px solid transparent;
							border-right: 4px solid #000000;
							border-bottom: 0;
							border-left: 0;
							position: absolute;
							bottom: 0px;
							right: -5px;
						}
					}
				}
			}
		}

		.destination {
			padding-bottom: 40px;
			height: calc(100vh - 160px);

			.search {
				display: flex;
				align-items: center;
				padding: 8px 16px;
				box-sizing: border-box;
				background: #fff;

				.search-input {
					flex: 1;
				}

				.screen {
					padding-left: 16px;
				}
			}

			.search-history,
			.city-list {
				padding: 17px 16px 0;

				.tl {
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 14px;
					line-height: 1;
					font-weight: bold;

					.icon-a-16_shanchulishijilu {
						font-weight: normal;
					}
				}

				.search-list {
					padding-top: 4px;
					max-height: 140px;
					overflow: hidden;

					.search-item {
						margin-top: 10px;
						display: inline-block;
						padding: 8px;
						font-size: 12px;
						color: #000000;
						border: 1px solid #ddd;
						border-radius: 4px;
						margin-right: 8px;

					}
				}

				.citys {
					padding-top: 4px;
					display: flex;
					flex-wrap: wrap;

					.city {
						width: calc(33.3% - 10px);
						border: 1px solid #ddd;
						height: 48px;
						margin-top: 12px;
						display: flex;
						margin-right: 10px;
						align-items: center;
						justify-content: center;
						border-radius: 4px;

					}
				}
			}
		}

		.filterBox {
			.topFilterBox {
				display: flex;
				min-height: 240px;
				padding: 16px;
				flex-wrap: wrap;

				.filterItem {
					height: 48px;
					line-height: 48px;
					text-align: center;
					color: #000000;
					font-size: 16px;
					width: calc(~"(100% - 20px) / 3");
					border-radius: 4px;
					border: 1px solid #e2e2e2;
					margin-right: 10px;

					margin-bottom: 16px;

					&.active {
						color: @active-color;
						font-weight: bold;
					}

					&:nth-of-type(3n + 0) {
						margin-right: 0;
					}
				}
			}

			.bottomFilterBox {
				display: flex;
				height: 70px;
				align-items: center;
				padding: 16px;
				background: #fff;

				.resetBtn {
					width: 60px;
					margin-right: 16px;
					text-align: center;
					color: #000;

					.resetDesc {
						font-size: 12px;
					}

					.iconfont {
						font-size: 22px;
					}
				}

				.finishBtn {
					.baseBtn();
					flex: 1;
					height: 48px;
					line-height: 48px;
				}
			}
		}

		.footer {
			margin-top: 8px;

			.footer-img {
				width: 100%;
			}
		}
	}
</style>