<template>
	<div class="receivePrize">
		<!-- #ifdef MP -->
		    <coustom-head title="领取奖品" nativeMode=true>
		    </coustom-head>
		<!-- #endif -->	
		<div class="paddBox">
			<div class="prizeBase">
				<div class="prizeImg">
					<img :src="prizeObj.prize.picUrl" alt="" class='prizeImgs'>
				</div>
				<div class="prizeInfo">
					<div class="prizeName">
						{{prizeObj.prize.name}}
					</div>
					<div class="prizeDesc">
						{{prizeObj.prize.subName}}
					</div>
					<div class="prizeTime">中奖时间：{{prizeObj.zjTime}}</div>
				</div>
			</div>
			<div class='address' @click='goAddressList' v-if='prizeObj.prize.prizeType == 1&&prizeObj.prizeState == 0'>
				<div class="row" >
					<div class="addressTitle">收件地址</div>
					<div class="selectAdd">
						{{addressObj.id?addressObj.province + addressObj.city + addressObj.area + addressObj.address:'请选择收货地址'}}
						<span class='icons iconfont icon-a-12_youlajiantou_hei'></span>
					</div>
				</div>
				<div class="row" v-if='addressObj.id'>
					<div class="addressTitle"></div>
					<div class="selectAdd">
						<div class="desc">
							{{addressObj.receiver}}  {{addressObj.mobile.substring(0,3)}}****{{addressObj.mobile.substring(7,11)}}
						</div>
					</div>
				</div>
			</div>
			<!-- youzhengguonei -->
			<!-- shunfeng -->
			
			<div class="address" v-if='prizeObj.prize.prizeType == 1&&prizeObj.prizeState == 1'>
				<div class="row">
					<div class="icon">收</div>
					<div class="selectAdd addressInfo">
						<div class="addressTitle addressInfo">
							{{prizeObj.deliveryAddress}}
						</div>
						<div class="desc">
							{{prizeObj.deliveryReceiver}} {{prizeObj.contact.substring(0,3)}}****{{prizeObj.contact.substring(7,11)}}
						</div>
						<div class="desc">
							{{prizeObj.province}} {{prizeObj.city}} {{prizeObj.area}} {{prizeObj.deliveryAddress}}
						</div>
					</div>
				</div>
			</div>
			<div class='logisticsBox' v-if='deliveryList.length'>
				<div class='logisticsName'>
					<img :src="kuaidiIcon" alt="" class="logisticsImg">
					{{prizeObj.deliveryCompanyName}} {{prizeObj.deliveryNo}}
				</div>
				<div class="logisticsList">
					<div class="logisticsInfo" v-for='(item,index) in deliveryList'>
						<div class="logisticsTitle">
							<div class="yuan"></div>
							<div class="title">
								<span class='city'>{{item.city}}</span> <span class='time'>{{item.time}}</span>
							</div>
						</div>
						<div class="logisticsContent">
							{{item.context}}
						</div>
						<!-- <div class="logisticsLeft">
							<div class="yuan"></div>
							<div class="line"></div>
						</div>
						<div class="logisticsRight">
							<div class='logisticsRightRow'><span class='city'>{{item.city}}</span> <span class='time'>{{item.time}}</span></div>
							<div class='logisticsRightRow m22'>
								{{item.context}}
								<div class="line">
									
								</div>
							</div>
						</div> -->
						
					</div>
				</div>
				<div class="row">
					<div class="icon shou">收</div>
					<div class="selectAdd addressInfo">
						<div class="addressTitle addressInfo">
							{{prizeObj.deliveryAddress}}
						</div>
						<div class="desc">
							{{prizeObj.deliveryReceiver}} {{prizeObj.contact.substring(0,3)}}****{{prizeObj.contact.substring(7,11)}}
						</div>
						<div class="desc">
							{{prizeObj.province}} {{prizeObj.city}} {{prizeObj.area}} {{prizeObj.deliveryAddress}}
						</div>
					</div>
				</div>
			</div>
			<div class="tip" v-if='prizeObj.prizeState == 1||prizeObj.prizeState == 3'>
				我们将尽快发出，如需帮助请联系客服。<span @click.stop="goKf(item)" class='kefu'>联系客服 > </span>
			</div>
			<div class="tip" v-if='prizeObj.prizeState == 2'>
				如需帮助请联系客服。<span @click.stop="goKf(item)" class='kefu'>联系客服 > </span>
			</div>
			<!-- <div class="tip">
				提交后预计XX天发货，运费由XXXX承担。
			</div> -->
			<!-- <div></div> -->
			<!-- <div></div> -->
			<div class="btn noClick" v-if='(prizeObj.prizeState == 1||prizeObj.prizeState == 3)&&prizeObj.prize.prizeType == 1'>已提交领取申请</div>
			<div class="btn" @click='savePrizeAddress' v-if='prizeObj.prizeState == 0&&prizeObj.prize.prizeType == 1'>提交</div>
			<!-- 发货状态(针对实物)/领奖状态（针对虚拟奖品） 0 未发货 （实物需要录入发货信息）/未领取 1 待发货/已领取 2 已过期 3 已发货/已兑奖
			 prize_state -->
			<kf-dialog ref="kf" title="一键咨询"></kf-dialog>
		</div>
			
	</div>
