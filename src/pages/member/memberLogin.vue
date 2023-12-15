<template>
  <div class="ui_memberLogin">
    <coustom-head color="#fff"></coustom-head>
    <image :src="bgUrl" mode="widthFix" class="loginBg" />
    <div class="loginBox">
      <!-- #ifdef MP -->
      <button open-type="getPhoneNumber" @getphonenumber="getWxPhoneNumber" class='auth' v-if="isAgree">一键登录</button>
      <button class='auth' v-else @click="goAuthLogin">一键登录</button>
      <!-- #endif -->
      <!-- #ifdef H5 -->
      <button @click="toAuth" class='auth' v-if="isAgree">一键登录</button>
      <button class='auth' v-else @click="goAuthLogin">一键登录</button>
      <!-- #endif -->
      <div class="mobileLogin" @click="goMobileLogin" v-if="showMobileLogin"> 输入手机号登录 <i
          class="icon iconfont icon-a-16_youlajiantou_hei"></i> </div>
    </div>
    <div class="agreeBox">
      <p class="agreeDesc" @click.stop="toggleAggre">
        <image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/select.png" mode=""
          class="iconfont" v-if="isAgree" />
        <image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/unSelect.png" mode=""
          class="iconfont" v-else />
        我已阅读并同意<span @click.stop="goCodeText" class="userRule">《用户协议》</span>
      </p>
    </div>
    <bottom-dialog ref="mobileLoginComponent" title="手机号登录" :closable=closable>
      <Alert :tips="errMsg"></Alert>
      <div class="mobileLoginBox">
        <div class="userInfoList">
          <div class="userInfoItem">
            <div class="userInfoTitle">
              <i class="icon iconfont icon-a-16_shouji"></i>
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
              <i class="icon iconfont icon-a-16_yanzhengma"></i>
              验证码
            </div>
            <div class="userInfoDesc">
              <input type="number" placeholder="请输入收到的验证码" v-model="verifyCode" maxlength=6 />
            </div>
          </div>
        </div>
        <div class="mobileLoginBtn" @click="loginPost">登录</div>
        <div class="agreeBoxWrapper" v-if="H5Mode">
          <div class="agreeBox">
            <p class="agreeDesc" @click.stop="toggleAggre">
              <image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/select.png" mode=""
                class="iconfont" v-if="isAgree" />
              <image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/unSelect.png" mode=""
                class="iconfont" v-else />
              我已阅读并同意<span @click.stop="goCodeText" class="userRule">《用户协议》</span>
            </p>
          </div>
        </div>
      </div>
    </bottom-dialog>
    <coustom-dialog :dialogConfig="dialogConfig" v-if="isShowDialog">
      <template #content>
        <p>我们将确保您的隐私安全，详情请阅读松赞旅行的<span @click="goCodeText" class="underline">《用户协议》</span></p>
      </template>
      <template #footer>
        <div class="btns">
          <div class="btn" @click="closeDialog">
            不同意
          </div>
          <div class="btn" @click="sureDialog" v-if="authType == 'mobile'">
            同意并登录
          </div>
          <button open-type="getPhoneNumber" @getphonenumber="getWxPhoneNumber" class='btn authBtn'
            v-else>同意并登录</button>
        </div>
      </template>
    </coustom-dialog>
    <img-code ref="imgCodeComponent" @change-time="changeTime" :ysmState="ysmState" :phone="phone" :isTap="isTap"
      :isGetVerify="isGetVerify" :timeOut="timeOut"></img-code>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from "vue";
import api from "@/utils/api";
import { jAlert3 } from "@/base/jAlert/jAlert";
import { getStorage, setStorage } from "@/utils/wxuser";
import { login, createUrl, goPage, goWebview, isCmbchina } from "@/utils/utils";
import bottomDialog from "@/components/bottomDialog.vue";
import coustomDialog from "@/components/coustomDialog.vue";
import Alert from "@/components/Alert.vue";
import type { codeLoginResponse } from "@/interface/login";
import type { apiResponse } from "@/interface/apiResponse";
import imgCode from "@/components/imgCode.vue";
import defaultChannel from "@/utils/defaultChannel";
import { onLoad } from "@dcloudio/uni-app";
import UmengSDK from "@/utils/umengAdaptor.js";
import coustomHead from "@/components/coustomHead.vue";

