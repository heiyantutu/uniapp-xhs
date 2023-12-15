<template>
  <div class="consultationForm_ui">
    <coustom-head color="#fff" title=""></coustom-head>
    <div
      class="header_wrap"
      :style="{
        'background-image': 'url(' + header.imgUrl + ')',
        // paddingTop: navHeight + 'px',
      }"
    >
      <div class="title">
        <!-- 定制专属旅程 -->
        {{ header.title }}
      </div>
      <div class="subTitle">
        <!-- 提交需求 > 确认方案及报价 > 签约付款 > 轻松出行 -->
        {{ header.subTitle }}
      </div>
      <div class="hotel-box">
        <div class="userInfoList">
          <div class="userInfoItem">
            <div class="userInfoTitle">姓名</div>
            <div class="userInfoDesc">
              <input type="text" placeholder="请输入您的姓名" v-model="name" />
              <i class="icon_more iconfont icon-a-16_lianxiren"></i>
            </div>
          </div>
          <div class="userInfoItem">
            <div class="userInfoTitle">手机号</div>
            <div class="userInfoDesc">
              <input
                type="number"
                placeholder="请输入手机号"
                maxlength="11"
                v-model="phone"
              />
            </div>
          </div>
          <div class="userInfoItem">
            <div class="userInfoTitle">出行时间</div>
            <div class="userInfoDesc" @click="showCalendar">
              <p class="dayTime">
                {{ timeDay(startDate) + "-" + timeDay(endDate) }}
              </p>
              <i class="icon_more iconfont icon-a-12_youlajiantou_hei"></i>
            </div>
          </div>
        </div>
        <div class="form_tip">
          以下为选填信息，填写有助于顾问更快了解您的需求。
        </div>
      </div>
    </div>
    <div class="destination_wrap">
      <div class="des_main">
        <div class="des_title">心仪目的地</div>
        <div class="place_wrap" style="margin-top: 8px">
          <div v-for="(proItem, index) in dataList.provinceList" :key="index">
            <div class="des_name">{{ proItem.provinceDesc }}</div>
            <div class="check_wrap">
              <checkbox-group
                @change="checkboxChange($event, proItem.dictionaryDtos)"
                class="checkbox_warp"
              >
                <label
                  v-for="item in proItem.dictionaryDtos"
                  :key="item.dictionaryCode"
                  :class="
                    item.checked ? 'option_active item' : 'option_default item'
                  "
                >
                  <view class="checkboxHidden">
                    <checkbox
                      :value="item.dictionaryCode"
                      :checked="item.checked"
                    />
                  </view>
                  <view class="name_wrap">{{ item.dictionaryDesc }}</view>
                  <i
                    :class="item.checked ? 'show_icon' : 'hide_icon'"
                    class="icon_select iconfont icon-a-20_xuanzhongjiaobiao_youxiajiao_hongse"
                  ></i>
                </label>
              </checkbox-group>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="destination_wrap">
      <div class="des_main">
        <div class="des_title">行程偏好</div>
        <div class="place_wrap">
          <div class="des_name" style="margin-top: 8px">偏好项目</div>
          <div class="check_wrap">
            <checkbox-group
              @change="checkListChange($event, dataList.listCodeBaseList)"
              class="checkbox_warp"
            >
              <label
                v-for="item in dataList.listCodeBaseList"
                :key="item.code"
                :class="
                  item.checked ? 'option_active item' : 'option_default item'
                "
              >
                <view class="checkboxHidden">
                  <checkbox :value="item.code" :checked="item.checked" />
                </view>
                <view class="name_wrap">{{ item.name }}</view>
                <i
                  :class="item.checked ? 'show_icon' : 'hide_icon'"
                  class="icon_select iconfont icon-a-20_xuanzhongjiaobiao_youxiajiao_hongse"
                ></i>
              </label>
            </checkbox-group>
          </div>
          <div class="des_name" style="margin-top: 8px">更多需求</div>
          <textarea
            v-model="otherRemark"
            class="textarea-text"
            auto-height
            placeholder="请输入其他行程需求"
            placeholder-style="color: #CCCCCC;line-height: 22px;"
          ></textarea>
        </div>
      </div>
    </div>
    <div class="destination_wrap">
      <div class="des_main">
        <div class="des_title">出行人数</div>
        <div class="row rowNum">
          <div class="tip">
            成人
            <span class="tip_text">18岁及以上</span>
          </div>
          <div class="productNum">
            <i
              v-if="num > 0"
              class="icon_select icon iconfont icon-a-20_jian"
              @click="reduce('adult')"
            ></i>
            <i
              v-else
              class="iconfont icon_disAble icon-a-20_jian_wufaxuanze"
            ></i>
            <span class="number">{{ num }}</span>
            <i
              class="icon_select icon iconfont icon-a-20_jia"
              @click="add('adult')"
            ></i>
          </div>
        </div>
        <div class="row rowNum">
          <div class="tip">
            大童
            <span class="tip_text">12岁（含）-18岁</span>
          </div>
          <div class="productNum">
            <i
              v-if="daNum > 0"
              class="icon_select icon iconfont icon-a-20_jian"
              @click="reduce('daTong')"
            ></i>
            <i
              v-else
              class="iconfont icon_disAble icon-a-20_jian_wufaxuanze"
            ></i>
            <span class="number">{{ daNum }}</span>
            <i
              class="icon_select icon iconfont icon-a-20_jia"
              @click="add('daTong')"
            ></i>
          </div>
        </div>
        <div class="row rowNum">
          <div class="tip">
            中童
            <span class="tip_text">6岁（含）-12岁</span>
          </div>
          <div class="productNum">
            <i
              v-if="ZhongNum > 0"
              class="icon_select icon iconfont icon-a-20_jian"
              @click="reduce('zhongTong')"
            ></i>
            <i
              v-else
              class="iconfont icon_disAble icon-a-20_jian_wufaxuanze"
            ></i>
            <span class="number">{{ ZhongNum }}</span>
            <i
              class="icon_select icon iconfont icon-a-20_jia"
              @click="add('zhongTong')"
            ></i>
          </div>
        </div>
        <div class="row rowNum">
          <div class="tip">
            幼童
            <span class="tip_text">未满6岁</span>
          </div>
          <div class="productNum">
            <i
              v-if="xiaoNum > 0"
              class="icon_select icon iconfont icon-a-20_jian"
              @click="reduce('xiaoTong')"
            ></i>
            <i
              v-else
              class="iconfont icon_disAble icon-a-20_jian_wufaxuanze"
            ></i>
            <span class="number">{{ xiaoNum }}</span>
            <i
              class="icon_select icon iconfont icon-a-20_jia"
              @click="add('xiaoTong')"
            ></i>
          </div>
        </div>
        <div class="row rowNum">
          <div class="tip">
            含老人
            <span class="tip_text">60岁及以上</span>
          </div>
          <div class="productNum">
            <i
              v-if="oldNum > 0"
              class="icon_select icon iconfont icon-a-20_jian"
              @click="reduce('oldNum')"
            ></i>
            <i
              v-else
              class="iconfont icon_disAble icon-a-20_jian_wufaxuanze"
            ></i>
            <span class="number">{{ oldNum }}</span>
            <i
              class="icon_select icon iconfont icon-a-20_jia"
              @click="add('oldNum')"
            ></i>
          </div>
          <!-- <div class="productNum">
            <p class="agree_wrap" @click.stop="toggleAggre">
              <i class="iconfont icon-danxuan_yixuan" v-if="isAgree"></i>
              <i class="iconfont icon-danxuan_weixuan" v-else></i>
            </p> -->
          <!-- </div> -->
        </div>
        <div class="row rowNum">
          <div class="tip">含港澳台人士</div>
          <div class="productNum">
            <i
              v-if="hmkNum > 0"
              class="icon_select icon iconfont icon-a-20_jian"
              @click="reduce('hmkNum')"
            ></i>
            <i
              v-else
              class="iconfont icon_disAble icon-a-20_jian_wufaxuanze"
            ></i>
            <span class="number">{{ hmkNum }}</span>
            <i
              class="icon_select icon iconfont icon-a-20_jia"
              @click="add('hmkNum')"
            ></i>
          </div>
          <!-- <div class="productNum">
            <p class="agree_wrap" @click.stop="togglePeople">
              <i class="icon iconfont icon-danxuan_yixuan" v-if="isPeople"></i>
              <i class="icon iconfont icon-danxuan_weixuan" v-else></i>
            </p>
          </div> -->
        </div>
        <div class="row rowNum">
          <div class="tip">含外籍人士</div>
          <div class="productNum">
            <i
              v-if="foreignerNum > 0"
              class="icon_select icon iconfont icon-a-20_jian"
              @click="reduce('foreignerNum')"
            ></i>
            <i
              v-else
              class="iconfont icon_disAble icon-a-20_jian_wufaxuanze"
            ></i>
            <span class="number">{{ foreignerNum }}</span>
            <i
              class="icon_select icon iconfont icon-a-20_jia"
              @click="add('foreignerNum')"
            ></i>
          </div>
          <!-- <div class="productNum">
            <p class="agree_wrap" @click.stop="togglePeople">
              <i class="icon iconfont icon-danxuan_yixuan" v-if="isPeople"></i>
              <i class="icon iconfont icon-danxuan_weixuan" v-else></i>
            </p>
          </div> -->
        </div>
        <div class="row rowAddress">
          <div class="tip" style="width: 88px">出发地</div>
          <div class="productAddress">
            <pickerAddress @changeCity="changeCity" style="width: 100%">
              <div class="address_wrap">
                <div
                  v-if="txt == '请选择出发地'"
                  class="address_text textColor"
                >
                  请选择出发地
                </div>
                <div v-else class="address_text">{{ txt }}</div>
                <i
                  class="goAddress icon_more iconfont icon-a-12_youlajiantou_hei"
                ></i>
              </div>
            </pickerAddress>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom_dis"></div>
    <div class="footer">
      <div class="kefu_wrap" @click.stop="showDialog">
        <div class="ke_text">一键咨询</div>
      </div>
      <div class="order-btn" @click="submitPage">提交需求</div>
    </div>
    <!-- <div class="consult-layer" v-if="showGet">
      <div class="receive-box">
        <div class="head">
          一键咨询
          <i class="iconfont icon-a-20_guanbi" @click="hideDialog"></i>
        </div>
        <div class="receive_mian">
          <div class="consult_list">
            <div>
              <i class="iconfont icon-a-20_kefu consult_icon"></i>
            </div>
            <div>
              <div class="consult_title">在线客服</div>
              <div class="consult_text">引导话术引导话术引导话术。</div>
            </div>
          </div>
          <div class="consult_list">
            <div>
              <i class="iconfont icon-a-20_dianhua consult_icon"></i>
            </div>
            <div>
              <div class="consult_title">电话客服</div>
              <div class="consult_text">400-0000-830</div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg"></div>
    </div> -->
    <calendar
      ref="calendarCompent"
      @change-date="changeDate"
      :checkInDay="startDate"
      :checkOutDay="endDate"
    ></calendar>
    <kf-dialog ref="kf" title="一键咨询"></kf-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import api from "@/utils/api";
