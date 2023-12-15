<template>
  <div class="ui_roomList">
    <div class="room" v-for='(room, roomIndex) in productRoomList' :key='roomIndex'>
      <image
        :src="room.gcRoomExtra.logo ? room.gcRoomExtra.logo : 'https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/hotel/images/noPic.png'"
        alt="" mode='aspectFill' class="logo"
        @click="preview(room.gcRoomExtra.logo ? room.gcRoomExtra.logo : 'https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/hotel/images/noPic.png',room.gcRoomExtra.pictures)" />
      <div class="roomTypeBox">
        <div class="roomTypeTitle">
          <p class="roomName">{{ room.roomDescript }}</p>
          <p class="aboutDes">
            <span class="aboutItem">{{ room.gcRoomExtra.bedType }}床</span>
            <span class="aboutItem">{{ room.gcRoomExtra.squareMeter }}</span>
            <!-- <span class="aboutItem">{{ room.gcRoomExtra.floor }}</span> -->
          </p>
        </div>
        <div class="theRoom" v-for='(roomType, roomTypeIndex) in room.gcProductBases' :key='roomTypeIndex'
          v-bind:class="{ gray: room.isFull == 'true' }">
          <div class="leftPart" @click.stop="setCurrentRoom(roomType,room)">
            <p class="roomTitleDesc"><i class="icon iconfont icon-a-12_fangjian"></i>{{ roomType.showName }}</p>
            <div class="priceItem">
              <span class="money">¥{{roomType.pbMinPriceWithPromotion}}</span>/晚
            </div>
          </div>
          <div class="rightPart">
            <div class="goBtn" :class="{'disabled':roomType.minSaleNum <= 0||roomType.bookAble!=='T'}">
              <template v-if="roomType.bookAble == 'T'">
                <template v-if="roomType.minSaleNum <= 0">
                  <div class="ydBtn ydBtn2">
                    <p class="ydDes2">满房</p>
                  </div>
                </template>
                <template v-else>
                  <template v-if="!(user && user.memberId) && roomType.notMemberBook == 'F'">
                    <div class="ydBtn" @click.stop="goLogin()">
                      <p class="ydDes">预订</p>
                      <!-- <p class="ydWay" v-if='isShowBtnInfo'>在线付</p> -->
                    </div>
                  </template>
                  <template v-else>
                    <template v-if="roomType.payMethod == 'SCORE'">
                      <div class="ydBtn" @click.stop="goBookInfo(roomType,room)"
                        v-if="user.pointBalance >= roomType.pbMinPriceWithPromotion">
                        <p class="ydDes">兑换</p>
                      </div>
                      <div class="ydBtn ydBtn2" v-else>
                        <p class="ydDes2">兑换</p>
                      </div>
                    </template>
                    <template v-else-if="roomType.payMethod == 'TICKET'">
                      <div class="ydBtn" @click.stop="goBookInfo(roomType,room)">
                        <p class="ydDes">券兑换</p>
                      </div>
                    </template>
                    <template v-else>
                      <template v-if="roomType.payMethod == 'PP' || roomType.payMethod == 'SCORE_PP'">
                        <div class="ydBtn" @click.stop="goBookInfo(roomType,room)">
                          <p class="ydDes">预订</p>
                        </div>
                      </template>
                      <template v-else>
                        <div class="ydBtn" @click.stop="goBookInfo(roomType,room)">
                          <p class="ydDes">预订</p>
                        </div>
                      </template>
                    </template>
                  </template>
                </template>
              </template>
              <template v-else>
                <div class="ydBtn ydBtn2">
                  <p class="ydDes2">不可订</p>
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="packageBox" v-if="room.travelList&&room.travelList.length>0">
          <p class="packageTopTitle">推荐套餐</p>
          <div class="theRoom" v-for="(packageItem,packageItemIndex) in room.travelList" :key="packageItemIndex">
            <div class="leftPart" @click.stop="setCurrentPack(room.gcProductBases[0],room,packageItem)">
              <p class="roomTitleDesc"><i class="icon iconfont icon-a-12_jiudiantaocan_hui"></i>{{packageItem.title}}
              </p>
              <div class="priceItem">
                <p><span class="money">¥{{packageItem.price}}</span>/{{packageItem.unit}}</p>
                <p class="money2" v-if="packageItem.price2">{{packageItem.price2}}</p>
              </div>
            </div>
            <div class="rightPart">
              <div class="goBtn">
                <div class="ydBtn">
                  <p class="ydDes" @click="goPackItem(packageItem)">预订</p>
                </div>
              </div>
            </div>
          </div>
          <div class="seeMore" v-if="room.travelList&&room.travelList.length<room.travelWechatHotelDetailDtos.length"
            @click="showTravelAll(roomIndex)">
            查看其他套餐<i class="icon iconfont icon-a-16_xialajiantou_hei"></i>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script  lang="ts">
