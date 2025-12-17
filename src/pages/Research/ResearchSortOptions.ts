export type ResearchSortOption =
  | 'MostRelevant'
  | 'Newest'
  | 'MostComments'
  | 'LeastComments'
  | 'LatestUpdated'
  | 'MostUseful'
  | 'MostUsefulLastWeek'
  | 'MostUpdates';

const BaseOptions = new Map<ResearchSortOption, string>();
BaseOptions.set('Newest', 'Newest');
BaseOptions.set('MostComments', 'Most Comments');
BaseOptions.set('LeastComments', 'Least Comments');
BaseOptions.set('LatestUpdated', 'Latest Updated');
BaseOptions.set('MostUseful', 'Most Useful');
BaseOptions.set('MostUsefulLastWeek', 'Most Useful Last Week');
BaseOptions.set('MostUpdates', 'Most Updates');

const QueryParamOptions = new Map<ResearchSortOption, string>(BaseOptions);
QueryParamOptions.set('MostRelevant', 'Most Relevant');

const toArray = (hasQueryParam: boolean) => {
  const options = hasQueryParam ? QueryParamOptions : BaseOptions;
  return Array.from(options, ([value, label]) => ({
    label: label,
    value: value,
  }));
};

export const ResearchSortOptions = {
  get: (key: ResearchSortOption) => QueryParamOptions.get(key) ?? '',
  toArray,
};
