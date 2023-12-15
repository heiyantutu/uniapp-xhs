<template>
	<div class="moreTrip_ui">
		<div class="tabs">
			<tabs :datas="typeList" type="line" color="#A43127" titleInactiveColor="#808080" titleActiveColor="#000000" background="#fff">
			</tabs>
		
		</div>
		<div class="product-list">
		
			<div class="product-item">
				<div class="product-img">
					<img class="img"
						src="https://website-10065452.cos.ap-shanghai.myqcloud.com/58fa7492-01ef-437f-a0a1-09754e8e06f1">
				</div>
				<div class="product-info">
					<div class="product-name">
						藏式红铜阔口圆身花瓶
					</div>
		
					<div class="product-bt">
						<div class="product-price">¥92</div>
						<div class="product-btn">详情</div>
					</div>
				</div>
		
			</div>
			<div class="product-item">
				<div class="product-img">
					<img class="img"
						src="https://website-10065452.cos.ap-shanghai.myqcloud.com/58fa7492-01ef-437f-a0a1-09754e8e06f1">
				</div>
				<div class="product-info">
					<div class="product-name">
						藏式红铜阔口圆身花瓶
					</div>
		
					<div class="product-bt">
						<div class="product-price">¥92</div>
						<div class="product-btn">详情</div>
					</div>
				</div>
		
			</div>
			<div class="product-item">
				<div class="product-img">
					<img class="img"
						src="https://website-10065452.cos.ap-shanghai.myqcloud.com/58fa7492-01ef-437f-a0a1-09754e8e06f1">
				</div>
				<div class="product-info">
					<div class="product-name">
						藏式红铜阔口圆身花瓶
					</div>
		
					<div class="product-bt">
						<div class="product-price">¥92</div>
						<div class="product-btn">详情</div>
					</div>
				</div>
		
			</div>
		</div>
		
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted } from "vue";
	import api from "@/utils/api";
	import tabs from "@/components/tabs.vue";
	import productGroup from "@/components/productGroup.vue";
	import { getStorage } from "@/utils/wxuser";
	let config = getStorage("config");
	let typeList = reactive([
		{
			id: 0,
			name: '管家定制'
		},
		{
			id: 1,
			name: '自由行'
		},

	])

	const getTravelList = () => {

	}
	onMounted(() => { });
</script>

<style lang="less" scoped>
	@import url("~@/styles/skin.less");

	.moreTrip_ui {
		padding-bottom: 20px;
		.product-list {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			padding: 0 32rpx;
		
			width: 100%;
		
			.product-item {
				display: inline-block;
				margin-top: 12px;
				width: 44.3vw;
				border-radius: 8px;
				overflow: hidden;
				background: #fff;
		
				&:first-child {
					margin-left: 0;
				}
		
				.product-img {
					width: 100%;
					height: 33vw;
		
					.img {
						width: 100%;
						height: 100%;
						object-fit: cover;
					}
				}
		
				.product-info {
					padding: 12px;
					white-space: normal;
					.product-name {
						overflow: hidden;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						word-break: break-all;
						-webkit-line-clamp: 1;
						font-family: PingFangSC-Medium;
						font-size: 16px;
						color: #000000;
						font-weight: bold;
						line-height: 24px;
					}
		
					.product-desc {
						margin-top: 4px;
						padding: 4px;
						font-size: 12px;
						color: #A43127;
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
							font-family: PingFangSC-Semibold;
							font-size: 16px;
							color: #000000;
							font-weight: bold;
						}
		
						.product-btn {
							padding: 8px 12px;
							font-size: 14px;
							color: #FFFFFF;
							background: #000;
							border-radius: 4px;
						}
					}
				}
		
		
			}
		
		}
	}
</style>