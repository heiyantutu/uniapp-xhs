<template>
  <div
    class="theme_ui"
    :style="{ overflow: expand && showInfo ? 'hidden' : '' }"
  >
    <coustom-head
      :title="expand ? '桃花节' : scrollTop > 150 ? '桃花节' : ''"
      :color="scrollTop > 150 ? '#000' : '#fff'"
      :bgColor="scrollTop > 150 ? '#fff' : ''"
      :backFilter="showMbl ? 'blur(10px)' : ''"
      style="z-index: 1001"
    ></coustom-head>
    <!-- <scroll-view  @touchmove="itemTouchMove($event)" @touchstart="itemTouchStart($event)" class="header" id="topContent" -->
    <scroll-view
      scroll-y="true"
      @scroll="scroll"
      class="header"
      id="topContent"
      :class="{ 'header-expand': showInfo }"
      :style="{
        'padding-top': expand && showInfo ? '84px' : '',
        background: `url(${pageData.background})`,
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
        'background-position': 'center',
      }"
    >
      <section
        class="header-content"
        @touchstart="onTouchStart2"
        @touchmove="onTouchMove2"
        @touchend="onTouchEnd2"
        :class="{ blur: showMbl }"
        :style="{ 'padding-top': showInfo && !expand ? '370px' : '' }"
      >
        <div class="labels">
          <div class="label" v-for="(item, index) in tagList" :key="index">
            {{ item }}
          </div>
        </div>
        <div class="tl">{{ pageData.activityName }}</div>
        <div class="desc">
          <div class="content" :class="{ expand: showInfo }">
            <div v-html="pageData.description" v-if="!expand"></div>
            <mp-html
              v-else
              :content="pageData.description"
              class="infoText"
            ></mp-html>
            <!-- <div v-html="pageData.description"></div> -->
            <!-- 藏东南的春天，以桃花初绽为讯。植物吸取天土的力量后，在阳光、风和兩雾中壮大。桃花以雪山、
					川流和村庄为背景渐次盛开。在纯透的光线中，旷野与心境相互渗透，草木山石一切历然，人会感受到某种像本性一样美好真实的事物。
					高原的桃花势必与众不同。野生桃花树干高大粗壮，开花时还末长叶，虬枝繁花，在高对比度的光线下愈加明丽动人。花色路显冷调，更显脆弱之美。藏地桃花以朴素、繁盛、磅磚的姿态，与大河相映，与马兽成趣，开在庙宇、田间、山谷里。在这些藏地秘境里，无论是一棵桃花还是十里桃花，省独一无二。
					藏东南的春天，以桃花初绽为讯。植物吸取天土的力量后，在阳光、风和兩雾中壮大。桃花以雪山、
					川流和村庄为背景渐次盛开。在纯透的光线中，旷野与心境相互渗透，草木山石一切历然，人会感受到某种像本性一样美好真实的事物。
					高原的桃花势必与众不同。野生桃花树干高大粗壮，开花时还末长叶，虬枝繁花，在高对比度的光线下愈加明丽动人。花色路显冷调，更显脆弱之美。藏地桃花以朴素、繁盛、磅磚的姿态，与大河相映，与马兽成趣，开在庙宇、田间、山谷里。在这些藏地秘境里，无论是一棵桃花还是十里桃花，省独一无二。
					藏东南的春天，以桃花初绽为讯。植物吸取天土的力量后，在阳光、风和兩雾中壮大。桃花以雪山、
					川流和村庄为背景渐次盛开。在纯透的光线中，旷野与心境相互渗透，草木山石一切历然，人会感受到某种像本性一样美好真实的事物。
					高原的桃花势必与众不同。野生桃花树干高大粗壮，开花时还末长叶，虬枝繁花，在高对比度的光线下愈加明丽动人。花色路显冷调，更显脆弱之美。藏地桃花以朴素、繁盛、磅磚的姿态，与大河相映，与马兽成趣，开在庙宇、田间、山谷里。在这些藏地秘境里，无论是一棵桃花还是十里桃花，省独一无二。 -->
          </div>
        </div>
        <div class="open-btn" @click="infoChange">
          {{ showInfo ? "收起 ↑" : "展开 ↓" }}
        </div>
        <div class="fadeBg"></div>
      </section>
    </scroll-view>
    <div
      class="product-group"
      v-bind:class="{ down: showInfo && !expand, full: expand && showInfo }"
    >
      <div class="wrap-top">
        <div
          class="line"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <!-- <div v-if="!expand && showInfo">
            <img
              class="img"
              alt="向上箭头"
              src="https://website-10049437.cos.ap-shanghai.myqcloud.com/5dd38cba-57d7-4a9b-abd6-3b7b53f0b5a1"
            />
          </div>
          <div v-else-if="expand && showInfo">
            <img
              class="img"
              alt="向下箭头"
              src="https://website-10049437.cos.ap-shanghai.myqcloud.com/6e89ce42-5f0c-4774-a1dc-64cdbd0d17f1"
            />
          </div> -->
          <div class="rect-wrap">
            <div class="rect"></div>
          </div>
        </div>
        <div class="tl">相关产品</div>
      </div>

      <view
        class="ui_productGroup"
        :style="{ overflow: expand && showInfo ? 'auto' : '' }"
      >
        <div class="product-group">
          <div
            class="product-box"
            @click="toPage(item)"
            v-for="(item, i) in productList"
            :key="i"
          >
            <div class="product-swiper">
              <div class="product-labs">
                <div class="product-lab" v-if="item.categoryDesc">
                  {{ item.categoryDesc }}
                </div>

                <!-- <div class="product-lab2">
									<i class="icon-a-12_xinpin iconfont"></i>
									新品
								</div> -->
              </div>

              <img
                class="product-img"
                :src="
                  item.urls +
                  '?imageView2/1/w/343/h/258&x-oss-process=image/resize,m_fill,w_343,h_258'
                "
                v-if="item.urls"
              />
            </div>
            <div class="product-info">
              <div class="product-name">
                {{ item.title }}
              </div>
              <div class="product-sub-tl">
                <div class="three-tl">{{ item.sketch }}</div>
              </div>
              <div class="desc">
                <mp-html :content="item.introduce"></mp-html>
                <!-- {{ item.introduce }} -->
              </div>
              <div class="product-info-labs">
                <div
                  class="product-info-lab"
                  v-if="item.tagApiDtos"
                  v-for="(tag, j) in item.tagApiDtos"
                  :key="j"
                >
                  {{ tag.tageDesc || tag.descript }}
                </div>
              </div>
              <div
                class="product-price"
                v-if="!item.payType || item.payType != 'mix'"
              >
                <div v-if="item.minPrice==-1">满房</div>
                <div v-else>
                  ¥{{ Number(item.minPrice).toFixed(2) }}
                  <div class="unit">/人起</div>
                </div>
              </div>
              <div class="product-price" v-else-if="item.payType == 'mix'">
                <div v-if="item.minPrice==-1">满房</div>
                <div v-else>
                  {{ item.credit }}积分+¥{{
                    item.minPrice ? Number(item.minPrice).toFixed(2) : "0"
                  }}
                  <div class="unit">/人起</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import api from "@/utils/api";
