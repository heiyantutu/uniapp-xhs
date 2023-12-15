import { Goods2OrderDetailList } from '../../domain/goods/dto'
import useRequest from '@/hooks/useRequest'
import api from '@/utils/api'
import config from '@/utils/config'
import { useGoodsStore } from '../../store/useGoodsStore'
import { useServiceStore } from '../../store/useServiceStore'
import { useBaseStore } from '@/pagesG/store/useBaseStore'

const useCreateOrder = () => {
  const baseStore = useBaseStore()
  const goodsStore = useGoodsStore()
  const serviceStore = useServiceStore()

  const { run, loading } = useRequest(
    (orderRemark = '') =>
      api.createServerOrder({
        appid: config.appid,
        componentAppid: config.componentAppid,
        openId: uni.getStorageSync('openid'),
        areaCode: baseStore.base.areaCode || '',
        buildCode: baseStore.base.buildCode,
        deptCode: '',
        floorCode: baseStore.base.floorCode,
        floorName: '',
        isCopy: 'F',
        isUrgent: 'F',
        masterId: baseStore.base.masterId,
        roomMasterId: baseStore.base.masterId,
        orderDetailList: Goods2OrderDetailList(goodsStore.goods),
        serverCode: serviceStore.service.serviceItemCode,
        serverName: serviceStore.service.serviceName,
        serviceProvider: 'ROBOT', // 默认工单服务类型是机器人模式，不满足条件后端自动转成人工模式
        serverPoint: '',
        guestName: baseStore.base.name,
        userName: '',
        orderRemark,
      }),
    {
      manual: true,
      onSuccess() {
        uni.$emit('refreshOrderList')
        uni.switchTab({ url: '/pages/orderList' })
      },
    }
  )

  return {
    loading,
    run,
  }
}

export default useCreateOrder
