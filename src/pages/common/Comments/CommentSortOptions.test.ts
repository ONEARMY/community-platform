import { FactoryComment } from 'src/test/factories/Comment';
import { describe, expect, it } from 'vitest';

import { CommentSortOption, CommentSortOptions } from './CommentSortOptions';

const oldest = FactoryComment({ id: 1, createdAt: new Date('2024-01-01'), voteCount: 0 });
const middle = FactoryComment({ id: 2, createdAt: new Date('2024-02-01'), voteCount: 3 });
const newest = FactoryComment({ id: 3, createdAt: new Date('2024-03-01'), voteCount: 3 });
const mostVoted = FactoryComment({ id: 4, createdAt: new Date('2024-04-01'), voteCount: 5 });

const sortIds = (option: CommentSortOption) =>
  [newest, mostVoted, oldest, middle].sort(CommentSortOptions.getSortFn(option)).map((x) => x.id);

describe('CommentSortOptions', () => {
  it('sorts by oldest first', () => {
    expect(sortIds(CommentSortOption.Oldest)).toEqual([1, 2, 3, 4]);
  });

  it('sorts by newest first', () => {
    expect(sortIds(CommentSortOption.Newest)).toEqual([4, 3, 2, 1]);
  });

  it('sorts by most useful, breaking ties by oldest first', () => {
    expect(sortIds(CommentSortOption.MostUseful)).toEqual([4, 2, 3, 1]);
  });

  it('falls back to oldest first for an unknown option', () => {
    expect(sortIds('unknown' as CommentSortOption)).toEqual([1, 2, 3, 4]);
  });

  it('exposes labels for the sort select', () => {
    expect(CommentSortOptions.getOptions()).toEqual([
      { label: 'Oldest', value: CommentSortOption.Oldest },
      { label: 'Newest', value: CommentSortOption.Newest },
      { label: 'Most Useful', value: CommentSortOption.MostUseful },
    ]);
  });
});
