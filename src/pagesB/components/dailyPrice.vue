<template>
	<div class="ui_dailyPrice">
		<div class="dailyPriceBox">
			<div class="monthList">
				<div class="monthItem" v-for="(month,monthIndex) in timeArr" :key="monthIndex"
					v-bind:class="{ active: month.isActive}" @click="changeCurrent(month,monthIndex)">
					<p class="timeTitle">{{month.currentTitle}}</p>
					<!-- <p class="minPrice">&yen;{{month.minPrice}}起</p> -->
				</div>
			</div>
			<div class="calendar">
				<div class="weeks">
					<div class='weekDay weekend'>日</div>
					<div class='weekDay'>一</div>
					<div class='weekDay'>二</div>
					<div class='weekDay'>三</div>
					<div class='weekDay'>四</div>
					<div class='weekDay'>五</div>
					<div class='weekDay weekend'>六</div>
				</div>
				<div class="monthBoxWrapper">
					<div class="monthBox">
						<div class="monthDay">
							<div class="day" v-for='(day,dayIndex) in currentDays' @click='chooseDay(day)'
								v-bind:class="{ unActive: !day.canTap||(!day.price&&day.price!==0)||day.number<=0,active:day.isActive}" :key="dayIndex">
								<sapn class="number"  v-if="day.number<=0">满员</sapn>
								<sapn class="number"  v-else-if="day.number">余{{day.number}}</sapn>
								<sapn class="number" v-else>&nbsp;&nbsp;&nbsp;</sapn>
								<span class='currentDay'>{{day.displayDay}}</span>
								<span class="currentPrice" v-if="day.price||day.price===0">&yen;{{day.price}}</span>
								<span class="currentPrice" v-else>&nbsp;&nbsp;&nbsp;</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		setStorage,
		getStorage
	} from "@/utils/wxuser";
	import api from "@/utils/api";
	import dayjs from "dayjs";

	let config = {};

	export default {
		props: {},
		name: "dailyPrice",
		data() {
			return {
				title: "请选择出发日期",
				timeArr: [],
				dayList: [],
				currentIndex: 0,
				currentDays: [],
			};
		},
		created() {
			config = getStorage("config");
		},
		mounted() {
			this.createDate();
		},
		onUnload() {},
		methods: {
			changeCurrent(month, monthIndex) {
				this.currentIndex = monthIndex;
				this.currentDays = this.timeArr[this.currentIndex].days;
				this.timeArr.forEach((n) => {
					n.isActive = false;
				});
				month.isActive = true;
			},
			chooseDay(day) {
				if (day.canTap && day.number&&(day.price||day.price===0)) {
					this.currentDays.forEach((n) => {
						if(day.embarkDate==n.embarkDate){
							n.isActive = true;
						}else{
							n.isActive = false;
						}
						
					});
					// day.isActive = true;
					let nextdays = day;
					// nextdays.push({
					// 	isActive: true,
					// 	price: day.price,
					// 	time: dayjs(day.day).format("MM-DD"),
					// 	voyageNo: day.voyageNo,
					// });
					// this.dayList.forEach((n, i) => {
					// 	if (
					// 		dayjs(day.day).isBefore(dayjs(n.embarkDate).format("YYYY-MM-DD")) &&
					// 		n.price
					// 	) {
					// 		let currentDay = {
					// 			isActive: false,
					// 			price: n.price,
					// 			time: dayjs(n.embarkDate).format("MM-DD"),
					// 			voyageNo: n.voyageNo,
					// 			day: dayjs(n.embarkDate).format("YYYY-MM-DD"),
					// 			id: n.id,
					// 			childResrvInfo: n.childResrvInfo,
					// 			endDate: dayjs(n.endDate).format("YYYY-MM-DD"),
					// 		};
					// 		nextdays.push(n);
					// 	}
					// });
					// nextdays = nextdays.slice(0, 1);
					console.log(nextdays)
					this.$emit("change-dailyPrice",nextdays);
					// setTimeout(() => {
					//   this.hideDialog();
					// }, 200);
				}
			},
			createDate(dayList = []) {
				this.timeArr = [];
				this.dayList = [];
				this.currentIndex = 0
				this.currentDays = []
				dayList.forEach(item=>{
					console.log(dayjs(item.embarkDate).diff(dayjs().endOf('month'),'month'))
					if(dayjs(item.embarkDate).diff(dayjs().endOf('month'),'month')>=0){
						this.dayList.push(item)
					}
				})
				// this.dayList = dayList;
				let monthMap = new Object();
				let monthListOld = [];
				
				this.dayList.forEach((n) => {
					let currentMonth = dayjs(n.embarkDate).format("YYYY-MM");
					if (!monthMap[currentMonth]) {
						monthMap[currentMonth] = n.price;
					}
					if (monthMap[currentMonth] && n.price < monthMap[currentMonth].price) {
						monthMap[currentMonth].price = n.price;
					}
				});
				Object.keys(monthMap).map((key) => {
					monthListOld.push({
						time: key,
						price: monthMap[key],
					});
				});
				let monthList = monthListOld.slice(0, 3);
				let calendar = 366;

				function getDate(year, month) {
					var d = new Date(year, month, 0);
					return d.getDate();
				}
				for (var i = 0; i < monthList.length; i++) {
					var timeObj = new Object();
					/*添加title*/
					var currentTitle = dayjs(monthList[i].time).format("M月");
					var currentMonth = dayjs(monthList[i].time)
						.date(1)
						.add(0, "months")
						.toDate();
					/*添加日期实例*/
					var days = [];
					/*构造日历上月尾部*/
					var week = new Date(currentMonth.setDate(1)).getDay();
					var currentMonthDays = getDate(
						currentMonth.getFullYear(),
						currentMonth.getMonth() + 1
					);
					timeObj.currentTitle = currentTitle;
					timeObj.minPrice = monthList[i].price;
					if (i == 0) {
						timeObj.isActive = true;
					} else {
						timeObj.isActive = false;
					}
					for (var k = 0; k < week; k++) {
						var day = {
							day: "",
							canTap: false,
							isActive: false,
							displayDay: "",
						};
						days.push(day);
					}
					/*构造当月的日期*/
					for (var j = 0; j < currentMonthDays; j++) {
						var currentDay = dayjs(currentMonth).add(j, "days");
						var canTap = true;
						var lastDay = dayjs().add(calendar, "days");
						if (currentDay.isBefore(dayjs())) {
							canTap = false;
						}
						if (currentDay.isAfter(lastDay)) {
							canTap = false;
						}
						var day = {
							day: currentDay.format("YYYY-MM-DD"),
							canTap: canTap,
							displayDay: currentDay.format("D"),
							price: "",
							isActive: false,
							voyageNo: "",
						};
						this.dayList.forEach((n) => {
			
							if (
								dayjs(n.embarkDate).format("YYYY-MM-DD") ==
								currentDay.format("YYYY-MM-DD")
							) {
								day = Object.assign(day,n)
								// day.price = n.price;
								// day.number = n.number;
								// day.voyageNo = n.voyageNo;
								// day.boatId = n.boatId;
								// day.boatCode = n.boatCode;
							}
						});
						days.push(day);
					}
					timeObj.days = days;
					this.timeArr.push(timeObj);
					console.log(this.timeArr)

					this.currentDays = this.timeArr[0].days;
				}
			},

		},
	};
