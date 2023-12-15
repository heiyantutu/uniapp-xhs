<template>
<div class="tripDetail_ui">
    <!-- #ifdef MP -->
    <coustom-head :color="scrollTop>50?'#000':'#fff'"  :bgColor="scrollTop>50?'#fff':''"></coustom-head>
    <!-- #endif -->
    <div class="header">

        <div class="welcome">欢迎来到</div>
        <div class="name">{{teamOrder.productDesc}}</div>
        <div class="time">{{teamOrder.tripTime}}</div>
        <img class="bg" :src="reserveOrder.productUrl" mode="aspectFill">
    </div>
    <div class="nav-warp" v-if="teamItineraries&&teamItineraries[0]&&teamOrder.tripSta!='5'">
        <trip-nav ref="tripNavRef" page="detail" :dayEndDiff="teamOrder.dayEndDiff" :dayDiff="teamOrder.dayDiff" :orderNo="reserveOrder.orderNo" :teamOrder="teamOrder" :teamNo="teamItineraries[0].teamNo" @finish="finish()"></trip-nav>
    </div>
    <img src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/skeleton/travel.jpg" alt="" v-if="!isLoad" class="loadingImg" mode="widthFix" />
    <template v-else>
        <div class="title" @click="toMoreHotel()" v-if="hotelList.length>0">
            行程酒店<i class="iconfont icon-a-16_youlajiantou_hei"></i>
        </div>
        <div class="room-box" v-if="hotelList.length>0">
            <swiper-box :slides="hotelList" :swiperConfig="swiperConfig">
                <template v-slot:item="{ item }">
                    <div class="room-item">
                        <div class="room" @click="toHotel(item)">
                            <div class="left-part">
                                <img class="img" :src="item.extraLogo+'?imageView2/1/w/214/h/160&x-oss-process=image/resize,m_fill,w_214,h_160'" >
                            </div>
                            <div class="right-part">
                                <div class="info">
                                    <div class="time">{{item.arrDateF}}入住 - {{item.depDateF}}退房</div>
                                    <div class="name">{{item.hotelDesc}}</div>
                                    <div class="desc">{{item.rmtypeDesc}}</div>
                                </div>
                                <i class="iconfont icon-a-28_dianhua" @click.stop="makePhoneCall(item.phone)"></i>
                            </div>
                        </div>
                    </div>
                </template>

            </swiper-box>
        </div>
        <div class="title"  id="trip-detail">
            每日行程
        </div>
        <div class="routes-list" v-if="teamItineraries.length>0">
            <!-- <div class="all" :class="{'active':!curTeamItinerarie.id}" @click="chooseTeamItinerarie({})">

总览

