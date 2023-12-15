<template>
  <!-- #ifdef MP -->
  <coustom-head
    title="松赞旅行"
    bgColor="#fff"
    v-if="scrollTop > 40"
  ></coustom-head>
  <!-- #endif -->
<div class="scenery_ui">
    <div class="swiper-box">
        <swiper-box :slides="header" :swiperConfig="swiperConfig"></swiper-box>
    </div>
    <div class="nav-warp" v-if="mode.length>0">
        <div class="nav-list">
            <div class="nav" v-for="(item,i) in mode" :key="i" @click="toNav(item)">
                <img class="img" :src="item.imgUrl">
                <div class="txt">{{item.title}}</div>
            </div>

        </div>
    </div>
    <div class="notice">
        <notice ref="noticeRef" showLocation="2"></notice>
    </div>
    <template v-if="slides.left||slides.right">
        <div class="title-main">活动专区</div>
        <div class="ad-banner">
            <div class="ad-swiper" v-if="slides.left&&slides.left.length>0">
                <swiper-box :slides="slides.left" :swiperConfig="adSwiperConfig"></swiper-box>
            </div>
            <div class="ad-banner-rt" v-if="slides.right&&slides.right.length>0">
                <div class="ad-banner-img" v-for="(item,i) in slides.right" :key="i" @click="toPage(item.link)">
                    <img class="img" :src="item.imgUrl" mode="aspectFill">
                    <div class="info" v-if="item.title||item.subTitle">
                        <div class="title" v-if="item.title">
                            {{item.title}}
                        </div>
                        <div class="subTitle" v-if="item.subTitle">
                            {{item.subTitle}}<i class="iconfont icon-a-12_youlajiantou_hei"></i>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </template>

    <div class="tabs" id="tabs">
        <div class="tabs_inner" v-if="fixed">
            <div v-if="typeList.length > 0" style="height: 40px"></div>
    
        </div>
        <div class="tabs_warp" :class="{ fixed: fixed }" :style="{ top: menuHeight + 'px' }">
            <tabs :datas="typeList" type="line" color="#A43127" titleInactiveColor="#808080" titleActiveColor="#000000" v-if="typeList.length > 0" flexNum="F" @clickTab="chooseType" :isAjax="isAjax">
            </tabs>
         </div>
    </div>
    <div class="product-list" >
        <div class="product-item" v-for="(item,i) in filterProduct" :key="i" @click="toGoods(item)">
            <div class="product-img">
                <img class="img" :src="item.defaultImageUrl" mode="aspectFill">

            </div>
            <div class="product-info">
                <div class="product-name">
                    {{item.title}}
                </div>
                <!-- <div class="product-desc">
                    月销榜 第一名
                </div> -->
				<div class="subTitle" v-if="item.subTitle">{{item.subTitle}}</div>
                <div class="product-bt">
                    <div class="product-price">¥{{item.goodsPrice.minSalePrice}}</div>
                    <div class="product-btn baseBtn red" v-if="soldType=='2'">预购</div>
                    <div class="product-btn baseBtn" v-else>购买</div>
                </div>
            </div>

        </div>

    </div>
    <empty tips="暂无商品" v-if="goodsNum==0"></empty>
    <div class="footer-ad" v-if="footer.imgUrl" @click="toPage(footer.link)">
        <image :src="footer.imgUrl" class="footer-img" mode="aspectFill"></image>
        <div class="info">
            <div class="desc">{{footer.desc}}</div>
            <div class="product-btn baseBtn" v-if="footer.btDesc">
                {{footer.btDesc}}
            </div>
            <div class="phoneNumber" v-if="footer.phoneNumber">
                <i class="iconfont icon-a-12_dianhua"></i>
                {{footer.phoneNumber}}
            </div>
        </div>
    </div>
    <bottom-nav></bottom-nav>
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
import api from "@/utils/api";
import {
    getStorage
} from '@/utils/wxuser'
import {
    jAlert3
} from "@/base/jAlert/jAlert";
import notice from "@/components/notice.vue";
import UmengSDK from "@/utils/umengAdaptor.js";
import swiperBox from "@/components/swiperBox.vue";
import tabs from "@/components/tabs.vue";
import productGroup from "@/components/productGroup.vue";
import defaultChannel from "@/utils/defaultChannel";
import bottomNav from "@/components/bottomNav.vue";
import coustomHead from "@/components/coustomHead.vue";
import empty from "@/components/empty.vue";
import useScroll from "@/hooks/useScroll";
const { scrollTop, onPageScroll } = useScroll();
import { onShow,onPullDownRefresh } from "@dcloudio/uni-app";
import {
    goPage
} from "@/utils/utils";
let config = getStorage("config");
let channel = ref(defaultChannel);
let isAjax = ref(false);
let goodsNum = ref(-1);
let adSwiperConfig = reactive({
    indicatorDots: false,
    autoplay: true,
    circular: true,
    dotPosStyle: "left: 50%;transform: translateX(-50%);bottom:8px;"
});
let swiperConfig = reactive({
    indicatorDots: false,
    autoplay: true,
    circular: true,
    dotPosStyle: "right:24px;bottom:48px;left:auto;"
});
let curType:any = ref({})
let slides = reactive({});
let typeList: any = ref([]);
let productList: any = ref([]);
const header: any = ref([]);
const footer = ref({});
const mode = ref([]);
const fixed = ref(false);
let menuHeight = ref(0);
const navHeight = ref(0);
let noticeRef = ref()
let init = ref(true)
onPageScroll((e) => {
  scrollTop.value = e.scrollTop;
  const query = uni.createSelectorQuery();
  query.selectAll(".tabs").boundingClientRect();
  query.exec((res) => {
    if (res[0][0].top < navHeight.value + 44) {
      fixed.value = true;
    } else {
      fixed.value = false;
    }
  });
});
let filterProduct = computed(() => {
    let filterProduct: any = [];
    let recommendProduct: any = [];
    let recommendMap: any = {};
    
    if (curType.value.goodsIds&&curType.value.goodsIds.length > 0) {
		curType.value.goodsIds.forEach((n : any) => {
			recommendMap[n] = true;
		});
	}
	
    productList.value.forEach((m: any) => {
        if (recommendMap[m.goodsId]) {
            recommendProduct.push(m);
        } else {
            filterProduct.push(m);
        }
    })
    filterProduct = [...recommendProduct, ...filterProduct];
    if (curType.value.number) {
        filterProduct = filterProduct.slice(0, Number(curType.value.number));
    }
	console.log(filterProduct)
    return filterProduct;
});
const toPage = (url: any) => {
    if (!url) {
        return;
    }

    goPage(url)

}
const goTab = () => {
  var selector = "#tabs";
  uni.pageScrollTo({
    selector: selector,
    offsetTop: -84,
    complete: (res) => {},
  });
};
const chooseType = (val: any, index: number) => {
    init.value = false
	curType.value= val
    if (val[val.id]) {
        productList.value = val[val.id]
        goodsNum.value = productList.value.length
        goTab()
        return;
    }
    productList.value = []
    getGoodsList(val, 1)
    
    
};
const toGoods = (item: any) => {
    uni.navigateToMiniProgram({
        appId: 'wx5d94bb220d9d0234',
        path: `/ec_goods/detail?vid=0&productInstanceId=13545845204&id=${item.goodsId}`,
        success(res) {}
    })
}
const getGoodsList = (item: any, pageNum: number) => {
    goodsNum.value = -1
    api.weimoInterfaceTransfer({
        "config": {
            "path": "/weimob_shop/v2.0/goods/getList",
            "requestMethod": "POST",
            "hotelGroupCode": "SONGTSAM-CS",
            "hotelCode": "0"
        },
        "params": {
            "pageNum": pageNum,
            "pageSize": 20,
            "queryParameter": {
                classifyId: item.id
            },
            "basicInfo": {
                "vid": 6016489682204
            }
        }
    }).then((res: any) => {
        if (res.result == 0) {
            let maxNum = 0
            res.retVal.pageList.forEach((item: any) => {
                productList.value.push(item)
            })
            if (res.retVal.totalCount <= item.number) {
                maxNum = res.retVal.totalCount
            } else {
                maxNum = item.number
            }
            if (productList.value.length < maxNum) {
                getGoodsList(item, pageNum + 1)
            }
            item[item.id] = productList.value
        } else {
            jAlert3(res.msg)
        }
      
        goodsNum.value = productList.value.length
        if(!init.value){
            nextTick(()=>{
                goTab()
            })
            
        }

    })
}
const toNav = (item: any) => {
    UmengSDK.sendEvent("pcp_button_clk", {
        page_name: "product_channel_pg",
        button_id: item.link,
        button_name: item.title,

    });
    goPage(item.link)

}
const modePage = () => {
    api.modePage({
            hotelCode: config.hotelCode,
            hotelGroupCode: config.hotelGroupCode,
            clientTypes: channel.value,
            firstResult: 0,
            pageSize: 10,
            showLocation: '2'
        })
        .then((res: any) => {
            if (
                res.result == 0 &&
                res.retVal &&
                res.retVal.datas &&
                res.retVal.datas.length > 0
            ) {
                mode.value = JSON.parse(res.retVal.datas[0].infos);
                console.log(mode.value)
            }
        });
}

