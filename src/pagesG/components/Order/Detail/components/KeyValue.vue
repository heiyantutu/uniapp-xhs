<script setup lang="ts">
import { computed, useSlots } from "vue"
import * as R from 'ramda'

const props = defineProps<{
  separate?: boolean
  label: string
  value?: string | number
  flex?: boolean
}>()
const slots = useSlots()

const isEmpty = computed(() => R.isNil(props.value) && !slots.default)
</script>

<template>
  <div :class="{ kv: true, separate: props.separate }">
    <div class="label">{{ props.label }}</div>
    <div :class="{flex: props.flex}">
      {{ isEmpty ? "-" : props.value }}
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="less">
.kv {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  &:last-of-type {
    margin-bottom: 0;
  }
}
.separate {
  justify-content: space-between;
}
.label, .value {
  font-size: 14px;
  line-height: 14px;
}
.label {
  flex-basis: 80px;
  flex-shrink: 0;
  color: #808080;
  margin-right: 8px;
}
.flex {
  flex: 1;
}
</style>
