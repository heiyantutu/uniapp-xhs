<template>
  <div class="memberCenter_wrap">
    <!-- #ifdef MP -->
    <coustom-head title="会员中心" bgColor="none" nativeMode="true">
    </coustom-head>
    <!-- #endif -->
    <img
      class="memberCenterBg"
      style="height: 200px"
      :src="memberCenterBg"
      mode="widthFix"
    />
    <div class="cardContent">
      <!-- <p class="cardName">绿绒蒿会员</p>
          <p class="currentLevel">当前等级</p>
          <p class="cardLimit">累计5,000元，距升级还需15,000元</p>
          <div class="cardProcess">
            <div class="process"></div>
          </div> -->
      <swiper
        class="userCard memberCardList"
        id="tabContent"
        :current="tabIndex"
        @change="tabChange"
        :circular="false"
        previous-margin="36rpx"
        next-margin="36rpx"
      >
        <swiper-item
          class="swiper-box-item"
          v-for="(item, index) in cardList.swpierCardList"
          :key="index"
        >
          <div class="swiper_contant">
            <img class="swipe_img" :src="item.faceAttr" alt="" />
            <div class="text_position">
              <div class="cardName">{{ item.descript }}</div>
              <div class="currentLevel">
                <span v-if="index == curText">{{
                  "当前等级"
                }}</span>
                <span v-else>{{ item.remark }}</span>
              </div>
              <!-- <div class="currentLevel">{{ item.levelRule }}</div> -->
              <div class="cardLimit">
                <div v-if="curText == index" class="on_row">
                  <div v-if="item.code.indexOf('JG') == 0" class="on_row">
                    您已成为<span>{{ item.descript }}</span
                    >会员<span>{{ curday }}</span
                    >天
                    <!-- <i class="iconfont icon icon-a-12_tishi_bai"></i> -->
                  </div>
                  <div v-else class="on_row">
                    {{ item.desc }}
                    <!-- <span v-if="item.isMatchCondition">{{ "已完成保级" }}</span>
                    <span v-else>{{ item.desc }}</span> -->
                    <!-- <i
                      v-if="item.desc"
                      class="iconfont icon icon-a-12_tishi_bai"
                    ></i> -->
                  </div>
                </div>
                <div v-else>
                  <div v-if="index > curText" class="on_row">
                    {{ item.desc }}
                    <!-- <span v-if="item.isMatchCondition">{{ "已完成保级" }}</span>
                    <span v-else>{{ item.desc }}</span> -->
                    <!-- <i
                      v-if="item.desc"
                      class="iconfont icon icon-a-12_tishi_bai"
                    ></i> -->
                  </div>
                  <div v-else class="on_row">
                    {{ "已超越该等级" }}
                    <!-- <i class="iconfont icon icon-a-12_tishi_bai"></i> -->
                  </div>
                  <!-- {{ index > curText ? item.desc : "已超越该等级" }} -->
                </div>
              </div>
              <div class="cardProcess" v-if="item.speed && index >= curText">
                <div class="process" :style="item.speed"></div>
              </div>
            </div>
          </div>
        </swiper-item>
      </swiper>
    </div>
    <div class="contant_wrap">
      <div class="member_center">
        <div class="member_wrap">
          <div class="member_title">会员权益</div>
          <div class="member_more" @click="goPolicy()">
            会员政策<i
              class="icon_more iconfont icon-a-12_youlajiantou_hui"
            ></i>
          </div>
        </div>
        <div class="member_list">
          <div
            class="list_item"
            @click.stop="showDialog(right)"
            v-for="(right, rIndex) in cardList.cardLevelRightsList"
            :key="rIndex"
          >
            <div class="item_in">
              <img class="left_img" :src="right.iconUrl" alt="" />
              <div class="right_cont">
                <div class="right_tit">{{ right.name }}</div>
                <div class="right_text">{{ right.remark }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="coupon_center" @click="goCollectCenter">领券中心</div>
      <div class="member_task" v-if="cardList.activityList.length > 0">
        <div class="task_title">会员任务</div>
        <div
          class="task_wrap"
          @click="goAuth(item)"
          v-for="(item, index) in cardList.activityList"
          :key="index"
        >
          <div class="task_main">
            <div class="confirm">{{ item.taskName }}</div>
            <div class="num">+{{ item.prize }}积分</div>
          </div>
          <div class="go_finish">
            <div v-if="item.isComplete == 'T'" class="has_confirm">已认证</div>
            <div v-else class="go_confirm">未认证</div>
            <!-- {{ item.isComplete == "T" ? "已认证" : "未认证" }} -->
          </div>
        </div>
      </div>
      <bottom-dialog ref="checkIn" maxDialog titleBorder="true">
        <!-- <div class="receive-layer"> -->
        <div class="receive-box">
          <!-- <div class="head">
            <i class="iconfont icon-a-20_guanbi" @click="hideDialog"></i>
          </div> -->
          <div class="receive_mian">
            <div class="icon_wrap">
              <img class="right_icon" :src="rightData.iconUrl" alt="" />
            </div>
            <div class="cont_title">{{ rightData.name }}</div>
            <div class="cont_text">{{ rightData.remark }}</div>
            <!-- <div class="cont_text" v-html="rightData.descript"></div> -->
            <!-- <div class="use_type">
              <div class="use_left">使用期限</div>
              <div class="use_right">2023年12月31日</div>
            </div>-->
            <div class="use_type">
              <div class="use_left">使用方式</div>
              <div class="use_right" v-html="rightData.useDescript"></div>
            </div>
            <!-- <div class="use_type" v-html="rightData.useDescript"></div> -->
            <div class="use_tip" v-html="rightData.descript"></div>
          </div>
        </div>
        <!-- <div class="bg"></div> -->
        <!-- </div> -->
      </bottom-dialog>
    </div>
    <div class="zhanWei"></div>
  </div>
</template>

<script setup lang="ts">
import {
  reactive,
  defineComponent,
  ref,
  computed,
  onMounted,
  nextTick,
} from "vue";
import api from "@/utils/api";
import { onShow, onLoad } from "@dcloudio/uni-app";
import { getStorage, setStorage } from "@/utils/wxuser";
import { goPageWithUser, toLogin, addNum, subtraction } from "@/utils/utils";
import { login, createUrl } from "@/utils/utils";
import { jAlert3 } from "@/base/jAlert/jAlert";
import bottomDialog from "@/components/bottomDialog.vue";
import coustomHead from "@/components/coustomHead.vue";
import getMemberUI from "@/utils/getMemberUI";
import dayjs from "dayjs";
import { valFormat } from "@/utils/filter";

let config = getStorage("config");
let user = getStorage("user");
let wxuser = getStorage("wxuser");
let policyData = ref();
let memberProcess = ref<any>([]);
let rightData = ref({});
let swiperCurrent = ref(1);
const checkIn = ref();
let cardLevel: any = ref();
let tabIndex: any = ref(0);
let curText: any = ref(0);
let curday: any = ref(0);
let listOrder: any = ref(0);
let memberCenterBg = ref("");
onShow(() => {
  user = getStorage("user");
  // if (user && user.memberId) {
  //   // membercardInterestDesc();
  //   queryMemberUpgradeInfo();
  // }
  getTaskList();
  getCardList();
  memberCenterBg.value = getMemberUI(user.cardLevel).memberCenterBg;
});
onLoad((options: any) => {
  if (options.cardLevel) {
    cardLevel.value = options.cardLevel;
  }
});
let cardList = reactive({
  dataArr: <number[]>[],
  activityList: <number[]>[],
  swpierCardList: <number[]>[],
  cardLevelRightsList: <number[]>[],
});

let showGet = ref(false);
const showDialog = (right: any) => {
  // showGet.value = true;
  rightData.value = right;
  checkIn.value.showDialog();
};
const hideDialog = () => {
  // showGet.value = false;
  checkIn.value.hideDialog();
};
const tabChange = (e: any) => {
  let index = e.target.current || e.detail.current; // 获取到当前移动到第几个
  switchTab(index);
  cardList.cardLevelRightsList = cardList.swpierCardList[index].icons
    ? JSON.parse(cardList.swpierCardList[index].icons)
    : [];
  // console.log(cardList.swpierCardList[index],"cardList.swpierCardList[index]---------")
  memberCenterBg.value = getMemberUI(
    cardList.swpierCardList[index].cardLevel
  ).memberCenterBg;
};
const switchTab = (index: any) => {
  if (tabIndex == index) {
    return;
  }
  tabIndex.value = index;
};
const membercardInterestDesc = async (cardLevel: any) => {
  let cardListArr = "";
  let res = await api.membercardInterestDesc({
    hotelGroupCode: config.hotelGroupCode,
    hotelCode: config.hotelCode,
    cardCode: cardLevel,
  });
  if (res.result == 1) {
    if (res.retVal.interestDesc && res.retVal.interestDesc != undefined) {
      policyData.value = res.retVal.interestDesc;
    }
    cardListArr = res.retVal;
  }
  return cardListArr;
};
const queryMemberUpgradeInfo = async () => {
  var opt = {
    hotelGroupCode: config.hotelGroupCode,
    allRuleInfo: "T",
    cardId: user.cardId,
  };
  let memberProcessList: any = [];
  await api.queryMemberUpgradeInfo(opt).then((res: any) => {
    if (res.result == 1) {
      if (res.retVal.retVal.length > 0) {
        res.retVal.retVal.forEach((item: any) => {
          var list =
            item.originalCardInfoDto.cardAutoUpDegradeInfoDetailList[0];
          var isMatchCondition = item.originalCardInfoDto.isMatchCondition;
          var actualQuotaValue = Number(list.actualQuotaValue);
          let quotaDescriptMap: any = {
            pay: "元",
            recharge: "元",
            accountBalance: "元",
            timesIn: "次",
            noShowTimes: "次",
            cancelTimes: "次",
            point: "积分",
            nights: "房晚",
            rsvChannelNights: "房晚",
            closeEnd: "订单完成时",
          };
          list.quotaDescript = quotaDescriptMap[list.quota] || "";
          if (item.autoUpDownGradeCfgInfoDto.ruleType == "KEEP") {
            // memberProcessList.push({
            //   cardLevel: item.autoUpDownGradeCfgInfoDto.cardLevel,
            //   tipDescript: item.autoUpDownGradeCfgInfoDto.descript,
            //   quotaValue: list.quotaValue,
            //   cardLevelDescript:
            //     item.autoUpDownGradeCfgInfoDto.cardLevelDescript,
            //   type: "KEEP",
            //   actualQuotaValue: actualQuotaValue,
            //   desc: `距保级还需${valFormat(
            //     subtraction(list.quotaValue, Number(actualQuotaValue))
            //   )}${list.quotaDescript}`,
            //   speed: `width:${(actualQuotaValue / list.quotaValue) * 100}%`,
            // });
            // if (user.cardLevel == item.autoUpDownGradeCfgInfoDto.oldCardLevel) {
            if (isMatchCondition) {
              memberProcessList.push({
                cardLevel: item.autoUpDownGradeCfgInfoDto.cardLevel,
                tipDescript: item.autoUpDownGradeCfgInfoDto.descript,
                quotaValue: list.quotaValue,
                cardLevelDescript:
                  item.autoUpDownGradeCfgInfoDto.cardLevelDescript,
                type: "KEEP",
                actualQuotaValue: actualQuotaValue,
                desc: `距保级还需${valFormat(
                  subtraction(list.quotaValue, Number(actualQuotaValue))
                )}${list.quotaDescript}`,
                speed: `width:${(actualQuotaValue / list.quotaValue) * 100}%`,
                isMatchCondition: isMatchCondition,
              });
            } else {
              memberProcessList.unshift({
                cardLevel: item.autoUpDownGradeCfgInfoDto.cardLevel,
                tipDescript: item.autoUpDownGradeCfgInfoDto.descript,
                quotaValue: list.quotaValue,
                cardLevelDescript:
                  item.autoUpDownGradeCfgInfoDto.cardLevelDescript,
                type: "KEEP",
                actualQuotaValue: actualQuotaValue,
                desc: `距保级还需${valFormat(
                  subtraction(list.quotaValue, Number(actualQuotaValue))
                )}${list.quotaDescript}`,
                speed: `width:${(actualQuotaValue / list.quotaValue) * 100}%`,
                isMatchCondition: isMatchCondition,
              });
            }
            // }
          }
          if (item.autoUpDownGradeCfgInfoDto.ruleType == "UP") {
            let obj = {
              cardLevel: item.autoUpDownGradeCfgInfoDto.cardLevel,
              tipDescript: item.autoUpDownGradeCfgInfoDto.descript,
              quotaValue: list.quotaValue,
              cardLevelDescript:
                item.autoUpDownGradeCfgInfoDto.cardLevelDescript,
              type: "UP",
              actualQuotaValue: actualQuotaValue,
              desc: `累计${valFormat(actualQuotaValue)}${
                list.quotaDescript
              }，距升级还需${valFormat(
                subtraction(list.quotaValue, Number(actualQuotaValue))
              )}${list.quotaDescript}`,
              speed: `width:${(actualQuotaValue / list.quotaValue) * 100}%`,
            };
            if (list.quotaValue < actualQuotaValue) {
              obj.desc = `累计${list.quotaValue}${list.quotaDescript},即将升级`;
              obj.speed = `width:100%`;
            }
            memberProcessList.push(obj);
            // }
          }
          if (memberProcessList.length > 0) {
            memberProcess.value = [];
            if (
              memberProcessList.length == 1 &&
              memberProcessList[0].type == "KEEP" &&
              memberProcessList[0].isMatchCondition
            ) {
              memberProcess.value.push({
                type: "KEEP",
                desc: "已完成保级",
                speed: `width:100%`,
              });
            } else {
              memberProcess.value.push(memberProcessList[0]);
            }
          }
          memberProcessList.map((item: any) => {
            if (item.type == "KEEP" && item.isMatchCondition) {
              item.desc = "已完成保级";
              item.speed = `width:100%`;
            }
          });
          // memberProcess.value = memberProcessList;
        });
      }
    }
  });
  // console.log(memberProcessList, "memberProcessList-----------");
  // console.log(memberProcess.value, "memberProcess.value-----------");
  return memberProcessList;
  // return memberProcess.value;
};
const getTaskList = () => {
  api
    .activityTaskList({
      hotelGroupCode: config.hotelGroupCode,
      hotelCode: config.hotelCode,
      memberId: user.memberId,
      memberNo: user.memberId,
      taskType: "SMRZ",
    })
    .then((res: any) => {
      cardList.activityList = [];
      if (res.result == 1) {
        cardList.activityList = res.retVal;
      } else {
        jAlert3(res.msg);
      }
    });
};
const getCardList = () => {
  uni.showLoading({
    title: "加载中...",
  });
  api
    .interfaceTransfer({
      config: {
        interfaceFrom: "member",
        interfaceMethod: "/crm/v2/queryCardLevelSuitList",
        hotelGroupCode: config.hotelGroupCode,
      },
      query: {
        hotelCode: config.hotelCode,
        hotelGroupCode: config.hotelGroupCode,
        cardType: user.cardType,
        isNeedRights: "T",
        channel: "WECHAT",
      },
    })
    .then((res: any) => {
      cardList.swpierCardList = [];
      if (res.result == 1 && res.retVal.result == 0) {
        res.retVal.retVal.map((ctem: any) => {
          if (ctem.configOnlineShow == "T") {
            cardList.swpierCardList.push(ctem);
          }
        });
        // cardList.swpierCardList = res.retVal.retVal;
        cardList.swpierCardList.map((n: any, index) => {
          if (user && user.memberId) {
            queryMemberUpgradeInfo().then((res) => {
              // res.map((item: any, cindex:any) => {
              //   // console.log(item,'item---------------')
              //   // return index ==  cindex;
              //   return item.cardLevel == n.code;
              // })
              // let ges = {};
              // if (n.code == "GESANG") {
              //   ges = res.find((item: any, cindex: any) => {
              //     // return index ==  cindex;
              //     return item.cardLevel == "LRH";
              //   });
              // }
              let resData = {};
              resData = res.find((item: any, cindex: any) => {
                // return index ==  cindex;
                return item.cardLevel == n.code;
              });
              if (n.code == user.cardLevel) {
                resData = res[0];
              }
              // n = Object.assign(n, ges);
              n = Object.assign(n, resData);
            });
          }
          membercardInterestDesc(n.code).then((val: any) => {
            n = Object.assign(n, val);
          });
        });
        setTimeout(() => {
          curday.value = dayjs(dayjs()).diff(dayjs(user.beginLevelDate), "day");
          const curIndex = cardList.swpierCardList.findIndex((item: any) => {
            // console.log(item,'item-----------')
            return item.code == user.cardLevel;
          });
          switchTab(curIndex == -1 ? 0 : curIndex);
          curText.value = curIndex == -1 ? 0 : curIndex;
          cardList.cardLevelRightsList =
            cardList.swpierCardList.length > 0
              ? JSON.parse(
                  cardList.swpierCardList[curIndex == -1 ? 0 : curIndex].icons
                )
              : [];
        }, 200);
      } else {
        jAlert3(res.msg);
      }
    })
    .finally(() => {
      uni.hideLoading();
    });
};
const goAuth = (item: any) => {
  if (item.isComplete == "T") {
    return;
  }
  goPageWithUser(
    `/pagesA/member/memberAuth?ruleCode=${item.taskCode}&isNeedPoint=${"T"}`
  );
};
const goCollectCenter = () => {
  uni.navigateTo({
    url: "/pagesA/member/collectionCenter",
  });
};
const goPolicy = () => {
  if (policyData.value) {
    setStorage("policyData", policyData.value);
    uni.navigateTo({
      url: `/pagesA/member/policy`,
    });
  }
};
onMounted(() => {});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import (reference) url("~@/styles/mixin.less");
.memberCenter_wrap {
  .memberCenterBg {
    width: 100vw;
    height: 280px !important;
    position: absolute;
    left: 0;
    top: 0vw;
    pointer-events: none;
  }
  .on_row {
    display: flex;
    align-items: center;
  }
  // padding-top: 16px;
  .cardContent {
    z-index: 10;
    // width: 100%;
    // display: flex;
    // flex-wrap: nowrap;
    // overflow-x: auto;
    // margin: 16px 0 32px 0;
    margin-top: 10px;
    margin-bottom: 26px;
    //margin-left: -10px;
  }
  .userCard {
    width: 100%;
    // height: 100%;
    height: 168px;
    max-height: 168px;
    min-height: 168px;
    display: flex;
    align-items: center;
    .swiper-box-item {
      overflow: hidden;
      // margin-right: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      //width: 327px !important;
      //max-width: 327px !important;
      // height: 156px;
      // max-height: 156px;
      // min-height: 156px;
      border-radius: 8px !important;
      color: #fff;
      //padding: 0 12px;
      // box-shadow: 0 10px 20px -20px #bfc9d3;
      .swiper_contant {
        position: relative;
        height: 168px;
        max-height: 168px;
        min-height: 168px;
        border-radius: 8px;
        overflow: hidden;
        width: 100%;
        width: 327px;
        .swipe_img {
          margin: 6px 0;
          width: 327px;
          height: 156px;
          max-height: 156px;
          min-height: 156px;
          border-radius: 8px;
          // object-fit: contain;
        }
        .text_position {
          position: absolute;
          top: 25px;
          left: 20px;
          margin-right: 20px;
        }
        .cardName {
          font-family: Source Han Serif CN;
          font-size: 20px;
          font-weight: 900;
          line-height: 20px;
          letter-spacing: 0px;
          text-align: left;
          color: #ffffff;
          font-weight: bold;
        }
        .currentLevel {
          min-height: 14px;
          height: 14px;
          padding-top: 10px;
          font-size: 14px;
          font-weight: 400;
          // line-height: 14px;
          letter-spacing: 0px;
          text-align: left;
          color: #ffffff;
        }

        .cardLimit {
          display: flex;
          align-items: center;
          margin-top: 60px;
          font-size: 14px;
          margin-bottom: 8px;
          .on_row {
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 400;
            line-height: 14px;
            letter-spacing: 0px;
            text-align: left;
            color: rgba(255, 255, 255, 1);
          }
          .iconfont {
            // font-size: 12px;
            margin-left: 5px;
          }
        }

        .cardProcess {
          background: rgba(255, 255, 255, 0.25);
          height: 4px;
          width: 280px;
          // width: 160px;
          border-radius: 2px;
          margin-bottom: 12px;
          // position: absolute;
          // left: 20px;
          // bottom: 15px;

          .process {
            background: #fff;
            height: 4px;
            // width: 100px;
            border-radius: 2px;
          }
        }
      }
    }
  }
  .contant_wrap {
    padding: 0 16px;
    .member_center {
      .member_wrap {
        margin-bottom: 24px;
        display: flex;
        .member_title {
          font-size: 18px;
          color: #000;
        }
        .member_more {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #808080;
          margin-left: auto;
          .icon_more {
            margin-left: 4px;
          }
        }
      }
      .member_list {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        width: 100%;
        .list_item {
          margin-right: 12px;
          margin-bottom: 12px;
          height: 62px;
          flex: 1;
          border-radius: 8px;
          background: #ffffff;
          width: calc((100% - 12px) / 2);
          min-width: calc((100% - 12px) / 2);
          max-width: calc((100% - 12px) / 2);
          &:nth-child(2n) {
            // 去除第2n个的margin-right
            margin-right: 0;
          }
        }

        .item_in {
          display: flex;
          margin: 12px;
        }
        .left_img {
          margin-right: 8px;
          width: 20px;
          height: 20px;
        }
        .right_cont {
          .right_tit {
            margin-bottom: 8px;
            font-size: 14px;
            color: #000;
          }
          .right_text {
            font-size: 12px;
            color: #808080;
          }
        }
      }
    }
    .coupon_center {
      margin: 0 auto;
      margin-top: 12px;
      width: 136px;
      height: 38px;
      border: 0.5px solid rgba(204, 204, 204, 1);
      border-radius: 170px;
      font-size: 14px;
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .member_task {
      .task_title {
        margin: 32px auto 24px auto;
        font-size: 18px;
        font-weight: 500;
        line-height: 18px;
        letter-spacing: 0px;
        text-align: left;
      }
      .task_wrap {
        height: 68px;
        width: 100%;
        background: #ffffff;
        display: flex;
        align-items: center;
        margin-bottom: 16px;
      }
      .task_main {
        margin-left: 12px;
        .confirm {
          font-size: 14px;
          font-weight: 400;
          line-height: 14px;
          letter-spacing: 0px;
          text-align: left;
          color: #000;
          margin-bottom: 8px;
        }
        .num {
          font-size: 12px;
          font-weight: 400;
          line-height: 12px;
          letter-spacing: 0px;
          text-align: left;
          color: #db8900;
        }
      }
      .go_finish {
        margin-right: 12px;
        margin-left: auto;
      }
      .go_confirm {
        color: #fff;
        // background: #000;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 66px;
        height: 30px;
        font-size: 14px;
        .baseBtn();
      }
      .has_confirm {
        color: #ccc;
        background: #eee;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 66px;
        height: 30px;
        font-size: 14px;
      }
    }
    .receive-layer {
      position: fixed;
      bottom: 0;
      left: 0;
      height: 100vh;
      width: 100vw;
      display: none;
    }
    .title {
      padding: 16px 16px 0;
      color: #000000;
      font-size: 18px;
      font-weight: bold;
      line-height: 1;
    }

    .receive-box {
      // position: absolute;
      // bottom: 0;
      // left: 0;
      // width: 100%;
      // // border-radius: 16px 16px 0 0;
      // // background: #f8f8f8;
      // // background: #ffffff;
      // z-index: 999;
      // // height:100%;
      // height: 600px;

      // overflow-y: auto;

      .head {
        position: relative;
        display: flex;
        justify-content: center;
        font-weight: 600;
        font-size: 18px;
        line-height: 1;
        padding: 19px 0;
        background: #fff;
        border-bottom: 1px solid #eeeeee;
        height: 56px;
        .icon-a-20_guanbi {
          position: absolute;
          left: 22px;
          top: 20px;
          font-size: 20px;
        }
      }
      .receive_mian {
        padding-top: 32px;
        // height: 100vh;
        // width: 100vw;
        background: #fff;
        height: calc(100% - 90px);
        overflow-y: auto;
        .icon_wrap {
          text-align: center;
        }
        .right_icon {
          margin-bottom: 32px;
          text-align: center;
          width: 80px;
          height: 80px;
        }
        .icon-a-20_chuhanglibao_jingang1 {
          margin-bottom: 32px;
          text-align: center;
          font-size: 62px;
        }
        .cont_title {
          font-size: 18px;
          font-weight: 500;
          line-height: 18px;
          letter-spacing: 0px;
          text-align: center;
          color: #000;
          margin-bottom: 12px;
        }
        .cont_text {
          color: #808080;
          font-size: 14px;
          font-weight: 400;
          line-height: 14px;
          letter-spacing: 0px;
          text-align: center;
          margin-bottom: 48px;
        }
        .use_type {
          margin-bottom: 8px;
          display: flex;
          margin: auto 16px;
          .use_left {
            min-width: 60px;
            color: #808080;
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
            letter-spacing: 0px;
            text-align: left;
          }
          .use_right {
            margin-left: 12px;
            color: #000;
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
            letter-spacing: 0px;
            text-align: left;
          }
        }
        .use_tip {
          margin: auto 16px;
          margin-top: 24px;
          color: #808080;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          letter-spacing: 0px;
          text-align: left;
        }
      }
    }

    .bg {
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      background: rgba(0, 0, 0, 0.76);
    }
  }
  /deep/.dialogWarp {
    &::after {
      background: #fff !important;
    }
  }
  .zhanWei {
    height: 50px;
  }
}
</style>
