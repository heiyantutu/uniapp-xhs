<template>
  <!-- #ifdef MP -->
  <coustom-head
    title="松赞旅行"
    bgColor="#fff"
    v-if="scrollTop > 40"
  ></coustom-head>
  <!-- #endif -->
  
  <div class="travelList_ui">
    
    
    <div class="tabs">
      <div class="tabs_inner" v-if="fixed">
        <div v-if="typeList.length > 0" style="height: 40px"></div>
        <div v-if="tagList.length > 0" style="height: 44px"></div>
      </div>
      <div
        class="tabs_warp"
        :class="{ fixed: fixed }"
        :style="{ top: menuHeight + 'px' }"
      >
        <tabs
          ref="tabsRef"
          :datas="typeList"
          type="line"
          color="#A43127"
          titleInactiveColor="#808080"
          titleActiveColor="#000000"
          v-if="typeList.length > 0"
          flexNum="F"
          @clickTab="chooseType"
          :isAjax="isAjax"
        >
        </tabs>
        <tabs
          :datas="tagList"
          :init="false"
          canCancel
          type="fk"
          borderColor="#eee"
          borderActiveColor="#A43127"
          titleInactiveColor="#000000"
          flexNum="F"
          color="#000000"
          v-if="tagList.length > 0"
          @clickTab="chooseTag"
          :activeType="curTag"
        ></tabs>
      </div>
    </div>
    <product-group
      :datas="travelListNew"
      :number="curType.number"
      v-if="
        curType.type == 'ThemeGroup' ||
        curType.type == 'FreeTravel' ||
        curType.type == 'DestPackage' ||
        curType.type == 'ButlerCustomized'
      "
    ></product-group>
    <product-group
      :datas="filterShop"
      :number="curType.number"
      v-if="curType.type == 'TDQ'"
    ></product-group>
    <activity-group
      :datas="activityList"
      :number="curType.number"
      v-if="curType.type == 'DAILY'"
    ></activity-group>
    <hotel-list
      :hotels="filterHotels"
      :fromDate="fromDate"
      :toDate="toDate"
      :otaChannel="otaChannel"
      v-if="curType.type == 'HOTEL'"
      hotelListStyle="margin: 12px 16px 0"
    ></hotel-list>
    <div class="footer" v-if="footerAd.length > 0">
      <swiper-box
        :slides="footerAd"
        :swiperConfig="footerConfig"
        interval="5000"
      ></swiper-box>
      <!-- <image :src="footerAd.imgUrl" class="footer-img" mode="widthFix"></image> -->
    </div>
   
    <div class="logo">
      <img
        class="img"
        src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/indexLogo.png"
      />
    </div>
    <bottom-nav></bottom-nav>
    <bottom-dialog ref="destination" title="旅行目的地" maxDialog="true" >
      <div class="destination" v-if="isLoad">
        <destination-box
          ref="dictionaryBox"
          @search="chooseDictionary"
        ></destination-box>
      </div>
    </bottom-dialog>
    <bottom-dialog ref="filterComponent" title="住宿晚数">
      <div class="filterBox2">
        <radio-box
          :datas="days"
          ref="daysRadio"
          v-model:val="dayNight"
          dataKey="date"
        >
        </radio-box>
        <div class="bottomFilterBox">
          <div class="resetBtn" @click="resetting()">
            <i class="icon iconfont icon-a-20_zhongzhi"></i>
            <p class="resetDesc">重置</p>
          </div>
          <div class="finishBtn" @click="chooseDay()">完成</div>
        </div>
      </div>
    </bottom-dialog>

    <filter-fixed
      :tagList="tagList"
      :type="curType.type"
      @update="updateFilterVal"
      v-model:marketingActivityTag="marketingActivityTag"
      v-model:tag="curTag"
      v-model:theme="theme"
      ref="filterFixedRef"
    ></filter-fixed>
    <back-to-top></back-to-top>
    <calendar
      ref="calendarCompent"
      @change-date="changeDate"
      :checkInDay="fromDate"
      :checkOutDay="toDate"
    >
    </calendar>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, toRaw, } from "vue";
import api from "@/utils/api";

