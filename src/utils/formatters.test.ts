import { ExternalLinkLabel } from 'oa-shared'
import { describe, expect, it } from 'vitest'

import { formatLink } from './formatters'

describe('formatLink', () => {
  it('preserves casing of original string', () => {
    expect(formatLink('ABC')).toBe('ABC')
  })

  describe.each([
    [ExternalLinkLabel.FORUM, 'https://example.com'],
    [ExternalLinkLabel.WEBSITE, 'https://example.com'],
    [ExternalLinkLabel.SOCIAL_MEDIA, 'https://example.com'],
    [ExternalLinkLabel.BAZAR, 'https://example.com'],
    [undefined, 'example.com'],
  ])('adds protocal to an external link', (scene, expectation) => {
    it(`${scene}`, () => {
      expect(formatLink('example.com', scene)).toBe(expectation)
    })
  })
})
