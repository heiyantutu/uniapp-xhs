<template>
	<div class="ui_filterFixed" @click="showFilter()">
		<i class="icon-a-20_shaixuan iconfont" :class="{'active':active}"></i>
	</div>
	<bottom-dialog ref="filter" title="筛选" maxDialog=true>
		<div class="filterBox">
			<!-- <div class="topFilterBox">
				<div class="tl">
					时间
				</div>
				<radio-box :datas="days" dataKey="data" v-model:val="filterData.beginDate"></radio-box>
			</div> -->
			<div class="topFilterWarp">
				<div class="topFilterBox">
					<div class="tl">
						活动标签
					</div>
					<radio-box :datas="marketingActivityTags" dataKey="id"
						v-model:val="filterData.marketingActivityTag"></radio-box>
				</div>
				<div class="topFilterBox"
					v-if="type=='ButlerCustomized'||type=='FreeTravel'||type=='ThemeGroup'||type=='DestPackage'">
					<div class="tl">
						系列
					</div>
					<radio-box :datas="tagList"  dataKey="id" v-model:val="filterData.curTag"></radio-box>
				</div>
				<div class="topFilterBox"
					v-if="type=='ButlerCustomized'||type=='FreeTravel'||type=='ThemeGroup'||type=='DestPackage'">
					<div class="tl">
						主题
					</div>
					<radio-box :datas="themes"  dataKey="dictionaryCode" v-model:val="filterData.theme"></radio-box>
				</div>
			</div>
			<div class="bottomFilterBox">
				<div class="resetBtn" @click="reset()">
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
		reactive,
		watch,
		onMounted
	} from "vue";
	import dayjs from "dayjs";
	import api from "@/utils/api";
	import bottomDialog from "@/components/bottomDialog.vue";
	import radioBox from "@/components/radioBox.vue";
	import {
		getStorage
	} from "@/utils/wxuser";
	import {
		jAlert3
	} from "@/base/jAlert/jAlert";
	let config = getStorage("config");
	export default defineComponent({
		name: "filterFixed",
		props: {
			type: {
				type: String,
				default: () => {
					return "";
				},
			},
			tagList: {
				type: Array,
				default: () => {
					return [];
				},
			},
			tag: {
				type: String,
				default: () => {
					return '';
				},
			},
			marketingActivityTag: {
				type: String,
				default: () => {
					return '';
				},
			},
			theme:{
				type: String,
				default: () => {
					return '';
				},
			},
		},
		components: {
			bottomDialog,
			radioBox
		},
		setup(props, context) {
			const filterData = ref({
				curTag: '',
				marketingActivityTag:'',
				theme:''
			});
			const marketingActivityTags = ref([])
			const active = ref(false);
			const filter = ref();
			const themes = ref([])
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
			watch(() => props.tag, (newVal, oldVal) => {

				filterData.value.curTag = newVal
			})
			watch(() => filterData.value, (newVal, oldVal) => {
				active.value = false
				for (var i in newVal) {
					for (var j in filterData.value) {
						if (i == j) {
							if (newVal[i]) {
								active.value = true
							}
						}
					}

				}
			}, {
				deep: true
			})
			const showFilter = () => {
				if (props.tag) {
					filterData.value.curTag = props.tag
				} else {
					filterData.value.curTag = ''
				}
				if (props.theme) {
					filterData.value.theme = props.theme
				} else {
					filterData.value.theme = ''
				}

				filter.value.showDialog();
			}
			const queryMarketingPageTags = () => {

				let opt = {
					hotelGroupCode: config.hotelGroupCode,
					hotelCode: config.hotelCode
				};
				api.queryMarketingPageTags(opt).then((res) => {
					if (res.result == 0) {
						marketingActivityTags.value = []
						res.retVal.forEach(item => {
							var tag = {
								name: item,
								id: item
							}
							marketingActivityTags.value.push(tag)
						})
					} else {
						jAlert3(res.msg)
					}
				})


			}
			const reset = () => {
				
				active.value = false
				filterData.value = {
					curTag: '',
					marketingActivityTag: '',
					theme:''

				}

			}
			const listTravelDictionary = () => {
				api.listTravelDictionary({
					dictionaryType: 'theme',
					isHalt: 'F',
					unitCode: config.hotelGroupCode,
					hotelCode: config.hotelCode,
				})
					.then((res) => {
						if (
							res.result == 0 &&
							res.retVal &&
							res.retVal.length > 0
						) {
							res.retVal.forEach(item=>{
								item.name = item.dictionaryDesc
							})
							themes.value = res.retVal
						}
					});
			}
			const complete = () => {
				context.emit("update:tag", filterData.value.curTag);
				context.emit("update", filterData.value);
				filter.value.hideDialog();
			}
			onMounted(() => {
				queryMarketingPageTags();
				listTravelDictionary();
			});
			return {
				filter,
				showFilter,
				days,
				filterData,
				complete,
				active,
				reset,
				queryMarketingPageTags,
				marketingActivityTags,
				listTravelDictionary,
				themes

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
		bottom: 140px;
		bottom: calc(140px + constant(safe-area-inset-bottom));
		bottom: calc(140px + env(safe-area-inset-bottom));
		background: #fff;
		border-radius: 50%;
		width: 48px;
		height: 48px;
		box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.08);

		.iconfont {
			font-size: 20px;
			color: #000;

			&.active {
				color: #A43127;
			}
		}


	}

	.filterBox {
		// max-height: calc(80vh);
		// overflow-y: auto;
		padding-top: 16px;
	}
	.topFilterWarp{
		min-height: 30vh;
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
		position: sticky;
		bottom:0;
		width: 100%;
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