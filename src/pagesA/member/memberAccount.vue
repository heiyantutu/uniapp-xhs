<template>
  <div class="ui_memberAccount">
    <coustom-head :title="title" color="#fff" customClass="customPattern"></coustom-head>
    <div class="topBg">
      <div class="topInner">
        <div class="accountNumber">{{accountBalance}}</div>
        <div class="accountUnit">单位 (元)</div>
      </div>
    </div>
    <div class="bottomBox">
      <switch-bar :switchList="switchList" @changeIndex="changeIndex" :color="switchColor" padding=16></switch-bar>
      <div class="infoBox">
        <div class="operateBox" v-if="currentIndex == 1">
          <div class="operateItem" @click="showBind"><i class="icon iconfont icon-a-20_bangding"></i>绑定</div>
        </div>
        <div class="operateBox" v-if="currentIndex == 2" @click="goWmUrl('showCard')">
          <div class="operateItem"><i class="icon iconfont icon-a-20_bangding"></i>绑定</div>
          <div class="operateItem"><i class="icon iconfont icon-a-20_gouwuche"></i>购买</div>
        </div>
        <div class="totalRow" v-if="currentIndex == 1">
          <p class="total">合计 ¥{{consumerTotal}}</p>
          <p class="passed"
            @click="goPage(`/pagesA/member/memberAccountExpire?type=consumer&cardType=${consumerCardType}`)">查看已过期<i
              class="icon iconfont icon-a-16_youlajiantou_hei"></i></p>
        </div>
        <div class="totalRow" v-if="currentIndex == 2" @click="goWmUrl('showCard')">
          <p class="total">合计 ¥{{wmCardTotal}}</p>
          <p class="passed">查看已过期<i class="icon iconfont icon-a-16_youlajiantou_hei"></i></p>
        </div>
        <div class="totalRow" v-if="currentIndex == 3">
          <p class="total">合计 ¥{{reserveTotal}}</p>
          <p class="passed"
            @click="goPage(`/pagesA/member/memberAccountExpire?type=reserve&cardType=${reserveCardType}`)">查看已过期<i
              class="icon iconfont icon-a-16_youlajiantou_hei"></i></p>
        </div>
        <div class="accountList" v-if="currentIndex == 1">
          <div class="accountItem" v-for="(item,itemIndex) in consumerList" :key="itemIndex">
            <account-item :item="item" @chooseItem="chooseItem(item)"></account-item>
          </div>
          <empty v-if="consumerList.length==0" tips="暂无消费金" subTips='松赞，期待与您相遇'></empty>
        </div>
        <div class="accountList" v-if="currentIndex == 2">
          <div class="accountItem" v-for="(item,itemIndex) in cardList" :key="itemIndex">
            <account-item :item="item" @chooseItem="chooseItem(item)"></account-item>
          </div>
          <empty v-if="cardList.length==0" tips="暂无风物卡" subTips='松赞，期待与您相遇'></empty>
        </div>
        <div class="accountList" v-if="currentIndex == 3">
          <div class="accountItem" v-for="(item,itemIndex) in reserveList" :key="itemIndex">
            <account-item :item="item" @chooseItem="chooseItem(item)"></account-item>
          </div>
          <empty v-if="reserveList.length==0" tips="暂无保留金" subTips='松赞，期待与您相遇'></empty>
        </div>
      </div>
    </div>
    <bottom-dialog ref="bindComponent" title="绑定">
      <div class="bindBox">
        <div class="inputBox">
          <div class="inputRow">
            <p class="inputTitle">序列号</p>
            <input type="text" placeholder="请输入序列号" v-model="cardNo" />
          </div>
          <div class="inputRow">
            <p class="inputTitle">兑换码</p>
            <input type="text" placeholder="请输入兑换码" v-model="pwd" />
          </div>
        </div>
        <!-- <div class="agreeBox">
          <p class="agreeDesc" @click.stop="toggleAggre">
            <image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/select.png" mode=""
              class="iconfont" v-if="isAgree" />
            <image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/unSelect.png" mode=""
              class="iconfont" v-else />
            我已阅读并同意<span @click.stop="goCodeText" class="userRule">《单用途预付卡协议》</span>
          </p>
        </div> -->
        <div class="bindBtn" @click="bindAction">确认绑定</div>
      </div>
    </bottom-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import { createUrl, goPage, addNum, subtraction, goWmUrl } from "@/utils/utils";
