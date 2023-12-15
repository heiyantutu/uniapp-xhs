<template>
  <div class="ui_codeTextShow">
    <!-- #ifdef MP -->
    <coustom-head :title="title" nativeMode=true>
    </coustom-head>
    <!-- #endif -->
    <div class="codeTextShow">
      <mp-html :content="desc" class="textInfo"></mp-html>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from "vue";
import { onLoad,onPageScroll } from "@dcloudio/uni-app";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import coustomHead from "@/components/coustomHead.vue";

let config = getStorage("config");
let code = ref("");
let title = ref("");
let type = ref("");
let desc = ref("");
onLoad((options: any) => {
  if (options.code) {
    code.value = options.code;
  }
  if (options.type) {
    type.value = options.type;
  }
  if (options.title) {
    title.value = decodeURIComponent(options.title);
  }
});
const initQuery = () => {
  if (type.value == "storage") {
    let rule = getStorage("rule");
    title.value = rule.title;
    desc.value = rule.desc;
  }
  uni.setNavigationBarTitle({
    title: title.value,
  });
};
const getfunctionControl = () => {
  var codes = [code.value];
  var params = {
    appid: config.appid,
    codes: codes.join(","),
    componentAppid: config.componentAppid,
    hotelCode: config.hotelCode ? config.hotelCode : 0,
    hotelGroupCode: config.hotelGroupCode,
    clientType: "wechat_mini",
  };
  api
    .getMultiSysOptionCommon(params)
    .then((data: any) => {
      if (data.result == 1) {
        data.retVal.forEach(function (n: any) {
          if (n.code == code.value) {
            desc.value = n.value;
          }
        });
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
};
onMounted(() => {
  initQuery();
  getfunctionControl();
});
</script>
<style lang="less" scoped>
.ui_codeTextShow {
  .codeTextShow {
    padding: 15px;
  }
}
</style>