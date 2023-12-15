<script setup lang="ts">
import { ref } from 'vue'
import PickTrigger from '../PickTrigger/index.vue'
import BottomDialog from '@/components/bottomDialog.vue'
import BottomBtn from '@/components/bottomBtn.vue'
import * as R from 'ramda'
import dayjs from 'dayjs'

const getDateFromNow = (days: number) =>
  dayjs().add(days, 'days').format('MM月DD日')
const formatMinute = (m: number) => (m < 10 ? `0${m}` : `${m}`)
const DATES = [0, 1, 2].map(getDateFromNow)
const HOURS = R.range(0, 23).map(formatMinute)
const MINUTES = ['00', '10', '20', '30', '40', '50']

const dialogRef = ref()

const showPopup = () => {
  dialogRef.value.showDialog()
}

const emit = defineEmits<{
  (e: 'confirm', value: Date): void
}>()

const props = defineProps<{
  value?: Date
}>()

const getIndexFromDate = (v: Date) => {
  const now = dayjs()
  const target = dayjs(v)
  return [
    target.diff(now, 'days'),
    target.get('hours'),
    target.get('minutes') / 10,
  ]
}

const pickerValue = ref(props.value ? getIndexFromDate(props.value) : [0, 0, 0])

const onChange = (e: any) => {
  pickerValue.value = e.detail.value
}

const getDateFromIndex = (arr: number[]) => {
  const [dateIndex, hourIndex, minuteIndex] = arr
  return dayjs()
    .startOf('day')
    .add(dateIndex, 'days')
    .add(hourIndex, 'hours')
    .add(minuteIndex * 10, 'minutes')
    .toDate()
}

const finish = () => {
  emit('confirm', getDateFromIndex(pickerValue.value))
  dialogRef.value.hideDialog()
}
</script>

<template>
  <div>
    <PickTrigger
      title="上门时间"
      :display="!!props.value"
      @click="showPopup"
      placeholder="尽快"
    >
      <template #display>
        <span class="display">{{
          props.value ? dayjs(props.value).format('MM-DD HH:mm') : ''
        }}</span>
      </template>
    </PickTrigger>
    <BottomDialog ref="dialogRef" title="上门时间">
      <picker-view class="picker-view" @change="onChange" :value="pickerValue">
        <picker-view-column>
          <view class="item" v-for="item in DATES" :key="item">{{ item }}</view>
        </picker-view-column>
        <picker-view-column>
          <view class="item" v-for="item in HOURS" :key="item">{{ item }}</view>
        </picker-view-column>
        <picker-view-column>
          <view class="item" v-for="item in MINUTES" :key="item">{{
            item
          }}</view>
        </picker-view-column>
      </picker-view>
      <BottomBtn @click="finish">完成</BottomBtn>
    </BottomDialog>
  </div>
</template>

<style scoped lang="less">
.display {
  line-height: 16px;
  font-size: 16px;
}
.picker-view {
  height: 300px;

  :deep(.item) {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}
</style>
