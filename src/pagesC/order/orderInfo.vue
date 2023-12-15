<template>
  <div class="ui_orderInfo" v-if="order&&order.hotelCode">
    <coustom-head color="#fff" title="订单详情" :customClass="order.sta == 'X'?'':'customPattern'"
      :bgColor="order.sta == 'X'?'#7f7d75':''"></coustom-head>
    <div class="order-sta" :class="{ cancelSta: order.sta == 'X' }" :style="{ paddingTop: navHeight + 'px' }">
      <div class="sta">
        {{sta.topSta}}
      </div>
      <div class="desc">
        {{countdown?countdown:sta.subSta}}
      </div>
    </div>
    <div class="travel-info">
      <div class="travel-img">
        <img :src="order.logoUrl" class="logo" mode="aspectFill">
      </div>
      <div class="travel-rt">
        <div class="travel-name">{{order.hotelDescript}}</div>
        <div class="travel-desc">{{order.roomDescript}}</div>
        <div class="travel-time">{{timeFilterMD(order.arr)}}- {{timeFilterMD(order.dep)}}，{{zday}}晚
        </div>
      </div>
    </div>
    <div class="travelersInfo">
      <div class="tl">订房信息</div>
      <div class="checkInInfo">
        <div class="label">
          房间数
        </div>
        <div class="occupant">{{order.rmnum}}间</div>
      </div>
      <div class="checkInInfo top" v-for="(guest,guestIndex) in order.guestList" :key="guestIndex">
        <div class="label">
          {{guestIndex == 0?"入住人":""}}
        </div>
        <div class="occupant">
          <div class="name">{{guest.name}}</div>
          <div class="id-card">{{idCardType[guest.idCode]}}&nbsp;&nbsp;{{hideIdCard(guest.idNo,guest.idCode)}}</div>
          <div class="phone">{{guest.mobile}}</div>
        </div>
      </div>
      <div class="checkInInfo">
        <div class="label">
          预计到店
        </div>
        <div class="occupant">{{timeFilter(order.arrStr)}}</div>
      </div>
      <div class="checkInInfo">
        <div class="label">
          其他需求
        </div>
        <div class="occupant">{{order.remark}}</div>
      </div>
    </div>
    <div class="travelersInfo">
      <div class="tl">费用明细</div>
      <div class="travelersInfo-list">
        <template v-if="moreOrderInfo!='T'">
          <div class="travelersInfo-item">
            <div class="label">
              计价组合
            </div>
            <div class="val">全现金</div>
          </div>
          <div class="travelersInfo-item total-price">
            <div class="label">
              订单总价
            </div>
            <div class="val">¥{{baseRoomPrice}}</div>
          </div>
        </template>
        <div class="info-more" v-if="moreOrderInfo=='T'">
          <div class="price-box">
            <div class="travelersInfo-item total-price">
              <div class="label">
                订单总价
              </div>
              <div class="val">¥{{baseRoomPrice}}</div>
            </div>
            <div class="travelersInfo-item">
              <div class="label">
                计价组合
              </div>
              <div class="val">全现金</div>
            </div>
            <div class="travelersInfo-item" v-if="baseRoomPrice>0">
              <div class="label">
                基本房费<span v-if="memberDisDesc" class="sub">({{memberDisDesc}})</span>
              </div>
              <div class="val">¥{{valFormat(roomPrice)}}</div>
            </div>
            <div class="travelersInfo-item" v-if="singleRoomRateSum>0">
              <div class="label">
                单房差
              </div>
              <div class="val">¥{{singleRoomRateSum}}</div>
            </div>
            <div class="travelersInfo-item" v-if="addBedSum>0">
              <div class="label">
                加床费
              </div>
              <div class="val">¥{{addBedSum}}</div>
            </div>
            <div class="travelersInfo-item" v-if="addBfSum>0">
              <div class="label">
                加早费
              </div>
              <div class="val">¥{{addBfSum}}</div>
            </div>
            <div class="travelersInfo-item" v-if="upRmTypeSum>0">
              <div class="label">
                升级房型费
              </div>
              <div class="val">¥{{upRmTypeSum}}</div>
            </div>
          </div>
          <div class="price-box" v-if="payData.allRateSum>0">
            <div class="travelersInfo-item total-price">
              <div class="label">
                权益抵扣
              </div>
              <div class="val price red">-¥{{payData.allRateSum}}</div>
            </div>
            <div class="travelersInfo-item"
              v-if="payData.couponSimpleInfoDtoList&&payData.couponSimpleInfoDtoList.length>0"
              v-for="(coupon,couponIndex) in payData.couponSimpleInfoDtoList" :key="couponIndex">
              <div class="label">
                {{coupon.descript}}
              </div>
              <div class="val">-¥{{coupon.realValue}}</div>
            </div>
            <div class="travelersInfo-item" v-if="gwDiscount>0">
              <div class="label">
                顾问调整
              </div>
              <div class="val">-¥{{gwDiscount}}</div>
            </div>
          </div>
          <div class="price-box">
            <div class="travelersInfo-item total-price">
              <div class="label">
                订单金额
              </div>
              <div class="val price">¥{{valFormat(needPayPrice)}}</div>
            </div>
            <div class="travelersInfo-item" v-if="payData.alreadyPayFund+payData.alreadyPayMember>0">
              <div class="label">
                已支付
              </div>
              <div class="val price red">¥{{payData.alreadyPayFund+payData.alreadyPayMember|valFormat}}</div>
            </div>
            <!-- <div class="travelersInfo-item" v-if="payData.alreadyPayMember&&payData.alreadyPayMember>0">
              <div class="label">
                实付（余额）
              </div>
              <div class="val price red">¥{{payData.alreadyPayMember}}</div>
            </div> -->
            <div class="travelersInfo-item" v-if="order.paySta!=2&&payData.readyPay>0&&order.sta!=='X'">
              <div class="label">
                待支付
              </div>
              <div class="val price red">¥{{payData.readyPay}}</div>
            </div>
          </div>
          <div class="price-box" v-if="breakMoney">
            <div class="travelersInfo-item total-price">
              <div class="label">
                退款相关
              </div>
              <div class="val price">{{breakMoney}}</div>
            </div>
            <div class="travelersInfo-item">
              <div class="label">
                违约金
              </div>
              <div class="val price red">¥{{breakMoney}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="travelersInfo-item">
        <div class="label">
          计价组合
        </div>
        <div class="val">全现金</div>
      </div>
      <div class="info-more" v-if="moreOrderInfo=='T'">
        <div class="travelersInfo-item" v-if="baseRoomPrice>0">
          <div class="label">
            基本房费<span v-if="memberDisDesc" class="sub">({{memberDisDesc}})</span>
          </div>
          <div class="val">¥{{baseRoomPrice}}</div>
        </div>
        <div class="travelersInfo-item" v-if="couponRateSum>0">
          <div class="label">
            券包抵扣
          </div>
          <div class="val">-¥{{couponRateSum}}</div>
        </div>
        <div class="travelersInfo-item" v-if="gwDiscount>0">
          <div class="label">
            顾问调整
          </div>
          <div class="val">-¥{{gwDiscount}}</div>
        </div>
        <div class="travelersInfo-item" v-if="singleRoomRateSum>0">
          <div class="label">
            单房差
          </div>
          <div class="val">+¥{{singleRoomRateSum}}</div>
        </div>
        <div class="travelersInfo-item" v-if="addBedSum>0">
          <div class="label">
            加床费
          </div>
          <div class="val">+¥{{addBedSum}}</div>
        </div>
        <div class="travelersInfo-item" v-if="addBfSum>0">
          <div class="label">
            加早费
          </div>
          <div class="val">+¥{{addBfSum}}</div>
        </div>
        <div class="travelersInfo-item" v-if="upRmTypeSum>0">
          <div class="label">
            升级房型费
          </div>
          <div class="val">+¥{{upRmTypeSum}}</div>
        </div>
        <div class="travelersInfo-item" v-if="breakMoney>0">
          <div class="label">
            违约金
          </div>
          <div class="val">+¥{{breakMoney}}</div>
        </div>
      </div>
      <div class="travelersInfo-item">
        <div class="label">
          订单应付
        </div>
        <div class="val price">¥{{valFormat(needPayPrice)}}</div>
      </div>
      <div class="travelersInfo-item" v-if="payData.alreadyPayFund&&payData.alreadyPayFund>0">
        <div class="label">
          实付（现金）
        </div>
        <div class="val price red">¥{{payData.alreadyPayFund}}</div>
      </div>
      <div class="travelersInfo-item" v-if="payData.alreadyPayMember&&payData.alreadyPayMember>0">
        <div class="label">
          实付（余额）
        </div>
        <div class="val price red">¥{{payData.alreadyPayMember}}</div>
      </div>
      <div class="travelersInfo-item" v-if="order.paySta!=2&&payData.readyPay>0">
        <div class="label">
          订单需付
        </div>
        <div class="val price red">¥{{payData.readyPay}}</div>
      </div> -->
      <div class="open-btn" v-if="moreOrderInfo=='F'" @click="moreOrderInfo='T'">展开更多<i
          class="iconfont icon-a-12_xialajiantou_hei"></i>
      </div>
      <div class="open-btn" v-else @click="moreOrderInfo='F'">收起更多<i class="iconfont icon-a-12_shanglajiantou_hei"></i>
      </div>
    </div>
    <div class="travelersInfo">
      <div class="tl">订单信息</div>
      <div class="travelersInfo-item">
        <div class="label">
          订单号
        </div>
        <div class="val" @click="copy(order.crsNo)">{{order.crsNo}}<i class="iconfont icon-a-12_fuzhi"></i></div>
      </div>
      <div class="travelersInfo-item">
        <div class="label">
          下单时间
        </div>
        <div class="val">{{order.createDatetime}}</div>
      </div>
      <div class="travelersInfo-item">
        <div class="label">
          支付时间
        </div>
        <div class="val">{{order.crsPayDatetime}} </div>
      </div>
      <div class="travelersInfo-item">
        <div class="label">
          联系人
        </div>
        <div class="val">{{order.rsvMan}}&nbsp;&nbsp;{{order.mobile}}</div>
      </div>
    </div>
    <div class="travelersInfo" v-if="annexList.length>0">
      <div class="tl">订单附件</div>
      <div class="annex-list">
        <div class="annex-item" v-for="(annexItem,annexItemIndex) in annexList" :key="annexItemIndex"
          @click="goPage(annexItem.url)">
          <i class="iconfont icon-a-12_fujian"></i>{{annexItem.name}}.pdf
        </div>
      </div>
    </div>
    <div class="card">
      <link-item v-for="(listItem,listItemIndex) in list" :key="listItemIndex" :linkItem="listItem"
        @chooseLink="chooseLink"></link-item>
    </div>
    <div class="footer" v-if="order.sta == 'R'">
      <div class="btns">
        <div class="btn-def" @click="showKf">取消订单</div>
        <div class="btn-def baseBtn" @click="toPay" v-if="order.paySta!='2'">确认支付
        </div>
      </div>
    </div>
    <div class="footer" v-if="order.sta == 'X'">
      <div class="btns">
        <div class="btn-def" @click="showKf">在线客服</div>
      </div>
    </div>
    <div class="footer" v-if="order.sta == 'O'">
      <div class="btns">
        <div class="btn-def" @click="showKf">在线客服</div>
        <div class="btn-def baseBtn" @click="goInvoice" v-if="invoiceSta !=='NI'">申请开票</div>
      </div>
    </div>
    <bottom-dialog title="预订政策" ref="ruleCompent">
      <div class="ruleBox">
        <mp-html :content="cancelRule"></mp-html>
      </div>
    </bottom-dialog>
    <kf-dialog ref="kf" title="如需取消订单请联系客服"></kf-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import api from "@/utils/api";
import coustomHead from "@/components/coustomHead.vue";
import { jAlert3, jAlert5 } from "@/base/jAlert/jAlert";
import { getStorage } from "@/utils/wxuser";
import { onPageScroll, onLoad, onUnload, onShow } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { timeFilterMD, hideIdCard } from "@/utils/filter";
import { goPage, subtraction, createUrl, addNum } from "@/utils/utils";
import { valFormat } from "@/utils/filter";
import kfDialog from "@/components/kfDialog.vue";
import linkItem from "@/components/linkItem.vue";
import bottomDialog from "@/components/bottomDialog.vue";

let user = getStorage("user");
let config = getStorage("config");
const orderNo = ref("");
let order = ref<any>({});
let hotelInfo = ref<any>({});
let hotelCode = ref("");
let moreOrderInfo = ref("F");
let kf = ref();
let ruleCompent = ref();
let cancelRule = ref();
let invoiceSta = ref("NI");
const navHeight = ref("60");
let memberDisDesc = ref("");
let idCardType = reactive({
  "01": "身份证",
  "02": "临时身份证",
  "14": "护照",
  "21": "港澳通行证",
});
let annexList = ref<any>([]);
let orderInvoice = ref<any>({});
let payData = ref<any>({});
let roomPrice = ref(0);
let baseRoomPrice = ref(0);
let couponRateSum = ref(0);
let gwDiscount = ref(0);
let singleRoomRateSum = ref(0);
let addBedSum = ref(0);
let addBfSum = ref(0);
let upRmTypeSum = ref(0);
let breakMoney = ref(0);
let needPayPrice = ref(0);
const countdown: any = ref("");
const intervalId: any = ref(null);
const leftTimeSeconds = ref();
const formatSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `剩余${formattedHours}小时${formattedMinutes}分${formattedSeconds}秒`;
};
const goInvoice = () => {
  if (invoiceSta.value == "CI") {
    uni.navigateTo({
      url: `/pagesF/invoice/applyInvoice?orderNo=${orderNo.value}&orderType=R&productType=hotel`,
    });
  } else {
    uni.navigateTo({
      url: `/pagesF/invoice/invoiceDetails?orderNo=${orderNo.value}&orderType=R&productType=hotel`,
    });
  }
};
const toPay = () => {
  uni.redirectTo({
    url: `/pagesB/other/pay?orderNo=${order.value.crsNo}&productType=hotel`,
  });
};
const getInvoiceOrder = () => {
  api
    .getInvoiceOrder({
      hotelCode: order.value.hotelCode,
      hotelGroupCode: config.hotelGroupCode,
      orderNo: orderNo.value,
      orderType: "R",
    })
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.resultCode == 0) {
          orderInvoice.value = res.retVal.orderInvoice;
          if (orderInvoice.value.eiinvoicePdfUrl) {
            annexList.value.push({
              name: "发票",
              url: orderInvoice.value.eiinvoicePdfUrl,
            });
          }
        }
      }
      console.log(res);
    });
};
const getOrderInvoiceSta = () => {
  let orderType = "R";
  api
    .getOrderInvoiceSta({
      hotelCode: order.value.hotelCode,
      hotelGroupCode: config.hotelGroupCode,
      orderNo: order.value.crsNo,
      orderType: orderType,
    })
    .then((res: any) => {
      if (res.result == 1) {
        invoiceSta.value = res.retVal.invoiceSta;
        if (invoiceSta.value == "HI") {
          getInvoiceOrder();
        }
      }
    });
};
const getCancelRule = () => {
  var obj = {
    gcRsvNo: order.value.crsNo,
    hotelGroupCode: order.value.hotelGroupCode || config.hotelGroupCode,
    miniAppid: config.appid,
    miniHotelCode: 0,
    productHotelCode: order.value.hotelCode,
    productCode: order.value.productCode,
  };
  api.getCancelRule(createUrl(obj)).then((res: any) => {
    if (res.result == 1) {
      cancelRule.value = res.retVal.cancelRule;
    }
    console.log(res);
  });
};
let list = reactive([
  {
    name: "预订政策",
    type: "dialog",
  },
]);
const chooseLink = (item: any) => {
  if (item.type == "dialog") {
    ruleCompent.value.showDialog();
  }
};
const showKf = () => {
  kf.value.showDialog();
};
const timeFilter = (val: string): string => {
  return dayjs(val).format("HH:mm");
};
onPageScroll((e) => {
  // console.log(e)
});
const zday = computed(() => {
  var arr = new Date(order.value.arr.replace(/\-/g, "/")).getTime(),
    dep = new Date(order.value.dep.replace(/\-/g, "/")).getTime();
  var days = dep - arr;
  days = Math.round(days / 86400000);
  return days;
});
const sta = computed(() => {
  let topSta = "";
  let subSta = "";
  if (order.value.sta == "R" && order.value.paySta !== 2) {
    topSta = "待付款";
    subSta = "请尽快完成支付。";
  }
  if (order.value.sta == "R" && order.value.paySta == 2) {
    topSta = "待出行";
    subSta = "松赞期待与您相遇。";
  }
  if (order.value.sta == "I") {
    topSta = "出行中";
    subSta = "松赞祝您旅途愉快。";
  }
  if (order.value.sta == "O") {
    topSta = "已完成";
    subSta = "松赞感谢您的支持。";
  }
  if (order.value.sta == "X") {
    topSta = "已取消";
    subSta = "松赞期待与您相遇。";
  }
  if (order.value.sta == "N") {
    topSta = "预订未到店";
    subSta = "松赞期待与您相遇。";
  }
  if (order.value.sta == "S") {
    topSta = "已挂账";
    subSta = "松赞期待与您相遇。";
  }
  if (order.value.sta == "W") {
    topSta = "待处理";
    subSta = "松赞期待与您相遇。";
  }
  return {
    topSta,
    subSta,
  };
});
const copy = (val: string) => {
  uni.setClipboardData({
    data: val,
    success: function () {
      jAlert3("复制成功");
    },
  });
};
const showOrder = () => {
  api
    .showOrder({
      orderNo: orderNo.value,
      hotelGroupCode: config.hotelGroupCode,
    })
    .then((res: any) => {
      if (res.result == 1) {
        order.value = res.retVal;
        hotelCode.value = order.value.hotelCode;
        if (order.value.memberLevel !== "000") {
          if (user && user.memberId) {
            getAllCardLevel();
          }
        }
        getHotelInfo();
        getCancelRule();
        getOrderInvoiceSta();
        if (
          order.value.leftTimeSeconds &&
          order.value.paySta != "2" &&
          order.value.sta == "R"
        ) {
          countdown.value = formatSeconds(order.value.leftTimeSeconds);
          intervalId.value = setInterval(() => {
            if (order.value.leftTimeSeconds > 0) {
              order.value.leftTimeSeconds--;
              countdown.value = formatSeconds(order.value.leftTimeSeconds);
            } else {
              countdown.value = "";
              clearInterval(intervalId.value);
            }
          }, 1000);
        }
      } else {
        jAlert3(res.msg);
      }
    });
};
const getAllCardLevel = () => {
  api
    .getAllCardLevel({
      isPhysical: "F",
      hotelGroupId: config.hotelGroupId,
      hotelGroupCode: config.hotelGroupCode,
      cardType: order.value.cardType,
    })
    .then((res: any) => {
      if (
        res.result == 1 &&
        res.retVal.listLevelDto &&
        res.retVal.listLevelDto.length > 0
      ) {
        res.retVal.listLevelDto.forEach((n: any) => {
          if (n.code == order.value.cardLevel) {
            memberDisDesc.value = `已享受${n.descript}会员价`;
          }
        });
      }
    });
};
const getHotelInfo = () => {
  api
    .hotelInfo({
      channel: "wechat",
      hotelCode: hotelCode.value,
      hotelGroupCode: order.value.hotelGroupCode || config.hotelGroupCode,
    })
    .then((res: any) => {
      if (res.result == 1) {
        hotelInfo.value = res.retVal;
      } else {
        jAlert3(res.msg);
      }
    });
};
const queryPayDetail = () => {
  let obj: any = {
    unitCode: config.hotelGroupCode,
    /* otaChannel: "wechat",
    ota: "DIRECT", */
    orderNo: orderNo.value,
    /* cardLevel: user.cardLevel,
    cardType: user.cardType, */
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
        payData.value = res.retVal.retVal;
        /* let basePrice = subtraction(
          payData.value.rateSum,
          payData.value.couponRateSum
        );
        basePrice = subtraction(basePrice, payData.value.gwDiscount);
        baseRoomPrice.value = basePrice; */
        baseRoomPrice.value = payData.value.rateSum;
        couponRateSum.value = payData.value.couponRateSum || 0;
        if (
          payData.value.travelRateSumDto &&
          payData.value.travelRateSumDto.singleRoomRateSum
        ) {
          singleRoomRateSum.value =
            payData.value.travelRateSumDto.singleRoomRateSum;
        }
        if (
          payData.value.travelRateSumDto &&
          payData.value.travelRateSumDto.addBedSum
        ) {
          addBedSum.value = payData.value.travelRateSumDto.addBedSum;
        }
        if (
          payData.value.travelRateSumDto &&
          payData.value.travelRateSumDto.addBfSum
        ) {
          addBfSum.value = payData.value.travelRateSumDto.addBfSum;
        }
        if (
          payData.value.travelRateSumDto &&
          payData.value.travelRateSumDto.upRmTypeSum
        ) {
          upRmTypeSum.value = payData.value.travelRateSumDto.upRmTypeSum;
        }
        breakMoney.value = payData.value.breakMoney;
        gwDiscount.value = payData.value.gwDiscount;
        needPayPrice.value =
          baseRoomPrice.value - couponRateSum.value - gwDiscount.value;
        roomPrice.value =
          baseRoomPrice.value -
          singleRoomRateSum.value -
          addBfSum.value -
          addBedSum.value -
          upRmTypeSum.value;
        payData.value.allRateSum = Number(
          (payData.value.couponRateSum + payData.value.gwDiscount).toFixed(2)
        );
        /* payData.value = res.retVal.retVal;
        if (payData.value.travelRateSumDto) {
          payData.value = Object.assign(
            payData.value,
            payData.value.travelRateSumDto
          );
        }
        if (
          payData.value.couponSimpleInfoDtoList &&
          payData.value.couponSimpleInfoDtoList.length > 0
        ) {
          payData.value.couponDesc = "";
          payData.value.couponSimpleInfoDtoList.forEach(
            (item: any, i: number) => {
              if (i == payData.value.couponSimpleInfoDtoList.length - 1) {
                if (item.num > 1) {
                  payData.value.couponDesc += `${item.descript} x${item.num}`;
                } else {
                  payData.value.couponDesc += `${item.descript}`;
                }
              } else {
                if (item.num > 1) {
                  payData.value.couponDesc += `${item.descript} x${item.num};`;
                } else {
                  payData.value.couponDesc += `${item.descript};`;
                }
              }
            }
          );
        } */
      }
    });
};
onUnload(() => {
  clearInterval(intervalId.value);
});
onLoad((optios: any) => {
  orderNo.value = optios.orderNo;
});
onShow(() => {
  clearInterval(intervalId.value);
  uni.getSystemInfo({
    success: (res: any) => {
      navHeight.value = res.statusBarHeight + 60;
    },
    fail(err) {
      console.log(err);
    },
  });
  annexList.value = [];
  showOrder();
  queryPayDetail();
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");

.ui_orderInfo {
  line-height: 1;
  padding-bottom: 100px;
  .ruleBox {
    padding: 16px;
    color: #808080;
    font-size: 14px;
    line-height: 22px;
    min-height: 80vh;
    overflow-y: scroll;
  }
  .card {
    width: calc(~"100% - 32px");
    margin: 0 auto;
    background: #fff;
    margin-top: 12px;
    border-radius: 8px;
  }
  .order-sta {
    background-image: url(https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/btnBlack.png);
    background-repeat: repeat;
    background-color: #000000;
    background-size: 40px 37.5px;
    padding: 75px 16px 80px;
    &.cancelSta {
      background-color: #7f7d75;
    }
    .sta {
      font-weight: 500;
      font-size: 20px;
      color: #ffffff;
    }

    .desc {
      margin-top: 12px;
      color: #ffffff;
      font-size: 14px;
      opacity: 0.8;
    }
  }

  .travel-info {
    margin: -46px 16px 0;
    display: flex;
    padding: 16px 12px;
    border-radius: 8px;
    background: #fff;

    .travel-img {
      width: 80px;
      height: 80px;

      .logo {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }

    .travel-rt {
      padding-left: 12px;
      .travel-name {
        font-size: 16px;
        color: #000000;
        font-weight: bold;
      }

      .travel-desc {
        margin-top: 12px;
        color: #808080;
        font-size: 12px;
      }

      .travel-time {
        margin-top: 8px;
        color: #808080;
        font-size: 12px;
      }

      .travel-num {
        margin-top: 8px;
        color: #808080;
        font-size: 12px;
      }
    }
  }

  .travelersInfo {
    margin: 12px 16px 0;
    padding: 16px 0;
    border-radius: 8px;
    background: #fff;

    .tl {
      font-style: normal;
      font-weight: bold;
      color: #000000;
      padding-left: 12px;
      padding-bottom: 16px;
      border-bottom: 0.5px solid #eeeeee;
    }

    .checkInInfo {
      padding: 0 12px;
      margin-top: 16px;
      display: flex;
      font-size: 14px;
      align-items: center;
      &.top {
        align-items: initial;
      }
      .label {
        width: 80px;
        color: #808080;
        line-height: 22px;
      }

      .occupant {
        flex: 1;
        color: #000;
        line-height: 22px;
        .name {
          color: #000000;
          font-size: 14px;
        }

        .id-card {
          margin-top: 8px;
          color: #808080;
          font-size: 12px;
        }

        .phone {
          margin-top: 8px;
          color: #808080;
          font-size: 12px;
        }
      }
    }
    .travelersInfo-item2 {
      display: flex;
      justify-content: space-between;
      padding-top: 8px;

      .label {
        font-size: 14px;
        color: #808080;
        line-height: 22px;
        white-space: nowrap;
        margin-right: 50px;
      }

      .val {
        display: flex;
        align-items: center;
        font-size: 14px;
        line-height: 22px;
        color: #000000;

        .val-txt {
          flex: 1;
          overflow: hidden;
          height: 22px;
          line-height: 22px;
        }

        .icon-a-12_youlajiantou_hui {
          font-size: 12px;
          margin-left: 5px;
        }

        &.price {
          font-family: "Montserrat";
          font-weight: 600;
          font-size: 16px;
        }

        &.red {
          color: #a43127;
        }

        .icon-a-12_fuzhi {
          margin-left: 5px;
        }
      }
    }
    .travelersInfo-list {
      padding: 8px 0 0px;
    }
    .price-box {
      padding: 8px 0;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 12px;
        right: 12px;
        border-bottom: 0.5px solid #eeeeee;
      }
      &:first-child {
        padding-top: 0;
      }
      &:last-child {
        padding-bottom: 0;
        &::after {
          display: none;
        }
      }
    }
    .travelersInfo-item {
      display: flex;
      justify-content: space-between;
      padding: 4px 12px;
      &.total-price {
        .val {
          font-family: "Montserrat";
          font-weight: 600;
          font-size: 16px;
        }
      }

      &.exchangeInfo {
        .val {
          text-align: left;
        }
      }
      .label {
        font-size: 14px;
        color: #808080;
        display: flex;
        align-items: center;
        .sub {
          color: #808080;
          font-family: PingFang SC;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 12px;
          margin-left: 4px;
        }
      }

      .val {
        display: flex;
        align-items: center;
        font-size: 14px;
        line-height: 22px;
        color: #000000;
        text-align: right;

        .val-txt {
          flex: 1;
          overflow: hidden;
          height: 22px;
          line-height: 22px;
        }

        .icon-a-12_youlajiantou_hui {
          font-size: 12px;
          margin-left: 5px;
        }

        &.price {
          font-family: "Montserrat";
          font-weight: 600;
          font-size: 16px;
        }

        &.red {
          color: #a43127;
        }

        .icon-a-12_fuzhi {
          margin-left: 5px;
        }
      }
    }

    .info-more {
      position: relative;
      padding-bottom: 16px;

      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 12px;
        right: 12px;
        border-bottom: 0.5px solid #eeeeee;
      }
    }

    .open-btn {
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #808080;
      font-size: 14px;

      .icon-a-12_xialajiantou_hei,
      .icon-a-12_shanglajiantou_hei {
        margin-left: 5px;
        font-size: 15px;
      }
    }

    .annex-list {
      padding: 16px 16px 0;
      display: flex;
      flex-wrap: wrap;

      .annex-item {
        display: flex;
        padding: 8px 16px;
        color: #000000;
        font-size: 12px;
        border-radius: 4px;
        border: 1px solid #ccc;
        margin-left: 8px;

        &:last-child {
          margin-left: 0;
        }

        .icon-a-12_fujian {
          margin-right: 5px;
        }
      }
    }
    .annex-list {
      padding: 16px 12px 0;
      display: flex;
      flex-wrap: wrap;

      .annex-item {
        display: flex;
        padding: 8px 16px;
        color: #000000;
        font-size: 12px;
        border-radius: 4px;
        border: 1px solid #ccc;
        margin-left: 8px;

        &:last-child {
          margin-left: 0;
        }

        .icon-a-12_fujian {
          margin-right: 5px;
        }
      }
    }
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    border-top: 1px solid #eee;
    padding: 12px 16px;
    z-index: 2;
    height: calc(62px + constant(safe-area-inset-bottom));
    height: calc(62px + env(safe-area-inset-bottom));
    .btns {
      display: flex;

      .btn-def {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
        font-size: 16px;
        height: 38px;
        border: 1px solid #1e1e1e;
        border-radius: 4px;
        flex: 1;
        margin: 0 8px;
      }
    }
  }
}
</style>