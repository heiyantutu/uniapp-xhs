<template>
    <div class="ui_travelItem">
        <div class="hotel" @click="chooseItem(travelItem)">
            <img :src="travelItem.urls[0].url + '?imageView2/1/w/343/h/258&x-oss-process=image/resize,m_fill,w_343,h_258'"
                v-if="travelItem.urls && travelItem.urls.length > 0" alt="" class="logo" mode="aspict">
            <div class="hotelInfo">
                <p class="hotelName">{{ travelItem.title }}</p>
                <div class="infoLine" v-for="(tag, tagIndex) in travelItem.tagApiDtos" :key="tagIndex">
                    <div class="tag">{{ tag.tageDesc }}</div>
                </div>
                <p class="price"><span class="money">￥{{ travelItem.startingPrice }}</span>/套起</p>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
    name: "travelItem",
    components: {},
    props: {
        travelItem: {
            type: Object,
            default: {

            }
        },
    },
    emits: ["chooseItem"],
    setup(props, context) {
        const chooseItem = (item: Object) => {
            context. emit("chooseItem", item);
        };
        return {
            chooseItem
        };
    },
});
</script>
<style lang="less" scoped>
.ui_travelItem {
    .hotel {
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 12px;

        .logo {
            width: 100%;
            height: 258px;
        }

        .hotelInfo {
            padding: 10px 12px;

            .hotelName {
                font-size: 16px;
                color: #000000;
                font-weight: bold;
                margin-bottom: 9px;
            }

            .subTitle {
                font-size: 12px;
                color: #808080;
                margin-bottom: 9px;
            }

            .line {
                display: flex;
                margin-bottom: 9px;
            }

            .infoLine {
                display: flex;
                margin-bottom: 9px;
                align-items: center;

                .infoDesc {
                    font-size: 14px;
                    color: #808080;
                }

                .tag {
                    margin-right: 10px;
                }
            }

            .tag {
                background: rgba(164, 49, 39, 0.12);
                font-size: 12px;
                color: #a43127;
                padding: 2px;
                margin-right: 3px;
                border-radius: 4px;
            }

            .price {
                font-size: 12px;
                color: #808080;

                .money {
                    font-size: 18px;
                    color: #000000;
                    font-weight: bold;
                }
            }
        }
    }
}
</style>