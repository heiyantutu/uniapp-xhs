<template>
  <view class="ui_coustomHead" v-bind:style="{ color:color,background:bgColor,position:position }">
    <div class="topBox" v-bind:style="{height:navHeight + 'px'}"></div>
    <div class="innerBox">
      <i class="icon iconfont icon-fanhuishouye" v-if="isFirstPage" @click="goIndex"></i>
      <i class="icon iconfont icon-a-20_fanhuianniu_bai" v-else @click="back"></i>
      <div class="title" v-if="title">{{title}}</div>
      <slot name="title"></slot>
    </div>
  </view>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
  name: "coustomHead",
  props: {
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
    color: {
      type: String,
      default: () => {
        return "";
      },
    },
    bgColor: {
      type: String,
      default: () => {
        return "";
      },
    },
    position:{
      type: String,
      default: () => {
        return "fixed";
      },
    }
  },
  setup() {
    let navHeight = ref(0);
    let isFirstPage = ref(false);
    const back = () => {
      uni.navigateBack({ 
        delta: 1,
      });
    };
    const goIndex = () => {
      uni.reLaunch({
        url: "/pages/travel/index",
      });
    };
    onMounted(() => {
      uni.getSystemInfo({
        success: (res) => {
          navHeight.value = res.statusBarHeight || 0;
        },
        fail(err) {
          console.log(err);
        },
      });
      var pages = getCurrentPages();
      if (pages.length == 1) {
        isFirstPage.value = true;
      }
    });
    return {
      navHeight,
      isFirstPage,
      back,
      goIndex,
    };
  },
});
</script>

<style scoped lang="less">
.ui_coustomHead {
  left: 0;
  width: 100vw;
  position: fixed;
  .innerBox {
    height: 40px;
    display: flex;
    position: relative;
    align-items: center;
    padding: 0 16px;

    .title {
      flex: 1;
      text-align: center;
    }
  }
}
</style>