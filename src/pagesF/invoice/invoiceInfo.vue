<template>
  <div class="invoiceInfo_ui">
    <!-- #ifdef MP -->
    <coustom-head :title="title" nativeMode="true"> </coustom-head>
    <!-- #endif -->
    <div class="form-infos">
      <div class="form-info">
        <div class="form-inline first_type" v-if="type == 'add'">
          <div class="label">抬头类型</div>
          <div class="val">
            <div class="invoiceWays">
              <div class="invoiceWay mr8" @click="changeInvoiceType(2)">
                <div
                  class="invoice_type"
                  v-bind:class="{ active: receiveWay == 2 }"
                >
                  公司
                </div>
              </div>
              <div class="invoiceWay" @click="changeInvoiceType(1)">
                <div
                  class="invoice_type"
                  v-bind:class="{ active: receiveWay == 1 }"
                >
                  个人
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-inline" v-if="type == 'edit'">
          <div class="label">抬头类型</div>
          <div class="val">
            {{ receiveWay == 1 ? "个人" : "公司" }}
          </div>
        </div>
        <div class="form-inline" v-if="type == 'edit'">
          <div class="label">发票抬头</div>
          <div class="val">
            {{ travelDetail.invoiceTitle }}
          </div>
        </div>
        <div class="form-inline" v-if="type == 'add'">
          <div class="label">发票抬头</div>
          <div class="val">
            <input
              class="input-text"
              type="text"
              v-model="travelDetail.invoiceTitle"
              placeholder="请输入发票抬头"
              placeholder-style="color: #CCCCCC;"
            />
          </div>
        </div>
        <div class="form-inline" v-if="receiveWay == 2">
          <div class="label">税号</div>
          <div class="val">
            <input
              class="input-text"
              type="text"
              v-model="travelDetail.taxPayerId"
              placeholder="请输入税号"
              placeholder-style="color: #CCCCCC;"
            />
          </div>
        </div>
        <div class="form-inline" v-if="receiveWay == 1">
          <div class="label">身份证号</div>
          <div class="val">
            <input
              class="input-text"
              type="text"
              placeholder="请输入身份证号"
              v-model="travelDetail.uniformSocialCode"
              placeholder-style="color: #CCCCCC;"
            />
          </div>
        </div>
        <div class="form-inline">
          <div class="label">收件邮箱</div>
          <div class="val">
            <input
              class="input-text"
              type="text"
              v-model="travelDetail.email"
              placeholder="请输入邮箱地址"
              placeholder-style="color: #CCCCCC;"
            />
          </div>
        </div>
      </div>
      <div
        class="form-info"
        style="margin-top: 12px"
        v-if="receiveWay == 2 && showMore"
      >
        <div class="form-inline">
          <div class="label">注册地址</div>
          <div class="val">
            <input
              class="input-text"
              type="text"
              placeholder="请输入注册地址，选填"
              v-model="travelDetail.regAddress"
              placeholder-style="color: #CCCCCC;"
            />
          </div>
        </div>
        <div class="form-inline">
          <div class="label">注册电话</div>
          <div class="val">
            <input
              class="input-text"
              v-model="travelDetail.companyTel"
              type="text"
              placeholder="请输入注册电话，选填"
              placeholder-style="color: #CCCCCC;"
            />
          </div>
        </div>
        <div class="form-inline">
          <div class="label">开户银行</div>
          <div class="val">
            <input
              class="input-text"
              type="text"
              placeholder="请输入开户银行，选填"
              v-model="travelDetail.bankName"
              placeholder-style="color: #CCCCCC;"
            />
          </div>
        </div>
        <div class="form-inline">
          <div class="label">银行账号</div>
          <div class="val">
            <input
              class="input-text"
              type="text"
              placeholder="请输入银行账号，选填"
              v-model="travelDetail.bankAccount"
              placeholder-style="color: #CCCCCC;"
            />
          </div>
        </div>
      </div>
      <div
        class="more_msg"
        @click="changeShow()"
        v-if="receiveWay == 2 && !showMore"
      >
        详细信息 <i class="icon_more iconfont icon-a-12_xialajiantou_hei"></i>
      </div>
    </div>
    <div class="footer" v-if="type == 'edit'">
      <div class="footer-btn baseBtn" @click="saveGuestBase()">保存</div>
      <div class="del" @click="deleteGuestLinkRelation()">
        <i class="iconfont icon-a-16_shanchulishijilu"></i>
        删除
      </div>
    </div>
    <div class="footer" v-else>
      <div class="footer-btn baseBtn" @click="saveGuestBase()">保存</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, watch } from "vue";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import { onLoad } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import coustomHead from "@/components/coustomHead.vue";
