<template>
  <div class="ui_bookInfo">
    <coustom-head color="#fff" title="确认订单" customClass="customPattern"></coustom-head>
    <div class="travel-info" :style="{ paddingTop: navHeight + 'px' }">
      <div class="name">{{descript}}</div>
      <div class="infos">
        <div class="info">
          <div class="label">入住时间</div>
          <div class="val">{{timeFilterMD(fromDate)}} - {{timeFilterMD(toDate)}}，{{zday}}晚</div>
        </div>
        <div class="info">
          <div class="label">入住房型</div>
          <div class="val">{{roomDesc.join("，")}}</div>
        </div>
        <div class="info">
          <div class="label">房型备注</div>
          <div class="val">{{roomRemark}}</div>
        </div>
      </div>
    </div>
    <div class="form-infos">
      <div class="form-info">
        <div class="tl">
          预订信息
        </div>
        <div class="form-inline rmNum">
          <div class="label">房间数</div>
          <div class="val">
            <div class="roomNumBox">
              <span class='mins' @click="getBookSta('mins')" :class="{ 'disabled' : rmNum == 1 }">
                <em class="minsIcon"></em>
              </span>
              <span class="roomNum">{{rmNum}}间</span>
              <span class='plus' @click="getBookSta('plus')">
                <em class="plusIcon"></em>
              </span>
            </div>
          </div>
        </div>
        <div class="form-inline padding">
          <div class="label">入住人</div>
          <div class="vals">
            <div class="val choosePeople" v-for="(guest,j) in checkInGuests" :key="j">
              <div class="check-in-infos" v-if="guest.name">
                <div class="check-in-info">
                  <div class="iconfont icon-a-16_guanbi_ciji" @click="delGuest(checkInGuests,j)">
                  </div>
                  <div class="name">{{guest.name}}</div>
                  <div class="id-card">
                    <div class="idCardType">{{idCardType[guest.idCode]}}</div>
                    {{hideIdCard(guest.idNo,guest.idCode)}}
                  </div>
                </div>
              </div>
              <div class="already-box" @click="showCheckIn(j)" v-else>+ 请选择</div>
            </div>
            <!-- <div class="val">
              <div class="already-box" @click="showCheckIn(i+1)" v-if="checkInGuests.length==0">+ 请选择
              </div>
              <div class="already-box2" @click="showCheckIn(i+1)" v-else-if="checkInGuests.length==1">+
                添加入住人</div>
            </div> -->
          </div>
        </div>
        <div class="form-inline">
          <div class="label">到店时间</div>
          <div class="val" @tap.stop='openArriveTimePicker'>
            <input class="input-text" type="text" placeholder="请选择预计到店时间" placeholder-style="color: #CCCCCC;" disabled
              v-model="arriveTime">
          </div>
          <i class="icon iconfont icon-a-12_youlajiantou_hei"></i>
        </div>
        <div class="form-inline">
          <div class="label">其他需求</div>
          <div class="val">
            <input class="textarea-text" auto-height disable-default-padding=true placeholder="请填写其他需求 (选填)"
              placeholder-style="color: #CCCCCC;" v-model="remark">
          </div>
        </div>
      </div>
      <div class="form-info">
        <div class="tl">
          联系人
        </div>
        <div class="form-inline">
          <div class="label">姓名</div>
          <div class="val">
            <input class="input-text" type="text" placeholder="请输入姓名" placeholder-style="color: #CCCCCC;"
              v-model="guests">
          </div>
        </div>
        <div class="form-inline">
          <div class="label">手机号</div>
          <div class="val">
            <input class="input-text" type="text" placeholder="请输入手机号" placeholder-style="color: #CCCCCC;"
              v-model="phone">
          </div>
        </div>
      </div>
      <div class="form-info">
        <div class="tl">
          优惠方案
        </div>
        <div class="form-inline" v-if="memberDisDesc">
          <div class="label">折扣</div>
          <div class="val arrow">
            <div class="select-box">
              <div class="text black">{{memberDisDesc}}</div>
            </div>
          </div>
        </div>
        <div class="form-inline">
          <div class="label">券包</div>
          <div class="val arrow" @click="showCoupon()">
            <div class="select-box">
              <div class="text" v-if="currentChooseCoupon.length == 0">{{listCouponDetail.length}}张可用</div>
              <div class="text red" v-else>-{{coupnoMinsPrice}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rule">
      <mp-html :content="ruleTips"></mp-html>
    </div>
    <div class="footer">
      <!-- <div class="price-info">
				<div class="price">
					¥----
				</div>
				<div class="price-tips">
					填写入住人后可见
				</div>
			</div> -->
      <div class="price-info">
        <div class="price weight" @click="showPriceInfo()">
          ¥{{reallyPrice}}
          <div class="price-detail">明细<i class="iconfont icon-a-12_shanglajiantou_hei"></i></div>
        </div>
      </div>
      <div class="submit-btn baseBtn" @click='submitForm'>{{submitDesc}}</div>
    </div>
    <bottom-dialog ref="checkIn" :title="'选择入住人'" maxDialog>
      <div class="layer-box">
        <div class="add-btn-box">
          <div class="add-btn" @click="goPage('/pagesB/travel/travelersInfo')">
            <div class="icon icon-add">+</div>新增入住人
          </div>
        </div>
        <div class="info-list">
          <div class="info-item" v-for="(item,i) in contactsList" :key="i" @click="chooseContact(item)">
            <div class="info-item-lf">
              <div class="iconfont icon-a-16_bianji"
                @click.stop="goPage('/pagesB/travel/travelersInfo?type=edit&id='+item.guestId)"></div>
              <div class="info-item-lf-info">
                <div class="info-item-name">
                  {{item.name}}
                </div>
                <div class="info-item-id-card">
                  {{idCardType[item.idCode]}} {{hideIdCard(item.idNo,item.idCode)}}
                </div>
              </div>
            </div>
            <div class="icon-duoxuan_yixuan noCan iconfont" v-if="item.activeNotCan"></div>
            <div class="icon-duoxuan_yixuan iconfont" v-else-if="item.active">
            </div>
            <div class="icon-duoxuan_weixuan iconfont" v-else></div>
          </div>
        </div>
        <div class="layer-footer">
          <div class="layer-btn baseBtn" @click="hideCheckIn()">
            完成
          </div>
        </div>
      </div>
    </bottom-dialog>
    <bottom-dialog ref="couponListLayer" title="选择券包">
      <div class="couponList" v-if="listCouponDetail.length>0">
        <div class="listItem" v-for="(coupon, index) in listCouponDetail" :key="index">
          <coupon-item :couponItem="coupon" @chooseCoupon="chooseCoupon" :isSelect=isSelect
            @toggleCoupon="toggleCoupon"></coupon-item>
        </div>
      </div>
      <empty tips="暂无可用券包" v-if="listCouponDetail.length == 0" mode="text"></empty>
      <div class="layer-footer">
        <div class="layer-btn baseBtn" @click="sureCoupon">
          完成
        </div>
      </div>
    </bottom-dialog>
    <bottom-dialog ref="priceInfo" title="费用明细" style="z-index: 1;">
      <div class="priceInfo">
        <div class="price-item">
          <div class="main">
            <div class="price-box">
              产品价合计<span v-if="memberDisDesc" class="sub">{{memberDisDesc}}</span>
            </div>
            <div>
              ¥{{rateSum}}
            </div>
          </div>
          <div class="other">
            {{hotelOrderRoom.roomDescript}}
            <div>
              ¥{{rateSum/rmNum}} x {{rmNum}}间
            </div>
          </div>
        </div>
        <div class="price-item">
          <div class="main">
            权益抵扣
            <div class="price">
              -¥{{coupnoMinsPrice}}
            </div>
          </div>
          <div class="other">
            券包
            <div>
              -¥{{coupnoMinsPrice}}
            </div>
          </div>
        </div>
        <div class="footer">
          <div class="price-info">
            <div class="price weight" @click="hidePriceInfo()">
              ¥{{reallyPrice}}
              <div class="price-detail">明细<i class="iconfont icon-a-12_xialajiantou_hei"></i></div>
            </div>
          </div>
          <div class="submit-btn baseBtn" @click="submitForm">立即预订</div>
        </div>
      </div>
    </bottom-dialog>
    <bottom-dialog ref="timeSelect" title="预计到店时间">
      <div class="arriveChoose">
        <p class="tips"><i class="icon iconfont icon-a-20_hangchengbangzhu1"></i>房间整晚保留，12:00前到店可能需要等房，详情请咨询客服</p>
        <picker-view indicator-style="height: 56px;" style="width: 100%; height: 280px;" :value="chooseTimeIndex"
          @change="bindChangeTime" mask-class="pickerMask" immediate-change=true indicator-class="picker-box">
          <picker-view-column>
            <view v-for="(time,timeIndex) in timeList" :key="timeIndex" style="line-height: 56px; text-align: center;">
              {{time.displayTime}}</view>
          </picker-view-column>
        </picker-view>
        <div class="fixedBottom">
          <div class="fixedBottomBtn" @click="chooseTime">完成</div>
        </div>
      </div>
    </bottom-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch, toRaw } from "vue";
