import { factoryImage, FactoryUser } from 'src/test/factories/User'
import { describe, expect, it } from 'vitest'

import { isProfileComplete } from './isProfileComplete'

import type { Profile, ProfileType } from 'oa-shared'

describe('isProfileComplete', () => {
  describe('member', () => {
    it('returns true for a completed profile', () => {
      const completeProfile: Partial<Profile> = {
        about: 'A member',
        displayName: 'Jeffo',
        type: { id: 1, name: 'member' } as ProfileType,
        photo: factoryImage,
      }
      const user = FactoryUser(completeProfile)

      expect(isProfileComplete(user)).toBe(true)
    })

    describe('returns false if any core field is missing', () => {
      it('no about', () => {
        const missingAbout: Partial<Profile> = {
          displayName: 'Jeffo',
          type: { id: 1, name: 'member' } as ProfileType,
          photo: factoryImage,
        }
        const user = FactoryUser(missingAbout)

        expect(isProfileComplete(user)).toBe(false)
      })
      it('no displayName', () => {
        const missingDisplayName: Partial<Profile> = {
          about: 'A member',
          displayName: undefined,
          type: { id: 1, name: 'member' } as ProfileType,
          photo: factoryImage,
        }
        const user = FactoryUser(missingDisplayName)

        expect(isProfileComplete(user)).toBe(false)
      })
      it('no userImage', () => {
        const missingUserImage: Partial<Profile> = {
          about: 'A member',
          displayName: 'Jeffo',
          type: { id: 1, name: 'member' } as ProfileType,
          photo: undefined,
        }
        const user = FactoryUser(missingUserImage)

        expect(isProfileComplete(user)).toBe(false)
      })
    })
  })

  describe('space', () => {
    it('returns true for a completed profile', () => {
      const completeProfile: Partial<Profile> = {
        about: 'An important space',
        displayName: 'Jeffo',
        type: { id: 1, name: 'community-builder' } as ProfileType,
        coverImages: [factoryImage],
      }
      const user = FactoryUser(completeProfile)

      expect(isProfileComplete(user)).toBe(true)
    })

    describe('returns false if any core field is missing', () => {
      it('no about', () => {
        const missingAbout: Partial<Profile> = {
          displayName: 'Jeffo',
          type: { id: 1, name: 'community-builder' } as ProfileType,
          coverImages: [factoryImage],
        }
        const user = FactoryUser(missingAbout)

        expect(isProfileComplete(user)).toBe(false)
      })
      it('no displayName', () => {
        const missingDisplayName: Partial<Profile> = {
          about: 'An important space',
          displayName: undefined,
          type: { id: 1, name: 'community-builder' } as ProfileType,
          coverImages: [factoryImage],
        }
        const user = FactoryUser(missingDisplayName)

        expect(isProfileComplete(user)).toBe(false)
      })
      it('no userImage', () => {
        const missingUserImage: Partial<Profile> = {
          about: 'An important space',
          displayName: 'Jeffo',
          type: { id: 1, name: 'community-builder' } as ProfileType,
          coverImages: [],
        }
        const user = FactoryUser(missingUserImage)

        expect(isProfileComplete(user)).toBe(false)
      })
    })
  })
  it('returns false if profile type missing', () => {
    const missingProfileType: Partial<Profile> = {
      about: 'An unknown...',
      displayName: 'Jeffo',
      type: undefined,
      photo: factoryImage,
    }
    const user = FactoryUser(missingProfileType)

    expect(isProfileComplete(user)).toBe(false)
  })
})
