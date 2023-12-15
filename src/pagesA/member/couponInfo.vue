<template>
  <div class="ui_couponInfo" v-show="isShow">
    <coustom-head :title="title" :color="titleColor"></coustom-head>
    <div class="couponItemBox" :style="{ 'max-height': maxHeight,'top':topPosition }">
      <div class="topBox" id="topBox">
        <div class="couponType" :class="coupon.groupCode" v-if="coupon.groupName">{{coupon.groupName}}</div>
        <p class="couponName">{{coupon.descript}}</p>
        <p class="couponSubTitle" @click="copyNo">券号：{{coupon.no}} <i class="icon iconfont icon-a-12_fuzhi"></i>
        </p>
        <p class="couponSubTitle" v-if="coupon.beginDatetime&&coupon.endDatetime">
          有效期：{{timeDay2(coupon.beginDatetime)}}
          至 {{timeDay2(coupon.endDatetime)}} </p>
        <p class="couponPrice"
          v-if="(coupon.couponType =='DF'||coupon.couponType =='FR'||coupon.couponType =='CP')&&coupon.discountNum>0">
          ¥{{coupon.discountNum}}</p>
        <p class="couponPrice" v-if="coupon.couponType =='RF'&&coupon.discountNum>0">{{coupon.discountNum}}折</p>
        <p class="useLimit" v-if="coupon.discountPriceBegin>0">满 ¥{{coupon.discountPriceBegin}} 使用</p>
      </div>
      <div class="exchangeCoupon qrCodeBox" v-if="coupon.groupCode=='EXCHANGECOUPON'">
        <div class="couponNo">
          <div class="no">{{coupon.no}}</div>
          <div class="iconfont icon-a-12_fuzhi" @click="copy(coupon.no)"></div>
        </div>
        <div class="travelersInfo" v-if="productDtoList.length>0">
          <div class="tl">可兑产品（限兑1个产品）</div>
          <template v-for="(item,i) in productDtoList" :key="i">
            <div class="travelersInfo-item"
              @click="goPage('/pagesB/travel/travelDetail?travelType='+item.travelType+'&couponNo='+coupon.no)"
              v-if="moreExchange=='F'?i<5:i>=0">
              <div class="val">
                <div class="val-txt">{{item.title}}</div><i class="iconfont icon-a-12_youlajiantou_hui"></i>
              </div>
            </div>
          </template>
          <div class="open-btn" v-if="productDtoList.length>5&&moreExchange=='F'" @click="showExchange">
            展开更多<i class="iconfont icon-a-12_xialajiantou_hei"></i>
          </div>
          <div class="open-btn" v-else-if="moreExchange=='T'" @click="showExchange">收起更多<i
              class="iconfont icon-a-12_shanglajiantou_hei"></i></div>

        </div>

      </div>
      <div class="qrCodeBox" v-else-if="!isOnLine">
        <img :src="qrcodeUrl" alt="" class='qrCode' v-if="qrcodeUrl">
        <img :src="barcodeUrl" alt="" class="barcode" v-if="barcodeUrl">
      </div>
      <div class="bottomBox">
        <p class="ruleTitle">使用规则</p>
        <mp-html :content="coupon.introduction" class="ruleInfo" :container-style="containerStyle"></mp-html>
      </div>
      <div class="exchangeBtn" v-if="coupon.groupCode=='EXCHANGECOUPON'&&productDtoList.length>0">
        <div class="btn baseBtn" 
          @click="goPage(`/pagesB/exchangeCoupon/exchangeList?couponNo=${coupon.no}`)">
          去兑换
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, nextTick } from "vue";
import api from "@/utils/api";
import coustomHead from "@/components/coustomHead.vue";
import { getStorage } from "@/utils/wxuser";
import { setClipboardData } from "@/utils/platform";
import { timeDay2 } from "@/utils/filter";
import { getBoundingClientRect, goPage, getReallyPx } from "@/utils/utils";
import { jAlert3 } from "@/base/jAlert/jAlert";

let config = getStorage("config");
let title = ref("券包详情");
let titleColor = ref("#fff");
let moreExchange = ref("F");
let containerStyle = ref("");
let isOnLine = ref(false);
let coupon = getStorage("coupon");
let maxHeight = ref("100%");
let topPosition = ref("60px");
let isShow = ref(false);
let couponCodeUseConfigProductDtoList = ref([]);
let travelList = ref([]);
let productDtoList:any = ref([]);

