<template>
  <div class="coustom-head">
    <coustom-head :color="innerScrollTop2Old>150?'#000':'#fff'" :bgColor="innerScrollTop2Old>150?'#fff':''"
      :backFilter="isBlur? 'blur(20px)' : ''">
      <template v-slot:title>
        <div class="share-icon">
          <p class="title">{{innerScrollTop2Old>150?truncateText(hotel.gcHotel.descript,4):''}}</p>
          <button open-type="share" class="btn-default shareBtn" :style="menuPos">
            <!-- #ifdef MP -->
            <i class="iconfont icon-a-20_fenxianganniu_bai" :style="{color:innerScrollTop2Old>150?'#000':'#fff'}"></i>
            <!-- #endif -->
          </button>
        </div>
      </template>
    </coustom-head>
  </div>
  <div class="ui_hotel" id="hotelPage">
    <img src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/skeleton/hotel.png" alt=""
      v-if="!isLoad" class="loadingImg" mode="widthFix" />
    <div v-if="isLoad">
      <div class="bgItem" v-bind:class="{ full: isShowFullScreen }"
        :style="{'background-color':imgThemeColor,'z-index':isShowFullScreen?4:'',height:isShowFullScreen?placeholderHeight+'px':''}">
        <img :src="bigLogoUrl" alt="" class="bgImg" mode="aspectFill" :style="{'height':minPlaceHolder+'px'}">
        <div class="hotelInfoBox" :style="{'margin-top':isShowFullScreen?maxMarginTop+'px':minMarginTop+'px'}">
          <div class="fadeBg"
            :style="{'background-image':'linear-gradient(180deg, rgba(117, 131, 145, 0) 0%, '+imgThemeColor+ ' 100%)'}">
            <div class="fadeInfoBox" v-if="!isShowFullScreen">
              <p class="hotelName">{{hotel.gcHotel.descript}}</p>
              <p class="subDesc">海拔{{hotel.altitude}}m</p>
              <p class="subName" @click="toggleShowFullScreen(true)">下拉查看酒店简介<i
                  class="icon iconfont icon-a-12_changxialajiantou_bai"></i></p>
            </div>
          </div>
          <div class="bgInfoBox" v-if="isShowFullScreen">
          </div>
        </div>
        <div class="seeMoreBox" v-if="isShowFullScreen">
          <scroll-view class="seeMoreInner" :scroll-top="innerScrollTop" scroll-y="true" @scroll="scroll"
            :class="{blur:isBlur}">
            <div class="mockHeight"></div>
            <p class="hotelName">{{hotel.gcHotel.descript}}</p>
            <p class="subDesc">海拔{{hotel.altitude}}m</p>
            <!-- <p class="subName">和对的人，一起来滇藏线上“轻度假”</p> -->
            <mp-html :content="hotel.gcHotel.htmlInfo" class="infoText"></mp-html>
            <div class="mockHeight2"></div>
          </scroll-view>
        </div>
      </div>
      <scroll-view class="hotelItemWrapper" v-bind:class="{ full: isShowFullScreen }" id="hotelItemWrapper"
        :scroll-y="!isShowFullScreen" @scroll="scrollInnerBox" :scroll-top="innerScrollTop2" scroll-with-animation=true
        enhanced=true bounces=false>
        <view class="placeholder" :style="{height:placeholderHeight+'px','z-index':isShowFullScreen?'-1':''}"
          @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd"
          :class="{'disabled':isShowFullScreen}"></view>
        <div class="hotelItem" :style="{'z-index':isShowFullScreen?'4':''}">
          <div @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
            <div class="touchLine">
              <!-- <i class="icon iconfont icon-a-16_shanglajiantou_hei" v-if="isShowFullScreen"
                @click="toggleShowFullScreen(false)"></i> -->
              <div class="rect"></div>
            </div>
            <div class="topBox">
              <div class="priceItem" v-if="hotel.minPrice"><span class="price">¥{{hotel.minPrice}}</span>/起</div>
              <div class="priceItem" v-else>&nbsp;</div>
              <div class="collect">
                <i class="icon iconfont" @click="toCollection"
                  :class="{'active':isCollect,'icon-a-20_shoucang_yishoucang':isCollect,'icon-a-20_shoucang_weishoucang':!isCollect}"></i>
              </div>
            </div>
            <div class="tagList">
              <div class="tagItem" v-for="(theme,themeIndex) in hotel.gcHotelThemes" :key="themeIndex">
                {{theme.descript}}
              </div>
            </div>
          </div>
          <div class="mapBox">
            <div class="leftPart">
              {{hotel.gcHotel.address1}}
            </div>
            <div class="rightPart">
              <i class="icon iconfont icon-a-28_ditu" @click="goMap(hotel.gcHotel)"></i>
              <i class="icon iconfont icon-a-28_dianhua" @click="makeTel(hotel.gcHotel.phone)"></i>
            </div>
          </div>
          <p class="bigTitle">酒店客房</p>
          <div class="calendarBox arrow" @click="showCalendar">
            <div class="timerBox">
              <div class="timeDetails">
                <p class="dayTime">{{ timeFilterMD(fromDate) }}</p>
                <p class="weekTime">入住</p>
              </div>
            </div>
            <div class="timerMiddleBox">
              <span class='days'>住{{ zday }}晚</span>
            </div>
            <div class="timerBox">
              <div class="timeDetails">
                <p class="dayTime">{{ timeFilterMD(toDate) }}</p>
                <p class="weekTime">离店</p>
              </div>
            </div>
          </div>
          <room-list :productRoomList="productRoomList" :fromDate="fromDate" :toDate="toDate" :hotel="hotel.gcHotel"
            :user="user" @showCurrentRoom="showCurrentRoom" @goBook="goBook" @showTravelAll="showTravelAll"
            @goPackItem="goPackItem"></room-list>
          <empty v-if="productRoomList.length==0" tips="暂无可订房型"></empty>
          <div class="wrapperBox" v-if="hotel && hotel.gcHotelPicTags && hotel.gcHotelPicTags.length > 0">
            <p class="bigTitle">酒店设施</p>
            <div class="equipBox" v-if="hotel && hotel.gcHotelPicTags && hotel.gcHotelPicTags.length > 0">
              <div v-for="(item, itemIndex) in hotel.gcHotelPicTags" :key="itemIndex" class='iconWrapper'>
                <img :src="item.logo" alt="" class="equipIcon">
                <span class="equipDesc">{{ item.descript }}</span>
              </div>
            </div>
          </div>
          <div class="wrapperBox" v-if="travelList.length>0">
            <p class="bigTitle">度假套餐</p>
            <travel-item v-for="(travelItem, travelItemIndex) in travelList" :key="travelItemIndex"
              :travelItem="travelItem" @chooseItem="chooseTravel"></travel-item>
          </div>
          <div class="heightBox" style="height:150px;"></div>
        </div>
      </scroll-view>
    </div>
    <div v-if="isLoad">
      <div class="footer" v-if="isShowFooterBar&&!isShowFullScreen">
        <div class="kefu" @click="showKf">
          <i class="icon-a-20_kefu iconfont"></i>
          客服
        </div>
        <div class="order-btn" @click="goFirstRoom">预订</div>
      </div>
      <div class="kfBox" @click="showKf" v-if="!isShowFooterBar&&!isShowFullScreen">
        <i class="icon-a-20_kefu iconfont"></i>
      </div>
    </div>
    <calendar ref="calendarCompent" @change-date="changeDate" :checkInDay="fromDate" :checkOutDay="toDate"></calendar>
    <bottom-dialog :title="title" ref="roomCompent">
      <div class="roomInfo">
        <div class="swiperBox">
          <swiper-box :slides="slides" :swiperConfig="swiperConfig"></swiper-box>
        </div>
        <div class="subRoomInfo">
          <div class="rooomDes">
            <div class="rooomDesItem">
              <i class="icon iconfont icon-a-20_mianji"></i>
              <p class="desc">{{ currentRoom.gcRoomExtra.squareMeter }}</p>
            </div>
            <div class="rooomDesItem">
              <i class="icon iconfont icon-a-20_ruzhujiudian"></i>
              <p class="desc">{{ currentRoom.gcRoomExtra.bedType }}</p>
            </div>
            <div class="rooomDesItem">
              <i class="icon iconfont icon-a-20_louceng"></i>
              <p class="desc">{{ currentRoom.gcRoomExtra.floor }}</p>
            </div>
          </div>
          <div class="roomInfos">
            <mp-html :content="currentRoom.gcRoomExtra.abstracts" container-style="line-height:22px"></mp-html>
            <mp-html :content="currentRoom.gcRoomExtra.detail" container-style="line-height:22px"></mp-html>
          </div>
          <template v-for="(picType,i) in picTypeList" :key="i">
            <div class="hotel-icon-list" v-if="picType.listNew.length>0">
              <div class="title">
                {{picType.descript}}
              </div>
              <div class="icon-list">
                <div class="icons" v-for="(item,itemIndex) in picType.listNew" :key="itemIndex">
                  <div class="icon" v-for="(icon,i) in item" :key="i">
                    <img class="img" :src="icon.logo">
                    <div class="name">{{icon.descript}}</div>
                  </div>
                </div>
                <!-- <swiper-box :slides="picType.listNew" :swiperConfig="swiperConfig2">
                  <template v-slot:item="{ item }">
                    <div class="icons">
                      <div class="icon" v-for="(icon,i) in item" :key="i">
                        <img class="img" :src="icon.logo">
                        <div class="name">{{icon.descript}}</div>
                      </div>
                    </div>
                  </template>
                </swiper-box> -->
              </div>
            </div>
          </template>
          <div class="hotelAboutItem">
            <div class="hotelAboutTitle">预订政策</div>
            <div class="hotelAboutdesc">
              <div class="hotelAboutRichText">
                <mp-html :content="hotel.gcHotel.resrvNoticePp"></mp-html>
                <mp-html :content="hotel.gcHotel.resrvNoticeCs"></mp-html>
              </div>
            </div>
          </div>
        </div>
        <div class="fixedBottom bookFooter" v-if="modalType== 'room'">
          <div class="leftPart">
            <p class="priceItem"><span class="price">¥{{currentRoomType.pbMinPriceWithPromotion}}</span>/晚</p>
          </div>
          <div class="rightPart">
            <template v-if="currentRoomType.bookAble == 'T'">
              <template v-if="currentRoomType.minSaleNum <= 0">
                <div class="bookBtn disabled">满房</div>
              </template>
              <template v-else>
                <template v-if="!(user && user.memberId) && currentRoomType.notMemberBook == 'F'">
                  <div class="bookBtn" @click.stop="goLogin()">预订</div>
                </template>
                <template v-else>
                  <div class="bookBtn" @click.stop="goBookAction()">预订</div>
                </template>
              </template>
            </template>
            <template v-else>
              <div class="bookBtn">不可订</div>
            </template>
          </div>
        </div>
        <div class="fixedBottom bookFooter" v-if="modalType== 'pack'">
          <div class="leftPart">
            <p class="priceItem"><span class="price">¥{{currentPack.price}}</span>/套</p>
            <p class="priceItem2">{{currentPack.price2}}</p>
          </div>
          <div class="rightPart">
            <div class="bookBtn" @click="goPackItemAction(currentPack)">预订</div>
          </div>
        </div>
      </div>
    </bottom-dialog>
    <bottom-dialog title="选择入住日期" ref="chooseDate" @openState="chooseDateOpenState">
      <daily-price ref="dailyPrices" @change-dailyPrice="changedailyPrice">
        <template v-slot:footer>
          <div class="next-btn" v-if="curDailyPrice.groupBeginDateFormat">
            <div class="choose-item">
              {{curDailyPrice.groupBeginDateFormat}}入住 - {{curDailyPrice.groupEndDateFormat}}离店
            </div>
            <div class="btn baseBtn" @click="confirmOrder()">下一步</div>
          </div>
        </template>
      </daily-price>
    </bottom-dialog>
    <back-to-top v-if="isShowBacktoUp&&!isShowFullScreen" :backToTopStyle=backToTopStyle
      :scrollFn="backScrollFn"></back-to-top>
    <kf-dialog ref="kf" title="一键咨询"></kf-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  reactive,
  ref,
  computed,
  onMounted,
  toRaw,
  watch,
  nextTick,
} from "vue";
import { $ref } from "unplugin-vue-macros/macros";
import api from "@/utils/api";
import { getStorage, setStorage } from "@/utils/wxuser";
import calendar from "@/components/calendar.vue";
import roomList from "@/components/roomList.vue";
import dayjs from "dayjs";
import { timeFilterMD } from "@/utils/filter";
import { onLoad } from "@dcloudio/uni-app";
import bottomDialog from "@/components/bottomDialog.vue";
import travelItem from "@/components/travelItem.vue";
import coordtransform from "coordtransform";
import {
  goPage,
  toLogin,
  createUrl,
  convertToCSSColor,
  debounce,
} from "@/utils/utils";
import { jAlert3 } from "@/base/jAlert/jAlert";
import swiperBox from "@/components/swiperBox.vue";
import useScroll from "@/hooks/useScroll";
import coustomHead from "@/components/coustomHead.vue";
import dailyPrice from "@/pagesC/components/dailyPrice.vue";
import backToTop from "@/components/backToTop.vue";
import kfDialog from "@/components/kfDialog.vue";
import { getMenuButtonBoundingClientRect } from "@/utils/platform";
import UmengSDK from "@/utils/umengAdaptor.js";
import defaultOtaChannel from "@/utils/defaultOtaChannel";
import empty from "@/components/empty.vue";

