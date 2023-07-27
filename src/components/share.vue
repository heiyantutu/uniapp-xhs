<template>
	<div class="ui_share">
		<div class="poster">

			<image class="poster-img" :src="path" mode="widthFix"></image>
			<l-painter isCanvasToTempFilePath @success="path = $event" hidden
				css="width: 375px;background:#fff;border-radius: 8px;">
				<l-painter-image :src="posterInfo.posterImage" css="width:375px;height:500px;object-fit: cover;" />
				<l-painter-view>
					<l-painter-text :text="posterInfo.title"
						css="padding-left: 32px; padding-right: 32px;margin-top:16px;font-size: 20px; fontWeight: bold;" />
				</l-painter-view>
				<l-painter-view css="background:#ccc;height:1px;margin:16px 16px 0 16px;">
				</l-painter-view>
				<l-painter-view>
					<l-painter-text :text="posterInfo.title"
						css="padding-left: 32px; padding-right: 32px;margin-top:16px;font-size: 20px; fontWeight: bold;" />
				</l-painter-view>
			</l-painter>
		</div>
		<!-- <view class="bottom-btns">
			<view class="control-btn-wrap">
				<view class="control-btn" @click="doDownloadImg">
					<view class="iconfont icon-a-24_baocuntupian"></view>
					<view class="btn-text">保存图片</view>
				</view>
				<button open-type="share" class="control-btn share-btn">
					<view class="share-btn-content">
						<span class="iconfont icon-a-24_fenxianglianjie"></span>
						<view class="btn-text">分享链接</view>
					</view>
				</button>
			</view>
			<view class="share-close-btn" @click="cancelDialog">
				取消
			</view>
		</view> -->

	</div>
</template>

<script lang="ts">
	import { getStorage } from "@/utils/wxuser";
	import { defineComponent, onMounted, reactive, ref } from "vue";
	import { jAlert3, jAlert5 } from "@/base/jAlert/jAlert";
	import api from "@/utils/api";
	export default defineComponent({
		name: "share",
		props: {
			posterInfo: {}
		},
		setup(props) {
			const path = ref('')
			const getWxacodeUnlimitUrl = () => {
				const config = getStorage('config')
				var opt = {
					hotelCode: config.hotelCode,
					hotelGroupCode: config.hotelGroupCode,
					scene:""
				}

				api.getWxacodeUnlimitUrl(opt).then((res : any) => {
					if (res.result == 1) {

					} else {
						jAlert3(res.msg)
					}
					uni.hideLoading();


				})
			}
			return {
				path
			}
			onMounted(() => {

			});

		},
	});
</script>

<style scoped lang="less">
	.ui_share {
		position: fixed;
		z-index: 99;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.76);
		line-height: 1;

		.poster-img {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			top: 10%;
			width: 68%;
		}

		.bottom-btns {

			position: fixed;
			bottom: 0;
			width: 100%;
			background: #fff;
			z-index: 2;
			border-radius: 16px 16px 0px 0px;
			overflow: hidden;

			.control-btn-wrap {
				display: flex;
				align-items: center;
				justify-content: space-between;
				box-sizing: border-box;
				background: #fff;
				padding: 16px 32px;



				.control-btn {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 50%;
					text-align: center;

					&.share-btn {
						background: #fff;
						display: inline-block;
						padding: 0;
						line-height: 1;
						border: 0;
						overflow: visible;


						&:after {
							display: none;
						}

						.share-btn-content {
							display: flex;

							flex-direction: column;
							align-items: center;
							position: relative;

						}

						.iconweixin1 {
							color: #50B674;
						}

						.btn-text {
							font-size: 14px;
							color: #808080;
							line-height: 1;
							padding-top: 8px;
						}
					}

					.iconfont {
						font-size: 24px;
						width: 48px;
						height: 48px;
						display: flex;
						align-items: center;
						justify-content: center;
						border: 1px solid #CCC;
						border-radius: 50%;
					}

					.iconweixin1 {
						color: #50B674;
					}

					.iconxiazai1 {
						color: #81B5EA;
					}

					.btn-text {
						font-size: 14px;
						color: #808080;
						line-height: 1;
						padding-top: 8px;
					}
				}
			}

			.share-close-btn {
				display: flex;
				text-align: center;
				width: 100%;
				height: 60px;
				align-items: center;
				justify-content: center;
				color: #273346;

				font-size: 16px;
				border-top: 10px solid #f8f8f8;

				&:active {
					background: #eee;
				}
			}
		}

	}
</style>