<template>
  <view class="ui_switchBar" :style="`padding: 0px ${padding}px`">
    <view class="switchItem" v-for="(switchItem,switchItemIndex) in switchList" :key="switchItemIndex"
      :class="{ active:switchItem.active,more:switchList.length>5 }" @click="changeIndex(switchItemIndex)"
      :style="{ color:color }">
      <div class="switchItemName">{{switchItem.name}}</div>
    </view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "switchBar",
  props: {
    switchList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    color: {
      type: String,
      default: () => {
        return "";
      },
    },
    padding: {
      type: Number,
      default: () => {
        return 0;
      },
    },
  },
  emits: ["changeIndex"],
  setup(props, { emit }) {
    const changeIndex = (index: number) => {
      emit("changeIndex", index);
    };
    return {
      changeIndex,
    };
  },
});
</script>

<style scoped lang="less">
@import url("~@/styles/skin.less");
.ui_switchBar {
  height: 44px;
  display: flex;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  .switchItem {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    opacity: 0.6;
    flex: 1 0 auto;
    white-space: nowrap;
    min-width: calc(100% / 4);
    &.more {
      min-width: initial;
      margin-right: 16px;
    }
    .switchItemName {
      height: 44px;
      line-height: 44px;
    }
    &.active {
      opacity: 1;
      .switchItemName {
        position: relative;
        &::after {
          content: "";
          width: 32px;
          height: 2px;
          border: 2px;
          background: @active-color;
          position: absolute;
          left: calc(~"(100% - 32px) / 2");
          bottom: 0;
        }
      }
    }
  }
}
</style>
