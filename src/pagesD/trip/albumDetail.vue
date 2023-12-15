<template>
	<div class="ui_albumDetail">
		<!-- #ifdef MP -->
		<coustom-head title="松赞相册" nativeMode=true>
		</coustom-head>
		<!-- #endif -->
		<div class="title">
			{{name}}
		</div>
		<div class="moreText" v-if="descript">
			<more-text :content="descript"></more-text>
		</div>


		<div class="img-list">
			<div class="img-item" v-for="(item,index) in categoryPics" :key="index" @click="previewImage(item.photoUrl,categoryPics)">
				<img :src="item.photoUrl+'?imageView2/1/w/332/h/290&x-oss-process=image/resize,m_fill,w_333,h_290'" lazy-load=true mode="aspectFill"
					class="album-item" >
			</div>
			
			
		</div>
	</div>
	<v-preview-image ref="previewImageBox"  :urls="photos"></v-preview-image>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted,nextTick } from "vue";
	import api from "@/utils/api";
	import moreText from "@/components/moreText.vue";
	import { onLoad } from "@dcloudio/uni-app";
	import { getStorage } from "@/utils/wxuser";
	import { jAlert3 } from "@/base/jAlert/jAlert";
	import vPreviewImage from "@/pagesD/components/v-previewImage.vue";
	import coustomHead from "@/components/coustomHead.vue";
	let config = getStorage('config')
	let name = ref('')
	let activeType = ref('')
	let categoryId = ref('')
	let categoryPics = ref([])
	let descript = ref('')
	let photos:any = ref([])
	let teamNo:any = ref("")
	const previewImageBox = ref()
	const photoByRemark = () => {

		api.interfaceTransfer({
			query: {
				"unitCode": config.hotelGroupCode,
				"categoryId": categoryId.value,
				"teamNo": teamNo.value
			},
			config: {
				"interfaceType": "GET",
				"interfaceModule": "GC_UCBASE_URL",
				"interfaceMethod": "albumCategory/photoByRemark",
				"interfaceFrom": "GC",
				"hotelGroupCode": config.hotelGroupCode
			}
		})
			.then((res : any) => {

				if (res.result == 1 && res.retVal.result == 0) {
					res.retVal.retVal.forEach((item:any)=>{
						if(item.name == name.value){
							categoryPics.value = item.albumPhotos
						}
					})
					

				} else {

					jAlert3(res.result.msg || res.msg)
				}
			});
	}
	const previewImage = (pic : string, pics : any) => {
		photos.value = []
		pics.forEach((item : any) => {
			photos.value.push(item.photoUrl)
		})
		nextTick(()=>{
			previewImageBox.value.open(pic)
		})
	}
	const getOneActivityIntroduce = () => {
		api.interfaceTransfer({
			query: {
				"unitCode": config.hotelGroupCode,
				"activityName": name.value
			},
			config: {
				"interfaceType": "GET",
				"interfaceModule": "GC_ACTIVITIES_CENTER",
				"interfaceMethod": "api/activity/getOneActivityIntroduce",
				"interfaceFrom": "GC",
				"hotelGroupCode": config.hotelGroupCode
			}
		})
			.then((res : any) => {
		
				if (res.result == 1 && res.retVal.result == 0) {
					descript.value = res.retVal.retVal.introduce
		
				} else {
		
					jAlert3(res.result.msg || res.msg)
				}
			});
	}
	const getHotelList = () => {
	
		var findHotelParameter = {
			fromDate: "",
			toDate: "",
			otaChannel: "WECHAT",
			hotelGroupCodes: config.hotelGroupCode,
			cardLevel: "",
			hasPriceMin: "T",
			clientLatitude: "",
			clientLongitude: "",
			position: "",
			positionValue: "",
			keyWord: "",
			radius: "",
			pageSize: 999,
			firstResult: 0,
			cardType: "",
			appid: config.appid,
			componentAppid: config.componentAppid,
			memberNo: ""
		};
	
	
		api
			.findHotel(findHotelParameter)
			.then( (response : any)=> {
				if (response.result == 1) {
					response.retVal.resultInfos.forEach((n : any, i) => {
						if (n.descript == name.value) {
											
							descript.value = n.htmlInfo
						}
					})
	
				}
			})
			.catch(function (error : any) {
	
				console.log(error);
			});
	}
	onLoad((options : any) => {
		name.value = decodeURIComponent(options.name)
		activeType.value = options.activeType
		categoryId.value = options.categoryId
		teamNo.value = options.teamNo
	})
	onMounted(() => {
		  
		if(activeType.value=='hotel'){
			getHotelList()
		}else{
			getOneActivityIntroduce()
		}
		photoByRemark()
	});
</script>

<style lang="less" scoped>
	.ui_albumDetail {
		padding-bottom: 30px;
		padding-bottom: calc(30px + constant(safe-area-inset-bottom));
		padding-bottom: calc(30px + env(safe-area-inset-bottom));

		.title {
			padding: 0 16px;
			margin-top: 16px;
			font-size: 20px;
			line-height: 20px;
			color: #000000;
			font-weight: bold;
		}

		.moreText {
			padding: 0 16px;
			margin-top: 24px;
		}

		.img-list {
			padding: 16px;
			display: flex;
			flex-wrap: wrap;

			.img-item {
				margin-top: 8px;
				width: 33.3%;
				display: flex;

				&:nth-child(3n-1) {
					justify-content: center;
				}

				&:nth-child(3n) {
					justify-content: flex-end;
				}
			}

			.album-item {
				width: 29vw;
				height: 21.9vw;

			}
		}
	}
</style>