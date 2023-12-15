<template>
  <view class="ui_activityGroup">
    <div class="product-group">
      <template v-for="(item, i) in datas" :key="i">
        <div class="product-box" @click="toPage(item)" v-if="i <= number">
          <div class="product-swiper">
            <img
              class="product-img"
              :src="item.indexPicture"
              v-if="item.indexPicture"
            />
          </div>
          <div class="product-info">
            <div class="product-name">
              {{ item.name }}
            </div>
            <div class="product-info-labs">
              <div
                class="product-info-lab"
                v-if="item.tagsList"
                v-for="(tag, j) in item.tagsList"
                :key="j"
              >
                {{ tag }}
              </div>
            </div>
            <div
              class="product-price"
              v-if="item.payType == 'CASH' && item.minPriceDto.price"
            >
              ¥{{ Number(item.minPriceDto.price) }}
              <div class="unit">/人起</div>
            </div>
            <div
              class="product-price"
              v-else-if="
                item.payType == 'INTEGRALCASH' &&
                (item.minPriceDto.mixPrice || item.minPriceDto.mixCredit)
              "
            >
              <span> {{ item.minPriceDto.mixCredit }}积分</span>
              <span v-if="item.minPriceDto.mixPrice"
                >+¥{{ Number(item.minPriceDto.mixPrice) }}</span
              >
              <div class="unit">/人起</div>
            </div>
            <div class="product-price" v-else>免费</div>
          </div>
        </div>
      </template>
    </div>
  </view>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "activityGroup",
  props: {
    datas: {
      type: Array,
      default: () => {
        return [];
      },
    },
    number: {
      type: String,
      default: () => {
        return 9999;
      },
    },
  },
  setup(props, context) {
    const newDatas = computed(() => {
      return props.datas;
    });
    const toPage = (item: any) => {
      uni.navigateTo({
        url: `/pagesE/dailyActivity/dailyActivityDetail?activityCode=${item.activityCode}`,
      });
    };
    return {
      toPage,
      newDatas,
    };
  },
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");

.ui_activityGroup {
  .product-group {
    .tl {
      padding: 0 16px;
      line-height: 1;
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      font-family: "PingFang SC";
    }

    .product-box {
      background: #fff;
      margin: 12px 16px 0;
      border-radius: 8px;
      overflow: hidden;

      .product-swiper {
        position: relative;
        height: 258px;
        width: 100%;
        overflow: hidden;

        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .product-labs {
          display: flex;
          position: absolute;
          left: 8px;
          top: 8px;

          .product-lab {
            padding: 4px;
            background: rgba(0, 0, 0, 0.9);
            border-radius: 4px;
            color: #ffdf8c;
            font-size: 12px;
            line-height: 1;
            margin-right: 3px;
          }

          .product-lab2 {
            display: flex;
            padding: 4px;
            background: rgba(164, 49, 39, 0.9);
            border-radius: 4px;
            color: #fff;
            font-size: 12px;
            line-height: 1;
            margin-right: 3px;

            .icon-a-12_xinpin {
              font-size: 12px;
              margin-right: 3px;
            }
          }
        }
      }

      .product-info {
        padding: 12px;

        .product-name {
          font-family: "PingFang SC";
          font-weight: bold;
          font-size: 16px;
          line-height: 1;
          height: 1;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          color: @tl-black;
        }

        .product-sub-tl {
          margin-top: 8px;
          color: @tl-black;
          font-size: 12px;
          line-height: 18px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
        }

        .desc {
          margin-top: 12px;
          font-size: 12px;
          line-height: 18px;
          color: @text-color;
        }

        .product-info-labs {
          display: flex;
          flex-wrap: wrap;

          .product-info-lab {
            margin-top: 8px;
            white-space: nowrap;
            margin-right: 4px;
            background: rgba(164, 49, 39, 0.12);
            border-radius: 4px;
            color: #a43127;
            padding: 4px;
            font-size: 12px;
          }
        }

        .product-price {
          margin-top: 20px;
          font-family: "Montserrat";
          color: #000000;
          font-weight: 600;
          font-size: 18px;
          line-height: 1;
          height: 1;

          .unit {
            display: inline;
            color: @text-color;
            font-size: 12px;
            font-weight: 400;
          }
        }
      }
    }

    .product-group-scroll {
      margin-top: 12px;
      overflow-x: auto;
      white-space: nowrap;

      .product-box-mini {
        display: inline-block;
        background: #fff;
        margin: 0 4px 0;
        border-radius: 8px;
        overflow: hidden;
        width: 166px;

        &:first-child {
          margin-left: 16px;
        }

        &:last-child {
          margin-right: 16px;
        }

        .product-img {
          width: 100%;
          height: 220px;

          .img {
            width: 100%;
            height: 100%;
          }
        }

        .product-info {
          padding: 12px;

          .product-name {
            font-family: "PingFang SC";
            font-weight: bold;
            font-size: 16px;
            line-height: 1;
            height: 1;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            white-space: normal;
            color: @tl-black;
          }

          .product-sub-tl {
            margin-top: 8px;
            color: @text-color;
            font-size: 12px;
            line-height: 1;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;
            white-space: normal;
          }

          .product-price {
            margin-top: 20px;
            font-family: "Montserrat";
            color: @tl-black;
            font-weight: 600;
            font-size: 18px;
            line-height: 1;
            height: 1;

            .unit {
              display: inline;
              color: @text-color;
              font-size: 12px;
              font-weight: 400;
            }
          }
        }
      }
    }

    .more-btn {
      margin: 24px auto 0;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      width: 136px;
      height: 38px;
      border: 0.5px solid #cccccc;
      border-radius: 170px;
      font-size: 14px;
      color: #000;
    }
  }
}
</style>