import { getStorage } from "@/utils/wxuser";
import { jAlert3 } from "@/base/jAlert/jAlert";
import notice from "@/components/notice.vue";
import swiperBox from "@/components/swiperBox.vue";
import bottomNav from "@/components/bottomNav.vue";
import tabs from "@/components/tabs.vue";
import productGroup from "@/components/productGroup.vue";
import activityGroup from "@/components/activityGroup.vue";
import hotelList from "@/components/hotelList.vue";
import bottomDialog from "@/components/bottomDialog.vue";
import backToTop from "@/components/backToTop.vue";
import coustomHead from "@/components/coustomHead.vue";
import useScroll from "@/hooks/useScroll";
import filterFixed from "@/components/filterFixed.vue";
import radioBox from "@/components/radioBox.vue";
import destinationBox from "@/components/destinationBox.vue";
import calendar from "@/components/calendar.vue";
import UmengSDK from "@/utils/umengAdaptor.js";
import defaultChannel from "@/utils/defaultChannel";
import defaultShopChannel from "@/utils/defaultShopChannel";
import { onShareAppMessage,onShow,onPullDownRefresh } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { timeFilterMD } from "@/utils/filter";
import { goPage } from "@/utils/utils";
const { scrollTop, onPageScroll } = useScroll();
let config = getStorage("config");
let user = getStorage("user") || {};
const calendarCompent = ref();
let dictionaryBox = ref();
let filterFixedRef = ref();
let isLoad = ref(false);
let fromDate = ref(dayjs().format("YYYY-MM-DD"));
let toDate = ref(dayjs().add(1, "days").format("YYYY-MM-DD"));
let zday = computed(() => {
  let arr = dayjs(fromDate.value);
  let dep = dayjs(toDate.value);
  let zday = dep.diff(arr, "d");
  return zday;
});
let tabsRef = ref();
let marketingActivityTag = ref("");
let channel = ref(defaultChannel);
let shopChannel = ref(defaultShopChannel);
const changeDate = (time: any) => {
  fromDate.value = time.checkInDay;
  toDate.value = time.checkOutDay;
};
const showCalendar = () => {
  calendarCompent.value.showDialog();
};
let adSwiperConfig = reactive({
  indicatorDots: false,
  circular: true,
  autoplay: true,
  dotPosStyle: "left: 50%;transform: translateX(-50%);bottom:8px;",
});
let footerConfig = reactive({
  indicatorDots: false,
  circular: true,
  autoplay: true,
  padding: true,
  dotPosStyle: "left: 50%;transform: translateX(-50%);bottom:8px;display:none;",
});
let slides:any = reactive({});
let curType: any = ref({});
let theme = ref("");
let curTag = ref("");
let tagList: any = ref([]);
let typeList: any = reactive([]);
let isAjax = ref(false);
let menuHeight = ref(0);
let noticeRef = ref()

