<script setup lang="ts">
import Tabs from '@/components/tabs.vue'
import { useOrderListStore } from './useOrderListStore'
import ScrollList from './components/ScrollList.vue'
import { onMounted } from 'vue'
import useLayoutStart from '@/hooks/useLayoutStart'
import CoustomHead from '@/components/coustomHead.vue'

const tabs = [
  { id: 'all', name: '全部' },
  { id: 'serve', name: '待服务' },
]
const orderListStore = useOrderListStore()
const onClickTab = (tab: any) => {
  orderListStore.setActiveTab(tab.id)
}
const onSwiperChange = (e: any) => {
  const index = e.detail.current
  orderListStore.setActiveTab(tabs[index].id)
}

onMounted(() => {
  orderListStore.refresh()
})
const { layoutStart } = useLayoutStart()
</script>

<template>
  <!-- #ifdef MP -->
  <CoustomHead title="工单" position="fixed" />
  <!-- #endif -->
  <div class="page" :style="{ paddingTop: layoutStart }">
    <Tabs
      :datas="tabs"
      fullWidth
      :activeType="orderListStore.activeTab"
      type="line"
      color="#A43127"
      titleInactiveColor="#808080"
      @clickTab="onClickTab"
    />
    <swiper
      class="swiper"
      :current="orderListStore.index"
      @change="onSwiperChange"
    >
      <swiper-item>
        <ScrollList type="all" />
      </swiper-item>
      <swiper-item>
        <ScrollList type="serve" />
      </swiper-item>
    </swiper>
  </div>
</template>

<style lang="less" scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;
  .swiper {
    flex: 1;
    overflow: hidden;
  }
}
</style>
