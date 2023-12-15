<template>
  <div class="dailyOrderDetail_ui">
    <coustom-head
      color="#fff"
      title="订单详情"
      :customClass="reserveOrder.sta == 'X' ? '' : 'customPattern'"
      :bgColor="reserveOrder.sta == 'X' ? '#7f7d75' : ''"
    ></coustom-head>
    <div>
      <template v-for="(item, i) in orderSta" :key="i">
        <div
          class="order-sta"
          v-if="item.val == reserveOrder.sta"
          :class="{ cancelSta: reserveOrder.sta == 'X' }"
          :style="{ paddingTop: navHeight + 'px' }"
        >
          <div class="sta">
            {{ item.name }}
          </div>
          <div
            class="desc"
            v-if="reserveOrder.sta == 'DFK' && reserveOrder.paySta != '8'"
          >
            <template> 请尽快完成支付 </template>
            <template v-if="countdown"> 剩余{{ countdown }} </template>
          </div>
          <div class="desc" v-else>
            {{ item.desc }}
          </div>
        </div>
      </template>
      <template>
        <div class="travel-info" @click="toDetail(reserveOrder.activityInfo)">
          <div class="travel-img">
            <img :src="reserveOrder.indexPicture" class="travel-img-img" />
          </div>
          <div class="travel-rt">
            <div class="travel-name">
              {{ reserveOrder.activityInfo.name }}
            </div>
            <div class="travel-desc">
              适用人数：
              <div
                v-if="
                  reserveOrder.activityInfo.minCapacity ||
                  reserveOrder.activityInfo.maxCapacity
                "
              >
                <span> {{ reserveOrder.activityInfo.minCapacity }}</span>
                <span
                  v-if="
                    reserveOrder.activityInfo.minCapacity &&
                    reserveOrder.activityInfo.maxCapacity
                  "
                  >-</span
                >
                <span>{{ reserveOrder.activityInfo.maxCapacity }}</span>
                <span v-if="reserveOrder.activityInfo.adapterPeople == 'CHILD'"
                  >名儿童</span
                >
                <span v-if="reserveOrder.activityInfo.adapterPeople == 'ADULT'"
                  >名成人</span
                >
                <span
                  v-if="reserveOrder.activityInfo.adapterPeople == 'ALL'"
                ></span>
              </div>
              <div v-else>不限</div>
            </div>
            <div class="travel-time">
              活动时间：
              {{ reserveOrder.bizDatetimeF }}
              {{ reserveOrder.activityInfo.activityBegin }}-{{
                reserveOrder.activityInfo.activityEnd
              }}
            </div>
          </div>
        </div>

        <div class="money_tip" v-if="reserveOrder.sta == 'X'">
          <i class="iconfont icon icon-a-20_hangchengbangzhu1 tip_icon"></i>
          您的款项将在3～7个工作日内按原路返还。
        </div>

        <div class="travelersInfo">
          <div v-if="counponList.length > 0">
            <div class="tl">活动券码</div>

            <div class="counponList">
              <div class="counpon" v-for="(item, i) in counponList" :key="i">
                <div class="counpon-box">
                  <div
                    class="couponNo"
                    :class="{ invalid: item.couponSta != 'WAIT' }"
                  >
                    <div class="tag" v-if="counponList.length > 1">
                      券{{ i + 1 }}
                    </div>
                    <div class="no">{{ item.couponNo }}</div>
                    <div
                      class="iconfont icon-a-12_fuzhi"
                      @click="copy(item.couponNo)"
                      v-if="item.couponSta == 'WAIT'"
                    ></div>
                    <div
                      class="invalid-desc"
                      v-else-if="item.couponSta == 'USED'"
                    >
                      已核销
                    </div>
                    <div
                      class="invalid-desc"
                      v-else-if="item.couponSta == 'OUTDATE'"
                    >
                      已过期
                    </div>
                    <div class="invalid-desc" v-else>已失效</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="all-copy-box" v-if="counponList.length > 1">
            <div class="all-copy" @click="allCopy()">一键复制</div>
          </div> -->
          <div class="explain-item">
            <div class="desc" :class="{ open: moreExplain == 'T' }">
              <!-- <mp-html :content="promotionRule"></mp-html> -->
              <div class="rule" v-if="introduceData.activityCode">
                <div class="rule_title">费用说明</div>
                <div v-html="introduceData.priceExplain"></div>
                <div class="rule_title mrt">温馨提示</div>
                <div v-html="introduceData.extraTips"></div>
                <div class="rule_title mrt">预订条款及取消政策</div>
                <div v-html="introduceData.resrvNotice"></div>
              </div>
            </div>
            <div
              class="open-btn"
              v-if="
                moreExplain == 'F' &&
                (introduceData.priceExplain ||
                  introduceData.extraTips ||
                  introduceData.resrvNotice)
              "
              @click="moreExplain = 'T'"
            >
              展开更多<i class="iconfont icon-a-12_xialajiantou_hei"></i>
            </div>
            <div
              class="open-btn"
              v-else-if="
                introduceData.priceExplain ||
                introduceData.extraTips ||
                introduceData.resrvNotice
              "
              @click="moreExplain = 'F'"
            >
              收起更多<i class="iconfont icon-a-12_shanglajiantou_hei"></i>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="travelersInfo">
      <div class="tl">预定信息</div>
      <div class="checkInInfo">
        <div class="label">预订份数</div>
        <div class="val">
          {{
            reserveOrder.adult +
            reserveOrder.bigChildren +
            reserveOrder.children +
            reserveOrder.baby
          }}份
        </div>
      </div>
      <div class="checkInInfo">
        <div class="label">出行人</div>
        <div class="occupant">
          <div
            v-for="(guest, j) in reserveOrder.guestInfo"
            :key="j"
            class="occ_box"
          >
            <div class="name">
              {{ guest.name }}
              <!-- <div class="ageType" v-if="guest.ageType != 'adult'">
                {{ guest.ageTypeDesc }}
              </div> -->
            </div>
            <div class="id-card">
              {{ idCardType[guest.licenseType || "01"] }} <span>&nbsp;</span>
              {{ hideIdCard(guest.license) }}
              <!-- <span
                v-if="
                  idCardType[guest.licenseType || '01'] == '身份证' ||
                  idCardType[guest.licenseType || '01'] == '临时身份证'
                "
              >
                {{
                  guest.license ? guest.license.substring(0, 3) : ""
                }}************{{
                  guest.license ? guest.license.substring(8, 11) : ""
                }}
              </span>
              <span v-else>
                {{ guest.license ? guest.license.substring(0, 3) : "" }}***{{
                  guest.license ? guest.license.substring(6, 9) : ""
                }}
              </span> -->
            </div>
            <div class="phone">{{ guest.phone }}</div>
          </div>
        </div>
      </div>
      <div class="checkInInfo" v-if="reserveOrder.remark">
        <div class="label">其他需求</div>
        <div class="val">{{ reserveOrder.remark }}</div>
      </div>
    </div>
    <div class="travelersInfo">
      <div class="tl">费用明细</div>
      <div class="travelersInfo-list">
        <template v-if="moreOrderInfo != 'T'">
          <div class="travelersInfo-item total-price">
            <div class="label">订单总价</div>
            <div class="val price">
              <template v-if="payData.rateSum || !payData.point"
                >¥{{
                  payData.exchangeRateSum
                    ? (payData.rateSum - payData.exchangeRateSum).toFixed(2)
                    : payData.rateSum
                }}</template
              ><template v-if="payData.rateSum && payData.point">+</template
              ><template v-if="payData.point">积分{{ payData.point }}</template>
            </div>
          </div>
          <div class="travelersInfo-item">
            <div class="label">计价组合</div>
            <div class="val" v-if="payData.payType == 'CASH'">全现金</div>
            <div class="val" v-else-if="payData.payType == 'INTEGRALCASH'">
              现金+积分
            </div>
            <div class="val" v-else-if="payData.payType == 'INTEGRAL'">
              全积分
            </div>
          </div>
        </template>

        <div class="info-more" v-if="moreOrderInfo == 'T'">
          <template v-if="payData.priceType == 'SINGLE'">
            <div class="price-box">
              <div class="travelersInfo-item total-price">
                <div class="label">订单总价</div>
                <div class="val price">
                  <template v-if="payData.rateSum || !payData.point"
                    >¥{{
                      payData.exchangeRateSum
                        ? (payData.rateSum - payData.exchangeRateSum).toFixed(2)
                        : payData.rateSum
                    }}</template
                  ><template v-if="payData.rateSum && payData.point">+</template
                  ><template v-if="payData.point"
                    >积分{{ payData.point }}</template
                  >
                </div>
              </div>
              <div class="travelersInfo-item">
                <div class="label">计价组合</div>
                <div class="val" v-if="reserveOrder.payType == 'CASH'">
                  全现金
                </div>
                <div
                  class="val"
                  v-else-if="reserveOrder.payType == 'INTEGRALCASH'"
                >
                  现金+积分
                </div>
                <div class="val" v-else-if="reserveOrder.payType == 'INTEGRAL'">
                  全积分
                </div>
              </div>
              <div class="travelersInfo-item">
                <div class="label">产品价合计</div>
                <div class="val">
                  <span v-if="payData.point">
                    ¥{{
                      payData.exchangeRateSum
                        ? (payData.rateSum - payData.exchangeRateSum).toFixed(2)
                        : payData.rateSum
                    }}+{{ payData.point }}积分
                  </span>
                  <span v-else>¥{{ payData.rateSum }}</span>
                </div>
              </div>
              <div class="travelersInfo-item">
                <div class="label">单价</div>
                <div class="val">
                  <span v-if="payData.point">
                    (¥{{
                      payData.exchangeRateSum
                        ? (
                            payData.priceCache -
                            payData.exchangeRateSum /
                              (payData.adult +
                                payData.bigChildren +
                                payData.children +
                                payData.baby)
                          ).toFixed(2)
                        : payData.priceCache
                    }}+{{
                      payData.point /
                      (payData.adult +
                        payData.bigChildren +
                        payData.children +
                        payData.baby)
                    }}积分) x
                    {{
                      payData.adult +
                      payData.bigChildren +
                      payData.children +
                      payData.baby
                    }}份</span
                  >
                  <span v-else>
                    ¥{{ payData.priceCache }} x
                    {{
                      payData.adult +
                      payData.bigChildren +
                      payData.children +
                      payData.baby
                    }}份</span
                  >
                </div>
              </div>
            </div>
            <div class="price-box" v-if="payData.allRateSum">
              <div class="travelersInfo-item total-price">
                <div class="label">权益抵扣</div>
                <div class="val price red">-¥{{ payData.allRateSum }}</div>
              </div>
              <div class="travelersInfo-item" v-if="payData.memberDscAmount">
                <div class="label">
                  {{ payData.memberLevelDesc }}
                  <span v-if="payData.memberDiscount">
                    {{ Number(payData.memberDiscount * 10).toFixed(1) }}折</span
                  >
                </div>
                <div class="val">-¥{{ payData.memberDscAmount }}</div>
              </div>
              <div class="travelersInfo-item" v-if="payData.couponDesc">
                <div class="label">
                  {{ payData.couponDesc }}
                </div>
                <div class="val">-¥{{ payData.couponRateSum }}</div>
              </div>
              <!-- <div class="travelersInfo-item" v-if="payData.alreadyPayMember">
              <div class="label">余额抵扣</div>
              <div class="val">-¥{{ payData.alreadyPayMember }}</div>
            </div> -->
              <div class="travelersInfo-item" v-if="payData.gwDiscount">
                <div class="label">顾问调整</div>
                <div class="val">-¥{{ payData.gwDiscount }}</div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="price-box">
              <div class="travelersInfo-item total-price">
                <div class="label">订单总价</div>
                <div class="val price">
                  <template v-if="payData.rateSum || !payData.point"
                    >¥{{
                      payData.exchangeRateSum
                        ? (payData.rateSum - payData.exchangeRateSum).toFixed(2)
                        : payData.rateSum
                    }}</template
                  ><template v-if="payData.rateSum && payData.point">+</template
                  ><template v-if="payData.point"
                    >积分{{ payData.point }}</template
                  >
                </div>
              </div>
              <div class="travelersInfo-item">
                <div class="label">计价组合</div>
                <div class="val" v-if="reserveOrder.payType == 'CASH'">
                  全现金
                </div>
                <div
                  class="val"
                  v-else-if="reserveOrder.payType == 'INTEGRALCASH'"
                >
                  现金+积分
                </div>
                <div class="val" v-else-if="reserveOrder.payType == 'INTEGRAL'">
                  全积分
                </div>
              </div>
              <div class="travelersInfo-item">
                <div class="label">产品价合计</div>
                <div class="val">
                  <span v-if="payData.point">
                    ¥{{
                      payData.exchangeRateSum
                        ? (payData.rateSum - payData.exchangeRateSum).toFixed(2)
                        : payData.rateSum
                    }}+{{ payData.point }}积分
                  </span>
                  <span v-else>¥{{ payData.rateSum }}</span>
                </div>
              </div>
              <template>
                <div
                  class="travelersInfo-item"
                  v-if="payData.adult && payData.priceCache"
                >
                  <div class="label">含成人</div>
                  <div class="val">
                    <span v-if="payData.point">
                      (¥{{
                        payData.exchangeRateSum
                          ? (
                              payData.priceCache -
                              payData.exchangeRateSum / payData.adult
                            ).toFixed(2)
                          : payData.priceCache
                      }}+{{ payData.point / payData.adult }}积分) x
                      {{ payData.adult }}份</span
                    >
                    <span v-else>
                      ¥{{ payData.priceCache }} x {{ payData.adult }}份</span
                    >
                  </div>
                </div>
                <div
                  class="travelersInfo-item"
                  v-if="payData.bigChildren && payData.bigChildPriceCache"
                >
                  <div class="label">含大童</div>
                  <div class="val">
                    ¥{{ payData.bigChildPriceCache }} x
                    {{ payData.bigChildren }}份
                  </div>
                </div>
                <div
                  class="travelersInfo-item"
                  v-if="payData.children && payData.childPriceCache"
                >
                  <div class="label">含中童</div>
                  <div class="val">
                    ¥{{ payData.childPriceCache }} x {{ payData.children }}份
                  </div>
                </div>
                <div
                  class="travelersInfo-item"
                  v-if="payData.babyPriceCache && payData.baby"
                >
                  <div class="label">含幼童</div>
                  <div class="val">
                    ¥{{ payData.babyPriceCache }} x {{ payData.baby }}份
                  </div>
                </div>
              </template>
            </div>
            <div class="price-box" v-if="payData.allRateSum">
              <div class="travelersInfo-item total-price">
                <div class="label">权益抵扣</div>
                <div class="val price red">-¥{{ payData.allRateSum }}</div>
              </div>
              <div class="travelersInfo-item" v-if="payData.memberDscAmount">
                <div class="label">
                  {{ payData.memberLevelDesc }}
                  <span v-if="payData.memberDiscount">
                    {{ Number(payData.memberDiscount * 10).toFixed(1) }}折</span
                  >
                </div>
                <div class="val">-¥{{ payData.memberDscAmount }}</div>
              </div>
              <div
                class="travelersInfo-item"
                v-for="(item, i) in payData.couponSimpleInfoDtoList"
                :key="i"
                v-if="
                  payData.couponSimpleInfoDtoList &&
                  payData.couponSimpleInfoDtoList.length > 0
                "
              >
                <div class="label">
                  {{ item.descript
                  }}<template v-if="item.num > 1">x{{ item.num }}</template>
                </div>
                <div class="val">-¥{{ item.realValue }}</div>
              </div>

              <!-- <div class="travelersInfo-item" v-if="payData.alreadyPayMember">
              <div class="label">余额抵扣</div>
              <div class="val">-¥{{ payData.alreadyPayMember }}</div>
            </div> -->
              <div class="travelersInfo-item" v-if="payData.gwDiscount">
                <div class="label">顾问调整</div>
                <div class="val">-¥{{ payData.gwDiscount }}</div>
              </div>

              <!-- <div class="travelersInfo-item">
							<div class="label">
								推荐活动礼包
							</div>
							<div class="val">-¥100.00</div>
						</div> -->
            </div>
          </template>
        </div>
        <div class="travelersInfo-item total-price">
          <div class="label">订单金额</div>
          <div class="val price">
            <template v-if="payData.needPay || !payData.point"
              >¥{{ payData.needPay }}</template
            ><template v-if="payData.needPay && payData.point">+</template
            ><template v-if="payData.point">积分{{ payData.point }}</template>
          </div>
        </div>
        <div class="travelersInfo-item" v-if="payData.point">
          <div class="label">使用积分</div>
          <div class="val price red">{{ payData.point }}积分</div>
        </div>
        <div class="travelersInfo-item" v-if="payData.aleadyPayPrice">
          <div class="label">已支付</div>
          <div class="val price red">¥{{ payData.aleadyPayPrice }}</div>
        </div>
        <!-- <div class="travelersInfo-item" v-if="payData.alreadyPayFund">
          <div class="label">已支付（现金）</div>
          <div class="val price red">¥{{ payData.alreadyPayFund }}</div>
        </div>
        <div class="travelersInfo-item" v-if="payData.alreadyPayMember">
          <div class="label">已支付（余额）</div>
          <div class="val price red">¥{{ payData.alreadyPayMember }}</div>
        </div> -->
        <div
          class="travelersInfo-item"
          v-if="reserveOrder.sta == 'DFK' || reserveOrder.sta == 'DQY'"
        >
          <div class="label">待支付</div>
          <div class="val price red">¥{{ payData.readyPay }}</div>
        </div>
        <!-- <div class="travelersInfo-item" v-if="payData.alreadyPayOther">
          <div class="label">其他</div>
          <div class="val price red">¥{{ payData.alreadyPayOther }}</div>
        </div> -->
        <div class="price-box"></div>
        <div v-if="payData.breakMoney && moreOrderInfo == 'T'">
          <div class="travelersInfo-item total-price">
            <div class="label">退款相关</div>
            <div class="val price">¥{{ payData.breakMoney }}</div>
          </div>
          <div class="travelersInfo-item">
            <div class="label">违约金</div>
            <div class="val price red">¥{{ payData.breakMoney }}</div>
          </div>
        </div>
      </div>
      <div
        class="open-btn"
        v-if="moreOrderInfo == 'F'"
        @click="moreOrderInfo = 'T'"
      >
        展开更多<i class="iconfont icon-a-12_xialajiantou_hei"></i>
      </div>
      <div class="open-btn" v-else @click="moreOrderInfo = 'F'">
        收起更多<i class="iconfont icon-a-12_shanglajiantou_hei"></i>
      </div>
    </div>
    <div class="travelersInfo">
      <div class="tl">订单信息</div>
      <div class="travelersInfo-item">
        <div class="label">订单号</div>
        <div class="val" @click="copy(payData.orderNo)">
          {{ payData.orderNo }}<i class="iconfont icon-a-12_fuzhi"></i>
        </div>
      </div>
      <div class="travelersInfo-item">
        <div class="label">下单时间</div>
        <div class="val">{{ reserveOrder.createDatetime }}</div>
      </div>
      <div class="travelersInfo-item" v-if="reserveOrder.payDatetime">
        <div class="label">支付时间</div>
        <div class="val">{{ reserveOrder.payDatetime }}</div>
      </div>
      <div class="travelersInfo-item">
        <div class="label">联系人</div>
        <div class="val">
          {{ reserveOrder.contactMan }} {{ reserveOrder.contactPhone }}
        </div>
      </div>
    </div>
    <div class="travelersInfo" v-if="annexList.length > 0">
      <div class="tl">订单附件</div>
      <div class="annex-list">
        <div
          class="annex-item"
          v-for="(annexItem, annexItemIndex) in annexList"
          :key="annexItemIndex"
          @click="goPage(annexItem.url)"
        >
          <i class="iconfont icon-a-12_fujian"></i>{{ annexItem.name }}.pdf
        </div>
      </div>
    </div>
    <!-- <div
      class="footer"
      v-if="
        reserveOrder.sta == 'I' ||
        reserveOrder.sta == 'O' ||
        reserveOrder.sta == 'DFK' ||
        reserveOrder.sta == 'DQY'
      "
    > -->
    <div class="footer">
      <div class="btns" v-if="reserveOrder.sta != 'DFK'">
        <div v-if="reserveOrder.sta != 'DFK'" class="btn-def" @click="showKf">
          联系客服
        </div>
      </div>

      <div
        class="btns"
        @click="goInvoice"
        v-if="reserveOrder.sta == 'O' && invoiceSta != 'NI'"
      >
        <div class="btn-def">申请开票</div>
      </div>
      <div
        class="btns"
        v-if="reserveOrder.sta == 'DFK' || reserveOrder.sta == 'DQY'"
      >
        <div
          class="btn-def"
          v-if="reserveOrder.sta == 'DFK'"
          @click="showCancel"
        >
          取消订单
        </div>
        <div
          class="btn-def baseBtn"
          v-if="reserveOrder.sta == 'DFK'"
          @click="toPay()"
        >
          确认支付
        </div>
        <!-- <div
          class="btn-def baseBtn"
          v-if="reserveOrder.sta == 'DQY'"
          @click="goPage('/pagesB/travel/tips?orderNo=' + orderNo)"
        >
          确认签约
        </div> -->
      </div>
    </div>
    <kf-dialog ref="kf" title="联系客服"></kf-dialog>
    <travel-dialog ref="travel" :travelType="travelType"></travel-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import api from "@/utils/api";
