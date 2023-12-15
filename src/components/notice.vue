<template>
<div class="notice_ui" v-if="show">
    <swiper class="swiper" vertical autoplay circular>
         <swiper-item v-for="(item,i) in adjustNotices" :key="i" v-if="adjustNotices.length>0">
            <div class="notice_warp" @click="toLink(item.link)">
                <div class="info">
					<i class="icon-a-20_hangchengbiangeng iconfont"></i>
                    <div class="content">{{item.content}}</div>
                </div>
                <i class="icon-a-12_youlajiantou_hei iconfont"></i>
            </div>
        </swiper-item>
        
        <swiper-item v-for="(item,i) in notices" :key="i" v-if="notices.length>0">
            <div class="notice_warp" @click="toLink(item)">
                <div class="info">
					<i class="icon-a-16_gonggao iconfont"></i>
                    <div class="content">{{item.content}}</div>
                </div>
                <i class="icon-a-12_youlajiantou_hei iconfont"></i>
            </div>
        </swiper-item>
        <swiper-item v-for="(item,i) in complaints" :key="i" v-if="complaints.length>0">
            <div class="notice_warp" @click="toLink(item)">
                <div class="info">
					<i class="icon-a-16_gonggao iconfont"></i>
                    <div class="content">{{item.content}}</div>
                </div>
                <i class="icon-a-12_youlajiantou_hei iconfont"></i>
            </div>
        </swiper-item>
        <swiper-item v-for="(item,i) in travelNotices" :key="i" v-if="travelNotices.length>0">
            <div class="notice_warp" @click="toLink(item.link)">
                <div class="info">
					<i class="icon-a-16_gonggao iconfont"></i>
                    <div class="content">{{item.content}}</div>
                </div>
                <i class="icon-a-12_youlajiantou_hei iconfont"></i>
            </div>
        </swiper-item>
        
    </swiper>

</div>
</template>

<script lang="ts">
import {
    jAlert3
} from "@/base/jAlert/jAlert";
import api from "@/utils/api";
import {
    goPage
} from "@/utils/utils";
import {
    getStorage
} from "@/utils/wxuser";
import defaultChannel from "@/utils/defaultChannel";
import dayjs from "dayjs";
import {
    defineComponent,
    onMounted,
    ref,
    watch
} from "vue";
import { values } from "ramda";

