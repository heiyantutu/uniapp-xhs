<template>
<div class="travelDetail_ui" v-if="goodsInfo.id">
    <div class="topContent">
        <div class="coustom-head">
            <coustom-head :color="scrollTop>50?'#000':'#fff'" :bgColor="scrollTop>50?'#fff':''">
                <!-- <template v-slot:title>

<div class="share-icon" :style="menuPos">

<i class="iconfont icon-a-20_fenxianganniu_bai"></i>

</div>

</template> -->
            </coustom-head>
        </div>

        <div class="swiper-box">
            <swiper-box :slides="slides" :swiperConfig="swiperConfig"></swiper-box>
        </div>
        <div class="product-info">
            <div class="product-name">{{goodsInfo.name}} <i class="iconfont" :class="{'active':isCollect,'icon-a-20_shoucang_yishoucang':isCollect,'icon-a-20_shoucang_weishoucang':!isCollect}" @click="toCollection()"></i>
            </div>
            <div class="product-sub-tl">{{goodsInfo.secondTitle}}</div>
            <div class="product-price" @click="priceTips()">¥{{goodsInfo.price}}
                <div class="unit">/份<template v-if="skuList.length>0">起</template>
                    <!-- <i class="iconfont icon-a-12_tishi"></i> -->
                </div>
            </div>
            <div class="other-price" v-if="goodsInfo.credit">
                现金+积分价： <span> ¥{{ goodsInfo.creditPrice }}</span>
                <span>
                    +{{ goodsInfo.credit}}积分
                </span>
                /份<template v-if="skuList.length>0">起</template>
            </div>
            <div class="themes" v-if="goodsInfo.shopGoodsConfig.goodsCity">
                <div class="theme" v-for="(item,i) in goodsInfo.tags" :key="i">{{item}}</div>

            </div>
        </div>
        <div class="product-info-box" v-if="skuList.length">
            <div class="title">
                可订系列
            </div>
            <div class="routes">
                <div class="route" v-for="(item,i) in skuList" :key="i" @click="chooseSku(item)" :class="{'active':curSku.skuId == item.skuId}">
                    <div class="label">{{item.sku[0].itemValue}}</div>
                    <div class="val">{{item.skuDesc}}</div>
                </div>

            </div>

        </div>
    </div>
    <div class="tabs-warp">
        <div class="tabs" :class="{'fixed':fixed}" :style="{top:navHeight+'px'}">

            <div class="tab" @click="switchTab(1)" :class="{'active':isActive==1}">
                详情
            </div>
            <div class="tab" @click="switchTab(2)" :class="{'active':isActive==2}">
                预订须知
            </div>
            <div class="tab" @click="switchTab(3)" :class="{'active':isActive==3}">
                问答
            </div>
        </div>
    </div>

    <div class="product-info-box contentHight">
		<template v-for="(coupon,j) in couponCodeUseConfigProductDtoListNew" :key="j">
			<div class="coupon-product" v-if="coupon.productDtoList&&coupon.productDtoList.length>0">
				 <div class="title">
					<template v-if="couponCodeUseConfigProductDtoListNew.length>1">券{{j+1}}</template>可兑换以下任一<template v-if="coupon.productDtoList[0].categorySub=='ButlerCustomized'||coupon.productDtoList[0].categorySub=='DestPackage'">套餐</template><template v-else>路线</template>
				</div>
				<div class="exchange-list">
					<div class="item" @click="showDetail(item)" v-for="(item,index) in coupon.productDtoList" :key="index">
						<div class="img-box">
							<div class="lab" v-if="item.categorySub=='ButlerCustomized'||item.categorySub=='DestPackage'">套餐{{index+1}}</div>
							<div class="lab" v-else>路线{{index+1}}</div>
							<img mode="aspectFill" :src="item.urls[0].url" v-if="item.urls&&item.urls.length>0" class="img">
						</div>

						<div class="info">
							<div class="name">
								{{item.title}}
							</div>

						</div>
					</div>

				</div>
			</div>
		</template>
        <!-- <template v-if="productDtoList.length>0">
            <div class="title">
                可兑换以下任一<template v-if="productDtoList[0].categorySub=='ButlerCustomized'||productDtoList[0].categorySub=='DestPackage'">套餐</template><template v-else>路线</template>
            </div>
            <div class="exchange-list">
                <div class="item" @click="showDetail(item)" v-for="(item,index) in productDtoList" :key="index">
                    <div class="img-box">
                        <div class="lab" v-if="item.categorySub=='ButlerCustomized'||item.categorySub=='DestPackage'">套餐{{index+1}}</div>
                        <div class="lab" v-else>路线{{index+1}}</div>
                        <img mode="aspectFill" :src="item.urls[0].url" v-if="item.urls&&item.urls.length>0" class="img">
                    </div>

                    <div class="info">
                        <div class="name">
                            {{item.title}}
                        </div>

                    </div>
                </div>

            </div>
        </template> -->
        <div class="exchange-info">

            <div class="exchange-info-item" v-if="goodsInfo.extraConfig.peopleNum">
                <div class="label">
                    适用人数
                </div>
                <div class="val">
                    {{goodsInfo.extraConfig.peopleNum}}名成人
                </div>
            </div>
            <div class="exchange-info-item" v-if="goodsInfo.extraConfig.exchangeRule">
                <div class="label">
                    兑换规则
                </div>
                <div class="val">
                    <mp-html :content="goodsInfo.extraConfig.exchangeRule"></mp-html>
                </div>
            </div>
            <div class="exchange-info-item" v-if="goodsInfo.extraConfig.yyRule">
                <div class="label">
                    预约规则
                </div>
                <div class="val">
                    <mp-html :content="goodsInfo.extraConfig.yyRule"></mp-html>
                </div>
            </div>
            <div class="exchange-info-item" v-if="goodsInfo.extraConfig.otherDes">
                <div class="label">
                    其他说明
                </div>
                <div class="val">
                    <mp-html :content="goodsInfo.extraConfig.otherDes"></mp-html>
                </div>
            </div>
        </div>
    </div>
    <div class="product-info-box contentHight">

        <div class="title">
            预订须知
        </div>
        <template v-for="(item,i) in goodsInfo.diyDetail" :key="i">
            <div class="explain-box" v-if="item.name||item.content">
                <collapse defaultHeight="30px" open=true arrowStyle="position: absolute;right: 0;top: -5px;width: 100%;display: flex;justify-content: flex-end;" iconName="icon-a-16_xialajiantou_hei">
                    <template v-slot:content>
                        <div class="explain-item">
                            <div class="tl">{{item.name}}</div>
                            <div class="desc" v-html="item.content">

                            </div>

                        </div>
                    </template>

                </collapse>

            </div>
        </template>

    </div>
    <div class="product-info-box contentHight" v-if="goodsInfo.notesToBuy&&goodsInfo.notesToBuy.length>0">
        <div class="title">
            常见问题
        </div>
        <div class="problems">
            <template v-for="(item,i) in goodsInfo.notesToBuy" :key="i">
                <div class="problem" v-if="i<3" @click="toProblemDetail(item)">
                    <div class="question">Q：{{item.label}}</div>
                    <div class="answer">A：{{item.answer}}</div>
                </div>
            </template>

        </div>

        <div class="more-box" v-if="goodsInfo.notesToBuy.length>3">
            <div class="more-btn" @click="toProblem()">更多问题</div>
        </div>

    </div>
    <div class="footer">
        <div class="kefu" @click="showKf()">
            <i class="icon-a-20_kefu iconfont"></i>
            客服
        </div>
        <div class="order-btn baseBtn" @click="confirmOrder()">预订</div>
    </div>
    <travel-dialog ref="travel" :travelType="travelType" :travelTitle="travelTitle" :travelGroupCodes="travelGroupCodes"></travel-dialog>
    <kf-dialog ref="kf" title="联系客服"></kf-dialog>
    <back-to-top></back-to-top>
    <!-- <share></share> -->
    <!-- <canvas canvas-id="myCanvas" class="canvas-ninja" width="375" height="667" /> -->
