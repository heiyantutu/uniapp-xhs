<template>
  <div class="ui_backToTop" @click="backToTop()" :style="backToTopStyle">
    <i class="icon-a-48_yijianzhiding iconfont"></i>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "backToTop",
  props: {
    backToTopStyle: {
      type: String,
      default: () => {
        return "";
      },
    },
    scrollFn: {
      type: null,
      default: () => {
        return "";
      },
    },
  },
  setup(props, context) {
    const backToTop = () => {
      if (props.scrollFn) {
        props.scrollFn();
      } else {
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 300,
        });
      }
    };
    return {
      backToTop,
    };
  },
});
</script>
<style lang="less" scoped>
.ui_backToTop {
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9;
  right: 16px;
  bottom: 85px;
  bottom: calc(85px + constant(safe-area-inset-bottom));
  bottom: calc(85px + env(safe-area-inset-bottom));
  background: #000;
  border-radius: 50%;
  width: 46px;
  height: 46px;
  border: 1px solid #fff;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.08);
  .iconfont {
    margin-left: -1px;
    margin-top: -1px;
    font-size: 48px;
    color: #fff;
    border-radius: 50%;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.08);
  }
}
</style>