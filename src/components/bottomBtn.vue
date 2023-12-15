<template>
  <div class="ui_bottomBtn">
    <div class="bottomBtn" @click="clickButton">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "bottomBtn",
  emits: ["clickButton"],
  setup(props, { emit }) {
    const clickButton = () => {
      emit("clickButton");
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
  padding: 12px 12px;
  background: #ffffff;
  height: calc(72px + constant(safe-area-inset-bottom));
  height: calc(72px + env(safe-area-inset-bottom));
  z-index: 9;
  .bottomBtn {
    .baseBtn();
    height: 48px;
    line-height: 48px;
    width: 100%;
  }
}
</style>
