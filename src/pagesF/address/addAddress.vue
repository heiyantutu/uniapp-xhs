<template>
	<div class="addAddress">
		<!-- #ifdef MP -->
		    <coustom-head title="新增收货地址" nativeMode=true>
		    </coustom-head>
		<!-- #endif -->	
		<div class="rowList pb">
			<div class="row">
				<div class="rowTitle">收货人</div>
				<div class="rowContent">
					<input type='text' placeholder-class="phcolor" placeholder="请输入收货人姓名" maxlength="20" v-model='addressObj.name'  v-on:input="isNotNullAddress"/>
				</div>
			</div>
			<div class="row">
				<div class="rowTitle">手机号</div>
				<div class="rowContent">
					<input type='tel' placeholder-class="phcolor" placeholder="请输入手机号" maxlength="11" v-model='addressObj.phone' v-on:input="isNotNullAddress"/>
				</div>
			</div>
			<div class="row">
				<div class="rowTitle">所在地区</div>
				<div class="rowContent" @click='seacherMap'>
					<!-- <input type='text' placeholder-class="phcolor" placeholder="请选择省、市、区" v-model="addressObj.loc" v-on:input="isNotNullAddress" /> -->
					<p class='txt' :class='{"phcolor":!addressObj.loc}'>{{addressObj.loc||'请选择省、市、区'}}</p>
					<span class='icon-a-12_dingwei iconfont'></span>
				</div>
			</div>
			<div class="row">
				<div class="rowTitle">详细地址</div>
				<div class="rowContent">
					<input type='text' placeholder-class="phcolor" placeholder="请输入街道、门牌号等" v-model="addressObj.address" v-on:input="isNotNullAddress" />
					
				</div>
			</div>
			<div class="quickAddressBox">
				<textarea type="text" 
					placeholder-class="quickAddressPlaceholder" 
					class="quickAddress" 
					rows="2"
					placeholder="请粘帖诸如'XX省XX市XX区XXXX路XXX号,某某某,13333333333'"
					v-model="addressObj.quickAddress"
				></textarea>
				<div class="btns" v-if="addressObj.quickAddress!=''">
					<div class="clearAddress" @click="clearAddress">清空</div>
					<div class="distinguish" @click="distinguish(addressObj.quickAddress)">识别</div>
				</div>
			</div>
		</div>
		<div class="rowList">
			<div class="row">
				<div class="rowTitle">设为默认</div>
				<div class="rowContent ri">
					<div class="icons" :class="{'select':addressObj.isDefault=='T'}" @click='selectDefault'>
						<div class='sw'>
							
						</div>
					</div>
				</div>
				
			</div>
		</div>
		<div class="saveBtn baseBtn" @click='saveAddress'>
			保存
		</div>
		<div class="del" @click='deleteAddress' v-if='addressId'>
			<span class='iconDel icon-a-16_shanchulishijilu iconfont'></span>
			删除
		</div>
		<section class='map' v-show='!deliveryFlag'>
			<map 
				id="mymap" 
				:longitude="addressObj.lng" 
				:latitude="addressObj.lat" 
				scale="14" 
				:markers="markers" 
				@regionchange="functionName" 
				@end="end"
				@begin="begin" 
				show-location 
				style="width: 100%; height: 300px;"
				></map>
		</section>
	</div>
</template>

