<template>
<div class="orderDetail_ui" v-if="reserveOrder.orderNo">
    <!-- #ifdef MP -->
    <coustom-head color="#fff" title="订单详情" :customClass="reserveOrder.sta == 'X'?'':'customPattern'" :bgColor="reserveOrder.sta == 'X'?'#7f7d75':''"></coustom-head>
    <!-- #endif -->
    <template v-for="(item,i) in orderSta" :key="i">
        <div class="order-sta" v-if="item.val== reserveOrder.sta" :class="{'cancelSta':reserveOrder.sta=='X'}" :style="{paddingTop:navHeight+'px'}">
            <div class="sta">
                {{item.name}}
            </div>
            <div class="desc" v-if="reserveOrder.sta=='DFK'&&reserveOrder.paySta != '8'">
                <template>
                    请尽快完成支付
                </template>
                <template v-if="reserveOrder.otaChannel!='CRS'&&reserveOrder.countdown>0">
                    剩余{{countdown}}
                </template>

            </div>
            <div class="desc" v-else>
                {{item.desc}}
            </div>

        </div>
    </template>
    <template v-if="productType=='shop'">
        <div class="travel-info">
            <div class="travel-img" @click="goPage('/pagesB/exchangeCoupon/exchangeCouponDetail?id='+reserveOrder.listShopOrderItemVO[0].goodsId)">
                <img :src="reserveOrder.listShopOrderItemVO[0].goodsLogo" class="travel-img-img">
            </div>
            <div class="travel-rt">
                <div class="travel-name">{{reserveOrder.listShopOrderItemVO[0].goodsName}}</div>
                <div class="travel-desc" v-if="reserveOrder.skuInfoStr||shopGoods.extraConfig.peopleNum">
                    <div class="skuInfoStr" v-if="reserveOrder.skuInfoStr">
                        {{reserveOrder.skuInfoStr}}
                    </div>
                    <div class="peopleNum" v-if="shopGoods.extraConfig.peopleNum">{{shopGoods.extraConfig.peopleNum}}名成人适用</div>
                </div>
                <div class="travel-time" v-if="shopGoods.vrType!='pack'&&reserveOrder.useTime">{{reserveOrder.useTime}}</div>
                <!-- <div class="travel-time">{{reserveOrder.winterCampAddInfo}}</div> -->

            </div>
        </div>

        <div class="travelersInfo" v-if="counponList.length>0">
            <div class="tl">活动券码</div>

            <div class="counponList">
                <div class="counpon" v-for="(item,i) in counponList" :key="i">
                    <div class="counpon-box" :class="{'pack':shopGoods.vrType=='pack'}">
                        <div class="couponNo" :class="{'invalid':item.couponSta!='I'}">
                            <div class="tag" v-if="counponList.length>1">券{{i+1}}</div>
                            <div class="no">{{item.couponNo}}</div>
                            <div class="iconfont icon-a-12_fuzhi" @click="copy(item.couponNo)" v-if="item.couponSta=='I'"></div>
                            <div class="invalid-desc" v-else-if="item.couponSta == 'O' || item.couponSta == 'U'|| item.couponSta == 'LO'">已核销
                            </div>
                            <div class="invalid-desc" v-else>已失效</div>
                        </div>
                    </div>
                    <div class="product" v-if="item.productNum>0&&shopGoods.vrType=='pack'">
                        <div class="product-tl">可兑产品（限兑1个产品）</div>

                        <template v-for="(product,index) in productDtoList" :key="index">
					
                            <div class="travelersInfo-item2" v-if="item.couponNo == product.couponNo" @click="showDetail(product)">
                                <div class="val">
                                    <div class="val-txt">{{product.title}}</div><i class="iconfont icon-a-12_youlajiantou_hui"></i>
                                </div>
                            </div>
                        </template>

                    </div>
                </div>
            </div>
            <!-- <div class="all-copy-box" v-if="counponList.length>1">

<div class="all-copy" @click="allCopy()">

一键复制

</div>

</div> -->
            <div class="explain-item" v-if="promotionRule">
                <collapse defaultHeight="90px" btn="T">
                    <template v-slot:content>
                        <div class="explain-item" v-html="promotionRule">

                        </div>
                    </template>
                </collapse>

                <!-- <div class="desc" :class="{'open':moreExplain=='T'}">

<div id="promotionRule">

<mp-html :content="promotionRule" ></mp-html>

</div>

