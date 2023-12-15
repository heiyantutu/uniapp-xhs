<script setup lang="ts">
import {
  type Good,
  getCategories,
  getFstIndexOfCategory,
} from '../../../domain/goods/modal'
import { computed, ref } from 'vue'
import GoodItem from './GoodItem.vue'
import { throttle } from 'throttle-debounce'
interface Props {
  goods: Good[]
}
const goodItemHeight = 112
const scrollTop = ref(0)
const oldScrollTop = ref(0)
const props = defineProps<Props>()
const searchTxt = ref('')
const displayGoods = computed(() =>
  props.goods.filter((good) => good.name.includes(searchTxt.value))
)
const cates = computed(() => getCategories(displayGoods.value))

const topIndex = ref(0)
const topItem = computed(() => {
  if (topIndex.value > displayGoods.value.length) return displayGoods.value[0]
  return displayGoods.value[topIndex.value]
})

const handleScroll = throttle(100, (e: any) => {
  if (cates.value.length === 0) return
  const scrollTop = e.detail.scrollTop
  topIndex.value = Math.floor(scrollTop / goodItemHeight)
  oldScrollTop.value = scrollTop
})

const onCategoryClick = (cate: string) => {
  const index = getFstIndexOfCategory(displayGoods.value, cate)
  scrollTop.value = oldScrollTop.value
  setTimeout(() => {
    scrollTop.value = index * goodItemHeight
  }, 0)
}

const emit = defineEmits<{
  (e: 'increase', id: string): void
  (e: 'decrease', id: string): void
}>()

const increase = (id: string) => {
  emit('increase', id)
}
const decrease = (id: string) => {
  emit('decrease', id)
}
</script>

<template>
  <div class="wrapper">
    <div class="search-field">
      <i class="iconfont icon-a-16_sousuo_hui" />
      <input type="text" v-model="searchTxt" class="input" placeholder="搜索" />
      <i
        v-if="searchTxt"
        @click="() => (searchTxt = '')"
        class="iconfont icon-a-20_guanbi"
      />
    </div>
    <div v-if="displayGoods.length === 0" class="empty">
      <img class="empty-img" src="../../../img/search-empty.svg" alt="" />
      <p class="empty-txt">没有符合条件的物品</p>
    </div>
    <div class="good-list">
      <div class="categories" v-if="cates.length > 0">
        <div
          v-for="cate in cates"
          :key="cate"
          :class="{
            category: true,
            active: topItem.category === cate,
          }"
          @click="onCategoryClick(cate)"
        >
          {{ cate }}
        </div>
      </div>
      <scroll-view
        class="items"
        @scroll="handleScroll"
        ref="goodsWrapper"
        scroll-y
        :scroll-top="scrollTop"
        scroll-with-animation
      >
        <div v-for="good in displayGoods" :key="good.id">
          <GoodItem
            :good="good"
            :search-txt="searchTxt"
            @increase="() => increase(good.id)"
            @decrease="() => decrease(good.id)"
          ></GoodItem>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<style scoped lang="less">
.wrapper {
  background: #fff;
  height: 100%;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.good-list {
  flex: 1;
  display: flex;
  height: 100%;
  overflow: hidden;
}
.categories {
  flex-basis: 73px;
  flex-shrink: 0;
  overflow: auto;
  background: #eee;
}

.category {
  line-height: 60px;
  text-align: center;
  font-size: 12px;
  color: #808080;
}
.active {
  background: #fff;
  color: #000;
  font-weight: bold;
}
.items {
  flex: 1;
  overflow: auto;
}
.search-field {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin: 16px 16px 8px 16px;
  border-radius: 16px;
  background: #f8f8f8;
  .input {
    flex: 1;
    margin-left: 8px;
    font-size: 14px;
    line-height: 16px;
    height: 16px;
    min-height: 16px;
    background: transparent;
    :deep(.uni-input-input) {
      line-height: 16px;
      height: 16px;
    }
    :deep(.uni-input-placeholder) {
      color: #ccc;
    }
  }
}
.icon-sousuo1 {
  color: #ccc;
}
.icon-a-20_guanbi {
  background: #333;
  padding: 2px;
  font-size: 12px;
  border-radius: 50%;
  &::before {
    color: #fff;
  }
}
.empty {
  text-align: center;
  margin-top: 100px;
}

.empty-img {
  width: 120px;
  height: 120px;
  margin-bottom: 40px;
}

.empty-txt {
  font-size: 18px;
  font-weight: bold;
}
.iconfont {
  color: #808080;
}
</style>
