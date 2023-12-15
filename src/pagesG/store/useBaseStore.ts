import { getQuery } from '@/utils/utils'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

interface State {
  areaCode: string
  masterId: string
  roomMasterId: string
  hotelCode: string
  name: string
  buildCode: string
  floorCode: string
  hotelDesc: string
}

export const useBaseStore = defineStore('base', () => {
  const base = reactive<State>({
    areaCode: '',
    masterId: '',
    roomMasterId: '',
    hotelCode: '',
    name: '',
    buildCode: '',
    floorCode: '',
    hotelDesc: ''
  })

  const init = () => {
    const query = getQuery()
    if (query.hotelCode) {
      base.areaCode = query.areaCode || ''
      base.hotelCode = query.hotelCode || ''
      base.roomMasterId = query.masterId || ''
      base.masterId = query.pmsId || ''
      base.name = decodeURIComponent(query.name) || ''
      base.buildCode = query.building || ''
      base.floorCode = query.floor || ''
      base.hotelDesc = decodeURIComponent(query.hotelDesc) || ''

      uni.setStorageSync('hotelCode', query.hotelCode)
    }
  }

  return {
    base,
    init,
  }
})
