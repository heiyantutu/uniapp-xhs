<template>
  <div class="bottomNav" v-if="navList.length>0">
    <div class="nav-box">
      <div class="nav-item" :class="{active:item.curPage}" @click='goPage(item)' v-for="(item,i) in navList" :key="i">
        <img :src="item.logoA" v-if="!item.curPage" mode="aspectFit" :class="{'large':item.isLarge=='T'}" class="logo">
        <img :src="item.logoB" v-if="item.curPage" mode="aspectFit" :class="{'large':item.isLarge=='T'}" class="logo">
        <p :class="{'largeTxt':item.isLarge=='T'}" class="desc">{{item.desc}}</p>
      </div>
      <div class="bgWrapper">
        <div class="bgBox" v-for="(item, i) in navList" :key="i">
          <div class="bg" v-show="item.isLarge=='T'"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/utils/api";
import { setStorage, getStorage, removeStorage } from "@/utils/wxuser";

var config = {}; 
export default {
  data() {
    return {
      navList: {},
      curPage: false,
    };
  },
  props: {
    icon: {
      type: String,
    },
  },

  methods: {
    goPage(item) {
      if (item.curPage) {
        return;
      }
      if (item.isH5) {
        uni.navigateTo({
          url: "/pages/mall/webview?url=" + encodeURIComponent(item.url),
        });
      } else {
        if (item.query) {
          setStorage("query", item.query);
        } else {
          removeStorage("query");
        }
        uni.switchTab({
          url: item.path,
          fail: (res) => {
            uni.navigateTo({
              url: item.path,
            });
          },
        });
      }
    },
    getNav() {
      var pages = getCurrentPages();
      // var curPage = "/" + pages[pages.length - 1].route; // 当前页面路径
      var curPage = pages[pages.length - 1].$page.fullPath;
      api
        .getShopButtonConfig({
          hotelGroupCode: config.hotelGroupCode,
          appid: config.appid,
          businessType: "2",
        })
        .then((res) => {
          if (res.result == 1) {
            if (res.retVal.length > 0) {
              this.navList = JSON.parse(res.retVal[0].info);

              this.navList.forEach((item) => {
                if (item.url.indexOf("https") != -1) {
                  item.isH5 = true;
                }
                item.query = item.url.split("?")[1];
                item.path = item.url.split("?")[0];
                if (curPage == item.url) {
                  item.curPage = true;
                  this.curPage = true;
                }
              });
              setStorage("navList", this.navList);
            }
          }
        });
    },
  },
  mounted() {
    if (getStorage("navList")) {
      this.navList = getStorage("navList");
      var pages = getCurrentPages();
      // var curPage = "/" + pages[pages.length - 1].route; // 当前页面路径
      var curPage = pages[pages.length - 1].$page.fullPath;
      this.navList.forEach((item) => {
        item.curPage = false;
      });
      this.navList.forEach((item) => {
        if (item.url.indexOf("https") != -1) {
          item.isH5 = true;
        }
        item.query = item.url.split("?")[1];
        item.path = item.url.split("?")[0];

        if (curPage == item.url) {
          item.curPage = true;
          this.curPage = true;
        }
      });
    } else {
      this.getNav();
    }
  },
  created() {
    config = getStorage("config");
  },
};
</script>

<style lang="less" scoped>
@import url("~@/styles/mixin.less");

.bottomNav {
  position: fixed;
  z-index: 100;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: inset 0px 1px 0px 0px rgba(235, 235, 235, 1);
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  .nav-box {
    width: 100%;
    background: #fff;
    display: flex;
    box-sizing: border-box;
    height: 100rpx;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    align-items: center;
    flex: 1;
    font-size: 11px;
    color: #808080;
    font-family: PingFangSC-Medium;
    font-weight: 500;

    .iconfont {
      color: #808080;
      font-size: 24px;
    }

    .desc {
      font-family: PingFangSC-Medium;
      margin-top: 6rpx;
      font-weight: 600;
      font-size: 10px;
    }

    .logo {
      height: 48rpx;
      width: 48rpx;

      &.large {
        width: 88rpx;
        height: 88rpx;
        position: relative;
        top: -30rpx;
      }
    }
    .largeTxt {
      position: relative;
    }
    .icon-active {
      display: none;
    }

    &.active {
      color: #000;

      .iconfont {
        color: #000;
      }

      .icon-noActive {
        display: none;
      }

      .icon-active {
        display: block;
      }
    }
  }

  .bgWrapper {
    height: 100%;
    display: flex;
    left: 0;
    bottom: 0;
    height: 100%;
    z-index: -1;
    position: absolute;
    width: 100%;

    .bgBox {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      color: #999999;
      flex-direction: column;
      position: relative;

      .bg {
        background: #fff;
        position: absolute;
        left: 50%;
        -webkit-transform: translateX(-50%);
        transform: translateX(-50%);
        z-index: -1;
        height: 132rpx;
        width: 132rpx;
        border-radius: 50%;
        box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.4);
        top: -50rpx;
      }
    }
  }
}
</style>
