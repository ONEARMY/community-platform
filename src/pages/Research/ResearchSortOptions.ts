export type ResearchSortOption =
  | 'MostRelevant'
  | 'Newest'
  | 'MostComments'
  | 'LatestUpdated'
  | 'MostUseful'
  | 'MostUpdates'

export const ResearchSortOptions = new Map<ResearchSortOption, string>()
ResearchSortOptions.set('MostRelevant', 'Most Relevant')
ResearchSortOptions.set('Newest', 'Newest')
ResearchSortOptions.set('MostComments', 'Most Comments')
ResearchSortOptions.set('LatestUpdated', 'Latest Updated')
ResearchSortOptions.set('MostUseful', 'Most Useful')
ResearchSortOptions.set('MostUpdates', 'Most Updates')
