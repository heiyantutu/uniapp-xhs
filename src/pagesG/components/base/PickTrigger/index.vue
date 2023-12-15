<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    display: boolean
    title: string
    placeholder?: string
  }>(),
  {
    placeholder: '请选择',
  }
)

const emit = defineEmits<{
  (e: 'click'): void
}>()

const click = () => {
  emit('click')
}
</script>

<template>
  <div class="trigger" @click="click">
    <div class="left">
      <div class="title">
        {{ props.title }}
      </div>
      <div>
        <span class="placeholder" v-if="!display">{{ props.placeholder }}</span>
        <slot v-else name="display"></slot>
      </div>
    </div>
    <i class="iconfont icon-a-16_youlajiantou_hei"></i>
  </div>
</template>

<style scoped lang="less">
.trigger {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background: #fff;
  padding: 16px 12px;
  border-radius: 12px;
  font-size: 14px;
}

.placeholder {
  color: #999;
  line-height: 16px;
}

.left {
  display: flex;
  align-items: flex-start;
}

.title {
  margin-right: 32px;
  line-height: 16px;
  font-size: 16px;
  flex-shrink: 0;
}

.iconfont {
  font-size: 16px;
}
</style>
