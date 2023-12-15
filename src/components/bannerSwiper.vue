<template>
  <div class="ui_bannerSwiper" :style="adBoxStyle" v-if="adList.length>0">
    <div class="swiper" :style="adItemStyle">
      <template v-if="adList.length>1">
        <swiper class="swiper" @change="swiperChange">
          <swiper-item v-for="(ad,adIndex) in adList" :key="adIndex" class="swiperItem">
            <img :src="ad.imgUrl" alt="" class="adLogo" mode="aspectFill" @click="goPage(ad.link)">
          </swiper-item>
        </swiper>
        <div class="swiper-dots">
          <div class="swiper-dot" v-bind:class="{active:adIndex == swiperCurrent}" v-for="(ad,adIndex) in adList"
            :key="adIndex">
          </div>
        </div>
      </template>
      <template v-if="adList.length == 1">
        <img :src="ad.imgUrl" alt="" class="adLogo" mode="aspectFill" @click="goPage(ad.link)"
          v-for="(ad,adIndex) in adList" :key="adIndex">
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { goPage } from "@/utils/utils";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import defaultChannel from "@/utils/defaultChannel";
let config = getStorage("config");
export default defineComponent({
  name: "bannerSwiper",
  props: {
    adBoxStyle: {
      type: String,
      default: () => {
        return ``;
      },
    },
    showLocation: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup(props, context) {
    let adList = ref([]);
    let swiperCurrent = ref(0);
	let channel = ref(defaultChannel);
    const advertisementPage = () => {
      api
        .advertisementPage({
          hotelCode: config.hotelCode,
          hotelGroupCode: config.hotelGroupCode,
          showLocation: props.showLocation,
          clientTypes: channel.value,
          firstResult: 0,
          pageSize: 10,
        })
        .then((res: any) => {
          if (
            res.result == 0 &&
            res.retVal &&
            res.retVal.datas &&
            res.retVal.datas.length > 0
          ) {
            let infos = JSON.parse(res.retVal.datas[0].infos);
            adList.value = infos;
          }
        });
    };
    const swiperChange = (e: any) => {
      swiperCurrent.value = e.target.current;
    };
    onMounted(() => {
      advertisementPage();
    });
    return {
      advertisementPage,
      adList,
      swiperChange,
      swiperCurrent,
      goPage,
	  channel
    };
  },
});
</script>
<style lang="less" scoped>
.ui_bannerSwiper {
  position: relative;
  .adLogo {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
  .swiper {
    height: 82px;
    width: 100%;
    .swiperItem {
      width: 100%;
      height: 100%;
    }
  }
  .swiper-dots {
    position: absolute;
    left: 0;
    width: 100%;
    bottom: -8px;
    height: 20px;
    display: flex;
    justify-content: center;
    .swiper-dot {
      height: 2px;
      width: 12px;
      opacity: 0.28;
      background: #cccccc;
      &.active {
        opacity: 1;
        background: #000;
      }
    }
  }
}
</style>