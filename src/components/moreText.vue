<template>
	<div class="container" ref="container" >
		<div class="text" ref="text" :style="height" :class="{'open':open}">
			<template v-if="state.needMore">
				<div class="more-btn retract" @click="toggleShowAll" v-if="state.isExpand">收起<i
						class="icon-a-12_xialajiantou_hei iconfont"></i></div>
				<div class="more-btn" @click="toggleShowAll" v-else>{{openText}}<i
						class="icon-a-12_xialajiantou_hei iconfont"></i>
				</div>
			</template>
			<div v-html="content"></div>
			<div v-html="content" class="content-hide"></div>
		</div>



	</div>
</template>


<script>
	export default {
		data() {
			return {
				open: false,
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
					if (this.state.isExpand||!this.state.needMore ) {
						this.open = true
						style += `max-height: none;`
					} else {
						this.open = false
						style += `height:${this.state.maxHeight}px;-webkit-line-clamp: ${this.maxLine};`
					}
				}

				return style
			},
		},
		mounted() {
			setTimeout(()=>{
				const containerQuery = uni.createSelectorQuery().in(this)
				containerQuery.select('.content-hide').boundingClientRect(res => {
					const containerHeight = res.height
					console.log(res)
					const lineNum = Math.round(containerHeight / this.lineHeight)
					const needMore = lineNum > this.maxLine
					const maxHeight = this.maxLine * this.lineHeight
					this.state.containerHeight = containerHeight
					this.state.needMore = needMore
					this.state.maxHeight = maxHeight
					
				}).exec()
			},100)
		
			
		}

	}
</script>
<style lang="less" scoped>
	.container {
		position: relative;
		display: flex;
		
	}
	.content-hide {
		position: absolute;
		left: 0;
		top: 0;
		z-index: -1;
		visibility: hidden;
	}
	.text {
		position: relative;
		overflow: hidden;
		// display: -webkit-box;
		// -webkit-box-orient: vertical;
		// word-break: break-all;
		font-size: 14px;
		line-height: 22px;
		color: #808080;
		text-align: justify;
		max-height: 66px;

		&.open{
			.more-btn{
				&::before{
					display: none;
				}
			}
		}
		&::before {
			content: '';
			height: 100%;
			display: block;
			float: right;
			width: 0;
			margin-bottom: -22px;
		}


	}

	.more-btn {
		display: block;
		float: right;
		clear: both;
		line-height: 22px;
		
		font-size: 14px;
		color: #000000;
		height: 22px;
		
		cursor: pointer;
		&::before{
			content: '...';
			color: #808080;
			font-size: 14px;
			margin-right: 5px;
		}
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