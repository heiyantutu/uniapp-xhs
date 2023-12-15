<template>
  <div class="ui_memberCenter">
    <i class="icon iconfont icon-a-20_shezhi settings" v-bind:style="{top:navHeight + 'px'}"
      @click="goPageWithUser('/pagesA/member/setting')"></i>
    <img class="memberCenterBg" :src="memberCenterBg" mode="widthFix">
    <div class="memberHead" v-if="isMember" @click="goPageWithUser('/pagesA/member/memberInfo')">
      <img
        :src="wxuser.avatarUrl?wxuser.avatarUrl:'https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/avatar.png'"
        mode="" class="avatar" />
      <p class="userName">{{user.nickname?user.nickname:"松赞家人"}}</p>
    </div>
    <div class="memberHead" v-else>
      <p class="userName userName2" @click="toLogin">点击登录 <i class="icon iconfont icon-a-16_youlajiantou_hei"></i></p>
    </div>
    <div class="userAssets">
      <div class="userAsset" @click="goPageWithUser('/pagesA/member/couponList')">
        <p class="num" v-if="isMember">{{user&&user.couponNum}}</p>
        <p class="num" v-else>0</p>
        <p class="title">券包</p>
      </div>
      <div class="userAsset" @click="goPageWithUser('/pagesA/member/memberListPoint')">
        <p class="num" v-if="isMember">{{user&&user.pointBalance}}</p>
        <p class="num" v-else>0</p>
        <p class="title">积分</p>
      </div>
      <div class="userAsset" @click="goPageWithUser('/pagesA/member/memberAccount')">
        <p class="num" v-if="isMember">{{accountBalance}}</p>
        <p class="num" v-else>0</p>
        <p class="title">余额</p>
      </div>
    </div>
    <div class="memberTips" v-if="isMember&&pointsExpiredTips">{{pointsExpiredTips}}</div>
    <div class="orderWrapper" :class="{'hasOrder':isMember&&orderList.length>0}">
      <div class="orderListBox">
        <div class="orderItem" @click="goPageWithUser('/pages/member/orderList')">
          <i class="icon iconfont icon-a-20_jiulvdingdan"></i>
          <p class="orderDesc">酒旅订单</p>
        </div>
        <div class="orderItem" @click="goPageWithUser('/pages/member/orderList?orderType=2')">
          <i class="icon iconfont icon-a-20_fengwudingdan"></i>
          <p class="orderDesc">风物订单</p>
        </div>
      </div>
      <div class="orders" v-if="isMember&&orderList.length>0" :class="{'less':orderList.length<maxOrderNum}">
        <swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" @change="swiperChange">
          <template v-for="(item, orderItemIndex) in orderList" :key="orderItemIndex">
            <swiper-item v-if="orderItemIndex<maxOrderNum">
              <div class="order" @click.stop="chooseItem(item)">
                <img
                  :src="item.link?item.link:'https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/aggregateCart/emptyIcon.png'"
                  alt="" class="logo" mode="aspectFill">
                <div class="rightPart">
                  <div class="info">
                    <p class="name">{{item.title}}</p>
                    <p class="countTime" :class="{'red':item.enhanceSta}">{{item.orderStaDesc}}<span
                        v-if="item.countTime">{{item.countTime}}</span></p>
                  </div>
                  <div class="operate" v-if="item.showInvoice" @click.stop="goInvoice(item)">申请开票</div>
                  <div class="operate" v-if="item.showPay" @click.stop="goPay(item)">去付款</div>
                  <div class="operate" v-if="item.showSign" @click.stop="goSign(item)">立即签约</div>
                  <div class="operate" v-if="item.showTransfer" @click.stop="goTransfer(item)">填写接送信息</div>
                  <div class="operate" v-if="item.showCancel" @click.stop="goKf(item)">取消订单</div>
                  <div class="operate" v-if="item.showKf" @click.stop="goKf(item)">在线客服</div>
                </div>
              </div>
            </swiper-item>
          </template>
        </swiper>
        <div v-if="orderList.length>maxOrderNum" @click="goPageWithUser('/pages/member/orderList')" class="seeMore">
          <div class="toSee">查看全部订单</div>
          <i class="icon iconfont icon-a-12_youlajiantou_hei"></i>
        </div>
        <div class="swiper-dots">
          <template v-for="(order,orderIndex) in orderList" :key="orderIndex">
            <div class="swiper-dot" v-bind:class="{active:orderIndex == swiperCurrent}" v-if="orderIndex<maxOrderNum">
            </div>
          </template>
        </div>
      </div>
    </div>
    <div class="userCard" v-if="isMember" @click="goPageWithUser(`/pagesA/member/memberRight`)"
      :style="{ backgroundImage: `url(${faceAttr})` }">
      <p class="cardName">{{user.cardLevelDescript}}</p>
      <p class="cardLimit" v-if="memberProcess.length>0">{{memberProcess[0].desc}}</p>
      <div class="cardProcess" v-if="memberProcess.length>0">
        <div class="process" :style='memberProcess[0].speed'></div>
      </div>
    </div>
    <!-- <div class="tapList" v-if="showInvite">
      <div class="cols list">
        <button class="listItem" @click.stop="goInvite">
          <p class="itemDesc">邀请好友体验松赞</p>
          <div class="moreDesc">
            <img src="https://website-10049437.cos.ap-shanghai.myqcloud.com/89f83b00-ac5d-4f47-aa00-2c55fb4afc1e" alt=""
              class="logo" />
            <span class="moreText">齐享好礼</span>
          </div>
          <i class="icon iconfont icon-a-16_youlajiantou_hei"></i>
        </button>
      </div>
    </div> -->
    <memberCenterUrl :datas="list" :key="index" v-if="showInvite" @inviteClick="goInvite"></memberCenterUrl>
    <template v-for="(slot, index) in page">
      <template v-if="slot.type == 'url'">
        <memberCenterUrl :datas="slot" :key="index" @kfClick="goKf">
        </memberCenterUrl>
      </template>
      <template v-if="slot.type == 'whitespace'">
        <whitespace-line :datas="slot" :key="index" @kfClick="goKf">
        </whitespace-line>
      </template>
    </template>
    <div class="memberCenterLogo">
      <img class="img" src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/memberCenterLogo.png" />
    </div>
    <bottom-nav>
    </bottom-nav>
    <kf-dialog ref="kf" title="一键咨询"></kf-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, toRaw } from "vue";
