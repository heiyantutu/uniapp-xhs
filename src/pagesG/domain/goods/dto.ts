import { quantityGtZero, type Good } from './modal'
import * as R from 'ramda'

export type MapSysDicRes = Array<{
  descript: string
  list: Array<{
    category: string
    classType1: string
    classType2: string
    code: string
    createDatetime: string
    createUser: string
    descript: string
    descriptEn: string
    hotelCode: string
    hotelGroupCode: string
    id: number
    isHalt: string
    label: string
    leftNum?: string
    listOrder: number
    modifyDatetime: string
    modifyUser: string
    picture: string
    price?: number
    remark?: string
    supportRobot: boolean
    thirdCode: string
    thirdContent: string
    unit: string
  }>
}>

export const MapSysDicRes2Goods = (v: MapSysDicRes): Good[] => {
  const flat = R.flatten(R.pluck('list', v))
  return flat.map((i) => ({
    id: i.code,
    name: i.descript,
    picture: i.picture,
    price: i.price || 0,
    stock: R.isNotNil(i.leftNum) ? Math.max(0, Number(i.leftNum)) : Infinity,
    category: i.label,
    quantity: 0,
  }))
}

export type OrderDetailList = Array<{
  detailCode: string
  detailName: string
  detailNum: number
  detailPrice: number
  detailRemark: string
  detailPicture?: string
}>

export const Goods2OrderDetailList = (v: Good[]): OrderDetailList => {
  const chosen = R.filter(quantityGtZero, v)
  return chosen.map((i) => ({
    detailCode: i.id,
    detailName: i.name,
    detailNum: i.quantity,
    detailPrice: i.price,
    detailRemark: '',
  }))
}

export const OrderDetailList2Goods = (v: OrderDetailList): Good[] => {
  const chosen = R.filter(quantityGtZero, v)
  return chosen.map((i) => ({
    id: i.detailCode,
    name: i.detailName,
    quantity: i.detailNum,
    price: i.detailPrice,
    picture: i.detailPicture || '',
    category: '',
  }))
}
