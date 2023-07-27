<template>
	<swiper class="swiper" :indicator-dots="swiperConfig.indicatorDots" :circular="swiperConfig.circular" :autoplay="swiperConfig.autoplay"
		:interval="3000" @change="swiperChange">
		
		<swiper-item v-for="(item,index) in slides" :key="index">
			<slot name="item" :item="item" v-if="swiperConfig.slot"></slot>
			<div class="slider-item" v-else @click="toPage(item.link)">
				<div class="info" v-if="item.title||item.subTitle">
					<div class="title" v-if="item.title">
						{{item.title}}
					</div>
					<div class="subTitle"  v-if="item.subTitle">
						{{item.subTitle}}<i class="iconfont icon-a-12_youlajiantou_hei"></i>
					</div>
				</div>
				
				<img class="slider-img" :src="item.imgUrl" mode="aspectFill">
			</div>
		</swiper-item>
		
	</swiper>
	<div class="swiper-dots" :style="swiperDotsStyle">
		<div class="swiper-dot" :style="swiperDotStyle"></div>
	</div>
</template>

<script lang="ts">
import { goPage } from "@/utils/utils";
import { ref, computed, defineComponent } from "vue";

	export default defineComponent({
		name: "switchBar",
		props: {
			slides: {
				type: Array,
				default: () => {
					return [];
				},
			},
			swiperConfig: {
				type: Object,
				default: () => {
					return {
						indicatorDots: false,
						autoplay: true,//是否自动播放
						slot:false,//插槽模式
						dotPosStyle:'',
						dotStyle:'',
						circular:true
					}

				}
			},
		},
		setup(props) {
			let swiperCurrent = ref(0);
			const swiperChange = (e : any) => {
				swiperCurrent.value = e.target.current

			};
			const toPage = (url : any) => {
				if (!url) {
					return;
				}
				goPage(url)
				
			}
			const swiperDotsStyle = computed(() => {
				var dotPosStyle = `width:${12 * props.slides.length}px;`
				if (props.swiperConfig.dotPosStyle) {
					dotPosStyle += props.swiperConfig.dotPosStyle;
				}
				return dotPosStyle
			})
			const swiperDotStyle = computed(() => {
				var style = `left:${12 * swiperCurrent.value}px;`
				if(props.swiperConfig.dotStyle){
					style += props.swiperConfig.dotStyle
				}
				return style
			})
			return {
				swiperCurrent,
				toPage,
				swiperChange,
				swiperDotStyle,
				swiperDotsStyle
			}

		},
	});
</script>

<style lang="less" scoped>
	.swiper {
			width: 100%;
			height: 100%;
			.slider-item{
				width: 100%;
				height: 100%;
				position: relative;
				.info{
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					background: rgba(0, 0, 0, 0.12);
					padding: 24px 12px 0;
					color: #fff;
				}
				.title{
					font-family: Source Han Serif CN;
					font-weight: 900;
					font-size: 18px;
					line-height: 1;
				}
				.subTitle{
					margin-top: 8px;
					font-size: 14px;
					line-height: 1;
					.iconfont{
						color: #fff;
						font-size: 12px;
						line-height: 14px;
						vertical-align: top;
						display: inline-block;
						
					}
				}
				.slider-img {
					width: 100%;
					height: 100%;
				}
			}
			
	
	
		}
	
		.swiper-dots {
			position: absolute;
			display: flex;
			bottom: 80px;
			left: 16px;
			background: rgba(255, 255, 255, 0.28);
			height: 2px;
			box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.28);
			border-radius: 4px;
			z-index: 9;
			overflow: hidden;
	
			.swiper-dot {
				width: 12px;
				height: 2px;
				top: 0;
				border-radius: 4px;
				position: absolute;
				transition: 0.3s all;
				background: #fff;
	
			}
		}
</style>