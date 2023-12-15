<script setup lang="ts">
import { removeStorage, getStorage, setStorage } from "@/utils/wxuser";
import { onLaunch, onShow, onHide, onPageNotFound } from "@dcloudio/uni-app";
import { refreshMemberInfo, login } from "@/utils/utils";
import routingIntercept from "@/utils/routingIntercept";
import api from "@/utils/api";
import UmengSDK from "@/utils/umengAdaptor.js";
import type { codeLoginResponse } from "@/interface/login";
import type { apiResponse } from "@/interface/apiResponse";

let config = getStorage("config");
let wxuser = getStorage("wxuser");
onPageNotFound(() => {
  uni.redirectTo({
    url: `/pages/travel/preIndex`,
  });
});
const loadFonts = () => {
  let fontList = [
    {
      family: "Montserrat",
      source:
        "https://dsplatweb.oss-cn-chengdu.aliyuncs.com/font/Montserrat-Regular.otf",
    },
    {
      family: "Source Han Serif CN",
      source:
        "https://dsplatweb.oss-cn-chengdu.aliyuncs.com/font/SourceHanSerifCN-SemiBold.otf",
    },
  ];
  fontList.forEach((n) => {
    uni.loadFontFace({
      family: n.family,
      global: true,
      source: `url("${n.source}")`,
      success(res) {
        console.log(222);
        console.log(res);
      },
      fail(res) {
        console.log(1111);
        console.log(res);
      },
    });
  });
};
const update = () => {
  try {
    const updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
          uni.showModal({
            title: "更新提示",
            content: "新版本已经准备好，是否重启应用?",
            success: function (res) {
              if (res.confirm) {
                updateManager.applyUpdate();
              }
            },
          });
        });
      }
    });
  } catch (e) {}
};
const queryMemberProduction = () => {
  let user = getStorage("user");
  api
    .interfaceTransfer({
      config: {
        interfaceFrom: "member",
        interfaceMethod: "/crm/v2/queryMemberProduction",
        hotelGroupCode: config.hotelGroupCode,
        interfaceType: "POST",
      },
      query: {
        channel: "WECHAT",
        hotelGroupCode: config.hotelGroupCode,
        cardId: user.cardId,
      },
    })
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.result == 0) {
          if (res.retVal.retVal.datas.length > 0) {
            UmengSDK.sendEvent(
              "$$_user_profile",
              {
                vip_first_order_channel: res.retVal.retVal.datas[0].channelDes,
              },
              "OTHER"
            );
          }
        }
      }
    });
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
            let nickName = "微信用户";
            // #ifdef MP-XHS
            nickName = "小红书用户";
            // #endif
            let newWxuser = Object.assign(response.retVal, {
              nickName,
            });
            setStorage("wxuser", newWxuser);
            wxuser = newWxuser;
            UmengSDK.registerGlobalProperties({
              _anony_id: wxuser.openid,
            });
            slientLogin();
          }
        });
    })
    .catch((error) => {
      console.error(error);
    });
};
const slientLogin = () => {
  let wxuser = getStorage("wxuser");
  api
    .memberLoginOpen({
      hotelCode: config.hotelCode,
      hotelGroupCode: config.hotelGroupCode,
      hotelGroupId: config.hotelGroupId,
      openid: wxuser.openid,
      appid: config.appid,
      componentAppid: config.componentAppid,
    })
    .then(function (data: any) {
      if (data.result == 1) {
        setStorage("user", data.retVal);
      } else {
        setStorage("user", "");
      }
    });
};
onLaunch(() => {
  // #ifdef H5 || MP-XHS
  // @ts-ignore
  uni.hideTabBar();
  // #endif
  // #ifdef MP-WEIXIN
  loadFonts();
  // #endif
  console.log("App Launch");
  routingIntercept();
  let user = getStorage("user");
  if (user && user.memberId) {
    refreshMemberInfo();
    UmengSDK.sendEvent(
      "$$_user_profile",
      {
        phone_number: user.mobile,
        is_vip: "是",
        vip_level: user.cardLevelDescript,
        vip_number: user.cardId,
        vip_card_bumber: user.cardNo,
        vip_first_channel: user.cardSrcDescript || "",
      },
      "OTHER"
    );
    queryMemberProduction();
  }
  let wxuser = getStorage("wxuser");
  // #ifdef MP
  if (!(wxuser && wxuser.openid)) {
    slientAuth();
  }
  //已授权已绑定但未登录
  if (wxuser && wxuser.openid && !(user && user.memberId)) {
    slientLogin();
  }
  // #endif

  // #ifdef H5
  if (!wxuser) {
    let fakeWxuser = {
      openid: "",
      nickName: "",
      avatarUrl: "",
    };
    setStorage("wxuser", fakeWxuser);
  }
  // #endif
  let launchOption = uni.getLaunchOptionsSync();
  if (launchOption.query && launchOption.query.partnerId) {
    setStorage("partnerId", launchOption.query.partnerId);
  }
  if (launchOption.query && launchOption.query.cardSrc) {
    setStorage("cardSrc", launchOption.query.cardSrc);
  }
  update();
});
onShow(() => {
  removeStorage("navList");
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="less">
@import url("~@/styles/iconfont.css");
@import url("~@/styles/skin.less");
@import url("~@/styles/base.less");
@import url("~@/styles/global.less");
@import url("~@/styles/animate.compat.css");
</style>
