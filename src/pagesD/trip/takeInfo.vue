<template>
<div class="ui_takeInfo">
    <!-- #ifdef MP -->
    <coustom-head title="接送信息" nativeMode=true>
    </coustom-head>
    <!-- #endif -->
    <div class="tips" v-if="shuttleInfoJ.length>0"><i class="icon-a-12_tishi_bai iconfont"></i>如需修改提交后的接送信息，请联系顾问或管家。</div>
    <template v-for="(item,i) in shuttleInfoJ" :key="i">
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
                <div class="pick-up-item" v-if="item.driver">
                    <div class="pick-up-item-label">联系人</div>
                    <div class="pick-up-item-val">{{item.driver}} {{item.driverPhone}} <i class="iconfont icon-a-12_fuzhi" @click="copy(item.driverPhone)"></i>
                        <i class="iconfont icon-a-28_dianhua" @click="makePhone(item.driverPhone)"></i>
                    </div>
                </div>
            </div>

        </div>
        <div class="pick-up" v-else>
            <div class="pick-up-tl">
                <i class="iconfont icon-a-20_jiesonganpai"></i>抵达接站安排<template v-if="shuttleInfoJ.length>1">{{i+1}}</template>
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
                    <div class="pick-up-item-label">接送方式</div>
                    <div class="pick-up-item-val">无需接送</div>
                </div>

            </div>

        </div>
    </template>
    <template v-for="(item,i) in shuttleInfoS" :key="i">
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
                    <div class="pick-up-keynote">{{item.beginDate}}{{item.startTime}}</div>
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
                <div class="pick-up-item" v-if="item.driver">
                    <div class="pick-up-item-label">联系人</div>
                    <div class="pick-up-item-val">{{item.driver}} {{item.driverPhone}} <i class="iconfont icon-a-12_fuzhi" @click="copy(item.driverPhone)"></i>
                        <i class="iconfont icon-a-28_dianhua" @click="makePhone(item.driverPhone)"></i>
                    </div>
                </div>
            </div>

        </div>
        <div class="pick-up" v-else>
            <div class="pick-up-tl">
                <i class="iconfont icon-a-20_jiesonganpai"></i>返程送站安排<template v-if="shuttleInfoS.length>1">{{i+1}}</template>
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
                    <div class="pick-up-item-label">接送方式</div>
                    <div class="pick-up-item-val">无需接送</div>
                </div>

            </div>

        </div>
    </template>
    <div class="form-infos" v-for="(item,i) in saveData" :key="i">
        <div class="form-info">
            <div class="tl" v-if="item.shuttleType=='J'">
                抵达接站信息<template v-if="jNum>1">{{jNo(i)}}</template>
                <i class="iconfont icon-a-20_jian_fangxing" @click="delData(i,'J')" v-if="jNum>1"></i>
            </div>
            <div class="tl" v-if="item.shuttleType=='S'">
                返程送站信息<template v-if="sNum>1">{{sNo(i)}}</template>
                <i class="iconfont icon-a-20_jian_fangxing" @click="delData(i,'S')" v-if="sNum>1"></i>
            </div>
            <div class="form-inline">
                <div class="label">接送人</div>
                <div class="val">
                    <div class="radio-box" v-if="item.shuttleType=='J'">

                        <div class="radio-item" v-for="(guest,j) in item.arrivalGuests" :key="j" :class="{'active':guest.active,'activeNotCan':guest.activeNotCan}" @click="chooseGuest(guest,'J')">
                            {{guest.name}}
                            <i class="icon-a-16_xuanzhongjiaobiao_youxiajiao_hongse iconfont"></i>

                        </div>

                    </div>
                    <div class="radio-box" v-if="item.shuttleType=='S'">

                        <div class="radio-item" v-for="(guest,j) in item.returnGuests" :key="j" :class="{'active':guest.active,'activeNotCan':guest.activeNotCan}" @click="chooseGuest(guest,'S')">
                            {{guest.name}}
                            <i class="icon-a-16_xuanzhongjiaobiao_youxiajiao_hongse iconfont"></i>

                        </div>

                    </div>
                </div>
            </div>
            <div class="form-inline">
                <div class="label" v-if="item.shuttleType=='J'">接站需求</div>
                <div class="label" v-if="item.shuttleType=='S'">送站需求</div>
                <div class="val">
                    <div class="select-box">
                        <picker :value="pickers[i].isShuttleIndex" :range="shuttleList" range-key="name" @change="e=>bindShuttleChange(e,i)">
                            <div class="picker-box">
                                <div v-if="item.isShuttle">{{pickers[i].isShuttleDesc}}</div>
                                <div class="grey" v-else>请选择接站需求</div> <i class="iconfont icon-a-16_youlajiantou_hei"></i>
                            </div>
                        </picker>
                    </div>
                </div>
            </div>
            <template v-if="item.isShuttle!='F'">

                <div class="form-inline">
                    <div class="label" v-if="item.shuttleType=='J'">抵达方式</div>
                    <div class="label" v-if="item.shuttleType=='S'">返程方式</div>
                    <div class="val">
                        <div class="select-box">

                            <picker :value="item.trafficType" :range="trafficTypeList" range-key="descript" @change="e=>bindTrafficTypeChange(e,i)">
                                <div class="picker-box">
                                    <div v-if="item.trafficType">{{item.trafficTypeDesc}}</div>
                                    <div class="grey" v-else>
                                        <template v-if="item.shuttleType=='J'">
                                            请选择抵达交通方式
                                        </template>
                                        <template v-if="item.shuttleType=='S'">
                                            请选择返程交通方式
                                        </template>
                                    </div> <i class="iconfont icon-a-16_youlajiantou_hei"></i>
                                </div>
                            </picker>
                        </div>
                    </div>
                </div>
                <div class="form-inline" v-if="item.trafficType=='aircraft'||item.trafficType=='train'">
                    <div class="label" v-if="item.trafficType=='aircraft'">航班号</div>
                    <div class="label" v-if="item.trafficType=='train'">列车号</div>
                    <div class="val">
                        <input v-if="item.trafficType=='aircraft'" class="input-text" v-model="item.trips" type="text" placeholder="请输入航班号，如有中转请填末班" placeholder-style="color: #CCCCCC;">
                        <input v-if="item.trafficType=='train'" class="input-text" v-model="item.trips" maxlength="11" type="text" placeholder="请输入列车号，如有中转请填首班" placeholder-style="color: #CCCCCC;">
                    </div>
                </div>
                <div class="form-inline" v-if="item.trafficType">
                    <div class="label" v-if="item.shuttleType=='J'">抵达站点</div>
                    <div class="label" v-if="item.shuttleType=='S'">返程站点</div>
                    <div class="val">
                        <input v-if="item.trafficType=='other'" class="input-text" v-model="item.station" type="text" placeholder="请输入地点名称" placeholder-style="color: #CCCCCC;">
                        <input v-if="item.trafficType=='aircraft'" class="input-text" v-model="item.station" type="text" placeholder="请输入机场名称" placeholder-style="color: #CCCCCC;">
                        <input v-if="item.trafficType=='train'" class="input-text" v-model="item.station" maxlength="11" type="text" placeholder="请输入火车站名称" placeholder-style="color: #CCCCCC;">
                    </div>
                </div>

                <div class="form-inline">
                    <div class="label" v-if="item.shuttleType=='J'">抵达日期</div>
                    <div class="label" v-if="item.shuttleType=='S'">返程日期</div>
                    <div class="val">
                        <div class="select-box">
                            <picker mode="date" :value="item.beginDate" :start="start" :end="end" @change="e=>bindDateChange(e,i)">
                                <div class="picker-box">
                                    <div v-if="item.beginDate">{{item.beginDate}}</div>
                                    <div class="grey" v-else>
                                        <template v-if="item.shuttleType=='J'">
                                            请选择抵达日期
                                        </template>
                                        <template v-if="item.shuttleType=='S'">
                                            请选择返程日期
                                        </template>
                                    </div>
                                    <i class="iconfont icon-a-16_youlajiantou_hei"></i>
                                </div>

                            </picker>

                        </div>
                    </div>
                </div>
                <div class="form-inline" v-if="item.trafficType">
                    <div class="label" v-if="item.shuttleType=='J'">抵达时间</div>
                    <div class="label" v-if="item.shuttleType=='S'">返程时间</div>
                    <div class="val">
                        <div class="select-box">
                            <picker mode="time" :value="item.startTime" :start="start" :end="end" @change="e=>bindTimeChange(e,i)">
                                <div class="picker-box">
                                    <div v-if="item.startTime">{{item.startTime}}</div>
                                    <div class="grey" v-else>
                                        <template v-if="item.shuttleType=='J'">
                                            请选择抵达时间
                                        </template>
                                        <template v-if="item.shuttleType=='S'">
                                            请选择返程时间
                                        </template>
                                    </div>
                                    <i class="iconfont icon-a-16_youlajiantou_hei"></i>
                                </div>

                            </picker>

                        </div>
                    </div>
                </div>
                <div class="form-inline">
                    <div class="label">联系电话</div>
                    <div class="val">
                        <input class="input-text" v-model="item.mobile" cursor-spacing="40" maxlength="11" type="text" placeholder="请输入联系电话" placeholder-style="color: #CCCCCC;">
                    </div>
                </div>
                <div class="form-inline">
                    <div class="label">备注</div>
                    <div class="val">
                        <input class="input-text" v-model="item.remark" type="text" placeholder="如有更多说明，请填写备注" placeholder-style="color: #CCCCCC;">
                    </div>
                </div>
            </template>
        </div>
    </div>

    <div class="take-btns">
        <div class="btn" @click="addShuttle('J')" v-if="jGuestsPass"><i class="iconfont icon-a-20_jia_fangxing"></i>添加抵达接送</div>
        <div class="btn" @click="addShuttle('S')" v-if="sGuestsPass"><i class="iconfont icon-a-20_jia_fangxing"></i>添加返程接送</div>
    </div>
    <div class="footer" v-if="!allPass">
        <div class="btn-def baseBtn" @click="saveShuttle()">提交</div>
    </div>
