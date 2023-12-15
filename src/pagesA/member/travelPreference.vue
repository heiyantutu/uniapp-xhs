<template>
  <div class="ui_travelPreference">
    <!-- #ifdef MP -->
    <coustom-head title="旅行喜好" nativeMode=true>
    </coustom-head>
    <!-- #endif -->
    <div class="travelPreferenceBox">
      <div class="card" v-for="(preference,preferenceIndex) in travelPreferenceList" :key="preferenceIndex">
        <p class="bigTitle">{{preference.name}}</p>
        <div class="subBox">
          <div class="chooseList">
            <template v-for="(tag,tagIndex) in preference.tagList" :key="tagIndex">
              <div class="chooseItem" :class="{two:preference.tagList.length == 2,active:tag.isChoose}"
                @click="changeActive(tag)" v-if="tag.userDefined !=='T'">
                <p class="desc">{{tag.name}}</p>
                <p class="subDesc" v-if="tag.remark">{{tag.remark}}</p>
              </div>
            </template>
            <template v-for="(tag,tagIndex) in preference.tagList" :key="tagIndex">
              <div class="subTitleBox" v-if="tag.userDefined =='T'">
                <p class="title" v-if="preference.tagList.length > 1">{{tag.name}}</p>
                <input type="text" placeholder="请输入" class="theInput" v-model="tag.userInput" />
              </div>
            </template>
          </div>
        </div>
      </div>
      <bottom-btn @click="saveTag">
        {{isSkip?'跳过':'保存'}}
      </bottom-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted, watchEffect, toRaw } from "vue";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import { jAlert3 } from "@/base/jAlert/jAlert";
