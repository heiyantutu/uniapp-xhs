<template>
	<div class="ui_confirmOrder">
		<!-- #ifdef MP -->
		<coustom-head color="#fff" title="确认订单" customClass="customPattern"></coustom-head>
		<!-- #endif -->
		<div class="travel-info" v-if="productType=='shop'" :style="{paddingTop:navHeight+'px'}">
			<div class="name">{{travelInfo.goodsName}}</div>
			<div class="infos">
				<div class="info" v-if="travelInfo.skuInfoStr">
					<div class="label">产品系列</div>
					<div class="val">{{travelInfo.skuInfoStr}}</div>
				</div>
				<div class="info" v-if="travelInfo.peopleNum">
					<div class="label">适用人数</div>
					<div class="val">{{travelInfo.peopleNum}}名成人</div>
				</div>
				<div class="info" v-if="travelInfo.vrType!='pack'">
					<div class="label">使用期限</div>
					<div class="val">{{travelInfo.useTime}}</div>
				</div>
			</div>
		</div>
		<div class="travel-info" v-else :style="{paddingTop:navHeight+'px'}">
			<div class="name">{{travelInfo.title}}</div>
			<div class="infos">
				<div class="info">
					<div class="label">行程路线</div>
					<div class="val">{{travelInfo.itineraryDesc}}</div>
				</div>
				<div class="info">
					<div class="label">出行日期</div>
					<div class="val">{{travelInfo.groupBeginDateFormat}} - {{travelInfo.groupEndDateFormat}}</div>
				</div>
				<div class="info" v-if="travelInfo.priceModel=='PACKAGE'">
					<div class="label">预订套数</div>
					<div class="val">{{travelInfo.number}}套（{{travelNumber}}人使用）</div>
				</div>
				<div class="info" v-else>
					<div class="label">出行人数</div>
					<div class="val">{{travelNumber}}人</div>
				</div>
				<div class="info">
					<div class="label">房间数量</div>
					<div class="val">{{orderData.rsvDtos.length}}间</div>
				</div>
			</div>
		</div>
		<div class="form-infos">
			<div class="form-info" v-if="productType=='shop'">
				<div class="tl">
					预订信息
				</div>
				<div class="form-inline" v-if="travelInfo.vrType!='pack'">
					<div class="label">预订份数</div>
					<div class="val end">
						<div class="number">
							<i class="iconfont icon-a-20_jian" :class="{'invalid':goodsData.number<=minLimit}"
								@click="changeNum('reduce')"></i>
							<div class="num">{{goodsData.number}}</div>
							<i class="iconfont icon-a-20_jia" :class="{'invalid':goodsData.number>=goodsData.stock}"
								@click="changeNum('add')"></i>
						</div>
					</div>
				</div>
				<!-- <div class="form-inline">
					<div class="label">计划日期</div>
					<div class="val">
						<div class="select-box" @click="showCalendar()">
							<div class="text" v-if="!goodsData.toDate">请选择计划出行日期</div>
							<div class="date" v-else>{{goodsData.fromDate}} - {{goodsData.toDate}}</div>
							<i class="iconfont icon-a-16_youlajiantou_hei"></i>
						</div>
					</div>
				</div> -->
				<div class="form-inline">
					<div class="label">订单备注</div>
					<div class="val center">
						<textarea class="textarea-text" auto-height disable-default-padding=true placeholder="请填写留言 (选填)"
							placeholder-style="color: #CCCCCC;"  v-model="goodsData.remark"></textarea>
					</div>
				</div>
			</div>

			<div class="form-info" v-for="(item,i) in orderData.rsvDtos" :key="i" v-if="productType!='shop'">
				<div class="tl">
					房型意向<template v-if="orderData.rsvDtos.length>1">{{i+1}}</template>
					<div class="iconfont icon-a-20_jian_fangxing" @click="delRsv(orderData.rsvDtos,i)"
						v-if="i>0&&travelInfo.orderType!='FreeTravel'"></div>
				</div>
				<div class="form-inline padding">
					<div class="label">床型</div>
					<div class="val">
						<div class="radio-warp bedType" v-if="!bedTypeAjax">
							<radio-box :datas="bedTypes" v-model:val="item.rmClass" dataKey="rmClass">

							</radio-box>

						</div>
					</div>
				</div>
				<div class="form-inline padding">
					<div class="label">出行人</div>
					<div class="vals">
						<div class="val" v-if="item.guestDtos.length>0">
							<div class="check-in-infos">
								<div class="check-in-info" v-for="(guest,j) in item.guestDtos" :key="j">
									<div class="iconfont icon-a-16_guanbi_ciji" @click="delGuest(item.guestDtos,j)">
									</div>
									<div class="name">{{guest.name}}
										<div class="ageType" v-if="guest.ageType!='adult'">{{guest.ageTypeDesc}}</div>
									</div>
									<div class="id-card">
										<div class="idCardType">{{idCardType[guest.idCode]}}</div>
										{{hideIdCard(guest.idNo)}}</div>
								</div>

							</div>
						</div>
						<div class="val">
							<div class="already-box" @click="showCheckIn(i+1)" v-if="item.guestDtos.length==0">+ 请选择
							</div>
							<div class="already-box2" @click="showCheckIn(i+1)"
								v-else-if="item.guestDtos.length>0&&isAddGuest">+
								添加出行人</div>
						</div>

					</div>


				</div>

				<div class="form-inline"
					v-if="travelInfo.priceModel == 'PEOPLE'&&item.adultBigChildrenNum==1&&singleRoomRateSum>0">
					<div class="label">独享房间</div>
					<div class="val">
						<div class="text">需支付单房差<div class="price">¥{{singleRoomRateSum}}</div>
						</div>
					</div>
				</div>
				<div class="form-inline" v-if="travelInfo.orderType=='FreeTravel'">
					<div class="label">申请加床</div>
					<div class="val">
						<div class="select-box" @click="needAddBad(item)">
							<div class="text black" v-if="item.adultAddBed==1">需要加床</div>
							<div class="text" v-else>不需加床</div>
							<i class="iconfont icon-danxuan_yixuan" v-if="item.adultAddBed"></i>
							<i class="iconfont icon-danxuan_weixuan" v-else></i>

						</div>
					</div>
				</div>
			</div>
			<div class="tips" v-if="travelInfo.orderType =='FreeTravel'"><i
					class="iconfont icon-a-12_tishi"></i>如需增加房间，请联系客服下单<div class="customer" @click="showKf()">联系客服<i
						class="iconfont icon-a-12_youlajiantou_hei"></i></div>
			</div>

			<div class="form-info" v-if="isAddRoom&&isAddGuest">
				<div class="add-btn" @click="addRsv()"><i class="iconfont icon-a-20_jia_fangxing"></i>添加房间</div>
			</div>
			<div class="form-info">
				<div class="tl">
					联系人
				</div>
				<div class="form-inline">
					<div class="label">姓名</div>
					<div class="val">
						<input class="input-text" v-model="orderData.reserveOrderDto.rsvMan" type="text"
							placeholder="请输入姓名" placeholder-style="color: #CCCCCC;">
					</div>
				</div>
				<div class="form-inline">
					<div class="label">手机号</div>
					<div class="val">
						<input class="input-text" v-model="orderData.reserveOrderDto.mobile" type="text"
							placeholder="请输入手机号" maxlength="11" placeholder-style="color: #CCCCCC;">
					</div>
				</div>
			</div>
			<div class="form-info" >
				<div class="tl">
					优惠方案
				</div>
				<div class="form-inline padding" v-if="travelInfo.priceDtos&&travelInfo.priceDtos.length>1">
					<div class="val">
						<div class="radio-warp">
							<radio-box class="miniRadio" :datas="travelInfo.priceDtos" ref="daysRadio"
								v-model:val="orderData.reserveOrderDto.payType" dataKey="payType">
							</radio-box>
						</div>
					</div>
				</div>
				<div class="form-inline padding" v-else-if="travelInfo.credit&&productType == 'shop'">
					<div class="val">
						<div class="radio-warp">
							<radio-box class="miniRadio" :datas="travelInfo.priceDtos" ref="daysRadio"
								v-model:val="orderData.reserveOrderDto.payType" dataKey="payType">
							</radio-box>
						</div>
					</div>
				</div>
				<div class="form-inline padding"
					v-if="travelInfo.priceModel == 'FAMILY'&&travelInfo.specificationsPriceDtos&&travelInfo.specificationsPriceDtos.length>1">
					<div class="val">
						<div class="radio-warp">
							<radio-box class="miniRadio" :datas="travelInfo.specificationsPriceDtos" ref="daysRadio"
								v-model:val="orderData.reserveOrderDto.payType" dataKey="payType">
							</radio-box>
						</div>
					</div>
				</div>

				<div class="form-inline"
					v-if="orderData.reserveOrderDto.payType=='INTEGRAL'||orderData.reserveOrderDto.payType=='INTEGRALCASH'">
					<div class="label">积分</div>
					<div class="val">
						<div class="select-box">
							<div class="red">-{{valFormat(payPrice.point)}}</div>

						</div>
					</div>
				</div>
				<div class="form-inline"
					v-if="(orderData.reserveOrderDto.payType=='CASH'||orderData.reserveOrderDto.payType=='INTEGRALCASH'||productType=='shop')&&discountList.length>1">
					<div class="label">会员折扣</div>
					<!-- <div class="val">

						<div class="select-box" @click="isMemberDiscount=!isMemberDiscount">
							<div class="text" v-if="!isMemberDiscount">{{user.cardLevelDescript}}会员{{rightsValue*100}}折
							</div>
							<div class="text red" v-else>-¥{{memberDscAmount}}</div>
							<i class="iconfont icon-danxuan_yixuan" v-if="isMemberDiscount"></i>
							<i class="iconfont icon-danxuan_weixuan" v-else></i>

						</div>
					</div> -->
					<div class="val">
						<div class="select-box" @click="showDiscount">
							<div class="text" v-if="!discountType">
								{{discountList[0].desc}}{{formatDiscount(discountList[0].discount*10)}}折
							</div>
							<div class="text red" v-else>-¥{{valFormat(payPrice.memberDscAmount)}}</div>
							<i class="iconfont icon-danxuan_yixuan" v-if="isMemberDiscount"></i>

						</div>
					    <i class="iconfont icon-a-16_youlajiantou_hei"></i>
					</div>
				</div>
				<div class="form-inline"
					v-if="orderData.reserveOrderDto.payType=='CASH'||orderData.reserveOrderDto.payType=='INTEGRALCASH'||productType=='shop'">
					<div class="label">券包</div>
					<div class="val" @click="showCoupon()" v-if="listCouponDetailNew.length>0">
						<div class="select-box">
							<div class="text" v-if="currentChooseCoupon.length==0">请选择券包
								<div class="coupon-num">{{listCouponDetailNew.length}}张可用</div>
							</div>
							<div class="text red" v-else>-¥{{valFormat(coupnoMinsPrice)}}</div>
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
		<div class="rule">
			请确认所填写信息与所持证件信息一致，因信息不完整，填写不正确造成的额外损失、保险拒赔等问题，我司不承担相应责任，需由客人咨询承担。<br>
			大于2周岁不满12周岁的儿童不可使用出生证明，请使用身份证、户口本等，乘机请携带填写的相应证件。
		</div>
		<div class="footer">
			<div class="price-info" v-if="!showPrice">
				<div class="price">
					¥----
				</div>
				<div class="price-tips">
					填写出行人后可见
				</div>
			</div>
			<div class="price-info" v-else>
				<div class="price weight" @click="showPriceInfo()">
					<div class="price-box" :class="{'point-box':payPrice.rateSum<=0&&payPrice.point>=0}">
						<template v-if="payPrice.rateSum>0||(payPrice.rateSum<=0&&payPrice.point<=0)">
							¥{{priceFormat(payPrice.rateSum)}}
						</template>
						<div class="point" v-if="payPrice.point>0">积分{{valFormat(payPrice.point)}}</div>
					</div>

					<div class="price-detail">明细<i class="iconfont icon-a-12_shanglajiantou_hei"></i></div>
				</div>
			</div>
			<div class="submit-btn baseBtn" @click="ordering()">立即预订</div>
		</div>
		<bottom-dialog ref="checkIn" :title="'选择房间'+rsvDtoTl+'出行人'" maxDialog>
			<div class="layer-box">
				<div class="add-btn-box">

					<div class="add-btn"
						@click="addTraveler()">
						<div class="icon icon-add">+</div>新增出行人
					</div>
				</div>
				<div class="info-list">
					<div class="info-item" v-for="(item,i) in contactsList" :key="i"  @click="chooseContact(item)">
						<div class="info-item-lf" >
							<div class="iconfont icon-a-16_bianji" @click.stop="editTraveler(item)"></div>
							<div class="info-item-lf-info">
								<div class="info-item-name">
									{{item.name}}
									<div class="ageType" v-if="item.ageType!='adult'">{{item.ageTypeDesc}}</div>
								</div>
								<div class="info-item-id-card">
									{{idCardType[item.idCode]}} {{hideIdCard(item.idNo)}}
								</div>
							</div>
						</div>
						<div class="icon-duoxuan_yixuan noCan iconfont" v-if="item.activeNotCan"></div>
						<div class="icon-duoxuan_yixuan iconfont" v-else-if="item.active" >
						</div>
						<div class="icon-duoxuan_weixuan iconfont" v-else></div>

					</div>
					


				</div>
				<div class="layer-footer">
					<div class="layer-btn baseBtn" @click="hideCheckIn()">
						完成
					</div>
				</div>

			</div>
		</bottom-dialog>
		<bottom-dialog ref="couponListLayer" title="选择券包" maxDialog>
			<div class="couponList">
				<div class="listItem" v-for="(coupon, index) in listCouponDetailNew" :key="index">
					<coupon-item :couponItem="coupon" @chooseCoupon="chooseCoupon" :isSelect=isSelect
						@toggleCoupon="toggleCoupon"></coupon-item>
				</div>
			</div>
			<div class="layer-footer">
				<div class="layer-btn baseBtn" @click="sureCoupon">
					完成
				</div>
			</div>
		</bottom-dialog>
		<bottom-dialog ref="discountListLayer" title="选择折扣">
			<div class="discount-list">
				<div class="discount-item" v-for="(item,i) in discountList" :key="i" @click="chooseDiscount(item)">
					<div class="discount-lf">
						<div class="discount-desc">
							{{item.desc}}
						</div>
						<div class="discount-val" v-if="item.type">
							{{formatDiscount(item.discount*10)}}
							<div class="val-desc">折</div>
						</div>
					</div>
					<div class="select" v-if="isSelect">
						<image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/select.png"
							mode="" class="iconfont" v-if="item.choosed" />
						<image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/unSelect.png"
							mode="" class="iconfont" v-else />
					</div>
				</div>

			</div>
			<div class="layer-footer">
				<div class="layer-btn baseBtn" @click="sureDiscount">
					完成
				</div>
			</div>
		</bottom-dialog>
		<bottom-dialog ref="priceInfo" title="费用明细" style="z-index: 1;">
			<div class="priceInfo">
				<div class="price-item">
					<div class="main noMargin">
						订单总价
						<div class="price" v-if="(payPrice.basicTeamRateSum+payPrice.singleRoomRateSum+payPrice.guaranteedPrice)>0||payPrice.point<=0">
							¥{{priceFormat(payPrice.basicTeamRateSum+payPrice.singleRoomRateSum+payPrice.guaranteedPrice)}}
							<template v-if="(payPrice.basicTeamRateSum+payPrice.singleRoomRateSum+payPrice.guaranteedPrice)>0&&payPrice.point>0"> + </template>
							<template v-if="payPrice.point>0">积分{{valFormat(payPrice.point)}}</template>
						</div>
						<div class="price" v-else-if="(payPrice.basicTeamRateSum+payPrice.singleRoomRateSum)<=0&&payPrice.point>0">
							积分{{valFormat(payPrice.point)}}
						</div>
					</div>
					<div class="other" v-if="productType == 'shop'">
						<div class="label">
							{{travelInfo.goodsName}}
						</div>
						
						<div class="price" v-if="payPrice.point">
						   (¥{{priceFormat(payPrice.basicTeamRateSum/goodsData.number)}}+{{valFormat(payPrice.point/goodsData.number)}}积分) x {{goodsData.number}}份
						</div>
						<div class="price" v-else>
							¥{{priceFormat(payPrice.basicTeamRateSum/goodsData.number)}} x {{goodsData.number}}份
						</div>
					</div>
					<div class="other" v-if="productType != 'shop'">
						产品价合计
						<div class="price" v-if="payPrice.basicTeamRateSum>0||payPrice.point<=0">
							¥{{priceFormat(payPrice.basicTeamRateSum)}}
							<template v-if="payPrice.basicTeamRateSum>0&&payPrice.point>0"> + </template>
							<template v-if="payPrice.point>0">积分{{valFormat(payPrice.point)}}</template>
						</div>
						<div class="price" v-else-if="payPrice.basicTeamRateSum<=0&&payPrice.point>0">
							积分{{valFormat(payPrice.point)}}
						</div>
					</div>
					<div class="other" v-if="payPrice.adultTeamRateSum>0">
						含成人
						<div class="price" v-if="payPrice.point">
						   (¥{{priceFormat(payPrice.adultTeamRateSum/payPrice.adult)}}+{{valFormat(payPrice.point/payPrice.adult)}}积分) x {{payPrice.adult}}份
						</div>
						<div class="price" v-else>
							¥{{priceFormat(payPrice.adultTeamRateSum/payPrice.adult)}} x {{payPrice.adult}}份
						</div>
					</div>
					<div class="other" v-if="payPrice.bigChildrenTeamRateSum>0">
						含大童
						<div class="price">
							¥{{priceFormat(payPrice.bigChildrenTeamRateSum/payPrice.bigChildren)}} x {{payPrice.bigChildren}}份
						</div>
					</div>
					<div class="other" v-if="payPrice.midChildrenTeamRateSum>0">
						含中童
						<div class="price">
							¥{{priceFormat(payPrice.midChildrenTeamRateSum/payPrice.midChildren)}} x {{payPrice.midChildren}}份
						</div>
					</div>
					<div class="other" v-if="payPrice.babyTeamRateSum>0">
						含幼童
						<div class="price">
							¥{{priceFormat(payPrice.babyTeamRateSum/(payPrice.baby-payPrice.babyRoomNum))}} x {{payPrice.baby-payPrice.babyRoomNum}}份
						</div>
					</div>
					<div class="other" v-if="payPrice.singleRoomRateSum>0">
						单房差
						<div class="price">
							¥{{priceFormat(payPrice.singleRoomRateSum/singleRoomPeople)}} x {{singleRoomPeople}}份
						</div>
					</div>
					<div class="other" v-if="payPrice.guaranteedPrice">
						保底调整
						<div class="price">
							¥{{priceFormat(payPrice.guaranteedPrice)}}
						</div>
					</div>
					
					<div class="main" v-if="(payPrice.memberDscAmount+payPrice.couponRateSum)>0">
						权益抵扣
						<div class="price red">
							-¥{{priceFormat(payPrice.memberDscAmount+payPrice.couponRateSum)}}
						</div>
					</div>
					<!-- <div class="other" v-if="payPrice.point>0">
						积分
						<div class="price">
							-积分{{valFormat(payPrice.point)}}
						</div>
					</div> -->
					<div class="other" v-if="payPrice.memberDscAmount>0">
						会员折扣
						<div class="price">
							-¥{{priceFormat(payPrice.memberDscAmount)}}
						</div>
					</div>

					<div class="other" v-if="currentChooseCoupon.length>0" v-for="(item,i) in currentChooseCoupon" :key="i">
						{{item.couponName}}
						<div class="price">
							-¥{{item.realValue}}
						</div>
					</div>

				</div>
				<div class="footer">
					<div class="price-info">
						<div class="price weight" @click="showPriceInfo()">
							<div class="price-box" :class="{'point-box':payPrice.rateSum<=0&&payPrice.point>=0}">
								<template v-if="payPrice.rateSum>0||(payPrice.rateSum<=0&&payPrice.point<=0)">
									¥{{priceFormat(payPrice.rateSum)}}
								</template>

								<div class="point" v-if="payPrice.point>0">积分{{valFormat(payPrice.point)}}</div>
							</div>

							<div class="price-detail">明细<i class="iconfont icon-a-12_shanglajiantou_hei"></i></div>
						</div>
					</div>
					<div class="submit-btn baseBtn" @click="ordering()">立即预订</div>
				</div>
			</div>

		</bottom-dialog>
		<calendar ref="calendarCompent" @change-date="changeDate" :checkInDay="fromDate" :checkOutDay="toDate">
		</calendar>
		<kf-dialog ref="kf" title="联系客服"></kf-dialog>
	</div>
