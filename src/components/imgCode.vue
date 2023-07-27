<template>
  <div>
    <div class="imgVerifyCodeMask" v-show='dialogState' @click='hideDialog()'>

    </div>
    <div class="dialog" v-show='dialogState'>
      <div class="dialogHead">
        输入图形验证码
        <i class="icon iconfont icon-shangwuguanbi" @click='hideDialog'></i>
      </div>
      <div class="dialogBody grey">
        <input type="number" class='imgVerifyCode' v-model="imgVerifyCode" placeholder="输入验证码">
        <img id="imgVerify" class='imgVerify' :src="path" alt="" @click="getImgVerify">
        <div class="btn" @click="getVerifyCodeNew">提交</div>
      </div>
    </div>
  </div>
</template>
<script>
import api from "@/utils/api";
import { jAlert3 } from "@/base/jAlert/jAlert";
import { genSessionId } from "@/utils/index";
import { getStorage } from "@/utils/wxuser";

var config = {};

export default {
  data() {
    return {
      dialogState: false,
      path: "",
      sessionId: "",
    };
  },
  props: ["ysmState", "phone", "isTap", "isGetVerify", "timeOut"],
  methods: {
    async getVerifyCodeNew() {
      var _this = this;
      let data = await api.verifyIdentifyCode({
        sessionId: _this.sessionId,
        identifyCode: _this.imgVerifyCode,
        ifSendSms: "T",
        mobile: _this.phone,
        hotelGroupCode: config.hotelGroupCode,
        hotelGroupId: config.hotelGroupId,
        hotelCode: config.hotelCode,
        hotelId: config.hotelId || "",
      });

      if (data.result == 1) {
        jAlert3("获取验证码成功");
        _this.hideDialog();
        this.$emit("change-time", {
          isGetVerify: true,
          isTap: true,
          ysmState: false,
          verifyId: data.retVal,
        });
      } else {
        this.$emit("change-time", {
          ysmState: true,
          isTap: false,
          verifyId: "",
        });
        _this.getImgVerify();

        jAlert3(data.msg);
      }
    },
    async getImgVerify() {
      var self = this;
      self.sessionId = genSessionId(24);
      let code = await api.verifyCode({
        sessionId: self.sessionId,
      });
      this.sessionId = code.retVal.sessionId;
      this.path = code.retVal.path;
    },
    showDialog() {
      this.dialogState = !this.dialogState;
    },
    hideDialog() {
      this.dialogState = !this.dialogState;
    },
  },
  mounted() {
    this.getImgVerify();
  },
  created() {
    config = getStorage("config");
  },
};
</script>
<style lang="less" scoped>
@import url("~@/styles/skin.less");
.imgVerifyCodeMask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 101;
  background-color: rgba(0, 0, 0, 0.7);
}
.dialog {
  width: 90%;
  background: #fff;
  position: fixed;
  z-index: 9999;
  top: 20%;
  left: 5%;
  overflow-y: auto;
  margin: 0 auto;
  border-radius: 6px;
}

.dialogHead {
  height: 48px;
  line-height: 48px;
  text-align: center;
  position: relative;
  font-size: 15px;
  color: #333333;
  letter-spacing: 0.23px;
  font-weight: 500;
  border-bottom: 1px solid #eee;
  .icon-shangwuguanbi {
    position: absolute;
    color: #000000;
    font-size: 14px;
    right: 5px;
    top: -10px;
    border: 10px solid transparent;
  }
}

.dialogBody {
  padding: 16px;
  position: relative;
  .imgVerify {
    position: absolute;
    right: 17px;
    top: 18px;
    height: 40px;
    width: 100px;
    z-index: 99;
  }
}
.dialogBody.grey {
  background: #f8f8f8;
}
.dialogBody .imgVerifyCode {
  height: 44px;
  width: calc(~"100% - 10px");
  border: none;
  font-size: 16px;
  color: #333333;
  text-indent: 10px;
  margin-bottom: 12px;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  padding-left: 10px;
}
.dialogBody .btn {
  box-shadow: 0 0px 0px 0;
  transition: all 0.5s;
  background: #000000;
  width: 100%;
  height: 44px;
  line-height: 44px;
  display: inline-block;
  text-align: center;
  color: #fff;
}
</style>
