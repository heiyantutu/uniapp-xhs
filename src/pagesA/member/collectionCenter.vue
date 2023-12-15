<template>
  <div class="ui_collectionCenter">
    <coustom-head
      title="领券中心"
      color="#fff"
      position="absolute"
      nativeMode
    ></coustom-head>
    <div class="collect_list" v-for="(item, index) in pageData" :key="index">
      <div class="list_item">
        <div>
          <!-- groupCode
          消费券：consumerCoupon
          礼品券：giftCoupon
          体验券：experienceCoupon
          通兑券：exchangeCoupon -->
          <span class="item_name" v-if="item.groupCode == 'GIFTCOUPON'"
            >礼品券</span
          >
          <span class="spend_name" v-if="item.groupCode == 'CONSUMERCOUPON'"
            >消费券</span
          >
          <span class="tiyan_name" v-if="item.groupCode == 'EXPERIENCECOUPON'"
            >体验券</span
          >
          <span class="tdq_name" v-if="item.groupCode == 'EXCHANGECOUPON'"
            >通兑券</span
          >
        </div>
        <div class="item_main">
          <div class="item_left">
            <div
              class="item_title"
              :style="{ 'margin-top': item.groupCode ? '20px' : '0' }"
            >
              {{ item.name }}
            </div>
            <div class="title_in">{{ item.secondName }}</div>
            <div v-if="item.couponTypeName" class="money_num">
              {{
                item.discountType == "MZ" || item.discountType == "LZ"
                  ? `${item.presentValue * 10 || 0}折`
                  : `￥${item.presentValue}`
              }}
            </div>
          </div>
          <!-- 点击有弹框的券不判断stock 直接显示已领取-->
          <div
            class="right"
            v-if="
              item.ruleType === 'memberConsume' ||
              item.ruleType === 'memberRegister' ||
              item.ruleType === 'member' ||
              item.ruleType === 'orderPendding'
            "
          >
            <div class="item_right" @click.stop="receive(item)">立即领取</div>
          </div>
          <div
            class="right"
            v-else-if="
              item.canReceived == 'T' &&
              item.stock != 0 &&
              (item.discountType != 'KXQQ' ||
                (item.discountType == 'KXQQ' && user.isRealName == 'T'))
            "
          >
            <div class="item_right" @click.stop="receive(item)">立即领取</div>
          </div>
          <div
            class="item_right"
            v-else-if="item.discountType == 'KXQQ' && user.isRealName != 'T'"
            @click.stop="receive(item)"
          >
            实名后领取
          </div>
          <div class="item_right-done" v-else>
            已领{{ item.canReceived == "T" ? "取" : "完" }}
          </div>
        </div>
      </div>
    </div>
    <empty
      tips="暂无可领券"
      subTips="松赞，期待与您相遇。"
      v-if="pageData.length == 0 && !isAjax"
    ></empty>
    <div class="receive-layer" v-if="showGet">
      <div class="receive-box">
        <div class="head">
          {{ `${couponListName}${totalNum}选${selectNum}` }}
          <i class="iconfont icon-a-20_guanbi" @click="hideDialog"></i>
        </div>
        <div class="receive_mian">
          <div
            class="mian_list"
            v-for="(item, index) in couponList"
            :key="index"
            @click="onCheck(item)"
          >
            <div>
              <div class="main_title">
                {{ item.descript }}
              </div>
              <div class="main_text" v-if="item.introduction">
                <div v-html="item.introduction"></div>
                <!-- {{ item.introduction }} -->
              </div>
              <div class="main_title" v-if="item.type == 'POINT'">
                {{ item.rewardValue }}积分
              </div>
            </div>
            <div
              class="main_right"
              v-if="selectNum != checkArr.length || item.check"
            >
              <i class="icon-danxuan_weixuan iconfont" v-if="!item.check"></i>
              <i
                style="color: #a43127"
                class="icon-danxuan_yixuan iconfont"
                v-if="item.check"
              ></i>
            </div>
          </div>
        </div>
        <div v-if="selectNum == checkArr.length" class="btn" @click="confirm">
          确认领取
        </div>
      </div>
      <div class="bg"></div>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  ref,
  computed,
  watch,
  onMounted,
} from "vue";
import api from "@/utils/api";
import coustomHead from "@/components/coustomHead.vue";
import empty from "@/components/empty.vue";
import { getStorage } from "@/utils/wxuser";
import { jAlert3 } from "@/base/jAlert/jAlert";
import { goPageWithUser, toLogin, addNum, subtraction } from "@/utils/utils";

