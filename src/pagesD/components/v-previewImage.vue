<template>
	<view class="previewImage_ui" v-if="show">
		<view class="previewImage"  @tap="close">
			<div class="page-box" v-bind:style="{height:navHeight + 'px',top:menuTop+'px'}">
				<i class="icon-a-20_guanbi iconfont" @tap="close"></i>
				<view class="page" v-if="urls.length > 0">
					<text class="text">{{ current + 1 }} / {{ urls.length }}</text>
				</view>
			</div>
			<swiper class="swiper" :current="current" @change="swiperChange"  @touchstart="handleTouchStart" @touchend="handleTouchEnd">
				<swiper-item v-for="(item, index) in urls" :key="index">
					<movable-area class="movable-area" scale-area>
						<movable-view class="movable-view" direction="all" :inertia="true" damping="100" scale="true" scale-min="1" scale-max="4" :scale-value="scale">
							<scroll-view scroll-y="true" class="uni-scroll-view">
								<view class="scroll-view"><image :key="index" class="image" :src="item" mode="widthFix" @longpress="onLongpress(item)" /></view>
							</scroll-view>
						</movable-view>
					</movable-area>
				</swiper-item>
			</swiper>
		</view>
		<v-download :isPrivate="isPrivate" :fileUrl="urls[current]" :current="current" fileType="1" class="download"></v-download>
	</view>
	
</template>

<script>
import vDownload from "@/pagesD/components/ss-download.vue";
export default {
	
	props: {
		urls: {
			type: Array,
			required: true,
			default: () => {
				return [];
			}
		},
		isPrivate:{
			type: Boolean,
			default: () => {
				return false;
			}
		}
	},
	data() {
		return {
			show: false,
			current: 0, //当前页
			scale: 1,
			isZooming: false, // 是否处于缩放状态
			navHeight:32,
			menuTop:0
		};
	},
	methods: {
		//打开
		open(current) {
			 uni.setNavigationBarColor({
				frontColor: "#ffffff",
				backgroundColor: "#000000",
			});
			this.current = this.urls.findIndex(item => item === current);
			this.show = true;
			this.$emit('open');
		},
		//关闭
		close() {
			
			if (!this.isZooming) {
				this.show = false;
				this.current = 0;
				uni.setNavigationBarColor({
					frontColor: "#000000",
					backgroundColor: "#ffffff",
				});
				this.$emit('close');
				
			}
		},
		//图片改变
		swiperChange(e) {
			this.current = e.detail.current;
		},
		//监听长按
		onLongpress(e) {
			this.$emit('onLongpress', e);
		},
		handleTouchStart() {
			this.isZooming = true;
		},
		handleTouchEnd() {
			this.isZooming = false;
		}
	},
	mounted(){
		if(uni.getMenuButtonBoundingClientRect){
			let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			this.menuTop = menuButtonInfo.top
			this.navHeight = menuButtonInfo.height
		}
		
      
	},
	components:{
		vDownload
	}
};
</script>

<style lang="less" scoped>
.previewImage {
	z-index: 9999;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #000000;
	.page-box{
		position: absolute;
		z-index: 9;
		width: 100%;
		display: flex;
		align-items: center;
		position: relative;
		.icon-a-20_guanbi{
			position: absolute;
			color: #fff;
			left: 16px;
			
		}
		.text {
			font-size: 18px;
			font-style: normal;
			font-weight: 600;
		}
	}
	.swiper {
		width: 100%;
		height: 100vh;
		swiper-item {
			.movable-area {
				height: 100%;
				width: 100%;
				.movable-view {
					width: 100%;
					min-height: 100%;
					.scroll-view {
						display: flex;
						align-items: center;
						justify-content: center;
						height: 100vh;
						.image {
							width: 100%;
							height: auto;
						}
					}
				}
			}
		}
	}
	.page {
		position: absolute;
		z-index: 9999;
		width: 100%;
		
		text-align: center;
		.text {
			color: #fff;
			font-size: 32rpx;
			background-color: rgba(0, 0, 0, 0.5);
			padding: 3rpx 16rpx;
			border-radius: 20rpx;
			user-select: none;
		}
	}
	.downLoad{
		position: fixed;
		bottom: 32px;
		right: 16px;
		background: #fff;
		.downLoad-img{
			height: 40px;
			width: 40px;
		}
	}
}
</style>