</div> -->
                <div class="open-btn" v-if="moreExplain=='F'&&showMore" @click="moreExplain='T'">展开更多<i class="iconfont icon-a-12_xialajiantou_hei"></i>
                </div>
                <div class="open-btn" v-else-if="showMore" @click="moreExplain='F'">收起更多<i class="iconfont icon-a-12_shanglajiantou_hei"></i></div>

            </div>
        </div>
        <div class="travelersInfo" v-if="productDtoList.length>0&&shopGoods.vrType!='pack'">
            <div class="tl">可兑产品（限兑1个产品）</div>
            <div class="travelersInfo-list">
                <div class="travelersInfo-item exchangeInfo" v-for="(item,index) in productDtoList" @click="showDetail(item)">
                    <div class="val">
                        <div class="val-txt">{{item.title}}</div><i class="iconfont icon-a-12_youlajiantou_hui"></i>
                    </div>
                </div>
            </div>
        </div>
    </template>
    <template v-else>
        <div class="travel-info">
            <div class="travel-img" @click="goTravelDetail">
                <img mode="aspectFill" :src="reserveOrder.productUrl" class="travel-img-img">
            </div>
            <div class="travel-rt" v-if="orderInfo.teamOrder">
                <div class="travel-name">{{reserveOrder.productDesc}}</div>
                <div class="travel-desc">{{orderInfo.teamOrder.itineraryName}}</div>
                <div class="travel-time">{{reserveOrder.beginDateF}} -
                    {{reserveOrder.endDateF}}
                </div>
                <div class="travel-num" v-if="peopleNumber>0">人数x{{peopleNumber}}</div>
            </div>
        </div>
        <!-- <div class="travelersInfo" v-if="orderInfo.guests.length>0">
            <div class="tl">出行人</div>

            <div class="checkInInfo" v-for="(item,i) in teamRsvSrcs" :key="i">

                <div class="label" v-if="teamRsvSrcNum>1">
                    房间{{i+1}}
                </div>
                <div class="label" v-else>
                    房间安排
                </div>
                <div class="occupant">
                    <div class="bed-type" v-if="item.rmtypeDesc">{{item.rmtypeDesc}}</div>
                    <div v-for="(guest,j) in item.guests" :key="j">
                        <div class="name">{{guest.name}}</div>
                        <div class="id-card">{{idCardType[guest.idCode]}} {{hideIdCard(guest.idNo)}}
                        </div>
                        <div class="phone">{{guest.mobile}}</div>
                    </div>
                </div>
            </div>

        </div> -->
        <div class="travelersInfo" v-if="teamRsvSrcs.length>0">
            <div class="tl">房间信息</div>
            <template v-for="(item,i) in teamRsvSrcs" :key="i">

                <div class="checkInInfo" v-if="moreRoomInfo=='T'?i>-1:i<3">
                    <div class="label">
                    </div>
                    <div class="occupant">
                        <div class="bed-type hotel-bed">{{item.hotelDesc}}
                            <div class="date" v-if="item.arrDate">{{dateFormat(item.arrDate)}} <template v-if="item.depDate">- {{dateFormat(item.depDate)}}</template> ({{item.night}}晚)</div>
                        </div>
                        <div class="guestsInfo" v-for="(room,i) in item.roomList" :key="i">
                            <div class="occupant">
                                <div class="id-card">{{room.rmtypeDesc}} {{room.rmnum}}间</div>

                            </div>
                        </div>

                    </div>
                </div>
            </template>
            <template v-if="teamRsvSrcs.length>3">
                <div class="open-btn" v-if="moreRoomInfo=='F'" @click="moreRoomInfo='T'">展开更多<i class="iconfont icon-a-12_xialajiantou_hei"></i>
                </div>
                <div class="open-btn" v-else @click="moreRoomInfo='F'">收起更多<i class="iconfont icon-a-12_shanglajiantou_hei"></i></div>
            </template>
        </div>
        <div class="travelersInfo" v-if="orderInfo.guests.length>0">
            <div class="tl">出行人</div>

            <div class="checkInInfo" v-for="(guest,i) in orderInfo.guests" :key="i">

                <div class="label">

                </div>
                <div class="occupant">
                    <div class="name">{{guest.name}}</div>
                    <div class="id-card">{{idCardType[guest.idCode]}} {{hideIdCard(guest.idNo)}}
                    </div>
                    <div class="phone">{{guest.mobile}}</div>
                </div>
            </div>

        </div>
    </template>

    <div class="travelersInfo">
        <div class="tl">费用明细</div>
        <div class="travelersInfo-list">
            <template v-if="moreOrderInfo!='T'">
                <div class="travelersInfo-item">
                    <div class="label">
                        计价组合
                    </div>
                    <div class="val" v-if="payData.payType == 'CASH'">全现金</div>
                    <div class="val" v-else-if="payData.payType == 'INTEGRALCASH'">现金+积分</div>
                    <div class="val" v-else-if="payData.payType == 'INTEGRAL'">全积分</div>
                </div>
                <div class="travelersInfo-item">
                    <div class="label">
                        订单总价
                    </div>
                    <div class="val"><template v-if="payData.rateSum||!payData.point">¥{{payData.rateSum}}</template><template v-if="payData.rateSum&&payData.point">+</template><template v-if="payData.point">积分{{payData.point}}</template></div>

                </div>

                <div class="travelersInfo-item" v-if="(reserveOrder.sta=='DFK'||reserveOrder.sta=='DQY')&&payData.readyPay>0">
                    <div class="label">
                        待支付
                    </div>
                    <div class="val price red">¥{{payData.readyPay}}</div>
                </div>
                <div class="travelersInfo-item" v-if="payData.aleadyPayPrice">
                    <div class="label">
                        已支付
                    </div>
                    <div class="val price red">¥{{payData.aleadyPayPrice}}</div>
                </div>
            </template>
            <div class="info-more" v-if="moreOrderInfo=='T'">
                <div class="price-box">
                    <div class="travelersInfo-item total-price">
                        <div class="label">
                            订单总价
                        </div>
                        <div class="val"><template v-if="payData.rateSum||!payData.point">¥{{payData.rateSum}}</template><template v-if="payData.rateSum&&payData.point">+</template><template v-if="payData.point">积分{{payData.point}}</template></div>

                    </div>
                    <div class="travelersInfo-item">
                        <div class="label">
                            计价组合
                        </div>
                        <div class="val" v-if="payData.payType == 'CASH'">全现金</div>
                        <div class="val" v-else-if="payData.payType == 'INTEGRALCASH'">现金+积分</div>
                        <div class="val" v-else-if="payData.payType == 'INTEGRAL'">全积分</div>
                    </div>
                    <template v-if="productType=='shop'">

                        <div class="travelersInfo-item" v-if="reserveOrder.orderType!='Custom'">
                            <div class="label">
                                产品价合计
                            </div>
                            <div class="val">
                                <template v-if="payData.basicTeamRateSum||!payData.point">¥{{payData.basicTeamRateSum}}</template><template v-if="payData.basicTeamRateSum&&payData.point">+</template><template v-if="payData.point">积分{{payData.point}}</template>

                            </div>
                        </div>

                    </template>
                    <template v-else>
                        <div class="travelersInfo-item">
                            <div class="label">
                                产品价合计
                            </div>
                            <div class="val">
                                <template v-if="payData.basicTeamRateSum||!payData.point">¥{{payData.basicTeamRateSum}}</template><template v-if="payData.basicTeamRateSum&&payData.point">+</template><template v-if="payData.point">积分{{payData.point}}</template>

                            </div>
                        </div>
                        <template v-if="reserveOrder.orderType!='Custom'&&reserveOrder.orderType!='ButlerCustomized'">
                            <div class="travelersInfo-item" v-if="payData.adultTeamRateSum">
                                <div class="label">
                                    含成人
                                </div>
                                <div class="val">
                                    <template v-if="payData.adultTeamRateSum||!payData.point">¥{{payData.adultTeamRateSum}}</template><template v-if="payData.adultTeamRateSum&&payData.point">+</template><template v-if="payData.point">积分{{payData.point}}</template>

                                </div>
                            </div>

                            <div class="travelersInfo-item" v-if="payData.bigChildrenTeamRateSum">
                                <div class="label">
                                    含大童
                                </div>
                                <div class="val">¥{{payData.bigChildrenTeamRateSum}}</div>
                            </div>
                            <div class="travelersInfo-item" v-if="payData.midChildrenTeamRateSum">
                                <div class="label">
                                    含中童
                                </div>
                                <div class="val">¥{{payData.midChildrenTeamRateSum}}</div>
                            </div>

                            <div class="travelersInfo-item" v-if="payData.babyChildrenTeamRateSum">
                                <div class="label">
                                    含幼童
                                </div>
                                <div class="val">¥{{payData.babyChildrenTeamRateSum}}</div>
                            </div>
                            <div class="travelersInfo-item" v-if="payData.singleRoomRateSum">
                                <div class="label">
                                    单房差
                                </div>
                                <div class="val">¥{{payData.singleRoomRateSum}}</div>
                            </div>
                            <div class="travelersInfo-item" v-if="payData.addBedSum">
                                <div class="label">
                                    加床费
                                </div>
                                <div class="val">¥{{payData.addBedSum}}</div>
                            </div>
                            <div class="travelersInfo-item" v-if="payData.addBfSum">
                                <div class="label">
                                    加早费
                                </div>
                                <div class="val">¥{{payData.addBfSum}}</div>
                            </div>
                            <div class="travelersInfo-item" v-if="payData.upRmTypeSum">
                                <div class="label">
                                    升级房型费
                                </div>
                                <div class="val">¥{{payData.upRmTypeSum}}</div>
                            </div>
                            <div class="travelersInfo-item" v-if="payData.guaranteedPrice">
                                <div class="label">
                                    保底调整
                                </div>
                                <div class="val">¥{{payData.guaranteedPrice}}</div>
                            </div>

                        </template>
                        <div class="travelersInfo-item" v-if="payData.activityChangeRateSum">
                            <div class="label">
                                行程变更补差价
                            </div>
                            <div class="val">¥{{payData.activityChangeRateSum}}</div>
                        </div>
                    </template>
                </div>
                <div class="price-box" v-if="payData.allRateSum">
                    <div class="travelersInfo-item total-price">
                        <div class="label">
                            权益抵扣
                        </div>
                        <div class="val">-¥{{payData.allRateSum}}</div>
                    </div>
                    <div class="travelersInfo-item" v-if="payData.memberDscAmount">
                        <div class="label">
                            {{payData.memberLevelDesc}}
                        </div>
                        <div class="val">-¥{{payData.memberDscAmount}}</div>
                    </div>
                    <template v-if="productType=='shop'">

                        <div class="travelersInfo-item" v-if="payData.couponDesc">
                            <div class="label">
                                {{payData.couponDesc}}
                            </div>
                            <div class="val">-¥{{payData.couponRateSum}}</div>
                        </div>

                    </template>
                    <template v-else>
                        <div class="travelersInfo-item" v-for="(item,i) in payData.couponSimpleInfoDtoList" :key="i" v-if="payData.couponSimpleInfoDtoList&&payData.couponSimpleInfoDtoList.length>0">
                            <div class="label">
                                {{item.descript}}<template v-if="item.num>1">x{{item.num}}</template>
                            </div>
                            <div class="val">-¥{{item.realValue}}</div>
                        </div>
                    </template>

                    <div class="travelersInfo-item" v-if="payData.gwDiscount">
                        <div class="label">
                            顾问调整
                        </div>
                        <div class="val">-¥{{payData.gwDiscount}}</div>
                    </div>
                </div>
                <div class="price-box">
                    <div class="travelersInfo-item total-price">
                        <div class="label">
                            订单金额
                        </div>
                        <div class="val price"><template v-if="payData.needPay||!payData.point">¥{{payData.needPay}}</template><template v-if="payData.needPay&&payData.point">+</template><template v-if="payData.point">积分{{payData.point}}</template></div>
                    </div>
                    <div class="travelersInfo-item" v-if="payData.point">
                        <div class="label">
                            使用积分
                        </div>
                        <div class="val price red">{{payData.point}}积分</div>
                    </div>
                    <div class="travelersInfo-item" v-if="payData.aleadyPayPrice">
                        <div class="label">
                            已支付
                        </div>
                        <div class="val price red">¥{{payData.aleadyPayPrice}}</div>
                    </div>
                    <div class="travelersInfo-item" v-if="(reserveOrder.sta=='DFK'||reserveOrder.sta=='DQY')&&payData.readyPay>0">
                        <div class="label">
                            待支付
                        </div>
                        <div class="val price red">¥{{payData.readyPay}}</div>
                    </div>
                </div>
                <div class="price-box" v-if="payData.breakMoney">
                    <div class="travelersInfo-item total-price">
                        <div class="label">
                            退款相关
                        </div>
                        <div class="val price">{{payData.breakMoney}}</div>
                    </div>
                    <div class="travelersInfo-item">
                        <div class="label">
                            违约金
                        </div>
                        <div class="val price red">¥{{payData.breakMoney}}</div>
                    </div>
                </div>
            </div>

            <!-- <div class="travelersInfo-item" v-if="payData.alreadyPayFund||(reserveOrder.sta=='YTK'&&productType=='shop')">

