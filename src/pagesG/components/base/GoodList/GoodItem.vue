<script setup lang="ts">
import { allowIncrease } from "../../../domain/goods/modal";
import noImg from "../../../img/no-img.jpg";
import { renderPrice } from "@/pagesG/domain/goods/modal";

interface Good {
  id: string;
  name: string;
  picture: string;
  price: number;
  stock?: number;
  category: string;
  quantity: number;
  max?: number;
}
const props = defineProps<{
  searchTxt: string;
  good: Good;
}>();
const emit = defineEmits<{
  (e: "increase"): void;
  (e: "decrease"): void;
}>();

const decrease = () => {
  emit("decrease");
};

const increase = () => {
  emit("increase");
};

const previewImage = (url?: string) => {
  if (!url) return;
  uni.previewImage({ urls: [url] });
};
</script>

<template>
  <div class="good">
    <img
      class="image"
      :src="props.good.picture || noImg"
      alt=""
      @click="() => previewImage(props.good.picture)"
    />
    <div class="info">
      <p
        class="title"
        v-html="
          props.good.name
            .split(props.searchTxt)
            .join(`<span style='color:red'>${props.searchTxt}</span>`)
        "
      ></p>
      <div class="bottom">
        <span>
          <span v-if="typeof props.good.price === 'number'">{{
            renderPrice(props.good.price)
          }}</span>
          <span
            v-if="props.good.stock !== Infinity"
            :class="{ stock: true, zero: props.good.stock === 0 }"
          >
            余{{ props.good.stock }}
          </span>
        </span>

        <div :class="{ counter: true, empty: props.good.quantity === 0 }">
          <template v-if="props.good.quantity > 0">
            <img
              class="icon"
              @click="decrease"
              src="../../../img/subtract.svg"
              alt=""
            />
            <!-- <img class="icon" src="../../../subtract-disabled.svg" alt="" /> -->
            <span class="quantity">{{ props.good.quantity }}</span>
          </template>
          <img
            class="icon"
            v-if="allowIncrease(props.good)"
            @click="increase"
            src="../../../img/add-solid.svg"
            alt=""
          />
          <img
            class="icon"
            v-if="!allowIncrease(props.good)"
            src="../../../img/add-outline.svg"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.good {
  display: flex;
  padding: 16px;
}

.image {
  width: 80px;
  height: 80px;
  margin-right: 16px;
  border-radius: 8px;
  background: #eee;
}
.title {
  margin-top: 10px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
}
.bottom {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}
.info {
  flex: 1;
}
.counter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: right;
  width: 70px;
}
.empty {
  width: min-content;
}
.icon {
  width: 20px;
  height: 20px;
}
.stock {
  font-size: 12px;
  line-height: 12px;
  margin-left: 8px;
  color: #808080;
  &.zero {
    color: #a43127;
  }
}
</style>
