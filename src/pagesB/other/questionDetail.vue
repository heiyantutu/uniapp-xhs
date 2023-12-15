<template>
	<div class="question_ui">
		<!-- #ifdef MP -->
		<coustom-head title="问题详情" nativeMode=true>
		</coustom-head>
		<!-- #endif -->
		<div class="problems">
			<div class="problem">
				<div class="question">Q：{{problem.title}}</div>
				<div class="answer">A：{{problem.answer}}</div>
			</div>
			
		</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted } from "vue";
	import api from "@/utils/api";
	import coustomHead from "@/components/coustomHead.vue";
	import { getStorage } from "@/utils/wxuser";
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
	let problemCode:any= ref("")

	let problem:any= ref({})
	
	const listTravelProblem = () => {
		api.interfaceTransfer({
			query: {
				"isHalts":"F",
				"unitCode":config.hotelGroupCode
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

				if (res.result == 1 && res.retVal.result == 0) {
					
					res.retVal.retVal.forEach((item:any)=>{
						if(item.problemCode == problemCode.value){
							problem.value = item
						}
						
						
						
					})
		
				}
			})
	}
	onLoad((options : any) => {
		problemCode.value = options.problemCode
	})
	onMounted(() => { 
		listTravelProblem()
	});
</script>

<style lang="less" scoped>
	@import url("~@/styles/skin.less");

	.question_ui {
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
		
		.problem {

			margin: 24px 16px;
			font-size: 12px;
	

			

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
			}
		}

	}
</style>