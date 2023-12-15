import borrowing from "../../../img/order/borrowing.svg";
import clean from "../../../img/order/clean.svg";
// import meal from "../../../img/order/meal.svg";
import supply from "../../../img/order/supply.svg";
// import wake from "../../../img/order/wake.svg";

export const getIconByServerCode = (serverCode: string) => {
  if (serverCode === "00106") return borrowing;
  if (serverCode === "00104") return clean;
  if (serverCode === "00105") return supply;
  return borrowing;
};
