<template>
  <div class="activity_dailyPrice">
    <div class="daily_top">
      <div class="dailyPriceBox" :style="{ height: wrapperHeight }">
        <div
          class="monthList"
          v-bind:class="{
            dateScroll: !isCollapsed,
          }"
        >
          <div
            class="monthItem active"
            v-for="(month, monthIndex) in timeArr"
            :key="monthIndex"
          >
            <div class="timeTitle">{{ month.currentTitle }}</div>
            <!-- <p class="minPrice">&yen;{{month.minPrice}}起</p> -->
            <div class="calendar">
              <div class="weeks">
                <div class="weekDay weekend">日</div>
                <div class="weekDay">一</div>
                <div class="weekDay">二</div>
                <div class="weekDay">三</div>
                <div class="weekDay">四</div>
                <div class="weekDay">五</div>
                <div class="weekDay weekend">六</div>
              </div>
              <div class="monthBoxWrapper">
                <div class="monthBox">
                  <div class="monthDay">
                    <div
                      class="day"
                      v-for="(day, dayIndex) in month.days"
                      @click="chooseDay(day)"
                      v-bind:class="{
                        unActive: !day.canTap || day.number <= 0 || !day.number,
                        active: day.isActive,
                        // isShow: !day.isShow,
                      }"
                      :key="dayIndex"
                    >
                      <!-- <sapn
                        class="number_text number_color"
                        v-if="day.number && day.number > 0"
                        >余{{ day.number }}份</sapn
                      > -->
                      <sapn
                        class="number_text number_color"
                        v-if="day.capacityType != 'INFINITY'"
                        v-bind:class="{
                          hidden_content: !(day.number && day.number > 0),
                        }"
                        >余{{ day.number }}份</sapn
                      >
                      <sapn
                        class="number_text number_full"
                        v-if="day.number <= 0"
                        >已满</sapn
                      >
                      <sapn class="number" v-else></sapn>
                      <span class="currentDay">{{ day.displayDay }}</span>
                      <div>
                        <div
                          class="currentPrice"
                          v-if="day.priceType == 'FREE'"
                        >
                          免费
                        </div>
                        <div v-else>
                          <span class="currentPrice" v-if="day.price"
                            >&yen;{{ day.price }}起</span
                          >
                          <span class="currentPrice" v-else></span>
                        </div>
                      </div>
                      <!-- <span class="currentPrice" v-if="day.price"
                        >&yen;{{ day.price }}</span
                      >
                      <span
                        class="currentPrice"
                        v-else-if="day.priceType == 'FREE'"
                        >免费</span
                      >
                      <span class="currentPrice" v-else></span> -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="open-btn" v-if="isCollapsed" @click="toggleCollapse">
        <i class="iconfont icon-a-16_xialajiantou_hei"></i>
      </div>
      <div class="open-btn" v-if="!isCollapsed" @click="toggleCollapse">
        <i class="iconfont icon-a-16_shanglajiantou_hei"></i>
      </div>
      <div class="open-btn-border"></div>
    </div>
    <div class="time_wrap">
      <div class="dates">
        <div
          class="date_time"
          @click="chooseTime(citem)"
          v-bind:class="{ active: citem.isActive, unActive: !citem.canSelect }"
          v-for="(citem, ic) in timeRangeList"
          :key="ic"
        >
          <div class="time_val">{{ citem.startDate }}-{{ citem.endDate }}</div>
          <div class="time_num" v-if="citem.capacityType != 'INFINITY'">
            余{{ citem.capacity }}份
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setStorage, getStorage } from "@/utils/wxuser";
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
      timeRangeList: [],
      selectDay: {},
      isCollapsed: true,
      contentHeight: "",
      wrapperHeight: 150 + "px",
    };
  },
  created() {
    config = getStorage("config");
  },
  mounted() {
    this.createDate();
    this.toggleCollapse();
  },
  onUnload() {},
  methods: {
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed;
      this.wrapperHeight = this.isCollapsed ? 150 + "px" : 400 + "px";
    },
    changeCurrent(month, monthIndex) {
      this.currentIndex = monthIndex;
      this.currentDays = this.timeArr[this.currentIndex].days;
      this.timeArr.forEach((n) => {
        n.isActive = false;
      });
      month.isActive = true;
    },
    chooseTime(ctime) {
      if (ctime.canSelect) {
        this.timeRangeList.forEach((n) => {
          if (ctime.startDate == n.startDate) {
            n.isActive = true;
          } else {
            n.isActive = false;
          }
        });
        let nextTime = {
          time: ctime.startDate + "-" + ctime.endDate,
          ...ctime,
        };
        this.selectDay = Object.assign(this.selectDay, nextTime, {
          nextTime: nextTime,
        });
        this.$emit("change-dailyPrice", this.selectDay);
        // this.$emit("change-dailyPrice", nextTime);
      }
    },
    chooseDay(day) {
      if (day.canTap && day.number > 0) {
        this.currentDays.forEach((n) => {
          if (day.embarkDate == n.embarkDate) {
            n.isActive = true;
          } else {
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
        this.selectDay = nextdays;
        // console.log(day, "day-----------------");
        let canSelectTime = dayjs().add(
          day.earlyDay == 0 ? -24 : day.earlyDay,
          "hour"
        );
        nextdays.calendarWithPriceDto.map((ctem) => {
          ctem.capacityType = day.capacityType;
          let time = ctem.bizDate + " " + ctem.startDate + ":00";
          if (
            !dayjs(time).isAfter(dayjs(canSelectTime)) &&
            day.resrvRule == "ONE_HOUR" &&
            dayjs(dayjs().format("YYYY-MM-DD")).isSame(
              dayjs(ctem.bizDate).format("YYYY-MM-DD")
            )
          ) {
            ctem.canSelect = false;
          } else {
            ctem.canSelect = true;
          }
        });
        this.timeRangeList = nextdays.calendarWithPriceDto;
        this.$emit("change-dailyPrice", nextdays);
        // setTimeout(() => {
        //   this.hideDialog();
        // }, 200);
      }
    },
    createDate(dayList = []) {
      this.timeArr = [];
      this.dayList = [];
      this.currentIndex = 0;
      this.currentDays = [];
      // this.dayList = dayList;
      // let monthMap = new Object();
      // let monthListOld = [];
      let resrvRule = this.dayList.length > 0 ? this.dayList[0].resrvRule : "";
      let earlyDay = this.dayList.length > 0 ? this.dayList[0].earlyDay : 1;
      // dayList.forEach((n) => {
      //   let currentMonth = dayjs(n.embarkDate).format("YYYY-MM");
      //   if (!monthMap[currentMonth]) {
      //     monthMap[currentMonth] = n.price;
      //   }
      //   if (monthMap[currentMonth] && n.price < monthMap[currentMonth].price) {
      //     monthMap[currentMonth].price = n.price;
      //   }
      // });
      dayList.forEach((item) => {
        console.log(
          dayjs(item.embarkDate).diff(dayjs().endOf("month"), "month")
        );
        if (dayjs(item.embarkDate).diff(dayjs().endOf("month"), "month") >= 0) {
          this.dayList.push(item);
        }
      });
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
        var currentTitle = dayjs(monthList[i].time).format("YYYY年M月");
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
        // if (i == 0) {
        //   timeObj.isActive = true;
        // } else {
        //   timeObj.isActive = false;
        // }
        timeObj.isActive = true;
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
          var isShow = true;
          var lastDay = dayjs().add(calendar, "days");
          let curDay = dayjs();
          let canSelectDay = dayjs()
            .add(resrvRule == "ONE_DAY" ? earlyDay - 1 : -1, "day")
            .format("YYYY-MM-DD");
          if (dayjs(currentDay).isAfter(dayjs(canSelectDay))) {
            canTap = true;
          } else {
            canTap = false;
          }
          // if (currentDay.isBefore(dayjs()) && currentDay.diff(dayjs(), "day")) {
          //   isShow = false;
          // }
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
            isShow: isShow,
          };
          this.dayList.forEach((n) => {
            if (
              dayjs(n.embarkDate).format("YYYY-MM-DD") ==
              currentDay.format("YYYY-MM-DD")
            ) {
              day = Object.assign(day, n);
              day.price = n.price;
              day.number = n.sumCapacity;
              day.priceType = n.priceType;
              day.capacityType = n.capacityType;
              // day.boatId = n.boatId;
              // day.boatCode = n.boatCode;
            }
          });
          if (day.dateList) {
            let ctIndex = day.dateList.calendarWithPriceDto.findIndex(
              (citem) => {
                return citem.canSelect;
              }
            );
            if (ctIndex == -1) {
              day.canTap = false;
            }
          }
          days.push(day);
        }
        timeObj.days = days;
        this.timeArr.push(timeObj);
        this.timeArr.map((ctom) => {
          this.currentDays = this.currentDays.concat(ctom.days);
        });
        // this.currentDays = this.timeArr[0].day说s;
      }
    },
  },
};
</script>
<style lang="less">
@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");