</div> -->
            <div class="routes">
                <div class="route all-route" :class="{'active':!curTeamItinerarie.id}" @click="chooseTeamItinerarie({})">
                    <div class="all-txt">
                        总览
                    </div>

                </div>
                <div class="route" v-for="(item,i) in teamItineraries" :key="i" :class="{'active':curTeamItinerarie.id==item.id}" @click="chooseTeamItinerarie(item)">
                    <div class="label">{{item.bizDateF}}</div>
                    <div class="val"><template v-if="i==0">各地 - </template>{{item.destinationDesc}}<template v-if="i!=0&&i==teamItineraries.length-1"> - 各地</template></div>
                </div>

            </div>
        </div>
        <div class="journey-form" v-if="shuttleInfoJ.length<=0&&teamOrder.orderSta!='O'">
            <div class="journey-hd">
                <i class="iconfont icon-a-20_jiesonganpai"></i>
                抵达接站安排
            </div>
            <div class="info">
                <div class="info-lf">
                    本行程包含接送服务，请尽快录入航班/列车信息
                </div>
                <div class="btn baseBtn" @click="goTakeInfo('J')">填接送信息</div>
            </div>
        </div>
        <template v-else v-for="(item,i) in shuttleInfoJ" :key="i">
            <div class="pick-up" v-if="item.isShuttle!='F'">
                <div class="pick-up-tl">
                    <i class="iconfont icon-a-20_jiesonganpai"></i>抵达接站安排<template v-if="shuttleInfoJ.length>1">{{i+1}}</template>
                </div>

                <div class="pick-up-info" v-if="item.carNo">
                    <div class="left-part">
                        <div class="pick-up-label">接送车辆</div>
                        <div class="pick-up-keynote">{{item.carNo}}</div>
                        <div class="pick-up-desc" v-if="item.carModelDesc">{{item.carModelDesc}}</div>
                    </div>
                    <div class="right-part">
                        <div class="pick-up-label">约定时间地点</div>
                        <div class="pick-up-keynote">{{item.beginDateF}}{{item.startTime}}</div>
                        <div class="pick-up-desc" v-if="item.station">{{item.station}}</div>
                    </div>

                </div>
                <div class="pick-up-info" v-else>
                    <div class="no-carNo">接送车辆及时间地点待安排</div>
                </div>
                <div class="pick-up-info-list">
                    <div class="pick-up-item">
                        <div class="pick-up-item-label">需接送人</div>
                        <div class="pick-up-item-val">
                            <div class="guest" v-for="(guest,j) in item.guests" :key="j">
                                {{guest.name}}
                            </div>
                        </div>
                    </div>
                    <div class="pick-up-item">
                        <div class="pick-up-item-label">抵达方式</div>
                        <div class="pick-up-item-val">{{item.trafficTypeDesc}} {{item.trips}}</div>
                    </div>
                    <div class="pick-up-item" v-if="item.driver||houseKeepInfo.code">
                        <div class="pick-up-item-label">联系人</div>
                        <div class="pick-up-item-val" v-if="houseKeepInfo.code">{{houseKeepInfo.name}} {{houseKeepInfo.mobile}} <i class="iconfont icon-a-12_fuzhi" @click="copy(houseKeepInfo.mobile)"></i>
                            <i class="iconfont icon-a-28_dianhua" @click="makePhoneCall(houseKeepInfo.mobile)"></i>
                        </div>
                        <div class="pick-up-item-val" v-else>{{item.driver}} {{item.driverPhone}} <i class="iconfont icon-a-12_fuzhi" @click="copy(item.driverPhone)"></i>
                            <i class="iconfont icon-a-28_dianhua" @click="makePhoneCall(item.driverPhone)"></i>
                        </div>
                    </div>

                </div>

            </div>
        </template>
        <div >
            <div class="tips"  v-if="shuttleInfoJ.length>0&&teamOrder.orderSta!='O'">
                <i class="iconfont icon-a-12_tishi"></i>如需修改接送信息，请联系您的顾问或管家。
            </div>
		</div>
        <div class="trip-date" v-if="!curTeamItinerarie.id" >

            <div class="trip-date-item" v-for="(item,i) in teamItineraries" :key="i" @click="chooseTeamItinerarie(item)">
                <div class="left-part">
                    <div class="left-part-box">
                        <div class="moon">
                            {{item.moon}}月
                        </div>
                        <div class="day">
                            {{item.days}}
                        </div>
                    </div>
                   
                </div>
                <div class="right-part">
                    <div class="head"><template v-if="i==0">各地 > </template><template v-else-if="teamItineraries[i-1]&&teamItineraries[i-1].destinationDesc&&teamItineraries[i-1].destinationDesc!=item.destinationDesc">{{teamItineraries[i-1].destinationDesc}} > </template>{{item.destinationDesc}}<template v-if="i!=0&&i==teamItineraries.length-1"> > 各地</template></div>
                    <div class="center" v-if="item.teamRsvSrcs&&item.teamRsvSrcs.length>0">入住{{item.teamRsvSrcs[0].hotelDesc}}</div>
                    <div class="footer">{{item.activesTl}}</div>
                </div>
            </div>

        </div>
        <div class="trip-detail"  v-else>

            <div class="trip-detail-item" v-for="(item,i) in curTeamItinerarie.actives" :key="i">

                <template v-for="(time,j) in activityTimeList" :key="j">
                    <div class="trip-detail-time" v-if="time.name == item.activityTimeDesc">
                        <i :class="'iconfont '+time.icon"></i>{{item.activityTimeDesc}}
                    </div>
                </template>
                <div class="trip-detail-info">
                    <i class="iconfont icon-a-20_hangchengleixing_jingdian"></i>
                    <div class="rt-part" @click="showAlbum(item)">
                        <div class="rt-part-info">
                            <div class="activeName">
                                {{item.activeName}}
                            </div>
                            <div class="activeTime">约 {{item.startTime}}</div>
                        </div>
						<div class="bg"></div>
                        <image class="active-img" :src="item.productUrl" mode="aspectFill"></image>
                    </div>

                </div>
            </div>
        </div>

        <div class="journey-form" v-if="shuttleInfoS.length<=0&&teamOrder.orderSta!='O'">
            <div class="journey-hd">
                <i class="iconfont icon-a-20_jiesonganpai"></i>
                返程送站安排
            </div>
            <div class="info">
                <div class="info-lf">
                    本行程包含接送服务，请尽快录入航班/列车信息
                </div>
                <div class="btn baseBtn" @click="goTakeInfo()">填接送信息</div>
            </div>
        </div>
        <template v-for="(item,i) in shuttleInfoS" :key="i" v-else>
            <div class="pick-up" v-if="item.isShuttle!='F'">
                <div class="pick-up-tl">
                    <i class="iconfont icon-a-20_jiesonganpai"></i>返程送站安排<template v-if="shuttleInfoS.length>1">{{i+1}}</template>
                </div>
                <div class="pick-up-info" v-if="item.carNo">
                    <div class="left-part">
                        <div class="pick-up-label">接送车辆</div>
                        <div class="pick-up-keynote">{{item.carNo}}</div>
                        <div class="pick-up-desc" v-if="item.carModelDesc">{{item.carModelDesc}}</div>
                    </div>
                    <div class="right-part">
                        <div class="pick-up-label">约定时间地点</div>
                        <div class="pick-up-keynote">{{item.beginDateF}}{{item.startTime}}</div>
                        <div class="pick-up-desc" v-if="item.station">{{item.station}}</div>
                    </div>

                </div>
                <div class="pick-up-info" v-else>
                    <div class="no-carNo">接送车辆及时间地点待安排</div>
                </div>
                <div class="pick-up-info-list">
                    <div class="pick-up-item">
                        <div class="pick-up-item-label">需接送人</div>
                        <div class="pick-up-item-val">
                            <div class="guest" v-for="(guest,j) in item.guests" :key="j">
                                {{guest.name}}
                            </div>
                        </div>
                    </div>
                    <div class="pick-up-item">
                        <div class="pick-up-item-label">抵达方式</div>
                        <div class="pick-up-item-val">{{item.trafficTypeDesc}} {{item.trips}}</div>
                    </div>
                    <div class="pick-up-item" v-if="item.driver||houseKeepInfo.code">
                        <div class="pick-up-item-label">联系人</div>
                        <div class="pick-up-item-val" v-if="houseKeepInfo.code">{{houseKeepInfo.name}} {{houseKeepInfo.mobile}} <i class="iconfont icon-a-12_fuzhi" @click="copy(houseKeepInfo.mobile)"></i>
                            <i class="iconfont icon-a-28_dianhua" @click="makePhoneCall(houseKeepInfo.mobile)"></i>
                        </div>
                        <div class="pick-up-item-val" v-else>{{item.driver}} {{item.driverPhone}} <i class="iconfont icon-a-12_fuzhi" @click="copy(item.driverPhone)"></i>
                            <i class="iconfont icon-a-28_dianhua" @click="makePhoneCall(item.driverPhone)"></i>
                        </div>
                    </div>
                </div>

            </div>
        </template>
        <div class="album" v-if="photos.length>0">
            <div class="album-head" @click="toAlbum()">
                <div class="album-tl">
                    松赞相册
                    <div class="iconfont icon-a-16_youlajiantou_hei"></div>
                </div>
                <div class="desc">
                    您可以将相册中的照片进行下载分享
                </div>
            </div>
            <div class="album-list">

                <img class="img" v-for="(item,index) in photos" :key="index" :src="item.photoUrl+'?imageView2/1/w/332/h/248&x-oss-process=image/resize,m_fill,w_332,h_248'" @click="previewImage(item.photoUrl,photos)">
            </div>
        </div>
    </template>
    <bottom-dialog ref="album" maxDialog=true titleBorder=true>
        <div class="albumDetail">
            <div class="album-title">
                {{curAlbum.activeName}}
            </div>
            <div class="moreText" v-if="curAlbum.activeDesc">
                <more-text :content="curAlbum.activeDesc"></more-text>
            </div>

            <div class="img-list">
                <div class="img-item" v-for="(item,index) in curAlbum.photos" :key="index">
                    <img :src="item.photoUrl" mode="aspectFill" class="album-item">
                </div>

            </div>
        </div>
    </bottom-dialog>
    <v-preview-image ref="previewImageBox" :urls="previewPhotos"></v-preview-image>
