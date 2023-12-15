<template>
  <div
    class="ui_invite_share"
    :style="{
      'background-image':
        pageData && pageData.landLogo
          ? `url(${pageData.landLogo})`
          : `url(https://website-10049437.cos.ap-shanghai.myqcloud.com/86cc97b5-d975-4a43-8918-f1c5caea4e24)`,
      'background-size': '100% 100%',
    }"
  >
    <div class="top">
      <img :src="headimgurl" alt="" class="userHeaderImg" />
      <div class="info">
        <div class="rowMemberCard">{{ userData.cardLevelDescript }}</div>
        <div class="rowUserName">{{ userData.name }}</div>
      </div>
    </div>
    <p class="title1">{{ pageData.landTitle || "邀您体验松赞" }}</p>
    <p class="title2">
      {{ pageData.landDetail || "即刻注册松赞会员，开启您的第一次松赞行程！" }}
    </p>
    <div class="btn" @click="onRegister">注册松赞会员</div>
    <p class="title3">和松赞一起，让这个世界的旅行更美好。</p>
    <bottom-dialog ref="mobileLoginComponent" title="手机号登录">
      <Alert :tips="errMsg"></Alert>
      <div class="mobileLoginBox">
        <div class="userInfoList">
          <div class="userInfoItem">
            <div class="userInfoTitle">手机号</div>
            <div class="userInfoDesc">
              <input
                type="number"
                placeholder="请输入手机号"
                maxlength="11"
                v-model="phone"
              />
              <div
                class="btn_yanzheng"
                @click="verifyPost"
                v-bind:class="{ disabled: isGetVerify }"
              >
                {{ isGetVerify ? "重新获取" + timeOut + "s" : "获取验证码" }}
              </div>
            </div>
          </div>
          <div class="userInfoItem">
            <div class="userInfoTitle">验证码</div>
            <div class="userInfoDesc">
              <input
                type="number"
                placeholder="请输入收到的验证码"
                v-model="verifyCode"
              />
            </div>
          </div>
        </div>
        <div class="mobileLoginBtn" @click="loginPost">登录</div>
      </div>
    </bottom-dialog>
    <img-code
      ref="imgCodeComponent"
      @change-time="changeTime"
      :ysmState="ysmState"
      :phone="phone"
      :isTap="isTap"
      :isGetVerify="isGetVerify"
      :timeOut="timeOut"
    ></img-code>
  </div>
