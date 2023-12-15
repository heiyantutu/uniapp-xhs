<template>
  <div class="ui_orderList">
    <coustom-head position="relative" bgColor="#fff" nativeMode=true>
      <template v-slot:title>
        <div class="orderTypeList">
          <div class="orderType" v-for="(orderType,orderTypeIndex) in orderTypeList" :key="orderTypeIndex"
            :class="{'active':orderType.active}" @click="switchOrderType(orderType)">
            {{orderType.name}}
          </div>
        </div>
      </template>
    </coustom-head>
    <div :class="{'fixedSearchBar':fixedSearchBar}">
      <div class="topBox" v-if="orderType == 1">
        <div class="searchInputBox">
          <search-input v-model="keyword" :placeholder="placeholder" @submit="submitInput" @clear="clearInput"
            @click="clickInput"></search-input>
        </div>
        <switch-bar :switchList="switchList" @changeIndex="changeIndex" padding=16></switch-bar>
      </div>
      <div class="topBox" v-if="orderType == 2">
        <div class="searchInputBox">
          <div class="inputMask" @click="goWmUrl('orderList')"></div>
          <search-input :placeholder="placeholder"></search-input>
        </div>
        <switch-bar :switchList="switchList2" @changeIndex="changeIndex2" padding=16></switch-bar>
      </div>
    </div>
    <div v-if="fixedSearchBar" class="mockHeight"></div>
    <div class="bottomBox" v-if="orderType == 1">
      <empty v-if="orderList.length==0&&!isAjax" tips="暂无订单" subTips="松赞，期待与您相遇。"></empty>
      <div class="orderItem" v-for="(item, orderItemIndex) in orderList" :key="orderItemIndex" @click="chooseItem(item)"
        :class="{'invalid':item.orderStatus == 5||item.orderStatus == 4||item.orderStatus == 2}">
        <div class="topItem">
          <div class="leftPart"><i class="iconfont icon" :class="item.iconfont"></i>
            <p class="channel">{{item.channelDesc}}</p>
          </div>
          <div class="rightPart" :class="{'red':item.enhanceSta,'disabled':item.orderStatus == 9}">
            {{item.orderStaDesc}}<span v-if="item.countTime" class="countTime">{{item.countTime}}</span></div>
        </div>
        <div class="middleItem">
          <img
            :src="item.link?item.link:'https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/aggregateCart/emptyIcon.png'"
            alt="" class="logo" mode="aspectFill">
          <div class="info">
            <p class="name">{{item.title}}</p>
            <div class="time"><span class="activityDate"
                v-if="item.activityDate">{{item.activityDate}}&nbsp;&nbsp;</span><span class="unit"
                v-if="item.num>0">数量x{{item.num}}</span></div>
            <div class="desc" v-if="item.couponNo">券码{{item.couponNo}}</div>
            <template v-if="item.orderStatus == 5||item.orderStatus == 4||item.orderStatus == 2">
              <div class="desc">订单金额&nbsp;¥{{item.rateSum}}</div>
            </template>
            <template v-else>
              <template v-if="item.needPay">
                <div class="desc">应付款&nbsp;¥{{item.price}}</div>
                <div class="desc" v-if="item.webPay>0">需付款¥{{item.needPay}}</div>
              </template>
              <template v-else>
                <div class="desc">实付款&nbsp;¥{{item.price}}</div>
              </template>
            </template>
          </div>
        </div>
        <div class="bottomItem">
          <div class="btnLeft" v-if="item.showCancel" @click.stop="goKf(item)">取消订单</div>
          <div class="btnLeft" v-if="item.showKf" @click.stop="goKf(item)">在线客服</div>
          <div class="btnLeft" v-if="item.showInvoice" @click.stop="goInvoice(item)">申请开票</div>
          <div class="btnRight" v-if="item.showExchange" @click.stop="goExchange(item)">去兑换</div>
          <div class="btnRight" v-if="item.showPay" @click.stop="goPay(item)">去付款</div>
          <div class="btnRight" v-if="item.showSign" @click.stop="goSign(item)">立即签约</div>
          <div class="btnRight" v-if="item.showTransfer" @click.stop="goTransfer(item)">填写接送信息</div>
        </div>
      </div>
    </div>
    <div class="bottomBox" v-if="orderType == 2">
      <empty v-if="mallList.length==0&&mallLoad" tips="暂无订单" subTips="松赞，期待与您相遇。"></empty>
      <div class="orderItem" v-for="(item, orderItemIndex) in mallList" :key="orderItemIndex"
        @click="goWmUrl('orderList')" :class="{'invalid':item.invalid}">
        <div class="topItem">
          <div class="leftPart">&nbsp;</div>
          <div class="rightPart" :class="{'red':item.enhanceSta}">{{item.orderStaDesc}}<span v-if="item.countTime"
              class="countTime">{{item.countTime}}</span></div>
        </div>
        <div class="middleItem">
          <img
            :src="item.link?item.link:'https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/aggregateCart/emptyIcon.png'"
            alt="" class="logo" mode="aspectFill">
          <div class="info">
            <p class="name">{{item.title}}</p>
            <div class="time">{{item.orderTimeStr}}</div>
            <div class="desc" v-if="item.couponNo">券码{{item.couponNo}}</div>
            <div class="desc">应付款&nbsp;¥{{item.price}}</div>
            <!-- <template v-if="item.needPay">
              <div class="desc">应付款&nbsp;¥{{item.price}}</div>
              <div class="desc" v-if="item.webPay>0">需付款¥{{item.needPay}}</div>
            </template>
            <template v-else>
              <div class="desc">实付款&nbsp;¥{{item.price}}</div>
            </template> -->
          </div>
        </div>
        <div class="bottomItem">
          <div class="btnLeft" v-if="item.showAfterSales">申请售后</div>
          <div class="btnLeft" v-if="item.showConfirm">确认收货</div>
          <div class="btnLeft" v-if="item.showBook">再次购买</div>
          <div class="btnLeft" v-if="item.showInvoice">开发票</div>
          <div class="btnLeft" v-if="item.showCommit">去点评</div>
          <div class="btnRight" v-if="item.showPay">去付款</div>
        </div>
      </div>
    </div>
    <kf-dialog ref="kf" title="一键咨询"></kf-dialog>
    <exchange-dialog ref="exchange" :orderId="orderId"></exchange-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted } from "vue";
