import { Goods2OrderDetailList } from '../../domain/goods/dto'
import useRequest from '@/hooks/useRequest'
import api from '@/utils/api'
import config from '@/utils/config'
import { useGoodsStore } from '../../store/useGoodsStore'
import { useServiceStore } from '../../store/useServiceStore'
import type { CreateServerOrderV2Res } from '@/pagesG/domain/order/dto'
import { useBaseStore } from '@/pagesG/store/useBaseStore'

interface Options {
  replace?: boolean
}
const useCreateOrder = (options: Options = {}) => {
  const { replace = false } = options
  const goodsStore = useGoodsStore()
  const serviceStore = useServiceStore()
  const baseStore = useBaseStore()

  const { run, loading } = useRequest(
    (o = {}) =>
      api.createServerOrder({
        appid: config.appid,
        componentAppid: config.componentAppid,
        openId: uni.getStorageSync('wxuser')?.openid,
        areaCode: baseStore.base.areaCode,
        buildCode: baseStore.base.buildCode,
        deptCode: '',
        floorCode: baseStore.base.floorCode,
        floorName: '',
        isCopy: 'F',
        isUrgent: 'F',
        masterId: baseStore.base.masterId,
        roomMasterId: baseStore.base.roomMasterId,
        orderDetailList: Goods2OrderDetailList(goodsStore.goods),
        serverCode: serviceStore.service.serviceItemCode,
        serverName: serviceStore.service.serviceName,
        serviceProvider: 'ROBOT', // 默认工单服务类型是机器人模式，不满足条件后端自动转成人工模式
        serverPoint: '',
        guestName: baseStore.base.name,
        userName: '',
        ...o,
      }),
    {
      manual: true,
      onSuccess: (res: CreateServerOrderV2Res) => {
        if (res.orderList?.[0]?.orderNo) {
          const url = `/pagesG/order/detail/index?orderNo=${res.orderList?.[0]?.orderNo}&hotelCode=${baseStore.base.hotelCode}&masterId=${baseStore.base.masterId}`
          if (replace) {
            uni.redirectTo({ url })
          } else {
            uni.navigateTo({ url })
          }
        }
      },
    }
  )

  return {
    loading,
    run,
  }
}

export default useCreateOrder
