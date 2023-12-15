import * as R from "ramda";

export type serviceGoods = Array<{
  name: string;
  price: number;
  amount: number;
  picture: string;
  code: string;
}>;

export interface ServiceOrder {
  id: number;
  status: string;
  timeType?: string;
  serviceCode: string;
  serviceName: string;
  serviceIcon: string;
  goods?: serviceGoods;
  remark?: string;
  roomNo: string;
  orderNo: string;
  createDateTime: string;
  timeDo?: string;
  hotelCode: string;
  hotelName: string;
}

export interface SuggestionServiceOrder extends ServiceOrder {
  suggestionType: string;
}

export const getTotalPrice = (v: serviceGoods) => {
  const sum = v.map((i) => i.amount * i.price);
  return R.reduce(R.add, 0, sum);
};

export const getLabel = (v: ServiceOrder) => {
  const { status, timeType } = v;
  return status === "R"
    ? "待服务"
    : status === "I"
    ? "服务中"
    : status === "O"
    ? "已完成"
    : status === "S"
    ? "已挂起"
    : status == "P" && timeType === "P"
    ? "已预约"
    : "已取消";
};
