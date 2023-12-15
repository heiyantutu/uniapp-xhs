<template>
  <div class="ui_memberInfo">
    <!-- #ifdef MP -->
    <coustom-head title="个人资料" nativeMode=true>
    </coustom-head>
    <!-- #endif -->
    <div class="memberInfoBox">
      <div class="userInfoList">
        <div class="userInfoItem big">
          <div class="userInfoTitle">
            头像
          </div>
          <!-- <div class="userInfoDesc arrow">
          <image :src="wxuser.avatarUrl" mode="" class="avatar" />
        </div> -->
          <button open-type="chooseAvatar" @chooseavatar="onChooseavatar" class="userInfoDesc arrow">
            <img
              :src="wxuser.avatarUrl?wxuser.avatarUrl:'https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/avatar.png'"
              alt="" class="avatar">
          </button>
        </div>
        <div class="userInfoItem">
          <div class="userInfoTitle">
            昵称
          </div>
          <input type="text" placeholder="填写真实姓名" v-model="nickname" placeholder-class="placeholder"
            v-if="canUpdateName" class="userInfoDesc" confirm-type="done" @confirm="bindNameChange">
          <div class="userInfoDesc" v-else>
            {{nickname}}
          </div>
        </div>
        <div class="userInfoItem">
          <div class="userInfoTitle">
            性别
          </div>
          <div class="userInfoDesc" v-bind:class="{arrow:sexCanChange,tofill:!sexState}">
            <picker @change="bindSexChange" :value="sex" :range="sexList" range-key="name" v-if="sexCanChange">
              <view class="pickerDesc">
                {{sexState?sexState:"请选择性别"}}
              </view>
            </picker>
            <div v-else>{{sexState}}</div>
          </div>
        </div>
        <div class="userInfoItem">
          <div class="userInfoTitle">
            生日
          </div>
          <div class="userInfoDesc" v-bind:class="{arrow:birthCanChange,tofill:!birth}">
            <picker mode="date" :value="birth" :start="start" :end="end" @change="bindDateChange" v-if="birthCanChange">
              <view class="pickerDesc">
                {{birth?birth:"请选择生日"}}
              </view>
            </picker>
            <div v-else>{{birth}}</div>
          </div>
        </div>
      </div>
      <div class="userInfoList">
        <div class="userInfoItem">
          <div class="userInfoTitle">
            手机号
          </div>
          <div class="userInfoDesc">
            {{sensitivePhone(user.mobile)}}
          </div>
        </div>
        <div class="userInfoItem">
          <div class="userInfoTitle">
            邮箱
          </div>
          <div class="userInfoDesc">
            <input type='text' placeholder="请输入邮箱" v-if="emailCanChange" confirm-type="done" @confirm="bindEmailChange"
              v-model="email" />
            <div v-else>{{email}}</div>
          </div>
        </div>
      </div>
      <div class="userInfoList">
        <div class="userInfoItem" @click="goAuth">
          <div class="userInfoTitle">
            实名认证
          </div>
          <div class="userInfoDesc arrow" v-bind:class="{unAuth:user.isRealName!=='T'}">
            {{user.isRealName=="T"?"已认证":"未认证"}}
          </div>
        </div>
      </div>
      <p class="tips">{{ruleNameTips}}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import { $ref } from "unplugin-vue-macros/macros";
import { onShow } from "@dcloudio/uni-app";
import api from "@/utils/api";
import { getStorage, setStorage } from "@/utils/wxuser";
import { goPageWithUser, refreshMemberInfo } from "@/utils/utils";
import { sensitivePhone, sensitiveEmail } from "@/utils/filter";
import { jAlert3 } from "@/base/jAlert/jAlert";
import coustomHead from "@/components/coustomHead.vue";

import dayjs from "dayjs";
onShow(() => {
  refreshMemberInfo(() => {
    user = getStorage("user");
    initUserSta();
  });
});
let config = getStorage("config");
let user = $ref(getStorage("user"));
let wxuser = $ref(getStorage("wxuser"));
let sex = ref("");
let birth = ref("");
let email = ref("");
let sexCanChange = ref(true);
let birthCanChange = ref(true);
let emailCanChange = ref(true);
let canUpdateName = ref(true);
let start = "1900-01-01";
let end = dayjs().format("YYYY-MM-DD");
let nickname = ref("");
let ruleNameTips = ref("");
if (user && user.nickname) {
  nickname.value = user.nickname;
} else {
  nickname.value = "松赞家人";
}
let sexList = [
  {
    value: "1",
    name: "男",
  },
  {
    value: "2",
    name: "女",
  },
];
const initUserSta = () => {
  if (user && user.sex && user.sex !== "?") {
    sex.value = user.sex;
    sexCanChange.value = false;
  }
  if (user && user.birth) {
    birth.value = user.birth;
    birthCanChange.value = false;
  }
  if (user && user.email) {
    email.value = user.email;
    emailCanChange.value = true;
  }
};
const getfunctionControl = () => {
  var codes = ["ruleNameTips"];
  var params = {
    appid: config.appid,
    codes: codes.join(","),
    componentAppid: config.componentAppid,
    hotelCode: config.hotelCode ? config.hotelCode : 0,
    hotelGroupCode: config.hotelGroupCode,
    clientType: "wechat_mini",
  };
  api.getMultiSysOptionCommon(params).then((data: any) => {
    if (data.result == 1) {
      data.retVal.forEach(function (n: any) {
        if (n.code == "ruleNameTips" && n.value) {
          ruleNameTips.value = n.value;
        }
      });
    }
  });
};
let sexState = computed(() => {
  let sexState = "";
  sexList.forEach((n) => {
    if (n.value == sex.value) {
      sexState = n.name;
    }
  });
  return sexState;
});