<div class="label">

实付（现金）

</div>

<div class="val price red">¥{{payData.alreadyPayFund}}</div>

</div>

<div class="travelersInfo-item" v-if="payData.alreadyPayMember||(reserveOrder.sta=='YTK'&&productType=='shop')">

<div class="label">

实付（余额）

</div>

<div class="val price red">¥{{payData.alreadyPayMember}}</div>

</div> -->
            <!-- <div class="travelersInfo-item" v-if="payData.needPay==0&&payData.point==0">

<div class="label">

实付

</div>

<div class="val price red">¥0</div>

</div>  -->

        </div>
        <div class="open-btn" v-if="moreOrderInfo=='F'" @click="moreOrderInfo='T'">展开更多<i class="iconfont icon-a-12_xialajiantou_hei"></i>
        </div>
        <div class="open-btn" v-else @click="moreOrderInfo='F'">收起更多<i class="iconfont icon-a-12_shanglajiantou_hei"></i></div>
    </div>
    <div class="travelersInfo">
        <div class="tl">订单信息</div>
        <div class="travelersInfo-list">
            <div class="travelersInfo-item">
                <div class="label">
                    订单号
                </div>
                <div class="val" @click="copy(reserveOrder.orderNo)">{{reserveOrder.orderNo}}<i class="iconfont icon-a-12_fuzhi"></i></div>
            </div>
            <div class="travelersInfo-item">
                <div class="label">
                    下单时间
                </div>
                <div class="val">{{reserveOrder.createDatetime}}</div>
            </div>
            <div class="travelersInfo-item">
                <div class="label">
                    联系人
                </div>
                <div class="val">{{reserveOrder.rsvMan}} {{reserveOrder.mobile}}</div>
            </div>
            <div class="travelersInfo-item" v-if="reserveOrder.remark">
                <div class="label">
                    订单备注
                </div>
                <div class="val">{{reserveOrder.remark}}</div>
            </div>
        </div>

    </div>
    <div class="travelersInfo" v-if="annexList.length>0">
        <div class="tl">订单附件</div>
        <div class="annex-list">

            <div class="annex-item" v-for="(annexItem,annexItemIndex) in annexList" :key="annexItemIndex" @click="goAnnex(annexItem)">
                <i class="iconfont icon-a-12_fujian"></i>{{annexItem.name}}.pdf
            </div>
        </div>

    </div>
    <div class="card" v-if="payData.isChangeActivity&&payData.isChangeActivity=='T'">
        <div class="linkItem" @click="goPage('/pagesD/trip/tripChange?teamNo='+payData.teamNo)">
            <p class="title">行程变更详情</p>
            <i class="icon iconfont icon-a-16_youlajiantou_hei"></i>
        </div>
    </div>

    <div class="footer" v-if="reserveOrder.sta==3||(reserveOrder.sta=='O'&&invoiceSta !=='NI')||reserveOrder.sta=='DFK'||reserveOrder.sta=='DQY'||reserveOrder.sta=='RW'||reserveOrder.sta=='RD'">
        <div class="btns" v-if="reserveOrder.sta=='RD'||reserveOrder.sta=='RW'">
            <div class="btn-def" @click="toPage('/pagesD/trip/takeInfo?orderNo='+orderNo)">预约接送</div>

        </div>
        <div class="btns" v-if="reserveOrder.sta=='O'&&invoiceSta !=='NI'">
            <div class="btn-def" @click="goInvoice()">申请开票</div>

        </div>

        <div class="btns" v-if="reserveOrder.sta==3">
            <div class="btn-def baseBtn" @click="toExchange()">去兑换</div>

        </div>
        <div class="btns" v-if="reserveOrder.sta=='DFK'||reserveOrder.sta=='DQY'">
            <div class="btn-def" @click="showCancel">取消订单</div>
            <!-- <div class="btn-def" @click="showGive" v-if="payData.isChangeActivity=='T'">联系顾问</div>
            <div class="btn-def" @click="showGive" v-if="payData.isChangeActivity=='T'">联系管家</div> -->
            <div class="btn-def baseBtn" v-if="reserveOrder.sta=='DFK'" @click="toPay()">确认支付</div>
            <div class="btn-def baseBtn" v-if="reserveOrder.sta=='DQY'" @click="toTips">确认签约</div>
        </div>
    </div>
    <kf-dialog ref="kf" :title="title"></kf-dialog>
    <!-- <travel-dialog ref="travel" :travelType="travelType"></travel-dialog> -->