const kf = ref();
let picTypeList = ref([]);
let clientHeight = ref(9999);
const { scrollTop, onPageScroll } = useScroll();
const curDailyPrice: any = ref({}); //当前价格日历
const dailyPrices = ref<HTMLElement | any>();
let chooseDate = ref();
const dailyPriceList: any = ref([]);
let travelDetail: any = reactive({});
const itineraryDtos: any = ref({});
let isShowFullScreen = ref(true);
let isLoad = ref(false);
let isAjax = ref(false);
let isLike = ref(false);
let config = getStorage("config");
let user = $ref(getStorage("user"));
let fromDate = ref(dayjs().format("YYYY-MM-DD"));
let toDate = ref(dayjs().add(1, "days").format("YYYY-MM-DD"));
let sourceActivityId = ref("");
let sourceActivityName = ref("");
let otaChannel = ref(defaultOtaChannel);
let hotelCode = ref("");
let hotel = ref<any>({
  gcHotel: {},
});
let productRoomList = ref<any>([]);
let travelList = ref<any>([]);
let currentRoom = ref({
  gcRoomExtra: {},
});
let currentRoomType = ref<any>({});
let currentPack = ref<any>({});
let bigLogoUrl = ref("");
let zday = computed(() => {
  let arr = dayjs(fromDate.value);
  let dep = dayjs(toDate.value);
  let zday = dep.diff(arr, "d");
  return zday;
});
const calendarCompent = ref();
let roomCompent = ref<any>(null);
let title = ref("");
let swiperConfig2 = reactive({
  indicatorDots: false,
  autoplay: false,
  slot: true,
  dotPosStyle: `bottom:-14px;left:50%;transform: translate(-50%);background:rgba(204, 204, 204, 0.28);`,
  dotStyle: "background:#000;",
});
let swiperConfig = reactive({
  indicatorDots: false,
  autoplay: true,
  dotPosStyle: "left: 50%;transform: translateX(-50%);bottom:12px;",
});
let slides = ref<any>([]);
let isCollect = ref(false);
let ids = ref("");
let modalType = ref("room");
let travelGroupCode = ref("");
let innerScrollTop = ref(0);
let innerScrollTop2 = ref(0);
let innerScrollTop2Old = ref(0);
let isBlur = ref(false);
let imgThemeColor = ref("#42535c");
let isShowFooterBar = ref(true);
let isShowBacktoUp = ref(false);
let backToTopStyle = ref({ bottom: "120px" });
let maxPlaceHolder = ref(200);
let minPlaceHolder = ref(200);
let placeholderHeight = ref(200);
let maxMarginTop = ref(-90);
let minMarginTop = ref(-132);
let startY = ref(0);
let moveY = ref(0);
const truncateText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  } else {
    return text;
  }
};
const backScrollFn = () => {
  innerScrollTop2.value = innerScrollTop2Old.value;
  nextTick(() => {
    innerScrollTop2.value = 0;
  });
};
// 监听触摸开始事件
const onTouchStart = (e: any) => {
  startY.value = e.touches[0].clientY;
  moveY.value = 0;
};
// 监听触摸移动事件
const onTouchMove = (e: any) => {
  const moveYDis = e.touches[0].clientY - startY.value;
  moveY.value = moveYDis;
};

