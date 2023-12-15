<template>
	<div class="ui_filterFixed" @click="showFilter()">
		<i class="icon-a-16_shaixuan iconfont"></i>
	</div>
	<bottom-dialog ref="filter" title="筛选">
		<div class="filterBox">
			<div class="topFilterBox">
				<div class="tl">
					时间
				</div>

				<radio-box :datas="days" dataKey="data" v-model:val="filterData.beginDate"></radio-box>
			</div>
			<div class="topFilterBox">
				<div class="tl">
					区域
				</div>
			</div>
			<div class="bottomFilterBox">
				<div class="resetBtn">
					<i class="icon iconfont icon-a-20_zhongzhi"></i>
					<p class="resetDesc">重置</p>
				</div>
				<div class="finishBtn" @click="complete()">
					完成
				</div>
			</div>
		</div>
	</bottom-dialog>
</template>

<script>
	import {
		defineComponent,
		ref,
		reactive
	} from "vue";
	import dayjs from "dayjs";
	import bottomDialog from "@/components/bottomDialog.vue";
	import radioBox from "@/components/radioBox.vue";
	export default defineComponent({
		name: "filterFixed",
		props:{
			
		},
		components: {
			bottomDialog,
			radioBox
		},
		setup(props, context) {
			const filterDataNew = ref({})
			const filterData = reactive({
				beginDate: '',
				endDate: '',
				// cardLevel: user.cardLevel,
				// companyLevel: user.companyLevel,
				// cardType: user.cardType,
				// category: '',
				// categorySub: '',
				// companyCode: '',
				// gcLevel: '',
				// ota: '',
				// otaChannel: 'WECHAT',
				// dayNight: '',
				// rendezvous: '',
				// travelGroupCode: '',
				// travelType: '',
				// hotelCode: config.hotelCode,
				// hotelGroupCode: config.hotelGroupCode,
			});
			const filter = ref();
			const days = reactive([{
					name: '近一个月',
					data: dayjs().subtract(1, 'month').format('YYYY-MM-DD')
				}, {
					name: '近三个月',
					data: dayjs().subtract(3, 'month').format('YYYY-MM-DD')
				},
				{
					name: '近六个月',
					data: dayjs().subtract(6, 'month').format('YYYY-MM-DD')
				}
			]);
			const showFilter = (val) => {
				if(val){
					filterData = val
				}
				
				filter.value.showDialog();
			}
			const complete = () => {
				context.emit("update", filterData);
				filter.value.hideDialog();
			}
			return {
				filter,
				showFilter,
				days,
				filterData,
				complete,
				filterDataNew

			};
		},
	});
</script>
<style lang="less" scoped>
	@import url("~@/styles/skin.less");
	@import url("~@/styles/mixin.less");

	.ui_filterFixed {
		position: fixed;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9;
		right: 16px;
		bottom: 160px;
		background: #fff;
		border-radius: 50%;
		width: 48px;
		height: 48px;
		box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.08);

		.iconfont {
			font-size: 20px;
			color: #000;
		}


	}

	.filterBox {
		padding-top: 16px;
	}

	.topFilterBox {
		padding: 0 16px;

		.tl {
			padding-bottom: 16px;
			font-size: 14px;
			font-weight: bold;
		}




	}

	.bottomFilterBox {
		display: flex;
		height: 70px;
		align-items: center;
		padding: 16px;
		background: #fff;

		.resetBtn {
			width: 60px;
			margin-right: 16px;
			text-align: center;
			color: #000;

			.resetDesc {
				font-size: 12px;
			}

			.iconfont {
				font-size: 22px;
			}
		}

		.finishBtn {
			.baseBtn();
			flex: 1;
			height: 48px;
			line-height: 48px;
		}
	}
</style>