import { onShow, onLoad } from "@dcloudio/uni-app";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import couponItem from "@/components/couponItem.vue";
import bottomDialog from "@/components/bottomDialog.vue";
import coustomHead from "@/components/coustomHead.vue";
import radioBox from "@/components/radioBox.vue";
import { jAlert3, jAlert5 } from "@/base/jAlert/jAlert";
import { makeOrder } from "@/utils/makeOrder";
import dayjs from "dayjs";
import { requestMsg, createUrl, goPage } from "@/utils/utils";
import { timeFilterMD, hideIdCard } from "@/utils/filter";
import UmengSDK from "@/utils/umengAdaptor.js";
import empty from "@/components/empty.vue";

let config = getStorage("config");
let user = getStorage("user");
let wxuser = getStorage("wxuser");
let productCode = ref("");
let fromDate = ref("");
let toDate = ref("");
let sourceActivityId = ref("");
let sourceActivityName = ref("");
let productName = ref("");
let rateCode = ref("");
let rmtype = ref("");
let ticket = ref("");
let payMethod = ref("");
let hotelCode = ref("");
let descript = ref("");
let address = ref("");
let rmNum = ref(1);
let prepayTimeLimit = ref("");
let prepayHoldTimeMax = ref("");
let prepayMethod = ref("");
let cancelPrehour = ref("");
let cancelPretime = ref("");
let cancelPredays = ref("");
let cancelCondition = ref("");
let hotelGroupCode = ref("");
let otaChannel = ref("");
let stayTime = ref("");
let isMax = ref(false);
let isTap = ref(false);
let remark = ref("");
let isBookAble = ref(true);
let currentChooseCoupon = ref<any>([]);
let arrivalFrom = ref("");
let arrivalTo = ref("");
let rateSum = ref(0);
let everyDayDetails = ref<any>([]);
let couponCodes = ref("");
let canUseCoupon = ref(true);
let canUseCouponNum = ref(0);
let listCouponDetail = ref<any>([]);
let arriveTime = ref("");
let timeSelect = ref();
let couponListLayer = ref();
let priceInfo = ref();
let timeList = ref<any>([]);
let chooseTimeIndex = ref([0]);
let guests = ref("");
let phone = ref("");
let hotelOrderRoom = reactive(getStorage("hotelOrderRoom"));
let ruleTips = ref("");
let contactsList: any = ref([]);
const navHeight = ref(0);
let checkInGuests = ref<any>([
  {
    name: "",
    guestId: "",
    mobile: "",
    idCode: "",
    idNo: "",
    sex:"",
  },
]);
let idCardType = reactive({
  "01": "身份证",
  "02": "临时身份证",
  "14": "护照",
  "21": "港澳通行证",
});
let templateId = ref("");
let checkIn = ref();
const rsvDtoTl = ref("");
let isSelect = ref(true);
let roomDesc = ref<any>([]);
let roomRemark = ref("");
let canUseRFCoupon = ref(true);
let memberDisDesc = ref("");
if (hotelOrderRoom.roomDescript) {
  roomDesc.value.push(hotelOrderRoom.roomDescript);
}
if (hotelOrderRoom.productTags && hotelOrderRoom.productTags.length > 0) {
  let productTags: any = [];
  hotelOrderRoom.productTags.forEach((n: any) => {
    productTags.push(n.tagName);
  });
  roomRemark.value = productTags.join(",");
}
if (
  hotelOrderRoom.gcRoomExtra &&
  hotelOrderRoom.gcRoomExtra.bedNum &&
  hotelOrderRoom.gcRoomExtra.bedType
) {
  roomDesc.value.push(
    `${hotelOrderRoom.gcRoomExtra.bedType}床x${hotelOrderRoom.gcRoomExtra.bedNum}`
  );
}
const sureCoupon = () => {
  currentChooseCoupon.value = [];
  listCouponDetail.value.forEach((n: any, i: number) => {
    if (n.choosed) {
      currentChooseCoupon.value.push(n);
    }
  });
  couponListLayer.value.hideDialog();
};
const chooseCoupon = () => {};
const toggleCoupon = (item: AnyObject) => {
  if (zday.value > 1 || rmNum.value > 1) {
    if (item.couponType == "FR" || item.couponType == "RF") {
      jAlert3("当前优惠券只能选一个房晚");
      return false;
    }
  }
  /* 遍历已经选择的电子券，找到定价券，折扣券，变价券*/
  for (var i = 0; i < listCouponDetail.value.length; i++) {
    if ((item.couponType == "FR" || item.couponType == "RF") && item.choosed) {
      item.choosed = !item.choosed;
      return false;
    } else if (
      (listCouponDetail.value[i].couponType == "FR" &&
        listCouponDetail.value[i].choosed) ||
      (item.couponType == "RF" && listCouponDetail.value[i].choosed)
    ) {
      jAlert3("此券仅限使用一张");

      return false;
    }
  }
  /* 大于可选电子券的处理*/
  if (couponLength.value >= canUseCouponNum.value) {
    if (item.choosed) {
      item.choosed = !item.choosed;
      return false;
    } else {
      jAlert3(`可使用优惠券数${canUseCouponNum.value}张`);
      return false;
    }
  }
  item.choosed = !item.choosed;
};
const couponLength = computed(() => {
  var count = 0;
  for (var i = 0; i < listCouponDetail.value.length; i++) {
    if (listCouponDetail.value[i].choosed) {
      count++;
    }
  }
  return count;
});
const showCoupon = () => {
  if (listCouponDetail.length == 0) {
    return false;
  }
  couponListLayer.value.showDialog();
};
const showPriceInfo = () => {
  priceInfo.value.showDialog();
};
const hidePriceInfo = () => {
  priceInfo.value.hideDialog();
};
const openArriveTimePicker = () => {
  timeSelect.value.showDialog();
};
const delGuest = (guestDtos: any, index: number) => {
  contactsList.value.forEach((n: any) => {
    if (n.name == checkInGuests.value[index].name) {
      n.active = false;
    }
  });
  checkInGuests.value[index] = {
    name: "",
    idNo: "",
  };
  setNoCancontact();
};
const changeCheckInGuests = (type: string) => {
  if (type == "mins") {
    checkInGuests.value.pop();
  } else if (type == "plus") {
    checkInGuests.value.push({
      name: "",
      idNo: "",
    });
  }
};
const getBookSta = (type: string) => {
  var testNum = rmNum.value;
  if (type == "plus") {
    if (currentChooseCoupon.length > 0) {
      if (
        currentChooseCoupon[0].couponType == "FR" ||
        currentChooseCoupon[0].couponType == "RF"
      ) {
        jAlert3("当前优惠券只能选一个房晚");
        return false;
      }
    }
  }
  if (type == "mins") {
    if (currentChooseCoupon.length == rmNum.value && rmNum.value > 1) {
      jAlert3(
        "您当前选择的房间数量小于可使用的优惠券数量,请先取消一张优惠券再选择房间数量"
      );
      return false;
    }
    if (rmNum.value <= 1) {
      return false;
    } else {
      if (isMax.value) {
        return false;
      }
      testNum = rmNum.value - 1;
    }
  } else if (type == "plus") {
    testNum = rmNum.value + 1;
  }
  if (isTap.value) {
    return false;
  }
  isTap.value = true;
  var testObj = {
    rmNum: testNum,
    fromDate: fromDate.value,
    toDate: toDate.value,
    guests: "testMan",
    mobile: 18888888888,
    remark: remark.value,
    hotelCode: hotelCode.value,
    hotelGroupCode: hotelGroupCode.value || config.hotelGroupCode,
    clientChannel: "WECHAT",
    otaChannel: otaChannel.value,
    productCode: productCode.value,
    openid: wxuser.openid,
    memberNo: "",
    cardLevel: "",
    cardType: "",
    memberId: "",
    checkInGuests: [{ name: "testMan" }],
    appid: config.appid,
    componentAppid: config.componentAppid,
    srcHotelGroupCode: config.hotelGroupCode,
  };
  if (user && user.memberId) {
    testObj.memberNo = user.cardNo ? user.cardNo : "";
    testObj.cardLevel = user.cardLevel ? user.cardLevel : "";
    testObj.cardType = user.cardType ? user.cardType : "";
    testObj.memberId = user.memberId ? user.memberId : "";
  }
  api.resrvCheck(makeOrder(testObj)).then((bookInfo: any) => {
    isTap.value = false;
    if (bookInfo.result == 1) {
      if (bookInfo.retVal.isBookAble == 0) {
        isBookAble.value = true;
        isMax.value = false;
        rmNum.value = testNum;
        changeCheckInGuests(type);
        if (type == "init") {
          arrivalFrom.value =
            bookInfo.retVal.gcProductDetailDto.arrivalFrom || "12:00";
          arrivalTo.value =
            bookInfo.retVal.gcProductDetailDto.arrivalTo || "23:59";
          UmengSDK.sendPV({
            price: Number(bookInfo.retVal.rateSum),
            order_name: descript.value,
            order_type: "单订房",
            start_date: fromDate.value,
            end_date: toDate.value,
            trip_people_count: 1,
            travel_path: "",
            room_count: 1,
            page_name: "confirm_order_pg",
          });
          if(bookInfo.retVal.gcProductDetailDto&&bookInfo.retVal.gcProductDetailDto.productGcLevel){
            if(bookInfo.retVal.gcProductDetailDto.productGcLevel!='000'){
              canUseRFCoupon.value = false;
              if(user&&user.memberId){
                getAllCardLevel();
              }
            }
          }
        }
      } else {
      }
      rateSum.value = Number(bookInfo.retVal.rateSum);
      bookInfo.retVal.everyDayDetails.forEach(function (n: any, i: number) {
        n.rsvDate = dayjs(n.rsvDate).format("MM-DD");
      });
      everyDayDetails.value = bookInfo.retVal.everyDayDetails;
      couponCodes.value = bookInfo.retVal.gcProductDetailDto.tickets || "";
      if (user && user.memberId) {
        currentChooseCoupon.value = [];
        couponInit();
      }
    } else {
      if (testNum == 1) {
        isBookAble.value = false;
      }
      jAlert3(bookInfo.msg);
    }
    if (type == "init") {
      createArriveTime();
    }
  });
};
const getAllCardLevel = ()=>{
  api.getAllCardLevel({
    isPhysical:"F",
    hotelGroupId:config.hotelGroupId,
    hotelGroupCode:config.hotelGroupCode,
    cardType:user.cardType,
  }).then((res:any)=>{
    if(res.result == 1 && res.retVal.listLevelDto&&res.retVal.listLevelDto.length>0){
      res.retVal.listLevelDto.forEach((n:any)=>{
        console.log(n.code,user.cardLevel)
        if(n.code == user.cardLevel){
          memberDisDesc.value = `已享受${n.descript}会员价`
        }
      })
    }
  })
}
const submitDesc = computed(() => {
  if (isBookAble.value) {
    if (payMethod.value == "SCORE" || payMethod.value == "TICKET") {
      return "兑换";
    } else {
      return "立即预订";
    }
  } else {
    return "不可订";
  }
});
const zday = computed(() => {
  var arr = new Date(fromDate.value.replace(/\-/g, "/")).getTime(),
    dep = new Date(toDate.value.replace(/\-/g, "/")).getTime();
  var days = dep - arr;
  days = Math.round(days / 86400000);
  return days;
});
const coupnoMinsPrice = computed<number>(() => {
  var everyDayMoney: any = [];
  everyDayDetails.value.forEach(function (n: any, i: number) {
    for (var i = 0; i < Number(rmNum.value); i++) {
      everyDayMoney.push(n.realPrice);
    }
  });
  everyDayMoney.sort();
  if (currentChooseCoupon.value.length > 0) {
    if (currentChooseCoupon.value.length == 1) {
      var currentChoose = currentChooseCoupon.value[0];
      console.log(toRaw(currentChoose), 9999999999999999);
      if (currentChoose.couponType == "DF") {
        if (
          Number(Number(currentChoose.presentValue).toFixed(2)) >=
          Number(rateSum.value)
        ) {
          return Number(rateSum.value);
        } else {
          return Number(Number(currentChoose.presentValue).toFixed(2));
        }
      } else if (currentChoose.couponType == "CP") {
        if (
          Number(Number(currentChoose.presentValue).toFixed(2)) >=
          Number(rateSum.value)
        ) {
          return Number(rateSum.value);
        } else {
          return Number(Number(currentChoose.presentValue).toFixed(2));
        }
      } else if (currentChoose.couponType == "FR") {
        return -(
          Number(Number(currentChoose.presentValue).toFixed(2)) -
          Number(rateSum.value)
        );
      } else if (currentChoose.couponType == "RF") {
        return (
          Number(rateSum.value) *
          Number((1 - Number(currentChoose.presentValue)).toFixed(2))
        );
      } else {
        return 0;
      }
    } else {
      console.log(currentChooseCoupon.value.length);
      var mins = 0;
      for (var j = 0; j < currentChooseCoupon.value.length; j++) {
        var currentPrice = everyDayMoney.pop();
        if (
          currentPrice - parseInt(currentChooseCoupon.value[j].presentValue) >=
          0
        ) {
          mins = mins + parseInt(currentChooseCoupon.value[j].presentValue);
        } else {
          mins = mins + Number(currentPrice);
        }
      }
      return Number(mins);
    }
  } else {
    return 0;
  }
});
const reallyPrice = computed(() => {
  var reallyPrice =
    rateSum.value - coupnoMinsPrice.value >= 0
      ? rateSum.value - coupnoMinsPrice.value
      : 0;
  if (reallyPrice % 1 !== 0) {
    reallyPrice = Number(reallyPrice.toFixed(2));
  } else {
    reallyPrice = reallyPrice;
  }
  return reallyPrice;
});
const createArriveTime = () => {
  var times: any = [];
  let startTime = Number(arrivalFrom.value.split(":")[0]) || 12;
  let count = 25 - startTime;
  for (let i = 0; i < count; i++) {
    var hour: number | string = startTime + i;
    if (hour < 10) {
      hour = `0${hour}`;
    }
    times.push(`${fromDate.value} ${hour}:00`);
  }
  for (let j = 0; j < times.length; j++) {
    var canTap = true;
    if (dayjs(times[j]).isBefore(dayjs())) {
      canTap = false;
    }
    times[j] = {
      canTap: canTap,
      time: times[j],
      isTap: false,
      displayTime: times[j].split(" ")[1],
      chooseTime: times[j].split(" ")[1],
    };
  }
  timeList.value = times;
  setDefaultArrayTime();
};
const chooseTime = () => {
  let [index] = chooseTimeIndex.value;
  arriveTime.value = timeList.value[index].chooseTime;
  timeSelect.value.hideDialog();
};
const bindChangeTime = (e: any) => {
  chooseTimeIndex.value = e.detail.value;
  console.log(e);
};
const setDefaultArrayTime = () => {
  timeList.value.forEach(function (m: any, j: number) {
    if (arriveTime.value) {
      return false;
    }
    if (m.canTap) {
      m.isTap = true;
      arriveTime.value = m.chooseTime;
      setTimeout(() => {
        chooseTimeIndex.value = [j];
      }, 0);
    }
  });
};
const couponInit = () => {
  if (ticket.value == "NONE" || !(user && user.memberId)) {
    canUseCoupon.value = false;
  } else {
    canUseCoupon.value = true;
    if (ticket.value == "NONE") {
      canUseCouponNum.value = 0;
    } else if (ticket.value == "ROOM") {
      canUseCouponNum.value = rmNum.value;
    } else if (ticket.value == "ROOM_NIGHT") {
      canUseCouponNum.value = rmNum.value * zday.value;
    } else if (ticket.value == "RESRV") {
      canUseCouponNum.value = 1;
    }
    getCouponDetailList();
  }
};
const getCouponDetailList = () => {
  var couponParams = {
    couponType: "",
    rateCode: rateCode.value,
    rmtype: rmtype.value,
    useDate: fromDate.value,
    hotelCode: hotelCode.value,
    memberId: user.memberId,
    hotelGroupCode: config.hotelGroupCode,
    hotelGroupId: config.hotelGroupId,
    totalPrice: reallyPrice.value,
    couponCode: couponCodes.value,
    suitGroupCode: hotelGroupCode.value || config.hotelGroupCode,
    channel: "WECHAT",
    firstPrice: "",
    couponTypeReal:"",
  };
  if(!canUseRFCoupon.value){
    couponParams.couponTypeReal = "DF,VF,CP";
  }
  console.log();
  if (
    everyDayDetails.value &&
    everyDayDetails.value.length &&
    everyDayDetails.value[0]
  ) {
    couponParams.firstPrice = everyDayDetails.value[0].realPrice;
  }
  api.findCouponDetailListByCondi(couponParams).then((couponList: any) => {
    if (couponList.result == 1) {
      couponList.retVal.listCouponDetailWebDtos.forEach(function (
        n: any,
        i: number
      ) {
        n.choosed = false;
        n.couponTypeName = n.couponTypeName;
        n.descript = n.couponName;
        if (n.validFromDate) {
          n.validFromDate = dayjs(n.validFromDate).format("YYYY.MM.DD");
        }
        if (n.validToDate) {
          n.validToDate = dayjs(n.validToDate).format("YYYY.MM.DD");
        }
        if (n.couponType == "RF") {
          let discount: any = (n.presentValue * 10).toFixed(1);
          if (discount - parseInt(discount) > 0) {
          } else {
            discount = Number(discount).toFixed(0);
          }
          n.discountNum = discount;
        } else {
          n.discountNum = n.presentValue;
        }
      });
      listCouponDetail.value = couponList.retVal.listCouponDetailWebDtos;
    } else {
      jAlert3(couponList.msg);
    }
  });
};
const submitForm = () => {
  var reg = /^1[0123456789]\d{9}$/;
  var reg2 = /^[\u4E00-\u9FA5]{2,5}$|^[a-zA-Z\/ ]{2,20}$/;
  var regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g;
  var newPhone = phone.value;
  var idReg = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
  if (newPhone.indexOf("*") > -1) {
    newPhone = user.mobile;
  }
  if (!isBookAble.value) {
    return false;
  }
  if (!guests.value) {
    jAlert3("请输入预订人姓名");
    return false;
  }
  if (regRule.test(guests.value)) {
    jAlert3("请不要输入特殊字符");
    return false;
  }
  if (reg.test(guests.value)) {
    jAlert3("为了保障您入住过程顺利，请填写真实姓名");
    return false;
  }
  if (!reg2.test(guests.value)) {
    jAlert3("为了保障您入住过程顺利，请填写真实姓名");
    return false;
  }
  if (!newPhone) {
    jAlert3("请输入手机号码");
    return false;
  }
  //兼容空格
  newPhone = newPhone.trim();
  if (!reg.test(newPhone)) {
    jAlert3("手机号码有误");
    return false;
  }
  if (!arriveTime.value) {
    jAlert3("请选择到店时间");
    return false;
  }
  if (
    checkInGuests.value.length == 0 ||
    (checkInGuests.value &&
      checkInGuests.value[0] &&
      checkInGuests.value[0].name == "")
  ) {
    jAlert3("请输入入住人");
    return false;
  }

  if (payMethod.value == "TICKET" && currentChooseCoupon.value.length == 0) {
    jAlert3("券兑换产品需要选择优惠券进行下单");
    return false;
  }
  requestMsg(templateId.value).then(() => {
    var couponDetailCodes = "";
    var couponDetailCodesList: any = [];
    var serviceCouponDetailCodes = "";
    currentChooseCoupon.value.forEach((n: any, i: number) => {
      couponDetailCodesList.push(n.couponNo);
    });
    couponDetailCodes = couponDetailCodesList.join(";");
    let filterCheckInGuests = checkInGuests.value.filter(
      (guest: any) => guest.name
    );
    var obj = {
      rmNum: rmNum.value,
      fromDate: fromDate.value,
      toDate: toDate.value,
      guests: guests.value,
      mobile: newPhone,
      remark: remark.value,
      hotelCode: hotelCode.value,
      hotelGroupCode: hotelGroupCode.value || config.hotelGroupCode,
      clientChannel: "WECHAT",
      otaChannel: otaChannel.value,
      productCode: productCode.value,
      memberNo: "",
      cardLevel: "",
      cardType: "",
      memberId: "",
      couponDetailCodes: couponDetailCodes,
      openid: wxuser.openid,
      hotelGroupId: config.hotelGroupId,
      formId: "",
      appid: config.appid,
      componentAppid: config.componentAppid,
      distributorId: "",
      checkInGuests: filterCheckInGuests,
      payMethod: payMethod.value,
      arriveTime: arriveTime.value,
      srcHotelGroupCode: config.hotelGroupCode,
      serviceCouponDetailCodes: serviceCouponDetailCodes || "",
      rsvClass: "F",
      depTime: "",
      sourceActivityId: sourceActivityId.value,
      sourceActivityName: sourceActivityName.value,
    };
    if (user && user.memberId) {
      obj.memberNo = user.cardNo ? user.cardNo : "";
      obj.cardLevel = user.cardLevel ? user.cardLevel : "";
      obj.cardType = user.cardType ? user.cardType : "";
      obj.memberId = user.memberId ? user.memberId : "";
    }
    if (otaChannel.value == "HOUR") {
      obj.rsvClass = "D";
      var stayTimeNumber = Number(stayTime.value);
      var currentChooseTime =
        dayjs().format("YYYY-MM-DD") + " " + arriveTime.value + ":00";
      var todayMax = dayjs().format("YYYY-MM-DD") + " " + "23:59:59";
      var chooseDay = dayjs(currentChooseTime)
        .add(stayTimeNumber, "hours")
        .format("YYYY-MM-DD HH:mm:ss");
      if (dayjs(chooseDay).isAfter(todayMax)) {
        obj.depTime = "23:59:59";
      } else {
        obj.depTime = dayjs(currentChooseTime)
          .add(stayTimeNumber, "hours")
          .format("HH:mm:ss");
      }
    }
    console.log(456);
    var sendObj = makeOrder(obj);
    sendOrderFunction(sendObj);
    /* if (payMethod.value == "CS" || payMethod.value == "SCORE_CS") {
      var date1 = prepayTimeLimit.value;
      var date2 = arriveTime.value + ":00";
      var time = dayjs().format("YYYY-MM-DD");
      if (dayjs(time + " " + date1).isBefore(time + " " + date2)) {
        jAlert5(
          "提示",
          function () {
            sendOrderFunction(sendObj);
          },
          function () {
            return false;
          },
          "您的订单需要在" +
            prepayHoldTimeMax.value +
            "分钟内完成支付，逾期未支付预订将不被保留。"
        );
      } else {
        sendOrderFunction(sendObj);
      }
    } else {
      if (payMethod.value == "PP" || payMethod.value == "SCORE_PP") {
        var tips =
          "您的订单需要在" +
          prepayHoldTimeMax.value +
          "分钟内完成支付，逾期未支付预订将不被保留。";
        jAlert5(
          "提示",
          function () {
            sendOrderFunction(sendObj);
          },
          function () {
            return false;
          },
          tips
        );
      } else {
        if (payMethod.value == "SCORE") {
          var tips =
            "您的积分兑换客房订单，兑换成功后将不可取消，请确认是否兑换。";
          jAlert5(
            "提示",
            function () {
              sendOrderFunction(sendObj);
            },
            function () {
              return false;
            },
            tips
          );
        } else {
          sendOrderFunction(sendObj);
        }
      }
    } */
  });
};
const sendOrderFunction = (sendObj: any) => {
  jAlert3("正在提交订单");
  if (isTap.value) {
    return false;
  }
  isTap.value = true;
  UmengSDK.sendEvent("cop_book_clk", {
    price: Number(reallyPrice.value),
    order_name: descript.value,
    order_type: "单订房",
    start_date: fromDate.value,
    end_date: toDate.value,
    trip_people_count: sendObj.bookOrderInfoRQ.guests.length,
    travel_path: "",
    room_count: sendObj.bookOrderInfoRQ.rmNum,
    page_name: "confirm_order_pg",
  });
  api.resrvCheck(sendObj).then((bookInfo: any) => {
    if (bookInfo.result == 1) {
      api.makeOrder(sendObj).then((orderInfo: any) => {
        if (orderInfo.result == 1) {
          var params = {
            orderNo: orderInfo.retVal,
            productType: "hotel",
          };
          uni.redirectTo({
            url: "/pagesB/other/pay?" + createUrl(params),
          });
          isTap.value = false;
        } else {
          isTap.value = false;
          jAlert3(orderInfo.msg);
        }
      });
    } else {
      isTap.value = false;
      jAlert3(bookInfo.msg);
    }
  });
};
const getMakeOrderRules = () => {
  var obj = {
    arrDateStr: fromDate.value,
    cancelPrehour: cancelPrehour.value,
    cancelPretime: cancelPretime.value,
    cancelPredays: cancelPredays.value,
    cancelCondition: cancelCondition.value,
    hotelGroupCode: hotelGroupCode.value || config.hotelGroupCode,
    miniAppid: config.appid,
    miniHotelCode: config.hotelCode,
    productHotelCode: hotelCode.value,
    productCode: productCode.value,
  };
  api.getCancelRule(createUrl(obj)).then((res: any) => {
    if (res.result == 1) {
      ruleTips.value = res.retVal.cancelRule;
    }
  });
};
const showCheckIn = (index: string) => {
  if (checkInGuests.value.length > 1) {
    rsvDtoTl.value = index;
  } else {
    rsvDtoTl.value = "";
  }
  contactsList.value.forEach((item: any) => {
    item.active = false;
    checkInGuests.value.forEach((guest: any) => {
      if (guest.name == item.name) {
        item.active = true;
      }
    });
  });
  checkIn.value.showDialog();
};
const hideCheckIn = () => {
  let chooseGuest: any = [];
  contactsList.value.forEach((item: any) => {
    if (item.active) {
      var info = {
        guestId: item.guestId,
        name: item.name,
        mobile: item.mobile,
        idCode: item.idCode,
        idNo: item.idNo,
        birth:item.birth?dayjs(item.birth).format("YYYY-MM-DD"):"",
        sex:item.sex||"",
      };
      chooseGuest.push(info);
    }
  });
  if (chooseGuest.length > rmNum.value) {
    jAlert3(`最多选择${rmNum.value}人`);
    return false;
  }
  chooseGuest.forEach((n: any) => {
    n.activeNotCan = true;
  });
  if (chooseGuest.length < checkInGuests.value.length) {
    let needAdd = checkInGuests.value.length - chooseGuest.length;
    for (let index = 0; index < needAdd; index++) {
      chooseGuest.push({
        name: "",
        guestId: "",
        mobile: "",
        idCode: "",
        idNo: "",
        sex:"",
      });
    }
  }
  checkInGuests.value = chooseGuest;
  checkIn.value.hideDialog();
};
const listGuestLinkExtraInfoWithMemberIdOrOpenId = () => {
  api
    .listGuestLinkExtraInfoWithMemberIdOrOpenId({
      channel: "WECHAT",
      hotelGroupCode: config.hotelGroupCode,
      hotelCode: config.hotelCode,
      memberId: user.memberId,
      openIdType: "WECHAT",
    })
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.result == 0) {
          if (res.retVal.retVal.length) {
            var contacts: any = [];
            res.retVal.retVal.forEach((item: any) => {
              if (item.guestId) {
                contactsList.value.forEach((contact: any) => {
                  if (item.guestId == contact.guestId) {
                    item.active = contact.active;
                    item.activeNotCan = contact.activeNotCan;
                  }
                });
                contacts.push(item);
              }
            });
            contactsList.value = contacts;
          }
        }
      }
    });
};
const chooseContact = (item: any) => {
  let chooseItem = contactsList.value.filter((item: any) => {
    return item.active;
  });
  if (rmNum.value == 1 && chooseItem.length == 1) {
    contactsList.value.forEach((item: any) => {
      item.active = false;
    });
    item.active = true;
    return false;
  }
  if (!item.active && chooseItem >= rmNum.value) {
    return false;
  }
  item.active = !item.active;
  chooseItem = contactsList.value.filter((item: any) => {
    return item.active;
  });
  setNoCancontact();
};
const setNoCancontact = () => {
  if (rmNum.value == 1) {
    return false;
  }
  let chooseItem = contactsList.value.filter((item: any) => {
    return item.active;
  });
  contactsList.value.forEach((item: any) => {
    if (!item.active) {
      if (chooseItem.length == rmNum.value) {
        item.activeNotCan = true;
      } else {
        item.activeNotCan = false;
      }
    }
  });
};
onShow(() => {
  if (user && user.memberId) {
    listGuestLinkExtraInfoWithMemberIdOrOpenId();
  }
});
onMounted(() => {
  uni.getSystemInfo({
    success: (res: any) => {
      console.log(res);
      navHeight.value = res.statusBarHeight + 60;
    },
    fail(err) {
      console.log(err);
    },
  });
  getMakeOrderRules();
  getBookSta("init");
  if (user && user.memberId) {
    if (user && user.mobile) {
      phone.value = user.mobile;
    }
    if (user && user.isRealName == "T") {
      guests.value = user.name;
    }
  }
});
onLoad((options: any) => {
  console.log(options, 11111111111);
  productCode.value = options.productCode || "";
  fromDate.value = options.fromDate || "";
  toDate.value = options.toDate || "";
  productName.value = decodeURIComponent(options.productName);
  rateCode.value = options.rateCode;
  rmtype.value = options.rmtype;
  ticket.value = options.ticket;
  payMethod.value = options.payMethod;
  hotelCode.value = options.hotelCode;
  descript.value = decodeURIComponent(options.descript);
  address.value = decodeURIComponent(options.address);
  rmNum.value = Number(options.resrvNumMin) || 1;
  prepayTimeLimit.value = decodeURIComponent(options.prepayTimeLimit);
  prepayHoldTimeMax.value = options.prepayHoldTimeMax;
  prepayMethod.value = options.prepayMethod;
  cancelPrehour.value = options.cancelPrehour;
  cancelPretime.value = decodeURIComponent(options.cancelPretime);
  cancelPredays.value = options.cancelPredays;
  cancelCondition.value = options.cancelCondition;
  hotelGroupCode.value = options.hotelGroupCode;
  otaChannel.value = options.otaChannel || "WECHAT";
  stayTime.value = options.stayTime || 4;
  if (options.sourceActivityId) {
    sourceActivityId.value = options.sourceActivityId;
  }
  if (options.sourceActivityName) {
    sourceActivityName.value = decodeURIComponent(options.sourceActivityName);
  }
});
</script>

