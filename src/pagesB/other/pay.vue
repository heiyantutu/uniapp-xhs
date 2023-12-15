<template>
  <div class="pay_ui">
    <!-- #ifdef MP -->
    <coustom-head title="支付订单" nativeMode="true" :coustomPage="coustomPage">
    </coustom-head>
    <!-- #endif -->
    <div style="height: 80px"></div>
    <div class="remainder" v-if="order.leftTimeSeconds > 0">
      支付剩余时间 {{ countTime }}
    </div>
    <div class="price">¥{{ balanceAfterPay }}</div>

    <div class="rateSum" v-if="order.rateSum && order.rateSum > balanceAfterPay">
      ¥{{ order.rateSum }}
    </div>
    <div class="name">{{ order.paySubject }}</div>
    <div class="balance-ded" v-if="isOpenChuzhiPay">
      <div class="info">
        <div class="label">余额抵扣</div>
        <div class="val" v-if="!checked">¥{{ accountBalance }}可用</div>
        <div class="val red" v-else>
          -¥{{ Number(usableBalance).toFixed(2) }}
        </div>
      </div>
      <div class="select-box" @click="chooseBalance()">
        <i class="iconfont icon-danxuan_weixuan" v-if="!checked"></i>
        <i class="iconfont icon-danxuan_yixuan" v-if="checked"></i>
      </div>
    </div>
    <div class="baseBtn pay-btn" @click="payOrder()">确认支付</div>
    <div class="part-pay-btn" @click="showPartPay()" v-if="order.payRate >= minPartPrice && needMultiplePay">
      分笔支付
    </div>
    <div class="part-pay-tips" v-if="order.payRate >= minPartPrice && needMultiplePay">
      如遇单笔支付限额可选择分笔支付
    </div>
    <bottom-dialog ref="partPayLayer" title="分笔支付">
      <div class="pay-warp">
        <div class="pay-box">
          <div class="title">本笔支付金额</div>
          <div class="pay-price">
            <div class="rmb">¥</div>
            <div class="placeholder" v-if="partMoneyStr == ''">
              请输入金额，最少输入{{ minPartPrice }}
            </div>

            <div class="pay-input" v-else>{{ partMoneyStr }}</div>
            <div class="all" @click="allPay()">全部</div>
          </div>
          <div class="toBePay">剩余待支付¥{{ toBePay }}</div>
        </div>
        <div class="keyboard">
          <div class="left">
            <div class="key" @click="inputKey(num)" v-for="(num, index) in nums" :key="index">
              {{ num }}
            </div>
            <div class="key big-key" @click="inputKey(0)">0</div>
            <div class="key" @click="inputKey('.')">.</div>
          </div>
          <div class="right">
            <div class="key" @click="inputKey('del')">
              <i class="iconfont icon-a-20_jianpanhuishan"></i>
            </div>
            <div class="rt-key" @click="payOrder('part')">确认支付</div>
          </div>
        </div>
      </div>
    </bottom-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, toRaw } from "vue";
import UmengSDK from "@/utils/umengAdaptor.js";
import bottomDialog from "@/components/bottomDialog.vue";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import { onShow, onLoad, onUnload } from "@dcloudio/uni-app";
import { jAlert3, jAlert5, jAlert12 } from "@/base/jAlert/jAlert";
import { refreshMemberInfo, isCmbchina, isWeChat, addNum } from "@/utils/utils";
import coustomHead from "@/components/coustomHead.vue";

let config = getStorage("config");
let user = reactive(getStorage("user"));
let wxuser = getStorage("wxuser");
let orderNo = ref("");
let productType = ref("");
let payType = ref("WECHAT");
let partMoney = ref(0);
let partMoneyStr = ref("");
const checked = ref(false);
const partPayLayer = ref();
let order = ref<any>({});
let countTimer = ref<any>(0);
let countTime = ref("");
let isPayAjax = ref(false);
let isPart = ref(false);
// let minPartPrice = ref(10000);
let minPartPrice = ref(0.01);
let coustomPage = ref("");
// let minPartPrice = ref(0.02);
let nums = ref([1, 2, 3, 4, 5, 6, 7, 8, 9]);
let needMultiplePay = ref(true);
let isOpenChuzhiPay = ref(true);
let cardTypePrice = ref(false);
let cmbPayUrl = ref(
  "http://netpay.netpay.bas.cmburl.cn:801/netpayment/BaseHttp.dll?MB_APPPay"
);
let staticFrom = ref("");
let minishopMode = ref(false);
let requireOrder = ref("");
let traceId = ref("");
let accountBalance = computed(() => {
  let accountBalance = 0;
  if (user && user.memberBalanceUsable) {
    accountBalance = user.memberBalanceUsable;
  }
  return accountBalance;
});

