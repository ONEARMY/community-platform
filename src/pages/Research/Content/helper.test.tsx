import { getResearchCommentId } from './helper'

describe('getReseachCommentId', () => {
  it('extracts id from well formed input', () => {
    expect(getResearchCommentId('#update-1-comment:abc ')).toBe('abc')
  })

  it('extracts id from well formed input', () => {
    expect(getResearchCommentId('#another')).toBe('#another')
  })
})
