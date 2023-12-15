<template>
	<div class="ui_share">
		<div class="poster">

			<image class="poster-img" :src="posterImg" mode="widthFix"></image>
			<l-painter isCanvasToTempFilePath @success="getPoster($event)" hidden
				css="width: 375px;height:812px;background:#fff;border-radius: 8px;padding-bottom:24px;" ref="painter">
				<l-painter-image :src="posterInfo.posterImage" css="width:375px;height:562px;object-fit: cover; border-radius: 8px 8px 0 0;"  v-if="posterInfo.posterImage"/>
				<l-painter-view css="width:375px;height:562px;" v-else>
				</l-painter-view>
				<l-painter-view css="margin-left:24px;margin-top:16px;">
					<l-painter-text v-if="posterInfo.categorySub=='FreeTravel'" :text="posterInfo.categorySubDesc"
						css="background: rgba(51, 103, 53, 0.90);padding: 4px;color:#fff;font-size:12px;border-radius:4px;" />
					<l-painter-text v-else-if="posterInfo.categorySub=='ThemeGroup'" :text="posterInfo.categorySubDesc"
						css="background: rgba(0, 67, 85, 0.90);padding: 4px;color:#fff;font-size:12px;border-radius:4px;" />
					<l-painter-text v-else-if="posterInfo.categorySub=='DestPackage'" :text="posterInfo.categorySubDesc"
						css="background: rgba(219, 137, 0, 0.90);padding: 4px;color:#fff;font-size:12px;border-radius:4px;" />
					<l-painter-text v-else-if="posterInfo.categorySub=='ButlerCustomized'" :text="posterInfo.categorySubDesc"
						css="background: rgba(0, 0, 0, 0.9);padding: 4px;color:#FFDF8C;font-size:12px;border-radius:4px;" />
					<l-painter-text v-else :text="posterInfo.categorySubDesc"
						css="background: rgba(219, 137, 0, 0.90);padding: 4px;color:#fff;font-size:12px;border-radius:4px;" />
				</l-painter-view>
				<l-painter-view css="margin-left: 24px; margin-right: 24px;margin-top:12px;">
					<l-painter-text :text="posterInfo.title"
						css="font-size: 18px; fontWeight: bold;line-clamp:2;line-height:28px;color:#000;" />
				</l-painter-view>

				<l-painter-view css="margin-left: 24px; margin-right: 24px;margin-top: 6px;">
					<l-painter-text :text="posterInfo.sketch" css="line-clamp:1;line-height:18px;color:#000;font-size:12px;" />
				</l-painter-view>
				<l-painter-view css="margin-left: 24px; margin-right: 24px;margin-top: 4px;">
					<l-painter-text :text="posterInfo.datas" css="line-height:18px;color:#808080;font-size:12px;line-clamp:1" />
				</l-painter-view>
				
				<l-painter-view css="position:absolute;left:100px;bottom:49px;">
					<l-painter-view >
					<l-painter-text :text="posterInfo.price"
						css="color:#000;font-size:18px;font-family: Montserrat;font-size: 18px;font-weight: 600;line-height: 18px;" />
					<l-painter-text text="/人起" css="line-height:12px;color:#808080;font-size:12px;margin-top: 4px;"
						v-if="posterInfo.priceModel=='PEOPLE'" />
					<l-painter-text text="/套起" css="line-height:12px;color:#808080;font-size:12px;margin-top: 4px;"
						v-else-if="posterInfo.priceModel=='PACKAGE'" />
					<l-painter-text text="/起" css="line-height:12px;color:#808080;font-size:12px;margin-top: 4px;"
						v-else />
						
					</l-painter-view>
					<l-painter-text :text="posterInfo.time" css="line-height:12px;color:#ccc;font-size:12px;margin-top:8px;" />
				</l-painter-view>
				<l-painter-view css="position:absolute;left:24px;bottom:36px;" v-if="posterInfo.qrCode">
					<l-painter-image :src="posterInfo.qrCode" css="width:64px;height:64px;" />
				</l-painter-view>
			</l-painter>
		</div>
		<view class="bottom-btns">
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
		</view>

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
			posterInfo: {
				type: Object,
				default: () => {
					return {};
				},
			},
		},
		setup(props, context) {
			let posterImg = ref('')
			let painter = ref()
			const getPoster = (e : any) => {
				posterImg.value = e
			}
			const doDownloadImg = () => {
				uni.showLoading({
					title: '图片保存中...'
				});
				painter.value.canvasToTempFilePathSync({
					fileType: "jpg",
					// 如果返回的是base64是无法使用 saveImageToPhotosAlbum，需要设置 pathType为url
					pathType: 'url',
					quality: 1,
					success: (res : any) => {
						console.log(res.tempFilePath);
						// 非H5 保存到相册
						// H5 提示用户长按图另存
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function () {
								uni.hideLoading();
								uni.showModal({
									title: '保存成功',
									showCancel: false,
									content: '图片已保存到手机相册'

								});
							},
							fail: function () {
								uni.hideLoading();
								uni.getSetting({
									success(res) {
										if (!res.authSetting['scope.writePhotosAlbum']) {
											uni.showToast({
												icon: 'none',
												title: '保存图片失败，请到设置中打开权限后重试'
											});
										}
								
									}
								});
								
							},
							complete: function () {
								
							}
						});
					},
				});
			}
			const cancelDialog = () => {
				// #ifdef MP-WEIXIN
				// @ts-ignore
				 wx.setPageStyle({
					style: {
					overflow: "",
					},
				});
				// #endif
				context.emit("close");
			}

			onMounted(() => {
				// #ifdef MP-WEIXIN
				// @ts-ignore 
				wx.setPageStyle({
					style: {
					overflow: "hidden",
					},
				});
				// #endif
			});
			return {
				posterImg,
				doDownloadImg,
				cancelDialog,
				getPoster,
				painter
			}


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

		.poster {
			overflow-y: auto;
			width: 100%;
			height: 100vh;
			padding-bottom: 200px;
		}

		.poster-img {
			// position: absolute;
			// left: 50%;
			// transform: translateX(-50%);
			// top: 10%;

			display: block;
			width: 68%;
			margin: 10% auto 0;
		}

		.bottom-btns {

			position: fixed;
			bottom: 0;
			width: 100%;
			background: #fff;
			z-index: 2;
			border-radius: 16px 16px 0px 0px;
			overflow: hidden;
			padding-bottom: constant(safe-area-inset-bottom);
  			padding-bottom: env(safe-area-inset-bottom);

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
							font-size: 12px;
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
						font-size: 12px;
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