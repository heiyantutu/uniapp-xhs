<template>
  <div class="ui_invoiceDetails">
    <!-- #ifdef MP -->
    <coustom-head title="申请发票" nativeMode="true"> </coustom-head>
    <!-- #endif -->
    <div>
      <div class="status_wrap">
        <div class="status_left">开票进度</div>
        <div class="status_right" v-if="staInvoice == 2">开票中</div>
        <div class="status_right" v-if="staInvoice == 3">已开票</div>
      </div>
      <div class="list_wrap">
        <div class="list_title">开票信息</div>
        <div class="list_item">
          <div class="item_in">
            <div class="item_left">发票类型</div>
            <div class="item_right">增值税普通发票</div>
          </div>
          <div class="item_in">
            <div class="item_left">发票抬头</div>
            <div class="item_right">{{ orderInvoice.invoiceTitle }}</div>
          </div>
          <div class="item_in" v-if="orderInvoice.taxPayerId">
            <div class="item_left">税号</div>
            <div class="item_right">{{ orderInvoice.taxPayerId }}</div>
          </div>
          <div class="item_in">
            <div class="item_left">发票形式</div>
            <div class="item_right">
              {{ orderInvoice.receiveWay == 2 ? "电子" : "纸质" }}
            </div>
          </div>
          <div class="item_in" v-if="orderInvoice.receiveWay == 2">
            <div class="item_left">电子邮箱</div>
            <div class="item_right">{{ orderInvoice.receiverEmail }}</div>
          </div>
          <div class="item_in" v-if="orderInvoice.receiveWay == 1">
            <div class="item_left">收件地址</div>
            <div class="item_right">
              <div>{{ orderInvoice.receiverAddress }}</div>
              <div>
                {{ orderInvoice.receiverName }}
                {{
                  orderInvoice.mobile
                    ? orderInvoice.mobile.substring(0, 3)
                    : ""
                }}****{{
                  orderInvoice.mobile
                    ? orderInvoice.mobile.substring(7, 11)
                    : ""
                }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="zhanwei"></div>
    <div class="footer" @click="showKf()">
      <div class="order-btn">联系客服</div>
    </div>
    <kf-dialog ref="kf" title="联系客服"></kf-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import api from "@/utils/api";
import kfDialog from "@/components/kfDialog.vue";
import { getStorage } from "@/utils/wxuser";
import { onShow } from "@dcloudio/uni-app";
import { timeDay } from "@/utils/filter";
import coustomHead from "@/components/coustomHead.vue";
import { jAlert3, jAlert5 } from "@/base/jAlert/jAlert";
import { onLoad } from "@dcloudio/uni-app";
let config = getStorage("config");
let user = getStorage("user");
let orderType = ref();
let orderNo = ref();
let orderInvoice: any = ref({});
let staInvoice: any = ref();
const kf = ref();
let invoiceSta = ref("");
let invoiceStaTxt: any = ref("");
const getInvoice = () => {
  uni.showLoading({
    title: "加载中...",
  });
  api
    .getInvoiceOrder({
      hotelCode: config.hotelCode || 0,
      hotelGroupCode: config.hotelGroupCode,
      orderNo: orderNo.value,
      orderType: orderType.value,
      // orderNo: "WECHAT2023092500000464",
      // orderType: "R",
    })
    .then((data: any) => {
      if (data.result == 1) {
        staInvoice.value = data.retVal.invoiceStaV2;
        orderInvoice.value = data.retVal.orderInvoice;
        // console.log(staInvoice.value, "staInvoice.value----------------");
      } else {
        jAlert3(data.msg);
      }
    })
    .finally(() => {
      uni.hideLoading();
    });
};
const showKf = () => {
  kf.value.showDialog();
};
onLoad((options: any) => {
  if (options.orderNo) {
    orderNo.value = options.orderNo;
    orderType.value = options.orderType;
  }
});
onShow(() => {
  getInvoice();
});
</script>

<style lang="less" scoped>
.ui_invoiceDetails {
  .status_wrap {
    display: flex;
    align-items: center;
    margin: 16px 16px 12px;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0px;
    color: #000;
    background: #fff;
    border-radius: 8px;
    height: 46px;
    line-height: 46px;
    .status_left {
      margin-left: 12px;
    }
    .status_right {
      margin-left: auto;
      margin-right: 12px;
      color: #a43127;
    }
  }
  .list_wrap {
    margin: 16px;
    background: #fff;

    .list_title {
      color: #000;
      font-size: 14px;
      font-weight: bold;
      line-height: 14px;
      letter-spacing: 0px;
      text-align: left;
      padding: 16px 12px;
      border-bottom: 1px solid #eee;
    }
    .list_item {
      padding: 16px 12px;
      .item_in {
        display: flex;
        margin-bottom: 12px;
      }
      .item_in:last-child {
        margin-bottom: 0;
      }
      .item_left {
        color: #808080;
        font-size: 14px;
        font-weight: 400;
        line-height: 14px;
        letter-spacing: 0px;
        text-align: left;
        min-width: 58px;
      }
      .item_right {
        max-width: 210px;
        margin-left: auto;
        color: #000;
        font-size: 14px;
        font-weight: 400;
        line-height: 18px;
        letter-spacing: 0px;
        text-align: right;
        .consult_icon {
          margin-left: 4px;
        }
      }
    }
  }
  .zhanwei {
    height: 80px;
  }
  .footer {
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    border-top: 0.5px solid #eeeeee;
    .order-btn {
      margin-bottom: 34px;
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      color: #000;
      font-size: 16px;
      height: 48px;
      border: 1px solid rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
