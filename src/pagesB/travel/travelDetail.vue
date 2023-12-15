<template>
	<div class="travelDetail_ui">

		<div class="topContent">
			<div class="coustom-head">
				<coustom-head :color="scrollTop>50?'#000':'#fff'" :bgColor="scrollTop>50?'#fff':''">
					<template v-slot:title>
						<div class="head-box">
							<div class="head" v-if="scrollTop<30&&travelDetail.video">
								<div class="head-item" :class="{'active':swiperCurrent==-1}" @click="tabSwiper(0)">视频</div>
								<div class="head-item" :class="{'active':swiperCurrent>-1}" @click="tabSwiper(1)">照片集</div>
							</div>
							<!-- #ifdef MP -->
							<div class="share-icon" :style="menuPos" @click="toShare">
								<i class="iconfont icon-a-20_fenxianganniu_bai"></i>
							</div>
							<!-- #endif -->

						</div>


					</template>
				</coustom-head>
			</div>
			<div class="swiper-box">
				<swiper-box :slides="slides" :swiperConfig="swiperConfig" :videoUrl="travelDetail.video"
					@change="changeSwiper" ref="swiperRef"></swiper-box>
			</div>
			<div class="product-info">
				<div class="product-name"><i class="icon" v-if="itineraryDtos.categorySubDesc"
						:class="travelDetail.categorySub">{{itineraryDtos.categorySubDesc}}</i>{{travelDetail.title}}<i
						class="iconfont" :class="{'active':isCollect,'icon-a-20_shoucang_yishoucang':isCollect,'icon-a-20_shoucang_weishoucang':!isCollect}"
						@click="toCollection()"></i></div>
				<div class="product-sub-tl" v-if="travelDetail.subtitle">{{travelDetail.subtitle}}</div>
				<div class="product-price">¥{{travelDetail.startingPrice}}<div class="unit">/<template v-if="travelDetail.priceModel=='PEOPLE'">人</template><template
							v-if="travelDetail.priceModel=='PACKAGE'">套</template>起<i class="iconfont icon-a-12_tishi"
							@click="priceTips()" v-if="travelDetail.illustrate"></i></div>
				</div>
				<!-- <div class="other-price">积分+现金价：1,380积分+1,399元/人起</div> -->
				<div class="product-descs">
					<div class="desc-item">
						<div class="label">
							成团人数
						</div>
						<div class="val">
							{{travelDetail.productNum}}人
						</div>
					</div>
					<div class="desc-item">
						<div class="label">
							旅途用车
						</div>
						<div class="val">
							{{travelDetail.carTypeDesc}}
						</div>
					</div>
					<div class="desc-item">
						<div class="label">
							集合地
						</div>
						<div class="val">
							{{travelDetail.rendezvousDesc}}
						</div>
					</div>
					<div class="desc-item">
						<div class="label">
							解散地
						</div>
						<div class="val">
							{{travelDetail.dissolutionDesc}}
						</div>
					</div>
				</div>
				<div class="themes">
					<div class="theme" v-for="(item,i) in travelDetail.tagApiDtos" :key="i">{{item.tageDesc}}</div>

				</div>
			</div>
			<div class="product-info-box">
				<div class="title">
					可订团期
				</div>
				<div class="routes">

					<div class="route" v-for="(item,i) in travelDetail.itineraryDtos" :key="i"
						:class="{'active':item.active}" @click="chooseTravel(item)">
						<div class="label">{{item.itineraryDesc}}</div>
						<div class="val">{{item.itineraryShortDesc}}</div>
					</div>

				</div>
				<div class="dates-box" v-if="dailyEffectiveNum>0">
					<div class="dates">
						<template v-for="(item,i) in dailyPriceList" :key="i">
							<div class="date" v-if="item.show"
								:class="{active:item.groupBeginDate==curDailyPrice.groupBeginDate}"
								@click="chooseDate(item)">
								<div class="label">{{item.week}}</div>
								<div class="val">{{item.MMdd}}</div>
								<div class="price">¥{{item.price}}</div>


							</div>
						</template>
						<div class="all-date" v-if="dailyEffectiveNum>=4" @click="showOrderLayer('all')">
							<i class="icon-a-12_riqi iconfont"></i>
							全部
						</div>
					</div>
				</div>

			</div>
		</div>
		<div class="tabs-warp">
			<div class="tabs" :class="{'fixed':fixed}" :style="{top:navHeight+'px'}">
				<div class="tab" @click="switchTab(1)" :class="{'active':isActive=='1'}">
					产品亮点
				</div>
				<div class="tab" @click="switchTab(2)" :class="{'active':isActive=='2'}">
					详情
				</div>
				<div class="tab" @click="switchTab(3)" :class="{'active':isActive=='3'}">
					预订须知
				</div>
				<div class="tab" @click="switchTab(4)" :class="{'active':isActive=='4'}">
					问答
				</div>
			</div>
		</div>

		<div class="product-info-box contentHight">
			<div class="title" v-if="itineraryDtos.featureDtos&&itineraryDtos.featureDtos.length>0">
				产品特色
			</div>
			<div class="characteristic" v-for="(item,i) in itineraryDtos.featureDtos" :key="i">
				<div class="characteristic-label">
					特色{{formatNum(i+1)}}
				</div>
				<div class="characteristic-title">
					{{item.summarize}}
				</div>
				<div class="characteristic-list">
					<div class="characteristic-item" v-for="(pic,j) in item.pictureDtos" :key="j">
						<div class="characteristic-box">
							<img class="characteristic-img" :src="pic.picture+'?imageView2/1/w/442/h/333'">
							<div class="characteristic-info">
								<div class="characteristic-name">{{pic.subheading}}</div>
								<div class="characteristic-desc">{{pic.featureDesc}}</div>
							</div>
						</div>

					</div>

				</div>

			</div>
		</div>
		<div class="product-info-box contentHight">
			<div class="title" v-if="itineraryDtos.largeImage">
				行程安排
			</div>
			<div class="itinerary-pic" v-if="itineraryDtos.largeImage">
				<image mode="widthFix" :src="itineraryDtos.largeImage" class="itinerary-pic-img"></image>
			</div>
			<div class="title">
				每日行程
			</div>

			<div class="travel-dates">
				<div class="travel-date-item" v-for="(item,i) in itineraryDtos.dayDtos" :key="i" :id="'travel-date-item'+i"
					:class="{open:item.open}" >
					<div class="travel-date" @click.stop="openItinerary(item,i)">
						<div class="travel-date-lf">
							<div class="label">
								DAY
							</div>
							<div class="val">{{item.rsvDay}}</div>
						</div>
						<div class="travel-date-rt">
							<div class="head">
								<template v-if="i=='0'">出发地</template><template v-else>{{item.placeOfDepartureDesc}}</template>
								<template v-if="i==itineraryDtos.dayDtos.length-1"> > 出发地</template>
								<template v-else>
									<template v-if="item.destinationDesc"> > </template>{{item.destinationDesc}}
								</template>
							</div>
							<div class="tl" >
								{{item.descript}}
								<i class="icon-a-16_xialajiantou_hei iconfont"></i>
							</div>
							<div class="desc">
								{{item.dayTitle}}
							</div>
						</div>
					</div>
					<div class="travel-date travel-date-fixed" :style="{top:navHeight+39+'px'}" v-if="openFixed[i]" @click.stop="openItinerary(item,i)">
						<div class="travel-date-lf">
							<div class="label">
								DAY{{item.rsvDay}}
							</div>
							
						</div>
						<div class="travel-date-rt" >
							<div class="head">
								{{item.placeOfDepartureDesc}} <template v-if="item.destinationDesc">></template> {{item.destinationDesc}} 
								
							</div>
							<i class="icon-a-16_xialajiantou_hei iconfont"></i>
						</div>
					</div>
					<div class="day-travel-list">
						<div class="day-travel" v-for="(dayDetail,j) in item.dayDetailDtos" :key="j">
							<div class="icon">
								<img :src="dayDetail.titlesIcon" class="iconfont">
							</div>

							<div class="day-travel-info">
								<div class="day-travel-tl" v-if="dayDetail.title">
									{{dayDetail.title}}
								</div>
								<div class="day-travel-desc" v-if="dayDetail.descript">{{dayDetail.descript}}</div>
								<div class="day-travel-img-box" v-if="dayDetail.picture"
									v-for="(pic,k) in dayDetail.picture" :key="k">
									<image :src="pic" class="day-travel-img" mode="widthFix"></image>
									<!-- <div class="day-travel-name">
										{{dayDetail.title}}
									</div> -->
								</div>
							</div>

						</div>

					</div>
				</div>
			</div>
			<div class="ad-banner" v-if="adImg.length>0">
				<swiper-box :slides="adImg" :swiperConfig="adImgConfig"></swiper-box>
			</div>
		</div>
		<div class="product-info-box contentHight" v-if="travelDetail.travelType">
			<div class="title">
				费用说明及预订须知
			</div>
			<div class="explain-box">
				<div class="explain-list">
					<div class="explain-item">
						<collapse defaultHeight="30px" open=true arrowStyle="position: absolute;right: 0;top: -5px;width: 100%;display: flex;justify-content: flex-end;"
							iconName="icon-a-16_xialajiantou_hei">
							<template v-slot:content>
								<div class="explain-item">
									<div class="tl">费用说明</div>
									<div class="desc">
										<div v-html="itineraryDtos.costDescription"></div>
										
									</div>

								</div>
								<div class="explain-item">
									<div class="tl mini-tl">费用包含</div>
									<div class="desc">
										<div v-html="itineraryDtos.costIncludes"></div>
									</div>

								</div>
								<div class="explain-item">
									<div class="tl mini-tl">费用不含</div>
									<div class="desc">
										<div v-html="itineraryDtos.costExcluding"></div>
			
									</div>

								</div>
							</template>
						</collapse>
					</div>

				</div>
				<div class="explain-list">
					<div class="explain-item">
						<collapse defaultHeight="30px" open=true arrowStyle="position: absolute;right: 0;top: -5px;width: 100%;display: flex;justify-content: flex-end;"
							iconName="icon-a-16_xialajiantou_hei">
							<template v-slot:content>
								<div class="explain-item">
									<div class="tl">预订须知</div>
									<div class="desc">
										<div v-html="itineraryDtos.reservationNotice"></div>
			
									</div>

								</div>
							</template>
						</collapse>
					</div>
				</div>
				<div class="explain-list">
					<div class="explain-item">
						<collapse defaultHeight="30px" open=true arrowStyle="position: absolute;right: 0;top: -5px;width: 100%;display: flex;justify-content: flex-end;"
							iconName="icon-a-16_xialajiantou_hei">
							<template v-slot:content>
								<div class="explain-item">
									<div class="tl">温馨提示</div>
									<div class="desc">
										<div v-html="itineraryDtos.warmPrompt"></div>
									</div>

								</div>
							</template>
						</collapse>
					</div>
				</div>

				<div class="explain-list">
					<div class="explain-item">
						<collapse defaultHeight="30px" open=true arrowStyle="position: absolute;right: 0;top: -5px;width: 100%;display: flex;justify-content: flex-end;"
							iconName="icon-a-16_xialajiantou_hei">
							<template v-slot:content>
								<div class="explain-item">
									<div class="tl">预订条款及取消政策</div>
									<div class="desc">
										<div v-html="itineraryDtos.bookCondition"></div>
									</div>

								</div>
							</template>
						</collapse>
					</div>
				</div>
			</div>

		</div>
		<div class="product-info-box contentHight"
			v-if="travelDetail.productProblemDtos&&travelDetail.productProblemDtos.length>0">
			<div class="title">
				常见问题
			</div>

			<div class="problems">
				<template v-for="(item,i) in travelDetail.productProblemDtos" :key="i">
					<div class="problem" v-if="i<3" @click="toProblemDetail(item)">
						<div class="question">Q：{{item.title}}</div>
						<div class="answer">A：{{item.answer}}</div>
					</div>
				</template>


			</div>
			<div class="more-box" v-if="travelDetail.productProblemDtos.length>3">
				<div class="more-btn" @click="toProblem()">
					更多问题</div>
			</div>

		</div>
		<div class="footer" v-if="init">
			<div class="kefu" @click="showKf(false)">
				<i class="icon-a-20_kefu iconfont"></i>
				客服
			</div>
			<div class="order-btn baseBtn" @click="showOrderLayer" v-if="dailyEffectiveNum>0">预订</div>
			<div class="order-noBtn" v-else>暂无可订团期</div>
		</div>
		<bottom-dialog ref="orderLayer" title="选择可订团期" maxDialog>
			<div class="order-layer">
				<div class="order-box">

					<div class="title">
						行程路线
					</div>
					<div class="routes">
						<div class="route" v-for="(item,i) in travelDetail.itineraryDtos" :key="i"
							:class="{'active':item.active}" @click="chooseTravel(item)">
							<div class="label">{{item.itineraryDesc}}</div>
							<div class="val">{{item.itineraryShortDesc}}</div>
						</div>

					</div>
					<div class="title">
						出行日期
					</div>
					<div class="booking-date">
						<daily-price ref="dailyPrices" @change-dailyPrice="changedailyPrice"></daily-price>
					</div>
					<div class="next-btn">

						<div class="choose-item" v-if="curDailyPrice.groupBeginDateFormat">
							{{curDailyPrice.groupBeginDateFormat}}出发 - {{curDailyPrice.groupEndDateFormat}}返程
						</div>
						<div class="btn baseBtn" @click="showNumberLayer()">下一步</div>
					</div>
				</div>

			</div>
		</bottom-dialog>
		<bottom-dialog ref="numberLayer" :title="curDailyPrice.priceModel=='PACKAGE'?'选择预订套数':'选择出行人数'">
			<div class="number-layer">
				<div class="number-box">

					<div class="number-choose">
						<template v-if="travelDetail.categorySub =='FreeTravel'">
							<div class="travel-number">
								<div class="label">
									成人<div class="age">12岁及以上</div>
								</div>
								<div class="val">
									<i class="iconfont icon-a-20_jian" :class="{'unable':adult<=1}"
										@click="changeNumAge('reduce','adult')"></i>
									<div class="num">{{adult}}</div>

									<i class="iconfont icon-a-20_jia" :class="{'unable':!canAdd||adult>=4}"
										@click="changeNumAge('add','adult')"></i>
								</div>
							</div>
							<!-- <div class="travel-number">
								<div class="label">
									大童<div class="age">12-17岁</div>
								</div>
								<div class="val">
									<i class="iconfont icon-a-20_jian" :class="{'unable':bigChildren<=0}"
										@click="changeNumAge('reduce','bigChildren')"></i>
									<div class="num">{{bigChildren}}</div>

									<i class="iconfont icon-a-20_jia" :class="{'unable':!canAdd}"
										@click="changeNumAge('add','bigChildren')"></i>
								</div>
							</div> -->
							<div class="travel-number">
								<div class="label">
									中童<div class="age">6岁（含）-12岁</div>
								</div>
								<div class="val">
									<i class="iconfont icon-a-20_jian" :class="{'unable':children<=0}"
										@click="changeNumAge('reduce','children')"></i>
									<div class="num">{{children}}</div>

									<i class="iconfont icon-a-20_jia"
										:class="{'unable':!canAdd||(children+baby)>=maxChild}"
										@click="changeNumAge('add','children')"></i>
								</div>
							</div>
							<div class="travel-number">
								<div class="label">
									幼童<div class="age">未满6岁</div>
								</div>
								<div class="val">
									<i class="iconfont icon-a-20_jian" :class="{'unable':baby<=0}"
										@click="changeNumAge('reduce','baby')"></i>
									<div class="num">{{baby}}</div>

									<i class="iconfont icon-a-20_jia"
										:class="{'unable':!canAdd||(children+baby)>=maxChild}"
										@click="changeNumAge('add','baby')"></i>
								</div>
							</div>
						</template>

						<div class="travel-number"
							v-else-if="curDailyPrice.priceModel=='PEOPLE'||curDailyPrice.priceModel=='PACKAGE'">
							<div class="label" v-if="curDailyPrice.priceModel=='PEOPLE'">
								人数
							</div>
							<div class="label" v-if="curDailyPrice.priceModel=='PACKAGE'">
								套数
							</div>
							<div class="val">
								<i class="iconfont icon-a-20_jian" :class="{'unable':number<=1}"
									@click="changeNum('reduce')"></i>
								<div class="num">{{number}}
									<template v-if="curDailyPrice.priceModel=='PACKAGE'">
										套
									</template>
								</div>

								<i class="iconfont icon-a-20_jia" :class="{'unable':number>=curDailyPrice.availNum}"
									@click="changeNum('add')"></i>
							</div>

						</div>
						<div class="num-sku" v-else-if="curDailyPrice.specificationsPriceDtos">
							<!-- 	<div class="num-sku-item active">
								{{curDailyPrice.specificationsPriceDtos[0].specificationsType}}
							</div> -->
							<div class="num-sku-item active">
								<template v-if="curDailyPrice.specificationsPriceDtos[0].adult>0">
									{{curDailyPrice.specificationsPriceDtos[0].adult}}成人
								</template>
								<template v-if="curDailyPrice.specificationsPriceDtos[0].children>0">
									{{curDailyPrice.specificationsPriceDtos[0].children}}儿童
								</template>

							</div>

						</div>
						<div class="tips" v-if="curDailyPrice.priceModel =='PACKAGE'">
							每套可供{{curDailyPrice.allNumber}}人使用，不支持与陌生人拼团。
						</div>
						<div class="tips" v-else>
							<template
								v-if="travelDetail.categorySub =='FreeTravel'">每单限选8人，最多4成人，每个成人最多携带2儿童，超出需分次下单或联系客服下单</template><template
								v-else>每单限选4人，超出需分次下单或联系客服下单</template>
							<div class="customer" @click="showKf(true)">联系客服<i
									class="iconfont icon-a-12_youlajiantou_hei"></i></div>
						</div>
					</div>
					<div class="next-btn">

						<div class="btn baseBtn" @click="confirmOrder()">下一步</div>
						
					</div>
				</div>

			</div>
		</bottom-dialog>
		<back-to-top></back-to-top>
		<share :posterInfo="posterInfo" @close="closePoster" v-if="showShare"></share>
		<kf-dialog ref="kf" title="联系客服" :sideslip="sideslip"></kf-dialog>
	</div>