import switchBar from "@/components/switchBar.vue";
import searchInput from "@/components/searchInput.vue";
import coustomHead from "@/components/coustomHead.vue";
import exchangeDialog from "@/components/exchangeDialog.vue";
import kfDialog from "@/components/kfDialog.vue";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import { jAlert3 } from "@/base/jAlert/jAlert";
import {
  onUnload,
  onShow,
  onReachBottom,
  onLoad,
  onPullDownRefresh,
} from "@dcloudio/uni-app";
import { goPage, subtraction, goWmUrl } from "@/utils/utils";
import empty from "@/components/empty.vue";
import UmengSDK from "@/utils/umengAdaptor.js";
import dayjs from "dayjs";
import useScroll from "@/hooks/useScroll";

const { scrollTop, onPageScroll } = useScroll();
let fixedSearchBar = ref(true);
let config = getStorage("config");
let user = getStorage("user");
let wxuser = reactive(getStorage("wxuser"));
let firstResult = ref(0);
let pageSize = ref(8);
let pageNum = ref(1);
let orderList = ref<any>([]);
let mallList = ref<any>([]);
let mallLoad = ref(false);
let interVal = ref(0);
let orderId = ref("");
let exchange = ref();
let kf = ref();
let switchList = reactive([
  {
    name: "全部",
    active: true,
    value: "",
  },
  {
    name: "待签约",
    active: false,
    value: "8",
  },
  {
    name: "待付款",
    active: false,
    value: "1",
  },
  {
    name: "退款/售后",
    active: false,
    value: "2,4",
  },
]);
let switchList2 = reactive([
  {
    name: "全部",
    active: true,
    value: "1",
  },
  {
    name: "待付款",
    active: false,
    value: "2",
  },
  {
    name: "待发货",
    active: false,
    value: "3",
  },
  {
    name: "待收货",
    active: false,
    value: "4",
  },
  {
    name: "待评价",
    active: false,
    value: "5",
  },
  {
    name: "退款/售后",
    active: false,
    value: "6",
  },
]);
let isAjax = ref(false);
let orderStatus = ref("");
let orderTypeList = reactive([
  {
    name: "酒旅订单",
    value: 1,
    active: true,
  },
  {
    name: "风物订单",
    value: 2,
    active: false,
  },
]);
let orderType = ref(1);
const getCurrentOrder = (item: any) => {
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
  let orderInfo = {
    price: item.price,
    order_id: item.orderId || item.orderNo,
    travel_type: bussinessMap[item.channel as keyof typeof bussinessMap],
    button_name: "",
    order_type: getCurrentTab().order_type.name,
    order_top_tab: getCurrentTab().order_top_tab.name,
    count: 1,
    order_name:item.title||""
  };
  return orderInfo;
};
const goKf = (item: any) => {
  UmengSDK.sendEvent(
    "hpop_order_clk",
    Object.assign(getCurrentOrder(item), { button_name: "在线客服" })
  );
  kf.value.showDialog();
};
const goTransfer = (item: any) => {
  UmengSDK.sendEvent(
    "hpop_order_clk",
    Object.assign(getCurrentOrder(item), { button_name: "填写接送信息" })
  );
  uni.navigateTo({
    url: `/pagesD/trip/takeInfo?orderNo=${item.orderNo}`,
  });
};
const goSign = (item: any) => {
  UmengSDK.sendEvent(
    "hpop_order_clk",
    Object.assign(getCurrentOrder(item), { button_name: "立即签约" })
  );
  uni.navigateTo({
    url: `/pagesB/travel/tips?orderNo=${item.orderNo}`,
  });
};
const goPay = (item: any) => {
  UmengSDK.sendEvent(
    "hpop_order_clk",
    Object.assign(getCurrentOrder(item), { button_name: "去付款" })
  );
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
  UmengSDK.sendEvent(
    "hpop_order_clk",
    Object.assign(getCurrentOrder(item), { button_name: "申请开票" })
  );
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
const goExchange = (item: any) => {
  orderId.value = item.orderId;
  getShopOrder(orderId.value);
};
const getShopOrder = (orderId: string) => {
  api
    .shopOrderDetail({
      equipment: config.equipment,
      hotelGroupCode: config.hotelGroupCode,
      hotelGroupId: config.hotelGroupId,
      id: orderId,
    })
    .then((res: any) => {
      if (res.result == 1) {
        let num = 0;
        let hasCustom = false;
        let counponList = res.retVal.listShopOrderItemVO[0].counponList;
        let categorySubs:any = [];
        let travelGroupCodes: any = []
        let travelTypes:any= []
        let itineraryCodes:any= []
        let opt:any ={
          hotelGroupCode:config.hotelGroupCode,
          unitCode:config.hotelGroupCode
        }
        counponList.forEach((counpon: any) => {
            if (counpon.couponSta == "I") {
              num++;
              counpon.couponCodeUseConfigProductDtoList.forEach((productDtoList:any) => {
                if(productDtoList.orderType =="Custom"){
                  hasCustom = true
                }
                if(productDtoList.type=='4'){
                  travelGroupCodes.push(productDtoList.productCode)
                }
                if(productDtoList.type=='3'){
                  itineraryCodes.push(productDtoList.productCode)
                }
                if(productDtoList.type=='2'){
                   if(productDtoList.productPrimaryClassification!='Custom'){
                      categorySubs.push(productDtoList.productPrimaryClassification)
                   }
                }
                if(productDtoList.type=='1'){
                  travelTypes.push(productDtoList.productCode)
                }
                
            });
			 
            }
        });
       
         if(categorySubs.length>0){
			  	opt.categorySubs = categorySubs
			  }
			  if(itineraryCodes.length>0){
			  	opt.itineraryCodes = itineraryCodes
			  }
			  if(travelTypes.length>0){
			  	opt.travelTypes = travelTypes
			  }
			  if(travelGroupCodes.length>0){
			  	opt.travelGroupCodes = travelGroupCodes
			  }
        
        if (hasCustom) {
          api.interfaceTransfer({
            query: opt,
            config: {
              "interfaceType": "POST",
              "interfaceModule": "GC_PRODUCT_JOURNEY",
              "interfaceMethod": "/api/travelGroup/listTravelProductForWechatTdq",
              "interfaceFrom": "GC",
              "hotelGroupCode": config.hotelGroupCode
            }
          })
        .then((res : any) => {
          if (res.result == 1 && res.retVal.result == 0) {
            if(res.retVal.retVal.length>0){
              if (num == 1) {
                goPage(
                  `/pagesB/exchangeCoupon/exchangeList?couponNo=${counponList[0].couponNo}`
                );
              } else {
                exchange.value.showDialog();
              }
            }else{
               kf.value.showDialog();
            }
          }
          
        });
         
        } else {
          if (num == 1) {
            goPage(
              `/pagesB/exchangeCoupon/exchangeList?couponNo=${counponList[0].couponNo}`
            );
          } else {
            exchange.value.showDialog();
          }
        }
      }
    });
};
const chooseItem = (item: any) => {
  UmengSDK.sendEvent("hpop_order_clk", getCurrentOrder(item));
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
const getOrderListOrder = () => {
  if (isAjax.value) {
    return false;
  }
  isAjax.value = true;
  uni.showLoading({
    title: "加载中",
  });
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
    firstResult: firstResult.value,
    mobile: mobile,
    channel: "",
    orderStatus: orderStatus.value,
    payStatus: "",
    pageSize: pageSize.value,
    openid: openid,
    memberid: memberId,
    hotelGroupCode: config.hotelGroupCode,
    searchword: keyword.value,
    memberToken: memberToken,
  };
  api.orderAggregation(opt).then((res: any) => {
    isAjax.value = false;
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
        "7": "待评价",
        "8": "待签约",
        "9": "已完成",
        "11": "出行中",
      };
      res.retVal.orderList.forEach((item: any, index: number) => {
        if (item.orderStatus == "7") {
          item.orderStatus = "9";
        }
        item.channelDesc =
          bussinessMap[item.channel as keyof typeof bussinessMap];
        item.iconfont = iconsMap[item.channel as keyof typeof iconsMap];
        item.orderStaDesc =
          orderStatusMap[item.orderStatus as keyof typeof orderStatusMap];
        if (
          (item.channel == "shop" || item.channel == "activity") &&
          item.orderStatus == 3
        ) {
          item.orderStaDesc = "待使用";
        }
        if (item.orderStatus == "1" || item.orderStatus == "8") {
          item.enhanceSta = true;
        }
        item.webPay = 0;
        item.num = 0;
        item.activityDate = "";
        item.rateSum = item.price;
        /* if (item.channel == "shop" && item.orderStatus == "3") {
          item.orderStaDesc = "待使用";
        } */
        if (item.extraJson) {
          let json = JSON.parse(item.extraJson);
          if (json.webPay) {
            item.webPay = Number(json.webPay);
          }
          if (json.num) {
            item.num = json.num;
          }
          if (json.activityDate) {
            item.activityDate = json.activityDate;
          }
          if (json.prepayHoldSeconds && item.enhanceSta && item.webPay === 0) {
            item.countdown = json.prepayHoldSeconds;
            item.countTime = formatSeconds(item.countdown);
          }
          if (json.couponNo) {
            item.couponNo = json.couponNo;
          }
          if (json.rateSum) {
            item.price = json.rateSum;
            item.rateSum = json.rateSum;
          }
          if (json.dscAmount > 0 || json.dscAmount < 0) {
            item.price = subtraction(
              Number(item.price),
              Number(json.dscAmount)
            );
          }
          if (json.webPay < item.price) {
            item.needPay = subtraction(Number(item.price), Number(json.webPay));
          }
        }
        //取消权限
        if (!["2", "3", "4", "5", "7", "9"].includes(item.orderStatus)) {
          item.showCancel = true;
        }
        //客服权限
        if (["2", "3", "4", "9"].includes(item.orderStatus)) {
          item.showKf = true;
        }
        //支付权限
        if (["1"].includes(item.orderStatus)) {
          item.showPay = true;
        }
        //兑换权限
        if (
          ["3"].includes(item.orderStatus) &&
          ["shop"].includes(item.channel)
        ) {
          item.showExchange = true;
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
      UmengSDK.sendEvent(
        "hpop_search_result",
        {
          result_is_null: res.retVal.orderList.length > 0 ? "否" : "是",
        },
        "OTHER"
      );
      orderList.value = orderList.value.concat(res.retVal.orderList);
      firstResult.value += pageSize.value;
    }
    uni.stopPullDownRefresh();
    uni.hideLoading();
  });
};
const countDown = () => {
  var timer = function () {
    orderList.value.forEach((n: any) => {
      if (n.countdown > 0) {
        n.countTime = formatSeconds(n.countdown);
        n.countdown = n.countdown - 1;
      }
    });
    mallList.value.forEach((n: any) => {
      if (n.countdown > 0) {
        n.countTime = formatSeconds(n.countdown);
        n.countdown = n.countdown - 1;
      }
    });
  };
  interVal.value = setInterval(timer, 1000);
};
const formatSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
onUnload(() => {
  clearInterval(interVal.value);
});
const keyword = ref("");
const placeholder = ref("订单查询");
const changeIndex2 = (index: number) => {
  if (index > 0) {
    goWmUrl("orderList");
  }
};
const changeIndex = (index: number) => {
  if (isAjax.value) {
    return false;
  }
  switchList.forEach((n) => {
    n.active = false;
  });
  switchList[index].active = true;
  orderStatus.value = switchList[index].value;
  getCurrentPv();
  queryNewOder();
};
const clickInput = () => {
  UmengSDK.sendEvent("hpop_search_button_clk", {
    order_type: getCurrentTab().order_type.name,
    order_top_tab: getCurrentTab().order_top_tab.name,
  });
};
const submitInput = (data: any) => {
  UmengSDK.sendEvent(
    "hpop_intiate_search",
    {
      order_type: getCurrentTab().order_type.name,
      order_top_tab: getCurrentTab().order_top_tab.name,
      key_word: keyword.value,
    },
    "OTHER"
  );
  queryNewOder();
};
const clearInput = () => {
  queryNewOder();
};
const switchOrderType = (orderTypeItem: any) => {
  /* if (orderTypeItem.value == 2) {
    jAlert3("敬请期待~");
    return false;
  } */
  orderType.value = orderTypeItem.value;
  orderTypeList.forEach((n) => {
    n.active = false;
  });
  orderTypeItem.active = true;
  getCurrentPv();
  getNewOrder();
};
const queryNewOder = () => {
  orderList.value = [];
  firstResult.value = 0;
  getOrderListOrder();
};
const queryNewOder2 = () => {
  mallList.value = [];
  pageNum.value = 0;
  shopOrderListSearch();
};
const getCurrentPv = () => {
  UmengSDK.sendPV({
    order_type: getCurrentTab().order_type.name,
    order_top_tab: getCurrentTab().order_top_tab.name,
    page_name: "hotel_product_order_pg",
  });
};
const getCurrentTab = () => {
  let order_type = orderTypeList.filter((orderType) => {
    return orderType.active;
  });
  let order_top_tab = switchList.filter((switchItem) => {
    return switchItem.active;
  });
  return {
    order_type: order_type[0],
    order_top_tab: order_top_tab[0],
  };
};
const shopOrderListSearch = () => {
  uni.showLoading({
    title: "加载中",
  });
  api
    .shopOrderListSearch({
      hotelCode: config.hotelCode,
      hotelGroupCode: config.hotelGroupCode,
      pageNum: pageNum.value,
      pageSize: 100,
      queryWmcShopOrderListParam: {
        keyword: "",
        mobile: user.mobile,
        orderDomains: [1, 2, 3],
        queryTime: {
          endTime: dayjs().valueOf(),
          startTime: dayjs().subtract(30, "days").valueOf(),
        },
      },
    })
    .then((res: any) => {
      mallLoad.value = true;
      if (res.result == 1 && res.retVal.code && res.retVal.code.errcode == 0) {
        if (res.retVal.data && res.retVal.data.pageList.length > 0) {
          res.retVal.data.pageList.forEach((n: any) => {
            if (n.orderInfo.orderBaseInfo?.autoCancelTime) {
              n.countDown = n.orderInfo.orderBaseInfo.autoCancelTime / 1000;
            }
            n.price = 0;
            if (n.orderInfo.payInfo.shouldPayAmount) {
              n.price = n.orderInfo.payInfo.shouldPayAmount;
              if (
                n.orderInfo.payInfo.payAmount <
                n.orderInfo.payInfo.shouldPayAmount
              ) {
                n.needPay = subtraction(
                  Number(n.orderInfo.payInfo.shouldPayAmount),
                  Number(n.orderInfo.payInfo.payAmount)
                );
                n.webPay = n.orderInfo.payInfo.payAmount;
              }
            }
            let orderStaMap: any = {
              0: "待付款",
              1: "待付款",
              2: "待发货",
              3: "待发货",
              4: "待发货",
              5: "待收货",
              7: "已完成",
              8: "已完成",
              9: "已取消",
            };
            n.orderStatus = n.orderInfo.orderBaseInfo.orderStatus + "";
            if (n.orderStatus == 9) {
              n.invalid = true;
            }
            n.orderStaDesc = orderStaMap[n.orderInfo.orderBaseInfo.orderStatus];
            if (n.orderInfo.items.length > 0) {
              n.title = n.orderInfo.items[0].goodsTitle;
              n.link = n.orderInfo.items[0].imageUrl;
              n.orderTimeStr = n.orderInfo.items[0].skuAttrInfo;
            }
            //支付权限
            if (["0", "1"].includes(n.orderStatus)) {
              n.showPay = true;
            }
            //售后权限
            if (["3", "4", "5"].includes(n.orderStatus)) {
              n.showAfterSales = true;
            }
            //确认收货权限
            if (["3", "4", "5"].includes(n.orderStatus)) {
              n.showConfirm = true;
            }
            //点评权限
            if (["7"].includes(n.orderStatus)) {
              n.showCommit = true;
            }
            //发票权限
            if (["7", "8"].includes(n.orderStatus)) {
              //n.showInvoice = true;
            }
            //再次购买权限
            if (["7", "8", "9"].includes(n.orderStatus)) {
              n.showBook = true;
            }
          });
          mallList.value = mallList.value.concat(res.retVal.data.pageList);
          pageNum.value += 1;
        }
      }
      uni.hideLoading();
    });
};
onMounted(() => {
  getNewOrder();
  countDown();
  getCurrentPv();
});
onPullDownRefresh(() => {
  setTimeout(() => {
    getNewOrder();
    uni.stopPullDownRefresh();
  }, 1000);
});
const getNewOrder = () => {
  if (orderType.value == 1) {
    queryNewOder();
  }
  if (orderType.value == 2) {
    queryNewOder2();
  }
};
onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
  /* console.log(scrollTop.value,1111111111)
  if(scrollTop.value > 90){
    fixedSearchBar.value = true;
  }else{
    fixedSearchBar.value = false;
  } */
});
onReachBottom(() => {
  if (orderType.value == 1) {
    getOrderListOrder();
  } else {
    shopOrderListSearch();
  }
});
onShow(() => {
  if (orderType.value == 1) {
    if (orderList.value.length > 0) {
      queryNewOder();
    }
  }
  if (orderType.value == 2) {
    if (mallList.value.length > 0) {
      queryNewOder2();
    }
  }
});
onLoad((options: any) => {
  if (options.orderType) {
    orderType.value = options.orderType || 1;
  }
  orderTypeList.forEach((n) => {
    if (n.value == orderType.value) {
      n.active = true;
    } else {
      n.active = false;
    }
  });
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import (reference) url("~@/styles/mixin.less");
.ui_orderList {
  .orderTypeList {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    .orderType {
      font-size: 16px;
      color: #808080;
      margin-right: 12px;
      &.active {
        font-size: 18px;
        color: #000000;
        font-weight: bold;
      }
    }
  }
  .fixedSearchBar {
    position: fixed;
    width: 100%;
  }
  .mockHeight {
    height: 94px;
  }
  .topBox {
    background: #fff;
    .searchInputBox {
      height: 48px;
      padding: 0 16px;
      padding-top: 8px;
      position: relative;
      .inputMask {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 99;
      }
    }
  }
  .bottomBox {
    padding: 16px;
    .orderItem {
      background: #ffffff;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 12px;
      &.invalid {
        .name,
        .time,
        .desc,
        .rightPart {
          color: #808080 !important;
        }
      }
      .topItem {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
        height: 16px;
        .leftPart {
          font-size: 14px;
          color: #000000;
          font-weight: 500;
          display: flex;
          align-items: center;
          .iconfont {
            margin-right: 4px;
            font-size: 16px;
          }
        }
        .rightPart {
          font-size: 14px;
          color: #000;
          &.red {
            color: #a43127;
          }
          &.disabled {
            color: #808080;
          }
          .countTime {
            margin-left: 3px;
          }
        }
      }
      .middleItem {
        display: flex;
        .logo {
          width: 80px;
          height: 80px;
          border-radius: 4px;
          flex-basis: 80px;
        }
        .info {
          padding-left: 12px;
          flex: 1;
          .name {
            font-size: 16px;
            color: #000000;
            font-weight: bold;
            margin-bottom: 5px;
            line-height: 22px;
            .line-clamp(2);
          }
          .time {
            font-size: 12px;
            color: #808080;
            margin-bottom: 8px;
          }
          .desc {
            font-size: 14px;
            color: #000000;
            font-family: Montserrat;
          }
        }
      }
      .bottomItem {
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 12px;
        .btnLeft {
          border: 1px solid #a0a0a0;
          border-radius: 4px;
          color: #000;
          font-size: 14px;
          padding: 7px 12px;
          margin-left: 8px;
        }
        .btnRight {
          .baseBtn();
          margin-left: 8px;
          padding: 8px 12px;
          font-size: 14px;
        }
      }
    }
  }
}
</style>