<script setup lang="ts">
import useLayoutStart from '@/hooks/useLayoutStart'
import useRequest from '@/hooks/useRequest'
import api from '@/utils/api'
import { getQuery } from '@/utils/utils'
import { computed, onMounted } from 'vue'
import CustomHead from '@/components/coustomHead.vue'
import Card from '../Order/Detail/components/Card.vue'
import KeyValue from '../Order/Detail/components/KeyValue.vue'
import GhostButton from '../../components/base/GhostButton/index.vue'
import SafeBottom from '../../components/base/SafeBottom/index.vue'
import { SuggestionDetailDto2SuggestionDetail } from '@/pagesG/domain/suggestion/translator'
import type { SuggestionDetailDto } from '@/pagesG/domain/suggestion/dto'
import { SuggestionStatus } from '@/pagesG/domain/suggestion/model'
import { getBizDesc } from '@/pagesG/domain/suggestion/pure'
import { jAlert3 } from '@/base/jAlert/jAlert'
import useHotelDetail from './useHotelDetail'

const { layoutStart } = useLayoutStart()
const { data, run } = useRequest((id) => api.getComplaintAndAdvice({ id }), {
  manual: true,
})
const { run: runGetHotelDetail, hotelDetail } = useHotelDetail()

onMounted(() => {
  const id = getQuery().id || ''
  const hotelCode = getQuery().hotelCode || ''
  if (hotelCode) {
    uni.setStorageSync('hotelCode', hotelCode)
  }
  run(id)
  runGetHotelDetail(hotelCode)
})

const contact = () => {
  const phone = hotelDetail.value.phone
  if (!phone) {
    jAlert3('联系方式未配置')
    return
  }

  uni.makePhoneCall({
    phoneNumber: phone,
  })
}

const detailData = computed(() =>
  SuggestionDetailDto2SuggestionDetail(data.value as SuggestionDetailDto)
)

const previewImg = (current: number, urls: string[]) => {
  uni.previewImage({
    current,
    urls,
  })
}
</script>

<template>
  <div>
    <div class="detail" v-if="data">
      <div class="bottom-layer"></div>
      <div class="top-layer">
        <div class="content">
          <!-- #ifndef H5 -->
          <CustomHead title="意见反馈详情" color="#fff" />
          <!-- #endif -->
          <div class="header" :style="{ paddingTop: layoutStart }">
            <h3 class="sta">{{ SuggestionStatus[detailData.status].title }}</h3>
            <p class="desc">{{ SuggestionStatus[detailData.status].desc }}</p>
          </div>

          <Card title="服务项目">
            <KeyValue
              class="key-value"
              label="意见类型"
              :value="getBizDesc(detailData)"
            />
            <KeyValue
              class="key-value"
              label="详细说明"
              :value="detailData.content"
            />
            <template v-if="detailData.imgList.length > 0">
              <p class="label">相关图片</p>
              <div>
                <img
                  class="detailImg"
                  v-for="(url, index) in detailData.imgList"
                  :key="url"
                  :src="url"
                  alt=""
                  @click="() => previewImg(index, detailData.imgList)"
                />
              </div>
            </template>
          </Card>
          <Card title="服务单信息">
            <KeyValue
              class="key-value"
              label="创建时间"
              :value="detailData.createTime"
              separate
            ></KeyValue>
            <KeyValue label="房间号" :value="detailData.roomNo" separate />
          </Card>
        </div>
        <div class="footer">
          <SafeBottom>
            <div class="buttons">
              <GhostButton @click="contact">联系前台</GhostButton>
            </div>
          </SafeBottom>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import url('../Order/Detail/style.scss');
.detailImg {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 8px;
  margin-bottom: 8px;
}
.label {
  font-size: 14px;
  color: #808080;
  margin-bottom: 12px;
}
</style>
