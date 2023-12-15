<script setup lang="ts">
const props = defineProps<{
  title: string
  desc: string
  time?: string
}>()
</script>

<template>
  <div class="head-content">
    <div class="top">
      <div class="title">{{ props.title }}</div>
      <slot name="corner"></slot>
    </div>
    <p class="desc">{{ props.desc }}</p>
    <p class="desc" v-if="props.time">服务提供时间：{{ props.time }}，如有需求请联系前台</p>
  </div>
</template>

<style lang="less" scoped>
.head-content {
  padding: 24px 16px;
  position: absolute;
  bottom: 0;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .title {
    font-size: 20px;
    line-height: 30px;
    margin-bottom: 8px;
    font-weight: bold;
  }
  .desc {
    font-size: 14px;
    line-height: 22px;
  }
}
</style>