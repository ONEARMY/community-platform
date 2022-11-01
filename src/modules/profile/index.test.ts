import { getSupportedProfileTypes } from './index'
import { SupportedProfileTypesFactory } from './SupportedProfileTypesFactory'

describe('getSupportedProfileTypes', () => {
  expect(typeof getSupportedProfileTypes).toBe('function')
})

describe('SupportedProfileTypesFactory', () => {
  it('handles malformed input with default items', () => {
    const profiles = SupportedProfileTypesFactory(null as any)()

    expect(profiles).toHaveLength(5)
    expect(profiles).toEqual(
      expect.arrayContaining([
        {
          cleanImageSrc: 'avatar_member_sm.svg',
          cleanImageVerifiedSrc: 'avatar_member_sm.svg',
          imageSrc: 'avatar_member_sm.svg',
          label: 'member',
          textLabel: 'I am a member',
        },
        {
          cleanImageSrc: 'map-workspace.svg',
          cleanImageVerifiedSrc: 'map-workspace-verified.svg',
          imageSrc: 'pt-workspace.svg',
          label: 'workspace',
          textLabel: 'I run a workspace',
        },
        {
          cleanImageSrc: 'map-machine.svg',
          cleanImageVerifiedSrc: 'map-machine-verified.svg',
          imageSrc: 'pt-machine-shop.svg',
          label: 'machine-builder',
          textLabel: 'I build machines',
        },
        {
          cleanImageSrc: 'map-community.svg',
          cleanImageVerifiedSrc: 'map-community-verified.svg',
          imageSrc: 'pt-local-community.svg',
          label: 'community-builder',
          textLabel: 'I run a local community',
        },
        {
          cleanImageSrc: 'map-collection.svg',
          cleanImageVerifiedSrc: 'map-collection-verified.svg',
          imageSrc: 'pt-collection-point.svg',
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
          cleanImageSrc: 'avatar_member_sm.svg',
          cleanImageVerifiedSrc: 'avatar_member_sm.svg',
          imageSrc: 'avatar_member_sm.svg',
          label: 'member',
          textLabel: 'I am a member',
        },
      ]),
    )
  })
})
