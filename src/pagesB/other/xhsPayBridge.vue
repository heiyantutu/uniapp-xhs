<template>
  <div class="ui_xhsPayBridge">

  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import { goPage } from "@/utils/utils";
import { onLoad } from "@dcloudio/uni-app";
let config = getStorage("config");

onLoad((options: any) => {
  if (options.redirect_url) {
    let url = decodeURIComponent(options.redirect_url);
    window.location.href = url;
  }
});
onMounted(() => {});
</script>

<style lang="less" scoped>
.ui_xhsPayBridge {
  
}
</style>