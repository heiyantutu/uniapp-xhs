<template>
	<div class="contract_ui">
		<img class="contract-img" src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/contract-icon.png">
		<div class="tl">合同生成中</div>
		<div class="progress"></div>
		<div class="tips">请在2小时内完成签约，签约成功后可在<br>订单详情页获取合同附件</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted } from "vue";
	import api from "@/utils/api";
	import { getStorage } from "@/utils/wxuser";
	let config = getStorage("config");

	onMounted(() => { 
		setTimeout(()=>{
			uni.navigateTo({
				url: `/pagesB/other/pay`
			})
		},5000)
	});
</script>

<style lang="less" scoped>
	@import url("~@/styles/skin.less");
	@import url("~@/styles/mixin.less");

	.contract_ui {
		padding: 160px 16px 80px;
		text-align: center;

		.contract-img {
			width: 120px;
			height: 120px;
		}

		.tl {
			margin-top: 75px;
			font-size: 18px;
			line-height: 18px;
			font-weight: bold;
		}

		.progress {
			position: relative;
			margin: 24px 11px 0;
			height: 2px;
			background: #CCCCCC;
			overflow: hidden;

			&::after {
				content: '';
				position: absolute;
				left: 0;
				top: 0;
				height: 2px;
				width: 25%;
				background: #A43127;
				animation: progress 2s linear infinite;
			}
		}

		@keyframes progress {
			0% {
				left: -100%;
			}

			100% {
				left: 100%;
			}
		}

		.tips {
			margin-top: 24px;
			font-size: 14px;
			line-height: 22px;
			text-align: center;

			color: #808080;
		}
	}
</style>