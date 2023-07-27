<template>
  <div class="ui_kfDialog">
    <bottom-dialog :title="title" ref="kfDialog">
      <div class="receive_mian">
        <div class="consult_list" @click="kfAction">
          <div>
            <i class="iconfont icon-a-20_kefu consult_icon"></i>
          </div>
          <div>
            <div class="consult_title">在线客服</div>
            <div class="consult_text">{{desc}}</div>
          </div>
        </div>
        <div class="consult_list" @click="makePhone(phoneNum)">
          <div>
            <i class="iconfont icon-a-20_dianhua consult_icon"></i>
          </div>
          <div>
            <div class="consult_title">电话客服</div>
            <div class="consult_text">{{phoneNum}}</div>
          </div>
        </div>
      </div>
    </bottom-dialog>
  </div>
</template>
<script>
import bottomDialog from "@/components/bottomDialog.vue";
import { getStorage } from "@/utils/wxuser";
import api from "@/utils/api";

let config = getStorage("config");

export default {
  components: {
    bottomDialog,
  },
  data() {
    return {
      phoneNum: "400-0000-830",
      desc: "",
      wxCustomerServiceUrl: "",
      wxCustomerCorpId: "",
    };
  },
  props: {
    title: {
      type: String,
      default: "客服服务",
    },
  },
  methods: {
    kfAction() {
      wx.openCustomerServiceChat({
        extInfo: { url: this.wxCustomerServiceUrl },
        corpId: this.wxCustomerCorpId,
        success(res) {
          console.log(res);
        },
        fail(err) {
          console.log(err);
        },
      });
    },
    getfunctionControl() {
      var codes = [
        "customerServiceInfo",
        "tripContactPhone",
        "wxCustomerServiceUrl",
        "wxCustomerCorpId",
      ];
      var self = this;
      var params = {
        appid: config.appid,
        codes: codes.join(","),
        componentAppid: config.componentAppid,
        hotelCode: config.hotelCode ? config.hotelCode : 0,
        hotelGroupCode: config.hotelGroupCode,
        clientType: "wechat_mini",
      };
      api
        .getMultiSysOptionCommon(params)
        .then((data) => {
          if (data.result == 1) {
            data.retVal.forEach(function (n, i) {
              if (n.code == "customerServiceInfo" && n.value) {
                self.desc = n.value;
              }
              if (n.code == "tripContactPhone" && n.value) {
                self.phoneNum = n.value;
              }
              if (n.code == "wxCustomerServiceUrl" && n.value) {
                self.wxCustomerServiceUrl = n.value;
              }
              if (n.code == "wxCustomerCorpId" && n.value) {
                self.wxCustomerCorpId = n.value;
              }
            });
          }
          if (!self.desc) {
            self.desc = "引导话术引导话术引导话术。";
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    makePhone(phoneNum) {
      uni.makePhoneCall({
        phoneNumber: phoneNum,
      });
    },
    showDialog() {
      this.$refs.kfDialog.showDialog();
    },
    hideDialog() {
      this.$refs.kfDialog.hideDialog();
    },
  },
  mounted() {
    this.getfunctionControl();
  },
  created() {},
};
</script>
<style lang="less" scoped>
@import url("~@/styles/skin.less");
.ui_kfDialog {
  .receive_mian {
    padding: 16px;
    min-height: 50vh;
    .consult_list {
      border-radius: 8px;
      margin-bottom: 12px;
      background: #fff;
      height: 68px;
      display: flex;
      align-items: center;
    }
    .consult_icon {
      margin: 0 12px;
      font-size: 22px;
    }
    .consult_title {
      color: #000;
      font-size: 14px;
      font-weight: 400;
      line-height: 14px;
      letter-spacing: 0px;
      text-align: left;
    }
    .consult_text {
      padding-top: 8px;
      color: #808080;
      font-size: 14px;
      font-weight: 400;
      line-height: 14px;
      letter-spacing: 0px;
      text-align: left;
    }
  }
}
</style>
