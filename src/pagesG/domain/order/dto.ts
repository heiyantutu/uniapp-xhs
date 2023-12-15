import { getIconByServerCode } from "@/pagesG/components/Order/List/utils";
import type { ServiceOrder } from "./modal";

interface OrderDetail {
  detailCode: string;
  detailName: string;
  detailNum: number;
  detailPicture: string;
  detailPrice: number;
}

type OrderListRes = Array<{
  orderDetails?: Array<OrderDetail>;
  serverNameCus: string;
  serverCode: string;
  orderSta: string;
  areaCode: string;
  orderRemark?: string;
  id: number;
  timeType: string;
  oderNo: string;
  createDatetime: string;
  timeDo?: string;
  hotelCode: string;
  hotelName: string;
}>;

export interface CreateServerOrderV2Res {
  orderList: Array<{ orderNo: string }>;
}

export const OrderListRes2ServiceOrderList = (
  v: OrderListRes
): ServiceOrder[] => {
  return v.map((i) => ({
    id: i.id,
    status: i.orderSta,
    serviceCode: i.serverCode,
    serviceName: i.serverNameCus,
    serviceIcon: getIconByServerCode(i.serverCode),
    goods: i.orderDetails?.map((v) => ({
      name: v.detailName,
      price: v.detailPrice,
      amount: v.detailNum,
      picture: v.detailPicture,
      code: v.detailCode
    })),
    remark: i.orderRemark,
    roomNo: i.areaCode,
    timeType: i.timeType || undefined,
    orderNo: i.oderNo,
    createDateTime: i.createDatetime,
    timeDo: i.timeDo,
    hotelCode: i.hotelCode,
    hotelName: i.hotelName
  }));
};
