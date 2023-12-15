<script setup lang="ts">
import { renderPrice } from "@/pagesG/domain/goods/modal";
import noImg from "@/pagesG/img/no-img.jpg";

const props = defineProps<{
  img: string,
  name: string,
  amount: number,
  price: number
}>()
</script>

<template>
  <div class="good-item">
    <div class="image">
      <img class="img" :src="props.img || noImg" alt="">
    </div>
    <div class="info">
      <div class="top">
        <div class="name">{{ props.name }}</div>
        <div class="amount">x{{ props.amount }}</div>
      </div>
      <div class="price">{{ renderPrice(props.price) }}</div>
    </div>
  </div>
</template>

<style scoped lang="less">
.good-item {
  display: flex;
  margin-bottom: 16px;
}
.image {
  flex-shrink: 0;
}
.info {
  flex: 1;
}
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}

.img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background: #eee;
  margin-right: 12px;
}

.name, .amount {
  font-size: 14px;
  line-height: 22px;
}
.name {
  font-weight: bold;
}
.price {
  font-size: 14px;
  line-height: 18px;
  color: #808080;
}
</style>