import { $ref } from "unplugin-vue-macros/macros";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import { goPage, login } from "@/utils/utils";
import {
  goPageWithUser,
  toLogin,
  addNum,
  subtraction,
  refreshMemberInfo,
} from "@/utils/utils";
import whitespaceLine from "@/components/customCenter/whitespaceLine.vue";
import memberCenterUrl from "@/components/customCenter/memberCenterUrl.vue";
import bottomNav from "@/components/bottomNav.vue";
import kfDialog from "@/components/kfDialog.vue";
import { timeDay, valFormat } from "@/utils/filter";
import { onShow, onUnload, onPullDownRefresh } from "@dcloudio/uni-app";
import { jAlert3 } from "@/base/jAlert/jAlert";
import getMemberUI from "@/utils/getMemberUI";
import { getMenuButtonBoundingClientRect } from "@/utils/platform";
import UmengSDK from "@/utils/umengAdaptor.js";
import dayjs from "dayjs";

let config = getStorage("config");
let user = $ref(getStorage("user"));
let wxuser = $ref(getStorage("wxuser"));
let page = ref([]);
let navHeight = ref(0);
let swiperCurrent = ref(0);
let indicatorDots = ref(false);
let autoplay = ref(false);
let showInvite = ref(false);
let pointsExpiredTips = ref("");
let wmCardTotal = ref(0);
let faceAttr = ref("");
let memberProcess = ref<any>([]);
let orderList = ref<any>([]);
let interVal: any = ref(0);
let maxOrderNum = ref(6);
let kf = ref();
let memberCenterBg = ref("");
let list = ref({
  items: [
    {
      business: "invite",
      desc: "邀请好友体验松赞",
      descLogo:
        "https://website-10049437.cos.ap-shanghai.myqcloud.com/89f83b00-ac5d-4f47-aa00-2c55fb4afc1e",
      logo: "",
      moreDesc: "齐享好礼",
      url: "/pagesB/invite/invite",
    },
  ],
  sortType: "cols",
  title: "",
  titleUrl: "",
  type: "url",
});
console.log(wxuser, "wxuser");
console.log(user, "user");

