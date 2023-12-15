<template>
  <div class="bottomDialogBoxCalendar" v-show='isShowDialog'>
    <div class="bottomDialogMask" v-bind:class="{fadeIn:isShowDialog,animated:isShowDialog}"></div>
    <div class="bottomDialog" v-bind:class="{slideInUp:isShowDialog,animated:isShowDialog}">
      <div class="title">
        {{title}}
        <i class="icon iconfont icon iconfont icon-a-16_guanbi_ciji" @click='hideDialog'></i>
      </div>
      <div class="dialogBox calendarChoose">
        <div class="calendar">
          <div class="weeks">
            <div class='weekDay red'>日</div>
            <div class='weekDay'>一</div>
            <div class='weekDay'>二</div>
            <div class='weekDay'>三</div>
            <div class='weekDay'>四</div>
            <div class='weekDay'>五</div>
            <div class='weekDay red'>六</div>
          </div>
          <div class="monthBoxWrapper">
            <div class="monthBox" v-for='(month,monthIndex) in timeArr' :key="monthIndex">
              <div class="monthTitle">
                <span class="theMonthTitle">{{month.currentTitle}}</span>
              </div>
              <div class="monthDay">
                <div class="day" v-for='(day,dayIndex) in month.days' @click='chooseDay(day)'
                  v-bind:class="{ unActive: !day.canTap, start:day.isCheckedIn,end:day.isCheckedOut,between:day.isCheckedBetween,oneDay:((day.isCheckedIn||day.isCheckedOut)&&zday==1)}"
                  :key="dayIndex" :style="getStyles(day)">
                  <div class="currentDay">
                    <tempalte v-if="day.isCheckedIn">
                      <p class="day2">{{isCheckedInTxt}}</p>
                    </tempalte>
                    <template v-else-if="day.isCheckedOut">
                      <p class="day2">{{isCheckedOutTxt}}</p>
                    </template>
                    <template v-else>
                      <p class="day2" v-if="day.displayDay">{{ day.displayDay}}</p>
                      <p class="day2" v-else>&nbsp;</p>
                    </template>
                    <p class="day1">{{ day.displayDay2 }}</p>
                    <p class="price" v-if="day.price>0">&yen;{{ day.price }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import { jAlert3 } from "@/base/jAlert/jAlert";
import { setStorage, getStorage } from "@/utils/wxuser";
import { hexToRgba } from "@/utils/utils";

export default {
  name: "calendar",
  /*props: {
        checkInDay: {
            type: String
        },
        checkOutDay: {
            type: String
        }
    },*/
  data() {
    return {
      isShowDialog: false,
      title: "住店日期",
      maxMonth: 12,
      flag: 0,
      timeArr: [],
      isTap: false,
      checkInDay: "",
      checkOutDay: "",
      colorTheme: getStorage("colorTheme"),
      fadeColor: "",
      isCheckedInTxt: "入住",
      isCheckedOutTxt: "离店",
    };
  },
  mounted() {
    if (this.colorTheme) {
      this.fadeColor = hexToRgba(this.colorTheme, 0.2);
    }
  },
  beforeDestroy() {},
  methods: {
    getStyles(day) {
      if (day.isCheckedBetween) {
        return { backgroundColor: this.fadeColor };
      }
    },
    showDialog() {
      this.isShowDialog = true;
      this.$emit("no-scroll", true);
    },
    hideDialog() {
      this.isShowDialog = false;
      this.$emit("no-scroll", false);
    },
    createDate() {
      let calendar = 366;
      let calendarDays = getStorage("calendarDays");
      if (calendarDays && !isNaN(Number(calendarDays))) {
        calendar = Number(calendarDays) - 1;
      }
      let month = calendar - dayjs().endOf("month").diff(dayjs(), "day");
      month = Math.ceil(month / 30) + 1;
      this.maxMonth = month;
      function getDate(year, month) {
        var d = new Date(year, month, 0);
        return d.getDate();
      }
      for (var i = 0; i < this.maxMonth; i++) {
        var timeObj = new Object();
        /*添加title*/
        var currentTitle = dayjs().add(i, "months").format("YYYY年M月");
        var currentMonth = dayjs().date(1).add(i, "months").toDate();
        /*添加日期实例*/
        var days = [];
        /*构造日历上月尾部*/
        var week = new Date(currentMonth.setDate(1)).getDay();
        var currentMonthDays = getDate(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1
        );
        timeObj.currentTitle = currentTitle;
        for (var k = 0; k < week; k++) {
          var day = {
            day: "",
            canTap: false,
            isCheckedIn: false,
            isCheckedOut: false,
            isCheckedBetween: false,
            displayDay: "",
          };
          days.push(day);
        }
        /*构造当月的日期*/

        for (var j = 0; j < currentMonthDays; j++) {
          var currentDay = dayjs(currentMonth).add(j, "days");
          var canTap = true;
          var isToday =
            currentDay.format("YYYY-MM-DD") == dayjs().format("YYYY-MM-DD");
          var lastDay = dayjs().add(calendar, "days");
          if (currentDay.isBefore(dayjs()) && !isToday) {
            canTap = false;
          }
          /*console.log(lastDay)*/
          if (currentDay.isAfter(lastDay)) {
            canTap = false;
          }
          var day = {
            day: currentDay.format("YYYY-MM-DD"),
            canTap: canTap,
            isCheckedIn: false,
            isCheckedOut: false,
            isCheckedBetween: false,
            displayDay: isToday ? "今天" : "",
            displayDay2: currentDay.format("D"),
          };
          if (this.isDawn() && getStorage("isOpenMidNight") == "T") {
            if (day.day == dayjs().subtract(1, "days").format("YYYY-MM-DD")) {
              day.canTap = true;
            }
          }
          days.push(day);
        }
        timeObj.days = days;
        this.timeArr.push(timeObj);
      }
    },
    isDawn() {
      var rushBuyStartTime = "YYYY-MM-DD 00:00";
      var rushBuyEndTime = "YYYY-MM-DD 06:00";
      var startTime = dayjs().format(rushBuyStartTime);
      var endTime = dayjs().format(rushBuyEndTime);
      let isDawn = false;
      if (dayjs().isAfter(startTime) && dayjs().isBefore(endTime)) {
        isDawn = true;
      }
      return isDawn;
    },
    chooseDay(item) {
      if (!item.canTap) {
        return false;
      }
      if (this.isTap) {
        return false;
      }
      this.isTap = true;
      if (this.flag == 0) {
        this.reSelect();
        this.checkInDay = item.day;
        item.isCheckedIn = true;
        this.flag = 1;
        jAlert3(`请选择${this.isCheckedOutTxt}时间`);
        this.isTap = false;
        return false;
      }
      if (this.flag == 1) {
        if (
          dayjs(item.day).isBefore(dayjs(this.checkInDay)) ||
          this.checkInDay == item.day
        ) {
          this.reSelect();
          this.checkInDay = item.day;
          item.isCheckedIn = true;
          this.isTap = false;
        } else {
          this.checkOutDay = item.day;
          item.isCheckedOut = true;
          this.selcetBetween();
          this.flag = 0;
          this.emitSelectDay();
          this.isTap = false;
          setTimeout(() => {
            this.hideDialog();
          }, 1000);
        }
        return false;
      }
    },
    reSelect() {
      for (let i = 0; i < this.timeArr.length; i++) {
        for (let j = 0; j < this.timeArr[i].days.length; j++) {
          var currentDay = this.timeArr[i].days[j];
          currentDay.isCheckedIn = false;
          currentDay.isCheckedOut = false;
          currentDay.isCheckedBetween = false;
        }
      }
    },
    selcetBetween() {
      for (let i = 0; i < this.timeArr.length; i++) {
        for (let j = 0; j < this.timeArr[i].days.length; j++) {
          var currentDay = this.timeArr[i].days[j];
          if (
            dayjs(currentDay.day).isAfter(dayjs(this.checkInDay)) &&
            dayjs(currentDay.day).isBefore(dayjs(this.checkOutDay))
          ) {
            currentDay.isCheckedIn = false;
            currentDay.isCheckedOut = false;
            currentDay.isCheckedBetween = true;
          }
        }
      }
    },
    initCalendar() {
      this.reSelect();
      /* this.checkInDay = dayjs().format('YYYY-MM-DD');
        this.checkOutDay = dayjs().add(1, 'days').format('YYYY-MM-DD');*/
      for (let i = 0; i < this.timeArr.length; i++) {
        for (let j = 0; j < this.timeArr[i].days.length; j++) {
          var currentDay = this.timeArr[i].days[j];
          if (currentDay.day == this.checkInDay) {
            currentDay.isCheckedIn = true;
            currentDay.isCheckedOut = false;
            currentDay.isCheckedBetween = false;
          }
          if (currentDay.day == this.checkOutDay) {
            currentDay.isCheckedIn = false;
            currentDay.isCheckedOut = true;
            currentDay.isCheckedBetween = false;
          }
        }
      }
      this.selcetBetween();
    },
    emitSelectDay() {
      var self = this;
      this.$emit("change-date", {
        checkInDay: self.checkInDay,
        checkOutDay: self.checkOutDay,
      });
    },
    init(obj) {
      this.checkInDay = obj.checkInDay;
      this.checkOutDay = obj.checkOutDay;
      if (obj.title) {
        this.title = obj.title;
      }
      if (obj.isCheckedInTxt) {
        this.isCheckedInTxt = obj.isCheckedInTxt;
      }
      if (obj.isCheckedOutTxt) {
        this.isCheckedOutTxt = obj.isCheckedOutTxt;
      }
      this.createDate();
      this.initCalendar();
    },
    addPrice(priceList) {
      let priceMap = {};
      priceList.forEach((n) => {
        priceMap[n.rsvDate] = n.price;
      });
      this.timeArr.forEach((n) => {
        n.days.forEach((m) => {
          if (priceMap[m.day]) {
            m.price = priceMap[m.day];
          }
        });
      });
      this.$forceUpdate();
    },
  },
  computed: {
    zday() {
      if (this.checkInDay && this.checkOutDay) {
        var arr = new Date(this.checkInDay.replace(/\-/g, "/")).getTime(),
          dep = new Date(this.checkOutDay.replace(/\-/g, "/")).getTime();
        var days = dep - arr;
        days = Math.round(days / 86400000);
        return days;
      }
    },
  },
};
</script>
<style lang="less">
.bottomDialogBoxCalendar {
  .bottomDialogMask {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .bottomDialog {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    z-index: 101;
    .title {
      height: 56px;
      line-height: 56px;
      text-align: center;
      font-size: 18px;
      color: #000;
      font-weight: bold;
      background: #fff;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      position: relative;
      .iconfont {
        position: absolute;
        color: #000000;
        font-size: 18px;
        left: 5px;
        top: -10px;
        border: 10px solid transparent;
      }
    }
    .dialogBox {
      background-color: #f8f8f8;
      padding: 0 12px 12px 12px;
      &.calendarChoose {
        background: #fff;
        padding: 0px;
        .calendar {
          .weeks {
            display: flex;
            background: #f2f3f5;
            padding: 0 6px;
            .weekDay {
              flex: 1;
              height: 36px;
              line-height: 36px;
              font-size: 12px;
              color: #808080;
              text-align: center;
              &.red {
                color: #a43127;
              }
            }
          }
          .monthBoxWrapper {
            max-height: 420px;
            overflow-y: scroll;
            padding: 0 6px;
          }
          .monthBox {
            .monthTitle {
              padding-left: 16px;
              padding-top: 7px;
              .theMonthTitle {
                font-size: 14px;
                color: #000;
                position: relative;
                font-weight: bold;
              }
            }
            .monthDay {
              display: flex;
              flex-wrap: wrap;
              .day {
                width: 14.285%;
                height: 58px;
                text-align: center;
                font-size: 14px;
                color: #666;
                font-weight: lighter;
                transition: color 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                margin-bottom: 6px;
                font-weight: normal;
                .price {
                  font-size: 10px;
                  color: #333;
                  margin-top: 5px;
                }
                .currentDay {
                  height: 100%;
                  .day1 {
                    font-size: 15px;
                    color: #333;
                    font-weight: bold;
                  }
                  .day2 {
                    font-size: 8px;
                    margin-bottom: 5px;
                    margin-top: 10px;
                  }
                }
                &.unActive {
                  .currentDay {
                    opacity: 1;
                    .day1 {
                      color: #ccc;
                      font-weight: normal;
                    }
                  }
                }
                &.start,
                &.end {
                  .currentDay {
                    background: #a43127;
                    color: #fff;
                    border-radius: 3px;
                    height: 100%;
                    width: 100%;
                  }
                  .day1 {
                    color: #fff;
                  }
                  .price {
                    color: #fff;
                  }
                }
                &.start {
                  &.oneDay {
                    .currentDay {
                      border-top-right-radius: 0px;
                      border-bottom-right-radius: 0px;
                    }
                  }
                  ::after {
                    width: 5px;
                    height: 58px;
                    position: absolute;
                    left: calc(~"100% - 2px");
                    top: 0;
                    //background: rgba(66,66,53,0.16);
                    content: " ";
                  }
                }
                &.end {
                  &.oneDay {
                    .currentDay {
                      border-top-left-radius: 0px;
                      border-bottom-left-radius: 0px;
                    }
                  }
                  ::before {
                    width: 10%;
                    height: 50px;
                    position: absolute;
                    left: -5%;
                    top: 0;
                    background: transparent;
                    content: " ";
                    z-index: -1;
                  }
                }
                &.between {
                  background: rgba(164, 49, 39, 0.16);
                  color: #000;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