<style lang="less" scoped>
@import url("~@/styles/mixin.less");
@import url("~@/styles/skin.less");

.ui_bookInfo {
  /deep/ .picker-box {
    width: 100%;
    height: 56px;
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
    background: #fff;
    color: #000;
    z-index: 0;
  }
  .roomNumBox {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    height: 100%;
    align-items: center;
    .mins {
      box-sizing: border-box;
      display: inline-block;
      width: 20px;
      height: 20px;
      margin: 0;
      font-size: 30px;
      text-align: center;
      color: #fff;
      position: relative;
      border-radius: 50%;
      border: 1px solid #000;
      &.disabled {
        border: 1px solid #ccc;
        .minsIcon {
          background-color: #ccc;
        }
      }
      .minsIcon {
        background-color: #000;
        width: 9px;
        left: 4px;
        height: 1px;
        top: 9px;
        position: absolute;
      }
    }
    .roomNum {
      padding: 0 10px;
      text-align: center;
      font-size: 14px;
      color: #000;
    }
    .plus {
      box-sizing: border-box;
      display: inline-block;
      width: 20px;
      height: 20px;
      margin: 0;
      font-size: 30px;
      text-align: center;
      color: #fff;
      position: relative;
      border-radius: 50%;
      border: 1px solid #000;
      .plusIcon {
        box-sizing: border-box;
        position: absolute;
        width: 9px;
        height: 1px;
        left: 5px;
        top: 8px;
        background-color: #000;
        &:after {
          position: absolute;
          width: 1px;
          height: 10px;
          left: 4px;
          top: -4px;
          background-color: #000;
          content: "";
        }
      }
    }
  }
  /deep/.pickerMask {
    background-image: linear-gradient(
        180deg,
        #f8f8f8 0%,
        rgba(248, 248, 248, 0) 100%
      ),
      linear-gradient(180deg, rgba(248, 248, 248, 0) 0%, #f8f8f8 100%);
  }
  line-height: 1;
  padding-bottom: 141px;
  .arriveChoose {
    height: 440px;
    overflow-y: scroll;
    padding: 10px;
    padding-top: 0px;
    .tips {
      color: #808080;
      font-size: 12px;
      padding: 16px 0px;
      display: flex;
      align-items: center;
    }
    .iconfont {
      margin-right: 3px;
      font-size: 12px;
    }
    .active {
      background: #fff;
    }
  }
  .travel-info {
    padding: 80px 16px 16px;
    background-color: #000;
    background-image: url(https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/btnBlack.png);
    background-repeat: repeat;
    background-size: 40px 37.5px;

    .name {
      color: #fff;
      font-weight: bold;
      font-size: 20px;
    }

    .infos {
      .info {
        display: flex;
        margin-top: 12px;
        font-size: 14px;
        line-height: 1;
        color: #fff;

        .label {
          opacity: 0.8;
          margin-right: 8px;
        }
      }
    }
  }

  .form-infos {
    margin: 0 16px;

    .form-info {
      margin-top: 16px;
      background: #ffffff;
      border-radius: 8px;

      .tl {
        position: relative;
        color: #000000;
        font-weight: bold;
        padding: 16px 12px;
        font-size: 14px;
        line-height: 1;
        border-bottom: 1px solid #f8f8f8;

        .icon-a-20_jian_fangxing {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          font-weight: normal;
        }
      }

      .form-inline {
        display: flex;
        padding: 0 12px;
        align-items: center;
        &.rmNum {
          padding: 0 15px;
        }
        .choosePeople {
          margin-bottom: 10px;
          &:last-of-type {
            margin-bottom: 0px;
          }
        }
        &.padding {
          padding-top: 16px;
          padding-bottom: 16px;

          .label {
            height: 40px;
          }
        }

        .number {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .icon-a-20_jian,
          .icon-a-20_jia {
            font-size: 20px;

            &.invalid {
              color: #ccc;
            }
          }

          .num {
            font-size: 14px;
            font-weight: bold;
            margin: 0 10px;
          }
        }

        .label {
          display: flex;
          align-items: center;
          font-size: 14px;
          height: 46px;
          width: 88px;
          white-space: nowrap;
        }

        .vals {
          width: 100%;
          display: flex;
          flex: 1;
          flex-wrap: wrap;

          .val {
            min-width: 100%;
          }
        }

        .val {
          display: flex;
          flex: 1;
          position: relative;
          &.end {
            justify-content: flex-end;
          }

          .radio-warp {
            width: 100%;

            /deep/.ui_radioGroup {
              .radio-box {
                display: flex;
                align-items: center;
                min-height: 0;
                padding: 0;
                width: 100%;
              }

              .radio-item {
                padding: 0;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1;
                max-width: 50%;
                height: 40px;
                border-radius: 4px;
                border: 1px solid #ccc;
                font-size: 14px;
                margin: 0;
                margin-left: 12px;

                &:first-child {
                  margin-left: 0;
                }

                &.invalid {
                  color: #cccccc;
                  border: 1px solid #ccc;
                }

                &.active {
                  border: 1px solid #a43127;
                  font-weight: bold;
                  color: #000;
                }
              }
            }

            .radio-item {
              display: flex;
              align-items: center;
              justify-content: center;
              flex: 1;
              height: 40px;
              border-radius: 4px;
              border: 1px solid #ccc;
              font-size: 14px;

              margin-left: 12px;

              &:first-child {
                margin-left: 0;
              }

              &.invalid {
                color: #cccccc;
                border: 1px solid #ccc;
              }

              &.active {
                font-weight: bold;
                color: @active-color;
              }
            }
          }

          .input-text {
            height: 100%;
            width: 100%;
            font-size: 14px;
            color: #000;
          }

          .textarea-text {
            height: 100%;
            width: 100%;
            font-size: 14px;
            color: #000;
            margin: 13px 0;
            line-height: 22px;
          }

          .text {
            display: flex;
            align-items: center;
            color: #000000;
            font-size: 14px;

            .price {
              color: @active-color;
            }
          }

          .select-box {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .text {
              color: #cccccc;
            }
            .red {
              color: #a43127;
            }
            .black{
              color:#000;
            }
            .icon-danxuan_weixuan,
            .icon-danxuan_yixuan {
              font-size: 18px;
            }

            .icon-danxuan_yixuan {
              color: #a43127;
            }
          }
        }

        .already-box {
          display: flex;
          align-items: center;
          width: 100%;
          padding-left: 16px;
          background: #f8f8f8;
          border-radius: 4px;
          height: 40px;
          width: 100%;
          font-size: 14px;
        }

        .already-box2 {
          margin-top: 16px;
          font-size: 14px;
          color: #808080;
        }

        .check-in-infos {
          width: 100%;

          .check-in-info {
            position: relative;
            padding: 12px;
            box-sizing: border-box;
            margin-top: 8px;
            width: 100%;
            background: #f8f8f8;
            border-radius: 4px;

            .icon-a-16_guanbi_ciji {
              position: absolute;
              right: 12px;
              top: 12px;
              color: #808080;
              font-size: 12px;
            }

            &:first-child {
              margin-top: 0;
            }

            .name {
              font-size: 14px;
              line-height: 1;
            }

            .id-card {
              display: flex;
              margin-top: 8px;
              font-size: 12px;
              line-height: 1;
              color: #808080;
              .idCardType {
                margin-right: 8px;
              }
            }
          }
        }
      }

      .add-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 52px;
        width: 100%;
        font-size: 14px;
        color: #000;

        .iconfont {
          font-size: 20px;
          margin-right: 8px;
        }
      }
    }
  }

  .rule {
    padding: 24px 16px;
    font-size: 12px;
    line-height: 18px;
    color: #808080;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    border-top: 1px solid #eee;
    padding: 12px 16px;
    z-index: 2;
    padding-bottom: calc(~"12px + constant(safe-area-inset-bottom)");
    padding-bottom: calc(~"12px + env(safe-area-inset-bottom)");
    .price-info {
      display: flex;
      justify-content: center;
      flex-direction: column;

      .price {
        display: flex;
        color: @active-color;
        font-family: Montserrat;
        &.weight {
          font-weight: 600;
        }
      }

      .price-detail {
        display: flex;
        align-items: center;
        font-weight: normal;
        font-size: 12px;
        margin-left: 10px;
        color: #000;

        .iconfont {
          margin-left: 4px;
          font-size: 12px;
        }
      }

      .price-tips {
        margin-top: 8px;
        color: #808080;
        font-size: 12px;
      }
    }

    .submit-btn {
      display: flex;
      align-items: center;
      height: 48px;
      color: #ffffff;
      font-size: 16px;
      padding: 0 40px;
      border-radius: 4px;
    }
  }

  .layer-container {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.76);
    z-index: 99;
    height: 100vh;
    width: 100%;
  }

  .couponList {
    padding: 4px 16px 16px;
    max-height: calc(100vh - 210px);
    overflow-y: auto;
    width: 100%;
    background: #f8f8f8;

    .listItem {
      margin-top: 12px;
    }
  }

  .layer-box {
    position: relative;

    width: 100%;
    background: #f8f8f8;

    .title {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 56px;
      color: #000000;
      font-family: "PingFang SC";
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      border-bottom: 1px solid #eeeeee;

      .icon-a-20_guanbi {
        position: absolute;
        top: 20px;
        left: 22px;
        font-size: 18px;
      }
    }
    .add-btn-box {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      padding: 16px 0;
      background: #f8f8f8;
    }
    .add-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 16px;

      font-size: 16px;

      border: 0.5px solid #000000;
      height: 48px;
      box-sizing: border-box;
      border-radius: 4px;

      .icon-add {
        font-size: 22px;
        margin-right: 12px;
      }
    }

    .info-list {
      padding: 0 16px 32px;
      min-height: 200px;

      .info-item {
        padding: 16px 12px;
        box-sizing: border-box;
        margin-bottom: 16px;
        display: flex;
        background: #fff;
        border-radius: 8px;
        justify-content: space-between;
        align-items: center;

        .info-item-lf {
          display: flex;
          align-items: center;

          .icon-a-16_bianji {
            margin-right: 12px;
            font-size: 16px;
          }

          .info-item-lf-info {
            .info-item-name {
              display: flex;
              color: #000000;
              font-weight: bold;
              font-size: 16px;
              line-height: 1;

              .ageType {
                margin-left: 8px;
                color: #a43127;
                border-radius: 4px;
                background: rgba(164, 49, 39, 0.08);
                padding: 2px 4px;
                font-size: 10px;
                line-height: 1;
                font-weight: normal;
              }
            }

            .info-item-id-card {
              margin-top: 12px;
              font-size: 12px;
              color: #808080;
            }
          }
        }

        .icon-duoxuan_weixuan,
        .icon-danxuan_yixuan,
        .icon-duoxuan_yixuan,
        .icon-danxuan_bukexuan {
          font-size: 16px;
          padding: 10px 0 10px 10px;

          &.icon-duoxuan_weixuan {
            color: #808080;
          }

          &.icon-duoxuan_yixuan {
            color: #a43127;

            &.noCan {
              color: #ccc;
            }
          }

          &.icon-danxuan_yixuan {
            color: #a43127;
          }
        }
      }
    }
  }

  .layer-footer {
    position: sticky;
    bottom: 0;

    left: 0;
    right: 0;
    background: #fff;
    padding: 12px 16px;

    .layer-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
    }
  }

  .priceInfo {
    padding: 24px 16px 150px;
    padding-top: 0;
    .price-item {
      padding-top: 24px;
      .main {
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        font-weight: bold;
        line-height: 16px;
        .price-box{
          display: flex;
          align-items: center;
        }
        .sub{
          color: #808080;
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
          line-height: 12px; 
          margin-left:4px;
        }
      }
      .price {
        color: #a43127;
      }
      .other {
        display: flex;
        justify-content: space-between;
        margin-top: 16px;
        font-size: 14px;
        color: #808080;
      }
    }
  }
}
</style>