import coustomHead from "@/components/coustomHead.vue";
import travelDialog from "@/components/travelDialog.vue";
import kfDialog from "@/components/kfDialog.vue";
import { jAlert3, jAlert5 } from "@/base/jAlert/jAlert";
import { getStorage, login } from "@/utils/wxuser";
import { onPageScroll, onLoad, onUnload } from "@dcloudio/uni-app";
import UmengSDK from "@/utils/umengAdaptor.js";
import { goPage } from "@/utils/utils";
import { priceFormat, valFormat, hideIdCard } from "@/utils/filter";
import dayjs from "dayjs";
import CouponList from "@/pagesA/member/couponList.vue";
let user = getStorage("user");
let config = getStorage("config");

const orderNo = ref("");
const kf = ref();
const navHeight = ref("60");
const productType = ref("");
const orderInfo: any = ref({});
const reserveOrder: any = ref({
  activityInfo: <any>{},
});
const counponList: any = ref([]);
const moreExplain = ref("F");
const moreOrderInfo = ref("F");
const countdown: any = ref("");
const intervalId: any = ref(null);
const teamRsvSrcs: any = ref({});
const teamRsvSrcNum = ref(0);
const peopleNumber = ref(0);
const payData: any = ref({});
const isChuZhi: any = ref(false);
const aggregationOrder: any = ref({});
let introduceData: any = ref({});
const promotionRule: any = ref("");
const productDtoList: any = ref([]);
const couponList: any = ref([]);
let annexList = ref<any>([]);
let orderInvoice = ref<any>({});
let invoiceSta = ref("NI");
const travelType = ref("");
const travel = ref();
let idCardType: any = reactive({
  "01": "身份证",
  "02": "临时身份证",
  "14": "护照",
  "21": "港澳通行证",
});
const orderSta = [
  {
    name: "已下单",
    val: "R",
  },
  {
    name: "待使用",
    val: "RW",
    desc: "松赞期待与您相遇。",
  },
  {
    name: "待签约",
    val: "DQY",
  },

  {
    name: "待使用",
    val: "RD",
    desc: "松赞期待与您相遇。",
  },
  {
    name: "待付款",
    val: "DFK",
    desc: "请尽快完成支付。",
  },
  {
    name: "待退款",
    val: "DTK",
    desc: "正在等待后台审核。",
  },
  {
    name: "退款中",
    val: "TKZ",
    desc: "预计3个工作天到账。",
  },

  {
    name: "出行中",
    val: "I",
    desc: "松赞祝您旅途愉快。",
  },
  {
    name: "已完成",
    val: "O",
    desc: "松赞感谢您的支持。",
  },
  {
    name: "已取消",
    val: "X",
    desc: "松赞期待与您相遇。",
  },
  {
    name: "已退款",
    val: "YTK",
    desc: "松赞祝您旅途愉快。",
  },
  {
    name: "待使用",
    val: "3",
    desc: "松赞祝您旅途愉快。",
  },
];
onPageScroll((e) => {
  // console.log(e)
});
const goInvoice = () => {
  if (invoiceSta.value == "CI") {
    uni.navigateTo({
      url: `/pagesF/invoice/applyInvoice?orderNo=${
        orderNo.value
      }&orderType=A&productType=${"activity"}`,
    });
  } else if (invoiceSta.value == "HI") {
    uni.navigateTo({
      url: `/pagesF/invoice/invoiceDetails?orderNo=${
        orderNo.value
      }&orderType=A&productType=${"activity"}`,
    });
  }
};
const getOrderInvoiceSta = () => {
  let orderType = "A";
  api
    .getOrderInvoiceSta({
      hotelCode: config.hotelCode,
      hotelGroupCode: config.hotelGroupCode,
      orderNo: orderNo.value,
      orderType: orderType,
    })
    .then((res: any) => {
      if (res.result == 1) {
        invoiceSta.value = res.retVal.invoiceSta;
        if (invoiceSta.value == "HI") {
          getInvoiceOrder();
        }
      }
    });
};
const getInvoiceOrder = () => {
  api
    .getInvoiceOrder({
      hotelCode: config.hotelCode,
      hotelGroupCode: config.hotelGroupCode,
      orderNo: orderNo.value,
      orderType: "A",
    })
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.resultCode == 0) {
          orderInvoice.value = res.retVal.orderInvoice;
          if (orderInvoice.value.eiinvoicePdfUrl) {
            annexList.value.push({
              name: "发票",
              url: orderInvoice.value.eiinvoicePdfUrl,
            });
          }
        }
      }
      console.log(res);
    });
};
const showDetail = (item: any) => {
  travelType.value = item.productCode;
  travel.value.showDialog();
};
const showKf = () => {
  kf.value.showDialog();
};
const showCancel = () => {
  kf.value.showDialog();
  // uni.showModal({
  //   title: "取消订单",
  //   content: "请再次确认，一经取消将释放活动名额",
  //   cancelText: "重新选择",
  //   confirmText: "确认",
  //   confirmColor: "#000000",
  //   success: (res: any) => {
  //     if (res.confirm) {
  //       // console.log("用户点击确定");
  //       cancleOrder();
  //     } else if (res.cancel) {
  //       // console.log("用户点击取消");
  //     }
  //   },
  // });
};
const cancleOrder = () => {
  api
    .cancelSingleActivityOrder({
      memberNo: user.memberId,
      hotelGroupCode: config.hotelGroupCode,
      hotelCode: config.hotelCode,
      actRsvNo: orderNo.value,
      memberToken: user.memberToken,
    })
    .then((res: any) => {
      if (res.result == 1) {
        jAlert3("取消成功");
        uni.navigateBack({
          delta: 1,
        });
        // getPayDetail();
        // orderDetail();
      }
    });
};
const toDetail = (item: any) => {
  uni.navigateTo({
    url: `/pagesE/dailyActivity/dailyActivityDetail?activityCode=${item.activityCode}`,
  });
};
const toPage = (url: any) => {
  if (!url) {
    return;
  }
  uni.navigateTo({
    url: url,
  });
};
const toPay = () => {
  let type = productType.value || reserveOrder.value.orderType;
  uni.redirectTo({
    url: `/pagesB/other/pay?orderNo=${orderNo.value}&productType=${type}`,
  });
};
const allCopy = () => {
  let couponNos = "";
  counponList.value.forEach((item: any, i: number) => {
    if (i == 0) {
      couponNos += item.couponNo;
    } else {
      couponNos += "   " + item.couponNo;
    }
  });
  copy(couponNos);
};
const copy = (val: string) => {
  uni.setClipboardData({
    data: val,
    success: function () {
      jAlert3("复制成功");
    },
  });
};
const getDateTime = (
  vrDateType: string,
  vrStartDate: string,
  vrEndDate: string,
  vrBeginDay: number,
  vrValidDays: string
) => {
  var goodsTime = "";
  if (vrDateType == "byDate") {
    if (vrEndDate == "") {
      goodsTime = "";
    } else {
      if (dayjs(vrEndDate).format("YYYY") == "2099") {
        goodsTime = "长期有效";
      } else {
        goodsTime =
          dayjs(vrStartDate).format("YYYY.MM.DD") +
          "-" +
          dayjs(vrEndDate).format("YYYY.MM.DD");
      }
    }
  } else if (vrDateType == "2") {
    if (vrBeginDay == 0) {
      goodsTime = "有效期至" + dayjs(vrEndDate).format("YYYY年MM月DD日");
    } else {
      goodsTime =
        "购买后第" +
        vrBeginDay +
        "天生效，有效期至" +
        dayjs(vrEndDate).format("YYYY年MM月DD日");
    }
  } else {
    if (vrBeginDay == 0) {
      goodsTime = "购买后" + vrValidDays + "天内有效";
    } else {
      goodsTime =
        "购买后第" + vrBeginDay + "天生效，有效期" + vrValidDays + "天";
    }
  }
  return goodsTime;
};
const orderDetail = () => {
  uni.showLoading({
    title: "加载中...",
  });
  api
    .activityOrder({
      memberNo: user.memberId,
      hotelGroupCode: config.hotelGroupCode,
      hotelCode: config.hotelCode,
      actRsvNo: orderNo.value,
      memberToken: user.memberToken,
    })
    .then((res: any) => {
      if (res.result == 1) {
        orderInfo.value = res.retVal;
        reserveOrder.value = res.retVal;
        aggregationOrder.value = res.retVal.aggregationOrder;
        // counponList.value = [
        //   { couponNo: res.retVal.verifyCode, couponSta: res.retVal.verifySta },
        // ];
        res.retVal.verifyList.map((item: any) => {
          item.couponNo = item.verifyCode;
          item.couponSta = item.verifySta;
        });
        counponList.value = res.retVal.verifyList;
        if (
          aggregationOrder.value.payStatus == 2 &&
          aggregationOrder.value.orderStatus == 1
        ) {
          reserveOrder.value.sta = "DFK";
        } else {
          if (
            reserveOrder.value.agency == "T" &&
            reserveOrder.value.sta == "R" &&
            reserveOrder.value.isAgency == "F"
          ) {
            reserveOrder.value.sta = "DQY";
          } else if (
            (reserveOrder.value.paySta == "1" ||
              reserveOrder.value.paySta == "8") &&
            (reserveOrder.value.sta == "R" || reserveOrder.value.sta == "W")
          ) {
            reserveOrder.value.sta = "DFK";
          } else if (
            reserveOrder.value.paySta == "2" &&
            (reserveOrder.value.sta == "R" || reserveOrder.value.sta == "W")
          ) {
            reserveOrder.value.sta = "RW";
          } else if (reserveOrder.value.paySta == "4") {
            reserveOrder.value.sta = "DTK";
          } else if (reserveOrder.value.paySta == "5") {
            reserveOrder.value.sta = "YTK";
          } else if (reserveOrder.value.paySta == "7") {
            reserveOrder.value.sta = "YTZ";
          }
        }
        if (
          reserveOrder.value.sta == "DQY" ||
          reserveOrder.value.sta == "DFK"
        ) {
          if (reserveOrder.value.paySta != "8") {
            if (reserveOrder.value.leftTimeSeconds) {
              intervalId.value = setInterval(() => {
                if (reserveOrder.value.leftTimeSeconds > 0) {
                  reserveOrder.value.leftTimeSeconds--;
                  countdown.value = formatSeconds(
                    reserveOrder.value.leftTimeSeconds
                  );
                } else {
                  clearInterval(intervalId.value);
                  reserveOrder.value.sta = "X";
                }
              }, 1000);
            }
          }
        }
        // peopleNumber.value = orderInfo.value.guests.length
        // orderInfo.value.guests.forEach((item : any) => {
        // 	if (teamRsvSrcs.value[item.prmno]) {
        // 		teamRsvSrcs.value[item.prmno].push(item)
        // 	} else {
        // 		teamRsvSrcNum.value++
        // 		teamRsvSrcs.value[item.prmno] = []
        // 		teamRsvSrcs.value[item.prmno].push(item)
        // 	}
        // })
        // if (
        //   orderInfo.value.itineraryInfos[0].teamItineraries[0].teamRsvSrcs
        //     .length > 0
        // ) {
        //   teamRsvSrcs.value =
        //     orderInfo.value.itineraryInfos[0].teamItineraries[0].teamRsvSrcs;
        //   if (teamRsvSrcs.value && teamRsvSrcs.value.length) {
        //     teamRsvSrcs.value.forEach((item: any) => {
        //       peopleNumber.value += item.guests.length;
        //     });
        //   }
        // }
        reserveOrder.value.indexPicture =
          reserveOrder.value.activityInfo.indexPicture;
        reserveOrder.value.bizDatetimeF = dayjs(
          reserveOrder.value.bizDatetime
        ).format("YYYY.MM.DD");
        // reserveOrder.value.endDateF = dayjs(reserveOrder.value.endDate).format(
        //   "YYYY.MM.DD"
        // );
        getIntroduce(reserveOrder.value);
      }
    })
    .finally(() => {
      uni.hideLoading();
      queryPayDetail();
    });
};
const hideIdCard = (val: any) => {
  if (val) {
    var length = val.length;
    var newData = hideCode(val, 6, length - 2);
    return newData;
  }
};
const hideCode = (str: string, beginStr: number, endStr: number) => {
  var len = str.length;
  if (len < beginStr || len < endStr) {
    return str;
  }
  var leftStr = str.substring(0, beginStr);
  var rightStr = str.substring(endStr, len);
  var str = "";
  var i = 0;
  try {
    for (i = 0; i < endStr - beginStr; i++) {
      str = str + "*";
    }
  } catch (error) {}
  str = leftStr + str + rightStr;
  return str;
};
const formatSeconds = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedHours}小时${formattedMinutes}分${formattedSeconds}秒`;
};
const getPayDetail = () => {
  api
    .getPayDetail({
      memberNo: user.memberId,
      hotelGroupCode: config.hotelGroupCode,
      hotelCode: config.hotelCode,
      actRsvNo: orderNo.value,
      memberToken: user.memberToken,
    })
    .then((res: any) => {
      if (res.result == 1) {
        payData.value = res.retVal;
        let couponNameStr = res.retVal.couponName
          ? res.retVal.couponName.split(",")
          : [];
        let couponNoStr = res.retVal.couponNo
          ? res.retVal.couponNo.split(",")
          : [];
        let couponDisPriceStr = res.retVal.couponDisPriceStr
          ? res.retVal.couponDisPriceStr.split(",")
          : [];
        let couponArr: any = [];
        couponNameStr.map((item: any, index: any) => {
          let obj = {
            couponName: item,
            couponNo: couponNoStr[index],
            couponDisPriceStr: couponDisPriceStr[index],
          };
          couponArr.push(obj);
        });
        couponList.value = couponArr;
        isChuZhi.value = res.retVal.payTypes.includes("chuzhi") ? true : false;
      }
    });
};
const queryPayDetail = () => {
  let obj: any = {
    unitCode: config.hotelGroupCode,
    otaChannel: "wechat",
    ota: "DIRECT",
    isGroup: "T",
    payType: reserveOrder.value.payType,
    orderNo: orderNo.value,
    cardLevel: user.cardLevel,
    cardType: user.cardType,
    memberId: user.memberId,
  };

  api
    .interfaceTransfer({
      query: obj,
      config: {
        interfaceType: "POST",
        interfaceModule: "GC_TRAVEL_ORDER",
        interfaceMethod: "/api/reserve/order/queryPayDetail",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        payData.value = res.retVal.retVal;
        if (payData.value.activityRateSumDto) {
          payData.value = Object.assign(
            payData.value,
            payData.value.activityRateSumDto
          );
        }
        payData.value.needPay = Number(
          (
            payData.value.rateSum -
            payData.value.memberDscAmount -
            payData.value.couponRateSum -
            payData.value.exchangeRateSum -
            payData.value.gwDiscount
          ).toFixed(2)
        );
        payData.value.aleadyPayPrice = Number(
          (
            payData.value.alreadyPayFund +
            payData.value.alreadyPayMember +
            payData.value.alreadyPayOther
          ).toFixed(2)
        );
        console.log(
          payData.value.aleadyPayPrice,
          " payData.value.aleadyPayPrice-------"
        );
        payData.value.allRateSum = Number(
          (
            payData.value.memberDscAmount +
            payData.value.couponRateSum +
            payData.value.gwDiscount
          ).toFixed(2)
        );
        // payData.value.rateSum = Number(
        //   (payData.value.rateSum - payData.value.exchangeRateSum).toFixed(2)
        // );
        if (
          payData.value.couponSimpleInfoDtoList &&
          payData.value.couponSimpleInfoDtoList.length > 0
        ) {
          payData.value.couponDesc = "";
          payData.value.couponSimpleInfoDtoList.forEach(
            (item: any, i: number) => {
              if (i == payData.value.couponSimpleInfoDtoList.length - 1) {
                if (item.num > 1) {
                  payData.value.couponDesc += `${item.descript} x${item.num}`;
                } else {
                  payData.value.couponDesc += `${item.descript}`;
                }
              } else {
                if (item.num > 1) {
                  payData.value.couponDesc += `${item.descript} x${item.num};`;
                } else {
                  payData.value.couponDesc += `${item.descript};`;
                }
              }
            }
          );
        }
        UmengSDK.sendPV({
          price: payData.value.rateSum,
          order_name: reserveOrder.value.productDesc,
          order_type: reserveOrder.value.orderTypeDesc,
          start_date: reserveOrder.value.beginDate,
          end_date: reserveOrder.value.endDate,
          trip_people_count: peopleNumber.value,
          travel_path: "",
          room_count: teamRsvSrcNum.value,
          preferential_scheme: reserveOrder.value.payType,
          is_installment: "",
          order_id: orderNo.value,
        });
      }
    });
};
//获取预定介绍
const getIntroduce = (item: any) => {
  api
    .interfaceTransfer({
      config: {
        interfaceType: "GET",
        interfaceModule: "GC_ACTIVITIES_CENTER",
        interfaceMethod: "api/activity/getOneActivityIntroduce",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
      query: {
        unitCode: config.hotelGroupCode,
        activityCode: item.activityInfo.activityCode,
        activityName: item.activityInfo.name,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        introduceData.value = res.retVal.retVal;
      }
    });
};
onUnload(() => {
  clearInterval(intervalId.value);
});
onLoad((optios: any) => {
  orderNo.value = optios.orderNo;
  if (optios.productType) {
    productType.value = optios.productType;
  }
});
onMounted(() => {
  uni.getSystemInfo({
    success: (res: any) => {
      navHeight.value = res.statusBarHeight + 60;
    },
    fail(err) {
      console.log(err);
    },
  });
  getPayDetail();
  orderDetail();
  getOrderInvoiceSta();
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");
.dailyOrderDetail_ui {
  line-height: 1;
  padding-bottom: 100px;
  .money_tip {
    color: #db8900;
    margin: 12px 16px;
    background: rgba(219, 137, 0, 0.12);
    height: 40px;
    border-radius: 8px;
    font-size: 14px;
    display: flex;
    align-items: center;
    .tip_icon {
      margin: 0 8px 0 16px;
    }
  }
  .order-sta {
    background-image: url(https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/btnBlack.png);
    background-repeat: repeat;
    background-color: #000000;
    background-size: 40px 37.5px;
    padding: 75px 16px 80px;

    &.cancelSta {
      background-color: #7f7d75;
    }

    .sta {
      font-weight: 500;
      font-size: 20px;
      color: #ffffff;
    }

    .desc {
      margin-top: 12px;
      color: #ffffff;
      font-size: 14px;
      opacity: 0.8;
    }
  }

  .travel-info {
    margin: -46px 16px 0;
    display: flex;
    padding: 16px 12px;
    border-radius: 8px;
    background: #fff;

    .travel-img {
      width: 80px;
      height: 80px;
      margin-right: 12px;

      .travel-img-img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }

    .travel-rt {
      .travel-name {
        margin-top: 8px;
        font-size: 16px;
        color: #000000;
        font-weight: bold;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        line-height: 1;
      }

      .travel-desc {
        display: flex;
        margin-top: 12px;
        color: #808080;
        font-size: 12px;
      }

      .travel-time {
        margin-top: 8px;
        color: #808080;
        font-size: 12px;
      }

      .travel-num {
        margin-top: 8px;
        color: #808080;
        font-size: 12px;
      }
    }
  }

  .travelersInfo {
    margin: 12px 16px 0;
    padding: 16px 0;
    border-radius: 8px;
    background: #fff;

    .tl {
      font-style: normal;
      font-weight: bold;
      color: #000000;
      padding-left: 12px;
      padding-bottom: 16px;
      border-bottom: 0.5px solid #eeeeee;
    }

    .counponList {
      margin: 0 12px;

      .counpon {
        margin-top: 16px;
        padding: 16px 6px;
        background: #f8f8f8;
        border-radius: 12px;
        .counpon-box {
          display: flex;
          justify-content: center;

          &.pack {
            justify-content: flex-start;
          }
        }

        .couponNo {
          display: flex;
          align-items: center;

          &.invalid {
            .no {
              text-decoration: line-through;
              color: #ccc;
            }

            .tag {
              color: #ccc;
            }

            .invalid-desc {
              margin-left: 8px;
              color: #ccc;
              font-size: 12px;
            }
          }

          .tag {
            margin-right: 8px;
            font-size: 12px;
            color: #808080;
          }

          .no {
            color: #000;
            font-size: 18px;
            font-family: Montserrat;
            font-weight: 400;
          }

          .iconfont {
            margin-left: 4px;
            font-size: 12px;
            color: #000;
          }
        }
      }
    }

    .all-copy-box {
      margin-top: 16px;
      display: flex;
      justify-content: center;
    }

    .all-copy {
      padding: 12px 40px;
      color: #000;
      font-size: 14px;
      border: 1px solid #cccccc;
      border-radius: 170px;
    }

    .explain-item {
      margin: 16px 12px 0;
      // white-space: nowrap;
      font-family: PingFang SC;
      font-size: 12px;
      font-style: normal;
      font-family: PingFang SC;
      line-height: 18px;
      color: #808080;

      .desc {
        .rule {
          // padding: 24px 16px;
          font-size: 12px;
          line-height: 18px;
          color: #808080;
          .rule_title {
            margin-bottom: 12px;
            font-size: 12px;
            font-weight: bold;
            line-height: 18px;
            letter-spacing: 0px;
            color: #000;
          }
          .mrt {
            margin-top: 16px;
          }
        }
        &.open {
          max-height: none;
        }

        max-height: 90px;
        overflow: hidden;
      }
    }

    .checkInInfo {
      padding: 0 12px;
      margin-top: 16px;
      display: flex;

      .label {
        margin-right: 12px;
        font-size: 14px;
        width: 68px;
        color: #808080;
      }

      .occupant {
        flex: 1;
        .occ_box {
          margin-bottom: 16px;
        }
        .occ_box:last-child {
          margin-bottom: 0;
        }
        .bed-type {
          color: #000000;
          font-size: 14px;
        }

        .name {
          // margin-top: 16px;
          color: #000000;
          font-size: 14px;
          line-height: 1;
          display: flex;
          color: #000000;
          // font-weight: bold;
          .ageType {
            margin-left: 8px;
            color: #a43127;
            border-radius: 4px;
            background: rgba(164, 49, 39, 0.08);
            padding: 2px 4px;
            font-size: 10px;
            line-height: 1;
            font-weight: normal;
          }
        }

        .id-card {
          margin-top: 8px;
          color: #808080;
          font-size: 12px;
        }

        .phone {
          margin-top: 8px;
          color: #808080;
          font-size: 12px;
        }
      }
    }

    .travelersInfo-item {
      display: flex;
      justify-content: space-between;
      padding: 12px 12px 0;
      &.total-price {
        .label {
          color: #000000;
          font-weight: 600;
        }
        .val {
          font-family: "Montserrat";
          font-weight: 600;
        }
      }
      .label {
        font-size: 14px;
        color: #808080;
        line-height: 22px;
        white-space: nowrap;
        margin-right: 50px;
      }

      .val {
        display: flex;
        align-items: center;
        font-size: 14px;
        line-height: 22px;
        color: #000000;
        text-align: right;

        .icon-a-12_youlajiantou_hui {
          font-size: 12px;
          margin-left: 5px;
        }

        &.price {
          font-family: "Montserrat";
          font-weight: 600;
          font-size: 14px;
        }

        &.red {
          color: #a43127;
        }

        .icon-a-12_fuzhi {
          margin-left: 5px;
        }
      }
    }

    .info-more {
      position: relative;
      padding-bottom: 16px;

      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 12px;
        right: 12px;
        border-bottom: 0.5px solid #eeeeee;
      }
    }
    .open-btn {
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #808080;
      font-size: 14px;

      .icon-a-12_xialajiantou_hei,
      .icon-a-12_shanglajiantou_hei {
        margin-left: 5px;
        font-size: 15px;
      }
    }

    .annex-list {
      padding: 16px 16px 0;
      display: flex;
      flex-wrap: wrap;

      .annex-item {
        display: flex;
        padding: 8px 16px;
        color: #000000;
        font-size: 12px;
        border-radius: 4px;
        border: 1px solid #ccc;
        margin-left: 8px;

        &:last-child {
          margin-left: 0;
        }

        .icon-a-12_fujian {
          margin-right: 5px;
        }
      }
    }
    .annex-list {
      padding: 16px 12px 0;
      display: flex;
      flex-wrap: wrap;

      .annex-item {
        display: flex;
        padding: 8px 16px;
        color: #000000;
        font-size: 12px;
        border-radius: 4px;
        border: 1px solid #ccc;
        margin-left: 8px;

        &:last-child {
          margin-left: 0;
        }

        .icon-a-12_fujian {
          margin-right: 5px;
        }
      }
    }
  }
  .price-box {
    padding: 8px 0;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 12px;
      right: 12px;
      border-bottom: 0.5px solid #eeeeee;
    }
    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      padding-bottom: 0;
      &::after {
        display: none;
      }
    }
  }
  .red {
    color: #a43127 !important;
  }
  .footer {
    display: flex;
    justify-content: flex-end;

    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    border-top: 1px solid #eee;
    padding: 12px 16px;
    z-index: 2;

    .btns {
      display: flex;

      .btn-def {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
        font-size: 16px;
        height: 38px;
        border: 1px solid #1e1e1e;
        border-radius: 4px;
        flex: 1;
        margin: 0 8px;
      }
    }
  }
}
</style>
