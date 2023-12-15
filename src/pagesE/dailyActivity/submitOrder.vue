<template>
  <div class="ui_confirmOrder">
    <coustom-head
      color="#fff"
      title="确认订单"
      customClass="customPattern"
    ></coustom-head>
    <div class="travel-info" :style="{ paddingTop: navHeight + 'px' }">
      <div class="name">{{ dailyInfo.title }}</div>
      <div class="time_infos">
        <div class="info">
          <div class="label">预约时间</div>
          <div class="label_name">
            {{ goodsData.toDate }} {{ goodsData.time }}
          </div>
        </div>
      </div>
      <div class="infos hotel_cont" :style="{ height: wrapperHeight }">
        <div class="info">
          <div class="label">适用酒店</div>
          <div>
            <div
              class="hotel_name"
              v-for="(item, index) in dailyInfo.hotels"
              :key="index"
            >
              {{ item.descript }}
            </div>
          </div>
        </div>
        <div
          class="open-btn"
          v-if="isCollapsed && dailyInfo.hotels.length >= 2"
          @click="toggleCollapseHotle"
        >
          展开<i class="iconfont icon-a-12_xialajiantou_hei"></i>
        </div>
        <div
          class="open-btn"
          v-if="!isCollapsed && dailyInfo.hotels.length >= 2"
          @click="toggleCollapseHotle"
        >
          收起<i class="iconfont icon-a-12_shanglajiantou_hei"></i>
        </div>
      </div>
    </div>
    <div class="form-infos">
      <div class="form-info">
        <div class="tl">预订信息</div>
        <div class="form-inline">
          <div class="label">预订份数</div>
          <div class="val end">
            <div class="number">
              <i
                class="iconfont icon-a-20_jian"
                :class="{ invalid: orderNum <= 1 }"
                @click="changeNum('reduce')"
              ></i>
              <div class="num">{{ orderNum }}份</div>
              <i
                class="iconfont icon-a-20_jia"
                :class="{ invalid: orderNum >= goodsData.number }"
                @click="changeNum('add')"
              ></i>
            </div>
          </div>
        </div>
        <div class="form-inline" style="display: none">
          <div class="label">预约时间</div>
          <div class="val">
            <div class="select-box" @click="showOrderLayer()">
              <div class="text" v-if="!goodsData.toDate">请选择预约时间</div>
              <div class="date" v-else>
                {{ goodsData.toDate }} {{ goodsData.time }}
              </div>
              <i class="iconfont icon-a-16_youlajiantou_hei"></i>
            </div>
          </div>
        </div>
        <div class="form-inline padding">
          <div class="label">出行人</div>
          <div class="vals">
            <div class="val" v-if="orderData.rsvDtos.length > 0">
              <div class="check-in-infos">
                <div
                  class="check-in-info"
                  v-for="(guest, j) in orderData.rsvDtos"
                  :key="j"
                >
                  <div
                    class="iconfont icon-a-16_guanbi_ciji"
                    @click="delGuest(orderData.rsvDtos, j)"
                  ></div>
                  <div class="name">
                    {{ guest.name }}
                    <div class="ageType" v-if="guest.ageType != 'adult'">
                      {{ guest.ageTypeDesc }}
                    </div>
                  </div>
                  <div class="id-card">
                    <span> {{ idCardType[guest.idCode] }}</span>
                    <span>&nbsp;</span>
                    {{ hideIdCard(guest.idNo) }}
                    <!-- <span
                      v-if="
                        idCardType[guest.idCode] == '身份证' ||
                        idCardType[guest.idCode] == '临时身份证'
                      "
                    >
                      {{
                        guest.idNo ? guest.idNo.substring(0, 3) : ""
                      }}************{{
                        guest.idNo ? guest.idNo.substring(8, 11) : ""
                      }}
                    </span>
                    <span v-else>
                      {{ guest.idNo ? guest.idNo.substring(0, 3) : "" }}***{{
                        guest.idNo ? guest.idNo.substring(6, 9) : ""
                      }}
                    </span> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="val">
              <div
                class="already-box"
                @click="showCheckIn()"
                v-if="
                  orderData.rsvDtos.length == 0 &&
                  orderData.rsvDtos.length <= orderNum
                "
              >
                + 请选择
              </div>
              <div
                class="already-box2"
                @click="showCheckIn()"
                v-else-if="
                  orderData.rsvDtos.length > 0 &&
                  orderData.rsvDtos.length < orderNum
                "
              >
                + 添加出行人
              </div>
            </div>
          </div>
        </div>
        <div class="form-inline">
          <div class="label">其他需求</div>
          <div class="val">
            <input
              class="textarea-text"
              auto-height
              disable-default-padding="true"
              placeholder="请填写其他需求 (选填)"
              placeholder-style="color: #CCCCCC;"
              v-model="goodsData.remark"
            />
            <!-- <textarea
              class="textarea-text"
              auto-height
              placeholder="请填写其他需求 (选填)"
              placeholder-style="color: #CCCCCC;line-height: 22px;"
              v-model="goodsData.remark"
            ></textarea> -->
          </div>
        </div>
      </div>
      <div class="form-info">
        <div class="tl">联系人</div>
        <div class="form-inline">
          <div class="label">姓名</div>
          <div class="val">
            <input
              class="input-text"
              v-model="orderData.reserveOrderDto.rsvMan"
              type="text"
              placeholder="请输入姓名"
              placeholder-style="color: #CCCCCC;"
            />
          </div>
        </div>
        <div class="form-inline">
          <div class="label">手机号</div>
          <div class="val">
            <input
              class="input-text"
              v-model="orderData.reserveOrderDto.mobile"
              type="text"
              placeholder="请输入手机号"
              maxlength="11"
              placeholder-style="color: #CCCCCC;"
            />
          </div>
        </div>
      </div>
      <div class="form-info" v-if="dailyInfo.priceType != 'FREE'">
        <div class="tl">优惠方案</div>
        <div class="form-inline padding" v-if="dailyInfo.minPriceList">
          <div class="val">
            <div class="radio-warp">
              <radio-box
                class="miniRadio"
                :datas="dailyInfo.minPriceList"
                ref="daysRadio"
                v-model:val="orderData.reserveOrderDto.payType"
                dataKey="payType"
              >
              </radio-box>
            </div>
          </div>
        </div>
        <div
          class="form-inline"
          v-if="
            orderData.reserveOrderDto.payType == 'INTEGRAL' ||
            orderData.reserveOrderDto.payType == 'INTEGRALCASH'
          "
        >
          <div class="label">积分</div>
          <div class="val">
            <div class="select-box">
              <div class="red">
                -{{ payPrice.point ? payPrice.point : 0 }}积分
              </div>
            </div>
          </div>
        </div>
        <div
          class="form-inline"
          v-if="
            (orderData.reserveOrderDto.payType == 'CASH' ||
              orderData.reserveOrderDto.payType == 'INTEGRALCASH') &&
            discountList.length > 1
          "
        >
          <div class="label">折扣</div>
          <div class="val">
            <div class="select-box" @click="showDiscount">
              <div class="text" v-if="!discountType">
                {{ discountList[0].desc
                }}{{ Number(discountList[0].discount * 10).toFixed(1) }}折
              </div>
              <div class="text red" v-else>-¥{{ memberDscAmount }}</div>
              <i
                class="iconfont icon-danxuan_yixuan"
                v-if="isMemberDiscount"
              ></i>
            </div>
            <i class="iconfont icon-a-16_youlajiantou_hei"></i>
          </div>
        </div>
        <div
          class="form-inline"
          v-if="
            orderData.reserveOrderDto.payType == 'CASH' ||
            orderData.reserveOrderDto.payType == 'INTEGRALCASH'
          "
        >
          <div class="label">券包</div>
          <div
            class="val"
            @click="showCoupon()"
            v-if="listCouponDetailNew.length > 0"
          >
            <div class="select-box">
              <div class="text" v-if="currentChooseCoupon.length == 0">
                请选择券包
                <div class="coupon-num">
                  {{ listCouponDetailNew.length }}张可用
                </div>
              </div>
              <div class="text red" v-else>
                -¥{{ coupnoMinsPrice.toFixed(2) }}
              </div>
            </div>
            <i class="iconfont icon-a-16_youlajiantou_hei"></i>
          </div>
          <div class="val" v-else>
            <div class="select-box">
              <div class="text">暂无可用的券</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="rule" v-if="introduceData.activityCode">
      <div class="rule_title">费用说明</div>
      <div v-html="introduceData.priceExplain"></div>
      <div class="rule_title mrt">温馨提示</div>
      <div v-html="introduceData.extraTips"></div>
      <div class="rule_title mrt">预订条款及取消政策</div>
      <div v-html="introduceData.resrvNotice"></div>
    </div>
    <div class="footer_wrap">
      <div class="agreeBox">
        <p class="agreeDesc" @click.stop="toggleAggre">
          <image
            src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/select.png"
            mode=""
            class="iconfont"
            v-if="isAgree"
          />
          <image
            src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/unSelect.png"
            mode=""
            class="iconfont"
            v-else
          />
          我已阅读并同意<span @click.stop="goCodeText" class="userRule"
            >《预约协议》</span
          >
          <i class="iconfont icon-a-12_youlajiantou_hei"></i>
        </p>
      </div>
      <div class="footer">
        <div class="price-info" v-if="orderData.rsvDtos.length <= 0">
          <div class="price">¥----</div>
          <div class="price-tips">填写出行人后可见</div>
        </div>
        <div class="price-info" v-else>
          <div class="price weight" @click="showPriceInfo()">
            <div
              class="price-box"
              :class="{
                'point-box': orderData.reserveOrderDto.payType == 'INTEGRAL',
              }"
              v-if="payPrice.rateSum || payPrice.point"
            >
              <template v-if="orderData.reserveOrderDto.payType == 'CASH'">
                <span>¥{{ payPrice.rateSum.toFixed(2) }}</span>
              </template>
              <template v-if="orderData.reserveOrderDto.payType == 'INTEGRAL'">
                <span>{{ payPrice.point }}积分</span>
              </template>
              <template
                v-if="orderData.reserveOrderDto.payType == 'INTEGRALCASH'"
              >
                <span>¥{{ payPrice.rateSum.toFixed(2) }}</span>
                <!-- <span>¥{{ totalCreditPrice.toFixed(2) }}</span> -->
                <!-- <span>+</span>
                <span>{{ payPrice.point }}积分</span> -->
                <div class="point_footer">{{ payPrice.point }}积分</div>
              </template>
            </div>
            <div v-if="!payPrice.rateSum && !payPrice.point">
              <span v-if="dailyInfo.priceType == 'FREE'">免费</span>
              <span v-else>¥0</span>
            </div>

            <div class="price-detail">
              明细<i class="iconfont icon-a-12_shanglajiantou_hei"></i>
            </div>
          </div>
        </div>
        <div class="submit-btn baseBtn" @click="ordering()">立即预订</div>
      </div>
    </div>
    <bottom-dialog ref="checkIn" title="出行人">
      <div class="layer-box">
        <div class="add-btn" @click="toPage('/pagesB/travel/travelersInfo')">
          <div class="icon icon-add">+</div>
          新增出行人
        </div>
        <div class="info-list">
          <div
            class="info-item"
            v-for="(item, i) in contactsList"
            :key="i"
            @click="chooseContact(item)"
          >
            <div class="info-item-lf">
              <div
                class="iconfont icon-a-16_bianji"
                @click.stop="
                  toPage(
                    '/pagesB/travel/travelersInfo?type=edit&id=' + item.guestId
                  )
                "
              ></div>
              <div class="info-item-lf-info">
                <div class="info-item-name">
                  {{ item.name }}
                  <div class="ageType" v-if="item.ageType != 'adult'">
                    {{ item.ageTypeDesc }}
                  </div>
                </div>
                <div class="info-item-id-card">
                  <span>{{ idCardType[item.idCode] }}</span>
                  <span>&nbsp;</span>
                  {{ hideIdCard(item.idNo) }}
                  <!-- <span
                    v-if="
                      idCardType[item.idCode] == '身份证' ||
                      idCardType[item.idCode] == '临时身份证'
                    "
                  >
                    {{
                      item.idNo ? item.idNo.substring(0, 3) : ""
                    }}************{{
                      item.idNo ? item.idNo.substring(8, 11) : ""
                    }}
                  </span>
                  <span v-else>
                    {{ item.idNo ? item.idNo.substring(0, 3) : "" }}***{{
                      item.idNo ? item.idNo.substring(6, 9) : ""
                    }}
                  </span> -->
                </div>
              </div>
            </div>
            <div
              class="icon-duoxuan_yixuan noCan iconfont"
              v-if="item.activeNotCan"
            ></div>
            <div
              class="icon-duoxuan_yixuan iconfont"
              v-else-if="item.active"
            ></div>
            <div class="icon-duoxuan_weixuan iconfont" v-else></div>
          </div>
        </div>
        <div class="layer-footer">
          <div class="layer-btn baseBtn" @click="hideCheckIn()">完成</div>
        </div>
      </div>
    </bottom-dialog>
    <bottom-dialog ref="couponListLayer" title="选择券包" maxDialog>
      <div class="couponList">
        <div
          class="listItem"
          v-for="(coupon, index) in listCouponDetailNew"
          :key="index"
        >
          <coupon-item
            :couponItem="coupon"
            @chooseCoupon="chooseCoupon"
            :isSelect="isSelect"
            @toggleCoupon="toggleCoupon"
          ></coupon-item>
        </div>
      </div>
      <div class="layer-footer">
        <div class="layer-btn baseBtn" @click="sureCoupon">完成</div>
      </div>
    </bottom-dialog>

    <bottom-dialog ref="priceInfo" title="费用明细" style="z-index: 1">
      <div class="priceInfo">
        <div class="price-item">
          <div class="main noMargin" v-if="productPrice.priceType == 'SINGLE'">
            订单总价
            <div v-if="dailyInfo.priceType != 'FREE'">
              <div
                v-if="orderData.reserveOrderDto.payType == 'CASH'"
                class="price"
              >
                ¥{{
                  payPrice.basicTeamRateSum
                    ? (payPrice.basicTeamRateSum * orderNum).toFixed(2)
                    : 0
                }}
              </div>
              <div
                v-else-if="orderData.reserveOrderDto.payType == 'INTEGRALCASH'"
              >
                ¥{{
                  productPrice.mixPrice
                    ? (productPrice.mixPrice * orderNum).toFixed(2)
                    : 0
                }}
                +{{
                  productPrice.mixCredit
                    ? productPrice.mixCredit * orderNum
                    : 0
                }}积分
              </div>
              <div class="price" v-else>
                <span v-if="payPrice.point">
                  {{
                    productPrice.mixCredit
                      ? productPrice.mixCredit * orderNum
                      : 0
                  }}积分 </span
                ><span v-else>0</span>
              </div>
            </div>
            <div v-else class="price">免费</div>
          </div>
          <div class="main noMargin" v-else>
            订单总价
            <div v-if="dailyInfo.priceType != 'FREE'">
              <div
                v-if="orderData.reserveOrderDto.payType == 'CASH'"
                class="price"
              >
                ¥{{
                  productPrice.price * orderData.reserveOrderDto.adult +
                  productPrice.bigChildPrice *
                    orderData.reserveOrderDto.bigChildren +
                  productPrice.childPrice * orderData.reserveOrderDto.children +
                  productPrice.babyPrice * orderData.reserveOrderDto.baby
                    ? (
                        productPrice.price * orderData.reserveOrderDto.adult +
                        productPrice.bigChildPrice *
                          orderData.reserveOrderDto.bigChildren +
                        productPrice.childPrice *
                          orderData.reserveOrderDto.children +
                        productPrice.babyPrice * orderData.reserveOrderDto.baby
                      ).toFixed(2)
                    : 0
                }}
              </div>
              <div
                v-else-if="orderData.reserveOrderDto.payType == 'INTEGRALCASH'"
              >
                ¥{{
                  productPrice.mixPrice * orderData.reserveOrderDto.adult +
                  productPrice.bigChildPrice *
                    orderData.reserveOrderDto.bigChildren +
                  productPrice.childPrice * orderData.reserveOrderDto.children +
                  productPrice.babyPrice * orderData.reserveOrderDto.baby
                    ? (
                        productPrice.mixPrice *
                          orderData.reserveOrderDto.adult +
                        productPrice.bigChildPrice *
                          orderData.reserveOrderDto.bigChildren +
                        productPrice.childPrice *
                          orderData.reserveOrderDto.children +
                        productPrice.babyPrice * orderData.reserveOrderDto.baby
                      ).toFixed(2)
                    : 0
                }}
                +{{
                  productPrice.mixCredit
                    ? productPrice.mixCredit * orderData.reserveOrderDto.adult
                    : 0
                }}积分
              </div>
              <div class="price" v-else>
                <span v-if="productPrice.credit">
                  {{
                    productPrice.credit
                      ? productPrice.credit * orderData.reserveOrderDto.adult
                      : 0
                  }}积分 </span
                ><span v-else>0</span>
              </div>
            </div>
            <div v-else class="price">免费</div>
          </div>
          <div class="other" v-if="productPrice.priceType == 'SINGLE'">
            产品价合计
            <div v-if="dailyInfo.priceType != 'FREE'">
              <div
                v-if="orderData.reserveOrderDto.payType == 'CASH'"
                class="price"
              >
                ¥{{
                  payPrice.basicTeamRateSum
                    ? (payPrice.basicTeamRateSum * orderNum).toFixed(2)
                    : 0
                }}
              </div>
              <div
                v-else-if="orderData.reserveOrderDto.payType == 'INTEGRALCASH'"
              >
                ¥{{
                  productPrice.mixPrice
                    ? (productPrice.mixPrice * orderNum).toFixed(2)
                    : 0
                }}
                +{{
                  productPrice.mixCredit
                    ? productPrice.mixCredit * orderNum
                    : 0
                }}积分
              </div>
              <div class="price" v-else>
                <span v-if="payPrice.point">
                  {{
                    productPrice.mixCredit
                      ? productPrice.mixCredit * orderNum
                      : 0
                  }}积分 </span
                ><span v-else>0</span>
              </div>
            </div>
            <div v-else class="price">免费</div>
          </div>
          <div class="other" v-else>
            产品价合计
            <div v-if="dailyInfo.priceType != 'FREE'">
              <div
                v-if="orderData.reserveOrderDto.payType == 'CASH'"
                class="price"
              >
                ¥{{
                  productPrice.price * orderData.reserveOrderDto.adult +
                  productPrice.bigChildPrice *
                    orderData.reserveOrderDto.bigChildren +
                  productPrice.childPrice * orderData.reserveOrderDto.children +
                  productPrice.babyPrice * orderData.reserveOrderDto.baby
                    ? (
                        productPrice.price * orderData.reserveOrderDto.adult +
                        productPrice.bigChildPrice *
                          orderData.reserveOrderDto.bigChildren +
                        productPrice.childPrice *
                          orderData.reserveOrderDto.children +
                        productPrice.babyPrice * orderData.reserveOrderDto.baby
                      ).toFixed(2)
                    : 0
                }}
              </div>
              <div
                v-else-if="orderData.reserveOrderDto.payType == 'INTEGRALCASH'"
              >
                ¥{{
                  productPrice.mixPrice * orderData.reserveOrderDto.adult +
                  productPrice.bigChildPrice *
                    orderData.reserveOrderDto.bigChildren +
                  productPrice.childPrice * orderData.reserveOrderDto.children +
                  productPrice.babyPrice * orderData.reserveOrderDto.baby
                    ? (
                        productPrice.mixPrice *
                          orderData.reserveOrderDto.adult +
                        productPrice.bigChildPrice *
                          orderData.reserveOrderDto.bigChildren +
                        productPrice.childPrice *
                          orderData.reserveOrderDto.children +
                        productPrice.babyPrice * orderData.reserveOrderDto.baby
                      ).toFixed(2)
                    : 0
                }}
                +{{
                  productPrice.mixCredit
                    ? productPrice.mixCredit * orderData.reserveOrderDto.adult
                    : 0
                }}积分
              </div>
              <div class="price" v-else>
                <span v-if="productPrice.credit">
                  {{
                    productPrice.credit
                      ? productPrice.credit * orderData.reserveOrderDto.adult
                      : 0
                  }}积分 </span
                ><span v-else>0</span>
              </div>
            </div>
            <div v-else class="price">免费</div>
          </div>
          <div
            class="other"
            v-if="orderNum > 0 && productPrice.priceType == 'SINGLE'"
          >
            <span>单价</span>
            <div
              class="price"
              v-if="orderData.reserveOrderDto.payType != 'INTEGRAL'"
            >
              <span v-if="orderData.reserveOrderDto.payType == 'CASH'">
                ¥{{
                  payPrice.basicTeamRateSum ? payPrice.basicTeamRateSum : 0
                }}
                x {{ orderNum }}份</span
              >
              <span v-if="orderData.reserveOrderDto.payType == 'INTEGRALCASH'">
                ¥({{ productPrice.mixPrice ? productPrice.mixPrice : 0 }}+{{
                  productPrice.mixCredit ? productPrice.mixCredit : 0
                }}积分) x {{ orderNum }}份</span
              >
            </div>
            <div
              class="price"
              v-if="orderData.reserveOrderDto.payType == 'INTEGRAL'"
            >
              {{ productPrice.mixCredit ? productPrice.mixCredit : 0 }}积分 x
              {{ orderNum }}份
            </div>
          </div>
          <div v-else>
            <div v-if="orderData.reserveOrderDto.payType != 'INTEGRAL'">
              <div v-if="orderData.reserveOrderDto.payType == 'CASH'">
                <div
                  v-if="orderData.reserveOrderDto.adult && productPrice.price"
                  class="pric_sty"
                >
                  <div class="left">含成人</div>
                  <div class="right">
                    ¥{{ productPrice.price ? productPrice.price : 0 }} x
                    {{ orderData.reserveOrderDto.adult }}份
                  </div>
                </div>
                <div
                  v-if="
                    orderData.reserveOrderDto.bigChildren &&
                    productPrice.bigChildPrice
                  "
                  class="pric_sty"
                >
                  <div class="left">含大童</div>
                  <div class="right">
                    ¥{{
                      productPrice.bigChildPrice
                        ? productPrice.bigChildPrice
                        : 0
                    }}
                    x {{ orderData.reserveOrderDto.bigChildren }}份
                  </div>
                </div>
                <div
                  v-if="
                    orderData.reserveOrderDto.children &&
                    productPrice.childPrice
                  "
                  class="pric_sty"
                >
                  <div class="left">含中童</div>
                  <div class="right">
                    ¥{{
                      productPrice.childPrice ? productPrice.childPrice : 0
                    }}
                    x {{ orderData.reserveOrderDto.children }}份
                  </div>
                </div>
                <div
                  v-if="
                    orderData.reserveOrderDto.baby && productPrice.babyPrice
                  "
                  class="pric_sty"
                >
                  <div class="left">含幼童</div>
                  <div class="right">
                    ¥{{ productPrice.babyPrice ? productPrice.babyPrice : 0 }} x
                    {{ orderData.reserveOrderDto.baby }}份
                  </div>
                </div>
              </div>
              <div v-if="orderData.reserveOrderDto.payType == 'INTEGRALCASH'">
                <div v-if="orderData.reserveOrderDto.adult" class="pric_sty">
                  <div class="left">含成人</div>
                  <div class="right">
                    (¥{{
                      productPrice.mixPrice ? productPrice.mixPrice : 0
                    }}
                    +{{
                      productPrice.mixCredit ? productPrice.mixCredit : 0
                    }}积分) x {{ orderData.reserveOrderDto.adult }}份
                  </div>
                </div>
                <div
                  v-if="
                    orderData.reserveOrderDto.bigChildren &&
                    productPrice.bigChildPrice
                  "
                  class="pric_sty"
                >
                  <div class="left">含大童</div>
                  <div class="right">
                    ¥{{
                      productPrice.bigChildPrice
                        ? productPrice.bigChildPrice
                        : 0
                    }}
                    x {{ orderData.reserveOrderDto.bigChildren }}份
                  </div>
                </div>
                <div
                  v-if="
                    orderData.reserveOrderDto.children &&
                    productPrice.childPrice
                  "
                  class="pric_sty"
                >
                  <div class="left">含中童</div>
                  <div class="right">
                    ¥{{
                      productPrice.childPrice ? productPrice.childPrice : 0
                    }}
                    x {{ orderData.reserveOrderDto.children }}份
                  </div>
                </div>
                <div
                  v-if="
                    orderData.reserveOrderDto.baby && productPrice.babyPrice
                  "
                  class="pric_sty"
                >
                  <div class="left">含幼童</div>
                  <div class="right">
                    ¥{{ productPrice.babyPrice ? productPrice.babyPrice : 0 }} x
                    {{ orderData.reserveOrderDto.baby }}份
                  </div>
                </div>
              </div>
            </div>
            <div
              class="price"
              v-if="orderData.reserveOrderDto.payType == 'INTEGRAL'"
            >
              <div v-if="orderData.reserveOrderDto.adult" class="pric_sty">
                <div class="left">含成人</div>
                <div class="right">
                  {{ productPrice.credit ? productPrice.credit : 0 }}积分 x
                  {{ orderData.reserveOrderDto.adult }}份
                </div>
              </div>
            </div>
          </div>
          <div
            class="main"
            v-if="
              exchangeSum > 0 && orderData.reserveOrderDto.payType != 'INTEGRAL'
            "
          >
            权益抵扣
            <div class="price redcolor">-¥{{ exchangeSum.toFixed(2) }}</div>
          </div>
          <!-- <div
            class="other"
            v-if="
              payPrice.point > 0 && orderData.reserveOrderDto.payType != 'CASH'
            "
          >
            积分
            <div class="price">+{{ payPrice.point }}积分</div>
          </div> -->
          <div
            class="other"
            v-if="
              memberDscAmount > 0 &&
              orderData.reserveOrderDto.payType != 'INTEGRAL'
            "
          >
            会员折扣
            <div class="price">-¥{{ memberDscAmount }}</div>
          </div>
          <div
            class="other"
            v-if="
              coupnoMinsPrice > 0 &&
              orderData.reserveOrderDto.payType != 'INTEGRAL'
            "
          >
            券包
            <div class="price">-¥{{ coupnoMinsPrice.toFixed(2) }}</div>
          </div>
        </div>
        <div class="footer_wrap">
          <div class="agreeBox">
            <p class="agreeDesc" @click.stop="toggleAggre">
              <image
                src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/select.png"
                mode=""
                class="iconfont"
                v-if="isAgree"
              />
              <image
                src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/unSelect.png"
                mode=""
                class="iconfont"
                v-else
              />
              我已阅读并同意<span @click.stop="goCodeText" class="userRule"
                >《预约协议》</span
              >
              <i class="iconfont icon-a-12_youlajiantou_hei"></i>
            </p>
          </div>
          <div class="footer">
            <div class="price-info">
              <div class="price weight" @click="showPriceInfo()">
                <div
                  class="price-box"
                  :class="{
                    'point-box': payPrice.rateSum <= 0 && payPrice.point >= 0,
                  }"
                  v-if="payPrice.rateSum || payPrice.point"
                >
                  <template v-if="orderData.reserveOrderDto.payType == 'CASH'">
                    <span>¥{{ payPrice.rateSum.toFixed(2) }}</span>
                  </template>

                  <template
                    v-if="orderData.reserveOrderDto.payType == 'INTEGRAL'"
                  >
                    <span>{{ payPrice.point }}积分</span>
                  </template>
                  <template
                    v-if="orderData.reserveOrderDto.payType == 'INTEGRALCASH'"
                  >
                    <span>¥{{ payPrice.rateSum.toFixed(2) }}</span>
                    <!-- <span>¥{{ totalCreditPrice.toFixed(2) }}</span> -->
                    <!-- <span>+</span> -->
                    <!-- <span>{{ payPrice.point }}积分</span> -->
                    <div class="point_footer">{{ payPrice.point }}积分</div>
                  </template>
                </div>
                <div v-if="!payPrice.rateSum && !payPrice.point">
                  <span v-if="dailyInfo.priceType == 'FREE'">免费</span>
                  <span v-else>¥0</span>
                </div>
                <!-- <div v-if="!payPrice.rateSum && !payPrice.point">免费</div> -->
                <div class="price-detail">
                  明细<i class="iconfont icon-a-12_shanglajiantou_hei"></i>
                </div>
              </div>
            </div>
            <div class="submit-btn baseBtn" @click="ordering()">立即预订</div>
          </div>
        </div>
      </div>
    </bottom-dialog>
    <bottom-dialog ref="orderLayer" title="预约时间">
      <div class="order-layer">
        <div class="order-box">
          <div class="booking-date">
            <daily-price
              ref="dailyPrices"
              @change-dailyPrice="changedailyPrice"
            ></daily-price>
          </div>
          <div class="next-btn">
            <div class="btn baseBtn" @click="hideDialog()">完成</div>
          </div>
        </div>
      </div>
    </bottom-dialog>
    <bottom-dialog ref="discountListLayer" title="选择折扣">
      <div class="discount-list">
        <div
          class="discount-item"
          v-for="(item, i) in discountList"
          :key="i"
          @click="chooseDiscount(item)"
        >
          <div class="discount-lf">
            <div class="discount-desc">
              {{ item.desc }}
            </div>
            <div class="discount-val" v-if="item.type">
              {{ Number(item.discount * 10).toFixed(1) }}
              <div class="val-desc">折</div>
            </div>
          </div>
          <div class="select" v-if="isSelect">
            <image
              src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/select.png"
              mode=""
              class="iconfont"
              v-if="item.choosed"
            />
            <image
              src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/unSelect.png"
              mode=""
              class="iconfont"
              v-else
            />
          </div>
        </div>
      </div>
      <div class="layer-footer">
        <div class="layer-btn baseBtn" @click="sureDiscount">完成</div>
      </div>
    </bottom-dialog>
    <calendar
      ref="calendarCompent"
      @change-date="changeDate"
      :checkInDay="fromDate"
      :checkOutDay="toDate"
    >
    </calendar>
  </div>
