<script setup lang="ts">
import { jAlert3 } from '@/base/jAlert/jAlert'
import PickTrigger from '../base/PickTrigger/index.vue'
import config from '@/utils/config'
import * as R from 'ramda'
import { previewImage } from '@/utils/platform'

export type ImagePickerValue = Array<{
  url: string
}>
const props = defineProps<{
  modelValue: ImagePickerValue
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', v: ImagePickerValue): void
}>()

const chooseImage = () => {
  if (props.modelValue.length === 5) {
    jAlert3('最多只能上传5张图片')
    return
  }
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      uni.showLoading({
        title: '上传中',
      })

      const filePath = res.tempFilePaths[0]
      let baseUrl
      if (['test', 'pre'].includes(config.env)) {
        baseUrl = 'https://test.ihotel.cn'
      } else {
        baseUrl = 'https://miroom.ihotel.cn'
      }
      const url = baseUrl + '/rsapi/file/uploadImg'
      uni.uploadFile({
        url,
        filePath,
        fileType: 'image',
        name: 'file',
        header: {
          channel: 'mini_app',
          userCode: 'nodata',
          hotelGroupCode: config.hotelGroupCode,
          hotelCode: uni.getStorageSync('hotelCode'),
        },
        success: (res) => {
          const data = JSON.parse(res.data)
          if (data && data.code == 0) {
            const v = { url: data.data as string }
            emit('update:modelValue', R.append(v, props.modelValue))
          } else {
            jAlert3(data.message)
          }
        },
        complete: () => {
          uni.hideLoading()
        },
      })
    },
  })
}

const remove = (index: number) => {
  emit('update:modelValue', R.remove(index, 1, props.modelValue))
}
</script>

<template>
  <div class="image-picker" @click="chooseImage">
    <PickTrigger title="上传图片" :display="props.modelValue.length > 0">
      <template #display>
        <div class="image-list">
          <div v-for="(item, index) in props.modelValue" :key="item.url">
            <div class="image-wrapper">
              <image
                @click.stop="
                  previewImage({ current: item.url, urls: [item.url] })
                "
                class="img"
                :src="item.url"
                alt=""
                mode="aspectFit"
              />
              <img
                class="close"
                src="../../img/close.svg"
                alt=""
                @click.stop="remove(index)"
              />
            </div>
          </div>
        </div>
      </template>
    </PickTrigger>
  </div>
</template>

<style scoped lang="less">
.image-picker {
  width: 100%;
}

.img {
  width: 60px;
  height: 60px;
  background: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.image-wrapper {
  position: relative;
}

.close {
  position: absolute;
  width: 16px;
  height: 16px;
  right: -8px;
  top: -8px;
}

.image-list {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