const marketingPage = () => {
    let opt = {
        hotelGroupCode: config.hotelGroupCode,
        firstResult: 0,
        pageSize: 15,
        clientTypes: channel.value,
        // showLocation: '2'
    }

    api.marketingPage(opt).then((res: any) => {
        if (res.result == 0) {
            typeList.value = []
            productList.value = []
            init.value = true
            if (res.retVal && res.retVal.datas && res.retVal.datas.length > 0) {
                res.retVal.datas.forEach((item: any) => {
                    if (item.showLocation == '3') {
                        let infos = JSON.parse(item.infos)
                        console.log(infos)
                        if (infos && infos.length > 0) {

                            infos.forEach((info: any) => {
                                typeList.value.push({
                                    name: info.typeName,
                                    id: info.type[info.type.length-1],
                                    goodsIds: info.goodsIds,
                                    number: info.number
                                })
                            })
                        }
                    }

                })
                
                if (typeList.value.length > 0) {
                    if(curType.value.id){
                        getGoodsList(curType.value, 1)
                    }else{
                        getGoodsList(typeList.value[0], 1)
                    }
                    
                }
            }
            uni.stopPullDownRefresh()
        } else {
            jAlert3(res.msg, 2000)
        }
    })
}
const advertisementPage = () => {
    api
        .advertisementPage({
            hotelCode: config.hotelCode,
            hotelGroupCode: config.hotelGroupCode,
            clientTypes: channel.value,
            firstResult: 0,
            pageSize: 20,
        })
        .then((res: any) => {
            if (
                res.result == 0 &&
                res.retVal &&
                res.retVal.datas &&
                res.retVal.datas.length > 0
            ) {
                res.retVal.datas.forEach((item: any) => {
                    if (item.showLocation == '10') {
                        let info = JSON.parse(item.infos)

                        header.value = info

                    }
                    if (item.showLocation == '9') {
                        footer.value = JSON.parse(item.infos);

                    }
                    if (item.showLocation == '8') {

                        slides = JSON.parse(item.infos)

                    }
                })

            }
        });
};
onPullDownRefresh(()=>{
    marketingPage()
    advertisementPage()
    modePage()
})
onShow(()=>{
  noticeRef.value.updateData()
  
})
onMounted(() => {
    uni.getSystemInfo({
    success: (res) => {
      navHeight.value = res.statusBarHeight || 0;
      menuHeight.value = navHeight.value;
      // #ifdef MP
      menuHeight.value = navHeight.value + 40;
      //  #endif
    },
    fail(err) {
      console.log(err);
    },
  });
    marketingPage()
    advertisementPage()
    modePage()
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");

.scenery_ui {
    background: #f8f8f8;
    padding-bottom: 80px;

    .swiper-box {
        position: relative;
        width: 100%;
        height: 320px;
    }

    .nav-warp {
        position: relative;
        z-index: 9;
        margin: -40px 16px 0;
        background: #FFFFFF;
        border-radius: 8px;

        .nav-list {
            display: flex;
            justify-content: center;
            padding: 24px 8px;

            .nav {

                width: 20%;
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .img {
                width: 24px;
                height: 24px;
            }

            .txt {
                color: #004355;
                font-weight: 600;
                font-size: 12px;
                line-height: 1;
                margin-top: 8px;
            }
        }
    }

    .title-main {
        padding: 16px 16px 0;
        font-style: normal;
        font-weight: bold;
    }

    .ad-banner {
        display: flex;
        justify-content: space-between;
        margin: 6.408vw 4.272vw 0;

        .ad-swiper {
            position: relative;
            width: 44.8vw;
            height: 55.536vw;
            border-radius: 8px;
            overflow: hidden;

        }

        .ad-banner-rt {

            .ad-banner-img {
                position: relative;

                .img {
                    display: block;
                    width: 44.8vw;
                    height: 26.7vw;
                    border-radius: 8px;
                }

                .info {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    border-radius: 8px;
                    bottom: 0;
                    padding: 30px 12px 0;
                    color: #fff;
                    background: rgba(0, 0, 0, 0.12);
                }

                .title {
                    font-family: Source Han Serif CN;
                    font-weight: 900;
                    font-size: 18px;
                    line-height: 1;
                }

                .subTitle {
                    margin-top: 8px;
                    font-size: 14px;
                    line-height: 1;

                    .iconfont {
                        color: #fff;
                        font-size: 12px;
                        line-height: 14px;
                        vertical-align: top;
                        display: inline-block;

                    }
                }

                &:last-child {
                    margin-top: 2.136vw;
                }
            }

        }

    }

    .tabs {
        margin-top: 10px;
         .tabs_warp {
            width: 100%;

            &.fixed {
                z-index: 9;
                background: #fff;
                position: fixed;
                padding-bottom: 10px;
            }
        }
        /deep/.tabs_ui{
            .tabs .tab{
                font-size: 16px;
            }
            .tabs_line{
                bottom: 7px;
            }
        }
        
    }

    .product-list {
        display: flex;
        flex-wrap: wrap;
        padding: 0 32rpx;
        justify-content: space-between;
        width: 100%;

        .product-item {
            margin-top: 12px;
            width: 44.3vw;
            border-radius: 8px;
            overflow: hidden;
            background: #fff;

            .product-img {
                width: 100%;
                height: 44.3vw;

                .img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .product-info {
                padding:8px 12px;

                .product-name {
                    font-family: PingFangSC-Medium;
                    font-size: 16px;
                    color: #000000;
                    font-weight: bold;
                    line-height: 24px;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					word-break: break-all;
					-webkit-line-clamp: 2;
					overflow: hidden;
					
                }

                .product-desc {
                    margin-top: 4px;
                    padding: 4px;
                    font-size: 12px;
                    color: #A43127;
                    background: rgba(164, 49, 39, 0.12);
                    border-radius: 4px;
                    display: inline-block;
                }
				.subTitle{
					margin-top: 4px;
                    padding: 4px;
                    font-size: 12px;
					color: #808080;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					word-break: break-all;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
                .product-bt {
                    margin-top: 12px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .product-price {
                        font-family: PingFangSC-Semibold;
                        font-size: 16px;
                        color: #000000;
                        font-weight: bold;
                    }

                    .product-btn {
                        padding: 8px 12px;
                        font-size: 14px;
                        color: #FFFFFF;
                        background-color: #000;
                        border-radius: 4px;

                        &.red {
                            background-color: #A43127;
                        }
                    }
                }
            }

        }

    }

    .footer-ad {
        position: relative;
        margin-top: 32px;

        .footer-img {
            width: 100%;
            height: 282px;
        }

        .info {
            display: flex;
            flex-direction: column;
            position: absolute;
            right: 22px;
            bottom: 37px;
            align-items: center;

            .desc {
                max-width: 6.6em;
                font-size: 20px;
                font-family: Source Han Serif CN;
                color: #fff;
                font-style: normal;
                font-weight: 700;
                line-height: 28px;
            }

            .product-btn {

                margin-top: 12px;
                display: flex;
                padding: 0 16px;
                height: 38px;
                font-size: 14px;
                line-height: 38px;
                font-weight: 500;
            }

            .phoneNumber {
                display: flex;
                align-items: center;
                font-size: 12px;
                font-family: PingFang SC;
                font-style: normal;
                font-weight: 500;
                color: #fff;
                margin-top: 32px;

                .iconfont {
                    font-size: 12px;
                    font-weight: normal;
                    margin-right: 4px;
					color: #fff;
                }
            }
        }
    }
}
</style>
