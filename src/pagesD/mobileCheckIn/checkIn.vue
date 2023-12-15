<template>
  <div class="checkIn_ui">
    <coustom-head color="#fff" title="移动入住"></coustom-head>
    <div
      class="header_wrap"
      :style="{
        'background-image':
          'url(' +
          hotelMsg.extraLogo +
          '?imageView2/1/w/214/h/160&x-oss-process=image/resize,m_fill,w_214,h_160' +
          ')',
        // paddingTop: navHeight + 'px',
      }"
    >
      <div class="subTitle">
        <div>欢迎来到</div>
        <div class="title">
          <!-- 定制专属旅程 -->
          {{ hotelMsg.hotelDesc }}
        </div>
        <div>
          {{
            isCheckIn == "R"
              ? "未办理入住"
              : isCheckIn == "I"
              ? "已办理入住"
              : "已离店"
          }}
        </div>
      </div>
      <div class="hotel-box" v-if="isShowQrcode">
        <div class="userInfoList">
          <div class="userInfoItem botbom">
            <div class="userTitle">入住人信息</div>
          </div>
          <div class="userInfoItem">
            <div class="userInfoTitle">姓名</div>
            <div class="userInfoDesc">{{ userInfo.name }}</div>
          </div>
          <div class="userInfoItem">
            <div class="userInfoTitle">证件类型</div>
            <div class="userInfoDesc">{{ idCardType[userInfo.idCode] }}</div>
          </div>
          <div class="userInfoItem">
            <div class="userInfoTitle">证件号码</div>
            <div class="userInfoDesc">
              {{ hideIdCard(userInfo.idNo, userInfo.idCode) }}
            </div>
          </div>
          <div class="userInfoItem">
            <div class="userInfoTitle">性别</div>
            <div class="userInfoDesc">
              {{ userInfo.sex == 1 ? "男" : "女" }}
            </div>
          </div>
          <div class="userInfoItem">
            <div class="userInfoTitle">出生日期</div>
            <div class="userInfoDesc">{{ userInfo.birthday }}</div>
          </div>
        </div>
        <div class="form_tip" v-if="isCheckIn == 'R' && isShowQrcode">
          <i class="icon_more iconfont icon-a-20_hangchengbangzhu1"></i>
          入住办理需要用户自拍一张照片以方便与公安系统核对
        </div>
        <div class="form_tip" v-if="isCheckIn == 'I'">
          <i class="icon_more iconfont icon-a-20_hangchengbangzhu1"></i>
          如需取消入住办理，请联系酒店人员
          <span
            class="phone"
            v-if="currentHotel.phone"
            @click="makePhoneCall(currentHotel.phone)"
            >{{ currentHotel.phone
            }}<i class="icon iconfont icon-a-16_youlajiantou_hei"></i
          ></span>
        </div>
      </div>
      <div class="hotel-box" v-else>
        <div class="userInfoList qrcode_wrap">
          <!-- <img
            class="qrcode_img"
            show-menu-by-longpress="true"
            :src="hotelMsg.mobileQrcode"
          /> -->
          <image
            class="qrcode_img"
            :show-menu-by-longpress="true"
            :src="hotelMsg.mobileQrcode"
          ></image>
          <!-- <img class="qrcode_img" :src="hotelMsg.pictures" /> -->
          <div class="qrcode_text">
            <div>行程内首次入住需长按保存上方公安二维码</div>
            <div style="margin-top:5px">微信识别图片办理</div>
            <!-- 行程内首次入住需长按识别上方公安二维码办理 -->
          </div>
        </div>
      </div>
    </div>

    <div class="bottom_dis"></div>
    <div class="footer" v-if="isCheckIn == 'R' && isShowQrcode">
      <div class="order-btn" @click="chooseImg">拍照办理入住</div>
    </div>
    <kf-dialog ref="kf" title="一键咨询"></kf-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, toRaw } from "vue";
import api from "@/utils/api";
import dayjs from "dayjs";
import { getStorage, setStorage, login } from "@/utils/wxuser";
import { jAlert3 } from "@/base/jAlert/jAlert";
import kfDialog from "@/components/kfDialog.vue";
import { timeDay } from "@/utils/filter";
import { onLoad } from "@dcloudio/uni-app";
import defaultChannel from "@/utils/defaultChannel";
import coustomHead from "@/components/coustomHead.vue";
import { createUrl, getUrlParams, toLogin } from "@/utils/utils";
import UmengSDK from "@/utils/umengAdaptor.js";
import { hideIdCard } from "@/utils/filter";

