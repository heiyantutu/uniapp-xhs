<template>
  <div class="ui_setting">
    <!-- #ifdef MP -->
    <coustom-head title="设置" nativeMode=true>
    </coustom-head>
    <!-- #endif -->
    <div class="settingBox">
      <div class="card">
        <link-item v-for="(listItem,listItemIndex) in list" :key="listItemIndex" :linkItem="listItem"
          @chooseLink="chooseLink"></link-item>
      </div>
      <div class="card">
        <link-item v-for="(listItem,listItemIndex2) in list2" :key="listItemIndex2" :linkItem="listItem"
          @chooseLink="chooseLink"></link-item>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import linkItem from "@/components/linkItem.vue";
import { createUrl, goPage } from "@/utils/utils";
import api from "@/utils/api";
import { getStorage, setStorage } from "@/utils/wxuser";
import { jAlert3, jAlert5 } from "@/base/jAlert/jAlert";
import coustomHead from "@/components/coustomHead.vue";

let config = getStorage("config");
let user = getStorage("user");
let wxuser = getStorage("wxuser");
let list = reactive([
  {
    name: "会员政策",
    link: `/pagesA/other/codeText?title=${decodeURIComponent(
      "会员政策"
    )}&code=memberRule`,
  },
  {
    name: "用户协议",
    link: `/pagesA/other/codeText?title=${decodeURIComponent(
      "用户协议"
    )}&code=rule`,
  },
]);
let list2 = reactive([
  {
    name: "退出登录",
    type: "loginOut",
  },
]);
const signOut = () => {
  jAlert5("是否退出登录?", () => {
    removeOpenId();
  });
};
const removeOpenId = () => {
  var removeObj = {
    hotelCode: config.hotelCode,
    hotelGroupCode: config.hotelGroupCode,
    hotelGroupId: config.hotelGroupId,
    isMiniApp: true,
    memberId: user.memberId,
    miniAppid: config.appid,
    openIdType: "WEIXIN",
    openIdUserId: wxuser.openid,
  };
  api.removeOpenId(createUrl(removeObj)).then((res: any) => {
    jAlert3("退出成功");
    setStorage("user", "");
    setTimeout(function () {
      uni.reLaunch({
        url: "/pages/member/memberCenter",
      });
    }, 2000);
  });
};
const chooseLink = (item: any) => {
  if (item.link) {
    goPage(item.link);
  }
  if (item.type == "loginOut") {
    jAlert5("是否退出登录", () => {
      removeOpenId();
    });
  }
  console.log(item);
};
onMounted(() => {});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import (reference) url("~@/styles/mixin.less");
.ui_setting {
  .settingBox {
    padding: 16px;
  }
  .card {
    background: #fff;
    border-radius: 4px;
    margin-bottom: 12px;
  }
}
</style>
