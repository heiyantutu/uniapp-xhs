<template>
  <web-view :src="url" @message="bindmessage" @load="bindload"></web-view>
</template>

<script>
import api from "@/utils/api";
import { setStorage, getStorage } from "@/utils/wxuser";
import {
  createUrl,
  refreshMemberInfo,
  getUrlParams,
  getCurrentCard,
  login,
  getUrl,
  urlEncode,
} from "@/utils/utils";
var config = {};
export default {
  data() {
    return {
      url: "",
      shareItem: {},
      original: "",
      user: {},
    };
  },
  onPullDownRefresh() {},
  onShareAppMessage: function (res) {
    var path = this.shareItem.link || decodeURIComponent(res.webViewUrl);
    path = getUrl(path);
	console.log('=============================>path')
	console.log(path)
    var params = {
      url: path,
    };
	console.log(params)
    var sharePath = "/pages/mall/webview?" + urlEncode(params);
	console.log(sharePath)
    return {
      title: this.shareItem.desc,
      path: sharePath,
      success: function (res) {},
      fail: function (res) {},
    };
  },
  methods: {
    bindload(e) {
      if (this.original.indexOf("https://s.ihotel.cn") != -1) {
        let openid = getStorage("openid");
        this.original = e.detail.src;
        if (openid) {
          this.parseUrl();
        } else {
          this.silentGetOpenId();
        }
      }
    },
    refreshMemberInfo() {
      var self = this;
      let openid = getStorage("openid");
      api
        .memberLoginOpen({
          hotelCode: config.hotelCode,
          hotelGroupCode: config.hotelGroupCode,
          hotelGroupId: config.hotelGroupId,
          componentAppid: config.componentAppid,
          appid: config.appid,
          openid: openid || "",
        })
        .then(function (data) {
          if (data.result == 1) {
            setStorage("user", data.retVal);
            self.user = data.retVal;
            [self.currentCard, self.currentCardIndex] = getCurrentCard();
            cb && cb();
          } else {
            var user = {};
            setStorage("user", user);
            self.user = user;
            [self.currentCard, self.currentCardIndex] = getCurrentCard();
          }
        });
    },
    bindmessage(e) {
      var data = e.detail.data[e.detail.data.length - 1];
	  console.log('=================>')
	  console.log(data)
      if (data.type == "share") {
        this.shareItem = data;
      }
      if (data.type == "signOut") {
        setStorage("user", "");
        setStorage("token", "");
        this.user = "";
      }
      if (data.type == "refreshMemberInfo") {
        if (data.token) {
          if (!(this.user && this.user.memberId)) {
            refreshMemberInfo();
          } else {
            refreshMemberInfo();
          }
        } else {
          refreshMemberInfo();
        }
      }
    },
    silentGetOpenId() {
      login()
        .then((res) => {
          console.log(res);
          return api.getWxCode({
            code: res.code,
            appid: config.appid,
            // #ifdef MP-ALIPAY
            scopes: "auth_user",
            clientType: "ALIPAY",
            // #endif
            // #ifdef MP-XHS
            clientType: "RED_MINI",
            // #endif
          });
        })
        .then((res) => {
          var openid = res.retVal.openid;
          // #ifdef MP-ALIPAY
          openid = res.retVal.userId;
          // #endif
          setStorage("openid", openid);
          this.parseUrl();
        });
    },
    parseUrl() {
      let openid = getStorage("openid");
      var params = getUrlParams(this.original);
      let distributorBase = getStorage("distributorBase");
      let distributorId = "";
      let token = getStorage("token");
      if (params && params.distributorId) {
        distributorId = params.distributorId;
      }
      if (params) {
        delete params.miniProgramOpenid;
        delete params.token;
        delete params.appid;
        delete params.distributorId;
      }
      if (!distributorId && distributorBase && distributorBase.id) {
        distributorId = distributorBase.id;
      }
      var nonParamsUrl = this.original.split("?");
      if (nonParamsUrl[nonParamsUrl.length - 1].indexOf("=") > -1) {
        nonParamsUrl.pop();
      }

      nonParamsUrl = nonParamsUrl.join("?");

      let paramsList = Object.keys(params);
      if (paramsList.length > 0) {
        this.url = `${nonParamsUrl}?${createUrl(
          params
        )}&miniProgramOpenid=${openid}&appid=${
          config.appid
        }&t=${+new Date().getTime()}&distributorId=${distributorId}&token=${token}`;
      } else {
        this.url = `${nonParamsUrl}?miniProgramOpenid=${openid}&appid=${
          config.appid
        }&t=${+new Date().getTime()}&distributorId=${distributorId}&token=${token}`;
      }
      console.log(this.url);
    },
  },
  created() {
    config = getStorage("config");
    this.user = getStorage("user");
    this.wxuser = getStorage("wxuser");
  },

  mounted() {},
  onUnload() {},
  onLoad: function (option) {
    if (option.url) {
      this.original = decodeURIComponent(option.url);
      if (this.original.indexOf("fadada.com") != -1) {
        this.url = decodeURIComponent(this.original);
      } else if (this.original.indexOf("https://mp.weixin.qq.com") != -1) {
        this.url = this.original;
      } else {
        let openid = getStorage("openid");
        if (openid) {
          this.parseUrl();
        } else {
          this.silentGetOpenId();
        }
      }
    }
    if (option.scene) {
      let openid = getStorage("openid");
      this.original = decodeURIComponent(option.scene);

      if (openid) {
        this.parseUrl();
      } else {
        this.silentGetOpenId();
      }
    }
  },
  components: {},
};
</script>

<style lang="less" scoped>
</style>
