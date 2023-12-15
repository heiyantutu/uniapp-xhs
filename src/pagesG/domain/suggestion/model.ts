export enum SuggestionStatusEnum {
  undo = '0',
  accept = '1',
  done = '2'
}

export const SuggestionStatus = {
  [SuggestionStatusEnum.undo]: {
    title: '待处理',
    desc: '我们已收到您的反馈，正在为您分派处理员工。'
  },
  [SuggestionStatusEnum.accept]: {
    title: '处理中',
    desc: '我们已收到您的反馈，稍后将会有员工与您联系。'
  },
  [SuggestionStatusEnum.done]: {
    title: '已完成',
    desc: '非常感谢您的反馈，祝您入住愉快。'
  }
}

export interface SuggestionDetail {
  // 0未处理，1已接收处理，2已处理完成
  status: SuggestionStatusEnum
  bizType: string
  content: string
  imgList: string[]
  createTime: string
  roomNo: string
}