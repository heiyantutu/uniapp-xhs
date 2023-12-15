import { defineStore } from 'pinia'
import { computed } from 'vue'
import { ref } from 'vue'
import { saleTime } from '../utils'

export const useServiceStore = defineStore('service', () => {
  const service = ref<Record<string, any>>({})
  const setService = (v: Record<string, any>) => {
    service.value = v
  }

  const duration = computed(() =>
    service.value.startTime
      ? `${service.value.startTime}-${service.value.endTime}`
      : '-'
  )

  const inServiceTime = computed(() => !saleTime(service.value))
  const getServiceButtonTxt = (s: string) => inServiceTime.value ? s : '不在服务时间'

  return {
    service,
    setService,
    duration,
    inServiceTime,
    getServiceButtonTxt
  }
})
