<template>
  <div class="bottomDialogBox" v-if='isShowDialog'>
    <div class="bottomDialogMask" @click.stop='hideDialog' v-bind:class="{fadeIn:isShowDialog,animated:isShowDialog}">
    </div>
    <div class="bottomDialog" v-bind:class="{slideInUp:isShowDialog,animated:isShowDialog}">
      <div class="title">
        {{title}}
        <i class="icon iconfont icon-a-16_guanbi_ciji" @click='hideDialog'></i>
      </div>
      <div class="dialogBox">
        <slot></slot>
      </div>
      <div class="bottomFooter"></div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "bottomDialog",
  props: {
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  emits: ["openState"],
  setup(props, { emit }) {
    let isShowDialog = ref(false);
    const showDialog = () => {
      isShowDialog.value = true;
      emit("openState", 1);
    };
    const hideDialog = () => {
      isShowDialog.value = false;
      emit("openState", 0);
    };
    return {
      isShowDialog,
      showDialog,
      hideDialog,
    };
  },
});
</script>
<style lang="less" scoped>
.bottomDialogBox {
  .bottomDialogMask {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .bottomDialog {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    z-index: 101;
    .bottomFooter {
      background-color: #f8f8f8;
      height: constant(safe-area-inset-bottom);
      height: env(safe-area-inset-bottom);
    }
    .title {
      height: 56px;
      line-height: 56px;
      text-align: center;
      font-size: 18px;
      color: #000;
      font-weight: bold;
      background: #fff;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      position: relative;
      .iconfont {
        position: absolute;
        color: #000000;
        font-size: 18px;
        left: 5px;
        top: -10px;
        border: 10px solid transparent;
      }
    }
    .dialogBox {
      background-color: #f8f8f8;
    }
  }
}
</style>
