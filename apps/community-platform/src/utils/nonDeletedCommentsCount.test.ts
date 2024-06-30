import '@testing-library/jest-dom/vitest'

import { describe, expect, it } from 'vitest'

import { nonDeletedCommentsCount } from './nonDeletedCommentsCount'

import type { IComment } from 'src/models'

describe('nonDeletedCommentsCount', () => {
  it('returns the full total when no comments are marked as deleted', () => {
    const comments = [{}, {}, {}, {}] as IComment[]
    expect(nonDeletedCommentsCount(comments)).toEqual(4)
  })

  it('returns the reduced total when comments are marked as deleted', () => {
    const comments = [
      { _deleted: true },
      { _deleted: true },
      {},
      {},
    ] as IComment[]
    expect(nonDeletedCommentsCount(comments)).toEqual(2)
  })
})
