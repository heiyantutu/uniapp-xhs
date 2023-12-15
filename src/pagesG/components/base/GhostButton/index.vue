<script setup lang="ts">
const props = defineProps<{
  disabled?: boolean
}>()
const emit = defineEmits<{
  (e: 'click'): void
}>()
const onClick = () => {
  if (props.disabled) return
  emit('click')
}
</script>

<template>
  <div
    :class="{ 'ghost-button': true, disabled: props.disabled }"
    @click="onClick"
  >
    <slot></slot>
  </div>
</template>

<style scoped lang="less">
.ghost-button {
  margin: 0;
  font-size: 14px;
  line-height: 14px;
  padding: 12px 20px;
  border: 1px solid #000;
  background: #fff;
  border-radius: 4px;

  &:last-of-type {
    margin-left: 8px;
  }
  &.disabled {
    border: none;
    background: #eee;
    color: #ccc;
  }
}
</style>
