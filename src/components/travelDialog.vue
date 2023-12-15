<template>
<div class="travelDialog_ui">
    <bottom-dialog ref="travel" :title="travelTitle" maxDialog=true>
        <div class="product-info-box" v-if="travelDetail.itineraryDtos&&travelDetail.itineraryDtos.length>0">
           
            <div class="routes">
                <div class="route" v-for="(item,i) in travelDetail.itineraryDtos" :key="i"
                    :class="{'active':item.active}" @click="chooseTravel(item)">
                    <div class="label">{{item.itineraryDesc}}</div>
                    <div class="val">{{item.itineraryShortDesc}}</div>
                </div>

            </div>
            
            <div class="dates-box" >
                <div class="dates">
                    <template v-for="(item,i) in dailyPriceList" :key="i">
                        <div class="date" 
                            :class="{active:item.groupBeginDate==curDailyPrice.groupBeginDate}"
                            @click="chooseDate(item)" v-if="item.show">
                            <div class="label">{{item.week}}</div>
                            <div class="val">{{item.MMdd}}</div>
                            <div class="price">¥{{item.price}}</div>


                        </div>
                    </template>
                    
                </div>
            </div>
        </div>
        
        <div class="travel-dates" v-if="itineraryDtos.dayDtos">

            <div class="travel-date-item" v-for="(item,i) in itineraryDtos.dayDtos" :key="i" :class="{open:item.open}">
                <div class="travel-date">
                    <div class="travel-date-lf">
                        <div class="label">
                            DAY
                        </div>
                        <div class="val">{{item.rsvDay}}</div>
                    </div>
                    <div class="travel-date-rt">
                        <div class="head">
                            {{item.placeOfDepartureDesc}} > {{item.destinationDesc}}
                        </div>
                        <div class="tl" @click="openItinerary(item)">
                            {{item.descript}}
                            <i class="icon-a-16_xialajiantou_hei iconfont"></i>
                        </div>
                        <div class="desc">
                            {{item.dayTitle}}
                        </div>
                    </div>
                </div>
                <div class="day-travel-list">
                    <div class="day-travel" v-for="(dayDetail,j) in item.dayDetailDtos" :key="j">
                        <div class="icon">
                            <img :src="dayDetail.titlesIcon" class="iconfont">
                        </div>

                        <div class="day-travel-info">
                            <div class="day-travel-tl">
                                {{dayDetail.title}}
                            </div>
                            <div class="day-travel-desc">{{dayDetail.descript}}</div>
                            <div class="day-travel-img-box">
                                <image :src="dayDetail.productUrl" class="day-travel-img" mode="widthFix" v-if="dayDetail.productUrl"></image>
                                <div class="day-travel-name">
                                    {{dayDetail.timeSlot}}
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    </bottom-dialog>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted,
    reactive,
    ref,
	watch
} from "vue";
import bottomDialog from "@/components/bottomDialog.vue";
import api from "@/utils/api";
import dayjs from "dayjs";
import {
    getStorage
} from "@/utils/wxuser";
import defaultOtaChannel from "@/utils/defaultOtaChannel";

