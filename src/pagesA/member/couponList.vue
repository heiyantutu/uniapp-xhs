<template>
  <div class="ui_couponList">
    <!-- #ifdef MP -->
    <coustom-head title="券包" nativeMode=true>
    </coustom-head>
    <!-- #endif -->
    <banner-swiper showLocation="7" :adBoxStyle="adBoxStyle"></banner-swiper>
    <div class="switchBox">
      <switch-bar :switchList="switchList" @changeIndex="changeIndex" padding=16></switch-bar>
    </div>
    <div class="listBox">
      <div class="listItem couponTrack" v-for="(coupon, index) in couponList" :key="index"
        :data-tracker-params="JSON.stringify(coupon.trackInfo)">
        <coupon-item :couponItem="coupon" @chooseCoupon="chooseCoupon" showBtn=true></coupon-item>
      </div>
    </div>
    <empty tips="暂无券包" v-if="couponList.length==0&&isEnd"></empty>
    <div class="historyBtn" v-if="isEnd" @click="goCouponHistory">
      查看历史券包
    </div>
    <bottom-btn @click="scan">
      扫码领券
    </bottom-btn>
  </div>
  <kf-dialog ref="kf" title="一键咨询"></kf-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import api from "@/utils/api";
import switchBar from "@/components/switchBar.vue";
import couponItem from "@/components/couponItem.vue";
import { getStorage, setStorage } from "@/utils/wxuser";
import { onReachBottom,onPageScroll } from "@dcloudio/uni-app";
import { goPage, refreshMemberInfo } from "@/utils/utils";
import empty from "@/components/empty.vue";
import kfDialog from "@/components/kfDialog.vue";
import bannerSwiper from "@/components/bannerSwiper.vue";
import bottomBtn from "@/components/bottomBtn.vue";
import useScanCoupon from "@/hooks/useScanCoupon";
import UmengSDK from "@/utils/umengAdaptor.js";
import coustomHead from "@/components/coustomHead.vue";

interface switchItem {
  name: string;
  active: boolean;
  groupCode: String;
  groupName: String;
}

let config = getStorage("config");
let user = getStorage("user");
let switchList = ref<switchItem[]>([]);
let groupCode = ref<String>("");
let firstResult = ref(0);
let pageSize = ref(15);
let isAjax = ref(false);
let sta = ref("I");
let kf =ref();
let couponList = ref([]);
let isEnd = ref(false);
let adBoxStyle = ref("padding: 16px;background:#fff");
let activeIndex = ref(0);