let config = getStorage("config");
let user = getStorage("user");
let name = ref("");
let phone = ref("");
let isShowQrcode = ref(false);
// let hotelMsg = getStorage("currentHotel");
let hotelMsg: any = ref({});
let otherRemark = ref("");
let startDate = ref(dayjs().format("YYYY-MM-DD"));
let endDate = ref(dayjs().add(1, "days").format("YYYY-MM-DD"));
let userInfo: any = ref();
let teamNo = ref("");
let mobile = ref("");
let hotelCode = ref("");
let scene = ref("");
const calendarCompent = ref();
let hotelList: any = ref([]);
const currentHotel: any = ref({});
let reserveOrder: any = ref({});
let travelDetail: any = reactive({});
let teamOrder: any = ref({});
let isCheckIn: any = ref("R");
let teamItineraries: any = ref([]);
let idCardType = reactive({
  "01": "身份证",
  "02": "临时身份证",
  "14": "护照",
  "21": "港澳通行证",
});
const navHeight = ref(80);
const header = ref({});
let channel = ref(defaultChannel);
let kf = ref();
const makePhoneCall = (phoneNumber: string) => {
  uni.makePhoneCall({
    phoneNumber: phoneNumber, //仅为示例，并非真实的电话号码
  });
};
const showCalendar = () => {
  calendarCompent.value.showDialog();
};
const toSucceed = () => {
  uni.navigateTo({
    url: `/pagesE/consultationForm/submitSucceed?type=success`,
  });
};
const showDialog = () => {
  kf.value.showDialog();
  //showGet.value = true;
};
const chooseImg = () => {
  uni.chooseImage({
    count: 1, // 默认9 这里默认让用户只能选一张图片吧
    sizeType: ["original", "compressed"], // 能够指定是原图还是压缩图，默认二者都有
    sourceType: ["camera"], // 能够指定来源是相冊还是相机，默认二者都有
    success: function (res) {
      var localIds = res.tempFilePaths; // 返回选定照片的本地ID列表，localId能够作为img标签的src属性显示图片
      wxuploadImage(localIds);
    },
    fail(err) {
      console.log("err", err);
    },
  });
};
const guestCheck = (imgUrl: any) => {
  uni.showLoading({
    title: "验证中...",
  });
  var obj = {
    hotelCode: hotelMsg.value.hotelCode,
    hotelGroupCode: config.hotelGroupCode,
    picture: imgUrl,
    teamNo: teamNo.value,
    certInfo: {
      reusing: userInfo.value.authId,
      certNum: userInfo.value.idNo,
    },
  };
  api
    .guestCheck(obj)
    .then((res: any) => {
      uni.hideLoading();
      if (res.result == 1 && res.retVal.code == 1) {
        uni.navigateTo({
          url: `/pagesD/mobileCheckIn/checkInSucceed?type=success`,
        });
      } else {
        jAlert3(res.msg || res.retVal.msg);
      }
    })
    .finally(() => {});
};
const wxuploadImage = (localIds: any) => {
  login().then((res: any) => {
    uni.uploadFile({
      //获取图片媒体ID
      // url: baseConfig.baseUrlmall + '/api/shop/syncUploadImageByMiniProgram.json',
      url:
        config.baseUrlmall.replace("/guardian", "") +
        "/api/shop/syncUploadImageByMiniProgram.json",
      filePath: localIds.toString(), // 需要上传的图片的本地ID
      name: "serviceId",
      header: {
        "Content-Type": "multipart/form-data",
      },
      formData: {
        code: res.code,
        hotelGroupCode: config.hotelGroupCode,
        hotelCode: hotelMsg.value.hotelCode,
        appid: config.appid,
        componentAppid: config.componentAppid,
        filePath: localIds.toString(),
      },
      success: function (res) {
        //获取成功
        if (res.statusCode == 200) {
          var opt = JSON.parse(res.data);
          // console.log(opt,"opt-------------------")
          if (opt.result == 1) {
            guestCheck(opt.msg);
          } else {
            jAlert3("上传失败，请重新上传");
            return false;
          }
        } else {
          jAlert3("上传失败，请重新上传");
          return false;
        }
      },
      fail: function (res: any) {
        //获取多媒体id失败 返回错误代码
        jAlert3("上传失败，msg：" + JSON.stringify(res));
      },
    });
  });
};
const advertisementPage = () => {
  api
    .advertisementPage({
      hotelCode: hotelMsg.value.hotelCode,
      hotelGroupCode: config.hotelGroupCode,
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
        res.retVal.datas.forEach((item: any) => {
          if (item.showLocation == "2") {
            header.value = JSON.parse(item.infos);
          }
        });
      }
    });
};
const getTeamDetail = () => {
  uni.showLoading({
    title: "加载中...",
  });
  api
    .interfaceTransfer({
      query: {
        mobile: mobile.value,
        unitCode: config.hotelGroupCode,
      },
      config: {
        interfaceType: "GET",
        interfaceModule: "GC_TRAVEL_ORDER",
        interfaceMethod: `/api/team/order/detail/${teamNo.value}`,
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        travelDetail = res.retVal.retVal;
        reserveOrder.value = travelDetail.reserveOrders[0];
        teamOrder.value = travelDetail.teamOrder;
        teamItineraries.value =
          travelDetail.teamItineraryInfos[0].teamItineraries;
        teamOrder.value.dayDiff = dayjs().diff(
          teamOrder.value.beginDate,
          "day"
        );
        teamOrder.value.dayEndDiff = dayjs(teamOrder.value.endDate).diff(
          dayjs(),
          "day"
        );
        teamItineraries.value.forEach((item: any) => {
          item.bizDateF = dayjs(teamOrder.value.beginDate)
            .add(item.dayNum - 1, "day")
            .format("M月D日");
          item.moon = dayjs(teamOrder.value.beginDate)
            .add(item.dayNum - 1, "day")
            .format("M");
          item.days = dayjs(teamOrder.value.beginDate)
            .add(item.dayNum - 1, "day")
            .format("D");
          item.teamRsvSrcs.forEach((hotel: any) => {
            hotel.arrDateF = dayjs(hotel.arrDate).format("M月D日");
            hotel.depDateF = dayjs(hotel.depDate).format("M月D日");
            hotelList.value.push(hotel);
          });
        });
        teamOrder.value.tripTime = `${dayjs(teamOrder.value.beginDate).format(
          "M月DD日"
        )}-${dayjs(teamOrder.value.endDate).format("M月DD日")}`;
        userInfo.value = travelDetail.teamItineraryInfos[0].guests.find(
          (item: any) => {
            return item.mobile == mobile.value;
          }
        );
        if (userInfo.value.authId) {
          isShowQrcode.value = true;
        } else {
          isShowQrcode.value = false;
        }
        // console.log(userInfo.value,'userInfo.value------------')
        // setStorage("teamItineraryInfos", travelDetail.teamItineraryInfos[0]);
        getHotelList();
      }
    })
    .finally(() => {
      uni.hideLoading();
    });
};
const getHotelList = () => {
  var findHotelParameter = {
    fromDate: "",
    toDate: "",
    otaChannel: "WECHAT",
    hotelGroupCodes: config.hotelGroupCode,
    cardLevel: "",
    hasPriceMin: "T",
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
    hotelCodes: hotelCode.value,
  };

  api
    .findHotel(findHotelParameter)
    .then((response: any) => {
      if (response.result == 1) {
        hotelList.value.forEach((hotel: any) => {
          response.retVal.resultInfos.forEach((n: any) => {
            if (hotel.hotelCode == n.code) {
              hotel.extraLogo = n.extraLogo;
              hotel.phone = n.phone;
              hotel.pictures = n.pictures;
              hotel.hotelLatitude = n.hotelLatitude;
              hotel.hotelLongitude = n.hotelLongitude;
            }
          });
        });
        currentHotel.value = hotelList.value.find((citem: any) => {
          return citem.hotelCode == hotelCode.value;
        });
      }
    })
    .catch(function (error: any) {
      console.log(error);
    })
    .finally(function (e: any) {
      hotelMsg.value = currentHotel.value;
      // console.log(hotelMsg.value, "hotelMsg.value-----------");
      // setStorage("currentHotel", currentHotel.value);
    });
};
const getWxacodeParams = (cb: any) => {
  if (scene.value != "") {
    var opt = {
      scene: scene.value,
      appid: config.appid,
    };
    api.getWxacodeParams(opt).then((res: any) => {
      if (res.result == 1) {
        var val = JSON.parse(res.retVal.value);
        mobile.value = val.mobile;
        teamNo.value = val.teamNo;
        hotelCode.value = val.hotelCode;
      } else {
        jAlert3(res.msg);
      }
      cb && cb();
    });
  } else {
    cb && cb();
  }
};
const getHotelSta = () => {
  api
    .interfaceTransfer({
      query: {
        teamNo: teamNo.value,
        mobile: mobile.value,
        hotelCode: hotelCode.value,
        // arr: "2023-10-12",
        arr: dayjs().format("YYYY-MM-DD"),
      },
      config: {
        interfaceType: "GET",
        interfaceModule: "GC_TRAVEL_ORDER",
        interfaceMethod: "/api/reserve/order/queryIsCheckIn",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        if (res.retVal.retVal.length > 0) {
          let checkMsg = res.retVal.retVal.find((citem: any) => {
            return citem.mobile == mobile.value;
          });
          isCheckIn.value = checkMsg.isCheckIn;
        }
      }
    });
};
onLoad((options: any) => {
  advertisementPage();
  if (options.mobile) {
    mobile.value = options.mobile;
    teamNo.value = options.teamNo;
    hotelCode.value = getStorage("checkHotelCode");
    getTeamDetail();
  }
  if (options.scene) {
    const sceneVal = decodeURIComponent(options.scene);
    scene.value = sceneVal;
  }
});
onMounted(() => {
  if (scene.value != "") {
    getWxacodeParams(() => {
      getTeamDetail();
      getHotelSta();
    });
  } else {
    getTeamDetail();
    getHotelSta();
  }
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");

.checkIn_ui {
  background: #f8f8f8;
  padding-bottom: 70px;

  .swiper-box {
    position: relative;
    width: 100%;
    height: 280px;
  }

  .header_wrap {
    padding-top: 88px;
    padding-bottom: 12px;
    background-size: contain;
    background-repeat: no-repeat;
    .title {
      height: 40px;
      line-height: 40px;
      font-size: 20px;
      font-family: Source Han Serif CN;
      font-weight: 900;
      color: #fff;
    }

    .subTitle {
      max-width: 200px;
      padding: 0 16px;
      margin-top: 6px;
      font-size: 14px;
      line-height: 22px;

      color: #fff;
      opacity: 0.8;
    }
  }

  .hotel-box {
    position: relative;
    margin: 24px 16px 0;
    border-radius: 8px;
    overflow: hidden;
    .qrcode_wrap {
      text-align: center;
      height: 234px;
      .qrcode_img {
        margin-top: 32px;
        width: 140px;
        height: 140px;
      }
      .qrcode_text {
        padding: 16px 0;
        color: #000;
        font-size: 14px;
        font-weight: bold;
        line-height: 14px;
        letter-spacing: 0px;
        text-align: center;
        font-family: PingFang SC;
      }
    }

    .userInfoList {
      background: #ffffff;
      border-radius: 8px;
      //   padding: 0 12px;
      margin-bottom: 12px;
      .userInfoItem {
        padding: 0 12px;
        height: 48px;
        display: flex;
        align-items: center;
        position: relative;
        &.big {
          height: 80px;
        }
        .userTitle {
          width: 100px;
          font-size: 14px;
          color: @tl-black;
          font-weight: bold;
        }

        .userInfoTitle {
          width: 100px;
          font-size: 14px;
          color: @tl-black;
        }
        .userInfoDesc {
          font-size: 14px;
          color: rgba(128, 128, 128, 1);
          flex: 1;
          display: flex;
          align-items: center;
          height: 100%;
          input {
            flex: 1;
          }
          .btn_yanzheng {
            border-radius: 4px;
            font-size: 12px;
            color: #000;
            padding: 8px 12px;
            border: 1px solid #000;
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
      .botbom {
        border-bottom: 1px solid #eeeeee;
      }
    }
    .form_tip {
      display: flex;
      margin: 12px auto 16px auto;
      font-family: PingFang SC;
      font-size: 12px;
      font-weight: 400;
      line-height: 14px;
      letter-spacing: 0px;
      text-align: justified;
      color: #808080;
      align-items: center;
      .phone {
        display: flex;
        align-items: center;
        color: #000;
        margin-left: 4px;
        font-size: 12px;
      }
      .icon_more {
        margin-right: 4px;
      }
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
      margin-right: 12px;
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      border-radius: 4px;
      color: #000;
      font-size: 16px;
      height: 48px;
      border: 2px solid #000;
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
}
</style>
