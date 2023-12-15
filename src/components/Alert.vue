<template>
  <div class="ui_alert" v-if="tips" :class="type">
    <i class="iconfont icon icon-a-16_jinggao_hong"></i>
    <p class="tips">{{tips}}</p>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Alert",
  props: {
    type: {
      type: String,
      default: () => {
        return "error";
      },
    },
    tips: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup(props, context) {
    return {};
  },
});
</script>
<style lang="less" scoped>
.ui_alert {
  min-height: 40px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 14px;
  &.error {
    background: #f4e6e5;
    color: #a43127;
  }
  &.warning {
    background: #fbf1e0;
    color: #db8900;
  }
  .iconfont {
    margin-right: 8px;
  }
}
</style>