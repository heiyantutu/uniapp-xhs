<template>
	<div class="ui_destinationBox">
		<div class="destination">
			<div class="search-top">
				<div class="search">
					<search-input class="search-input" @submit="search" v-model="searchVal"
						placeholder="关键词/位置/景点/酒店名"></search-input>

				</div>
				<div class="search-history" v-if="!searchVal">
					<div class="tl">
						搜索历史
						<i class="iconfont icon-a-16_shanchulishijilu" @click="delSearch()"></i>
					</div>
					<collapse defaultHeight="50px">
						<template v-slot:content>
							<div class="search-list">
								<div class="search-item" v-for="(item,i) in mySearchGroup" :key="i"
									@click="chooseHis(item)">
									{{item}}
								</div>


							</div>
						</template>
					</collapse>
				</div>

			</div>
			<div class="search-list-box" v-if="searchVal">
				<div class="search-item" v-for="(item,i) in resultList" :key="i" @click="search(item)">
					<div class="left-part">
						<i class="iconfont icon-a-12_dingwei"></i>
						<div class="dictionaryDesc" v-html="item.dictionary"></div>
					</div>
					<div class="right-part">
						{{item.provinceDesc}}-{{item.dictionaryDesc}}
					</div>

				</div>
				<div class="result"><i class="iconfont icon-a-16_sousuo"></i>搜索“{{searchVal}}”相关的结果</div>
			</div>

			<div v-else>

				<div class="city-list" v-for="(destination,i) in destinations" :key="i">
					<div class="tl">{{i}}</div>
					<div class="citys">
						<div class="city" v-for="(item,j) in destination" :key="j" @click="search(item)">
							{{item.dictionaryDesc}} <img v-if="item.isPopular=='T'" class="popular-icon"
								src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/popular-icon.png">
						</div>

					</div>
				</div>
			</div>

		</div>
	</div>

</template>

<script lang="ts">
	import { defineComponent, computed, ref, onMounted, reactive } from "vue";
	import searchInput from "@/components/searchInput.vue";
	import collapse from "@/components/collapse.vue";
	import { getStorage, removeStorage, setStorage } from "@/utils/wxuser";
	import api from "@/utils/api";
	import { jAlert3 } from "@/base/jAlert/jAlert";
	// import radioBox from "@/components/radioBox.vue";
	let config = getStorage("config");
	export default defineComponent({
		name: "destinationBox",
		props: {
			datas: {
				type: Array,
				default: () => {
					return [];
				},
			},
			dictionaryCode: {
				type: String,
				default: () => {
					return '';
				},
			},
			isAutoChooseCity: {
				type: Boolean,
				default: () => {
					return true;
				},
			}
		},
		components: {
			searchInput,
			collapse
		},
		setup(props, context) {
			let mySearch : any = ref("")
			let destList = ref([])
			let destinations : any = ref({})
			let mySearchGroup = ref([])
			let searchVal = ref('')
			const search = (item : object) => {
				if (searchVal.value) {
					mySearchGroup.value.splice(0, 0, searchVal.value)
					mySearchGroup.value = [...new Set(mySearchGroup.value)];
					mySearch.value = mySearchGroup.value.join(',')
					setStorage('myMallSearch', mySearch.value);
					searchVal.value = ''
				}

				context.emit("search", item);

			}
			const chooseHis = (item : string) => {
				searchVal.value = item
			}
			const getMysearch = () => {
				mySearch.value = getStorage('myMallSearch');
				if (mySearch.value) {

					mySearchGroup.value = mySearchGroup.value.concat(mySearch.value.split(','));
				}

			}
			const listTravelDictionary = () => {
				api.listTravelDictionary({
					dictionaryType: 'destination',
					isHalt: 'F',
					unitCode: config.hotelGroupCode,
					hotelCode: config.hotelCode,
				})
					.then((res : any) => {
						if (
							res.result == 0 &&
							res.retVal &&
							res.retVal.length > 0
						) {
							destList.value = res.retVal
							if (destList.value.length > 0) {
								let selectDest : any = destList.value[0]
								destList.value.forEach((item : any) => {
									if (!destinations.value[item.provinceDesc]) {
										destinations.value[item.provinceDesc] = []
									}

									if (props.dictionaryCode && props.dictionaryCode == item.dictionaryCode) {
										selectDest = item
									}
									destinations.value[item.provinceDesc].push(item)

								})
								if (props.isAutoChooseCity) {
									context.emit("search", selectDest);
								}
							}



						}
					});
			}
			const resultList = computed(() => {
				// 在这里可以根据需要进行计算
				let columns = ref([])
				if (searchVal.value) {
					columns.value = destList.value.filter((item : any) => {
						if (item['dictionaryDesc'].indexOf(searchVal.value) != -1) {
							var regex = new RegExp(searchVal.value, 'gi');
							item.dictionary = item.dictionaryDesc.replace(regex, '<span style="color: #A43127;">$&</span>');
							return item
						}
					})

				}

				return columns.value
			});

			const delSearch = () => {
				removeStorage('myMallSearch')
				mySearch.value = ''
				mySearchGroup.value = []
				jAlert3('删除成功')
			}
			onMounted(() => {
				getMysearch()
				listTravelDictionary()
			})
			return {
				mySearch,
				mySearchGroup,
				search,
				getMysearch,
				listTravelDictionary,
				searchVal,
				delSearch,
				destList,
				resultList,
				destinations,
				chooseHis
			};
		}
	});
