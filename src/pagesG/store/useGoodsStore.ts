import { defineStore } from "pinia"
import { ref } from "vue"
import type { Good } from "../domain/goods/modal"

export const useGoodsStore = defineStore("goods", () => {
  const goods = ref<Good[]>([])
  const setGoods = (v: Good[]) => {
    goods.value = v
  }

  return {
    goods,
    setGoods,
  }
})
