<template>
  <div class="ui_memberAuth">
    <!-- #ifdef MP -->
    <coustom-head title="实名认证" nativeMode=true>
    </coustom-head>
    <!-- #endif -->
    <Alert :tips="errMsg"></Alert>
    <div class="memberAuthBox">
      <div class="userInfoList">
        <div class="userInfoItem">
          <div class="userInfoTitle">姓名</div>
          <div class="userInfoDesc">
            <input type="text" placeholder="请输入您的姓名" v-model="name" placeholder-style="color: #CCCCCC;"/>
          </div>
        </div>
        <div class="userInfoItem">
          <div class="userInfoTitle">身份证</div>
          <div class="userInfoDesc">
            <input type="idcard" placeholder="请输入 18 位二代身份证号" v-model="idNo" placeholder-style="color: #CCCCCC;" />
          </div>
        </div>
      </div>
      <div class="userInfoList">
        <div class="userInfoItem">
          <div class="userInfoTitle">手机号</div>
          <div class="userInfoDesc">
            <input type="number" placeholder="请输入手机号" maxlength="11" v-model="phone" />
            <div class="btn_yanzheng" @click="verifyPost" v-bind:class="{ disabled: isGetVerify }">
              {{ isGetVerify ? "重新获取" + timeOut + "s" : "获取验证码" }}
            </div>
          </div>
        </div>
        <div class="userInfoItem">
          <div class="userInfoTitle">验证码</div>
          <div class="userInfoDesc">
            <input type="number" placeholder="请输入收到的验证码" v-model="verifyCode" placeholder-style="color: #CCCCCC;"/>
          </div>
        </div>
      </div>
      <div class="agreeBox">
        <p class="agreeDesc" @click.stop="toggleAggre">
          <image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/select.png" mode=""
            class="iconfont" v-if="isAgree" />
          <image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/unSelect.png" mode=""
            class="iconfont" v-else />
          登录即代表您同意我们的<span @click.stop="goCodeText" class="userRule">《用户协议》</span>
        </p>
      </div>
      <div class="authBtn" @click="authAction">提交</div>
      <img-code ref="imgCodeComponent" @change-time="changeTime" :ysmState="ysmState" :phone="phone" :isTap="isTap"
        :isGetVerify="isGetVerify" :timeOut="timeOut"></img-code>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import { jAlert3 } from "@/base/jAlert/jAlert";
import imgCode from "@/components/imgCode.vue";
import { onLoad } from "@dcloudio/uni-app";
import { createUrl, refreshMemberInfo } from "@/utils/utils";
import Alert from "@/components/Alert.vue";
import UmengSDK from "@/utils/umengAdaptor.js";
import coustomHead from "@/components/coustomHead.vue";

