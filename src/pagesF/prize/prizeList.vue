<template>
	<div class='prizeList'>
		<!-- #ifdef MP -->
		    <coustom-head title="我的奖品" bgColor='#fff' >
		    </coustom-head>
		<!-- #endif -->	
		<div class="paddTop" v-bind:style="{height:navHeight + 'px'}"></div>
		<!-- <div class='box' v-for="( item , index ) in prizeList" :key="index"> -->
			<div class="prize" v-for="( item , index ) in prizeList" :key="index">
				<div class="prizeInfo" @click='goInfo(item)'>
					<img :src="item.prize.picUrl" alt="" class='prizeImg'>
					<div class="info">
						<div class="prizeName">
							{{item.prize.name}}
						</div>
						<div class="prizeDesc">
							{{item.prize.subName}}
						</div>
						<div class="prizeTime">中奖时间：{{item.zjTime}}</div>
					</div>
				</div>
				<div class="btnGroup">
					<div class="btn giftGet" v-if="item.prizeState != 3&&item.prize.prizeType == 1" @click='deliv(item)'>
						{{item.prizeState==0?"去领取":item.prizeState==1?"待发货":"已过期"}}
						<!-- 发货状态(针对实物)/领奖状态（针对虚拟奖品） 0 未发货 （实物需要录入发货信息）/未领取 1 待发货/已领取 2 已过期 3 已发货/已兑奖 -->
						<!-- prize_state -->
					</div>
					<div class="btn giftGot" v-else @click='goInfo(item)' :class='{"sta":item.prize.prizeType == 1}'>{{item.prize.prizeType == 1?'已领取':'去查看'}}</div>
				</div>
			</div>
		<!-- </div> -->
		<empty tips="暂无数据" v-if="prizeList.length == 0 && canRequest"></empty>
	</div>
</template>
<script lang="ts" setup>
	import { reactive, ref, computed,onMounted } from "vue";
	import {onReachBottom} from '@dcloudio/uni-app';
	import api from "@/utils/api";
	import empty from "@/components/empty.vue";
	import { getStorage } from "@/utils/wxuser";
	import coustomHead from "@/components/coustomHead.vue";
	import { onPageScroll } from "@dcloudio/uni-app";
	import {
	  toLogin,
	} from "@/utils/utils";
	let config = getStorage("config");
	let user = getStorage("user");
	let wxuser = getStorage("wxuser");
	const prizeList = ref([]);
	const canRequest = ref(true)
	let navHeight = ref(64);
	let requestObj = reactive({
		hotelCode: config.hotelCode,
		hotelGroupCode: config.hotelGroupCode,
		
	})
	const totalRows = ref(99999)
	const firstResult = ref(0);
	const pageSize = ref(15);
	const prizewinner = () =>{
		if(prizeList.value.length > 0&& prizeList.value.length>=totalRows.value){
			return false;
		}
		if(!canRequest.value){
			return false;
		}
		canRequest.value = false
		api.prizewinner({
			// code:'79461177060947c19a7b',
			memberId:user.memberId,
			appid:config.appid,
			componentAppid:config.componentAppid||config.appid,
			hotelGroupCode:config.hotelGroupCode,
			hotelGroupId:config.hotelGroupId,
			hotelCode:config.hotelCode,
			pageSize:pageSize.value,
			firstResult:firstResult.value,
		})
		.then((res:any)=>{
			if (res.result == 1 &&
				res.retVal &&
				res.retVal.datas.length > 0
			) {
				prizeList.value = prizeList.value.concat(res.retVal.datas);
				totalRows.value = res.retVal.totalRows;
				firstResult.value = firstResult.value + 15;
			}
			console.log(prizeList)
			canRequest.value = true
		})
	};
	const deliv = (item:any)=>{
		console.log(item.prize)
		uni.navigateTo({
			url: `/pagesF/prize/receivePrize?uuid=${item.uuid}&code=${item.activityCode}`
		});
	};
	const goInfo = (item:any)=>{
		console.log(item.prize)
		if(item.prize.prizeType == 3){
			uni.navigateTo({
				url: `/pagesA/member/memberListPoint`
			});	
		}
		if(item.prize.prizeType == 2||item.prize.prizeType == 6){
			uni.navigateTo({
				url: `/pagesA/member/couponList`
			});	
		}
		if(item.prize.prizeType == 1){
			uni.navigateTo({
				url: `/pagesF/prize/receivePrize?uuid=${item.uuid}&code=${item.activityCode}`
			});
		}
	};
	onMounted(() => {
		uni.getSystemInfo({
		  success: (res) => {
		    navHeight.value = res.statusBarHeight || 0;
		    navHeight.value = navHeight.value + 64;
		  },
		  fail(err) {
		    console.log(err);
		  },
		});
		if(!(user&&user.memberId)){
			toLogin();
			return false;
		}
		prizewinner()
	});
	onReachBottom(()=>{
		prizewinner()
	});
</script>
<style  lang="less" scoped>
	@import url("~@/styles/skin.less");
	@import (reference) url("~@/styles/mixin.less");
	.prizeList{
		padding: 16px;
		background-color: #f5f5f5;
		padding-top: 0;
		// .box{
		// 	background-color: #f5f5f5;
		// 	padding: 16px;
		// }
		.box{
			padding:0px 16px;
			background-color: #f5f5f5;
			padding-top: 12px;
		}
		.paddTop{
			// padding-top: 76px;
		}
		.prize{
			width: 100%;
			padding: 16px 12px;
			background-color: #fff;
			border-radius: 8px;
			margin-bottom: 12px;
			.prizeInfo{
				display: flex;
				align-items: flex-start;
				margin-bottom: 8px;
				.prizeImg{
					width: 122px;
					height: 92px;
					display: block;
					margin-right: 8px;
				}
				.info{
					width:calc(~"(100% - 122px)");
					.prizeName{
						font-family: PingFangSC-Medium;
						font-size: 16px;
						color: #000000;
						letter-spacing: 0;
						line-height: 24px;
						font-weight: 500;
						margin-bottom: 4px;
					}
					.prizeDesc{
						font-family: PingFangSC-Regular;
						font-size: 12px;
						color: #808080;
						letter-spacing: 0;
						line-height: 12px;
						font-weight: 400;
						margin-bottom: 16px;
					}
					.prizeTime{
						font-family: PingFangSC-Regular;
						font-size: 12px;
						color: #808080;
						letter-spacing: 0;
						line-height: 18px;
						font-weight: 400;
					}
				}
			}
			.btnGroup{
				display: flex;
				justify-content: flex-end;
				.btn{
					width: 66px;
					// height: 30px;
					border-radius: 4px;
					border: 0.5px solid rgba(0,0,0,1);
					font-family: PingFangSC-Regular;
					font-size: 14px;
					color: #000000;
					letter-spacing: 0;
					text-align: center;
					font-weight: 400;
					line-height: 28px;
					&.giftGet{
						color: #fff;
						background-color: #000000;
					}
					&.sta{
						background: #EEEEEE;
						color: #CCCCCC;
						border-color:#CCCCCC;
					}
				}
			}
		}
			
	}
</style>