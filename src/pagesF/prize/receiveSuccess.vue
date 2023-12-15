<template>
	<div class='receiveSuccess'>
		<!-- #ifdef MP -->
		    <coustom-head title="提交成功" nativeMode=true>
		    </coustom-head>
		<!-- #endif -->	
		<div class="paddBox">
			<div class="icon">
				<span class='icons iconfont icon-a-120_tijiaochenggong'></span>
			</div>
			<div class="sta">提交成功</div>
			<div class="tip">我们将尽快发出，如需帮助请联系客服。</div>
			<div class="btn" @click='goPrizeList'>完成</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted } from "vue";
	import {onReady,onLoad,onShow} from '@dcloudio/uni-app';
	import api from "@/utils/api";
	import { getStorage } from "@/utils/wxuser";
	import { jAlert3, jAlert5 } from "@/base/jAlert/jAlert";
	import { createUrl } from "@/utils/utils";
	import coustomHead from "@/components/coustomHead.vue";
	import { onPageScroll } from "@dcloudio/uni-app";
	let config = getStorage("config");
	const goPrizeList = ()=>{
		uni.redirectTo({
			url: `/pagesF/prize/prizeList`
		});
	}
</script>

<style lang="less" scoped>
	@import url("~@/styles/skin.less");
	@import (reference) url("~@/styles/mixin.less");
	.receiveSuccess{
		// height: 100vh;
		// background: rgba(255,255,255,0.00);
		// padding-top: 100px;
		.paddBox{
			height: 100vh;
			background: rgba(255,255,255,0.00);
			padding-top: 100px;
		}
		.icon{
			text-align: center;
			margin-bottom: 40px;
			.icons{
				font-size: 120px;
				color: #000;
			}
		}
		.sta{
			margin-bottom: 12px;
			font-family: PingFangSC-Medium;
			font-size: 18px;
			color: #000000;
			letter-spacing: 0;
			text-align: center;
			line-height: 18px;
			font-weight: 500;
		}
		.tip{
			font-family: PingFangSC-Regular;
			font-size: 14px;
			color: #808080;
			letter-spacing: 0;
			text-align: center;
			line-height: 22px;
			font-weight: 400;
		}
		.btn{
			margin: 0 auto;
			margin-top: 54px;
			background: rgba(0,0,0,0.90);
			border-radius: 4px;
			font-family: PingFangSC-Regular;
			font-size: 16px;
			color: #FFFFFF;
			letter-spacing: 0;
			text-align: center;
			font-weight: 400;
			line-height: 48px;
			width: 343px;
		}
	}
</style>