</div>
</template>

<script setup lang="ts">
import {
    reactive,
    ref,
    computed,
    onMounted
} from "vue";
import api from "@/utils/api";
import swiperBox from "@/components/swiperBox.vue";
import UmengSDK from "@/utils/umengAdaptor.js";
import coustomHead from "@/components/coustomHead.vue";
import useScroll from "@/hooks/useScroll";
import travelDialog from "@/components/travelDialog.vue";
import kfDialog from "@/components/kfDialog.vue";
import collapse from "@/components/collapse.vue";
import defaultShopChannel from "@/utils/defaultShopChannel";
import backToTop from "@/components/backToTop.vue";
import {
    getStorage,
    setStorage
} from "@/utils/wxuser";
import {
    onShareAppMessage,
    onLoad
} from "@dcloudio/uni-app";
import {
    jAlert3
} from "@/base/jAlert/jAlert";
import {
    goPage,
    toLogin
} from "@/utils/utils";
import dayjs from "dayjs";
const {
    scrollTop,
    onPageScroll
} = useScroll();
let config = getStorage("config");
let wxuser = getStorage("wxuser");
let user = getStorage("user");
let shopChannel = ref(defaultShopChannel);
const isActive = ref(1)
const navHeight = ref(0)
const fixed = ref(false)
const stop = ref(true)
const packageBox = ref();
const id = ref("")
const skuList: any = ref([])
const curSku: any = ref({})
const goodsInfo: any = ref({})
const travel = ref()
const travelType: any = ref('')
const travelTitle: any = ref('')
const travelGroupCodes: any = ref([])
const kf = ref()
const isCredit = ref('T')
let sourceActivityId = ref("");
let sourceActivityName = ref("");
const couponCodeUseConfigProductDtoList: any = ref([])
let isAjax = ref(false)
let isCollect = ref(false)
let ids = ref([])
let swiperConfig = reactive({
    indicatorDots: false,
    autoplay: false,
    dotPosStyle: "left: 50%;transform: translateX(-50%);bottom:12px;"
});
let productDtoList: any = ref([]);
let slides: any = reactive([]);

