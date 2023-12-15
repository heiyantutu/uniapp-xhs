<template>
  <div class="ui_couponHistory">
    <!-- #ifdef MP -->
    <coustom-head title="历史券包" nativeMode=true>
    </coustom-head>
    <!-- #endif -->
    <div class="listBox">
      <div class="listItem" v-for="(coupon, index) in couponList" :key="index">
        <coupon-item :couponItem="coupon" @chooseCoupon="chooseCoupon"></coupon-item>
      </div>
    </div>
    <empty tips="暂无券包" v-if="couponList.length==0"></empty>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import api from "@/utils/api";
import switchBar from "@/components/switchBar.vue";
import couponItem from "@/components/couponItem.vue";
import empty from "@/components/empty.vue";
import { getStorage, setStorage } from "@/utils/wxuser";
import { onReachBottom,onPageScroll } from "@dcloudio/uni-app";
import coustomHead from "@/components/coustomHead.vue";

let config = getStorage("config");
let user = getStorage("user");
let firstResult = ref(0);
let pageSize = ref(15);
let isAjax = ref(false);
let sta = ref("O,P");
let couponList = ref([]);

const listCouponWithHistoryByCardNo = () => {
  if (isAjax.value) {
    return false;
  }
  isAjax.value = true;
  api
    .listCouponWithHistoryByCardNo({
      ownMemberId: user.memberId || "",
      sta: sta.value,
      hotelGroupId: config.hotelGroupId,
      hotelGroupCode: config.hotelGroupCode,
      firstResult: firstResult.value,
      pageSize: pageSize.value,
      hotelCode: config.hotelCode,
      beginDatetime: "",
      endDatetime: "",
      ownMobile: "",
      salesChannel: "",
      salesHotelCode: "",
      saleType: "",
      isFromGift: "F",
    })
    .then((res: any) => {
      isAjax.value = false;
      if (res.result == 1) {
        firstResult.value = firstResult.value + pageSize.value;
        for (var i = 0; i < res.retVal.datas.length; i++) {
          res.retVal.datas[i].isHistory = true;
          if (
            res.retVal.datas[i].discountType == "MZ" ||
            res.retVal.datas[i].discountType == "LZ"
          ) {
            res.retVal.datas[i].couponType = "RF";
            let discount: any = (
              Number(res.retVal.datas[i].discountNum) * 10
            ).toFixed(1);
            if (discount - parseInt(discount) > 0) {
            } else {
              discount = Number(discount).toFixed(0);
            }
            res.retVal.datas[i].discountNum = discount;
          }
        }
        couponList.value = couponList.value.concat(res.retVal.datas);
      } else {
      }
    });
};
const getNewCouponList = () => {
  couponList.value = [];
  firstResult.value = 0;
  listCouponWithHistoryByCardNo();
};
const chooseCoupon = (data: any) => {
  /* setStorage("coupon", data);
  uni.navigateTo({
    url: `/pagesA/member/couponInfo?couponNo=${data.couponNo}`,
  });
  console.log(data); */
};
onReachBottom(() => {
  listCouponWithHistoryByCardNo();
});
onMounted(() => {
  listCouponWithHistoryByCardNo();
});
</script>

<style lang="less" scoped>
.ui_couponHistory {
  .switchBox {
    background: #ffffff;
  }
  .listBox {
    padding: 16px;
    .listItem {
      margin-bottom: 16px;
    }
  }
}
</style>
