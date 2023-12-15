<script setup lang="ts">
const props = defineProps<{
  title: string
}>()
</script>

<template>
<div class="card">
  <div class="head">
    {{ props.title }}
  </div>
  <div class="body">
    <slot></slot>
  </div>
</div>
</template>

<style scoped>
.card {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
}

.head {
  border-bottom: 1px solid #eee;
  padding: 16px 12px;
  font-size: 14px;
  line-height: 14px;
  font-weight: bold;
}
.body {
  padding: 16px 12px;
}
</style>