import SUGGEST_TYPES from '@/pagesG/components/Suggestions/suggestTypes'
import { SuggestionStatusEnum, type SuggestionDetail } from './model'
import * as R from 'ramda'

export const getBizDesc = (v: SuggestionDetail) => {
  return SUGGEST_TYPES.find(R.propEq(v.bizType, 'value'))?.label
}