import productGroup from "@/components/productGroup.vue";
import coustomHead from "@/components/coustomHead.vue";
import { getStorage } from "@/utils/wxuser";
import { jAlert3 } from "@/base/jAlert/jAlert";
import useScroll from "@/hooks/useScroll";
import { onLoad } from "@dcloudio/uni-app";
import { getMaxWidthContent } from "@/utils/utils";

onLoad((options: any) => {
  id.value = options.id;
});

let user = getStorage("user");
let config = getStorage("config");
const id = ref("");
let showInfo = ref(false);
let showMbl = ref(false); //毛玻璃效果
let expand = ref(false); //下方内容是否上拉
let pageData: any = reactive({});
let tagList = ref([]);
let productList: any = ref([]);

let startY = ref(0);
let moveY = ref(0);
let startY2 = ref(0);
let moveY2 = ref(0);
// 监听触摸开始事件
const onTouchStart = (e: any) => {
  startY.value = e.touches[0].clientY;
  moveY.value = 0;
};
const onTouchStart2 = (e: any) => {
  startY2.value = e.touches[0].clientY;
  moveY2.value = 0;
};
// 监听触摸移动事件
const onTouchMove = (e: any) => {
  const moveYDis = e.touches[0].clientY - startY.value;
  moveY.value = moveYDis;
};
const onTouchMove2 = (e: any) => {
  const moveYDis = e.touches[0].clientY - startY2.value;
  moveY2.value = moveYDis;
};

