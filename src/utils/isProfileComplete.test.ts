import { ProfileTypeList } from 'oa-shared'
import { factoryImage, factoryLink, FactoryUser } from 'src/test/factories/User'
import { describe, expect, it } from 'vitest'

import { isProfileComplete } from './isProfileComplete'

describe('isProfileComplete', () => {
  describe('member', () => {
    it('returns true for a completed profile', () => {
      const completeProfile = {
        about: 'A member',
        displayName: 'Jeffo',
        links: [factoryLink],
        profileType: ProfileTypeList.MEMBER,
        userImage: factoryImage,
      }
      const user = FactoryUser(completeProfile)

      expect(isProfileComplete(user)).toBe(true)
    })

    describe('returns false if any core field is missing', () => {
      it('no about', () => {
        const missingAbout = {
          displayName: 'Jeffo',
          links: [factoryLink],
          profileType: ProfileTypeList.MEMBER,
          userImage: factoryImage,
        }
        const user = FactoryUser(missingAbout)

        expect(isProfileComplete(user)).toBe(false)
      })
      it('no displayName', () => {
        const missingDisplayName = {
          about: 'A member',
          displayName: undefined,
          links: [factoryLink],
          profileType: ProfileTypeList.MEMBER,
          userImage: factoryImage,
        }
        const user = FactoryUser(missingDisplayName)

        expect(isProfileComplete(user)).toBe(false)
      })
      it('no links', () => {
        const missingLinks = {
          about: 'A member',
          displayName: 'Jeffo',
          links: [],
          profileType: ProfileTypeList.MEMBER,
          userImage: factoryImage,
        }
        const user = FactoryUser(missingLinks)

        expect(isProfileComplete(user)).toBe(false)
      })
      it('no userImage', () => {
        const missingUserImage = {
          about: 'A member',
          displayName: 'Jeffo',
          links: [factoryLink],
          profileType: ProfileTypeList.MEMBER,
          userImage: undefined,
        }
        const user = FactoryUser(missingUserImage)

        expect(isProfileComplete(user)).toBe(false)
      })
    })
  })

  describe('space', () => {
    it('returns true for a completed profile', () => {
      const completeProfile = {
        about: 'An important space',
        displayName: 'Jeffo',
        links: [factoryLink],
        profileType: ProfileTypeList.COMMUNITY_BUILDER,
        coverImages: [factoryImage],
      }
      const user = FactoryUser(completeProfile)

      expect(isProfileComplete(user)).toBe(true)
    })

    describe('returns false if any core field is missing', () => {
      it('no about', () => {
        const missingAbout = {
          displayName: 'Jeffo',
          links: [factoryLink],
          profileType: ProfileTypeList.COLLECTION_POINT,
          coverImages: [factoryImage],
        }
        const user = FactoryUser(missingAbout)

        expect(isProfileComplete(user)).toBe(false)
      })
      it('no displayName', () => {
        const missingDisplayName = {
          about: 'An important space',
          displayName: undefined,
          links: [factoryLink],
          profileType: ProfileTypeList.MACHINE_BUILDER,
          coverImages: [factoryImage],
        }
        const user = FactoryUser(missingDisplayName)

        expect(isProfileComplete(user)).toBe(false)
      })
      it('no links', () => {
        const missingLinks = {
          about: 'An important space',
          displayName: 'Jeffo',
          links: [],
          profileType: ProfileTypeList.WORKSPACE,
          coverImages: [factoryImage],
        }
        const user = FactoryUser(missingLinks)

        expect(isProfileComplete(user)).toBe(false)
      })
      it('no userImage', () => {
        const missingUserImage = {
          about: 'An important space',
          displayName: 'Jeffo',
          links: [factoryLink],
          profileType: ProfileTypeList.COLLECTION_POINT,
          coverImages: [],
        }
        const user = FactoryUser(missingUserImage)

        expect(isProfileComplete(user)).toBe(false)
      })
    })
  })
  it('returns false if profile type missing', () => {
    const missingProfileType = {
      about: 'An unknown...',
      displayName: 'Jeffo',
      profileType: undefined,
      links: [factoryLink],
      userImage: factoryImage,
    }
    const user = FactoryUser(missingProfileType)

    expect(isProfileComplete(user)).toBe(false)
  })
})
