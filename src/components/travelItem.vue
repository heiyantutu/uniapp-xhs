<template>
  <div class="ui_travelItem">
    <div class="hotel" @click="chooseItem(travelItem)">
      <img :src="travelItem.urls[0].url + '?imageView2/1/w/686/h/516&x-oss-process=image/resize,m_fill,w_686,h_516'"
        v-if="travelItem.urls && travelItem.urls.length > 0" alt="" class="logo">
      <img class="logo" v-else-if="travelItem.logo" :src="travelItem.logo+'?imageView2/1/w/686/h/516&x-oss-process=image/resize,m_fill,w_686,h_516'">  
      <div class="hotelInfo">
        <p class="hotelName">{{ travelItem.title }}</p>
        <div class="infoLine">
          <div class="tag" v-for="(tag, tagIndex) in travelItem.tagApiDtos" :key="tagIndex">{{ tag.tageDesc }}</div>
        </div>
        <p class="price"><span class="money">¥{{ travelItem.startingPrice }}</span>/套起</p>
      </div>
      <div class="bookBtn" v-if="travelItem.showBookBtn">预订</div>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "travelItem",
  components: {},
  props: {
    travelItem: {
      type: Object,
      default: {},
    },
  },
  emits: ["chooseItem"],
  setup(props, context) {
    const chooseItem = (item: Object) => {
      context.emit("chooseItem", item);
    };
    return {
      chooseItem,
    };
  },
});
</script>
<style lang="less" scoped>
@import (reference) url("~@/styles/mixin.less");

.ui_travelItem {
  .hotel {
    background: #ffffff;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;
    position: relative;
    .bookBtn {
      position: absolute;
      bottom: 16px;
      right: 12px;
      .baseBtn();
      text-align: center;
      padding: 10px 16px;
      font-size: 14px;
    }
    .logo {
      width: 100%;
      height: 258px;
      display: block;
      object-fit: cover;
    }

    .hotelInfo {
      padding: 10px 12px;

      .hotelName {
        font-size: 16px;
        color: #000000;
        font-weight: bold;
        margin-bottom: 9px;
      }

      .subTitle {
        font-size: 12px;
        color: #808080;
        margin-bottom: 9px;
      }

      .line {
        display: flex;
        margin-bottom: 9px;
      }

      .infoLine {
        display: flex;
        margin-bottom: 9px;
        align-items: center;
        flex-wrap: wrap;
        .infoDesc {
          font-size: 14px;
          color: #808080;
        }

        .tag {
          margin-top: 8px;
          white-space: nowrap;
          margin-right: 4px;
        }
      }

      .tag {
        background: rgba(164, 49, 39, 0.12);
        font-size: 12px;
        color: #a43127;
        padding: 2px;
        margin-right: 3px;
        border-radius: 4px;
      }

      .price {
        font-size: 12px;
        color: #808080;

        .money {
          font-size: 18px;
          color: #000000;
          font-weight: bold;
        }
      }
    }
  }
}
</style>