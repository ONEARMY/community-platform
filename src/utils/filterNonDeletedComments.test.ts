import { describe, expect, it } from 'vitest'

import { filterNonDeletedComments } from './filterNonDeletedComments'

import type { IComment } from 'src/models'

describe('nonDeletedCommentsCount', () => {
  it('returns the full total when no comments are marked as deleted', () => {
    const comments = [{ _id: '1' }, { _id: '2' }, { _id: '3' }] as IComment[]
    expect(filterNonDeletedComments(comments)).toEqual(comments)
  })

  it('returns the reduced total when comments are marked as deleted', () => {
    const comments = [
      { _id: '1', _deleted: true },
      { _id: '2', _deleted: true },
      { _id: '3' },
    ] as IComment[]
    expect(filterNonDeletedComments(comments)).toEqual([comments[2]])
  })
})
