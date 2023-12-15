<template>
  <div class="dailyDetail_ui">
    <div class="topContent">
      <div class="coustom-head">
        <coustom-head
          :color="scrollTop > 50 ? '#000' : '#fff'"
          :bgColor="scrollTop > 50 ? '#fff' : ''"
        >
          <template v-slot:title>
            <div class="head-box">
              <div
                class="head"
                v-if="scrollTop < 30 && activityDetail.videoUrls"
              >
                <div
                  class="head-item"
                  :class="{ active: swiperCurrent == -1 }"
                  @click="tabSwiper(0)"
                >
                  视频
                </div>
                <div
                  class="head-item"
                  :class="{ active: swiperCurrent > -1 }"
                  @click="tabSwiper(1)"
                >
                  照片集
                </div>
              </div>
              <!-- #ifdef MP -->
              <!-- <div class="share-icon" :style="menuPos" @click="toShare">
                <i class="iconfont icon-a-20_fenxianganniu_bai"></i>
              </div> -->
              <!-- #endif -->
            </div>
          </template>
        </coustom-head>
      </div>
      <div class="swiper-box">
        <swiper-box
          :slides="slides"
          :swiperConfig="swiperConfig"
          :videoUrl="activityDetail.videoUrls"
          @change="changeSwiper"
          ref="swiperRef"
        ></swiper-box>
      </div>
      <div class="product-info">
        <!-- <div class="product-name">
          {{ activityDetail.name }}
          <div class="share_wrap" @click="toCollection()">
            <i
              class="icon-a-20_shoucang_weishoucang iconfont share_icon"
              :class="{ active: isCollect }"
            ></i>
          </div>
        </div> -->
        <div class="product-name">
          {{ activityDetail.name
          }}<i
            class="iconfont"
            :class="{
              active: isCollect,
              'icon-a-20_shoucang_yishoucang': isCollect,
              'icon-a-20_shoucang_weishoucang': !isCollect,
            }"
            @click="toCollection()"
          ></i>
        </div>
        <div class="product-sub-tl" v-html="activityDetail.introduce"></div>
        <!-- <div
        class="product-price"
        v-if="
          !activityDetail.minPriceDto.payType ||
          activityDetail.minPriceDto.payType != 'mix'
        "
      >
        ¥{{ activityDetail.minPriceDto.mixPrice }}
        <div class="unit">/人起</div>
      </div> -->
        <!-- <div
        class="product-price"
        v-else-if="activityDetail.minPriceDto.payType == 'mix'"
      >
        {{ activityDetail.minPriceDto.credit }}积分+¥{{
          activityDetail.minPriceDto.mixPrice
        }}
        <div class="unit">/人起</div>
      </div> -->
        <div class="product-price" v-if="activityDetail.minPriceDto.price">
          ¥{{ activityDetail.minPriceDto.price }}起
        </div>
        <div class="product-price" v-else>免费</div>
        <div class="other-price" v-if="activityDetail.minPriceDto.mixCredit">
          现金+积分价：<span v-if="activityDetail.minPriceDto.mixPrice">
            ¥{{ activityDetail.minPriceDto.mixPrice }} </span
          >+ <span> {{ activityDetail.minPriceDto.mixCredit }}积分</span>
          /份起
        </div>
        <div class="themes" v-if="activityDetail.tagsList">
          <div
            class="theme"
            v-for="(tag, j) in activityDetail.tagsList"
            :key="j"
          >
            {{ tag }}
          </div>
        </div>
      </div>
      <div class="intro_wrap">
        <div class="intro_item">
          <div class="intro_left">适用人数</div>
          <div class="intro_right">
            <div
              v-if="activityDetail.minCapacity || activityDetail.maxCapacity"
            >
              <!-- <span v-if="activityDetail.minCapacity"
                >最少{{ activityDetail.minCapacity }}人</span
              >
              <span v-if="activityDetail.maxCapacity"
                >最多{{ activityDetail.maxCapacity }}人</span
              > -->
              <span> {{ activityDetail.minCapacity }}</span>
              <span
                v-if="activityDetail.minCapacity && activityDetail.maxCapacity"
                >-</span
              >
              <span>{{ activityDetail.maxCapacity }}</span>
              <span v-if="activityDetail.adapterPeople == 'CHILD'">名儿童</span>
              <span v-if="activityDetail.adapterPeople == 'ADULT'">名成人</span>
              <span v-if="activityDetail.adapterPeople == 'ALL'"></span>
            </div>
            <div v-else>不限</div>
          </div>
        </div>
        <div class="intro_item">
          <div class="intro_left">预约规则</div>
          <div class="intro_right" v-if="activityDetail.earlyDays > 0">
            <span>提前</span>
            <span>{{ activityDetail.earlyDays }}</span>
            <span>{{
              activityDetail.resrvRule == "ONE_DAY" ? "天" : "小时"
            }}</span>
            <span>预约</span>
          </div>
          <div class="intro_right" v-else>无需预约</div>
        </div>
        <div class="intro_item">
          <div class="intro_left">联系电话</div>
          <div class="intro_right">{{ activityDetail.phone }}</div>
        </div>
        <div class="intro_item">
          <div class="intro_left">接待时间</div>
          <div class="intro_right">
            {{ activityDetail.activityBegin }}-{{ activityDetail.activityEnd }}
          </div>
        </div>
        <div class="intro_item" v-if="'activityDetail.activityCode'">
          <div class="intro_left">规则说明</div>
          <div class="intro_right" v-html="activityDetail.useRule"></div>
        </div>
        <div class="intro_item" v-if="'activityDetail.activityCode'">
          <div class="intro_left">产品亮点</div>
          <div class="intro_right" v-html="activityDetail.benefit"></div>
        </div>
        <!-- <div class="intro_item">
        <div class="intro_left">其他说明</div>
        <div class="intro_right show_two">
          {{ activityDetail.otherRemark }}
        </div>
      </div> -->
      </div>
      <div class="product-info-box">
        <div class="title">适用酒店</div>
        <div class="hotel_list">
          <div
            class="address_wrap"
            v-for="(hItem, hIndex) in hotels"
            :key="hIndex"
          >
            <div class="address_left" @click="goHotel(hItem)">
              <div class="address_title">
                <div>{{ hItem.descript }}</div>
                <i class="icon-a-12_youlajiantou_hei iconfont"></i>
              </div>
              <div class="address_text">{{ hItem.address }}</div>
            </div>
            <div class="address_right">
              <div class="position" @click="goMap(hItem)">
                <i class="icon-a-28_ditu iconfont pos_icon"></i>
              </div>
              <div class="tel" @click="makePhone(hItem.phone)">
                <i class="icon-a-28_dianhua iconfont pos_icon"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="product-info-box">
        <div class="title">可订班期</div>
        <div class="dates-box" v-if="dailyEffectiveNum > 0">
          <div class="dates">
            <template v-for="(item, i) in dailyPriceList" :key="i">
              <div
                class="date"
                v-if="item.show"
                :class="{
                  active: item.dateName == curDailyPrice.dateName,
                }"
                @click="chooseDate(item)"
              >
                <div class="label">{{ item.week }}</div>
                <div class="val">{{ item.MMdd }}</div>
                <div class="price" v-if="item.priceType == 'FREE'">免费</div>
                <div class="price" v-else>¥{{ item.price }}起</div>
              </div>
            </template>
            <div
              class="all-date"
              v-if="dailyEffectiveNum >= 4"
              @click="showOrderLayer()"
            >
              <i class="icon-a-12_riqi iconfont"></i>
              全部
            </div>
          </div>
        </div>
        <div class="dates timeRange_wrap">
          <div
            class="date_time"
            v-for="(citem, ic) in calendarTimeList"
            :key="ic"
            :class="{
              unActive: !citem.canSelect,
              active: citem.startDate == currentTime.startDate,
            }"
            @click="chooseDateTime(citem)"
          >
            <div
              class="time_val"
              :class="{
                fontActive: citem.startDate == currentTime.startDate,
              }"
            >
              {{ citem.startDate }}-{{ citem.endDate }}
            </div>
            <div class="time_num" v-if="citem.capacityType != 'INFINITY'">
              余{{ citem.capacity }}份
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="tabs-warp">
      <div
        class="tabs"
        :class="{ fixed: fixed }"
        :style="{ top: navHeight + 'px' }"
      >
        <div
          class="tab"
          @click="switchTab(1)"
          :class="{ active: isActive == '1' }"
        >
          须知
        </div>
        <div
          class="tab"
          @click="switchTab(2)"
          :class="{ active: isActive == '2' }"
        >
          问答
        </div>
      </div>
    </div>
    <div
      class="product-info-box contentHight"
      v-if="activityDetail.activityCode"
    >
      <div class="title">费用说明及预订须知</div>
      <div class="explain-box">
        <div class="explain-list">
          <div class="explain-item">
            <collapse
              defaultHeight="30px"
              open="true"
              arrowStyle="position: absolute;right: 0;top: -5px;width: 100%;display: flex;justify-content: flex-end;"
              iconName="icon-a-16_xialajiantou_hei"
            >
              <template v-slot:content>
                <div class="explain-item">
                  <div class="tl">费用说明</div>
                  <div class="desc">
                    <div v-html="activityDetail.priceExplain"></div>
                  </div>
                </div>
              </template>
            </collapse>
          </div>
        </div>
        <div class="explain-list">
          <div class="explain-item">
            <collapse
              defaultHeight="30px"
              open="true"
              arrowStyle="position: absolute;right: 0;top: -5px;width: 100%;display: flex;justify-content: flex-end;"
              iconName="icon-a-16_xialajiantou_hei"
            >
              <template v-slot:content>
                <div class="explain-item">
                  <div class="tl">温馨提示</div>
                  <div class="desc">
                    <div v-html="activityDetail.extraTips"></div>
                  </div>
                </div>
              </template>
            </collapse>
          </div>
        </div>
        <div class="explain-list">
          <div class="explain-item">
            <collapse
              defaultHeight="30px"
              open="true"
              arrowStyle="position: absolute;right: 0;top: -5px;width: 100%;display: flex;justify-content: flex-end;"
              iconName="icon-a-16_xialajiantou_hei"
            >
              <template v-slot:content>
                <div class="explain-item">
                  <div class="tl">预订条款及取消政策</div>
                  <div class="desc">
                    <div v-html="activityDetail.resrvNotice"></div>
                  </div>
                </div>
              </template>
            </collapse>
          </div>
        </div>
      </div>
    </div>
    <div class="product-info-box contentHight">
      <div class="title">常见问题</div>
      <div class="problems">
        <div class="problem" v-for="(item, i) in questionList" :key="i">
          <div class="question">Q：{{ item.title }}</div>
          <div class="answer">A：{{ item.answer }}</div>
        </div>
      </div>
      <div
        class="more-box"
        @click="toPage('/pagesB/other/question?businessType=' + 'Activity')"
      >
        <div class="more-btn">更多问题</div>
      </div>
    </div>
    <div class="footer">
      <div class="kefu_wrap" @click="showKf()">
        <i class="iconfont icon-a-20_kefu ke_icon"></i>
        <div class="ke_text">客服</div>
        <!-- <img class="kefu_img" src="./images/call.png" alt="" /> -->
      </div>
      <div
        class="order-btn"
        @click="confirmOrder()"
        v-if="activityDetail.canResrv == 'T'"
      >
        预订
      </div>
      <div class="order-noBtn" v-else>暂时无法预订</div>
    </div>
    <bottom-dialog
      ref="orderLayer"
      title="可订班期"
      :titleBorder="true"
      maxDialog
    >
      <div class="order-layer">
        <div class="order-box">
          <!-- <div class="title">出行日期</div> -->
          <div class="booking-date">
            <daily-price
              ref="dailyPrices"
              @change-dailyPrice="changedailyPrice"
            ></daily-price>
          </div>
          <div class="next-btn">
            <div class="btn baseBtn" @click="hideDialog()">下一步</div>
          </div>
        </div>
      </div>
    </bottom-dialog>
    <back-to-top></back-to-top>
    <kf-dialog ref="kf" title="联系客服"></kf-dialog>
    <!-- <share></share> -->
    <!-- <canvas canvas-id="myCanvas" class="canvas-ninja" width="375" height="667" /> -->
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, nextTick } from "vue";
import api from "@/utils/api";
import kfDialog from "@/components/kfDialog.vue";
import swiperBox from "@/components/swiperBox.vue";
import share from "@/components/share.vue";
import backToTop from "@/components/backToTop.vue";
// import explain from "@/pagesE/components/explain.vue";
import dailyPrice from "@/pagesE/components/dailyPrice.vue";
import { onShareAppMessage, onLoad } from "@dcloudio/uni-app";
import { createUrl, getUrlParams, toLogin } from "@/utils/utils";
import coustomHead from "@/components/coustomHead.vue";
import useScroll from "@/hooks/useScroll";
import { getStorage, setStorage } from "@/utils/wxuser";
import bottomDialog from "@/components/bottomDialog.vue";
import collapse from "@/components/collapse.vue";
import coordtransform from "coordtransform";
import dayjs from "dayjs";
import { jAlert3, jAlert5 } from "@/base/jAlert/jAlert";
import UmengSDK from "@/utils/umengAdaptor.js";
const { scrollTop, onPageScroll } = useScroll();
let config = getStorage("config");
let user = getStorage("user");
const kf = ref();
const dailyPrices = ref<HTMLElement | any>();
const curDailyPrice: any = ref({}); //当前价格日历
const orderLayer = ref(); //价格日历弹窗
let swiperConfig = reactive({
  indicatorDots: false,
  autoplay: false,
  dotPosStyle: "left: 50%;transform: translateX(-50%);bottom:12px;",
});
let dailyEffectiveNum = ref(0);
let activityCode = ref();
let isAjax = ref(false);
let isCollect = ref(false);
let ids: any = ref([]);
const swiperCurrent = ref(-1);
const swiperRef = ref();
const sideslip = ref(false);
const openFixed: any = ref([]);
const stop = ref(true);
const isActive = ref(1);
const navHeight = ref(0);
const fixed = ref(false);
const questionList: any = ref({});
const activityDetail: any = ref({
  minPriceDto: <any>{},
});
const dailyPriceList: any = ref([]);
const calendarTimeList: any = ref([]);
const currentTime: any = ref({});
let hotels = ref<any>([]);
let totalRows = ref(1);
let fromDate = ref(dayjs().format("YYYY-MM-DD"));
let slides: {
  imgUrl: string;
}[] = reactive([]);
const showKf = () => {
  kf.value.showDialog();
};
onPageScroll((e) => {
  scrollTop.value = e.scrollTop;

  const topList: any[] = [];
  const query = uni.createSelectorQuery();
  query.selectAll(".contentHight").boundingClientRect();
  const query2 = uni.createSelectorQuery();
  query2.selectAll(".tabs-warp").boundingClientRect();
  query2.exec((res) => {
    if (res[0][0].top < navHeight.value) {
      fixed.value = true;
    } else {
      fixed.value = false;
    }
  });
  query.exec((res) => {
    for (var i = 0; i < res[0].length; i++) {
      topList.push(res[0][i].top);
    }

    if (!stop.value) {
      return;
    }
    if (topList[3] < 0) {
      isActive.value = 4;
    } else if (topList[2] < 0) {
      isActive.value = 3;
    } else if (topList[1] < 0) {
      isActive.value = 2;
    } else {
      isActive.value = 1;
    }
  });
  const query3 = uni.createSelectorQuery();
  query3.selectAll(".travel-date-item").boundingClientRect();
  query3.exec((res) => {
    // console.log(res);
    if (res && res.length > 0) {
      openFixed.value = [];
      res[0].forEach((item: any, i: number) => {
        if (item.top < navHeight.value + 39) {
          openFixed.value.forEach((open: any, j: number) => {
            if (j < i) {
              openFixed.value[j] = false;
            }
          });
          openFixed.value[i] = true;
        } else {
          openFixed.value[i] = false;
        }
      });
    }
  });
});
const tabSwiper = (val: number) => {
  swiperRef.value.changeCurrent(val);
};
const changeSwiper = (value: number) => {
  swiperCurrent.value = value;
};
const goHotel = (hotel: any) => {
  uni.navigateTo({
    url: `/pagesC/order/hotel?hotelCode=${hotel.code}`,
  });
};
const changedailyPrice = (item: any) => {
  // console.log(item, "详情val-----------");
  curDailyPrice.value = item;

  // let canSelectTime = dayjs().add(
  //   item.earlyDay == 0 ? -24 : item.earlyDay,
  //   "hour"
  // );
  // // console.log(item.earlyDay,"item.earlyDay-------------")
  // // console.log(dayjs(canSelectTime).format("YYYY-MM-DD"),"canSelectTime--------------")
  // item.dateList.calendarWithPriceDto.map((ctem: any) => {
  //   let time = ctem.bizDate + " " + ctem.startDate + ":00";
  //   if (
  //     !dayjs(time).isAfter(dayjs(canSelectTime)) &&
  //     item.resrvRule == "ONE_HOUR" &&
  //     dayjs(dayjs().format("YYYY-MM-DD")).isSame(
  //       dayjs(ctem.bizDate).format("YYYY-MM-DD")
  //     )
  //   ) {
  //     ctem.canSelect = false;
  //   } else {
  //     ctem.canSelect = true;
  //   }
  // });
  calendarTimeList.value = item.dateList.calendarWithPriceDto;
  if (item.time) {
    currentTime.value = item.nextTime;
  }
};
const chooseDate = (item: any) => {
  item.canTap = true;
  item.isActive = true;
  item.number = item.sumCapacity;
  item.capacityType = item.capacityType;
  curDailyPrice.value = item;
  let canSelectTime = dayjs().add(
    item.earlyDay == 0 ? -24 : item.earlyDay,
    "hour"
  );
  // console.log(item.earlyDay,"item.earlyDay-------------")
  // console.log(dayjs(canSelectTime).format("YYYY-MM-DD"),"canSelectTime--------------")
  // item.dateList.calendarWithPriceDto.map((ctem: any) => {
  //   let time = ctem.bizDate + " " + ctem.startDate + ":00";
  //   if (
  //     !dayjs(time).isAfter(dayjs(canSelectTime)) &&
  //     item.resrvRule == "ONE_HOUR" &&
  //     dayjs(dayjs().format("YYYY-MM-DD")).isSame(
  //       dayjs(ctem.bizDate).format("YYYY-MM-DD")
  //     )
  //   ) {
  //     ctem.canSelect = false;
  //   } else {
  //     ctem.canSelect = true;
  //   }
  // });
  calendarTimeList.value = item.dateList.calendarWithPriceDto;
  currentTime.value = {};
  dailyPrices.value.chooseTime({});
  dailyPrices.value.chooseDay(item);
};
const chooseDateTime = (item: any) => {
  if (item.canSelect) {
    currentTime.value = item;
    curDailyPrice.value.time = item.startDate + "-" + item.endDate;
    curDailyPrice.value.onSaleCode = item.onSaleCode;
    dailyPrices.value.chooseTime(item);
  }
};
const hideDialog = () => {
  if (!curDailyPrice.value.onSaleCode) {
    jAlert3("请选择预约时间");
    return;
  }
  orderLayer.value.hideDialog();
  confirmOrder();
};
const showOrderLayer = () => {
  if (activityDetail.value.canResrv == "F") {
    return;
  }
  if (!(user && user.memberId)) {
    toLogin();
    return;
  }
  if (dailyPriceList.value.length > 0) {
    defultDate();
  } else {
    jAlert3("暂无可预订时间");
  }
  orderLayer.value.showDialog();
};
const defultDate = () => {
  // let defultDate = dailyPriceList.value.find((item: any) => {
  //   return item.show;
  // });

  // dailyPriceList.value.map((atem: any) => {
  //   let canSelectTime = dayjs().add(
  //     atem.earlyDay == 0 ? -24 : atem.earlyDay,
  //     "hour"
  //   );
  //   // console.log(dayjs(canSelectTime).format("YYYY-MM-DD"),"canSelectTime--------------")
  //   atem.dateList.calendarWithPriceDto.map((ctem: any) => {
  //     let time = ctem.bizDate + " " + ctem.startDate + ":00";
  //     if (
  //       !dayjs(time).isAfter(dayjs(canSelectTime)) &&
  //       atem.resrvRule == "ONE_HOUR" &&
  //       dayjs(dayjs().format("YYYY-MM-DD")).isSame(
  //         dayjs(ctem.bizDate).format("YYYY-MM-DD")
  //       )
  //     ) {
  //       ctem.canSelect = false;
  //     } else {
  //       ctem.canSelect = true;
  //     }
  //   });
  // });
  if (!curDailyPrice.value.onSaleCode) {
    let defultDate = dailyPriceList.value.find((item: any) => {
      let ctIndex = item.dateList.calendarWithPriceDto.findIndex(
        (citem: any) => {
          return citem.canSelect;
        }
      );
      return ctIndex != -1 && item.show;
    });
    // console.log(defultDate,'defultDate------------------')
    let defultTime = defultDate.calendarWithPriceDto.find((citem: any) => {
      return citem.canSelect;
    });
    chooseDate(defultDate);
    chooseDateTime(
      defultTime ? defultTime : defultDate.calendarWithPriceDto[0]
    );
  }
};
const confirmOrder = () => {
  if (!curDailyPrice.value.onSaleCode) {
    showOrderLayer();

    // jAlert3("请选择预约时间");
    return;
  }
  if (!(user && user.memberId)) {
    toLogin();
    return false;
  }
  let arrPay: any = [];
  let priceList: any = [];
  if (activityDetail.value.minPriceDto.payType) {
    arrPay = activityDetail.value.minPriceDto.payType.split(",");
  }
  arrPay.map((item: any) => {
    let obj = {
      credit: activityDetail.value.minPriceDto.credit,
      mixCredit: activityDetail.value.minPriceDto.mixCredit,
      mixPrice: activityDetail.value.minPriceDto.mixPrice,
      payType: item,
      price: activityDetail.value.minPriceDto.price,
      priceType: activityDetail.value.minPriceDto.priceType,
    };
    priceList.push(obj);
  });
  var data = {
    title: activityDetail.value.name,
    activityCode: activityCode.value,
    hotels: hotels.value,
    minSaleSize: activityDetail.value.minSaleSize,
    minPriceList: priceList,
    curDailyPrice: curDailyPrice.value,
    price: activityDetail.value.minPriceDto.price,
    dailyPriceList: dailyPriceList.value,
    ...activityDetail.value,
  };
  setStorage("dailyActivityInfo", data);
  toPage("/pagesE/dailyActivity/submitOrder");
};
const toPage = (link: string) => {
  uni.navigateTo({
    url: link,
  });
};
const switchTab = (val: any) => {
  const query1 = uni.createSelectorQuery();
  const query = uni.createSelectorQuery();
  const topList: any[] = [];
  stop.value = false;
  query1.selectAll(".topContent").boundingClientRect();
  query.selectAll(".contentHight").boundingClientRect();
  query1.exec((res) => {
    var top = res[0][0].height - 15;
    query.exec((res) => {
      for (var i = 0; i < res[0].length; i++) {
        topList.push(res[0][i].height + 32);
      }
      for (let i = 0; i < val - 1; i++) {
        top += topList[i];
      }

      uni.pageScrollTo({
        scrollTop: top,
        duration: 200,
        success: (res) => {
          isActive.value = val;
          setTimeout(() => {
            stop.value = true;
          }, 300);
        },
      });
    });
  });
};
const getHotelList = (hotelCodes: any) => {
  if (hotels.value.length >= totalRows.value) {
    return false;
  }
  var findHotelParameter = {
    hotelCodes: hotelCodes,
    // fromDate: fromDate.value,
    // toDate: getNextMonthDay(),
    otaChannel: "WECHAT",
    hotelGroupCodes: config.hotelGroupCode,
    cardLevel: "",
    hasPriceMin: "T",
    clientLatitude: "",
    clientLongitude: "",
    position: "",
    positionValue: "",
    keyWord: "",
    // radius: "3000000",
    pageSize: 9999,
    firstResult: 0,
    cardType: "",
    appid: config.appid,
    componentAppid: config.componentAppid,
  };
  api
    .findHotel(findHotelParameter)
    .then(function (response: any) {
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
            if (gcHotelPicTags.length > 0) {
              n.gcHotelPicTag = gcHotelPicTags[0].descript;
            }
          }
        });
        hotels.value = hotels.value.concat(response.retVal.resultInfos);
      }
    })
    .catch(function (error: any) {
      console.log(error);
    });
};
// 日活动
const getActivityDetail = () => {
  api
    .interfaceTransfer({
      config: {
        interfaceType: "GET",
        interfaceModule: "GC_ACTIVITIES_CENTER",
        interfaceMethod: "api/activity/getOneActivityWithPrice",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
      query: {
        unitCode: config.hotelGroupCode,
        activityCode: activityCode.value,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        const info = res.retVal.retVal;

        let roundPicArr = info.roundPictures
          ? info.roundPictures.split(";")
          : [];
        roundPicArr.forEach((item: string) => {
          slides.push({
            imgUrl: item,
          });
        });
        info.pay = info.minPriceDto.payType.includes("INTEGRALCASH")
          ? "mix"
          : "money";
        info.activityTags = info.activityTags
          ? info.activityTags.split(",")
          : [];
        activityDetail.value = info;
        getHotelList(info.belongHotels);
        listTravelProblem(info.questions);
        getSaleCalendar(info);
      }
      // console.log(activityDetail.value, "activityDetail.value-----");
    })
    .finally(() => {
      UmengSDK.sendPV({
        page_id: "2001",
        page_name: "daily_activity_detail_pg",
        page_title_name: activityDetail.value.name,
        product_name: activityDetail.value.name,
      });
    });
};
const listTravelProblem = (questions: any) => {
  api
    .interfaceTransfer({
      query: {
        isHalts: "F",
        unitCode: config.hotelGroupCode,
        problemCode: questions,
      },
      config: {
        interfaceType: "POST",
        interfaceModule: "GC_PRODUCT_JOURNEY",
        interfaceMethod: "/api/itinerary/listTravelProblem",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        questionList.value = res.retVal.retVal;
      }
    });
};
const objectOrder = (obj: any) => {
  //排序的函数
  var newkey = Object.keys(obj).sort(); //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  var newObj: any = {}; //创建一个新的对象，用于存放排好序的键值对
  for (var i = 0; i < newkey.length; i++) {
    //遍历newkey数组
    newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj; //返回排好序的新对象
};
const getSaleCalendar = (info: any) => {
  uni.showLoading({
    title: "加载中...",
  });
  let resrvRule = info.resrvRule || "";
  let early = info.earlyDays;
  let capacityType = info.capacityType;
  api
    .interfaceTransfer({
      config: {
        interfaceType: "GET",
        interfaceModule: "GC_ACTIVITIES_CENTER",
        interfaceMethod: "api/singleWechat/onSaleCalendarWithMoney",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
      query: {
        unitCode: config.hotelGroupCode,
        activityCode: activityCode.value,
        // activityCode: "ACT2023080200000002",
        startDate: dayjs().format("YYYY-MM-DD"),
        endDate: getNextMonthDay(),
      },
    })
    .then((res: any) => {
      dailyPriceList.value = [];
      if (res.result == 1 && res.retVal.result == 0) {
        const info = res.retVal.retVal;
        let arrList = [];
        for (let citem in objectOrder(info)) {
          let o = { dateName: citem, dateList: info[citem] };
          arrList.push(o);
        }
        dailyEffectiveNum.value = 0;
        arrList.forEach((item: any) => {
          const dailyDetail = item;
          // dailyDetail.groupBeginDate = "2023-08-23 00:00:00"
          dailyDetail.calendarWithPriceDto = item.dateList.calendarWithPriceDto;
          dailyDetail.embarkDate = item.dateName;
          dailyDetail.sumCapacity = item.dateList.sumCapacity;
          dailyDetail.priceType = item.dateList.minPriceDto.priceType;
          dailyDetail.MMdd = dayjs(item.dateName).format("MM/DD");
          dailyDetail.earlyDay = early;
          dailyDetail.price = item.dateList.minPriceDto.price;
          dailyDetail.resrvRule = resrvRule;
          dailyDetail.capacityType = capacityType;
          // if (dayjs(item.groupBeginDate)) {
          // 	dailyDetail.week = '周日'
          // }
          // if(dayjs().diff(item.groupBeginDate, 's'))
          let canSelectDay = dayjs()
            .add(resrvRule == "ONE_DAY" ? early - 1 : -1, "day")
            .format("YYYY-MM-DD");
          if (
            dailyEffectiveNum.value <= 4 &&
            dayjs(item.dateName).isAfter(dayjs(canSelectDay)) &&
            item.sumCapacity > 0
          ) {
            item.show = true;
            dailyEffectiveNum.value++;
          }
          if (dayjs(item.dateName).format("d") == "0") {
            dailyDetail.week = "周日";
          }
          if (dayjs(item.dateName).format("d") == "1") {
            dailyDetail.week = "周一";
          }
          if (dayjs(item.dateName).format("d") == "2") {
            dailyDetail.week = "周二";
          }
          if (dayjs(item.dateName).format("d") == "3") {
            dailyDetail.week = "周三";
          }
          if (dayjs(item.dateName).format("d") == "4") {
            dailyDetail.week = "周四";
          }
          if (dayjs(item.dateName).format("d") == "5") {
            dailyDetail.week = "周五";
          }
          if (dayjs(item.dateName).format("d") == "6") {
            dailyDetail.week = "周六";
          }
          // dailyDetail.groupEndDate = dayjs(dailyDetail.dateName).add(
          //   travelDetail.itineraryDays,
          //   "days"
          // );
          // dailyDetail.number = item.productAvailNum;
          // if (travelDetail.categorySub == "FreeTravel") {
          //   if (dailyDetail.number > 8) {
          //     availNum.value = 8;
          //   } else {
          //     availNum.value = dailyDetail.number;
          //   }
          // } else {
          //   if (dailyDetail.number > 4) {
          //     availNum.value = 4;
          //   } else {
          //     availNum.value = dailyDetail.number;
          //   }
          // }
          dailyDetail.price = dailyDetail.dateList.minPriceDto.price;
          dailyDetail.groupBeginDateFormat = dayjs(dailyDetail.dateName).format(
            "MM月DD日"
          );
          dailyDetail.groupBeginDateFormat2 = dayjs(
            dailyDetail.dateName
          ).format("MM.DD");
          dailyDetail.groupEndDateFormat = dayjs(dailyDetail.dateName).format(
            "MM月DD日"
          );
          dailyPriceList.value.push(dailyDetail);
          // item.specificationsPriceDtos.forEach((priceDto : any) => {
          // 	// if (priceDto.specificationsType != itineraryDtos.value.specificationsType) {

          // 	// }
          // })
        });

        dailyPriceList.value.map((atem: any) => {
          let canSelectTime = dayjs().add(
            atem.earlyDay == 0 ? -24 : atem.earlyDay,
            "hour"
          );
          // console.log(dayjs(canSelectTime).format("YYYY-MM-DD"),"canSelectTime--------------")
          atem.dateList.calendarWithPriceDto.map((ctem: any) => {
            let time = ctem.bizDate + " " + ctem.startDate + ":00";
            if (
              !dayjs(time).isAfter(dayjs(canSelectTime)) &&
              atem.resrvRule == "ONE_HOUR" &&
              dayjs(dayjs().format("YYYY-MM-DD")).isSame(
                dayjs(ctem.bizDate).format("YYYY-MM-DD")
              )
            ) {
              ctem.canSelect = false;
            } else {
              ctem.canSelect = true;
            }
          });
          let ctIndex = atem.dateList.calendarWithPriceDto.findIndex(
            (citem: any) => {
              return citem.canSelect;
            }
          );
          if (ctIndex == -1) {
            atem.show = false;
          }
        });
        if (dailyPriceList.value.length > 0) {
          defultDate();
        }
        // console.log(dailyPriceList.value, "dailyPriceList.value-----------");
        setTimeout(() => {
          dailyPrices.value.createDate(dailyPriceList.value);
        }, 1000);
      }
    })
    .finally(() => {
      uni.hideLoading();
    });
};
const getNextMonthDay = () => {
  var d = new Date();
  d.setMonth(d.getMonth() + 2);
  var yy1 = d.getFullYear();
  var mm1: any = d.getMonth() + 1; //因为getMonth（）返回值是 0（一月） 到 11（十二月） 之间的一个整数。所以要给其加1
  var dd1: any = d.getDate();
  if (mm1 < 10) {
    mm1 = "0" + mm1;
  }
  if (dd1 < 10) {
    dd1 = "0" + dd1;
  }
  var t2 = yy1 + "-" + mm1 + "-" + dd1;

  return t2;
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
const addGoodsCollection = () => {
  if (isAjax.value) {
    return false;
  }
  isAjax.value = true;
  api
    .addGoodsCollection({
      goodsId: activityCode.value,
      goodsName: activityDetail.value.name,
      hotelCode: config.hotelCode,
      hotelGroupCode: config.hotelGroupCode,
      memberId: user.memberId,
      picture: activityDetail.value.indexPicture,
      productType: "activity",
      price: activityDetail.value.minPriceDto.price,
      subGoodsName: activityDetail.value.typeDescript,
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
const getGoodsIsCollection = () => {
  api
    .getGoodsIsCollection({
      goodsId: activityCode.value,
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
const makePhone = (phoneNum: any) => {
  uni.makePhoneCall({
    phoneNumber: phoneNum,
  });
};
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
onLoad((options) => {
  if (options && options.activityCode) {
    activityCode.value = options.activityCode;
    // getSaleCalendar();
  }
});
onMounted(() => {
  getActivityDetail();
  getGoodsIsCollection();
  // UmengSDK.sendPV({
  //   page_id: "2001",
  //   page_name: "daily_activity_detail_pg",
  //   page_title_name: activityDetail.name,
  //   product_name:activityDetail.name,
  // });
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");

.dailyDetail_ui {
  padding-bottom: calc(100px + constant(safe-area-inset-bottom));
  padding-bottom: calc(100px + env(safe-area-inset-bottom));
  font-family: PingFang SC;

  ::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    color: transparent;
  }

  .coustom-head {
    position: relative;
    z-index: 5;
    .head-box {
      height: 20px;
      width: 100%;
      position: relative;
    }
    .head {
      display: flex;
      align-items: center;
      margin-top: 2px;
      padding-left: 20px;
      font-size: 14px;

      .head-item {
        position: relative;
        margin-left: 12px;

        opacity: 0.6;
        color: #fff;

        &::after {
          content: "";
          position: absolute;
          right: -6px;
          opacity: 0.6;
          top: 3px;
          width: 1px;
          height: 12px;
          background: #fff;
        }

        &:last-child {
          &::after {
            display: none;
          }
        }

        &.active {
          position: relative;
          opacity: 1;
          font-weight: bold;

          &::before {
            content: "";
            position: absolute;
            background: #fff;
            top: 22px;
            left: 50%;
            transform: translateX(-50%);
            height: 4px;
            width: 4px;
            border-radius: 50%;
          }
        }
      }
    }
  }

  .share-icon {
    position: absolute;
    right: 0;

    .iconfont {
      font-size: 20px;
    }
  }
  .canvas-ninja {
    width: 375px; // 350px
    height: 677px; // 570px， 图片350 + 120
    position: fixed;
    top: 0;
    left: 50%;
    transform: translatex(-50%);
    box-sizing: border-box;
    overflow: hidden;
    z-index: 99999;
  }

  .swiper-box {
    // width: 100%;
    // height: 282px;
    position: relative;
    width: 100%;
    height: 75.2vw;
    z-index: 1;
  }

  .product-info {
    padding: 16px 16px 0;

    .product-name {
      position: relative;
      font-weight: bold;
      font-size: 20px;
      line-height: 30px;
      padding-right: 22px;

      .icon-a-20_shoucang_weishoucang,
      .icon-a-20_shoucang_yishoucang {
        position: absolute;
        font-weight: normal;
        font-size: 20px;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        color: #ccc;

        &.active {
          color: #a43127;
        }
      }

      .icon {
        display: inline-block;
        background: rgba(51, 103, 53, 0.9);
        border-radius: 4px;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #fff;
        padding: 0 4px;
        margin: 5px 8px 5px 0;
        vertical-align: top;
      }
    }

    .product-sub-tl {
      margin-top: 12px;
      color: #808080;
      font-size: 14px;
      line-height: 22px;
    }

    .product-price {
      margin-top: 24px;
      color: #a43127;
      font-weight: 600;
      font-size: 20px;
      line-height: 1;
      font-family: Montserrat;
      font-style: normal;
      font-weight: 600;
      line-height: 20px;
      .unit {
        display: inline;
        color: #808080;
        font-size: 12px;
      }
    }

    .other-price {
      display: inline-flex;
      align-items: center;
      margin-top: 8px;
      background: rgba(219, 137, 0, 0.16);
      border-radius: 4px;
      padding: 4px;
      color: #000000;
      font-size: 10px;
    }

    .themes {
      margin-top: 12px;

      .theme {
        // margin-top: 8px;
        display: inline-block;
        padding: 4px;
        border-radius: 4px;
        color: #a43127;
        font-size: 12px;
        line-height: 1;
        background: rgba(164, 49, 39, 0.12);
        margin-right: 4px;
      }
    }
  }
  .intro_wrap {
    margin: 24px 16px;
    .intro_item {
      display: flex;
      margin-bottom: 12px;
      font-family: PingFang SC;
      .intro_left {
        min-width: 60px;
        font-size: 14px;
        color: #808080;
        margin-right: 12px;
      }
      .intro_right {
        font-size: 14px;
        color: #000;
        rich-text {
          line-height: 14px;
        }
      }
      .show_three {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .show_two {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .product-info-box {
    margin-top: 32px;

    .title {
      padding: 0 16px;
      color: #000000;
      font-size: 18px;
      font-weight: bold;
      line-height: 1;
    }

    .explain-box {
      padding-top: 12px;

      .explain-list {
        margin: 12px 16px 0;
        background: #ffffff;
        border-radius: 8px;
        padding: 16px 12px;
        font-size: 12px;
      }

      .explain-item {
        margin-top: 12px;

        &:first-child {
          margin-top: 0;
        }

        .tl {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: bold;
          height: 14px;
          &.mini-tl {
            height: auto;
            font-size: 12px;
          }
        }

        .desc {
          line-height: 22px;
          margin-top: 16px;
          font-size: 14px;
          color: #808080;
        }

        .explain {
          margin-top: 16px;
        }
      }
    }

    .routes {
      margin-top: 24px;
      white-space: nowrap;
      overflow-x: auto;

      .route {
        margin-left: 8px;
        display: inline-block;
        // align-items: center;
        // justify-content: center;
        // flex-direction: column;
        background: #ffffff;
        border-radius: 8px;
        padding: 16px 21px;
        text-align: center;
        // max-width: 42.67vw;

        &.active {
          border: 1px solid #a43127;
        }

        .label {
          font-weight: bold;
          font-size: 14px;
          line-height: 1;
        }

        .val {
          margin-top: 5px;
          font-size: 12px;
          color: #000000;
          opacity: 0.7;
          overflow: hidden;
          white-space: initial;
          line-height: 18px;
          height: 18px;
        }

        &:first-child {
          margin-left: 16px;
        }

        &:last-child {
          margin-right: 16px;
        }
      }
    }

    .dates-box {
      margin-top: 24px;
      position: relative;
    }
    .dates {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      padding-right: 60px;

      .date,
      .date_time {
        width: 76px;
        height: 88px;
        min-width: 76px;
        min-height: 88px;
        margin-left: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        background: #ffffff;
        border-radius: 8px;
        // padding: 16px 21px;
        box-sizing: border-box;
        border: 1px solid #fff;
        box-shadow: -12px 0px 12px rgba(0, 0, 0, 0.04);

        &.active {
          border: 1px solid #a43127;
        }
        &.unActive {
          opacity: 0.5;
        }

        .label {
          font-size: 12px;
          line-height: 1;
          color: #808080;
        }
        .val {
          margin-top: 8px;
          font-size: 16px;
          line-height: 1;
          color: #000000;
          font-family: PingFang SC;
          font-weight: bold;
          white-space: nowrap;
        }
        .price {
          margin-top: 8px;
          font-size: 12px;
          line-height: 1;
        }

        &:first-child {
          margin-left: 16px;
        }

        &:last-child {
          margin-right: 16px;
        }
      }
      .date_time {
        width: 107px;
        height: 60px;
        min-width: 107px;
        min-height: 60px;
        // padding: 16px 12px;
      }
    }
    .timeRange_wrap {
      margin-top: 12px;
    }
    .time_val {
      min-width: 84px;
      font-size: 14px;
      font-weight: 400;
      line-height: 14px;
      letter-spacing: 0px;
      text-align: center;
      color: #000;
      font-family: PingFang SC;
    }
    .fontActive {
      font-weight: bold;
    }
    .time_num {
      font-size: 10px;
      color: #808080;
      margin-top: 6px;
    }
    .all-date {
      position: absolute;
      right: 0;
      height: 100%;
      width: 52px;
      top: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: #ffffff;
      color: #808080;
      font-size: 14px;
      box-shadow: -12px 0px 12px rgba(0, 0, 0, 0.04);

      .iconfont {
        margin-bottom: 10px;
      }
    }
  }

  .tabs {
    margin-top: 20px;
    display: flex;
    padding: 0 26px;

    .tab {
      position: relative;
      flex: 1;
      text-align: center;
      color: #808080;
      font-size: 16px;
      line-height: 1;
      padding: 12px 0;

      &.active {
        color: #000000;
        font-weight: bold;

        &::after {
          content: "";
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 32px;
          height: 2px;

          background: #a43127;
        }
      }
    }
  }

  .product-info-box {
    .itinerary-pic {
      padding: 24px 16px 32px;

      .itinerary-pic-img {
        width: 100%;
        border-radius: 8px;
      }
    }
    .characteristic {
      margin-top: 32px;

      .characteristic-label {
        display: inline-block;
        background: #000;
        padding: 12px 32px 12px 64px;
        font-size: 16px;
        line-height: 1;
        font-weight: bold;
        color: #fff;
      }

      .characteristic-title {
        font-family: "Source Han Serif CN";
        padding: 16px 16px 20px 16px;

        font-size: 20px;
        line-height: 30px;
        color: #000000;
      }

      .characteristic-list {
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;

        .characteristic-item {
          border-radius: 8px;
          background: #fff;
          margin-left: 8px;

          .characteristic-img {
            width: 88.5444vw;
            height: 66.675vw;
            border-radius: 8px 8px 0px 0px;
          }

          .characteristic-info {
            padding: 20px 12px;
            box-sizing: border-box;
          }

          .characteristic-name {
            font-size: 16px;
            font-weight: bold;
            line-height: 1;
          }

          .characteristic-desc {
            margin-top: 8px;
            color: #808080;
            font-size: 14px;
            line-height: 22px;
          }

          &:first-child {
            margin-left: 16px;
          }

          &:last-child {
            margin-right: 16px;
          }
        }
      }
    }
  }
  .product-info-box {
    .travel-dates {
      padding: 12px 16px 0;
    }

    .ad-banner {
      margin: 32px 16px 0;
      height: 21.9vw;
    }

    .travel-date-item {
      background: #fff;
      margin-top: 12px;
      padding: 16px 0;
      border-radius: 8px;

      .travel-date-rt {
        position: relative;

        .tl {
          .iconfont {
            transition: all 0.2s;
            height: 18px;
            font-weight: normal;
          }
        }
      }

      &.open {
        .travel-date {
          align-items: normal;
        }
        .travel-date-fixed {
          display: flex;
          align-items: center;
          .iconfont {
            color: #a43127;
            transform: rotate(180deg);
          }
        }
        .travel-date-lf {
          .label,
          .val {
            color: #a43127;
          }
        }

        .travel-date-rt {
          .head,
          .tl {
            color: #a43127;

            .iconfont {
              transform: rotate(180deg);
            }
          }
        }

        .desc {
          display: none;
        }

        .day-travel-list {
          display: block;
        }
      }

      .day-travel-list {
        display: none;
        position: relative;

        &:after {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          background-size: 1px 100%;
          width: 1px;

          background: linear-gradient(
            to bottom,
            #eee,
            #eee 5px,
            transparent 5px,
            transparent
          ); /* 调整为垂直渐变 */
          background-size: 100% 10px; /* 调整虚线宽度和间距 */

          left: 25px;
        }

        .day-travel {
          position: relative;
          display: flex;
          margin-top: 16px;
          padding: 0 12px 0 0;

          &:last-child {
            .icon {
              height: auto;
            }
          }

          .icon {
            position: relative;
            display: flex;
            justify-content: center;
            z-index: 2;
            width: 49px;
            height: 20px;
            padding: 8px 0;
            box-sizing: content-box;
            background: #fff;

            .iconfont {
              width: 20px;
              height: 20px;
            }
          }

          .day-travel-info {
            padding-top: 8px;
            padding-left: 12px;
            flex: 1;

            .day-travel-tl {
              font-weight: bold;
              line-height: 20px;
            }

            .day-travel-desc {
              margin-top: 12px;
              font-size: 14px;
              font-family: PingFang SC;
              line-height: 22px;
              color: #808080;
            }

            .day-travel-img-box {
              position: relative;
              width: 100%;
              border-radius: 4px;
              overflow: hidden;
              margin-top: 16px;

              .day-travel-img {
                display: block;
                width: 100%;
              }

              .day-travel-name {
                position: absolute;
                left: 16px;
                top: 16px;
                right: 16px;
                font-weight: bold;
                line-height: 1;
                font-size: 14px;
                color: #fff;
              }
            }
          }
        }
      }
    }

    .travel-date {
      display: flex;
      align-items: center;
      &.travel-date-fixed {
        display: none;
        position: fixed;
        left: 0;
        right: 0;
        background: #fff;
        padding: 16px;
        z-index: 4;
        &::after {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 1px;
          right: 0;
          transform: scaleY(0.5);
          background: #eee;
        }
        .travel-date-rt {
          display: flex;
          justify-content: space-between;
          padding-right: 12px;
        }
      }
      .travel-date-lf {
        position: relative;
        width: 49px;

        .label {
          text-align: center;
          color: #000000;
          font-size: 12px;
        }

        .val {
          text-align: center;
          margin-top: 4px;
          line-height: 1;
          color: #000000;
          font-size: 20px;
          font-family: "Montserrat";
          font-style: normal;
          font-weight: 600;
        }
      }

      .travel-date-rt {
        flex: 1;
        margin-left: 12px;

        &::after {
          content: "";
          position: absolute;
          width: 1px;
          top: 0;
          bottom: 0;
          left: -12px;
          transform: scaleX(0.5);
          background: #eee;
        }

        .head {
          font-size: 14px;
          line-height: 1;
          color: #000000;
        }

        .tl {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          color: #000000;
          padding-right: 12px;
          font-family: "Source Han Serif CN";
          font-style: normal;
          font-weight: 900;
          font-size: 16px;
          line-height: 1.3;

          .icon-a-12_xialajiantou_hei {
            color: #000;
          }
        }

        .desc {
          margin-top: 8px;
          color: #808080;
          font-size: 12px;
          line-height: 18px;
        }
      }
    }

    .problem {
      background: #ffffff;
      border-radius: 8px;
      margin: 12px 16px 0;
      font-size: 12px;
      padding: 12px;

      &:first-child {
        margin-top: 24px;
      }

      .question {
        color: #000000;
        line-height: 1;
        font-size: 16px;
      }

      .answer {
        margin-top: 16px;
        font-size: 14px;
        line-height: 22px;
        color: #808080;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        white-space: normal;
        overflow: hidden;
      }
    }

    .more-box {
      margin-top: 24px;
      display: flex;
      justify-content: center;

      .more-btn {
        padding: 11px 40px;
        border: 1px solid #cccccc;
        border-radius: 170px;
        font-weight: 400;
        font-size: 14px;
        line-height: 1;
      }
    }
  }
  .hotel_list {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    margin: auto 16px;
    margin-top: 24px;
  }
  .address_wrap {
    border-radius: 8px;
    display: flex;
    align-items: center;
    background: #ffffff;
    height: 72px;
    width: 310px;
    min-width: 310px;
    margin-right: 12px;
    .address_left {
      width: 170px;
    }
    .address_title {
      font-size: 16px;
      color: #000;
      font-weight: 500;
      display: flex;
      align-items: center;
      margin: auto auto 8px 16px;
      line-height: 16px;
      div {
        line-height: 1;
      }
    }
    .address_text {
      overflow: hidden; // 溢出隐藏
      white-space: nowrap; // 强制一行
      text-overflow: ellipsis; // 文字溢出显示省略号
      margin-left: 16px;
      font-size: 12px;
      color: #808080;
      line-height: 18px;
    }
    .address_right {
      margin-left: auto;
      margin-right: 24px;
      display: flex;
      .tel {
        margin-left: 20px;
      }
      .pos_icon {
        font-size: 28px;
      }
    }
  }
  .product-info-box {
    .travel-dates {
      padding: 12px 16px 0;
    }

    .travel-date {
      margin-top: 12px;
      padding: 16px 0;
      display: flex;
      background: #fff;
      border-radius: 8px;
      align-items: center;

      .travel-date-lf {
        position: relative;
        padding: 0 12px;

        &::after {
          content: "";
          position: absolute;
          width: 1px;
          top: 0;
          bottom: 0;
          right: 0;
          transform: scaleX(0.5);
          background: #eee;
        }

        .label {
          text-align: center;
          color: #000000;
          font-size: 12px;
        }

        .val {
          text-align: center;
          margin-top: 4px;
          line-height: 1;
          color: #000000;
          font-size: 20px;
          font-family: "Montserrat";
          font-style: normal;
          font-weight: 600;
        }
      }

      .travel-date-rt {
        flex: 1;
        margin-left: 12px;

        .head {
          font-size: 14px;
          line-height: 1;
          color: #000000;
        }

        .tl {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          color: #000000;
          padding-right: 16px;
          font-family: "Source Han Serif CN";
          font-style: normal;
          font-weight: 900;
          font-size: 16px;
          line-height: 1;

          .icon-a-12_xialajiantou_hei {
            color: #000;
          }
        }

        .desc {
          margin-top: 8px;
          color: #808080;
          font-size: 12px;
          line-height: 18px;
        }
      }
    }

    .problem {
      background: #ffffff;
      border-radius: 8px;
      margin: 12px 16px 0;
      font-size: 12px;
      padding: 12px;

      &:first-child {
        margin-top: 24px;
      }

      .question {
        color: #000000;
        line-height: 1;
        font-size: 16px;
      }

      .answer {
        margin-top: 16px;
        font-size: 14px;
        line-height: 22px;
        color: #808080;
      }
    }

    .more-box {
      margin-top: 24px;
      display: flex;
      justify-content: center;

      .more-btn {
        padding: 12px 40px;
        border: 1px solid #cccccc;
        border-radius: 170px;
        font-weight: 400;
        font-size: 14px;
        line-height: 1;
      }
    }
  }

  .footer {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    border-top: 0.5px solid #eeeeee;
    padding-bottom: calc(12px + constant(safe-area-inset-bottom));
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
    .kefu_wrap {
      padding-left: 10px;
      width: 60px;
      .ke_icon {
        font-size: 20px;
        color: #000;
      }
      .ke_text {
        color: #000;
        font-size: 12px;
        line-height: 12px;
        margin-top: 4px;
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
      .baseBtn();
    }
    .order-noBtn {
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      background: rgba(238, 238, 238, 1);
      border-radius: 4px;
      color: rgba(204, 204, 204, 1);
      font-size: 16px;
      height: 48px;
    }
  }

  .order-layer {
    padding-bottom: 100px;

    .title {
      padding: 16px 16px 0;
      color: #000000;
      font-size: 18px;
      font-weight: bold;
      line-height: 1;
    }

    .order-box {
      width: 100%;
      // border-radius: 16px 16px 0 0;
      background: #f8f8f8;
      z-index: 2;
      height: calc(100vh - 230px);
      overflow-y: auto;

      .head {
        position: relative;
        display: flex;
        justify-content: center;
        font-weight: 600;
        font-size: 18px;
        line-height: 1;
        padding: 19px 0;
        background: #fff;
        border-bottom: 1px solid #eeeeee;

        .icon-a-20_guanbi {
          position: absolute;
          left: 22px;
          top: 20px;
          font-size: 20px;
        }
      }
      .booking-date {
        // margin-top: 16px;

        // .dates {
        // 	display: flex;
        // 	flex-wrap: nowrap;
        // 	box-sizing: border-box;
        // 	overflow-x: auto;
        // 	margin: 0 16px;
        // 	border-bottom: 1px solid #EEEEEE;

        // 	.date {
        // 		margin-right: 30px;
        // 		position: relative;
        // 		color: #808080;
        // 		font-size: 14px;
        // 		line-height: 1;
        // 		padding: 15px 0;

        // 		&.active {
        // 		color: #000;
        // 		font-weight: 600;

        // 		&::after {
        // 		content: '';
        // 		position: absolute;
        // 		height: 2px;

        // 		bottom: -1px;
        // 		width: 100%;
        // 		background: #A43127;
        // 		}
        // 		}
        // 	}
        // }
      }

      .next-btn {
        position: absolute;
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
        }
      }
    }
  }
}
</style>
