<template>
	<div class="ui_destination">
		<div class="search">
			<search-input class="search-input" searchIconStyle="color: #ccc;" v-model="searchVal" placeholder="关键词/位置/景点/酒店名"></search-input>

		</div>
		<div class="search-history">
			<div class="tl">
				搜索历史
				<i class="iconfont icon-a-16_shanchulishijilu"></i>
			</div>
			<div class="search-list">
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
				<div class="search-item">
					香格里拉
				</div>
			</div>
		</div>
		<div class="city-list">
			<div class="tl">云南</div>
			<div class="citys">
				<div class="city">
					全云南
				</div>
				<div class="city">
					全云南
				</div>
				<div class="city">
					全云南
				</div>
				<div class="city">
					全云南
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted } from "vue";
	import api from "@/utils/api";
	import { getStorage } from "@/utils/wxuser";
	import searchInput from "@/components/searchInput.vue";
	let config = getStorage("config");

	const searchVal = ref();
	onMounted(() => { });
</script>

<style lang="less">
	.ui_destination {
		.search {
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

		.search-history,
		.city-list {
			padding: 17px 16px 0;

			.tl {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-size: 14px;
				line-height: 1;
				font-weight: bold;
				.icon-a-16_shanchulishijilu{
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


				}
			}
		}
	}
</style>