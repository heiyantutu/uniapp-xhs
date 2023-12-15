<template>
	<div class="ui_houseKeep">
		<div class="coustom-head">
			<coustom-head color="#fff">
				<template v-slot:title>
					<div class="head">
						<div class="head-item active">管家形象</div>
						<!-- <div class="head-item">管家视频</div>
						<div class="head-item">照片集</div> -->
					</div>
				</template>
			</coustom-head>
		</div>

		<div class="swiper-box" v-if="slides.length>0">
			<swiper-box :slides="slides" :swiperConfig="swiperConfig"></swiper-box>
			<div class="houseKeep-info">
				<div class="name">
					{{resume.name}}
				</div>
				<div class="levelDesc"><img class="levelIcon" :src="resume.levelIcon" v-if="resume.levelIcon">{{resume.levelDesc}}</div>
			</div>
			<div class="iconfont icon-a-20_dianhua" @click="makePhoneCall(resume.mobile)"></div>
		</div>
		<div class="about-me">
			<div class="title">关于我</div>
			<div class="about-item">民族：
				<div class="about-val">
					{{resume.nation}}
				</div>
			</div>
			<div class="about-item">特长：
				<div class="about-val">
					{{resume.speciality}}
				</div>
			</div>
			<div class="about-item" v-if="resume.biographicalNotes">
				<more-text :content="resume.biographicalNotes"></more-text>
			</div>
		</div>
		<div class="comment">
			<div class="title">客户评价</div>
			<div class="comment-list">
				<div class="comment-item" v-for="(item,index) in commentList" :key="index">
					<div class="user-info">
						<img :src="item.headImg"
							class="head-img">
						{{item.memberLevelDesc}}
					</div>
					<div class="moreText">
						<more-text :content="item.commentContent"></more-text>
					</div>
				</div>

			</div>

		</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted } from "vue";
	import UmengSDK from "@/utils/umengAdaptor.js";
	import api from "@/utils/api";
	import { jAlert3 } from "@/base/jAlert/jAlert";
	import coustomHead from "@/components/coustomHead.vue"
	import swiperBox from "@/components/swiperBox.vue"
	import moreText from "@/components/moreText.vue"
	import { getUrlParams } from '@/utils/utils';
	import { onLoad } from "@dcloudio/uni-app";
	import getMemberUI from "@/utils/getMemberUI";
	import {
		getStorage
	} from '@/utils/wxuser'

	let config = getStorage("config");
	let code = ref("")
	let resume : any = ref({})
	let swiperConfig = reactive({
		indicatorDots: false,
		autoplay: false,
		dotPosStyle: "left: 50%;transform: translateX(-50%);bottom:12px;"
	});
	let commentList = ref([])
	let slides : any = reactive([]);
	const makePhoneCall = (phone : string) => {
		uni.makePhoneCall({
			phoneNumber: phone

		});
	}
	const listByOrderNo = () => {
		api.interfaceTransfer({
			query: {
				"code": code.value,
				"unitCode": config.hotelGroupCode
			},
			config: {
				"interfaceType": "GET",
				"interfaceModule": "GC_PRODUCT_CBD",
				"interfaceMethod": `api/driverButler/queryResume`,
				"interfaceFrom": "GC",
				"hotelGroupCode": config.hotelGroupCode
			}
		})
			.then((res : any) => {

				if (res.result == 1 && res.retVal.result == 0) {
					resume.value = res.retVal.retVal
					commentList.value = resume.value.commentList
					commentList.value.forEach((item:any)=>{
						item.headImg = getMemberUI(item.memberLevel).defaultHeadImg
					})
					let pic = {
						imgUrl: resume.value.mainPic
					}
					slides.push(pic)
					UmengSDK.sendPV({
						page_id: "",
						page_name: "team_member_pg",
						team_member_name: resume.value.name,
						team_member_nation: resume.value.nation,
						team_member_specialty: resume.value.speciality,
						team_member_level: resume.value.levelDesc
					});
				} else {
					jAlert3(res.retVal.msg || res.msg)
				}
			})
	}

	onLoad((options : any) => {
		if (options.code) {
			code.value = options.code
		}
		if (options.scene) {
			let params = getUrlParams(decodeURIComponent(decodeURIComponent(options.scene)))
			if (params.code) {
				code.value = params.code
			}

		}
	});
	onMounted(() => {
		listByOrderNo()
	});
</script>

<style lang="less" scoped>
	.ui_houseKeep {
		background: #fff;
		padding-bottom: 30px;
		line-height: 1;

		.coustom-head {
			position: relative;
			z-index: 5;
		}

		.head {
			padding-left: 20px;
			display: flex;
			align-items: center;

			font-size: 14px;

			.head-item {
				position: relative;
				margin-left: 12px;
				opacity: 0.6;
				color: #fff;

				&::after {
					content: '';
					position: absolute;
					right: -6px;
					top: 0;
					width: 1px;
					height: 100%;
					background: #fff;
				}

				&:last-child {
					&::after {
						display: none;
					}
				}

				&.active {
					opacity: 1;
					font-weight: bold;

					&::after {
						opacity: 0.6;
					}

				}
			}


		}

		.swiper-box {
			position: relative;
			height: 133vw;

			.houseKeep-info {
				display: flex;
				flex-direction: column;
				height: 40px;
				justify-content: center;
				position: absolute;
				left: 24px;
				bottom: 38px;

				.name {
					font-family: PingFang SC;
					font-size: 20px;
					font-style: normal;
					font-weight: bold;
					color: #fff;
				}

				.levelDesc {
					display: flex;
					align-items: center;
					margin-top: 8px;
					border-radius: 24px;
					background: rgba(219, 137, 0, 0.60);
					font-size: 12px;
					color: #fff;
					padding: 0 8px;
					min-height: 24px;
					width: fit-content;

					.levelIcon {
						width: 15px;
						height: 15px;
						margin-right: 4px;
					}
				}

			}

			.icon-a-20_dianhua {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 40px;
				height: 40px;
				background: #fff;
				border-radius: 50%;
				position: absolute;
				right: 24px;
				bottom: 38px;
				font-size: 20px;

			}
		}

		.title {
			font-size: 18px;
			font-weight: bold;
		}

		.about-me {
			padding: 24px 16px 0;


			.about-item {
				margin-top: 13px;
				display: flex;
				font-size: 14px;
				color: #808080;
				line-height: 20px;

				.about-val {
					flex: 1;
					line-height: 20px;
					color: #000000;
				}
			}
		}

		.comment {
			padding: 32px 16px 0;

			.comment-list {
				.comment-item {
					margin-top: 12px;
					padding: 16px 12px;
					background: #F8F8F8;
					border-radius: 8px;

					&:first-child {
						margin-top: 24px;
					}

					.user-info {
						display: flex;
						align-items: center;
						font-size: 14px;

						.head-img {
							width: 20px;
							height: 20px;
							margin-right: 6px;
						}
					}

					.moreText {
						margin-top: 12px;
					}
				}
			}
		}
	}
</style>