.activity_dailyPrice {
  .daily_top {
    // padding-top: 16px;
    background: #fff;
    margin-bottom: 16px;
    .open-btn {
      padding-bottom: 10px;
      z-index: 999;
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;

      .icon-a-12_xialajiantou_hei,
      .icon-a-12_shanglajiantou_hei {
        // margin-left: 5px;
        font-size: 16px;
      }
    }
    .open-btn-border {
      left: 0;
      right: 0;
      bottom: 0;
      height: 2rpx;
      background: #eee;
      transform: scaleY(0.5);
    }
  }
  .dailyPriceBox {
    background: #fff;
    overflow: hidden;
    transition: height 0.2s ease-in-out;
    .dateScroll {
      height: 100%;
      overflow-y: auto;
    }
    .monthList {
      // margin: 0 16px;
      // height: 60px;
      // display: flex;
      // align-items: center;
      // border-bottom: 0.5px solid #eeeeee;

      .monthItem {
        // position: relative;
        // display: flex;
        // flex-direction: column;
        // align-items: center;
        // justify-content: center;
        height: 100%;
        // position: relative;
        // margin-right: 28px;

        &.active {
          .timeTitle,
          .minPrice {
            color: #000000;
            font-weight: bold;
          }

          // &::after {
          //   content: "";

          //   height: 3px;
          //   background: #a43127;

          //   position: absolute;
          //   bottom: -1px;
          //   left: 0;
          //   right: 0;
          // }
        }

        .timeTitle {
          margin-left: 16px;
          font-size: 14px;
          color: #666666;
          height: 30px;
          line-height: 30px;
          margin-bottom: 8px;
          font-style: normal;
          font-family: PingFang SC;
          font-weight: 500;
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
          width: 14.285%;
          // width: 52px;
          // flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 28px;
          line-height: 28px;
          font-size: 12px;
          color: #333333;
          text-align: center;
          font-family: PingFang SC;
          font-style: normal;
          font-weight: 400;
          &.weekend {
            color: #a43127;
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
            // width: 52px;
            height: 52px;
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

            &.isShow {
              display: none;
            }

            &.active {
              border: 1px solid #a43127;
              // background: #a43127;
              border-radius: 4px;

              // .currentDay,
              // .number,
              // .number_text,
              // .currentPrice {
              //   color: #fff;
              // }

              // .number,
              // .currentPrice {
              //   opacity: 0.7;
              // }
            }
            .number_text {
              font-size: 10px;
              &.hidden_content {
                visibility: hidden;
              }
            }
            .number {
              line-height: 1;
              color: #000000;
              font-size: 10px;
            }
            .number_color {
              color: #a43127;
            }
            .number_full {
              color: #ccc;
            }
            .currentDay {
              margin-top: 4px;
              line-height: 1;
              font-size: 14px;
              color: #000;
              font-family: PingFang SC;
              font-style: normal;
              font-weight: bold;
            }

            .currentPrice {
              line-height: 1;
              color: #000000;
              font-size: 10px;
              margin-top: 4px;
            }
            &.unActive {
              // opacity: 0.5;
              .currentDay {
                color: rgba(204, 204, 204, 1);
              }
              .currentPrice {
                color: rgba(204, 204, 204, 1);
              }
              .number_color {
                // color: #a43127;
                color: rgba(204, 204, 204, 1);
              }
            }
          }
        }
      }
    }
  }
  .time_wrap {
    overflow: hidden;
  }
  .dates {
    display: flex;
    flex-wrap: wrap;
    margin-left: 16px;
    margin-right: 16px;
    .date,
    .date_time {
      height: 52px;
      width: 30.318%;
      margin-bottom: 16px;
      margin-right: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background: #ffffff;
      border-radius: 8px;
      padding: 12px 0px;
      // box-sizing: border-box;
      border: 1px solid #fff;
      border-radius: 4px;
      border: 0.5px solid #ccc;
      margin-right: 4.26666%;
      &.active {
        font-weight: bold;
        border: 1px solid #a43127;
      }
      &.unActive {
        opacity: 0.5;
        .time_val {
          color: rgba(204, 204, 204, 1);
        }
        .time_num {
          color: rgba(204, 204, 204, 1);
        }
      }
      .label {
        font-size: 12px;
        line-height: 1;
        color: #808080;
      }
      .val {
        margin-top: 8px;
        font-size: 16px;
        line-height: 1;
        color: #000000;

        font-weight: bold;
        white-space: nowrap;
      }
      .price {
        margin-top: 8px;
        font-size: 12px;
      }

      // &:first-child {
      //   margin-left: 16px;
      // }

      // &:last-child {
      //   margin-right: 16px;
      // }
    }
    // .date_time:not(:nth-child(3n)) {
    //   margin-right: calc(6% / 3);
    // }
    .date_time:nth-of-type(3n) {
      margin-right: 0 !important;
    }
    .timeRange_wrap {
      margin-top: 12px;
    }
    .time_val {
      min-width: 84px;
      font-size: 14px;
      // font-weight: 400;
      line-height: 14px;
      letter-spacing: 0px;
      text-align: center;
      color: rgba(0, 0, 0, 1);
      // text-align: center;
      font-family: PingFang SC;
      // font-size: 14px;
      font-style: normal;
      line-height: 1;
    }
    .fontActive {
      font-weight: bold;
    }
    .time_num {
      font-size: 10px;
      color: #808080;
      margin-top: 4px;
      text-align: center;
      font-family: PingFang SC;
      // font-size: 10px;
      font-style: normal;
      font-weight: 400;
      line-height: 1;
    }
  }
}
</style>
