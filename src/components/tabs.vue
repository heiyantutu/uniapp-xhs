<template>
	<div class="tabs_ui" :style="{'background':background}" :class="{'canShow':canShow}">
		<scroll-view class="scroll-view" scroll-x="true" bindscroll="scroll"  :scroll-left="scrollLeft"
			scroll-with-animation="true" :class="{noPadding:noPadding=='T'}">
			<div class="tabs" :class="flex?'flex '+type:type">
				<div v-if="type==='line'" class="tabs_line" :style="lineStyle"></div>
				<div class="tab" v-for="(item,i) in datas" :key="i"
					:style="active==item.id?tabViewActStyle:tabViewStyle" :class="{'active':active==item.id}"
					@click="clickTab(item,i)" >
					<div class="icon" v-if="type=='pic'||type=='img'"
						:style="{'background':'url('+item.icon+') center top/auto 25px no-repeat;'}"></div>
					<div class="tab_view" v-if="type!='img'">
						{{item.name}}
					</div>
					<i class="qp" :style="{'border-top-color':color}" v-if="border=='2'"></i>
				</div>
			</div>
		</scroll-view>

	</div>
</template>

<script>
	import {
		setStorage,
		getStorage
	} from "@/utils/wxuser";
	import {
		getAllRect,
		getRect
	} from "@/utils/utils";
	export default {
		data() {
			return {
				scrollable: false,
				scrollLeft: 0,
				currentIndex: 0,
				lineWidth: 40,
				lineHeight: 3,
				duration: 0.3,
				lineOffsetLeft: 0,
				active: '',
				flex:false,
				canShow:false
				
			}
		},
		props: {
			flexNum: {
				type: String,
				default () {
					return "5";
				},
			},
			titleStyle: String,
			activeType: {
				type: String,
				default () {
					return "";
				},
			},
			datas: Array,
			childColor: {
				type: String,
				default () {
					return "";
				},
			},
			noPadding: {
				type: String,
				default () {
					return "";
				},
			},
			titleActiveColor: {
				type: String,
				default () {
					return "";
				},
			},
			type: String,
			color: {
				type: String,
				default () {
					return "";
				},
			},
			titleInactiveColor: {
				type: String,
				default () {
					return "";
				},
			},
			activeColor: {
				type: String,
				default () {
					return "";
				},
			},
			border: {
				type: String,
				default () {
					return "";
				},
			},
			background: {
				type: String,
				default () {
					return "";
				},
			},
			canTab: {
				type: Boolean,
				default () {
					return true;
				},

			},
			borderActiveColor: {
				type: String,
				default () {
					return '';
				},

			},
			borderColor: {
				type: String,
				default () {
					return '';
				},

			},

		},
		watch: {
			datas(newValue, oldValue) {
				
				// if(newValue.length&&(!oldValue||(oldValue&&oldValue.length==0))){
				// 	if (!this.activeType) {
				// 		if (this.datas && this.datas.length > 0) {
				// 			this.active = this.datas[0].id
							
				// 		}
				// 	}
				// }
			},
			activeType(newValue, oldValue) {

				this.active = newValue
			},
			active(newValue, oldValue) {
				
				this.datas.forEach((item, i) => {
					if (item.id == newValue) {
						this.currentIndex = i
					}
				})
				this.scrollIntoView()
				
			}
		},
		computed: {

			lineStyle() {
				var style =
					`width: ${this.lineWidth}px; transform: translateX(${this.lineOffsetLeft}px);background-color:${this.color};height:${this.lineHeight}px;transition-duration:${this.duration}s;`
				return style
			},
			tabViewStyle() {
				var style = '';
				if (this.type == 'scroll') {
					style += this.titleStyle
					style += `height:25px;`
				}
				if (this.type == 'line' || this.type == 'pic') {
					style += `color:${this.titleInactiveColor};`
				}
				if(this.type=='fk'){
					style += `color:${this.color};border:1px solid ${this.borderColor};border-radius: 4px;`
				}
				if (this.type == 'card') {
					style += this.titleStyle
				}


				return style
			},
			tabViewActStyle() {
				var style = '';
				if (this.type == 'scroll') {
					style += this.titleStyle
					style +=
						`border: 1px solid ${this.titleActiveColor};background:${this.titleActiveColor}15;color:${this.titleActiveColor};height:25px;`
				}
				if (this.type == 'line' || this.type == 'pic') {
					style += `color:${this.titleActiveColor};`
				}
				if (this.type == 'card') {
					style += `color:${this.titleActiveColor};background:${this.color};`
					if (this.border == 1) {
						style += `border-radius:15px;`
					}
					console.log(this.color)
				}
				if(this.type=='fk'){
					style += `color:${this.titleInactiveColor};border:1px solid ${this.borderActiveColor};border-radius: 4px;`
				}
				if (this.type == 'pic') {
					style += this.titleStyle
				}

				return style
			}
		},
		mounted() {
			if (!this.activeType) {
				
				if (this.datas && this.datas.length > 0) {
					this.active = this.datas[0].id
					
				}
			}
			

		},
		methods: {
			resize() {
				if (this.type !== 'line') {
					return;
				}
				Promise.all([
					getAllRect(this, '.tab'),
					getRect(this, '.tabs_line')
				]).then(([rects = [], lineRect]) => {
					const rect = rects[this.currentIndex];
					if (rect == null) {
						return;
					}
					let lineOffsetLeft = rects.slice(0, this.currentIndex).reduce((prev, curr) => prev + curr
						.width, 0);

					lineOffsetLeft += (rect.width - lineRect.width) / 2 + 8;

					this.lineOffsetLeft = lineOffsetLeft


				});
			},
			scrollIntoView() {

				// if (!this.scrollable) {
				//     return;
				// }
				Promise.all([
					getAllRect(this, '.tab'),
					getRect(this, '.tabs'),
				]).then(([tabRects, navRect]) => {
					if(!this.canShow){
						this.canShow = true
						if(navRect.width<uni.getSystemInfoSync().windowWidth){
							this.flex = true
						}
						this.$nextTick(()=>{
							this.scrollIntoView()
						})
						
						
					}else{
						const tabRect = tabRects[this.currentIndex];
						const offsetLeft = tabRects
							.slice(0, this.currentIndex)
							.reduce((prev, curr) => prev + curr.width, 0);
						console.log(navRect.width)
						this.scrollLeft = offsetLeft - (navRect.width - tabRect.width) / 2
						this.resize()
					}
					
					

				});
			},
			clickTab(tab, index) {
				if (this.active == tab.id) {
					return;
				}

				if (this.canTab) {
					this.active = tab.id
					this.$emit('clickTab', tab, index)
				}

			}
		},
	}
