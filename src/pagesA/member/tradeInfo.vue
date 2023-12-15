<template>
  <div class="ui_tradeInfo">
    <!-- #ifdef MP -->
    <coustom-head title="交易明细" nativeMode=true>
    </coustom-head>
    <!-- #endif -->
    <div class="bottomBox">
      <div class="switchBarBox">
        <switch-bar :switchList="switchList" @changeIndex="changeIndex" padding=40></switch-bar>
      </div>
      <div class="pointList">
        <div class="pointItem" v-for="(account,accountIndex) in accountList" :key="accountIndex">
          <div class="leftPart">
            <div class="title">{{account.remark}}</div>
            <div class="time">{{account.createDate}}</div>
          </div>
          <div class="rightPart">
            <div class="pointChange">
              {{account.amountDesc}}
            </div>
          </div>
        </div>
      </div>
      <empty v-if="accountList.length == 0 && !isAjax"></empty>
      <last-text tips="没有更多了" v-if="accountList.length>0 && totalRows == accountList.length"></last-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import switchBar from "@/components/switchBar.vue";
import empty from "@/components/empty.vue";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import { jAlert3 } from "@/base/jAlert/jAlert";
import { onReachBottom } from "@dcloudio/uni-app";
import lastText from "@/components/lastText.vue";
import coustomHead from "@/components/coustomHead.vue";
import { addNum } from "@/utils/utils";

let config = getStorage("config");
let user = getStorage("user");
let firstResult = ref(0);
let pageSize = ref(15);
let isAjax = ref(false);
let accountType = ref("");
let accountList = ref([]);
let totalRows = ref(0);
let switchList = reactive([
  {
    name: "全部",
    active: true,
    accountType: "",
  },
  {
    name: "消费",
    active: false,
    accountType: "P",
  },
]);

const changeIndex = (index: number) => {
  switchList.forEach((n) => {
    n.active = false;
  });
  switchList[index].active = true;
  accountType.value = switchList[index].accountType;
  getNewAccountList();
};
const getListAccount = () => {
  if (
    accountList.value.length > 0 &&
    accountList.value.length >= totalRows.value
  ) {
    return false;
  }
  if (isAjax.value) {
    return false;
  }
  isAjax.value = true;
  var listAccountParameter = {
    firstResult: firstResult.value,
    pageSize: pageSize.value,
    cardId: getStorage("accountItem").cardId || "",
    hotelGroupId: config.hotelGroupId,
    hotelGroupCode: config.hotelGroupCode,
    accountType: accountType.value,
  };
  api.listAccount(listAccountParameter).then((res: any) => {
    if (res.result == 1) {
      res.retVal.accountList.forEach((n: any) => {
        /* if(n.accountTag == "TREAT"){
          n.amount = n.amountTreat;
        } */
        n.amount = addNum(n.amount,n.amountTreat);
        if (n.accountType == "充值") {
          n.amountDesc = `+${n.amount}`;
        }
        if (n.accountType == "消费") {
          if (n.amount < 0) {
            n.amountDesc = `+${Math.abs(n.amount)}`;
          } else {
            n.amountDesc = `-${n.amount}`;
          }
        }
      });
      accountList.value = accountList.value.concat(res.retVal.accountList);
      firstResult.value += pageSize.value;
      totalRows.value = res.retVal.totalRows;
      isAjax.value = false;
    } else {
      jAlert3(res.msg);
      isAjax.value = false;
    }
  });
};
const getNewAccountList = () => {
  totalRows.value = 0;
  firstResult.value = 0;
  accountList.value = [];
  getListAccount();
};
onReachBottom(() => {
  getListAccount();
});
onMounted(() => {
  getListAccount();
});
</script>

<style lang="less" scoped>
.ui_tradeInfo {
  padding-bottom: 100px;
  .switchBarBox {
    background: #fff;
  }
  .pointList {
    padding: 16px;
    margin-bottom: 32px;
    padding-bottom:0px;
    .pointItem {
      height: 70px;
      display: flex;
      .leftPart {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        .title {
          font-size: 14px;
          color: #000000;
          margin-bottom: 12px;
        }
        .time {
          font-size: 12px;
          color: #808080;
        }
      }
      .rightPart {
        height: 100%;
        display: flex;
        align-items: center;
        .pointChange {
          font-size: 14px;
          color: #000000;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
