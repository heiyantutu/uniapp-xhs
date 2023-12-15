import { type SuggestionDetailDto } from './dto'
import { type SuggestionDetail, SuggestionStatusEnum } from './model'

export const SuggestionDetailDto2SuggestionDetail = (
  v: SuggestionDetailDto
): SuggestionDetail => {
  return {
    status: v.replyStatus as SuggestionStatusEnum,
    bizType: v.bizType,
    content: v.decodedContent,
    imgList: v.pictures.length > 0 ? v.pictures.split(',') : [],
    createTime: v.createDatetime,
    roomNo: v.rmno
  }
}
