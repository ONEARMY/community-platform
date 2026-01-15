export type LibrarySortOption =
  | 'MostRelevant'
  | 'Newest'
  | 'MostUseful'
  | 'MostUsefulLastWeek'
  | 'LatestUpdated'
  | 'MostDownloads'
  | 'MostComments'
  | 'MostViews';

const BaseOptions = new Map<LibrarySortOption, string>();
BaseOptions.set('MostUsefulLastWeek', 'Most Useful Last Week');
BaseOptions.set('Newest', 'Newest');
BaseOptions.set('MostComments', 'Most Comments');
BaseOptions.set('MostUseful', 'Most Useful');
BaseOptions.set('MostDownloads', 'Most Downloads');
BaseOptions.set('MostViews', 'Most Views');

const QueryParamOptions = new Map<LibrarySortOption, string>(BaseOptions);
QueryParamOptions.set('MostRelevant', 'Most Relevant');

const toArray = (hasQueryParam: boolean) => {
  const options = hasQueryParam ? QueryParamOptions : BaseOptions;
  return Array.from(options, ([value, label]) => ({
    label: label,
    value: value,
  }));
};

export const LibrarySortOptions = {
  get: (key: LibrarySortOption) => QueryParamOptions.get(key) ?? '',
  toArray,
};
