export type LibrarySortOption =
  | 'MostRelevant'
  | 'Newest'
  | 'MostUseful'
  | 'LatestUpdated'
  | 'MostDownloads'
  | 'MostComments'

const BaseOptions = new Map<LibrarySortOption, string>()
BaseOptions.set('Newest', 'Newest')
BaseOptions.set('MostComments', 'Most Comments')
BaseOptions.set('LatestUpdated', 'Latest Updated')
BaseOptions.set('MostUseful', 'Most Useful')
BaseOptions.set('MostDownloads', 'Most Downloads')

const QueryParamOptions = new Map<LibrarySortOption, string>(BaseOptions)
QueryParamOptions.set('MostRelevant', 'Most Relevant')

const toArray = (hasQueryParam: boolean) => {
  const options = hasQueryParam ? QueryParamOptions : BaseOptions
  return Array.from(options, ([value, label]) => ({
    label: label,
    value: value,
  }))
}

export const LibrarySortOptions = {
  get: (key: LibrarySortOption) => QueryParamOptions.get(key) ?? '',
  toArray,
}
