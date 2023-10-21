import { getSupportedProfileTypes } from './index'
import { SupportedProfileTypesFactory } from './SupportedProfileTypesFactory'

test('getSupportedProfileTypes', () => {
  expect(typeof getSupportedProfileTypes).toBe('function')
})

describe('SupportedProfileTypesFactory', () => {
  it('handles malformed input with default items', () => {
    const profiles = SupportedProfileTypesFactory(null as any)()

    expect(profiles).toHaveLength(5)
    expect(profiles).toEqual(
      expect.arrayContaining([
        {
          cleanImageSrc: expect.stringContaining('avatar_member_sm.svg'),
          cleanImageVerifiedSrc: expect.stringContaining(
            'avatar_member_sm.svg',
          ),
          imageSrc: expect.stringContaining('avatar_member_sm.svg'),
          label: 'member',
          textLabel: 'I am a member',
        },
        {
          cleanImageSrc: expect.stringContaining('map-workspace.svg'),
          cleanImageVerifiedSrc: expect.stringContaining(
            'map-workspace-verified.svg',
          ),
          imageSrc: expect.stringContaining('pt-workspace.svg'),
          label: 'workspace',
          textLabel: 'I run a workspace',
        },
        {
          cleanImageSrc: expect.stringContaining('map-machine.svg'),
          cleanImageVerifiedSrc: expect.stringContaining(
            'map-machine-verified.svg',
          ),
          imageSrc: expect.stringContaining('pt-machine-shop.svg'),
          label: 'machine-builder',
          textLabel: 'I build machines',
        },
        {
          cleanImageSrc: expect.stringContaining('map-community.svg'),
          cleanImageVerifiedSrc: expect.stringContaining(
            'map-community-verified.svg',
          ),
          imageSrc: expect.stringContaining('pt-local-community.svg'),
          label: 'community-builder',
          textLabel: 'I run a local community',
        },
        {
          cleanImageSrc: expect.stringContaining('map-collection.svg'),
          cleanImageVerifiedSrc: expect.stringContaining(
            'map-collection-verified.svg',
          ),
          imageSrc: expect.stringContaining('pt-collection-point.svg'),
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
          cleanImageSrc: expect.stringContaining('avatar_member_sm.svg'),
          cleanImageVerifiedSrc: expect.stringContaining(
            'avatar_member_sm.svg',
          ),
          imageSrc: expect.stringContaining('avatar_member_sm.svg'),
          label: 'member',
          textLabel: 'I am a member',
        },
      ]),
    )
  })
})