</template>

<script setup lang="ts">
	import { reactive, ref, computed, onMounted, watch } from "vue";
	import { onShow, onLoad } from "@dcloudio/uni-app";
	import UmengSDK from "@/utils/umengAdaptor.js";
	import api from "@/utils/api";
	import { getStorage } from "@/utils/wxuser";
	import couponItem from "@/components/couponItem.vue";
	import bottomDialog from "@/components/bottomDialog.vue";
	import coustomHead from "@/components/coustomHead.vue";
	import kfDialog from "@/components/kfDialog.vue";
	import radioBox from "@/components/radioBox.vue";
	import calendar from "@/components/calendar.vue";
	import { priceFormat,valFormat,hideIdCard } from "@/utils/filter";
	import { jAlert3 } from "@/base/jAlert/jAlert";
	import defaultOtaChannel from "@/utils/defaultOtaChannel";
	import dayjs from "dayjs";
	import { goPage } from "@/utils/utils";
	let config = getStorage("config");
	let user = getStorage("user");
	let wxuser = getStorage("wxuser");
	let travelInfo = getStorage('travelInfo')

	const calendarCompent = ref();
	const checkIn = ref();
	const travelNumber = ref(0);
	const productType = ref('');
	const couponListLayer = ref();
	const priceInfo = ref();
	const isMemberDiscount = ref(false);
	const discountType = ref('')
	const contactsList : any = ref([])
	const rsvDtoTl = ref("")
	const navHeight = ref(0)
	const singleRoomRateSum = ref(0)
	const singleRoomPeople = ref(0)//独占房间人数
	const rightsValue = ref(0)
	const discountList : any = ref([])
	const discountListLayer = ref()
	const showPrice = ref(false)
	const sourceActivityId = ref("");
	const sourceActivityName = ref("");
	const minLimit = ref(1);
	const kf = ref()
	const bedTypeAjax = ref(true)
	let otaChannel = ref(defaultOtaChannel);
	let currentChooseCoupon : any = ref([]);
	let isSelect = ref(true);
	let listCouponDetail = ref<any>([]);
	let fromDate = ref(dayjs().format("YYYY-MM-DD"));
	let toDate = ref(dayjs().add(1, "days").format("YYYY-MM-DD"));
	let isAjax = ref(false)
	let couponNo = ref('')
	const changeDate = (time : any) => {
		goodsData.fromDate = dayjs(time.checkInDay).format("YYYY.MM.DD");
		goodsData.toDate = dayjs(time.checkOutDay).format("YYYY.MM.DD");
	};
	
	let coupnoMinsPrice = ref(0)
	let memberDscAmount = ref(0)
	let useExchangeCoupon = ref(false)
	let canRequest = ref(true)
	let bedTypes : any = reactive([])
	let canBedTypes : any = reactive([])
	let idCardType = reactive({
		"01": "身份证",
		"02": "临时身份证",
		"14": "护照",
		"21": "港澳通行证"
	})
	let payPrice : any = ref({
		basicTeamRateSum: 0,//基本团费
		exchangeRateSum: 0,//抵额
		point: 0,//积分
		rateSum: 0,//订单金额
		memberDscAmount: 0,//会员折扣金额
		couponRateSum: 0,//券抵额 
		singleRoomRateSum:0,
		guaranteedPrice:0

	})

	let payTypes = reactive([
		{
			id: 'CASH',
			name: '现金'
		},
		{
			id: 'INTEGRALCASH',
			name: '现金+积分'
		},
		{
			id: 'INTEGRAL',
			name: '积分'
		}
	])
	let goodsData : any = reactive({
		remark: '',
		fromDate: '',
		toDate: '',
	})
	let orderData : any = reactive({
		allPeople: 0,
		openid: wxuser.openid,
		reserveOrderDto: {
			"appid": config.appid,
			"price": 0,
			"integral": 0,
			"productUrl": travelInfo.productUrl,
			"unitCode": config.hotelGroupCode,
			"orderNo": "",
			"otaRsvNo": "",
			"teamNo": travelInfo.travelGroupCode,
			"adviceNo": "",
			"itineraryCode": travelInfo.itineraryCode,
			"orderType": travelInfo.orderType,
			"orderTypeDesc": travelInfo.orderTypeDesc,
			"orderSource": "",
			"orderSubSource": "",
			"rsvClass": "",
			"rsvMan": "",
			"otaChannel": otaChannel.value,
			"mobile": "",
			"productCode": travelInfo.travelType,
			"productDesc": travelInfo.title,
			"meetingPoint": travelInfo.meetingPoint,
			"memberNo": user.memberId,
			"memberId": user.memberId,
			"memberLevel": user.memberLevel,
			"cardId": user.cardId,
			"cardNo": user.cardNo,
			"companyNo": "",
			"companyDesc": "",
			"beginDate": travelInfo.groupBeginDate,
			"endDate": travelInfo.groupEndDate,
			"priceType": travelInfo.specificationsType,
			"adult": 0,
			"bigChildren": 0,
			"children": 0,
			"baby": 0,
			"num": travelInfo.number||1,
			"realRate": 0,
			"rateSum": 0.0,
			"singleRoomPrice": 0.0,
			"counselor": "",
			"isMiniProgram": "",
			"agency": travelInfo.isSigning,
			"belongMain": "",
			"belongSeason": "",
			"remark": "",
			"payType": "",

		},
		"dscAmountInfoDto": {
			cardNo: user.cardNo,
			memberDiscount: "",
			memberDiscountAmount: "",
			memberNo: user.memberId,
			pay: 0,
			payType: '',
			point: '',
			pointMoney: '',
			memberLevelDesc: '',
			adultTeamRateSum: '',
			basicTeamRateSum: '',
			childrenTeamRateSum: '',
			singleRoomRateSum: '',
			guaranteedPrice:0

		},
		"rsvDtos": [{
			"arr": "",
			"dep": "",
			"hotelGroupCode": config.hotelGroupCode,
			"hotelCode": config.hotelCode,
			"rmtype": "",
			"rmtypeDesc": "",
			"productCode": travelInfo.travelType,
			"num": 1,
			"rmClass": "",
			"guestDtos": []
		}]


	})
	let isAddRoom = computed(() => {//是否能添加房间
		let isAddRoom = true
		if (productType.value == 'shop' || travelInfo.priceModel == 'FAMILY' || travelInfo.orderType == 'FreeTravel') {
			isAddRoom = false
		}
		if (travelInfo.priceModel == 'PEOPLE') {
			if (travelNumber.value < 3) {
				isAddRoom = false
			}
			if (orderData.rsvDtos.length >= 2) {
				isAddRoom = false
			}

		}
		if(orderData.rsvDtos.length>=travelNumber.value){
			isAddRoom = false
		}
		return isAddRoom
	})
	let isAddGuest = computed(() => {
		let isAddGuest = true

		if (orderData.allPeople >= travelNumber.value) {
			isAddGuest = false
		}

		return isAddGuest
	})
	let listCouponDetailNew = computed(() => {
		let listCouponDetailNew = JSON.parse(JSON.stringify(listCouponDetail.value))
		for (let index = 0; index < listCouponDetailNew.length; index++) {
			const item = listCouponDetailNew[index];
			
			if((payPrice.value.basicTeamRateSum+payPrice.value.singleRoomRateSum)<item.discountPriceBegin){
	
				for (let i = 0; i <  currentChooseCoupon.value.length; i++) {
					const coupon = currentChooseCoupon.value[i];
					
					if(coupon.no==item.no){
						currentChooseCoupon.value.splice(i, 1);
						i--;
					}

				}
				listCouponDetailNew.splice(index, 1);
                index--;
			}
		}
		
		return listCouponDetailNew
		
	})
	watch(() => payPrice.value.basicTeamRateSum, (newVal, oldVal) => {
		queryPayDetail()
	})
	watch(() => currentChooseCoupon.value, (newVal, oldVal) => {//支付方式
		if (currentChooseCoupon.value.length > 0) {
			
			if (currentChooseCoupon.value[0].groupCode == "EXCHANGECOUPON"||currentChooseCoupon.value[0].discountType == 'LZ' || currentChooseCoupon.value[0].discountType == 'MZ') {
				useExchangeCoupon.value = true
				discountType.value = ""
				discountList.value.forEach((discount : any) => {
					discount.choosed = false
				})
			} else {
				useExchangeCoupon.value = false
			}
		} else {
			useExchangeCoupon.value = false
		}

		queryPayDetail()

	})
	watch(() => discountType.value, (newVal, oldVal) => {//会员折扣
		queryPayDetail()
	})
	watch(() => orderData.reserveOrderDto.payType, (newVal, oldVal) => {//支付方式
		orderData.dscAmountInfoDto.payType = orderData.reserveOrderDto.payType
		if (travelInfo.priceModel == 'PEOPLE') {
			travelInfo.priceDtos.forEach((item : any) => {
				if (item.payType == 'CASH') {
					singleRoomRateSum.value = item.singleSupplement
				}

			})

		}
		queryPayDetail()

	})
	watch(() => goodsData.number, (newVal, oldVal) => {//通兑券商品数量
		if (productType.value == 'shop') {
			queryPayDetail()
		}

	})
	watch(() => orderData.allPeople, (newVal, oldVal) => {
		if (travelNumber.value == orderData.allPeople) {
			queryPayDetail()
		} else {
			payPrice.value = {
				basicTeamRateSum: 0,//基本团费
				exchangeRateSum: 0,//抵额
				point: 0,//积分
				rateSum: 0,//订单金额
				memberDscAmount: 0,//会员折扣金额
				couponRateSum: 0,//券抵额 
				singleRoomRateSum:0
			}
			showPrice.value = false
		}
	})
	watch(() => orderData.rsvDtos, (newVal, oldVal) => {//宾客信息
		singleRoomPeople.value = 0
		orderData.reserveOrderDto.adult = 0
		orderData.reserveOrderDto.baby = 0
		orderData.reserveOrderDto.children = 0
		orderData.reserveOrderDto.bigChildren = 0
		orderData.allPeople = 0

		orderData.rsvDtos.forEach((item : any) => {
			var adultBigChildrenNum = 0
			item.guestDtos.forEach((guest : any) => {
				if (guest.ageType == 'adult' || guest.ageType == 'bigChildren') {
					adultBigChildrenNum++
				}
				if (guest.ageType == 'adult') {
					orderData.reserveOrderDto.adult++
				}
				if (guest.ageType == 'baby') {
					orderData.reserveOrderDto.baby++

				}
				if (guest.ageType == 'children') {
					orderData.reserveOrderDto.children++

				}
				if (guest.ageType == 'bigChildren') {
					orderData.reserveOrderDto.bigChildren++
				}
				orderData.allPeople++
			})

			if (adultBigChildrenNum == 1 && travelInfo.priceModel == 'PEOPLE') {
				singleRoomPeople.value++
			}
			item.adultBigChildrenNum = adultBigChildrenNum
		})


	}, { deep: true })
	// const getMemberDscAmount = () => {
	// 	let memberDscAmount = 0
	// 	if (isMemberDiscount.value) {
	// 		memberDscAmount = Number((Number(1 - rightsValue.value) * Number(payPrice.value.basicTeamRateSum + payPrice.value.singleRoomRateSum)).toFixed(2))
	// 	} else {
	// 		memberDscAmount = 0
	// 	}
	// 	return memberDscAmount
	// }
	const formatDiscount = (val : any) => {
		return Number(Number(val).toFixed(2))
	}
	const sureDiscount = () => {
		discountType.value = ''
		discountList.value.forEach((discount : any) => {
			if (discount.choosed) {
				discountType.value = discount.type
			}
		})
		hideDiscount()

	}
	const needAddBad = (item : any) => {
		if (item.adultAddBed) {
			item.adultAddBed = 0
		} else {
			item.adultAddBed = 1
		}
	}
	const chooseDiscount = (item : any) => {
		discountList.value.forEach((discount : any) => {
			discount.choosed = false
		})
		item.choosed = true
	}
	
	const getDiscountPrice = () => {
		if(!payPrice.value.guaranteedPrice){
			payPrice.value.guaranteedPrice = 0
		}
		var allbasePrice = payPrice.value.basicTeamRateSum + payPrice.value.singleRoomRateSum +  payPrice.value.guaranteedPrice
		if (discountType.value && allbasePrice > 0) {
			
			discountList.value.forEach((discount : any) => {
				if (discount.choosed) {
					rightsValue.value = discount.discount
				}
			})
			memberDscAmount.value = Number((Number(1 - rightsValue.value) * Number(allbasePrice)).toFixed(2))
		} else {
			memberDscAmount.value = 0
		}
		coupnoMinsPrice.value = 0
		var allPrice = Number(allbasePrice - memberDscAmount.value)
		currentChooseCoupon.value.forEach((item : any) => {
			var currentChoose = item;
			var discountPrice = 0
			if (currentChoose.discountType == 'LZ' || currentChoose.discountType == 'MZ') {
				discountPrice = Number(allbasePrice) * Number((1 - Number(currentChoose.discountNum)).toFixed(2))
				coupnoMinsPrice.value += discountPrice;
				 

			} else {
				if (Number(Number(currentChoose.discountNum).toFixed(2)) >= Number(allbasePrice)
				) {
					discountPrice = Number(allbasePrice);
					coupnoMinsPrice.value +=discountPrice;

				} else {
					discountPrice = Number(Number(currentChoose.discountNum).toFixed(2));
					coupnoMinsPrice.value += discountPrice;

				}
			}
			if (coupnoMinsPrice.value > allPrice) {
				item.realValue = (allPrice - coupnoMinsPrice.value + discountPrice)>0?Number((allPrice +discountPrice-coupnoMinsPrice.value).toFixed(2)): 0;
			}else{
				item.realValue = discountPrice
			}
		})
		if (coupnoMinsPrice.value > allPrice) {
			coupnoMinsPrice.value = allPrice
		}
		coupnoMinsPrice.value = Number(coupnoMinsPrice.value.toFixed(2));
	}
	const addRsv = () => {
		let obj = {
			"arr": "",
			"dep": "",
			"rmClass": "",
			"hotelGroupCode": config.hotelGroupCode,
			"hotelCode": config.hotelCode,
			"rmtype": "",
			"rmtypeDesc": "",
			"productCode": travelInfo.travelType,
			"num": 1,
			"guestDtos": []
		}
		if (canBedTypes.length > 0) {
			obj.rmClass = canBedTypes[0].rmclass
		}
		orderData.rsvDtos.push(obj)

	}
	const showCheckIn = (index : string) => {
		if (orderData.rsvDtos.length > 1) {
			rsvDtoTl.value = index
		} else {
			rsvDtoTl.value = ''
		}
		const indexNew : string = rsvDtoTl.value || '1'
		contactsList.value.forEach((item : any) => {
			item.active = false
			orderData.rsvDtos[Number(index) - 1].guestDtos.forEach((guest : any) => {
				if (guest.guestSign == item.guestId) {
					item.active = true
				}
			})

		})
		checkIn.value.showDialog();
	};
	const showDiscount = () => {
		if(useExchangeCoupon.value){
			if(currentChooseCoupon.value[0].groupCode == "EXCHANGECOUPON"){
				jAlert3('通兑券不能与会员折扣共享')
			}else{
				jAlert3('折扣券不能与会员折扣共享')
			}
			
			return;
		}
		discountList.value.forEach((item:any)=>{
			if(item.type == discountType.value){
				item.choosed = true
			}else{
				item.choosed = false
			}
		})
		discountListLayer.value.showDialog();
	}
	const hideDiscount = () => {
		discountListLayer.value.hideDialog();
	}
	const guid = () => {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
	const hideCheckIn = () => {
		let chooseGuest = 0;
		contactsList.value.forEach((item: any) => {
			if (item.active||item.activeNotCan) {
				chooseGuest++
			}
			
		});
		if (chooseGuest > travelNumber.value) {
			jAlert3(`最多选择${travelNumber.value}人`);
			return false;
		}
		const index : string = rsvDtoTl.value || '1'
		contactsList.value.forEach((item : any) => {
			if (item.active && !item.activeNotCan) {
				var info = {
					"id": "",
					"guestSign": item.guestId,
					"guestNo": guid(),
					"name": item.name,
					"mobile": item.mobile,
					"sex": item.sex,
					"ageType": item.ageType,
					"age": item.age,
					"nation": "",
					"rmtype": "",
					"prmno": index,
					"isBed": "",
					"isHogging": "",
					"singleRoomPrice": 0.0,
					"idCode": item.idCode,
					"idNo": item.idNo,
					"remark": "",
					"ageTypeDesc": item.ageTypeDesc,
					"birthday":item.birth

				}

				item.activeNotCan = true
				orderData.rsvDtos[Number(index) - 1].guestDtos.push(info)
			}
		})
		checkIn.value.hideDialog();
	};
	const showCoupon = () => {
		listCouponDetail.value.forEach((item:any)=>{
			var choosed = false
			currentChooseCoupon.value.forEach((coupon:any)=>{
				
				if(item.no==coupon.no){
					choosed = true
				}
			})
			if(choosed){
				item.choosed = true
			}else{
				item.choosed  = false
			}
			
		})
		couponListLayer.value.showDialog();
	};
	const showPriceInfo = () => {
		priceInfo.value.showDialog();
	};
	// const hidePriceInfo = () => {
	// 	priceInfo.value.hideDialog();
	// };
	const toPage = (link : string) => {
		uni.navigateTo({
			url: link
		});
	}
	const toRedirect = (link : string) => {
		uni.redirectTo({
			url: link
		});
	}
	const sureCoupon = () => {
		currentChooseCoupon.value = []
		listCouponDetail.value.forEach((n : any, i : number) => {
			if (n.choosed) {
				currentChooseCoupon.value.push(n)
			}
		});
		currentChooseCoupon.value.forEach((item:any)=>{
			if(item.discountType == 'LZ' || item.discountType == 'MZ'){

			}
		})
		couponListLayer.value.hideDialog();
	};
	const chooseCoupon = (data : any) => {
		console.log(data)
	};
	const toggleCoupon = (item : AnyObject) => {

		
		listCouponDetail.value.forEach((coupon : any) => {
			if (item.no == coupon.no) {
				if (!coupon.choosed) {
					coupon.choosed = true
				} else {
					coupon.choosed = false
				}
			}

		})
		if (item.groupCode == 'EXCHANGECOUPON') {
			listCouponDetail.value.forEach((coupon : any) => {
				if (coupon.groupCode != 'EXCHANGECOUPON') {
					coupon.choosed = false
				}
				

			})

		} else {
			listCouponDetail.value.forEach((coupon : any) => {
				if (item.couponNo != coupon.couponNo) {
					coupon.choosed = false
				}

			})


		}

	};
	
	const editTraveler  = (item:any) => {
		UmengSDK.sendEvent("tpp_button_clk", {
			page_name: "travel_detail_pg",
			button_name: '编辑',
			button_id: '编辑',
		});
		toPage('/pagesB/travel/travelersInfo?type=edit&id='+item.guestId+'&endDate='+orderData.reserveOrderDto.endDate)
	}
	const addTraveler  = () => {
		UmengSDK.sendEvent("tpp_button_clk", {
			page_name: "travel_detail_pg",
			button_name: '新增',
			button_id: '新增',
		});
		toPage('/pagesB/travel/travelersInfo?endDate='+orderData.reserveOrderDto.endDate)
	}
	const showCalendar = () => {
		calendarCompent.value.showDialog();
	};
	const listGuestLinkExtraInfoWithMemberIdOrOpenId = () => {
		api.listGuestLinkExtraInfoWithMemberIdOrOpenId({
			channel: 'WECHAT',
			hotelGroupCode: config.hotelGroupCode,
			hotelCode: config.hotelCode,
			memberId: user.memberId,
			openIdType: 'WECHAT'

		}).then((res : any) => {
			if (res.result == 1) {
				if (res.retVal.result == 0) {
					if (res.retVal.retVal.length) {
						let contacts : any[] = []
						res.retVal.retVal.forEach((item : any) => {
							if (item.guestId) {
								if (item.birth) {
									item.age = dayjs(orderData.reserveOrderDto.endDate).diff(item.birth, 'year')
								}
								if (item.age >= 18) {
									item.ageType = 'adult'
									item.ageTypeDesc = '成人'
								}
								else if (item.age >= 12) {
									item.ageType = 'bigChildren'
									item.ageTypeDesc = '大童'
								} else if (item.age >= 6) {
									item.ageType = 'children'
									item.ageTypeDesc = '中童'
								} else {
									item.ageType = 'baby'
									item.ageTypeDesc = '幼童'
								}
								contactsList.value.forEach((contact : any) => {
									if (item.guestId == contact.guestId) {
										item.active = contact.active
										item.activeNotCan = contact.activeNotCan
									}

								})
								contacts.push(item)


							}

						})
						contactsList.value = contacts

					}
				}

			}
		})
	}
	const chooseContact = (item : any) => {
		if(item.activeNotCan){
			return;
		}
		item.active = !item.active
	}


	const delRsv = (rsv : any, index : number) => {
		contactsList.value.forEach((item : any) => {
			rsv[index].guestDtos.forEach((guest : any) => {
				if (guest.guestSign == item.guestId) {
					item.active = false
					item.activeNotCan = false
				}

			})

		})
		rsv.splice(index, 1)
	}
	const delGuest = (guestDtos : any, index : number) => {

		contactsList.value.forEach((item : any) => {
			if (item.guestId == guestDtos[index].guestSign) {
				item.active = false
				item.activeNotCan = false
			}


		})
		guestDtos.splice(index, 1)

	}
	const changeNum = (type : string) => {
		if (type == 'add') {
			if (goodsData.number < goodsData.stock) {
				goodsData.number++
			}

		} else {
			if (goodsData.number > minLimit.value) {
				goodsData.number--
			}

		}
	}
	const listTravelGroupRmtypes = () => {
		api.interfaceTransfer({
			query: {
				"unitCode": config.hotelGroupCode,
				"travelGroupCode":travelInfo.travelGroupCode
			},
			config: {
				"interfaceType": "POST",
				"interfaceModule": "GC_PRODUCT_JOURNEY",
				"interfaceMethod": "/api/travelGroup/listTravelGroupRmtypes",
				"interfaceFrom": "GC",
				"hotelGroupCode": config.hotelGroupCode
			}
		}).then((res : any) => {
			if (res.result == 1 && res.retVal.result == 0) {
				if(res.retVal.retVal&&res.retVal.retVal.length>0){
					canBedTypes = []
					res.retVal.retVal.forEach((item:any)=>{
						
						bedTypes.forEach((type:any)=>{
							
							if(item.rmClass==type.rmClass){
								type.invalid = false
								canBedTypes.push(item)
							}
						})
					})
					orderData.rsvDtos.forEach((item : any) => {
						item.rmClass = canBedTypes[0].rmClass
					})
					
				}
				bedTypeAjax.value = false
			}
		})
	}
	const listTravelRmclassDto = () => {
		api.interfaceTransfer({
			query: {
				"unitCode": config.hotelGroupCode,
				"isHalt": "T"
			},
			config: {
				"interfaceType": "GET",
				"interfaceModule": "GC_PRODUCT_JOURNEY",
				"interfaceMethod": "/api/itinerary/listTravelRmclassDto",
				"interfaceFrom": "GC",
				"hotelGroupCode": config.hotelGroupCode
			}
		})
			.then((res : any) => {

				if (res.result == 1 && res.retVal.result == 0) {
					
					res.retVal.retVal.forEach((item : any) => {
						item.name = item.rmclassDescript
						item.invalid = true
						item.rmClass = item.rmclass
					})
					bedTypes = res.retVal.retVal
					listTravelGroupRmtypes()

				}
			});

	}
	const getDiscountOfMember = () => {
		var opt = {
			"mobile": user.mobile,
			"memberId": user.memberId,
			"goodsId": travelInfo.travelType,
			"hotelGroupCode": config.hotelGroupCode,
			"rightsType": 'travelProductsRightsType',
			"orderType":travelInfo.orderType
		}
		if(productType.value=='shop'){
			opt.rightsType = "exchangeCouponRightsType"
			opt.orderType = "shop"
			opt.goodsId = travelInfo.goodsId
		}
		api.getDiscountOfMember(opt).then((res : any) => {

			if (res.result == 1) {
				var i = -1
				if (res.retVal.memberDiscount < 1) {
					i++
					discountList.value.push({
						discount: res.retVal.memberDiscount,
						type: 'member',
						desc: `${user.cardLevelDescript}会员`
					})
					
				}
				if (res.retVal.partnerDiscount < 1) {
					if(res.retVal.partnerDiscount<res.retVal.memberDiscount){
						i++
					}
					discountList.value.push({
						discount: res.retVal.partnerDiscount,
						type: 'partner',
						desc: `城市合伙人`,
						partnerId: res.retVal.partnerId
					})
				}
				if(discountList.value.length>0&&!couponNo.value){
					chooseDiscount(discountList.value[i])
					sureDiscount()
				}
				
				discountList.value.push({
					discount: 1,
					type: '',
					desc: `不使用折扣`
				})

			}
		});

	}
	// const queryCardLevelRightsWithMemberId = () => {
	// 	api.interfaceTransfer({
	// 		query: {
	// 			"hotelGroupCode": config.hotelGroupCode,
	// 			"memberId": user.memberId,
	// 			"rightsType": 'travelProductsRightsType',
	// 			"rightsItem": 'discount'
	// 		},
	// 		config: {
	// 			"interfaceType": "GET",
	// 			"interfaceModule": "GC_PRODUCT_JOURNEY",
	// 			"interfaceMethod": "crm/v2/queryCardLevelRightsWithMemberId",
	// 			"interfaceFrom": "member",
	// 			"hotelGroupCode": config.hotelGroupCode
	// 		}
	// 	})
	// 		.then((res : any) => {

	// 			if (res.result == 1 && res.retVal.result == 0) {
	// 				if (res.retVal.retVal && res.retVal.retVal.length > 0) {
	// 					rightsValue.value = res.retVal.retVal[0].rightsValue
	// 				}

	// 			}
	// 		});

	// }
	
	const listCouponByUse = () => {
		var opt:any = {
			"hotelGroupCode": config.hotelGroupCode,
			"memberId": user.memberId,
			"productCode": travelInfo.travelType,
			"orderType": "TRAVEL",
			"beginDate": dayjs().format("YYYY-MM-DD HH:mm:ss"),
			"cardNo": user.cardNo
		}
		if(productType.value=='shop'){
			opt.orderType = "SHOP"
			opt.productCode = travelInfo.goodsId
			opt.productPrimaryClassification = 3
		}else{
			opt.productPrimaryClassification = travelInfo.orderType
			opt.productCode = travelInfo.travelGroupCode 
		}
		api.interfaceTransfer({
			query:opt,
			config: {
				"interfaceType": "POST",
				"interfaceModule": "",
				"interfaceMethod": "api/coupon/listCouponByUse",
				"interfaceFrom": "coupon",
				"hotelGroupCode": config.hotelGroupCode
			}
		})
			.then((res : any) => {

				if (res.result == 1 && res.retVal.result == 0) {
					if (res.retVal.retVal && res.retVal.retVal.length > 0) {
						listCouponDetail.value = []
						if(productType.value=='shop'){
							res.retVal.retVal.forEach((item:any)=>{
								if(item.groupCode != 'EXCHANGECOUPON'){
									listCouponDetail.value.push(item)
								}
								
							})
						}else{
							listCouponDetail.value = res.retVal.retVal
						}
						
		
						if (couponNo.value) {
							listCouponDetail.value.forEach((item : any) => {
								if (item.couponNo == couponNo.value) {
									// item.choosed = true
									toggleCoupon(item)
									sureCoupon()
								}
							})
						}
					}

				}
			});

	}

	const hideCode = (str : string, beginStr : number, endStr : number) => {
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
	const queryPayDetail = () => {
		if(productType.value == 'shop'){
			if(orderData.reserveOrderDto.payType=='INTEGRALCASH'){
				payPrice.value.point = Number(Number(travelInfo.credit * goodsData.number).toFixed(2))
				payPrice.value.basicTeamRateSum = Number(Number(travelInfo.creditPrice * goodsData.number).toFixed(2))
				

			}else{
				payPrice.value.point = 0
				payPrice.value.basicTeamRateSum = Number(Number(goodsData.price * goodsData.number).toFixed(2))
			}
		}
		console.log(payPrice.value.basicTeamRateSum)
		getDiscountPrice()
		if(productType.value=='shop'){
			
			payPrice.value.memberDscAmount =  memberDscAmount.value
			payPrice.value.couponRateSum =  coupnoMinsPrice.value
			payPrice.value.rateSum = Number((payPrice.value.basicTeamRateSum - memberDscAmount.value - coupnoMinsPrice.value).toFixed(2))
			
			return;
		}
		if (travelNumber.value != orderData.allPeople) {
			return;
		}
		isAjax.value = true
		let obj : any = {
			"unitCode": config.hotelGroupCode,
			"travelType": travelInfo.travelType,
			"payType": orderData.reserveOrderDto.payType,
			"otaChannel": otaChannel.value,
			"ota": "DIRECT",
			"num": travelInfo.number,
			"isGroup": 'T',
			"endDate": travelInfo.groupEndDate,
			"beginDate": travelInfo.groupBeginDate,
			"cardLevel": user.cardLevel,
			"cardType": user.cardType,
			"travelGroupCode": travelInfo.travelGroupCode,
			"roomNum":orderData.rsvDtos.length
		}
		if (travelInfo.orderType == 'FreeTravel') {
			obj.isFreeTravel = 'T'
		} else {
			obj.isFreeTravel = 'F'
		}
		if (travelInfo.specificationsPriceDtos.length > 0) {
			obj.specificationsType = travelInfo.specificationsPriceDtos[0].specificationsType
		}
		if (coupnoMinsPrice.value > 0) {
			obj.couponRateSum = coupnoMinsPrice.value
		}

		if ((discountType.value == 'member' || discountType.value == 'partner') && memberDscAmount.value > 0) {
			obj.memberDiscount = Number(rightsValue.value)
			obj.memberDiscountAmount = memberDscAmount.value
		}
		obj.adultNum = orderData.reserveOrderDto.adult || 0
		obj.babyNum = orderData.reserveOrderDto.baby || 0
		obj.childrenNum = orderData.reserveOrderDto.children || 0
		obj.bigChildrenNum = orderData.reserveOrderDto.bigChildren || 0
		if (travelInfo.priceModel == 'PEOPLE' || travelInfo.orderType == 'FreeTravel') {

			obj.singleRoomPeople = singleRoomPeople.value
			obj.singleRoomRateSum = singleRoomRateSum.value

		}
		if (travelInfo.orderType == 'FreeTravel') {
			obj.babyRoomNum = 0
			if(orderData.rsvDtos){
				orderData.rsvDtos.forEach((item:any)=>{
					var hasBaby = false
					item.guestDtos.forEach((guest:any)=>{
						if(guest.ageType=='baby'){
							hasBaby = true
						}
					})
					if(hasBaby){
						obj.babyRoomNum++
					}
				})
			}
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
			.then((res : any) => {
				isAjax.value = false
				if (res.result == 1 && res.retVal.result == 0) {
					showPrice.value = true
					payPrice.value = res.retVal.retVal
					
					if(payPrice.value.travelRateSumDto){
						payPrice.value = Object.assign(payPrice.value,payPrice.value.travelRateSumDto)
					}
					if (travelInfo.orderType == 'FreeTravel') {
						payPrice.value.babyRoomNum = obj.babyRoomNum
					}else{
						payPrice.value.babyRoomNum = 0
					}
					payPrice.value.couponRateSum = coupnoMinsPrice.value
					payPrice.value.exchangeSum = Number((payPrice.value.exchangeRateSum + payPrice.value.memberDscAmount +coupnoMinsPrice.value).toFixed(2))
				} else {
					jAlert3(res.retVal.msg || res.msg)
					showPrice.value = false
				}
			});
	}
	const travelOrdering = () => {
		if (isAjax.value) {
			return
		}
		var isPass = true
		for (var i in orderData.rsvDtos) {
			var rsvDto = orderData.rsvDtos[i]
			let adultNum = 0
			let childrenNum = 0

			rsvDto.guestDtos.forEach((guest : any) => {
				guest.guestNo = guid()
				if (guest.ageType == 'adult') {
					adultNum++
				} else {
					childrenNum++
				}

			})
			if (!rsvDto.rmClass) {
				if (orderData.rsvDtos.length > 1) {
					jAlert3(`请选择房间${Number(i) + 1}床型`)
				} else {
					jAlert3('请选择床型')
				}

				isPass = false
				break;

			}
			if (rsvDto.guestDtos.length <= 0) {
				if (orderData.rsvDtos.length > 1) {
					jAlert3(`请选择房间${Number(i) + 1}出行人`)
				} else {
					jAlert3('请选择出行人')
				}
				isPass = false
				break;
			}
			// if (travelInfo.priceModel == 'PEOPLE') {
			// 	if (rsvDto.length > 2) {
			// 		jAlert3(`房间${Number(i) + 1}最多选择2个出行人`)
			// 		isPass = false
			// 		break;
			// 	}
			// }
			if (adultNum > 2) {
				jAlert3(`房间${Number(i) + 1}最多选择2个成人`)
				isPass = false
				break;
			}
			if (childrenNum > 2) {
				jAlert3(`房间${Number(i) + 1}最多选择2个儿童`)
				isPass = false
				break;
			}


		}
		if (!isPass) {
			return;
		}
		if (orderData.reserveOrderDto.adult <= 0) {
			jAlert3(`至少选择1位成人`)
			return;
		}
		if (travelInfo.orderType == 'FreeTravel') {
			if ((orderData.reserveOrderDto.adult+orderData.reserveOrderDto.bigChildren) != (travelInfo.adult + travelInfo.bigChildren)) {
				jAlert3(`当前选择成人数${orderData.reserveOrderDto.adult+orderData.reserveOrderDto.bigChildren},需要成人数${travelInfo.adult + travelInfo.bigChildren}`)
				return;
			}

			if (orderData.reserveOrderDto.children != travelInfo.children) {
				jAlert3(`当前选择中童数${orderData.reserveOrderDto.children},需要中童数${travelInfo.children}`)
				return;
			}
			if (orderData.reserveOrderDto.baby != travelInfo.baby) {
				jAlert3(`当前选择小童数${orderData.reserveOrderDto.baby},需要小童数${travelInfo.baby}`)
				return;
			}

			// if(orderData.reserveOrderDto.bigChildren != travelInfo.bigChildren){
			// 	jAlert3(`请选择${travelInfo.baby}位大童`)
			// 	return;
			// }

		} else if (travelInfo.priceModel != 'PEOPLE') {
			let adultNum = travelInfo.specificationsPriceDtos[0].adult * travelInfo.number
			let childrenNum = travelInfo.specificationsPriceDtos[0].children * travelInfo.number
			if (adultNum != orderData.reserveOrderDto.adult) {
				jAlert3(`当前选择成人数${orderData.reserveOrderDto.adult},需要成人数${adultNum}`)
				return;
			}
			if (childrenNum != (orderData.reserveOrderDto.baby + orderData.reserveOrderDto.children + orderData.reserveOrderDto.bigChildren)) {
				jAlert3(`当前选择儿童数${orderData.reserveOrderDto.baby + orderData.reserveOrderDto.children + orderData.reserveOrderDto.bigChildren},需要儿童数${childrenNum}`)
				return;
			}
		}else if (travelInfo.priceModel == 'PEOPLE') {
			if(orderData.allPeople!=travelInfo.number){
				jAlert3(`当前选择人数${orderData.allPeople},需要人数${travelInfo.number}`)
				return;
			}
			
		}
		if (!orderData.reserveOrderDto.rsvMan) {
			jAlert3('请填写联系人姓名')
			return;
		}
		if (!orderData.reserveOrderDto.mobile) {
			jAlert3('请填写联系人手机号')
			return;
		}
		if (!canRequest.value) {
			return
		}
		 uni.showLoading({
          title: "下单中...",
        });
		canRequest.value = false
		// orderData.reserveOrderDto.priceType = travelInfo.priceModel
		orderData.couponUseDtoList = []
		if (currentChooseCoupon.value.length > 0) {
			currentChooseCoupon.value.forEach((item : any) => {
				item.beginDate = item.beginDatetime
				item.channel = item.salesChannel
				item.endDate = item.endDatetime
				item.couponDetailCode = item.couponNo
			})
			orderData.couponUseDtoList = currentChooseCoupon.value

		}
		
		orderData.dscAmountInfoDto.couponDscAmount = payPrice.value.couponRateSum
		if (discountType.value == 'member') {
			discountList.value.forEach((item : any) => {
				if (item.type == 'member') {
					orderData.dscAmountInfoDto.memberDiscount = item.discount;
					orderData.dscAmountInfoDto.memberLevelDesc = `${user.cardLevelDescript}`
				}
			})
			orderData.dscAmountInfoDto.memberDiscountAmount = payPrice.value.memberDscAmount
			
		}
		if (discountType.value == 'partner') {
			discountList.value.forEach((item : any) => {
				if (item.type == 'partner') {
					orderData.dscAmountInfoDto.distributorNo = item.partnerId;
					orderData.dscAmountInfoDto.distributorDiscount = item.discount;
					orderData.dscAmountInfoDto.memberLevelDesc = `合伙人${formatDiscount(item.discount * 10)}折`
				}
			})
			orderData.dscAmountInfoDto.distributorDiscountAmount = memberDscAmount.value;
		}
		if(travelInfo.orderType=='FreeTravel'){
			orderData.reserveOrderDto.num = orderData.allPeople
		}
		orderData.dscAmountInfoDto.pay = payPrice.value.readyPay;
		orderData.dscAmountInfoDto.point = payPrice.value.point;
		orderData.dscAmountInfoDto.pointMoney = payPrice.value.exchangeRateSum;
		orderData.dscAmountInfoDto.adultTeamRateSum = payPrice.value.adultTeamRateSum;
		orderData.dscAmountInfoDto.basicTeamRateSum = payPrice.value.basicTeamRateSum;
		orderData.dscAmountInfoDto.childrenTeamRateSum = payPrice.value.childrenTeamRateSum;
		orderData.dscAmountInfoDto.singleRoomRateSum = payPrice.value.singleRoomRateSum;
		orderData.dscAmountInfoDto.bigChildrenTeamRateSum = payPrice.value.bigChildrenTeamRateSum;
		orderData.dscAmountInfoDto.midChildrenTeamRateSum = payPrice.value.midChildrenTeamRateSum;
	    orderData.dscAmountInfoDto.babyChildrenTeamRateSum = payPrice.value.babyChildrenTeamRateSum;
		orderData.dscAmountInfoDto.guaranteedPrice = payPrice.value.guaranteedPrice;
		orderData.reserveOrderDto.singleRoomNum = singleRoomPeople.value;
		orderData.reserveOrderDto.singleRoomPrice = singleRoomRateSum.value
		orderData.sourceActivityId = sourceActivityId.value;
		orderData.sourceActivityName = sourceActivityName.value;

		UmengSDK.sendEvent("cop_book_clk", {
			page_id: "",
			page_name: "confirm_order_pg",
			order_name: travelInfo.title,
			order_type: travelInfo.orderTypeDesc,
			start_date: travelInfo.groupBeginDate,
			end_date: travelInfo.groupEndDate,
			trip_people_count: travelNumber.value,
			travel_path: travelInfo.itineraryDesc,
			room_count: orderData.rsvDtos.length,
			preferential_scheme: orderData.reserveOrderDto.payType
		});
		
		api.saveOrder(orderData).then((res : any) => {
			uni.hideLoading();
			if (res.result == 1) {

				if (travelInfo.isSigning == 'T') {
					toRedirect(`/pagesB/travel/tips?orderNo=${res.msg}&travelGroupCode=${travelInfo.travelGroupCode}`)
				} else {
					if(payPrice.value.readyPay<=0){
						toRedirect(`/pagesB/travel/orderDetail?orderNo=${res.msg}`)
					}else{
						toRedirect(`/pagesB/other/pay?orderNo=${res.msg}&productType=${travelInfo.orderType}`)
					}
					
				}

			} else {
				jAlert3(res.msg)
			}
			
			canRequest.value = true
		})

	}
	const showKf = () => {
		kf.value.showDialog();
	}
	const exchangeCouponOrdering = () => {
		var isPass = true

		// if (!goodsData.toDate) {
		// 	jAlert3("请选择计划日期")
		// 	return;
		// }
		if (!orderData.reserveOrderDto.rsvMan) {
			jAlert3('请填写联系人姓名')
			return;
		}
		if (!orderData.reserveOrderDto.mobile) {
			jAlert3('请填写联系人手机号')
			return;
		}
	
		
		let opt:any = {
			hotelCode: config.hotelCode,
			hotelGroupCode: config.hotelGroupCode,
			hotelGroupId: config.hotelGroupId,
			channel: 'mini_app',
			domain: "",
			appid: config.appid,
			listShopGoods: [],
			totalCredit: payPrice.value.point,
			totalPrice: payPrice.value.rateSum,
			actualPrice: payPrice.value.rateSum,
			original: 1,
			paymentMode: "1",
			address: "",
			addressId: "",
			area: "",
			city: "",
			contact: orderData.reserveOrderDto.mobile,
			receiver: orderData.reserveOrderDto.rsvMan,
			remark: goodsData.remark,
			openid: wxuser.openid,
			formId: "",
			fromOriginal: getStorage("staticFrom") || config.hotelCode,
			cardNo: user.cardNo,
			cardName: user.name,
			memberId: user.memberId,
			cardId: user.cardId,
			cardLevel: user.cardLevel,
			winterCampAddInfo: goodsData.fromDate + ' - ' + goodsData.toDate,
			notMemberContact: 'T',
			sourceActivityId: sourceActivityId.value,
			sourceActivityName: sourceActivityName.value,
			userCouponVersion:1,
			cardLevelDescript:user.cardLevelDescript
			
		}
		
		let couponAttr:any = []
		let concessionaryPrice = 0
		if (currentChooseCoupon.value.length > 0) {
			var currentCoupon:any = {}
			currentChooseCoupon.value.forEach((item : any) => {
				currentCoupon.couponNo =  item.couponNo
				currentCoupon.concessionaryPrice = coupnoMinsPrice.value,
				currentCoupon.type = "coupon"
				currentCoupon.couponName = item.couponName
			})
			opt.scCouponNo = currentCoupon.couponNo
			concessionaryPrice += coupnoMinsPrice.value
			couponAttr.push(currentCoupon)
		}
		
		if (discountType.value == 'member') {
			discountList.value.forEach((item : any) => {
				if (item.type == 'member') {
					orderData.dscAmountInfoDto.memberDiscount = item.discount;
					orderData.dscAmountInfoDto.memberLevelDesc = `${user.cardLevelDescript}会员${formatDiscount(item.discount * 10)}折`
				}
			})

		}
		
		if(memberDscAmount.value>0){
			couponAttr.push({
				type:'member',
				concessionaryPrice:memberDscAmount.value,
				memberLevelDesc:orderData.dscAmountInfoDto.memberLevelDesc
			})
			concessionaryPrice += memberDscAmount.value
		}
		let listShopGoods = []
		travelInfo.number = goodsData.number
		if(couponAttr.length>0){
			opt.couponAttr = couponAttr
		}
		if(payPrice.value.point<=0){
			travelInfo.paymentMethod = 'onlyPrice'
		}
		opt.concessionaryPrice = Number(concessionaryPrice)
		travelInfo.concessionaryPrice = Number(concessionaryPrice)
		listShopGoods.push(travelInfo)
		opt.listShopGoods = listShopGoods
		if (!canRequest.value) {
			return
		}
		 uni.showLoading({
          title: "下单中...",
        });
		canRequest.value = false
		api.submitOrder(opt).then((res : any) => {
			uni.hideLoading();
			if (res.result === 1) {
				if (res.retVal.orderStatus == "3") {
					toRedirect(`/pagesB/travel/paySuccess?orderNo=${res.retVal.id}&productType=shop`)
				} else {
					toRedirect(`/pagesB/other/pay?orderNo=${res.retVal.id}&productType=shop`)
				}
			} else {
				if (res.msg == '') {
					jAlert3(res.retVal.resultMsg)
				} else {
					jAlert3(res.msg)
				}


			}
			
			canRequest.value = true
		})

	}
	const ordering = () => {
		if (productType.value == 'shop') {
			exchangeCouponOrdering()
		} else {
			travelOrdering()
		}


	}
	onLoad((options : any) => {
		if (options.productType) {
			productType.value = options.productType
		}
		if (options.couponNo) {
			couponNo.value = options.couponNo
		}
		if (options.sourceActivityId) {
			sourceActivityId.value = options.sourceActivityId;
		}
		if (options.sourceActivityName) {
			sourceActivityName.value = decodeURIComponent(options.sourceActivityName);
		}
	})
	onShow(() => {
		if (productType.value != 'shop') {
			listGuestLinkExtraInfoWithMemberIdOrOpenId()
		}

	})
	onMounted(() => {
		uni.getSystemInfo({
			success: (res : any) => {
				console.log(res)
				navHeight.value = res.statusBarHeight + 60;
			},
			fail(err) {
				console.log(err);
			},
		});
		
		if(user.isRealName=='T'&&user.name){
			orderData.reserveOrderDto.rsvMan = user.name
		}else{
			orderData.reserveOrderDto.rsvMan = user.nickname
		}
		if (user.mobile) {
			orderData.reserveOrderDto.mobile = user.mobile
		}

		if (productType.value == 'shop') {
			showPrice.value = true
			setTimeout(() => {
				calendarCompent.value.init({
					checkInDay: fromDate.value,
					checkOutDay: toDate.value,
					isCheckedInTxt: "开始日期",
					isCheckedOutTxt: "结束日期",
				});
			}, 500);
			
			
			if (travelInfo.skuId) {
				let skuInfoPar = []
				let skuInfoStr = ""
				let skuInfo = travelInfo.skuInfo
				if (typeof skuInfo[0].sku == 'string') {
					skuInfoPar = JSON.parse(skuInfo[0].sku);
				} else {
					skuInfoPar = skuInfo[0].sku;
				}
				for (let j in skuInfoPar) {
					skuInfoStr += skuInfoPar[j].itemValue

				}
				travelInfo.skuInfoStr = skuInfoStr

			}
			if(travelInfo.credit&&travelInfo.credit>0){
				travelInfo.priceDtos = [
					{
						payType: 'CASH',
						name: '现金'
					},
					{
						payType: 'INTEGRALCASH',
						name: '现金+积分'
					},
				]
				orderData.reserveOrderDto.payType = 'CASH'
			}
			goodsData = Object.assign(goodsData, travelInfo)
			getDiscountOfMember()
			listCouponByUse()
			if(travelInfo.minLimit){
				minLimit.value = travelInfo.minLimit
				goodsData.number = travelInfo.minLimit
			}
		} else {

			// queryCardLevelRightsWithMemberId()
			getDiscountOfMember()
			listTravelRmclassDto()
			listCouponByUse()
			// getCouponDetailList()
			let oneNumber = 0
			// if (travelInfo.priceModel == 'PEOPLE' || travelInfo.priceModel == 'PACKAGE' || travelInfo.orderType == 'FreeTravel') {
			payTypes.forEach((payType : any) => {
				travelInfo.priceDtos.forEach((item : any) => {
					if (item.payType == payType.id) {
						item.name = payType.name
					}
					if (user.pointBalance < item.integral) {
						item.invalid = true
					}
					if (!orderData.reserveOrderDto.payType && !item.invalid) {
						orderData.reserveOrderDto.payType = item.payType
					}
				})

			})
			if (travelInfo.priceModel == 'PACKAGE') {
				oneNumber = travelInfo.specificationsPriceDtos[0].adult + travelInfo.specificationsPriceDtos[0].children
				travelNumber.value = oneNumber * travelInfo.number
			} else {
				travelNumber.value = travelInfo.number
			}

			if (travelInfo.orderType == 'FreeTravel') {
				travelNumber.value = travelInfo.adult + travelInfo.baby + travelInfo.children
				if (travelInfo.adult > 2 || (travelInfo.baby + travelInfo.children) > 2) {
					orderData.rsvDtos.push(
						{
							"arr": "",
							"dep": "",
							"hotelGroupCode": config.hotelGroupCode,
							"hotelCode": config.hotelCode,
							"rmtype": "",
							"rmtypeDesc": "",
							"productCode": "",
							"num": 1,
							"rmClass": "",
							"guestDtos": []
						})
				}
			}

	
			if (travelInfo.priceModel == 'FAMILY') {
				if (travelInfo.specificationsPriceDtos && travelInfo.specificationsPriceDtos.length > 0) {
					oneNumber = travelInfo.specificationsPriceDtos[0].adult + travelInfo.specificationsPriceDtos[0].children

					// payTypes.forEach((payType : any) => {
					// 	travelInfo.specificationsPriceDtos.forEach((item : any) => {
					// 		if (item.payType == payType.id) {
					// 			item.name = payType.name
					// 		}
					// 		if (user.pointBalance < item.integral) {
					// 			item.invalid = true
					// 		}
					// 		if (!orderData.reserveOrderDto.payType && !item.invalid) {
					// 			orderData.reserveOrderDto.payType = item.payType
					// 		}
					// 	})

					// })

				}
				travelNumber.value = oneNumber * travelInfo.number

			}
			UmengSDK.sendPV({
				page_id: "",
				page_name: "confirm_order_pg",
				order_name: travelInfo.title,
				order_type: travelInfo.orderTypeDesc,
				start_date: travelInfo.groupBeginDate,
				end_date: travelInfo.groupEndDate,
				trip_people_count: travelNumber.value,
				travel_path: travelInfo.itineraryDesc,
				room_count: orderData.rsvDtos.length,

			});

		}




	});
</script>

<style lang="less" scoped>
	@import url("~@/styles/mixin.less");
	@import url("~@/styles/skin.less");
	.ui_confirmOrder {
		line-height: 1;
		padding-bottom: 141px;

		.travel-info {

			padding: 80px 16px 12px;
			background-color: #000;
			background-image: url(https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/btnBlack.png);
			background-repeat: repeat;
			background-size: 40px 37.5px;

			.name {
				color: #fff;
				font-weight: bold;
				font-size: 20px;
				line-height: 1.3;
			}

			.infos {
				margin-top: 1px;

				.info {
					display: flex;
					margin-top: 8px;
					font-size: 14px;
					line-height: 22px;
					color: #fff;

					.label {
						opacity: 0.8;
						margin-right: 8px;
					}
					.val{
						flex: 1;
					}
				}
			}
		}

		.tips {
			display: flex;
			align-items: center;
			margin-top: 12px;
			color: #808080;
			font-size: 12px;


			.iconfont {
				font-size: 14px;
				margin-right: 4px;
			}

			.customer {
				color: #000;
				display: inline-flex;
				align-items: center;
				font-size: 12px;
				padding: 0 4px;
				margin: 0;
				border: 0;

				.icon-a-12_youlajiantou_hei {
					font-size: 12px;
				}

				&::after {
					border: none;
				}


			}
		}

		.form-infos {
			margin: 4px 16px 0;

			.form-info {
				margin-top: 12px;
				background: #FFFFFF;
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
						.icon-a-16_youlajiantou_hei{
							position: absolute;
							right: 0;
							top: 50%;
							transform: translateY(-50%);
						}
						&.center{
							align-items: center;
						}
						&.end {
							justify-content: flex-end;
						}

						.radio-warp {
							width: 100%;
							&.bedType{
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
									border: 0.5px solid #ccc;
									// .halfPixel(4px,#ccc);
									font-size: 14px;
									margin: 0;
									// margin-left: 12px;
									margin-right: 12px;
									margin-top: 12px;
									word-break: keep-all;
									

									&.invalid {
										color: #CCCCCC;
										// .halfPixel(4px,#ccc);
										border: 0.5px solid #ccc;
									}

									&.active {
										border: 1px solid #A43127;
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
									color: #CCCCCC;
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
							
							box-sizing: border-box;
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
								color: #CCCCCC;
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
								color: #A43127;
								padding: 4px;
								border-radius: 4px;
								font-size: 10px;

							}

							.red {
								color: #A43127;
								font-weight: 600;
								font-family: Montserrat;
							}

							.icon-danxuan_weixuan,
							.icon-danxuan_yixuan {
								font-size: 18px;
							}

							.icon-danxuan_yixuan {
								color: #A43127;
							}
						}
					}

					.already-box {
						display: flex;
						align-items: center;
						width: 100%;
						padding-left: 12px;
						background: #F8F8F8;
						border-radius: 4px;
						font-size: 14px;
				
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
							background: #F8F8F8;
							border-radius: 4px;

							.icon-a-16_guanbi_ciji {
								position: absolute;
								right: 12px;
								top: 12px;
								color: #808080;
								font-size: 16px;
							}

							&:first-child {
								margin-top: 0;
							}

							.name {
								display: flex;
								align-items: center;
								font-size: 14px;
								line-height: 1;

								.ageType {
									margin-left: 8px;
									color: #A43127;
									border-radius: 4px;
									background: rgba(164, 49, 39, 0.08);
									padding: 2px 4px;
									font-size: 10px;
									line-height: 1;
									font-weight: normal;
								}
							}

							.id-card {
								display: flex;
								margin-top: 8px;
								font-size: 12px;
								line-height: 1;
								color: #808080;
								.idCardType{
									margin-right: 8px;
								}
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
		}

		.footer {
			display: flex;
			justify-content: space-between;
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

			.price-info {
				display: flex;
				justify-content: center;
				flex-direction: column;

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

						.point {
							margin-top: 4px;
							font-family: Montserrat;
							font-size: 12px;
							font-style: normal;
							font-weight: 600;
							color: #A43127;

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
				color: #FFFFFF;
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

			width: 100%;
			background: #F8F8F8;

			.listItem {
				margin-top: 12px;
			}


		}

		.layer-box {
			position: relative;
			
			width: 100%;
			background: #F8F8F8;
			



			.title {
				position: relative;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 56px;
				color: #000000;
				font-family: 'PingFang SC';
				font-style: normal;
				font-weight: 600;
				font-size: 16px;
				border-bottom: 1px solid #EEEEEE;

				.icon-a-20_guanbi {
					position: absolute;
					top: 20px;
					left: 22px;
					font-size: 18px;
				}
			}
			.add-btn-box{
				position: sticky;
				top: 0;
				left: 0;
				right: 0;
				padding: 16px 0;
				background: #F8F8F8;
			}
			.add-btn {
				
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 0 16px;

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
				min-height: 200px;


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
							font-size: 16px;
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
									color: #A43127;
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
						font-size: 16px;
						padding: 10px 0 10px 10px;

						&.icon-duoxuan_weixuan {
							color: #808080;
						}

						&.icon-duoxuan_yixuan {
							color: #A43127;

							&.noCan {
								color: #ccc;
							}
						}

						&.icon-danxuan_yixuan {
							color: #A43127;
						}

					}
				}
			}





		}

		.layer-footer {
			position: sticky;
			bottom: 0;
		
			left: 0;
			right: 0;
			background: #fff;
			padding: 12px 16px;


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
				.label{
					flex: 1;
					margin-right: 20px;
				}
				.other {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-top: 16px;
					font-size: 14px;
					color: #808080;
					
				}
			}
		}

		.discount-list {
			padding-top: 16px;
			background: #F8F8F8;

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
						color: #A43127;

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
	}
</style>