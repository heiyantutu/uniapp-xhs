import type { ServiceOrder } from "@/pagesG/domain/order/modal";

export const getOrderDesc = (order: ServiceOrder): { title: string; desc: string } => {
  if (["S", "R"].includes(order.status)) {
    return {
      title: "待服务",
      desc: "我们已收到您的服务请求，请耐心等待。",
    };
  }
  if (order.status === "I") {
    return {
      title: "服务中",
      desc: "我们正在为您提供服务，请耐心等待。",
    };
  }
  if (order.status === "O") {
    return {
      title: "已完成",
      desc: "您的服务已完成，如有问题，请联系前台。",
    };
  }
  if (order.status === "P" && order.timeType === "P") {
    return {
      title: "已预约",
      desc: "我们已收到您的服务请求，将会在指定时间内提供服务。",
    };
  }
  return {
    title: "已取消",
    desc: "您的服务取消，如仍有需要，请重新下单。",
  };
};

export const showOperation = (order: ServiceOrder): boolean => {
  return ["R", "I"].includes(order.status);
};
