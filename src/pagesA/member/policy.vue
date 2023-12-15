<template>
  <div class="ui_policy">
    <!-- #ifdef MP -->
    <coustom-head title="会员政策" nativeMode="true"> </coustom-head>
    <!-- #endif -->
    <div class="memberInfoBox" >
      <div v-html="policyData"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import coustomHead from "@/components/coustomHead.vue";
import { reactive, ref, computed, watch } from "vue";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import { jAlert3 } from "@/base/jAlert/jAlert";
import { onLoad } from "@dcloudio/uni-app";
let user = getStorage("user");
let policyData = ref();
onLoad((options) => {
  policyData.value = getStorage("policyData");
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import (reference) url("~@/styles/mixin.less");
.ui_policy {
  // margin: 16px;
  .memberInfoBox {
    padding: 16px;
  }
}
</style>