</template>

<script setup lang="ts">
	import {
		reactive,
		ref,
		computed,
		onMounted,
		nextTick
	} from "vue";
	import UmengSDK from "@/utils/umengAdaptor.js";
	import swiperBox from "@/components/swiperBox.vue";
	import share from "@/components/share.vue";
	import dailyPrice from "@/pagesB/components/dailyPrice.vue";
	import coustomHead from "@/components/coustomHead.vue";
	import useScroll from "@/hooks/useScroll";
	import backToTop from "@/components/backToTop.vue";
	import bottomDialog from "@/components/bottomDialog.vue";
	import collapse from "@/components/collapse.vue";
	import kfDialog from "@/components/kfDialog.vue";
	import dayjs from "dayjs";
	import { $ref } from 'unplugin-vue-macros/macros';
	import defaultOtaChannel from "@/utils/defaultOtaChannel";
	import defaultChannel from "@/utils/defaultChannel";
	import { getMenuButtonBoundingClientRect } from "@/utils/platform";
	import { createUrl, getUrlParams, goPage, toLogin } from "@/utils/utils";
	import {
		onShareAppMessage,
		onLoad
	} from "@dcloudio/uni-app";
	import {
		getStorage, setStorage
	} from "@/utils/wxuser";
	import { jAlert12, jAlert3, jAlert5 } from "@/base/jAlert/jAlert";
	import api from "@/utils/api";
	const {
		scrollTop,
		onPageScroll
	} = useScroll();
	let config = getStorage("config");
	const showShare = ref(false)
	let otaChannel = ref(defaultOtaChannel);
	let channel = ref(defaultChannel);
	const dailyPrices = ref<HTMLElement | any>();//价格日历dom
	const curDailyPrice : any = ref({});//当前价格日历
	const isActive = ref(0)
	const navHeight = ref(0)
	const fixed = ref(false)
	const stop = ref(true)
	const orderLayer = ref()//价格日历弹窗
	const numberLayer = ref()//数量选择弹窗
	const availNum = ref(0)
	const travelGroupCode = ref('')
	const canAdd = ref(true)
	const travelType = ref('')
	const number = ref(1)
	const adult = ref(1)
	const bigChildren = ref(0)
	const children = ref(0)
	const baby = ref(0)
	const kf = ref()
	const itineraryDtos : any = ref({})
	const user = $ref(getStorage("user") || {});
	const adImg = ref([])
	const couponNo = ref('')
	const openFixed:any = ref([])
	const swiperCurrent = ref(-1)
	const swiperRef = ref()
	const sideslip = ref(false)
	const init = ref(false)
	let posterInfo : any = ref({})
	let adImgConfig = reactive({
		indicatorDots: false,
		dotPosStyle: "display:none;"
	})
	let swiperConfig = reactive({
		indicatorDots: false,
		autoplay: false,
		dotPosStyle: "left: 50%;transform: translateX(-50%);bottom:12px;"
	});
	let sourceActivityId = ref("");
	let sourceActivityName = ref("");
	let maxChild = ref(4)
	let isAjax = ref(false)
	let isAjaxCollect = ref(false)
	let isCollect = ref(false)
	let ids = ref([])
	const dailyPriceList : any = ref([])
	let productUrl = ref("")
	let dailyEffectiveNum = ref(1)
	let travelDetail : any = reactive({});
	let productByCouponNo:any = ref([])//券可用团期
	let couponNoForType = ref(false)
	let isAll = ref('F')
	let couponUesType = ref('')
	// let travelData = reactive({
	// 	price: 0,
	// 	groupBeginDate: '',
	// 	groupEndDate: ''

	// })

	let slides : {
		imgUrl : string
	}[] = reactive([]);
	onPageScroll((e) => {
		scrollTop.value = e.scrollTop;

		const topList : any[] = []
		const query = uni.createSelectorQuery()
		query.selectAll('.contentHight').boundingClientRect()
		const query2 = uni.createSelectorQuery()
		query2.selectAll('.tabs-warp').boundingClientRect()
		query2.exec((res) => {

			if (res[0][0].top < navHeight.value) {
				fixed.value = true
			} else {
				fixed.value = false
			}
		})
		query.exec((res) => {
			for (var i = 0; i < res[0].length; i++) {
				topList.push(res[0][i].top)

			}

			if (!stop.value) {
				return;
			}
			if (
				topList[3] < 0
			) {
				isActive.value = 4
			} else if (
				topList[2] < 0
			) {
				isActive.value = 3
			} else if (topList[1] < 0) {
				isActive.value = 2
			} else {
				isActive.value = 1
			}
		})
		const query3 = uni.createSelectorQuery()
		query3.selectAll('.travel-date-item').boundingClientRect()
		query3.exec((res) => {
			console.log(res)
			if(res&&res.length>0){
				openFixed.value = []
				res[0].forEach((item:any,i:number)=>{
					if(item.top<navHeight.value+39){
						openFixed.value.forEach((open:any,j:number)=>{
							if(j<i){
								openFixed.value[j] = false
							}
						})
						openFixed.value[i] = true
					}else{
						openFixed.value[i] = false
					}
				})
			}
		
		})

	})
	onLoad((options : any) => {
		// travelGroupCode.value = options.travelGroupCode
		if (options.travelType) {
			travelType.value = options.travelType
		}
		if (options.couponNo) {
			couponNo.value = options.couponNo
		}
		if (options.scene) {
			let params = getUrlParams(decodeURIComponent(options.scene))
			if (params.travelType) {
				travelType.value = params.travelType
			}

		}
		if (options.sourceActivityId) {
			sourceActivityId.value = options.sourceActivityId;
		}
		if (options.sourceActivityName) {
			sourceActivityName.value = decodeURIComponent(options.sourceActivityName);
		}
		if(options.isAll){
			isAll.value = options.isAll
		}

	})
	const toProblemDetail  = (item:any) => {
		goPage(`/pagesB/other/questionDetail?problemCode=${item.problemCode}`)
	}
	const toProblem = () => {
		setStorage('problemDtos', travelDetail.productProblemDtos)
		goPage('/pagesB/other/question?type=product')
	}
	const changeSwiper = (value : number) => {
		swiperCurrent.value = value
	}
	const formatNum = (value : number) => {
		const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
		const chineseUnits = ['', '十', '百', '千', '万', '亿'];

		if (value === 0) {
			return chineseNumbers[0];
		}

		let result = '';
		let digit = 0;

		while (value > 0) {
			const currentDigit = value % 10;

			if (currentDigit !== 0) {
				if (currentDigit === 1 && digit === 1 && result !== '') {
					// 对于十位数，处理特殊情况，如十一、十二等
					result = chineseUnits[digit] + result;
				} else {
					result = chineseNumbers[currentDigit] + chineseUnits[digit] + result;
				}
			} else {
				// 处理连续的零，如一百零五、一千零一等
				if (result !== '' && result.charAt(0) !== chineseNumbers[0]) {
					result = chineseNumbers[0] + result;
				}
			}

			digit++;
			value = Math.floor(value / 10);
		}

		return result;
	}
	const showKf = (type:any) => {
		sideslip.value = type
		kf.value.showDialog();
	}
	const toShare = () => {
		let shareData = {
			posterImage: travelDetail.posterImage,
			categorySubDesc: itineraryDtos.value.categorySubDesc,
			categorySub: travelDetail.categorySub,
			title: travelDetail.title,
			sketch: "",
			datas: "出发日期：",
			price: `¥${travelDetail.startingPrice}`,
			path: "",
			params: "",
			time: `此海报于${dayjs().format('YYYY.MM.DD')}生成`,
			priceModel: travelDetail.priceModel,
			picPage:'TRAVEL_DETAIL',
			position:'TRAVEL_DETAIL_IMG',
			bizRelObject:'TRAVEL_DETAIL',
			bizRelObjectId:travelType.value

		}
		if (itineraryDtos.value.itineraryShortDesc) {
			shareData.sketch += itineraryDtos.value.itineraryShortDesc
		}
		if (travelDetail.productNum) {
			if (shareData.sketch) {
				shareData.sketch += ' 丨 '
			}
			shareData.sketch += `${travelDetail.productNum}人起`
		}
		if (travelDetail.carTypeDesc) {
			if (shareData.sketch) {
				shareData.sketch += ' 丨 '
			}
			shareData.sketch += `${travelDetail.carTypeDesc}`
		}
		var pages : any = getCurrentPages()
		var currentPage : any = pages[pages.length - 1]
		shareData.path = currentPage.route
		var options = currentPage.options
		shareData.params = createUrl(options)
		console.log(shareData.params)
		dailyPriceList.value.forEach((item : any, i : number) => {
			shareData.datas += item.groupBeginDateFormat2 + " "
		})
		posterInfo.value = shareData
		getWxacodeUnlimitUrl()


	}
	const getWxacodeUnlimitUrl = () => {
		uni.showLoading({
			title: '图片生成中...'
		});
		const config = getStorage('config')
		var opt = {
			appid: config.appid,
			componentAppid: config.componentAppid,
			line_color_g: 0,
			page: posterInfo.value.path,
			width: 500,
			line_color_b: 0,
			auto_color: false,
			scene: posterInfo.value.params,
			is_hyaline: true,
			line_color_r: 0
		}

		api.getWxacodeUnlimitUrl(opt).then((res : any) => {
			if (res.result == 1) {
				posterInfo.value.qrCode = res.retVal.imageUrl
				showShare.value = true
			} else {
				jAlert3(res.msg)
			}
			uni.hideLoading();


		})
	}
	const tabSwiper  = (val:number) => {
		swiperRef.value.changeCurrent(val)
	}
	const closePoster = () => {
		showShare.value = false
	}
	const toCollection = () => {
		if (!(user && user.memberId)) {
			toLogin();
			return false;
		}
		toggleCollection();
	};
	const toggleCollection = () => {
		if (!isCollect.value) {
			addGoodsCollection();
		} else {
			deleteGoodsCollection();
		}
	};
	const addGoodsCollection = () => {
		if (isAjaxCollect.value) {
			return false;
		}
		isAjaxCollect.value = true;
		api
			.addGoodsCollection({
				goodsId: travelType.value,
				goodsName: travelDetail.title,
				hotelCode: config.hotelCode,
				hotelGroupCode: config.hotelGroupCode,
				memberId: user.memberId,
				picture: productUrl.value,
				productType: travelDetail.categorySub,
				price: travelDetail.startingPrice,
				subGoodsName: travelDetail.subtitle,
			})
			.then((res : any) => {
				
				if (res.result == 1) {
					jAlert3("收藏成功");
					getGoodsIsCollection()
				} else {
					jAlert3(res.msg);
				}
			});
	};
	const deleteGoodsCollection = () => {
		if (isAjaxCollect.value) {
			return false;
		}
		isAjaxCollect.value = true;
		api.deleteGoodsCollection([ids.value]).then((res : any) => {
			isAjaxCollect.value = false;
			if (res.result == 1) {
				jAlert3("取消收藏");
				isCollect.value = false;
			} else {
				jAlert3(res.msg);
			}
		});
	};
	const getGoodsIsCollection = () => {
		api
			.getGoodsIsCollection({
				goodsId: travelType.value,
				hotelGroupCode: config.hotelGroupCode,
				hotelCode: config.hotelCode,
				memberId: user.memberId,
			})
			.then((res : any) => {
				isAjaxCollect.value = false;
				if (res.result == 1 && res.retVal && res.retVal.length > 0) {
					isCollect.value = true;
					ids.value = res.retVal[0].id;
				}
			});
	};
	
	const toPage = (link : string) => {
		uni.navigateTo({
			url: link
		});
	}
	const changeNumAge = (type : string, ageType : string) => {

		let num = curDailyPrice.value.availNum - (adult.value + bigChildren.value + children.value + baby.value)
		let isCanAdd = true
		if (num == 0) {
			isCanAdd = false
		}


		if (type == 'add') {
			if (ageType == 'adult') {
				if (isCanAdd && adult.value < 4) {
					adult.value++
				}
			}
			if (adult.value == 1 || adult.value == 2) {
				maxChild.value = 2
			} else if (adult.value == 3 || adult.value == 4) {
				maxChild.value = 4
			}
			if (ageType == 'bigChildren') {
				if (isCanAdd && bigChildren.value < maxChild.value) {
					bigChildren.value++
				}
			}
			if (ageType == 'children') {
				if (isCanAdd && (baby.value + children.value) < maxChild.value) {
					children.value++
				}
			}
			if (ageType == 'baby') {
				if (isCanAdd && (baby.value + children.value) < maxChild.value) {
					baby.value++
				}
			}


		} else {
			if (ageType == 'adult') {
				if (adult.value > 1) {
					adult.value--
				}
			}
			if (adult.value == 1 || adult.value == 2) {
				maxChild.value = 2
			} else if (adult.value == 3 || adult.value == 4) {
				maxChild.value = 4
			}
			// if((bigChildren.value + children.value + baby.value)>maxChild.value){
			// 	bigChildren.value = 0
			// 	children.value = 0
			// 	baby.value = 0
			// }
			if (ageType == 'bigChildren') {
				if (bigChildren.value >= 1) {
					bigChildren.value--
				}
			}
			if (ageType == 'children') {
				if (children.value >= 1) {
					children.value--
				}
			}
			if (ageType == 'baby') {
				if (baby.value >= 1) {
					baby.value--
				}
			}


		}
		num = curDailyPrice.value.availNum - (adult.value + bigChildren.value + children.value + baby.value)

		if (num == 0) {
			canAdd.value = false
		} else {
			canAdd.value = true
		}

	}
	const changeNum = (type : string) => {
		if (type == 'add') {
			if (number.value < curDailyPrice.value.availNum) {
				number.value++
			}

		} else {
			if (number.value > 1) {
				number.value--
			}

		}
	}
	const priceTips = () => {

		uni.showModal({

			content: travelDetail.illustrate,
			showCancel: false,
			confirmText: '我知道了',
			confirmColor: "#000000"

		})

	}
	const showNumberLayer = () => {
		if (!curDailyPrice.value.groupBeginDate) {
			jAlert3('请选择出行日期')
			return;
		}
		orderLayer.value.hideDialog()
		numberLayer.value.showDialog()

	}
	const showOrderLayer = (type:any) => {
		if (!(user && user.memberId)) {
			toLogin();
			return;
		}
		if (curDailyPrice.value.groupBeginDate&&type!='all') {
			showNumberLayer()
		} else {
			orderLayer.value.showDialog()
		}


	}
	const switchTab = (val : any) => {

		const query1 = uni.createSelectorQuery()
		const query = uni.createSelectorQuery()
		const topList : any[] = []
		stop.value = false
		query1.selectAll('.topContent').boundingClientRect()
		query.selectAll('.contentHight').boundingClientRect()
		query1.exec((res) => {
			var top = res[0][0].height - 15
			query.exec((res) => {
				for (var i = 0; i < res[0].length; i++) {
					topList.push(res[0][i].height + 32)

				}
				for (let i = 0; i < val - 1; i++) {
					top += topList[i]
				}

				uni.pageScrollTo({
					scrollTop: top,
					duration: 200,
					success: (res) => {
						isActive.value = val
						setTimeout(() => {
							stop.value = true
						}, 300)
					},
				})
			})
		})
	}
	const listTravelProductDailyDetail = () => {
		api.interfaceTransfer({
			query: {
				"beginDate": dayjs().format('YYYY-MM-DD'),
				// "endDate": dayjs().format('YYYY-MM-DD'),
				"cardLevel": user.cardLevel || '',
				"cardType": user.cardType || '',
				"gcLevel": "",
				"hotelGroupCode": config.hotelGroupCode,
				"itineraryCode": itineraryDtos.value.itineraryCode,
				"ota": "DIRECT",
				"otaChannel": otaChannel.value,
				// "travelGroupCode": travelDetail.travelGroupCode,
				"travelType": travelDetail.travelType
			},
			config: {
				"interfaceType": "POST",
				"interfaceModule": "GC_PRODUCT_JOURNEY",
				"interfaceMethod": "/api/travelGroup/listTravelProductDailyDetail",
				"interfaceFrom": "GC",
				"hotelGroupCode": config.hotelGroupCode
			}
		})
			.then((res : any) => {
				isAjax.value = false
				init.value = true
				dailyPriceList.value = []
				if (res.result == 1 && res.retVal.result == 0) {
					
					const info = res.retVal.retVal
					dailyEffectiveNum.value = 0
					if(couponUesType.value=='4'){
						for(let i=0;i<info.length;i++){
							let pass = false
							var item = info[i]
							productByCouponNo.value.forEach((code:any)=>{
								if(code==item.travelGroupCode){
									pass = true
								}
							})
							if(!pass){
								info.splice(i, 1);
                        		i--;
							}	
						}
						
					}
				
					
					info.forEach((item : any) => {
						const dailyDetail = item
						// dailyDetail.groupBeginDate = "2023-08-23 00:00:00"
						dailyDetail.embarkDate = item.groupBeginDate
						dailyDetail.MMdd = dayjs(item.groupBeginDate).format('MM/DD')
						// if (dayjs(item.groupBeginDate)) {
						// 	dailyDetail.week = '周日'
						// }
						// if(dayjs().diff(item.groupBeginDate, 's'))
						if (dayjs().diff(item.groupBeginDate, 's') < 0 && dailyEffectiveNum.value < 4 && dailyDetail.productAvailNum > 0) {
							item.show = true
							dailyEffectiveNum.value++
						}
						if (dayjs(item.groupBeginDate).format('d') == '0') {
							dailyDetail.week = '周日'
						}
						if (dayjs(item.groupBeginDate).format('d') == '1') {
							dailyDetail.week = '周一'
						}
						if (dayjs(item.groupBeginDate).format('d') == '2') {
							dailyDetail.week = '周二'
						}
						if (dayjs(item.groupBeginDate).format('d') == '3') {
							dailyDetail.week = '周三'
						}
						if (dayjs(item.groupBeginDate).format('d') == '4') {
							dailyDetail.week = '周四'
						}
						if (dayjs(item.groupBeginDate).format('d') == '5') {
							dailyDetail.week = '周五'
						}
						if (dayjs(item.groupBeginDate).format('d') == '6') {
							dailyDetail.week = '周六'
						}

						dailyDetail.groupEndDate = dayjs(dailyDetail.groupBeginDate).add(travelDetail.itineraryDays - 1, 'days').format('YYYY-MM-DD hh:mm:ss')
						dailyDetail.number = dailyDetail.productAvailNum

						if (travelDetail.categorySub == 'FreeTravel') {
							if (dailyDetail.productAvailNum > 8) {
								dailyDetail.availNum = 8
							} else {
								dailyDetail.availNum = dailyDetail.productAvailNum
							}
						} else {
							if (item.priceModel != 'PACKAGE') {
								if (dailyDetail.productAvailNum > 4) {
									dailyDetail.availNum = 4
								} else {
									dailyDetail.availNum = dailyDetail.productAvailNum
								}
							} else {
								dailyDetail.availNum = dailyDetail.productAvailNum
							}

						}
						dailyDetail.price = dailyDetail.minPrice
						if (item.specificationsPriceDtos.length > 0) {

							dailyDetail.allNumber = Number((item.specificationsPriceDtos[0].adult + item.specificationsPriceDtos[0].children).toFixed(2))
							dailyDetail.payType = item.specificationsPriceDtos[0].payType
							dailyDetail.specificationsType = item.specificationsPriceDtos[0].specificationsType
						}

						dailyDetail.groupBeginDateFormat = dayjs(dailyDetail.groupBeginDate).format('MM月DD日')
						dailyDetail.groupBeginDateFormat2 = dayjs(dailyDetail.groupBeginDate).format('MM.DD')
						dailyDetail.groupEndDateFormat = dayjs(dailyDetail.groupEndDate).format('MM月DD日')
						dailyPriceList.value.push(dailyDetail)
						// item.specificationsPriceDtos.forEach((priceDto : any) => {
						// 	// if (priceDto.specificationsType != itineraryDtos.value.specificationsType) {


						// 	// }
						// })


					})
					console.log(dailyPrices.value)
					dailyPrices.value.createDate(dailyPriceList.value);


				}
			})
	}
	const findTravelProductForWechatDetail = () => {
		let query:any = {
			"unitCode": config.hotelGroupCode,
			// "travelGroupCode": travelGroupCode.value,
			"travelType": travelType.value,
			"ota": "DIRECT",
			"otaChannel": otaChannel.value
		}
		// if(isAll.value=='T'){
		// 	query.isAll = true
		// }
		api.interfaceTransfer({
			query: query,
			config: {
				"interfaceType": "POST",
				"interfaceModule": "GC_PRODUCT_JOURNEY",
				"interfaceMethod": "/api/travelGroup/findTravelProductForWechatDetail",
				"interfaceFrom": "GC",
				"hotelGroupCode": config.hotelGroupCode
			}
		})
			.then((res : any) => {
				if (res.result == 1 && res.retVal.result == 0) {
					const info = res.retVal.retVal
					travelDetail = JSON.parse(JSON.stringify(info[0]))
					travelDetail.itineraryDtos = []
					if (travelDetail.urls) {
						travelDetail.urls.forEach((url : any) => {
							if (url.pictureType == 'LISTIMAGE') {
								productUrl.value = url.url
							}
						})
					}
					if(couponUesType.value=='3'){
						for(let i:any=0;i<info.length;i++){
							let item = info[i]
							productByCouponNo.value.forEach((code:any)=>{
								let groupCodes:any = []
								item.itineraryDtos.forEach((n:any)=>{
									if(code == n.itineraryCode){
										item.hasGroup = true
									}
								})
								
							})
							if(!item.hasGroup){
								info.splice(i, 1)
								i--
							}
						}
					}
					if(couponUesType.value=='4'){
						for(let i:any=0;i<info.length;i++){
							let item = info[i]
							productByCouponNo.value.forEach((code:any)=>{
								let groupCodes = item.travelGroupCode.split(",");
								groupCodes.forEach((groupCode:any) => {
									if(code == groupCode){
										item.hasGroup = true
									}
								});
							})
							if(!item.hasGroup){
								info.splice(i, 1)
								i--
							}
						}
					}
					info.forEach((item:any)=>{
						console.log(info)
						if (item.itineraryDtos.length > 0) {
							item.itineraryDtos.forEach((itineraryDto : any) => {
								
								itineraryDto.dayDtos.forEach((days : any,i:number) => {
									days.dayTitle = ''
									if(i==0){
										days.open = true
									}
									days.dayDetailDtos.forEach((day : any) => {
										console.log(day)
										if (day.picture) {
											day.picture = day.picture.replace(/;/g, ',').split(',')
										}
										if (!days.dayTitle) {
											days.dayTitle = day.title
										} else {
											days.dayTitle += ' - ' + day.title
										}
						
									})
								})
								travelDetail.itineraryDtos.push(itineraryDto)
							})
						}
					})
		
					console.log(travelDetail.itineraryDtos)
					if(travelDetail.itineraryDtos.length>0){
						travelDetail.itineraryDtos[0].active = true
						itineraryDtos.value = travelDetail.itineraryDtos[0]

					}
					slides = []
					travelDetail.topImage.forEach((item : string) => {
						slides.push({
							imgUrl: item
						})
					})
					if(info.length>0){
						listTravelProductDailyDetail()
					}else{
						init.value = true
					}
					
					if (travelDetail.categorySub == 'ButlerCustomized') {
						UmengSDK.sendPV({
							page_id: "",
							page_name: "destination_detail_pg",
							product_name:travelDetail.title,
							travel_type: itineraryDtos.value.categorySubDesc,
							from_page: "",
							price: travelDetail.startingPrice,
							page_title_name: travelDetail.title,

						});
					} else {
						UmengSDK.sendPV({
							page_id: "",
							page_name: "trip_detail_pg",
							product_name:travelDetail.title,
							travel_type: itineraryDtos.value.categorySubDesc,
							from_page: "",
							price: travelDetail.startingPrice,
							page_title_name: travelDetail.title,

						});
					}

				}
			});
	}
	const advertisementPage = () => {
		api
			.advertisementPage({
				hotelCode: config.hotelCode,
				hotelGroupCode: config.hotelGroupCode,
				clientTypes: channel.value,
				firstResult: 0,
				pageSize: 10,
				showLocation: '5'
			})
			.then((res : any) => {
				if (
					res.result == 0 &&
					res.retVal &&
					res.retVal.datas &&
					res.retVal.datas.length > 0
				) {
					res.retVal.datas.forEach((item : any) => {
						if (item.showLocation == '5') {
							adImg.value = JSON.parse(item.infos);
						}

					})

				}
			});
	};
	const chooseDate = (item : any) => {
		item.canTap = true
		dailyPrices.value.chooseDay(item)
		UmengSDK.sendEvent("trdp_button_clk", {
			page_id: "",
			page_name: "trip_detail_pg",
			button_name: itineraryDtos.value.itineraryDesc,
			button_id: itineraryDtos.value.itineraryCode,
			page_title_name: travelDetail.title,
		});
	}
	const changedailyPrice = (val : any) => {
		if(!val.hasRmtype){
			jAlert12('抱歉，该团期因房间紧缺无法下单','联系客服','重新选择',()=>{
				
			},()=>{
				orderLayer.value.hideDialog()
				showKf(false)
			},'如需帮助请联系松赞客服或顾问。')
			return;
		}
		curDailyPrice.value = val


		if (travelDetail.categorySub == 'FreeTravel') {
			adult.value = 0
			bigChildren.value = 0
			children.value = 0
			baby.value = 0
			number.value = 0
		}
		changeNumAge('add', 'adult')
		console.log(curDailyPrice.value)


	}
	const chooseTravel = (item : any) => {	
		if (isAjax.value||item.itineraryCode==itineraryDtos.value.itineraryCode) {
			return;
		}
		isAjax.value = true
		curDailyPrice.value = {}
		travelDetail.itineraryDtos.forEach((itinerary : any) => {
			itinerary.active = false
		})
		item.active = true
		itineraryDtos.value = item
		listTravelProductDailyDetail()
		UmengSDK.sendEvent("trdp_button_clk", {
			page_id: "",
			page_name: "trip_detail_pg",
			button_name: itineraryDtos.value.itineraryDesc,
			button_id: itineraryDtos.value.itineraryCode,
			page_title_name: travelDetail.title,
		});
	}
	const findCouponDetailByCouponNo = (cb:any) => {
		api.interfaceTransfer({
			query: {
				"hotelGroupCode": config.hotelGroupCode,
				"couponNo": couponNo.value,
				"channel": "WECHAT"

			},
			config: {
				"interfaceType": "POST",
				"interfaceModule": "",
				"interfaceMethod": "/api/coupon/listCouponCodeUseConfigProductByCouponNo",
				"interfaceFrom": "coupon",
				"hotelGroupCode": config.hotelGroupCode
			}
		})
			.then((res : any) => {
				if (res.result == 1 && res.retVal.result == 0) {
					productByCouponNo.value = []
					if(res.retVal.retVal.length>0){
						res.retVal.retVal.forEach((item:any)=>{
							couponUesType.value = item.type
							if(item.type=='4'||item.type=='3'){
								productByCouponNo.value.push(item.productCode)
							}
							
						})
						
					}
					cb&&cb()
				}
			});

	}
	const openItinerary = (item : any,i:number) => {
		
		item.open ? item.open = false : item.open = true
		if(!item.open){
			nextTick(()=>{
				var selector = '#travel-date-item'+i
				uni.pageScrollTo({ 
					selector: selector,
					offsetTop: -(navHeight.value+39),
					complete: (res) => {

					}
				})
			})
		}
	}
	const confirmOrder = () => {
		var data : any = {
			title: travelDetail.title,
			itineraryDesc: itineraryDtos.value.itineraryDesc,
			groupBeginDateFormat: curDailyPrice.value.groupBeginDateFormat,
			groupEndDateFormat: curDailyPrice.value.groupEndDateFormat,
			groupBeginDate: curDailyPrice.value.groupBeginDate,
			groupEndDate: curDailyPrice.value.groupEndDate,
			number: number.value,
			travelGroupCode: curDailyPrice.value.travelGroupCode,
			travelType: travelDetail.travelType,
			itineraryCode: itineraryDtos.value.itineraryCode,
			price: curDailyPrice.value.price,
			meetingPoint: travelDetail.rendezvous,
			specificationsPriceDtos: [],
			productUrl: '',
			priceDtos: curDailyPrice.value.priceDtos,
			orderType: travelDetail.categorySub,
			category: travelDetail.category,
			orderTypeDesc: itineraryDtos.value.categorySubDesc,
			isSigning: travelDetail.isSigning,
			priceModel: curDailyPrice.value.priceModel,
			adult: adult.value,
			children: children.value,
			bigChildren: bigChildren.value,
			baby: baby.value,
			specificationsType:itineraryDtos.value.specificationsType


		}
		if (travelDetail.categorySub == 'FreeTravel') {
			if ((bigChildren.value + children.value + baby.value) > maxChild.value) {
				jAlert3(`当前选择儿童数超过最大数${maxChild.value}`)
				return;
			}
		}

		if (curDailyPrice.value.specificationsPriceDtos) {
			curDailyPrice.value.specificationsPriceDtos.forEach((item : any) => {
				var has = false
				data.specificationsPriceDtos.forEach((specification : any) => {
					if (item.payType == specification.payType) {
						has = true
					}
				})
				if (!has) {
					data.specificationsPriceDtos.push(item)
				}


			})
		}
		if (travelDetail.urls) {
			travelDetail.urls.forEach((url : any) => {
				if (url.pictureType == 'LISTIMAGE') {
					data.productUrl = url.url
				}
			})
		}
	
		setStorage('travelInfo', data)
		if (travelDetail.categorySub == 'ButlerCustomized'||travelDetail.categorySub == 'DestPackage') {

			UmengSDK.sendEvent("ddp_book_clk", {
				page_id: "",
				page_name: "destination_detail_pg",
				start_date: curDailyPrice.value.groupBeginDate,
				end_date: curDailyPrice.value.groupBeginDate,
				price: travelDetail.startingPrice

			});
		}

		let url = `/pagesB/travel/confirmOrder?sourceActivityId=${sourceActivityId.value}&sourceActivityName=${sourceActivityName.value}`
		if (couponNo.value) {
			url = `/pagesB/travel/confirmOrder?sourceActivityId=${sourceActivityId.value}&sourceActivityName=${sourceActivityName.value}&couponNo=${couponNo.value}`
		}
		orderLayer.value.hideDialog()
		numberLayer.value.hideDialog()
		goPage(url)
	}
	let menuPos = computed(() => {
		const menuButton = getMenuButtonBoundingClientRect();
		return `right:${menuButton.right - menuButton.left}px;`
	})
	onShareAppMessage(() => {
		return {
			title: travelDetail.title,
			path: '/pagesB/travel/travelDetail?travelType=' + travelDetail.travelType,
			imageUrl: productUrl.value,
			success: function () {
				// 转发成功
			},
			fail: function () {
				// 转发失败
			}
		}
	})
	onMounted(() => {
		if(couponNo.value){
			findCouponDetailByCouponNo(()=>{
				findTravelProductForWechatDetail()
			})
		}else{
			findTravelProductForWechatDetail()
		}
		getGoodsIsCollection()
		advertisementPage()
		

		uni.getSystemInfo({
			success: (res : any) => {
				navHeight.value = res.statusBarHeight + 40

			},
			fail(err) {
				console.log(err);
			},
		});

	});
