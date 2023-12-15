<template>
  <div class="ui_chooseInvoice">
     <!-- #ifdef MP -->
     <coustom-head title="申请发票" nativeMode="true"> </coustom-head>
    <!-- #endif -->
    <div class="invoiceBox">
      <p class="InvoiceTitle">开票信息</p>
      <div class="row">
        <p class="title">发票类型</p>
        <div class="invoiceWays">
          <p>增值税普通发票</p>
        </div>
      </div>
      <div class="row-in" @click="showCheckIn()">
        <p class="title">发票抬头</p>
        <div class="desc chooseTitle">
          <!-- {{ invoiceTitle ? invoiceTitle : "请选择发票抬头" }} -->
          <div class="check-info" v-if="current != -1">
            <div class="info-item-name">{{ currentMsg.invoiceTitle }}</div>
            <div v-if="currentMsg.titleType == 'person'">
              <div class="info-item-id-card">
                身份证 {{ currentMsg.uniformSocialCode }}
              </div>
              <div class="info-item-id-card">类型 个人</div>
            </div>
            <div v-else>
              <div class="info-item-id-card">
                税号 {{ currentMsg.taxPayerId }}
              </div>
              <div class="info-item-id-card">类型 公司</div>
            </div>
          </div>
          <div v-if="current == -1" class="select_place">请选择发票抬头</div>
        </div>
        <i class="icon_more iconfont icon-a-16_youlajiantou_hei"></i>
      </div>
    </div>
    <div class="invoiceBox">
      <p class="InvoiceTitle">接收方式</p>
      <div>
        <div class="row row_height">
          <p class="title">发票形式</p>
          <div class="invoiceWays">
            <div
              class="invoiceWay"
              @click="changeInvoiceType(2)"
              v-if="isShowElectronic == 'T'"
            >
              <div
                class="invoice_type"
                v-bind:class="{ active: receiveWay == 2 }"
              >
                电子
              </div>
            </div>
            <div
              class="invoiceWay"
              @click="changeInvoiceType(1)"
              v-if="isShowPaper == 'T'"
            >
              <div
                class="invoice_type"
                v-bind:class="{ active: receiveWay == 1 }"
              >
                纸质
              </div>
            </div>
          </div>
        </div>
      </div>
      <template v-if="receiveWay == 1">
        <div class="row-in" @click="showCheckAddress()">
          <p class="title">收件地址</p>
          <div class="desc chooseTitle">
            <!-- {{ invoiceTitle ? invoiceTitle : "请选择发票抬头" }} -->
            <div class="check-info" v-if="curAddress != -1">
              <div
                class="info-item-name"
                style="line-height: 22px; margin-top: -3px"
              >
                {{ selectAddress.province }} {{ selectAddress.city }}{{ selectAddress.address }}
              </div>
              <div>
                <div class="info-item-id-card">
                  {{ selectAddress.receiver }}
                  {{ selectAddress.mobile.substring(0, 3) }}****{{
                    selectAddress.mobile.substring(7, 11)
                  }}
                </div>
              </div>
            </div>
            <div v-if="curAddress == -1" class="select_place">
              请选择收件地址
            </div>
          </div>
          <i class="icon_more iconfont icon-a-16_youlajiantou_hei"></i>
        </div>
      </template>
      <template v-if="receiveWay == 2">
        <div class="row">
          <p class="title">邮箱</p>
          <input
            type="text"
            placeholder="用来接收电子发票邮件"
            v-model="receiverEmail"
          />
        </div>
      </template>
    </div>
    <div class="tips">
      <div v-if="receiveWay == 2">
        推荐使用电子发票，开票后自动发至电子邮箱。
      </div>
      <div v-if="receiveWay == 1">
        开票后发至您的收件地址，您需承担到付运费。
      </div>
    </div>
    <div class="sendInvoice" @click="applyInvoice()">提交</div>
    <bottom-dialog ref="checkIn" title="选择开票信息">
      <div class="layer-box">
        <div
          class="add-btn"
          @click="toPage('/pagesF/invoice/invoiceInfo?type=' + 'add')"
        >
          <div class="icon icon-add">+</div>
          新增
        </div>
        <div class="info-list">
          <div
            class="info-item"
            v-for="(invoice, invoiceIndex) in invoices"
            :key="invoiceIndex"
          >
            <div class="info-item-lf">
              <div
                class="iconfont icon-a-16_bianji"
                @click="
                  toPage(
                    '/pagesF/invoice/invoiceInfo?editItem=' +
                      encodeURIComponent(JSON.stringify(invoice)) +
                      '&type=' +
                      'edit'
                  )
                "
              ></div>
              <div class="info-item-lf-info">
                <div class="info-item-name">{{ invoice.invoiceTitle }}</div>
                <div v-if="invoice.titleType == 'person'">
                  <div class="info-item-id-card">
                    身份证
                    {{ invoice.uniformSocialCode }}
                  </div>
                  <div class="info-item-id-card">类型 个人</div>
                </div>
                <div v-else>
                  <div class="info-item-id-card">
                    税号 {{ invoice.taxPayerId }}
                  </div>
                  <div class="info-item-id-card">类型 公司</div>
                </div>
              </div>
            </div>
            <div @click="radioChange(invoice)">
              <div
                v-if="invoiceIndex == current"
                class="icon-danxuan_yixuan iconfont"
              ></div>
              <div v-else class="icon-danxuan_weixuan iconfont"></div>
            </div>
          </div>
        </div>
        <div class="layer-footer">
          <div class="layer-btn baseBtn" @click="hideCheckIn()">完成</div>
        </div>
      </div>
    </bottom-dialog>
    <bottom-dialog ref="checkAddress" title="选择收件地址">
      <div class="layer-box">
        <div class="add-btn" @click="editAddress">
          <div class="icon icon-add">+</div>
          新增
        </div>
        <div class="info-list">
          <div
            class="info-item"
            v-for="(item, index) in addressManage"
            :key="index"
          >
            <div class="info-item-lf">
              <div
                class="iconfont icon-a-16_bianji"
                @click="editAddress(item)"
              ></div>
              <div class="info-item-lf-info">
                <div class="info-item-name">
                  {{ item.receiver }} {{ item.mobile.substring(0, 3) }}****{{
                    item.mobile.substring(7, 11)
                  }}
                </div>
                <div>
                  <div class="info-item-id-card">
                    {{ item.address }}
                  </div>
                </div>
              </div>
            </div>
            <div @click="radioAddress(item)">
              <div
                v-if="item.id == curAddress"
                class="icon-danxuan_yixuan iconfont"
              ></div>
              <div v-else class="icon-danxuan_weixuan iconfont"></div>
            </div>
          </div>
        </div>
        <div class="layer-footer">
          <div class="layer-btn baseBtn" @click="hideCheckAddress()">完成</div>
        </div>
      </div>
    </bottom-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import api from "@/utils/api";
