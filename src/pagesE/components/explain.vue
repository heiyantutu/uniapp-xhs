<template>
	<div class="ui_explain">
		<div class="tl">费用说明<i class="iconfont icon-a-16_xialajiantou_hei"></i></div>
		<div class="desc">
			价格为多人拼团出行，2人共享一个房间，单人的价格。单人出行或拼住不成功，仅一人入住一个房间时，需要支付单间差。
		</div>
		<div class="explain">

			价格为多人拼团出行，2人共享一个房间，单人的价格。单人出行或拼住不成功，仅一人入住一个房间时，需要支付单间差。
		</div>
	</div>

</template>

<script lang="ts">
	import { defineComponent } from "vue";

	export default defineComponent({
		name: "",
		props: {},
		setup() { },
	});
</script>

<style scoped lang="less">
	.ui_explain {
		border-radius: 8px;
		margin: 12px 16px 0;
		background: #FFFFFF;
		padding: 12px;
		font-size: 12px;
		.tl{
			display: flex;
			justify-content: space-between;
			font-size: 14px;
			font-weight: bold;
		}
		.desc{
			margin-top: 16px;
			font-size: 14px;
			color: #808080;

		}
		.explain{
			margin-top: 16px;
		}
	}
</style>