</div>
</template>

<script setup lang="ts">
import {
    reactive,
    ref,
    computed,
    onMounted
} from "vue";
import UmengSDK from "@/utils/umengAdaptor.js";
import api from "@/utils/api";
import coustomHead from "@/components/coustomHead.vue";
// import travelDialog from "@/components/travelDialog.vue";
import kfDialog from "@/components/kfDialog.vue";
import collapse from "@/components/collapse.vue";
import {
    jAlert3,
    jAlert5
} from "@/base/jAlert/jAlert";
import {
    getStorage,
    setStorage
} from "@/utils/wxuser";
import {
    onPageScroll,
    onLoad,
    onUnload
} from "@dcloudio/uni-app";
import {
    hideIdCard
} from "@/utils/filter";
import {
    goPage
} from "@/utils/utils";

import dayjs from "dayjs";

let user = getStorage('user')
let config = getStorage('config')
const orderNo = ref("")
const kf = ref()
const navHeight = ref("")
const productType = ref("")
const orderInfo: any = ref({})
const reserveOrder: any = ref({})
const counponList: any = ref([])
const moreExplain = ref("F")
const moreOrderInfo = ref("F")
const moreRoomInfo = ref("F")
const countdown: any = ref("")
const intervalId: any = ref(null)
const teamRsvSrcs: any = ref([])
const teamRsvSrcNum = ref(0)
const peopleNumber = ref(0)
const roomNumber = ref(0)
const payData: any = ref({})
const shopGoods: any = ref({})
const promotionRule: any = ref("")
const couponCodeUseConfigProductDtoList: any = ref([])
const productDtoList: any = ref([])
// const travelType =  ref("")
const showMore = ref()
const travelList: any = ref([])
const counponOrderType = ref("")
const orderInvoice: any = ref({})
const title = ref("如需取消订单请联系客服")
const annexList: any = ref([])
let invoiceSta = ref("NI");
let idCardType = reactive({
    "11": "外交护照",
    "12": "公务护照",
    "13": "因公普通护照",
    "14": "护照",
    "15": "中华人民共和国旅行证",
    "16": "台湾居民来往大陆通行证",
    "17": "海员证",
    "18": "机组人员证",
    "19": "铁路员工证",
    "20": "中华人民共和国出入境通行证",
    "21": "港澳通行证",
    "23": "前往港澳通行证",
    "24": "港澳同胞回乡证",
    "30": "外国人出入境通行证",
    "31": "外国人旅行证",
    "32": "外国人回国证件",
    "33": "外国人居留证",
    "34": "户口簿",
    "35": "居留许可证",
    "36": "港澳居民来往内地通行证",
    "51": "APEC商务旅行卡",
    "52": "户籍证明",
    "53": "军官离、退休证",
    "54": "通行证",
    "55": "旅行证",
    "56": "特殊重要证件",
    "96": "学信网",
    "97": "留学offer证明",
    "98": "学生证",
    "99": "其他证件（包括联合国通行证、欧洲共同体护照等）",
    "01": "身份证",
    "02": "临时身份证",
    "03": "军(警)官证",
    "04": "士兵证",
    "05": "驾驶证",
    "06": "结婚证",
    "07": "暂住证"
})

const orderSta = [{
        name: "已下单",
        val: "R"
    },
    {
        name: "待出行",
        val: "RW",
        desc: "松赞期待与您相遇。"
    },
    {
        name: "待签约",
        val: "DQY"
    },

    {
        name: "待出行",
        val: "RD",
        desc: "松赞期待与您相遇。"
    },
    {
        name: "待付款",
        val: "DFK",
        desc: "请尽快完成支付。"
    },
    {
        name: "待退款",
        val: "DTK",
        desc: "正在等待后台审核。"
    },
    {
        name: "退款中",
        val: "TKZ",
        desc: "预计3个工作天到账。"
    },

    {
        name: "出行中",
        val: "I",
        desc: "松赞祝您旅途愉快。"
    },
    {
        name: "已完成",
        val: "O",
        desc: "松赞感谢您的支持。"
    },
    {
        name: "已取消",
        val: "X",
        desc: "松赞期待与您相遇。"
    },
    {
        name: "已退款",
        val: "YTK",
        desc: "松赞祝您旅途愉快。"
    },
    {
        name: "待使用",
        val: "3",
        desc: "松赞祝您旅途愉快。"
    }

]
onPageScroll((e) => {
    // console.log(e)
})
const goInvoice = (item: any) => {
    if (invoiceSta.value == "CI") {
        uni.navigateTo({
            url: `/pagesF/invoice/applyInvoice?orderNo=${orderNo.value}&orderType=L&productType=${reserveOrder.value.orderType}`,
        });
    } else {
        uni.navigateTo({
            url: `/pagesF/invoice/invoiceDetails?orderNo=${orderNo.value}&orderType=L&productType=${reserveOrder.value.orderType}`,
        });
    }

};