onPageScroll((e) => {
    scrollTop.value = e.scrollTop;

    const topList: any[] = []
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
            topList[2] < 0
        ) {
            isActive.value = 3
        } else if (topList[1] < 0) {
            isActive.value = 2
        } else {
            isActive.value = 1
        }
    })

})
const toProblemDetail = (item: any) => {
    goPage(`/pagesB/other/questionDetail?problemCode=${item.key}`)
}
const toProblem = () => {
    goodsInfo.value.notesToBuy.forEach((item: any) => {
        item.problemCode = item.key
    })
    setStorage('problemDtos', goodsInfo.value.notesToBuy)
    goPage('/pagesB/other/question?type=product')
}
const toCollection = () => {
    if (!(user && user.memberId)) {
        toLogin()
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
    if (isAjax.value) {
        return false;
    }
    isAjax.value = true;
    api
        .addGoodsCollection({
            goodsId: id.value,
            goodsName: goodsInfo.value.name,
            hotelCode: config.hotelCode,
            hotelGroupCode: config.hotelGroupCode,
            memberId: user.memberId,
            picture: goodsInfo.value.logo,
            productType: 'shop',
            price: goodsInfo.value.price,
            subGoodsName: goodsInfo.value.secondTitle,
        })
        .then((res: any) => {

            if (res.result == 1) {
                jAlert3("收藏成功");
                getGoodsIsCollection();
            } else {
                jAlert3(res.msg);
            }
        });
};
const deleteGoodsCollection = () => {
    if (isAjax.value) {
        return false;
    }
    isAjax.value = true;
    api.deleteGoodsCollection([ids.value]).then((res: any) => {
        isAjax.value = false;
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
            goodsId: id.value,
            hotelGroupCode: config.hotelGroupCode,
            hotelCode: config.hotelCode,
            memberId: user.memberId,
        })
        .then((res: any) => {
            isAjax.value = false;
            if (res.result == 1 && res.retVal && res.retVal.length > 0) {
                isCollect.value = true;
                ids.value = res.retVal[0].id;
            }
        });
};
const showDetail = (item: any) => {
    travelType.value = item.travelType
    travelTitle.value = item.title
    travel.value.showDialog()
}
const chooseSku = (item: any) => {
    console.log(item)
    curSku.value = item
    if (item.peopleNum) {
        goodsInfo.value.extraConfig.peopleNum = item.peopleNum
    }
	if (goodsInfo.value.vrType == 'pack') {
		couponCodeUseConfigProductDtoList.value = item.couponPackageDetailList

	} else {
		couponCodeUseConfigProductDtoList.value = [{
			couponCodeUseConfigProductDtoList: []
		}]
		couponCodeUseConfigProductDtoList.value[0].couponCodeUseConfigProductDtoList = item.couponCodeUseConfigProductDtoList

	}
	if (couponCodeUseConfigProductDtoList.value.length > 0) {
		couponCodeUseConfigProductDtoList.value.forEach((products: any) => {
			travelProductList(products)
		})
	}
   

}
const switchTab = (val: any) => {

    const query1 = uni.createSelectorQuery()
    const query = uni.createSelectorQuery()
    const topList: any[] = []
    stop.value = false
    query1.selectAll('.topContent').boundingClientRect()
    query.selectAll('.contentHight').boundingClientRect()
    query1.exec((res) => {
        var top = res[0][0].height + 15
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
// const queryMarketingProducts = () => {
// 	var products:any = []
// 	couponCodeUseConfigProductDtoList.value.forEach((product : any) => {
// 		var goods ={
// 		productId:product.productCode,
// 		type:product.orderType
// 		}
// 		products.push(goods)
// 	})
// 	api.queryMarketingProducts({
// 		hotelGroupCode: config.hotelGroupCode,
// 		hotelCode: config.hotelCode,
// 		products: products
// 	}).then((res : any) => {

// 	})
// }
const travelProductList = (list: any) => {
    productDtoList.value = []
    let travelGroupCodes: any = []
	let travelTypes:any= []
	let itineraryCodes:any= []
    let categorySubs:any= []
    var opt: any = {
        "unitCode": config.hotelGroupCode,
        "hotelGroupCode": config.hotelGroupCode
    }
  
    list.couponCodeUseConfigProductDtoList.forEach((item: any) => {
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
				list.productDtoList = productList
  
					
            }

        });

}

const getGoodsDetail = () => {
    let opt = {
        hotelGroupCode: config.hotelGroupCode,
        equipment: "desktop",
        goodsId: id.value,
        appid: config.appid,
        channel: shopChannel.value,
        memberId: "",
        openid: ""
    };
    if (wxuser && wxuser.openid) {
        opt.openid = wxuser.openid
    }
    if (user && user.memberId) {
        opt.memberId = user.memberId
    }
    api.goodsDetail(opt).then((res: any) => {
        goodsInfo.value = res.retVal
        goodsInfo.value.tags = goodsInfo.value.shopGoodsConfig.goodsCity.split(",")

        if (goodsInfo.value.extraConfig) {
            goodsInfo.value.extraConfig = JSON.parse(goodsInfo.value.extraConfig)
        }
        if (goodsInfo.value.vrType == 'pack') {
            couponCodeUseConfigProductDtoList.value = goodsInfo.value.couponPackageDetailList

        } else {
            couponCodeUseConfigProductDtoList.value = [{
                couponCodeUseConfigProductDtoList: []
            }]
            couponCodeUseConfigProductDtoList.value[0].couponCodeUseConfigProductDtoList = goodsInfo.value.couponCodeUseConfigProductDtoList

        }
        if (couponCodeUseConfigProductDtoList.value.length > 0) {
			 couponCodeUseConfigProductDtoList.value.forEach((products: any) => {
				travelProductList(products)
			})
        }
        if(goodsInfo.value.shopGoodsConfig.limitPayment){
            if(goodsInfo.value.shopGoodsConfig.limitPayment.indexOf('11')==-1){
                isCredit.value = 'F'
                 goodsInfo.value.credit = 0
            }
        }
        let price = goodsInfo.value.price
        goodsInfo.value.price = goodsInfo.value.cashPrice
        goodsInfo.value.creditPrice = price
        goodsInfo.value.diyDetail = JSON.parse(goodsInfo.value.shopGoodsConfig.diyDetail)
        goodsInfo.value.notesToBuy = JSON.parse(goodsInfo.value.shopGoodsConfig.notesToBuy)
        let picList = res.retVal.pictureUrl.split(",").filter((item: any) => item);
        picList.forEach((item: any) => {
            let slide = {
                imgUrl: item
            }
            slides.push(slide)
        })
        UmengSDK.sendPV({
            page_id: "",
            page_name: "coupon_detail_pg",
            price: goodsInfo.value.price,
            coupon_name: goodsInfo.value.name,
            coupon_type: "",
            coupon_id: id.value

        });
        api.goodsSku({
            hotelGroupCode: config.hotelGroupCode,
            goodsId: id.value
        }).then((res2: any) => {
            if (res2.retVal.stock.length > 0) {
                // res2.retVal.skuItem[0].itemValue.forEach((skuItem:any) => {
                // 	res2.retVal.stock.forEach((item:any) => {
                // 		if (skuItem.itemValueId == item.sku[0].itemValueId) {
                // 		skuList.value.push(item)
                // 		}
                // 	})
                // })

                skuList.value = res2.retVal.stock
                skuList.value.forEach((item: any) => {
                    let price = item.price
                    item.price = item.cashPrice
                    item.creditPrice = price
                    if (item.extraConfig) {
                        item.peopleNum = JSON.parse(item.extraConfig).peopleNum
                    }
                    if (item.stock > 0 && !curSku.value.skuId) {
                        curSku.value = item
                        if (item.peopleNum) {
                            goodsInfo.value.extraConfig.peopleNum = item.peopleNum
                        }
						 if (goodsInfo.value.vrType == 'pack') {
							couponCodeUseConfigProductDtoList.value = item.couponPackageDetailList

						} else {
							couponCodeUseConfigProductDtoList.value = [{
								couponCodeUseConfigProductDtoList: []
							}]
							couponCodeUseConfigProductDtoList.value[0].couponCodeUseConfigProductDtoList = item.couponCodeUseConfigProductDtoList

						}
						if (couponCodeUseConfigProductDtoList.value.length > 0) {
							couponCodeUseConfigProductDtoList.value.forEach((products: any) => {
								travelProductList(products)
							})
						}
                     
                    }
                })

            }
            // queryMarketingProducts()

        })
    })
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
                    dayjs(vrStartDate).format("YYYY年MM月DD日") +
                    "-" +
                    dayjs(vrEndDate).format("YYYY年MM月DD日");
            }
        }
    } else if (vrDateType == "2") {
        if (vrBeginDay == 0) {
            goodsTime = "有效期至" + dayjs(vrEndDate).format("YYYY年MM月DD日");
        } else {
            goodsTime = "购买后第" + vrBeginDay + "天生效，有效期至" + dayjs(vrEndDate).format("YYYY年MM月DD日");
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
const confirmOrder = () => {
    if (!user || !user.memberId) {
        toLogin()
        return;
    }
    

    let travelInfo: any = {
        goodsId: goodsInfo.value.id,
        logoUrl: goodsInfo.value.logo,
        vrType: goodsInfo.value.vrType,
        goodsName: goodsInfo.value.name,
        price: goodsInfo.value.price,
        goodsType: goodsInfo.value.goodsType,
        stock: goodsInfo.value.stock,
        hotelName: goodsInfo.value.hotelName,
        number: 1,
        credit: goodsInfo.value.credit,
        creditPrice: goodsInfo.value.creditPrice,
        minLimit: goodsInfo.value.minLimit,
        hotelCode: goodsInfo.value.hotelCode,
        useTime: getDateTime(goodsInfo.value.vrDateType, goodsInfo.value.vrStartDate, goodsInfo.value.vrEndDate, goodsInfo.value.vrBeginDay, goodsInfo.value.vrValidDays)

    }

    if (curSku.value.skuId) {
        let skuInfo = [{
            stock: curSku.value.stock,
            price: curSku.value.price,
            credit: curSku.value.credit,
            creditPrice: curSku.value.creditPrice,
            sku: JSON.stringify([{
                itemId: curSku.value.sku[0].itemId,
                itemName: curSku.value.sku[0].itemName,
                itemValue: curSku.value.sku[0].itemValue,
                itemValueId: curSku.value.sku[0].itemValueId
            }])
        }]
        travelInfo.logoUrl = curSku.value.skuPicture
        travelInfo.skuId = curSku.value.skuId
        travelInfo.price = curSku.value.price
        travelInfo.credit = curSku.value.credit
        travelInfo.creditPrice = curSku.value.creditPrice
        travelInfo.skuInfo = skuInfo
        travelInfo.stock = curSku.value.stock
        travelInfo.useTime = getDateTime(curSku.value.vrDateType, curSku.value.vrStartDate, curSku.value.vrEndDate, curSku.value.vrBeginDay, curSku.value.vrValidDays)

    }
    if (travelInfo.stock <= 0 || travelInfo.stock < goodsInfo.value.minLimit) {
        jAlert3("库存不足")
        return;
    }
    if (goodsInfo.value.extraConfig.peopleNum) {
        travelInfo.peopleNum = goodsInfo.value.extraConfig.peopleNum
    }
    if(isCredit.value=='F'){
       travelInfo.credit = 0
            
    }
    UmengSDK.sendEvent("trdp_button_clk", {
        page_id: "",
        page_name: "cdp_book_clk",
        price: goodsInfo.value.price,
        coupon_name: goodsInfo.value.name,
        coupon_type: "",
        coupon_id: id.value
    });

    setStorage('travelInfo', travelInfo)
    goPage(`/pagesB/travel/confirmOrder?productType=shop&sourceActivityId=${sourceActivityId.value}&sourceActivityName=${sourceActivityName.value}`)
}
const priceTips = () => {

    uni.showModal({

        content: '此价格为多人拼团，2人共享一个房间，单人的价格。',
        showCancel: false,
        confirmText: '我知道了',
        confirmColor: "#000000"

    })

}
const showKf = () => {
    kf.value.showDialog();
}
const showPackage = () => {
    packageBox.value.showDialog();
};
let couponCodeUseConfigProductDtoListNew = computed(() => {
	const couponCodeUseConfigProductDtoListNew:any = []
	couponCodeUseConfigProductDtoList.value.forEach((item:any)=>{
		if(item.productDtoList&&item.productDtoList.length>0){
			couponCodeUseConfigProductDtoListNew.push(item)
		}
	})
	return couponCodeUseConfigProductDtoListNew;
})
let menuPos = computed(() => {
    const menuButton = wx.getMenuButtonBoundingClientRect();

    return `right:${menuButton.right - menuButton.left + 15}px;`
})
onLoad((options: any) => {
    if (options.sourceActivityId) {
        sourceActivityId.value = options.sourceActivityId;
    }
    if (options.sourceActivityName) {
        sourceActivityName.value = decodeURIComponent(options.sourceActivityName);
    }
    id.value = options.id
})
onMounted(() => {
    getGoodsIsCollection()
    getGoodsDetail()

    uni.getSystemInfo({
        success: (res: any) => {
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

    .coustom-head {
        position: relative;
        z-index: 5;
    }

    .share-icon {
        position: absolute;
        right: 0;

        .iconfont {
            font-size: 20px;
        }
    }

    .canvas-ninja {
        width: 375px; // 350px
        height: 677px; // 570px， 图片350 + 120
        position: fixed;
        top: 0;
        left: 50%;
        transform: translatex(-50%);
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

            .icon-a-20_shoucang_weishoucang,
            .icon-a-20_shoucang_yishoucang {
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
                background: rgba(51, 103, 53, 0.9);
                border-radius: 4px;
                height: 20px;
                line-height: 20px;
                font-size: 12px;
                color: #fff;
                padding: 0 4px;
                margin: 5px 8px 5px 0;
                vertical-align: top;

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
            margin-top: 4px;

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
            margin: 12px 16px 0;
            background: #FFFFFF;
            border-radius: 8px;
            padding: 12px;
            font-size: 12px;

            .tl {
                display: flex;
                justify-content: space-between;
                font-size: 14px;
                font-weight: bold;
                height: 14px;
            }

            .desc {
                margin-top: 16px;
                font-size: 14px;
                color: #808080;

            }
        }

        .routes {
            margin-top: 24px;
            white-space: nowrap;
            overflow-x: auto;

            .route {
                margin-left: 8px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                background: #FFFFFF;
                border-radius: 8px;
                padding: 15px 14px;
                max-width: 42.67vw;

                &.active {
                    border: 1px solid #A43127;
                }

                .label {
                    font-weight: bold;
                    font-size: 14px;
                    line-height: 1;

                }

                .val {
                    margin-top: 4px;
                    font-size: 12px;
                    line-height: 1;
                    color: #000000;
                    opacity: 0.7;
                    line-height: 18px;
                    height: 36px;
                    overflow: hidden;
                    white-space: initial;
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

                .date {
                    margin-left: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    background: #FFFFFF;
                    border-radius: 8px;
                    padding: 16px 21px;

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

                .iconfont {
                    margin-bottom: 10px;
                }
            }
        }

    }

    .tabs-warp {
        margin-top: 28px;
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
            padding: 12px 0 14px;

            &.active {
                color: #000000;
                font-weight: bold;

                &::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
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
        .characteristic {
            margin-top: 24px;

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

                    border-radius: 8px;
                    background: #fff;
                    margin-left: 8px;

                    .characteristic-img {
                        width: 88.5444vw;
                        height: 66.675vw;
                        border-radius: 8px 8px 0px 0px;
                    }

                    .characteristic-info {
                        padding: 20px 12px;
                        box-sizing: border-box;
                    }

                    .characteristic-name {

                        font-size: 16px;
                        font-weight: bold;
                        line-height: 1;
                    }

                    .characteristic-desc {
                        margin-top: 8px;
                        color: #808080;
                        font-size: 14px;
                        line-height: 22px;
                    }

                    &:first-child {
                        margin-left: 16px;
                    }

                    &:last-child {
                        margin-right: 16px;
                    }
                }
            }
        }
    }

    .product-info-box {
		.coupon-product{
			margin-top: 16px;
			&:first-child{
				margin-top: 0;
			}
		}
        .exchange-list {
            padding: 12px 16px;

            .item {
                position: relative;
                background: #fff;
                margin-top: 12px;
                display: flex;
                padding: 12px;
                border-radius: 8px;

                .lab {
                    position: absolute;
                    top: 8px;
                    left: 8px;
                    padding: 4px;
                    border-radius: 4px;
                    background: rgba(0, 0, 0, 0.90);
                    font-size: 12px;
                    color: #fff;
                    line-height: 1;

                }

                .img-box {
                    position: relative;
                    width: 138px;
                    height: 104px;
                }

                .img {
                    width: 100%;
                    height: 100%;
                    border-radius: 4px;
                }

                .info {
                    margin-left: 12px;
                    flex: 1;

                    .name {
                        font-size: 16px;
                        line-height: 24px;
                        font-weight: bold;
                        color: #000000;
                    }

                    .second-title {
                        margin-top: 4px;
                        font-size: 12px;
                        line-height: 18px;
                        display: flex;
                        align-items: center;

                        .iconfont {
                            font-size: 12px;
                            margin-right: 4px;
                        }
                    }

                    .desc {
                        margin-top: 8px;
                        color: #808080;
                        line-height: 18px;
                        font-size: 12px;
                    }
                }
            }
        }

        .exchange-info {
            padding: 0 16px 12px;

            .exchange-info-item {
                margin-top: 8px;
                font-size: 14px;
                line-height: 22px;
                color: #808080;
                display: flex;

                .label {
                    width: 68px;
                    line-height: 22px;
                }

                .val {
                    line-height: 22px;
                    flex: 1;
                    color: #000;
                    width: calc(100% - 68px);

                    img,
                    image {
                        max-width: 100%;
                    }
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
                padding: 12px 40px;
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

    }

    .order-layer {
        display: none;
        position: fixed;
        bottom: 0;
        left: 0;
        height: 100vh;
        width: 100vw;

        .title {
            padding: 16px 16px 0;
            color: #000000;
            font-size: 18px;
            font-weight: bold;
            line-height: 1;
        }

        .order-box {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            border-radius: 16px 16px 0 0;
            background: #F8F8F8;
            z-index: 2;
            height: calc(100% - 70px);
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
                display: flex;
                padding-bottom: 8px;
                flex-wrap: nowrap;
                overflow-x: auto;

                .route {
                    margin-left: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    background: #FFFFFF;
                    border-radius: 8px;
                    padding: 16px 21px;
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
                        font-size: 14px;
                        line-height: 1;
                    }

                    .val {
                        margin-top: 8px;
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
                border-top: 0.5px solid #EEEEEE;
                padding: 12px 16px;
                background: #fff;

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
        position: fixed;
        bottom: 0;
        left: 0;
        height: 100vh;
        width: 100vw;
        display: none;

        .number-box {

            position: absolute;
            bottom: 0;
            left: 0;
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
                        color: #000000;
                        font-size: 14px;
                    }

                    .val {
                        display: flex;
                        align-items: center;

                        .num {
                            padding: 0 16px;
                            font-size: 16px;
                        }

                        .iconfont {
                            font-size: 20px;

                            &.unable {
                                color: #CCCCCC;
                            }
                        }
                    }
                }

                .num-sku {
                    padding-top: 4px;
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
                    align-items: center;
                    display: flex;
                    margin-top: 12px;
                    color: #808080;
                    font-size: 12px;
                    line-height: 1;

                    .customer {
                        color: #000;

                        display: flex;
                        align-items: center;
                        font-size: 12px;
                        height: 12px;
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

    .package {
        .travel-dates {
            padding: 12px 16px 0;
        }

        .travel-date {
            margin-top: 12px;
            padding: 16px 0;
            display: flex;
            background: #fff;
            border-radius: 8px;
            align-items: center;

            .travel-date-lf {
                position: relative;
                padding: 0 12px;

                &::after {
                    content: '';
                    position: absolute;
                    width: 1px;
                    top: 0;
                    bottom: 0;
                    right: 0;
                    transform: scaleX(0.5);
                    background: #eee;
                }

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
                    padding-right: 16px;
                    font-family: 'Source Han Serif CN';
                    font-style: normal;
                    font-weight: 900;
                    font-size: 16px;
                    line-height: 1;

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

    }

}
</style>
