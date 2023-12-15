import * as R from "ramda"

export interface Good {
  id: string
  name: string
  picture: string
  price: number
  stock?: number
  category: string
  quantity: number
  max?: number
}

export const getCategories = (goods: Good[]): string[] => {
  const cates = R.pipe(R.pluck("category"), R.filter(Boolean), R.uniq)(goods)
  if (cates.length === 1 && cates[0] === "") return []
  return cates
}

export const getFstIndexOfCategory = (
  goods: Good[],
  cate: string
): number => {
  return R.findIndex(R.propEq(cate, "category"), goods)
}

export const modifyGoodWithId = (
  goods: Good[],
  id: string,
  fn: (v: Good) => Good
) => {
  return R.adjust(R.findIndex(R.propEq(id, "id"), goods), fn, goods)
}

export const increaseQuantity = (goods: Good[], id: string) => {
  return modifyGoodWithId(goods, id, R.modify("quantity", R.add(1)))
}

export const decreaseQuantity = (goods: Good[], id: string) => {
  return modifyGoodWithId(
    goods,
    id,
    R.modify("quantity", R.subtract(R.__, 1))
  )
}

export const allowIncrease = (good: Good) => {
  if (good.max && good.quantity >= good.max) {
    return false
  }
  if (good.stock) {
    return good.quantity < good.stock
  }
  if(!good.stock) return false
  return true
}

export const getSelection = (goods: Good[]) => {
  return R.filter(R.pipe(R.prop("quantity"), R.gt(R.__, 0)), goods)
}

export const getSelectCount = (goods: Good[]) => {
  return R.pipe(getSelection, R.pluck('quantity'), R.reduce(R.add, 0))(goods)
}

export const quantityGtZero = R.pipe(
  R.prop("quantity"),
  R.gt(R.__, 0)
)

export const getTotalPrice = (goods: Good[]): number => {
  const chosen = R.filter(quantityGtZero, goods)
  const amounts = R.map((v) => v.price * v.quantity, chosen)
  return R.reduce(R.add, 0, amounts)
}

export const findGoodById = (goods: Good[], id: string) => {
  return R.find(R.propEq(id, "id"), goods)
}

export const renderPrice = (v: number) => {
  if (v === 0) return "免费";
  return `¥ ${v.toFixed(2)}`;
};