const goTravelDetail = () => {
    if (orderInfo.value.teamOrder.productCode) {
        goPage('/pagesB/travel/travelDetail?travelType=' + orderInfo.value.teamOrder.productCode + '&isAll=T')
    }

}
const goAnnex = (item: any) => {
    goPage(item.url)

}
const getInvoiceOrder = () => {
    api
        .getInvoiceOrder({
            hotelCode: config.hotelCode,
            hotelGroupCode: config.hotelGroupCode,
            orderNo: orderNo.value,
            orderType: "R",
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
const getOrderInvoiceSta = () => {
    let orderType = "L";
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

const showDetail = (item: any) => {
    goPage(`/pagesB/travel/travelDetail?travelType=${item.travelType}&couponNo=${item.couponNo}`)
    // travelType.value = item.travelType

}
const toExchange = () => {
    counponList.value.forEach((counpon: any) => {
        if (counpon.couponSta == 'I') {
            counpon.couponCodeUseConfigProductDtoList.forEach((item: any) => {
                if (item.orderType == 'Custom') {
                    counponOrderType.value = item.orderType
                }

            })
        }

    })
    if (counponOrderType.value == 'Custom' && productDtoList.value.length <= 0) {
        title.value = '一键咨询'
        kf.value.showDialog();
    } else {
        setStorage('productDtoList', productDtoList.value)
        goPage(`/pagesB/exchangeCoupon/exchangeList`)
    }

}
const showGive = () => {
    title.value = '一键咨询'
    kf.value.showDialog();
}
const showCancel = () => {
    UmengSDK.sendEvent("odp_cancel_order_clk", {
        price: payData.value.rateSum,
        order_name: reserveOrder.value.productDesc,
        order_type: reserveOrder.value.orderTypeDesc,
        start_date: reserveOrder.value.beginDate,
        end_date: reserveOrder.value.endDate,
        trip_people_count: peopleNumber.value,
        travel_path: "",
        room_count: teamRsvSrcNum.value,
        preferential_scheme: payData.value.payType,
        is_installment: "",
        order_id: orderNo.value
    });

    kf.value.showDialog();
};
const toPage = (url: any) => {
    if (!url) {
        return;
    }
    uni.navigateTo({
        url: url
    })
}
const toPay = () => {
    let type = productType.value || reserveOrder.value.orderType
    uni.redirectTo({
        url: `/pagesB/other/pay?orderNo=${orderNo.value}&productType=${type}`
    })

}
const toTips = () => {
    uni.redirectTo({
        url: `/pagesB/travel/tips?orderNo=${orderNo.value}`
    })

}
const allCopy = () => {
    let couponNos = ''
    counponList.value.forEach((item: any, i: number) => {
        if (i == 0) {
            couponNos += item.couponNo
        } else {
            couponNos += '   ' + item.couponNo
        }

    })
    copy(couponNos)
}
const copy = (val: string) => {
    uni.setClipboardData({
        data: val,
        success: function () {
            jAlert3("复制成功")
        }
    });
}
const getDateTime = (vrDateType: string, vrStartDate: string, vrEndDate: string, vrBeginDay: number, vrValidDays: string) => {
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
                    " - " +
                    dayjs(vrEndDate).format("YYYY.MM.DD");
            }
        }
    } else if (vrDateType == "2") {
        if (vrBeginDay == 0) {
            goodsTime = "有效期至" + dayjs(vrEndDate).format("YYYY.MM.DD");
        } else {
            goodsTime = "购买后第" + vrBeginDay + "天生效，有效期至" + dayjs(vrEndDate).format("YYYY.MM.DD");
        }
    } else {
        if (vrBeginDay == 0) {
            goodsTime = "购买后" + vrValidDays + "天内有效";
        } else {
            goodsTime =
                "购买后第" +
                vrBeginDay +
                "天生效，有效期" +
                vrValidDays +
                "天";
        }
    }
    return goodsTime

}
const getShopOrder = () => {
    api.shopOrderDetail({
        equipment: config.equipment,
        hotelGroupCode: config.hotelGroupCode,
        hotelGroupId: config.hotelGroupId,
        id: orderNo.value
    }).then((res: any) => {
        if (res.result == 1) {

            reserveOrder.value = res.retVal
            reserveOrder.value.rsvMan = reserveOrder.value.receiver
            reserveOrder.value.mobile = reserveOrder.value.contact
            reserveOrder.value.basicTeamRateSum = reserveOrder.value.totalPrice
            payData.value.basicTeamRateSum = reserveOrder.value.totalPrice
            payData.value.rateSum = reserveOrder.value.totalPrice
            payData.value.aleadyPayPrice = reserveOrder.value.aleadyPayPrice
            payData.value.alreadyPay = Number((reserveOrder.value.aleadyPayPrice - reserveOrder.value.aleadyChuzhiPrice).toFixed(2))
            payData.value.alreadyPayMember = reserveOrder.value.aleadyChuzhiPrice
            payData.value.alreadyPayFund = Number((reserveOrder.value.aleadyPayPrice - reserveOrder.value.aleadyChuzhiPrice).toFixed(2))
            payData.value.balanceDeduction = reserveOrder.value.aleadyChuzhiPrice
            payData.value.readyPay = Number((reserveOrder.value.actualPrice - reserveOrder.value.aleadyPayPrice).toFixed(2))
            payData.value.needPay = reserveOrder.value.actualPrice
            payData.value.point = reserveOrder.value.originalTotalCredit
            payData.value.couponRateSum = 0
            payData.value.memberDscAmount = 0
            shopGoods.value = reserveOrder.value.listShopOrderItemVO[0].shopGoods
            if (reserveOrder.value.listShopOrderItemVO[0].extraConfig) {
                shopGoods.value.extraConfig = JSON.parse(reserveOrder.value.listShopOrderItemVO[0].extraConfig)
            }
            if (payData.value.point > 0) {
                payData.value.payType = 'INTEGRALCASH'
            } else {
                payData.value.payType = 'CASH'
            }
            if (reserveOrder.value.couponAttr) {
                let couponAttr = JSON.parse(reserveOrder.value.couponAttr)

                couponAttr.forEach((item: any) => {
                    if (item.type == "coupon") {
                        payData.value.couponDesc = item.couponName
                        payData.value.couponRateSum = item.concessionaryPrice
                    }
                    if (item.type == "member") {
                        payData.value.memberLevelDesc = item.memberLevelDesc
                        payData.value.memberDscAmount = item.concessionaryPrice
                    }
                })
            }
            payData.value.allRateSum = Number((payData.value.couponRateSum + payData.value.memberDscAmount).toFixed(2))
            counponList.value = reserveOrder.value.listShopOrderItemVO[0].counponList
            if (counponList.value.length > 0) {
                let indicesOfI = counponList.value.reduce((acc: any, item: any, index: any) => {
                    if (item.couponSta === "I") {
                        acc.push(index);
                    }
                    return acc;
                }, []);
                indicesOfI.forEach((indexOfI: any) => {
                    counponList.value.splice(0, 0, counponList.value.splice(indexOfI, 1)[0]);
                });
                promotionRule.value = counponList.value[0].promotionRule

                var hasCoupon = false
                counponList.value.forEach((counpon: any) => {
                    let products: any = []

                    if (counpon.couponSta == 'I') {

                        counpon.couponCodeUseConfigProductDtoList.forEach((item: any) => {
                            item.couponNo = counpon.couponNo
                            products.push(item)

                        })

                        if (!hasCoupon || shopGoods.value.vrType == 'pack') {
                              hasCoupon = true
                             travelProductList(products,counpon)
                           
                           
                        }

                    }

                })
                // couponCodeUseConfigProductDtoList.value = products

            }
            if(counponList.value&&counponList.value.length>0){
                 reserveOrder.value.useTime = dayjs(counponList.value[0].couponStarttime).format("YYYY.MM.DD") + ' - ' + dayjs(counponList.value[0].couponEndtime).format("YYYY.MM.DD")
            }
           
            if (reserveOrder.value.listShopOrderItemVO[0].skuId) {
                let skuInfoPar = []
                let skuInfoStr = ""
                let skuInfo = JSON.parse(reserveOrder.value.listShopOrderItemVO[0].skuInfo);
                if (typeof skuInfo[0].sku == 'string') {
                    skuInfoPar = JSON.parse(skuInfo[0].sku);
                } else {
                    skuInfoPar = skuInfo[0].sku;
                }
                for (let j in skuInfoPar) {
                    skuInfoStr += skuInfoPar[j].itemValue

                }
                reserveOrder.value.skuInfoStr = skuInfoStr

            }
            if (reserveOrder.value.orderStatus == '1') {
                reserveOrder.value.sta = 'DFK'
                reserveOrder.value.webPay = 0
                let countTime = reserveOrder.value.payOvertime
                if (!countTime) {
                    countTime = 30
                }

                let payOvertime = dayjs(reserveOrder.value.createDatetime).add(Number(countTime), 'minutes').diff(dayjs(), 's')

                intervalId.value = setInterval(() => {
                    if (payOvertime > 0) {
                        payOvertime--
                        countdown.value = formatSeconds(payOvertime)
                    } else {
                        reserveOrder.value.sta = 'X'
                    }

                }, 1000)
            } else if (reserveOrder.value.orderStatus == '2') {
                reserveOrder.value.sta = 'X'
                reserveOrder.value.webPay = 0
            } else if (reserveOrder.value.orderStatus == '3') {
                reserveOrder.value.sta = '3'
                reserveOrder.value.webPay = reserveOrder.value.actualPrice
            } else if (reserveOrder.value.orderStatus == '4' || reserveOrder.value.orderStatus == '12') {
                reserveOrder.value.sta = 'TKZ'
                reserveOrder.value.webPay = reserveOrder.value.actualPrice
            } else if (reserveOrder.value.orderStatus == '5') {
                reserveOrder.value.sta = 'YTK'
                reserveOrder.value.webPay = reserveOrder.value.actualPrice
            } else {
                reserveOrder.value.sta = 'O'
                reserveOrder.value.webPay = reserveOrder.value.actualPrice
            }

        }
    });
}
const travelProductList = (list: any,counpon:any) => {
    productDtoList.value = []
    let travelGroupCodes: any = []
    let travelTypes:any= []
    let itineraryCodes:any= []
    let categorySubs:any= [] 
    var opt: any = {
        "unitCode": config.hotelGroupCode,
        "hotelGroupCode": config.hotelGroupCode
    }
   
  
    list.forEach((item: any) => {
        if(item.type=='4'){
            travelGroupCodes.push(item.productCode)
        }
        if(item.type=='3'){
            itineraryCodes.push(item.productCode)
        }
        if(item.type=='2'){
            if(item.productPrimaryClassification!='Custom'){
                categorySubs.push(item.productPrimaryClassification)
            }
           
        }
        if(item.type=='1'){
            travelTypes.push(item.productCode)
        }
    })
    if(itineraryCodes.length>0){
        opt.itineraryCodes = itineraryCodes
    }
    if(travelTypes.length>0){
        opt.travelTypes = travelTypes
    }
    if(categorySubs.length>0){
        opt.categorySubs = categorySubs
    }
    if(travelGroupCodes.length>0){
        opt.travelGroupCodes = travelGroupCodes
    }
    

    api.interfaceTransfer({
            query: opt,
            config: {
                "interfaceType": "POST",
                "interfaceModule": "GC_PRODUCT_JOURNEY",
                "interfaceMethod": "/api/travelGroup/listTravelProductForWechatTdq",
                "interfaceFrom": "GC",
                "hotelGroupCode": config.hotelGroupCode
            }
        })
        .then((res: any) => {
            if (res.result == 1 && res.retVal.result == 0) {
                let productList = res.retVal.retVal
				counpon.productNum = productList.length
				productList.forEach((item: any) => {
					item.couponNo = counpon.couponNo
					
					productDtoList.value.push(item)
				})
              
               
            }
            console.log(productDtoList.value)

        });

}
const downloadContractNoByGcRsvNo = () => {

    var opt = {
        hotelGroupCode: config.hotelGroupCode,
        gcRsvNo: orderNo.value
    }
    api.getContractNoByGcRsvNo(opt).then((res: any) => {
        if (res.result == 1) {
            if (res.retVal.url) {
                annexList.value.push({
                    name: "线路合同",
                    url: res.retVal.url,
                });
            }

        } else {
            jAlert3(res.msg)
        }
    })
}
const arraysAreEqual = (arr1:any, arr2:any) => {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  // 比较 Set 对象
  return (
    set1.size === set2.size &&
    [...set1].every((value) => set2.has(value))
  );
}
const mergeAndOverride = (data: any) => {
    const result:any = [];

    for (const entry of data) {
        let mergedRoomList: any = {};
        entry.roomList.forEach((room: any) => {
            let key = `${entry.arrDate}_${room.rmtype}_${room.hotelDesc}`;
            if (mergedRoomList[key]) {
                mergedRoomList[key].rmnum += room.rmnum;
            } else {
                mergedRoomList[key] = {
                    ...room
                };
            }
        });
        entry.roomList = Object.values(mergedRoomList);
        entry.key = []
        entry.roomList.forEach((room: any) => {
            entry.key.push(`${room.rmtype}_${room.hotelDesc}_${room.rmnum}`)
        })
        console.log(result,entry)
        let matchedEntry: any = result.find((resultEntry: any) =>
            entry.roomList.every((entryRoom: any) =>
                resultEntry.roomList.some((resultRoom: any, index: any) => {
                    if ((entry.arrDate === resultEntry.depDate)&&arraysAreEqual(entry.key,resultEntry.key)) {
                        resultEntry.roomList[index].rmnum += entryRoom.rmnum;
                        return true;
                    }
                    return false;
                })
                   

            )
        );
        if (matchedEntry) {
            matchedEntry.depDate = entry.depDate
            matchedEntry.night += entry.night
        } else {
            result.push(entry);
        }
    }

    return result;
}
const dateFormat = (val: any) => {
    return dayjs(val).format('MM.DD')
}
const orderDetail = () => {

    api.orderDetail({
        memberNo: user.memberId,
        memberId: user.memberId,
        hotelGroupCode: config.hotelGroupCode,
        hotelCode: config.hotelCode,
        travelOrderNo: orderNo.value,
        mobile: user.mobile
    }).then((res: any) => {
        if (res.result == 1) {

            orderInfo.value = res.retVal
            reserveOrder.value = res.retVal.reserveOrder
            if (reserveOrder.value.sta == 'WJ') {
                reserveOrder.value.sta = 'O'
            }
            if (reserveOrder.value.sta == 'W' || reserveOrder.value.sta == 'D' || reserveOrder.value.sta == 'RD') {
                reserveOrder.value.sta = 'RW'
            }
            if (reserveOrder.value.sta != 'X') {
                if (reserveOrder.value.agency == 'T' && reserveOrder.value.isAgency == 'F') {
                    reserveOrder.value.sta = 'DQY'
                } else if ((reserveOrder.value.paySta == '1' || reserveOrder.value.paySta == '8') && reserveOrder.value.sta == 'R') {
                    reserveOrder.value.sta = 'DFK'
                } else if (reserveOrder.value.paySta == '2' && reserveOrder.value.sta == 'R') {
                    reserveOrder.value.sta = 'RW'
                } else if (reserveOrder.value.paySta == '4') {
                    reserveOrder.value.sta = 'DTK'
                } else if (reserveOrder.value.paySta == '5') {
                    reserveOrder.value.sta = 'YTK'
                } else if (reserveOrder.value.paySta == '7') {
                    reserveOrder.value.sta = 'YTZ'
                }
            } else {
                if (reserveOrder.value.paySta == '5') {
                    reserveOrder.value.sta = 'YTK'
                }
            }

            if (reserveOrder.value.isAgency == 'T' && reserveOrder.value.agency == 'T') {
                downloadContractNoByGcRsvNo()
            }
            if (reserveOrder.value.sta == 'DQY' || reserveOrder.value.sta == 'DFK') {
                if (reserveOrder.value.paySta != '8') {
                    if (reserveOrder.value.countdown) {

                        intervalId.value = setInterval(() => {
                            if (reserveOrder.value.countdown > 0) {
                                reserveOrder.value.countdown--
                                countdown.value = formatSeconds(reserveOrder.value.countdown)
                            } else {
                                clearInterval(intervalId.value);
                                reserveOrder.value.sta = 'X'
                            }

                        }, 1000)
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

            if (orderInfo.value.itineraryInfos[0].teamItineraries.length > 0) {
                let mergeRoom: any = []
                let allteamRsvSrcs: any = []
                orderInfo.value.itineraryInfos[0].teamItineraries.forEach((item: any) => {
                    if (item.teamRsvSrcs && item.teamRsvSrcs.length > 0) {
                        let hotelInfo: any = {}
                        hotelInfo.roomList = []
                        item.teamRsvSrcs.forEach((room: any) => {
                            hotelInfo.arrDate = room.arrDate
                            hotelInfo.depDate = room.depDate
                            hotelInfo.hotelDesc = room.hotelDesc
                            hotelInfo.night = 1
                            hotelInfo.roomList.push({
                                rmtypeDesc: room.rmtypeDesc,
                                rmtype: room.rmtype,
                                rmnum: room.rmnum,
                                hotelDesc: room.hotelDesc

                            })
                            // allteamRsvSrcs.push(room)
                        })
                        mergeRoom.push(hotelInfo)
                    }
                })
                teamRsvSrcs.value = mergeAndOverride(mergeRoom);
                console.log(teamRsvSrcs.value)

            }
            peopleNumber.value = orderInfo.value.guests.length

            orderInfo.value.guests.forEach((item: any) => {
                if (item.chitNo && item.chitSta == '2') {
                    annexList.value.push({
                        name: "保险单",
                        url: config.baseUrlmall.replace('/guardian', '') + "/api/fdd/insuranceDownload?insuranceNo=" + item.chitNo + "&hotelGroupCode=" + config.hotelGroupCode,

                    });

                }
            })
            reserveOrder.value.beginDateF = dayjs(reserveOrder.value.beginDate).format("YYYY.MM.DD")
            reserveOrder.value.endDateF = dayjs(reserveOrder.value.endDate).format("YYYY.MM.DD")
            queryPayDetail()

        }
    });
}
const chitDownload = (item: any) => {

    // api.insuranceDownload({
    // 	insuranceNo:'20231102005611',
    // 	hotelGroupCode:config.hotelGroupCode,
    // }).then((res : any) => {

    // })

}
const hideCode = (str: string, beginStr: number, endStr: number) => {
    var len = str.length;
    if (len < beginStr || len < endStr) {
        return str;
    }
    var leftStr = str.substring(0, beginStr);
    var rightStr = str.substring(endStr, len);
    var str = ''
    var i = 0;
    try {
        for (i = 0; i < endStr - beginStr; i++) {
            str = str + '*';
        }
    } catch (error) {

    }
    str = leftStr + str + rightStr;
    return str;
}
const formatSeconds = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours}小时${formattedMinutes}分${formattedSeconds}秒`;
}
const formatDiscount = (val: any) => {
    return Number(Number(val).toFixed(2))
}
const queryPayDetail = () => {
    let obj: any = {
        "unitCode": config.hotelGroupCode,
        "otaChannel": "wechat",
        "ota": "DIRECT",
        "isGroup": 'T',
        "payType": payData.value.payType,
        "orderNo": orderNo.value,
        "cardLevel": user.cardLevel,
        "cardType": user.cardType,
        "memberId": user.memberId
    }

    api.interfaceTransfer({
            query: obj,
            config: {
                "interfaceType": "POST",
                "interfaceModule": "GC_TRAVEL_ORDER",
                "interfaceMethod": "/api/reserve/order/queryPayDetail",
                "interfaceFrom": "GC",
                "hotelGroupCode": config.hotelGroupCode
            }
        })
        .then((res: any) => {

            if (res.result == 1 && res.retVal.result == 0) {
                payData.value = res.retVal.retVal
                if (payData.value.travelRateSumDto) {
                    payData.value = Object.assign(payData.value, payData.value.travelRateSumDto)
                }
                payData.value.aleadyPayPrice = Number((payData.value.alreadyPayFund + payData.value.alreadyPayMember + payData.value.alreadyPayOther).toFixed(2))
                if (reserveOrder.value.orderType != 'Custom' && payData.value.activityChangeRateSum) {
                    payData.value.rateSum = payData.value.rateSum + payData.value.activityChangeRateSum
                }
                payData.value.rateSum = Number((payData.value.rateSum - payData.value.exchangeRateSum).toFixed(2))
                payData.value.needPay = Number((payData.value.rateSum - payData.value.memberDscAmount - payData.value.couponRateSum - payData.value.gwDiscount).toFixed(2))
                payData.value.allRateSum = Number((payData.value.memberDscAmount + payData.value.couponRateSum + payData.value.gwDiscount).toFixed(2))
                if (payData.value.readyPay > 0 && reserveOrder.value.sta != 'X' && (reserveOrder.value.paySta == '9' || reserveOrder.value.paySta == '8')) {
                    reserveOrder.value.sta = 'DFK'
                }
                if (payData.value.couponSimpleInfoDtoList && payData.value.couponSimpleInfoDtoList.length > 0) {
                    payData.value.couponDesc = ''
                    payData.value.couponSimpleInfoDtoList.forEach((item: any, i: number) => {

                        if (i == payData.value.couponSimpleInfoDtoList.length - 1) {
                            if (item.num > 1) {
                                payData.value.couponDesc += `${item.descript} x${item.num}`
                            } else {
                                payData.value.couponDesc += `${item.descript}`
                            }

                        } else {
                            if (item.num > 1) {
                                payData.value.couponDesc += `${item.descript} x${item.num};`
                            } else {
                                payData.value.couponDesc += `${item.descript};`
                            }

                        }
                    })
                }
                if (payData.value.memberLevelDesc) {
                    payData.value.memberLevelDesc = `${payData.value.memberLevelDesc}会员${formatDiscount(payData.value.memberDiscount * 10)}折`
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
                    preferential_scheme: payData.value.payType,
                    is_installment: "",
                    order_id: orderNo.value

                });
            }
        });
}
onUnload(() => {
    clearInterval(intervalId.value);
})
onLoad((optios: any) => {
    orderNo.value = optios.orderNo
    if (optios.productType) {
        productType.value = optios.productType
    }

})
onMounted(() => {
    uni.getSystemInfo({
        success: (res: any) => {
            navHeight.value = res.statusBarHeight + 60;
        },
        fail(err) {
            console.log(err);
        },
    });
    if (productType.value == 'shop') {
        getShopOrder()

    } else {
        getOrderInvoiceSta();
        orderDetail()
    }

})
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");

.orderDetail_ui {

    line-height: 1;
    padding-bottom: 110px;

    .order-sta {
        background-image: url(https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/btnBlack.png);
        background-repeat: repeat;
        background-color: #000000;
        background-size: 40px 37.5px;
        padding: 75px 16px 62px;

        &.cancelSta {
            background-color: #7F7D75;
        }

        .sta {
            font-weight: 500;
            font-size: 20px;
            color: #FFFFFF;
        }

        .desc {
            margin-top: 12px;
            color: #FFFFFF;
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
            flex: 1;

            .travel-name {

                font-size: 16px;
                color: #000000;
                font-weight: bold;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
                height: 16px;
                line-height: 20px;
                height: 20px;
                margin-top: -2px;

            }

            .travel-desc {
                margin-top: 10px;
                color: #808080;
                font-size: 12px;

                .peopleNum {
                    display: inline-block;
                }

                .skuInfoStr {
                    display: inline-block;
                    margin-right: 10px;
                }
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
            font-weight: 500;
            color: #000000;
            padding-left: 12px;
            padding-bottom: 16px;
            font-size: 14px;
            border-bottom: 0.5px solid #EEEEEE;

        }

        .counponList {
            margin: 0 12px;

            .counpon {

                margin-top: 16px;
                padding: 16px 24px;
                background: #F8F8F8;
                border-radius: 12px;

                .counpon-box {
                    display: flex;
                    justify-content: center;

                    &.pack {
                        justify-content: flex-start;
                    }
                }

                .product {
                    margin-top: 12px;

                    .product-tl {
                        color: #808080;
                        font-size: 14px;
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
            border: 1px solid #CCCCCC;
            border-radius: 170px;
        }

        .explain-item {
            margin: 16px 12px 0;
            white-space: nowrap;
            font-family: PingFang SC;
            font-size: 12px;
            font-style: normal;
            font-family: PingFang SC;
            line-height: 18px;
            color: #808080;

            .desc {
                &.open {
                    max-height: none;
                }

                max-height: 90px;
                overflow: hidden;
            }
        }

        .checkInInfo,
        .guestsInfo {
            padding: 10px 12px;
            margin-top: 8px;
            display: flex;

            &.guestsInfo {
                margin-top: 0;
                padding: 0;

            }

            .label {
                min-width: 3em;
                margin-right: 12px;
                font-size: 14px;
                color: #808080;
            }

            .occupant {

                flex: 1;

                .bed-type {
                    color: #000000;
                    font-size: 14px;

                    &.hotel-bed {

                        display: flex;
                        justify-content: space-between;

                        .date {
                            color: #808080;
                        }
                    }

                }

                .name {
                    // margin-top: 16px;
                    color: #000000;
                    font-size: 14px;
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

        .travelersInfo-item2 {
            display: flex;
            justify-content: space-between;
            padding-top: 8px;

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

                .val-txt {
                    flex: 1;
                    overflow: hidden;
                    height: 22px;
                    line-height: 22px;
                }

                .icon-a-12_youlajiantou_hui {
                    font-size: 12px;
                    margin-left: 5px;
                }

                &.price {
                    font-family: 'Montserrat';
                    font-weight: 600;
                    font-size: 16px;
                }

                &.red {
                    color: #A43127;
                }

                .icon-a-12_fuzhi {
                    margin-left: 5px;
                }
            }
        }

        .travelersInfo-list {
            padding: 8px 0 0px;
        }

        .price-box {
            padding: 8px 0;
            position: relative;

            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 12px;
                right: 12px;
                border-bottom: 0.5px solid #EEEEEE;
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

        .travelersInfo-item {
            display: flex;
            justify-content: space-between;
            padding: 4px 12px;

            &.total-price {
                .label {
                    font-weight: 600;
                    color: #000;
                }

                .val {
                    font-family: 'Montserrat';
                    font-weight: 600;
                    font-size: 16px;
                }
            }

            &.exchangeInfo {
                .val {
                    text-align: left;
                }
            }

            .label {
                flex: 1;
                font-size: 14px;
                color: #808080;
                line-height: 22px;
                white-space: nowrap;
                margin-right: 50px;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .val {
                display: flex;
                align-items: center;
                font-size: 14px;
                line-height: 22px;
                color: #000000;
                text-align: right;

                .val-txt {
                    flex: 1;
                    overflow: hidden;
                    height: 22px;
                    line-height: 22px;
                }

                .icon-a-12_youlajiantou_hui {
                    font-size: 12px;
                    margin-left: 5px;
                }

                &.price {
                    font-family: 'Montserrat';
                    font-weight: 600;
                    font-size: 16px;
                }

                &.red {
                    color: #A43127;
                }

                .icon-a-12_fuzhi {
                    margin-left: 5px;
                }
            }
        }

        // .info-more {
        //     position: relative;
        //     padding-bottom: 12px;
        //     margin-bottom: 8px;

        //     &::after {
        //         content: '';
        //         position: absolute;
        //         bottom: 0;
        //         left: 12px;
        //         right: 12px;
        //         border-bottom: 0.5px solid #EEEEEE;
        //     }
        // }

        .open-btn {
            margin-top: 12px;
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
            padding: 8px 4px 0 12px;
            display: flex;
            flex-wrap: wrap;

            .annex-item {
                margin-top: 8px;
                display: flex;
                padding: 8px 16px;
                color: #000000;
                font-size: 12px;
                border-radius: 4px;
                border: 1px solid #ccc;
                margin-left: 8px;

                .icon-a-12_fujian {
                    margin-right: 5px;
                }
            }
        }
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
        padding: 12px 8px;
        z-index: 2;
        padding-bottom: calc(constant(safe-area-inset-bottom) + 12px);
        padding-bottom: calc(env(safe-area-inset-bottom) + 12px);

        .btns {
            display: flex;

            .btn-def {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 16px;
                font-size: 14px;
                height: 38px;
                border: 0.5px solid #1e1e1e;
                border-radius: 4px;
                flex: 1;
                margin: 0 8px;
            }
        }
    }

    .card {

        width: calc(~"100% - 32px");
        margin: 0 auto;
        background: #fff;
        margin-top: 12px;
        border-radius: 8px;

        .linkItem {
            height: 48px;
            display: flex;
            align-items: center;
            position: relative;
            padding: 0 12px;
            justify-content: space-between;

            &.arrow {
                &:after {
                    left: calc(~"100% - 12px");
                }
            }

            .title {
                font-size: 14px;
                color: #000000;
            }
        }
    }
}
</style>