const swiperChange = (e: any) => {
  swiperCurrent.value = e.target.current;
};
let isMember = computed(() => {
  return user && user.memberId;
});
const accountBalance = computed(() => {
  let accountBalance = 0;
  if (user && user.memberBalanceUsable) {
    accountBalance = user.memberBalanceUsable;
  }
  accountBalance = addNum(accountBalance, wmCardTotal.value);
  return accountBalance;
});
const goKf = (item: any) => {
  kf.value.showDialog();
};
const goTransfer = (item: any) => {
  uni.navigateTo({
    url: `/pagesD/trip/takeInfo?orderNo=${item.orderNo}`,
  });
};
const goSign = (item: any) => {
  uni.navigateTo({
    url: `/pagesB/travel/tips?orderNo=${item.orderNo}`,
  });
};
const goPay = (item: any) => {
  let bussinessMap = {
    room: "hotel",
    custom: "CUSTOM",
    destpack: "DestPackage",
    butcustom: "ButlerCustomized",
    freetravel: "FreeTravel",
    themegroup: "ThemeGroup",
    shop: "shop",
    activity: "activity",
    pack: "pack",
    spa: "spa",
  };
  let orderNo = item.channel == "shop" ? item.orderId : item.orderNo;
  uni.navigateTo({
    url: `/pagesB/other/pay?orderNo=${orderNo}&productType=${
      bussinessMap[item.channel as keyof typeof bussinessMap]
    }`,
  });
};
const goInvoice = (item: any) => {
  let bussinessMap = {
    room: "R",
    custom: "L",
    destpack: "L",
    butcustom: "L",
    freetravel: "L",
    themegroup: "L",
    shop: "S",
    activity: "A",
  };
  let productTypeMap = {
    room: "hotel",
    custom: "Custom",
    destpack: "DestPackage",
    butcustom: "ButlerCustomized",
    freetravel: "FreeTravel",
    themegroup: "ThemeGroup",
    shop: "shop",
    activity: "activity",
  };
  uni.navigateTo({
    url: `/pagesF/invoice/applyInvoice?orderNo=${item.orderNo}&orderType=${
      bussinessMap[item.channel as keyof typeof bussinessMap]
    }&productType=${
      productTypeMap[item.channel as keyof typeof productTypeMap]
    }`,
  });
};
const chooseItem = (item: any) => {
  if (item.channel == "room") {
    uni.navigateTo({
      url: `/pagesC/order/orderInfo?orderNo=${item.orderNo}&hotelCode=${item.hotelCode}`,
    });
    return false;
  }
  if (
    item.channel == "freetravel" ||
    item.channel == "themegroup" ||
    item.channel == "destpack" ||
    item.channel == "custom" ||
    item.channel == "butcustom"
  ) {
    uni.navigateTo({
      url: `/pagesB/travel/orderDetail?orderNo=${item.orderNo}`,
    });
    return false;
  }
  if (item.channel == "shop") {
    uni.navigateTo({
      url: `/pagesB/travel/orderDetail?orderNo=${item.orderId}&productType=shop`,
    });
    return false;
  }
  if (item.channel == "activity") {
    uni.navigateTo({
      url: `/pagesE/dailyActivity/dailyOrderDetail?orderNo=${item.orderNo}&productType=activity`,
    });
    return false;
  }
};
const countDown = () => {
  var timer = function () {
    orderList.value.forEach((n: any) => {
      if (n.countdown > 0) {
        let t = n.countdown;
        var d: string | number = 0;
        var h: string | number = 0;
        var m: string | number = 0;
        var s: string | number = 0;
        d = Math.floor(t / 60 / 60 / 24);
        h = Math.floor((t / 60 / 60) % 24);
        m = Math.floor(t / 60);
        if (m < 10) {
          m = "0" + m;
        }
        s = Math.floor(t % 60);
        if (s < 10) {
          s = "0" + s;
        }
        n.countTime = `${h}:${m}:${s}`;
        n.countdown = n.countdown - 1;
      }
    });
    interVal.value = setInterval(timer, 1000);
  };
};
const getOrderListOrder = () => {
  let mobile = "";
  let openid = "";
  let memberId = "";
  let memberToken = "";
  if (user && user.mobile) {
    //mobile = user.mobile;
    memberId = user.memberId;
    memberToken = user.memberToken || "";
  }
  if (wxuser && wxuser.openid) {
    openid = wxuser.openid;
  }
  let opt = {
    firstResult: 0,
    mobile: mobile,
    channel: "",
    orderStatus: "1,3,7,8,11",
    payStatus: "",
    pageSize: 15,
    openid: openid,
    memberid: memberId,
    hotelGroupCode: config.hotelGroupCode,
    searchword: "",
    memberToken: memberToken,
  };
  api.orderAggregation(opt).then((res: any) => {
    if (res.result == 1) {
      let bussinessMap = {
        room: "酒店",
        custom: "私人定制",
        destpack: "酒店套餐",
        butcustom: "管家定制",
        freetravel: "自由行",
        themegroup: "主题团",
        shop: "自由行通兑券",
        activity: "日活动",
        pack: "组合",
        spa: "餐饮",
      };
      let iconsMap = {
        room: "icon-a-12_jiudian_hei",
        custom: "icon-a-16_dingzhilvhang_hei",
        destpack: "icon-a-12_jiudiantaocan_hui",
        butcustom: "icon-a-16_dingzhilvhang_hei",
        freetravel: "icon-a-16_lvhang",
        themegroup: "icon-a-16_quanbulvhang",
        shop: "icon-a-16_lvhang",
        activity: "icon-a-16_huodong",
        pack: "icon-a-12_jiudiantaocan_hui",
        spa: "icon-a-16_quanbulvhang",
      };
      let orderStatusMap = {
        "1": "待付款",
        "2": "已退款",
        "3": "待出行",
        "4": "退款中",
        "5": "已取消",
        "7": "已完成",
        "8": "待签约",
        "9": "已完成",
        "11": "出行中",
      };
      res.retVal.orderList.forEach((item: any, index: number) => {
        if (item.channel == "shop" || item.channel == "activity") {
          orderStatusMap["3"] = "待使用";
        }
        if (item.orderStatus == "7") {
          item.orderStatus = "9";
        }
        item.channelDesc =
          bussinessMap[item.channel as keyof typeof bussinessMap];
        item.iconfont = iconsMap[item.channel as keyof typeof iconsMap];
        item.orderStaDesc =
          orderStatusMap[item.orderStatus as keyof typeof orderStatusMap];
        if (item.orderStatus == "1" || item.orderStatus == "8") {
          item.enhanceSta = true;
        }
        /* if (item.channel == "shop" && item.orderStatus == "3") {
          item.orderStaDesc = "待使用";
        } */
        if (item.extraJson) {
          let json = JSON.parse(item.extraJson);
          if (json.prepayHoldSeconds) {
            item.countdown = json.prepayHoldSeconds;
          }
          if (json.couponNo) {
            item.couponNo = json.couponNo;
          }
          if (json.rateSum) {
            item.price = json.rateSum;
          }
          if (json.dscAmount > 0) {
            item.price = subtraction(
              Number(item.price),
              Number(json.dscAmount)
            );
          }
          item.webPay = Number(json.webPay);
          if (json.webPay < json.rateSum) {
            item.needPay = subtraction(
              Number(json.rateSum),
              Number(json.webPay)
            );
          }
        }
        //取消权限
        if (!["2", "3", "4", "5", "7", "9"].includes(item.orderStatus)) {
          item.showCancel = true;
        }
        //客服权限
        if (["2", "3", "4"].includes(item.orderStatus)) {
          item.showKf = true;
        }
        //支付权限
        if (["1"].includes(item.orderStatus)) {
          item.showPay = true;
        }
        //签约权限
        if (["8"].includes(item.orderStatus)) {
          item.showSign = true;
        }
        //发票权限
        if (["9"].includes(item.orderStatus)) {
          if (item.extraJson) {
            let json = JSON.parse(item.extraJson);
            if (json.invoiceStaV2 == "1") {
              item.showInvoice = true;
            }
          }
        }
        //接送权限
        if (
          ["3"].includes(item.orderStatus) &&
          [
            "custom",
            "destpack",
            "butcustom",
            "freetravel",
            "themegroup",
          ].includes(item.channel)
        ) {
          if (item.extraJson) {
            let json = JSON.parse(item.extraJson);
            if (json.isTransfer == "F") {
              item.showTransfer = true;
            }
          }
        }
      });
      orderList.value = res.retVal.orderList;
    }
  });
};
const getShopMemberCenterConfig = () => {
  api
    .getShopMemberCenterConfig({
      appid: config.appid,
      componentAppid: config.componentAppid,
      hotelGroupCode: config.hotelGroupCode,
      hotelCode: config.hotelCode,
    })
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.info) {
          let info = JSON.parse(res.retVal.info);
          if (info) {
            let show = info.show;
            if (show) {
              var value = JSON.parse(show);
              if (value) {
                page.value = value.value;
                console.log(page);
                page.value.forEach((n: any, i: number) => {
                  if (n.type == "config") {
                    uni.setNavigationBarTitle({
                      title: n.title,
                    });
                  }
                });
              }
            }
          }
        }
      }
    });
};
const queryPointsExpiredRemindData = () => {
  api
    .queryPointsExpiredRemindData({
      hotelGroupCode: config.hotelGroupCode,
      memberId: user.memberId,
      channel: "WECHAT",
    })
    .then((res: any) => {
      if (
        res.result == 1 &&
        res.retVal.result == 0 &&
        res.retVal.retVal.length > 0
      ) {
        let pointsExpiredItem = res.retVal.retVal[0];
        pointsExpiredTips.value = `${
          pointsExpiredItem.expirePoint
        }积分将在${timeDay(pointsExpiredItem.expireDate)}到期`;
      }
    });
};
const membercardInterestDesc = () => {
  api
    .membercardInterestDesc({
      cardCode: user.cardLevel,
      hotelGroupCode: config.hotelGroupCode,
      hotelCode: config.hotelCode,
    })
    .then((res: any) => {
      if (res.result == 1) {
        faceAttr.value = res.retVal.faceAttr;
      } else {
        jAlert3(res.msg);
      }
    });
};
const queryMemberUpgradeInfo = () => {
  var opt = {
    hotelGroupCode: config.hotelGroupCode,
    allRuleInfo: "T",
    cardId: user.cardId,
  };
  api.queryMemberUpgradeInfo(opt).then((res: any) => {
    if (res.result == 1) {
      if (res.retVal.retVal.length > 0) {
        let memberProcessList: any = [];
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
            if (user.cardLevel == item.autoUpDownGradeCfgInfoDto.oldCardLevel) {
              if (isMatchCondition) {
                memberProcessList.push({
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
            }
          }
          if (item.autoUpDownGradeCfgInfoDto.ruleType == "UP") {
            if (user.cardLevel == item.autoUpDownGradeCfgInfoDto.oldCardLevel) {
              let obj = {
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
            }
          }
        });
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
      }
    }
    if (user.cardLevel.indexOf("JG") == 0) {
      memberProcess.value = [];
      memberProcess.value.push({
        type: "KEEP",
        desc: `已成为${user.cardLevelDescript}会员${dayjs(dayjs()).diff(
          dayjs(user.beginLevelDate),
          "day"
        )}天`,
        speed: `width:100%`,
        isHideProcess: true,
      });
    }
  });
};
const goInvite = () => {
  if (isMember.value) {
    uni.navigateTo({
      url: `/pagesB/invite/invite`,
    });
    // goPage("https://wap.songtsam.com/wechat/?/#/invite");
  } else {
    toLogin();
  }
};
const getInviteInfo = () => {
  api
    .selectInvitationSpoilRules({
      level: user?.cardLevel,
      hotelGroupCode: config.hotelGroupCode,
      hotelCode: config.hotelCode,
    })
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.length) {
          showInvite.value = true;
        }
      } else {
        jAlert3(res.msg);
      }
    });
};
const getUserAvailableCardList = () => {
  api
    .getUserAvailableCardList({
      hotelCode: config.hotelCode,
      hotelGroupCode: config.hotelGroupCode,
      mobile: user.mobile,
      vidType: 2,
      scrollSize: 100,
      cardType: 1,
      cardStatus: 200,
    })
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.data && res.retVal.data.scrollList.length > 0) {
          wmCardTotal.value = 0;
          res.retVal.data.scrollList.forEach((n: any) => {
            wmCardTotal.value = addNum(wmCardTotal.value, n.cardBalance);
          });
        }
      }
    });
};
onPullDownRefresh(() => {
  setTimeout(() => {
    getOrderListOrder();
    uni.stopPullDownRefresh();
  }, 1000);
});
onMounted(() => {
  user = getStorage("user");
  // uni.getSystemInfo({
  //   success: (res: any) => {
  //     let custom: any = getMenuButtonBoundingClientRect();
  //     console.log("menuButton:", custom);
  //     navHeight.value = custom.top + (custom.height - 20) / 2;
  //   },
  //   fail(err) {
  //     console.log(err);
  //   },
  // });
  // getInviteInfo();
  // getShopMemberCenterConfig();
});
onShow(() => {
  user = getStorage("user");
  if (user && user.memberId) {
    UmengSDK.sendPV({
      nickname: user.name,
      integral: Number(user.pointBalance),
      balance: Number(user.memberBalanceUsable),
      coupon_package: Number(user.couponNum),
      vip_name: user.cardTypeDescript,
      page_name: "my_pg",
    });
    queryPointsExpiredRemindData();
    membercardInterestDesc();
    queryMemberUpgradeInfo();
    getUserAvailableCardList();
    refreshMemberInfo((newUser: any) => {
      user = newUser;
    });
    getOrderListOrder();
    countDown();
    memberCenterBg.value = getMemberUI(user.cardLevel).memberCenterBg;
  } else {
    UmengSDK.sendPV({
      nickname: "",
      integral: 0,
      balance: 0,
      coupon_package: 0,
      vip_name: "",
      page_name: "my_pg",
    });
    memberCenterBg.value = getMemberUI("").memberCenterBg;
  }
  uni.getSystemInfo({
    success: (res: any) => {
      let custom: any = getMenuButtonBoundingClientRect();
      console.log("menuButton:", custom);
      navHeight.value = custom.top + (custom.height - 20) / 2;
    },
    fail(err) {
      console.log(err);
    },
  });
  getInviteInfo();
  getShopMemberCenterConfig();
  if (getStorage("wxuser") && getStorage("wxuser").avatarUrl) {
    wxuser.avatarUrl = getStorage("wxuser").avatarUrl;
  }
});
onUnload(() => {
  clearInterval(interVal.value);
});
</script>

