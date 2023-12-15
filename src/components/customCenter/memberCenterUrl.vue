<template>
  <div class="tapList">
    <p class="tapListTitle" v-if="datas.title" v-bind:class="{'arrow':datas.titleUrl}" @click.stop="goTitle">
      {{datas.title}}
    </p>
    <div :class="datas.sortType" class="list">
      <button v-bind:class="{ 'arrow' : datas.sortType!=='rows','rows':datas.sortType=='rows'}"
        v-for="(urlItem, urlIndex) in urls" :key="urlIndex" @click.stop="goUrlAction(urlItem)" class="listItem"
        :open-type="urlItem.desc== kfName?'contact':''">
        <img :src="urlItem.logo" alt="" class="logo" v-if="urlItem.logo" />
        <p class="itemDesc">{{ urlItem.desc }}</p>
        <div class="moreDesc" v-if="datas.sortType !=='rows'">
          <img :src="urlItem.descLogo" alt="" class="logo" v-if="urlItem.descLogo" />
          <span class="moreText" v-if="urlItem.moreDesc">{{urlItem.moreDesc}}</span>
        </div>
      </button>
    </div>
  </div>
</template>
<script>
import { goPage, goPageWithUser } from "@/utils/utils";
import { jAlert3 } from "@/base/jAlert/jAlert";
export default {
  data() {
    return {
      kfName: "在线客服",
    };
  },
  props: ["datas"],
  components: {},
  methods: {
    goTitle() {
      if (this.datas && this.datas.titleUrl) {
        goPage(this.datas.titleUrl);
      }
    },
    goUrlAction(item) {
      if (item.desc !== this.kfName) {
        if (!item.url) {
          jAlert3("敬请期待");
          return false;
        }
        goPageWithUser(item.url);
      }
    },
  },

  created() {},
  mounted() {},
  beforeDestroy() {},
  computed: {
    urls() {
      let urls = [];
      if (this.datas.items && this.datas.items.length > 0) {
        urls = [...this.datas.items];
      }
      return urls;
    },
  },
  watch: {},
};
</script>
<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import (reference) url("~@/styles/mixin.less");
.tapList {
  width: 100%;
  height: auto;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 10px;
  margin: 0 auto;
  box-shadow: 0px 2px 10px -3px rgba(0, 0, 0, 0.11);
  border-radius: 12px;
  margin-bottom: 15px;
  background: #ffffff;
  .tapListTitle {
    height: 36px;
    position: relative;
    font-size: 16px;
    color: #333333;
    font-weight: bold;
    padding: 0 10px;
    line-height: 36px;
    &.arrow::after {
      left: calc(~"100% - 15px");
    }
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    &.rows {
      padding: 10px 0;
    }
    &.cols {
      .logo {
        margin-right: 0;
      }
      .itemDesc {
        margin-left: 20px;
      }
      .moreDesc {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: flex-end;
        margin-right: 35px;
        .moreText {
          font-size: 14px;
          color: #808080;
          margin-left: 10px;
        }
      }
    }
    .logo {
      height: 20px;
      width: 20px;
      margin: 0 20px;
    }
    .buttonWrapper {
      width: 100%;
      height: 50px;
      position: relative;
      &.arrow::after {
        left: 98% !important;
      }
    }
    button {
      padding: 0;
      border-radius: 0px;
      position: relative;
      box-shadow: none;
      border: none !important;
      &::after {
        border: none;
      }
    }
    .listItem,
    button {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      position: relative;
      background-color: transparent;
      &::after {
        border: none;
        border-radius: 0px;
      }
      &.rows {
        width: 25%;
        flex-direction: column;
        height: 64px;
        align-items: center;
        justify-content: center;
        .logo {
          width: 26px;
          height: 26px;
          //margin-bottom: 8px;
        }
        .itemDesc {
          font-size: 14px;
          color: #000000;
        }
      }
      &.arrow::after {
        left: calc(~"100% - 15px");
        border-right: 1px solid #000000;
        border-top: 1px solid #000000;
      }
      i {
        font-size: 24px;
        width: 65px;
        text-align: center;
        &.icon-lipin {
          font-size: 28px;
        }
      }
      .itemDesc {
        font-size: 14px;
        color: #000000;
      }
    }
  }
}
</style>