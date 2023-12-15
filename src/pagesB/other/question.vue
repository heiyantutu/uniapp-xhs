<template>
	
	<div class="question_ui">
		<!-- #ifdef MP -->
	<coustom-head title="常见问题" nativeMode=true>
		</coustom-head>
		<!-- #endif -->
		<div class="tabs-box" v-if="canRequest">
			<div class="tabs">
				<tabs :datas="tabsData" type="fk" borderColor="#eee" borderActiveColor="#A43127"
					titleInactiveColor="#000000" color="#000000" @clickTab="chooseType"></tabs>
			</div>
		</div>
		<div class="problems">
			<div class="problem" v-for="(item,i) in problems" :key="i" @click="goPage('/pagesB/other/questionDetail?problemCode='+item.problemCode)">
				<div class="question">Q：{{item.title}}</div>
				<div class="answer">A：{{item.answer}}</div>
			</div>

		</div>
		<div class="kfBtn baseBtn" @click="showKf()">
			<i class="iconfont icon-a-20_guwen_bai"></i>
			在线客服
		</div>
	</div>
	<kf-dialog ref="kf" title="联系客服"></kf-dialog>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted } from "vue";
	import api from "@/utils/api";
	import { getStorage } from "@/utils/wxuser";
	import tabs from "@/components/tabs.vue";
	import { goPage } from "@/utils/utils";
	import kfDialog from "@/components/kfDialog.vue";
	import coustomHead from "@/components/coustomHead.vue";
	import {
		onLoad
	} from "@dcloudio/uni-app";
	let config = getStorage("config");
	let tabsData = reactive([
		{
			id: 'all',
			name: '全部'
		}
	])
	const kf = ref()
	let canRequest = ref(false)
	let type : any = ref("")
	let list : any = ref([])
	let curType = ref("all")
	
	const chooseType = (val : any) => {
		curType.value = val.id
	}
	let problems = computed(() => {
		let problems = []
		if (curType.value != 'all') {
			list.value.forEach((item : any) => {
				if (item.oneLevelType == curType.value) {
					problems.push(item)
				}
			})
		} else {
			problems = list.value
		}
		return problems
	})
	const showKf = () => {
		kf.value.showDialog();
	}
	const listTravelProblem = () => {
		api.interfaceTransfer({
			query: {
				"isHalts": "F",
				"unitCode": config.hotelGroupCode
			},
			config: {
				"interfaceType": "POST",
				"interfaceModule": "GC_PRODUCT_JOURNEY",
				"interfaceMethod": "/api/itinerary/listTravelProblem",
				"interfaceFrom": "GC",
				"hotelGroupCode": config.hotelGroupCode
			}
		})
			.then((res : any) => {
				canRequest.value = true
				if (res.result == 1 && res.retVal.result == 0) {
					let problemsList =[]
					if(type.value){
						let problemDtos = getStorage('problemDtos')
						res.retVal.retVal.forEach((item : any) => {
							problemDtos.forEach((problem : any) => {
								if(item.problemCode == problem.problemCode){
									problemsList.push(item)
								}
							})
						})
					}else{
						problemsList = res.retVal.retVal
					}
					
					list.value = []
					list.value = problemsList
					problemsList.forEach((item : any) => {
						if (item.oneLevelType) {
							let notHas = true
							tabsData.forEach((tab : any) => {
								if (item.oneLevelType == tab.id) {
									notHas = false
								}
							})
							if (notHas) {
								tabsData.push({
									id: item.oneLevelType,
									name: item.oneLevelTypeDesc
								})
							}
						}



					})

				}
			})
	}
	onLoad((options : any) => {
		if(options.type){
			type.value = options.type
		}
		
	})
	onMounted(() => {
		listTravelProblem()
	});
</script>

<style lang="less" scoped>
	@import url("~@/styles/skin.less");
	@import url("~@/styles/mixin.less");

	.question_ui {

		padding-bottom: 30px;
		padding-bottom: calc(30px + constant(safe-area-inset-bottom));
		padding-bottom: calc(30px + env(safe-area-inset-bottom));
		.tabs-box{
			height: 56px;
		}
		.tabs {
			position: fixed;
			width: 100%;
			background: #fff;
			
			padding-bottom: 12px;
			&::after{
				content: '';
				bottom: 0;
				left: 0;
				right: 0;
				background: #eee;
				position: absolute;
				height: 1px;
				transform: scale(0.5);
			}
			
		}

		.problem {
			background: #FFFFFF;
			border-radius: 8px;
			margin: 12px 16px 0;
			font-size: 12px;
			padding: 12px;



			.question {
				color: #000000;
				line-height: 1;
				font-size: 16px;
			}

			.answer {
				margin-top: 16px;
				font-size: 14px;
				line-height: 22px;
				color: #808080;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 3;
				white-space: normal;
				overflow: hidden;
				
			}
		}
		.kfBtn{
			height: 48px;
			padding: 0 32px;
			display: flex;
			align-items: center;
			position: fixed;
			bottom: 32px;
			left: 50%;
			transform: translateX(-50%);
			color: #fff;
			font-size: 16px;
			border-radius: 70px;
			.icon-a-20_guwen_bai{
				font-size: 20px;
				margin-right: 4px;
			}
		}

	}
</style>