<script setup lang="ts">
import Layout from '../Layout.vue'
import BaseHeader from '../base/BaseHeader/index.vue'
import Footer from '../base/Footer/index.vue'
import GoodList from '../base/GoodList/index.vue'
import { increaseQuantity, decreaseQuantity } from '../../domain/goods/modal'
import { onMounted } from 'vue'
import useFetch from './useFetch'
import { useGoodsStore } from '../../store/useGoodsStore'
import bg from '../../img/borrow-bg.jpg'
import { useServiceStore } from '@/pagesG/store/useServiceStore'
import { useBaseStore } from '@/pagesG/store/useBaseStore'
import { ServiceTypeEnum } from '@/pagesG/domain/service/modal'
import CoustomHead from '@/components/coustomHead.vue'
import * as R from 'ramda'

const store = useGoodsStore()
const { loading, run } = useFetch()
const baseStore = useBaseStore()

onMounted(() => {
  baseStore.init()
  run()
})

const increase = (id: string) => {
  store.setGoods(increaseQuantity(store.goods, id))
}

const decrease = (id: string) => {
  store.setGoods(decreaseQuantity(store.goods, id))
}

const serviceStore = useServiceStore()
</script>

<template>
  <!-- #ifdef MP -->
  <CoustomHead position="fixed" color="#fff" />
  <!-- #endif -->
  <Layout :bg="bg">
    <template #header>
      <BaseHeader
        title="物品借用"
        :desc="
          serviceStore.inServiceTime
            ? R.defaultTo(
                '用品将在下单后30分钟内送达',
                serviceStore.service.serviceReminder
              )
            : ''
        "
        :time="serviceStore.inServiceTime ? '' : `${serviceStore.duration}`"
      />
    </template>
    <template #default>
      <div class="content">
        <div class="body">
          <GoodList
            class="good-list"
            v-if="!loading"
            :goods="store.goods"
            @increase="increase"
            @decrease="decrease"
          ></GoodList>
        </div>
        <Footer :service-type="ServiceTypeEnum.borrow" />
      </div>
    </template>
  </Layout>
</template>

<style lang="less" scoped>
.content {
  height: 100%;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    .good-list {
      height: 100%;
    }
  }
}

.footer {
  padding: 12px 16px;
  display: flex;
  align-items: center;

  .chosen {
    flex-basis: 80px;
    flex-shrink: 0;
    text-align: center;
    margin-right: 10px;
    font-size: 12px;
  }
  .chosen-label {
    margin-bottom: 8px;
  }

  .primary {
    flex: 1;
  }
}
</style>
