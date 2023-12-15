<template>
  <div class="bottomDialogBox" v-show='isShowDialog'>
    <div class="bottomDialogMask" @click.stop='hideDialog'
      v-bind:class="{fadeIn:isShowDialog,animated:isShowDialog,disabled:!closable}">
    </div>
    <div class="bottomDialog"
      v-bind:class="{slideInUp:isShowDialog&&!sideslip,slideInRight:isShowDialog&&sideslip,animated:isShowDialog}"
      :style="{'max-height':maxHeight}">
      <div class="title">
        <p class="theTitle">{{title}}</p>
        <div class="titleBorder" v-if="titleBorder"></div>
        <template v-if="sideslip">
          <i class="icon iconfont icon-a-20_fanhuianniu" @click='hideDialog' v-if="closable"></i>
        </template>
        <template v-else>
          <i class="icon iconfont icon-a-16_guanbi_ciji" @click='hideDialog' v-if="closable"></i>
        </template>
      </div>
      <div class="dialogWarp" :style="maxDialogStyle" v-if="maxDialog">
        <div class="dialogBox">
          <slot></slot>
        </div>
      </div>
      <template v-else>
        <div class="dialogBox">
          <slot></slot>
        </div>
        <div class="bottomFooter"></div>
      </template>

    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { getMenuButtonBoundingClientRect } from "@/utils/platform";

export default defineComponent({
  name: "bottomDialog",
  props: {
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
    titleBorder: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    closable: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    maxDialog: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    sideslip: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  emits: ["openState"],
  setup(props, { emit }) {
    let isShowDialog = ref(false);
    let maxHeight = ref("90vh");
    let maxDialogHeight = ref("70vh");
    const showDialog = () => {
      isShowDialog.value = true;
      emit("openState", 1);
      // #ifdef MP-WEIXIN
      wx.setPageStyle({
        style: {
          overflow: "hidden",
        },
      });
      // #endif
    };
    const maxDialogStyle = computed(() => {
      var maxDialogStyle = "";
      if (props.maxDialog) {
        maxDialogStyle = `max-height:${maxDialogHeight.value};overflow-y: auto;`;
      }

      return maxDialogStyle;
    });
    const hideDialog = () => {
      isShowDialog.value = false;
      emit("openState", 0);
      // #ifdef MP-WEIXIN
      wx.setPageStyle({
        style: {
          overflow: "",
        },
      });
      // #endif
    };
    onMounted(() => {
      // #ifdef MP
      uni.getSystemInfo({
        success: (res) => {
          const menuButton = getMenuButtonBoundingClientRect();
          maxHeight.value =
            res.screenHeight - menuButton.top - menuButton.height - 6 + "px";
          maxDialogHeight.value =
            res.screenHeight -
            menuButton.bottom -
            (menuButton.top - res.statusBarHeight) -
            56 +
            "px";
        },
        fail(err) {
          console.log(err);
        },
      });
      // #endif
    });
    return {
      isShowDialog,
      showDialog,
      hideDialog,
      maxHeight,
      maxDialogHeight,
      maxDialogStyle,
    };
  },
});
</script>
<style lang="less" scoped>
@import (reference) url("~@/styles/mixin.less");
.bottomDialogBox {
  ::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    color: transparent;
  }
  .bottomDialogMask {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.5);
    &.disabled {
      pointer-events: none;
    }
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
      font-weight: 600;
      background: #fff;
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      position: relative;
      .theTitle {
        line-height: 56px;
        .textHidden();
        width:calc(~"100% - 72px");
        margin:0 auto;
      }
      .titleBorder {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 1px;
        background: #eee;
        transform: scaleY(0.5);
      }
      .iconfont {
        position: absolute !important;
        color: #000000;
        font-size: 20px;
        left: 18px;
        top: 18px;
        //border: 10px solid transparent;
        .expandClick();
        line-height: 1;
      }
    }
    .dialogBox {
      min-height: 30vh;
    }
    .dialogBox,
    .dialogWarp {
      background-color: #f8f8f8;
    }
    .dialogWarp {
      padding-bottom: constant(safe-area-inset-bottom);
      padding-bottom: env(safe-area-inset-bottom);
      &::after {
        content: "";
        height: 1px;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #f8f8f8;
        padding-bottom: constant(safe-area-inset-bottom);
        padding-bottom: env(safe-area-inset-bottom);
      }
    }
  }
}
</style>