</template>
<script>
var config = {};
import api from "@/utils/api";
import { jAlert3 } from "@/base/jAlert/jAlert";
import { setStorage, getStorage } from "@/utils/wxuser";
import imgCode from "@/components/imgCode.vue";
import { createUrl } from "@/utils/index";
import Alert from "@/components/Alert.vue";
import UmengSDK from "@/utils/umengAdaptor.js";
import bottomDialog from "@/components/bottomDialog.vue";
import { onLoad } from "@dcloudio/uni-app";
export default {
  components: {
    imgCode,
    Alert,
    bottomDialog,
  },
  data() {
    return {
      inviteMemberId: "", //邀请人memberId
      wxuser: getStorage("wxuser"),
      user: getStorage("user"),
      pageData: {},
      steps: [],
      postering: false,
      isTap: false,
      isGetVerify: false,
      phone: "",
      verifyId: "",
      ysmState: true,
      timeOut: 60,
      interVal: 0,
      errMsg: "",
      id: "",
      ruleCode: "",
      headimgurl: "",
      userData: {},
      canGive: false, //是否可以赠送
      scene: "",
    };
  },
  props: {},
  watch: {
    timeOut: function (val) {
      if (val == 0) {
        clearInterval(this.interVal);
        this.isGetVerify = false;
        this.timeOut = 60;
        this.isTap = false;
        //this.loginBtn = false;
      }
    },
  },
  onLoad: function (option) {
    config = getStorage("config");
    this.id = option.id;
    this.ruleCode = option.ruleCode;
    this.inviteMemberId = option.memberId;
    this.headimgurl = option.headimgurl;
    this.cardNo = option.cardNo;
    if (option.scene) {
      const sceneVal = decodeURIComponent(option.scene);
      this.scene = sceneVal;
    }
  },
  mounted() {
    if (this.scene != "") {
      this.getWxacodeParams(() => {
        this.getData();
      });
    } else {
      this.getData();
    }
  },
  methods: {
    getWxacodeParams(cb) {
      if (this.scene != "") {
        var opt = {
          scene: this.scene,
          appid: config.appid,
        };
        api.getWxacodeParams(opt).then((res) => {
          if (res.result == 1) {
            try {
              var val = res.retVal.value
              console.log(val, "这是扫码跳转读取的参数");
              const getQueryString = (name) => {
                let query = val
                let vars = query.split("&");
                for (let i = 0; i < vars.length; i++) {
                    let pair = vars[i].split("=");
                    if(pair[0] == name)
                      {return pair[1];}
                }
                return(false);
              }
              this.id = getQueryString('id');
              this.ruleCode = getQueryString('ruleCode');
              this.inviteMemberId = getQueryString('memberId')
              this.headimgurl = getQueryString('headimgurl')
              this.cardNo = getQueryString('cardNo')
            } catch (e) {
              console.log(e);
            }
          } else {
            jAlert3(res.msg);
          }
          cb && cb();
        });
      } else {
        cb && cb();
      }
    },
    onRegister() {
      console.log(this.user);
      if (this.user && this.user.memberId) {
        uni.reLaunch({
          url: `/pages/member/memberCenter`,
        });
      } else {
        uni.navigateTo({
          url: `/pages/member/memberLogin?memberId=${
            this.inviteMemberId
          }&ruleCode=${this.ruleCode}&YQHYId=${this.id}&canGive=${
            this.canGive ? "T" : "F"
          }`,
        });
        // api
        //   .saveInvitationJSYQRecord({
        //     ruleCode: this.ruleCode,
        //     YQHYId: this.id,
        //     hotelCode: config.hotelCode,
        //     hotelGroupCode: config.hotelGroupCode,
        //   })
        //   .then((res) => {
        //     uni.navigateTo({
        //       url: "/pages/member/memberLogin?memberId=" + this.inviteMemberId,
        //     });
        //   })
        //   .catch((e) => {
        //     uni.navigateTo({
        //       url: "/pages/member/memberLogin?memberId=" + this.inviteMemberId,
        //     });
        //     jAlert3(e.msg);
        //   });
      }
    },
    verifyPost() {
      let reg = /^1[23456789]\d{9}$/;
      if (this.isTap) {
        return false;
      }
      this.isTap = false;
      if (!this.phone) {
        jAlert3("请输入手机号");
        return false;
      }
      if (!reg.test(this.phone)) {
        jAlert3("请输入正确的手机号");
        return false;
      }
      this.isTap = false;
      if (this.ysmState) {
        this.$refs.imgCodeComponent.getImgVerify();
        this.$refs.imgCodeComponent.showDialog();
      } else {
        this.isTap = false;
      }
    },
    changeTime(data) {
      this.isGetVerify = data.isGetVerify ? data.isGetVerify : this.isGetVerify;
      this.isTap = data.isTap ? data.isTap : this.isTap;
      this.ysmState = data.ysmState ? data.ysmState : this.ysmState;
      this.verifyId = data.verifyId;
      clearInterval(this.interVal);
      this.interVal = setInterval(() => {
        this.timeOut--;
      }, 1000);
    },
    loginPost() {
      {
        if (!this.phone) {
          jAlert3("请输入手机号");
          return false;
        }
        if (!this.verifyId) {
          jAlert3("请获取验证码");
          return false;
        }
        if (!this.verifyCode) {
          jAlert3("请输入验证码");
          return false;
        }
        this.errMsg = "";
        var wxuser = this.wxuser;
        api
          .memberLoginByMobileCode({
            url:
              "mobile=" +
              this.phone +
              "&verifyCode=" +
              this.verifyCode +
              "&openid=" +
              wxuser.openid +
              "&hotelGroupCode=" +
              config.hotelGroupCode +
              "&hotelGroupId=" +
              config.hotelGroupId +
              "&appid=" +
              config.appid +
              "&verifyId=" +
              this.verifyId +
              "&componentAppid=" +
              config.componentAppid,
          })
          .then((res) => {
            if (res.result == 1) {
              this.gobindOpenId(res.retVal);
              setStorage("user", res.retVal);
            } else {
              if (res.msg.indexOf("未注册") > 0) {
                var hotelCode = config.hotelCode ? config.hotelCode : 0;
                var sex = "?";
                if (wxuser && wxuser.sex) {
                  sex = wxuser.sex;
                }
                let cardSrc = getStorage("cardSrc") || "";
                var obj = {
                  mobile: this.phone,
                  password: "YXNkMTIzNDU2",
                  sex: sex,
                  email: "",
                  name: wxuser.nickName,
                  hotelGroupCode: config.hotelGroupCode,
                  hotelGroupId: config.hotelGroupId,
                  openid: wxuser.openid,
                  hotelCode: hotelCode,
                  inviteCode: "",
                  verifyCode: this.verifyCode,
                  verifyId: this.verifyId,
                  appid: config.appid,
                  componentAppid: config.componentAppid,
                  channel: "WECHAT",
                  cardSrc: cardSrc,
                  referrerId: this.canGive ? this.inviteMemberId : "",
                };
                api
                  .fastRegister({
                    url: createUrl(obj),
                  })
                  .then((res) => {
                    if (res.result == 1) {
                      setStorage("user", res.retVal);
                      this.gobindOpenId(res.retVal);
                      // gcTrack.track("LoginResults", {
                      //   login_mode: "手机号码登录",
                      //   is_successful: true,
                      //   reasons_for_failure: "",
                      // });
                      let user = getStorage("user");
                      // aplus_queue.push({
                      //   action: "aplus.record",
                      //   arguments: [
                      //     "ifp_share_login",
                      //     "OTHER",
                      //     {
                      //       page_name: "ifp_share_login",
                      //       be_shared_man_id: user.memberId,
                      //       share_man_id: this.user.memberId,
                      //     },
                      //     "POST",
                      //   ],
                      // });
                      UmengSDK.sendEvent("ifp_share_login", {
                        page_name: "ifp_share_login",
                        be_shared_man_id: user.memberId,
                        share_man_id: this.user.memberId,
                      });
                    } else {
                      this.errMsg = res.msg;
                    }
                  });
              } else {
                jAlert3(res.msg);
                this.ysmState = true;
                // gcTrack.track("LoginResults", {
                //   login_mode: "手机号码登录",
                //   is_successful: false,
                //   reasons_for_failure: res.msg,
                // });
              }
              api
                .saveInvitationJSYQRecord({
                  ruleCode: this.ruleCode,
                  memberId: this.user.memberId,
                  YQHYId: this.id,
                  hotelCode: config.hotelCode,
                  hotelGroupCode: config.hotelGroupCode,
                })
                .then((res) => {})
                .catch((e) => {});
            }
          });
      }
    },
    gobindOpenId: function (opt, isRegister) {
      var _this = this;
      _this.setProfile();
      if (_this.wxuser && _this.wxuser.openid) {
        api
          .bindOpenId({
            memberId: opt.memberId,
            openIdUserId: _this.wxuser.openid,
            openIdType: "WEIXIN",
            hotelGroupCode: config.hotelGroupCode,
            hotelGroupId: config.hotelGroupId,
            appid: config.appid,
            componentAppid: config.componentAppid,
            channel: "WECHAT",
          })
          .then((res) => {
            if (res.result == 1 && res.retVal.resultCode == 0) {
              console.log("openid绑定成功ok");
            } else {
              console.log("openiderror");
              jAlert3(res.retVal.resultMsg);
              return false;
            }
            jAlert3("登录成功，欢迎回来");
            // _this.$router.push({
            //   path: "/memberCenter",
            //   name: "memberCenter",
            // });
            uni.reLaunch({
              url: `/pages/member/memberCenter`,
            });
          });
      } else {
        clearInterval(_this.interVal);
        // _this.$router.push({
        //   path: "/memberCenter",
        //   name: "memberCenter",
        // });
        uni.reLaunch({
          url: `/pages/member/memberCenter`,
        });
      }
    },
    getData() {
      api
        .findInvitationLandConfigByCodeH5({
          ruleCode: this.ruleCode,
        })
        .then((res) => {
          if (res.result == 0) {
            console.log(res);
            this.pageData = res.retVal;
          } else {
            jAlert3(res.msg);
          }
        });
      api
        .getMemberInfoByCardNo({
          // accessToken: this.memberToken,
          cardNo: this.cardNo,
          hotelGroupCode: config.hotelGroupCode,
          hotelGroupId: "",
          hotelCode: "",
        })
        .then((res) => {
          if (res.result == 1) {
            this.userData = res.retVal;
          } else {
            jAlert3(res.msg);
          }
        });
      api
        .ifCanRewardGiveaways({
          //被邀请人点击链接进入页面后，是否可以赠送邀请人奖励判断
          hotelCode: config.hotelCode,
          hotelGroupCode: config.hotelGroupCode,
          ruleCode: this.ruleCode,
          memberId: this.user.memberId,
          YQHYId: this.id,
        })
        .then((res) => {
          console.log(res);
          if (res.result == 1) {
            this.canGive = res.retVal == "T";
          } else {
            // jAlert3(res.msg);
          }
        });
    },
  },
};
</script>
<style lang="less" scoped>
@font-face {
  font-family: "Source Han Serif CN"; /* project id 600757 */
  src: url("https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/sz/SourceHanSerifCN-Heavy.otf");
}
.ui_invite_share {
  width: 100vw;
  background: url("https://website-10049437.cos.ap-shanghai.myqcloud.com/86cc97b5-d975-4a43-8918-f1c5caea4e24")
    no-repeat;
  height: 100vh;
  background-size: contain;
  padding: 128px 24px 66px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .top {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    .userHeaderImg {
      width: 48px;
      height: 48px;
      margin-right: 12px;
      border-radius: 50%;
    }
    .rowMemberCard {
      font-family: PingFang SC;
      font-size: 12px;
      font-weight: 400;
      line-height: 12px;
      letter-spacing: 0px;
      margin-bottom: 8px;
      color: #fff;
    }
    .rowUserName {
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: 0px;
      text-align: left;
      color: #fff;
    }
  }
  .title1 {
    height: 40px;
    font-family: Source Han Serif CN;
    font-size: 40px;
    font-weight: 900;
    line-height: 40px;
    letter-spacing: 0px;
    text-align: left;
    margin-bottom: 16px;
    color: #fff;
  }
  .title2 {
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: left;
    flex: 1;
    color: #fff;
  }
  .btn {
    width: 100%;
    background-color: #fff;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 400;
    line-height: 16px;
    letter-spacing: 0px;
    text-align: center;
    border-radius: 4px;
    margin-bottom: 32px;
  }
  .title3 {
    font-family: Source Han Serif CN;
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0px;
    text-align: center;
    color: #fff;
  }
}
.mobileLoginBox {
  padding: 16px;
  height: 80vh;
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
      width: 100px;
      font-size: 14px;
      color: #000000;
    }
    .userInfoDesc {
      font-size: 14px;
      color: #000000;
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
        white-space: nowrap;
        &.disabled {
          color: #ccc;
          border: 1px solid #ccc;
        }
      }
    }
  }
}
.mobileLoginBtn {
  width: 100%;
  height: 48px;
  line-height: 48px;
  background-color: #000000;
  background-image: url("https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/btnBlack.png");
  background-repeat: repeat;
  text-align: center;
  background-size: 40px 37.5px;
  border-radius: 4px;
  color: #fff;
  text-align: center;
  margin-top: 32px;
}
</style>