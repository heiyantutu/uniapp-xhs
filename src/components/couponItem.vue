<template>
  <div class="ui_couponItem" @click.stop="chooseCoupon(couponItem)" :class="{isHistory:couponItem.isHistory}">
    <div class="topBox">
      <div class="couponType">
        {{couponItem.couponTypeName}}
      </div>
      <div class="couponInfo arrow" v-if="!couponItem.isHistory">
        使用规则
      </div>
      <div class="couponInfo" v-else>
        {{couponItem.sta=="P"?'已过期':'已使用'}}
      </div>
    </div>
    <p class="couponName">{{couponItem.descript}}</p>
    <p class="couponVaildTime" v-if="couponItem.beginDatetime&&couponItem.endDatetime">
      有效期：{{timeDay2(couponItem.beginDatetime)}} 至 {{timeDay2(couponItem.endDatetime)}} </p>
    <p class="couponPrice" v-if="couponItem.couponType =='RF'">{{couponItem.discountNum}}折</p>
    <p class="couponPrice" v-else>¥{{couponItem.discountNum}}</p>
    <p class="useLimit" v-if="couponItem.discountPriceBegin>0">满 ¥{{couponItem.discountPriceBegin}} 使用</p>
    <div class="select" v-if="isSelect" @click="toggleCoupon(couponItem)">
      <image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/select.png" mode=""
        class="iconfont" v-if="couponItem.choosed" />
      <image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/unSelect.png" mode=""
        class="iconfont" v-else />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { timeDay2 } from "@/utils/filter";
export default defineComponent({
  name: "couponItem",
  props: {
    couponItem: {
      type: Object,
      default: () => {
        return {
          validToDate: "",
          validFromDate: "",
        };
      },
    },
    isSelect: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  emits: ["chooseCoupon","toggleCoupon"],
  setup(props, { emit }) {
    const chooseCoupon = (item: Object) => {
      emit("chooseCoupon", item);
    };
    const toggleCoupon = (item: Object) => {
      emit("toggleCoupon", item);
    }; 
    return {
      chooseCoupon,
      toggleCoupon,
      timeDay2,
    };
  },
});
</script>

<style scoped lang="less">
.ui_couponItem {
  background: #ffffff;
  border-radius: 8px;
  -webkit-mask-image: radial-gradient(
    circle at 10px 76px,
    transparent 10px,
    red 10.5px
  );
  -webkit-mask-position: -10px;
  padding: 16px;
  position: relative;
  &.isHistory {
    filter: grayscale(100%);
  }
  .select{
    position: absolute;
    right:16px;
    bottom:16px;
    .iconfont{
      width:16px;
      height:16px;
    }
  }
  .topBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    .couponType {
      background: rgba(219, 137, 0, 0.12);
      border-radius: 4px;
      font-size: 12px;
      color: #db8900;
      padding: 2px 5px;
    }
    .couponInfo {
      font-size: 12px;
      color: #000000;
      position: relative;
      padding-right: 16px;
    }
  }
  .couponName {
    font-size: 16px;
    color: #000000;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .couponVaildTime {
    font-size: 12px;
    color: #808080;
  }
  .couponPrice {
    font-size: 24px;
    color: #a43127;
    font-weight: bold;
    margin-top: 10px;
  }
  .useLimit {
    font-size: 12px;
    color: #808080;
    margin-top: 7px;
  }
}
</style>
