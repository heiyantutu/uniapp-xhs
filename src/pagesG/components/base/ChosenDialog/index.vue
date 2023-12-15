<script setup lang="ts">
import BottomDialog from '@/components/bottomDialog.vue'
import {
  decreaseQuantity,
  getSelection,
  increaseQuantity,
} from '@/pagesG/domain/goods/modal'
import { useGoodsStore } from '@/pagesG/store/useGoodsStore'
import GoodItem from '../GoodList/GoodItem.vue'
import { computed, ref } from 'vue'

const store = useGoodsStore()
const selectedGoods = computed(() => getSelection(store.goods))
const increase = (id: string) => {
  store.setGoods(increaseQuantity(store.goods, id))
}

const decrease = (id: string) => {
  store.setGoods(decreaseQuantity(store.goods, id))
}

const dialogRef = ref()

const show = () => {
  dialogRef.value.showDialog()
}

defineExpose({
  show,
})
</script>

<template>
  <BottomDialog ref="dialogRef" title="已选" maxDialog>
    <div class="dialog-content">
      <GoodItem
        v-for="item in selectedGoods"
        searchTxt=""
        :good="item"
        @increase="() => increase(item.id)"
        @decrease="() => decrease(item.id)"
      />
      <p v-if="!selectedGoods.length" class="empty">暂无数据</p>
    </div>
  </BottomDialog>
</template>

<style scoped lang="less">
.dialog-content {
  height: 250px;
  overflow: auto;
}

.empty {
  text-align: center;
  color: #808080;
  margin-top: 40px;
}
</style>
