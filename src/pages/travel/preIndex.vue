<template>
  <div class="ui_preIndex"></div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, toRaw } from "vue";
import api from "@/utils/api";

import { getStorage } from "@/utils/wxuser";
import { jAlert3 } from "@/base/jAlert/jAlert";
onMounted(() => {
  uni.switchTab({
    url: `/pages/travel/index`,
  });
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");
.ui_preIndex {
}
</style>
