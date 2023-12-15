import { getStorage } from "@/utils/wxuser";

export function makeOrder(obj:any) {
  /*var guestsList = [{ name: obj.guests}];
  guestsList.concat(obj.checkInGuests);*/
  var bookOrderInfoRQ = Object.assign(
    {
      arr: obj.arriveTime ? obj.fromDate + " " + obj.arriveTime + ":00" : obj.fromDate + " 18:00:00",
      dep: obj.depTime ? `${obj.toDate} ${obj.depTime}` : `${obj.toDate} 12:00:00`,
      /*fromDate:obj.fromDate||"",
      toDate:obj.toDate||"",*/
      hotelCode: obj.hotelCode || "",
      srcHotelGroupCode: obj.srcHotelGroupCode || obj.hotelGroupCode,
      ticketOrderInfo: {
        startDate: obj.fromDate + ' 00:00:00',
        endDate: obj.toDate + ' 00:00:00',
        rateSum: 0,
        ticketSum: 0,
        otherSum: 0
      },
      memberNo: obj.memberNo ? obj.memberNo : "",
      cardLevel: obj.cardLevel ? obj.cardLevel : "",
      cardType: obj.cardType ? obj.cardType : "",
      openId: obj.openid ? obj.openid : "",
      guests: obj.checkInGuests,
      mobile: obj.mobile,
      remark: obj.remark,
      rsvMan: obj.guests,
      rmNum: obj.rmNum ? obj.rmNum : "1",
      gcDistributorId: obj.distributorId || "",
      memberId: obj.memberId || "",
      payMethod: obj.payMethod || "",
      hotelGroupCode: obj.hotelGroupCode,
      otaChannel: obj.otaChannel || "WECHAT",
      ota: obj.otaChannel || "WECHAT",
      channel: obj.otaChannel || "WECHAT",
      appid: obj.appid || "",
      componentAppid: obj.componentAppid || "",
      productCode: obj.productCode,
      productType: obj.productType || "",
      hotelId: "",
      ticketUseDay: obj.ticketUseDay,
      companyDesc: obj.companyDesc || "",
      companyCode: obj.companyCode || '',
      salesMan: obj.salesMan || '',
      salesName: obj.salesName || '',
      rsvManNo: obj.rsvManNo || '',
      rsvManName: obj.rsvManName || '',
      amenities: obj.amenities || "",
      serviceCouponDetailCodes: obj.serviceCouponDetailCodes || "",
      rsvClass: obj.rsvClass || 'F',
      meetingType: obj.meetingType || "",
      isPointDed: obj.isPointDed || "",
      moneyDed: obj.moneyDed || "",
      pointDed: obj.pointDed || "",
    },
    { couponDetailCodes: obj.couponDetailCodes || "" }
  );

  var sendData = {
    bookOrderInfoRQ: bookOrderInfoRQ,
    hotelCode: obj.hotelCode,
    hotelGroupCode: obj.hotelGroupCode,
    srcHotelGroupCode: obj.srcHotelGroupCode || obj.hotelGroupCode,
    otaChannel: obj.otaChannel || "WECHAT",
    channel: obj.channel || "WECHAT",
    clientChannel: obj.clientChannel,
    domain: obj.domain ? obj.domain : "",
    productCode: obj.productCode,
    productType: obj.productType || "",
    hotelGroupId: obj.hotelGroupId || "",
    formId: obj.formId || "",
    appid: obj.appid || "",
    componentAppid: obj.componentAppid || "",
    packageParam: obj.packageParam || "",
    original: "",
    categorySub: obj.categorySub || "",
    productChannel: obj.productChannel || "",
    companyCode: obj.companyCode || '',
    companyDesc: obj.companyDesc || '',
    couponBatchSaleParam: obj.couponBatchSaleParam || '',
    products: obj.products || [],
    isBuyOnBehalf: obj.isBuyOnBehalf || "",
  };
  if (!sendData.productChannel) {
    delete sendData['categorySub'];
    delete sendData['productChannel'];
  }
  let staticFrom = getStorage("staticFrom") || "";
  if (staticFrom) {
    sendData.original = staticFrom;
  }
  console.log(JSON.stringify(sendData));
  return sendData;
}
