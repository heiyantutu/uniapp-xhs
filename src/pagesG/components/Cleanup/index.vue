<script setup lang="ts">
import Layout from '../Layout.vue'
import BaseHeader from '../base/BaseHeader/index.vue'
import BottomBtn from '@/components/bottomBtn.vue'
import TimePicker from '../base/TimePicker/index.vue'
import bg from '../../img/borrow-bg.jpg'
import useCreateOrder from './useCreateOrder'
import { ref, watch } from 'vue'
import useServiceInfo from '@/pagesG/store/useServiceInfo'
import { onMounted } from 'vue'
import useDatePicker from './useDatePicker'
import { useBaseStore } from '@/pagesG/store/useBaseStore'
import { useServiceStore } from '@/pagesG/store/useServiceStore'
import dayjs from 'dayjs'
import useServePerson from './useServePerson'
import CoustomHead from '@/components/coustomHead.vue'
import * as R from 'ramda'

const { run } = useServiceInfo('001')
const baseStore = useBaseStore()
const serviceStore = useServiceStore()
const { onConfirm, date } = useDatePicker()
const { run: runCreateOrder, loading } = useCreateOrder()
const { user, run: runGetServePerson } = useServePerson()

const formatDate = (d: Date) => dayjs(d).format('YYYY-MM-DD HH:mm')
onMounted(() => {
  baseStore.init()
  run()
  runGetServePerson()
})
watch(date, (v) => {
  runGetServePerson(formatDate(v))
})
const remark = ref('')
const confirm = () => {
  runCreateOrder({
    orderRemark: remark.value,
    timeDo: formatDate(date.value),
    typeTime: 'P',
    userCode: user.value?.userCode,
    serviceProvider: 'HUMAN',
  })
}
</script>

<template>
  <!-- #ifdef MP -->
  <CoustomHead color="#fff" position="fixed" />
  <!-- #endif -->
  <Layout :bg="bg">
    <template #header>
      <BaseHeader
        title="客房打扫"
        :desc="
          serviceStore.inServiceTime
            ? R.defaultTo(
                '呼叫客房打扫后，服务人员将即时上门打扫',
                serviceStore.service.serviceReminder
              )
            : ''
        "
        :time="serviceStore.inServiceTime ? '' : serviceStore.duration"
      />
    </template>
    <template #default>
      <div class="content">
        <div class="row">
          <div class="room-info">
            <div class="label">房间号</div>
            <div>
              {{ baseStore.base.hotelDesc }} {{ baseStore.base.areaCode }}
            </div>
          </div>
        </div>
        <div class="row">
          <TimePicker @confirm="onConfirm" :value="date"></TimePicker>
        </div>
        <div class="row">
          <div class="row-title">特殊需求</div>
          <textarea
            class="textarea"
            placeholder="如有特殊需要请在此说明"
            auto-height
            v-model="remark"
            maxlength="300"
          />
          <span class="count-tip"> ({{ remark.length }}/300) </span>
        </div>
        <BottomBtn
          @click="confirm"
          layoutFlow
          :disabled="!serviceStore.inServiceTime || loading"
        >
          {{ serviceStore.getServiceButtonTxt('提交') }}
        </BottomBtn>
      </div>
    </template>
  </Layout>
</template>

<style lang="less" scoped>
.content {
  padding: 10px;
  height: 100%;
}

.row {
  padding: 16px 12px;
  background: #fff;
  border-radius: 8px;
  margin-bottom: 12px;

  &:last-of-type {
    margin-bottom: 32px;
  }
}

.room-info {
  display: flex;

  .label {
    margin-right: 46px;
  }
}

.row-title {
  margin-bottom: 12px;
}
.textarea {
  width: auto;
}

.count-tip {
  display: block;
  text-align: right;
  font-size: 12px;
  color: #999;
}
</style>
