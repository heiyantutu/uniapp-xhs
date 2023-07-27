const memberUIMap = {
  "level1": {
    linearColor: "linear-gradient(106deg, #2A4B7C 0%, #8AD6E7 100%)",
    memberCenterBg: "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/level1.png",
  },
  "level2": {
    linearColor: "linear-gradient(45deg, #FFC107, #fd8d3c)",
    memberCenterBg: "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/level2.png",
  },
}

const defaultMemberItem = {
  linearColor: "https://xcx-1251575231.cos.ap-shanghai.myqcloud.com/songzan/images/level1.png",
  memberCenterBg: "",
}

const getMemberUI = (query: string) => {
  if (query in memberUIMap) {
    return memberUIMap[query as keyof typeof memberUIMap];
  } else {
    return defaultMemberItem
  }
}

export default getMemberUI;