// 监听触摸结束事件
const onTouchEnd = (e: any) => {
  const moveYDis = moveY.value;
  if (moveYDis < 0) {
    //向上滑
    console.log("向上");
    console.log(expand.value, "expand.value");
    console.log(showInfo.value, "showInfo.value");
    if (!expand.value && !showInfo.value) {
      expand.value = true;
      showInfo.value = true;
    } else if (!expand.value && showInfo.value) {
      expand.value = false;
      showInfo.value = false;
    } else if (expand.value && !showInfo.value) {
      expand.value = true;
      showInfo.value = true;
    }
  } else if (moveYDis > 0) {
    //向下滑
    console.log("向下");
    console.log(expand.value, "expand.value");
    console.log(showInfo.value, "showInfo.value");

    if (!expand.value && !showInfo.value) {
      showInfo.value = true;
    } else if (expand.value) {
      expand.value = false;
      showInfo.value = false;
    }
  }
};
const onTouchEnd2 = (e: any) => {
  const moveYDis = moveY2.value;
  console.log(55555);
  if (moveYDis < 0) {
    //向上滑
    console.log("上部分向上滑");
    console.log(expand.value, "expand.value");
    console.log(showInfo.value, "showInfo.value");
    // if (expand.value && !showInfo.value) {
    //   showInfo.value = true;
    //   expand.value = false
    // }
  } else if (moveYDis > 0) {
    //向下滑
    console.log("上部分向下滑");
    console.log(expand.value, "expand.value");
    console.log(showInfo.value, "showInfo.value");

    if (!expand.value && !showInfo.value) {
      showInfo.value = true;
      expand.value = false;
    } else if (expand.value && !showInfo.value) {
      showInfo.value = true;
      expand.value = false;
    }
  }
};
const scroll = (e: any) => {
  let scrollTop = e.detail.scrollTop;

  if (scrollTop > 100) {
    showMbl.value = true;
  } else {
    showMbl.value = false;
  }
};

const { scrollTop, onPageScroll } = useScroll();

