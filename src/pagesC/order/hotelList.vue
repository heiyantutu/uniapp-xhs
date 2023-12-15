<template>
  <div class="ui_hotelList">
    <!-- #ifdef MP -->
    <coustom-head title="搜索结果" nativeMode=true>
    </coustom-head>
    <!-- #endif -->
    <div class="top-warp">
      <div class="topBox">
        <div class="searchBox">
          <div class="searchItem" @click="showDestination">
            <i class="icon iconfont icon-a-12_dingwei"></i>
            <p class="searchDesc">{{ rendezvousName ? rendezvousName : "全部" }}</p>
          </div>
          <div class="searchItem" @click="showCalendar">
            <i class="icon iconfont icon-a-12_riqi"></i>
            <p class="searchDesc">{{ timeFilterMD2(fromDate) }}-{{ timeFilterMD2(toDate) }} 住{{ zday }}晚</p>
          </div>
        </div>
      </div>
    </div>
    <div class="hotelListBoxWrapper">
      <div class="hotelListBox" v-if="travelList.length > 0">
        <p class="listTitle">酒店套餐</p>
        <div class="hotelList">
          <div class="hotelWrapper" v-for="(travelItem, travelItemIndex) in travelList" :key="travelItemIndex">
            <travel-item v-if="travelItem.isShow" :travelItem="travelItem" @chooseItem="chooseTravel"></travel-item>
          </div>
        </div>
        <div class="seeMore" @click="toggleSta" :class="{ moreSta: moreSta }" v-if="isShowMore">{{ moreSta ? '收起' : '展开'
        }}更多套餐 <i class="icon iconfont icon-a-16_xialajiantou_hei"></i></div>
      </div>
    </div>
    <div class="hotelListBoxWrapper">
      <div class="hotelListBox">
        <p class="listTitle">酒店列表</p>
        <hotel-list :hotels="hotels" :fromDate="fromDate" :toDate="toDate" :otaChannel="otaChannel"></hotel-list>
        <!-- <div class="hotelList">
          <div class="hotelWrapper" v-for="(hotel, hotelIndex) in hotels" :key="hotelIndex" @click="goHotel(hotel)">
            <div class="hotel">
              <img :src="hotel.extraLogo" alt="" class="logo" mode="aspectFit">
              <div class="hotelInfo">
                <p class="hotelName">{{ hotel.descript }}</p>
                <p class="subTitle">{{ hotel.gcHotelPicTag }}</p>
                <div class="line">
                  <div class="tag" v-for="(tag, tagIndex) in hotel.promotionTags" :key="tagIndex">{{ tag }}</div>
                </div>
                <p class="price" v-if="hotel.roomAvailable !== 'false'"><span
                    class="money">¥{{ hotel.priceMin }}</span>/起
                </p>
                <p class='price' v-if="hotel.roomAvailable == 'false' || hotel.priceMin == '-1'">满房</p>
              </div>
            </div>
          </div>
        </div> -->
        <empty tips="暂无酒店" v-if="hotels.length == 0 && !isAjax&&isLoad"></empty>
        <p class="moreHotel" v-if="totalRows == hotels.length">更多产品敬请期待</p>
        <banner-swiper showLocation="6"></banner-swiper>
      </div>
    </div>
    <calendar ref="calendarCompent" @change-date="changeDate" :checkInDay="fromDate" :checkOutDay="toDate"></calendar>
    <bottom-dialog ref="destination" title="旅行目的地" maxDialog=true>
      <div class="destination">
        <destination-box @search="chooseDictionary" :dictionaryCode="dictionaryCode"
          :isAutoChooseCity="isAutoChooseCity" ref="dictionaryBox"></destination-box>
      </div>
    </bottom-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import calendar from "@/components/calendar.vue";
import destinationBox from "@/components/destinationBox.vue";
import bottomDialog from "@/components/bottomDialog.vue";
import travelItem from "@/components/travelItem.vue";
import hotelList from "@/components/hotelList.vue";
import dayjs from "dayjs";
import { timeFilterMD2 } from "@/utils/filter";
import { goPage } from "@/utils/utils";
import { onLoad, onReachBottom } from "@dcloudio/uni-app";
import empty from "@/components/empty.vue";
import bannerSwiper from "@/components/bannerSwiper.vue";
import defaultOtaChannel from "@/utils/defaultOtaChannel";
import coustomHead from "@/components/coustomHead.vue";
import useScroll from "@/hooks/useScroll";
const { scrollTop, onPageScroll } = useScroll();

