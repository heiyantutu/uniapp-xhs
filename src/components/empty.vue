<template>
  <div class="ui_empty" :class="mode">
    <div class="tipsBox">
      <div v-if="mode=='image'">
        <image :src="emptyUrl" mode="" class="empty" />
        <p class="tips">{{tips}}</p>
        <p class="subTips">{{subTips}}</p>
      </div>
      <div v-if="mode=='text'" class="textBox">
        <p class="theTips">{{tips}}</p>
      </div>
    </div>
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
    mode: {
      type: String,
      default: "image",
    },
  },
  setup(props, context) {
    return {};
  },
});
</script>
<style lang="less" scoped>
.ui_empty {
  .tipsBox {
    text-align: center;
    padding-top: 30px;
  }
  .empty {
    width: 120px;
    height: 120px;
  }
  .tips {
    color: #000;
    font-size: 18px;
    font-weight: 500;
    margin-top: 40px;
    margin-bottom: 12px;
  }
  .subTips {
    color: #808080;
    font-size: 14px;
    line-height: 14px;
  }
  .theTips {
    color: #ccc;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
  }
  .textBox {
    padding-top: 2px;
    height:274px;
  }
}
</style>