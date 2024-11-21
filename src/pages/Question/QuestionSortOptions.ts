export type QuestionSortOption =
  | 'MostRelevant'
  | 'Newest'
  | 'LatestUpdated'
  | 'LatestComments'
  | 'Comments'
  | 'LeastComments'

const BaseOptions = new Map<QuestionSortOption, string>()
BaseOptions.set('Newest', 'Newest')
BaseOptions.set('LatestUpdated', 'Latest Updated')
// BaseOptions.set('LatestComments', 'Latest Comments')
// BaseOptions.set('Comments', 'Comments')
// BaseOptions.set('LeastComments', 'Least Comments')

const QueryParamOptions = new Map<QuestionSortOption, string>(BaseOptions)
QueryParamOptions.set('MostRelevant', 'Most Relevant')

const toArray = (hasQueryParam: boolean) => {
  const options = hasQueryParam ? QueryParamOptions : BaseOptions
  return Array.from(options, ([value, label]) => ({
    label: label,
    value: value,
  }))
}

export const QuestionSortOptions = {
  get: (key: QuestionSortOption) => QueryParamOptions.get(key) ?? '',
  toArray,
}
