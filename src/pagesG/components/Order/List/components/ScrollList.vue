<script setup lang="ts">
import { computed, ref } from 'vue'
import { useOrderListStore } from '../useOrderListStore'
import Card from './Card.vue'

const props = defineProps<{
  type: 'all' | 'serve'
}>()
const orderListStore = useOrderListStore()

const list = computed(() => {
  if (props.type === 'serve') {
    return orderListStore.waitOrders.list
  }
  return orderListStore.allOrders.list
})

const pageIndex = ref(1)
const refreshing = ref(false)
const refresh = async () => {
  refreshing.value = true
  pageIndex.value = 1
  await orderListStore.fetchOrders({
    pageNo: 1,
    orderSta: props.type === 'all' ? '' : 'R',
  })
  refreshing.value = false
}
const loadMore = () => {
  if (props.type === 'all') {
    const hasMore =
      orderListStore.allOrders.list.length < orderListStore.allOrders.total
    if (!hasMore) return
  } else {
    const hasMore =
      orderListStore.waitOrders.list.length < orderListStore.waitOrders.total
    if (!hasMore) return
  }
  pageIndex.value = pageIndex.value + 1
  return orderListStore.fetchOrders({
    pageNo: pageIndex.value,
    orderSta: props.type === 'all' ? '' : 'R',
  })
}
</script>

<template>
  <scroll-view
    scrollY
    class="scroll-view"
    @scrolltolower="loadMore"
    refresher-enabled
    :refresher-triggered="refreshing"
    @refresherrefresh="refresh"
  >
    <div class="list">
      <Card v-for="item in list" :key="item.id" v-bind="item" />
    </div>
    <div
      v-if="list.length === 0 && !orderListStore.fetchOrdersLoading"
      class="empty"
    >
      暂无数据
    </div>
  </scroll-view>
</template>

<style lang="less" scoped>
.scroll-view {
  height: 100%;
  background: #f8f8f8;
  overflow: hidden;
}
.list {
  padding: 16px;
}
.empty {
  text-align: center;
  color: #999;
  margin-top: 30vh;
}
</style>
