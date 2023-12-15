<template>
	<div>
		<div class="collapse-wrapper" :style="{ height: wrapperHeight }">
			<div class="content-wrapper" :style="{ height: contentHeight }">
				<slot name="content"></slot>
			</div>


			<div class="collapse-btn" v-if="isCollapseButtonVisible&&btn=='F'" @click="toggleCollapse"
				:style="arrowStyle">
				<i class="iconfont" :class="!collapsed?iconName+' rotate':iconName"></i>

			</div>
		</div>
	
		<div class="open-btn"  v-if="isCollapseButtonVisible&&btn=='T'&&collapsed"	@click="toggleCollapse">
			展开更多<i class="iconfont icon-a-12_xialajiantou_hei"></i>

		</div>
		<div class="open-btn"  v-if="isCollapseButtonVisible&&btn=='T'&&!collapsed" @click="toggleCollapse">收起更多<i class="iconfont icon-a-12_shanglajiantou_hei"></i>
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
				isCollapseButtonVisible: false

			}
		},
		props: {
			btn: {
				type: String,
				default: 'F'
			},
			arrowStyle: {
				type: String
			},
			iconName: {
				type: String,
				default: "icon-a-12_xialajiantou_hei"
			},
			defaultHeight: {
				type: String,
				default: '200px'
			},
			open: {
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
			
			this.updata()
			

		},
		methods: {
			toggleCollapse() {
				this.isCollapsed = !this.isCollapsed
				this.wrapperHeight = this.isCollapsed ? this.defaultHeight : this.contentHeight
			},
			updata(){
				var query = uni.createSelectorQuery().in(this)
				query.select('.content-wrapper').boundingClientRect();
				
				query.exec((res) => {
					this.contentHeight = res[0].height + 'px'
					console.log(this.contentHeight)
					if (parseFloat(this.contentHeight) > parseFloat(this.defaultHeight)) {
						this.isCollapseButtonVisible = true
					} else {
						this.isCollapseButtonVisible = false
						this.contentHeight = 'auto'
						this.wrapperHeight = 'auto'
					}
					if(this.isCollapseButtonVisible){
						if (this.open) {
							this.wrapperHeight = this.contentHeight
							this.isCollapsed = false
						} else {
							this.wrapperHeight = this.defaultHeight
					
						}
					}
					
				})
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
	.open-btn {
					margin-top: 16px;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #808080;
					font-size: 14px;
	
					.icon-a-12_xialajiantou_hei,
					.icon-a-12_shanglajiantou_hei {
						margin-left: 5px;
						font-size: 15px;
					}
				}
</style>