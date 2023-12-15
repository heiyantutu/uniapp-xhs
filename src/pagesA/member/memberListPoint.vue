<template>
  <div class="ui_memberListPoint">
    <coustom-head :title="title" color="#fff" customClass="customPattern"></coustom-head>
    <div class="topBg">
      <div class="freezePoint" v-if="freezePoint>0" @click="showTips()">冻结积分：{{freezePoint}}<i
          class="iconfont icon icon-a-12_tishi_bai"></i></div>
      <div class="pointNumber">{{user.pointBalance}}</div>
      <div class="accountUnit" v-if="pointsExpiredTips">{{pointsExpiredTips}}</div>
    </div>
    <div class="bottomBox">
      <switch-bar :switchList="switchList" @changeIndex="changeIndex" :color="switchColor"></switch-bar>
      <div class="pointList">
        <div class="pointItem" v-for="(cardPoint,cardPointIndex) in cardPointList" :key="cardPointIndex">
          <div class="leftPart">
            <div class="title">{{cardPoint.showSrc}}</div>
            <div class="time">{{timeDay(cardPoint.pointGenDate)}}</div>
          </div>
          <div class="rightPart">
            <div class="pointChange">{{cardPoint.point}}</div>
          </div>
        </div>
      </div>
      <last-text tips="没有更多了" v-if="cardPointList.length>0 && totalRows == cardPointList.length"></last-text>
      <empty v-if="cardPointList.length == 0 && !isAjax"  :tips="emptyTips" subTips='松赞，期待与您相遇'></empty>
    </div>
    <center-dialog ref="tips">
      <div class="check_wrap">
        <div class="tips">{{freezePoint}}积分将在{{freezeDate}}解冻</div>
        <div class="check-footer">
          <div class="check-btn" @click="hideTips">我知道了</div>
        </div>
      </div>
    </center-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import switchBar from "@/components/switchBar.vue";
import coustomHead from "@/components/coustomHead.vue";
import empty from "@/components/empty.vue";
import lastText from "@/components/lastText.vue";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import { timeDay } from "@/utils/filter";
import { jAlert3, jAlert5 } from "@/base/jAlert/jAlert";
import { onReachBottom } from "@dcloudio/uni-app";
import UmengSDK from "@/utils/umengAdaptor.js";
import useScroll from "@/hooks/useScroll";
import dayjs from "dayjs";
import centerDialog from "@/components/centerDialog.vue";

