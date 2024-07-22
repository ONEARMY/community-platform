import { describe, expect, it } from 'vitest'

import { getResearchCommentId, getResearchUpdateId } from './helper'

describe('getReseachCommentId', () => {
  it('extracts comment id from well formed input', () => {
    expect(getResearchCommentId('#update_b1345-comment:abc ')).toBe('abc')
  })

  it('extracts id from well formed input', () => {
    expect(getResearchCommentId('#another')).toBe('#another')
  })
})

describe('getResearchUpdateId', () => {
  it('extracts comment id from well formed input', () => {
    expect(getResearchUpdateId('#update_b1345-comment:abc ')).toBe('b1345')
  })
})