</div>
</template>

<script setup lang="ts">
import {
    reactive,
    ref,
    computed,
    onMounted,
    watch
} from "vue";
import dayjs from "dayjs";
import UmengSDK from "@/utils/umengAdaptor.js";
import api from "@/utils/api";
import {
    onLoad
} from "@dcloudio/uni-app";
import {
    getStorage
} from "@/utils/wxuser";
import {
    jAlert3,
    jAlert5
} from "@/base/jAlert/jAlert";
import coustomHead from "@/components/coustomHead.vue";
import data from "@/base/cityData/data";
let config = getStorage("config")
let user = getStorage("user")
let end = "2099-01-01";
let start = dayjs().format("YYYY-MM-DD");
let orderNo = ref('')
let memberNo = ref('')
let arrivalGuests: any = ref([])
let returnGuests: any = ref([])
let reserveOrder: any = ref({})
let shuttleInfoJ: any = ref([])
let shuttleInfoS: any = ref([])
let saveData: any = ref([])
let allPass = ref(true)
let mobile = ref('')
let isAjax: any = ref(false)
let shuttleList = [{
        value: "T",
        name: "需要接送",
    },
    {
        value: "F",
        name: "无需接送",
    },
];
let trafficTypeList: any = ref([]);

let pickers = computed(() => {
    let pickers: any = [];
    saveData.value.forEach((item: any, i: number) => {
        pickers.push({
            isShuttleIndex: 0,
            isShuttleDesc: ''
        })
        shuttleList.forEach((n, j) => {
            if (n.value == item.isShuttle) {
                pickers[i].isShuttleDesc = n.name;
                pickers[i].isShuttleIndex = j
            }
        });

    });
    return pickers;
});
let sNum = computed(() => { //送数量
    let sNum = 0;
    saveData.value.forEach((item: any, i: number) => {
        if (item.shuttleType == 'S') {
            sNum++
        }
    })
    return sNum;
})
let jNum = computed(() => { //送数量
    let jNum = 0;
    saveData.value.forEach((item: any, i: number) => {
        if (item.shuttleType == 'J') {
            jNum++
        }
    })
    return jNum;
})
let jGuestsPass = computed(() => { //送数量
    let jGuestsNum = 0;
    let jGuestsPass = true
    saveData.value.forEach((item: any, i: number) => {
        if (item.shuttleType == 'J') {
             item.arrivalGuests.forEach((guest: any) => {
               if(guest.active){
                    jGuestsNum++
               }
            })
        }
    })
    arrivalGuests.value.forEach((item:any)=>{
        if(item.activeNotCan){
            jGuestsNum++
        }
    })
    if(jGuestsNum==arrivalGuests.value.length){
        jGuestsPass = false
    }
    return jGuestsPass;
})
let sGuestsPass = computed(() => { 
    let sGuestsNum = 0;
    let sGuestsPass = true
    saveData.value.forEach((item: any, i: number) => {
        if (item.shuttleType == 'S') {
             item.returnGuests.forEach((guest: any) => {
               if(guest.active){
                    sGuestsNum++
               }
            })
        }
    })
    returnGuests.value.forEach((item:any)=>{
        if(item.activeNotCan){
            sGuestsNum++
        }
    })
    if(sGuestsNum==returnGuests.value.length){
        sGuestsPass = false
    }
    return sGuestsPass;
})