let usableBalance = computed(() => {
  let usableBalance = 0;
  if (order.value && order.value.payRate) {
    if (order.value.payRate < accountBalance.value) {
      usableBalance = order.value.payRate;
    } else {
      usableBalance = accountBalance.value;
    }
  }

  return usableBalance;
});
let balanceAfterPay = computed(() => {
  let balanceAfterPay = order.value.payRate || 0;
  if (checked.value) {
    balanceAfterPay = balanceAfterPay - usableBalance.value;
  }
  return Number(balanceAfterPay.toFixed(2));
});
let toBePay = computed(() => {
  let toBePay = order.value.payRate - partMoney.value;
  if (checked.value) {
    toBePay = toBePay - usableBalance.value;
  }

  return Number(toBePay.toFixed(2));
});

const inputKey = (val: any) => {
  if (val == ".") {
    if (partMoneyStr.value.indexOf(".") === -1) {
      partMoneyStr.value += ".";
    }
  } else if (val == "del") {
    partMoneyStr.value = partMoneyStr.value.slice(0, -1);
  } else {
    if (
      partMoneyStr.value.indexOf(".") !== -1 &&
      partMoneyStr.value.split(".")[1].length === 2
    ) {
      return;
    }
    partMoneyStr.value += val.toString();
  }
  if (order.value.payRate - Number(partMoneyStr.value) < 0) {
    partMoneyStr.value = order.value.payRate.toString();
  }
  partMoney.value = Number(partMoneyStr.value);
};
const getPayApi = (obj: any) => {
  let payApi: any = "";
  if (productType.value == "shop") {
    payApi = api.shopPay(obj);
  }
  if (productType.value == "hotel") {
    payApi = api.pay(obj);
  }
  if (productType.value == "activity") {
    payApi = api.activityPay(obj);
  }
  if (
    productType.value == "ThemeGroup" ||
    productType.value == "DestPackage" ||
    productType.value == "ButlerCustomized" ||
    productType.value == "FreeTravel" ||
    productType.value == "CUSTOM" ||
    productType.value == "Custom"
  ) {
    payApi = api.travelPay(obj);
  }
  return payApi;
};
const createPayObj = (payType: string) => {
  let orderTypes: any = {
    ticket: "ticket",
    cart: "aggregate",
    combination: "hotel",
    hotel: "hotel",
    pos: "pos",
    annualCard: "ticket",
  };
  let obj: any = {
    hotelGroupCode: config.hotelGroupCode,
    hotelCode: config.hotelCode,
    payType: payType,
    crsNo: orderNo.value,
    channel: "WECHAT",
    otaChannel: "WECHAT",
    openid: wxuser.openid,
    pointDed: "",
    moneyDed: "",
    configUuid: "",
    appid: config.appid,
    componentAppid: config.componentAppid,
    orderType: orderTypes[productType.value],
    memberId: "",
  };
  if (obj.moneyDed == "") {
    obj.configUuid = "";
  }

  if (user && user.memberId) {
    obj.memberId = user.memberId;
  }
  if (obj.payType == "chuzhi") {
    obj.cardId = user.cardId;
    obj.cardNo = user.cardNo;
    obj.password = "";
    obj.verifyId = "";
    obj.verifyCode = "";
    obj.memberId = user.memberId;
    obj.money = order.value.rateSum;
    obj.noPasswordPay = "T";
  }
  if (productType.value == "ticket" || productType.value == "annualCard") {
    obj.money = order.value.totalPrice;
    obj.hotelCode = order.value.hotelCode;
    obj.crsNo = order.value.mainOrderCode;
  }
  if (productType.value == "cart") {
    obj.orderType = "aggregate";
    obj.crsNo = orderNo.value;
    obj.hotelCode = "";
  }
  if (productType.value == "combination") {
    obj.orderType = "hotel";
    obj.crsNo = order.valueCode;
    obj.hotelCode = order.value.hotelCode;
  }
  if (productType.value == "hotel") {
    if (obj.payType == "chuzhi") {
      obj.orderType = "chuzhi";
    }
    obj.crsNo = order.value.crsNo;
    obj.hotelCode = order.value.hotelCode;
    if (checked.value && usableBalance.value < order.value.payRate) {
      obj.chuzhiMoney = usableBalance.value;
    }
  }
  if (productType.value == "pos") {
    obj.orderType = "pos";
    obj.crsNo = order.value.gcRsvNo;
    obj.hotelCode = order.value.hotelCode;
  }
  if (obj.payType == "chuzhi") {
    if (accountBalance.value < order.value.rateSum) {
      obj.money = accountBalance.value;
    }
  }

  if (
    productType.value == "ThemeGroup" ||
    productType.value == "ButlerCustomized" ||
    productType.value == "DestPackage" ||
    productType.value == "FreeTravel" ||
    productType.value == "CUSTOM" ||
    productType.value == "shop" ||
    productType.value == "activity" ||
    productType.value == "Custom"
  ) {
    if (isPart.value) {
      obj.money = partMoney.value;
    } else {
      obj.money = order.value.payRate;
    }
    if (obj.payType == "chuzhi") {
      obj.money = 0;
      if (productType.value == "activity") {
        obj.money = "";
      }
      if (checked.value && usableBalance.value > 0) {
        obj.chuzhiMoney = usableBalance.value;
      }
    } else {
      if (checked.value && usableBalance.value > 0) {
        obj.chuzhiMoney = usableBalance.value;
        obj.cardId = user.cardId;
        obj.cardNo = user.cardNo;
        obj.memberId = user.memberId;
        if (isPart.value) {
          obj.money = partMoney.value;
        } else {
          obj.money = (order.value.payRate - obj.chuzhiMoney).toFixed(2);
        }
      }
    }
    // if (cardTypePrice.value) {
    // 	obj.cardType = order.value.payOrder.cardType
    // }
    obj.orderNo = orderNo.value;
  }
  if (productType.value == "shop") {
    if (obj.payType == "WECHAT_MINI_APP") {
      obj.payType = "wechat_mini_app";
    }
    obj.orderNo = order.value.orderNo;
    obj.subject = order.value.paySubject;
  }
  if (productType.value == "activity") {
    obj.orderNo = orderNo.value;
    obj.mobile = user.mobile;
    obj.cardId = user.cardId;
    obj.cardNo = user.cardNo;
  }
  if (minishopMode.value) {
    obj.requireOrder = requireOrder.value;
    obj.traceId = traceId.value;
  }
  return obj;
};
const chooseBalance = () => {
  if (usableBalance.value <= 0) {
    return;
  }
  checked.value = !checked.value;
};
const chuzhiPay = () => {
  let obj = createPayObj("chuzhi");
  if (isPayAjax.value) {
    return false;
  }
  isPayAjax.value = true;
  let payApi: any = getPayApi(obj);
  payApi.then((pay: any) => {
    if (pay.result == 1) {
      clearInterval(countTimer.value);
      paySucess();
    } else {
      isPayAjax.value = false;
      jAlert3(pay.msg);
    }
  });
};
const payOrder = (type: any) => {
  if (type == "part") {
    isPart.value = true;
    if (partMoney.value < minPartPrice.value) {
      jAlert3(`最少支付${minPartPrice.value}金额`);
      return;
    }
    let chuzhiPrice = 0;
    if (checked.value && usableBalance.value > 0) {
      chuzhiPrice = usableBalance.value;
    }
    if (partMoney.value > order.value.payRate - chuzhiPrice) {
      jAlert3(`输入金额大于最大金额${order.value.payRate - chuzhiPrice}`);
      return;
    }
  } else {
    isPart.value = false;
  }
  if (checked.value == true) {
    if (usableBalance.value >= order.value.payRate) {
      payType.value = "chuzhi";
    } else {
      payType.value = getDefaultPayType();
    }
  } else {
    payType.value = getDefaultPayType();
  }
  if (payType.value == "WECHAT") {
    wechatPay();
  }
  if (payType.value == "chuzhi") {
    chuzhiPay();
  }
  if (payType.value == "cmbPay") {
    cmbPay();
  }
  if (payType.value == "h5_alipay") {
    H5Pay();
  }
  if (payType.value == "xhsPay") {
    xhsPay();
  }
};
const xhsPay = () => {
  let obj = createPayObj("h5_alipay");
  if (isPayAjax.value) {
    return false;
  }
  isPayAjax.value = true;
  let payApi: any = getPayApi(obj);
  uni.showLoading({
    title: "支付中",
  });
  payApi.then((pay: any) => {
    uni.hideLoading();
    if (pay.result == 1) {
      var url = pay.retVal;
      api
        .xhsPay({
          appid: config.appid,
          body: {
            out_order_id: orderNo.value,
            open_id: wxuser.openid,
          },
        })
        .then((pay: any) => {
          if (pay.result == 0) {
            // @ts-ignore
            xhs.requestOrderPayment({
              orderInfo: {
                orderId: pay.retVal.order_id,
                payToken: pay.retVal.pay_token,
                payMethod: "third",
                zfbUrl: `${
                  config.domain
                }/tripV2/#/pagesB/other/xhsPayBridge?redirect_url=${encodeURIComponent(
                  url
                )}`,
              },
              success: function (res: any) {
                isPayAjax.value = false;
                setTimeout(() => {
                  jAlert5("确认是否支付成功", () => {
                    paySucess();
                  });
                }, 5000);
              },
              fail: function (err: any) {
                isPayAjax.value = false;
                jAlert3(JSON.stringify(err));
              },
            });
          } else {
            isPayAjax.value = false;
            jAlert3(pay.msg);
          }
        });
    } else {
      isPayAjax.value = false;
      jAlert3(pay.msg);
    }
  });
};
const H5Pay = () => {
  let obj = createPayObj("h5_alipay");
  if (isPayAjax.value) {
    return false;
  }
  isPayAjax.value = true;
  let payApi: any = getPayApi(obj);
  uni.showLoading({
    title: "支付中",
  });
  payApi.then((pay: any) => {
    uni.hideLoading();
    if (pay.result == 1) {
      var url = pay.retVal;
      jAlert12(
        "点击下方复制按钮,打开浏览器,粘贴网址,即可支付",
        "取消",
        "复制链接",
        () => {
          copy(url);
          isPayAjax.value = false;
          setTimeout(() => {
            jAlert5("确认是否支付成功", () => {
              paySucess();
            });
          }, 2000);
        },
        () => {
          isPayAjax.value = false;
        }
      );
    } else {
      isPayAjax.value = false;
      jAlert3(pay.msg);
    }
  });
};
const copy = (code: string) => {
  uni.setClipboardData({
    data: code,
    success: function (res) {
      jAlert3("复制成功");
    },
  });
};
const cmbPay = () => {
  let obj = createPayObj("cmbPay");
  if (isPayAjax.value) {
    return false;
  }
  isPayAjax.value = true;
  let payApi: any = getPayApi(obj);
  uni.showLoading({
    title: "支付中",
  });
  payApi.then((pay: any) => {
    uni.hideLoading();
    if (pay.result == 1) {
      var json = JSON.parse(pay.retVal);
      function normalization(param: any) {
        let jsonRequestData = JSON.parse(param.billInfo);
        jsonRequestData.reqData.payNoticeUrl = encodeURIComponent(
          jsonRequestData.reqData.payNoticeUrl
        );
        param.billInfo = JSON.stringify(jsonRequestData);
        return param;
      }
      json = normalization(json);
      console.log({
        charset: "UTF-8",
        jsonRequestData: json.billInfo,
      });
      // @ts-ignore
      cmblapi.netpay({
        url: cmbPayUrl.value, //非真实地址，仅为示例
        param: {
          charset: "UTF-8",
          jsonRequestData: json.billInfo,
        },
        success: function (res: any) {
          isPayAjax.value = false;
          setTimeout(() => {
            jAlert5("确认是否支付成功", () => {
              paySucess();
            });
          }, 2000);
        },
        fail: function (res: any) {
          jAlert3(JSON.stringify(res));
        },
      });
    } else {
      isPayAjax.value = false;
      jAlert3(pay.msg);
    }
  });
};
const wechatPay = () => {
  let obj = createPayObj("WECHAT_MINI_APP");
  if (isPayAjax.value) {
    return false;
  }
  isPayAjax.value = true;
  let payApi: any = getPayApi(obj);
  uni.showLoading({
    title: "支付中",
  });
  payApi.then((pay: any) => {
    uni.hideLoading();
    if (pay.result == 1) {
      var json = JSON.parse(pay.retVal);
      // @ts-ignore
      let wxSdk = wx.requestPayment;
      if (minishopMode.value) {
        // @ts-ignore
        wxSdk = wx.requestOrderPayment;
      }
      wxSdk({
        timeStamp: json.timeStamp,
        nonceStr: json.nonceStr,
        package: json.package,
        signType: json.signType || "MD5",
        paySign: json.paySign,
        success: function (res: any) {
          clearInterval(countTimer.value);
          paySucess();
        },
        fail: function (res: any) {
          isPayAjax.value = false;
          jAlert3("取消支付");
        },
      });
    } else {
      isPayAjax.value = false;
      jAlert3(pay.msg);
    }
  });
};
const allPay = () => {
  let chuzhiPrice = 0;
  if (checked.value && usableBalance.value > 0) {
    chuzhiPrice = usableBalance.value;
  }
  partMoney.value = order.value.payRate - chuzhiPrice;
  partMoneyStr.value = partMoney.value.toString();
};
const paySucess = () => {
  refreshMemberInfo(() => {
    user = getStorage("user");
  });
  if (
    productType.value == "ThemeGroup" ||
    productType.value == "DestPackage" ||
    productType.value == "ButlerCustomized" ||
    productType.value == "FreeTravel" ||
    productType.value == "CUSTOM" ||
    productType.value == "Custom"
  ) {
    uni.showLoading({
      title: "支付中",
    });
    hidePartPay();
    setTimeout(() => {
      queryPayDetail(() => {
        uni.hideLoading();
        isPayAjax.value = false;
        if (order.value.payRate > 0) {
          jAlert3("支付成功");
        } else {
          uni.navigateTo({
            url: `/pagesB/travel/paySuccess?orderNo=${orderNo.value}&productType=${productType.value}`,
          });
        }
      });
    }, 5000);
  } else if (productType.value == "shop") {
    uni.showLoading({
      title: "支付中",
    });
    hidePartPay();
    setTimeout(() => {
      getShopOrder(() => {
        uni.hideLoading();
        isPayAjax.value = false;
        if (order.value.payRate > 0) {
          jAlert3("支付成功");
        } else {
          uni.navigateTo({
            url: `/pagesB/travel/paySuccess?orderNo=${orderNo.value}&productType=${productType.value}`,
          });
        }
      });
    }, 3000);
  } else if (productType.value == "activity") {
    uni.showLoading({
      title: "支付中",
    });
    hidePartPay();
    setTimeout(() => {
      queryPayDetail(() => {
        uni.hideLoading();
        isPayAjax.value = false;
        if (order.value.payRate > 0) {
          jAlert3("支付成功");
        } else {
          uni.navigateTo({
            url: `/pagesB/travel/paySuccess?orderNo=${orderNo.value}&productType=${productType.value}`,
          });
        }
      });
      // getActivityOrder(() => {
      //   isPayAjax.value = false;
      //   if (order.value.payRate > 0) {
      //     jAlert3("支付成功");
      //   } else {
      //     uni.navigateTo({
      //       url: `/pagesB/travel/paySuccess?orderNo=${orderNo.value}&productType=${productType.value}`,
      //     });
      //   }
      // });
    }, 5000);
  } else {
    isPayAjax.value = false;
    uni.navigateTo({
      url: `/pagesB/travel/paySuccess?orderNo=${orderNo.value}&productType=${productType.value}`,
    });
  }
};
const showPartPay = () => {
  if (checked.value && accountBalance.value >= order.value.payRate) {
    payOrder("");
  } else {
    UmengSDK.sendEvent("cop_by_instalments_clk", {
      page_name: "confirm_order_pg",
    });

    partPayLayer.value.showDialog();
  }
};
const hidePartPay = () => {
  partPayLayer.value.hideDialog();
};
const getActivityOrder = (cb: any) => {
  api
    .activityOrder({
      memberNo: user.memberId,
      hotelGroupCode: config.hotelGroupCode,
      hotelCode: config.hotelCode,
      actRsvNo: orderNo.value,
      memberToken: user.memberToken,
    })
    .then((res: any) => {
      if (res.result == 1) {
        order.value = res.retVal;
        // order.value.payRate = res.retVal.aggregationOrder.price
        //   ? res.retVal.aggregationOrder.price - res.retVal.prepayAmount
        //   : 0;
        order.value.paySubject =
          res.retVal.aggregationOrder.descript ||
          res.retVal.aggregationOrder.title;
        order.value.leftTimeSeconds = order.value.leftTimeSeconds;
        // order.value.rateSum = order.value.payRate
        // order.value.rateSum = res.retVal.aggregationOrder.price;
        // if (order.value.rateSum > 0.05) {
        //   minPartPrice.value = 0.02;
        // } else if (order.value.rateSum >= 0.01) {
        //   minPartPrice.value = 0.01;
        // }
        if (order.value.leftTimeSeconds > 0 && order.value.paySta == "1") {
          // let timeSeconds = order.value.leftTimeSeconds
          countTimer.value = setInterval(() => {
            if (order.value.leftTimeSeconds > 0) {
              order.value.leftTimeSeconds--;

              countTime.value = formatSeconds(order.value.leftTimeSeconds);
            } else {
              clearInterval(countTimer.value);
            }
          }, 1000);
        }
        queryPayDetail(() => {});
        cb && cb();
      }
    });
};
const getOrderInfo = (cb?: Function) => {
  if (productType.value == "hotel") {
    getOrder(cb);
  }
  if (
    productType.value == "ThemeGroup" ||
    productType.value == "DestPackage" ||
    productType.value == "ButlerCustomized" ||
    productType.value == "FreeTravel" ||
    productType.value == "CUSTOM" ||
    productType.value == "Custom"
  ) {
    getTravelOrder(cb);
  }
  if (productType.value == "shop") {
    getShopOrder(cb);
  }
  if (productType.value == "activity") {
    getActivityOrder(cb);
  }
};
const getShopOrder = (cb: any) => {
  api
    .shopOrderDetail({
      equipment: config.equipment,
      hotelGroupCode: config.hotelGroupCode,
      hotelGroupId: config.hotelGroupId,
      id: orderNo.value,
    })
    .then((res: any) => {
      if (res.result == 1) {
        order.value = res.retVal;
        /* if (res.retVal.actualPrice < accountBalance.value) {
					  usableBalance.value = res.retVal.actualPrice;
					} */
        // if (order.value.actualPrice > 50000) {
        //   minPartPrice.value = 20000;
        // } else if (order.value.actualPrice >= 10000) {
        //   minPartPrice.value = 10000;
        // }
        if (order.value.actualPrice > 0.05) {
          minPartPrice.value = 0.02;
        } else if (order.value.actualPrice >= 0.01) {
          minPartPrice.value = 0.01;
        }
        order.value.rateSum = res.retVal.actualPrice;
        order.value.payRate =
          res.retVal.actualPrice - res.retVal.aleadyPayPrice;
        order.value.paySubject = res.retVal.listShopOrderItemVO[0].goodsName;
        cb && cb();
      }
    });
};
const queryPayDetail = (cb: any) => {
  let obj: any = {
    unitCode: config.hotelGroupCode,
    otaChannel: "wechat",
    ota: "DIRECT",
    isGroup: "T",
    payType: order.value.priceType,
    orderNo: orderNo.value,
    cardLevel: user.cardLevel,
    cardType: user.cardType,
    memberId: user.memberId,
  };

  api
    .interfaceTransfer({
      query: obj,
      config: {
        interfaceType: "POST",
        interfaceModule: "GC_TRAVEL_ORDER",
        interfaceMethod: "/api/reserve/order/queryPayDetail",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        // if (order.value.payOrder && order.value.payOrder.cardType) {
        // 	if (order.value.payOrder.cardType == 'BLJ' || order.value.payOrder.cardType == 'XFJ') {
        // 		checked.value = true
        // 		cardTypePrice.value = true
        // 	}

        // }

        if (productType.value == "activity") {
          if (res.retVal.retVal.activityRateSumDto) {
            res.retVal.retVal = Object.assign(
              res.retVal.retVal,
              res.retVal.retVal.activityRateSumDto
            );
          }
        } else {
          if (res.retVal.retVal.travelRateSumDto) {
            res.retVal.retVal = Object.assign(
              res.retVal.retVal,
              res.retVal.retVal.travelRateSumDto
            );
          }
        }
        if(res.retVal.retVal.activityChangeRateSum>0){
          needMultiplePay.value = false
        }
        order.value.rateSum = Number(
          (
            res.retVal.retVal.rateSum -
            res.retVal.retVal.memberDscAmount -
            res.retVal.retVal.couponRateSum -
            res.retVal.retVal.exchangeRateSum - res.retVal.retVal.gwDiscount
          ).toFixed(2)
        );
       
        order.value.payRate = res.retVal.retVal.readyPay;
        if (order.value.rateSum && order.value.rateSum > order.value.payRate) {
          order.value.leftTimeSeconds = 0;
        }
        // if (order.value.rateSum > 50000) {
        //   minPartPrice.value = 20000;
        // } else if (order.value.rateSum >= 10000) {
        //   minPartPrice.value = 10000;
        // }
        if (order.value.rateSum > 0.05) {
          minPartPrice.value = 0.02;
        } else if (order.value.rateSum >= 0.01) {
          minPartPrice.value = 0.01;
        }
        /* if (order.value.payRate < accountBalance.value) {
					  usableBalance.value = order.value.payRate;
					} */
        cb && cb();
      }
    });
};
const getTravelOrder = (cb: any) => {
  api
    .orderDetail({
      memberNo: user.memberId,
      memberId: user.memberId,
      hotelGroupCode: config.hotelGroupCode,
      hotelCode: config.hotelCode,
      travelOrderNo: orderNo.value,
      mobile: user.mobile,
    })
    .then((res: any) => {
      if (res.result == 1) {
        order.value = res.retVal.reserveOrder;
        order.value.paySubject = res.retVal.reserveOrder.productDesc;
        order.value.leftTimeSeconds = order.value.countdown;
        if (order.value.leftTimeSeconds > 0 && order.value.paySta == "1") {
          // let timeSeconds = order.value.leftTimeSeconds
          countTimer.value = setInterval(() => {
            if (order.value.leftTimeSeconds > 0) {
              order.value.leftTimeSeconds--;

              countTime.value = formatSeconds(order.value.leftTimeSeconds);
            } else {
              clearInterval(countTimer.value);
            }
          }, 1000);
        }else{
          order.value.leftTimeSeconds = 0
        }
        queryPayDetail(() => {});
        cb && cb();
      }
    });
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
const getOrder = (cb: any) => {
  api
    .showOrder({
      orderNo: orderNo.value,
      hotelGroupCode: config.hotelGroupCode,
      appid: config.appid,
      componentAppid: config.componentAppid,
    })
    .then((res: any) => {
      if (res.result == 1) {
        order.value = res.retVal;
        console.log(toRaw(order.value), 111111111111111111111);
        if (order.value.leftTimeSeconds > 0 && order.value.payRate !== 0) {
          countTimer.value = setInterval(() => {
            if (order.value.leftTimeSeconds > 0) {
              order.value.leftTimeSeconds--;
              countTime.value = formatSeconds(order.value.leftTimeSeconds);
            } else {
              clearInterval(countTimer.value);
            }
          }, 1000);
        }
        cb && cb();
      } else {
        jAlert3(res.msg);
      }
    });
};

const countDown = () => {
  console.log(toRaw(order.value));
  if (order.value.leftTimeSeconds > 0) {
    var t = order.value.leftTimeSeconds;
    var timer = function () {
      if (t <= 0) {
        clearInterval(countTimer.value);
        order.value.leftTimeSeconds = "";
      } else {
        var d: number | string = 0;
        var h: number | string = 0;
        var m: number | string = 0;
        var s: number | string = 0;
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
        countTime.value = `(${m}:${s})`;
        t = t - 1;
      }
    };
    countTimer.value = setInterval(timer, 1000);
  }
};
const getfunctionControl = () => {
  var codes = ["cmbPayUrl"];
  var params = {
    appid: config.appid,
    codes: codes.join(","),
    componentAppid: config.componentAppid,
    hotelCode: config.hotelCode ? config.hotelCode : 0,
    hotelGroupCode: config.hotelGroupCode,
    clientType: "wechat_mini",
  };
  api.getMultiSysOptionCommon(params).then((data: any) => {
    if (data.result == 1) {
      data.retVal.forEach(function (n: any) {
        if (n.code == "cmbPayUrl" && n.value) {
          cmbPayUrl.value = n.value;
        }
      });
    }
  });
};
const checkBeforeAddOrder = () => {
  // @ts-ignore
  wx.checkBeforeAddOrder({
    success(res: any) {
      if ((res.errMsg = "checkBeforeAddOrder:ok")) {
        requireOrder.value = res.data.requireOrder;
        traceId.value = res.data.traceId;
      } else {
        jAlert3(res.errMsg);
      }
    },
    fail(res: any) {
      jAlert3(JSON.stringify(res));
    },
  });
};
const getDefaultPayType = () => {
  let defaultPayType = "WECHAT";
  // #ifdef MP-XHS
  defaultPayType = "xhsPay";
  // #endif
  if (isCmbchina()) {
    defaultPayType = "cmbPay";
  } else {
    // #ifdef H5
    if (!isWeChat()) {
      defaultPayType = "h5_alipay";
    }
    // #endif
  }
  return defaultPayType;
};
onLoad((options: any) => {
  orderNo.value = options.orderNo;
  productType.value = options.productType;
  staticFrom.value = options.staticFrom || "";
  if (productType.value == "hotel" || productType.value == "shop") {
    needMultiplePay.value = false;
  }
  payType.value = getDefaultPayType();
});
onMounted(() => {
  if (productType.value == "hotel") {
    coustomPage.value = `/pagesC/order/orderInfo?orderNo=${orderNo.value}`;
  } else if (productType.value == "shop") {
    coustomPage.value = `/pagesB/travel/orderDetail?orderNo=${orderNo.value}&productType=${productType.value}`;
  } else if (productType.value == "activity") {
    coustomPage.value = `/pagesE/dailyActivity/dailyOrderDetail?orderNo=${orderNo.value}&productType=${productType.value}`;
  } else {
    coustomPage.value = `/pagesB/travel/orderDetail?orderNo=${orderNo.value}`;
  }
  getOrderInfo(() => {
    // #ifdef MP-WEIXIN
    if (order.value.staticFrom == "sxshop") {
      minishopMode.value = true;
      if (minishopMode.value) {
        needMultiplePay.value = false;
        isOpenChuzhiPay.value = false;
        checkBeforeAddOrder();
      }
    }
    // #endif
  });
  getfunctionControl();
});
onUnload(() => {
  clearInterval(countTimer.value);
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");

.pay_ui {
  .remainder {
    text-align: center;
    font-size: 14px;
    color: #808080;
  }

  .price {
    font-size: 40px;
    margin-top: 12px;
    font-family: Montserrat;
    font-weight: 600;
    color: #000;
    text-align: center;
    line-height: 1.2;
  }

  .rateSum {
    margin-top: 12px;
    font-size: 16px;
    font-weight: 600;
    color: #000;
    text-align: center;
    font-family: Montserrat;
    text-decoration: line-through;
  }

  .name {
    margin-top: 20px;
    text-align: center;
    font-size: 14px;
    color: #808080;
  }

  .balance-ded {
    margin: 80px 16px 0;
    display: flex;
    justify-content: space-between;
    background: #fff;
    height: 48px;
    align-items: center;
    border-radius: 8px;
    padding: 0 12px;

    .info {
      display: flex;

      .label {
        font-size: 14px;
        font-family: PingFang SC;
        font-style: normal;
        font-weight: 400;
        width: 76px;
      }

      .val {
        font-size: 14px;
        color: #ccc;
        margin-left: 12px;

        &.red {
          color: #a43127;
          font-family: Montserrat;
          font-weight: 600;
        }
      }
    }

    .select-box {
      .iconfont {
        font-size: 16px;
      }

      .icon-danxuan_weixuan {
        color: #808080;
      }

      .icon-danxuan_yixuan {
        color: #a43127;
      }
    }
  }

  .pay-btn {
    margin: 80px 16px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
  }

  .part-pay-btn {
    border-radius: 4px;
    margin: 12px 16px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    border: 1px solid #000;
  }

  .part-pay-tips {
    margin-top: 24px;
    text-align: center;
    color: #808080;
    font-size: 14px;
  }

  .pay-warp {
    padding: 24px 16px 30px;
  }

  .pay-box {
    background: #fff;
    border-radius: 8px;
    padding: 16px 12px;

    .title {
      font-weight: bold;
      line-height: 16px;
      font-size: 16px;
    }

    .pay-price {
      display: flex;
      align-items: center;
      margin-top: 26px;
      padding: 10px 0;

      .rmb {
        font-family: Montserrat;
        font-size: 32px;
        font-style: normal;
        font-weight: 600;
        line-height: 32px;
        margin-right: 8px;
      }

      .placeholder {
        flex: 1;
        font-size: 14px;
        color: #ccc;
        margin-top: 10px;
      }

      .pay-input {
        flex: 1;
        line-height: 1;
        margin: 0 8px;
        height: 32px;
        font-family: Montserrat;
        font-size: 32px;
        font-style: normal;
        font-weight: 600;
      }

      .all {
        font-weight: 400;
        line-height: 14px;
        color: #000;
        padding: 8px 12px;
        font-size: 14px;
        // border: 0.5px solid #808080;
        border-radius: 4px;
        .halfPixel(4px,#808080);
      }
    }

    .toBePay {
      font-size: 14px;
      color: #808080;
      margin-top: 10px;
    }
  }

  .keyboard {
    position: relative;
    width: calc(100% + 32px);
    margin-left: -16px;
    padding: 0 16px;
    margin-top: 50px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      transform: scaleY(0.5);
      height: 1px;
      background: #ddd;
    }

    .key {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      height: 48px;
      border-radius: 4px;
      font-size: 18px;
      font-weight: 600;
      .del-key {
        width: 20px;
        height: 20px;
      }
      .icon-a-20_jianpanhuishan {
        font-size: 20px;
      }
    }

    .left {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .key {
        margin-top: 6px;
        width: calc(33.3% - 5px);

        &.big-key {
          width: calc(66.6% - 2.5px);
        }
      }
    }

    .right {
      width: 25%;
      padding-left: 8px;
      box-sizing: content-box;

      .key {
        width: 100%;
        margin-top: 6px;
      }

      .rt-key {
        width: 100%;
        justify-content: center;
        display: flex;
        align-items: center;
        font-size: 16px;
        border-radius: 4px;
        height: 160px;
        margin-top: 8px;
        background: #000;
        color: #fff;
      }
    }
  }
}
</style>
