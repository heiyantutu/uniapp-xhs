<template>
	<div class="container" ref="container" >
		<div class="text" ref="text" :style="height">
			<template v-if="state.needMore">
				<div class="more-btn retract" @click="toggleShowAll" v-if="state.isExpand">收起<i
						class="icon-a-12_xialajiantou_hei iconfont"></i></div>
				<div class="more-btn" @click="toggleShowAll" v-else>{{openText}}<i
						class="icon-a-12_xialajiantou_hei iconfont"></i>
				</div>
			</template>
			<mp-html :content="content"></mp-html>


		</div>



	</div>
</template>


<script>
	export default {
		data() {
			return {
				state: {
					isExpand: false,
					containerHeight: 0,
					needMore: false,
					maxHeight: 0,
				}
			}
		},
		name: "moreText",
		props: {
			content: {
				type: String
			},
			maxLine: {
				type: Number,
				default: 3
			},
			lineHeight: {
				type: Number,
				default: 22
			},
			openText:{
				type: String,
				default: '展开'
			}

		},
		methods: {
			toggleShowAll() {
				this.state.isExpand = !this.state.isExpand
			}

		},
		computed: {
			height() {
				var style = ''
				if (this.state.containerHeight) {
					if (this.state.isExpand) {
						style += `height:${this.state.containerHeight}px;display: block;`
					} else {
						style += `height:${this.state.maxHeight}px;-webkit-line-clamp: ${this.maxLine};`
					}
				}

				return style
			},
		},
		mounted() {
			const containerQuery = uni.createSelectorQuery().in(this)
			containerQuery.select('.text').boundingClientRect(res => {
				const containerHeight = res.height
				const lineNum = Math.round(containerHeight / this.lineHeight)
				const needMore = lineNum > this.maxLine
				const maxHeight = this.maxLine * this.lineHeight
				this.state.containerHeight = containerHeight
				this.state.needMore = needMore
				this.state.maxHeight = maxHeight
				
			}).exec()
		}

	}
</script>
<style lang="less" scoped>
	.container {
		position: relative;
		
	}

	.text {
		position: relative;
		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		word-break: break-all;
		font-size: 14px;
		line-height: 22px;
		color: #808080;
	
		&::before {
			content: '';
			float: right;
			width: 0;
			height: calc(100% - 22px);
		}


	}

	.more-btn {
		float: right;
		clear: both;
		line-height: 22px;
		padding-left: 5px;
		// position: absolute;
		// bottom: 0;
		// right: 16px;
		font-size: 14px;
		color: #000000;
		height: 22px;
		
		cursor: pointer;

		.iconfont {
			display: inline-block;
			margin-left: 5px;
			font-size: 14px;
		}

		&.retract {
			.iconfont {
				transform: rotate(180deg);
			}

		}

	}

	.expanded .text {
		height: auto;
		-webkit-line-clamp: none;
	}
</style>