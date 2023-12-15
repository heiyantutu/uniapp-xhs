<template>
  <div
    class="ui_invite"
    :style="{
      'background-image':
        pageData && pageData.logo
          ? `url(${pageData.logo})`
          : `url(https://website-10049437.cos.ap-shanghai.myqcloud.com/4cb3ea81-07b1-4ab4-9bc8-f7ff8900d2f7)`,
      'background-size': '100% 100%',
    }"
  >
    <coustom-head title="" style="z-index: 1001" color="#fff"></coustom-head>
    <section class="wrap">
      <div>
        <p class="title1">{{ pageData.actTitle || "邀好友来松赞" }}</p>
        <p class="title2">{{ pageData.actDetail }}</p>
      </div>
      <section class="container">
        <div class="progress">
          <div
            class="progress-item"
            v-for="(item, index) in steps"
            :key="index"
          >
            <img class="icon-img" :src="item.pic" alt="" />
            <p class="item-name">{{ item.name }}</p>
            <img
              v-if="index < steps.length - 1"
              class="arrow-down"
              style="width: 12px; height: 12px"
              src="https://website-10049437.cos.ap-shanghai.myqcloud.com/92297851-0600-439c-8ab1-d55cf402faf3"
              alt="arrow-down"
            />
          </div>
        </div>
        <div class="bt" @click="invite">立即邀请</div>
        <div class="bottom">
          <div class="bottom-item">
            <span class="title">可邀请好友</span>
            <span class="text">{{ pageData.canInvitationLottery }}人</span>
          </div>
          <div class="bottom-item" style="border-top: 0.5px solid #eee">
            <span class="title">累计积分奖励</span>
            <span class="text">{{ point }}分</span>
          </div>
        </div>
      </section>
    </section>

    <!-- <gameShare
      :info="shareInfo"
      v-if="shareInfo.isShow"
      ref="gameShare"
      text="邀您扫码体验松赞"
    ></gameShare> -->
    <inviteShareImg
      :posterInfo="shareInfo"
      @close="closePoster"
      v-if="showShare"
    ></inviteShareImg>
  </div>
</template>
<script>
var config = {};
import api from "@/utils/api";
import { jAlert3 } from "@/base/jAlert/jAlert";
import { getStorage } from "@/utils/wxuser";
import inviteShareImg from "./inviteShareImg.vue";
import { onShareAppMessage } from "@dcloudio/uni-app";
import {
  getUrlParams,
  login,
  getUrl,
  urlEncode,
  toLogin,
  createUrl,
} from "@/utils/utils";
import UmengSDK from "@/utils/umengAdaptor.js";
import coustomHead from "@/components/coustomHead.vue";