</div>
</template>

<script setup lang="ts">
import {
    ref,
    reactive,
    onMounted,
    nextTick
} from 'vue'
import swiperBox from "@/components/swiperBox.vue";
import tripNav from "@/components/tripNav.vue";
import UmengSDK from "@/utils/umengAdaptor.js";
import bottomDialog from "@/components/bottomDialog.vue";
import moreText from "@/components/moreText.vue";
import defaultChannel from "@/utils/defaultChannel";
import api from "@/utils/api";
import {
    getStorage,
    setStorage
} from '@/utils/wxuser';
import {
    jAlert3,
    jAlert5
} from "@/base/jAlert/jAlert";
import coustomHead from "@/components/coustomHead.vue";
import useScroll from "@/hooks/useScroll";
import vPreviewImage from "@/pagesD/components/v-previewImage.vue";
import {
    onLoad,
    onShow
} from "@dcloudio/uni-app";
import dayjs from "dayjs";

const {
    scrollTop,
    onPageScroll
} = useScroll();
import {
    getUrlParams,
    goPage,
    toLogin
} from '@/utils/utils';
let config = getStorage("config")
let user = getStorage("user")
let shuttleInfoJ: any = ref([])
let shuttleInfoS: any = ref([])
let teamNo = ref('')
let curAlbum: any = ref({})
let album = ref()
let currentHotel: any = ref({})
let hotelList: any = ref([])
let channel = ref(defaultChannel);
let previewImageBox = ref()
let previewPhotos = ref([])
let swiperConfig = reactive({
    indicatorDots: false,
    autoplay: false,
    slot: true,
    dotPosStyle: `bottom:0px;left:50%;transform: translate(-50%);background:rgba(204, 204, 204, 0.28);`,
    dotStyle: 'background:#000;',
    duration:300
});
let reserveOrder: any = ref({});
let travelDetail: any = reactive({});
let teamOrder: any = ref({})
let teamItineraries: any = ref([])
let curTeamItinerarie: any = ref({})
let guest: any = ref({})
let trafficTypeList: any = ref([])
let photos: any = ref([])
let houseKeepInfo: any = ref({}) //顾问信息
let activityAlbum: any = ref([]) //活动相册
let hotelAlbum: any = ref([]) //酒店相册
let headerData = ref({
    img: '',
    desc: ''
});
let tripNavRef = ref()
let isLoad = ref(false)

const activityTimeList = reactive([{
    name: '早上',
    icon: 'icon-a-12_zaoshang',
}, {
    name: '上午',
    icon: 'icon-a-12_shangwu',
}, {
    name: '中午',
    icon: 'icon-a-12_zhongwu',
}, {
    name: '下午',
    icon: 'icon-a-12_xiawu',
}, {
    name: '晚上',
    icon: 'icon-a-12_wanshang',
}])
const toPage = (url: any) => {
    uni.navigateTo({
        url: url
    })
}
onPageScroll((e) => {
    scrollTop.value = e.scrollTop;
})
const finish = () => {
    isLoad.value = true
}
const previewImage = (pic: string, pics: any) => {
    previewPhotos.value = []
    pics.forEach((item: any) => {
        previewPhotos.value.push(item.photoUrl)
    })
    nextTick(() => {
        previewImageBox.value.open(pic)
    })

}
const listCodeBase = (cb: any) => {
    api.interfaceTransfer({
            query: {
                "type": "Transportation",
                "unitCode": config.hotelGroupCode
            },
            config: {
                "interfaceType": "GET",
                "interfaceModule": "GC_INFOMATION_CENTER",
                "interfaceMethod": `api/codeBaseapi/listCodeBase`,
                "interfaceFrom": "GC",
                "hotelGroupCode": config.hotelGroupCode
            }
        })
        .then((res: any) => {
            if (res.result == 1 && res.retVal.result == 0) {
                trafficTypeList.value = res.retVal.retVal
                cb && cb()
            }
        })
}
const getTrafficType = (val: any) => {
    let desc = ''
    trafficTypeList.value.forEach((item: any) => {
        if (item.code == val) {
            desc = item.descript
        }
    })
    return desc

}
const toMoreHotel = () => {
    UmengSDK.sendEvent("tdp_travel_hotel_clk", {
        page_name: "travel_detail_pg",
        page_title_name: "行程详情",
        page_id: "",
        button_id: "more",
        button_name: "更多"
    });
    toPage('/pagesD/trip/tripHotel?teamNo=' + teamItineraries.value[0].teamNo)
}
const toHotel = (hotel: any) => {
    UmengSDK.sendEvent("tdp_travel_hotel_clk", {
        page_name: "travel_detail_pg",
        page_title_name: "行程详情",
        page_id: "",
        button_id: hotel.hotelCode,
        button_name: hotel.hotelDesc
    });
    uni.navigateTo({
        url: `/pagesD/trip/hotelInfo?hotelCode=${hotel.hotelCode}&arrDate=${hotel.arrDateF}&depDate=${hotel.depDateF}&rmtype=${hotel.rmtype}&rmtypeDesc=${hotel.rmtypeDesc}`
    })
}
const showAlbum = (item: any) => {
    curAlbum.value = item
    activePhotoByName(curAlbum.value.activeName)
    album.value.showDialog()
}
const activePhotoByName = (name: string) => {
    let categoryName = name

    api.interfaceTransfer({
            query: {
                "unitCode": config.hotelGroupCode,
                "categoryName": categoryName
            },
            config: {
                "interfaceType": "GET",
                "interfaceModule": "GC_UCBASE_URL",
                "interfaceMethod": "albumCategory/photoByName",
                "interfaceFrom": "GC",
                "hotelGroupCode": config.hotelGroupCode
            }
        })
        .then((res: any) => {
            if (res.result == 1 && res.retVal.result == 0) {
                curAlbum.value.photos = res.retVal.retVal

            } else {
                jAlert3(res.result.msg || res.msg)
            }
        });
}

