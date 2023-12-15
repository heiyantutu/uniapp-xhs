<template>
  <div class="ui_hotelList" :style="hotelListStyle">
    <div class="hotelList">
      <div class="hotelWrapper" v-for="(hotel, hotelIndex) in hotels" :key="hotelIndex" @click="goHotel(hotel)">
        <div class="hotel">
          <image :src="hotel.extraLogo +'?imageView2/1/w/686/h/516&x-oss-process=image/resize,m_fill,w_686,h_516'" alt="" class="logo" mode="scaleToFill" />
          <div class="hotelInfo">
            <p class="hotelName">{{ hotel.descript }}</p>
            <p class="subTitle">{{ hotel.gcHotelPicTag }}</p>
            <div class="line">
              <div class="tag" v-for="(tag, tagIndex) in hotel.promotionTags" :key="tagIndex">{{ tag }}</div>
            </div>
            <p class="price" v-if="hotel.roomAvailable !== 'false'"><span class="money">¥{{ hotel.priceMin }}</span>/起
            </p>
            <p class='price' v-if="hotel.roomAvailable == 'false' || hotel.priceMin == '-1'">满房</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { goPage } from "@/utils/utils";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";

let config = getStorage("config");
export default defineComponent({
  name: "hotelList",
  props: {
    hotels: {
      type: Array,
      default: () => {
        return [];
      },
    },
    fromDate: {
      type: String,
      default: () => {
        return "";
      },
    },
    toDate: {
      type: String,
      default: () => {
        return "";
      },
    },
    otaChannel: {
      type: String,
      default: () => {
        return "WECHAT";
      },
    },
    hotelListStyle: {
      type: String,
      default: () => {
        return ``;
      },
    },
  },
  setup(props, context) {
    const goHotel = (hotel: any) => {
      uni.navigateTo({
        url: `/pagesC/order/hotel?hotelCode=${hotel.code}&fromDate=${props.fromDate}&toDate=${props.toDate}&otaChannel=${props.otaChannel}`,
      });
    };
    return {
      goHotel,
    };
  },
});
</script>
<style lang="less" scoped>
.ui_hotelList {
  .hotelList {
    .hotel {
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 12px;

      .logo {
        width: 100%;
        height: 258px;
        display: block;
        object-fit: cover;
      }

      .hotelInfo {
        padding: 12px 12px;

        .hotelName {
          font-size: 16px;
          color: #000000;
          font-weight: bold;
          margin-bottom: 9px;
          line-height: 16px;
        }

        .subTitle {
          font-size: 12px;
          color: #808080;
          margin-bottom: 9px;
        }

        .line {
          display: flex;
          margin-bottom: 9px;
        }

        .infoLine {
          display: flex;
          margin-bottom: 9px;
          align-items: center;

          .infoDesc {
            font-size: 14px;
            color: #808080;
          }

          .tag {
            margin-right: 10px;
          }
        }

        .tag {
          background: rgba(164, 49, 39, 0.12);
          font-size: 12px;
          color: #a43127;
          padding: 3px;
          margin-right: 3px;
          border-radius: 4px;
        }

        .price {
          font-size: 12px;
          color: #808080;

          .money {
            font-size: 18px;
            color: #000000;
            font-weight: 600;
            font-family: Montserrat;
          }
        }
      }
    }
  }
}
</style>