</template>

<script setup lang="ts">
import { createUrl, goPage, addNum, subtraction } from "@/utils/utils";
import { reactive, ref, computed, onMounted, watch } from "vue";
import { onShow, onLoad } from "@dcloudio/uni-app";
import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import couponItem from "@/components/couponItem.vue";
import bottomDialog from "@/components/bottomDialog.vue";
import coustomHead from "@/components/coustomHead.vue";
import radioBox from "@/components/radioBox.vue";
import dailyPrice from "@/pagesE/components/dailyPrice.vue";
import calendar from "@/components/calendar.vue";
import { jAlert3 } from "@/base/jAlert/jAlert";
import { priceFormat, valFormat, hideIdCard } from "@/utils/filter";
import dayjs from "dayjs";
import UmengSDK from "@/utils/umengAdaptor.js";
let config = getStorage("config");
let user = getStorage("user");
let wxuser = getStorage("wxuser");
let dailyInfo = getStorage("dailyActivityInfo");
const calendarCompent = ref();
const checkIn = ref();
let couponList = ref([]);
const travelNumber = ref(0);
const productType = ref("");
const couponListLayer = ref();
const priceInfo = ref();
const isMemberDiscount = ref(false);
const contactsList: any = ref([]);
const rsvDtoTl = ref("");
const totalCredit: any = ref("");
const totalCreditPrice: any = ref("");
const totalPrice: any = ref("");
const navHeight: any = ref(0);
const singleRoomRateSum = ref(0);
const singleRoomPeople = ref(0); //独占房间人数
const rightsValue = ref(0);
const discountType: any = ref("");
const memberDiscountCode: any = ref();
const discountList: any = ref([]);
const discountListLayer = ref();
const orderNum = ref(1);
let couponNo = ref("");
let currentChooseCoupon: any = ref([]);
let isSelect = ref(true);
let listCouponDetail = ref<any>([]);
let everyDayDetails = ref<any>([]);
let couponCodes = ref("");
let fromDate = ref(dayjs().format("YYYY-MM-DD"));
let toDate = ref(dayjs().add(1, "days").format("YYYY-MM-DD"));
const changeDate = (time: any) => {
  goodsData.fromDate = dayjs(time.checkInDay).format("YYYY.MM.DD");
  goodsData.toDate = dayjs(time.checkOutDay).format("YYYY.MM.DD");
};
let useExchangeCoupon = ref(false);
const showPrice = ref(false);
let isAjax = ref(false);
let canRequest = ref(true);
let isCollapsed = ref(true);
let wrapperHeight = ref(35 + "px");
let bedTypes = reactive([]);
let isAgree = ref(false);
const orderLayer = ref(); //价格日历弹窗
const dailyPrices = ref<HTMLElement | any>();
let introduceData: any = ref({});
let coupnoMinsPrice = ref(0);
let memberDscAmount = ref(0);
let exchangeSum = ref(0);
let payPrice: any = ref({
  basicTeamRateSum: 0, //基本团费
  exchangeRateSum: 0, //抵额
  point: 0, //积分
  rateSum: 0, //订单金额
  memberDscAmount: 0, //会员折扣金额
  couponRateSum: 0, //券抵额
});
let productPrice: any = ref({
  price: 0, //单价/成人价
  priceType: "", //价格模式
  creditPrice: "", //现金抵额
  credit: "", //积分
});
let idCardType: any = reactive({
  "01": "身份证",
  "02": "临时身份证",
  "14": "护照",
  "21": "港澳通行证",
});
let payTypes = reactive([
  {
    id: "CASH",
    name: "现金",
  },
  {
    id: "INTEGRALCASH",
    name: "现金+积分",
  },
  {
    id: "INTEGRAL",
    name: "积分",
  },
]);
let goodsData: any = reactive({
  remark: "",
  fromDate: "",
  toDate: "",
});
let orderData: any = reactive({
  reserveOrderDto: {
    appid: config.appid,
    price: 0,
    integral: 0,
    productUrl: dailyInfo.productUrl,
    unitCode: config.hotelGroupCode,
    orderNo: "",
    otaRsvNo: "",
    teamNo: dailyInfo.travelGroupCode,
    adviceNo: "",
    itineraryCode: dailyInfo.itineraryCode,
    orderType: dailyInfo.orderType,
    orderTypeDesc: dailyInfo.orderTypeDesc,
    orderSource: "",
    orderSubSource: "",
    rsvClass: "",
    rsvMan: user.name,
    otaChannel: "",
    mobile: user.mobile,
    productCode: dailyInfo.travelType,
    productDesc: dailyInfo.title,
    meetingPoint: dailyInfo.meetingPoint,
    memberNo: user.memberId,
    memberId: user.memberId,
    memberLevel: user.memberLevel,
    cardId: user.cardId,
    cardNo: user.cardNo,
    companyNo: "",
    companyDesc: "",
    beginDate: dailyInfo.groupBeginDate,
    endDate: dailyInfo.groupEndDate,
    priceType: "",
    adult: 0,
    bigChildren: 0,
    children: 0,
    baby: 0,
    num: dailyInfo.number,
    realRate: 0,
    rateSum: 0.0,
    singleRoomPrice: 0.0,
    counselor: "",
    isMiniProgram: "",
    isAgency: dailyInfo.isSigning,
    belongMain: "",
    belongSeason: "",
    remark: "",
    payType: "",
  },
  rsvDtos: [],
});
const changedailyPrice = (val: any) => {
  // curDailyPrice.value = val;
  goodsData.onSaleCode = val.onSaleCode;
  goodsData.toDate = val.bizDate;
  goodsData.number = val.sumCapacity;
  goodsData.time = val.time;
  // console.log(val, "val-----------");
  // goodsData.toDate = val
  if (val.onSaleCode) {
    queryPrice(val.onSaleCode);
  }
};
const toggleAggre = () => {
  if (isAgree.value) {
    isAgree.value = false;
  } else {
    isAgree.value = true;
  }
};
const goCodeText = () => {
  let title = "预约协议";
  var obj = {
    title: decodeURIComponent(title),
    code: "reservationProtocol",
  };
  uni.navigateTo({
    url: "/pagesA/other/codeText?" + createUrl(obj),
  });
};
const hideDialog = () => {
  orderLayer.value.hideDialog();
};
const showOrderLayer = () => {
  orderLayer.value.showDialog();
};
const toggleCollapseHotle = () => {
  isCollapsed.value = !isCollapsed.value;
  wrapperHeight.value = isCollapsed.value ? 35 + "px" : "auto";
};
const showDiscount = () => {
  if (useExchangeCoupon.value) {
    if (currentChooseCoupon.value[0].groupCode == "EXCHANGECOUPON") {
      jAlert3("通兑券不能与会员折扣共享");
    } else {
      jAlert3("折扣券不能与会员折扣共享");
    }

    return;
  }
  discountList.value.forEach((item: any) => {
    if (item.type == discountType.value) {
      item.choosed = true;
    } else {
      item.choosed = false;
    }
  });
  discountListLayer.value.showDialog();
};
const hideDiscount = () => {
  discountListLayer.value.hideDialog();
};
let listCouponDetailNew = computed(() => {
  let listCouponDetailNew = JSON.parse(JSON.stringify(listCouponDetail.value));
  for (let index = 0; index < listCouponDetailNew.length; index++) {
    const item = listCouponDetailNew[index];
    let rateMoney = 0;
    if (productPrice.value.priceType == "SINGLE") {
      if (orderData.reserveOrderDto.payType == "CASH") {
        rateMoney = payPrice.basicTeamRateSum * orderNum.value;
      } else {
        rateMoney = productPrice.value.mixPrice * orderNum.value;
      }
    } else {
      if (orderData.reserveOrderDto.payType == "CASH") {
        rateMoney =
          productPrice.value.price * orderData.reserveOrderDto.adult +
          productPrice.value.bigChildPrice *
            orderData.reserveOrderDto.bigChildren +
          productPrice.value.childPrice * orderData.reserveOrderDto.children +
          productPrice.value.babyPrice * orderData.reserveOrderDto.baby;
      } else {
        rateMoney =
          productPrice.value.mixPrice * orderData.reserveOrderDto.adult +
          productPrice.value.bigChildPrice *
            orderData.reserveOrderDto.bigChildren +
          productPrice.value.childPrice * orderData.reserveOrderDto.children +
          productPrice.value.babyPrice * orderData.reserveOrderDto.baby;
      }
    }

    if (rateMoney < item.discountPriceBegin) {
      for (let i = 0; i < currentChooseCoupon.value.length; i++) {
        const coupon = currentChooseCoupon.value[i];

        if (coupon.no == item.no) {
          currentChooseCoupon.value.splice(i, 1);
          i--;
        }
      }
      listCouponDetailNew.splice(index, 1);
      index--;
    }
  }

  return listCouponDetailNew;
});
const guid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
watch(
  () => payPrice.value.basicTeamRateSum,
  (newVal, oldVal) => {
    // queryPayDetail();
    // getDiscountPrice();
    calculatePrice();
  }
);
watch(
  () => currentChooseCoupon.value,
  (newVal, oldVal) => {
    //支付方式
    // queryPayDetail();
    if (currentChooseCoupon.value.length > 0) {
      if (
        currentChooseCoupon.value[0].groupCode == "EXCHANGECOUPON" ||
        currentChooseCoupon.value[0].discountType == "LZ" ||
        currentChooseCoupon.value[0].discountType == "MZ"
      ) {
        useExchangeCoupon.value = true;
        discountType.value = "";
        discountList.value.forEach((discount: any) => {
          discount.choosed = false;
        });
      } else {
        useExchangeCoupon.value = false;
      }
    } else {
      useExchangeCoupon.value = false;
    }
    // getDiscountPrice();
    calculatePrice();
  }
);
watch(
  () => discountType.value,
  (newVal, oldVal) => {
    //会员折扣
    // queryPayDetail();
    // getDiscountPrice();
    calculatePrice();
  }
);
watch(
  () => orderData.reserveOrderDto.payType,
  (newVal, oldVal) => {
    //支付方式
    // orderData.dscAmountInfoDto.payType = orderData.reserveOrderDto.payType
    // if (dailyInfo.priceModel == 'PEOPLE') {
    // 	dailyInfo.priceDtos.forEach((item : any) => {
    // 		if (item.payType == newVal) {
    // 			singleRoomRateSum.value = item.singleSupplement
    // 		}

    // 	})

    // }
    // queryPayDetail();
    // getDiscountPrice();
    calculatePrice();
  }
);
watch(
  () => orderNum.value,
  (newVal, oldVal) => {
    // getDiscountPrice();
    // queryPayDetail();
    calculatePrice();
  }
);
watch(
  () => goodsData.onSaleCode,
  (newVal, oldVal) => {
    // console.log(newVal, "newVal---------");
    queryPrice(newVal);
    // queryPayDetail();
  }
);
watch(
  () => orderData.rsvDtos,
  (newVal, oldVal) => {
    orderData.reserveOrderDto.adult = 0;
    orderData.reserveOrderDto.baby = 0;
    orderData.reserveOrderDto.children = 0;
    orderData.reserveOrderDto.bigChildren = 0;
    orderData.rsvDtos.forEach((guest: any) => {
      if (guest.ageType == "adult") {
        orderData.reserveOrderDto.adult++;
      }
      if (guest.ageType == "baby") {
        orderData.reserveOrderDto.baby++;
      }
      if (guest.ageType == "children") {
        orderData.reserveOrderDto.children++;
      }
      if (guest.ageType == "bigChildren") {
        orderData.reserveOrderDto.bigChildren++;
      }
      orderData.allPeople++;
    });
    // getDiscountPrice();
    calculatePrice();
  },
  { deep: true }
);
watch(
  () => orderData.allPeople,
  (newVal, oldVal) => {
    if (orderData.allPeople) {
      calculatePrice();
    } else {
      showPrice.value = false;
    }
  }
);
const sureDiscount = () => {
  discountType.value = "";
  memberDiscountCode.value = "";
  discountList.value.forEach((discount: any) => {
    if (discount.choosed) {
      discountType.value = discount.type;
      memberDiscountCode.value = discount.code;
    }
  });
  hideDiscount();
};
const chooseDiscount = (item: any) => {
  discountList.value.forEach((discount: any) => {
    discount.choosed = false;
  });
  item.choosed = true;
};
const getDiscountPrice = () => {
  // if (discountType.value && payPrice.value.basicTeamRateSum > 0) {
  //   discountList.value.forEach((discount: any) => {
  //     if (discount.choosed) {
  //       rightsValue.value = discount.discount;
  //     }
  //   });
  //   memberDscAmount.value = Number(
  //     (
  //       Number(1 - rightsValue.value) * Number(payPrice.value.basicTeamRateSum)
  //     ).toFixed(2)
  //   );
  // } else {
  //   memberDscAmount.value = 0;
  // }
  // coupnoMinsPrice.value = 0;
  // currentChooseCoupon.value.forEach((item: any) => {
  //   var currentChoose = item;
  //   if (
  //     currentChoose.discountType == "LZ" ||
  //     currentChoose.discountType == "MZ"
  //   ) {
  //     coupnoMinsPrice.value +=
  //       Number(payPrice.value.basicTeamRateSum) *
  //       Number((1 - Number(currentChoose.discountNum)).toFixed(2));
  //   } else {
  //     if (
  //       Number(Number(currentChoose.discountNum).toFixed(2)) >=
  //       Number(payPrice.value.basicTeamRateSum)
  //     ) {
  //       coupnoMinsPrice.value += Number(payPrice.value.basicTeamRateSum);
  //     } else {
  //       coupnoMinsPrice.value += Number(
  //         Number(currentChoose.discountNum).toFixed(2)
  //       );
  //     }
  //   }
  // });
  // if (
  //   coupnoMinsPrice.value >
  //   Number(payPrice.value.basicTeamRateSum - memberDscAmount.value)
  // ) {
  //   coupnoMinsPrice.value = Number(
  //     payPrice.value.basicTeamRateSum - memberDscAmount.value
  //   );
  // }
  let basicTeamRateSum: any = "";
  if (orderData.reserveOrderDto.payType == "CASH") {
    basicTeamRateSum = payPrice.value.rateSum;
  } else if (orderData.reserveOrderDto.payType == "INTEGRALCASH") {
    basicTeamRateSum = payPrice.value.rateSum;
  }
  if (discountType.value && basicTeamRateSum > 0) {
    discountList.value.forEach((discount: any) => {
      if (discount.choosed) {
        rightsValue.value = discount.discount;
      }
    });
    memberDscAmount.value = Number(
      (Number(1 - rightsValue.value) * Number(basicTeamRateSum)).toFixed(2)
    );
  } else {
    memberDscAmount.value = 0;
  }
  coupnoMinsPrice.value = 0;
  currentChooseCoupon.value.forEach((item: any) => {
    var currentChoose = item;
    if (
      currentChoose.discountType == "LZ" ||
      currentChoose.discountType == "MZ"
    ) {
      coupnoMinsPrice.value +=
        Number(basicTeamRateSum) *
        Number((1 - Number(currentChoose.discountNum)).toFixed(2));
    } else {
      if (
        Number(Number(currentChoose.discountNum).toFixed(2)) >=
        Number(basicTeamRateSum)
      ) {
        coupnoMinsPrice.value += Number(basicTeamRateSum);
      } else {
        coupnoMinsPrice.value += Number(
          Number(currentChoose.discountNum).toFixed(2)
        );
      }
    }
  });
  if (
    coupnoMinsPrice.value > Number(basicTeamRateSum - memberDscAmount.value)
  ) {
    coupnoMinsPrice.value = Number(basicTeamRateSum - memberDscAmount.value);
  }
  getLastPrice();
};
const getLastPrice = () => {
  if (orderData.reserveOrderDto.payType == "CASH") {
    payPrice.value.rateSum =
      payPrice.value.rateSum - memberDscAmount.value - coupnoMinsPrice.value;
    payPrice.value.point = 0;
    exchangeSum.value = memberDscAmount.value + coupnoMinsPrice.value;
    payPrice.value.rateSum =
      payPrice.value.rateSum < 0 ? 0 : payPrice.value.rateSum;
  }
  if (orderData.reserveOrderDto.payType == "INTEGRAL") {
    payPrice.value.rateSum = 0;
    payPrice.value.point = totalCredit.value;
  }
  if (orderData.reserveOrderDto.payType == "INTEGRALCASH") {
    payPrice.value.rateSum =
      payPrice.value.rateSum - memberDscAmount.value - coupnoMinsPrice.value;
    payPrice.value.point = totalCredit.value;
    payPrice.value.rateSum < 0 ? 0 : payPrice.value.rateSum;
    exchangeSum.value = memberDscAmount.value + coupnoMinsPrice.value;
    // totalCreditPrice.value = payPrice.value.rateSum
    // console.log(totalCreditPrice.value,payPrice.value.rateSum,"1111111111111")
  }
};
const showCheckIn = () => {
  // if (orderData.rsvDtos.length > 1) {
  //   rsvDtoTl.value = index;
  // } else {
  //   rsvDtoTl.value = "";
  // }
  // const indexNew: string = rsvDtoTl.value || "1";
  contactsList.value.forEach((item: any) => {
    item.active = false;
    orderData.rsvDtos.forEach((guest: any) => {
      if (guest.guestId == item.guestId) {
        item.active = true;
      }
    });
  });
  checkIn.value.showDialog();
};
const hideCheckIn = () => {
  let chooseGuest = 0;
  contactsList.value.forEach((item: any) => {
    if (item.active || item.activeNotCan) {
      chooseGuest++;
    }
  });
  if (chooseGuest > orderNum.value) {
    jAlert3(`最多选择${orderNum.value}人`);
    return false;
  }
  contactsList.value.forEach((item: any) => {
    if (item.active && !item.activeNotCan) {
      var info = {
        id: item.guestId,
        guestNo: item.guestId,
        name: item.name,
        mobile: item.mobile,
        sex: item.sex,
        ageType: item.ageType,
        age: item.age,
        nation: "",
        rmtype: "",
        // prmno: index,
        isBed: "",
        isHogging: "",
        singleRoomPrice: 0.0,
        idCode: item.idCode,
        idNo: item.idNo,
        remark: "",
      };

      item.activeNotCan = true;
      // orderData.rsvDtos[Number(index) - 1].guestDtos.push(info);
      orderData.rsvDtos.push(item);
    }
  });
  checkIn.value.hideDialog();
};
const showCoupon = () => {
  couponListLayer.value.showDialog();
};
const showPriceInfo = () => {
  priceInfo.value.showDialog();
};
const hidePriceInfo = () => {
  priceInfo.value.hideDialog();
};
const toPage = (link: string) => {
  uni.navigateTo({
    url: link,
  });
};
const sureCoupon = () => {
  currentChooseCoupon.value = [];
  listCouponDetail.value.forEach((n: any, i: number) => {
    if (n.choosed) {
      currentChooseCoupon.value.push(n);
    }
  });
  couponListLayer.value.hideDialog();
};
const chooseCoupon = (data: any) => {
  console.log(data);
};
const toggleCoupon = (item: AnyObject) => {
  listCouponDetail.value.forEach((coupon: any) => {
    if (item.no == coupon.no) {
      if (!coupon.choosed) {
        coupon.choosed = true;
      } else {
        coupon.choosed = false;
      }
    }
  });
  if (item.groupCode == "EXCHANGECOUPON") {
    listCouponDetail.value.forEach((coupon: any) => {
      if (coupon.groupCode != "EXCHANGECOUPON") {
        coupon.choosed = false;
      }
    });
  } else {
    listCouponDetail.value.forEach((coupon: any) => {
      if (item.couponNo != coupon.couponNo) {
        coupon.choosed = false;
      }
    });
  }
};
const showCalendar = () => {
  calendarCompent.value.showDialog();
};
const listGuestLinkExtraInfoWithMemberIdOrOpenId = () => {
  api
    .listGuestLinkExtraInfoWithMemberIdOrOpenId({
      channel: "WECHAT",
      hotelGroupCode: config.hotelGroupCode,
      hotelCode: config.hotelCode,
      memberId: user.memberId,
      openIdType: "WECHAT",
    })
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.result == 0) {
          if (res.retVal.retVal.length) {
            let contacts: any[] = [];
            res.retVal.retVal.forEach((item: any) => {
              item.guestNo = item.guestId;
              item.license = item.idNo;
              item.phone = item.mobile;
              if (item.guestId) {
                if (item.birth) {
                  item.age = dayjs(orderData.reserveOrderDto.endDate).diff(
                    item.birth,
                    "year"
                  );
                }
                if (item.age >= 18) {
                  item.ageType = "adult";
                  item.ageTypeDesc = "成人";
                } else if (item.age >= 12) {
                  item.ageType = "bigChildren";
                  item.ageTypeDesc = "大童";
                } else if (item.age >= 6) {
                  item.ageType = "children";
                  item.ageTypeDesc = "中童";
                } else {
                  item.ageType = "baby";
                  item.ageTypeDesc = "幼童";
                }
                contactsList.value.forEach((contact: any) => {
                  if (item.guestId == contact.guestId) {
                    item.active = contact.active;
                    item.activeNotCan = contact.activeNotCan;
                  }
                });
                contacts.push(item);
              }
            });
            contactsList.value = contacts;
          }
        }
      }
    });
};
const chooseContact = (item: any) => {
  if (item.activeNotCan) {
    return;
  }
  item.active = !item.active;
};

