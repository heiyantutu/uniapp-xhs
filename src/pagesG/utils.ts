import dayjs from "dayjs"

function formatTimes(val: any): number {
  let nowDat = dayjs().format("YYYY-MM-DD")
  let times = nowDat + "\xa0" + val
  let formtime = dayjs(times, "YYYY-MM-DD HH:mm").format(
    "YYYY-MM-DD HH:mm"
  )
  return dayjs(formtime).unix()
}

export function saleTime(serviceChoose: any): boolean {
  let { startTime, endTime } = serviceChoose
  console.log("startTime:", startTime)
  console.log("endTime:", endTime)
  if (startTime || endTime) {
    let nowtime = dayjs().format("YYYY-MM-DD HH:mm")
    let numberNow = dayjs(nowtime).unix()
    let begins = startTime ? formatTimes(startTime) : 0
    let endTimes = endTime ? formatTimes(endTime) : 0

    if (begins && endTimes) {
      if (begins <= endTimes) {
        //设置了开始时间/结束时间
        if (begins <= numberNow && numberNow < endTimes) {
          console.log("111")
          return false
        } else {
          //超过可用时间
          console.log("222")

          return true
        }
      } else {
        //开始时间大于结束时间（表示跨天）
        let zeroDate = formatTimes(
          `${dayjs().format("YYYY-MM-DD")} 00:00`
        )
        let lastDate = formatTimes(
          `${dayjs().format("YYYY-MM-DD")} 23:59`
        )
        console.log(
          "zeroDate:",
          zeroDate,
          zeroDate <= numberNow && numberNow <= endTimes
        )

        console.log(
          "lastDate",
          lastDate,
          begins <= numberNow && numberNow <= lastDate
        )

        if (
          (zeroDate <= numberNow && numberNow <= endTimes) ||
          (begins <= numberNow && numberNow <= lastDate)
        ) {
          return false
        } else {
          return true
        }
      }
    } else if (!begins && endTimes) {
      //只设置了结束时间
      if (numberNow > endTimes) {
        //超过可用时间
        return true
      } else {
        return false
      }
    } else if (begins && !endTimes) {
      //只设置了开始时间
      if (begins > numberNow) {
        //超过可用时间
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  } else {
    console.log("888")
    return false
  }
}