// 监听触摸结束事件
const onTouchEnd = (e: any) => {
  const moveYDis = moveY.value;
  if (moveYDis < 0) {
    toggleShowFullScreen(false);
  } else if (moveYDis > 0) {
    toggleShowFullScreen(true);
  }
};
const showKf = () => {
  kf.value.showDialog();
};
const toggleShowFullScreen = (sta: boolean) => {
  isShowFullScreen.value = sta;
  innerScrollTop.value = 0;
  isBlur.value = false;
};
const scroll = (e: any) => {
  let scrollTop = e.detail.scrollTop;
  if (scrollTop > 100) {
    isBlur.value = true;
  } else {
    isBlur.value = false;
  }
};
const scrollHotelInfo = (e: any) => {
  let scrollTop = e.detail.scrollTop;
  console.log(scrollTop, 1111111111111111111111);
};
const goFirstRoom = () => {
  innerScrollTop2.value = innerScrollTop2Old.value;
  nextTick(() => {
    innerScrollTop2.value = 100;
  });
  /* uni.pageScrollTo({
    scrollTop: 300,
    duration: 300,
  }); */
};
const findPicTypeByRoomType = () => {
  api
    .interfaceTransfer({
      query: {
        hotelGroupCode: config.hotelGroupCode,
        hotelCode: hotelCode.value,
        roomType: currentRoomType.value.roomType,
      },
      config: {
        interfaceType: "POST",
        interfaceModule: "GC_PRODUCT_JOURNEY",
        interfaceMethod: `/api/travelGroup/findPicTypeByRoomType`,
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        picTypeList.value = res.retVal.retVal;
        picTypeList.value.forEach((item: any) => {
          item.listNew = [];
          item.list.forEach((list: any, i: number) => {
            let index = Math.trunc(i / 10);
            if (item.listNew[index]) {
              item.listNew[index].push(list);
            } else {
              item.listNew[index] = [];
              item.listNew[index].push(list);
            }
          });
        });
      }
    });
};
const chooseDateOpenState = (sta: number) => {
  if (sta === 0) {
    curDailyPrice.value = {};
  }
};
const confirmOrder = () => {
  var data = {
    title: travelDetail.title,
    itineraryDesc: itineraryDtos.value.itineraryDesc,
    groupBeginDateFormat: curDailyPrice.value.groupBeginDateFormat,
    groupEndDateFormat: curDailyPrice.value.groupEndDateFormat,
    groupBeginDate: curDailyPrice.value.groupBeginDate,
    groupEndDate: curDailyPrice.value.groupEndDate,
    number: 1,
    travelGroupCode: travelGroupCode.value,
    travelType: travelDetail.travelType,
    itineraryCode: itineraryDtos.value.itineraryCode,
    price: curDailyPrice.value.price,
    meetingPoint: travelDetail.rendezvous,
    specificationsPriceDtos: curDailyPrice.value.specificationsPriceDtos,
    productUrl: "",
    priceDtos: curDailyPrice.value.priceDtos,
    orderType: travelDetail.categorySub,
    orderTypeDesc: itineraryDtos.value.categorySubDesc,
    isSigning: travelDetail.isSigning,
    priceModel: travelDetail.priceModel,
  };
  if (travelDetail.urls) {
    travelDetail.urls.forEach((url: any) => {
      if (url.pictureType == "LISTIMAGE") {
        data.productUrl = url.url;
      }
    });
  }
  setStorage("travelInfo", data);
  goPage(
    `/pagesB/travel/confirmOrder?sourceActivityId=${sourceActivityId.value}&sourceActivityName=${sourceActivityName.value}`
  );
};
const changedailyPrice = (val: any) => {
  curDailyPrice.value = val;
};
const goPackItemAction = (packItem: any) => {
  if (!(user && user.memberId)) {
    toLogin();
    return false;
  }
  roomCompent.value.hideDialog();
  goPackItem(packItem);
};
const goPackItem = (packItem: any) => {
  if (!(user && user.memberId)) {
    toLogin();
    return false;
  }
  console.log(packItem);
  travelGroupCode.value = packItem.travelGroupCode;
  findTravelProductForWechatDetail();
};
const findTravelProductForWechatDetail = () => {
  api
    .interfaceTransfer({
      query: {
        unitCode: config.hotelGroupCode,
        travelGroupCode: travelGroupCode.value,
        ota: "DIRECT",
        otaChannel: otaChannel.value,
      },
      config: {
        interfaceType: "POST",
        interfaceModule: "GC_PRODUCT_JOURNEY",
        interfaceMethod: "/api/travelGroup/findTravelProductForWechatDetail",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        const info = res.retVal.retVal;
        travelDetail = JSON.parse(JSON.stringify(info[0]));
        if (travelDetail.itineraryDtos.length > 0) {
          travelDetail.itineraryDtos[0].active = true;
          itineraryDtos.value = travelDetail.itineraryDtos[0];
        }
        travelDetail.topImage.forEach((item: string) => {
          /* slides.push({
            imgUrl: item,
          }); */
        });
        listTravelProductDailyDetail();
      }
    });
};
const listTravelProductDailyDetail = () => {
  api
    .interfaceTransfer({
      query: {
        beginDate: dayjs().format("YYYY-MM-DD"),
        //endDate: dayjs().format("YYYY-MM-DD"),
        cardLevel: user.cardLevel,
        cardType: user.cardType,
        gcLevel: "",
        hotelGroupCode: config.hotelGroupCode,
        itineraryCode: itineraryDtos.value.itineraryCode,
        ota: "DIRECT",
        otaChannel: otaChannel.value,
        //travelGroupCode: travelDetail.travelGroupCode,
        travelType: travelDetail.travelType,
      },
      config: {
        interfaceType: "POST",
        interfaceModule: "GC_PRODUCT_JOURNEY",
        interfaceMethod: "/api/travelGroup/listTravelProductDailyDetail",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        const info = res.retVal.retVal;
        info.forEach((item: any) => {
          item.specificationsPriceDtos.forEach((priceDto: any) => {
            // if (priceDto.specificationsType != itineraryDtos.value.specificationsType) {

            const dailyDetail = item;
            dailyDetail.embarkDate = item.groupBeginDate;
            dailyDetail.MMdd = dayjs(item.groupBeginDate).format("MM/DD");
            if (dayjs(item.groupBeginDate).format("d") == "0") {
              dailyDetail.week = "周日";
            }
            if (dayjs(item.groupBeginDate).format("d") == "1") {
              dailyDetail.week = "周一";
            }
            if (dayjs(item.groupBeginDate).format("d") == "2") {
              dailyDetail.week = "周二";
            }
            if (dayjs(item.groupBeginDate).format("d") == "3") {
              dailyDetail.week = "周三";
            }
            if (dayjs(item.groupBeginDate).format("d") == "4") {
              dailyDetail.week = "周四";
            }
            if (dayjs(item.groupBeginDate).format("d") == "5") {
              dailyDetail.week = "周五";
            }
            if (dayjs(item.groupBeginDate).format("d") == "6") {
              dailyDetail.week = "周六";
            }

            dailyDetail.number = item.productAvailNum;
            dailyDetail.price = priceDto.price;
            dailyDetail.payType = priceDto.payType;
            dailyDetail.specificationsType = priceDto.specificationsType;
            dailyDetail.groupBeginDateFormat = dayjs(
              dailyDetail.groupBeginDate
            ).format("MM月DD日");
            dailyDetail.groupEndDateFormat = dayjs(
              dailyDetail.groupEndDate
            ).format("MM月DD日");
            dailyPriceList.value.push(dailyDetail);
            // }
          });
        });
        dailyPrices.value.createDate(dailyPriceList.value);
        chooseDate.value.showDialog();
      }
    });
};
let menuPos = computed(() => {
  const menuButton: any = getMenuButtonBoundingClientRect();
  console.log("menuButton:", menuButton);
  return `right:${menuButton.right - menuButton.left + 15}px;`;
});
let goMap = (item: AnyObject) => {
  var bd09togcj02 = coordtransform.bd09togcj02(
    item.hotelLongitude,
    item.hotelLatitude
  );
  uni.openLocation({
    latitude: Number(bd09togcj02[1]),
    longitude: Number(bd09togcj02[0]),
    scale: 28,
  });
};
let makeTel = (phone: string) => {
  uni.makePhoneCall({
    phoneNumber: phone,
  });
};
const showTravelAll = (data: AnyObject) => {
  productRoomList.value[data.roomIndex].travelList =
    productRoomList.value[data.roomIndex].travelWechatHotelDetailDtos;
};
const chooseTravel = (travel: AnyObject) => {
  uni.navigateTo({
    url: `/pagesB/travel/travelDetail?travelType=${travel.travelType}`,
  });
};
const goBookAction = () => {
  goBook({
    roomType: currentRoomType.value,
    room: currentRoom.value,
  });
};
const goBook = (item: AnyObject) => {
  if (!(user && user.memberId)) {
    toLogin();
    return false;
  }
  let roomType = item.roomType;
  let room = item.room;
  UmengSDK.sendEvent("hcdp_book_clk", {
    detail_address: hotel.value.gcHotel.address1,
    start_date: fromDate.value,
    end_date: toDate.value,
    price: roomType.pbMinPriceWithPromotion,
    hotel_name: hotel.value.gcHotel.descript,
  });
  console.log(toRaw(roomType));
  console.log(toRaw(room));
  let obj = {
    productCode: roomType.productCode,
    fromDate: fromDate.value,
    toDate: toDate.value,
    productName: room.roomDescript,
    rateCode: roomType.pmsRateCode,
    rmtype: roomType.roomType,
    ticket: roomType.ticket,
    payMethod: roomType.payMethod,
    hotelCode: hotelCode.value,
    descript: hotel.value.gcHotel.descript,
    address: hotel.value.gcHotel.address1,
    resrvNumMin: roomType.resrvNumMin,
    prepayTimeLimit: roomType.prepayTimeLimit,
    prepayHoldTimeMax: roomType.prepayHoldTimeMax,
    prepayMethod: roomType.prepayMethod,
    cancelPrehour: roomType.cancelPrehour,
    cancelPretime: roomType.cancelPretime,
    cancelPredays: roomType.cancelPredays,
    cancelCondition: roomType.cancelCondition,
    hotelGroupCode: roomType.hotelGroupCode,
    stayTime: roomType.stayTime,
    otaChannel: otaChannel.value,
    sourceActivityId: sourceActivityId.value,
    sourceActivityName: sourceActivityName.value,
  };
  setStorage(
    "hotelOrderRoom",
    Object.assign(roomType, {
      roomDescript: room.roomDescript,
      gcRoomExtra: room.gcRoomExtra,
    })
  );
  goPage(`/pagesC/order/bookInfo?${createUrl(obj)}`);
};
const showCurrentRoom = (item: any) => {
  console.log(toRaw(item));
  title.value = item.room.roomDescript;
  modalType.value = item.type;
  console.log(modalType.value, 111111111111111111);
  if (item.type == "pack") {
    title.value = item.pack.title;
    currentPack.value = item.pack;
  }
  let picturesList: any = [];
  item.room.gcRoomExtra.picturesList.forEach((n: any) => {
    picturesList.push({
      imgUrl: n,
    });
  });
  currentRoom.value = item.room;
  currentRoomType.value = item.roomType;
  if (picturesList.length == 0) {
    picturesList.push({
      imgUrl:
        "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/hotel/images/noPic.png",
    });
  }
  slides.value = picturesList;
  findPicTypeByRoomType();
  roomCompent.value.showDialog();
};
const changeDate = (time: any) => {
  if (time.checkInDay && time.checkOutDay) {
    fromDate.value = time.checkInDay;
    toDate.value = time.checkOutDay;
    getAllProduct();
  }
};
const pageScrollTo = (selector: string, scrollTop = 0) => {
  uni.pageScrollTo({
    selector: selector,
    scrollTop: scrollTop,
  });
};