import { onLoad } from "@dcloudio/uni-app";
import { makeOrder } from "@/utils/makeOrder";
import { jAlert3 } from "@/base/jAlert/jAlert";
import { urlEncode } from "@/utils/index";
import { onShow } from "@dcloudio/uni-app";
import bottomDialog from "@/components/bottomDialog.vue";
import coustomHead from "@/components/coustomHead.vue";
import UmengSDK from "@/utils/umengAdaptor.js";
import { setStorage, getStorage, removeStorage } from "@/utils/wxuser";
import { mainStore } from "@/store/index";
let wxuser = reactive(getStorage("wxuser"));
let config = getStorage("config");
let user = getStorage("user");
const main = mainStore();
const checkIn = ref();
const checkAddress = ref();
let isShowPaper: any = ref("F");
let isShowElectronic: any = ref("F");
let normalTip: any = ref();
let specialTip: any = ref();
let sumAmount: any = ref();
let receiverEmail: any = ref();
let receiveWay: any = ref(1);
let invoiceTitle: any = ref();
let taxPayerId: any = ref();
let orderType: any = ref();
let orderNo: any = ref();
let productType: any = ref();
let invoices: any = reactive([]);
let currentMsg: any = reactive({});
let current = ref(-1);
let selectAddress: any = reactive({});
const addressManage: any = ref([]);
let curAddress = ref(-1);
const showCheckIn = () => {
  checkIn.value.showDialog();
};
const hideCheckIn = () => {
  checkIn.value.hideDialog();
};
const showCheckAddress = () => {
  checkAddress.value.showDialog();
};
const hideCheckAddress = () => {
  checkAddress.value.hideDialog();
};
const toPage = (link: string) => {
  uni.navigateTo({
    url: link,
  });
};
const radioChange = (data: any) => {
  // for (let i = 0; i < invoices.length; i++) {
  //   if (invoices[i].uuid == data.uuid) {
  //     current.value = i;
  //     currentMsg = Object.assign(currentMsg, invoices[i]);
  //     break;
  //   }
  // }
  saveOrUpdateOrderInvoice(data);
};
const radioAddress = (data: any) => {
  for (let i = 0; i < addressManage.value.length; i++) {
    if (addressManage.value[i].id == data.id) {
      curAddress.value = data.id;
      selectAddress = Object.assign(selectAddress, addressManage.value[i]);
      if (data.email) {
        receiverEmail.value = data.email;
      }
      break;
    }
  }
};
const getInvoiceAmountAndMsg = () => {
  var self = this;
  api
    .getInvoiceAmountAndMsg({
      hotelCode: config.hotelCode,
      hotelGroupCode: config.hotelGroupCode,
      memberId: user.memberId,
      orderNo: orderNo.value,
      orderType: orderType.value,
      // orderNo:'WECHAT2023092100000363',
      // orderType: 'R',
    })
    .then((res: any) => {
      if (res.result == 1) {
        isShowPaper.value = res.retVal.isShowPaper;
        normalTip.value = res.retVal.normalTip;
        specialTip.value = res.retVal.specialTip;
        sumAmount.value = res.retVal.sumAmount;
        isShowElectronic.value = res.retVal.isShowElectronic;
        if (res.retVal.isShowElectronic == "T") {
          receiveWay.value = 2;
        }
      }
    });
};
const applyInvoice = () => {
  if (current.value == -1) {
    jAlert3("请选择发票抬头");
    return false;
  }
  if (receiveWay.value == 2 && !receiverEmail.value) {
    jAlert3("请输入邮箱");
    return false;
  }
  if (receiveWay.value == 1 && curAddress.value == -1) {
    jAlert3("请选择收货地址");
    return false;
  }
  let obj = {
    hotelCode: config.hotelCode,
    hotelGroupCode: config.hotelGroupCode,
    memberId: user.memberId,
    orderNo: orderNo.value,
    orderType: orderType.value,
    receiveWay: receiveWay.value,
    receiverAddress:
      selectAddress.province +
      selectAddress.city +
      selectAddress.address,
    receiverEmail: receiverEmail.value,
    receiverMobile: selectAddress.mobile,
    receiverName: selectAddress.receiver,
  };
  api
    .applyInvoice(obj)
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.resultCode == 0) {
          uni.navigateTo({
            url: `/pagesF/invoice/finishSucceed?type=success&orderNo=${orderNo.value}&productType=${productType.value}`,
          });
        } else {
          jAlert3(res.retVal.resultMessage);
        }
      } else {
        jAlert3(res.msg);
      }
    })
    .finally((e: any) => {
      UmengSDK.sendEvent("cop_submit_invoice", {
        page_name: "invoice_pg",
        button_id: 2101,
        button_name: "提交申请发票",
        invoice_type: currentMsg.titleType,
        invoice_title: currentMsg.invoiceTitle,
        mailbox: receiverEmail.value,
        detail_address:
          selectAddress.province +
          selectAddress.city +
          selectAddress.address,
        invoice_form: receiveWay.value,
      });
    });
};
const saveOrUpdateOrderInvoice = (data: any) => {
  var self = this;
  api
    .saveOrUpdateOrderInvoice({
      hotelCode: config.hotelCode,
      hotelGroupCode: config.hotelGroupCode,
      invoiceUuid: data.uuid,
      memberId: user.memberId,
      orderNo: orderNo.value,
      orderType: orderType.value,
    })
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.resultCode == 0) {
          invoiceTitle.value = data.invoiceTitle;
          taxPayerId.value = data.taxPayerId;
          if (data.email) {
            receiverEmail.value = data.email;
          }
          // self.hideMyInvoice();
          for (let i = 0; i < invoices.length; i++) {
            if (invoices[i].uuid == data.uuid) {
              current.value = i;
              currentMsg = Object.assign(currentMsg, invoices[i]);
              break;
            }
          }
        } else {
          jAlert3(res.retVal.resultMessage);
        }
      } else {
        jAlert3(res.msg);
      }
    });
};
const changeInvoiceType = (type: any) => {
  receiveWay.value = type;
};
const editAddress = (item: any) => {
  let obj = {
    id: "",
  };
  if (item.id) {
    obj.id = item.id;
  }
  main.getEditAddress(item);
  uni.navigateTo({
    url: `/pagesF/address/addAddress?id=${obj.id}`,
  });
};
const getMyInvoices = () => {
  var self = this;
  var memberInvoiceQuery = {
    hotelCode: 0,
    hotelGroupCode: config.hotelGroupCode,
    memberId: user.memberId,
  };
  api.memberInvoice(memberInvoiceQuery).then((data: any) => {
    if (data.result == 1) {
      invoices = Object.assign(invoices, data.retVal);
    }
  });
};
const getManageAddress = () => {
  let obj = {
    hotelGroupId: config.hotelGroupId,
    openid: wxuser.openid,
    hotelGroupCode: config.hotelGroupCode,
    hotelCode: config.hotelCode,
    memberId: "",
  };
  if (user && user.memberId) {
    obj.memberId = user.memberId;
  }
  api.getMemberAddress(obj).then((res: any) => {
    console.log(res);
    if (res.result == 1) {
      addressManage.value = res.retVal;
    }
  });
};
onLoad((options: any) => {
  if (options.orderNo) {
    orderNo.value = options.orderNo;
    orderType.value = options.orderType;
    productType.value = options.productType;
  }
});
onShow(() => {
  getMyInvoices();
  getManageAddress();
  getInvoiceAmountAndMsg();
});
</script>
<style lang="less">
@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");

