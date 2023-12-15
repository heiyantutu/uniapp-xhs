<script setup lang="ts">
import { computed, ref } from 'vue'
import SafeBottom from '../../base/SafeBottom/index.vue'
import ChosenDialog from '../../base/ChosenDialog/index.vue'
import { useGoodsStore } from '@/pagesG/store/useGoodsStore'
import { getSelectCount, getSelection } from '@/pagesG/domain/goods/modal'
import BottomBtn from '@/components/bottomBtn.vue'
import { ServiceTypeEnum } from '@/pagesG/domain/service/modal'
import { useServiceStore } from '@/pagesG/store/useServiceStore'

const props = defineProps<{
  serviceType: ServiceTypeEnum
}>()

const store = useGoodsStore()
const selectionCount = computed(() => getSelectCount(store.goods))
const serviceStore = useServiceStore()

const dialog = ref()
const showDialog = () => {
  dialog.value.show()
}
const confirm = () => {
  uni.redirectTo({ url: `/pagesG/confirm-order?type=${props.serviceType}` })
}
const selectedGoods = computed(() => getSelection(store.goods))
</script>

<template>
  <SafeBottom>
    <div class="footer">
      <div class="chosen" @click="showDialog">
        <p class="chosen-label">已选</p>
        <p>{{ selectionCount }}</p>
      </div>
      <div class="primary">
        <BottomBtn
          @click="confirm"
          :disabled="selectedGoods.length === 0 || !serviceStore.inServiceTime"
          layoutFlow
        >
          {{ serviceStore.getServiceButtonTxt('我选好了') }}
        </BottomBtn>
      </div>
    </div>
    <ChosenDialog ref="dialog" />
  </SafeBottom>
</template>

<style scoped lang="less">
.footer {
  padding: 12px 16px;
  display: flex;
  align-items: center;

  .chosen {
    flex-basis: 80px;
    flex-shrink: 0;
    text-align: center;
    margin-right: 10px;
    font-size: 12px;
  }
  .chosen-label {
    margin-bottom: 8px;
  }

  .primary {
    flex: 1;
  }
}
</style>