import switchBar from "@/components/switchBar.vue";
import coustomHead from "@/components/coustomHead.vue";
import accountItem from "../components/accountItem.vue";
import bottomDialog from "@/components/bottomDialog.vue";
import empty from "@/components/empty.vue";
import api from "@/utils/api";
import { getStorage, setStorage } from "@/utils/wxuser";
import useScroll from "@/hooks/useScroll";
import { jAlert3 } from "@/base/jAlert/jAlert";
import { hex_md5 } from "@/utils/md5";
import { timeDay } from "@/utils/filter";

const { scrollTop, onPageScroll } = useScroll();
onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});
let switchColor = ref("#ffffff");
let config = getStorage("config");
let user = getStorage("user");
let title = ref("余额");
let titleColor = ref("#fff");
let currentIndex = ref(1);
const bindComponent = ref();
let isAgree = ref(false);
let cardNo = ref("");
let pwd = ref("");
let authCode = ref("");
let isAjax = ref(false);
let consumerCardType = ref("XFJ");
let notConsumerCardLevel = ref("QDXFJ,DKHXFJ");
let reserveCardType = ref("BLJ");
let notReserveCardLevel = ref("QDBLJ,DKHBLJ");
let consumerList = ref([]);
let reserveList = ref([]);
let cardList = ref([]);
let consumerTotal = ref(0);
let reserveTotal = ref(0);
let wmCardTotal = ref(0);
let switchList = reactive([
  {
    name: "消费金",
    active: true,
    index: 1,
  },
  {
    name: "风物卡",
    active: false,
    index: 2,
  },
  {
    name: "保留金",
    active: false,
    index: 3,
  },
]);
const toggleAggre = () => {
  if (isAgree.value) {
    isAgree.value = false;
  } else {
    isAgree.value = true;
  }
};
const goCodeText = () => {
  let title = "单用途预付卡协议";
  var obj = {
    title: decodeURIComponent(title),
    code: "consumerCardTips",
  };
  uni.navigateTo({
    url: "/pagesA/other/codeText?" + createUrl(obj),
  });
};
const changeIndex = (index: number) => {
  /*   if (index == 1) {
    jAlert3("敬请期待");
    return false;
  } */
  switchList.forEach((n) => {
    n.active = false;
  });
  switchList[index].active = true;
  currentIndex.value = switchList[index].index;
};
const showBind = () => {
  bindComponent.value.showDialog();
};
const bindAction = () => {
  if (!cardNo.value) {
    jAlert3("请输入序列号");
    return false;
  }
  if (!pwd.value) {
    jAlert3("请输入兑换码");
    return false;
  }
  /* if (!isAgree.value) {
    jAlert3("请同意协议");
    return false;
  } */
  authCode.value = hex_md5(pwd.value);
  bindCardToMember();
};
const bindCardToMember = () => {
  if (isAjax.value) {
    return false;
  }
  isAjax.value = true;
  api
    .bindCardToMember({
      hotelGroupCode: config.hotelGroupCode,
      hotelCode: config.hotelCode,
      channel: "wechat",
      cardNo: cardNo.value,
      memberId: user.memberId,
      authCode: authCode.value,
    })
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.result == 0) {
          cardNo.value = "";
          authCode.value = "";
          pwd.value = "";
          bindComponent.value.hideDialog();
          isAjax.value = false;
          jAlert3("绑定成功");
          queryMemberCardByCondition(
            consumerCardType.value,
            "consumer",
            notConsumerCardLevel.value
          );
        } else {
          isAjax.value = false;
          jAlert3(res.retVal.msg);
        }
      } else {
        isAjax.value = false;
        jAlert3(res.msg);
      }
    });
};
const queryMemberCardByCondition = (
  cardType: string,
  type: string,
  cardLevel: string = ""
) => {
  api
    .queryMemberCardByCondition({
      hotelGroupCode: config.hotelGroupCode,
      cardType: cardType,
      isIncludeAbnormal: "F",
      memberId: user.memberId,
      channel: "wechat",
      cardLevel: cardLevel,
      cardLevelModel: "R",
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        if (
          res.retVal.retVal.cardList &&
          res.retVal.retVal.cardList.length > 0
        ) {
          let total = 0;
          let cardList: any = [];
          res.retVal.retVal.cardList.forEach((n: any) => {
            n.title = n.cardLevelDescript;
            n.validTime = timeDay(n.endDate);
            n.price = subtraction(n.recharge, n.pay);
            n.type = type;
            total = addNum(total, n.price);
            if (n.price > 0) {
              cardList.push(n);
            }
          });
          if (type == "consumer") {
            consumerList.value = cardList;
            consumerTotal.value = total;
          }
          if (type == "reserve") {
            reserveList.value = cardList;
            reserveTotal.value = total;
          }
        }
      }
    });
};
const chooseItem = (item: any) => {
  if (currentIndex.value == 2) {
    goWmUrl("showCard");
    return false;
  }
  setStorage("accountItem", item);
  goPage(`/pagesA/member/memberAccountInfo?type=${item.type}`);
};
const accountBalance = computed(() => {
  let accountBalance = 0;
  if (user && user.memberBalanceUsable) {
    accountBalance = user.memberBalanceUsable;
  }
  accountBalance = addNum(accountBalance, wmCardTotal.value);
  return accountBalance;
});
const getUserAvailableCardList = () => {
  api
    .getUserAvailableCardList({
      hotelCode: config.hotelCode,
      hotelGroupCode: config.hotelGroupCode,
      mobile: user.mobile,
      vidType: 2,
      scrollSize: 100,
      cardType: 1,
      cardStatus: 200,
    })
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.data && res.retVal.data.scrollList.length > 0) {
          res.retVal.data.scrollList.forEach((n: any) => {
            n.logo = n.cardImageUrl;
            n.title = n.cardName;
            n.price = n.cardBalance;
            n.validTime = n.fixEndDate;
            if (n.expireType == 3) {
              n.isForever = "T";
            }
            wmCardTotal.value = addNum(wmCardTotal.value, n.cardBalance);
          });
          cardList.value = res.retVal.data.scrollList;
        }
      }
    });
};
onMounted(() => {
  queryMemberCardByCondition(
    consumerCardType.value,
    "consumer",
    notConsumerCardLevel.value
  );
  queryMemberCardByCondition(
    reserveCardType.value,
    "reserve",
    notReserveCardLevel.value
  );
  getUserAvailableCardList();
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import (reference) url("~@/styles/mixin.less");
.ui_memberAccount {
  .bindBox {
    padding: 16px;
    min-height: 80vh;
    .bindBtn {
      .baseBtn();
      height: 48px;
      line-height: 48px;
    }
    .inputBox {
      margin-bottom: 30px;
      background: #ffffff;
      border-radius: 4px;
      .inputRow {
        height: 48px;
        display: flex;
        align-items: center;
        .inputTitle {
          text-indent: 12px;
          font-size: 14px;
          color: #000000;
          width: 100px;
        }
        input {
          flex: 1;
          font-size: 14px;
        }
      }
    }
    .agreeBox {
      text-align: center;
      color: #808080;
      font-size: 14px;
      margin-bottom: 12px;
      .agreeDesc {
        display: flex;
        align-items: center;
        .iconfont {
          font-size: 16px;
          margin-right: 5px;
          width: 16px;
          height: 16px;
        }
        .icon-danxuan_yixuan {
          color: @active-color;
        }
      }
      .userRule {
        color: #000000;
      }
    }
  }
  .topBg {
    background-color: #000000;
    background-image: url("https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/btnBlack.png");
    background-repeat: repeat;
    text-align: center;
    background-size: 40px 37.5px;
    width: 100%;
    height: 298px;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    position: relative;
    .topInner {
      position: absolute;
      bottom: 92px;
      left: 0px;
      width: 100%;
    }
    .accountNumber {
      font-size: 32px;
      color: #ffffff;
      font-weight: bold;
      margin-bottom: 18px;
    }
    .accountUnit {
      font-size: 14px;
      color: #ffffff;
      opacity: 0.8;
    }
  }
  .bottomBox {
    position: relative;
    top: -44px;
    z-index: 1;
  }
  .infoBox {
    padding: 0 16px;
    .operateBox {
      margin-top: 24px;
      //margin-bottom: 15px;
      display: flex;
      align-items: center;
      height: 52px;
      .operateItem {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        border-radius: 4px;
        font-size: 14px;
        color: #000000;
        background: #ffffff;
        .iconfont {
          font-size: 20px;
          margin-right: 8px;
        }
        &:nth-of-type(2) {
          margin-left: 12px;
        }
      }
    }
    .totalRow {
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      color: #808080;
      position: relative;
      margin-top: 10px;
      &.arrow {
        &::after {
          border-right: 1px solid #808080;
          border-top: 1px solid #808080;
        }
      }
      .passed {
        //margin-right: 20px;
        display: flex;
        align-items: center;
        .iconfont {
          margin-left: 3px;
        }
      }
    }
    .accountList {
      .accountItem {
        margin-bottom: 12px;
      }
    }
  }
}
</style>