const toAlbum = () => {
    UmengSDK.sendEvent("tdp_other_clk", {
        page_name: "travel_detail_pg",
        page_title_name: "行程详情",
        page_id: "",
        button_id: "album",
        button_name: "松赞相册",
        travel_day_type: ""
    });
    setStorage('teamInfo', {
        guestId: guest.value.id,
        guestName: guest.value.name,
        teamNo: teamOrder.value.teamNo,
        teamName: teamOrder.value.teamName,
        teamBeginTime: teamOrder.value.beginDate,
        teamEndTime: teamOrder.value.endDate
    })
    goPage(`/pagesD/trip/album?guestId=${guest.value.id}&teamNo=${teamOrder.value.teamNo}`)
}
const goTakeInfo = () => {
    UmengSDK.sendEvent("tdp_other_clk", {
        page_name: "travel_detail_pg",
        page_title_name: "行程详情",
        page_id: "",
        button_id: "takeInfo",
        button_name: "填写接送信息",
        travel_day_type: ""
    });
    uni.navigateTo({
        url: "/pagesD/trip/takeInfo?orderNo=" + reserveOrder.value.orderNo + '&teamNo=' + teamOrder.value.teamNo + '&memberNo=' + reserveOrder.value.memberNo + '&mobile='+ reserveOrder.value.mobile 
    })
}
const makePhoneCall = (phone: string) => {
    uni.makePhoneCall({
        phoneNumber: phone

    });
}
const copy = (val: string) => {
    uni.setClipboardData({
        data: val,
        success: function () {
            jAlert3("复制成功")
        }
    });
}

