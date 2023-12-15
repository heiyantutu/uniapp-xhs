<template>
  <div class="ui_memberAccountInfo">
    <!-- #ifdef MP -->
    <coustom-head :title="titleName" nativeMode=true>
    </coustom-head>
    <!-- #endif -->
    <div class="memberAccountInfoBox">
      <div class="card">
        <div class="topBox">
          <p class="title">{{account.cardLevelDescript}}</p>
          <p class="accountTitle">余额</p>
          <p class="price">¥{{totalMoney}}</p>
          <div class="priceInfo" v-if="type=='consumer'">
            <div class="priceItem">本金¥{{baseMoney}}</div>
            <div class="priceItem">赠送金¥{{account.treatAccountBalance}}</div>
          </div>
          <div class="breach" v-if="type=='reserve'">
            含违约金¥{{account.treatAccountBalance}}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="row">
          <div class="title">状态</div>
          <div class="desc red" v-if="account.isHistory" @click="historyTips">
            已过期<i class="icon iconfont icon-a-12_tishi_hong"></i>
          </div>
          <div class="desc" v-else>
            正常
          </div>
        </div>
        <div class="row">
          <div class="title">有效期</div>
          <div class="desc">
            {{timeDay(account.beginDate)}} 至 {{timeDay(account.endDate)}}
          </div>
        </div>
        <div class="row">
          <div class="title">序列号</div>
          <div class="desc">
            {{account.cardNo}}
          </div>
        </div>
      </div>
      <div class="card">
        <link-item v-for="(listItem,listItemIndex) in list" :key="listItemIndex" :linkItem="listItem"
          @chooseLink="chooseLink"></link-item>
      </div>
      <div class="card">
        <link-item v-for="(listItem,listItemIndex) in list2" :key="listItemIndex" :linkItem="listItem"
          @chooseLink="chooseLink"></link-item>
      </div>
      <div class="contactBtn" @click="showKf">联系客服</div>
    </div>
    <kf-dialog ref="kf" title="联系客服"></kf-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import accountItem from "../components/accountItem.vue";
import linkItem from "@/components/linkItem.vue";
import api from "@/utils/api";
import { getStorage, setStorage } from "@/utils/wxuser";
import { onLoad, onPageScroll } from "@dcloudio/uni-app";
import { timeDay } from "@/utils/filter";
import { goPage, addNum, subtraction } from "@/utils/utils";
import dayjs from "dayjs";
import coustomHead from "@/components/coustomHead.vue";
import kfDialog from "@/components/kfDialog.vue";

const kf = ref();
let type = ref("");
let totalMoney = ref(0);
let baseMoney = ref(0);
let titleName = ref("");
onLoad((options) => {
  if (options && options.type) {
    type.value = options.type;
  }
  let title = `消费金详情`;
  if (type.value == "reserve") {
    title = `保留金详情`;
  }
  uni.setNavigationBarTitle({
    title,
  });
  titleName.value = title;
});
let config = getStorage("config");
let account = ref<any>({
  rechage:0,
  pay:0,
});
const showKf = () => {
  kf.value.showDialog();
};
let list = reactive([
  {
    name: "交易明细",
    link: "/pagesA/member/tradeInfo",
  },
]);
let list2 = reactive([
  {
    name: "适用范围",
    link: "",
    type: "storageRule",
    value: "rightsRule",
  },
  {
    name: "使用帮助",
    link: "",
    type: "storageRule",
    value: "levelRule",
  },
]);
const historyTips = () => {
  uni.showModal({
    title: "已过期",
    content: `${
      type.value == "consumer" ? "消费金" : "保留金"
    }已超过有效期，如有疑问请联系客服。`,
    confirmText: "我知道了",
    showCancel: false,
    confirmColor: "#000000",
  });
};
const chooseLink = (item: any) => {
  if (item.link) {
    goPage(item.link);
  }
  if (item.type == "storageRule") {
    setStorage("rule", {
      desc: account.value[item.value],
      title: item.name,
    });
    uni.navigateTo({
      url: `/pagesA/other/codeText?title=${encodeURIComponent(
        item.name
      )}&type=storage`,
    });
  }
};
onMounted(() => {
  let item = getStorage("accountItem");
  if (
    !dayjs().isBefore(
      dayjs(`${dayjs(item.endDate).format("YYYY-MM-DD")} 23:59:59`)
    )
  ) {
    item.isHistory = true;
  }
  account.value = item;
  totalMoney.value = subtraction(account.value.recharge, account.value.pay);
  baseMoney.value = subtraction(
    totalMoney.value,
    account.value.treatAccountBalance
  );
});
</script>

<style lang="less" scoped>
@import (reference) url("~@/styles/mixin.less");
.ui_memberAccountInfo {
  .memberAccountInfoBox {
    padding: 16px;
  }
  .contactBtn {
    .halfPixel(20px);
    height: 38px;
    width: 136px;
    font-size: 14px;
    color: #000000;
    text-align: center;
    line-height: 38px;
    border-radius: 20px;
    margin:0 auto;
    margin-top: 24px;
  }
  .card {
    margin-bottom: 12px;
    background: #ffffff;
    border-radius: 8px;
    .row {
      height: 48px;
      align-items: center;
      display: flex;
      padding: 12px;
      font-size: 14px;
      color: #000000;
      .title {
        width: 90px;
      }
      .desc {
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 13px;
          margin-left: 3px;
        }
      }
      .red {
        color: #a43127;
      }
    }
    .topBox {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      padding: 32px 0;
      .title {
        font-size: 16px;
        color: #000000;
        font-weight: bold;
        margin-bottom: 24px;
      }
      .accountTitle {
        font-size: 14px;
        color: #000000;
        margin-bottom: 12px;
      }
      .price {
        font-size: 20px;
        color: #000000;
        font-weight: 600;
        margin-bottom: 24px;
        font-family: Montserrat;
      }
      .priceInfo {
        display: flex;
        .priceItem {
          font-size: 14px;
          color: #808080;
          &:nth-of-type(2) {
            margin-left: 16px;
          }
        }
      }
      .breach {
        color: #808080;
        font-size: 14px;
      }
    }
  }
}
</style>
