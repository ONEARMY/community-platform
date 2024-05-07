export type QuestionSortOption =
  | 'MostRelevant'
  | 'Newest'
  | 'LatestUpdated'
  | 'LatestComments'
  | 'Comments'
  | 'LeastComments'

export const QuestionSortOptions = new Map<QuestionSortOption, string>()
QuestionSortOptions.set('MostRelevant', 'Most Relevant')
QuestionSortOptions.set('Newest', 'Newest')
QuestionSortOptions.set('LatestUpdated', 'Latest Updated')
QuestionSortOptions.set('LatestComments', 'Latest Comments')
QuestionSortOptions.set('Comments', 'Comments')
QuestionSortOptions.set('LeastComments', 'Least Comments')
