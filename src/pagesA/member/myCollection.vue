<template>
	<div class="ui_myCollection">
		<!-- #ifdef MP -->
		<coustom-head title="我的收藏" nativeMode=true>
		</coustom-head>
		<!-- #endif -->
		<div class="topWarp">
			<div class="topBox">
				<div class="searchInputBox">
					<search-input  v-model="keyword" :placeholder="placeholder" @submit="submitInput" @clear="clearInput"
						style="flex:1;"></search-input>
					<i class="icon iconfont icon-a-20_shaixuan" :class="{'active':productType}" @click="showFilter"></i>
				</div>
			</div>
		</div>
		<div class="collect-list">
			<div class="product-box" v-for="(item,i) in collectList" :key="i" @click="toGoods(item)">
				<div class="product-img">
					<img class="img" :src="item.picture" mode="aspectFill">
				</div>
				<div class="product-info">
					<div class="product-name">
						{{item.goodsName}}
					</div>

					<div class="desc">
						{{item.subGoodsName}}
					</div>

					<div class="product-price" v-if="item.price=='-1'">
						满房
					</div>
					<div class="product-price" v-else>
						¥{{item.price}}
						<div class="unit"> /起</div>
					</div>
				</div>
			</div>
			<div class="invalid-btn" @click="openHalt" v-if="collectHaltList.length>0&&collectList.length>0&&isHaltOpen=='F'">查看已失效产品<i class="iconfont icon-a-12_xialajiantou_hei"></i></div>
			<div class="product-box" v-for="(item,i) in collectHaltList" :key="i" v-if="isHaltOpen=='T'||collectList.length<=0">
				<div class="product-img">
					<img class="img" :src="item.picture" mode="aspectFill">
				</div>
				<div class="product-info">
					<div class="product-name">
						{{item.goodsName}}
					</div>

					<div class="desc">
						{{item.subGoodsName}}
					</div>

					<div class="lose">
						已失效
					</div>
				</div>
			</div>
		</div>
		<empty tips="没有相关收藏" subTips="松赞，期待与您相遇。" emptyUrl="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/empty_search.png" v-if="collectHaltList.length == 0&&collectList.length == 0&& canRequest && curKeyword"></empty>
		<empty tips="暂无收藏" subTips="松赞，期待与您相遇。" v-else-if="collectHaltList.length == 0&&collectList.length == 0&& canRequest" ></empty>
		<bottom-dialog ref="filterComponent" title="筛选">
			<div class="filterBox">
				<div class="topFilterBox">
					<radio-box ref="radio" :datas="filterList" dataKey="productType" v-model:val="productTypeNew"></radio-box>

				</div>
				<div class="bottomFilterBox">
					<div class="resetBtn" @click="reset()">
						<i class="icon iconfont icon-a-20_zhongzhi"></i>
						<p class="resetDesc">重置</p>
					</div>
					<div class="finishBtn" @click="complete()">
						完成
					</div>
				</div>
			</div>
		</bottom-dialog>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, watch, onMounted } from "vue";
	import UmengSDK from "@/utils/umengAdaptor.js";
	import searchInput from "@/components/searchInput.vue";
	import api from "@/utils/api";
	import { getStorage } from "@/utils/wxuser";
	import { jAlert3 } from "@/base/jAlert/jAlert";
	import bottomDialog from "@/components/bottomDialog.vue";
	import { config } from "process";
	import empty from "@/components/empty.vue";
	import radioBox from "@/components/radioBox.vue";
	import { goPage } from "@/utils/utils";
	import coustomHead from "@/components/coustomHead.vue";
	import useScroll from "@/hooks/useScroll";
	import { onShow } from "@dcloudio/uni-app";

	const keyword = ref("");
	const collectList:any = ref([])
	const collectHaltList:any = ref([])
	const placeholder = ref("搜索");
	const filterComponent = ref();
	const canRequest = ref(false)
	const productType = ref("")
	const productTypeNew = ref("")
	const isAjax = ref(true)
	const curKeyword = ref("");
	const isHaltOpen = ref("F");
	const { scrollTop, onPageScroll } = useScroll();
	let navigationBarHeight = ref(40);
	let filterList = reactive([
		{
			name: "全部",
			active: true,
			productType: ""
		},
		{
			name: "管家定制",
			active: false,
			productType: 'ButlerCustomized'
		},
		{
			name: "自由行",
			active: false,
			productType: 'FreeTravel'
		},
		{
			name: "主题团",
			active: false,
			productType: 'ThemeGroup'
		},
		{
			name: "目的地套餐",
			active: false,
			productType: 'DestPackage'
		},
		{
			name: "酒店",
			active: false,
			productType: 'hotel'
		},
		{
			name: "通兑券",
			active: false,
			productType: 'shop'
		},{
			name: "日活动",
			active: false,
			productType: 'activity'
		}

	]);

	const hotelConfig = getStorage('config')
	const user = getStorage('user')
	const openHalt = () => {
		isHaltOpen.value = 'T'
	}
	const showFilter = () => {
		if (isAjax.value) {
			return;
		}
		productTypeNew.value = productType.value
		filterComponent.value.showDialog();
	};
	const hideFilter = () => {
		filterComponent.value.hideDialog();
	};
	const reset = () => {
		productTypeNew.value = ""
	}
	const complete = () => {
		productType.value = productTypeNew.value
		hideFilter()
		getGoodsCollection()

	}
	const submitInput = (data : any) => {
		if (isAjax.value) {
			return;
		}
		
		
		getGoodsCollection()

		UmengSDK.sendEvent("mcp_search_button_clk", {
			page_name: "my_collection_pg",
			page_title_name:"我的收藏"
			
		});
	};
	const clearInput = () => {
		submitInput()
	 };
	const getGoodsCollection = () => {
		
		api.getGoodsCollection({
			hotelGroupCode: hotelConfig.hotelGroupCode,
			productType: productType.value,
			memberId: user.memberId || '',
			goodsName: keyword.value
		}).then((res : any) => {
			if (res.result == 1) {
				collectList.value = []
				collectHaltList.value = []
				curKeyword.value = keyword.value
				canRequest.value = true
				isAjax.value = false
				res.retVal.list.forEach((item:any)=>{
					if(item.isHalt=='T'||(item.productType=='shop'&&item.shopGoods.onUnSale!='0'&&item.shopGoods.onUnSale!=undefined)){
						collectHaltList.value.push(item)
					}else{
						collectList.value.push(item)
					}
				})
				
				if(!keyword.value){
					UmengSDK.sendEvent("mcp_search_result", {
						page_name: "my_collection_pg",
						result_is_null:collectList.value.length>0?'F':'T'
						
					},'OTHER');
					
				}

			}
		})
	};
	const toGoods = (item : any) => {
		let id = item.goodsId
		
		UmengSDK.sendEvent("mcp_card_clk", {
			page_name: "my_collection_pg",
			card_id:id,
			card_name:item.goodsName,
			price:item.price,
			card_type:item.productType
			
		});
		if (item.productType == 'shop') {
			goPage(`/pagesB/exchangeCoupon/exchangeCouponDetail?id=${item.goodsId}`)
		} else if (item.productType == 'hotel') {
			goPage(`/pagesC/order/hotel?hotelCode=${item.goodsId}`)
		}  else if (item.productType == 'activity') {
			goPage(`/pagesE/dailyActivity/dailyActivityDetail?activityCode=${item.goodsId}`)
		} else {
			goPage(`/pagesB/travel/travelDetail?travelType=${item.goodsId}`)
		}
	}


	onPageScroll((e) => {
		scrollTop.value = e.scrollTop;
	})
	onShow(() => {
		getGoodsCollection()
		
	})
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
		
	})
