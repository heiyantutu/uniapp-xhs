import useRequest from '@/hooks/useRequest'
import api from '@/utils/api'
import config from '@/utils/config'
import defaultOtaChannel from '@/utils/defaultOtaChannel'
import { computed } from 'vue'

const useHotelDetail = () => {
  const { data, loading, run } = useRequest(
    (hotelCode: string) =>
      api.findHotel({
        hotelCode,
        hotelGroupCodes: config.hotelGroupCode,
        otaChannel: defaultOtaChannel,
      }),
    {
      manual: true,
    }
  )

  const hotelDetail = computed(
    () => (data.value as any).retVal?.resultInfos?.[0]
  )

  return {
    run,
    hotelDetail,
    loading
  }
}

export default useHotelDetail