import { jAlert3, jAlert5 } from "@/base/jAlert/jAlert";
import UmengSDK from "@/utils/umengAdaptor.js";
let config = getStorage("config");
let user = getStorage("user");
const type = ref("add");
const id = ref("");
let receiveWay = ref(2);
let title = ref("");
let showMore = ref(false);
const changeInvoiceType = (currentType: any) => {
  if (type.value == "add") {
    receiveWay.value = currentType;
  }
};
const changeShow = () => {
  showMore.value = true;
};
let editData = reactive({});
let editUuid = ref("");
let travelDetail = reactive({
  invoiceTitle: "",
  taxPayerId: "",
  uniformSocialCode: "",
  email: "",
  regAddress: "",
  companyTel: "",
  bankName: "",
  bankAccount: "",
});
var idReg =
  /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
var passportReg = /(\w{8,10}$)/;
var HKandMacauPassportReg = /^([A-Z]\d{6,10}(\w1)?)$/;
var taiwanPassportReg = /(^[a-zA-Z][0-9]{9}$)|(^\d{8}$)/;

watch(
  () => receiveWay,
  (newVal, oldVal) => {},
  {
    deep: true,
  }
);
watch(
  () => travelDetail,
  (newVal, oldVal) => {
    // console.log(newVal, oldVal, "----------oldVal");
  },
  {
    deep: true,
  }
);

const deleteGuestLinkRelation = () => {
  uni.showModal({
    title: "",
    content: "是否删除?",
    cancelText: "否",
    confirmText: "是",
    confirmColor: "#000000",
    success: (res) => {
      if (res.confirm) {
        delInvoice();
      } else {
        // console.log("cancel"); //点击取消之后执行的代码
      }
    },
  });
};
const delInvoice = () => {
  var obj = {
    hotelCode: 0,
    hotelGroupCode: config.hotelGroupCode,
    memberId: user.memberId,
    uuid: editUuid.value,
  };
  api
    .deleteMemberInvoice(obj)
    .then((data: any) => {
      if (data.result == 1) {
        jAlert3("删除成功");
        uni.navigateBack({
          delta: 1,
        });
      } else {
        jAlert3(data.msg);
      }
    })
    .finally((e: any) => {
      UmengSDK.sendEvent("ip_delete_invoice_clk", {
        page_name: "invoice_pg",
        button_id: 2101,
        button_name: "编辑开票信息",
        invoice_title: travelDetail.invoiceTitle,
        invoice_title_type: receiveWay.value == 1 ? "person" : "company",
        certificate_number: travelDetail.uniformSocialCode,
        detail_address: travelDetail.regAddress,
        mailbox: travelDetail.email,
        phone_number: travelDetail.companyTel,
        deposit_bank: travelDetail.bankName,
        bank_account: travelDetail.bankAccount,
        tax_number: travelDetail.taxPayerId,
      });
    });
};
const saveGuestBase = () => {
  let idReg =
    /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
  let emailReg =
    /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
  if (!travelDetail.invoiceTitle) {
    jAlert3("请输入发票抬头");
    return false;
  }
  if (receiveWay.value == 2 && !travelDetail.taxPayerId) {
    jAlert3("请输入税号");
    return false;
  }
  if (receiveWay.value == 1) {
    if (!travelDetail.uniformSocialCode) {
      jAlert3("请输入证件号");
      return false;
    }
    if (!idReg.test(travelDetail.uniformSocialCode)) {
      jAlert3("请输入正确的证件号");
      return false;
    }
  }
  if (!travelDetail.email) {
    jAlert3("请输入邮箱地址");
    return false;
  }
  if (!emailReg.test(travelDetail.email)) {
    jAlert3("请输入正确的邮箱地址");
    return false;
  }
  let obj = {
    memberId: user.memberId,
    hotelGroupCode: config.hotelGroupCode,
    hotelCode: 0,
    bankAccount: travelDetail.bankAccount,
    bankName: travelDetail.bankName,
    companyTel: travelDetail.companyTel,
    earlyPrepare: 0,
    invoiceTitle: travelDetail.invoiceTitle,
    invoice_type: 1,
    isDefault: "F",
    payer: 1,
    postType: 0,
    provider: 1,
    receiverAddress: "",
    regAddress: travelDetail.regAddress,
    taxPayerId: travelDetail.taxPayerId,
    titleType: receiveWay.value == 1 ? "person" : "company",
    uniformSocialCode: travelDetail.uniformSocialCode,
    email: travelDetail.email,
    uuid: "",
  };
  if (editUuid.value) {
    obj.uuid = editUuid.value;
  }
  api.saveOrUpdateMemberInvoice(obj).then((res: any) => {
    if (res.result == 1) {
      jAlert3("保存成功");
      uni.navigateBack({
        delta: 1,
      });
      UmengSDK.sendEvent("ip_compile_invoice_clk", {
        page_name: "invoice_pg",
        button_id: 2101,
        button_name: "编辑开票信息",
        invoice_title: travelDetail.invoiceTitle,
        invoice_title_type: receiveWay.value == 1 ? "person" : "company",
        certificate_number: travelDetail.uniformSocialCode,
        detail_address: travelDetail.regAddress,
        mailbox: travelDetail.email,
        phone_number: travelDetail.companyTel,
        deposit_bank: travelDetail.bankName,
        bank_account: travelDetail.bankAccount,
        tax_number: travelDetail.taxPayerId,
      });
    } else {
      jAlert3(res.msg || res.retVal.msg);
    }
  });
};
onLoad((options: any) => {
  if (options.type == "edit") {
    let editItem = JSON.parse(decodeURIComponent(options.editItem));
    travelDetail = Object.assign(travelDetail, editItem);
    editUuid.value = editItem.uuid;
    receiveWay.value = editItem.titleType == "person" ? 1 : 2;
    type.value = options.type;
    showMore.value = true;
    // uni.setNavigationBarTitle({
    //   title: "编辑开票信息",
    // });
    title.value = "编辑开票信息";
  } else {
    type.value = options.type;
    title.value = "新增开票信息";
    // uni.setNavigationBarTitle({
    //   title: "新增开票信息",
    // });
  }
});
onMounted(() => {});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");

