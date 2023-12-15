<template>
  <view class="ui_coustomHead"
    v-bind:style="{ color:computedColor,background:computedBgColor,position:computedPosition,'backdrop-filter':backFilter }" :class="[customClass]">
    <div class="topBox" v-bind:style="{height:navHeight + 'px'}"></div>
    <div class="innerBox">
      <i class="icon iconfont icon-fanhuishouye" v-if="isFirstPage" @click="goIndex"></i>
      <i class="icon iconfont icon-a-20_fanhuianniu" v-else @click="back"></i>
      <div class="title" v-if="title">{{title}}</div>
      <slot name="title"></slot>
    </div>
  </view>
  <div v-if="nativeMode" :style="{height:navigationBarHeight+'px'}"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, watch } from "vue";
import useScroll from "@/hooks/useScroll";
const { scrollTop, onPageScroll } = useScroll();

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
    backFilter: {
      //毛玻璃效果
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
    position: {
      type: String,
      default: () => {
        return "fixed";
      },
    },
    nativeMode: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    coustomPage: {
      type: String,
      default: () => {
        return "";
      },
    },
    customClass:{
      type: String,
      default: () => {
        return "";
      },
    }
  },
  setup(props) {
    let navHeight = ref(0);
    let isFirstPage = ref(false);
    let navigationBarHeight = ref(44);
    let computedPosition = computed(() => {
      if (props.nativeMode) {
        return "fixed";
      } else {
        return props.position;
      }
    });
    let computedColor = computed(() => {
      if (props.nativeMode) {
        return props.color || "#000";
      } else {
        return props.color;
      }
    });
    let computedBgColor = computed(() => {
      if (props.nativeMode) {
        return props.bgColor || "#FFF";
      } else {
        return props.bgColor;
      }
    });
    const back = () => {
      if (props.coustomPage) {
        uni.redirectTo({
          url: props.coustomPage,
        });
      } else {
        uni.navigateBack({
          delta: 1,
        });
      }
    };
    const goIndex = () => {
      uni.reLaunch({
        url: "/pages/travel/index",
      });
    };
    watch(computedColor, () => {
      fontColorChange();
    });
    const fontColorChange = () => {
      if (computedColor.value == "#000" || computedColor.value == "#000000") {
        uni.setNavigationBarColor({
          frontColor: "#000000",
          backgroundColor: "#ffffff",
        });
      } else {
        if (
          !props.title ||
          computedColor.value == "#fff" ||
          computedColor.value == "#ffffff"
        ) {
          uni.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: "#000000",
          });
        } else {
          uni.setNavigationBarColor({
            frontColor: "#000000",
            backgroundColor: "#ffffff",
          });
        }
      }
    };
    onPageScroll((e) => {
      scrollTop.value = e.scrollTop;
    });
    onMounted(() => {
      uni.getSystemInfo({
        success: (res) => {
          navHeight.value = res.statusBarHeight || 0;
          navigationBarHeight.value =
            (res.statusBarHeight || 0) + navigationBarHeight.value;
        },
        fail(err) {
          console.log(err);
        },
      });
      var pages = getCurrentPages();
      if (pages.length == 1) {
        isFirstPage.value = true;
      }
      fontColorChange();
    });
    return {
      navHeight,
      isFirstPage,
      back,
      goIndex,
      computedPosition,
      computedColor,
      computedBgColor,
      navigationBarHeight,
      scrollTop,
    };
  },
});
</script>

<style scoped lang="less">
.ui_coustomHead {
  left: 0;
  width: 100vw;
  position: fixed;
  z-index: 10;
  transition: all 0.2s;
  &.customPattern{
    background-color: #000;
		background-image: url(https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/btnBlack.png);
		background-repeat: repeat;
		background-size: 40px 37.5px;
  }
  .innerBox {
    height: 44px;
    display: flex;
    position: relative;
    align-items: center;
    padding: 0 16px;

    .title {
      flex: 1;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
    }
  }
  .iconfont {
    font-size: 20px;
    font-weight: 500;
    position: absolute;
    top: 12px;
    z-index: 2;
  }
}
</style>