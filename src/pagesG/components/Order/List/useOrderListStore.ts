import useRequest from '@/hooks/useRequest'
import { OrderListRes2ServiceOrderList } from '@/pagesG/domain/order/dto'
import type { ServiceOrder } from '@/pagesG/domain/order/modal'
import api from '@/utils/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as R from 'ramda'
import { reactive } from 'vue'

export const useOrderListStore = defineStore('orderList', () => {
  const activeTab = ref('all')
  const allOrders = reactive<{
    total: number
    list: ServiceOrder[]
  }>({
    total: -1,
    list: [],
  })
  const waitOrders = reactive<{
    total: number
    list: ServiceOrder[]
  }>({
    total: -1,
    list: [],
  })
  const joinedOrders = computed(() => R.concat(allOrders.list, waitOrders.list))
  const setActiveTab = (v: string) => {
    activeTab.value = v
  }

  const { run: runCancelOrder } = useRequest(
    (orderNo: string) =>
      api.updateInstantRsOrder({
        cancelDes: '',
        remark: '',
        oderNo: orderNo,
        operation: 'cancel',
        changeHandlerUserCode: '',
        userCode: 'guest',
      }),
    {
      manual: true,
      onSuccess: (_, param: string) => {
        const setX = (v: ServiceOrder[]) =>
          R.adjust(
            R.findIndex(R.propEq(param, 'orderNo'), v),
            R.modify('status', R.always('X')),
            v
          )
        allOrders.list = setX(allOrders.list)
        waitOrders.list = setX(waitOrders.list)
      },
    }
  )

  const { run: fetchOrders, loading: fetchOrdersLoading } = useRequest(
    (p: { pageNo?: number; orderSta?: string } = { pageNo: 1, orderSta: '' }) =>
      api.orderList({
        openid: uni.getStorageSync('openid'),
        pageNo: p.pageNo,
        pageSize: 20,
        orderSta: p.orderSta,
        crossHotelList: uni.getStorageSync('crossHotelList')
      }),
    {
      manual: true,
      onSuccess: (res, params) => {
        const list = OrderListRes2ServiceOrderList(res.data)
        const isRefresh = params.pageNo === 1
        if (params && params.orderSta === 'R') {
          if (isRefresh) {
            waitOrders.list = list
          } else {
            waitOrders.list = [...waitOrders.list, ...list]
          }
          waitOrders.total = res.count
        } else {
          if (isRefresh) {
            allOrders.list = list
          } else {
            allOrders.list = [...allOrders.list, ...list]
          }
          allOrders.total = res.count
        }
      },
    }
  )

  const refresh = async () => {
    return Promise.all([
      fetchOrders({
        pageNo: 1,
        orderSta: '',
      }),
      fetchOrders({
        pageNo: 1,
        orderSta: 'R',
      }),
    ])
  }

  const index = computed(() => (activeTab.value === 'all' ? 0 : 1))

  return {
    activeTab,
    setActiveTab,
    index,
    allOrders,
    waitOrders,
    fetchOrders,
    refresh,
    runCancelOrder,
    joinedOrders,
    fetchOrdersLoading
  }
})