<style lang="less" scoped>
@import (reference) url("~@/styles/mixin.less");
.ui_memberCenter {
  padding: 0 16px;
  padding-bottom: 100px;
  .memberCenterLogo {
    margin-top: 32px;
    display: flex;
    justify-content: center;
    color: #ccc;
    .img {
      width: 139px;
      height: 76px;
    }
  }
  .settings {
    position: absolute;
    display: inline-block;
    z-index: 1;
    position: relative;
    .expandClick();
  }
  .memberCenterBg {
    width: 100vw;
    position: absolute;
    left: 0;
    top: 0vw;
    pointer-events: none;
  }

  .memberHead {
    display: flex;
    height: 80px;
    align-items: center;
    margin-top: 64px;
    position: relative;
    z-index: 1;
    .avatar {
      height: 48px;
      width: 48px;
      border-radius: 50%;
    }

    .userName {
      font-size: 20px;
      font-weight: bold;
      margin-left: 10px;
      position: relative;
      &.userName2 {
        margin-left: 0px;
        display: flex;
        align-items: center;
        .iconfont {
          margin-left: 2px;
        }
      }
      &.arrow {
        &::after {
          left: calc(~"100% + 15px");
        }
      }
    }
  }
  .memberTips {
    background: #f8f8f8;
    height: 36px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 12px;
    color: #808080;
    margin: 12px 0;
    position: relative;
    z-index: 1;
  }
  .userAssets {
    height: 64px;
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    position: relative;
    z-index: 1;
    .userAsset {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      flex-direction: column;

      .num {
        font-size: 16px;
        color: #000000;
        font-weight: 600;
        margin-bottom: 12px;
        font-family: Montserrat;
      }

      .title {
        font-size: 12px;
        color: #808080;
      }
    }
  }
  .orderWrapper {
    background: #ffffff;
    margin-bottom: 12px;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    position: relative;
    z-index: 1;
    &.hasOrder {
      .orderListBox {
        height: 60px;
        .orderItem {
          margin-top: 4px;
        }
      }
    }
    .orders {
      /* padding: 12px;
      padding-top: 0px; */
      padding-bottom: 12px;
      min-height: 76px;
      width: 100%;
      border-radius: 4px;
      position: relative;
      &.less {
        height: 76px;
      }
      .seeMore {
        position: relative;
        text-align: center;
        color: #000;
        font-size: 14px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .swiper-dots {
        position: absolute;
        left: 0;
        width: 100%;
        bottom: -8px;
        height: 20px;
        display: flex;
        justify-content: center;
        .swiper-dot {
          height: 2px;
          width: 12px;
          opacity: 0.28;
          background: #cccccc;
          &.active {
            opacity: 1;
            background: #000;
          }
        }
      }
      swiper {
        width: 100%;
        height: 72px;
        //border-radius: 4px;
        swiper-item {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          .order {
            padding: 12px;
            padding-bottom: 16px;
            display: flex;
            align-content: center;
            border-radius: 4px;
            background: #f8f8f8;
            width: 319px;
            .logo {
              height: 48px;
              width: 48px;
              border-radius: 4px;
            }
            .rightPart {
              flex: 1;
              display: flex;
              height: 48px;
              align-items: center;
              .info {
                flex: 1;
                padding-left: 12px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                .name {
                  font-size: 12px;
                  color: #000000;
                  .line-clamp(2);
                  line-height: 16px;
                }
                .countTime {
                  font-size: 12px;
                  color: #808080;
                  margin-top: 8px;
                  &.red {
                    color: #a43127;
                  }
                }
              }
              .operate {
                font-size: 14px;
                color: #000000;
                border: 1px solid #a8a8a8;
                border-radius: 4px;
                padding: 8px 12px;
                &:nth-of-type(3) {
                  display: none;
                }
              }
            }
          }
        }
      }
    }
  }
  .orderListBox {
    height: 68px;
    display: flex;
    .orderItem {
      flex: 1;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #000000;
      .iconfont {
        font-size: 20px;
        margin-right: 12px;
      }
    }
  }

  .userCard {
    height: 102px;
    margin-bottom: 12px;
    border-radius: 8px;
    color: #fff;
    padding: 14px 16px;
    position: relative;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    .cardName {
      font-size: 16px;
      color: #ffffff;
      font-family: Source Han Serif CN;
    }

    .cardLimit {
      margin-top: 24px;
      font-size: 14px;
    }

    .cardProcess {
      background: rgba(255, 255, 255, 0.25);
      height: 4px;
      width: 160px;
      border-radius: 2px;
      position: absolute;
      left: 13px;
      bottom: 14px;

      .process {
        background: #fff;
        height: 4px;
        //width: 100px;
        border-radius: 2px;
      }
    }
  }
}
/* .tapList {
  width: 100%;
  height: auto;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 10px;
  margin: 0 auto;
  border-radius: 12px;
  margin-bottom: 12px;
  background: #ffffff;
  position: relative;
  .icon-a-16_youlajiantou_hei {
    margin-right: 12px;
    color: #000;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    &.rows {
      padding: 10px 0;
    }
    &.cols {
      .logo {
        margin-right: 0;
      }
      .itemDesc {
        margin-left: 12px;
        color: #333333;
        font-size: 16px;
      }
      .moreDesc {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: flex-end;
        margin-right: 5px;
        .moreText {
          font-size: 14px;
          color: #808080;
          margin-left: 10px;
        }
      }
    }
    .logo {
      height: 20px;
      width: 20px;
      margin: 0 20px;
    }
    .buttonWrapper {
      width: 100%;
      height: 50px;
      position: relative;
      &.arrow::after {
        left: calc(~"100% - 12px");
      }
    }
    button {
      padding: 0;
      border-radius: 0px;
      position: relative;
      box-shadow: none;
      border: none !important;
      &::after {
        border: none;
      }
    }
    .listItem,
    button {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      position: relative;
      background-color: transparent;
      &::after {
        border: none;
        border-radius: 0px;
      }
      &.rows {
        width: 25%;
        flex-direction: column;
        height: 64px;
        align-items: center;
        justify-content: center;
        .logo {
          width: 26px;
          height: 26px;
          //margin-bottom: 8px;
        }
        .itemDesc {
          font-size: 14px;
          color: #000000;
        }
      }
      &.arrow::after {
        left: calc(~"100% - 15px");
        border-right: 1px solid #000000;
        border-top: 1px solid #000000;
      }
      .itemDesc {
        font-size: 14px;
        color: #000000;
      }
    }
  }
} */
</style>