.invoiceInfo_ui {
  .form-infos {
    margin: 0 16px;

    .form-info {
      margin-top: 16px;
      background: #ffffff;
      border-radius: 8px;

      .tl {
        color: #000000;
        font-weight: bold;
        padding: 16px 12px;
        font-size: 14px;
        line-height: 1;
        border-bottom: 1px solid #f8f8f8;
      }

      .form-inline {
        height: 48px;
        display: flex;
        padding: 0 12px;

        &.padding {
          padding-top: 16px;
          padding-bottom: 16px;

          .label {
            height: 40px;
          }
        }

        .label {
          display: flex;
          align-items: center;
          font-size: 14px;
          height: 48px;
          width: 88px;
        }

        .val {
          display: flex;
          align-items: center;
          flex: 1;

          picker {
            width: 100%;
          }

          .picker-box {
            display: flex;
            align-items: center;
            font-size: 14px;

            justify-content: space-between;

            .icon-a-16_youlajiantou_hei {
              color: #000;
            }

            .grey {
              color: #cccccc;
            }
          }

          .radio-box {
            width: 100%;
            display: flex;
            align-items: center;

            .radio-item {
              display: flex;
              align-items: center;
              justify-content: center;
              flex: 1;
              height: 40px;
              border-radius: 4px;
              border: 1px solid #ccc;
              font-size: 14px;

              margin-left: 12px;

              &:first-child {
                margin-left: 0;
              }

              &.invalid {
                color: #cccccc;
                border: 1px solid #ccc;
              }

              &.active {
                font-weight: bold;
                color: @active-color;
              }
            }
          }

          .input-text {
            height: 100%;
            width: 100%;
            font-size: 14px;
            color: #000;
          }

          .text {
            display: flex;
            align-items: center;
            color: #000000;
            font-size: 14px;

            .price {
              color: @active-color;
            }
          }
          .invoiceWays {
            height: 100%;
            flex: 1;
            display: flex;
            align-items: center;
            // justify-content: flex-end;
            .mr8 {
              margin-right: 8px;
            }
            .invoiceWay {
              display: flex;
              align-items: center;
              //   height: 100%;
              //   justify-content: flex-end;
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
        }

        .already-box {
          display: flex;
          align-items: center;
          width: 100%;
          padding-left: 16px;
          background: #f8f8f8;
          border-radius: 4px;
        }

        .check-in-infos {
          width: 100%;

          .check-in-info {
            position: relative;
            padding: 12px;
            box-sizing: border-box;
            margin-top: 8px;
            width: 100%;
            background: #f8f8f8;
            border-radius: 4px;

            .icon-a-16_guanbi_ciji {
              position: absolute;
              right: 12px;
              top: 12px;
              color: #808080;
              font-size: 12px;
            }

            &:first-child {
              margin-top: 0;
            }

            .name {
              font-size: 14px;
              line-height: 1;
            }

            .id-card {
              margin-top: 8px;
              font-size: 12px;
              line-height: 1;
              color: #808080;
            }
          }
        }
      }
      .first_type {
        display: flex;
        align-items: center;
        height: 70px;
        min-height: 70px;
      }
      .add-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 52px;
        width: 100%;
        font-size: 14px;
        color: #000;
      }

      .tips {
        display: flex;
        padding: 16px 12px;
        font-size: 12px;
        line-height: 12px;
        color: #808080;

        .icon-a-16_tishi_hongse {
          margin-right: 5px;
          font-size: 14px;
        }
      }
    }
    .more_msg {
      margin-top: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      font-size: 14px;
      .icon_more {
        margin-left: 4px;
        color: #000;
        font-size: 18px;
      }
    }
  }

  .footer {
    padding: 32px 16px;

    .footer-btn {
      width: 100%;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .del {
      margin-top: 27px;
      display: flex;
      justify-content: center;
      color: #000000;
      font-size: 14px;
      line-height: 14px;

      .icon-a-16_shanchulishijilu {
        margin-right: 6px;
      }
    }
  }
}
</style>
