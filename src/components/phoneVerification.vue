<template>
  <div class="phoneVerification">
    <div class="userInfoList">
      <div class="userInfoItem">
        <div class="userInfoTitle">
          手机号
        </div>
        <div class="userInfoDesc">
          <input type="number" placeholder="请输入手机号" maxlength=11 v-model="phone" />
          <div class="btn_yanzheng" @click="verifyPost" v-bind:class="{disabled:isGetVerify}">
            {{isGetVerify?'重新获取'+timeOut+'s':"获取验证码"}}</div>
        </div>
      </div>
      <div class="userInfoItem">
        <div class="userInfoTitle">
          验证码
        </div>
        <div class="userInfoDesc">
          <input type="number" placeholder="请输入收到的验证码" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch, onUnmounted } from "vue";
import { jAlert3 } from "@/base/jAlert/jAlert";
import imgCode from "@/components/imgCode.vue";

const props = defineProps({
  phone: {
    type: String,
    required: true,
  },
  codeLength: {
    type: Number,
    default: 6,
  },
});
let phone = ref("");
let isTap = ref(false);
let ysmState = ref(true);
let isGetVerify = ref(false);
let verifyId = ref("");
let timeOut = ref(60);
let interVal = 0;
const imgCodeComponent = ref();

const verifyPost = () => {
  let reg = /^1[23456789]\d{9}$/;
  if (isTap.value) {
    return false;
  }
  isTap.value = false;
  if (!phone.value) {
    jAlert3("请输入手机号");
    return false;
  }
  if (!reg.test(phone.value)) {
    jAlert3("请输入正确的手机号");
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
watch(timeOut, (newValue) => {
  if (newValue <= 0) {
    clearInterval(interVal);
    isGetVerify.value = false;
    timeOut.value = 60;
    isTap.value = false;
  }
});
onUnmounted(() => {
  clearInterval(interVal);
});
</script>
<style lang="less" scoped>
.phoneVerification {
  .userInfoList {
    background: #ffffff;
    border-radius: 8px;
    padding: 0 12px;
    margin-bottom: 12px;
    .userInfoItem {
      height: 48px;
      display: flex;
      align-items: center;
      position: relative;
      &.big {
        height: 80px;
      }
      .userInfoTitle {
        width: 100px;
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
          border: 1px solid #000;
          &.disabled {
            color: #ccc;
            border: 1px solid #ccc;
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
}
</style>