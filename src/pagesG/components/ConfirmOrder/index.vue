<script setup lang="ts">
import {onUnmounted} from 'vue'
import SafeBottom from '../base/SafeBottom/index.vue'
import BottomButton from '@/components/bottomBtn.vue'
import GoodItem from '../Order/Detail/components/GoodItem.vue'
import KeyValue from '../Order/Detail/components/KeyValue.vue'
import { useGoodsStore } from '@/pagesG/store/useGoodsStore'
import {
  getTotalPrice,
  getSelection,
  renderPrice,
} from '@/pagesG/domain/goods/modal'
import { computed, ref } from 'vue'
import useCreateOrder from '../Borrowing/useCreateOrder'
import { useBaseStore } from '@/pagesG/store/useBaseStore'
import CoustomHead from '@/components/coustomHead.vue'
import useLayoutStart from '@/hooks/useLayoutStart'
// import { getQuery } from '@/utils/utils'
// import { ServiceTypeEnum } from '@/pagesG/domain/service/modal'

const props = defineProps<{
  payOnline?: boolean
}>()

// const query = getQuery()
// const serviceType = query.serviceType as ServiceTypeEnum

const goodsStore = useGoodsStore()
const baseStore = useBaseStore()
const totalPrice = computed(() => getTotalPrice(goodsStore.goods))
const selectedGoods = computed(() => getSelection(goodsStore.goods))

const mark = ref('')

const { run: runCreateOrder, loading } = useCreateOrder({ replace: true })

const submit = () => {
  runCreateOrder({ orderRemark: mark.value })
}
const { layoutStart } = useLayoutStart()

onUnmounted(() => {
  goodsStore.setGoods([])
})
</script>

<template>
  <!-- #ifndef H5 -->
  <CoustomHead title="确认订单" position="fixed" />
  <!-- #endif -->
  <div class="page" :style="{ paddingTop: layoutStart }">
    <div class="content">
      <div class="row">
        <GoodItem
          v-for="good in selectedGoods"
          :key="good.id"
          :img="good.picture"
          :name="good.name"
          :amount="good.quantity"
          :price="good.price"
        />
        <KeyValue
          label="商品总额"
          :value="`¥ ${totalPrice.toFixed(2)}`"
          separate
        ></KeyValue>
        <KeyValue label="服务费" value="¥ 0.00" separate></KeyValue>
      </div>
      <div class="row">
        <KeyValue
          v-if="totalPrice > 0"
          label="支付方式"
          value="退房付"
          separate
        ></KeyValue>
        <KeyValue label="房间号" :value="baseStore.base.areaCode"></KeyValue>
      </div>
      <div class="row mark">
        <KeyValue label="服务备注" flex>
          <textarea
            maxlength="30"
            auto-height
            class="input"
            placeholder="选填"
            v-model="mark"
          />
        </KeyValue>
      </div>
      <div class="notice" v-if="props.payOnline">
        现付物品将无法取消及退款，请注意核对哦。
      </div>
    </div>
    <SafeBottom>
      <div class="footer">
        <div class="left">
          <template v-if="totalPrice > 0">
            <p class="pay-title">退房需付</p>
            <p class="bottom-price">{{ renderPrice(totalPrice) }}</p>
          </template>
          <template v-else>
            <p class="bottom-price">免费</p>
          </template>
        </div>
        <div class="primary">
          <BottomButton layoutFlow @click="submit" :disabled="loading">
            提交订单
          </BottomButton>
        </div>
      </div>
    </SafeBottom>
  </div>
</template>

<style lang="less" scoped>
.page {
  height: 100%;
  display: flex;
  flex-direction: column;

  .content {
    flex: 1;
    overflow: auto;
    background: #f8f8f8;
    padding: 16px;
  }
  .row {
    padding: 16px 12px;
    background: #fff;
    border-radius: 8px;
    margin-bottom: 12px;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: #fff;
  }
  .primary {
    flex-basis: 144px;
  }
  .input {
    flex: 1;
    font-size: 14px;
    width: 100%;
  }
  .mark {
    :deep(.value) {
      flex: 1;
    }
    :deep(.kv) {
      align-items: center;
    }
  }
  .bottom-price {
    color: #a43127;
    font-size: 18px;
    font-weight: 600;
    line-height: 18px;
  }
  .pay-title {
    color: #808080;
    font-size: 12px;
    line-height: 12px;
    margin-bottom: 8px;
  }
}
</style>
