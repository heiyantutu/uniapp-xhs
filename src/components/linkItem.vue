<template>
  <div class="linkItem" @click="chooseLink(linkItem)">
    <p class="title">{{linkItem.name}}</p>
    <i class="icon iconfont icon-a-16_youlajiantou_hei"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "linkItem",
  props: {
    linkItem: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ["chooseLink"],
  setup(props, { emit }) {
    const chooseLink = (item: Object) => {
      emit("chooseLink", item);
    };
    return {
      chooseLink,
    };
  },
});
</script>

<style scoped lang="less">
.linkItem {
  height: 48px;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 12px;
  justify-content: space-between;
  &.arrow {
    &:after {
      left: calc(~"100% - 12px");
    }
  }
  .title {
    font-size: 14px;
    color: #000000;
  }
}
</style>