<script  setup lang="ts">
	import { reactive, ref, computed, onMounted , toRefs } from "vue";
	import {onReady,onLoad} from '@dcloudio/uni-app';
	import {
		jAlert3,jAlert5
	} from "@/base/jAlert/jAlert";
	import UmengSDK from "@/utils/umengAdaptor.js";
	import api from "@/utils/api";
	import { getStorage , setStorage} from "@/utils/wxuser";
	import QQMapWX from "@/utils/qqmap-wx-jssdk.min.js";
	import AddressParse from 'zh-address-parse'
	import { mainStore } from '@/store/index';
	import coustomHead from "@/components/coustomHead.vue";
	import { onPageScroll } from "@dcloudio/uni-app";
	// #ifdef APP-PLUS || H5
	import {jsonp} from 'vue-jsonp';
	// #endif
	const main = mainStore();
	let qqmapsdk;
	let touchTimeStamp = 0;
	let config = getStorage("config");
	let user = getStorage("user");
	let wxuser = getStorage("wxuser");
	let addressId = ref("");
	let mapCtx = ref(null)
	let deliveryFlag = ref(true);
	let addressObj = reactive({
		name:'',
		phone:'',
		loc: "",
		address: "",
		addressName: "",
		lat: "",
		lng: "",
		id: "",
		province:'',
		city:'',
		area:'',
		isDefault:'',
		quickAddress:'',
		mapAddress:'',
	});
	let loading = ref(false);
	let isSaveAddress = ref(true);
	let markers = ref([
		{
			latitude: 0,
			longitude: 0
		}
	])
	let editAddress = reactive({});
	const selectDefault = ()=>{
		addressObj.isDefault = addressObj.isDefault == 'T'?'F':'T'
		console.log(addressObj.isDefault)
	};
	const isNotNullAddress = ()=>{
		if (
			addressObj.name == "" ||
			addressObj.phone == "" ||
			addressObj.loc == "" ||
			addressObj.address == ""
		) {
			isSaveAddress.value = false;
		} else {
			isSaveAddress.value = true;
		}
	};
	const begin = ({timeStamp})=>{
		touchTimeStamp = timeStamp;
	};
	const end = ({timeStamp})=>{
		if (timeStamp - touchTimeStamp > 120) {
			mapCtx.getCenterLocation({
				success:(res)=>{
					console.log(res)
					addressObj.lat = res.latitude;
					addressObj.lng = res.longitude;
					markers = [
						{
							latitude: res.latitude,
							longitude: res.longitude
						}
					]
				},
				
			})
		}
	};
	const seacherMap = ()=>{
		uni.chooseLocation({
			success:(data)=>{console.log('==========================================》data')
				console.log(data)
				// #ifdef APP-PLUS || H5
					console.log('H5端及APP端')
					var url = 'https://apis.map.qq.com/ws/geocoder/v1/';
					jsonp(url, {
						key: 'OFKBZ-QR763-VTV3P-RYHRR-MGXCK-JDBOM',
						coord_type:'5',
						get_poi:1,
						location:data.latitude + ',' + data.longitude,
						output: 'jsonp'
					}).then(res => {
						console.log(res)
						var isMunicipalities = false;
						if(res.result.ad_info.province.indexOf("市") > -1){
							isMunicipalities = true;
							res.result.ad_info.province = res.result.ad_info.province.replace(/市/, "");
						}
						if (isMunicipalities) {
							addressObj.loc = res.result.ad_info.city + res.result.ad_info.district;
						} else {
							addressObj.loc = res.result.ad_info.province + res.result.ad_info.city + res.result.ad_info.district;
						}
						
						addressObj.province = res.result.ad_info.province;
						addressObj.city = res.result.ad_info.city;
						addressObj.area = res.result.ad_info.district;
						addressObj.address = res.result.address.split(
							addressObj.loc
						)[1];
						addressObj.addressName =
							res.result.formatted_addresses.recommend;
						if(addressObj.addressName){
							addressObj.address = addressObj.addressName
						}
						addressObj.mapAddress = res.result.pois;
						addressObj.lat = res.result.location.lat;
						addressObj.lng = res.result.location.lng;
						isNotNullAddress();
					})
				
				// #endif
				// #ifdef MP-WEIXIN
					console.log('微信小程序端')
					qqmapsdk.reverseGeocoder({
						location:{
							latitude: data.latitude,
							longitude: data.longitude
						},
						get_poi: 1,
						success: (res)=> {
							console.log('================================>')
							console.log(res);
							var isMunicipalities = false;
							if(res.result.ad_info.province.indexOf("市") > -1){
								isMunicipalities = true;
								res.result.ad_info.province = res.result.ad_info.province.replace(/市/, "");
							}
							if (isMunicipalities) {
								addressObj.loc = res.result.ad_info.city + res.result.ad_info.district;
							} else {
								addressObj.loc = res.result.ad_info.province + res.result.ad_info.city + res.result.ad_info.district;
							}
							
							addressObj.province = res.result.ad_info.province;
							addressObj.city = res.result.ad_info.city;
							addressObj.area = res.result.ad_info.district;
							addressObj.address = res.result.address.split(
								addressObj.loc
							)[1];
							addressObj.addressName =
								res.result.formatted_addresses.recommend;
							if(addressObj.addressName){
								addressObj.address = addressObj.addressName
							}
							addressObj.mapAddress = res.result.pois;
							addressObj.lat = res.result.location.lat;
							addressObj.lng = res.result.location.lng;
							isNotNullAddress();
							
						},
						fail:(res)=>{
							console.log('==========================>fail')
							console.log(res);
						},
						complete:(res)=>{
							console.log('============================>error')
							console.log(res);
						}
					})
				// #endif
			},
			fail:(res)=>{
				console.log(res)
			},
			
		})
	};
	const isPhone =()=>{
		if (!(/^1[3456789]\d{9}$/.test(addressObj.phone))) {
			jAlert3("手机号码格式不正确!");
			return false;
		} else {
			return true;
		}
	};
	const saveAddress = ()=>{
		console.log(addressObj)
		if (loading.value) {
			return
		}
		if (!addressObj.name) {
			jAlert3("请输入姓名");
			return false;
		}
		if (!addressObj.phone) {
			jAlert3("请输入手机号码");
			return false;
		}
		if (!isPhone()) {
			return false;
		}
		if (!addressObj.loc) {
			jAlert3("请输入地址");
			return false;
		}
		if (!addressObj.address) {
			jAlert3("请输入门牌号");
			return false;
		}
		console.log(addressObj.province)
		console.log(addressObj.city)
		console.log(addressObj.area)
		if(!addressObj.province||!addressObj.city||!addressObj.area){
			console.log(123456)
			distinguishTxt();
		}
		let opt = {
			address: addressObj.address,
			alias: addressObj.address,
			province: addressObj.province,
			city: addressObj.city,
			area: addressObj.area,
			openid: wxuser.openid,
			mobile: addressObj.phone,
			receiver: addressObj.name,
			isDefault: addressObj.isDefault,
			id: addressObj.id,
			latitude: addressObj.lat,
			longitude: addressObj.lng,
			hotelGroupCode: config.hotelGroupCode,
			hotelCode: config.hotelCode,
			memberId:'',
		}
		if (user && user.memberId) {
			opt.memberId = user.memberId
		}
		loading.value = true;
		api.addAddress(opt)
		.then((res)=>{
			console.log(res)
			if (res.result == 1) {
				jAlert3("保存成功");
				UmengSDK.sendEvent("da_compile_address_clk", {
					page_name: "delivery_address",
					consignee:addressObj.name,
					is_default:addressObj.isDefault,
					detail_address:addressObj.address,
					area:addressObj.loc,
					phone_number:addressObj.phone,
				});
				uni.disableAlertBeforeUnload()
				setTimeout(function() {
					uni.navigateBack({
						delta: 1
					});
					loading.value = false
				}, 2000);
			} else {
				loading.value = false
				jAlert3(res.msg);
			}
		})
	};
	const deleteAddress = ()=>{
		if (loading.value) {
			return
		}
		loading.value = true;
		jAlert5('是否删除此常用地址',()=>{
			let obj = {
				memberId:'',
				id:addressId.value||'',
			}
			if (user && user.memberId) {
				obj.memberId = user.memberId
			}
			console.log(addressObj)
			api.deleteAddress(obj)
			.then((res)=>{
				if (res.result == 1) {
					jAlert3("删除成功");
					UmengSDK.sendEvent("da_delete_address_clk", {
						page_name: "delivery_address",
						consignee:addressObj.name,
						is_default:addressObj.isDefault||'F',
						detail_address:addressObj.address,
						area:addressObj.loc,
						phone_number:addressObj.phone,
					});
					setTimeout(function() {
						uni.navigateBack({
							delta: 1
						});
						loading.value = false
					}, 2000);
				} else {
					loading.value = false
					jAlert3(res.msg);
				}
			})
		},()=>{
			loading.value = false;
		})
			
	};
	const clearAddress = ()=>{
		addressObj.quickAddress = '';
	};
	const distinguish = (txt)=>{
		console.log(addressObj.quickAddress)
		console.log(txt)
		let addressText = txt || addressObj.quickAddress;
		if (addressText == getStorage('address') && txt) {
			console.log(789456)
			return;
		}
		console.log(addressText)
		setStorage('address', addressText)
		let address = AddressParse(addressText, 0)
		console.log(address)
		if (address.city && address.province && address.area) {
			addressObj.city = address.city
			addressObj.province = address.province;
			addressObj.area = address.area;
		
			addressObj.loc = addressObj.province + addressObj.city + addressObj.area;
			addressObj.address = address.detail;
			if (address.name) {
				addressObj.name = address.name
			}
			if (address.phone) {
				addressObj.phone = address.phone
			}
		} else if (!txt) {
			jAlert3('识别失败，请手动选择')
		}
	};
	const distinguishTxt = ()=>{
		let addressText = addressObj.loc;
		let address = AddressParse(addressText, 0);
		if (address.city && address.province && address.area) {
			addressObj.city = address.city
			addressObj.province = address.province;
			addressObj.area = address.area;
		
			// addressObj.loc = addressObj.province + addressObj.city + addressObj.area;
			// addressObj.address = address.detail;
			if (address.name) {
				addressObj.name = address.name
			}
			if (address.phone) {
				addressObj.phone = address.phone
			}
		}
	};
	onMounted(()=>{
		// console.log(stata)
	});
	onReady(()=>{
		mapCtx.value = uni.createMapContext("mymap");
		console.log(mapCtx)
	});
	onLoad((options: any)=>{
		// 实例化API核心类
		console.log(QQMapWX)
		qqmapsdk = new QQMapWX({
			key: "OFKBZ-QR763-VTV3P-RYHRR-MGXCK-JDBOM"
		});
		console.log(options, 11111111111);
		addressId.value = options.id || "";
		if(addressId.value){
			editAddress = main.addressInfo;
			console.log(editAddress)
			let f = 0;
			for (let i in editAddress) {
				if (editAddress[i] != "") {
					f++;
				}
			}
			if (f != 0) {
				addressObj.province = editAddress.province;
				addressObj.city = editAddress.city;
				addressObj.area = editAddress.area;
				addressObj.name = editAddress.receiver;
				addressObj.phone = editAddress.mobile;
				addressObj.loc = editAddress.province + editAddress.city + editAddress.area;
				addressObj.address = editAddress.address;
				addressObj.isDefault = editAddress.isDefault;
				addressObj.id = editAddress.id;
				uni.setNavigationBarTitle({
					title: "编辑常用地址"
				});
			} else {
				uni.setNavigationBarTitle({
					title: "新增常用地址"
				});
			}
		}else{
			console.log('测试是否进入')
			uni.enableAlertBeforeUnload({
				message: '是否放弃本次编辑',
				success:function(){
					console.log(123)
				},
				fail:function(){
					console.log(321)
				},
				complete:function(){
					console.log(789)
				},
			})
		}
		// wx.enableAlertBeforeUnload({})
	});
	
	
	
