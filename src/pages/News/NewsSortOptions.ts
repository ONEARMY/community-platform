export type NewsSortOption =
  | 'MostRelevant'
  | 'Newest'
  | 'LatestComments'
  | 'Comments'
  | 'LeastComments';

const BaseOptions = new Map<NewsSortOption, string>();
BaseOptions.set('Newest', 'Newest');
// BaseOptions.set('LatestComments', 'Latest Comments')
BaseOptions.set('Comments', 'Comments');
BaseOptions.set('LeastComments', 'Least Comments');

const QueryParamOptions = new Map<NewsSortOption, string>(BaseOptions);
QueryParamOptions.set('MostRelevant', 'Most Relevant');

const toArray = (hasQueryParam: boolean) => {
  const options = hasQueryParam ? QueryParamOptions : BaseOptions;
  return Array.from(options, ([value, label]) => ({
    label: label,
    value: value,
  }));
};

export const NewsSortOptions = {
  get: (key: NewsSortOption) => QueryParamOptions.get(key) ?? '',
  toArray,
};
