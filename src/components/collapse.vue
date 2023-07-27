<template>
	<div class="collapse-wrapper" :style="{ height: wrapperHeight }">
		<div class="content-wrapper" :style="{ height: contentHeight }">
			<slot name="content"></slot>
		</div>
		<div class="collapse-btn" v-if="isCollapseButtonVisible" @click="toggleCollapse" :style="arrowStyle">
			<i class="iconfont" :class="!collapsed?iconName+' rotate':iconName"></i>

		</div>
	</div>
</template>

<script>
	export default {
		name: 'Collapse',
		data() {
			return {
				isCollapsed: true,
				contentHeight: '',
				wrapperHeight: '',
				isCollapseButtonVisible:false

			}
		},
		props: {
			arrowStyle:{
				type: String
			},
			iconName:{
				type:String,
				default:"icon-a-12_xialajiantou_hei"
			},
			defaultHeight: {
				type: String,
				default: '200px'
			},
			open:{
				type: Boolean,
				default: false
			},
		},
		computed: {
			
			collapsed() {
				return this.isCollapsed
			}
		},
		mounted() {

			var query = uni.createSelectorQuery().in(this)
			query.select('.content-wrapper').boundingClientRect();
			query.exec((res) => {
				this.contentHeight = res[0].height + 'px'
				if (parseFloat(this.contentHeight) > parseFloat(this.defaultHeight)) {
					this.isCollapseButtonVisible = true
				}else{
					this.isCollapseButtonVisible = false
					this.contentHeight = 'auto'
					this.wrapperHeight = 'auto'
				}
				if(this.open){
					this.wrapperHeight = this.contentHeight
					this.isCollapsed = false
				}else{
					this.wrapperHeight = this.defaultHeight
					
				}
			})
			
			

		},
		methods: {
			toggleCollapse() {
				this.isCollapsed = !this.isCollapsed
				this.wrapperHeight = this.isCollapsed ? this.defaultHeight : this.contentHeight
			}
		}
	}
</script>


<style scoped lang="less">
	.collapse-wrapper {
		display: flex;

		overflow: hidden;
		position: relative;
		transition: height 0.2s ease-in-out;
	}

	.content-wrapper {
		flex: 1;
		overflow: hidden;
		position: relative;
	}

	.collapse-btn {
		margin-top: 8px;
		display: flex;
		align-items: center;

		.iconfont {
			transition: all 0.2s;
		}

		.rotate {
			transform: rotate(180deg);
		}
	}
</style>