</script>

<style lang="less" scoped>
	@import url("~@/styles/skin.less");
	@import url("~@/styles/mixin.less");

	.travelDetail_ui {
		padding-bottom: calc(100px + constant(safe-area-inset-bottom));
		padding-bottom: calc(100px + env(safe-area-inset-bottom));

		::-webkit-scrollbar {
			display: none;
			width: 0;
			height: 0;
			color: transparent;
		}

		.coustom-head {
			position: relative;
			z-index: 5;

			.head-box {
				height: 20px;
				width: 100%;
				position: relative;
			}

			.head {

				display: flex;
				align-items: center;
				margin-top: 2px;
				padding-left: 20px;
				font-size: 14px;

				.head-item {
					position: relative;
					margin-left: 12px;
				
					opacity: 0.6;
					color: #fff;

					&::after {
						content: '';
						position: absolute;
						right: -6px;
						opacity: 0.6;
						top: 3px;
						width: 1px;
						height: 12px;
						background: #fff;
					}

					&:last-child {
						&::after {
							display: none;
						}
					}

					&.active {
						position: relative;
						opacity: 1;
						font-weight: bold;

						&::before {
							content: '';
							position: absolute;
							background: #fff;
							top: 22px;
							left: 50%;
							transform: translateX(-50%);
							height: 4px;
							width: 4px;
							border-radius: 50%;
						}

					}
				}


			}
		}

		.share-icon {
			position: absolute;
			right: 0;
			top: 0;

			.iconfont {
				font-size: 20px;
			}
		}

		.canvas-ninja {
			width: 375px; // 350px
			height: 677px; // 570px， 图片350 + 120
			position: fixed;
			top: 0;
			left: 0;
			// transform: translatex(-50%);
			box-sizing: border-box;
			overflow: hidden;
			z-index: 99999;

		}

		.swiper-box {
			position: relative;
			width: 100%;
			height: 75.2vw;
			z-index: 1;
		}

		.product-info {
			padding: 16px 16px 0;

			.product-name {
				position: relative;
				font-weight: bold;
				font-size: 20px;
				line-height: 30px;
				padding-right: 22px;

				.icon-a-20_shoucang_weishoucang,.icon-a-20_shoucang_yishoucang {
					position: absolute;
					font-weight: normal;
					font-size: 20px;
					right: 0;
					top: 6px;
					
					color: #ccc;

					&.active {
						color: #a43127;
					}
				}

				.icon {
					display: inline-block;
					background: rgba(0, 67, 85, 0.9);
					border-radius: 4px;
					height: 20px;
					line-height: 20px;
					font-size: 12px;
					color: #fff;
					padding: 0 4px;
					margin: 5px 8px 5px 0;
					vertical-align: top;

					&.ButlerCustomized {
						background: rgba(0, 0, 0, 0.9);
						color: #FFDF8C;
					}

					&.FreeTravel {
						background: rgba(51, 103, 53, 0.9);
					}

					&.DestPackage {
						background: rgba(219, 137, 0, 0.9);
					}

				}

			}

			.product-sub-tl {
				margin-top: 12px;
				color: #808080;
				font-size: 14px;
				line-height: 22px;
			}

			.product-price {

				margin-top: 24px;
				color: #A43127;
				font-weight: 600;
				font-size: 20px;
				line-height: 1;
				font-family: Montserrat;
				.unit {
					display: inline;
					color: #808080;
					font-size: 12px;
					font-weight: normal;

					.iconfont {
						display: inline;
						margin-left: 4px;
						font-size: 12px;
						font-weight: normal;
					}
				}
			}

			.other-price {
				display: inline-flex;
				align-items: center;
				margin-top: 8px;
				background: rgba(219, 137, 0, 0.16);
				border-radius: 4px;
				padding: 4px;
				color: #000000;
				font-size: 10px;
			}

			.product-descs {
				display: flex;
				margin-top: 24px;

				.desc-item {
					padding-left: 16px;
					padding-right: 8px;
					box-sizing: border-box;
					position: relative;
					flex: 1;
					max-width: 33.3%;

					.label {
						color: #808080;
						font-size: 12px;
						line-height: 1;
						white-space: nowrap;
					}

					.val {
						margin-top: 12px;
						color: #000000;
						font-size: 14px;
						line-height: 1;
						word-break: break-all;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}

					&::after {
						position: absolute;
						content: '';
						width: 1px;
						height: 28px;
						right: 0;
						top: 50%;
						background: #CCCCCC;
						transform: translateY(-50%) scaleX(0.5);

					}

					&:last-child {
						&::after {
							display: none;
						}

					}
				}
			}

			.themes {
				margin-top: 16px;

				.theme {
					margin-top: 8px;
					display: inline-block;
					padding: 4px;
					border-radius: 4px;
					color: #A43127;
					font-size: 12px;
					line-height: 1;
					background: rgba(164, 49, 39, 0.12);
					margin-right: 4px;
				}
			}

		}

		.product-info-box {
			margin-top: 32px;

			.title {
				padding: 0 16px;
				color: #000000;
				font-size: 18px;
				font-weight: bold;
				line-height: 1;
			}

			.explain-box {
				padding-top: 12px;

				.explain-list {
					margin: 12px 16px 0;
					background: #FFFFFF;
					border-radius: 8px;
					padding:16px 12px;
					font-size: 12px;
				}

				.explain-item {
					margin-top: 12px;

					&:first-child {
						margin-top: 0;
					}

					.tl {
						display: flex;
						justify-content: space-between;
						font-size: 14px;
						font-weight: bold;
						height: 14px;
						&.mini-tl{
							height: auto;
							font-size: 12px;
						}
					}

					.desc {
						line-height: 22px;
						margin-top: 16px;
						font-size: 14px;
						color: #808080;

					}

					.explain {
						margin-top: 16px;
					}
				}
			}

			.routes {
				margin-top: 24px;
				white-space: nowrap;
				overflow-x: auto;

				.route {
					margin-left: 8px;
					display: inline-block;
					// align-items: center;
					// justify-content: center;
					// flex-direction: column;
					background: #FFFFFF;
					border-radius: 8px;
					padding: 16px 21px;
					text-align: center;
					// max-width: 42.67vw;

					&.active {
						border: 1px solid #A43127;
					}

					.label {
						font-weight: bold;
						font-size: 14px;
						line-height: 1;
					}

					.val {
						margin-top: 5px;
						font-size: 12px;
						color: #000000;
						opacity: 0.7;
						overflow: hidden;
						white-space: initial;
						line-height: 18px;
						height: 18px;
					}

					&:first-child {
						margin-left: 16px;
					}

					&:last-child {
						margin-right: 16px;
					}
				}
			}

			.dates-box {
				margin-top: 16px;
				position: relative;

				.dates {

					display: flex;
					flex-wrap: nowrap;
					overflow-x: auto;
					padding-right: 60px;

					.date {
						margin-left: 8px;
						display: flex;
						align-items: center;
						justify-content: center;
						flex-direction: column;
						background: #FFFFFF;
						border-radius: 8px;
						padding: 16px 21px;
						box-sizing: border-box;
						border: 1px solid #fff;

						&.active {
							border: 1px solid #A43127;
						}

						.label {

							font-size: 12px;
							line-height: 1;
							color: #808080;
						}

						.val {
							margin-top: 8px;
							font-size: 16px;
							line-height: 1;
							color: #000000;

							font-weight: bold;
							white-space: nowrap;
						}
						.price{
							margin-top: 8px;
							font-size:12px;
							line-height: 1;
						}
						&:first-child {
							margin-left: 16px;
						}

						&:last-child {
							margin-right: 16px;
						}
					}

				}

				.all-date {
					position: absolute;
					right: 0;
					height: 100%;
					width: 52px;
					top: 0;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					background: #FFFFFF;
					color: #808080;
					font-size: 14px;
					box-shadow: -12px 0px 12px rgba(0, 0, 0, 0.04);

					.iconfont {
						margin-bottom: 10px;
					}
				}
			}

		}

		.tabs-warp {
			margin-top: 20px;
			height: 40px;
		}

		.tabs {

			display: flex;
			padding: 0 26px;

			&.fixed {
				position: fixed;
				top: 40px;
				left: 0;
				width: 100%;
				background: #fff;
				z-index: 5;
			}

			.tab {
				position: relative;
				flex: 1;
				text-align: center;
				color: #808080;
				font-size: 16px;
				line-height: 1;
				padding: 12px 0;

				&.active {
					color: #000000;
					font-weight: bold;

					&::after {
						content: '';
						position: absolute;
						bottom: -2px;
						left: 50%;
						transform: translateX(-50%);
						width: 32px;
						height: 2px;

						background: #A43127;
					}
				}
			}
		}

		.product-info-box {
			.itinerary-pic {
				padding: 24px 16px 32px;

				.itinerary-pic-img {
					width: 100%;
					border-radius: 8px;
				}
			}

			.characteristic {
				margin-top: 32px;

				.characteristic-label {
					display: inline-block;
					background: #000;
					width: 144px;
					height: 32px;
					font-size: 16px;
					line-height: 32px;
					padding-left: 64px;
					font-weight: bold;
					color: #fff;
					background: url(https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/characteristic-bg.png) no-repeat;
					background-size: cover;
				}

				.characteristic-title {
					font-family: 'Source Han Serif CN';
					padding: 16px 16px 20px 16px;

					font-size: 20px;
					line-height: 30px;
					color: #000000;
				}

				.characteristic-list {
					display: flex;
					flex-wrap: nowrap;
					overflow-x: auto;

					.characteristic-item {

						.characteristic-box {
							border-radius: 8px;
							background: #fff;
							margin-left: 8px;
						}


						.characteristic-img {
							display: block;
							width: 88.5444vw;
							height: 66.675vw;
							border-radius: 8px 8px 0px 0px;
						}

						.characteristic-info {
							padding: 16px 12px 20px;
							box-sizing: border-box;
							width: 88.5444vw;
						}

						.characteristic-name {

							font-size: 16px;
							font-weight: bold;
							line-height: 24px;
							max-height: 24px;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 1;
							overflow: hidden;

						}

						.characteristic-desc {
							margin-top: 4px;
							color: #808080;
							font-size: 14px;
							line-height: 22px;
						}

						&:first-child {
							margin-left: 8px;
						}

						&:last-child {
							margin-right: 16px;
						}
					}
				}
			}
		}

		.product-info-box {
			.travel-dates {
				padding: 12px 16px 0;
			}

			.ad-banner {
				margin: 32px 16px 0;
				height: 21.9vw;
			}

			.travel-date-item {
				background: #fff;
				margin-top: 12px;
				padding: 16px 0;
				border-radius: 8px;

				.travel-date-rt {
					position: relative;

					.tl {

						.iconfont {
							transition: all 0.2s;
							height: 18px;
							font-weight: normal;
						}
					}
				}

				&.open {
					
					.travel-date{
						align-items: normal;
					}
					.travel-date-fixed{
						display: flex;
						align-items: center;
						.iconfont {
							color: #A43127;
							transform: rotate(180deg);
						}
					}
					.travel-date-lf {

						.label,
						.val {
							color: #A43127;
						}

					}

					.travel-date-rt {

						.head,
						.tl {
							color: #A43127;

							.iconfont {
								transform: rotate(180deg);
							}
						}
					}

					.desc {
						display: none;
					}

					.day-travel-list {
						display: block;
					}
				}

				.day-travel-list {
					display: none;
					position: relative;

					&:after {
						content: '';
						position: absolute;
						top: 0;
						bottom: 0;
						background-size: 1px 100%;
						width: 1px;
						
  						background: linear-gradient(to bottom, #eee, #eee 5px, transparent 5px, transparent); /* 调整为垂直渐变 */
  						background-size: 100% 10px; /* 调整虚线宽度和间距 */
						
						left: 25px;
					}

					.day-travel {
						position: relative;
						display: flex;
						margin-top: 16px;
						padding: 0 12px 0 0;

						&:last-child {
							.icon {
								height: auto;
							}
						}

						.icon {
							position: relative;
							display: flex;
							justify-content: center;
							z-index: 2;
							width: 49px;
							height: 20px;
							padding: 8px 0;
							box-sizing: content-box;
							background: #fff;

							.iconfont {
								width: 20px;
								height: 20px;

							}
						}

						.day-travel-info {
							padding-top: 8px;
							padding-left: 12px;
							flex: 1;

							.day-travel-tl {
								font-weight: bold;
								line-height: 20px;
							}

							.day-travel-desc {
								margin-top: 12px;
								font-size: 14px;
								font-family: PingFang SC;
								line-height: 22px;
								color: #808080;
							}

							.day-travel-img-box {
								position: relative;
								width: 100%;
								border-radius: 4px;
								overflow: hidden;
								margin-top: 16px;

								.day-travel-img {
									display: block;
									width: 100%;
								}

								.day-travel-name {
									position: absolute;
									left: 16px;
									top: 16px;
									right: 16px;
									font-weight: bold;
									line-height: 1;
									font-size: 14px;
									color: #fff;
								}
							}

						}
					}
				}
			}

			.travel-date {

				display: flex;
				align-items: center;
				&.travel-date-fixed{
					display: none;
					position: fixed;
					left: 0;
					right:0;
					background: #fff;
					padding: 16px;
					z-index: 4;
					&::after{
						position: absolute;
						bottom: 0;
						left: 0;
						height: 1px;
						right: 0;
						transform: scaleY(0.5);
						background: #eee;
					}
					.travel-date-rt{
						display: flex;
						justify-content: space-between;
						padding-right: 12px;
					}
				}
				.travel-date-lf {
					position: relative;
					width: 49px;


					.label {
						
						text-align: center;
						color: #000000;
						font-size: 12px;
					}

					.val {
						text-align: center;
						margin-top: 4px;
						line-height: 1;
						color: #000000;
						font-size: 20px;
						font-family: 'Montserrat';
						font-style: normal;
						font-weight: 600;
					}
				}

				.travel-date-rt {
					flex: 1;
					margin-left: 12px;

					&::after {
						content: '';
						position: absolute;
						width: 1px;
						top: 0;
						bottom: 0;
						left: -12px;
						transform: scaleX(0.5);
						background: #eee;
					}

					.head {
						font-size: 14px;
						line-height: 1;
						color: #000000;
					}

					.tl {
						display: flex;
						justify-content: space-between;
						margin-top: 8px;
						color: #000000;
						padding-right: 12px;
						font-family: 'Source Han Serif CN';
						font-style: normal;
						font-weight: 900;
						font-size: 16px;
						line-height: 1.3;

						.icon-a-12_xialajiantou_hei {
							color: #000;
						}
					}

					.desc {
						margin-top: 8px;
						color: #808080;
						font-size: 12px;
						line-height: 18px;
					}
				}
			}

			.problem {
				background: #FFFFFF;
				border-radius: 8px;
				margin: 12px 16px 0;
				font-size: 12px;
				padding: 12px;

				&:first-child {
					margin-top: 24px;
				}

				.question {
					color: #000000;
					line-height: 1;
					font-size: 16px;
				}

				.answer {
					margin-top: 16px;
					font-size: 14px;
					line-height: 22px;
					color: #808080;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 3;
					white-space: normal;
					overflow: hidden;
				}
			}

			.more-box {
				margin-top: 24px;
				display: flex;
				justify-content: center;

				.more-btn {
					padding: 11px 40px;
					border: 1px solid #CCCCCC;
					border-radius: 170px;
					font-weight: 400;
					font-size: 14px;
					line-height: 1;

				}
			}

		}

		.footer {
			display: flex;
			padding: 12px 16px;
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 2;
			right: 0;
			background: #fff;
			border-top: 0.5px solid #EEEEEE;
			padding-bottom: calc(12px + constant(safe-area-inset-bottom));
			padding-bottom: calc(12px + env(safe-area-inset-bottom));
			.kefu {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				width: 60px;
				padding-right: 16px;
				font-size: 12px;

				.iconfont {
					font-size: 20px;
					margin-bottom: 4px;
				}
			}

			.order-btn {
				display: flex;
				flex: 1;
				justify-content: center;
				align-items: center;
				
				border-radius: 4px;
				color: #FFFFFF;
				font-size: 16px;
				height: 48px;
			}
			.order-noBtn {
				display: flex;
				flex: 1;
				justify-content: center;
				align-items: center;
				background: rgba(238, 238, 238, 1);
				border-radius: 4px;
				color: rgba(204, 204, 204, 1);
				font-size: 16px;
				height: 48px;
				}

		}

		.order-layer {
			padding-bottom: 100px;

			.title {
				padding: 16px 16px 0;
				color: #000000;
				font-size: 16px;
				font-weight: bold;
				line-height: 1;
			}

			.order-box {

				width: 100%;
				border-radius: 16px 16px 0 0;
				background: #F8F8F8;
				z-index: 2;
		

				.head {
					position: relative;
					display: flex;
					justify-content: center;
					font-weight: 600;
					font-size: 18px;
					line-height: 1;
					padding: 19px 0;
					background: #fff;
					border-bottom: 1px solid #EEEEEE;

					.icon-a-20_guanbi {
						position: absolute;
						left: 22px;
						top: 20px;
						font-size: 20px;
					}
				}

				.routes {
					margin-top: 24px;
					white-space: nowrap;
					overflow-x: auto;
					padding-bottom: 8px;

					.route {
						margin-left: 8px;
						display: inline-block;
						text-align: center;
						background: #f8f8f8;
						border-radius: 8px;
						padding: 12px 21px;
						border: 1px solid #EEEEEE;
						border-radius: 4px;

						&.active {
							border: 1px solid #A43127;

							.label {
								font-weight: bold;
							}
						}

						.label {
							font-weight: normal;
							font-size: 12px;
							line-height: 1;
						}

						.val {
							margin-top: 4px;
							font-size: 12px;
							line-height: 1;
							color: #000000;
							opacity: 0.7;
							white-space: nowrap;
						}

						&:first-child {
							margin-left: 16px;
						}

						&:last-child {
							margin-right: 16px;
						}
					}
				}

				.booking-date {
					margin-top: 16px;

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
					border-top: 0.5px solid #EEEEEE;
					padding: 12px 16px;
					background: #fff;
					padding-bottom: calc(12px + constant(safe-area-inset-bottom));
					padding-bottom: calc(12px + env(safe-area-inset-bottom));
					
					.choose-item {
						color: #808080;

						text-align: center;
						font-size: 12px;
						line-height: 12px
					}

					.btn {
						margin-top: 12px;
						line-height: 48px;
						height: 48px;
					}
				}
			}

		}

		.number-layer {

			.number-box {

				width: 100%;
				border-radius: 16px 16px 0 0;
				z-index: 2;
				background: #F8F8F8;

				.number-choose {
					padding: 0 16px;
					min-height: 244px;

					.travel-number {
						height: 52px;
						align-items: center;
						display: flex;
						justify-content: space-between;

						.label {
							align-items: center;
							display: flex;
							color: #000000;
							font-size: 14px;

							.age {
								color: #ccc;
								margin-left: 10px;
							}
						}

						.val {
							display: flex;
							align-items: center;

							.num {
								padding: 0 16px;
								font-size: 16px;
							}

							.iconfont {
								font-size: 22px;

								&.unable {
									color: #CCCCCC;
								}
							}
						}
					}

					.num-sku {
						padding-top: 4px;
						padding-bottom: 10px;
						display: flex;
						flex-wrap: wrap;

						.num-sku-item {
							display: flex;
							align-items: center;
							justify-content: center;
							width: calc(50% - 4px);
							height: 54px;
							border: 1px solid #EEEEEE;
							font-size: 14px;
							border-radius: 4px;
							margin-top: 12px;

							&:nth-child(2n) {
								margin-left: 8px;
							}

							&.active {
								font-weight: bold;
								border: 1px solid #A43127;
							}
						}
					}

					.tips {
						display: inline-block;
						margin-top: 16px;
						color: #808080;
						font-size: 12px;
						line-height: 18px;


						.customer {
							color: #000;

							display: inline-flex;
							font-size: 12px;
							line-height: 18px;
							padding: 0 4px;
							margin: 0;
							border: 0;

							&::after {
								border: none;
							}

							.iconfont {
								font-size: 14px;
							}
						}
					}
				}

				.head {
					position: relative;
					display: flex;
					justify-content: center;
					font-weight: 600;
					font-size: 18px;
					line-height: 1;
					padding: 19px 0;
					background: #fff;
					border-bottom: 1px solid #EEEEEE;

					.icon-a-20_fanhuianniu {
						position: absolute;
						left: 22px;
						top: 20px;
						font-size: 20px;
					}
				}

				.next-btn {
					border-top: 0.5px solid #EEEEEE;
					padding: 12px 16px;
					background: #fff;

					.btn {

						line-height: 48px;
						height: 48px;
					}
				}
			}
		}

		.bg {
			position: fixed;
			left: 0;
			top: 0;
			height: 100%;
			width: 100%;
			background: rgba(0, 0, 0, 0.76);

		}

	}
</style>