let user = getStorage('user')
let config = getStorage('config')
export default defineComponent({
    name: "notice",
    props: {
        showLocation: {
            type: String,
            default: () => {
                return "";
            },
        },
        teamNo: {
            type: String,
            default: () => {
                return "";
            },
        },
        masterInfo: {
            type: Object,
            default: () => {
                return {};
            },
        },
        orderNo: {
            type: String,
            default: () => {
                return "";
            },
        },
    },
    setup(props, context) {
        let notices: any = ref([])
        let adjustNotices: any = ref([])
        let travelNotices: any = ref([])
        let content = ref('')
        let teamOrder = ref('')
        let link = ref('')
        let show = ref(false)
        let complaints=ref([])
        let getRsOrderNum = ref(0)
        let serviceDesc:any = ref({
            R:[{'serverCode':'00105',desc:'您已经提交一个客房用品需求，即将为您服务'},
            {'serverCode':'00106',desc:'您已经提交一个物品借用需求，即将为您服务'},
            {'serverCode':'00104',desc:'您已经提交一个客房打扫需求，即将为您服务'}],
            I:[{'serverCode':'00105',desc:'您的客房用品需求已经开始服务'},
            {'serverCode':'00106',desc:'您的物品借用需求已经开始服务'},
            {'serverCode':'00104',desc:'您的客房打扫需求已经开始服务'}],
            O:[{'serverCode':'00105',desc:'您的客房用品需求已经完成'},
            {'serverCode':'00106',desc:'您的物品借用需求已经完成'},
            {'serverCode':'00104',desc:'您的客房打扫需求已经完成'}],
            S:[{'serverCode':'00105',desc:'您的客房用品需求被挂起，员工将稍后为您服务'},
            {'serverCode':'00106',desc:'您的物品借用需求被挂起，员工将稍后为您服务'},
            {'serverCode':'00104',desc:'您的客房打扫需求被挂起，员工将稍后为您服务'}],
            X:[{'serverCode':'00105',desc:'您的客房用品需求已取消，感谢您的使用。'},
            {'serverCode':'00106',desc:'您的物品借用需求已取消，感谢您的使用。'},
            {'serverCode':'00104',desc:'您的客房打扫需求已取消，感谢您的使用。'}]
        })
      
        let channel = ref(defaultChannel);
        watch(() => props.masterInfo, (newVal, oldVal) => {
           if(props.masterInfo&&props.masterInfo.masterId){
                getRsOrder()
                getComplaintAndAdviceList()
               
                
            }
        })
        watch(() => props.orderNo, (newVal, oldVal) => {
           if(props.orderNo){
                getAdjustList()
            }
        })
        const toLink = (item:any) => {
            if(item.serverCode){
                goPage(`/pagesG/order/detail/index?orderNo=${item.oderNo}&masterId=${item.roomMasterId}&hotelCode=${item.hotelCode}&pmsId=${item.masterId}`)
            }else if(item.type=='complaint'){
                 goPage(`/pagesG/suggest-detail?id=${item.id}&hotelCode=${item.hotelCode}`)
          
            }else{
                if (item) {
                    goPage(item)
                }
            }
           

        }
        const msgPage = () => {
            api.msgPage({
                hotelCode: config.hotelCode,
                hotelGroupCode: config.hotelGroupCode,
                clientTypes: channel.value,
                firstResult: 0,
                pageSize: 10,
                showLocation: props.showLocation
            }).then((res: any) => {
                if (res.result == 0) {
                    if (res.retVal.datas&&res.retVal.datas.length&&res.retVal.datas.length > 0) {
                        let info = JSON.parse(res.retVal.datas[0].infos)
                        
                        if (dayjs().diff(info.startDate, 's') > 0 && dayjs(info.endDate).diff(dayjs(), 's') > 0) {
                            if(props.showLocation=='1'){
                                getOrderList(info)
                            }else{
                                travelNotices.value = []
                                travelNotices.value.push({
                                    link:info.link,
                                    content:info.content
                                })
                                show.value = true
                            }
                            
                        }
                        // res.retVal.datas.forEach((item: any) => {
                        //     let info = JSON.parse(item.infos)
                        //     if (dayjs().diff(info.startDate, 's') > 0 && dayjs(info.endDate).diff(dayjs(), 's') > 0 && !show.value) {
                                
                                // link.value = info.link
                                // content.value = info.content
                               
                                // if (content.value.indexOf('${time}') != -1 || content.value.indexOf('${travel}') != -1) {
                                //     if (user && user.memberId) {
                                //         getOrderList()
                                //     }

                                // } else {
                                //     tripShow.value = true
                                // }
                            // }
                        // })
                    }

                } else {
                    jAlert3(res.msg)
                }
            });
        }
        const getComplaintAndAdviceList = () => {
            
                api.interfaceTransfer({
                query: {
                    "pmsId": props.masterInfo.pmsId,
                    "masterId":props.masterInfo.masterId,
                    "hotelCode":props.masterInfo.hotelCode,
                    "replyStatus": 0,
                    // "orderSta": "R,I",
                    "hotelGroupCode":config.hotelGroupCode,
                    "userCode": "guest",
                    "channel": "HKApp"
                },
                config: {
                    "interfaceType": "POST",
                    "interfaceModule": "ROOM_SERVICE",
                    "interfaceMethod": "frontend/getComplaintAndAdviceList",
                    "interfaceFrom": "ZHZ",
                    "hotelGroupCode": config.hotelGroupCode
                }
            })
            .then((res: any) => {
                if (res.result == 1&&res.retVal.data) {
                    res.retVal.data.forEach((item:any)=>{
                        item.type = 'complaint'
                        item.content = '您已提交一个意见反馈，即将为您处理'
                    })
                    complaints.value = res.retVal.data
                    if(complaints.value.length>0){
                        show.value = true
                    }
                }
            })
        }
        const getRsOrder = () => {
           
                api.interfaceTransfer({
                query: {
                    "masterId": props.masterInfo.pmsId,
                    "roomMasterId":props.masterInfo.masterId,
                    "hotelCode":props.masterInfo.hotelCode,
                    "pageNo": 1,
                    "pageSize": 20,
                    // "orderSta": "R,I",
                    "hotelGroupCode":config.hotelGroupCode,
                    "userCode": "guest",
                    "channel": "HKApp"
                },
                config: {
                    "interfaceType": "POST",
                    "interfaceModule": "ROOM_SERVICE",
                    "interfaceMethod": "rsOrder/list",
                    "interfaceFrom": "ZHZ",
                    "hotelGroupCode": config.hotelGroupCode
                }
            })
            .then((res: any) => {
                if (res.result == 1) {
                    notices.value = []
                    if(res.retVal.data){
                        res.retVal.data.data.forEach((item:any)=>{
                            if(serviceDesc.value[item.orderSta]){
                                 serviceDesc.value[item.orderSta].forEach((service:any)=>{
                                    if(service.serverCode == item.serverCode){
                                            item.content = service.desc
                                    }
                                })
                                notices.value.push(item)
                            }
                           
                        })
                        if(notices.value.length>0){
                            show.value = true
                        }
                    }
                    
                    getRsOrderNum.value++
                    if(getRsOrderNum.value<20&&props.showLocation=='1'){
                        setTimeout(() => {
                            getRsOrder()
                            getComplaintAndAdviceList()
                        }, 30000);
                    }
                   
                }else{
                    jAlert3(res.msg||res.retVal.msg)
                }
            })

           
        }
        const getOrderList = (info:any) => {
            api.interfaceTransfer({
                query: {
                    "curPage": 1,
                    "firstResult": 0,
                    "isAgency": "T",
                    "mobile": user.mobile,
                    "pageSize": 999,
                    "unitCode": config.hotelGroupCode
                },
                config: {
                    "interfaceType": "POST",
                    "interfaceModule": "GC_TRAVEL_ORDER",
                    "interfaceMethod": "/api/team/order/teamList",
                    "interfaceFrom": "GC",
                    "hotelGroupCode": config.hotelGroupCode
                }
            })
                .then((res : any) => {
                    if (res.result == 1 && res.retVal.result == 0) {
                        travelNotices.value = []

                        if (res.retVal.retVal.length > 0) {
                            res.retVal.retVal.forEach((item : any) => {
                               if (item.beginDate) {
                                    item.dayDiff = dayjs().diff(item.beginDate, 'day')
                                    item.dayDiffDate = dayjs(item.beginDate).add(1, 'day').diff(dayjs(), 'day')
                                    item.dayEndDiff = dayjs(item.endDate).diff(dayjs(), 'day')
                                }
                                 if (item.orderSta == 'W') {
                                    if (item.dayDiff <= -2) {
                                        item.tripSta = '1'
                                        item.pageTitle = '行前2天以上'
                                    } else {
                                        item.tripSta = '2'
                                        item.pageTitle = '行前2天内'
                                    }
                                   
                                } else if (item.orderSta == 'I') {
                                    item.tripSta = '3'
                                    item.pageTitle = '行中'
                                 } else if (item.orderSta == 'O') {
                                    if (item.dayEndDiff >= -7) {
                                        item.tripSta = '4'
                                        item.pageTitle = '行后7天内'
                                    } else {
                                        item.tripSta = '5'
                                        item.pageTitle = '暂无行程'
                                    }
                                }

                                info.items.forEach((obj:any)=>{

                                    if(obj.startTime==item.pageTitle){
                                        if(obj.content.indexOf('${time}')!=-1){
                                            if(item.dayDiffDate>0){
                                                 travelNotices.value.push({
                                                    link:obj.link,
                                                    content:obj.content.replace('${time}', item.dayDiffDate).replace('${travel}', item.productDesc)
                                                })
                                            }
                                        }else{
                                            travelNotices.value.push({
                                                link:obj.link,
                                                content:obj.content.replace('${time}', item.dayDiffDate).replace('${travel}', item.productDesc)
                                            })
                                        }
                                       
                                    }
                                })
                            })
                           

                        }
                        if(travelNotices.value.length>0){
                            show.value = true
                        }
                    }
                })
        }
        const getAdjustList = () => {
            if(!props.teamNo||!props.orderNo){
                return;
            }
            api.interfaceTransfer({
                    query: {
                        "unitCode": config.hotelGroupCode,
                        "phone":  user.mobile,
                        "teamNo":  props.teamNo
                    },
                    config: {
                        "interfaceType": "GET",
                        "interfaceModule": "GC_TRAVEL_ORDER",
                        "interfaceMethod": `/api/adjustCustomer/list`,
                        "interfaceFrom": "GC",
                        "hotelGroupCode": config.hotelGroupCode
                    }
                })
                .then((res: any) => {
                    adjustNotices.value =[]
                    if (res.result == 1 && res.retVal.result == 0) {
                        res.retVal.retVal = res.retVal.retVal.filter((item:any) => (item.adjustSta !== "S"&&item.adjustSta !== "W"&&item.adjustSta !== "M"&&item.adjustSta !== "X"));
                        if (res.retVal.retVal.length > 0) {
                            res.retVal.retVal.forEach((item:any)=>{
                                if(item.adjustSta!='X'){
                                    if(item.isRsvMan=='T'){
                                        if(item.adjustSta=='U'){
                                            let needSure = false
                                            item.guestDtos.forEach((guest:any)=>{
                                            if(guest.confirmSta=='WAIT'&&props.orderNo == guest.orderNo){
                                                    needSure = true
                                                }
                                            })
                                            if(needSure){
                                                 adjustNotices.value.push({
                                                    content:'您有一个行程变更待确认',
                                                    link:`/pagesD/trip/tripChange?teamNo=${props.teamNo}`,
                    
                                                })
                                            }
                                           
                                        }
                                       
                                    }else{
                                        item.guestDtos.forEach((guest:any)=>{
                                            if(guest.guestPhone==user.mobile){
                                                if(guest.confirmSta=='WAIT'){
                                                   adjustNotices.value.push({
                                                        content:'您有一个行程变更待确认',
                                                        link:`/pagesD/trip/tripChange?teamNo=${props.teamNo}`,
                 
                                                   })
                                                }
                                            }
                                        })
                                    }
                                }
                                
                            })
                            if(adjustNotices.value.length>0){
                                show.value = true
                            }
                        } 
                    }

                })
        }
        const updateData = () => {
            msgPage()
            getAdjustList()
        }
        // const getOrderList = () => {
        //     api.interfaceTransfer({
        //             query: {
        //                 "curPage": 0,
        //                 "firstResult": 0,
        //                 "isAgency": "T",
        //                 "mobile": user.mobile,
        //                 "pageSize": 999,
        //                 "unitCode": config.hotelGroupCode
        //             },
        //             config: {
        //                 "interfaceType": "POST",
        //                 "interfaceModule": "GC_TRAVEL_ORDER",
        //                 "interfaceMethod": "/api/team/order/teamList",
        //                 "interfaceFrom": "GC",
        //                 "hotelGroupCode": config.hotelGroupCode
        //             }
        //         })
        //         .then((res: any) => {
        //             if (res.result == 1 && res.retVal.result == 0) {
        //                 let dayDiff: any = 99999

        //                 if (res.retVal.retVal.length > 0) {
        //                     res.retVal.retVal.forEach((item: any, i: number) => {
        //                         if (item.beginDate && item.orderSta == 'W') {
        //                             item.dayDiff = dayjs(item.beginDate).add(1, 'day').diff(dayjs(), 'day')
        //                             if (item.dayDiff > 0) {
        //                                 if (item.dayDiff < dayDiff) {
        //                                     dayDiff = item.dayDiff
        //                                     content.value = content.value.replace('${time}', dayDiff).replace('${travel}', item.productDesc)
        //                                     tripShow.value = true 
        //                                 }
        //                             }
        //                         }

        //                     })

        //                 } else {
        //                     content.value = ''
        //                 }
        //             }
                   
                    
        //         })
        // }
        onMounted(() => {
            msgPage()
            getAdjustList()
			

        })
        return {
            msgPage,
            content,
            teamOrder,
            getOrderList,
            link,
            toLink,
            show,
            channel,
            notices,
            serviceDesc,
            complaints,
            travelNotices,
            adjustNotices,
            getAdjustList,
            updateData
        }
    },

});
</script>

<style lang="less" scoped>
.notice_ui {
    margin: 16px 16px 0;
    background: #EEEEEE;
    border-radius: 8px;
    .swiper {
        height: 48px;
    }
}

.notice_warp {

    display: flex;
    align-items: center;
    justify-content: space-between;
   
    padding: 0 16px;
    height: 48px;
    color: #000000;
    font-size: 14px;

    .icon-a-12_youlajiantou_hei {
        font-size: 12px;
    }

    .info {
        display: flex;
        align-items: center;

        .content {
            flex: 1;
            word-break: break-all;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }

        .icon-a-16_gonggao {
            margin-right: 12px;
        }
    }
}
</style>
