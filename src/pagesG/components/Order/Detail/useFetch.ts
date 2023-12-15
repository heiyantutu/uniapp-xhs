import useRequest from '@/hooks/useRequest'
import { OrderListRes2ServiceOrderList } from '@/pagesG/domain/order/dto'
import type { ServiceOrder } from '@/pagesG/domain/order/modal'
import api from '@/utils/api'
import { ref } from 'vue'

const useFetch = () => {
  const data = ref<ServiceOrder>()
  const { loading, run } = useRequest(
    (p: { orderNo: string; hotelCode?: string; masterId?: string }) => 
      api.orderList({
        openid: uni.getStorageSync('wxuser')?.openid,
        pageNo: 1,
        pageSize: 1,
        orderNo: p.orderNo,
        crossHotelList:
          p.hotelCode && p.masterId
            ? [
                {
                  hotelCode: p.hotelCode,
                  masterId: p.masterId,
                },
              ]
            : uni.getStorageSync('crossHotelList'),
      }),
    {
      manual: true,
      onSuccess(res) {
        const v = OrderListRes2ServiceOrderList(res.data)
        data.value = v[0]
      },
    }
  )

  return {
    data,
    loading,
    run,
  }
}

export default useFetch