const copy = (val: string) => {
  setClipboardData({
    data: val,
  });
};
const findCouponDetailByCouponNo = () => {
  api
    .interfaceTransfer({
      query: {
        hotelGroupCode: config.hotelGroupCode,
        couponNo: coupon.no,
        channel: "WECHAT",
      },
      config: {
        interfaceType: "POST",
        interfaceModule: "",
        interfaceMethod: "/api/coupon/listCouponCodeUseConfigProductByCouponNo",
        interfaceFrom: "coupon",
        hotelGroupCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        let productDtoList = res.retVal.retVal;

        couponCodeUseConfigProductDtoList.value = productDtoList;
        travelProductList();
      }
    });
};
const showExchange= () => {
	moreExchange.value=='T'?moreExchange.value='F':moreExchange.value='T'
	getRuleHeight()
}
const getRuleHeight = () => {
    nextTick(() => {
      uni.getSystemInfo({
        success: (res: any) => {
          maxHeight.value =
            res.windowHeight - res.statusBarHeight - getReallyPx(70 + 40) + "px";
          topPosition.value = res.statusBarHeight + getReallyPx(44 + 40) + "px";
          isShow.value = true;
          nextTick(() => {
            
            Promise.all([
              getBoundingClientRect(".couponItemBox"),
              getBoundingClientRect("#topBox"),
              getBoundingClientRect(".qrCodeBox"),
              getBoundingClientRect(".exchangeBtn"),
            ]).then((res: any) => {
              console.log(res)
              let couponItemBox = res[0].height;
              let topBox = res[1].height;
              let qrCodeBox = res[2].height;
              let exchangeBtn = 0
              if(res[3]&&res[3].height){
                exchangeBtn = res[3].height;
              }
              
              let cssHeight =
                Number(maxHeight.value.split("px")[0]) -
                getReallyPx(35 + 30 + 20) -
                topBox -
                qrCodeBox -exchangeBtn;
              let cssRule = `max-height: ${cssHeight}px;overflow-y: scroll;`;
              containerStyle.value = cssRule;
              console.log("res", res, cssRule);
          });
        });
      },
      fail(err) {
        console.log(err);
      },
    });
  });
}
const travelProductList = () => {
  productDtoList.value = [];
  let travelGroupCodes: any = []
  let travelTypes:any= []
  let itineraryCodes:any= []
  let categorySubs:any= [] 
  var opt: any = {
    unitCode: config.hotelGroupCode,
    hotelGroupCode: config.hotelGroupCode,
  };
  
  couponCodeUseConfigProductDtoList.value.forEach((item: any) => {
    if(item.type=='4'){
      travelGroupCodes.push(item.productCode)
    }
    if(item.type=='3'){
      itineraryCodes.push(item.productCode)
    }
    if(item.type=='1'){
      travelTypes.push(item.productCode)
    }
    if(item.type=='2'){
      if(item.productPrimaryClassification!='Custom'){
        categorySubs.push(item.productPrimaryClassification)
      }
    }
  });
  if(categorySubs.length>0){
    opt.categorySubs = categorySubs
   }
   if(itineraryCodes.length>0){
   	opt.itineraryCodes = itineraryCodes
   }
   if(travelTypes.length>0){
   	opt.travelTypes = travelTypes
   }
   if(travelGroupCodes.length>0){
   	opt.travelGroupCodes = travelGroupCodes
   }
  

  api
    .interfaceTransfer({
      query: opt,
      config: {
        interfaceType: "POST",
        interfaceModule: "GC_PRODUCT_JOURNEY",
        interfaceMethod: "/api/travelGroup/listTravelProductForWechatTdq",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        let productList = res.retVal.retVal
        productList.forEach((item: any) => {
        	item.couponNo = coupon.no
        	
        	productDtoList.value.push(item)
        })
      }
      getRuleHeight()
    });
};
onMounted(() => {
  if (coupon.suitCashierPoint) {
    let suitCashierPointList = coupon.suitCashierPoint.split(",");
    let onLineCashierPointList = suitCashierPointList.filter((n) => {
      return n.indexOf("WEB") > -1 || n.indexOf("SC") > -1;
    });
    console.log(suitCashierPointList, onLineCashierPointList);
    if (suitCashierPointList.length == onLineCashierPointList.length) {
      isOnLine.value = true;
    }
  }
  if (coupon.groupCode == "EXCHANGECOUPON") {
    findCouponDetailByCouponNo();
  }else{
    getRuleHeight()
  }
  
     

 
});