</script>

<style lang="less" scoped>
	@import url("~@/styles/skin.less");
	@import (reference) url("~@/styles/mixin.less");

	.ui_myCollection {
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
					font-weight: bold;
					margin-bottom: 16px;

					&.active {
						color: @active-color;
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
		.topWarp{
			
			height: 48px;
		}
		.topBox {
			background: #fff;
			padding: 0 16px;
			position: fixed;
			left: 0;
			width: 100%;
			

			.searchInputBox {
				height: 48px;
				display: flex;
				align-items: center;
				justify-content: space-between;

				.iconfont {
					padding-left: 16px;
					color: #000000;
					&.active {
						color: @active-color;
					}


				}
			}
		}
		.invalid-btn{
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 14px;
			font-style: normal;
			color: #000;
			margin-top: 24px;
			.icon-a-12_xialajiantou_hei{
				font-size: 12px;
				margin-left: 4px;
			}
		}
		.collect-list {
			padding: 4px 16px 16px;

			.product-box {
				margin-top: 12px;
				padding: 12px;
				display: flex;
				background: #FFFFFF;
				border-radius: 8px;

				.product-img {
					height: 104px;
					width: 138px;

					.img {
						width: 100%;
						height: 100%;
						border-radius: 4px;
					}
				}

				.product-info {
					margin-left: 12px;
					flex: 1;

					.product-name {
						font-family: 'PingFang SC';
						font-weight: bold;
						font-size: 16px;
						line-height: 24px;
						height: 48px;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
						color: @tl-black;
					}


					.desc {
						margin-top: 4px;
						font-size: 12px;
						line-height: 12px;
						height: 12px;
						color: @text-color;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}



					.product-price {
						margin-top: 14px;
						font-family: 'Montserrat';
						color: #000000;
						font-weight: 600;
						font-size: 18px;
						line-height: 1;
						height: 1;

						.unit {
							display: inline;
							color: @text-color;
							font-size: 12px;
							font-weight: 400;
						}
					}

					.lose {
						margin-top: 14px;
						font-size: 18px;
						color: #cccccc;
						line-height: 1;
						height: 1;
					}
				}

			}
		}

		.bottomBox {
			padding: 0 16px;

			.orderItem {
				background: #ffffff;
				border-radius: 8px;
				padding: 12px;
				margin-top: 12px;
				padding-top: 0;
				display: flex;

				.leftPart {
					width: 132px;
					height: 104px;

					.logo {
						width: 100%;
						height: 100%;
					}
				}

				.rightPart {
					padding-left: 12px;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.topItem {
						.title {
							font-size: 16px;
							color: #000000;
							font-weight: bold;
							margin-bottom: 5px;
						}

						.subTitle {
							font-size: 12px;
							color: #808080;
						}
					}

					.bottomItem {
						.lose {
							font-size: 18px;
							color: #cccccc;
						}

						.price {
							font-size: 12px;
							color: #808080;

							.money {
								font-size: 18px;
								color: #000000;
								font-weight: bold;
							}
						}
					}
				}
			}
		}

	}

	/deep/.ui_radioGroup {
		.radio-box {
			min-height: auto !important;
		}

	}
</style>