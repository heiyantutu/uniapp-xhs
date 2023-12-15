import dayjs from "dayjs";

export const timeFilter = (val: string): string => {
  return dayjs(val).format('YYYY年MM月DD日');
}

export const timeDay = (val: string): string => {
  return dayjs(val).format('YYYY.MM.DD');
}

export const timeDay2 = (val: string): string => {
  return dayjs(val).format('YYYY-MM-DD');
}

export const time = (val: string): string => {
  return dayjs(val).format('YYYY.MM.DD HH:mm');
}

export const timeFilterMD = (val: string): string => {
  return dayjs(val).format('MM月DD日');
}

export const timeFilterMD2 = (val: string): string => {
  return dayjs(val).format('MM.DD');
}

export const timeWeek = (val: string): string => {
  const week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return week[dayjs(val).day()];
}

export const money = (num: number | string): number | string => {
  if (!num) {
    return 0;
  }
  const convertNum = Number(num);
  if (isNaN(convertNum)) {
    return 0;
  }
  const intNum = parseInt(convertNum.toString(), 10);
  if (convertNum - intNum === 0) {
    return intNum;
  } else {
    return convertNum.toFixed(2);
  }
}

export const sensitivePhone = (phone: string): string => {
  try {
    if (!phone) {
      return "";
    } else {
      return phone.replace(/(\d{3})\d*(\d{4})/, '$1****$2');
    }
  } catch (error) {
    return "";
  }
}

export const sensitiveIdNo = (idNo: string): string => {
  try {
    if (!idNo) {
      return "";
    } else {
      return idNo.slice(0, -4) + "****";
    }
  } catch (error) {
    return "";
  }
}

export const sensitiveEmail = (email: string): string => {
  try {
    if (!email) {
      return "";
    } else {
      return "****" + email.slice(4);
    }
  } catch (error) {
    return "";
  }
}

export const sensitiveName = (name: string): string => {
  try {
    if (!name) {
      return "";
    } else {
      return `${name[0]}${'*'.repeat(name.length - 1)}`;
    }
  } catch (error) {
    return "";
  }
}