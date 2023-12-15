<template>
<div class="exchangeDialog_ui">
    <bottom-dialog ref="exchangeDialog" title="选择要兑换的券" maxDialog>
        <div class="counponList">
            <div class="counpon" v-for="(item,i) in counponList" :key="i">
                <div class="counpon-box pack">
                    <div class="couponNo" :class="{'invalid':item.couponSta!='I'}">
                        <div class="couponNo-box">
                            <div class="tag" v-if="counponList.length>1">券{{i+1}}</div>
                            <div class="no">{{item.couponNo}}</div>
                        </div>
                        <template v-if="item.couponSta=='I'">
                            <image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/select.png" mode="" class="icon-img" v-if="item.choosed" @click="choose(item)" />
                            <image src="https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/unSelect.png" mode="" class="icon-img" v-else @click="choose(item)" />
                        </template>

                        <div class="invalid-desc" v-else-if="item.couponSta == 'O' || item.couponSta == 'U'">已核销
                        </div>
                        <div class="invalid-desc" v-else>已失效</div>
                    </div>
                </div>

                <div class="product" v-if="item.productNum>0">
                    <div class="product-tl">可兑产品（每张券限兑1个产品）</div>
                    <template v-for="(product,index) in productDtoList" :key="index">

                        <div class="travelersInfo-item" v-if="item.couponNo == product.couponNo" @click="showDetail(product)">
                            <div class="val">
                                <div class="val-txt">{{product.title}}</div><i class="iconfont icon-a-12_youlajiantou_hui"></i>
                            </div>
                        </div>
                    </template>

                </div>
            </div>
        </div>
        <div class="next-btn">
            <div class="btn baseBtn" @click="goExchange()">下一步</div>
        </div>

    </bottom-dialog>
</div>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted,
    ref,
    watch,
    computed
} from "vue";
import bottomDialog from "@/components/bottomDialog.vue";
import api from "@/utils/api";
import {
    getStorage
} from "@/utils/wxuser";
import {
    jAlert3
} from "@/base/jAlert/jAlert";
import {
    goPage
} from "@/utils/utils";
let config = getStorage('config');
let user = getStorage('user')
export default defineComponent({
    name: "exchangeDialog",
    props: {

        orderId: {
            type: String,
            default: () => {
                return "";
            },
        },
    },
    components: {
        bottomDialog
    },
    setup(props) {
        const couponCodeUseConfigProductDtoList: any = ref([])
        const reserveOrder: any = ref({})
        const counponList: any = ref([])
        const travelList: any = ref([])
        const exchangeDialog = ref()
        const productDtoList: any = ref([])
		const shopGoods:any = ref({})

        watch(() => props.orderId, (newVal, oldVal) => {
            counponList.value = []
            getShopOrder()
        })
        const goExchange = () => {
            let counpon: any = {}
            counponList.value.forEach((item: any) => {
                if (item.choosed) {
                    counpon = item
                }
            })
            if (!counpon.couponNo) {
                jAlert3('请选择兑换券')
                return
            }
            goPage(`/pagesB/exchangeCoupon/exchangeList?couponNo=${counpon.couponNo}`)
        }
        const choose = (item: any) => {
            counponList.value.forEach((counpon: any) => {
                counpon.choosed = false
            })
            item.choosed = true
        }
        const showDialog = () => {
            exchangeDialog.value.showDialog()
        }
        const showDetail = (item: any) => {
            goPage(`/pagesB/travel/travelDetail?travelType=${item.travelType}&couponNo=${item.couponNo}`)

        }
        const getShopOrder = () => {
            couponCodeUseConfigProductDtoList.value = []
            counponList.value = []
            api.shopOrderDetail({
                equipment: config.equipment,
                hotelGroupCode: config.hotelGroupCode,
                hotelGroupId: config.hotelGroupId,
                id: props.orderId
            }).then((res: any) => {
                if (res.result == 1) {

                    reserveOrder.value = res.retVal
                    counponList.value = reserveOrder.value.listShopOrderItemVO[0].counponList
					shopGoods.value = reserveOrder.value.listShopOrderItemVO[0].shopGoods
                    if (counponList.value.length > 0) {
                
						
                        counponList.value.forEach((counpon: any) => {

                            if (counpon.couponSta == 'I') {
								let products: any = []
                                counpon.couponCodeUseConfigProductDtoList.forEach((item: any) => {
                                    item.couponNo = counpon.couponNo
                                    products.push(item)

                                })
                                travelProductList(products,counpon)

                            }
                        })

                    }
                }
            });
        }

       const travelProductList = (list:any,counpon:any) => {
		productDtoList.value = []
		let travelGroupCodes: any = []
		let travelTypes:any= []
		let itineraryCodes:any= []
        let categorySubs:any= [] 
		var opt:any = {
            "unitCode":config.hotelGroupCode,
			"hotelGroupCode": config.hotelGroupCode
		}
		
		
		list.forEach((item:any)=>{
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
			.then((res : any) => {
				if (res.result == 1 && res.retVal.result == 0) {
					let productList = res.retVal.retVal
					counpon.productNum = productList.length
					productList.forEach((item: any) => {
						item.couponNo = counpon.couponNo
						
						productDtoList.value.push(item)
					})
				}
				
			});

	}
        onMounted(() => {
            // travelProductList()

        })
        return {
            couponCodeUseConfigProductDtoList,
            getShopOrder,
            counponList,
            reserveOrder,
            travelProductList,
            travelList,
            exchangeDialog,
            showDialog,
            productDtoList,
            choose,
            goExchange,
            showDetail,
			shopGoods
        }
    }
});
</script>

<style lang="less" scoped>
@import url("~@/styles/skin.less");
@import url("~@/styles/mixin.less");

.counponList {

    margin: 0 16px;
    padding-bottom: 100px;
    padding-bottom: calc(100px + constant(safe-area-inset-bottom));
    padding-bottom: calc(100px + env(safe-area-inset-bottom));

    .counpon {

        margin-top: 12px;
        padding: 16px 12px;
        background: #fff;
        border-radius: 8px;

        .counpon-box {
            display: flex;
            justify-content: center;

            &.pack {
                justify-content: flex-start;
            }
        }

        .icon-img {
            width: 16px;
            height: 16px;
        }

        .product {
            margin-top: 12px;

            .product-tl {
                color: #808080;
                font-size: 14px;
            }
        }

        .travelersInfo-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0 0;

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

        .couponNo {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;

            .couponNo-box {
                display: flex;
                align-items: center;
            }

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

.next-btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    border-top: 0.5px solid #EEEEEE;
    padding: 12px 16px;
    background: #fff;
    padding-bottom: calc(12px + constant(safe-area-inset-bottom));
    padding-bottom: calc(12px + env(safe-area-inset-bottom));

    .btn {
        margin-top: 12px;
        line-height: 48px;
        height: 48px;
    }
}
</style>