let tagProductId: any = ref([]); //活动标签id合集
let requestObj: any = reactive({
  // beginDate: '',
  // endDate: '',
  cardLevel: user.cardLevel || "",
  companyLevel: user.companyLevel || "",
  cardType: user.cardType || "",
  category: "",
  categorySub: "",
  companyCode: "",
  gcLevel: "",
  ota: "",
  otaChannel: "WECHAT",
  dayNight: "",
  rendezvous: "",
  travelGroupCode: "",
  travelType: "",
  marketingId: "",
  hotelCode: "",
  hotelGroupCode: config.hotelGroupCode,
  unitCode: config.hotelGroupCode,
  tag: "",
});
const allTravelList: any = ref({});
const travelList: any = ref([]);
const activityListNew: any = ref([]);
const dayNightDate = ref("");
const dayNight = ref("");
const navHeight = ref(0);
const fixedTop = ref(0);
const header = ref({});
const footerAd: any = ref([]);
const shopGoodsList: any = ref([]);
//目的地窗口
const destination = ref();
//住宿晚数窗口
const filterComponent = ref();
//选中旅行,酒店
const selectType = ref("1");
const daysRadio = ref();
const fixed = ref(false);
const dictionary: any = ref({
  cityCode: "",
  cityDesc: "",
});
let productTypes = reactive([
  {
    name: "管家定制",
    productType: "ButlerCustomized",
  },
  {
    name: "自由行",
    productType: "FreeTravel",
  },
  {
    name: "主题团",
    productType: "ThemeGroup",
  },
  {
    name: "目的地套餐",
    productType: "DestPackage",
  },
  {
    name: "酒店",
    productType: "HOTEL",
  },
  {
    name: "日活动",
    productType: "DAILY",
  },
  {
    name: "通兑券",
    productType: "TDQ",
  },
]);
let otaChannel = ref("WECHAT");
let hotels = ref<any>([]);
onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
  const query = uni.createSelectorQuery();
  query.selectAll(".tabs").boundingClientRect();
  query.exec((res) => {
    if (res[0][0].top < navHeight.value + 44) {
      fixed.value = true;
    } else {
      fixed.value = false;
    }
  });
});
const updateFilterVal = (val: any) => {
  let type = curType.value.type;
  requestObj = Object.assign(requestObj, val);
  if (val.marketingActivityTag != marketingActivityTag.value) {
    marketingActivityTag.value = val.marketingActivityTag;
    queryProductsByMarketingTags();
  }
  if (
    val.theme != theme.value &&
    (type == "ButlerCustomized" ||
      type == "FreeTravel" ||
      type == "ThemeGroup" ||
      type == "DestPackage")
  ) {
    theme.value = val.theme;
    travelProductList();
  }
  // else {
  // 	if (curType.value.type != "TDQ") {
  // 		travelProductList();
  // 	}
  // }
};
const queryProductsByMarketingTags = () => {
  let type = curType.value.type;
  if (
    type == "ButlerCustomized" ||
    type == "FreeTravel" ||
    type == "ThemeGroup" ||
    type == "DestPackage"
  ) {
    type = "travel";
  }
  let opt = {
    hotelGroupCode: config.hotelGroupCode,
    hotelCode: config.hotelCode,
    productType: type.toLowerCase(),
    tags: marketingActivityTag.value,
  };
  api.queryProductsByMarketingTags(opt).then((res: any) => {
    if (res.result == 0) {
      tagProductId.value = [];
      res.retVal.forEach((item: any) => {
        tagProductId.value.push(item.productId);
      });
    }
  });
};
const tabType = (val: string) => {
  selectType.value = val;
};
const toSearch = () => {
   if (selectType.value == "1") {
    toPage(
      `/pagesB/travel/searchResult?rendezvousName=${dictionary.value.dictionaryDesc}&rendezvous=${dictionary.value.dictionaryCode}&dayNight=${dayNight.value}`
    );
  } else {
    toPage(
      `/pagesC/order/hotelList?cityName=${dictionary.value.cityDesc}&cityCode=${dictionary.value.cityCode}&fromDate=${fromDate.value}&toDate=${toDate.value}&rendezvousName=${dictionary.value.dictionaryDesc}&rendezvous=${dictionary.value.dictionaryCode}`
    );
  }
};
const chooseDictionary = (val: object) => {
  dictionary.value = val;
  destination.value.hideDialog();
};
const resetting = () => {
  daysRadio.value.clear();
};
const showDestination = () => {
  UmengSDK.sendPV({
    page_name: "search_pg",
  });
  destination.value.showDialog();
  dictionaryBox.value.updataHis();
};
const chooseTag = (val: any, index: number) => {
  curTag.value = val.id;
  goTab();
};
const chooseType = (val: any, index: number) => {
  curTag.value = "";
  marketingActivityTag.value = "";
  filterFixedRef.value.reset();
  curType.value = val;
  isAjax.value = true;
  tagList.value = [];
  theme.value = "";
  requestObj.theme = "";
  UmengSDK.sendEvent("bp_subject_clk", {
    page_name: "book_pg",
    card_name: val.name,
    card_id: val.type,
  });
  isAjax.value = false;
  if (
    curType.value.type == "ThemeGroup" ||
    curType.value.type == "FreeTravel" ||
    curType.value.type == "DestPackage" ||
    curType.value.type == "ButlerCustomized"
  ) {
    if (allTravelList.value[curType.value.type]) {
      travelList.value = allTravelList.value[curType.value.type];
      travelList.value.forEach((item: any) => {
        curType.value.items.forEach((goods: any) => {
          if (goods.dictionaryCode == item.travelGroupCode) {
            item.tag = goods.tag;
          }
        });

        let noTag = true;
        tagList.value.forEach((tag: any) => {
          if (tag.name == item.series) {
            noTag = false;
          }
        });
        if (noTag) {
          tagList.value.push({
            id: item.series,
            name: item.series,
          });
        }
      });
    } else {
      travelList.value = [];
    }
  }
  goTab();
 
};
const goTab = () => {
  var selector = ".tabs";
  uni.pageScrollTo({
    selector: selector,
    offsetTop: -94,
    complete: (res) => {},
  });
};
const showFilterComponent = () => {
  filterComponent.value.showDialog();
};
const toPage = (url: any) => {
  if (!url) {
    return;
  }
  goPage(url);
};

const chooseDay = () => {
  dayNightDate.value = dayNight.value;
  filterComponent.value.hideDialog();
};