</script>

<style lang="less" scoped>

	.tabs_ui {

		&.canShow{
			.tabs {
				display: flex;
			}
		}
		.scroll-view {
			padding: 10px 0 0;
			

			&.noPadding {
				padding: 0;
			}
		}

		.tabs_line {
			position: absolute;
			bottom: 5px;
			left: -9px;
			z-index: 1;
			width: 40px;
			height: 3px;
			background-color: #fff;
			border-radius: 3px;

		}

		.tabs {
			position: relative;
			display: inline-flex;
			padding-bottom: 10px;
			margin: 0 12px;

			// &:first-child{
			// 	margin-left: 16px;
			// }

			&.flex{
				display: flex;
				.tab{
					flex: 1;
				}
			}
			&.line {

				.tab {
					margin: 0;
				}
			}

			&.pic {
				.tab {
					height: 48px;

					.tab_view {
						padding-top: 30px;
					}
				}
			}

			.tab {
				position: relative;
				min-width: 4em;
				height: 30px;
				align-items: center;
				justify-content: center;
				flex: none;
				font-size: 14px;
				display: flex;
				white-space: nowrap;
				padding: 0 12px;
				margin: 0 5px;
				box-sizing: border-box;


				&.active {

					.qp {
						display: block;
					}
					font-weight: bold;
				}

				.icon {
					position: absolute;
					top: 0;
					left: 0;
					height: 25px;
					width: 100%;
				}

				.qp {
					display: none;
					position: absolute;
					left: 50%;
					-webkit-transform: translateX(-50%);
					transform: translateX(-50%);
					bottom: -6px;
					width: 0;
					height: 0;
					border-top: 6px solid;
					border-left: 8px solid transparent;
					border-right: 8px solid transparent;
				}


			}
		}
	}
</style>