const { scanCode, bindCoupon } = useScanCoupon();
const scan = () => {
  scanCode().then((res) => {
    bindCoupon(res).then((res) => {
      getCouponType();
      getNewCouponList();
      refreshMemberInfo();
    });
  });
};
const goCouponHistory = () => {
  UmengSDK.sendEvent("cpp_coupon_clk", {
    button_name: "查看历史券包",
  });
  goPage("/pagesA/member/couponHistory");
};
const getCouponType = (cb?: Function) => {
  api
    .interfaceTransfer({
      config: {
        interfaceType: "GET",
        interfaceModule: "",
        interfaceMethod: "api/coupon/listCouponGroupCountByMemberId",
        interfaceFrom: "coupon",
        hotelGroupCode: config.hotelGroupCode,
      },
      query: {
        hotelGroupCode: config.hotelGroupCode,
        memberId: user.memberId,
        couponCode: "",
        sta: "I",
        couponType: "",
        discountType: "",
        withoutPackage: true,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        let switchListNew: switchItem[] = [];
        res.retVal.retVal.forEach((n: any, i: number) => {
          switchListNew.push({
            name: `${n.groupName}(${n.number})`,
            active: i == activeIndex.value ? true : false,
            groupCode: n.groupCode == "ALL" ? "" : n.groupCode,
            groupName: n.groupName,
          });
        });
        switchList.value = switchListNew;
      }
      cb && cb();
      console.log(res);
    });
};
const listCouponWithHistoryByCardNo = () => {
  if (isAjax.value) {
    return false;
  }
  isAjax.value = true;
  api
    .listCouponWithHistoryByCardNo({
      ownMemberId: user.memberId || "",
      sta: sta.value,
      hotelGroupId: config.hotelGroupId,
      hotelGroupCode: config.hotelGroupCode,
      firstResult: firstResult.value,
      pageSize: pageSize.value,
      hotelCode: config.hotelCode,
      beginDatetime: "",
      endDatetime: "",
      ownMobile: "",
      salesChannel: "",
      salesHotelCode: "",
      saleType: "",
      isFromGift: "F",
      groupCode: groupCode.value,
    })
    .then((res: any) => {
      isAjax.value = false;
      if (res.result == 1) {
        firstResult.value = firstResult.value + pageSize.value;
        for (var i = 0; i < res.retVal.datas.length; i++) {
          if (
            res.retVal.datas[i].discountType == "MZ" ||
            res.retVal.datas[i].discountType == "LZ"
          ) {
            res.retVal.datas[i].couponType = "RF";
            let discount: any = (
              Number(res.retVal.datas[i].discountNum) * 10
            ).toFixed(1);
            if (discount - parseInt(discount) > 0) {
            } else {
              discount = Number(discount).toFixed(0);
            }
            res.retVal.datas[i].discountNum = discount;
          }
          res.retVal.datas[i].trackInfo = {
            coupon_name: res.retVal.datas[i].descript,
            coupon_type: res.retVal.datas[i].groupName,
            price: Number(res.retVal.datas[i].discountNum),
          };
        }
        couponList.value = couponList.value.concat(res.retVal.datas);
        if (couponList.value.length >= res.retVal.totalRows) {
          isEnd.value = true;
        }
      } else {
      }
    });
};
const changeIndex = (index: number) => {
  switchList.value.forEach((n) => {
    n.active = false;
  });
  switchList.value[index].active = true;
  groupCode.value = switchList.value[index].groupCode;
  activeIndex.value = index;
  UmengSDK.sendPV({
    top_type_name: switchList.value[index].groupName,
    page_name: "coupon_package_pg",
  });
  getNewCouponList();
};
const getNewCouponList = () => {
  isEnd.value = false;
  couponList.value = [];
  firstResult.value = 0;
  listCouponWithHistoryByCardNo();
};
const goExchange =(item:any,isToExchangeBtn:string)=>{
  api.interfaceTransfer({
    query: {
      "hotelGroupCode": config.hotelGroupCode,
      "couponNo": item.no,
      "channel": "WECHAT"

    },
    config: {
      "interfaceType": "POST",
      "interfaceModule": "",
      "interfaceMethod": "/api/coupon/listCouponCodeUseConfigProductByCouponNo",
      "interfaceFrom": "coupon",
      "hotelGroupCode": config.hotelGroupCode
    }
  })
  .then((res : any) => {
    if (res.result == 1 && res.retVal.result == 0) {
      let hasCustom = false;
      let travelGroupCodes: any = []
      let travelTypes:any= []
      let itineraryCodes:any= []
      let categorySubs:any= []
      
      let couponCodeUseConfigProductDtoList = res.retVal.retVal
      couponCodeUseConfigProductDtoList.forEach((productDtoList:any) => {
          if(productDtoList.orderType =="Custom"){
            hasCustom = true
          }
         
           if(item.type=='4'){
                travelGroupCodes.push(productDtoList.productCode)
            }
            if(item.type=='3'){
                itineraryCodes.push(productDtoList.productCode)
            }
            if(item.type=='2'){
              if(productDtoList.productPrimaryClassification!='Custom'){
                  categorySubs.push(productDtoList.productPrimaryClassification)
              }
               
            }
            if(item.type=='1'){
                travelTypes.push(productDtoList.productCode)
            }
         
      });
       var opt: any = {
        unitCode: config.hotelGroupCode,
        hotelGroupCode: config.hotelGroupCode,
      };
      if(itineraryCodes.length>0){
          opt.itineraryCodes = itineraryCodes
      }
      if(travelTypes.length>0){
          opt.travelTypes = travelTypes
      }
      if(categorySubs.length>0){
          opt.categorySubs = categorySubs
      }
      if(travelGroupCodes.length>0){
          opt.travelGroupCodes = travelGroupCodes
      }
      if(hasCustom){
         api.interfaceTransfer({
            query: opt,
            config: {
              "interfaceType": "POST",
              "interfaceModule": "GC_PRODUCT_JOURNEY",
              "interfaceMethod": "/api/travelGroup/listTravelProductForWechatTdq",
              "interfaceFrom": "GC",
              "hotelGroupCode": config.hotelGroupCode
            }
          })
        .then((res : any) => {
          if (res.result == 1 && res.retVal.result == 0) {
            if(res.retVal.retVal.length>0){
              if(isToExchangeBtn=='T'){
                goPage(`/pagesB/exchangeCoupon/exchangeList?couponNo=${item.no}`);
              }else{
                setStorage("coupon", item);
                uni.navigateTo({
                  url: `/pagesA/member/couponInfo?couponNo=${item.no}`,
                });
              }
               
            }else{
               kf.value.showDialog();
            }
          }
        })
       
      }else if(isToExchangeBtn=='T'){
        goPage(`/pagesB/exchangeCoupon/exchangeList?couponNo=${item.no}`);
      }else{
        setStorage("coupon", item);
        uni.navigateTo({
          url: `/pagesA/member/couponInfo?couponNo=${item.no}`,
        });
       
      }

    }
  });
  
}
const chooseCoupon = (data: any,isToExchangeBtn:string) => {
  UmengSDK.sendEvent("cpp_coupon_clk", {
    coupon_type: data.groupName,
    price: Number(data.discountNum),
    button_name: data.descript,
  });
  if(data.groupCode=='EXCHANGECOUPON'){
    goExchange(data,isToExchangeBtn)
  }else{
    setStorage("coupon", data);
    uni.navigateTo({
      url: `/pagesA/member/couponInfo?couponNo=${data.couponNo}`,
    });
  }

  console.log(data);
};
onReachBottom(() => {
  listCouponWithHistoryByCardNo();
});
onMounted(() => {
  UmengSDK.sendPV({
    top_type_name: "全部",
    page_name: "coupon_package_pg",
  });
  getCouponType(() => {
    listCouponWithHistoryByCardNo();
  });
});
</script>

<style lang="less" scoped>
@import (reference) url("~@/styles/mixin.less");

.ui_couponList {
  padding-bottom: 200px;
  .switchBox {
    background: #ffffff;
  }
  .listBox {
    padding: 16px;
    padding-bottom:0px;
    .listItem {
      margin-bottom: 12px;
    }
  }
  .historyBtn {
    font-size: 14px;
    color: #000000;
    .halfPixel(20px);
    height: 38px;
    width: 136px;
    text-align: center;
    line-height: 38px;
    border-radius: 20px;
    margin: 0 auto;
    margin-top: 24px;
  }
}
</style>
