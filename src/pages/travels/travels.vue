<template>
  <div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import {
  onLoad
} from "@dcloudio/uni-app";
import {
  getStorage, setStorage
} from "@/utils/wxuser";
import { goPage } from "@/utils/utils";
onLoad((options: any) => {
    if (options.type) {
      setStorage('type',options.type)
    }
    
})
onMounted(() => {
  goPage('/pages/travel/index')
});

</script>

<style lang="less" scoped>

</style>
