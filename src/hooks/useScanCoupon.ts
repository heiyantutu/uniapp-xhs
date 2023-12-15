import api from "@/utils/api";
import { getStorage } from "@/utils/wxuser";
import { jAlert3 } from "@/base/jAlert/jAlert";

export default function useScanCoupon() {

  function scanCode() {
    return new Promise((resolve, reject) => {
      uni.scanCode({
        success: (res) => {
          resolve(res.result);
        },
        fail: (res) => {
          reject(res);
        }
      })
    })
  }
  function bindCoupon(coupon: any) {
    let config = getStorage("config");
    let user = getStorage("user");
    return new Promise((resolve, reject) => {
      api
        .bindCouponToMemberForPlatform({
          hotelGroupCode: config.hotelGroupCode,
          couponNo: coupon,
          cardNo: user.cardNo,
          memberId: user.memberId,
          memberName: user.name,
          password: "",
        })
        .then((res: any) => {
          if (res.result == 1) {
            if (res.retVal.result == 0) {
              jAlert3("绑定成功");
              resolve(coupon);
            } else {
              jAlert3(res.retVal.msg);
              reject(res.retVal.msg)
            }
          } else {
            jAlert3(res.msg);
            reject(res.msg)
          }
        });
    })

  }

  return {
    scanCode,
    bindCoupon
  };
}