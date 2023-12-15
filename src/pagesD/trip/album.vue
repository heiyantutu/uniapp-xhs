<template>
	<div class="ui_album">
			<!-- #ifdef MP -->
			<coustom-head title="松赞相册" nativeMode=true>
		</coustom-head>
		<!-- #endif -->
		<div class="switchBox">
			<tabs :datas="switchList" type="line" color="#A43127" titleInactiveColor="#808080" titleActiveColor="#000000"
			  v-if="switchList.length > 1" fullWidth @clickTab="changeIndex">
			</tabs>
			
		</div>
		<div class="albums" v-if="activeIndex==0">
			<div class="reserve-time">
				保留时间：
				<div class="radio-group">
					<div class="radio-item" :class="{'active':retentionTime==0}" @click="changeRetentionTime(0)">
						<i class="iconfont icon-danxuan_weixuan"></i>
						<i class="iconfont icon-danxuan_yixuan"></i>
						永久保留
					</div>
					<div class="radio-item" :class="{'active':retentionTime==1}" @click="changeRetentionTime(1)">
						<i class="iconfont icon-danxuan_weixuan"></i>
						<i class="iconfont icon-danxuan_yixuan"></i>
						行程结束后7天
					</div>
				</div>
			</div>
			<div class="tips" v-if="retentionTime==1">行程结束7天到期后相册内容会永久删除</div>
			<div class="album-list">
				<img :src="item.photoUrl+'?imageView2/1/w/332/h/332&x-oss-process=image/resize,m_fill,w_332,h_332'"
					class="album-item" lazy-load=true mode="aspectFill" v-for="(item,index) in privatePics" :key="index"
					@click="previewImage(item.photoUrl,privatePics)">

			</div>
			<empty tips="暂无图片" v-if="privatePics.length == 0&&!isAjax"></empty>
		</div>
		<div class="activity-album" v-else>
			<div class="album-item" v-for="(item,index) in categoryPics" :key="index">
				<div class="title" @click="toAlbumDetail(item)">
					{{item.name}}<i class="iconfont icon-a-16_youlajiantou_hei"></i>
				</div>
				<div class="album-list">
					<img :src="pic.photoUrl+'?imageView2/1/w/332/h/332&x-oss-process=image/resize,m_fill,w_332,h_332'"
						class="album-item" lazy-load=true mode="aspectFill" v-for="(pic,i) in item.albumPhotos" :key="i"
						@click="previewImage(pic.photoUrl,item.albumPhotos)"  />

				</div>
			</div>
			<empty tips="暂无图片" v-if="categoryPics.length == 0&&!isAjax"></empty>

		</div>
		
	</div>
	<v-preview-image ref="previewImageBox" :isPrivate="activeIndex==0?true:false"  :urls="photos"></v-preview-image>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted,nextTick } from "vue";
	import UmengSDK from "@/utils/umengAdaptor.js";
	import api from "@/utils/api";
	import {
		onLoad
	} from "@dcloudio/uni-app"; 
	import { goPage } from "@/utils/utils";
	import switchBar from "@/components/switchBar.vue";
	import vPreviewImage from "@/pagesD/components/v-previewImage.vue";
	import empty from "@/components/empty.vue";
	import { getStorage } from "@/utils/wxuser";
	import { jAlert3 } from "@/base/jAlert/jAlert";
	import tabs from "@/components/tabs.vue";
	import coustomHead from "@/components/coustomHead.vue";
	let config = getStorage('config')
	let switchList : any = ref([
		{
			name: "个人相册",
			active: true,
			categoryId: "-1",
			id:0
		}

	]);
	let photos:any = ref("")
	let teamNo = ref("")
	let guestId = ref("")
	const previewImageBox = ref()
	const isAjax = ref(false)
	const retentionTime = ref(-1)
	const activeIndex = ref(0)
	const activeType = ref('')
	const privatePics = ref([])
	const categoryPics = ref([])
	const categoryId =  ref('')
	const toAlbumDetail = (item:any) => {
		UmengSDK.sendEvent("tcp_explore_more_clk", {
			page_name: switchList.value[activeIndex.value].name,
			button_name:switchList.value[activeIndex.value].name,
			button_id:activeType.value,
			title_name:switchList.value[activeIndex.value].name
		});
		let url = `/pagesD/trip/albumDetail?activeType=${activeType.value}&name=${item.name}&categoryId=${categoryId.value}&teamNo=${teamNo.value}`
		goPage(url)
	}
	const previewImage = (pic : string, pics : any) => {
		photos.value = []
		pics.forEach((item : any) => {
			photos.value.push(item.photoUrl)
		})
		UmengSDK.sendEvent("pp_photo_clk", {
			page_name: switchList.value[activeIndex.value].name,
			button_name:pic,
			button_id:pic,
			title_name:""
		});
		nextTick(()=>{
			previewImageBox.value.open(pic)
		})
		
		
		// uni.previewImage({
		// 	urls: photos,
		// 	current: pic,
		// 	complete:(e)=>{
		// 		console.log(1223)
		// 		console.log(e)
		// 	}
		// })
	}
	const listRootCategory = () => {

		api.interfaceTransfer({
			query: {
				"unitCode": config.hotelGroupCode,
				"teamNo":teamNo.value
			},
			config: {
				"interfaceType": "GET",
				"interfaceModule": "GC_UCBASE_URL",
				"interfaceMethod": "albumCategory/listRootCategory",
				"interfaceFrom": "GC",
				"hotelGroupCode": config.hotelGroupCode
			}
		})
			.then((res : any) => {
				if (res.result == 1 && res.retVal.result == 0) {
					switchList.value = switchList.value.concat(res.retVal.retVal)


				} else {
					jAlert3(res.result.msg || res.msg)
				}
			});
	}
	const photoByRemark = (categoryId : string) => {

		api.interfaceTransfer({
			query: {
				"unitCode": config.hotelGroupCode,
				"categoryId": categoryId,
				"teamNo":teamNo.value
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
				isAjax.value = false
				if (res.result == 1 && res.retVal.result == 0) {
					categoryPics.value = []
					categoryPics.value = res.retVal.retVal

				} else {
					jAlert3(res.result.msg || res.msg)
				}
			});
	}
	const listPrivate = () => {

		api.interfaceTransfer({
			query: {
				"teamNo": teamNo.value,
				"guestId": guestId.value
			},
			config: {
				"interfaceType": "GET",
				"interfaceModule": "GC_UCBASE_URL",
				"interfaceMethod": "albumPhoto/listPrivate",
				"interfaceFrom": "GC",
				"hotelGroupCode": config.hotelGroupCode
			}
		}).then((res : any) => {

			if (res.result == 1 && res.retVal.result == 0) {
				privatePics.value = res.retVal.retVal.albumPhotos
				res.retVal.retVal.saveTime=='FOREVER'?retentionTime.value=0:retentionTime.value=1
				
			} else {
				jAlert3(res.result.msg || res.msg)
			}
		})
	}

	const setSaveTime = (val : any) => {
		let saveTime = 'FOREVER'
		if (val == 1) {
			saveTime = 'SEVEN'
		}
		api.interfaceTransfer({
			query: {
				"teamNo": teamNo.value,
				"guestId": guestId.value,
				"saveTime": saveTime,
				"teamEndTime":getStorage('teamInfo').teamEndTime
			},
			config: {
				"interfaceType": "GET",
				"interfaceModule": "GC_UCBASE_URL",
				"interfaceMethod": "albumPhoto/setSaveTime",
				"interfaceFrom": "GC",
				"hotelGroupCode": config.hotelGroupCode
			}
		}).then((res : any) => {
			isAjax.value = false
			if (res.result == 1 && res.retVal.result == 0) {
				retentionTime.value = val
				jAlert3('设置成功')
				UmengSDK.sendEvent("pp_cut_retention_time", {
					cut_before:val==1?'永久':'7天',
					cut_after:val==1?'7天':'永久'
				},'OTHER');
			} else {
				jAlert3(res.result.msg || res.msg)
			}
		})
	}
	const changeRetentionTime = (val : any) => {
		if (val == retentionTime.value) {
			return;
		}
		if (isAjax.value) {
			return;
		}
		
		
		isAjax.value = true
		if (val == 1) {
			uni.showModal({
				title: '确认调整保留时间',
				content: '行程结束7天到期后相册内容会永久删除',
				cancelText: '返回',
				confirmText: '确认',
				confirmColor: '#000000',
				success: (res:any) => {
				
					if (res.confirm) {
						
						setSaveTime(val)
					}else{
							isAjax.value = false
					}
	
					
				}
			})
		} else {
			setSaveTime(val)
		}


	}
	const changeIndex = (k:any,val : any) => {
		switchList.value.forEach((item : any) => {
			item.active = false
		})
		switchList.value[val].active = true
		activeIndex.value = val
		categoryId.value = switchList.value[val].categoryId
		if(switchList.value[val].name=='酒店相册'){
			activeType.value = 'hotel'
		}
		if(switchList.value[val].name=='活动相册'){
			activeType.value = 'activity'
		}
		
		UmengSDK.sendPV({
			page_id:"",
			page_name: "photo_pg",
			top_type_name:switchList.value[val].name
		});
		if (val != 0) {
			photoByRemark(switchList.value[val].categoryId)
		}

	}
	onMounted(() => {
		UmengSDK.sendPV({
			page_id:"",
			page_name: "photo_pg",
			top_type_name:'个人相册'
		});
		listRootCategory()
		listPrivate()
	});
	onLoad((options : any) => {
		teamNo.value = options.teamNo
		guestId.value = options.guestId
	})
</script>

<style lang="less" scoped>
	.ui_album {
		::-webkit-scrollbar {
			display: none;
			width: 0;
			height: 0;
			color: transparent;
		}

		padding-bottom: 30px;
		padding-bottom: calc(30px + constant(safe-area-inset-bottom));
		padding-bottom: calc(30px + env(safe-area-inset-bottom));

		.albums {
			.reserve-time {
				margin-top: 24px;
				padding: 0 16px;
				font-size: 14px;
				display: flex;
				justify-content: space-between;

				.radio-group {
					display: flex;

					.radio-item {
						margin-left: 24px;
						align-items: center;
						display: flex;
						font-size: 14px;

						.icon-danxuan_yixuan {
							display: none;
						}

						&.active {
							.icon-danxuan_yixuan {
								display: block;
							}

							.icon-danxuan_weixuan {
								display: none;
							}

						}

						.iconfont {
							font-size: 16px;
							margin-right: 2px;
						}

						.icon-danxuan_weixuan {
							color: #ccc;

						}

						.icon-danxuan_yixuan {
							color: #A43127;
						}
					}
				}
			}

			.tips {
				padding: 12px 16px 0;
				color: #808080;
				font-size: 12px;
			}

			.album-list {

				display: flex;
			
				flex-wrap: wrap;
				padding: 12px 16px 0;
				justify-content: space-between;

				.album-item {
					margin-top: 12px;
					width: 44.3vw;
					height: 44.3vw;
					border-radius: 8px;
				}
			}

		}

		.activity-album {
			line-height: 1;

			.title {
				margin-top: 24px;
				display: flex;
				padding: 0 16px;
				justify-content: space-between;
				align-items: center;
				font-size: 16px;
				font-weight: bold;

				.icon-a-16_youlajiantou_hei {
					font-weight: normal;
				}
			}

			.album-list {
				white-space: nowrap;
				overflow-x: auto;
				padding: 0 16px;
				overflow-y: hidden;

				.album-item {
					margin-top: 16px;
					width: 109px;
					height: 109px;
					border-radius: 4px;
					margin-left: 8px;

					&:first-child {
						margin-left: 0;
					}
				}
			}

		}
	}
</style>