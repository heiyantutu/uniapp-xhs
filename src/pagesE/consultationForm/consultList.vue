<template>
  <div class="ui_consultList">
    <!-- #ifdef MP -->
    <coustom-head title="咨询单" nativeMode="true"> </coustom-head>
    <!-- #endif -->
    <div v-for="(item, index) in consultList" :key="index">
      <div class="time_wrap">
        {{ item.modifyDatetime ? item.modifyDatetime : item.createDatetime }}
      </div>
      <div class="list_wrap">
        <div class="list_title">咨询记录</div>
        <div class="list_item">
          <div class="item_in">
            <div class="item_left">目的地</div>
            <div class="item_right">{{ item.endPlaces }}</div>
          </div>
          <div class="item_in">
            <div class="item_left">出发时段</div>
            <div class="item_right">
              {{ timeDay(item.startDate) }} - {{ timeDay(item.endDate) }}
            </div>
          </div>
          <div class="item_in">
            <div class="item_left">行程天数</div>
            <div class="item_right">{{ item.travelDay }} 天</div>
          </div>
          <div class="item_in">
            <div class="item_left">出行人数</div>
            <div class="item_right">
              <span v-if="item.adult != '0' && item.adult"
                >{{ item.adult }}成人</span
              >
              <span v-if="item.olderChildren != '0' && item.olderChildren"
                >,{{ item.olderChildren }}大童</span
              >
              <span v-if="item.middleChildren != '0' && item.middleChildren"
                >,{{ item.middleChildren }}中童</span
              >
              <span v-if="item.youngerChildren != '0' && item.youngerChildren"
                >,{{ item.youngerChildren }}幼童</span
              >
              <span v-if="item.oldNum != '0' && item.oldNum"
                >,含{{ item.oldNum }}老人</span
              >
              <span v-if="item.hmkNum != '0' && item.hmkNum"
                >,含{{ item.hmkNum }}港澳台人士</span
              >
              <span v-if="item.foreignerNum != '0' && item.foreignerNum"
                >,含{{ item.foreignerNum }}外籍人士</span
              >
            </div>
          </div>
          <div class="item_in">
            <div class="item_left">旅行喜好</div>
            <div class="item_right">{{ item.travelPreferences }}</div>
          </div>
          <div class="item_in">
            <div class="item_left">备注信息</div>
            <div class="item_right">
              {{ item.otherRemark }}
            </div>
          </div>
          <div class="line"></div>
          <div class="item_in">
            <div class="item_left">联系人</div>
            <div class="item_right">{{ item.rsvMan }} {{ item.mobile }}</div>
          </div>
          <div class="item_in">
            <div class="item_left">出发地</div>
            <div class="item_right">{{ item.startPlace }}</div>
          </div>
          <div class="item_in" @click="copy(item.adviceNo)">
            <div class="item_left">咨询单号</div>
            <div class="item_right">
              {{ item.adviceNo }}
              <i class="iconfont icon-a-12_fuzhi consult_icon"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="time_wrap">2023.03.01 09:41:00</div>
    <div class="list_wrap">
      <div class="list_title">咨询记录</div>
      <div class="list_item">
        <div class="item_in">
          <div class="item_left">出发时段</div>
          <div class="item_right">2023.03.08 - 2023.03.12</div>
        </div>
        <div class="item_in">
          <div class="item_left">行程天数</div>
          <div class="item_right">3天</div>
        </div>
        <div class="item_in">
          <div class="item_left">出行人数</div>
          <div class="item_right">2成人，1小童</div>
        </div>
        <div class="item_in">
          <div class="item_left">旅行喜好</div>
          <div class="item_right">人文，徒步</div>
        </div>
        <div class="line"></div>
        <div class="item_in">
          <div class="item_left">联系人</div>
          <div class="item_right">张三 13556781234</div>
        </div>
        <div class="item_in">
          <div class="item_left">出发地</div>
          <div class="item_right">广东 广州</div>
        </div>
        <div class="item_in">
          <div class="item_left">咨询单号</div>
          <div class="item_right">
            CST000202209077725
            <i class="iconfont icon-a-12_fuzhi consult_icon"></i>
          </div>
        </div>
      </div>
    </div> -->
    <empty
      v-if="consultList.length == 0"
      tips="暂无咨询单"
      subTips="松赞，期待与您相遇。"
    ></empty>
    <div class="zhanwei"></div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import { timeDay } from "@/utils/filter";
import { jAlert3, jAlert5 } from "@/base/jAlert/jAlert";
import coustomHead from "@/components/coustomHead.vue";
import { onReachBottom } from "@dcloudio/uni-app";
import empty from "@/components/empty.vue";
let config = getStorage("config");
let user = getStorage("user");
let firstResult = ref(0);
let pageSize = ref(15);
let consultList = ref([] as any[]);
const copy = (val: string) => {
  uni.setClipboardData({
    data: val,
    success: function () {
      jAlert3("复制成功");
    },
  });
};
const getOrderList = () => {
  uni.showLoading({
    title: "加载中...",
  });
  api
    .interfaceTransfer({
      config: {
        interfaceType: "POST",
        interfaceModule: "GC_TRAVEL_ORDER",
        interfaceMethod: "/api/advice/queryAdviceOrderPage",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
      query: {
        memberId: user.memberId,
        unitCode: config.hotelGroupCode,
        firstResult: firstResult.value,
        pageSize: pageSize.value,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        firstResult.value = firstResult.value + pageSize.value;
        // consultList.value = res.retVal.retVal.datas;
        consultList.value = consultList.value.concat(res.retVal.retVal.datas);
        console.log(consultList, "consultList---------");
      }
    })
    .finally(() => {
      uni.hideLoading();
    });
};
onReachBottom(() => {
  getOrderList();
});
onMounted(() => {
  getOrderList();
});
</script>

<style lang="less" scoped>
.ui_consultList {
  .time_wrap {
    margin: 24px auto 16px auto;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    letter-spacing: 0px;
    text-align: center;
    color: #808080;
  }
  .list_wrap {
    margin: 16px;
    background: #fff;
    border-radius: 8px;

    .list_title {
      color: #000;
      font-size: 14px;
      font-weight: bold;
      line-height: 14px;
      letter-spacing: 0px;
      text-align: left;
      padding: 16px 12px;
      border-bottom: 1px solid #eee;
    }
    .list_item {
      padding: 16px 12px;
      .item_in {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }
      .item_in:last-child {
        margin-bottom: 0;
      }
      .item_left {
        color: #808080;
        font-size: 14px;
        font-weight: 400;
        line-height: 14px;
        letter-spacing: 0px;
        text-align: left;
        min-width: 58px;
      }
      .item_right {
        display: flex;
        flex-wrap: wrap;
        max-width: 255px;
        width: 255px;
        margin-left: 12px;
        color: #000;
        font-size: 14px;
        font-weight: 400;
        line-height: 18px;
        letter-spacing: 0px;
        text-align: left;
        .consult_icon {
          margin-left: 4px;
        }
      }
      .line {
        margin-bottom: 12px;
        width: 100%;
        height: 1px;
        background: #eee;
      }
    }
  }
  .zhanwei {
    height: 80px;
  }
}
</style>