const { scrollTop, onPageScroll } = useScroll();
onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
});
let switchColor = ref("#ffffff");
let config = getStorage("config");
let user = getStorage("user");
let title = ref("积分");
let titleColor = ref("#ffffff");
let firstResult = ref(0);
let pageSize = ref(15);
let isAjax = ref(false);
let pointType = ref("");
let pointsExpiredTips = ref("");
let cardPointList = ref([]);
let totalRows = ref(0);
let switchList = reactive([
  {
    name: "全部",
    active: true,
    value: "",
  },
  {
    name: "累积",
    active: false,
    value: "P",
  },
  {
    name: "消费",
    active: false,
    value: "C",
  },
  {
    name: "过期",
    active: false,
    value: "O",
  },
]);
let emptyTips = computed(() => {
  let desc = "";
  switchList.forEach((n) => {
    if (n.active) {
      desc = n.name;
      if (n.name == "全部") {
        desc = "积分";
      }
    }
  });
  return `暂无${desc}`;
});
let srcMap: any = ref({
  PA: "消费产生积分",
  CH: "使用积分",
  IN: "积分失效",
  PP: "积分奖励",
  PC: "积分录入",
  LT: "积分转出",
  LF: "积分转入",
  AP: "积分调整-产生积分",
  AC: "积分调整-使用积分",
  AR: "使用积分撤销",
  IM: "系统切换导入",
});
let freezePoint = ref(0);
let freezeDate = ref("");
const tips = ref();
const hideTips = () => {
  tips.value.hideDialog();
};
const showTips = () => {
  tips.value.showDialog();
};
const changeIndex = (index: number) => {
  switchList.forEach((n) => {
    n.active = false;
  });
  switchList[index].active = true;
  pointType.value = switchList[index].value;
  UmengSDK.sendPV({
    integral: user.pointBalance,
    top_type_name: switchList[index].name,
    page_name: "integral_pg",
  });
  getNewListPoint();
};
const queryPointsExpiredRemindData = () => {
  api
    .queryPointsExpiredRemindData({
      hotelGroupCode: config.hotelGroupCode,
      memberId: user.memberId,
      channel: "WECHAT",
    })
    .then((res: any) => {
      if (
        res.result == 1 &&
        res.retVal.result == 0 &&
        res.retVal.retVal.length > 0
      ) {
        let pointsExpiredItem = res.retVal.retVal[0];
        pointsExpiredTips.value = `${
          pointsExpiredItem.expirePoint
        }积分将在${timeDay(pointsExpiredItem.expireDate)}到期`;
      }
    });
};
const getListPoint = () => {
  if (
    cardPointList.value.length > 0 &&
    cardPointList.value.length >= totalRows.value
  ) {
    return false;
  }
  if (isAjax.value) {
    return false;
  }
  isAjax.value = true;
  var listPointParameter = {
    memberId: user.memberId,
    firstResult: firstResult.value,
    pageSize: pageSize.value,
    hotelGroupId: config.hotelGroupId,
    hotelGroupCode: config.hotelGroupCode,
    pointType: pointType.value,
  };
  api.listPointByMemberId(listPointParameter).then((res: any) => {
    if (res.result == 1) {
      res.retVal.cardPointList.forEach((n: any) => {
        n.showSrc = srcMap.value[n.src];
      });
      cardPointList.value = cardPointList.value.concat(
        res.retVal.cardPointList
      );
      firstResult.value += pageSize.value;
      totalRows.value = res.retVal.totalRows;
      isAjax.value = false;
    } else {
      jAlert3(res.msg);
      isAjax.value = false;
    }
  });
};
const getNewListPoint = () => {
  totalRows.value = 0;
  firstResult.value = 0;
  cardPointList.value = [];
  getListPoint();
};
const querySysDictHelp = (cb?: Function) => {
  let query: any = {
    hotelGroupCode: config.hotelGroupCode,
    hotelCode: config.hotelCode,
    parentCode: "pointType",
    channel: "WECHAT",
  };
  api
    .interfaceTransfer({
      config: {
        interfaceFrom: "member",
        interfaceMethod: "crm/v2/querySysDictHelp",
        hotelGroupCode: config.hotelGroupCode,
      },
      query,
    })
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.result == 0) {
          if (res.retVal.retVal.length > 0) {
            let newSrcMap: any = {};
            res.retVal.retVal.forEach((n: any) => {
              newSrcMap[n.code] = n.descript;
            });
            srcMap.value = newSrcMap;
          }
          cb && cb();
        } else {
          cb && cb();
        }
      } else {
        cb && cb();
      }
      console.log(res);
    });
};
const srcName = (val: string): string => {
  let srcMap: { [key: string]: string } = {
    PA: "消费产生积分",
    CH: "使用积分",
    IN: "积分失效",
    PP: "积分奖励",
    PC: "积分录入",
    LT: "积分转出",
    LF: "积分转入",
    AP: "积分调整-产生积分",
    AC: "积分调整-使用积分",
    AR: "使用积分撤销",
    IM: "系统切换导入",
  };
  return srcMap[val] || val;
};
const queryPointFreezeByMemberId = () => {
  api
    .interfaceTransfer({
      query: {
        memberId: user.memberId,
        firstResult: 0,
        pageSize: 10,
        hotelGroupCode: config.hotelGroupCode,
        hotelCode: config.hotelCode,
        channel: "WECHAT",
        orderColumn: "expiryDate",
      },
      config: {
        interfaceType: "POST",
        interfaceModule: "",
        interfaceMethod: "crm/v2/queryPointFreezeByMemberId",
        interfaceFrom: "member",
        hotelGroupCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.result == 0) {
          if (res.retVal.retVal.datas.length > 0) {
            freezePoint.value = res.retVal.retVal.datas[0].amount;
            freezeDate.value = dayjs(
              res.retVal.retVal.datas[0].expiryDate
            ).format("YYYY.MM.DD");
          }
        } else {
        }
      } else {
      }
    });
};
onReachBottom(() => {
  getListPoint();
});
onMounted(() => {
  if (user && user.memberId) {
    queryPointsExpiredRemindData();
    queryPointFreezeByMemberId();
    querySysDictHelp(() => {
      getListPoint();
    });
    UmengSDK.sendPV({
      integral: user.pointBalance,
      top_type_name: "全部",
      page_name: "integral_pg",
    });
  }
});
</script>

<style lang="less" scoped>
.check_wrap {
  background: rgba(255, 255, 255, 1);
  text-align: center;
  .check_title {
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: bold;
    line-height: 16px;
    letter-spacing: 0px;
    text-align: center;
    color: rgba(0, 0, 0, 1);
  }
  .tips {
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: center;
    color: rgba(128, 128, 128, 1);
    margin: 12px auto 32px auto;
  }
  .check-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid rgba(238, 238, 238, 1);
    .check-btn {
      margin-top: 24px;
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 400;
      line-height: 16px;
      letter-spacing: 0px;
      text-align: center;
      color: rgba(0, 0, 0, 1);
    }
  }
}
.ui_memberListPoint {
  min-height: 100vh;
  .topBg {
    background-color: #000000;
    background-image: url("https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/btnBlack.png");
    background-repeat: repeat;
    text-align: center;
    background-size: 40px 37.5px;
    width: 100%;
    height: 298px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .freezePoint {
      font-size: 14px;
      font-weight: 400;
      color: #fff;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      .iconfont {
        font-size: 12px;
        margin-left: 3px;
      }
    }
    .pointNumber {
      font-size: 32px;
      color: #ffffff;
      font-weight: bold;
    }
    .accountUnit {
      font-size: 14px;
      color: #ffffff;
      margin-top: 24px;
    }
  }
  .bottomBox {
    position: relative;
    top: -44px;
    z-index: 1;
  }
  .pointList {
    padding: 16px;
    padding-top: 10px;
    .pointItem {
      height: 70px;
      display: flex;
      .leftPart {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        .title {
          font-size: 14px;
          color: #000000;
          margin-bottom: 12px;
        }
        .time {
          font-size: 12px;
          color: #808080;
        }
      }
      .rightPart {
        height: 100%;
        display: flex;
        align-items: center;
        .pointChange {
          font-size: 14px;
          color: #000000;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
