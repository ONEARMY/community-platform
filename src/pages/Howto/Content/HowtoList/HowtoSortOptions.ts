export type HowtoSortOption =
  | 'MostRelevant'
  | 'Newest'
  | 'MostUseful'
  | 'LatestUpdated'
  | 'MostDownloads'
  | 'MostComments'

export const HowtoSortOptions = new Map<HowtoSortOption, string>()
HowtoSortOptions.set('MostRelevant', 'Most Relevant')
HowtoSortOptions.set('Newest', 'Newest')
HowtoSortOptions.set('MostComments', 'Most Comments')
HowtoSortOptions.set('LatestUpdated', 'Latest Updated')
HowtoSortOptions.set('MostUseful', 'Most Useful')
HowtoSortOptions.set('MostDownloads', 'Most Downloads')
