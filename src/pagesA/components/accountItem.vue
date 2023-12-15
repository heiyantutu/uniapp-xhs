<template>
  <div class="ui_accountItem" @click="chooseItem(item)" :class="{isHistory:item.isHistory}">
    <img :src="item.logo" alt="" class="logo" mode="aspectFill" v-if="item.logo">
    <div class="innerBox">
      <p class="history" v-if="item.isHistory">已过期</p>
      <p class="title">{{item.title}}</p>
      <p class="time" v-if="item.isForever=='T'">永久有效</p>
      <p class="time" v-else>{{item.validTime}} 前可用</p>
      <p class="accountDesc">余额</p>
      <p class="price">¥{{item.price}}</p>
      <div class="infoBtn">详情</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  name: "accountItem",
  emits: ["chooseItem"],
  setup(props, { emit }) {
    const chooseItem = (item: Object) => {
      emit("chooseItem", item);
    };
    return {
      chooseItem,
    };
  },
});
</script>
<style lang="less" scoped>
.ui_accountItem {
  background: #ffffff;
  border-radius: 8px;
  margin-bottom: 12px;
  overflow: hidden;
  &.isHistory {
    .title,
    .price {
      color: #808080;
    }
  }
  .logo {
    height: 192px;
    width: 100%;
  }
  .innerBox {
    position: relative;
    padding: 16px 12px;
    .history {
      top: 12px;
      right: 12px;
      color: #a43127;
      position: absolute;
      font-size: 14px;
    }
  }
  .title {
    font-size: 16px;
    color: #000000;
    font-weight: bold;
    margin-bottom: 12px;
  }
  .time {
    font-size: 12px;
    color: #808080;
    margin-bottom: 22px;
  }
  .accountDesc {
    font-size: 12px;
    color: #808080;
    margin-bottom: 8px;
  }
  .price {
    font-size: 16px;
    color: #000000;
    font-weight: 600;
    font-family: Montserrat;
  }
  .infoBtn {
    position: absolute;
    bottom: 16px;
    right: 12px;
    padding: 8px 12px;
    border: 1px solid rgba(160, 160, 160, 1);
    border-radius: 4px;
    font-size: 14px;
    color: #000000;
  }
}
</style>