<template>
  <div class="ui_submitSucceed">
    <div class="topBox">
      <div class="tipBox">
        <i class="icon iconfont icon-a-120_tijiaochenggong"></i>
        <p class="tips" v-if="type == 'success'">提交成功</p>
        <p class="subTips" v-if="type == 'success'">
          松赞顾问将在3个工作日内与您联系，届时您将得到具体行程方案及报价。
        </p>
        <p class="tips" v-if="type == 'edit'">已完成认证</p>
      </div>
      <image
        src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/authBg.png"
        mode="widthFix"
        class="authBg"
      />
    </div>
    <div class="bottomBox">
      <div class="back" @click="back()" v-if="type == 'success'">返回主页</div>
      <div class="back" @click="edit()" v-if=" type == 'edit'">编辑</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import { jAlert3 } from "@/base/jAlert/jAlert";
import { onLoad } from "@dcloudio/uni-app";
import { sensitiveIdNo, sensitiveName } from "@/utils/filter";
let type = ref("success");
let user = getStorage("user");
onLoad((options) => {
  if (options && options.type) {
    type.value = options.type;
  }
});
const back = () => {
  uni.switchTab({
    url: `/pages/travel/index`,
  });
  // uni.navigateBack({
  //   delta: 1,
  // });
};
const edit = () => {
  uni.redirectTo({
    url: `/pagesA/member/memberAuth`,
  });
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
        margin-top: 188px;
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
        margin: 12px 32px 32px 32px;
      }
    }
    .authBg {
      width: 100%;
      height: auto;
    }
  }
  .bottomBox {
    padding:32px 16px 16px 16px;
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