const marketingPage = () => {
  let opt = {
    hotelGroupCode: config.hotelGroupCode,
    firstResult: 0,
    pageSize: 15,
    clientTypes: channel.value,
    showLocation: "0",
  };

  api.marketingPage(opt).then((res: any) => {
    if (res.result == 0) {
     
      typeList = []
      if (res.retVal && res.retVal.datas && res.retVal.datas.length > 0) {
        var datas = JSON.parse(res.retVal.datas[0].infos);
        if (datas.length > 0) {
          datas.forEach((item: any, i: number) => {
            productTypes.forEach((productType: any) => {
              if (productType.productType == item.type) {
                item.name = productType.name;
              }
            });
            var type = {
              id: i + 1,
              name: item.name,
              type: item.type,
              items: item.items,
              number: item.number,
            };
            typeList.push(type);
          });
          curType.value = typeList[0];
          allTravelProduct(() => {
            uni.stopPullDownRefresh()
            initTabs(curType.value.type);
          });
          getGoodsList(() => {
            initTabs(curType.value.type);
          });
          getActivityList(() => {
            initTabs(curType.value.type);
          });
          getHotelList(() => {
            initTabs(curType.value.type);
          });
         

          requestObj.marketingId = res.retVal.datas[0].id;
          requestObj.categorySub = curType.value.type;
        }
      }else{
        isLoad.value = true;
      }
    } else {
      jAlert3(res.msg, 2000);
    }
  });
};
const initTabs = (type: string) => {
  if (curType.value.type == type) {
    if (
      curType.value.type == "ThemeGroup" ||
      curType.value.type == "FreeTravel" ||
      curType.value.type == "DestPackage" ||
      curType.value.type == "ButlerCustomized"
    ) {
      if (allTravelList.value[curType.value.type]) {
        travelList.value = allTravelList.value[curType.value.type];
        travelList.value.forEach((item: any) => {
          curType.value.items.forEach((goods: any) => {
            if (goods.dictionaryCode == item.travelGroupCode) {
              item.tag = goods.tag;
            }
          });

          let noTag = true;
          tagList.value.forEach((tag: any) => {
            if (tag.name == item.series) {
              noTag = false;
            }
          });
          if (noTag) {
            tagList.value.push({
              id: item.series,
              name: item.series,
            });
          }
        });
      } else {
        travelList.value = [];
      }
    }

    isLoad.value = true;
  }
};
const getGoodsList = (cb: any) => {
  if (shopGoodsList.value.length > 0) {
    isAjax.value = false;
    return;
  }
  let opt = {
    hotelGroupCode: config.hotelGroupCode,
    hotelCode: config.hotelCode,
    equipment: "desktop",
    channel: shopChannel.value,
    appid: config.appid,
    orderCondition: "listOrder",
    orderDirection: "desc",
    firstResult: 0,
    pageSize: 999,
  };
  api.listGoods(opt).then((res: any) => {
    isAjax.value = false;
    res.retVal.datas.forEach((item: any) => {
      item.title = item.name;
      item.subtitle = item.secondTitle;
      item.productType = "shop";
      item.tagApiDtos = [];
      if (item.goodsCity) {
        let tagApiDtos = item.goodsCity.split(",");
        tagApiDtos.forEach((tagApiDto: any) => {
          let tag = {
            tageDesc: tagApiDto,
          };
          item.tagApiDtos.push(tag);
        });
      }

      item.startingPrice = item.price;
    });
    shopGoodsList.value = res.retVal.datas;
    cb && cb();
  });
};
const allTravelProduct = (cb: any) => {
  api.travelProductList({
    cardLevel: user.cardLevel || "",
    companyLevel: user.companyLevel || "",
    cardType: user.cardType || "",
    category: "",
    categorySub: "",
    companyCode: "",
    gcLevel: "",
    ota: "",
    otaChannel: "WECHAT",
    dayNight: "",
    rendezvous: "",
    travelGroupCode: "",
    travelType: "",
    marketingId: "",
    hotelCode: "",
    hotelGroupCode: config.hotelGroupCode,
    unitCode: config.hotelGroupCode,
    tag: "",
  }).then((res: any) => {
    isAjax.value = false;
    if (res.result == 0 && res.retVal) {
      allTravelList.value = res.retVal;
      res.retVal.forEach((item: any) => {
        if (allTravelList.value[item.categorySub]) {
          allTravelList.value[item.categorySub].push(item);
        } else {
          allTravelList.value[item.categorySub] = [];
          allTravelList.value[item.categorySub].push(item);
        }
      });
      allTravelList.value[curType.value.type];
    } else {
      allTravelList.value = {};
    }
    cb && cb();
  });
};
const travelProductList = () => {
  if (curType.value.id) {
    requestObj.categorySub = curType.value.type;
  }

  api.travelProductList(requestObj).then((res: any) => {
    isAjax.value = false;
    if (res.result == 0 && res.retVal) {
      travelList.value = res.retVal;
      travelList.value.forEach((item: any) => {
        curType.value.items.forEach((goods: any) => {
          if (goods.dictionaryCode == item.travelGroupCode) {
            item.tag = goods.tag;
          }
        });

        let noTag = true;
        tagList.value.forEach((tag: any) => {
          if (tag.name == item.series) {
            noTag = false;
          }
        });
        if (noTag) {
          tagList.value.push({
            id: item.series,
            name: item.series,
          });
        }
      });

      // if(tagList.length>0){
      // 	curTag.value = tagList[0].id
      // }
    } else {
      travelList.value = [];
    }
  });
};
// 日活动
const getActivityList = (cb: any) => {
  //   if (curType.value.id) {
  //     requestObj.categorySub = curType.value.type;
  //   }

  api
    .interfaceTransfer({
      config: {
        interfaceType: "GET",
        interfaceModule: "GC_ACTIVITIES_CENTER",
        interfaceMethod: "api/activity/list",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
      query: {
        unitCode: config.hotelGroupCode,
        channel:'WECHAT'
      },
    })
    .then((res: any) => {
      isAjax.value = false;
      if (res.result == 1 && res.retVal.result == 0) {
        activityListNew.value = res.retVal.retVal;
        activityListNew.value.forEach((item: any) => {
          item.activityTags = item.activityTags
            ? item.activityTags.split(",")
            : [];
          if (item.minPriceDto && item.minPriceDto.payType) {
            item.payType = item.minPriceDto.payType.includes("CASH")
              ? "CASH"
              : item.minPriceDto.payType.includes("INTEGRALCASH")
              ? "INTEGRALCASH"
              : "INTEGRAL";
            // item.payType = item.minPriceDto.payType.includes("INTEGRALCASH")? "mix": "money";
          }
        });
      }
      cb && cb();
    });
};
const advertisementPage = () => {
  var opt:any = {
    hotelCode: config.hotelCode,
    hotelGroupCode: config.hotelGroupCode,
    clientTypes: channel.value,
    firstResult: 0,
    pageSize: 999,
    channel:shopChannel.value
  }
  if(user.memberId){
      opt.mobile = user.mobile
      opt.memberId = user.memberId
  }
  api
    .advertisementPage(opt)
    .then((res: any) => {
      if (
        res.result == 0 &&
        res.retVal &&
        res.retVal.datas &&
        res.retVal.datas.length > 0
      ) {
        res.retVal.datas.forEach((item: any) => {
          if (item.showLocation == "1") {
            header.value = JSON.parse(item.infos);
          }
          if (item.showLocation == "0") {
            slides = JSON.parse(item.infos);
            if(slides.left){
              for (let i = 0; i < slides.left.length; i++) {
                if(slides.left[i].link.indexOf('#hide#')!=-1){
                  slides.left.splice(i, 1)
							    i--
                }
              }
            }
            if(slides.right){
              for (let i = 0; i < slides.right.length; i++) {
                if(slides.right[i].link.indexOf('#hide#')!=-1){
                  slides.right.splice(i, 1)
							    i--
                }
              }
            }
          }

          if (item.showLocation == "11") {
            let info = JSON.parse(item.infos);
            if (info && info.length > 0) {
              footerAd.value = info;
              // footerAd.value = info[0];
            }
          }
        });
      }
    });
};
let travelListNew = computed(() => {
  let travelListNew = [];
  let productList: any = [];
  let recommendTravel: any = [];
  let recommendMap: any = [];
  let filterTravel: any = [];
  if (marketingActivityTag.value) {
    travelList.value.forEach((m: any) => {
      tagProductId.value.forEach((item: any) => {
        if (item == m.itineraryCode) {
          productList.push(m);
        }
      });
    });
  } else {
    productList = travelList.value;
  }

  if (curType.value.items.length > 0) {
    curType.value.items.forEach((n: any) => {
      productList.forEach((item: any) => {
        if (n.dictionaryCode == item.itineraryCode) {
          item.marketingTag = n.tag;
        }
      });
      recommendMap[n.dictionaryCode] = true;
    });
  }
  productList.forEach((m: any) => {
    if (recommendMap[m.itineraryCode]) {
      recommendTravel.push(m);
    } else {
      filterTravel.push(m);
    }
  });
  filterTravel = [...recommendTravel, ...filterTravel];

  if (curTag.value) {
    filterTravel.forEach((item: any) => {
      if (item.series == curTag.value) {
        travelListNew.push(item);
      }
    });
  } else {
    travelListNew = filterTravel;
  }
  if (curType.value.number) {
    travelListNew = travelListNew.slice(0, Number(curType.value.number));
  }
  return travelListNew;
});
let filterHotels = computed(() => {
  let productList: any = [];
  let filterHotels: any = [];
  let recommendHotels: any = [];
  let recommendMap: any = {};
  if (marketingActivityTag.value) {
    hotels.value.forEach((m: any) => {
      tagProductId.value.forEach((item: any) => {
        if (item == m.code) {
          productList.push(m);
        }
      });
    });
  } else {
    productList = hotels.value;
  }
  if (curType.value.items.length > 0) {
    curType.value.items.forEach((n: any) => {
      recommendMap[n.dictionaryCode] = true;
    });
  }
  productList.forEach((m: any) => {
    if (recommendMap[m.code]) {
      recommendHotels.push(m);
    } else {
      filterHotels.push(m);
    }
  });
  filterHotels = [...recommendHotels, ...filterHotels];
  if (curType.value.number) {
    filterHotels = filterHotels.slice(0, Number(curType.value.number));
  }
  return filterHotels;
});
let activityList = computed(() => {
  let productList: any = [];
  let filterShop: any = [];
  let recommendShop: any = [];
  let recommendMap: any = {};

  if (marketingActivityTag.value) {
    activityListNew.value.forEach((m: any) => {
      tagProductId.value.forEach((item: any) => {
        if (item == m.activityCode) {
          productList.push(m);
        }
      });
    });
  } else {
    productList = activityListNew.value;
  }
  if (curType.value.items.length > 0) {
    curType.value.items.forEach((n: any) => {
      recommendMap[n.dictionaryCode] = true;
    });
  }
  productList.forEach((m: any) => {
    if (recommendMap[m.code]) {
      recommendShop.push(m);
    } else {
      filterShop.push(m);
    }
  });
  filterShop = [...recommendShop, ...filterShop];
  if (curType.value.number) {
    filterShop = filterShop.slice(0, Number(curType.value.number));
  }
  return filterShop;
});
let filterShop = computed(() => {
  let productList: any = [];
  let filterShop: any = [];
  let recommendShop: any = [];
  let recommendMap: any = {};

  if (marketingActivityTag.value) {
    shopGoodsList.value.forEach((m: any) => {
      tagProductId.value.forEach((item: any) => {
        if (item.dictionaryCode == m.id) {
          productList.push(m);
        }
      });
    });
  } else {
    productList = shopGoodsList.value;
  }

  if (curType.value.items.length > 0) {
    curType.value.items.forEach((n: any) => {
      productList.forEach((item: any) => {
        if (n.dictionaryCode == item.id) {
          item.marketingTag = n.tag;
        }
      });
      recommendMap[n.dictionaryCode] = true;
    });
  }

  productList.forEach((m: any) => {
    if (recommendMap[m.id]) {
      recommendShop.push(m);
    } else {
      filterShop.push(m);
    }
  });
  filterShop = [...recommendShop, ...filterShop];
  if (curType.value.number) {
    filterShop = filterShop.slice(0, Number(curType.value.number));
  }
  return filterShop;
});
const getHotelList = (cb: any) => {
  var findHotelParameter = {
    fromDate: fromDate.value,
    toDate: toDate.value,
    otaChannel: otaChannel.value,
    hotelGroupCodes: config.hotelGroupCode,
    cardLevel: "",
    hasPriceMin: "T",
    city: "",
    clientLatitude: "",
    clientLongitude: "",
    position: "",
    positionValue: "",
    keyWord: "",
    radius: "",
    pageSize: 999,
    firstResult: 0,
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
  if (
    !(findHotelParameter.clientLatitude && findHotelParameter.clientLongitude)
  ) {
    findHotelParameter.radius = "";
  }
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
        hotels.value = response.retVal.resultInfos;
        cb&&cb();
      }
    })
    .catch(function (error: any) {
      isAjax.value = false;
      console.log(error);
    });
};