</script>

<style scoped lang="less">
	@import url("~@/styles/skin.less");
	@import url("~@/styles/mixin.less");

	.ui_destinationBox {
		.destination {
			position: relative;
			padding-bottom: 40px;
			height: calc(100vh - 160px);
			overflow-y: auto;
			padding-bottom: 40px;

			.search-top {
				background-color: #f8f8f8;
				padding-bottom: 5px;
				position: sticky;
				top: 0;
				z-index: 2;

				.search-history {
					padding: 17px 16px 0;

					.tl {
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 14px;
						line-height: 1;
						font-weight: bold;

						.icon-a-16_shanchulishijilu {
							font-weight: normal;
						}
					}

					.search-list {
						padding-top: 4px;
						max-height: 140px;
						overflow: hidden;

						.search-item {
							margin-top: 10px;
							display: inline-block;
							padding: 8px;
							font-size: 12px;
							color: #000000;
							border: 1px solid #ddd;
							border-radius: 4px;
							margin-right: 8px;

						}
					}
				}

			}

			.search {

				border-top: 1px solid #eee;

				display: flex;
				align-items: center;
				padding: 8px 16px;
				box-sizing: border-box;
				background: #fff;

				.search-input {
					flex: 1;
				}

				.screen {
					padding-left: 16px;
				}
			}


			.city-list {

				padding: 17px 16px 0;





				.citys {
					padding-top: 4px;
					display: flex;
					flex-wrap: wrap;

					.city {
						width: calc(33.3% - 10px);
						border: 1px solid #ddd;
						height: 48px;
						margin-top: 12px;
						display: flex;
						margin-right: 10px;
						align-items: center;
						justify-content: center;
						border-radius: 4px;

						.popular-icon {
							margin-left: 4px;
							width: 12px;
							height: 12px;
						}

					}
				}
			}

			.search-list-box {
				padding: 0 16px;

				.search-item {
					padding: 16px 0;
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 14px;

					.left-part {
						display: flex;
						align-items: center;

						.iconfont {
							font-size: 16px;
							margin-right: 12px;
							color: #000;
						}
					}

					.right-part {
						font-size: 12px;
						color: #808080;
					}

				}

				.result {
					padding-top: 16px;
					display: flex;
					align-items: center;

					.iconfont {
						margin-right: 12px;
						font-size: 16px;
						color: #CCCCCC;

					}

					font-size: 14px;
					color: #CCCCCC;
				}
			}
		}

	}
</style>