import { defineComponent } from "vue";
import { toLogin } from "@/utils/utils";
import { previewImage } from "@/utils/platform";
export default defineComponent({
  name: "roomList",
  props: {
    fromDate: {
      type: String,
      default: () => {
        return "";
      },
    },
    toDate: {
      type: String,
      default: () => {
        return "";
      },
    },
    productRoomList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    user: {
      type: Object,
      default: () => {
        return {};
      },
    },
    hotel: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  emits: ["showCurrentRoom", "goBook", "showTravelAll", "goPackItem"],
  setup(props, { emit }) {
    const preview = (current: string, urls: string) => {
      let imgUrl = [current];
      if (urls) {
        imgUrl = imgUrl.concat(urls.split(";"));
      }
      previewImage({
        current: current,
        urls: imgUrl,
      });
    };
    const goBookInfo = (roomType: AnyObject, room: AnyObject) => {
      emit("goBook", {
        roomType,
        room,
        type: "room",
      });
    };
    const goLogin = () => {
      toLogin();
    };
    const setCurrentRoom = (roomType: AnyObject, room: AnyObject) => {
      emit("showCurrentRoom", {
        roomType,
        room,
        type: "room",
      });
    };
    const showTravelAll = (roomIndex: number) => {
      emit("showTravelAll", {
        roomIndex,
      });
    };
    const setCurrentPack = (
      roomType: AnyObject,
      room: AnyObject,
      pack: AnyObject
    ) => {
      emit("showCurrentRoom", {
        roomType,
        room,
        pack,
        type: "pack",
      });
    };
    const goPackItem = (item: AnyObject) => {
      emit("goPackItem", item);
    };
    return {
      goBookInfo,
      goLogin,
      setCurrentRoom,
      showTravelAll,
      setCurrentPack,
      preview,
      goPackItem,
    };
  },
});
</script>
<style lang="less">
@import url("~@/styles/skin.less");
@import (reference) url("~@/styles/mixin.less");

.ui_roomList {
  .packageBox {
    .packageTopTitle {
      color: #000;
      font-size: 12px;
      margin: 10px 0;
    }
    .theRoom {
      margin-bottom: 10px;
    }
    .seeMore {
      padding: 16px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      font-size: 14px;
    }
  }
  .room {
    background: #ffffff;
    border-radius: 8px;
    margin-top: 16px;
    overflow: hidden;

    .logo {
      height: 258px;
      width: 100%;
      display: block;
    }

    .roomTypeBox {
      padding: 12px 12px;

      .roomTypeTitle {
        margin-bottom: 5px;

        .roomName {
          font-size: 18px;
          color: #000000;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .aboutDes {
          font-size: 12px;
          color: #808080;
          margin-bottom: 5px;
          .aboutItem {
            margin-right: 3px;
          }
        }
      }

      .theRoom {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #f8f8f8;
        height: 64px;

        &:last-of-type {
          margin-bottom: 0px;
        }

        .leftPart {
          flex: 1;
          .roomTitleDesc {
            font-size: 12px;
            color: #808080;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            line-height: 12px;
            .iconfont {
              margin-right: 3px;
            }
          }

          .priceItem {
            font-size: 12px;
            color: #808080;

            .money {
              font-size: 18px;
              color: #000000;
              font-weight: 600;
              font-family: Montserrat;
            }
            .money2 {
              color: #000;
              font-size: 10px;
              padding: 4px;
              border-radius: 4px;
              background: rgba(219, 137, 0, 0.16);
              display: inline-block;
              margin-top: 4px;
              font-family: Montserrat;
            }
          }
        }

        .rightPart {
          .goBtn {
            .baseBtn();
            padding: 10px 16px;
            font-size: 14px;
            &.disabled{
              background:#EEE;
              color: #CCC;
            }
          }
        }
      }
    }
  }
}
</style>
