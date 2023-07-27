<template>
  <div class="ui_empty">
    <image :src="emptyUrl" mode="" class="empty" />
    <p class="tips">{{tips}}</p>
    <p class="subTips">{{subTips}}</p>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "empty",
  components: {},
  props: {
    emptyUrl: {
      type: String,
      default:
        "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/empty.png",
    },
    tips: {
      type: String,
      default: "暂无数据",
    },
    subTips: {
      type: String,
      default: "",
    },
  },
  setup(props, context) {
    return {};
  },
});
</script>
<style lang="less" scoped>
.ui_empty {
  text-align: center;
  margin-top: 40px;
  .empty {
    width: 120px;
    height: 120px;
  }
  .tips {
    color: #000;
    font-size: 18px;
    font-weight: bold;
    margin-top: 40px;
    margin-bottom: 12px;
  }
  .subTips {
    color: #808080;
    font-size: 14px;
    line-height: 14px;
  }
}
</style>