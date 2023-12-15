<template>
  <div class="ui_authSucceed">
    <!-- #ifdef MP -->
    <coustom-head color="#000">
    </coustom-head>
    <!-- #endif -->
    <div class="topBox">
      <div class="tipBox">
        <i class="icon iconfont icon-a-120_tijiaochenggong" :style="{marginTop: marginTop+'px'}"></i>
        <p class="tips" v-if="type=='success'">认证成功</p>
        <p class="subTips" v-if="type=='success'">恭喜你，完成了身份验证</p>
        <p class="tips" v-if="type=='edit'">已完成认证</p>
      </div>
      <image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/authBg.png" mode="widthFix"
        class="authBg" />
    </div>
    <div class="bottomBox">
      <div class="innerBox">
        <div class="topArea">认证信息</div>
        <div class="bottomArea">
          <div class="row">
            <p class="title">姓名</p>
            <p class="desc">{{sensitiveName(user.name)}}</p>
          </div>
          <div class="row">
            <p class="title">身份证</p>
            <p class="desc">{{sensitiveIdNo(user.idNo)}}</p>
          </div>
        </div>
      </div>
      <div class="back" @click="back()" v-if="type=='success'">返回</div>
      <div class="back" @click="edit()" v-if="type=='edit'">重新认证</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted } from "vue";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import { jAlert3 } from "@/base/jAlert/jAlert";
import { onLoad } from "@dcloudio/uni-app";
import { sensitiveIdNo, sensitiveName } from "@/utils/filter";
import coustomHead from "@/components/coustomHead.vue";

let type = ref("success");
let user = getStorage("user");
let marginTop = ref(80);
onLoad((options) => {
  if (options && options.type) {
    type.value = options.type;
  }
});
const back = () => {
  uni.navigateBack({
    delta: 1,
  });
};
const edit = () => {
  uni.redirectTo({
    url: `/pagesA/member/memberAuth`,
  });
};
onMounted(() => {
  uni.getSystemInfo({
    success: (res: any) => {
      marginTop.value = marginTop.value + res.statusBarHeight;
    },
    fail(err) {
      console.log(err);
    },
  });
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import (reference) url("~@/styles/mixin.less");
.ui_authSucceed {
  min-height: 100vh;
  background: #f8f8f8;
  .topBox {
    position: relative;
    background: #fff;
    .tipBox {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      //justify-content: center;
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
        color: #808080;
        font-size: 14px;
        margin-top: 10px;
      }
    }
    .authBg {
      width: 100%;
      height: 375px;
    }
  }
  .bottomBox {
    padding: 16px;
    .innerBox {
      background: #ffffff;
      border-radius: 4px;
      margin-bottom: 16px;
      .topArea {
        height: 46px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #000000;
        font-weight: bold;
        padding: 0 12px;
        border-bottom: 1px solid rgba(238, 238, 238, 1);
      }
      .bottomArea {
        padding: 12px;
        .row {
          display: flex;
          align-items: center;
          height: 30px;
          justify-content: space-between;
          .title {
            font-size: 14px;
            color: #808080;
          }
          .desc {
            font-size: 14px;
            color: #000000;
          }
        }
      }
    }
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