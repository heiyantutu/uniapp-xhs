<template>
	<div class="collect_ui">
		<div class="search">
			<search-input class="search-input" v-model="searchVal" placeholder="搜索"></search-input>
			<div class="screen">
				<i class="icon-a-20_shaixuan iconfont"></i>
			</div>
		</div>
		<div class="collect-list">
			<div class="product-box">
				<div class="product-img">
					<img class="img"
						src="https://website-10065452.cos.ap-shanghai.myqcloud.com/58fa7492-01ef-437f-a0a1-09754e8e06f1">
				</div>
				<div class="product-info">
					<div class="product-name">
						天人之际·通往雨崩之路 5晚6天
					</div>

					<div class="desc">
						踏上这条走近梅里雪山的行程，付出的是多一点点的体力，而收获到的则是被隐秘之境环抱的独特体验。
					</div>

					<div class="product-price">
						¥21,399<div class="unit"> /人起</div>
					</div>
				</div>
			</div>
			<div class="product-box">
				<div class="product-img">
					<img class="img"
						src="https://website-10065452.cos.ap-shanghai.myqcloud.com/58fa7492-01ef-437f-a0a1-09754e8e06f1">
				</div>
				<div class="product-info">
					<div class="product-name">
						天人之际·通往雨崩之路 5晚6天
					</div>

					<div class="desc">
						踏上这条走近梅里雪山的行程，付出的是多一点点的体力，而收获到的则是被隐秘之境环抱的独特体验。
					</div>

					<div class="product-price">
						¥21,399<div class="unit"> /人起</div>
					</div>
				</div>
			</div>
		</div>
		<div class="screen-layer">
			<div class="screen-box">
				<div class="head">
					筛选
					<div class="icon-a-20_guanbi iconfont"></div>
				</div>
				<div class="screen-choose">

					<div class="screen-list">
						<div class="screen-list-item">
							1成人1儿童
						</div>
						<div class="screen-list-item">
							1成人1儿童
						</div>
						<div class="screen-list-item">
							1成人1儿童
						</div>
					</div>

				</div>
				<div class="next-btn">
					<div class="reset">
						<i class="icon-a-20_zhongzhi iconfont"></i>
					</div>
					<div class="btn baseBtn">完成</div>
				</div>
			</div>
			<div class="bg"></div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted } from "vue";
	import api from "@/utils/api";
	import { getStorage } from "@/utils/wxuser";
	import productGroup from "@/components/productGroup.vue";
	import searchInput from "@/components/searchInput.vue";
	let config = getStorage("config");
	const searchVal = ref();
	let tabsData = reactive([
		{
			id: 0,
			name: '管家定制'
		},
		{
			id: 1,
			name: '自由行'
		},

	])
	onMounted(() => { });
</script>

<style lang="less" scoped>
	@import url("~@/styles/skin.less");
	@import url("~@/styles/mixin.less");

	.collect_ui {

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
						line-height: 1;
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
				}

			}
		}

		.screen-layer {
			position: fixed;
			bottom: 0;
			left: 0;
			height: 100vh;
			width: 100vw;

			.screen-box {

				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				border-radius: 16px 16px 0 0;
				z-index: 2;
				background: #F8F8F8;

				.screen-choose {
					padding: 0 16px;
					min-height: 244px;

					.travel-number {
						height: 52px;
						align-items: center;
						display: flex;
						justify-content: space-between;

						.label {
							color: #000000;
							font-size: 14px;
						}

						.val {
							display: flex;
							align-items: center;

							.num {
								padding: 0 16px;
								font-size: 16px;
							}

							.iconfont {
								font-size: 20px;

								&.unable {
									color: #CCCCCC;
								}
							}
						}
					}

					.screen-list {
						padding-top: 4px;
						display: flex;
						flex-wrap: wrap;

						.screen-list-item {
							display: flex;
							align-items: center;
							justify-content: center;
							width: calc(33.3% - 6px);
							height: 54px;
							border: 1px solid #EEEEEE;
							font-size: 14px;
							border-radius: 4px;
							margin-top: 12px;
							margin-right: 9px;

							&:nth-child(3n) {
								margin-right: 0;
							}

							&.active {
								font-weight: bold;
								border: 1px solid #A43127;
							}
						}
					}

					.tips {
						align-items: center;
						display: flex;
						margin-top: 12px;
						color: #808080;
						font-size: 12px;
						line-height: 1;

						.customer {
							color: #000;

							display: flex;
							align-items: center;
							font-size: 12px;
							height: 12px;
							padding: 0 4px;
							margin: 0;
							border: 0;

							&::after {
								border: none;
							}

							.iconfont {
								font-size: 14px;
							}
						}
					}
				}

				.head {
					position: relative;
					display: flex;
					justify-content: center;
					font-weight: 600;
					font-size: 18px;
					line-height: 1;
					padding: 19px 0;
					background: #fff;
					border-bottom: 1px solid #EEEEEE;

					.icon-a-20_guanbi {
						position: absolute;
						left: 22px;
						top: 20px;
						font-size: 20px;
					}
				}

				.next-btn {
					display: flex;
					border-top: 0.5px solid #EEEEEE;
					padding: 12px 16px;
					background: #fff;

					.reset {}

					.btn {

						line-height: 48px;
						height: 48px;
					}
				}
			}
		}

		.bg {
			position: fixed;
			left: 0;
			top: 0;
			height: 100%;
			width: 100%;
			background: rgba(0, 0, 0, 0.76);

		}

	}
</style>