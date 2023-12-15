<template>
  <div class="ui_checkInSucceed">
    <!-- #ifdef MP -->
    <coustom-head title="已办理入住" nativeMode="true"> </coustom-head>
    <!-- #endif -->
    <div class="topBox">
      <div class="tipBox">
        <div class="hotel_wrap">
          <div>
            <div class="hotel_tip">
              <i class="icon iconfont icon-a-20_fangjianhao"></i>
              您即将入住
            </div>
            <div class="hotel_name">{{ hotelMsg.hotelDesc }}</div>
          </div>
        </div>
        <!-- <i class="icon iconfont icon-a-120_tijiaochenggong"></i> -->
        <div class="subTips">
          可直接前往酒店前台领取房卡，如需取消入住办理，请联系酒店人员
          <span class="phone-color" @click="makePhoneCall('400-0000-830')"
            >400-0000-830
            <i class="icon iconfont icon-a-12_youlajiantou_hui"></i
          ></span>
        </div>
      </div>
      <image
        src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/authBg.png"
        mode="widthFix"
        class="authBg"
      />
    </div>
    <div class="bottomBox">
      <div class="back" @click="back()">完成</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getStorage, login } from "@/utils/wxuser";
import coustomHead from "@/components/coustomHead.vue";
let hotelMsg = getStorage("currentHotel");
onLoad((options) => {});
const back = () => {
  uni.switchTab({
    url: `/pages/trip/index`,
  });
  // uni.navigateBack({
  //   delta: 1,
  // });
};
const makePhoneCall = (phone: string) => {
  uni.makePhoneCall({
    phoneNumber: phone,
  });
};
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import (reference) url("~@/styles/mixin.less");
.ui_checkInSucceed {
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

      .hotel_wrap {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        margin-top: 40px;
        width: 240px;
        height: 240px;
        border: 1px solid rgba(128, 128, 128, 0.6);
        border-radius: 50%;
        .hotel_tip {
          display: flex;
          font-size: 14px;
        }
        .hotel_name {
          margin-top: 12px;
          font-size: 20px;
          font-weight: bold;
        }
        .iconfont {
          margin-right: 4px;
          font-size: 20px;
        }
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
        margin: 32px;
        .phone-color {
          display: flex;
          justify-content: center;
          color: #000000;
        }
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
