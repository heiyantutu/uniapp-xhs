<template>
  <div class="ui_submitSucceed">
    <div class="topBox">
      <div class="tipBox">
        <i class="icon iconfont icon-a-120_tijiaochenggong"></i>
        <p class="tips" v-if="type == 'success'">提交成功</p>
        <p class="subTips" v-if="type == 'success'">
          已收到您的开票信息，我们将尽快为您开具。
        </p>
      </div>
      <image
        src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/authBg.png"
        mode="widthFix"
        class="authBg"
      />
    </div>
    <div class="bottomBox">
      <div class="back" @click="back()" v-if="type == 'success'">完成</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import { jAlert3 } from "@/base/jAlert/jAlert";
import { onLoad } from "@dcloudio/uni-app";
import { goPage } from "@/utils/utils";
import { sensitiveIdNo, sensitiveName } from "@/utils/filter";
let type = ref("success");
let user = getStorage("user");
let orderNo = ref("");
let productType = ref("");
onLoad((options:any) => {
  orderNo.value = options.orderNo;
  productType.value = options.productType;
  if (options && options.type) {
    type.value = options.type;
  }
});
const back = () => {
  // uni.redirectTo({
  //   url: `/pagesF/invoice/applyInvoice`,
  // });
  // uni.navigateBack({
  //   delta: 1,
  // });
  if (productType.value == "hotel") {
    goPage(`/pagesC/order/orderInfo?orderNo=${orderNo.value}`);
  } else if (productType.value == "shop") {
    goPage(
      `/pagesB/travel/orderDetail?orderNo=${orderNo.value}&productType=${productType.value}`
    );
  } else if (productType.value == "activity") {
    goPage(
      `/pagesE/dailyActivity/dailyOrderDetail?orderNo=${orderNo.value}&productType=${productType.value}`
    );
  } else {
    goPage(`/pagesB/travel/orderDetail?orderNo=${orderNo.value}`);
  }
};
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import (reference) url("~@/styles/mixin.less");
.ui_submitSucceed {
  .topBox {
    position: relative;
    .tipBox {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      .iconfont {
        font-size: 120px;
      }
      .tips {
        color: #000000;
        font-size: 18px;
        margin-top: 30px;
        font-weight: bold;
      }
      .subTips {
        line-height: 22px;
        text-align: center;
        color: #808080;
        font-size: 14px;
        margin: 10px 32px 0 32px;
      }
    }
    .authBg {
      width: 100%;
      height: auto;
    }
  }
  .bottomBox {
    padding: 16px;
  }
  .back {
    width: 100%;
    height: 48px;
    line-height: 48px;
    font-size: 16px;
    .baseBtn();
  }
}
</style>