.ui_chooseInvoice {
  min-height: 100vh;
  background-color: #f2f3f5;
  padding-top: 16px;

  .myInvoiceWrapper {
    width: 100vw;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 98;
    overflow-y: scroll;
  }

  .sendInvoice {
    .baseBtn();
    width: calc(~"100vw - 24px");
    margin: 0 auto;
    // background: #000;
    height: 40px;
    line-height: 40px;
    text-align: center;
    // color: #fff;
    font-size: 16px;
    border-radius: 8px;
  }

  .invoiceBox {
    width: calc(~"100vw - 24px");
    margin: 0 auto;
    padding: 12px;
    background: #fff;
    border-radius: 12px;
    margin-bottom: 12px;
    box-sizing: border-box;
    // padding-bottom: 5px;

    &.notTitle {
      padding-top: 10px;
    }

    .InvoiceTitle {
      font-weight: bold;
      font-size: 14px;
      color: #000;
      height: 46px;
      line-height: 46px;
      border-bottom: 1px solid #eee;
      margin-top: -10px;
    }

    .row {
      min-height: 48px;
      display: flex;
      align-items: center;
      //   justify-content: space-between;
      font-size: 14px;
      color: #000;

      .title {
        width: 88px;
      }
      input {
        // text-align: right;
        flex: 1;
      }
    }
    .row-in {
      padding-top: 12px;
      min-height: 48px;
      display: flex;
      // align-items: center;
      //   justify-content: space-between;
      font-size: 14px;
      color: #000;

      .title {
        width: 88px;
      }
      input {
        // text-align: right;
        flex: 1;
      }
    }
    .chooseTitle {
      // padding: 8px 0;
      .check-info {
        .info-item-name {
          color: #000000;
          font-weight: bold;
          font-size: 14px;
          // line-height: 1;
        }

        .info-item-id-card {
          margin-top: 12px;
          font-size: 12px;
          color: #808080;
        }
      }
    }
    .select_place {
      font-size: 14px;
      letter-spacing: 0px;
      text-align: left;
      color: #cccccc;
    }
    .invoiceWays {
      height: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      // justify-content: flex-end;

      .invoiceWay {
        display: flex;
        align-items: center;
        //   height: 100%;
        //   justify-content: flex-end;

        &:nth-of-type(1) {
          width: 125px;
        }

        &:nth-of-type(2) {
          width: 100px;
        }
        .invoice_type {
          color: #000;
          width: 112px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
        .active {
          font-weight: bold;
          color: #000;
          width: 112px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          border: 1px solid #a43127;
        }
      }
    }

    .row_height {
      height: 70px;
    }
  }
  .icon_more {
    color: #000;
    font-size: 18px;
    margin-left: auto;
  }
  .tips {
    font-size: 14px;
    color: #808080;
    line-height: 22px;
    margin: 16px 16px 32px 16px;
  }
  .layer-box {
    padding-top: 16px;
    // max-height: 90%;
    height: 550px;
    width: 100%;
    background: #f8f8f8;

    .title {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 56px;
      color: #000000;
      font-family: "PingFang SC";
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      border-bottom: 1px solid #eeeeee;

      .icon-a-20_guanbi {
        position: absolute;
        top: 20px;
        left: 22px;
        font-size: 18px;
      }
    }

    .add-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 16px;
      margin-top: 0;
      font-size: 16px;
      border: 0.5px solid #000000;
      height: 48px;
      box-sizing: border-box;
      border-radius: 4px;

      .icon-add {
        font-size: 22px;
        margin-right: 12px;
      }
    }

    .info-list {
      padding: 0 16px 32px;
      max-height: calc(100% - 150px);
      overflow-y: scroll;
      .info-item {
        padding: 16px 12px;
        box-sizing: border-box;
        margin-bottom: 16px;
        display: flex;
        background: #fff;
        border-radius: 8px;
        justify-content: space-between;
        align-items: center;

        .info-item-lf {
          display: flex;
          align-items: center;

          .icon-a-16_bianji {
            margin-right: 12px;
            font-size: 15px;
          }

          .info-item-lf-info {
            .info-item-name {
              color: #000000;
              font-weight: bold;
              font-size: 16px;
              line-height: 1;
            }

            .info-item-id-card {
              margin-top: 12px;
              font-size: 12px;
              color: #808080;
            }
          }
        }

        .icon-danxuan_weixuan,
        .icon-danxuan_yixuan,
        .icon-danxuan_bukexuan {
          font-size: 22px;

          &.icon-danxuan_weixuan {
            color: #808080;
          }

          &.icon-danxuan_yixuan {
            color: #a43127;
          }
        }
      }
    }
  }

  .layer-footer {
    z-index: 10;
    background: #fff;
    padding: 16px;

    .layer-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
    }
  }
}
</style>
