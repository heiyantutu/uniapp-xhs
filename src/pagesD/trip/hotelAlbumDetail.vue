<template>
	<div class="ui_hotelAlbumDetail">
		<!-- #ifdef MP -->
			<coustom-head title="松赞相册" nativeMode=true>
		</coustom-head>
		<!-- #endif -->

		<div class="moreText" v-if="descript">
			<more-text :content="descript"></more-text>
		</div>
		<div class="img-list">
			<div class="img-item" v-for="(item,index) in categoryPics" :key="index"
				@click="previewImage(item.photoUrl,categoryPics)">
				<img :src="item.photoUrl+'?imageView2/1/w/442/h/442&x-oss-process=image/resize,m_fill,w_442,h_442'" mode="aspectFill" lazy-load=true class="album-item">
			</div>

		</div>
		<empty tips="暂无图片" v-if="categoryPics.length == 0&&!isAjax"></empty>
	</div>
	<v-preview-image ref="previewImageBox"  :urls="photos"></v-preview-image>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted,nextTick } from "vue";
	import api from "@/utils/api";
	import moreText from "@/components/moreText.vue";
	import empty from "@/components/empty.vue";
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
	let isAjax = ref(true)
	let previewImageBox = ref()
	const previewImage = (pic : string, pics : any) => {
		photos.value = []
		pics.forEach((item : any) => {
			photos.value.push(item.photoUrl)
		})

		uni.previewImage({
			urls: photos,
			current: pic
		})
		nextTick(()=>{
			previewImageBox.value.open(pic)
		})
	}
	const photoByRemark = () => {
		api.interfaceTransfer({
			query: {
				"unitCode": config.hotelGroupCode,
				"categoryName": name.value
			},
			config: {
				"interfaceType": "GET",
				"interfaceModule": "GC_UCBASE_URL",
				"interfaceMethod": "albumCategory/photoByName",
				"interfaceFrom": "GC",
				"hotelGroupCode": config.hotelGroupCode
			}
		})
			.then((res : any) => {
				if (res.result == 1 && res.retVal.result == 0) {
					isAjax.value = false
					categoryPics.value = res.retVal.retVal
					


				} else {

					jAlert3(res.result.msg || res.msg)
				}
			});
	}


	onLoad((options : any) => {
		name.value = decodeURIComponent(options.name)
		activeType.value = options.activeType
		categoryId.value = options.categoryId
	})
	onMounted(() => {

		photoByRemark()
	});
</script>

<style lang="less" scoped>
	.ui_hotelAlbumDetail {
		padding-bottom: 30px;



		.img-list {
			padding: 4.27vw;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;

			.img-item {
				margin-top: 12px;

				display: flex;


			}

			.album-item {
				border-radius: 8px;
				width: 44.27vw;
				height: 44.27vw;

			}
		}
	}
</style>