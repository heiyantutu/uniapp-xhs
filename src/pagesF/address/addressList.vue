<template>
	<div class='addressList'>
		<!-- #ifdef MP -->
		    <coustom-head title="地址列表" bgColor='#fff'>
		    </coustom-head>
		<!-- #endif -->	
		<div class="paddTop" v-bind:style="{height:navHeight + 'px'}"></div>
		<!-- <div class="paddBox"> -->
		<div class="list" v-for='(item , index) in addressManage'>
			<div class="info" @click='select(item)'>
				<div class="user">
					<div class="name">{{item.receiver}}</div>
					<div class="mobile">{{item.mobile.substring(0,3)}}****{{item.mobile.substring(7,11)}}</div>
					<div class="isDefault" v-if='item.isDefault=="T"'>默认</div>
				</div>
				<div class="address">{{item.address}}</div>
			</div>
			<div class="icon" @click='editAddress(item)'>
				<span class='icon-a-16_bianji iconfont'></span>
			</div>
		</div>
		<empty tips="暂无收货地址"  v-if="addressManage.length == 0&&canRequest" ></empty>
		<div class="addressFooter">
			<div class="addAddress baseBtn" @click='editAddress' >新增</div>
		</div>
		<!-- </div> -->
			
	</div>
</template>

<script lang="ts" setup>
	import { reactive, ref, computed, onMounted , toRefs } from "vue";
	import {onReady,onLoad,onShow} from '@dcloudio/uni-app';
	import {
		jAlert3
	} from "@/base/jAlert/jAlert";
	import UmengSDK from "@/utils/umengAdaptor.js";
	import api from "@/utils/api";
	import { getStorage } from "@/utils/wxuser";
	import { mainStore } from '@/store/index';
	import coustomHead from "@/components/coustomHead.vue";
	import { onPageScroll } from "@dcloudio/uni-app";
	import empty from "@/components/empty.vue";
	
	let config = getStorage("config");
	let user = getStorage("user");
	let wxuser = getStorage("wxuser");
	let redirect_url = ref();
	let navHeight = ref(64);
	const main = mainStore();
	const canRequest = ref(false)
	const addressManage = ref([]);
	const getManageAddress = ()=>{
		let obj = {
			hotelGroupId: config.hotelGroupId,
			openid: wxuser.openid,
			hotelGroupCode: config.hotelGroupCode,
			hotelCode: config.hotelCode,
			memberId:'',
		}
		if (user && user.memberId) {
			obj.memberId = user.memberId
		}
		api.getMemberAddress(obj)
		.then((res)=>{
			console.log(res)
			if(res.result==1){
				addressManage.value = res.retVal;
				canRequest.value = true;
			}
			UmengSDK.sendEvent("delivery_address", {
				page_name: "delivery_address"
			},'OTHER');
		})
	};
	const editAddress = (item)=>{
		let obj = {
			id:''
		}
		if(item.id){
			obj.id = item.id
		}
		main.getEditAddress(item)
		uni.navigateTo({
			url:`/pagesF/address/addAddress?id=${obj.id}`
		})
	};
	const select = (item)=>{
		console.log(item);
		if (redirect_url.value) {
			console.log(decodeURIComponent(redirect_url.value))
			let url = decodeURIComponent(redirect_url.value) + '&addressId=' + item.id;
			uni.redirectTo({
				url: url,
			});
		}
	}
	onMounted(()=>{
		uni.getSystemInfo({
		  success: (res) => {
		    navHeight.value = res.statusBarHeight || 0;
		    navHeight.value = navHeight.value + 64;
		  },
		  fail(err) {
		    console.log(err);
		  },
		});
	});
	onLoad((options: any)=>{
		if (options.redirect_url) {
			redirect_url.value = options.redirect_url;
		}
		config = getStorage("config");
		
	});
	onShow(()=>{
		getManageAddress();
	});
</script>

<style lang="less" scoped>
	@import url("~@/styles/skin.less");
	@import url("~@/styles/mixin.less");
	.addressList{
		background-color: #f8f8f8;
		min-height: 100vh;
		padding: 16px;
		padding-top: 0px;
		padding-bottom: 72px;
		padding-bottom: calc(72px + constant(safe-area-inset-bottom));
		padding-bottom: calc(72px + env(safe-area-inset-bottom));
		// .paddBox{
		// 	background-color: #f8f8f8;
		// 	min-height: 100vh;
		// 	padding: 16px;
		// 	padding-bottom: 72px;
		// 	padding-bottom: calc(72px + constant(safe-area-inset-bottom));
		// 	padding-bottom: calc(72px + env(safe-area-inset-bottom));
		// }
		.paddTop{
			// padding-top: 76px;
		}
		.list{
			background: #FFFFFF;
			border-radius: 8px;
			padding: 16px 12px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 12px;
			.info{
				width: calc(~"(100% - 50px)");
				.user{
					display: flex;
					align-items: center;
					margin-bottom: 12px;
					.name{
						font-family: PingFangSC-Medium;
						font-size: 16px;
						color: #000000;
						letter-spacing: 0;
						line-height: 16px;
						font-weight: 500;
						margin-right: 8px;
					}
					.mobile{
						font-family: PingFangSC-Regular;
						font-size: 14px;
						color: #000000;
						letter-spacing: 0;
						line-height: 14px;
						font-weight: 400;
						margin-right: 8px;
					}
					.isDefault{
						background: rgba(164,49,39,0.08);
						border-radius: 4px;
						width: 28px;
						height: 14px;
						font-family: PingFangSC-Regular;
						font-size: 10px;
						color: #A43127;
						letter-spacing: 0;
						line-height: 10px;
						font-weight: 400;
						line-height: 14px;
						text-align: center;
					}
				}
				.address{
					font-family: PingFangSC-Regular;
					font-size: 12px;
					color: #808080;
					letter-spacing: 0;
					line-height: 18px;
					font-weight: 400;
				}
			}
			.icon{
				font-size: 16px;
				color: #000;
			}
		}
		.addressFooter{
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #fff;
			padding: 12px 16px;
			padding-bottom: calc(16px + constant(safe-area-inset-bottom));
			padding-bottom: calc(16px + env(safe-area-inset-bottom));
			.addAddress{
				width: 100%;
				height: 100%;
				background: rgba(0,0,0,0.90);
				border-radius: 4px;
				font-family: PingFangSC-Regular;
				font-size: 16px;
				color: #FFFFFF;
				letter-spacing: 0;
				text-align: center;
				font-weight: 400;
				line-height: 48px;
				.baseBtn();
			}
		}
	}
</style>