const chooseTeamItinerarie = (item: any) => {
    UmengSDK.sendEvent("tdp_other_clk", {
        page_name: "travel_detail_pg",
        page_title_name: "行程详情",
        page_id: "",
        button_id: "",
        button_name: item.bizDateF || '总览',
        travel_day_type: item.bizDateF || '总览'
    });
    curTeamItinerarie.value = item

    photoByName(() => {
		if(curTeamItinerarie.value.itineraryCode){
			nextTick(() => {
			setTimeout(() => {
                var selector = '#trip-detail'
                uni.pageScrollTo({
                    selector: selector,
                    offsetTop: -100,
                    complete: (res) => {

                    }
                })
            }, 100);
           
        })
		}
		
  	
       

    })
}
const listByOrderNo = () => {
    api.interfaceTransfer({
            query: {
                "orderNo": reserveOrder.value.orderNo,
                "unitCode": config.hotelGroupCode
            },
            config: {
                "interfaceType": "GET",
                "interfaceModule": "GC_TRAVEL_ORDER",
                "interfaceMethod": `/api/shuttle/listByOrderNo`,
                "interfaceFrom": "GC",
                "hotelGroupCode": config.hotelGroupCode
            }
        })
        .then((res: any) => {
            if (res.result == 1 && res.retVal.result == 0) {

                res.retVal.retVal.forEach((item: any) => {
                    item.trafficTypeDesc = getTrafficType(item.trafficType)
                    item.beginDateF = dayjs(item.beginDate).format('M月D日')
                    if (item.shuttleType == 'J') {
                        shuttleInfoJ.value.push(item)
                    }
                    if (item.shuttleType == 'S') {
                        shuttleInfoS.value.push(item)
                    }
                })

            } else {
                jAlert3(res.retVal.msg || res.msg)
            }
        })
}
const getHotelList = () => {

    var findHotelParameter = {
        fromDate: "",
        toDate: "",
        otaChannel: "WECHAT",
        hotelGroupCodes: config.hotelGroupCode,
        cardLevel: "",
        hasPriceMin: "T",
        clientLatitude: "",
        clientLongitude: "",
        position: "",
        positionValue: "",
        keyWord: "",
        radius: "",
        pageSize: 999,
        firstResult: 0,
        cardType: "",
        appid: config.appid,
        componentAppid: config.componentAppid,
        memberNo: ""
    };

    api
        .findHotel(findHotelParameter)
        .then((response: any) => {
            if (response.result == 1) {
                hotelList.value.forEach((hotel: any) => {

                    response.retVal.resultInfos.forEach((n: any, i:number) => {
                        if (hotel.hotelCode == n.code) {

                            hotel.extraLogo = n.extraLogo
                            hotel.phone = n.phone
                            hotel.pictures = n.pictures
                            hotel.hotelLatitude = n.hotelLatitude;
                            hotel.hotelLongitude = n.hotelLongitude;

                        }
                    })

                })
                // hotelList.value.map((item: any) => {
                //     let flagGust = item.guests.findIndex((citem: any) => {
                //         return citem.mobile == user.mobile;
                //     });
                //     if (
                //         !dayjs(dayjs().format("YYYY-MM-DD")).isSame(
                //             dayjs(item.arrDateF).format("YYYY-MM-DD")
                //         ) &&
                //         flagGust != -1
                //     ) {
                //         currentHotel.value = item;
                //     }
                // });
            }
        })
        .catch(function (error: any) {

            console.log(error);
        })
        .finally(function (e: any) {
            // setStorage("currentHotel", currentHotel.value);
        });;
};
const advertisementPageEnd = () => {
    api
        .advertisementPage({
            hotelCode: config.hotelCode,
            hotelGroupCode: config.hotelGroupCode,
            clientTypes: channel.value,
            firstResult: 0,
            pageSize: 99,
            showLocation: '12'
        })
        .then((res: any) => {
            if (
                res.result == 0 &&
                res.retVal &&
                res.retVal.datas &&
                res.retVal.datas.length > 0
            ) {
                let data = res.retVal.datas[0]

                let infos = JSON.parse(data.infos);
                if (infos.length > 0) {
                    headerData.value = infos[0]
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
            pageSize: 99,
            showLocation: '4'
        })
        .then((res: any) => {
            if (
                res.result == 0 &&
                res.retVal &&
                res.retVal.datas &&
                res.retVal.datas.length > 0
            ) {
                let data = res.retVal.datas[0]

                let infos = JSON.parse(data.infos);

                infos.forEach((item: any) => {
                    if (item.startTime == teamOrder.value.pageTitle) {
                        item.goodsType.forEach((type: string) => {
                            if (type == reserveOrder.value.orderType) {
                                if (item.goodsTags.length > 0) {
                                    item.goodsTags.forEach((type: string) => {
                                        if (teamOrder.value.theme == type) {
                                            headerData.value = item
                                        }
                                    })
                                } else {
                                    headerData.value = item
                                }
                            }
                        })
                    }
                    // if (teamOrder.value.orderSta=='I') {

                    // 	if (item.startTime == '行中') {

                    // 		item.goodsType.forEach((type : string) => {
                    // 		if (type == reserveOrder.value.orderType) {
                    // 		if(item.goodsTags.length>0){
                    // 		item.goodsTags.forEach((type : string) => {

                    // 		})
                    // 		}
                    // 		headerData.value = item

                    // 		}
                    // 		})
                    // 	}

                    // }else if (teamOrder.value.orderSta=='W') {
                    // 	if (item.startTime == '行前') {
                    // 		item.goodsType.forEach((type : string) => {
                    // 		if (type == reserveOrder.value.orderType) {
                    // 		headerData.value = item
                    // 		}
                    // 		})
                    // 	}
                    // }else if(teamOrder.value.orderSta=='O') {
                    // 	if (item.startTime == '行后') {
                    // 		item.goodsType.forEach((type : string) => {
                    // 		if (type == reserveOrder.value.orderType) {
                    // 		headerData.value = item
                    // 		}
                    // 		})
                    // 	}

                    // }
                })

            }
        });
};
const listRootCategory = () => {
    api.interfaceTransfer({
            query: {
                "unitCode": config.hotelGroupCode,
                "teamNo": teamNo.value
            },
            config: {
                "interfaceType": "GET",
                "interfaceModule": "GC_UCBASE_URL",
                "interfaceMethod": "albumCategory/listRootCategory",
                "interfaceFrom": "GC",
                "hotelGroupCode": config.hotelGroupCode
            }
        })
        .then((res: any) => {
            if (res.result == 1 && res.retVal.result == 0) {
                res.retVal.retVal.forEach((item: any) => {
                    if (item.name == '活动相册') {
                        api.interfaceTransfer({
                                query: {
                                    "unitCode": config.hotelGroupCode,
                                    "categoryId": item.categoryId,
                                    "teamNo": teamNo.value
                                },
                                config: {
                                    "interfaceType": "GET",
                                    "interfaceModule": "GC_UCBASE_URL",
                                    "interfaceMethod": "albumCategory/photoByRemark",
                                    "interfaceFrom": "GC",
                                    "hotelGroupCode": config.hotelGroupCode
                                }
                            })
                            .then((res: any) => {
                                if (res.result == 1 && res.retVal.result == 0) {
                                    activityAlbum.value = res.retVal.retVal
                                    chooseTeamItinerarie({})

                                } else {
                                    jAlert3(res.result.msg || res.msg)
                                }
                            });
                    }
                    if (item.name == '酒店相册') {
                        api.interfaceTransfer({
                                query: {
                                    "unitCode": config.hotelGroupCode,
                                    "categoryId": item.categoryId,
                                    "teamNo": teamNo.value
                                },
                                config: {
                                    "interfaceType": "GET",
                                    "interfaceModule": "GC_UCBASE_URL",
                                    "interfaceMethod": "albumCategory/photoByRemark",
                                    "interfaceFrom": "GC",
                                    "hotelGroupCode": config.hotelGroupCode
                                }
                            })
                            .then((res: any) => {
                                if (res.result == 1 && res.retVal.result == 0) {
                                    hotelAlbum.value = res.retVal.retVal
                                    chooseTeamItinerarie({})

                                } else {
                                    jAlert3(res.result.msg || res.msg)
                                }
                            });
                    }
                })

            } else {
                jAlert3(res.result.msg || res.msg)
            }
        });
}
const photoByName = (cb: any) => {
    photos.value = []
    let categoryName = ''
    let hotelDesc = ''
    let itinerarie: any = {}
    if (!curTeamItinerarie.value.itineraryCode && teamItineraries.value.length > 0) {
        if (teamOrder.value.tripSta == '1' || teamOrder.value.tripSta == '2') {
            itinerarie = teamItineraries.value[0]

        }
        if (teamOrder.value.tripSta == '4' || teamOrder.value.tripSta == '5') {
            itinerarie = teamItineraries.value[teamItineraries.value.length - 1]
        }
        if (teamOrder.value.tripSta == '3') {
            teamItineraries.value.forEach((item: any) => {
                if (item.bizDateF == dayjs().format('M月D日')) {
                    itinerarie = item
                }
            })
        }
    }
    if (curTeamItinerarie.value.itineraryCode) {
        itinerarie = curTeamItinerarie.value
    }
    if (itinerarie.teamRsvSrcs && itinerarie.teamRsvSrcs.length > 0) {
        hotelDesc = itinerarie.teamRsvSrcs[0].hotelDesc
    }

    hotelAlbum.value.forEach((item: any) => {

        if (item.name == hotelDesc) {
            item.albumPhotos.forEach((album: any, i: number) => {
                if (i < 2) {
                    photos.value.push(album)
                }

            })
        }
    })
    if (itinerarie.actives && itinerarie.actives.length > 0) {
        for (let i = 0; i < itinerarie.actives.length; i++) {
            categoryName = itinerarie.actives[i].activeName
            activityAlbum.value.forEach((item: any) => {
                if (item.name == categoryName) {
                    item.albumPhotos.forEach((album: any, i: number) => {
                        if (photos.value.length < 4) {
                            photos.value.push(album)
                        }

                    })
                }
            })
            if (photos.value.length >= 4) {
                break;
            }
        }
    }
    cb && cb()
}
// const photoByName = (cb:any) => {
// 	photos.value = []
// 	let categoryName = ''
// 	let hotelCode =''
// 	if(curTeamItinerarie.value.itineraryCode){
// 		if(curTeamItinerarie.value.actives.length>0){
// 		categoryName = curTeamItinerarie.value.actives[0].activeName
// 		}
// 		hotelCode = curTeamItinerarie.value.teamRsvSrcs[0].hotelCode
// 	}else{
// 		if(teamItineraries.value[0].actives){
// 		categoryName = teamItineraries.value[0].actives.activeName
// 		}
// 		hotelCode = teamItineraries.value[0].teamRsvSrcs[0].hotelCode
// 	}
// 	if(!categoryName){
// 		return
// 	}
// 	photos.value = []
// 	api.interfaceTransfer({
// 		query: {
// 		"unitCode": config.hotelGroupCode,
// 		"categoryName":categoryName
// 		},
// 		config: {
// 		"interfaceType": "GET",
// 		"interfaceModule": "GC_UCBASE_URL",
// 		"interfaceMethod": "albumCategory/photoByName",
// 		"interfaceFrom": "GC",
// 		"hotelGroupCode": config.hotelGroupCode
// 		}
// 	})
// 		.then((res : any) => {
// 		if (res.result == 1 && res.retVal.result == 0) {

// 		res.retVal.retVal.forEach((pic : any,i:number) => {
// 		 if(i<2){
// 		 photos.value.push(pic)
// 		 }

// 		})
// 		hotelList.value.forEach((hotel : any) => {

// 		if(hotel.hotelCode == hotelCode){
// 		   let pictures = hotel.pictures.split(';')
// 		   pictures.forEach((pic : any,i:number) => {
// 		   if(i<2){
// 		   var picData ={
// 		   photoUrl:pic
// 		   }
// 		   photos.value.push(picData)
// 		   }
// 		   })
// 		}
// 		})
// 		} else {
// 		jAlert3(res.result.msg || res.msg)
// 		}
// 		cb&&cb()
// 		});
// }
const getTeamDetail = () => {
	user = getStorage("user");
    hotelList.value = []
    api.interfaceTransfer({
            query: {
                "mobile": user.mobile,
                "unitCode": config.hotelGroupCode
            },
            config: {
                "interfaceType": "GET",
                "interfaceModule": "GC_TRAVEL_ORDER",
                "interfaceMethod": `/api/team/order/detail/${teamNo.value}`,
                "interfaceFrom": "GC",
                "hotelGroupCode": config.hotelGroupCode
            }
        })
        .then((res: any) => {
            if (res.result == 1 && res.retVal.result == 0) {
                travelDetail = res.retVal.retVal
                res.retVal.retVal.guests.forEach((item: any) => {
                    if (item.mobile == user.mobile) {
                        guest.value = item
                    }
                })
                if (travelDetail.driverButlerDtos) {
                    travelDetail.driverButlerDtos.forEach((item: any) => {
                        if (item.personType == 'HOUSEKEEP') {
                            houseKeepInfo.value = item
                        }
                    })
                }
                if (travelDetail.reserveOrders.length == 0) {
                    goPage('/pages/travel/index')
                    return;
                }
                let orderNo = ''
                travelDetail.guests.forEach((item:any)=>{
                    if(item.mobile == user.mobile){
                        travelDetail.reserveOrders.forEach((order:any)=>{
                            if(order.orderNo == item.orderNo){
                                 reserveOrder.value = order
                            }
                        })
                         
                    }
                    
                })
               
                teamOrder.value = travelDetail.teamOrder
                if (teamOrder.value.orderType == 'Custom') {
                    teamOrder.value.productCode = teamOrder.value.id
                    teamOrder.value.productDesc = teamOrder.value.teamName
                }
                teamItineraries.value = travelDetail.teamItineraryInfos[0].teamItineraries
                teamOrder.value.dayDiff = dayjs().diff(teamOrder.value.beginDate, 'day')
                teamOrder.value.dayEndDiff = dayjs(teamOrder.value.endDate).diff(dayjs(), 'day')
                teamItineraries.value.forEach((item: any) => {
                    if (item.actives && item.actives.length > 0) {
                        item.actives.forEach((active: any) => {
                            if (item.activesTl) {
                                item.activesTl += " - " + active.activeName
                            } else {
                                item.activesTl = active.activeName
                            }
                        })
                    }

                    item.bizDateF = dayjs(teamOrder.value.beginDate).add(item.dayNum - 1, 'day').format('M月D日')
                    item.moon = dayjs(teamOrder.value.beginDate).add(item.dayNum - 1, 'day').format('M')
                    item.days = dayjs(teamOrder.value.beginDate).add(item.dayNum - 1, 'day').format('D')
                    if( item.teamRsvSrcs.length>0){
                        let hotel = item.teamRsvSrcs[0]
                        hotel.arrDateF = dayjs(hotel.arrDate).format('M月D日')
                        hotel.depDateF = dayjs(hotel.depDate).format('M月D日')
                        hotelList.value.push(hotel)
                    }
                  
                })
                if (teamOrder.value.orderSta == 'W') {
                    if (teamOrder.value.dayDiff <= -2) {
                        teamOrder.value.tripSta = '1'
                        teamOrder.value.pageTitle = '行前2天以上'
                    } else {
                        teamOrder.value.tripSta = '2'
                        teamOrder.value.pageTitle = '行前2天内'
                    }

                } else if (teamOrder.value.orderSta == 'I') {
                    teamOrder.value.tripSta = '3'
                    teamOrder.value.pageTitle = '行中'
                } else if (teamOrder.value.orderSta == 'O') {
                    if (teamOrder.value.dayEndDiff >= -7) {
                        teamOrder.value.tripSta = '4'
                        teamOrder.value.pageTitle = '行后7天内'
                    } else {
                        teamOrder.value.tripSta = '5'
                        teamOrder.value.pageTitle = '行后7天后'
                    }
                }
                teamOrder.value.tripTime = `${dayjs(teamOrder.value.beginDate).format('M月DD日')}-${dayjs(teamOrder.value.endDate).format('M月DD日')}`

                // setStorage("teamItineraryInfos", travelDetail.teamItineraryInfos[0]);
                getHotelList()
                if (teamOrder.value.tripSta == '5') {
                    isLoad.value = true
                }
                // if (teamOrder.value.tripSta == '5') {
                //     advertisementPageEnd()
                //      isLoad.value = true
                // } else {
                //     advertisementPage()
                // }
                listCodeBase(() => {
                    listByOrderNo()
                })
                listRootCategory()
                
               
            }
        })
}
onShow(() => {
    shuttleInfoJ.value = []
    shuttleInfoS.value = []
    user = getStorage("user");

    if (!(user && user.memberId)) {
        toLogin();
    } else {
        if (!travelDetail.reserveOrders) {
            getTeamDetail()

        }else{
             listCodeBase(() => {
                listByOrderNo()
            })
            tripNavRef.value.updateData()
        }

    }
})
onLoad((options: any) => {
    if (options.teamNo) {
        teamNo.value = options.teamNo
    }
    if (options.scene) {

        let params = getUrlParams(decodeURIComponent(decodeURIComponent(options.scene)))
        if (params.teamNo) {
            teamNo.value = params.teamNo
        }

    }
})
onMounted(() => {

});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");

::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    color: transparent;
}

.loadingImg {
	position: fixed;
	top:0;
	left:0; 
    width: 100vw;
}

.tripDetail_ui {
    padding-bottom: 40px;

    .header {
        position: relative;
        padding: 108px 16px 0;
        height: 282px;
        .bg{
            position: absolute;
            left: 0;
            top: 0;
            right:0;
            bottom: 0;
            height: 100%;
            width: 100%;
            z-index: 0;
        }
        .welcome {
            position: relative;
            z-index: 1;
            font-size: 14px;
            line-height: 14px;
            opacity: 0.8;
            color: #fff;
        }

        .name {
             position: relative;
            z-index: 1;
            margin-top: 12px;
            font-family: 'Source Han Serif CN';
            font-style: normal;
            font-weight: 900;
            font-size: 24px;
            line-height: 36px;
            color: #fff;
        }

        .time {
             position: relative;
            z-index: 1;
            margin-top: 12px;
            font-size: 14px;
            line-height: 14px;
            color: #fff;
        }
    }

    .nav-warp {

        margin: -40px 16px 0;
        position: relative;
        background: #FFFFFF;
        border-radius: 8px;

        .nav-list {
            padding: 8px 12px;
            display: flex;
            flex-wrap: wrap;

            .nav {

                // flex: 1;
                padding: 16px 0;
                min-width: 25%;
                display: flex;
                flex-direction: column;
                align-items: center;

            }

            .iconfont {
                width: 24px;
                height: 24px;
                font-size: 20px;
            }

            .txt {
                color: #000;
                font-weight: normal;
                font-size: 12px;
                line-height: 1;
                margin-top: 6px;
            }
        }
    }

    .title {
        margin: 32px 16px 0;
        display: flex;
        justify-content: space-between;
        font-size: 18px;
        align-items: center;
        font-weight: bold;

        .icon-a-16_youlajiantou_hei {
            font-weight: normal;
            font-size: 16px;
        }
    }

    .room-box {

        position: relative;
        height: 150px;
        padding: 24px 0 14px;

        .room-item {
           
            padding: 0 16px;
        }

        .room {
            position: relative;
            background: #FFFFFF;
            padding: 16px;
            display: flex;
            border-radius: 8px;

            .left-part {
                width: 107px;
                height: 80px;

                .img {
                    width: 100%;
                    height: 100%;
                    border-radius: 4px;

                }
            }

            .right-part {
                display: flex;
                align-items: center;
                flex: 1;

                .info {
                    line-height: 1;
                    margin-left: 15px;
                    flex: 1;

                    .time {
                        color: #808080;
                        font-size: 12px;
                        overflow: hidden;
                    }

                    .name {
                        margin-top: 12px;
                        font-size: 18px;
                        font-weight: bold;
                        overflow: hidden;
                    }

                    .desc {
                        margin-top: 8px;
                        font-size: 14px;
                        overflow: hidden;
                    }
                }

                .icon-a-28_dianhua {
                    font-size: 28px;
                    color: #000;
                }
            }
        }
    }

    .routes-list {
        position: relative;
        margin-top: 24px;
        padding-bottom: 12px;
        // padding-left: 66px;
        // margin-left: 16px;
        // margin-right: 16px;

        .all {
            position: absolute;
            left: 0;
            white-space: nowrap;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background: #FFFFFF;
            border-radius: 8px;
            padding: 14px 19px;
            font-size: 14px;
            font-weight: bold;
            height: 64px;
            border: 1px solid #fff;

            &.active {
                border: 1px solid #A43127;
            }

        }

        .routes {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            padding-right: 16px;
            .route {
                margin-left: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                background: #FFFFFF;
                border-radius: 8px;
                padding: 0 24px 0 12px;
                height: 60px;
                border: 1px solid #fff;
                &.all-route{
                     padding: 0 12px;
                }
                &.active {
                    border: 1px solid #A43127;
                }

                .all-txt {
                    font-weight: bold;
                    font-size: 14px;
                    word-break: keep-all;
                }

                .label {
                    white-space: nowrap;
                    font-weight: bold;
                    font-size: 16px;
                    line-height: 1;
                }

                .val {
                    margin-top: 8px;
                    font-size: 12px;
                    line-height: 1;
                    color: #000000;

                    white-space: nowrap;
                }

                &:first-child {
                    margin-left: 16px;
                }

                // &:last-child {
                //     margin-right: 16px;
                // }
            }
        }

    }

    .pick-up {
        margin: 24px 16px 0;
        padding: 16px 12px 20px;
        background: #FFFFFF;
        border-radius: 8px;

        .pick-up-tl {
            display: flex;
            align-items: center;
            font-size: 14px;
            line-height: 1;
            font-weight: bold;

            .icon-a-20_jiesonganpai {
                font-weight: normal;
                font-size: 20px;
                margin-right: 5px;
            }

        }

        .pick-up-info {
            display: flex;
            line-height: 1;

            .no-carNo {
                margin-top: 16px;
                color: #ccc;
                font-size: 14px;
            }

            .left-part,
            .right-part {
                margin-top: 19px;
                width: 50%;

                .pick-up-label {
                    font-size: 14px;
                    color: #808080;
                }

                .pick-up-keynote {
                    margin-top: 12px;
                    font-size: 20px;
                    font-weight: bold;
                }

                .pick-up-desc {
                    margin-top: 8px;
                    font-size: 14px;
                    color: #000000;
                }
            }

            .left-part {
                position: relative;

                &::after {
                    content: '';
                    position: absolute;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    border-right: 0.5px solid #EEEEEE;
                }
            }

            .right-part {
                text-align: right;
            }

        }

        .pick-up-info-list {
            padding-top: 8px;

            .pick-up-item {
                margin-top: 16px;
                display: flex;
                align-items: center;

                .pick-up-item-label {

                    color: #808080;
                    font-size: 14px;
                    width: 68px;
                }

                .pick-up-item-val {
                    position: relative;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    flex: 1;
                    flex-wrap: wrap;

                    .guest {
                        margin-right: 16px;
                    }

                    .icon-a-12_fuzhi {
                        font-size: 13px;
                        margin-left: 5px;
                    }

                    .icon-a-28_dianhua {
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        font-size: 28px;
                    }
                }
            }
        }

    }

    .tips {
        padding: 0 16px;
        display: flex;
        align-items: center;
        font-size: 12px;

        .icon-a-12_tishi {
            color: #808080;
            font-size: 12px;
            margin-right: 5px;
        }

        margin-top: 12px;
        color: #808080;
    }

    .trip-date {
        margin: 20px 16px 0;

        .trip-date-item {
            padding: 16px 12px 13px;
            margin-top: 12px;
            background: #fff;
            border-radius: 8px;
            display: flex;
            align-items: center;

            &:first-child {
                margin-top: 0;
            }

            .left-part {
                display: flex;
               
               
                width: 34px;
                .left-part-box{
                     display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }
                .moon {
                    font-size: 12px;
                    line-height: 12px;
                }

                .day {
                    margin-top: 4px;
                    font-weight: 600;
                    font-size: 20px;
                    line-height: 1;
                }
            }

            .right-part {
                flex: 1;
                padding-left: 12px;
                line-height: 1;
                border-left: 0.5px solid #EEEEEE;

                .head {
                    font-size: 16px;

                    color: #000000;
                    font-weight: bold;
                }

                .center {
                    margin-top: 8px;
                    color: #000000;
                    font-size: 14px;
                }

                .footer {
                    margin-top: 8px;
                    font-size: 12px;
                    line-height: 18px;
                    color: #808080;
                }
            }
        }
    }

    .trip-detail {
        padding: 4px 16px 0;

        .trip-detail-item {
            margin-top: 16px;

            .trip-detail-time {
                display: flex;
                align-items: center;
                color: #808080;
                font-size: 14px;
                .iconfont {
                    color: #808080;
                    margin-right: 4px;
                    font-size: 12px;
                }
            }

            .trip-detail-info {
                display: flex;
                margin-top: 12px;
                background: #FFFFFF;
                border-radius: 8px;
                padding: 12px 16px;

                .iconfont {
                    margin-right: 16px;
                    margin-top: 16px;
                    font-size: 20px;
                    color: #000000;
                }

                .rt-part {
                    position: relative;
                    flex: 1;
					border-radius: 4px;
					overflow: hidden;
                    .active-img {
                        display: block;
                        width: 100%;
                       
						height: 54.93vw;
                    }

                    .rt-part-info {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
						z-index: 3;
						
                    }
					.bg{
						position: absolute;
						left: 0;
						right: 0;
						top: 0;
						bottom: 0;
						z-index: 2;
						background: linear-gradient(180deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.00) 100%);
					}
                    .activeName {
                        margin-left: 16px;
                        margin-top: 16px;
                        font-size: 16px;
                        font-weight: bold;
                        color: #fff;

                    }

                    .activeTime {
                        margin-left: 16px;
                        margin-top: 12px;
                        font-size: 14px;
                        opacity: 0.8;
                        color: #fff;
                    }
                }

            }

        }
    }

    .journey-form {
        margin: 12px 16px 0;
        padding: 16px 12px;
        background: #fff;
        border-radius: 8px;

        .journey-hd {
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: bold;

            .icon-a-20_jiesonganpai {
                font-size: 20px;
                font-weight: normal;
                margin-right: 5px;
            }
        }

        .info {
            display: flex;
            align-items: center;
            margin-top: 12px;
            font-size: 14px;
            line-height: 18px;
            color: #000000;

            .info-lf {
                flex: 1;
                line-height: 18px;
            }

            .btn {
                margin-left: 26px;
                height: 30px;
                line-height: 30px;
                padding: 0 12px;
            }
        }
    }

    .album {
        margin-top: 32px;

        .album-head {
            margin: 0 16px;

            .album-tl {
                display: flex;
                font-size: 18px;
                line-height: 1;
                font-weight: bold;
                justify-content: space-between;
                align-items: center;
            }

            .desc {
                margin-top: 8px;
                color: #808080;
                font-size: 12px;
            }

        }

        .album-list {
            margin-top: 24px;
            white-space: nowrap;
            overflow-x: auto;
            padding: 0 16px;

            .img {
                margin-left: 8px;
                width: 166px;
                height: 124px;
                border-radius: 8px;

                &:first-child {
                    margin-left: 0;
                }
            }
        }
    }

    .albumDetail {
      


        padding-bottom: 30px;
        &::after{
           position: absolute;
          width: 100%;
           top: 0;
           height: 10px;
           background: #000;
           transform: scaleY(0.5);
        }
        .album-title {
            padding: 24px 16px 0;

            font-size: 20px;
            line-height: 20px;
            color: #000000;
            font-weight: bold;
        }

        .moreText {
            padding: 0 16px;
            margin-top: 24px;
        }

        .img-list {
            padding: 16px;
            display: flex;
            flex-wrap: wrap;

            .img-item {
                margin-top: 8px;
                width: 33.3%;
                display: flex;

                &:nth-child(3n-1) {
                    justify-content: center;
                }

                &:nth-child(3n) {
                    justify-content: flex-end;
                }
            }

            .album-item {
                width: 29vw;
                height: 21.9vw;

            }
        }
    }
}
</style>
