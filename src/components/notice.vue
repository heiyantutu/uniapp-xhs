<template>
	<div class="ui_notice">
		<div class="info"><i class="icon-a-16_gonggao iconfont"></i>3天后，探源·藏东雪域之旅即将启行</div>
		<i class="icon-a-12_youlajiantou_hei iconfont"></i>
	</div>

</template>

<script lang="ts">
	import { defineComponent } from "vue";

	export default defineComponent({
		name: "notice",
		props: {},
		setup() { },
	});
</script>

<style scoped lang="less">
	.ui_notice {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #EEEEEE;
		border-radius: 8px;
		padding: 0 16px;
		width: 100%;
		height: 48px;
		color: #000000;
		font-size: 14px;

		.info {
			display: flex;
			align-items: center;

			.icon-a-16_gonggao {
				margin-right: 12px;
			}
		}
	}
</style>