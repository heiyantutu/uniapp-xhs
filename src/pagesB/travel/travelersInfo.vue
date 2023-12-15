<template>
	<!-- #ifdef MP -->
	<coustom-head :title="type== 'edit'?'编辑出行人':'新增出行人'" nativeMode=true>
	</coustom-head>
	<!-- #endif -->
	<div class="travelersInfo_ui">
		<div class="add-btn" @click="chooseImg()">
			<div class="iconfont icon-a-20_shibieshenfenzheng"></div>识别身份证信息
		</div>
		<div class="form-infos">
			<div class="form-info">

				<div class="form-inline">
					<div class="label">与我的关系</div>
					<div class="val">
						<picker :value="pickerIndex.relationshipIndex" :range="relationships" range-key="name"
							@change="bindRelationshipChange">
							<div class="picker-box">
								<div class="picker-box">
									<div v-if="travelDetail.relationship">{{relationshipState}}</div>
									<div class="grey" v-else>请选择与本人关系</div>
								</div>
								<i class="iconfont icon-a-16_youlajiantou_hei"></i>
							</div>
						</picker>

					</div>
				</div>
				<div class="form-inline">
					<div class="label">姓名</div>
					<div class="val">
						<input class="input-text" type="text" v-model="travelDetail.name" placeholder="请输入出行人姓名"
							placeholder-style="color: #CCCCCC;" :class="{'disabled':travelDetail.relationship== 'Self'&&user.isRealName=='T'}" :disabled="travelDetail.relationship== 'Self'&&user.isRealName=='T'">
					</div>
				</div>
				<div class="tips" v-if="travelDetail.relationship!='Self'">
					<i class="iconfont icon-a-12_tishi"></i>请确保出行人姓名与所须证件一致
				</div>
			</div>
			<div class="form-info">
				<div class="tl">
					证件信息
				</div>
				<div class="form-inline">
					<div class="label">证件类型</div>
					<div class="val">
						<picker :value="pickerIndex.idCodeIndex" :range="idCardList" range-key="name"
							@change="bindidCodeChange">
							<div class="picker-box">
								<div v-if="travelDetail.idCode">{{idCodeState}}</div>
								<div class="grey" v-else>请选择证件类型</div>
								<i class="iconfont icon-a-16_youlajiantou_hei"></i>
							</div>
						</picker>

					</div>
				</div>
				<div class="form-inline">
					<div class="label">证件号码</div>
					<div class="val">
						<input class="input-text" type="text" placeholder="请输入证件号码" v-model="travelDetail.idNo" 
							placeholder-style="color: #CCCCCC;" :class="{'disabled':travelDetail.relationship== 'Self'&&user.isRealName=='T'}" :disabled="travelDetail.relationship== 'Self'&&user.isRealName=='T'">
					</div>
				</div>
				<div class="form-inline">
					<div class="label">性别</div>
					<div class="val">
						<picker :value="pickerIndex.sexIndex" :range="sexList" range-key="name" @change="bindSexChange" :disabled="travelDetail.idCode=='01'||(travelDetail.relationship== 'Self'&&user.isRealName=='T')" >
							<div class="picker-box" :class="{'disabled':travelDetail.idCode=='01'||(travelDetail.relationship== 'Self'&&user.isRealName=='T')}">
								<div v-if="travelDetail.sex">{{sexState}}</div>
								<div class="grey" v-else>请选择性别</div> <i class="iconfont icon-a-16_youlajiantou_hei" v-if="!(travelDetail.idCode=='01'||(travelDetail.relationship== 'Self'&&user.isRealName=='T'))"></i>
							</div>
						</picker>

					</div>
				</div>
				<div class="form-inline">
					<div class="label">出生日期</div>
					<div class="val">
						<picker mode="date" :value="travelDetail.birth" :start="start" :end="end" :disabled="travelDetail.idCode=='01'||(travelDetail.relationship== 'Self'&&user.isRealName=='T')"  
							@change="bindDateChange">
							<div class="picker-box" :class="{'disabled':travelDetail.idCode=='01'||(travelDetail.relationship== 'Self'&&user.isRealName=='T')}">
								<div v-if="travelDetail.birth">{{birthFormat(travelDetail.birth)}}</div>
								<div class="grey" v-else>请选择出生日期</div>
								<i class="iconfont icon-a-16_youlajiantou_hei" v-if="!(travelDetail.idCode=='01'||(travelDetail.relationship== 'Self'&&user.isRealName=='T'))"></i>
							</div>
						</picker>


					</div>
				</div>
			</div>
			<div class="form-info">
				<div class="tl">
					其他信息
				</div>
				<div class="form-inline">
					<div class="label">手机号</div>
					<div class="val">
						<input class="input-text" v-model="travelDetail.mobile" type="text" maxlength="11"
							placeholder="请输入手机号" placeholder-style="color: #CCCCCC;" :class="{'disabled':travelDetail.relationship== 'Self'&&user.isRealName=='T'}" :disabled="travelDetail.relationship== 'Self'&&user.isRealName=='T'">
					</div>
				</div>
				<div class="form-inline">
					<div class="label">邮箱</div>
					<div class="val">
						<input class="input-text" v-model="travelDetail.email" type="text" placeholder="选填"
							placeholder-style="color: #CCCCCC;" :class="{'disabled':travelDetail.relationship== 'Self'&&user.isRealName=='T'}" :disabled="travelDetail.relationship== 'Self'&&user.isRealName=='T'">


					</div>
				</div>
			</div>
			<div class="form-info" v-if="type=='edit'">

				<div class="form-inline">
					<div class="label">旅行喜好</div>
					<div class="val" @click="goTravelPreference(id)">
						<div class="picker">
							<div class="picker-box">选填<i class="iconfont icon-a-16_youlajiantou_hei"></i>
							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
		<div class="footer" v-if="type=='edit'">
			<div class="footer-btn baseBtn" @click="saveGuestBase()">
				保存
			</div>
			<div class="del" @click="deleteGuestLinkRelation()">
				<i class="iconfont icon-a-16_shanchulishijilu"></i>
				删除
			</div>
		</div>
		<div class="footer" v-else>
			<div class="footer-btn baseBtn" @click="saveGuestBase()">
				下一步
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted, watch } from "vue";
	import api from "@/utils/api";
	import UmengSDK from "@/utils/umengAdaptor.js";
	import { getStorage } from "@/utils/wxuser";
	import {
		onLoad
	} from "@dcloudio/uni-app";

	import dayjs from "dayjs";
	import coustomHead from "@/components/coustomHead.vue";
	import { jAlert3, jAlert5 } from "@/base/jAlert/jAlert";
	import { goPage } from "@/utils/utils";
	let config = getStorage("config");
	let user = getStorage("user");
	const type = ref("add");
	const id = ref("");
	let start = "1900-01-01";
	let end = dayjs().format("YYYY-MM-DD");
	let endDate = ref('')
	let delta = ref(1)
	let sexList = [
		{
			value: "1",
			name: "男",
		},
		{
			value: "2",
			name: "女",
		},
	];
	let idCardList = [
		{
			name: "身份证",
			value: "01",
		},
		{
			name: "临时身份证",
			value: "02",
		},
		{
			name: "护照",
			value: "14",
		},
		{
			name: "港澳通行证",
			value: "21",
		}
		// {
		// 	name: "台胞证",
		// 	value: "16",
		// },
	]
	let travelDetail = reactive({
		name: '',
		idCode: '',
		idNo: '',
		sex: '',
		birth: "",
		mobile: "",
		email: "",
		relationship: ""
	})
	let relationships:any = ref([])
	var idReg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
	var passportReg = /(\w{8,10}$)/;
	var HKandMacauPassportReg = /^([A-Z]\d{6,10}(\w1)?)$/;
	var taiwanPassportReg = /(^[a-zA-Z][0-9]{9}$)|(^\d{8}$)/;
	let sexState = computed(() => {
		let sexState = "";
		sexList.forEach((n) => {
			if (n.value == travelDetail.sex) {
				sexState = n.name;
			}
		});
		return sexState;
	});
	watch(() => travelDetail.idNo, (newVal, oldVal) => {
		calculate()
	})
	watch(() => travelDetail.idCode, (newVal, oldVal) => {
		calculate()
	})
	watch(() => travelDetail.relationship, (newVal, oldVal) => {
		if (newVal == 'Self'&&user.isRealName=='T') {
			travelDetail.idCode = user.idType
			travelDetail.name = user.name
			travelDetail.idNo = user.idNo
			travelDetail.sex = user.sex
			travelDetail.birth = user.birth
			travelDetail.mobile = user.mobile
			travelDetail.email = user.email
		}
		
	})
	let idCodeState = computed(() => {
		let idCodeState = "";
		idCardList.forEach((n) => {
			if (n.value == travelDetail.idCode) {
				idCodeState = n.name;
			}
		});
		return idCodeState;
	});
	let pickerIndex = reactive({
		relationshipIndex: 0,
		sexIndex: 0,
		idCodeIndex: 0

	})
	watch(() => travelDetail, (newVal, oldVal) => {
		relationships.value.forEach((n:any, i:number) => {
			if (n.value == travelDetail.relationship) {
				pickerIndex.relationshipIndex = i
			}
		});
		idCardList.forEach((n, i) => {
			if (n.value == travelDetail.idCode) {
				pickerIndex.idCodeIndex = i
			}
		});
		sexList.forEach((n, i) => {
			if (n.value == travelDetail.sex) {
				pickerIndex.sexIndex = i
			}
		});

	}, {
		deep: true
	})
	
	
	let relationshipState = computed(() => {
		let relationshipState = "";
		relationships.value.forEach((n:any) => {
			if (n.value == travelDetail.relationship) {
				relationshipState = n.name;

			}
		});
		return relationshipState;
	});
	const calculate = () =>{
		if(travelDetail.idCode!='01'){
			return;
		}
		if (!idReg.test(travelDetail.idNo)) {
			return;
		}
		
		const year = travelDetail.idNo.substr(6, 4);
	    const month = travelDetail.idNo.substr(10, 2);
		const day = travelDetail.idNo.substr(12, 2);
		const sex = parseInt(travelDetail.idNo.substr(-2, 1));
		if(sex % 2 == 0){
			travelDetail.sex = '2'
		}else{
			travelDetail.sex = '1'
		}
		travelDetail.birth = `${year}-${month}-${day}`
		
	}
	const chooseImg = () => {
		uni.chooseImage({
			count: 1, // 默认9 这里默认让用户只能选一张图片吧
			sizeType: ['original', 'compressed'], // 能够指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 能够指定来源是相冊还是相机，默认二者都有
			success: function (res) {
				var localIds = res.tempFilePaths; // 返回选定照片的本地ID列表，localId能够作为img标签的src属性显示图片
				wxuploadImage(localIds)
			}
		});
	}
	const birthFormat=(val:any)=>{
		return dayjs(val).format('YYYY-MM-DD')
	}
	const wxuploadImage = (localIds : string) => {
		uni.uploadFile({ //获取图片媒体ID
			url: config.baseUrlmall.replace('/guardian','') + '/memberapi/guestBase/recognizeIdcard',
			filePath: localIds.toString(), // 需要上传的图片的本地ID
			name: 'serviceId',
			header: {
				"Content-Type": "multipart/form-data"
			},
			// #ifdef MP-ALIPAY
			fileType: 'image',
			// #endif
			formData: {
				// code: res.code,
				hotelGroupCode: config.hotelGroupCode,
				hotelCode: config.hotelCode,
				appid: config.appid,
				componentAppid: config.componentAppid,
				filePath: localIds.toString()
			},
			success: function (res:any) { //获取成功
				if (res.statusCode == 200) {
					var opt = JSON.parse(res.data)
					if (opt.result == 1) {
						travelDetail.name = opt.retVal.data.face.data.name
						travelDetail.idNo = opt.retVal.data.face.data.idNumber
						if (opt.retVal.data.face.data.sex == '男') {
							travelDetail.sex = '1'
						} else {
							travelDetail.sex = '2'
						}
						travelDetail.idCode = '01'
						travelDetail.birth = dayjs(opt.retVal.data.face.data.birthDate.replace('年', '-').replace('月', '-').replace('日', '')).format('YYYY-MM-DD')
					} else {
						jAlert3(opt.msg)
						return false
					}
				} else {
					jAlert3(res.msg)
					return false
				}
			},
			fail: function (res) { //获取多媒体id失败 返回错误代码
				jAlert3("上传失败，msg：" + JSON.stringify(res));
			}
		})

	}
	const bindRelationshipChange = (e : any) => {
				
		const selectedIndex = e.detail.value;
		const newRelationship = relationships.value[selectedIndex].value;

		travelDetail.relationship = newRelationship;

	};
	const bindidCodeChange = (e : any) => {

		const selectedIndex = e.detail.value;
		const newSex = idCardList[selectedIndex].value;
		travelDetail.idCode = newSex;
		

	};
	// const IdentityCodeValidEasy = (code : any) => {
	// 	var city : any = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
	// 	var tip = "";
	// 	var pass = true;

	// 	if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
	// 		tip = "身份证号格式错误";
	// 		pass = false;
	// 	}

	// 	else if (!city[code.substr(0, 2)]) {
	// 		tip = "地址编码错误";
	// 		pass = false;
	// 	}
	// 	else {
	// 		//18位身份证需要验证最后一位校验位
	// 		if (code.length == 18) {
	// 			code = code.split('');
	// 			//∑(ai×Wi)(mod 11)
	// 			//加权因子
	// 			var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
	// 			//校验位
	// 			var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
	// 			var sum = 0;
	// 			var ai = 0;
	// 			var wi = 0;
	// 			for (var i = 0; i < 17; i++) {
	// 				ai = code[i];
	// 				wi = factor[i];
	// 				sum += ai * wi;
	// 			}
	// 			var last = parity[sum % 11];
	// 			if (parity[sum % 11] != code[17]) {
	// 				tip = "校验位错误";
	// 				pass = false;
	// 			}
	// 		}
	// 	}
	// 	return pass;
	// }
	const bindSexChange = (e : any) => {

		const selectedIndex = e.detail.value;
		const newSex = sexList[selectedIndex].value;
		travelDetail.sex = newSex;

	};
	const bindDateChange = (e : any) => {
		let newBirth = e.detail.value;
		travelDetail.birth = newBirth;

	};
	const checkGuest = (obj:any,cb:any) => {
			api.interfaceTransfer({
			query: {
				channel: 'WECHAT',
				hotelGroupCode: config.hotelGroupCode,
				hotelCode: config.hotelCode,
				memberId: user.memberId,
				guestIdNo:obj.extraIdno,
				openIdType: 'WECHAT',
				mobile:obj.mobile,
				email:obj.email
			},
			config: {
				"interfaceType": "GET",
				"interfaceModule": "GC_PRODUCT_JOURNEY",
				"interfaceMethod": "guest/v1/listGuestLinkExtraInfoWithMemberIdOrOpenId",
				"interfaceFrom": "member",
				"hotelGroupCode": config.hotelGroupCode
			}
		})
			.then((res : any) => {

				if (res.result == 1 && res.retVal.result == 0) {
					if(res.retVal.msg){
						if(res.retVal.retVal&&res.retVal.retVal.length&&res.retVal.retVal.length>0){
							jAlert3(res.retVal.msg)
						}else{
							cb&&cb()
							
						}
						
					}else{
						cb&&cb()
					}

				}
			});
	}
	const listGuestLinkExtraInfoWithMemberIdOrOpenId = () => {
		api.listGuestLinkExtraInfoWithMemberIdOrOpenId({
			channel: 'WECHAT',
			hotelGroupCode: config.hotelGroupCode,
			hotelCode: config.hotelCode,
			memberId: user.memberId,
			openIdType: 'WECHAT'

		}).then((res : any) => {
			if (res.result == 1) {
				if (res.retVal.result == 0) {
					let hasSelf = false
					if (res.retVal.retVal.length) {
						res.retVal.retVal.forEach((item : any) => {
							
							if(type.value == 'edit'){
								if (item.guestId == id.value) {
									travelDetail = Object.assign(travelDetail, item)
								}
							}
							if(item.relationship=='Self'){
								hasSelf = true
							}
							
							
						})
					}
					if(hasSelf&&travelDetail.relationship!='Self'){
						relationships.value= [
							{
								name: "父母",
								value: "Parent",
							},
							{
								name: "夫妻",
								value: "Spouse",
							},
							{
								name: "子女",
								value: "Child",
							},
							{
								name: "朋友",
								value: "Friend",
							},
							{
								name: "其他",
								value: "Other",
							}
						]
								
					}else{
						relationships.value = [
							{
								name: "本人",
								value: "Self",
							},
							{
								name: "父母",
								value: "Parent",
							},
							{
								name: "夫妻",
								value: "Spouse",
							},
							{
								name: "子女",
								value: "Child",
							},
							{
								name: "朋友",
								value: "Friend",
							},
							{
								name: "其他",
								value: "Other",
							}
						]
					}
				}

			}
		})
	}
	
	const deleteGuestLinkRelation = () => {
		api.deleteGuestLinkRelation({

			hotelGroupCode: config.hotelGroupCode,
			hotelCode: config.hotelCode,
			memberId: user.memberId,
			guestId: id.value

		}).then((res : any) => {
			if (res.retVal.result == 0) {
				jAlert3('删除成功')
				uni.navigateBack({
					delta: 1
				})
			} else {
				jAlert3(res.msg || res.retVal.msg)
			}
		})
	}
	const goTravelPreference = (id : string) => {
		var deltaNum = delta.value
		if(id){
			deltaNum = 2
		}
		if(travelDetail.relationship== 'Self'){
			uni.navigateTo({
				url: `/pagesA/member/travelPreference?type=member&guestId=${id}&mode=${type.value}&delta=${deltaNum}` 
			})
		}else{
			
			uni.navigateTo({
				url: `/pagesA/member/travelPreference?type=guest&guestId=${id}&mode=${type.value}&delta=${deltaNum}` 
			})
		}
		
	}
	const saveGuestBase = () => {
		let mobilereg = /^1\d{10}$/
		if (!travelDetail.relationship) {
			jAlert3("请选择与本人的关系");
			return false
		}
		if (!travelDetail.name) {
			jAlert3("请输入姓名");
			return false
		}
		if (!travelDetail.sex) {
			jAlert3("请选择性别");
			return false
		}
		if (!travelDetail.birth) {
			jAlert3("请选择出生日期");
			return false
		}
		if (travelDetail.idCode == '01'||travelDetail.idCode == '02') {
			if (!idReg.test(travelDetail.idNo)) {
				jAlert3("请输入正确的证件号");
				return false
			}
		} else if (travelDetail.idCode == '14') {
			if (!passportReg.test(travelDetail.idNo)) {
				jAlert3("请输入正确的证件号");
				return false
			}
		} else if (travelDetail.idCode == '16') {
			if (!taiwanPassportReg.test(travelDetail.idNo)) {
				jAlert3("请输入正确的证件号");
				return false
			}
		} else if (travelDetail.idCode == '21') {
			if (!HKandMacauPassportReg.test(travelDetail.idNo)) {
				jAlert3("请输入正确的证件号");
				return false
			}
		}
		
		if (!mobilereg.test(travelDetail.mobile)) {
			if(endDate.value){
				if(dayjs(endDate.value).diff(travelDetail.birth, 'year')>=18){
					jAlert3(`请输入正确的手机号码`)
					return false
				}
			}else if(dayjs().diff(travelDetail.birth, 'year')>=18){
				jAlert3(`请输入正确的手机号码`)
				return false
			}
			
		}
		var obj:any = {
			extraIdno: travelDetail.idNo,
			extraIdcode: travelDetail.idCode,
			linkMemberId: user.memberId,
			isHalt: "F",
			hotelGroupCode: config.hotelGroupCode,
			guestSrc: "WECHAT",
			channel: "WECHAT",
			guestId: ''
		}
		obj = Object.assign(travelDetail, obj)
		if (id.value) {
			obj.guestId = id.value
			api.updateGuestBase(obj).then((res : any) => {
				if (res.retVal.result == 0) {
					UmengSDK.sendEvent("tpp_compile_trip_people_clk", {
						page_name: "travel_detail_pg",
						relation: obj.relationship,
						page_id: "",
						is_added: "修改",
						trip_people_name: obj.name,
						certificate_type: obj.idCode,
						certificate_number: obj.idNo,
						gender: obj.sex,
						birthdate: obj.birth,
						mailbox: obj.email,

					});
					if(type.value=='edit'){
						jAlert3('修改成功')
						uni.navigateBack({
							delta: 1
						})
					}else{
						goTravelPreference(id.value)
					}
					
				} else {
					jAlert3(res.msg || res.retVal.msg)
				}
			})
		} else {
			checkGuest(obj,()=>{
				api.saveGuestBase(obj).then((res : any) => {
					if (res.retVal.result == 0) {
						id.value = res.retVal.retVal
						UmengSDK.sendEvent("tpp_compile_trip_people_clk", {
							page_name: "travel_detail_pg",
							relation: obj.relationship,
							page_id: "",
							is_added: "新增",
							trip_people_name: obj.name,
							certificate_type: obj.idCode,
							certificate_number: obj.idNo,
							gender: obj.sex,
							birthdate: obj.birth,
							mailbox: obj.email,
						
						});
						goTravelPreference(res.retVal.retVal)

					} else {
						jAlert3(res.msg || res.retVal.msg)
					}
				})
			})
			
		}

	}

	onLoad((options : any) => {
		if(options.delta){
			delta.value = options.delta
		}
		if(options.endDate){
			endDate.value = options.type
		}
		if (options.type) {
			type.value = options.type
		}
		if (options.id) {
			id.value = options.id
		}
	});
	onMounted(() => {
		listGuestLinkExtraInfoWithMemberIdOrOpenId()

	});
