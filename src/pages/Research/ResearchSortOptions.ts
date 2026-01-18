export type ResearchSortOption =
  | 'MostRelevant'
  | 'Newest'
  | 'MostComments'
  | 'LatestUpdated'
  | 'MostUseful'
  | 'MostUsefulLastWeek'
  | 'MostDownloads'
  | 'MostViews';

const BaseOptions = new Map<ResearchSortOption, string>();
BaseOptions.set('Newest', 'Newest');
BaseOptions.set('MostComments', 'Most comments');
BaseOptions.set('LatestUpdated', 'Latest Updates');
BaseOptions.set('MostUseful', 'Most useful');
BaseOptions.set('MostUsefulLastWeek', 'Most useful this week');
BaseOptions.set('MostDownloads', 'Most Downloads');
BaseOptions.set('MostViews', 'Most Views');

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