import dayjs from "dayjs";
import { getStorage } from "@/utils/wxuser";
import { jAlert3 } from "@/base/jAlert/jAlert";
import pickerAddress from "@/components/pickerAddress.vue";
import calendar from "@/components/calendar.vue";
import kfDialog from "@/components/kfDialog.vue";
import { timeDay } from "@/utils/filter";
import { onLoad } from "@dcloudio/uni-app";
import defaultChannel from "@/utils/defaultChannel";
import coustomHead from "@/components/coustomHead.vue";
import { createUrl, getUrlParams, toLogin } from "@/utils/utils";
import UmengSDK from "@/utils/umengAdaptor.js";
let config = getStorage("config");
let user = getStorage("user");
let adSwiperConfig = reactive({
  indicatorDots: false,
  autoplay: true,
  dotPosStyle: "left: 50%;transform: translateX(-50%);bottom:8px;",
});
let txt = ref("请选择出发地");
let title = ref("Hello");
let name = ref("");
let phone = ref("");
let otherRemark = ref("");
let isAgree = ref(false);
let isPeople = ref(false);
let startDate = ref(dayjs().format("YYYY-MM-DD"));
let endDate = ref(dayjs().add(1, "days").format("YYYY-MM-DD"));
const calendarCompent = ref();
let dataList = reactive({
  provinceList: <any[]>[],
  listCodeBaseList: <any[]>[],
  cityData: <any[]>[],
  proCheckValue: <any[]>[],
  checkValue: <any[]>[],
  provinceData: <any[]>[],
  selectPlace: <any[]>[],
});
let currentProvince = ref({});
let currentCity = ref({});
const navHeight = ref(80);
const header = ref({});
let num = ref(0);
let daNum = ref(0);
let ZhongNum = ref(0);
let xiaoNum = ref(0);
let oldNum = ref(0);
let hmkNum = ref(0);
let foreignerNum = ref(0);
let guestId = ref();
let channel = ref(defaultChannel);
let kf = ref();
const toggleAggre = () => {
  if (isAgree.value) {
    isAgree.value = false;
  } else {
    isAgree.value = true;
  }
};
const togglePeople = () => {
  if (isPeople.value) {
    isPeople.value = false;
  } else {
    isPeople.value = true;
  }
};
const changeCity = (data: any) => {
  dataList.selectPlace = data.data;
  let arr = data.data || [];
  txt.value = arr.join(" ");
  currentProvince.value = dataList.provinceData.find((item: any) => {
    return item.name == arr[0];
  });
  getCityData(currentProvince.value.code);
};
const reduce = (type: string) => {
  switch (true) {
    case type == "adult":
      if (num.value <= 0) {
        return false;
      }
      num.value = num.value - 1;
      break;
    case type == "daTong":
      if (daNum.value <= 0) {
        return false;
      }
      daNum.value = daNum.value - 1;
      break;
    case type == "zhongTong":
      if (ZhongNum.value <= 0) {
        return false;
      }
      ZhongNum.value = ZhongNum.value - 1;
      break;
    case type == "xiaoTong":
      if (xiaoNum.value <= 0) {
        return false;
      }
      xiaoNum.value = xiaoNum.value - 1;
      break;
    case type == "oldNum":
      if (oldNum.value <= 0) {
        return false;
      }
      oldNum.value = oldNum.value - 1;
      break;
    case type == "hmkNum":
      if (hmkNum.value <= 0) {
        return false;
      }
      hmkNum.value = hmkNum.value - 1;
      break;
    case type == "foreignerNum":
      if (foreignerNum.value <= 0) {
        return false;
      }
      foreignerNum.value = foreignerNum.value - 1;
      break;
    default:
      break;
  }
};
const add = (type: string) => {
  switch (true) {
    case type == "adult":
      num.value = num.value + 1;
      break;
    case type == "daTong":
      daNum.value = daNum.value + 1;
      break;
    case type == "zhongTong":
      ZhongNum.value = ZhongNum.value + 1;
      break;
    case type == "xiaoTong":
      xiaoNum.value = xiaoNum.value + 1;
      break;
    case type == "oldNum":
      oldNum.value = oldNum.value + 1;
      break;
    case type == "hmkNum":
      hmkNum.value = hmkNum.value + 1;
      break;
    case type == "foreignerNum":
      foreignerNum.value = foreignerNum.value + 1;
      break;
    default:
      break;
  }
};
const changeDate = (time: any) => {
  startDate.value = time.checkInDay;
  endDate.value = time.checkOutDay;
};
const showCalendar = () => {
  calendarCompent.value.showDialog();
};
const checkboxChange = (e: any, list: any) => {
  var items = list,
    values = e.detail.value;
  for (var i = 0, lenI = items.length; i < lenI; ++i) {
    const item = items[i];
    if (values.includes(item.dictionaryCode)) {
      item.checked = true;
      //   this.$set(item, "checked", true);
    } else {
      item.checked = false;
      //   this.$set(item, "checked", false);
    }
  }
  dataList.proCheckValue = values.sort(); //将其排个序
};
const checkListChange = (e: any, list: any) => {
  var itemList = list,
    valueList = e.detail.value;
  for (var i = 0, lenI = itemList.length; i < lenI; ++i) {
    const item = itemList[i];
    if (valueList.includes(item.code)) {
      item.checked = true;
      //   this.$set(item, "checked", true);
    } else {
      item.checked = false;
      //   this.$set(item, "checked", false);
    }
  }
  dataList.checkValue = valueList.sort(); //将其排个序
};
const toSucceed = () => {
  uni.navigateTo({
    url: `/pagesE/consultationForm/submitSucceed?type=success`,
  });
};
let showGet = ref(false);
const showDialog = () => {
  kf.value.showDialog();
  //showGet.value = true;
};
const hideDialog = () => {
  showGet.value = false;
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
            guestId.value = res.retVal.retVal[0].guestId;
          }
        }
      }
    });
};
const submitPage = () => {
  if (!(user && user.memberId)) {
    toLogin();
    return;
  }
  let reg = /^1[23456789]\d{9}$/;
  if (!name.value) {
    jAlert3("请输入姓名");
    return false;
  }
  if (!phone.value) {
    jAlert3("请输入手机号码");
    return false;
  }
  if (!reg.test(phone.value)) {
    jAlert3("请输入正确的手机号");
    return false;
  }
  let lastCheck = [] as any;
  dataList.provinceList.map((item: any) => {
    item.dictionaryDtos.map((v: any) => {
      if (v.checked) {
        lastCheck.push({
          placeCode: v.dictionaryCode,
          // placeDesc: v.provinceDesc + "-" + v.dictionaryDesc,
          placeDesc: v.dictionaryDesc,
          placeType: "END",
        });
      }
    });
  });
  if (currentProvince.value.code) {
    lastCheck.push({
      placeCode: currentProvince.value.code + "," + currentCity.value.code,
      placeDesc: currentProvince.value.name + "-" + currentCity.value.descript,
      placeType: "START",
    });
  }

  let lastTagList = [] as any;
  dataList.listCodeBaseList.map((item: any) => {
    if (item.checked) {
      lastTagList.push({
        tagCode: item.code,
        tagName: item.name,
      });
    }
  });
  let opt = {
    memberId: user.memberId,
    memberLevel: user.memberLevel,
    memberDesc: user.cardLevelDescript,
    guestId: guestId.value,
    unitCode: config.hotelGroupCode,
    hotelGroupCode: config.hotelGroupCode,
    rsvMan: name.value,
    mobile: phone.value,
    startDate: startDate.value,
    endDate: endDate.value,
    adult: num.value,
    olderChildren: daNum.value,
    middleChildren: ZhongNum.value,
    youngerChildren: xiaoNum.value,
    oldNum: oldNum.value,
    hmkNum: hmkNum.value,
    foreignerNum: foreignerNum.value,
    // travelPreferences: dataList.checkValue.toString(),
    placeDtoList: lastCheck,
    // endPlaces: lastCheck.toString(),
    // startPlace: txt.value == "选择地址" ? "" : txt.value,
    otherRemark: otherRemark.value,
    tagList: lastTagList,
  };
  api
    .interfaceTransfer({
      config: {
        interfaceType: "POST",
        interfaceModule: "GC_TRAVEL_ORDER",
        interfaceMethod: "api/advice/saveOrUpdateAdviceOrder",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
      query: opt,
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        toSucceed();
        UmengSDK.sendEvent("cp_submit_clk", {
          page_name: "consult_pg",
          button_id: 2101,
          button_name: "点击提交需求",
          trip_people_name: name.value,
          phone_number: phone.value,
          start_date: startDate.value,
          end_date: endDate.value,
          destination: txt.value,
        });
      }
    });
};
const travelProvinceList = () => {
  uni.showLoading({
    title: "加载中...",
  });
  api
    .interfaceTransfer({
      config: {
        interfaceType: "GET",
        interfaceModule: "GC_PRODUCT_JOURNEY",
        interfaceMethod: "api/itinerary/listTravelProvinceDto",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
      query: {
        unitCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        dataList.provinceList = res.retVal.retVal;
      }
    })
    .finally(() => {
      uni.hideLoading();
    });
};
const querySystemTagConfig = (cb?: Function) => {
  let query: any = {
    hotelCode: config.hotelCode,
    hotelGroupCode: config.hotelGroupCode,
    firstResult: 0,
    pageSize: 200,
    channel: "WECHAT",
    groupCode: "travelPreferences",
  };
  api
    .interfaceTransfer({
      config: {
        interfaceFrom: "member",
        interfaceMethod: "crm/v2/querySystemTagConfig",
        hotelGroupCode: config.hotelGroupCode,
      },
      query,
    })
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.result == 0) {
          let templateList = res.retVal.retVal.datas;
          dataList.listCodeBaseList = templateList[0].tagList;
          cb && cb();
        } else {
          jAlert3(res.retVal.msg);
        }
      } else {
        jAlert3(res.msg);
      }
      console.log(res);
    });
};
const advertisementPage = () => {
  api
    .advertisementPage({
      hotelCode: config.hotelCode,
      hotelGroupCode: config.hotelGroupCode,
      clientTypes: channel.value,
      firstResult: 0,
      pageSize: 999,
    })
    .then((res: any) => {
      if (
        res.result == 0 &&
        res.retVal &&
        res.retVal.datas &&
        res.retVal.datas.length > 0
      ) {
        res.retVal.datas.forEach((item: any) => {
          if (item.showLocation == "2") {
            header.value = JSON.parse(item.infos);
          }
          // if (item.showLocation == "0") {
          //   slides = JSON.parse(item.infos);
          // }
          // if (item.showLocation == "11") {
          //   let info = JSON.parse(item.infos);
          //   if (info && info.length > 0) {
          //     footerAd.value = info[0];
          //   }
          // }
        });
      }
    });
};
const getProData = () => {
  api
    .interfaceTransfer({
      config: {
        interfaceType: "GET",
        interfaceModule: "GC_INFOMATION_CENTER",
        interfaceMethod: "api/city/listProvinces",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
      query: {
        countryCode: "CN",
        // provinceCode: "ZJ",
        unitCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        dataList.provinceData = reactive(res.retVal.retVal);
      }
    });
};
const getCityData = (code: any) => {
  api
    .interfaceTransfer({
      config: {
        interfaceType: "GET",
        interfaceModule: "GC_INFOMATION_CENTER",
        interfaceMethod: "api/city/listCities",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
      query: {
        countryCode: "CN",
        provinceCode: code,
        unitCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        dataList.cityData = res.retVal.retVal;
        currentCity.value = res.retVal.retVal.find((cItem: any) => {
          return cItem.descript == dataList.selectPlace[1];
        });
      }
    });
};
onLoad((options) => {
  advertisementPage();
});
onMounted(() => {
  UmengSDK.sendPV({
    page_id: "2001",
    page_name: "consult_pg",
    page_title_name: "咨询单页",
  });
  // advertisementPage();
  setTimeout(() => {
    calendarCompent.value.init({
      checkInDay: startDate.value,
      checkOutDay: endDate.value,
      title: "出行日期",
      isCheckedInTxt: "开始",
      isCheckedOutTxt: "结束",
    });
  }, 500);
  // calendarCompent.value.init({
  //   checkInDay: startDate.value,
  //   checkOutDay: endDate.value,
  //   title: "出行日期",
  //   isCheckedInTxt: "开始",
  //   isCheckedOutTxt: "结束",
  // });
  // uni.getSystemInfo({
  //   success: (res) => {
  //     navHeight.value = res.statusBarHeight || 80;
  //   },
  //   fail(err) {
  //     console.log(err);
  //   },
  // });
  travelProvinceList();
  getProData();
  querySystemTagConfig();
  listGuestLinkExtraInfoWithMemberIdOrOpenId();
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");

.consultationForm_ui {
  background: #f8f8f8;
  padding-bottom: 70px;
  /deep/.ui_coustomHead {
    background: linear-gradient(#244a63, #5e93b7);
    // background-color: #000;
    // background-repeat: repeat;
    // background-size: 40px 37.5px;
  }
  .swiper-box {
    position: relative;
    width: 100%;
    height: 280px;
    min-height: 280px;
  }

  .header_wrap {
    padding-top: 88px;
    // padding-bottom: 12px;
    background-size: contain;
    background-repeat: no-repeat;
    .title {
      padding: 0 16px;
      margin-top: 12px;
      min-height: 20px;
      line-height: 1;
      font-size: 20px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #fff;
    }

    .subTitle {
      min-height: 44px;
      max-width: 200px;
      padding: 0 16px;
      margin-top: 12px;
      font-size: 14px;
      line-height: 22px;
      font-family: PingFang SC;
      color: #fff;
      opacity: 0.8;
    }
  }

  .hotel-box {
    position: relative;
    margin: 38px 16px 0;
    border-radius: 8px;
    overflow: hidden;
    .userInfoList {
      background: #ffffff;
      border-radius: 8px;
      padding: 0 12px;
      margin-bottom: 12px;
      .userInfoItem {
        height: 48px;
        display: flex;
        align-items: center;
        position: relative;
        font-family: PingFang SC;
        &.big {
          height: 80px;
        }
        .userInfoTitle {
          width: 88px;
          font-size: 14px;
          color: @tl-black;
          font-family: PingFang SC;
        }
        .userInfoDesc {
          font-size: 14px;
          color: @tl-black;
          flex: 1;
          display: flex;
          align-items: center;
          height: 100%;
          font-family: PingFang SC;
          input {
            flex: 1;
          }
          .btn_yanzheng {
            border-radius: 4px;
            font-size: 12px;
            color: #000;
            padding: 8px 12px;
            border: 1px solid #000;
            font-family: PingFang SC;
            &.disabled {
              color: #ccc;
              border: 1px solid #ccc;
            }
          }
          &.tofill {
            color: @text-fade;
          }
          .avatar {
            border: 1px solid rgba(238, 238, 238, 1);
            width: 48px;
            height: 48px;
            border-radius: 50%;
          }
        }
        .icon_more {
          margin-left: auto;
          font-size: 20px;
        }
      }
    }
    .form_tip {
      margin: 24px auto 16px auto;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 14px;
      letter-spacing: 0px;
      text-align: justified;
      color: #808080;
    }
  }

  .destination_wrap {
    border-radius: 8px;
    margin: auto 16px;
    margin-bottom: 12px;
    background: #fff;
    .des_main {
      margin: auto 12px;
    }
    .des_title {
      font-family: PingFang SC;
      padding: 16px 0;
      font-size: 14px;
      font-weight: bold;
      line-height: 14px;
      letter-spacing: 0px;
      text-align: left;
      color: #000;
      border-bottom: 1px solid #eee;
    }
    .place_wrap {
      padding-bottom: 8px;

      .des_name {
        font-family: PingFang SC;
        padding: 8px 0 16px 0;
        font-size: 14px;
        font-weight: 400;
        line-height: 14px;
        letter-spacing: 0px;
        text-align: left;
        color: #000;
      }
      .checkbox_warp {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        .item {
          font-family: PingFang SC;
          position: relative;
          margin-right: 8px;
          border: 1px solid rgba(204, 204, 204, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          width: calc((100% - 32px) / 4);
          min-width: calc((100% - 32px) / 4);
          max-width: calc((100% - 32px) / 4);
          height: 31px;
          margin-bottom: 8px;
          background: #fff;
          border-radius: 4px;
          font-size: 14px;
          color: #000;
          &:nth-child(4n + 4) {
            margin-right: 0;
          }
        }
        .name_wrap {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .icon_select {
          color: #808080;
          position: absolute;
          bottom: -4px;
          right: -2px;
          color: #a43127;
          font-size: 22px;
        }
        .show_icon {
          display: block;
        }
        .hide_icon {
          display: none;
        }

        // 选中的颜色
        .option_active {
          border: 1px solid #a43127;
        }

        // 默认颜色
        .option_default {
          background: #fff;
        }

        .checkboxHidden {
          display: none;
        }
      }
      .textarea-text {
        height: 100%;
        width: 100%;
        font-size: 14px;
        color: #000;
        margin-bottom: 12px;
        line-height: 22px;
        font-family: PingFang SC;
      }
    }
    .rowNum {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 52px;
    }
    // padding: 15px 0;
    .tip {
      font-size: 14px;
      color: #000;
      letter-spacing: 0;
      font-weight: 500;
      font-family: PingFang SC;
    }
    .tip_text {
      padding-left: 8px;
      color: #ccc;
      font-size: 12px;
      font-weight: 400;
      line-height: 12px;
      letter-spacing: 0px;
      text-align: left;
      font-family: PingFang SC;
    }
    .productNum,
    .productAddress {
      display: flex;
      .number {
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
        text-align: center;
        line-height: 20px;
        font-weight: 500;
        width: 20px;
        height: 20px;
        display: inline-block;
        margin: 0 16px;
        font-family: PingFang SC;
      }
      .icon {
        display: inline-block;
        border-radius: 50%;
        font-family: PingFang SC;
        font-size: 22px;
        color: #808080;
        letter-spacing: 0;
        text-align: center;
        line-height: 20px;
      }
      .icon_disAble {
        display: inline-block;
        border-radius: 50%;
        font-family: PingFang SC;
        font-size: 22px;
        color: rgba(204, 204, 204, 1);
        letter-spacing: 0;
        text-align: center;
        line-height: 20px;
      }
      .icon_more {
        font-size: 20px;
      }
      .agree_wrap {
        display: flex;
        align-items: center;
        .iconfont {
          color: #808080;
          font-size: 22px;
          // margin-right: 5px;
        }
        .icon-danxuan_yixuan {
          color: #a43127;
        }
      }
      .address_text {
        flex-basis: 100%;
        font-size: 14px;
        font-weight: 400;
        line-height: 14px;
        letter-spacing: 0px;
        text-align: left;
        // margin-left: 46px;
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        line-height: 14px;
        letter-spacing: 0px;
        text-align: left;

        // padding-right: 25px;
      }
      .textColor {
        color: rgba(204, 204, 204, 1);
      }
    }

    .rowAddress {
      width: 100%;
      display: flex;
      // justify-content: space-between;
      align-items: center;
      height: 52px;
    }
    .productAddress {
      width: 100%;
    }
    .goAddress {
      margin-left: auto;
    }
  }
  .bottom_dis {
    height: 100px;
  }
  .footer {
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    border-top: 0.5px solid #eeeeee;
    .kefu_wrap {
      margin-bottom: 32px;
      margin-right: 12px;
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      color: #000;
      font-size: 16px;
      height: 48px;
      border: 1px solid #000;
      font-family: PingFang SC;
    }
    .order-btn {
      margin-bottom: 32px;
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      // background: #000;
      font-family: PingFang SC;
      border-radius: 4px;
      color: #ffffff;
      font-size: 16px;
      height: 48px;
      .baseBtn();
    }
  }
  /* .consult-layer {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 100vh;
    width: 100vw;

    .title {
      padding: 16px 16px 0;
      color: #000000;
      font-size: 18px;
      font-weight: bold;
      line-height: 1;
    }

    .receive-box {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      border-radius: 16px 16px 0 0;
      background: #f8f8f8;
      z-index: 99 !important;
      height: 450px;
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
      .receive_mian {
        .consult_list {
          border-radius: 8px;
          margin: 12px 16px;
          background: #fff;
          height: 68px;
          display: flex;
          align-items: center;
        }
        .consult_icon {
          margin: 0 12px;
          font-size: 22px;
        }
        .consult_title {
          color: #000;
          font-size: 14px;
          font-weight: 400;
          line-height: 14px;
          letter-spacing: 0px;
          text-align: left;
        }
        .consult_text {
          padding-top: 8px;
          color: #808080;
          font-size: 14px;
          font-weight: 400;
          line-height: 14px;
          letter-spacing: 0px;
          text-align: left;
        }
      }
    }
  }
  .bg {
    z-index: 90 !important;
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.76);
  } */
  .address_wrap {
    display: flex;
    align-items: center;
    width: 100%;
  }
}
</style>