import bottomBtn from "@/components/bottomBtn.vue";
import { onLoad } from "@dcloudio/uni-app";
import coustomHead from "@/components/coustomHead.vue";
let config = getStorage("config");
let user = getStorage("user");
let travelPreferenceList = ref<any>([]);
let guestId = ref("");
let isAjax = ref(false);
let type = ref("member");
let isSkip = ref(false);
let mode = ref("edit");
let delta = ref(1);
let chooseTagList = ref<any>([]);
let orderNo = ref("");
let orderType = ref("");
watchEffect(() => {
  let needSkip = true;
  if (mode.value == "edit") {
    needSkip = false;
  } else {
    travelPreferenceList.value.forEach((n: any) => {
      if (n.tagList.length > 0) {
        n.tagList.forEach((m: any) => {
          if (m.isChoose) {
            needSkip = false;
          }
          if (m.userDefined == "T" && m.userInput) {
            needSkip = false;
          }
        });
      }
    });
  }
  isSkip.value = needSkip;
});
const querySystemTagConfig = (cb?: Function) => {
  let query: any = {
    hotelCode: config.hotelCode,
    hotelGroupCode: config.hotelGroupCode,
    firstResult: 0,
    pageSize: 100,
    channel: "WECHAT",
    tagSrc:"WECHAT",
  };
  if (type.value == "member") {
    query.isMember = "T";
  } else {
    query.isGuest = "T";
  }
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
          templateList.forEach((n: any) => {
            n.tagList.forEach((m: any) => {
              m.isChoose = false;
              m.userInput = "";
              if (m.userDefined !== "T") {
                if (m.name.length > 7) {
                  m.name = m.name.substring(0, 7);
                }
              }
            });
          });
          travelPreferenceList.value = templateList;
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
const changeActive = (item: AnyObject) => {
  item.isChoose = !item.isChoose;
};
const saveBack = () => {
  uni.navigateBack({
    delta: delta.value,
  });
};
const saveTag = () => {
  if (isSkip.value) {
    saveBack();
    return false;
  }
  updateTag();
};
const updateTag = () => {
  let tagList: any = [];
  travelPreferenceList.value.forEach((n: any) => {
    if (n.tagList.length > 0) {
      n.tagList.forEach((m: any) => {
        m.tagCode = m.code;
        m.tagName = m.name;
        m.tagSrc = "WECHAT";
        m.flag = "OWN";
        if (m.isChoose) {
          tagList.push(m);
        }
        if (m.userDefined == "T" && m.userInput) {
          m.tagName = m.userInput;
          tagList.push(m);
        }
      });
    }
  });
  let delTagList = chooseTagList.value.filter((origin:any) => !tagList.some((current:any) => origin.code === current.code));
  let newTagList = tagList.filter((origin:any) => !delTagList.some((current:any) => origin.code === current.code));
  let query: any = {
    hotelCode: config.hotelCode,
    hotelGroupCode: config.hotelGroupCode,
    memberId: user.memberId,
    delTagList:delTagList,
    tagList: newTagList,
    mode: 2,
    operatorName: `${user.name}(${user.mobile})`,
    operatorCode: user.memberId,
    flag: "OWN",
    channel: "WECHAT",
    tagSrc:"WECHAT",
    orderNo:orderNo.value,
    orderType:orderType.value,
  };
  if (type.value !== "member") {
    query.guestId = guestId.value;
  }
  api
    .interfaceTransfer({
      config: {
        interfaceFrom: "member",
        interfaceMethod:
          type.value == "member"
            ? "/crm/v2/updateMemberAllTag"
            : "/guest/v1/updateGuestAllTag",
        hotelGroupCode: config.hotelGroupCode,
        interfaceType: "POST",
      },
      query: query,
    })
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.result == 0) {
          jAlert3("保存成功");
          setTimeout(() => {
            saveBack();
          }, 1000);
        } else {
          jAlert3(res.retVal.msg);
        }
      } else {
        jAlert3(res.msg);
      }
    });
};
const querySaveTag = () => {
  let query: any = {
    hotelCode: config.hotelCode,
    hotelGroupCode: config.hotelGroupCode,
    firstResult: 0,
    pageSize: 100,
    channel: "WECHAT",
    memberId: user.memberId,
    tagSrc:"WECHAT",
  };
  if (type.value !== "member") {
    query.guestId = guestId.value;
  }
  api
    .interfaceTransfer({
      config: {
        interfaceFrom: "member",
        interfaceMethod:
          type.value == "member"
            ? "/crm/v2/queryMemberTag"
            : "/guest/v1/queryGuestTag",
        hotelGroupCode: config.hotelGroupCode,
        interfaceType: "POST",
      },
      query,
    })
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.result == 0) {
          let userChooseMap: any = {};
          let tags = [];
          if (
            res.retVal.retVal &&
            res.retVal.retVal.datas &&
            res.retVal.retVal.datas.length > 0
          ) {
            tags = res.retVal.retVal.datas;
          }
          tags.forEach((n: any) => {
            userChooseMap[n.tagCode] = n;
          });
          setDefault(userChooseMap);
        }
      }
    });
};
const setDefault = (userChooseMap: any) => {
  travelPreferenceList.value.forEach((n: any) => {
    n.tagList.forEach((m: any) => {
      if (userChooseMap[m.code]) {
        let tag = userChooseMap[m.code];
        if (tag.userDefined !== "T") {
          m.isChoose = true;
        } else {
          m.userInput = tag.tagName;
        }
      }
    });
  });
  getChooseTagList();
};
const getChooseTagList = () => {
  let tagList:any = [];
  travelPreferenceList.value.forEach((n: any) => {
    n.tagList.forEach((m: any) => {
      if (m.isChoose || m.userInput) {
        tagList.push(m);
      }
    });
  });
  chooseTagList.value = tagList;
};
onMounted(() => {
  querySystemTagConfig(() => {
    querySaveTag();
  });
});
onLoad((options: any) => {
  if (options.type) {
    type.value = options.type;
  }
  if (options.guestId) {
    guestId.value = options.guestId;
  }
  if (options.mode) {
    mode.value = options.mode;
  }
  if (options.delta) {
    delta.value = Number(options.delta);
  }
  if (options.orderNo) {
    orderNo.value = options.orderNo;
  }
  if (options.orderType) {
    orderType.value = options.orderType;
  }
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import (reference) url("~@/styles/mixin.less");
.ui_travelPreference {
  .travelPreferenceBox {
    padding: 16px;
    padding-bottom: 100px;
  }
  .card {
    background: #ffffff;
    border-radius: 8px;
    margin-bottom: 12px;
    .bigTitle {
      height: 46px;
      line-height: 46px;
      font-size: 14px;
      color: #000000;
      padding-left: 12px;
      font-weight: bold;
      border-bottom: 1px solid #f8f8f8;
      .textHidden();
    }
    .subBox {
      padding: 0px 12px;
      .subTitleBox {
        width: 100%;
        .title {
          font-size: 14px;
          color: #000000;
          margin: 10px 0;
        }
      }
      .theInput {
        font-size: 14px;
        display: block;
        width: 100%;
        margin: 16px 0;
        &:nth-child(n + 2) {
          margin-top: 0px;
        }
      }
    }
    .chooseList {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .chooseItem {
        height: 46px;
        flex-basis: calc(~"((100% - 16px)/ 3)");
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        border: 1px solid#f8f8f8;
        border-radius: 4px;
        margin: 16px 8px 16px 0px;
        /* margin-right: 8px;
        margin-bottom: 12px; */
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        &:nth-child(n + 4) {
          margin-top: 0px;
        }
        &.active {
          border: 1px solid #a43127;
          &:after {
            content: "";
            border-style: solid;
            border-width: 14px 20px 0 0;
            border-color: transparent #a43127 transparent transparent;
            position: absolute;
            right: 0;
            bottom: 0px;
          }
          &:before {
            content: "";
            width: 2px;
            height: 5px;
            position: absolute;
            right: 3px;
            bottom: 2px;
            border: 1px solid #fff;
            border-top-color: transparent;
            border-left-color: transparent;
            transform: rotate(45deg);
            z-index: 2;
          }
        }
        &.two {
          flex-basis: calc(~"((100% - 8px)/ 2)");
          &:nth-child(2n + 0) {
            margin-right: 0px;
          }
        }
        &:nth-child(3n + 0) {
          margin-right: 0px;
        }
        .desc {
          font-size: 14px;
          color: #000000;
          .line-clamp(2);
          //.line-clamp(2);
        }
        .subDesc {
          font-size: 12px;
          color: #808080;
          .line-clamp(1);
          margin-top:4px;
        }
      }
    }
  }
}
</style>