let showAuthLogin = ref(true);
let showMobileLogin = ref(true);
let inCmbchina = ref(false);
const mobileLoginComponent = ref();
let config = getStorage("config");
let wxuser = reactive(getStorage("wxuser"));
let user = getStorage("user");
let isAgree = ref(false);
let redirect_url = ref();
let authType = ref("wechat");
let isShowDialog = ref(false);
let isWechatMember = ref("F");
let errMsg = ref("");
let memberId = ref("");
let ruleCode = ref("");
let YQHYId = ref("");
let canGive = ref("");
let channel = ref(defaultChannel);
let dialogConfig = reactive({
  title: "是否同意我们的《用户协议》",
});
let bgUrl = ref("");
let partnerId = ref("");
let H5Mode = ref(false);
let closable = ref(true);
if (getStorage("partnerId")) {
  partnerId.value = getStorage("partnerId");
}
const goMemberCenter = () => {
  UmengSDK.sendEvent("lp_login_result", {
    result: "成功",
    fail_reason: "",
    login_type: authType.value == "wechat" ? "微信" : "手机号",
  });
  let user = getStorage("user");
  UmengSDK.registerGlobalProperties({
    _user_id: user.memberId,
    _user_nick: user.name,
  });
  if (redirect_url.value) {
    let url = decodeURIComponent(redirect_url.value);
    goPage(url);
  } else {
    uni.reLaunch({
      url: "/pages/member/memberCenter",
    });
  }
};
const slientAuth = () => {
  login()
    .then((res) => {
      const loginResult = res as codeLoginResponse;
      return api
        .getWxCode({
          code: loginResult.code,
          appid: config.appid,
          avatarUrl:
            "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/avatar.png",
          // #ifdef MP-XHS
          clientType: "RED_MINI",
          // #endif
        })
        .then((response: apiResponse) => {
          if (response.result == 1) {
            let nickName = "松赞家人";
            // #ifdef MP-XHS
            nickName = "松赞家人";
            // #endif
            let newWxuser = Object.assign(response.retVal, {
              nickName,
            });
            setStorage("wxuser", newWxuser);
            wxuser = newWxuser;
            UmengSDK.registerGlobalProperties({
              _anony_id: wxuser.openid,
            });
          }
        });
    })
    .catch((error) => {
      console.error(error);
    });
};
const getWxPhoneNumber = (e: any) => {
  isAgree.value = true;
  if (e.detail.errMsg == "getPhoneNumber:ok") {
    api
      .decrypt({
        appid: config.appid,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        sessionKey: wxuser.session_key,
        // #ifdef MP-XHS
        clientType: "RED_MINI",
        // #endif
      })
      .then((data: any) => {
        if (data.result == 1) {
          let cardSrc = getStorage("cardSrc") || "";
          var mobile = data.retVal.purePhoneNumber;
          var nickName = wxuser.nickName;
          jAlert3("登录中...");
          api
            .memberLoginByMobileAndOpenId({
              hotelGroupCode: config.hotelGroupCode,
              openid: wxuser.openid,
              openIdType: "WEIXIN",
              hotelCode: config.hotelCode ? config.hotelCode : 0,
              hotelGroupId: config.hotelGroupId,
              mobile: mobile,
              nickName: "松赞家人",
              cardSrc: cardSrc,
              appid: config.appid,
              componentAppid: config.componentAppid,
              partnerId: partnerId.value,
              referrerId: canGive.value=='T'?memberId.value:"",
              yQHYId: YQHYId.value
            })
            .then((res: any) => {
              if (res.result == 1) {
                if (res.retVal.resultCode == 0) {
                  try {
                    }catch(e) {

                    }
                  setStorage("user", res.retVal);
                  goMemberCenter();
                  isShowDialog.value = false;
                  if (memberId.value) {
                    let user = getStorage("user");
                    UmengSDK.sendEvent(
                      "ifp_share_login",
                      {
                        be_shared_man_id: memberId.value,
                        share_man_id: user.memberId,
                      },
                      "OTHER"
                    );
                    UmengSDK.sendEvent(
                      "$$_user_profile",
                      {
                        phone_number: mobile,
                      },
                      "OTHER"
                    );
                  }
                } else {
                  UmengSDK.sendEvent("lp_login_result", {
                    result: "失败",
                    fail_reason: res.retVal.resultMsg,
                    login_type: "微信",
                  });
                  jAlert3(res.retVal.resultMsg);
                }
              } else {
                UmengSDK.sendEvent("lp_login_result", {
                  result: "失败",
                  fail_reason: res.msg,
                  login_type: "微信",
                });
                jAlert3(res.msg);
              }
            });
        } else {
          setStorage("wxuser", "");
          wxuser = "";
          jAlert3("当前授权信息已经过期,请重新授权");
        }
      });
  } else {
    console.log(e.mp.detail.errMsg);
  }
};
const goMobileLogin = () => {
  changeAuthType("mobile");
  if (isAgree.value) {
    mobileLoginComponent.value.showDialog();
  } else {
    jAlert3("请阅读并同意《用户协议》");
    //isShowDialog.value = true;
  }
};
const goAuthLogin = () => {
  changeAuthType("wechat");
  jAlert3("请阅读并同意《用户协议》");
  //isShowDialog.value = true;
};
const changeAuthType = (type: string) => {
  authType.value = type;
};
const goCodeText = () => {
  let title = "用户协议";
  var obj = {
    title: decodeURIComponent(title),
    code: "memberRule",
  };
  uni.navigateTo({
    url: "/pagesA/other/codeText?" + createUrl(obj),
  });
};
const closeDialog = () => {
  isShowDialog.value = false;
  isAgree.value = false;
};
const sureDialog = () => {
  isShowDialog.value = false;
  mobileLoginComponent.value.showDialog();
  isAgree.value = true;
};
const toggleAggre = () => {
  if (isAgree.value) {
    isAgree.value = false;
  } else {
    isAgree.value = true;
  }
};
let phone = ref("");
let isTap = ref(false);
let ysmState = ref(true);
let isGetVerify = ref(false);
let verifyId = ref("");
let verifyCode = ref("");
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
const loginPost = () => {
  if (!isAgree.value) {
    jAlert3("请阅读并同意《用户协议》");
    return false;
  }
  if (!phone.value) {
    jAlert3("请输入手机号");
    return false;
  }
  if (!verifyId.value) {
    jAlert3("请获取验证码");
    return false;
  }
  if (!verifyCode.value) {
    jAlert3("请输入验证码");
    return false;
  }
  errMsg.value = "";
  api
    .memberLoginByMobileCode({
      url:
        "mobile=" +
        phone.value +
        "&verifyCode=" +
        verifyCode.value +
        "&openid=" +
        wxuser.openid +
        "&hotelGroupCode=" +
        config.hotelGroupCode +
        "&hotelGroupId=" +
        config.hotelGroupId +
        "&appid=" +
        config.appid +
        "&verifyId=" +
        verifyId.value +
        "&componentAppid=" +
        config.componentAppid +
        "&partnerId=" +
        partnerId.value,
    })
    .then((res: any) => {
      if (res.result == 1) {
        setStorage("user", res.retVal);
        UmengSDK.sendEvent(
          "$$_user_profile",
          {
            phone_number: res.retVal.mobile,
          },
          "OTHER"
        );
        gobindOpenId(res.retVal);
      } else {
        if (res.msg.indexOf("未注册") > 0) {
          var hotelCode = config.hotelCode ? config.hotelCode : 0;
          if(memberId.value) {
                api
                  .saveInvitationJSYQRecord({
                    ruleCode: ruleCode.value,
                    YQHYId: YQHYId.value,
                    hotelCode: config.hotelCode,
                    hotelGroupCode: config.hotelGroupCode,
                    isMember: "F"
                  })
                  .then((res:any) => {
                  })
                  .catch((e:any) => {
                    jAlert3(e.msg);
                  });
              }
          if (isWechatMember.value == "T") {
            api
              .updateMemberInfoForWeiXin({
                hotelCode: hotelCode,
                hotelGroupCode: config.hotelGroupCode,
                hotelGroupId: config.hotelGroupId,
                mobile: phone,
                name: wxuser.nickname,
                memberId: user.memberId,
              })
              .then((res: any) => {
                api
                  .memberLoginOpen({
                    hotelCode: config.hotelCode,
                    hotelGroupCode: config.hotelGroupCode,
                    hotelGroupId: config.hotelGroupId,
                    componentAppid: config.componentAppid,
                    appid: config.appid,
                    openid: wxuser.openid,
                  })
                  .then((data: any) => {
                    if (data.result == 1) {
                      jAlert3("绑定成功");
                      setStorage("user", data.retVal);
                      clearInterval(interVal);
                      goMemberCenter();
                    } else {
                      UmengSDK.sendEvent("lp_login_result", {
                        result: "失败",
                        fail_reason: data.msg,
                        login_type: "手机号",
                      });
                      errMsg.value = data.msg;
                    }
                  });
              });
          } else {
            var sex = "?";
            if (wxuser && wxuser.sex) {
              sex = wxuser.sex;
            }
            let cardSrc = getStorage("cardSrc") || "";
            var obj = {
              mobile: phone.value,
              password: "",
              sex: sex,
              email: "",
              name: "松赞家人",
              hotelGroupCode: config.hotelGroupCode,
              hotelGroupId: config.hotelGroupId,
              openid: wxuser.openid,
              hotelCode: hotelCode,
              inviteCode: "",
              verifyCode: verifyCode.value,
              verifyId: verifyId.value,
              appid: config.appid,
              componentAppid: config.componentAppid,
              channel: "WECHAT",
              cardSrc: cardSrc,
              referrerId: canGive.value=='T'?memberId.value:"",
            };
            api
              .fastRegister({
                url: createUrl(obj),
              })
              .then((res: any) => {
                if (res.result == 1) {
                  gobindOpenId(res.retVal);
                  setStorage("user", res.retVal);
                } else {
                  UmengSDK.sendEvent("lp_login_result", {
                    result: "失败",
                    fail_reason: res.msg,
                    login_type: "手机号",
                  });
                  errMsg.value = res.msg;
                }
              });
          }
        } else {
          UmengSDK.sendEvent("lp_login_result", {
            result: "失败",
            fail_reason: res.msg,
            login_type: "手机号",
          });
          errMsg.value = res.msg;
        }
      }
    });
};
const gobindOpenId = (opt: any) => {
  if (wxuser.openid) {
    api
      .bindOpenId({
        memberId: opt.memberId,
        openIdUserId: wxuser.openid,
        openIdType: "WEIXIN",
        hotelGroupCode: config.hotelGroupCode,
        hotelGroupId: config.hotelGroupId,
        appid: config.appid,
        componentAppid: config.componentAppid,
        channel: "WECHAT",
      })
      .then((res: any) => {
        if (res.result == 1) {
          console.log("openid绑定成功ok");
        } else {
          console.log("openiderror");
          jAlert3(res.msg);
          return false;
        }
        jAlert3("登录成功，欢迎回来");
        goMemberCenter();
      });
  } else {
    goMemberCenter();
  }
};
const advertisementPage = () => {
  api
    .advertisementPage({
      hotelCode: config.hotelCode,
      hotelGroupCode: config.hotelGroupCode,
      showLocation: "3",
      clientTypes: channel.value,
      firstResult: 0,
      pageSize: 10,
    })
    .then((res: any) => {
      if (
        res.result == 0 &&
        res.retVal &&
        res.retVal.datas &&
        res.retVal.datas.length > 0
      ) {
        let infos = JSON.parse(res.retVal.datas[0].infos);
        if (infos.imgUrl) {
          bgUrl.value = infos.imgUrl;
        }
      }
    });
};
const cmbchinaGetAuthInfo = () => {
  api
    .cmbchinaGetAuthInfo({
      hotelGroupCode: config.hotelGroupCode,
    })
    .then((res: any) => {
      if (res.result == 1) {
        // @ts-ignore
        cmblapi.merchantLogin({
          corpNo: res.retVal.corpNo,
          reAuth: false,
          authInfo: {
            timestamp: res.retVal.timestamp,
            nonceStr: res.retVal.nonceStr,
            sign: res.retVal.sign,
          },
          description: "手机号码将用作您的登录账号，进行预订。",
          success: function (res: any) {
            if (res.resultType == "Y") {
              try {
              }catch(e) {

              }
              cmbchinaUserDataDes(res.body);
            } else {
              jAlert3("取消授权");
            }
            // res结果如下:
            // {body ="xxx",cryptType = 2,resultType = Y}
          },
          fail: function (res: any) {
            alert(JSON.stringify(res));
          },
        });
      } else {
        jAlert3(res.msg);
      }
    });
};
const cmbchinaUserDataDes = (userDataBase64: any) => {
  api
    .cmbchinaUserDataDes({
      hotelGroupCode: config.hotelGroupCode,
      userDataBase64,
    })
    .then((res: any) => {
      if (res.result == 1) {
        setStorage("user", res.retVal.member);
        UmengSDK.sendEvent(
          "$$_user_profile",
          {
            phone_number: res.retVal.member.mobile,
          },
          "OTHER"
        );
        goMemberCenter();
      } else {
        jAlert3(res.msg);
      }
    });
};
const toAuth = () => {
  if (inCmbchina.value) {
    cmbchinaGetAuthInfo();
  }
};
onMounted(() => {
  // #ifdef H5
  if (isCmbchina()) {
    inCmbchina.value = true;
    showMobileLogin.value = false;
  } else {
    authType.value = "mobile";
    H5Mode.value = true;
    mobileLoginComponent.value.showDialog();
    closable.value = false;
  }
  // #endif

  // #ifdef MP
  slientAuth();
  // #endif
  advertisementPage();
});
onLoad((options: any) => {
  if (options.redirect_url) {
    redirect_url.value = options.redirect_url;
  }
  if (options.cardSrc) {
    setStorage("cardSrc",options.cardSrc)
  }
  if (options.memberId) {
    memberId.value = options.memberId;
    ruleCode.value = options.ruleCode;
    YQHYId.value = options.YQHYId;
    canGive.value = options.canGive;
  }
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import (reference) url("~@/styles/mixin.less");
.ui_memberLogin {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .mobileLoginBox {
    padding: 16px;
    height: 100vh;
  }
  .btns {
    display: flex;
    justify-content: center;
    height: 64px;
    border: 1px solid #eeeeee;
    .authBtn {
      background: #ffffff;
      &::after {
        border: none;
        padding: 0px;
      }
    }
    .btn {
      flex: 1;
      line-height: 64px;
      text-align: center;
      border-right: 1px solid #eee;
      font-size: 16px;
      &:nth-child(2) {
        border-right: none;
      }
    }
  }
  .underline {
    text-decoration: underline;
  }
  .loginBox {
    margin-top: 406px;
    text-align: center;
    .auth {
      .w-baseBtn();
      line-height: 48px;
      height: 48px;
      width: 327px;
      display: block;
      text-align: center;
      margin: 0 auto;
      font-size: 16px;
      color: #000;
      display: block;
      &::after {
        border: none;
      }
    }
    .mobileLogin {
      position: relative;
      display: inline-block;
      text-align: center;
      font-size: 14px;
      margin-top: 32px;
      color: #fff;
      display: flex;
      align-items: center;
      text-align: center;
      justify-content: center;
      &.arrow {
        &::after {
          left: calc(~"100% + 15px");
          border-right: 1px solid #ffffff;
          border-top: 1px solid #ffffff;
        }
      }
    }
  }
  .loginBg {
    position: absolute;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    pointer-events: none;
    overflow: hidden;
  }
  .agreeBoxWrapper {
    position: relative;
    margin-top: 30px;
    .agreeBox {
      position: relative;
      left: initial;
      bottom: initial;
      color: rgba(0, 0, 0, 0.8);
      .userRule {
        color: #000;
      }
    }
  }
  .agreeBox {
    position: absolute;
    left: 0;
    bottom: 57px;
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
    width: 100vw;
    .agreeDesc {
      display: flex;
      align-items: center;
      justify-content: center;
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
      color: rgba(255, 255, 255, 1);
    }
  }
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
        width: 74px;
        font-size: 14px;
        color: @tl-black;
        display: flex;
        align-items: center;
        .iconfont {
          margin-right: 8px;
        }
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
            .halfPixel(4px);
          }
        }
      }
    }
  }
  .mobileLoginBtn {
    width: 100%;
    height: 48px;
    line-height: 48px;
    .baseBtn();
    margin-top: 32px;
  }
}
</style>