</template>

<script lang="ts" setup>
	import { reactive, ref, computed, onMounted } from "vue";
	import dayjs from "dayjs";
	import {onReady,onLoad,onShow} from '@dcloudio/uni-app';
	import api from "@/utils/api";
	import { getStorage } from "@/utils/wxuser";
	import { jAlert3, jAlert5 } from "@/base/jAlert/jAlert";
	import { createUrl } from "@/utils/utils";
	import kfDialog from "@/components/kfDialog.vue";
	import UmengSDK from "@/utils/umengAdaptor.js";
	import coustomHead from "@/components/coustomHead.vue";
	import { onPageScroll } from "@dcloudio/uni-app";
	let config = getStorage("config");
	
	let user = getStorage("user");
	let wxuser = getStorage("wxuser");
	let kf = ref();
	const kuaidiIcon = ref('https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/game/kuaidi.png');
	const canRequest = ref(true);
	const uuid = ref('');
	const code = ref('');
	const addressId = ref('');
	const addressObj = ref({});
	const deliveryList = ref([]);
	const prizeObj = ref({
		prize:{name:'',descript:''},
		zjTime:'',
	});
	const prizewinner = () =>{
		if(!canRequest.value){
			return;
		}
		canRequest.value = false;
		api.prizewinner({
			code:code.value,
			uuid:uuid.value,
			memberId:user.memberId,
			appid:config.appid,
			componentAppid:config.componentAppid||config.appid,
			hotelGroupCode:config.hotelGroupCode,
			hotelGroupId:config.hotelGroupId,
			hotelCode:config.hotelCode,
		})
		.then((res:any)=>{
			if (res.result == 1 &&
				res.retVal &&
				res.retVal.datas.length > 0
			) {
				prizeObj.value = res.retVal.datas[0];
				if(prizeObj.value.deliveryCode =='shunfeng'){
					kuaidiIcon.value = 'https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/game/shunfeng.png'
				}else if(prizeObj.value.deliveryCode =='youzhengguonei'){
					kuaidiIcon.value = 'https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/game/youzheng.png'
				}
				
				if(prizeObj.value.prizeState == 3){
					deliveryMessageItemAjax()
				}
			}

			canRequest.value = true
		})
	};
	const goAddressList = () =>{
		var pages = getCurrentPages()
		var currentPage: any = pages[pages.length - 1]
		var url = '/' + currentPage.route
		var options = currentPage.options
		var params = {
			redirect_url: `${url}?${createUrl(options)}`
		}
		uni.redirectTo({
			url: "/pagesF/address/addressList?" + createUrl(params)
		});
	};
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
				res.retVal.forEach((item,index)=>{
					if(addressId.value){
						if(item.id == addressId.value){
							addressObj.value = item;
						}
					}else{
						if(item.isDefault == 'T'){
							addressObj.value = item;
						}
					}
					
				})
			}
			console.log(addressObj)
		})
	};
	const savePrizeAddress = () =>{
		if(!canRequest.value){
			return;
		}
		if(!addressObj.value.id){
			jAlert3('请选择收货人')
			return false;
		}
		canRequest.value = false;
		let obj = reactive({
			code: code.value,
			openid: wxuser.openid,
			memberId: user.memberId,
			username: user.name,
			appid: config.appid,
			componentAppid: config.componentAppid||config.appid,
			hotelGroupCode: config.hotelGroupCode,
			hotelCode: config.hotelCode,
			hotelGroupId: config.hotelGroupId
		});
		let myAddress = addressObj.value.province + addressObj.value.city + addressObj.value.area + addressObj.value.address
		let add = {
			address:addressObj.value.address,
			name:addressObj.value.receiver,
			mobile: addressObj.value.mobile,
			recordUuid: prizeObj.value.uuid,
			province:addressObj.value.province,
			city:addressObj.value.city,
			area:addressObj.value.area,
		}
		obj = Object.assign(add, obj);
		console.log(obj)
		api.savePrizeAddress(obj).then(res => {
			if (res.result == 1) {
				jAlert3("提交成功");
				UmengSDK.sendEvent("ldp_get_prize", {
					page_name: "lucky_draw_pg",
					prize_name:prizeObj.value.prize.name,
					prize_id:code.value,
					detail_address:addressObj.value.address,
				});
				uni.redirectTo({
					url: `/pagesF/prize/receiveSuccess`
				});
			}else{
				jAlert3(res.msg);
			}
			canRequest.value = true;
		})
	};
	const deliveryMessageItemAjax = ()=>{
		let obj = reactive({
			deliverNo:prizeObj.value.deliveryNo,
			deliveryCode:prizeObj.value.deliveryCode,
			phone:prizeObj.value.contact,
			hotelGroupCode:config.hotelGroupCode,
		})
		api.deliveryMessageItemAjax(obj)
		.then((res:any)=>{
			console.log(res)
			if(res.result==1){
				if(res.retVal.deliveryMessage&&res.retVal.deliveryMessage.data.length){
					console.log(res.retVal.deliveryMessage)
					res.retVal.deliveryMessage.data.forEach((item : any)=>{
						console.log(item)
						item.time = dayjs(item.time).format('MM.DD hh:mm');
						var first = item.context.indexOf('【');
						var second = item.context.indexOf('】');
						console.log('========================>first')
						console.log('========================>second')
						console.log(first,second)
						if(first!=-1&&second!=-1){
							item.city = item.context.slice(first+1,second);
						}else{
							item.city = '';
						}
						
					})
					deliveryList.value = res.retVal.deliveryMessage.data.reverse();
				}
			}
		})
	};
	const goKf = (item: any) => {
		kf.value.showDialog();
	};
	onMounted(() => {
		prizewinner()
	});
	onLoad((options:any)=>{
		console.log(options)
		uuid.value = options.uuid;
		code.value = options.code;
		if(options.addressId){
			addressId.value = options.addressId
		}
		getManageAddress()
	})