const infoChange = () => {
  showInfo.value = !showInfo.value;
  expand.value = false;
};
const onExpand = () => {
  expand.value = true;
  showInfo.value = true;
  showMbl.value = true;
};
const onClose = () => {
  expand.value = false;
  showMbl.value = false;
  showInfo.value = false;
};
const toggleShowFullScreen = (sta: boolean) => {
  console.log(sta);

  expand.value = sta;
  showInfo.value = sta;
  showMbl.value = sta;
};
const getData = async () => {
  if(!user) {
    user = {}
  }
  let obj = {
    firstResult: 0,
    pageSize: 100,
    id: id.value || "",
    channel: "WECHAT",
    mobile: user.mobile,
    memberId: user.memberId,
  };
  api.marketingActivityPage(obj).then(async (res: any) => {
    if (res.result == 0) {
      if (res.retVal && res.retVal.datas && res.retVal.datas.length > 0) {
        let content = res.retVal.datas[0].description;
        if (content) {
          const maxWidthContent = getMaxWidthContent(content);
          res.retVal.datas[0].description = maxWidthContent;
        }
        pageData = res.retVal.datas[0] || {};
        if (pageData.limitNode === "activity") {
          try {
            let data = await api.checkWhitelist({
              hotelGroupCode: config.hotelGroupCode,
              activityId: id.value,
              channel: "WECHAT",
              mobile: user.mobile,
            });
            if (data.result == 1) {
              if (data.retVal.result == "F") {
                jAlert3(data.retVal.msg, 2000);
                // return;
              }
            } else {
              jAlert3(data.msg, 2000);
            }
          } catch (e) {
            console.log(e);
          }
        }
        console.log(pageData);
        tagList.value = pageData.tags.split(",");
        let postObj = {
          hotelGroupCode: config.hotelGroupCode,
          hotelCode: config.hotelCode,
          id: id.value,
        };
        api.listMarketingProducts(postObj).then((res: any) => {
          console.log(res, "6666");
          if (res.result == 0) {
            let retVal = res.retVal;
            retVal.forEach((item: any) => {
              item.urls = item.pics;
              item.sketch = item.minComposition
                ? item.secondTitle + ` | ${item.minComposition}人成团`
                : item.secondTitle;
              item.tagApiDtos = item.gcHotelPicTags.length
                ? item.gcHotelPicTags
                : "";
              item.type = item.productType;
              item.credit = item.points;
              item.minPrice = item.price;
              // payType包含INTEGRALCASH就显示积分+金额
              if (item.minPriceDto) {
                item.payType = item.minPriceDto.payType.includes("INTEGRALCASH")
                  ? "mix"
                  : "money";
                item.minPrice = item.minPriceDto.mixPrice || 0;
                item.credit = item.minPriceDto.mixCredit;
              }
            });
            productList.value = retVal;
          }
        });
        return;
        const products = JSON.parse(pageData.products || "[]");
        productList.value = [];
        let hotelList: any = [];
        let tdqList: any = [];
        let travelList: any = [];
        let dailyList: any = [];
        products.forEach((item: any) => {
          if (item.type == "hotel") hotelList.push(item);
          if (item.type == "tdq") tdqList.push(item);
          if (item.type == "travel") travelList.push(item);
          if (item.type == "daily") dailyList.push(item);
        });
        let hotelIds = hotelList.length
          ? hotelList.map((item: any) => item.productId).join(",")
          : "";
        let tdqIds = tdqList.length
          ? tdqList.map((item: any) => item.productId).join(",")
          : "";
        if (hotelIds) {
          api
            .pageHotelListForApp({
              ids: hotelIds,
              hotelGroupCodes: config.hotelGroupCode,
              hotelCode: config.hotelCode,
              otaChannel: "WECHAT",
            })
            .then((res: any) => {
              if (res.result == 0 && res.retVal.datas.length) {
                res.retVal.datas.forEach((data: any) => {
                  data.urls = data.pictures ? data.pictures.split(";")[0] : "";
                  data.title = data.descript;
                  data.sketch = data.address;
                  data.introduce = data.remark;
                  data.tagApiDtos = data.gcHotelPicTags;
                  data.minPrice = data.priceMin;
                  data.type = "hotel";
                });
                productList.value.push(...res.retVal.datas);
              }
            });
        }
        api.shopGoodsPage({ ids: tdqIds, onUnSale: "0" }).then((res: any) => {
          if (res.result == 0 && res.retVal.length) {
            res.retVal.forEach((data: any) => {
              data.urls = data.pictureUrl ? data.pictureUrl.split(",")[0] : "";
              data.title = data.name;
              data.sketch = data.address;
              data.introduce = data.secondTitle;
              data.minPrice = data.price;
              data.type = "tdq";
            });
            productList.value.push(...res.retVal);
          }
        });
        api
          .travelProductList({
            hotelGroupCode: config.hotelGroupCode,
            hotelCode: config.hotelCode,
          })
          .then((res: any) => {
            let retVal = res.retVal;
            if (res.result == 0) {
              retVal.forEach((data: any) => {
                data.urls =
                  data.urls && data.urls.length ? data.urls[0].url : "";
                data.minPrice = data.startingPrice;
                data.introduce = data.subtitle;
                data.sketch = data.sketch + ` | ${data.minComposition}人成团`;
                data.type = "travel";
              });
              retVal.forEach((item: any) => {
                travelList.forEach((utem: any) => {
                  if (item.travelGroupCode == utem.productId) {
                    productList.value.push(item);
                  }
                });
              });
            }
          });
        const obt = {
          query: {
            unitCode: "SONGTSAM-CS",
          },
          config: {
            interfaceModule: "GC_ACTIVITIES_CENTER",
            interfaceMethod: "/api/activity/list",
            interfaceFrom: "GC",
            hotelGroupCode: "SONGTSAM-CS",
            interfaceType: "GET",
          },
        };
        api.interfaceTransfer(obt).then((res: any) => {
          if (res.result == 1) {
            let data = res.retVal.retVal;
            if (data.length) {
              data.forEach((data: any) => {
                data.urls = data.indexPicture;
                data.title = data.name;
                data.sketch = data.classDescript;
                data.minPrice = data.minPriceDto.mixPrice || 0;
                data.credit = data.minPriceDto.mixCredit;
                data.description = data.introduce;
                data.type = "daily";
                // payType包含INTEGRALCASH就显示积分+金额
                data.payType = data.minPriceDto.payType.includes("INTEGRALCASH")
                  ? "mix"
                  : "money";
              });
            }
            data.forEach((item: any) => {
              dailyList.forEach((utem: any) => {
                if (item.activityCode == utem.productId) {
                  productList.value.push(item);
                }
              });
            });
            console.log(productList.value, "productList.value");
          }
        });
        setTimeout(() => {
          console.log(productList.value, "productList.value");
        }, 2000);
      }
    } else {
      jAlert3(res.msg, 2000);
    }
  });
};
const toPage = (data: any) => {
  console.log(data);
  if (data.type == "tdq") {
    uni.navigateTo({
      url:
        "/pagesB/exchangeCoupon/exchangeCouponDetail?id=" +
        data.productId +
        "&sourceActivityId=" +
        id.value +
        "&sourceActivityName=" +
        pageData.activityName,
    });
  } else if (data.type == "travel") {
    uni.navigateTo({
      url:
        "/pagesB/travel/travelDetail?travelType=" +
        data.travelType +
        "&sourceActivityId=" +
        id.value +
        "&sourceActivityName=" +
        pageData.activityName,
    });
  } else if (data.type == "hotel") {
    uni.navigateTo({
      url:
        "/pagesC/order/hotel?hotelCode=" +
        data.productId +
        "&sourceActivityId=" +
        id.value +
        "&sourceActivityName=" +
        pageData.activityName,
    });
  } else if (data.type == "daily") {
    uni.navigateTo({
      url:
        "/pagesE/dailyActivity/dailyActivityDetail?activityCode=" +
        data.productId +
        "&sourceActivityId=" +
        id.value +
        "&sourceActivityName=" +
        pageData.activityName,
    });
  } else if (data.type == "weimob") {
    uni.navigateToMiniProgram({
      appId: "wx5d94bb220d9d0234",
      path: `/ec_goods/detail?vid=0&productInstanceId=13545845204&id=${data.productId}`,
      success(res) {},
    });
  }
};
onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});
onMounted(() => {
  getData();
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");

.theme_ui {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .header {
    // background: url(https://website-10065452.cos.ap-shanghai.myqcloud.com/58fa7492-01ef-437f-a0a1-09754e8e06f1);
    // background-size: 100% auto;
    flex: 1;
    position: relative;
    .header-content {
      position: relative;
      transition: all 0.3s;
      padding: 200px 16px 74px;
      z-index: 9;
      &.blur {
        backdrop-filter: blur(10px);
      }
    }
    &.header-expand {
      height: calc(100vh - 100px);
      overflow-y: auto;
    }
    .labels {
      .label {
        display: inline-block;
        font-size: 12px;
        line-height: 1;
        padding: 4px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 4px;
        margin-right: 10px;
      }
    }

    .tl {
      margin-top: 12px;
      line-height: 1;
      font-family: "Source Han Serif CN";
      font-style: normal;
      font-weight: 900;
      font-size: 24px;
      color: #ffffff;
    }

    .desc {
      margin-top: 16px;
      font-size: 14px;
      line-height: 22px;
      color: #fff;

      .content {
        height: 44px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        white-space: normal;
        overflow: hidden;
        transition: all 0.3s ease-in-out;

        &.expand {
          height: auto;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: inherit;
        }
      }
    }

    .open-btn {
      margin-top: 16px;
      margin-bottom: 24px;
      color: #ffffff;
      line-height: 1;
      font-size: 13px;
      padding-left: 8px;
      border-left: 2px solid #fff;
      z-index: 999;
      position: relative;
    }
  }

  .product-group {
    position: relative;
    margin-top: -55px;
    padding-bottom: 20px;
    // border-radius: 24px 24px 0 0;
    background: #f8f8f8;
    // height: 55vh;
    transition: all 0.3s ease-in-out;
    z-index: 1000;
    flex: 1;
    .wrap-top {
      background: #f8f8f8;
      border-radius: 24px 24px 0 0;
      margin-top: -20px;
      position: relative;

      .line {
        position: absolute;
        width: 100%;
        height: 25px;
        border-radius: 4px;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        text-align: center;
        div {
          width: 100%;
        }
        .img {
          width: 22px;
          height: 22px;
        }
        .rect-wrap {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          .rect {
            width: 40px;
            height: 4px;
            border-radius: 100px;
            background-color: #ccc;
          }
        }
      }

      .tl {
        padding: 30px 16px 0;
        color: #000;
        font-weight: bold;
        font-size: 18px;
        line-height: 1;
        margin-bottom: 10px;
      }
    }
  }

  .down {
    height: 80px;
    flex: none !important;
  }

  .full {
    // position: absolute;
    // top: 156px;
    height: calc(100vh - 110px) !important;
    width: 100%;
    z-index: 100;
    flex: inherit;
  }
}

.ui_productGroup {
  padding-top: 70px;
  height: 100%;
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
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          white-space: normal;
          overflow: hidden;
        }

        .product-info-labs {
          margin-top: 8px;
          display: flex;
          flex-wrap: wrap;
          .product-info-lab {
            margin-right: 4px;
            background: rgba(164, 49, 39, 0.12);
            border-radius: 4px;
            color: #a43127;
            padding: 4px;
            font-size: 12px;
            margin-bottom: 10px;
          }
        }

        .product-price {
          margin-top: 20px;
          font-family: "Montserrat";
          color: #000000;
          font-weight: 600;
          font-size: 18px;
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

          // .product-name {
          //   font-family: "PingFang SC";
          //   font-weight: bold;
          //   font-size: 16px;
          //   line-height: 1;
          //   display: -webkit-box;
          //   -webkit-box-orient: vertical;
          //   -webkit-line-clamp: 1;
          //   overflow: hidden;
          //   white-space: normal;
          //   color: @tl-black;
          // }

          // .product-sub-tl {
          //   margin-top: 8px;
          //   color: @text-color;
          //   font-size: 12px;
          //   line-height: 1;
          //   display: -webkit-box;
          //   -webkit-box-orient: vertical;
          //   -webkit-line-clamp: 1;
          //   overflow: hidden;
          //   white-space: normal;
          // }

          .product-price {
            margin-top: 10px;
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
.infoText {
  color: #fff;
  font-size: 14px;
  line-height: 22px;
}

.fadeBg {
  transition: all 0.5s;
  height: 70px;
  background-image: linear-gradient(
    180deg,
    rgba(185, 120, 120, 1) 0%,
    #e28e92 100%
  );
  bottom: 70px;
  position: absolute;
  width: 100%;
  filter: blur(20px);
  opacity: 0.7;
  left: 0;
}
</style>