const jNo = (val: any) => {
    var i = 0;
    saveData.value.forEach((item: any, j: number) => {
        if (j <= val) {
            if (item.shuttleType == 'J') {
                i++
            }
        }
    })
    return i
}
const sNo = (val: any) => {
    var i = 0;
    saveData.value.forEach((item: any, j: number) => {
        if (j <= val) {
            if (item.shuttleType == 'S') {
                i++
            }
        }
    })
    return i
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
const copy = (val: string) => {
    uni.setClipboardData({
        data: val,
        success: function () {
            jAlert3("复制成功")
        }
    });
}
const bindDateChange = (e: any, i: number) => {
    let beginDate = e.detail.value;
    saveData.value[i].beginDate = beginDate;

};
const bindTimeChange = (e: any, i: number) => {
    let startTime = e.detail.value;
    saveData.value[i].startTime = startTime;

};

const bindShuttleChange = (e: any, i: number) => {
    const index = e.detail.value;

    const newVal = shuttleList[index].value;
    saveData.value[i].isShuttle = newVal;

};
const bindTrafficTypeChange = (e: any, i: number) => {
    saveData.value[i].trafficType = trafficTypeList.value[e.detail.value].code;
    saveData.value[i].trafficTypeDesc = trafficTypeList.value[e.detail.value].descript;
};
const chooseGuest = (item: any, type: string) => {
    if (item.activeNotCan) {
        return
    }
    var active = item.active
    for (let i = 0; i < saveData.value.length; i++) {
        let data = saveData.value[i]
        if (type == 'S') {
            if (data.shuttleType == 'S') {
                data.returnGuests.forEach((guest: any) => {
                    if (guest.guestNo == item.guestNo) {
                        if (active) {
                            guest.activeNotCan = false
                        } else {
                            guest.activeNotCan = true
                        }
                    }
                })
            }
        }
        if (type == 'J') {
            if (data.shuttleType == 'J') {
                data.arrivalGuests.forEach((guest: any) => {
                    if (guest.guestNo == item.guestNo) {
                        if (active) {
                            guest.activeNotCan = false
                        } else {
                            guest.activeNotCan = true
                        }
                    }
                })
            }
        }

    }
    item.activeNotCan = false
    if (item.active) {
        item.active = false
    } else {
        item.active = true
    }
}
const delData = (i: any, type: string) => {
    if (type == 'J') {
        saveData.value[i].arrivalGuests.forEach((item: any) => {
            if (item.active) {
                chooseGuest(item, type)
            }
        })
    } else {
        saveData.value[i].returnGuests.forEach((item: any) => {
            if (item.active) {
                chooseGuest(item, type)
            }
        })
    }

    saveData.value.splice(i, 1)
}
const makePhone = (phoneNum: string) => {
    uni.makePhoneCall({
        phoneNumber: phoneNum,
    });
}
const addShuttle = (type: string) => {
    // for (let i = 0; i < saveData.value.length; i++) {
    // 	if (saveData.value[i].shuttleType == type) {

    // 		if (type == 'J') {
    // 		jAlert3('已存在未提交抵达接送信息，请提交')
    // 		}
    // 		if (type == 'S') {
    // 		jAlert3('已存在未提交返程接送信息，请提交')
    // 		}
    // 		return;

    // 	}
    // }

    if (type == 'S') {
        var isPass = false
        returnGuests.value.forEach((item: any) => {
            if (!item.active && !item.activeNotCan) {
                isPass = true
            }
        })

        if (!isPass) {
            jAlert3('已选择所有出行人信息')
            return;
        }
        
        var returnGuestsList = JSON.parse(JSON.stringify(returnGuests.value))
        returnGuestsList.forEach((item: any) => {
            if (item.active) {
                item.active = false
                item.activeNotCan = true
            }
           
        })
       
        saveData.value.push({
            "beginDate": "",
            "cityName": "",
            "guestNos": [],
            "guestName": "",
            "isShuttle": "",
            "mobile": "",
            "orderNo": orderNo.value,
            "remark": "",
            "shuttleType": type,
            "startTime": "",
            "station": "",
            "teamNo": "",
            "trafficType": "",
            "trips": "",
            "unitCode": config.hotelGroupCode,
            "returnGuests": returnGuestsList
        })
    } else {
        var isPass = false
        
        arrivalGuests.value.forEach((item: any) => {
            if (!item.active && !item.activeNotCan) {
                isPass = true
            }
        })
        if (!isPass) {
            jAlert3('已选择所有出行人信息')
            return;
        }
        var arrivalGuestsList = JSON.parse(JSON.stringify(arrivalGuests.value))
        arrivalGuestsList.forEach((item: any) => {
            if (item.active) {
                item.active = false
                item.activeNotCan = true
            }
        })
        saveData.value.splice(jNum.value, 0, {
            "beginDate": "",
            "cityName": "",
            "guestNos": [],
            "guestName": "",
            "isShuttle": "",
            "mobile": "",
            "orderNo": orderNo.value,
            "remark": "",
            "shuttleType": type,
            "startTime": "",
            "station": "",
            "teamNo": "",
            "trafficType": "",
            "trips": "",
            "unitCode": config.hotelGroupCode,
            "arrivalGuests": arrivalGuestsList
        });

    }

}
const saveShuttle = () => {
    let shuttleNum = 0

    for (let i = 0; i < saveData.value.length; i++) {
        let data = saveData.value[i]
        let tipsText = '抵达'
        if (data.shuttleType == 'S') {
            tipsText = '返程'
        }
        let hasGuest = false
        data.guestNos = []
        data.hasGuest = false
        if (data.shuttleType == 'S') {
           
            data.returnGuests.forEach((guest: any) => {
                if (guest.active) {
                    data.guestNos.push(guest.guestNo)
                    hasGuest = true
                   
                }
            })
            
        } else { 
            data.arrivalGuests.forEach((guest: any) => {
               
                if (guest.active) {
                    data.guestNos.push(guest.guestNo)
                    hasGuest = true
                   
                    
                }
            })
            
        }
      
     
        if (hasGuest) {
            data.hasGuest = true
            shuttleNum++
            if (!data.isShuttle) {
                jAlert3(`请选择${tipsText}接站需求`)
                return;
            }
            if (data.isShuttle == 'T') {
                if (!data.trips) {
                    if (data.trafficType == 'aircraft') {
                        jAlert3(`请选择航班号`)
                        return;
                    }
                    if (data.trafficType == 'train') {
                        jAlert3(`请选择列车号`)
                        return;
                    }
                }
                if (!data.station) {
                    jAlert3(`请选择${tipsText}站点`)
                    return;
                }
                if (!data.beginDate) {
                    jAlert3(`请选择${tipsText}日期`)
                    return;
                }
                if (!data.beginDate) {
                    jAlert3(`请选择${tipsText}日期`)
                    return;
                }
                if (!data.startTime) {
                    jAlert3(`请选择${tipsText}时间`)
                    return;
                }
                if (!data.mobile) {
                    jAlert3(`请输入${tipsText}联系电话`)
                    return;
                }
            }
        }
        
    }
    if (isAjax.value) {
        return
    }
    if (saveData.value.length <= 0) {
        jAlert3(`请添加抵达接送或返程接送`)
        return
    }
    if (shuttleNum == 0) {
        jAlert3(`请选择接送人`)
        return
    }
    isAjax.value = true

    uni.showModal({
        title: '确认提交',
        content: '接送信息提交后，如需修改请联系顾问或管家。',
        cancelText: '返回',
        confirmText: '确认',
        confirmColor: '#000000',
        success: (res: any) => {
            console.log(res)
            if (res.confirm) {
                let index = 0
                console.log(saveData.value)
                saveData.value.forEach((item: any) => {
                    console.log(item)
                    if (item.hasGuest) {
                        var obj = item
                        obj.unitCode = config.hotelGroupCode
                        obj.orderNo = orderNo.value
                        obj.teamNo = reserveOrder.value.teamNo
                        api.interfaceTransfer({
                                query: obj,
                                config: {
                                    "interfaceType": "POST",
                                    "interfaceModule": "GC_TRAVEL_ORDER",
                                    "interfaceMethod": `/api/shuttle/save`,
                                    "interfaceFrom": "GC",
                                    "hotelGroupCode": config.hotelGroupCode
                                }
                            })
                            .then((res: any) => {
                                if (res.result == 1 && res.retVal.result == 0) {

                                    
                                    UmengSDK.sendEvent("pup_fillout_clk", {
                                        page_name: "travel_detail_pg",
                                        page_title_name: "接送信息",
                                        page_id: "",
                                        pickup_name: obj.guestName,
                                        arrived_type: obj.trafficType,
                                        arrived_date: obj.beginDate,
                                        phone_number: obj.mobile,
                                        flight_number: obj.trafficType == '飞机' ? obj.trips : '',
                                        train_number: obj.trafficType != '飞机' ? obj.trips : '',
                                        remark: obj.remark,
                                        site_information: obj.station,
                                        pickup_service: obj.shuttleType == 'J' ? '抵达接站' : '返程送站'
                                    });
                                    index++
                                    if (index == shuttleNum) {
                                        jAlert3(`提交成功`)
                                        isAjax.value = false
                                        listByOrderNo()
                                        uni.navigateBack({
                                            delta: 1

                                        })
                                    }
                                }
                            })
                    }

                })

            } else {
                isAjax.value = false
            }
        },
    })

}
const listByOrderNo = () => {
    api.interfaceTransfer({
            query: {
                "orderNo": orderNo.value,
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

                if (res.retVal.retVal.length <= 0) {
                    arrivalGuests.value.forEach((item: any) => {
                        if (item.mobile == mobile.value) {
                            item.active = true
                        }
                    })
                    returnGuests.value.forEach((item: any) => {
                        if (item.mobile == mobile.value) {
                            item.active = true
                        }
                    })
                    saveData.value = [{
                            "beginDate": "",
                            "cityName": "",
                            "guestNos": [],
                            "guestName": "",
                            "isShuttle": "",
                            "mobile": "",
                            "orderNo": orderNo.value,
                            "remark": "",
                            "shuttleType": "J",
                            "startTime": "",
                            "station": "",
                            "teamNo": "",
                            "trafficType": "",
                            "trips": "",
                            "unitCode": config.hotelGroupCode,
                            "arrivalGuests": arrivalGuests.value
                        },
                        {
                            "beginDate": "",
                            "cityName": "",
                            "guestNos": [],
                            "guestName": "",
                            "isShuttle": "",
                            "mobile": "",
                            "orderNo": orderNo.value,
                            "remark": "",
                            "shuttleType": "S",
                            "startTime": "",
                            "station": "",
                            "teamNo": "",
                            "trafficType": "",
                            "trips": "",
                            "unitCode": config.hotelGroupCode,
                            "returnGuests": returnGuests.value
                        }
                    ]
                    allPass.value = false
                } else {
                    saveData.value = []
                    shuttleInfoJ.value = []
                    shuttleInfoS.value = []
                    let chooseNumJ = 0
                    let chooseNumS = 0
                    res.retVal.retVal.forEach((item: any) => {
                        item.trafficTypeDesc = getTrafficType(item.trafficType)

                        item.beginDateF = dayjs(item.beginDate).format('M月D日')
                        if (item.shuttleType == 'J') {
                           
                            item.guests.forEach((guest: any) => {
                                arrivalGuests.value.forEach((arrivalGuest: any) => {
                                    if (guest.guestNo == arrivalGuest.guestNo) {
                                        arrivalGuest.active = false
                                        arrivalGuest.activeNotCan = true
                                        chooseNumJ++
                                    }
                                })
                            })
                           
                            shuttleInfoJ.value.push(item)
                        }
                        if (item.shuttleType == 'S') {
                           
                            item.guests.forEach((guest: any) => {
                                returnGuests.value.forEach((returnGuest: any) => {
                                    if (guest.guestNo == returnGuest.guestNo) {
                                        returnGuest.active = false
                                        returnGuest.activeNotCan = true
                                        chooseNumS++
                                    }
                                })
                            })
                          
                          
                            shuttleInfoS.value.push(item)
                        }
                    })
                    if(chooseNumJ<arrivalGuests.value.length){
                        allPass.value = false
                    }
                    if(chooseNumS<arrivalGuests.value.length){
                        allPass.value = false
                    }

                }

            } else {
                jAlert3(res.retVal.msg || res.msg)
            }
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

const orderDetail = () => {
    api.orderDetail({
        memberNo: memberNo.value || user.memberId,
        hotelGroupCode: config.hotelGroupCode,
        hotelCode: config.hotelCode,
        travelOrderNo: orderNo.value,
        memberId: memberNo.value || user.memberId,
        mobile: mobile.value || user.mobile
    }).then((res: any) => {
        if (res.result == 1) {
            reserveOrder.value = res.retVal.reserveOrder
            arrivalGuests.value = JSON.parse(JSON.stringify(res.retVal.guests))
            returnGuests.value = JSON.parse(JSON.stringify(res.retVal.guests))
            

            listCodeBase(() => {
                listByOrderNo()
            })

        } else {
            jAlert3(res.msg)
        }
    });
}
onLoad((options: any) => {
    if (options.memberNo) {
        memberNo.value = options.memberNo
    }
    if (options.mobile) {
        mobile.value = options.mobile
    } else {
        mobile.value = user.mobile
    }

    orderNo.value = options.orderNo
    orderDetail()

})
onMounted(() => {

});
</script>

<style lang="less" scoped>
@import url("~@/styles/mixin.less");
@import url("~@/styles/skin.less");

.ui_takeInfo {
    padding-bottom: calc(80px + constant(safe-area-inset-bottom));
    padding-bottom: calc(80px + env(safe-area-inset-bottom));

    .form-infos {
        margin: 0 16px;

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
                    font-size: 20px;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-weight: normal;
                    color: #000;

                }
            }

            .form-inline {
                display: flex;
                padding: 1px 12px;

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
                    height: 46px;
                    width: 88px;
                }

                .val {
                    display: flex;
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
                            color: #CCCCCC;
                        }

                    }

                    .radio-box {
                        width: 100%;
                        display: flex;
                        flex-wrap: wrap;
                        align-items: center;

                        .radio-item {
                            position: relative;
                            display: flex;
                            overflow: hidden;
                            align-items: center;
                            justify-content: center;
                            padding: 0 15px;
                            box-sizing: border-box;
                            height: 30px;
                            border-radius: 4px;
                            border: 0.5px solid #ccc;
                            font-size: 14px;
                            margin: 6px 0;
                            margin-right: 12px;

                            &.activeNotCan {
                                color: rgb(204, 204, 204);
                                border: 1px solid rgb(204, 204, 204);

                            }

                            &:nth-child(3n) {
                                margin-right: 0;
                            }

                            .iconfont {}

                            .icon-a-16_xuanzhongjiaobiao_youxiajiao_hongse {
                                position: absolute;
                                right: -1px;
                                bottom: -1px;
                                display: none;
                                width: 16px;
                                height: 16px;
                            }

                            &.active {
                                font-weight: 500;
                                color: #000;
                                border: 1px solid #A43127;

                                .icon-a-16_xuanzhongjiaobiao_youxiajiao_hongse {
                                    display: block;
                                }

                                .iconfont {
                                    display: block;
                                    color: #A43127;

                                    &.icon-a-16_xuanzhongjiaobiao_youxiajiao_hongse {
                                        color: #A43127;
                                        font-size: 16px;
                                        right: -1px;
                                        bottom: -1px;
                                    }
                                }

                            }

                            &:first-child {
                                margin-left: 0;
                            }

                            &.invalid {
                                color: #CCCCCC;
                                border: 1px solid #ccc;
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

                    .select-box {
                        width: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                        .text {
                            font-size: 14px;
                            color: #CCCCCC;
                        }

                        .val {
                            font-size: 14px;
                            color: #000;
                        }

                        .icon-danxuan_weixuan,
                        .icon-danxuan_yixuan {
                            font-size: 18px;
                        }
                    }
                }

                .already-box {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    padding-left: 16px;
                    background: #F8F8F8;
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
                        background: #F8F8F8;
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

            .add-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 52px;
                width: 100%;
                font-size: 14px;
                color: #000;
            }
        }
    }

    .take-btns {
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;

        .btn {
            display: flex;
            flex: 1;
            height: 52px;
            align-items: center;
            justify-content: center;
            background: #FFFFFF;
            border-radius: 8px;
            font-size: 14px;
            color: #000;

            &:first-child {
                margin-right: 12px;
            }

            .icon-a-20_jia_fangxing {
                font-size: 20px;
                margin-right: 8px;
            }
        }
    }

    .footer {
        padding: 12px 16px;
        position: fixed;
        width: 100%;
        left: 0;
        bottom: 0;
        z-index: 2;

        border-top: 0.5px solid #EEEEEE;
        background: #fff;
        padding-bottom: calc(12px + constant(safe-area-inset-bottom));
        padding-bottom: calc(12px + env(safe-area-inset-bottom));

        .btn-def {
            line-height: 44px;
            height: 44px;
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
                font-size: 18px;
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
        height: 40px;
        background-color: rgba(219, 137, 0, 0.12);
        display: flex;
        align-items: center;
        padding: 0 16px;
        font-size: 14px;
        color: #DB8900;

        .iconfont {
            margin-right: 8px;
            color: #DB8900;
        }
    }
}
</style>