let config = getStorage('config');
let user = getStorage('user')
export default defineComponent({
    name: "traveDialog", 
    props: {

		travelType: {
		    type: Object,
		   default: () => {
		     return {};
		   },
		},
        travelTitle: {
		  type: String,
		   default: () => {
		     return "";
		   },
		},
        travelGroupCodes: {
		  type: Object,
		   default: () => {
		     return [];
		   },
		},
    },
    components: {
        bottomDialog
    },
    setup(props) {

		watch(() => props.travelType, (newVal, oldVal) => {
			findTravelProductForWechatDetail()
		})
        let itineraryDtos:any = ref({})
        let curDailyPrice : any = ref({});//当前价格日历
        let otaChannel = ref(defaultOtaChannel);
        let isAjax = ref(false)
		let travel:any = ref()
        let dailyPriceList:any = ref([])
        let travelDetail : any = ref({});
		const openItinerary = (item : any) => {
			item.open ? item.open = false : item.open = true
		}
		const showDialog = () => {
			travel.value.showDialog()
		}
        const chooseDate = (item : any) => {
            item.canTap = true
            
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
                    "travelType": travelDetail.value.travelType
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
                    dailyPriceList.value = []
                    if (res.result == 1 && res.retVal.result == 0) {
                        
                        const info = res.retVal.retVal
						for(let i=0;i<info.length;i++){
							let pass = false
							var item = info[i]
							props.travelGroupCodes.forEach((product:any)=>{
								if(product==item.travelGroupCode){
									pass = true
								}
							})
							if(!pass){
								info.splice(i, 1);
								i--;
							}	
						}
                        info.forEach((item : any) => {
                            const dailyDetail = item
                            // dailyDetail.groupBeginDate = "2023-08-23 00:00:00"
                            dailyDetail.embarkDate = item.groupBeginDate
                            dailyDetail.MMdd = dayjs(item.groupBeginDate).format('MM/DD')
                            if (dayjs().diff(item.groupBeginDate, 's') < 0) {
								item.show = true
							
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

                            dailyDetail.groupEndDate = dayjs(dailyDetail.groupBeginDate).add( travelDetail.value.itineraryDays - 1, 'days').format('YYYY-MM-DD hh:mm:ss')
                            dailyDetail.number = dailyDetail.productAvailNum

                           
                            dailyDetail.price = dailyDetail.minPrice
                          
                            dailyDetail.groupBeginDateFormat = dayjs(dailyDetail.groupBeginDate).format('MM月DD日')
                            dailyDetail.groupBeginDateFormat2 = dayjs(dailyDetail.groupBeginDate).format('MM.DD')
                            dailyDetail.groupEndDateFormat = dayjs(dailyDetail.groupEndDate).format('MM月DD日')
                            dailyPriceList.value.push(dailyDetail)
                            // item.specificationsPriceDtos.forEach((priceDto : any) => {
                            // 	// if (priceDto.specificationsType != itineraryDtos.value.specificationsType) {


                            // 	// }
                            // })


                        })
                        console.log(dailyPriceList.value)


                    }
                })
        }
        const chooseTravel = (item : any) => {	
            if (isAjax.value||item.itineraryCode==itineraryDtos.value.itineraryCode) {
                return;
            }
            isAjax.value = true

            travelDetail.value.itineraryDtos.forEach((itinerary : any) => {
                itinerary.active = false
            })
            item.active = true
            itineraryDtos.value = item
            listTravelProductDailyDetail()
        
        }
        const findTravelProductForWechatDetail = () => {
            api.interfaceTransfer({
                query: {
                    "unitCode": config.hotelGroupCode,
                    "travelType":props.travelType,
                    "ota": "DIRECT",
                    "otaChannel": "wechat"
                },
                config: {
                    "interfaceType": "POST",
                    "interfaceModule": "GC_PRODUCT_JOURNEY",
                    "interfaceMethod": "/api/travelGroup/findTravelProductForWechatDetail",
                    "interfaceFrom": "GC",
                    "hotelGroupCode": config.hotelGroupCode
                }
            }).then((res: any) => {
                if (res.result == 1 && res.retVal.result == 0) {
                    const info = res.retVal.retVal
                    travelDetail.value = JSON.parse(JSON.stringify(info[0]))
                    travelDetail.value.itineraryDtos = []
					console.log(props.travelGroupCodes)
					if(props.travelGroupCodes.length>0){
						for(let i:any=0;i<info.length;i++){
							let item = info[i]
							props.travelGroupCodes.forEach((code:any)=>{
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
						
						if (item.itineraryDtos.length > 0) {
							item.itineraryDtos.forEach((itineraryDto : any) => {
                                
								itineraryDto.dayDtos.forEach((days : any,i:number) => {
									days.dayTitle = ''
									if(i==0){
										days.open = true
									}
									days.dayDetailDtos.forEach((day : any) => {
										if (day.picture) {
											day.picture = day.picture.split(',')
										}
										if (!days.dayTitle) {
											days.dayTitle = day.title
										} else {
											days.dayTitle = ' - ' + day.title
										}
						
									})
								})
                                travelDetail.value.itineraryDtos.push(itineraryDto)
							})
						}
					})
				
					if( travelDetail.value.itineraryDtos.length>0){
                        
                        travelDetail.value.itineraryDtos[0].active = true
						itineraryDtos.value =  travelDetail.value.itineraryDtos[0]
					}

             
					
					listTravelProductDailyDetail()

                }
            });

        }
        onMounted(() => {
           
            
        })
        return {
            findTravelProductForWechatDetail,
            itineraryDtos,
			travel,
			openItinerary,
			showDialog,
            travelDetail,
            dailyPriceList,
            otaChannel,
            isAjax,
            chooseTravel,
            curDailyPrice,
            chooseDate
        }
    }
});
</script>

<style lang="less" scoped>
 .product-info-box {
	position: sticky;
	top: -1px;
	left: 0;
	background-color: #f8f8f8;
	z-index: 9;
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
						&.mini-tl{
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
				padding-top: 24px;
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
.travel-dates {
	// overflow-y: scroll;
	// height: calc(80vh);
    padding: 12px 16px;
   
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
    			}
    		}
    	}
    
    	&.open {
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
    			border-left: 1px dashed #eee;
    			left: 25px;
    		}
    
    		.day-travel {
    			position: relative;
    			display: flex;
    			margin-top: 18px;
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
    				width: 50px;
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

        .travel-date-lf {
            position: relative;
            width: 50px;

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
                padding-right: 16px;
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
}
</style>
