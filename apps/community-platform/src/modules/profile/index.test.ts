import { describe, expect, it } from 'vitest'

import { SupportedProfileTypesFactory } from './SupportedProfileTypesFactory'

describe('SupportedProfileTypesFactory', () => {
  it('handles malformed input with default items', () => {
    const profiles = SupportedProfileTypesFactory(null as any)()

    expect(profiles).toHaveLength(5)
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
        {
          cleanImageSrc: '/src/assets/icons/map-workspace.svg',
          cleanImageVerifiedSrc: '/src/assets/icons/map-workspace-verified.svg',
          imageSrc: '/src/assets/images/badges/pt-workspace.svg',
          label: 'workspace',
          textLabel: 'I run a workspace',
        },
        {
          cleanImageSrc: '/src/assets/icons/map-machine.svg',
          cleanImageVerifiedSrc: '/src/assets/icons/map-machine-verified.svg',
          imageSrc: '/src/assets/images/badges/pt-machine-shop.svg',
          label: 'machine-builder',
          textLabel: 'I build machines',
        },
        {
          cleanImageSrc: '/src/assets/icons/map-community.svg',
          cleanImageVerifiedSrc: '/src/assets/icons/map-community-verified.svg',
          imageSrc: '/src/assets/images/badges/pt-local-community.svg',
          label: 'community-builder',
          textLabel: 'I run a local community',
        },
        {
          cleanImageSrc: '/src/assets/icons/map-collection.svg',
          cleanImageVerifiedSrc:
            '/src/assets/icons/map-collection-verified.svg',
          imageSrc: '/src/assets/images/badges/pt-collection-point.svg',
          label: 'collection-point',
          textLabel: 'I collect & sort plastic',
        },
      ]),
    )
  })
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
