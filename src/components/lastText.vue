<template>
  <div class="ui_lastText">
    <div class="line"></div>
    <p class="tips">{{tips}}</p>
    <div class="line"></div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "lastText",
  components: {},
  props: {
    tips: {
      type: String,
      default: "暂无数据",
    },
  },
  setup(props, context) {
    return {};
  },
});
</script>
<style lang="less" scoped>
.ui_lastText {
  text-align: center;
  color: #ccc;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  .line {
    height:0.5px;
    width:40px;
    background: #ccc;
  }
  .tips{
    margin:0 8px;
  }
}
</style>