const showCalendar = () => {
  calendarCompent.value.showDialog();
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
    otaChannel: otaChannel.value,
    dayNight: "",
    rendezvous: "",
    travelGroupCode: "",
    travelType: "",
    hotelCode: hotelCode.value,
    hotelGroupCode: config.hotelGroupCode,
  };
  if (user && user.memberId) {
    obj.cardLevel = user.cardLevel;
    obj.companyLevel = user.companyLevel;
    obj.cardType = user.cardType;
  }
  api.travelProductList(obj).then((res: any) => {
    if (res.result == 0) {
      let tripList = res.retVal;
      res.retVal.forEach((n: any) => {
        n.showBookBtn = true;
      });
      travelList.value = tripList;
    }
  });
};
const getHotelNew = (cb?: Function) => {
  var obj = {
    cardLevel: "",
    cardType: "",
    fromDate: fromDate.value,
    hotelCodes: [hotelCode.value],
    hotelGroupCode: config.hotelGroupCode,
    isBuyOnBehalf: "",
    isWeeHour: "",
    langCode: "zh-CN",
    meetingType: "",
    ota: "WECHAT",
    otaChannel: otaChannel.value,
    queryNormalProduct: false,
    queryPmsCompanyProducts: "F",
    queryRoomSetRemark: false,
    showType: 1,
    srcHotelGroupCode: config.hotelGroupCode,
    toDate: toDate.value,
    orderPrice: "asc",
  };
  if (user && user.memberId) {
    obj.cardLevel = user.cardLevel;
    obj.cardType = user.cardType;
  }
  api
    .interfaceTransfer({
      config: {
        interfaceType: "POST",
        interfaceModule: "GC_PRODUCT_JOURNEY",
        interfaceMethod: "api/travelGroup/hotelListAllForSongZan",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
      query: obj,
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        res.retVal = res.retVal.retVal;
        if (!(res.retVal && res.retVal[0])) {
          jAlert3(`酒店代码为:${hotelCode.value},未返回酒店详情`);
          return false;
        }
        var currentHotel = res.retVal[0];
        currentHotel.productRoomList.forEach((n: any, i: number) => {
          if (!n.gcRoomExtra) {
            n.gcRoomExtra = {};
          }
          if (!n.gcRoomExtra.pictures) {
            n.gcRoomExtra.picturesList = [];
          } else {
            n.gcRoomExtra.picturesList = n.gcRoomExtra.pictures.split(";");
          }
          n.gcProductBases.forEach((m: any, i: number) => {
            m.showName = m.name;
            if (user && user.memberId && m.prodCategorySub == "MEM") {
              m.showName = `${user.cardLevelDescript}价`;
            }
          });
          n.travelList = [];
          n.travelWechatHotelDetailDtos.forEach((o: any) => {
            o.unit = "元";
            o.priceDtos.forEach((k: any) => {
              if (k.payType == "CASH") {
                o.price = k.adultPrice;
              }
              if (k.payType == "INTEGRALCASH") {
                o.price2 = `积分+现金价：${k.integral}积分+${k.adultPrice}元/套`;
              }
            });
            o.specificationsPriceDtos.forEach((k: any) => {
              if (k.priceModel == "PACKAGE") {
                o.unit = k.priceModelDesc;
                o.price = k.price;
              }
            });
          });
          if (n.travelWechatHotelDetailDtos.length > 0) {
            n.travelList.push(n.travelWechatHotelDetailDtos[0]);
          }
        });
        productRoomList.value = currentHotel.productRoomList;
        hotel.value = currentHotel;
        if (
          currentHotel.roomImagesList &&
          currentHotel.roomImagesList.length > 0
        ) {
          bigLogoUrl.value = currentHotel.roomImagesList[0].pictures;
        }
        if (currentHotel.gcHotelExtra && currentHotel.gcHotelExtra.logo) {
          bigLogoUrl.value = currentHotel.gcHotelExtra.logo;
        }
        getThemeColor(bigLogoUrl.value);
        if (!isLoad.value) {
          UmengSDK.sendPV({
            detail_address: hotel.value.gcHotel.address1,
            source_page: "",
            price: hotel.value.minPrice,
            hotel_name: hotel.value.gcHotel.descript,
            page_id: "",
            page_name: "hotel_commodity_detail_pg",
            product_name: hotel.value.gcHotel.descript,
            page_title_name: hotel.value.gcHotel.descript,
          });
        }
        isLoad.value = true;
      } else {
        jAlert3(res.msg || res.retVal.msg);
      }
      cb && cb();
      console.log(res);
    });
};
const getThemeColor = (imgUrl: string) => {
  uni.request({
    url: `${imgUrl}?imageAve`,
    data: {},
    method: "GET",
    success: (res: any) => {
      if (res.data && res.data.RGB) {
        imgThemeColor.value = convertToCSSColor(res.data.RGB);
      }
    },
    fail: (err) => {},
  });
};
const getHotelInfo = () => {
  if (isAjax.value) {
    return false;
  }
  isAjax.value = true;
  var obj = {
    fromDate: fromDate.value,
    toDate: toDate.value,
    otaChannel: otaChannel.value,
    hotelCodes: [hotelCode.value],
    hotelGroupCode: config.hotelGroupCode,
    cardLevel: "",
    cardType: "",
    appid: config.appid,
    memberNo: "",
    componentAppid: config.componentAppid,
    srcHotelGroupCode: config.hotelGroupCode,
    isWeeHour: "",
    couponNo: "",
  };
  if (user && user.member) {
    obj.memberNo = user.cardNo;
    obj.cardLevel = user.cardLevel;
    obj.cardType = user.cardType;
  }
  api.hotelListAll(obj).then((res: any) => {
    isAjax.value = false;
    if (res.result == 1) {
      var currentHotel = res.retVal[0];
      currentHotel.productRoomList.forEach((n: any, i: number) => {
        if (!n.gcRoomExtra.pictures) {
          n.gcRoomExtra.picturesList = [];
        } else {
          n.gcRoomExtra.picturesList = n.gcRoomExtra.pictures.split(";");
        }
        n.gcProductBases.forEach((m: any, i: number) => {
          m.showName = m.name;
          if (user && user.memberId && m.prodCategorySub == "MEM") {
            m.showName = `${user.cardLevelDescript}价`;
          }
        });
      });
      productRoomList.value = currentHotel.productRoomList;
      hotel.value = currentHotel;
      if (currentHotel.roomImagesList.length > 0) {
        bigLogoUrl.value = currentHotel.roomImagesList[0].pictures;
      }
      isLoad.value = true;
    }
  });
};
const getAllProduct = () => {
  getHotelNew();
  //getHotelInfo();
  travelProductList();
};
const goLogin = () => {
  if (!(user && user.memberId)) {
    toLogin();
    return false;
  }
};
const toCollection = () => {
  if (!(user && user.memberId)) {
    toLogin();
    return false;
  }
  toggleCollection();
};
const toggleCollection = () => {
  if (!isCollect.value) {
    addGoodsCollection();
  } else {
    deleteGoodsCollection();
  }
};
const deleteGoodsCollection = () => {
  if (isAjax.value) {
    return false;
  }
  isAjax.value = true;
  api.deleteGoodsCollection([ids.value]).then((res: any) => {
    isAjax.value = false;
    if (res.result == 1) {
      jAlert3("取消收藏");
      isCollect.value = false;
    } else {
      jAlert3(res.msg);
    }
  });
};
const addGoodsCollection = () => {
  if (isAjax.value) {
    return false;
  }
  isAjax.value = true;
  api
    .addGoodsCollection({
      goodsId: hotelCode.value,
      goodsName: hotel.value.gcHotel.descript,
      hotelCode: config.hotelCode,
      hotelGroupCode: config.hotelGroupCode,
      memberId: user.memberId,
      productType: "hotel",
      picture: bigLogoUrl.value,
      price: hotel.value.minPrice,
    })
    .then((res: any) => {
      isAjax.value = false;
      if (res.result == 1) {
        jAlert3("收藏成功");
        isCollect.value = true;
        getGoodsIsCollection();
      } else {
        jAlert3(res.msg);
      }
    });
};
const getGoodsIsCollection = () => {
  api
    .getGoodsIsCollection({
      goodsId: hotelCode.value,
      hotelGroupCode: config.hotelGroupCode,
      hotelCode: config.hotelCode,
      memberId: user.memberId,
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal && res.retVal.length > 0) {
        isCollect.value = true;
        ids.value = res.retVal[0].id;
      }
    });
};
const changePlaceholderHeight = () => {
  if (isShowFullScreen.value) {
    placeholderHeight.value = maxPlaceHolder.value;
  } else {
    placeholderHeight.value = minPlaceHolder.value;
  }
};
const scrolltoupper = (e) => {
  console.log(1, e);
  isShowFooterBar.value = true;
  isShowBacktoUp.value = false;
};
const scrolltolower = (e) => {
  console.log(2, e);
  isShowFooterBar.value = true;
  isShowBacktoUp.value = true;
};
const scrollInnerBox = debounce((e: any) => {
  let scrollTop = e.detail.scrollTop;
  const scrollHeight = e.detail.scrollHeight;
  innerScrollTop2Old.value = scrollTop;
  if (!isShowFullScreen.value) {
    uni
      .createSelectorQuery()
      .select("#hotelItemWrapper")
      .boundingClientRect(function (rect: any) {
        const scrollViewHeight = rect.height;
        if (scrollTop <= 100) {
          isShowFooterBar.value = true;
          isShowBacktoUp.value = false;
        } else {
          // 判断是否滚动到底部
          if (scrollTop + scrollViewHeight + 100 >= scrollHeight) {
            isShowFooterBar.value = true;
            isShowBacktoUp.value = true;
          } else {
            isShowFooterBar.value = false;
            isShowBacktoUp.value = false;
          }
        }
      })
      .exec();
  }
});
watch(isShowFullScreen, () => {
  changePlaceholderHeight();
});
onMounted(() => {
  let key = `isFirst_${hotelCode.value}`;
  let isFirst = getStorage(key);
  if (isFirst == "F") {
    isShowFullScreen.value = false;
  }
  setStorage(key, "F");
  setTimeout(() => {
    calendarCompent.value.init({
      checkInDay: fromDate.value,
      checkOutDay: toDate.value,
      stayMax: 7,
      //isAutoColse:"F",
    });
  }, 500);
  getAllProduct();
  if (user && user.memberId) {
    getGoodsIsCollection();
  }
  uni.getSystemInfo({
    success: (res) => {
      let statusBarHeight = res.statusBarHeight || 0;
      clientHeight.value = statusBarHeight || 0;
      maxPlaceHolder.value = res.screenHeight - 62;
      // #ifdef H5
      maxPlaceHolder.value = window.innerHeight - 62;
      // #endif
      minPlaceHolder.value = 270 - 44 + statusBarHeight;
      minMarginTop.value = -(minPlaceHolder.value - 44 - statusBarHeight - 62);
      changePlaceholderHeight();
    },
    fail(err) {
      console.log(err);
    },
  });
  //getHotelInfo();
});
onLoad((options: any) => {
  if (options.hotelCode) {
    hotelCode.value = options.hotelCode;
  }
  if (options.fromDate) {
    fromDate.value = options.fromDate;
  }
  if (options.toDate) {
    toDate.value = options.toDate;
  }
  if (options.sourceActivityId) {
    sourceActivityId.value = options.sourceActivityId;
  }
  if (options.sourceActivityName) {
    sourceActivityName.value = decodeURIComponent(options.sourceActivityName);
  }
});
onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
  /* if (!isShowFullScreen.value) {
    uni
      .createSelectorQuery()
      .select("#hotelItemWrapper")
      .boundingClientRect(function (rect: any) {
        if (e.scrollTop < 100) {
          isShowFooterBar.value = true;
          isShowBacktoUp.value = false;
        } else {
          if (
            rect.height <
            e.scrollTop + uni.getSystemInfoSync().windowHeight
          ) {
            isShowFooterBar.value = true;
            isShowBacktoUp.value = true;
          } else {
            isShowFooterBar.value = false;
            isShowBacktoUp.value = false;
          }
        }
      })
      .exec();
  } */
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import (reference) url("~@/styles/mixin.less");
.coustom-head {
  position: fixed;
  z-index: 5;
  left: 0;
  top: 0;
  width: 100vw;
}
.share-icon {
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  .shareBtn {
    background: transparent;
    position: absolute;
    margin: 0;
    &::after {
      border: none;
    }
  }
  .title {
    margin-right: 3px;
    color: #000;
    font-size: 18px;
    font-weight: 600;
  }
  .iconfont {
    font-size: 20px;
  }
}
.ui_hotel {
  .kfBox {
    position: fixed;
    left: 10px;
    bottom: 40px;
    width: 48px;
    height: 48px;
    filter: drop-shadow(0px 0px 20px rgba(0, 0, 0, 0.12));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    .iconfont {
      font-size: 20px;
    }
  }
  .footer {
    display: flex;
    padding: 12px 16px;
    width: 100vw;
    background: #fff;
    border-top: 0.5px solid #eeeeee;
    //position: relative;
    padding-bottom: calc(~"12px + constant(safe-area-inset-bottom)");
    padding-bottom: calc(~"12px + env(safe-area-inset-bottom)");
    position: fixed;
    left: 0;
    bottom: 0;
    .kefu {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      width: 60px;
      padding-right: 16px;
      font-size: 14px;
      .iconfont {
        font-size: 24px;
      }
    }

    .order-btn {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      background: #000;
      border-radius: 4px;
      color: #ffffff;
      font-size: 16px;
      height: 48px;
    }
  }
  .hotel-icon-list {
    margin-top: 32px;

    .title {
      font-size: 18px;
      line-height: 1;
      font-weight: bold;
    }

    .icon-list {
      margin-top: 32px;
      //height: 140px;
      position: relative;

      .icons {
        display: flex;
        flex-wrap: wrap;
        .icon {
          margin-bottom: 40px;
          flex: 1;
          min-width: 20%;
          text-align: center;
          &:nth-child(n + 6) {
            flex: 0 0 20%;
          }
          .img {
            width: 18px;
            height: 18px;
          }

          .name {
            margin-top: 10px;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.5);
          }
        }
      }
    }
  }
  .next-btn {
    //position: absolute;
    bottom: 0;
    width: 100%;
    border-top: 0.5px solid #eeeeee;
    padding: 12px 16px;
    background: #fff;
    padding-bottom: calc(12px + constant(safe-area-inset-bottom));
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
    .choose-item {
      color: #808080;

      text-align: center;
      font-size: 12px;
      line-height: 12px;
    }
    .btn {
      margin-top: 12px;
      line-height: 48px;
      height: 48px;
      .baseBtn();
    }
  }
  .roomInfo {
    padding-bottom: 100px;
    max-height: 80vh;
    overflow-y: scroll;
    .bookFooter {
      display: flex;
      align-items: center;
      .leftPart {
        flex: 1;
        .priceItem {
          color: #808080;
          font-size: 12px;
          .price {
            color: #000;
            font-weight: 600;
            font-size: 20px;
            font-family: Montserrat;
          }
        }
        .priceItem2 {
          color: #000;
          font-size: 10px;
          padding: 2px;
          border-radius: 4px;
          background: rgba(219, 137, 0, 0.16);
          display: inline-block;
        }
      }
      .rightPart {
        .bookBtn {
          .baseBtn();
          width: 144px;
          height: 48px;
          text-align: center;
          line-height: 48px;
          &.disabled {
            background: #eee;
            color: #ccc;
          }
        }
      }
    }
    .swiperBox {
      height: 282px;
      position: relative;
    }
    .subRoomInfo {
      padding: 16px;
      padding-top: 0px;
      .rooomDes {
        height: 52px;
        display: flex;
        align-items: center;
        .rooomDesItem {
          flex: 1;
          height: 100%;
          align-items: center;
          color: #000;
          font-size: 14px;
          display: flex;
          .iconfont {
            margin-right: 12px;
            font-size: 20px;
          }
        }
      }
      .hotelAboutItem {
        .hotelAboutTitle {
          color: #000;
          font-size: 18px;
          margin: 16px 0;
        }
        .hotelAboutdesc {
          color: #808080;
          font-size: 14px;
          line-height: 22px;
        }
      }
    }
  }
  .loadingImg {
    width: 100vw;
  }
  .equipBox {
    display: flex;
    flex-wrap: wrap;

    .iconWrapper {
      flex: 0 0 20%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 60px;

      .equipIcon {
        height: 20px;
        width: 20px;
      }

      .equipDesc {
        color: #808080;
        font-size: 12px;
        margin-top: 8px;
      }
    }
  }
  .hotelItemWrapper {
    transition: all 0.5s;
    position: relative;
    height: 100vh;
    width: 100%;
    .placeholder {
      transition: all 0.5s;
      &.disabled {
        pointer-events: none;
      }
    }
    &.full {
      position: relative;
      bottom: 0;
      left: 0;
    }
  }
  .hotelItem {
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
    position: relative;
    overflow: hidden;
    padding: 0 16px;
    margin-top: -20px;
    background: #f8f8f8;

    .touchLine {
      height: 28px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      .rect {
        width: 40px;
        height: 4px;
        border-radius: 100px;
        background-color: #ccc;
        margin-top: -4px;
      }
      .iconfont {
        .expandClick();
      }
    }

    .topBox {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .priceItem {
        display: flex;
        align-items: baseline;
        font-size: 12px;
        color: #808080;

        .price {
          font-size: 20px;
          color: #a43127;
          font-weight: 600;
          font-family: Montserrat;
        }
      }

      .collect {
        .iconfont {
          font-size: 20px;
          color: #888888;
          &.active {
            color: #a43127;
          }
        }
      }
    }

    .tagList {
      display: flex;
      align-items: center;
      margin-top: 12px;

      .tagItem {
        font-size: 12px;
        color: #a43127;
        background: rgba(164, 49, 39, 0.12);
        border-radius: 4px;
        padding: 4px;
        margin-right: 4px;
      }
    }

    .mapBox {
      margin-top: 16px;
      background: #fff;
      border-radius: 8px;
      display: flex;
      padding: 16px 20px;

      .leftPart {
        flex-basis: 175px;
        font-size: 14px;
        color: #000000;
        font-weight: 400;
        line-height: 22px;
        .line-clamp(2);
      }

      .rightPart {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .iconfont {
          font-size: 28px;
          margin-left: 20px;
        }
      }
    }

    .bigTitle {
      font-weight: bold;
      font-size: 18px;
      color: #000000;
      margin-top: 32px;
      margin-bottom: 24px;
    }

    .calendarBox {
      background: #ffffff;
      border-radius: 4px;
      display: flex;
      height: 50px;
      position: relative;
      padding: 0 16px;
      align-items: center;
      padding-right: 20px;
      &.arrow {
        &::after {
          left: calc(~"100% - 16px");
        }
      }

      .timerMiddleBox {
        width: 110px;
        display: flex;
        align-items: center;
        justify-content: center;

        .days {
          font-size: 10px;
          color: #000000;
          padding: 4px 8px;
          border: 1px solid #eeeeee;
          border-radius: 20px;
          line-height: 10px;
          position: relative;
          &:after {
            content: "";
            height: 1px;
            width: 18px;
            position: absolute;
            left: -18px;
            top: 8px;
            background: #eeeeee;
          }
          &:before {
            content: "";
            height: 1px;
            width: 18px;
            position: absolute;
            left: 100%;
            top: 8px;
            background: #eeeeee;
          }
        }
      }

      .timerBox {
        .timeDetails {
          display: flex;
          align-items: baseline;

          .dayTime {
            font-size: 14px;
            color: #000000;
            font-weight: 500;
          }

          .weekTime {
            font-size: 12px;
            color: #808080;
          }
        }
      }
    }
  }

  .bgItem {
    transition: all 0.5s;
    position: fixed;
    /* left: 0;
    top: 0; */
    width: 100vw;
    height: 100vh;
    background: #42535c;
    .seeMoreBox {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      scroll-view ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
        display: none;
      }
      .seeMoreInner {
        padding: 0 16px;
        height: 100vh;
        overflow-y: scroll;
        transition: all 0.5s;
        &.blur {
          backdrop-filter: blur(10px);
        }
      }
      .infoText {
        color: #fff;
        font-size: 14px;
      }
      .mockHeight {
        height: 448px;
      }
      .mockHeight2 {
        height: 100px;
      }
    }
    .hotelName {
      font-size: 20px;
      color: #ffffff;
      margin-bottom: 8px;
      line-height: 30px;
    }

    .subDesc {
      font-size: 14px;
      color: #ffffff;
      opacity: 0.8;
      margin-bottom: 10px;
    }

    .subName {
      font-size: 12px;
      color: #ffffff;
      font-weight: bold;
      text-indent: 8px;
      position: relative;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      .iconfont {
        margin-left: -5px;
        font-size: 12px;
      }
      &::after {
        content: "";
        background: #ffffff;
        height: 12px;
        width: 2px;
        display: block;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
    &.full {
      .bgImg {
        height: 448px !important;
        transition: all 0.5s;
      }
      .hotelInfoBox {
        //margin-top: -90px;
        .fadeBg {
          height: 90px;
        }
      }
    }

    .bgImg {
      width: 100%;
      height: 282px;
      display: block;
    }
    .hotelInfoBox {
      //margin-top: -132px;
      transition: all 0.5s;
      overflow: auto;
      position: relative;
      .fadeBg {
        transition: all 0.5s;
        height: 132px;
        background-image: linear-gradient(
          180deg,
          rgba(117, 131, 145, 0) 0%,
          #42535c 100%
        );
        .fadeInfoBox {
          padding: 0 16px;
        }
      }
    }
    .bgInfoBox {
      padding: 0px 16px;
      height: calc(~"100vh - 488px - 52px - 52px");
      overflow-y: scroll;
      padding-bottom: 200px;
      .infoText {
        font-size: 14px;
        color: #ffffff;
        line-height: 22px;
        opacity: 0.8;
      }
    }
  }
}
</style>
