<template>
	<div class="travelersList_ui">
		<!-- #ifdef MP -->
		<coustom-head title="常用出行人" nativeMode=true>
		</coustom-head>
		<!-- #endif -->

		<div class="info-list">
			<div class="info-item" v-for="(item,i) in contactsList" :key="i" @click="toTraveler(item)">
				<div class="info-item-lf">
					<div class="info-item-lf-info">
						<div class="info-item-name">
							{{item.name}}

						</div>
						<div class="info-item-id-card">
							{{idCardType[item.idCode]}} {{hideIdCard(item.idNo)}}
						</div>
						<div class="info-item-id-card">
							手机号 {{hideCode(item.mobile,3,7)}}
						</div>
					</div>
				</div>
				<div class="iconfont icon-a-16_bianji" ></div>
			</div>

		</div>
		<empty tips="暂无出行人" subTips="松赞，期待与您相遇。" v-if="contactsList.length==0&& !isAjax"></empty>
		<div class="footer">

			<div class="order-btn" @click="toTraveler()">新增</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted, watch } from "vue";
	import api from "@/utils/api";
	import { getStorage } from "@/utils/wxuser";
	import {
		onShow
	} from "@dcloudio/uni-app";
	import empty from "@/components/empty.vue";
	import UmengSDK from "@/utils/umengAdaptor.js";
	import coustomHead from "@/components/coustomHead.vue";
	import { jAlert3, jAlert5 } from "@/base/jAlert/jAlert";
	import {hideIdCard } from "@/utils/filter";
	import { goPage } from "@/utils/utils";
	let config = getStorage("config");
	let user = getStorage("user");
	let contactsList : any = ref([])
	let isAjax = ref(true)
	let idCardType = reactive({
		"01": "身份证",
		"02": "临时身份证",
		"14": "护照",
		"21": "港澳通行证"
	})
	const toTraveler = (item : any) => {
		if (item && item.guestId) {
			UmengSDK.sendEvent("tpp_button_clk", {
				page_name: "travel_detail_pg",
				button_name: '编辑',
				button_id: '编辑',

			});
			goPage('/pagesB/travel/travelersInfo?delta=2&type=edit&id=' + item.guestId)
		} else {
			UmengSDK.sendEvent("tpp_button_clk", {
				page_name: "travel_detail_pg",
				button_name: '新增',
				button_id: '新增',
			});
			goPage('/pagesB/travel/travelersInfo?delta=2')
		}

	}

	const hideCode = (str : string, beginStr : number, endStr : number) => {
		var len = str.length;
		if (len < beginStr || len < endStr) {
			return str;
		}
		var leftStr = str.substring(0, beginStr);
		var rightStr = str.substring(endStr, len);
		var str = ''
		var i = 0;
		try {
			for (i = 0; i < endStr - beginStr; i++) {
				str = str + '*';
			}
		} catch (error) {

		}
		str = leftStr + str + rightStr;
		return str;
	}
	const listGuestLinkExtraInfoWithMemberIdOrOpenId = () => {
		api.listGuestLinkExtraInfoWithMemberIdOrOpenId({
			channel: 'WECHAT',
			hotelGroupCode: config.hotelGroupCode,
			hotelCode: config.hotelCode,
			memberId: user.memberId,
			openIdType: 'WECHAT'

		}).then((res : any) => {
			isAjax.value = false
			if (res.result == 1) {
				if (res.retVal.result == 0) {
					if (res.retVal.retVal.length) {
						let contacts : any[] = []
						res.retVal.retVal.forEach((item : any) => {
							if (item.guestId) {


								contactsList.value.forEach((contact : any) => {
									if (item.guestId == contact.guestId) {
										item.active = contact.active
										item.activeNotCan = contact.activeNotCan
									}

								})
								contacts.push(item)


							}

						})
						contactsList.value = contacts

					}
				}

			}
		})
	}
	onShow(() => {
		listGuestLinkExtraInfoWithMemberIdOrOpenId()
	});
	onMounted(() => {


	});
</script>

<style lang="less" scoped>
	@import url("~@/styles/skin.less");
	@import url("~@/styles/mixin.less");

	.travelersList_ui {
		.info-list {
			padding: 16px 16px 100px;
			padding-bottom: calc(100px + constant(safe-area-inset-bottom));
			padding-bottom: calc(100px + env(safe-area-inset-bottom));

			.info-item {
				padding: 16px 12px;
				box-sizing: border-box;
				margin-bottom: 16px;
				display: flex;
				background: #fff;
				border-radius: 8px;
				justify-content: space-between;
				align-items: center;

				.info-item-lf {
					display: flex;
					align-items: center;

					.icon-a-16_bianji {
						margin-right: 12px;
						font-size: 15px;
					}

					.info-item-lf-info {
						.info-item-name {
							display: flex;
							color: #000000;
							font-weight: bold;
							font-size: 16px;
							line-height: 1;

							.ageType {
								margin-left: 8px;
								color: #A43127;
								border-radius: 4px;
								background: rgba(164, 49, 39, 0.08);
								padding: 2px 4px;
								font-size: 10px;
								line-height: 1;
								font-weight: normal;
							}
						}

						.info-item-id-card {
							margin-top: 12px;
							font-size: 12px;
							color: #808080;
						}
					}

				}


			}
		}

		.footer {
			display: flex;
			padding: 12px 16px;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 2;
			right: 0;
			background: #fff;
			border-top: 0.5px solid #EEEEEE;
			padding-bottom: calc(16px + constant(safe-area-inset-bottom));
			padding-bottom: calc(16px + env(safe-area-inset-bottom));


			.order-btn {
				display: flex;
				flex: 1;
				justify-content: center;
				align-items: center;
				background: #000;
				border-radius: 4px;
				color: #FFFFFF;
				font-size: 16px;
				height: 48px;
			}

		}

	}
</style>