let config = getStorage("config");
let user = getStorage("user");
let fromDate = ref(dayjs().format("YYYY-MM-DD"));
let toDate = ref(dayjs().add(1, "days").format("YYYY-MM-DD"));
let dictionaryBox = ref();
let otaChannel = ref(defaultOtaChannel);
let isLoad = ref(false);
let zday = computed(() => {
  let arr = dayjs(fromDate.value);
  let dep = dayjs(toDate.value);
  let zday = dep.diff(arr, "d");
  return zday;
});
let cityCode = ref("");
let cityName = ref("");
let rendezvousName = ref("");
let rendezvous = ref("");
let hotels = ref<any>([]);
let travelList = ref<any>([]);
const calendarCompent = ref();
const destination = ref();
let isAutoChooseCity = ref(false);
let isShowMore = ref(false);
let moreSta = ref(false);
let totalRows = ref(1);
let isAjax = ref(false);
let pageSize = ref(15);
let firstResult = ref(0);
let position = ref("relative");
let navigationBarHeight = ref(40);
onLoad((options) => {
  console.log("onLoad生命周期");
  if (options && options.cityName) {
    cityName.value = options.cityName;
  }
  if (options && options.cityCode) {
    cityCode.value = options.cityCode;
  }
  if (options && options.rendezvousName) {
    rendezvousName.value = options.rendezvousName;
  }
  if (options && options.rendezvous) {
    rendezvous.value = options.rendezvous;
  }
  if (options && options.fromDate) {
    fromDate.value = options.fromDate;
  }
  if (options && options.toDate) {
    toDate.value = options.toDate;
  }
  if (options && options.otaChannel) {
    otaChannel.value = options.otaChannel;
  }
});
const chooseTravel = (item: AnyObject) => {
  console.log(item.hotelCodes);
  uni.navigateTo({
    url: `/pagesB/travel/travelDetail?travelGroupCode=${item.travelGroupCode}`,
  });
};
const showDestination = () => {
  destination.value.showDialog();
  dictionaryBox.value.updataHis();
};
const chooseDictionary = (val: any) => {
  console.log(val);
  cityCode.value = val.cityCode;
  cityName.value = val.cityDesc;
  rendezvousName.value = val.dictionaryDesc;
  rendezvous.value = val.dictionaryCode;
  destination.value.hideDialog();
  getAllProductNew();
};
const changeDate = (time: any) => {
  fromDate.value = time.checkInDay;
  toDate.value = time.checkOutDay;
  getAllProductNew();
};

const showCalendar = () => {
  calendarCompent.value.showDialog();
};
const getHotelList = () => {
  if (hotels.value.length >= totalRows.value) {
    return false;
  }
  var findHotelParameter = {
    fromDate: fromDate.value,
    toDate: toDate.value,
    otaChannel: otaChannel.value,
    hotelGroupCodes: config.hotelGroupCode,
    cardLevel: "",
    hasPriceMin: "T",
    city: cityCode.value,
    clientLatitude: "",
    clientLongitude: "",
    position: "",
    positionValue: "",
    keyWord: "",
    radius: "3000000",
    pageSize: pageSize.value,
    firstResult: firstResult.value,
    cardType: "",
    appid: config.appid,
    componentAppid: config.componentAppid,
    memberNo: "",
  };
  if (user && user.memberId) {
    findHotelParameter.cardLevel = user.cardLevel;
    findHotelParameter.cardType = user.cardType;
    findHotelParameter.memberNo = user.cardNo;
  }
  if (cityCode.value == "") {
    findHotelParameter.radius = "";
  }
  if (
    !(findHotelParameter.clientLatitude && findHotelParameter.clientLongitude)
  ) {
    findHotelParameter.radius = "";
  }
  if (isAjax.value) {
    return false;
  }
  isAjax.value = true;
  console.log(findHotelParameter);
  api
    .findHotel(findHotelParameter)
    .then(function (response: any) {
      isAjax.value = false;
      if (response.result == 1) {
        response.retVal.resultInfos.forEach(function (n: any, i: number) {
          if (!n.pictures) {
            n.picturesList = [];
          } else {
            n.picturesList = n.pictures.split(";");
          }
          if (!n.promotionTag) {
            n.promotionTags = [];
          } else {
            n.promotionTags = n.promotionTag.split(",");
          }
          if (n.themeName) {
            n.promotionTags = n.promotionTags.concat(n.themeName.split(","));
          }
          if (n.promotionTags.length > 3) {
            n.promotionTags = n.promotionTags.slice(0, 3);
          }
          if (n.distance > 1000) {
            n.distance = (n.distance / 1000).toFixed(2);
            n.distanceUnit = "公里";
          } else {
            n.distanceUnit = "米";
          }
          n.gcHotelPicTag = "";
          if (n.gcHotelPicTags.length > 0) {
            var gcHotelPicTags = n.gcHotelPicTags.filter((item: any) => {
              return item.type == "08";
            });
            console.log(gcHotelPicTags);
            if (gcHotelPicTags.length > 0) {
              n.gcHotelPicTag = gcHotelPicTags[0].descript;
            }
          }
        });
        hotels.value = hotels.value.concat(response.retVal.resultInfos);
        firstResult.value += pageSize.value;
        totalRows.value = response.retVal.totalRows;
        isLoad.value = true;
      }
    })
    .catch(function (error: any) {
      isAjax.value = false;
      console.log(error);
    });
};
const travelProductList = () => {
  let obj = {
    beginDate: fromDate.value,
    endDate: toDate.value,
    cardLevel: "",
    companyLevel: "",
    cardType: "",
    category: "",
    categorySub: "",
    companyCode: "",
    gcLevel: "",
    ota: "",
    otaChannel: "WECHAT",
    dayNight: "",
    rendezvous: rendezvous.value,
    travelGroupCode: "",
    travelType: "",
    hotelCode: config.hotelCode,
    hotelGroupCode: config.hotelGroupCode,
    unitCode: config.hotelGroupCode,
  };
  if (user && user.memberId) {
    obj.cardLevel = user.cardLevel;
    obj.companyLevel = user.companyLevel;
    obj.cardType = user.cardType;
  }
  api.travelProductList(obj).then((res: any) => {
    if (res.result == 0) {
      let tripList = res.retVal;
      tripList.forEach((n: any, i: number) => {
        n.isShow = false;
        if (i == 0) {
          console.log(1);
          n.isShow = true;
        }
      });
      travelList.value = tripList;
      if (travelList.length > 1) {
        isShowMore.value = true;
      }
    }
  });
};
const toggleSta = () => {
  moreSta.value = !moreSta.value;
  if (moreSta.value) {
    travelList.value.forEach((n: any) => {
      n.isShow = true;
    });
  } else {
    travelList.value.forEach((n: any, i: number) => {
      n.isShow = false;
      if (i == 0) {
        console.log(1);
        n.isShow = true;
      }
    });
  }
};
const getAllProductList = () => {
  travelProductList();
  getHotelList();
};
const goHotel = (hotel: any) => {
  uni.navigateTo({
    url: `/pagesC/order/hotel?hotelCode=${hotel.code}&fromDate=${fromDate.value}&toDate=${toDate.value}&otaChannel=${otaChannel.value}`,
  });
};
onMounted(() => {
  console.log("onMounted生命周期");
  uni.getSystemInfo({
    success: (res) => {
      navigationBarHeight.value =
        (res.statusBarHeight || 0) + navigationBarHeight.value;
    },
    fail(err) {
      console.log(err);
    },
  });
  getAllProductList();
  setTimeout(() => {
    calendarCompent.value.init({
      checkInDay: fromDate.value,
      checkOutDay: toDate.value,
    });
  }, 500);
});
const getAllProductNew = () => {
  totalRows.value = 1;
  firstResult.value = 0;
  hotels.value = [];
  getAllProductList();
};
onReachBottom(() => {
  getHotelList();
});
onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});
</script>

