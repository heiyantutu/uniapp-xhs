<template>
  <div class="ui_searchInput">
    <i class="icon iconfont icon-a-16_sousuo_hui" :style="searchIconStyle" :class="{'active':isFocus}"></i>
    <input :placeholder=placeholder @input=handelInput :placeholder-style="searchIconStyle" :value="modelValue" confirm-type="done" @confirm=confirmInput @click="clickInput" placeholder-style="color:#ccc;" :focus="isFocus" @blur="setFocus(false)" @focus="setFocus(true)"/>
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
    searchIconStyle:{
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
    let isFocus = ref(false);
    function handelInput(e) {
      context.emit("update:modelValue", e.detail.value);
      context.emit("input");
    }
    function clearInput() {
      context.emit("update:modelValue", "");
      context.emit("clear");
    }
    function confirmInput(e) {
      context.emit("submit", e.detail.value);
    }
    function clickInput(e) {
      context.emit("click", e);
    }
    function setFocus(sta){
      isFocus.value = sta;
    }
    return {
      handelInput,
      clearInput,
      confirmInput,
      clickInput,
      isFocus,
      setFocus,
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
    margin-right: 8px;
    color:#CCC;
    &.active{
      color:#000;
    }
  }
  input {
    flex: 1;
    font-size: 14px;
    color:#000;
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
