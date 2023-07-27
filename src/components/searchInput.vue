<template>
  <div class="ui_searchInput">
    <i class="icon iconfont icon-a-16_sousuo_hui"></i>
    <input :placeholder=placeholder @input=handelInput :value="modelValue" confirm-type="done" @confirm=confirmInput />
    <div class="clear" v-if="modelValue.length>0" @click="clearInput">
      <i class="icon iconfont icon-a-20_guanbi"></i>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "searchInput",
  props: {
    modelValue: {
      type: String,
      default: () => {
        return "";
      },
    },
    placeholder: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  emits: ["update:modelValue"],
  setup(props, context) {
    function handelInput(e) {
      context.emit("update:modelValue", e.detail.value);
    }
    function clearInput() {
      context.emit("update:modelValue", "");
      context.emit("clear");
    }
    function confirmInput(e) {
      context.emit("submit", e.detail.value);
    }
    return {
      handelInput,
      clearInput,
      confirmInput,
    };
  },
});
</script>
<style lang="less" scoped>
.ui_searchInput {
  display: flex;
  align-items: center;
  background: #f8f8f8;
  border-radius: 16px;
  width: 100%;
  height: 32px;
  .icon-a-16_sousuo_hui {
    margin-left: 12px;
    margin-right: 10px;
  }
  input {
    flex: 1;
    font-size: 14px;
  }
  .clear {
    background: #cccccc;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    margin-left: 12px;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      top: -30px;
      right: -30px;
      bottom: -30px;
      left: -30px;
      z-index: 9;
    }
    .iconfont {
      font-size: 12px;
    }
  }
}
</style>
