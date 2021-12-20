import { formatLink } from './formatters'

describe('formatLink', () => {
  it('preserves casing of original string', () => {
    expect(formatLink('ABC')).toBe('ABC')
  })

  describe.each([
    ['forum', 'https://example.com'],
    ['website', 'https://example.com'],
    ['social media', 'https://example.com'],
    ['bazar', 'https://example.com'],
    [undefined, 'example.com'],
  ])('adds protocal to an external link', (scene, expectation) => {
    it(`${scene}`, () => {
      expect(formatLink('example.com', scene)).toBe(expectation)
    })
  })
})
