<template>
  <div class="ui_invoiceInfoList">
     <!-- #ifdef MP -->
     <coustom-head title="常用开票信息" nativeMode="true"> </coustom-head>
    <!-- #endif -->
    <div class="info-list">
      <div
        class="info-item"
        @click="
          toPage(
            '/pagesF/invoice/invoiceInfo?editItem=' +
              encodeURIComponent(JSON.stringify(invoice)) +
              '&type=' +
              'edit'
          )
        "
        v-for="(invoice, invoiceIndex) in invoices"
        :key="invoiceIndex"
      >
        <div class="info-item-lf">
          <div class="info-item-lf-info">
            <div class="info-item-name">{{ invoice.invoiceTitle }}</div>
            <div v-if="invoice.titleType == 'person'">
              <div class="info-item-id-card">
                身份证
                {{ invoice.uniformSocialCode.substring(0,6)}}****{{invoice.uniformSocialCode.substring(14,18) }}
                <!-- {{ invoice.uniformSocialCode }} -->
              </div>
              <div class="info-item-id-card no_padding">类型 个人</div>
            </div>
            <div v-else>
              <div class="info-item-id-card">税号 {{ invoice.taxPayerId }}</div>
              <div class="info-item-id-card no_padding">类型 公司</div>
            </div>
          </div>
        </div>
        <div class="iconfont icon-a-16_bianji"></div>
      </div>
    </div>
    <empty tips="暂无发票信息" subTips="松赞，期待与您相遇。" v-if="invoices.length == 0"></empty>
    <div class="bottom_dis"></div>
    <div class="footer">
      <div
        class="order-btn"
        @click="toPage('/pagesF/invoice/invoiceInfo?type=' + 'add')"
      >
        新增
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted } from "vue";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import { jAlert3 } from "@/base/jAlert/jAlert";
import { onLoad } from "@dcloudio/uni-app";
import { createUrl } from "@/utils/utils";
import { sensitiveIdNo, sensitiveName } from "@/utils/filter";
import { onShow } from "@dcloudio/uni-app";
import coustomHead from "@/components/coustomHead.vue";
import empty from "@/components/empty.vue";
import UmengSDK from "@/utils/umengAdaptor.js";
let type = ref("success");
let user = getStorage("user");
let config = getStorage("config");
let invoices = ref([]);
const toPage = (link: any) => {
  // console.log(invoice, "invoice--------");
  uni.navigateTo({
    url: link,
  });
};
const getMyInvoices = () => {
  uni.showLoading({
    title: "加载中...",
  });
  var memberInvoiceQuery = {
    hotelCode: 0,
    hotelGroupCode: config.hotelGroupCode,
    memberId: user.memberId,
  };
  api.memberInvoice(memberInvoiceQuery).then((data: any) => {
    if (data.result == 1) {
      invoices.value = data.retVal;
    }
  }).finally(() => {
      uni.hideLoading();
    });
};
onShow(() => {
  UmengSDK.sendPV({
    page_id: "2001",
    page_name: "invoice_pg",
    page_title_name:"开票信息页"
  });
  getMyInvoices();
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import (reference) url("~@/styles/mixin.less");
.ui_invoiceInfoList {
  margin-top: 16px;
  .info-list {
    // height: 92px;
    padding: 0 16px 32px;
    max-height: calc(100% - 200px);

    .info-item {
      padding: 16px 12px;
      box-sizing: border-box;
      margin-bottom: 16px;
      display: flex;
      background: #fff;
      border-radius: 8px;
      justify-content: space-between;
      align-items: center;

      .info-item-lf {
        display: flex;
        align-items: center;

        .icon-a-16_bianji {
          font-size: 15px;
        }

        .info-item-lf-info {
          .info-item-name {
            color: #000000;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 12px;
          }

          .info-item-id-card {
            margin-bottom: 8px;
            font-size: 12px;
            color: #808080;
          }
          .no_padding{
            margin-bottom: 0;
          }
        }
      }
    }
  }
  .bottom_dis {
    height: 100px;
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
      background: #000;
      border-radius: 4px;
      color: #ffffff;
      font-size: 16px;
      height: 48px;
    }
  }
}
</style>