const delGuest = (guestDtos: any, index: number) => {
  contactsList.value.forEach((item: any) => {
    if (item.guestId == guestDtos[index].guestId) {
      item.active = false;
      item.activeNotCan = false;
    }
  });
  guestDtos.splice(index, 1);
};
const changeNum = (numType: string) => {
  if (numType == "add") {
    if (orderNum.value < goodsData.number) {
      orderNum.value++;
    }
  } else {
    if (orderNum.value > 1) {
      orderNum.value--;
    }
  }
};
const listTravelRmclassDto = () => {
  api
    .interfaceTransfer({
      query: {
        unitCode: config.hotelGroupCode,
        isHalt: "T",
      },
      config: {
        interfaceType: "GET",
        interfaceModule: "GC_PRODUCT_JOURNEY",
        interfaceMethod: "/api/itinerary/listTravelRmclassDto",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        res.retVal.retVal.forEach((item: any) => {
          item.name = item.rmclassDescript;
        });
        bedTypes = res.retVal.retVal;
      }
    });
};
const queryCardLevelRightsWithMemberId = () => {
  api
    .interfaceTransfer({
      query: {
        hotelGroupCode: config.hotelGroupCode,
        memberId: user.memberId,
        rightsType: "travelProductsRightsType",
        rightsItem: "discount",
      },
      config: {
        interfaceType: "GET",
        interfaceModule: "GC_PRODUCT_JOURNEY",
        interfaceMethod: "crm/v2/queryCardLevelRightsWithMemberId",
        interfaceFrom: "member",
        hotelGroupCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        if (res.retVal.retVal && res.retVal.retVal.length > 0) {
          rightsValue.value = res.retVal.retVal[0].rightsValue;
        }
      }
    });
};
const getDiscountOfMember = () => {
  api
    .getDiscountOfMember({
      mobile: user.mobile,
      memberId: user.memberId,
      // goodsId: dailyInfo.travelType,
      hotelGroupCode: config.hotelGroupCode,
    })
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.memberDiscount < 1) {
          discountList.value.push({
            discount: res.retVal.memberDiscount,
            type: "member",
            desc: `${user.cardLevelDescript}会员`,
          });
        }
        if (res.retVal.partnerDiscount < 1) {
          discountList.value.push({
            discount: res.retVal.partnerDiscount,
            type: "partner",
            desc: `城市合伙人`,
            partnerId: res.retVal.partnerId,
          });
        }
        discountList.value.push({
          discount: 1,
          type: "",
          desc: `不使用折扣`,
        });
      }
    });
};
const listCouponByUse = () => {
  api
    .interfaceTransfer({
      query: {
        hotelGroupCode: config.hotelGroupCode,
        memberId: user.memberId,
        productCode: dailyInfo.activityCode,
        orderType: "ACTIVITY",
        productPrimaryClassification: dailyInfo.activityClass,
        productReclassify: dailyInfo.activityType,
        beginDate: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        cardNo: user.cardNo,
      },
      config: {
        interfaceType: "POST",
        interfaceModule: "",
        interfaceMethod: "api/coupon/listCouponByUse",
        interfaceFrom: "coupon",
        hotelGroupCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        listCouponDetail.value = [];
        if (res.retVal.retVal && res.retVal.retVal.length > 0) {
          listCouponDetail.value = res.retVal.retVal;
        }
        if (couponNo.value) {
          listCouponDetail.value.forEach((item: any) => {
            if (item.couponNo == couponNo.value) {
              // item.choosed = true
              toggleCoupon(item);
              sureCoupon();
            }
          });
        }
      }
    });
};
const queryPrice = (onSaleCode: any) => {
  let obj: any = {
    unitCode: config.hotelGroupCode,
    activityCode: dailyInfo.activityCode,
    onSaleCode: onSaleCode,
  };
  api
    .interfaceTransfer({
      query: obj,
      config: {
        interfaceType: "GET",
        interfaceModule: "GC_ACTIVITIES_CENTER",
        interfaceMethod: "/api/singleWechat/getPriceDefine",
        interfaceFrom: "GC",
        hotelGroupCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        productPrice.value = res.retVal.retVal;
        // payPrice.value.rateSum = res.retVal.retVal.price * orderNum.value;
        // payPrice.value.basicTeamRateSum =
        //   res.retVal.retVal.price * orderNum.value;
        // payPrice.value.point = res.retVal.retVal.credit * orderNum.value;
        payPrice.value.basicTeamRateSum = res.retVal.retVal.price;
        // showPrice.value = true;
        // getDiscountPrice();
      } else {
        // showPrice.value = false;
      }
    });
};
const queryCardLevelRight = () => {
  let obj: any = {
    unitCode: config.hotelGroupCode,
    hotelGroupCode: config.hotelGroupCode,
    memberId: user.memberId,
    rightsType: "activityProductsRightsType",
  };
  api
    .interfaceTransfer({
      query: obj,
      config: {
        interfaceType: "GET",
        interfaceModule: "GC_ACTIVITIES_CENTER",
        interfaceMethod: "/crm/v2/queryCardLevelRightsWithMemberId",
        interfaceFrom: "member",
        hotelGroupCode: config.hotelGroupCode,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        var i = -1;
        discountList.value = res.retVal.retVal;
        discountList.value.map((item: any) => {
          item.discount = item.rightsValue;
          item.type = "member";
          item.desc = item.rightsItemDescript;
        });
        if (discountList.value.length > 0 && !couponNo.value) {
          chooseDiscount(discountList.value[0]);
          sureDiscount();
        }
        discountList.value.push({
          discount: 1,
          type: "",
          desc: `不使用折扣`,
          code: -1,
        });
      } else {
      }
    });
};
const travelOrdering = () => {
  if (!goodsData.toDate) {
    jAlert3("请选择预约时间");
    return;
  }
  if (orderNum.value < dailyInfo.minSaleSize) {
    jAlert3(`订单最小${dailyInfo.minSaleSize}份起售`);
    return;
  }
  var isPass = true;
  if (orderData.rsvDtos.length != orderNum.value) {
    jAlert3(`预约份数需和出行人数量一致`);
    return;
  } else if (orderData.rsvDtos.length < 1) {
    jAlert3("请选择出行人");
    return;
  }

  if (!orderData.reserveOrderDto.rsvMan) {
    jAlert3("请填写联系人姓名");
    return;
  }
  if (!orderData.reserveOrderDto.mobile) {
    jAlert3("请填写联系人手机号");
    return;
  }
  if (!isAgree.value) {
    jAlert3("请同意协议");
    return false;
  }
  if (orderData.reserveOrderDto.payType == "INTEGRAL") {
    if (payPrice.value.point > user.pointBalance) {
      jAlert3("当前用户积分不够,请换支付方式");
      return;
    }
  }
  if (!canRequest.value) {
    return;
  }
  canRequest.value = false;
  // disType: "member,credit,coupon",
  let currentDisType = "";
  if (orderData.reserveOrderDto.payType == "CASH") {
    if (currentChooseCoupon.value.length > 0 && memberDscAmount.value <= 0) {
      currentDisType = "coupon";
    } else if (
      memberDscAmount.value > 0 &&
      currentChooseCoupon.value.length <= 0
    ) {
      currentDisType = "member";
    } else if (
      memberDscAmount.value > 0 &&
      currentChooseCoupon.value.length > 0
    ) {
      currentDisType = "member,coupon";
    }
  } else if (orderData.reserveOrderDto.payType == "INTEGRAL") {
    currentDisType = "credit";
  } else if (orderData.reserveOrderDto.payType == "INTEGRALCASH") {
    currentDisType = "credit";
    if (currentChooseCoupon.value.length > 0 && memberDscAmount.value <= 0) {
      currentDisType = "coupon,credit";
    } else if (
      memberDscAmount.value > 0 &&
      currentChooseCoupon.value.length <= 0
    ) {
      currentDisType = "member,credit";
    } else if (
      memberDscAmount.value > 0 &&
      currentChooseCoupon.value.length > 0
    ) {
      currentDisType = "member,coupon,credit";
    }
  }
  if (orderData.rsvDtos.length) {
    orderData.rsvDtos.map((item: any) => {
      item.gender = item.sex;
    });
  }
  let opt = {
    activityDesc: dailyInfo.title,
    unitCode: config.hotelGroupCode,
    hotelCode: config.hotelCode,
    hotelGroupCode: config.hotelGroupCode,
    hotelGroupId: config.hotelGroupId,
    cardNo: user.cardNo,
    cardName: user.name,
    memberId: user.memberId,
    cardId: user.cardId,
    cardLevel: user.cardLevel,
    activityCode: dailyInfo.activityCode,
    channel: "WECHAT",
    appid: config.appid,
    guestDtoList: orderData.rsvDtos,
    sta: "W",
    contactMan: orderData.reserveOrderDto.rsvMan,
    contactPhone: orderData.reserveOrderDto.mobile,
    rsvMan: user.name,
    rsvPhone: user.mobile,
    remark: goodsData.remark,
    payType: orderData.reserveOrderDto.payType,
    rateCredit: payPrice.value.point ? payPrice.value.point : 0,
    rateSum: payPrice.value.rateSum ? payPrice.value.rateSum : 0,
    onSaleCode: goodsData.onSaleCode,
    adult: orderData.reserveOrderDto.adult,
    baby: orderData.reserveOrderDto.baby,
    bigChild: orderData.reserveOrderDto.bigChildren,
    child: orderData.reserveOrderDto.children,
    bizDatetime: goodsData.toDate + " " + goodsData.time,
    disType: currentDisType,
    couponNo:
      currentChooseCoupon.value.length > 0 &&
      orderData.reserveOrderDto.payType != "INTEGRAL"
        ? currentChooseCoupon.value[0].couponNo
        : "",
    // memberDiscountCode: discountType.value == -1 ? "" : discountType.value,
    memberDiscountCode:
      memberDiscountCode.value == -1 ? "" : memberDiscountCode.value,
    productUrl: dailyInfo.indexPicture,
    productPrimaryClassification: dailyInfo.activityClass,
    productReclassify: dailyInfo.activityType,
  };
  api
    .saveActivityOrder(opt)
    .then((res: any) => {
      if (res.result == 1) {
        if (res.retVal.orderStatus == "3") {
          toPage(
            `/pagesB/travel/paySuccess?orderNo=${
              res.retVal.orderNo
            }&productType=${"activity"}`
          );
        } else {
          toPage(
            `/pagesB/other/pay?orderNo=${
              res.retVal.orderNo
            }&productType=${"activity"}`
          );
        }
      } else {
        jAlert3(res.msg);
      }
      canRequest.value = true;
    })
    .finally(() => {
      UmengSDK.sendEvent("hdp_book_clk", {
        page_name: "daily_activity_detail_pg",
        button_id: 2101,
        button_name: "日活动下单",
        page_title_name: dailyInfo.title,
        start_date: goodsData.toDate,
        price: payPrice.value.rateSum,
      });
    });
};
const calculatePrice = () => {
  let currentDisType = "";
  if (orderData.reserveOrderDto.payType == "CASH") {
    if (currentChooseCoupon.value.length > 0 && memberDscAmount.value <= 0) {
      currentDisType = "coupon";
    } else if (
      memberDscAmount.value > 0 &&
      currentChooseCoupon.value.length <= 0
    ) {
      currentDisType = "member";
    } else if (
      memberDscAmount.value > 0 &&
      currentChooseCoupon.value.length > 0
    ) {
      currentDisType = "member,coupon";
    }
  } else if (orderData.reserveOrderDto.payType == "INTEGRAL") {
    currentDisType = "credit";
  } else if (orderData.reserveOrderDto.payType == "INTEGRALCASH") {
    currentDisType = "credit";
    if (currentChooseCoupon.value.length > 0 && memberDscAmount.value <= 0) {
      currentDisType = "coupon,credit";
    } else if (
      memberDscAmount.value > 0 &&
      currentChooseCoupon.value.length <= 0
    ) {
      currentDisType = "member,credit";
    } else if (
      memberDscAmount.value > 0 &&
      currentChooseCoupon.value.length > 0
    ) {
      currentDisType = "member,coupon,credit";
    }
  }
  let opt = {
    activityDesc: dailyInfo.title,
    unitCode: config.hotelGroupCode,
    hotelCode: config.hotelCode,
    hotelGroupCode: config.hotelGroupCode,
    hotelGroupId: config.hotelGroupId,
    cardNo: user.cardNo,
    cardName: user.name,
    memberId: user.memberId,
    cardId: user.cardId,
    cardLevel: user.cardLevel,
    activityCode: dailyInfo.activityCode,
    channel: "WECHAT",
    appid: config.appid,
    guestDtoList: orderData.rsvDtos,
    contactMan: orderData.reserveOrderDto.rsvMan,
    contactPhone: orderData.reserveOrderDto.mobile,
    rsvMan: user.name,
    rsvPhone: user.mobile,
    remark: goodsData.remark,
    payType: orderData.reserveOrderDto.payType,
    rateCredit: payPrice.value.point ? payPrice.value.point : 0,
    rateSum: payPrice.value.rateSum ? payPrice.value.rateSum : 0,
    onSaleCode: goodsData.onSaleCode,
    adult: orderData.reserveOrderDto.adult,
    baby: orderData.reserveOrderDto.baby,
    bigChild: orderData.reserveOrderDto.bigChildren,
    child: orderData.reserveOrderDto.children,
    bizDatetime: goodsData.toDate + " " + goodsData.time,
    disType: currentDisType,
    couponNo:
      currentChooseCoupon.value.length > 0 &&
      orderData.reserveOrderDto.payType != "INTEGRAL"
        ? currentChooseCoupon.value[0].couponNo
        : "",
    // memberDiscountCode: discountType.value == -1 ? "" : discountType.value,
    memberDiscountCode:
      memberDiscountCode.value == -1 ? "" : memberDiscountCode.value,
  };
  api.calculatePrice(opt).then((res: any) => {
    if (res.result == 1) {
      totalCredit.value = res.retVal.totalCredit;
      totalCreditPrice.value = res.retVal.totalCreditPrice;
      totalPrice.value = res.retVal.totalPrice;
      payPrice.value.rateSum = res.retVal.totalPrice;
      payPrice.value.point = res.retVal.totalCredit;
      showPrice.value = true;
      getDiscountPrice();
    } else {
      showPrice.value = false;
      // jAlert3(res.msg);
    }
  });
};
const ordering = () => {
  travelOrdering();
};
//获取预定介绍
const getIntroduce = () => {
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
        activityCode: dailyInfo.activityCode,
        activityName: dailyInfo.title,
      },
    })
    .then((res: any) => {
      if (res.result == 1 && res.retVal.result == 0) {
        introduceData.value = res.retVal.retVal;
      }
    });
};
onLoad((options: any) => {
  if (options.productType) {
    productType.value = options.productType;
  }
  setTimeout(() => {
    dailyPrices.value.createDate(
      getStorage("dailyActivityInfo").dailyPriceList
    );
  }, 1000);
});
onShow(() => {
  listGuestLinkExtraInfoWithMemberIdOrOpenId();
});
onMounted(() => {
  queryCardLevelRight();
  getIntroduce();
  listCouponByUse();
  // getDiscountOfMember();
  uni.getSystemInfo({
    success: (res: any) => {
      navHeight.value = res.statusBarHeight + 60;
    },
    fail(err) {
      console.log(err);
    },
  });
  let dateObj = {
    number: dailyInfo.curDailyPrice.sumCapacity,
    toDate: dailyInfo.curDailyPrice.embarkDate,
    time: dailyInfo.curDailyPrice.time,
    onSaleCode: dailyInfo.curDailyPrice.onSaleCode,
  };
  goodsData = Object.assign(goodsData, dateObj);
  orderNum.value = 1;

  payTypes.forEach((payType: any) => {
    dailyInfo.minPriceList.forEach((item: any) => {
      if (item.payType == payType.id) {
        item.name = payType.name;
      }
      if (user.pointBalance < item.mixCredit || user.pointBalance <= 0) {
        if (item.payType == "INTEGRAL" || item.payType == "INTEGRALCASH") {
          item.invalid = true;
        }
      }
      if (!orderData.reserveOrderDto.payType && !item.invalid) {
        orderData.reserveOrderDto.payType = item.payType;
      }
    });
  });
  queryPrice(dailyInfo.curDailyPrice.onSaleCode);
});
</script>