export default {
  components: { inviteShareImg, coustomHead },
  data() {
    return {
      wxuser: getStorage("wxuser"),
      user: getStorage("user"),
      pageData: {},
      steps: [],
      showShare: false,
      point: "",
      shareUrlParam: "",
      shareInfo: {
        posterImage: "",
        isShow: false,
        qrCode: "",
      },
      shareData: {
        path: "",
        params: "",
      },
    };
  },
  props: {},
  watch: {},
  created() {
    config = getStorage("config");
  },
  mounted() {
    if (!(this.user && this.user.memberId)) {
      toLogin();
      return;
    }
    this.getData();
  },
  onShareAppMessage() {
    return {
      title: "邀您体验松赞",
      // path: "/pages/mall/webview?" + this.shareUrlParam,
      path: "/pagesB/invite/inviteShare?" + this.shareData.params,
      success: function () {
        // 转发成功
      },
      fail: function () {
        // 转发失败
      },
    };
  },
  methods: {
    invite() {
      this.getWxacodeUnlimitUrl();
    },
    closePoster() {
      this.showShare = false;
    },
    getData() {
      console.log(this.wxuser, "this.wxuser");
      console.log(this.user, "this.user");
      uni.showLoading({
        title: "加载中...",
      });
      api
        .memberLoginOpen({
          hotelCode: config.hotelCode,
          hotelGroupCode: config.hotelGroupCode,
          hotelGroupId: config.hotelGroupId,
          memberId: this.user.memberId,
          openid: this.wxuser.openid,
          appid: config.appid,
          componentAppid: config.componentAppid,
        })
        .then((res) => {
          if (res.result == 1) {
            console.log(res);
            let cardLevel = res.retVal.cardLevel;
            let cardLevelListOrder = res.retVal.cardLevelListOrder;
            let obj = {
              hotelGroupCode: config.hotelGroupCode,
              hotelCode: config.hotelCode,
              level: cardLevel,
              memberId: this.user.memberId,
              memberCardListOrder: cardLevelListOrder,
            };
            api.selectInvitationSpoilRules(obj).then((data) => {
              console.log(data);
              if (data.result == 1) {
                this.pageData = data.retVal[0] || {};
                this.steps = this.pageData ? this.pageData.invitationStep : [];
                const obt = {
                  hotelCode: config.hotelCode,
                  hotelGroupCode: config.hotelGroupCode,
                  ruleCode: this.pageData.ruleCode,
                  memberId: this.user.memberId,
                  cardListOrder: cardLevelListOrder,
                };
                api.saveInvitationYQHYRecord(obt).then((data) => {
                  console.log(data);
                  if (data.result == 1) {
                    let id = data.retVal;
                    // let url = `https://wap.songtsam.com/wechat/?/#/inviteShare?id=${id}&ruleCode=${this.pageData.ruleCode}&memberId=${this.user.memberId}&headimgurl=${this.wxuser.avatarUrl}&cardNo=${this.user.cardNo}`;
                    // console.log(url, "url");
                    // console.log(this.wxuser, "this.wxuser");
                    // console.log(this.wxuser.avatarUrl, "this.wxuser.avatarUrl");
                    // let path = getUrl(url);
                    // var params = {
                    //   url: path,
                    // };
                    // this.shareUrlParam = urlEncode(params);
                    // console.log(this.shareUrlParam, "this.shareUrlParam");
                    this.shareData.path = "pagesB/invite/inviteShare";
                    this.shareData.params = `id=${id}&ruleCode=${this.pageData.ruleCode}&memberId=${this.user.memberId}&headimgurl=${this.wxuser.avatarUrl}&cardNo=${this.user.cardNo}`;
                    setTimeout(() => {
                      this.shareInfo = {
                        posterImage: this.pageData.posterImage,
                        // qrCode: url,
                        isShow: false,
                        // isShow: true,
                      };
                      console.log(this.shareInfo);
                      uni.hideLoading();
                    }, 500);

                    api
                      .interfaceTransfer({
                        config: {
                          interfaceFrom: "member",
                          interfaceMethod: "/crm/v2/getMemberPromotionCount",
                          hotelGroupCode: config.hotelGroupCode,
                          interfaceType: "POST",
                        },
                        query: {
                          hotelCode: config.hotelCode,
                          hotelGroupCode: config.hotelGroupCode,
                          channel: "WECHAT",
                          memberId: this.user.memberId,
                          cardId: this.user.cardId,
                        },
                      })
                      .then((res) => {
                        console.log(res);
                        this.point = res.retVal.retVal.totalPoint || "0";
                        console.log("埋点触发");
                        UmengSDK.sendEvent("invite_friends_pg", {
                          page_name: "invite_friends_pg",
                          be_invited_friends:
                            this.pageData.canInvitationLottery,
                          accumulative_integral: this.point,
                        });
                      });
                  } else {
                    jAlert3(data.msg);
                    uni.hideLoading();
                  }
                });
              } else {
                jAlert3(data.msg);
                uni.hideLoading();
              }
            });
          } else {
            jAlert3(res.msg);
            uni.hideLoading();
          }
        });
    },
    getWxacodeUnlimitUrl() {
      uni.showLoading({
        title: "图片生成中...",
      });
      console.log(this.shareData.params, "this.shareData.params");
      const config = getStorage("config");
      var opt = {
        appid: config.appid,
        componentAppid: config.componentAppid,
        line_color_g: 0,
        page: this.shareData.path,
        param: this.shareData.params,
        width: 500,
        line_color_b: 0,
        auto_color: false,
        scene: Math.random().toString(36).substring(2),
        is_hyaline: true,
        line_color_r: 0,
        env_version: "trial",
      };
      api.getWxacodeUnlimitUrl(opt).then((res) => {
        if (res.result == 1) {
          setTimeout(() => {
            this.shareInfo = {
              posterImage: this.pageData.posterImage,
              qrCode: res.retVal.imageUrl,
              isShow: true,
            };
            console.log(this.shareInfo);
            this.showShare = true;
            uni.hideLoading();
          }, 400);
        } else {
          uni.hideLoading();
          jAlert3(res.msg);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.ui_invite {
  width: 100vw;
  background: url("https://website-10049437.cos.ap-shanghai.myqcloud.com/4cb3ea81-07b1-4ab4-9bc8-f7ff8900d2f7")
    no-repeat;
  height: 100vh;
  background-size: contain;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  overflow: auto;
  .wrap {
    padding: 128px 24px 80px;
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
    color: #fff;
  }
  .container {
    border-radius: 12px;
    background-color: #fff;
    padding: 16px;
    margin-top: 15px;
    .progress {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      .progress-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .item-name {
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 400;
          line-height: 22px;
          letter-spacing: 0px;
          text-align: center;
          margin-bottom: 12px;
        }
        .icon-img {
          width: 20px;
          height: 20px;
          margin-bottom: 8px;
        }
        .arrow-down {
          margin-bottom: 12px;
        }
      }
    }
    .bt {
      z-index: 10;
      margin-top: 12px;
      width: 100%;
      background-image: url(https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/btnBlack.png);
      background-repeat: repeat;
      background-size: 40px 37.5px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 400;
      line-height: 16px;
      background-color: #000;
      height: 48px;
      color: #fff;
    }
    .bottom {
      &-item {
        padding: 16px 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .title {
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 400;
          line-height: 14px;
          letter-spacing: 0px;
          text-align: left;
          color: #808080;
        }
        .text {
          font-family: PingFang SC;
          font-size: 14px;
          font-weight: 500;
          line-height: 14px;
          letter-spacing: 0px;
          text-align: right;
        }
      }
    }
  }
}
</style>