let config = getStorage("config");
let user = getStorage("user");
let isAgree = ref(false);
let name = ref("");
let idNo = ref("");
let phone = ref("");
let isTap = ref(false);
let ysmState = ref(true);
let isGetVerify = ref(false);
let isFromCollection = ref(false);
let verifyId = ref("");
let verifyCode = ref("");
let ruleCode = ref("");
let isNeedPoint = ref("F");
let timeOut = ref(60);
let interVal = 0;
const imgCodeComponent = ref();
let errMsg = ref("");
let idReg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
onLoad((options) => {
  if (options && options.ruleCode) {
    ruleCode.value = options.ruleCode;
    isNeedPoint.value = options.isNeedPoint;
  }
  if(options)isFromCollection.value = options.from==='colletion';
});
if (user && user.mobile) {
  phone.value = user.mobile;
}
const verifyPost = () => {
  let reg = /^1[23456789]\d{9}$/;
  if (isTap.value) {
    return false;
  }
  isTap.value = false;
  if (!phone.value) {
    errMsg.value = "请输入手机号";
    return false;
  }
  if (!reg.test(phone.value)) {
    errMsg.value = "请输入正确的手机号";
    return false;
  }
  console.log();
  if (ysmState.value) {
    imgCodeComponent.value.getImgVerify();
    imgCodeComponent.value.showDialog();
  } else {
    isTap.value = false;
  }
};
const changeTime = (data: any) => {
  isGetVerify.value = data.isGetVerify ? data.isGetVerify : isGetVerify.value;
  isTap.value = data.isTap ? data.isTap : isTap.value;
  ysmState.value = data.ysmState ? data.ysmState : ysmState.value;
  verifyId.value = data.verifyId;
  clearInterval(interVal);
  interVal = setInterval(function () {
    timeOut.value = timeOut.value - 1;
  }, 1000);
};
watch(timeOut, (newValue, oldValue) => {
  if (newValue <= 0) {
    clearInterval(interVal);
    isGetVerify.value = false;
    timeOut.value = 60;
    isTap.value = false;
  }
});
const toggleAggre = () => {
  if (isAgree.value) {
    isAgree.value = false;
  } else {
    isAgree.value = true;
  }
};
const goCodeText = () => {
  let title = "用户协议";
  var obj = {
    title: decodeURIComponent(title),
    code: "realNameRule",
  };
  uni.navigateTo({
    url: "/pagesA/other/codeText?" + createUrl(obj),
  });
};
const authAction = () => {
  if (!name.value) {
    errMsg.value = "请输入姓名";
    return false;
  }
  if (!idNo.value) {
    errMsg.value = "请输入证件号码";
    return false;
  }
  if (!idReg.test(idNo.value)) {
    errMsg.value = "请输入有效的证件号码";
    return false;
  }
  if (!phone.value) {
    errMsg.value = "请输入手机号码";
    return false;
  }
  if (!verifyId.value) {
    errMsg.value = "请先获取验证码";
    return false;
  }
  if (!verifyCode.value) {
    errMsg.value = "请输入验证码";
    return false;
  }
  if (!isAgree.value) {
    errMsg.value = "请先同意协议";
    return false;
  }
  threeMetaCheck();
};
const threeMetaCheck = () => {
  errMsg.value = "";
  api
    .threeMetaCheck({
      hotelGroupCode: config.hotelGroupCode,
      hotelCode: config.hotelCode,
      certName: name.value,
      certNo: idNo.value,
      mobile: phone.value,
      verifyId: verifyId.value,
      memberId: user.memberId,
      memberNo: user.memberId,
      verifyCode: verifyCode.value,
      isNeedPoint: isNeedPoint.value,
      ruleCode: ruleCode.value,
      cardId: user.cardId,
      cardNo: user.cardNo,
    })
    .then((res: any) => {
      if (res.result == 1) {
        UmengSDK.sendEvent(
          "pip_submit",
          {
            result: "成功",
            fail_reason: "",
            trip_people_name: name.value,
            certificate_number: idNo.value,
            phone_number: phone.value,
            verfication_code: verifyCode.value,
          },
          "OTHER"
        );
        if(isFromCollection.value) {
          jAlert3("认证成功");
          refreshMemberInfo(() => {
            uni.redirectTo({
              url: `/pagesA/member/collectionCenter`,
            });
          });
          return
        }
        refreshMemberInfo(() => {
          uni.redirectTo({
            url: `/pagesA/member/authSucceed?type=success`,
          });
        });
      } else {
        UmengSDK.sendEvent(
          "pip_submit",
          {
            result: "失败",
            fail_reason: res.msg,
            trip_people_name: name.value,
            certificate_number: idNo.value,
            phone_number: phone.value,
            verfication_code: verifyCode.value,
          },
          "OTHER"
        );
        errMsg.value = res.msg;
      }
    });
};
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import (reference) url("~@/styles/mixin.less");
.ui_memberAuth {
  .memberAuthBox {
    padding: 16px;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
  }
  .userInfoList {
    background: #ffffff;
    border-radius: 8px;
    padding: 0 12px;
    margin-bottom: 16px;
    .userInfoItem {
      height: 48px;
      display: flex;
      align-items: center;
      position: relative;
      &.big {
        height: 80px;
      }
      .userInfoTitle {
        width: 88px;
        font-size: 14px;
        color: @tl-black;
      }
      .userInfoDesc {
        font-size: 14px;
        color: @tl-black;
        flex: 1;
        display: flex;
        align-items: center;
        height: 100%;
        input {
          flex: 1;
        }
        .btn_yanzheng {
          border-radius: 4px;
          font-size: 12px;
          color: #000;
          padding: 8px 12px;
          .halfPixel(4px,#000);
          &.disabled {
            color: #ccc;
            border:none;
            .halfPixel(4px)
          }
        }
        &.tofill {
          color: @text-fade;
        }
        .avatar {
          border: 1px solid rgba(238, 238, 238, 1);
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }
      }
    }
  }
  .agreeBox {
    font-size: 14px;
    color: #808080;
    width: 100vw;
    margin-top: 24px;
    .agreeDesc {
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 16px;
        margin-right: 5px;
        width: 16px;
        height: 16px;
      }
      .icon-danxuan_yixuan {
        color: @active-color;
      }
    }
    .userRule {
      color: #000000;
    }
  }
  .authBtn {
    .baseBtn();
    width: 100%;
    height: 48px;
    line-height: 48px;
    margin-top: 16px;
  }
}
</style>