</script>
<style lang="less">
	@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");

	.ui_dailyPrice {
		.dailyPriceBox {
			.monthList {
				margin: 0 16px;
				height: 42px;
				display: flex;
				align-items: center;
				border-bottom: 0.5px solid #EEEEEE;

				.monthItem {
					position: relative;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					height: 100%;
					position: relative;
					margin-right: 28px;

					&.active {

						.timeTitle,
						.minPrice {
							color: #000000;
							font-weight: bold;
						}

						&::after {
							content: "";

							height: 3px;
							background: #A43127;

							position: absolute;
							bottom: -1px;
							left: 0;
							right: 0;
						}
					}

					.timeTitle {
						font-size: 14px;
						color: #666666;
					}

					.minPrice {
						font-size: 12px;
						color: #999999;
						margin-top: 5px;
					}
				}
			}

			.calendar {
				.weeks {
					display: flex;

					.weekDay {
						flex: 1;
						height: 36px;
						line-height: 36px;
						font-size: 12px;
						color: #333333;
						text-align: center;

						&.weekend {
							color: #A43127;
						}
					}
				}

				.monthBoxWrapper {
					max-height: 420px;
					overflow-y: scroll;
					padding: 0 5px;
					padding-bottom: 20px;
				}

				.monthBox {
					.monthDay {
						display: flex;
						flex-wrap: wrap;

						.day {
							width: 14.285%;
							height: 58px;
							text-align: center;
							font-size: 14px;
							color: #000;
							transition: color 0.2s;
							display: flex;
							align-items: center;
							justify-content: center;
							position: relative;
							margin-top: 4px;
							flex-direction: column;
							transition: all 0.5s;

							&.unActive {
								.currentDay,
								.number,
								.currentPrice {
									color: #ccc;

								}
								
							}

							&.active {
								background: #A43127;
								border-radius: 5px;

								.currentDay,
								.number,
								.currentPrice {
									color: #fff;

								}

								.number,.currentPrice {
									opacity: 0.7;
								}
							}

							.number {
								line-height: 1;
								color: #000000;
								font-size: 10px;
							}

							.currentDay {
								margin-top: 4px;
								line-height: 1;
								font-size: 14px;
								color: #000;
							}

							.currentPrice {
								line-height: 1;
								color: #000000;
								font-size: 10px;
								margin-top: 4px;
							}
						}
					}
				}
			}
		}
	}
</style>