const bindSexChange = (e: any) => {
  if (sex.value) {
    return false;
  }
  const selectedIndex = e.detail.value;
  const newSex = sexList[selectedIndex].value;
  sex.value = newSex;
  update(
    {
      sex: newSex,
    },
    () => {
      sexCanChange.value = false;
    }
  );
};

const bindDateChange = (e: any) => {
  if (birth.value) {
    return false;
  }
  let newBirth = e.detail.value;
  birth.value = newBirth;
  update(
    {
      birth: newBirth,
    },
    () => {
      birthCanChange.value = false;
    }
  );
};
const bindNameChange = (e: any) => {
  let newName = e.detail.value;
  if (!newName) {
    jAlert3("请输入昵称");
    return false;
  }
  update(
    {
      nickname: e.detail.value,
    },
    () => {
      nickname.value = newName;
      canUpdateName.value = true;
    }
  );
};
const bindEmailChange = (e: any) => {
  /* if (email.value) {
    return false;
  } */
  let newEmail = e.detail.value;
  let emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  if (!emailReg.test(newEmail)) {
    jAlert3("请输入有效的邮箱！");
    return false;
  }
  update(
    {
      email: newEmail,
    },
    () => {
      email.value = newEmail;
      emailCanChange.value = true;
    }
  );
};
const update = (updateObj: Object, cb?: Function) => {
  let obj = {
    birth: user.birth || "",
    hotelGroupCode: config.hotelGroupCode || "",
    hotelGroupId: config.hotelGroupId || "",
    memberId: user.memberId || "",
    email: user.email || "",
    mobile: user.mobile || "",
    name: user.name || "",
    nation: user.nation || "",
    idNo: user.idNo || "",
    idCode: user.idCode || "",
    sex: user.sex || "",
    openid: wxuser.openid,
    nickname: user.nickname || "",
  };
  if (obj.idNo && !obj.idCode) {
    obj.idCode = "01";
  }
  obj = Object.assign(obj, updateObj);
  api.update(obj).then((res: any) => {
    if (res.result == 1) {
      cb && cb();
      refreshMemberInfo(() => {
        user = getStorage("user");
      });
    } else {
      jAlert3(res.msg);
    }
  });
};
const goAuth = () => {
  if (user.isRealName == "T") {
    goPageWithUser("/pagesA/member/authSucceed?type=edit");
  } else {
    goPageWithUser("/pagesA/member/memberAuth");
  }
};
const onChooseavatar = (e: any) => {
  let { avatarUrl } = e.detail;
  uni.showLoading({
    title: "上传头像中...",
  });
  uni.uploadFile({
    url:
      config.baseUrlmall.replace("/guardian", "/") +
      "/api/hotel/uploadToCloudNew.json",
    filePath: avatarUrl,
    name: "pics",
    header: {
      "Content-Type": "multipart/form-data",
    },
    formData: {
      hotelGroupCode: config.hotelGroupCode,
      hotelCode: config.hotelCode,
      appid: config.appid,
      componentAppid: config.componentAppid,
      pics: avatarUrl,
    },
    success: function (res) {
      if (res.statusCode == 200) {
        var opt = JSON.parse(res.data);
        if (opt.result == 1) {
          updateUserinfoByMiniOpenId(opt.msg);
        } else {
          jAlert3(opt.msg);
          return false;
        }
      } else {
        jAlert3("上传失败，请重新上传");
        return false;
      }
    },
    fail: (error) => {
      jAlert3(JSON.stringify(error));
      /* console.log(error);
      jAlert3(error); */
    },
    complete: () => {
      uni.hideLoading();
    },
  });
};
const updateUserinfoByMiniOpenId = (headimgurl: string) => {
  api
    .updateUserinfoByMiniOpenId({
      miniOpenId: wxuser.openid,
      headimgurl: headimgurl,
      nickName: user.nickName,
    })
    .then((res: any) => {
      if (res.result == 1) {
        wxuser.avatarUrl = headimgurl;
        setStorage("wxuser", wxuser);
      } else {
        jAlert3(res.msg);
        return false;
      }
    });
};
onMounted(() => {
  getfunctionControl();
  initUserSta();
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
.ui_memberInfo {
  .memberInfoBox {
    padding: 16px;
  }
  .tips {
    font-size: 14px;
    color: @text-color;
    line-height: 22px;
  }
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
      &.big {
        height: 80px;
      }
      .userInfoTitle {
        width: 100px;
        font-size: 14px;
        color: @tl-black;
      }
      .userInfoDesc {
        font-size: 14px;
        color: @tl-black;
        flex: 1;
        background: transparent;
        margin: initial;
        padding: 0;
        text-align: left;
        &.arrow::after {
          left: calc(~"100% - 15px");
          border-right: 1px solid #000000;
          border-top: 1px solid #000000;
          border-radius: 0px;
        }
        &::after {
          border: none;
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
        &.unAuth {
          color: #cccccc;
        }
      }
    }
  }
}
</style>