<style lang="less" scoped>
@import url("~@/styles/mixin.less");
@import url("~@/styles/skin.less");
.ui_confirmOrder {
  line-height: 1;
  padding-bottom: 141px;

  .hotel_name {
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
    letter-spacing: 0px;
    text-align: left;
    margin-bottom: 8px;
    color: #fff;
  }
  .time_infos {
    .info {
      display: flex;
      margin-top: 16px;
      font-size: 14px;
      line-height: 1;
      color: #fff;

      .label {
        opacity: 0.8;
        margin-right: 8px;
      }
      .label_name {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        line-height: 14px;
        letter-spacing: 0px;
        text-align: left;
        color: rgba(255, 255, 255, 1);
      }
    }
  }
  .travel-info {
    padding: 80px 16px 16px;
    background-color: #000;
    background-image: url(https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/btnBlack.png);
    background-repeat: repeat;
    background-size: 40px 37.5px;

    .name {
      color: #fff;
      font-weight: bold;
      font-size: 20px;
    }

    .infos {
      .info {
        display: flex;
        margin-top: 12px;
        font-size: 14px;
        line-height: 1;
        color: #fff;

        .label {
          opacity: 0.8;
          margin-right: 8px;
        }
      }
    }
  }

  .form-infos {
    margin: 0 16px;

    .form-info {
      margin-top: 12px;
      background: #ffffff;
      border-radius: 8px;

      .tl {
        position: relative;
        color: #000000;
        font-weight: bold;
        padding: 16px 12px;
        font-size: 14px;
        line-height: 1;
        border-bottom: 1px solid #f8f8f8;

        .icon-a-20_jian_fangxing {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 20px;
          font-weight: normal;
        }
      }

      .form-inline {
        display: flex;
        padding: 0 12px;

        &.padding {
          padding-top: 16px;
          padding-bottom: 16px;

          .label {
            height: 40px;
          }
        }

        .number {
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .icon-a-20_jian,
          .icon-a-20_jia {
            font-size: 20px;

            &.invalid {
              color: #ccc;
            }
          }

          .num {
            font-size: 14px;
            font-weight: bold;
            margin: 0 10px;
          }
        }

        .label {
          display: flex;
          align-items: center;
          font-size: 14px;
          height: 46px;
          width: 88px;
          white-space: nowrap;
        }

        .vals {
          width: 100%;
          display: flex;
          flex: 1;
          flex-wrap: wrap;

          .val {
            min-width: 100%;
          }
        }

        .val {
          position: relative;
          display: flex;
          flex: 1;
          .icon-a-16_youlajiantou_hei {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
          }
          &.center {
            align-items: center;
          }
          &.end {
            justify-content: flex-end;
          }

          .radio-warp {
            width: 100%;
            &.bedType {
              /deep/.ui_radioGroup {
                .radio-item {
                  min-width: calc((100% - 24px) / 3);
                }
              }
            }
            /deep/.ui_radioGroup {
              width: calc(100% + 12px);
              .radio-box {
                display: flex;

                align-items: center;
                min-height: 0;
                padding: 0;
                width: 100%;
                margin-top: -12px;
              }

              .radio-item {
                padding: 0;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 1;
                max-width: 50%;
                height: 40px;
                border-radius: 4px;
                border: 1px solid #ccc;
                font-size: 14px;
                margin: 0;
                // margin-left: 12px;
                margin-right: 12px;
                margin-top: 12px;
                word-break: keep-all;

                &.invalid {
                  color: #cccccc;
                  border: 1px solid #ccc;
                }

                &.active {
                  border: 1px solid #a43127;
                  font-weight: bold;
                  color: #000;
                }
              }
            }

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

          .textarea-text {
            height: auto;
            width: 100%;
            box-sizing: border-box;
            font-size: 14px;
            color: #000;
            margin: 13px 0;
            line-height: 22px;
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

          .select-box {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;

            .date {
              font-size: 14px;
              color: #000;
            }

            .text {
              position: relative;
              color: #cccccc;
              flex: 1;
              &.black {
                color: #000;
              }
            }
            .coupon-num {
              position: absolute;
              right: 20px;
              top: -2px;

              background: rgba(164, 49, 39, 0.12);
              color: #a43127;
              padding: 4px;
              border-radius: 4px;
              font-size: 10px;
            }
            .red {
              color: #a43127;
              font-weight: 600;
              font-family: Montserrat;
            }

            .icon-danxuan_weixuan,
            .icon-danxuan_yixuan {
              font-size: 18px;
            }

            .icon-danxuan_yixuan {
              color: #a43127;
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

        .already-box2 {
          margin-top: 16px;
          font-size: 14px;
          color: #808080;
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
              display: flex;
              color: #000000;
              font-weight: bold;
              font-size: 16px;
              line-height: 1;
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
              font-size: 12px;
              line-height: 1;
              color: #808080;
            }
          }
        }
      }

      .add-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 52px;
        width: 100%;
        font-size: 14px;
        color: #000;

        .iconfont {
          font-size: 20px;
          margin-right: 8px;
        }
      }
    }
  }

  .rule {
    padding: 24px 16px;
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
  .footer_wrap {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #fff;
    border-top: 1px solid #eee;
    padding: 12px 16px;
    z-index: 2;
    padding-bottom: calc(12px + constant(safe-area-inset-bottom));
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
  }
  .footer {
    display: flex;
    justify-content: space-between;
    // position: fixed;
    // bottom: 0;
    // left: 0;
    // width: 100%;
    // background: #fff;
    // border-top: 1px solid #eee;
    // padding: 12px 16px;
    // z-index: 2;

    .price-info {
      display: flex;
      justify-content: center;
      flex-direction: column;
      // font-size: 18px;

      .price {
        display: flex;
        color: @active-color;

        &.weight {
          font-weight: bold;
        }

        .price-box {
          font-family: Montserrat;
          &.point-box {
            .point {
              font-size: 18px;
              margin-top: 0;
            }
          }
          .point_footer,
          .point {
            margin-top: 4px;
            font-family: Montserrat;
            font-size: 12px;
            font-style: normal;
            font-weight: 600;
            color: #a43127;
          }
        }
      }

      .price-detail {
        display: flex;
        align-items: center;
        font-weight: normal;
        font-size: 12px;
        margin-left: 10px;
        color: #000;

        .iconfont {
          margin-left: 4px;
          font-size: 12px;
        }
      }

      .price-tips {
        margin-top: 8px;
        color: #808080;
        font-size: 12px;
      }
    }

    .submit-btn {
      display: flex;
      align-items: center;
      height: 48px;
      color: #ffffff;
      font-size: 16px;
      padding: 0 40px;
      border-radius: 4px;
    }
  }

  .layer-container {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.76);
    z-index: 99;
    height: 100vh;
    width: 100%;
  }

  .couponList {
    padding: 4px 16px 16px;
    max-height: calc(80vh - 80px);
    overflow-y: auto;
    width: 100%;
    background: #f8f8f8;

    .listItem {
      margin-top: 12px;
    }
  }

  .layer-box {
    padding-top: 16px;
    max-height: 90%;
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
      overflow-x: auto;
      padding: 0 16px 32px;
      height: calc(80vh - 200px);

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
              display: flex;
              color: #000000;
              font-weight: bold;
              font-size: 16px;
              line-height: 1;

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

            .info-item-id-card {
              margin-top: 12px;
              font-size: 12px;
              color: #808080;
            }
          }
        }

        .icon-duoxuan_weixuan,
        .icon-danxuan_yixuan,
        .icon-duoxuan_yixuan,
        .icon-danxuan_bukexuan {
          font-size: 18px;

          &.icon-duoxuan_weixuan {
            color: #808080;
          }

          &.icon-duoxuan_yixuan {
            color: #a43127;

            &.noCan {
              color: #ccc;
            }
          }

          &.icon-danxuan_yixuan {
            color: #a43127;
          }
        }
      }
    }
  }
  .pric_sty {
    margin-top: 16px;
    width: 100%;
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 14px;
    // text-align: right;
    color: rgba(128, 128, 128, 1);
    margin-bottom: 5px;
    display: flex;
    .right {
      margin-left: auto;
    }
  }
  .layer-footer {
    background: #fff;
    padding: 16px;

    .layer-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 48px;
    }
  }

  .priceInfo {
    padding: 24px 16px 150px;

    .price-item {
      .main {
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        font-weight: bold;
        line-height: 16px;
        margin-top: 16px;

        &.noMargin {
          margin-top: 0;
        }
      }

      .other {
        display: flex;
        justify-content: space-between;
        margin-top: 16px;
        font-size: 14px;
        color: #808080;
      }
      .price {
        font-size: 16px;
      }
    }
  }
  .order-layer {
    padding-bottom: 100px;

    .title {
      padding: 16px 16px 0;
      color: #000000;
      font-size: 18px;
      font-weight: bold;
      line-height: 1;
    }

    .order-box {
      width: 100%;
      border-radius: 16px 16px 0 0;
      background: #f8f8f8;
      z-index: 2;
      height: calc(100vh - 230px);
      overflow-y: auto;

      .head {
        position: relative;
        display: flex;
        justify-content: center;
        font-weight: 600;
        font-size: 18px;
        line-height: 1;
        padding: 19px 0;
        background: #fff;
        border-bottom: 1px solid #eeeeee;

        .icon-a-20_guanbi {
          position: absolute;
          left: 22px;
          top: 20px;
          font-size: 20px;
        }
      }

      .booking-date {
        // margin-top: 16px;

        // .dates {
        // 	display: flex;
        // 	flex-wrap: nowrap;
        // 	box-sizing: border-box;
        // 	overflow-x: auto;
        // 	margin: 0 16px;
        // 	border-bottom: 1px solid #EEEEEE;

        // 	.date {
        // 		margin-right: 30px;
        // 		position: relative;
        // 		color: #808080;
        // 		font-size: 14px;
        // 		line-height: 1;
        // 		padding: 15px 0;

        // 		&.active {
        // 		color: #000;
        // 		font-weight: 600;

        // 		&::after {
        // 		content: '';
        // 		position: absolute;
        // 		height: 2px;

        // 		bottom: -1px;
        // 		width: 100%;
        // 		background: #A43127;
        // 		}
        // 		}
        // 	}
        // }
      }

      .next-btn {
        position: absolute;
        bottom: 0;
        width: 100%;
        border-top: 0.5px solid #eeeeee;
        padding: 12px 16px;
        background: #fff;

        .choose-item {
          color: #808080;

          text-align: center;
          font-size: 12px;
          line-height: 12px;
        }

        .btn {
          margin-top: 12px;
          line-height: 48px;
          height: 48px;
        }
      }
    }
  }
  .hotel_cont {
    overflow: hidden;
    display: flex;
    position: relative;
    transition: height 0.2s ease-in-out;
    .open-btn {
      position: absolute;
      bottom: 0;
      right: 0;
      margin-top: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 14px;

      .icon-a-12_xialajiantou_hei,
      .icon-a-12_shanglajiantou_hei {
        margin-left: 5px;
        font-size: 15px;
      }
    }
  }
  .discount-list {
    padding-top: 16px;
    background: #f8f8f8;
    .discount-item {
      padding: 12px 16px;
      margin: 0 16px 12px;
      position: relative;
      border-radius: 8px;
      background: #fff;
      .discount-lf {
        display: flex;
        flex-direction: column;
        .discount-desc {
          font-size: 16px;
          font-style: normal;
          font-weight: bold;
          color: #000;
        }
        .discount-val {
          display: inline-block;
          margin-top: 8px;
          font-family: Montserrat;
          font-size: 24px;
          font-style: normal;
          font-weight: 600;
          line-height: 1;
          color: #a43127;
          .val-desc {
            font-family: PingFang SC;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            color: #000;
            display: inline;
          }
        }
      }
      .select {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        .iconfont {
          width: 16px;
          height: 16px;
        }
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
  .redcolor {
    color: #a43127 !important;
    font-weight: 600;
    // font-family: Montserrat;
  }
}
</style>