</script>

<style lang="less" scoped>
	@import url("~@/styles/skin.less");
	@import url("~@/styles/mixin.less");

	.travelersInfo_ui {
		.add-btn {
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 16px;
			font-size: 16px;
			border: 0.5px solid #000000;
			height: 48px;
			box-sizing: border-box;
			border-radius: 4px;

			.icon-a-20_shibieshenfenzheng {
				margin-top: 2px;
				font-size: 20px;
				margin-right: 4px;
			}
		}

		.form-infos {
			margin: 0 16px;

			.form-info {
				margin-top: 12px;
				background: #FFFFFF;
				border-radius: 8px;

				.tl {
					color: #000000;
					font-weight: bold;
					padding: 16px 12px;
					font-size: 14px;
					line-height: 1;
					border-bottom: 1px solid #f8f8f8;
				}

				.form-inline {
					margin-top: 1px;
					display: flex;
					padding: 0 12px;

					&.padding {
						padding-top: 16px;
						padding-bottom: 16px;

						.label {
							height: 40px;
						}
					}

					.label {
						display: flex;
						align-items: center;
						font-size: 14px;
						height: 46px;
						width: 88px;
					}

					.val {
						display: flex;
						align-items: center;
						flex: 1;
					
						picker {
							width: 100%;
						}

						.picker {
							width: 100%;
						}

						.picker-box {
							display: flex;
							align-items: center;
							font-size: 14px;

							justify-content: space-between;
							&.disabled{
								color: #808080;
								
							}
							.icon-a-16_youlajiantou_hei {
								color: #000;
							}

							.grey {
								color: #CCCCCC;
							}

						}

						.radio-box {
							width: 100%;
							display: flex;
							align-items: center;

							.radio-item {
								display: flex;
								align-items: center;
								justify-content: center;
								flex: 1;
								height: 40px;
								border-radius: 4px;
								border: 1px solid #ccc;
								font-size: 14px;

								margin-left: 12px;

								&:first-child {
									margin-left: 0;
								}

								&.invalid {
									color: #CCCCCC;
									border: 1px solid #ccc;
								}

								&.active {
									font-weight: bold;
									color: @active-color;
								}
							}
						}

						.input-text {
							height: 100%;
							width: 100%;
							font-size: 14px;
							color: #000;
							&.disabled{
								color: #808080;
								
							}
						}

						.text {
							display: flex;
							align-items: center;
							color: #000000;
							font-size: 14px;

							.price {
								color: @active-color;
							}
						}
					}

					.already-box {
						display: flex;
						align-items: center;
						width: 100%;
						padding-left: 16px;
						background: #F8F8F8;
						border-radius: 4px;
					}

					.check-in-infos {
						width: 100%;

						.check-in-info {
							position: relative;
							padding: 12px;
							box-sizing: border-box;
							margin-top: 8px;
							width: 100%;
							background: #F8F8F8;
							border-radius: 4px;

							.icon-a-16_guanbi_ciji {
								position: absolute;
								right: 12px;
								top: 12px;
								color: #808080;
								font-size: 12px;
							}

							&:first-child {
								margin-top: 0;
							}

							.name {

								font-size: 14px;
								line-height: 1;
							}

							.id-card {
								margin-top: 8px;
								font-size: 12px;
								line-height: 1;
								color: #808080;
							}
						}
					}

				}

				.add-btn {
					display: flex;
					align-items: center;
					justify-content: center;
					height: 52px;
					width: 100%;
					font-size: 14px;
					color: #000;
				}

				.tips {
					display: flex;
					align-items: center;
					padding: 8px 12px 16px;
					font-size: 12px;
					line-height: 12px;
					color: #808080;

					.icon-a-12_tishi {
						margin-right: 5px;
						font-size: 12px;
					}
				}
			}
		}

		.footer {
			padding: 32px 16px;

			.footer-btn {
				width: 100%;
				height: 48px;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			.del {
				margin-top: 27px;
				display: flex;
				justify-content: center;
				color: #000000;
				font-size: 14px;
				line-height: 14px;

				.icon-a-16_shanchulishijilu {
					margin-right: 6px;
				}
			}
		}
	}
</style>