</script>

<style lang="less" scoped>
	@import url("~@/styles/skin.less");
	@import url("~@/styles/mixin.less");
	.addAddress{
		background-color: #f8f8f8;
		padding: 16px;
		padding-top: 0px;
		.rowList{
			background: #FFFFFF;
			border-radius: 8px;
			margin-bottom: 12px;
			padding:0px 12px;
			&.pb{
				padding-bottom: 12px;
				margin-top: 16px;
			}
			.row{
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 48px;
				.rowTitle{
					font-family: PingFangSC-Regular;
					font-size: 14px;
					color: #000000;
					letter-spacing: 0;
					text-align: left;
					font-weight: 400;
					width: 88px;
					line-height: 22px;
				}
				.rowContent{
					width: calc(~"(100% - 88px)");
					display: flex;
					align-items: center;
					justify-content: space-between;
					&.ri{
						justify-content: flex-end;
					}
					input{
						font-family: PingFangSC-Regular;
						font-size: 14px;
						color: #333333;
						letter-spacing: 0;
						font-weight: 400;
						width: 203px;
						height: 22px;
						line-height: 22px;
						.phcolor {
							color: #CCCCCC;
						}
					}
					.txt{
						font-family: PingFangSC-Regular;
						font-size: 14px;
						color: #333333;
						letter-spacing: 0;
						font-weight: 400;
						width: 203px;
						height: 22px;
						line-height: 22px;
						&.phcolor{
							color: #888;
						}
					}
					// input::placeholder{
					// 	font-family: PingFangSC-Regular;
					// 	font-size: 14px;
					// 	color: #CCCCCC;
					// 	letter-spacing: 0;
					// 	font-weight: 400;
					// }
					.icons{
						background: #EEEEEE;
						border: 2px solid rgba(238,238,238,1);
						border-radius: 32px;
						width: 48px;
						height: 28px;
						display: flex;
						align-items: center;
						justify-content: flex-start;
						transition: all 0.5s;
						&.select{
							background: #A43127;
							border: 1px solid rgba(238,238,238,1);
							border-radius: 28px;
							justify-content: flex-end;
							transition: all 0.5s;
						}
						.sw{
							width: 24px;
							height: 24px;
							background: #FFFFFF;
							box-shadow: 0px 0px 2px 0px rgba(0,0,0,0.2);
							border-radius: 50%;
						}
					}
				}
				
			}
			.quickAddressBox {
				position: relative;
				padding: 12px;
				background: #F8F8F8;
			}
			.quickAddress {
				position: relative;
				width: 100%;
				line-height: 22px;
				height: 108px;
				font-size: 14px;
				box-sizing: border-box;
			}
			.quickAddressPlaceholder {
				font-family: PingFangSC-Regular;
				font-size: 14px;
				color: #CCCCCC;
				letter-spacing: 0;
				font-weight: 400;
			}
			.btns {
				position: absolute;
				bottom: 0;
				width: calc(100% - 20px);
				padding: 20px 0;
				display: flex;
				justify-content: flex-end;
				padding-right: 20px;
				z-index: 66666;
				.clearAddress {
					font-size: 14px;
					color: @prime-color;
					line-height: 24px;
				}
				.distinguish {
					background: @prime-color;
					color: #fff;
					line-height: 24px;
					border-radius: 4px;
					padding: 0 15px;
					margin-left: 20px;
				}
			}
		}
		.saveBtn{
			background: rgba(0,0,0,0.90);
			border-radius: 4px;
			font-family: PingFangSC-Regular;
			font-size: 16px;
			color: #FFFFFF;
			letter-spacing: 0;
			text-align: center;
			font-weight: 400;
			line-height: 48px;
			margin-top: 32px;
			.baseBtn();
		}
		.del{
			margin-top: 24px;
			font-family: PingFangSC-Regular;
			font-size: 14px;
			color: #000000;
			letter-spacing: 0;
			text-align: center;
			line-height: 14px;
			font-weight: 400;
			display: flex;
			align-items: center;
			justify-content: center;
			.iconDel{
				font-size: 20px;
			}
		}
	}
</style>