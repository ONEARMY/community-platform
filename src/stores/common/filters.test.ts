import { convertUserReferenceToPlainText } from './filters'

describe('convertUserReferenceToPlainText', () => {
  it('handles well-formed input', () => {
    expect(convertUserReferenceToPlainText('@@{id:username} example')).toBe(
      '@username example',
    )
  })

  it('supports multiple usernames', () => {
    expect(
      convertUserReferenceToPlainText('@@{id:username} @@{id:username2}'),
    ).toBe('@username @username2')
  })

  it('handles bad input', () => {
    expect(convertUserReferenceToPlainText(null as any)).toBe(null)
  })

  it('handles empty input', () => {
    expect(convertUserReferenceToPlainText('')).toBe('')
  })
})