export default defineComponent({
  name: "collectionCenter",
  props: {
    title: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  components: {
    empty,
  },
  setup() {
    let config = getStorage("config");
    let user = getStorage("user");
    let showGet = ref(false);
    let pageData = ref([]);
    let couponList = ref([]);
    let selectNum = ref(0);
    let totalNum = ref(0);
    let isAjax = ref(true);
    let couponListName = ref("");
    let checkArr = ref([]);
    const showDialog = () => {
      showGet.value = true;
    };
    const hideDialog = () => {
      showGet.value = false;
    };
    const getData = (isInit = false) => {
      if (isInit) {
        uni.showLoading({
          title: "加载中...",
        });
      }
      const obj = {
        hotelGroupCode: config.hotelGroupCode,
        hotelCode: config.hotelCode,
        memberId: user.memberId,
        cardLevel: user.cardLevel,
      };
      api.getCanReceivedListNew(obj).then((res) => {
        console.log(res);
        if (res.result == 1) {
          res.retVal.forEach((item) => (item.check = false));
          pageData.value = res.retVal;
          isAjax.value = false;
          uni.hideLoading();
        } else {
          jAlert3(res.msg);
          uni.hideLoading();
        }
      });
    };
    const receive = (item) => {
      console.log(config, "config");
      console.log(user, "user");
      console.log(item, "item");
      if (user.isRealName !== "T" && item.discountType == "KXQQ") {
        jAlert3("请在完成实名后领取！");
        setTimeout(() => {
          goPageWithUser(`/pagesA/member/memberAuth?from=colletion`);
        }, 1500);
        return;
      }
      if (
        (item.ruleType === "memberConsume" ||
          item.ruleType === "memberRegister" ||
          item.ruleType === "member" ||
          item.ruleType === "orderPendding") &&
        item.memberType[0]
      ) {
        couponList.value = item.memberType[0].runRecordDetailDtoList;
        selectNum.value = item.memberType[0].selectedNum;
        couponListName.value = item.memberType[0].promotionName;
        totalNum.value = item.memberType[0].totalNum;
        showDialog();
        console.log(couponList);
      } else {
        const obj = {
          hotelGroupCode: config.hotelGroupCode,
          hotelGroupCodes: config.hotelGroupCode,
          hotelCode: config.hotelCode,
          memberId: user.memberId,
          couponCode: item.couponCode,
          couponType: item.couponType,
          mobile: user.mobile,
          cardId: user.cardId,
          cardNo: user.cardNo,
          appid: config.appid,
          hotelId: config.hotelId,
          hotelGroupId: config.hotelGroupId,
          cardLevel: user.cardLevel,
        };
        api.receiveSCCouponNewTransfer(obj).then((res) => {
          console.log(res, "领取接口");
          if (res.result == 1) {
            jAlert3("领取成功");
            getData();
            hideDialog();
          } else {
            jAlert3(res.msg);
          }
        });
      }
    };
    const confirm = () => {
      let arr = [];
      let rewardValue = [];
      let treatMoney = [];
      let treatPoint = [];
      arr = couponList.value.filter((item) => {
        return item.check;
      });
      checkArr.value = arr;
      // .map((utem) => {
      //   return utem.rewardValue;
      // });
      // arr.forEach((item) => {
      //   if (item.type == "MIX") {
      //     item.runRecordDetailDtoList.forEach((utem) => {
      //       if (utem.type == "COUPON") {
      //         rewardValue.push(utem.rewardValue);
      //       } else if (utem.type == "ACCOUNT") {
      //         treatMoney.push(utem.rewardValue);
      //       } else if (utem.type == "POINT") {
      //         treatPoint.push(utem.rewardValue);
      //       }
      //     });
      //   } else {
      //     rewardValue.push(item.rewardValue);
      //   }
      // });
      arr.forEach((item) => {
        if (item.type == "COUPON") {
          rewardValue.push(item.rewardValue);
        } else if (item.type == "ACCOUNT") {
          treatMoney.push(item.rewardValue);
        } else if (item.type == "POINT") {
          treatPoint.push(item.rewardValue);
        } else {
          rewardValue.push(item.rewardValue);
        }
      });
      console.log(couponList.value);
      console.log(arr);
      let length = arr.length;
      if (length != selectNum.value * 1) {
        jAlert3(`所选项数量应为${selectNum.value}项！`);
        return;
      }
      let promotionCode = couponList.value[0].promotionCode;
      let promotionNo = couponList.value[0].promotionNo;
      let type = couponList.value[0].type;
      const obj = {
        hotelGroupCode: config.hotelGroupCode,
        rewardValue: rewardValue.length ? rewardValue.join(",") : "",
        treatMoney: treatMoney.length ? treatMoney.join(",") : "",
        treatPoint: treatPoint.length ? treatPoint.join(",") : "",
        promotionCode,
        promotionNo,
        couponCode: "",
        hotelCode: config.hotelCode,
        memberId: user.memberId,
        mobile: user.mobile,
        cardId: user.cardId,
        cardNo: user.cardNo,
        appid: config.appid,
        hotelId: config.hotelId,
        hotelGroupId: config.hotelGroupId,
        cardLevel: user.cardLevel,
      };
      api.receiveSCCouponNewTransfer(obj).then((res) => {
        if (res.result == 1) {
          jAlert3("领取成功！");
          getData();
          hideDialog();
        } else {
          jAlert3(res.msg);
        }
      });
    };
    const onCheck = (item) => {
      if (!item.check && selectNum.value == checkArr.value.length) return;
      item.check = !item.check;
      let arr = [];
      arr = couponList.value.filter((item) => {
        return item.check;
      });
      checkArr.value = arr;
      console.log(checkArr.value, "checkArr.value");
    };
    onMounted(() => {
      getData(true);
    });
    return {
      showGet,
      pageData,
      selectNum,
      totalNum,
      couponList,
      couponListName,
      user,
      receive,
      onCheck,
      checkArr,
      showDialog,
      hideDialog,
      confirm,
      isAjax,
      empty,
    };
  },
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import (reference) url("~@/styles/mixin.less");
.ui_collectionCenter {
  padding: 16px;
  .collect_list {
    position: relative;
    border-radius: 8px;
    // height: 108px;
    background: #ffffff;
    margin: 0 auto;
    margin-bottom: 12px;
    &::before {
      content: "";
      width: 20px;
      height: 20px;
      background: rgba(248, 248, 248, 1);
      border-radius: 50%;
      position: absolute;
      top: 50%;
      margin-top: -10px;
      left: -10px;
    }
    &::after {
      content: "";
      width: 20px;
      height: 20px;
      background: rgba(248, 248, 248, 1);
      border-radius: 50%;
      position: absolute;
      top: 50%;
      margin-top: -10px;
      right: -10px;
    }
    .list_item {
      padding: 16px;
      .item_name {
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
        letter-spacing: 0px;
        text-align: left;
        color: #a43127;
        background: #a431271f;
        border-radius: 4px;
        padding: 4px;
      }
      .spend_name {
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
        letter-spacing: 0px;
        text-align: left;
        color: #db8900;
        background: #db89001f;
        border-radius: 4px;
        padding: 4px;
      }
      .tdq_name {
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
        letter-spacing: 0px;
        text-align: left;
        color: #fff;
        background: #000;
        border-radius: 4px;
        padding: 4px;
      }
      .tiyan_name {
        font-size: 12px;
        font-weight: 400;
        line-height: 12px;
        letter-spacing: 0px;
        text-align: left;
        color: #004355;
        background: rgba(0, 67, 85, 0.12);
        border-radius: 4px;
        padding: 4px;
      }
      .item_main {
        display: flex;
        align-items: flex-end;
        .item_left {
          margin-right: 10px;
          flex: 1;
        }
        .item_title {
          margin: 16px auto 12px auto;
          color: #000;
          font-size: 16px;
          font-weight: 500;
          line-height: 16px;
          letter-spacing: 0px;
          text-align: left;
        }
        .title_in {
          color: #808080;
          font-size: 12px;
          font-weight: 400;
          line-height: 12px;
          letter-spacing: 0px;
          text-align: left;
          padding-bottom: 16px;
        }
        .money_num {
          font-size: 24px;
          font-weight: 600;
          line-height: 24px;
          letter-spacing: 0px;
          text-align: left;
          color: #a43127;
        }
        .right {
        }
        .item_right {
          margin-left: auto;
          min-width: 80px;
          height: 30px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 400;
          line-height: 30px;
          letter-spacing: 0px;
          text-align: center;
          color: #ffffff;
          background: #000;
          background-image: url(https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/btnBlack.png);
          background-repeat: repeat;
          background-size: 40px 37.5px;
          border-radius: 4px;
          white-space: nowrap;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .item_right-done {
          margin-left: auto;
          min-width: 80px;
          height: 30px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 400;
          line-height: 30px;
          letter-spacing: 0px;
          text-align: center;
          color: #cccccc;
          background: #eeeeee;
          white-space: nowrap;
          display: flex;
          align-items: center;
          padding: 8px 19px;
        }
      }
    }
  }
  .receive-layer {
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
    }

    .receive-box {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      border-radius: 16px 16px 0 0;
      background: #f8f8f8;
      z-index: 2;
      height: calc(100% - 70px);
      overflow-y: auto;

      .head {
        position: relative;
        display: flex;
        justify-content: center;
        font-weight: 600;
        font-size: 18px;
        padding: 19px 0;
        background: #fff;
        border-bottom: 0px solid #eeeeee;

        .icon-a-20_guanbi {
          position: absolute;
          left: 14px;
          top: 19px;
          font-size: 20px;
        }
      }
      .receive_mian {
        margin: 16px;

        .mian_list {
          padding: 16px 12px;
          margin-bottom: 12px;
          border-radius: 8px;
          background: #fff;
          display: flex;
          align-items: center;
          .main_title {
            font-size: 16px;
            font-weight: 500;
            line-height: 16px;
            letter-spacing: 0px;
            text-align: left;
            color: #000;
            margin-left: 12px;
          }
          .main_text {
            margin-top: 12px;
            font-size: 12px;
            font-weight: 500;
            line-height: 16px;
            letter-spacing: 0px;
            text-align: left;
            color: #808080;
            margin-left: 12px;
          }
        }
        .main_right {
          margin-left: auto;
          margin-right: 12px;
          .iconfont {
            font-size: 20px;
          }
        }
      }
      .btn {
        z-index: 10;
        position: fixed;
        bottom: 34px;
        left: 0;
        margin: 12px 16px;
        line-height: 48px;
        height: 48px;
        width: 348px;
        background: #000;
        color: #fff;
        text-align: center;
        font-size: 16px;
        background-image: url(https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/btnBlack.png);
        background-repeat: repeat;
        background-size: 40px 37.5px;
        border-radius: 4px;
      }
    }
  }
  .bg {
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.76);
  }
}
</style>
