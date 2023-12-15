<template>
  <div class="ui_couponItem" @click.stop="chooseCoupon(couponItem)" :class="{isHistory:couponItem.isHistory}">
    <div class="topBox">
      <div class="couponType" :class="couponItem.groupCode" v-if="couponItem.groupName">
        {{couponItem.groupName}}
      </div>
      <div v-else>

      </div>
      <div class="couponInfo" v-if="!couponItem.isHistory" @click.stop="goCouponInfo(couponItem)">
        使用规则<i class="icon iconfont icon-a-12_youlajiantou_hei"></i>
      </div>
      <div class="couponInfo" v-else>
        {{couponItem.sta=="P"?'已过期':'已使用'}}
      </div>
    </div>
    <p class="couponName">{{couponItem.descript}}</p>
    <p class="couponVaildTime" v-if="couponItem.beginDatetime&&couponItem.endDatetime">
      有效期：{{timeDay2(couponItem.beginDatetime)}} 至 {{timeDay2(couponItem.endDatetime)}} </p>
    <template v-if="couponItem.groupCode!='EXCHANGECOUPON'&&couponItem.discountNum>0">
      <p class="couponPrice" v-if="couponItem.couponType =='RF'">{{couponItem.discountNum}}折</p>
      <p class="couponPrice" v-else-if="couponItem.discountType =='LZ'||couponItem.discountType =='MZ'">{{formatDiscount(couponItem.discountNum*10)}}折</p>
      <p class="couponPrice" v-else>¥{{couponItem.discountNum}}</p>
    </template>
    <template>
      <p class="couponPrice couponHeight"></p>
    </template>
    <p class="useLimit" v-if="couponItem.discountPriceBegin>0">满 ¥{{couponItem.discountPriceBegin}} 使用</p>
    <div class="select" v-if="isSelect">
      <template v-if="couponItem.groupCode == 'EXCHANGECOUPON'">
        <i class="icon-duoxuan_yixuan iconfont" v-if="couponItem.choosed"></i>
        <i class="icon-duoxuan_weixuan iconfont" v-else></i>
      </template>
      <template v-else>
        <image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/select.png" mode=""
          class="iconfont" v-if="couponItem.choosed" />
        <image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/unSelect.png" mode=""
          class="iconfont" v-else />
      </template>
    </div>
    <div class="select" v-if="showBtn&&couponItem.groupCode=='EXCHANGECOUPON'" @click.stop="goExchange(couponItem)">
      <div class="exchangeBtn">
        去兑换
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { timeDay2 } from "@/utils/filter";
import { goPage } from "@/utils/utils";
import { getStorage, setStorage } from "@/utils/wxuser";
import api from "@/utils/api";
import { config } from "process";
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
    showBtn: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  emits: ["chooseCoupon", "toggleCoupon"],
  setup(props, { emit }) {
    const goCouponInfo = (item: any) => {
      setStorage("coupon", item);
      uni.navigateTo({
        url: `/pagesA/member/couponInfo?couponNo=${item.no}`,
      });
    };
    const formatDiscount = (val : any) => {
      return Number(Number(val).toFixed(2))
    };
    const chooseCoupon = (item: Object) => {
      if (props.isSelect) {
        toggleCoupon(item);
        return false;
      }
      emit("chooseCoupon", item);
    };

    const goExchange = (item: any) => {
      emit("chooseCoupon", item,'T');
      // goPage(`/pagesB/exchangeCoupon/exchangeList?couponNo=${item.no}`);
      
    };
    const toggleCoupon = (item: Object) => {
      emit("toggleCoupon", item);
    };
    return {
      chooseCoupon,
      toggleCoupon,
      timeDay2,
      goExchange,
      goCouponInfo,
      formatDiscount
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
  .select {
    position: absolute;
    right: 16px;
    bottom: 16px;
    .iconfont {
      font-size: 16px;
      width: 16px;
      height: 16px;
      &.icon-duoxuan_yixuan {
        color: #a43127;
      }
      &.icon-duoxuan_weixuan {
        color: #666;
      }
    }
  }
  .topBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    .couponType {
      background: rgba(219, 137, 0, 0.12);
      border-radius: 4px;
      font-size: 12px;
      color: #db8900;
      padding: 4px;

      &.GIFTCOUPON {
        background: rgba(164, 49, 39, 0.12);
        color: #a43127;
      }
      &.EXPERIENCECOUPON {
        background: rgba(0, 67, 85, 0.12);
        color: #004355;
      }
      &.EXCHANGECOUPON {
        background: #000;
        color: #fff;
      }
    }
    .couponInfo {
      font-size: 12px;
      color: #000000;
      position: relative;
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 12px;
      }
    }
  }
  .couponName {
    font-size: 16px;
    color: #000000;
    font-weight: bold;
    margin-bottom: 12px;
  }
  .couponVaildTime {
    font-size: 12px;
    color: #808080;
  }
  .couponPrice {
    font-size: 24px;
    color: #a43127;
    font-weight: 600;
    margin-top: 10px;
    font-family: Montserrat;
    &.couponHeight {
      height: 24px;
    }
  }
  .useLimit {
    font-size: 12px;
    color: #808080;
    margin-top: 7px;
  }
  .exchangeBtn {
    border: 1px solid #a0a0a0;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    color: #000;
    line-height: 1;
  }
}
</style>
