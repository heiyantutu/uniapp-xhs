const memberUIMap = {
  "GESANG": {
    memberCenterBg: "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/level1.png",
    defaultHeadImg: "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/touxiang.png"
  },
  "LVRONGHAO": {
    memberCenterBg: "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/level2.png",
    defaultHeadImg: "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/touxiang1.png"
  },
  "LIAN": {
    memberCenterBg: "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/level3.png",
    defaultHeadImg: "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/touxiang2.png"
  },
  "JG": {
    memberCenterBg: "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/level4.png",
    defaultHeadImg: "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/touxiang3.png"
  },
  "LRH": {
    memberCenterBg: "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/level2.png",
    defaultHeadImg: "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/touxiang1.png"
  },
  "LIAN-8": {
    memberCenterBg: "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/level3.png",
    defaultHeadImg: "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/touxiang2.png"
  },
}

const defaultMemberItem = {
  memberCenterBg: "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/level0.png",
  defaultHeadImg: "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/touxiang.png"
}

const getMemberUI = (query: any) => {
  if (query && query.indexOf("JG") == 0) {
    query = "JG";
  }
  if (query in memberUIMap) {
    return memberUIMap[query as keyof typeof memberUIMap];
  } else {
    return defaultMemberItem
  }
}

export default getMemberUI;