<script setup lang="ts">
import * as R from "ramda"
import { computed, ref } from "vue"
import SafeBottom from "../SafeBottom/index.vue"
import PickTrigger from "../PickTrigger/index.vue"
import bottomDialog from "@/components/bottomDialog.vue";

type BasePickerValue = string | number
const props = defineProps<{
  modelValue: string
  options: Array<{
    label: string
    value: BasePickerValue
  }>
  title: string
}>()
const emit = defineEmits<{
  (e: "update:modelValue", value: BasePickerValue): void
}>()

const display = computed(() =>
  R.pipe(
    R.find(R.propEq(props.modelValue, "value")),
    R.prop("label")
  )(props.options)
)

const popup = ref()
const showPopup = () => {
  popup.value.showDialog()
}
const close = () => {
  popup.value.hideDialog()
}

const pick = (v: BasePickerValue) => {
  emit("update:modelValue", v)
  close()
}
</script>

<template>
  <div class="base-picker">
    <div @click="showPopup">
      <PickTrigger title="意见类型" :display="!!display">
        <template #display>
          <span class="display">{{ display }}</span>
        </template>
      </PickTrigger>
    </div>

    <bottom-dialog ref="popup" type="bottom" :title="props.title">
      <div class="pop-content">
        <div class="body">
          <button
            v-for="item in props.options"
            :key="item.value"
            @click="pick(item.value)"
            class="row"
          >
            {{ item.label }}
          </button>
        </div>
        <SafeBottom>
          <button class="button" @click="close">取消</button>
        </SafeBottom>
      </div>
    </bottom-dialog>
  </div>
</template>

<style scoped lang="less">
.base-picker {
  width: 100%;
}
.pop-content {
  background: #f8f8f8;
  text-align: center;
  border-radius: 16px 16px 0 0;
}

.pop-title {
  line-height: 56px;
}

.body {
  background: #fff;
  margin-bottom: 10px;
}

.row {
  border-bottom: 1px solid #f8f8f8;
  text-align: center;
  line-height: 60px;
  display: flex;
  justify-content: space-around;
  background: #fff;
  font-size: 16px;
  &::after {
    border: none;
  }
}

.button {
  background: transparent;
  border: none;
  background: #fff;
  &::after {
    border: none;
  }
}
.display {
  line-height: 16px;
}
</style>
