import type { Comment } from 'oa-shared'

export enum CommentSortOption {
  Newest = 'Newest',
  Oldest = 'Oldest',
  MostUseful = 'MostUseful',
}

type SortConfig = {
  label: string
  sortFn: (a: Comment, b: Comment) => number
}

const Options = new Map<CommentSortOption, SortConfig>([
  [
    CommentSortOption.Newest,
    {
      label: 'Newest',
      sortFn: (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    },
  ],
  [
    CommentSortOption.Oldest,
    {
      label: 'Oldest',
      sortFn: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ],
  [
    CommentSortOption.MostUseful,
    {
      label: 'Most Useful',
      sortFn: (a, b) => {
        const voteCountDiff = (b.voteCount || 0) - (a.voteCount || 0)
        // If vote counts are tied, sort by newest first
        if (voteCountDiff === 0) {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        }
        return voteCountDiff
      },
    },
  ],
])

const getOptions = () => {
  return Array.from(Options, ([value, config]) => ({
    label: config.label,
    value: value,
  }))
}

const getSortFn = (key: CommentSortOption) => {
  const config = Options.get(key)
  return config?.sortFn ?? Options.get(CommentSortOption.Newest)!.sortFn
}

export const CommentSortOptions = {
  get: (key: CommentSortOption) => Options.get(key)?.label ?? '',
  getSortFn,
  getOptions,
}
