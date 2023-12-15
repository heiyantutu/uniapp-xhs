<script setup lang="ts">
import {
  type ServiceOrder,
  getTotalPrice,
  getLabel,
} from '../../../../domain/order/modal'
import KeyValue from '../../Detail/components/KeyValue.vue'
import { useOrderListStore } from '../useOrderListStore'
import { showOperation } from '../../Detail/utils'
import { jAlert5 } from '@/base/jAlert/jAlert'

interface Props extends ServiceOrder {
  roomNo: string
}
const props = defineProps<Props>()

const onClick = () => {
  uni.navigateTo({ url: `/pagesG/order/detail/index?orderNo=${props.orderNo}&hotelCode=${props.hotelCode}` })
}

const orderListStore = useOrderListStore()

const onCancel = () => {
  jAlert5('是否确认取消该服务', () => {
    orderListStore.runCancelOrder(props.orderNo)
  })
}
</script>

<template>
  <div class="card" @click="onClick">
    <div class="head">
      <div class="top">
        <div class="room-no">{{ props.hotelName }} {{ props.roomNo }}</div>
        <div class="status">{{ getLabel(props) }}</div>
      </div>
      <div class="service">
        <img :src="props.serviceIcon" alt="" class="icon" />
        <span class="service-name">{{ props.serviceName }}</span>
      </div>
      <div class="body">
        <template v-if="props.goods?.length">
          <KeyValue
            v-for="item in props.goods"
            :key="item.name"
            :label="item.name"
            :value="`¥${item.price} x${item.amount}`"
            separate
          />
          <KeyValue
            label="退房需付款"
            :value="`¥${getTotalPrice(props.goods)}`"
            separate
          />
        </template>
        <KeyValue label="服务备注" :value="props.remark" separate />
      </div>
      <div class="footer" v-if="showOperation(props)">
        <button class="button" @click.stop="onCancel">取消服务</button>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.card {
  padding: 16px 12px;
  border-radius: 8px;
  background: #fff;
  margin-bottom: 12px;
}
.top {
  display: flex;
  align-content: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.service {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  .icon {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
  .service-name {
    font-size: 16px;
    line-height: 24px;
  }
}

.body {
  margin-bottom: 24px;
  :deep(.label) {
    flex-basis: auto;
  }
}

.footer {
  text-align: right;
}

.button {
  padding: 8px 12px;
  border-radius: 4px;
  display: inline-block;
  font-size: 14px;
  line-height: 14px;
  background: #fff;
  &::after {
    border-color: #000;
  }
}
</style>
