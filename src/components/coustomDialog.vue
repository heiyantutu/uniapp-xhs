<template>
  <div class='ui_dialog'>
    <div class="box" :style="dialogConfig.style">
      <div class="topBox">
        <div class="tl">{{dialogConfig.title}}</div>
        <div class="txt">
          <mp-html :content="dialogConfig.content" v-if="dialogConfig.content"></mp-html>
          <slot name="content"></slot>
        </div>
      </div>
      <div class="btns" v-if="dialogConfig.btn1&&dialogConfig.btn2" >
        <div class="btn" @click="closeDialog">
          {{dialogConfig.btn1}}
        </div>
        <div class="btn" @click="sureDialog">
          {{dialogConfig.btn2}}
        </div>
      </div>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dialogConfig: {
      type: Object,
      default() {
        return {
          title: "",
          content: "",
          btn1: "",
          style: "",
        };
      },
    },
  },
  methods: {
    closeDialog() {
      this.$emit("close");
    },
    sureDialog() {
      this.$emit("sure");
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");

.ui_dialog {
  background: rgba(0, 0, 0, 0.3);
  position: fixed;
  z-index: 11;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  .box {
    position: absolute;
    width: 327px;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    background: #fff;
    border-radius: 6px;
    overflow: hidden;
    .topBox {
      padding: 16px;
    }
    .tl {
      font-size: 16px;
      font-weight: bold;
      color: #000;
      text-align: center;
      width: 100%;
      margin-bottom: 12px;
      margin-top: 12px;
    }
    .txt {
      color: #808080;
      font-size: 14px;
      line-height: 22px;
      text-align: center;
      .underline {
        text-decoration: underline;
      }
    }
    .btns {
      display: flex;
      justify-content: center;
      height: 64px;
      border: 1px solid #eeeeee;
      .btn {
        flex: 1;
        line-height: 64px;
        text-align: center;
        border-right: 1px solid #eee;
        font-size: 16px;
        &:nth-child(2) {
          border-right: none;
        }
      }
    }
  }
}
</style>
