export type HowtoSortOptions =
  | 'MostRelevant'
  | 'Newest'
  | 'MostUseful'
  | 'LatestUpdated'
  | 'MostDownloads'
  | 'MostComments'

export const HowtosSortOptions = new Map<HowtoSortOptions, string>()
HowtosSortOptions.set('MostRelevant', 'Most Relevant')
HowtosSortOptions.set('Newest', 'Newest')
HowtosSortOptions.set('MostComments', 'Most Comments')
HowtosSortOptions.set('LatestUpdated', 'Latest Updated')
HowtosSortOptions.set('MostUseful', 'Most Useful')
HowtosSortOptions.set('MostDownloads', 'Most Downloads')