<style lang="less" scoped>
.ui_hotelList {
  padding-bottom: 50px;
  .ad {
    height: 82px;
    width: calc(~"100vw - 32px");
    margin: 0 auto;
  }
  .destination {
    padding-bottom: 40px;
    height: calc(100vh - 160px);
  }
  .moreHotel {
    color: #ccc;
    font-size: 14px;
    margin: 30px 0;
    text-align: center;
    position: relative;
    &::before {
      content: "";
      width: 40px;
      height: 1px;
      background: #ccc;
      position: absolute;
      left: 50px;
      top: 10px;
    }
    &::after {
      content: "";
      width: 40px;
      height: 1px;
      background: #ccc;
      position: absolute;
      right: 50px;
      top: 10px;
    }
  }
  .seeMore {
    color: #000;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
    margin-top: 24px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    .iconfont {
      transition: all 0.5s;
    }

    &.moreSta {
      .iconfont {
        transform: rotate(180deg);
      }
    }
  }

  .hotelListBoxWrapper {
    padding: 0 16px;

    .hotelListBox {
      .listTitle {
        font-size: 18px;
        color: #000000;
        font-weight: 500;
        margin-top: 16px;
        margin-bottom: 24px;
      }

      /* .hotelList {
        .hotel {
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 12px;

          .logo {
            width: 100%;
            height: 258px;
          }

          .hotelInfo {
            padding: 10px 12px;

            .hotelName {
              font-size: 16px;
              color: #000000;
              font-weight: bold;
              margin-bottom: 9px;
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
              padding: 2px;
              margin-right: 3px;
              border-radius: 4px;
            }

            .price {
              font-size: 12px;
              color: #808080;

              .money {
                font-size: 18px;
                color: #000000;
                font-weight: bold;
              }
            }
          }
        }
      } */
    }
  }
  .top-warp {
    height: 62px;

    background: #ffffff;
  }
  .topBox {
    position: fixed;
    z-index: 9;
    width: 100%;
    height: 62px;
    padding: 12px 16px;
    background: #ffffff;

    .searchBox {
      background: #f8f8f8;
      height: 38px;
      display: flex;
      align-items: center;
      border-radius: 4px;
      .searchItem {
        flex: 1;
        height: 100%;
        padding-left: 16px;
        align-items: center;
        color: #000000;
        display: flex;
        position: relative;

        &:first-of-type {
          &::after {
            content: "";
            left: 100%;
            top: 9px;
            position: absolute;
            width: 1px;
            height: 20px;
            background: #ededed;
          }
        }

        .iconfont {
          font-size: 14px;
          margin-right: 5px;
        }

        .searchDesc {
          font-size: 14px;
          position: relative;

          &:after {
            content: "";
            border-top: 4px solid transparent;
            border-right: 4px solid #000000;
            border-bottom: 0;
            border-left: 0;
            position: absolute;
            bottom: 5px;
            right: -5px;
          }
        }
      }
    }
  }
}
</style>
