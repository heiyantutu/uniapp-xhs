<script setup lang="ts">
import Card from './components/Card.vue'
import GoodItem from './components/GoodItem.vue'
import KeyValue from './components/KeyValue.vue'
import SafeBottom from '@/pagesG/components/base/SafeBottom/index.vue'
import useRequest from '@/hooks/useRequest'
import api from '@/utils/api'
import { getOrderDesc, showOperation } from './utils'
import { onMounted, ref } from 'vue'
import { jAlert3, jAlert5 } from '@/base/jAlert/jAlert'
import CustomHead from '@/components/coustomHead.vue'
import useLayoutStart from '@/hooks/useLayoutStart'
import { useOrderListStore } from '../List/useOrderListStore'
import { computed } from 'vue'
import { getQuery } from '@/utils/utils'
import noImg from '@/pagesG/img/no-img.jpg'
import { getTotalPrice } from '@/pagesG/domain/order/modal'
import GhostButton from '@/pagesG/components/base/GhostButton/index.vue'
import useFetch from './useFetch'
import * as R from 'ramda'
import useHotelDetail from '../../SuggestDetail/useHotelDetail'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import { watch } from 'vue'

const orderNo = ref('')
const masterId = ref('')
const hotelCode = ref('')
const { data: orderData, run } = useFetch()
const { run: runHotelDetail, hotelDetail } = useHotelDetail()

const fetchData = async () => {
  return Promise.all([
    run({
      orderNo: orderNo.value,
      masterId: masterId.value,
      hotelCode: hotelCode.value,
    }),
    runHotelDetail(hotelCode.value),
  ])
}
onMounted(() => {
  orderNo.value = getQuery().orderNo
  masterId.value = getQuery().pmsId || getQuery().masterId || ''
  hotelCode.value = getQuery().hotelCode || ''
  if (hotelCode.value) {
    uni.setStorageSync('hotelCode', hotelCode.value)
  }
  fetchData()
})
const orderListStore = useOrderListStore()
const goods = computed(() => orderData.value?.goods)

const { layoutStart } = useLayoutStart()

const copyText = (s: string) => {
  uni.setClipboardData({ data: s })
}

watch(orderData, () => {
  uni.setNavigationBarTitle({ title: orderData.value?.serviceName || '' })
})
onPullDownRefresh(async () => {
  await fetchData()
  uni.stopPullDownRefresh()
})

const allowCallUp = ref(true)
const { run: runCallUp } = useRequest(
  () =>
    api.updateOrder({
      operation: 'callup',
      orderNo: orderNo.value,
    }),
  {
    manual: true,
    onSuccess() {
      jAlert3('催单成功')
      allowCallUp.value = false
    },
  }
)

const onCancel = () => {
  jAlert5('是否确认取消该服务', async () => {
    await orderListStore.runCancelOrder(orderNo.value)
    await run({
      orderNo: orderNo.value,
      masterId: masterId.value,
      hotelCode: hotelCode.value,
    })
  })
}

const isCleanup = computed(() => orderData.value?.serviceCode === '00104')

const totalPrice = computed(() => {
  if (R.isNil(orderData.value?.goods)) return 0
  return getTotalPrice(orderData.value?.goods || [])
})
</script>

<template>
  <div class="detail" v-if="orderData">
    <div class="bottom-layer"></div>
    <div class="top-layer">
      <div class="content">
        <!-- #ifndef H5 -->
        <CustomHead :title="`${orderData.serviceName}服务详情`" color="#fff" />
        <!-- #endif -->
        <div class="header" :style="{ paddingTop: layoutStart }">
          <h3 class="sta">{{ getOrderDesc(orderData).title }}</h3>
          <p class="desc">{{ getOrderDesc(orderData).desc }}</p>
        </div>

        <Card title="服务项目">
          <KeyValue
            class="key-value"
            v-if="orderData.timeDo"
            label="上门时间"
            :value="orderData.timeDo"
          />
          <div v-if="goods && goods?.length > 0">
            <GoodItem
              v-for="item in goods"
              :key="item.name"
              :img="item.picture || noImg"
              :name="item.name"
              :price="item.price || 0"
              :amount="item.amount"
            />
          </div>

          <KeyValue
            class="key-value"
            v-if="orderData?.remark"
            :label="isCleanup ? '特殊需求' : '服务备注'"
            :value="orderData.remark"
          />
        </Card>
        <Card title="费用明细" v-if="goods && goods.length">
          <KeyValue
            class="key-value"
            label="商品总额"
            :value="`¥ ${getTotalPrice(orderData?.goods || []).toFixed(2)}`"
            separate
          />
          <KeyValue class="key-value" label="服务费" value="¥ 0.00" separate />
          <KeyValue class="key-value" label="退房需付款" separate>{{
            `¥ ${getTotalPrice(orderData?.goods || []).toFixed(2)}`
          }}</KeyValue>
        </Card>
        <Card title="服务单信息">
          <KeyValue class="key-value" label="订单号" separate>
            <div class="order-no">
              <span>{{ orderNo }}</span>
              <img
                class="copy-img"
                src="@/pagesG/img/copy.svg"
                alt=""
                @click="copyText(orderNo || '')"
              />
            </div>
          </KeyValue>
          <KeyValue
            class="key-value"
            :label="isCleanup ? '申请时间' : '下单时间'"
            :value="orderData?.createDateTime"
            separate
          />
          <KeyValue
            v-if="totalPrice > 0"
            label="支付方式"
            value="退房付"
            separate
          />
          <KeyValue
            label="房间号"
            :value="`${R.defaultTo('', hotelDetail.descript)} ${
              orderData?.roomNo
            }`"
            separate
          />
        </Card>
      </div>
      <div class="footer" v-if="showOperation(orderData)">
        <SafeBottom>
          <div class="buttons">
            <GhostButton @click="onCancel">取消服务</GhostButton>
            <GhostButton @click="runCallUp" :disabled="!allowCallUp">
              {{ allowCallUp ? '催单' : '已催单' }}
            </GhostButton>
          </div>
        </SafeBottom>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url('./style.scss');
</style>
