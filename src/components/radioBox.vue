<template>
	<div class="ui_radioGroup">
		<div class="radio-box">
			<div class="radio-item" v-for="(item,i) in newDatas" :key="i" @click="chooseData(item)"
				:class="{'active':chooseVal == item[dataKey],'invalid':item.invalid}">
				{{item.name}}
			</div>
		</div>

	</div>

</template>

<script lang="ts">
	import { defineComponent, computed,ref,onMounted} from "vue";

	export default defineComponent({
		name: "radioGroup",
		props: {
			datas: {
				type: Array,
				default: () => {
					return [];
				},
			},
			val:{
				type: String,
				default: () => {
					return '';
				},
			},
			dataKey:{
				type: String,
				default: () => {
					return '';
				},
			},
		},
		emits: ["update:val"],
		setup(props, context) {
			const chooseVal  = ref('')
			const initVal = ref()
			const newDatas = computed(() => {
				initVal.value = props.val||''
				if(props.val){
					chooseVal.value =  props.val
				}
				// 在这里可以根据需要进行计算
				return props.datas;
			});
			const clear = () => {
				chooseVal.value = props.dataKey
				// newDatas.value.forEach((data:any) => {
				// 	if(initVal.value==data[props.dataKey]){
				// 		data.active = true
				// 	}else{
				// 		data.active = false
				// 	}
				// })
				
				context.emit("update:val", initVal.value);
			}
			const chooseData = (item : any) => {
				if(item.invalid){
					return;
				}
				// newDatas.value.forEach((data:any) => {
				// 	data.active = false
				// })
				// item.active = true
				chooseVal.value =  item[props.dataKey]
				context.emit("update:val", item[props.dataKey]);
			};
			onMounted(() => {
				
				// if(initVal.value){
				// 	newDatas.value.forEach((data:any) => {
				// 		if(initVal.value==data[props.dataKey]){
				// 			data.active = true
				// 		}
				// 	})
				// }
			})
			return {
				chooseData,
				newDatas,
				clear,
				initVal,
				chooseVal

			};
		}
	});
</script>

<style scoped lang="less">
	@import url("~@/styles/skin.less");
	@import url("~@/styles/mixin.less");

	.ui_radioGroup {
		.radio-box {
			display: flex;
			min-height: 240px;
			padding: 16px;
			flex-wrap: wrap;

			.radio-item {
				height: 48px;
				line-height: 48px;
				text-align: center;
				color: #000000;
				font-size: 16px;
				width: calc(~"(100% - 20px) / 3");
				border-radius: 4px;
				border: 1px solid #e2e2e2;
				margin-right: 10px;

				margin-bottom: 16px;

				&.active {
					color: @active-color;
					font-weight: bold;
					border-color: @active-color;
				}
				&.invalid{
					color: #CCCCCC;
					border: 1px solid #CCCCCC;
				}
				&:nth-of-type(3n + 0) {
					margin-right: 0;
				}
			}
		}

	}
</style>