const copyNo = () => {
  setClipboardData({
    data: coupon.no,
  });
};
let qrcodeUrl = ref(
  `https://api.wx.gcihotel.net/api/member/textQrcode.json?code=${coupon.no}`
);
let barcodeUrl = ref(
  `https://api.wx.gcihotel.net/api/member/textOneQrcode.json?code=${coupon.no}`
);
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");

.ui_couponInfo {
  position: relative;
  height: 100vh;
  width: 100%;
  background-image: url("https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/couponBg.jpg");
  background-size: 100% 100%;
  min-height: 100vh;

  .couponBg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    pointer-events: none;
    z-index: -1;
  }

  .couponItemBox {
    padding: 16px;
    //max-height: 80vh;
    //max-height: 604px;
    background: #fff;
    width: 327px;
    border-radius: 12px;
    margin: auto;
    position: absolute;
    left: calc(~"(100% - 327px) / 2");
    top: 0;

    .exchangeCoupon {

      padding-top: 16px;

      .couponNo {
        display: flex;
        align-items: center;
        background: #f8f8f8;
        justify-content: center;
        padding: 16px 0;
        border-radius: 12px;

        .tag {
          margin-right: 8px;
          font-size: 12px;
          color: #808080;
        }

        .no {
          color: #000;
          font-size: 16px;
          font-family: Montserrat;
          font-weight: 400;
        }

        .iconfont {
          margin-left: 4px;
          font-size: 12px;
          color: #000;
        }
      }
    }

    .travelersInfo {
      padding: 16px 0 0px;

      .tl {
        display: flex;
        font-style: normal;
        font-weight: bold;
        color: #000000;

        line-height: 18px;
        font-size: 12px;
      }

      .open-btn {
        margin-top: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #808080;
        font-size: 12px;

        .icon-a-12_xialajiantou_hei,
        .icon-a-12_shanglajiantou_hei {
          margin-left: 5px;
          font-size: 13px;
        }
      }

      .travelersInfo-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0 0;

        .label {
          font-size: 12px;
          color: #808080;
          line-height: 1;
          white-space: nowrap;
          margin-right: 50px;
        }

        .val {
          display: flex;
          align-items: center;
          font-size: 12px;
          line-height: 20px;
          text-align: left;
          color: #000000;
          .val-txt {
            flex: 1;
            overflow: hidden;
            height: 20px;
            line-height: 20px;
          }

          .icon-a-12_youlajiantou_hui {
            font-size: 12px;

            margin-left: 5px;
          }

          &.price {
            font-family: "Montserrat";
            font-weight: 600;
            font-size: 16px;
          }

          &.red {
            color: #a43127;
          }

          .icon-a-12_fuzhi {
            margin-left: 5px;
          }
        }
      }
    }

    .qrCodeBox {
      text-align: center;

      .qrCode {
        width: 180px;
        height: 180px;
      }

      .barcode {
        width: 100%;
        height: 64px;
      }
    }

    .topBox {
      .couponType {
        background: rgba(219, 137, 0, 0.12);
        border-radius: 4px;
        font-size: 12px;
        color: #db8900;
        padding: 4px;
        display: inline-block;
        margin-bottom: 16px;

        &.GIFTCOUPON {
          background: rgba(164, 49, 39, 0.12);
          color: #a43127;
        }

        &.EXPERIENCECOUPON {
          background: rgba(0, 67, 85, 0.12);
          color: #004355;
        }

        &.EXCHANGECOUPON {
          background: #000;
          color: #fff;
        }
      }

      .couponName {
        font-size: 16px;
        color: #000000;
        font-weight: bold;
        margin-bottom: 10px;
      }

      .couponSubTitle {
        font-size: 12px;
        color: #808080;
        margin-bottom: 8px;
        display: flex;
        align-items: center;

        .iconfont {
          font-size: 12px;
          margin-left: 5px;
        }
      }

      .couponPrice {
        font-size: 24px;
        color: #a43127;
        font-weight: bold;
        margin-top: 15px;
        font-family: Montserrat;
      }

      .useLimit {
        font-size: 12px;
        color: #808080;
        margin-top: 7px;
      }
    }

    .bottomBox {
      .ruleTitle {
        font-size: 12px;
        color: #000000;
        font-weight: bold;
        margin-bottom: 8px;
        margin-top: 15px;
      }

      .ruleInfo {
        font-size: 12px;
        color: #808080;
        line-height: 18px;
      }
    }
  }
  .exchangeBtn{
    padding-top: 20px;
  }
  .btn {
    
    line-height: 48px;
    height: 48px;
  }
}
</style>