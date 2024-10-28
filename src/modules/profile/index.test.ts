import { describe, expect, it } from 'vitest'

import { SupportedProfileTypesFactory } from './SupportedProfileTypesFactory'

describe('SupportedProfileTypesFactory', () => {
  it('returns a subset set of profiles', () => {
    const profiles = SupportedProfileTypesFactory('member')()

    expect(profiles).toHaveLength(1)
    expect(profiles).toEqual(
      expect.arrayContaining([
        {
          cleanImageSrc:
            '/src/assets/images/themes/precious-plastic/avatar_member_sm.svg',
          cleanImageVerifiedSrc:
            '/src/assets/images/themes/precious-plastic/avatar_member_sm.svg',
          imageSrc:
            '/src/assets/images/themes/precious-plastic/avatar_member_sm.svg',
          label: 'member',
          textLabel: 'I am a member',
        },
      ]),
    )
  })
})
