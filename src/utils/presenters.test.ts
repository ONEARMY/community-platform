import {
  setCommentsHeading,
  NO_COMMENTS,
  ONE_COMMENT,
  COMMENTS,
} from './presenters'

describe('setCommentsHeading', () => {
  it('returns the right label when length is zero', async () => {
    const length = 0
    expect(setCommentsHeading(length)).toEqual(NO_COMMENTS)
  })
  it('returns the right label when length is one', async () => {
    const length = 1
    expect(setCommentsHeading(length)).toEqual(ONE_COMMENT)
  })
  it('returns the right label when length is more than one', async () => {
    const length = 5
    expect(setCommentsHeading(length)).toEqual(`${length} ${COMMENTS}`)
  })
})
