<script setup lang="ts">
import Layout from '../Layout.vue'
import BaseHeader from '../base/BaseHeader/index.vue'
import SafeBottom from '../base/SafeBottom/index.vue'
import BasePicker from '../base/BasePicker/index.vue'
import { onMounted, reactive } from 'vue'
import BottomBtn from '@/components/bottomBtn.vue'
import ImagePicker, { type ImagePickerValue } from './ImagePicker.vue'
import useRequest from '@/hooks/useRequest'
import api from '@/utils/api'
import config from '@/utils/config'
import * as R from 'ramda'
import { jAlert3 } from '@/base/jAlert/jAlert'
import bg from '../../img/borrow-bg.jpg'
import CoustomHead from '@/components/coustomHead.vue'
import { useBaseStore } from '@/pagesG/store/useBaseStore'
import SUGGEST_TYPES from './suggestTypes'
import { useServiceStore } from '@/pagesG/store/useServiceStore'

const baseStore = useBaseStore()
const serviceStore = useServiceStore()

onMounted(() => {
  baseStore.init()
})

const formData = reactive<{
  suggestType: string
  text: string
  images: ImagePickerValue
}>({
  suggestType: '',
  text: '',
  images: [],
})

const { run, loading } = useRequest(
  () =>
    api.saveRecomm({
      appid: config.appid,
      bizType: formData.suggestType,
      content: formData.text,
      comptType: formData.suggestType,
      masterId: baseStore.base.masterId,
      roomMasterId: baseStore.base.roomMasterId,
      rmno: baseStore.base.areaCode,
      pictures: R.pipe(R.pluck('url'), R.join(','))(formData.images),
      openid: uni.getStorageSync('wxuser')?.openid,
      userId: '',
      hotelCode: baseStore.base.hotelCode,
      hotelGroupCode: config.hotelGroupCode,
    }),
  {
    manual: true,
    onSuccess(res) {
      const id = res.id
      if (id) {
        jAlert3('保存成功')
        setTimeout(() => {
          uni.redirectTo({
            url: `suggest-detail?id=${id}&hotelCode=${baseStore.base.hotelCode}`,
          })
        }, 1500)
      }
    },
  }
)

const confirm = () => {
  if (!formData.suggestType) {
    jAlert3('请选择意见类型')
    return
  }
  if (!formData.text) {
    jAlert3('请输入意见内容')
    return
  }
  run()
}
</script>

<template>
  <!-- #ifdef MP -->
  <CoustomHead color="#fff" position="fixed" />
  <!-- #endif -->
  <Layout :bg="bg">
    <template #header>
      <BaseHeader
        title="投诉建议"
        :desc="
          R.defaultTo(
            '尊敬的宾客，您好！在本次住店过程中，如您遇到任何问题或者有其他意见，都可在此反馈，我们都将改进。',
            serviceStore.service.serviceReminder
          )
        "
      />
    </template>
    <template #default>
      <div class="content">
        <div class="body">
          <div class="row">
            <div class="room-info">
              <div class="label">房间号</div>
              <div>
                {{ baseStore.base.hotelDesc }} {{ baseStore.base.areaCode }}
              </div>
            </div>
          </div>
          <div class="row">
            <BasePicker
              v-model="formData.suggestType"
              :options="SUGGEST_TYPES"
              title="意见类型"
            />
          </div>
          <div class="row detail">
            <div>详细说明</div>
            <textarea
              v-model="formData.text"
              class="textarea"
              placeholder="请输入意见内容"
              maxlength="300"
            />
            <span class="count-tip"> ({{ formData.text.length }}/300) </span>
          </div>
          <div class="row">
            <ImagePicker v-model="formData.images" />
          </div>
        </div>
        <SafeBottom>
          <div class="footer">
            <BottomBtn @click="confirm" :disabled="loading" layoutFlow>
              提交
            </BottomBtn>
          </div>
        </SafeBottom>
      </div>
    </template>
  </Layout>
</template>

<style lang="less" scoped>
.content {
  height: 100%;
  display: flex;
  flex-direction: column;

  .body {
    flex: 1;
    overflow: auto;
    background: #f8f8f8;
    padding: 16px;
  }
}

.footer {
  padding: 12px 16px;
}

.row {
  margin-bottom: 12px;
}

.textarea {
  width: 100%;
  font-size: 14px;
  margin-top: 12px;
}

.room-info {
  display: flex;
  padding: 16px 12px;
  background: #fff;
  border-radius: 8px;
  .label {
    margin-right: 46px;
  }
}

.detail {
  padding: 16px 12px;
  background: #fff;
  border-radius: 8px;
}

.count-tip {
  display: block;
  text-align: right;
  font-size: 12px;
  color: #999;
}
</style>
