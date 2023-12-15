<template>
  <div class="ui_memberAccountExpire">
    <!-- #ifdef MP -->
    <coustom-head :title="titleName" nativeMode=true>
    </coustom-head>
    <!-- #endif -->
    <div class="memberAccountExpireBox">
      <div class="accountList">
        <div class="accountItem" v-for="(item,itemIndex) in cardList" :key="itemIndex">
          <account-item :item="item" @chooseItem="chooseItem(item)"></account-item>
        </div>
        <empty v-if="cardList.length==0"></empty>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import accountItem from "../components/accountItem.vue";
import empty from "@/components/empty.vue";
import api from "@/utils/api";
import { createUrl, goPage, addNum, subtraction } from "@/utils/utils";
import { getStorage, setStorage } from "@/utils/wxuser";
import { timeDay } from "@/utils/filter";
import { onLoad,onPageScroll } from "@dcloudio/uni-app";
import coustomHead from "@/components/coustomHead.vue";

let config = getStorage("config");
let user = getStorage("user");
let cardList = ref([]);
let type = ref("");
let cardType = ref("");
let titleName = ref("");
onLoad((options) => {
  if (options && options.type) {
    type.value = options.type;
    cardType.value = options.cardType;
  }
});
const queryMemberCardByCondition = (cardType: string) => {
  api
    .queryMemberCardByCondition({
      hotelGroupCode: config.hotelGroupCode,
      cardType: cardType,
      isIncludeAbnormal: "X",
      memberId: user.memberId,
      channel: "wechat",
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        if (
          res.retVal.retVal.cardList &&
          res.retVal.retVal.cardList.length > 0
        ) {
          res.retVal.retVal.cardList.forEach((n: any) => {
            n.title = n.cardLevelDescript;
            n.validTime = timeDay(n.endDate);
            n.price = subtraction(n.recharge, n.pay);
            n.type = type.value;
            n.isHistory = true;
          });
          cardList.value = res.retVal.retVal.cardList;
        }
      }
    });
};
const chooseItem = (item: any) => {
  setStorage("accountItem", item);
  console.log(item.type);
  goPage(`/pagesA/member/memberAccountInfo?type=${item.type}`);
};
onMounted(() => {
  queryMemberCardByCondition(cardType.value);
  let title = `已过期消费金`;
  if (type.value == "reserve") {
    title = `已过期用保留金`;
  }
  uni.setNavigationBarTitle({
    title,
  });
  titleName.value = title;
});
</script>

<style lang="less" scoped>
.ui_memberAccountExpire {
  .memberAccountExpireBox {
    padding: 16px;
  }
  .accountList {
    .accountItem {
      margin-bottom: 12px;
    }
  }
}
</style>