</script>

<style lang="less" scoped>
	@import url("~@/styles/skin.less");
	@import (reference) url("~@/styles/mixin.less");
	.receivePrize{
		// padding: 16px;
		// background-color: #f5f5f5;
		// min-height: 100vh;
		.paddBox{
			padding: 16px;
			background-color: #f5f5f5;
			min-height: 100vh;
		}
		.prizeBase{
			padding: 16px 12px;
			background-color: #fff;
			display: flex;
			margin-bottom: 12px;
			border-radius: 8px;
			.prizeImg{
				width: 122px;
				height: 92px;
				margin-right: 8px;
				img,image{
					display: inline-block;
					width: 100%;
					height: 100%;
				}
			}
			.prizeInfo{
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
		.address{
			display: flex;
			flex-direction: column;
			margin-bottom: 16px;
			background-color: #fff;
			// height: 48px;
			padding: 12px;
			border-radius: 8px;
			.row{
				display: flex;
				align-items: flex-start;
				min-height: 18px;
				margin-bottom: 8px;
				&:last-of-type{
					margin-bottom: 0px;
				}
				.icon{
					background: #A43127;
					background-color: rgba(164, 49, 39, 0.12);
					width: 16px;
					height: 16px;
					border-radius: 50%;
					font-family: PingFangSC-Regular;
					font-size: 10px;
					color: #A43127;
					letter-spacing: 0;
					font-weight: 400;
					line-height: 16px;
					text-align: center;
					margin-right: 12px;
					&.shou{
						margin-left: -2px;
					}
				}
			}
			.addressTitle{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #000000;
				letter-spacing: 0;
				line-height: 14px;
				font-weight: 400;
				margin-right: 50px;
				width: 58px;
				&.addressInfo{
					width:calc(~"100% - 40px");
					font-family: PingFangSC-Medium;
					font-size: 16px;
					color: #000000;
					letter-spacing: 0;
					line-height: 16px;
					font-weight: 500;
					margin-bottom: 8px;
				}
			}
			.selectAdd{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #999;
				letter-spacing: 0;
				line-height: 18px;
				font-weight: 400;
				display: flex;
				align-items: flex-start;
				justify-content: space-between;
				background-color: #fff;
				width:calc(~"100% - 110px");
				color: #000000;
				.icons{
					font-family: PingFangSC-Regular;
					font-size: 14px;
					color: #000000;
					letter-spacing: 0;
					line-height: 14px;
					font-weight: 400;
				}
				.desc{
					font-family: PingFangSC-Regular;
					font-size: 12px;
					color: #999;
					letter-spacing: 0;
					line-height: 18px;
					font-weight: 400;
				}
				&.addressInfo{
					flex-direction: column;
					width:calc(~"100% - 40px");
				}
			}
		}
		.tip{
			font-family: PingFangSC-Regular;
			font-size: 14px;
			color: #808080;
			letter-spacing: 0;
			text-align: justify;
			line-height: 14px;
			font-weight: 400;
			.kefu{
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #000000;
				letter-spacing: 0;
				line-height: 14px;
				font-weight: 400;
			}
		}
		.btn{
			margin: 0 auto;
			margin-top: 76px;
			background: rgba(0,0,0,0.90);
			border-radius: 4px;
			font-family: PingFangSC-Regular;
			font-size: 16px;
			color: #FFFFFF;
			letter-spacing: 0;
			text-align: center;
			font-weight: 400;
			line-height: 48px;
			&.noClick{
				background: rgba(238,238,238,0.90);
				border-radius: 4px;
				color: #CCCCCC;
				margin-top: 32px;
			}
		}
		.addRessList{
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
		}
		.logisticsBox{
			background: #FFFFFF;
			border-radius: 4px;
			padding: 16px 12px;
			margin-bottom: 16px;
			.logisticsName{
				font-family: PingFangSC-Regular;
				font-size: 12px;
				color: #808080;
				letter-spacing: 0;
				line-height: 12px;
				font-weight: 400;
				display: flex;
				align-items: center;
				margin-bottom: 24px;
				.logisticsImg{
					width: 16px;
					height: 16px;
					margin-right: 12px;
					display: inline-block;
				}
			}
			.logisticsList{
				.logisticsInfo{
					// display: flex;
					// align-items: flex-start;
					.logisticsTitle{
						display: flex;
						align-items: center;
						margin-bottom: 7px;
						.yuan{
							background: #FFFFFF;
							border: 1px solid rgba(204,204,204,1);
							width: 12px;
							height: 12px;
							border-radius: 50%;
							margin-right: 12px;
						}
						.title{
							font-family: PingFangSC-Regular;
							font-size: 12px;
							color: #CCCCCC;
							letter-spacing: 0;
							line-height: 18px;
							font-weight: 400;
							.city{
								font-family: PingFangSC-Medium;
								font-size: 16px;
								color: #CCCCCC;
								letter-spacing: 0;
								line-height: 16px;
								font-weight: 500;
								margin-right: 8px;
							}
							.time{
								font-family: PingFangSC-Regular;
								font-size: 12px;
								color: #CCCCCC;
								letter-spacing: 0;
								line-height: 12px;
								font-weight: 400;
							}
						}
					}
					.logisticsContent{
						font-family: PingFangSC-Regular;
						font-size: 12px;
						color: #CCCCCC;
						letter-spacing: 0;
						line-height: 18px;
						font-weight: 400;
						margin-bottom: 7px;
						padding-left: 16px;
						border-left: 1px solid #ccc;
						width: calc(~"100% - 5px");
						margin-left: 5px;
					}
					
					&:last-of-type{
						.logisticsTitle{
							.yuan{
								background-color: #A43127;
							}
							.city{
								color: #A43127;
							}
							.time{
								color: #A43127;
							}
						}
						.logisticsContent{
							color: #808080;
							border-left: 1px dashed #A43127;
						}
					}
					.logisticsLeft{
						padding-top: 3px;
						margin-right: 12px;
						.yuan{
							background: #FFFFFF;
							border: 1px solid rgba(204,204,204,1);
							width: 12px;
							height: 12px;
							border-radius: 50%;
						}
						.line{
							height: auto;
							width: 1px;
							background-color: #CCCCCC;
						}
					}
					.logisticsRight{
						.logisticsRightRow{
							font-family: PingFangSC-Regular;
							font-size: 12px;
							color: #CCCCCC;
							letter-spacing: 0;
							line-height: 18px;
							font-weight: 400;
							margin-bottom: 7px;
							&.m22{
								min-height: 42px;
							}
							.line{
								height: 100%;
								width: 1px;
							}
							.city{
								font-family: PingFangSC-Medium;
								font-size: 16px;
								color: #CCCCCC;
								letter-spacing: 0;
								line-height: 16px;
								font-weight: 500;
								margin-right: 8px;
							}
							.time{
								font-family: PingFangSC-Regular;
								font-size: 12px;
								color: #CCCCCC;
								letter-spacing: 0;
								line-height: 12px;
								font-weight: 400;
							}
							.logisticsRightRowTitle{
								font-size: 16px;
								letter-spacing: 0;
								line-height: 16px;
							}
						}
					}
				}
			}
			.row{
				display: flex;
				align-items: flex-start;
				min-height: 18px;
				margin-bottom: 8px;
				&:last-of-type{
					margin-bottom: 0px;
				}
				.icon{
					background: #A43127;
					background-color: rgba(164, 49, 39, 0.12);
					width: 16px;
					height: 16px;
					border-radius: 50%;
					font-family: PingFangSC-Regular;
					font-size: 10px;
					color: #A43127;
					letter-spacing: 0;
					line-height: 10px;
					font-weight: 400;
					line-height: 16px;
					text-align: center;
					margin-right: 12px;
					&.shou{
						margin-left: -2px;
					}
				}
				.addressTitle{
					font-family: PingFangSC-Regular;
					font-size: 14px;
					color: #000000;
					letter-spacing: 0;
					line-height: 14px;
					font-weight: 400;
					margin-right: 50px;
					width: 58px;
					&.addressInfo{
						width:calc(~"100% - 40px");
						font-family: PingFangSC-Medium;
						font-size: 16px;
						color: #000000;
						letter-spacing: 0;
						line-height: 16px;
						font-weight: 500;
						margin-bottom: 8px;
					}
				}
				.selectAdd{
					font-family: PingFangSC-Regular;
					font-size: 14px;
					color: #999;
					letter-spacing: 0;
					line-height: 18px;
					font-weight: 400;
					display: flex;
					align-items: flex-start;
					justify-content: space-between;
					background-color: #fff;
					width:calc(~"100% - 110px");
					.icons{
						font-family: PingFangSC-Regular;
						font-size: 14px;
						color: #000000;
						letter-spacing: 0;
						line-height: 14px;
						font-weight: 400;
					}
					.desc{
						font-family: PingFangSC-Regular;
						font-size: 12px;
						color: #999;
						letter-spacing: 0;
						line-height: 18px;
						font-weight: 400;
					}
					&.addressInfo{
						flex-direction: column;
						width:calc(~"100% - 40px");
					}
				}
			}
		}
	}
</style>