import useRequest from '@/hooks/useRequest'
import api from '@/utils/api'
import config from '@/utils/config'
import { useServiceStore } from './useServiceStore'
import { useBaseStore } from './useBaseStore'

const useServiceInfo = (serviceCode: string) => {
  const baseStore = useBaseStore()

  const { setService } = useServiceStore()
  const { run } = useRequest(
    () =>
      api.getListHotelService({
        hotelGroupCode: config.hotelGroupCode,
        hotelCode: baseStore.base.hotelCode,
        sta: 'I',
      }),
    {
      manual: true,
      onSuccess: (res) => {
        setService(res.retVal.find((i: any) => i.serviceCode === serviceCode))
      },
    }
  )
  return {
    run,
  }
}

export default useServiceInfo