onMounted(() => {
  uni.getSystemInfo({
    success: (res) => {
      navHeight.value = res.statusBarHeight || 0;
      menuHeight.value = navHeight.value;
      // #ifdef MP
      menuHeight.value = navHeight.value + 40;
      //  #endif
    },
    fail(err) {
      console.log(err);
    },
  });
  marketingPage();
 
});
onPullDownRefresh(()=>{
  typeList = []
  curTag.value = "";
  marketingActivityTag.value = "";
  filterFixedRef.value.reset();
  tagList.value = [];
  theme.value = "";
  requestObj.theme = "";
  marketingPage();

})

</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");


.travelList_ui {
  width: 100%;
  background: #f8f8f8;
  padding-bottom: 100px;
  overflow-x: hidden;

  .swiper-box {
    position: relative;
    width: 100%;
    height: 280px;
  }

  .header {
    background-size: contain;
    background-repeat: no-repeat;

    .title {
      padding: 0 16px;
      height: 40px;
      line-height: 40px;
      font-size: 20px;
      font-family: Source Han Serif CN;
      font-weight: 900;
      color: #fff;
    }

    .subTitle {
      padding: 0 16px;
      margin-top: 2px;
      font-size: 14px;
      line-height: 1;

      color: #fff;
      opacity: 0.8;
    }
  }

  .hotel-box {
    position: relative;
    margin: 24px 16px 0;

    border-radius: 8px;
    overflow: hidden;
    z-index: 9;

    .nav {
      position: relative;
      width: 100%;
      height: 40px;
      .tab_bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        z-index: -1;
      }

      .trapezoid,
      .trapezoid2 {
        position: absolute;
        left: 0;
        top: 0;
        display: inline-block;
        width: 48.327vw;
        height: 40px;
        overflow: hidden;
        transform: rotate(-180deg);

        &.trapezoid {
          left: -1px;
        }

        &.active {
          color: #a43127;
          z-index: 2;
          font-weight: 500;

          &::before {
            background-color: none;
            opacity: 0;
          }
        }

        .txt {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(-180deg);
        }
      }

      .trapezoid2 {
        left: auto;
        right: 0;
      }

      // .trapezoid::before,
      // .trapezoid2::before {
      // 	content: "";
      // 	position: absolute;
      // 	top: 0;
      // 	bottom: 0;
      // 	left: 0;
      // 	width: 100%;
      // 	background-color: rgba(255, 255, 255, 0.6);
      // 	transform: skewX(30deg);
      // 	transform-origin: top right;
      // 	border-radius: 0 0 8px 8px;
      // }

      // .trapezoid2::before {
      // 	transform: skewX(-30deg);
      // }
    }

    .choose-box {
      margin-top: -1px;
      padding: 4px 20px 20px;
      background: #fff;

      .choose-item {
        color: #808080;
        font-size: 12px;
        padding: 12px 0;
        border-bottom: 0.5px solid #eeeeee;
        position: relative;

        .timeBox {
          display: flex;
          align-items: center;
          margin-top: 8px;
          // height: 26px;

          .timeItem {
            color: #000;
            font-size: 16px;
            font-weight: bold;
          }

          .timeMiddle {
            color: #000;
            font-family: PingFang SC;
            font-size: 10px;
            padding: 2px 8px;
            border-radius: 20px;
            border: 1px solid #eeeeee;
            margin: 0 15px;
            position: relative;

            &:after {
              content: "";
              height: 1px;
              width: 10px;
              position: absolute;
              left: -10px;
              top: 8px;
              background: #eeeeee;
            }

            &:before {
              content: "";
              height: 1px;
              width: 10px;
              position: absolute;
              left: 100%;
              top: 8px;
              background: #eeeeee;
            }
          }
        }

        &:last-child {
          border: 0;
        }

        .label {
          font-size: 12px;
          color: @text-color;
          line-height: 1;
        }
        .val-box {
          margin-top: 8px;
          position: relative;
          .icon-a-16_xialajiantou_ciji {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            font-size: 16px;
            color: #808080;
            font-weight: normal;
          }
        }
        .val {
          position: relative;

          font-size: 18px;
          line-height: 1;
          font-weight: bold;
          color: @tl-black;

          &.small {
            font-size: 16px;
          }
        }
      }

      .btn {
        margin-top: 4px;
        width: 100%;
        height: 48px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        color: #ffffff;
        font-size: 16px;

        border-radius: 4px;
      }
    }
  }

  .ad-banner {
    display: flex;
    justify-content: space-between;
    margin: 24px 16px 0;

    .ad-swiper {
      position: relative;
      width: calc(50% - 4px);
      height: 55.536vw;
      border-radius: 8px;
      overflow: hidden;
    }

    .ad-banner-rt {
      width: calc(50% - 4px);
      .ad-banner-img {
        position: relative;

        .img {
          display: block;
          width: 100%;
          height: 26.7vw;
          border-radius: 8px;
        }

        .info {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          border-radius: 8px;
          bottom: 0;
          padding: 30px 12px 0;
          color: #fff;
          background: rgba(0, 0, 0, 0.12);
        }

        .title {
          font-family: Source Han Serif CN;
          font-weight: 900;
          font-size: 18px;
          line-height: 1;
        }

        .subTitle {
          margin-top: 8px;
          font-size: 14px;
          line-height: 1;

          .iconfont {
            color: #fff;
            font-size: 12px;
            line-height: 14px;
            vertical-align: top;
            display: inline-block;
          }
        }

        &:last-child {
          margin-top: 2.136vw;
        }
      }
    }
  }

  .ad-banner-3 {
    margin: 12px 6px 0;

    .box {
      position: relative;
      border-radius: 12px;
      overflow: hidden;
      display: inline-block;
      margin: 0 4px;
      width: calc(33.3% - 8px);

      .img {
        display: block;
        height: 144px;
        width: 100%;
      }

      .box-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(4px);
        padding-bottom: 5px;

        .tl {
          margin-top: 5px;
          color: #fff;
          text-align: center;
          overflow: hidden;
          height: 1.4;
          line-height: 1.4;
        }

        .sub-tl {
          margin-top: 2px;
          font-size: 10px;
          color: #fff;
          overflow: hidden;
          height: 1.4;
          line-height: 1.4;
          text-align: center;
        }
      }
    }
  }

  .tabs {
    margin-top: 10px;
    .tabs_warp {
      width: 100%;

      &.fixed {
        z-index: 9;
        background: #fff;
        position: fixed;
        padding-bottom: 10px;
      }
    }
  }

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
      margin: 24px 16px 0;
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
          margin-top: 8px;
          display: flex;

          .product-info-lab {
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

  .customized-product {
    display: flex;
    margin: 32px 16px 0;
    border-radius: 8px;
    background: #fff;
    overflow: hidden;

    .product-img {
      width: 44.322vw;
      height: 58.74vw;

      .img {
        width: 100%;
        height: 100%;
      }
    }

    .product-info {
      position: relative;
      flex: 1;
      padding: 16px 12px;

      .product-name {
        font-weight: bold;
        font-size: 16px;
        line-height: 24px;
        max-height: 48px;
        color: @tl-black;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        white-space: normal;
      }

      .product-desc {
        margin-top: 12px;
        font-size: 12px;
        line-height: 18px;
        max-height: 72px;
        color: @text-color;
      }

      .product-btn {
        position: absolute;
        right: 12px;
        bottom: 16px;
        width: 88px;
        height: 38px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        font-family: "PingFang SC";
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 14px;
        border-radius: 4px;

        color: #fff;
      }
    }
  }

  .logo {
    margin-top: 32px;
    display: flex;
    justify-content: center;
    color: #ccc;

    .img {
      width: 120px;
      height: 68px;
    }
  }

  .destination {
  }

  .filterBox2 {
    .topFilterBox {
      display: flex;
      min-height: 240px;
      padding: 16px;
      flex-wrap: wrap;

      .filterItem {
        height: 48px;
        line-height: 48px;
        text-align: center;
        color: #000000;
        font-size: 16px;
        width: calc(~"(100% - 20px) / 3");
        border-radius: 4px;
        border: 1px solid #e2e2e2;
        margin-right: 10px;

        margin-bottom: 16px;

        &.active {
          color: @active-color;
          font-weight: bold;
        }

        &:nth-of-type(3n + 0) {
          margin-right: 0;
        }
      }
    }

    .bottomFilterBox {
      display: flex;
      height: 70px;
      align-items: center;
      padding: 16px;
      background: #fff;

      .resetBtn {
        width: 60px;
        margin-right: 16px;
        text-align: center;
        color: #000;

        .resetDesc {
          font-size: 12px;
        }

        .iconfont {
          font-size: 22px;
        }
      }

      .finishBtn {
        .baseBtn();
        flex: 1;
        height: 48px;
        line-height: 48px;
      }
    }
  }

  /deep/.footer {
    position: relative;
    margin-top: 32px;

    height: 220px;
    width: 100%;

    overflow: hidden;
    .slider-img {
      border-radius: 8px;
    }
  }

  /deep/.filterBox {
    .ui_radioGroup {
      .radio-box {
        display: flex;
        align-items: center;
        min-height: 0;
        padding: 0;
        width: 100%;
      }

      .radio-item {
        height: 36px;
        line-height: 36px;
        font-size: 12px;

        &.active {
          color: #000;
        }
      }
    }
  }
}
</style>
