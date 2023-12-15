<template>
  <div :class="{'ui_bottomBtn': true, layout: layoutFlow}">
    <div :class="{'bottomBtn': true, disabled: disabled}" @click="clickButton">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "bottomBtn",
  props: {
    layoutFlow: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ["click"],
  setup(props, { emit }) {
    const clickButton = () => {
      if(props.disabled) return
      emit("click");
    };
    return {
      clickButton,
    };
  },
});
</script>
<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import (reference) url("~@/styles/mixin.less");
.ui_bottomBtn {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: 72px;
  padding: 12px 16px;
  background: #ffffff;
  height: calc(72px + constant(safe-area-inset-bottom));
  height: calc(72px + env(safe-area-inset-bottom));
  border-top:1px solid #f8f8f8;
  z-index: 9;
  &.layout {
    position: static;
    width: auto;
    padding: 0;
    height: auto
  }
  .bottomBtn {
    .baseBtn();
    height: 48px;
    line-height: 48px;
    width: 100%;
    &.disabled {
      background: #eee;
      color: #ccc;
    }
  }
}
</style>
