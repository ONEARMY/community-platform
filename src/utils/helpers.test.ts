import { UserRole } from 'oa-shared'
import { FactoryUser } from 'src/test/factories/User'
import { describe, expect, it } from 'vitest'

import {
  arrayToJson,
  capitalizeFirstLetter,
  formatLowerNoSpecial,
  getProjectEmail,
  hasAdminRights,
  isAllowedToPin,
  isContactable,
  isUserBlockedFromMessaging,
  isUserContactable,
  numberWithCommas,
  stripSpecialCharacters,
} from './helpers'

describe('src/utils/helpers', () => {
  it('stripSpecialCharacters should remove special characters and replace spaces with dashes', () => {
    expect(stripSpecialCharacters('He%llo w@o$rl^d!')).toBe('Hello-world')
  })

  it('formatLowerNoSpecial should return lowercase without special characters', () => {
    expect(formatLowerNoSpecial('He%llo w@o$rl^d!')).toBe('hello-world')
  })

  it('arrayToJson should convert array to JSON object', () => {
    expect(arrayToJson([{ id: 'abc', val: 'hello' }], 'id')).toEqual({
      abc: { id: 'abc', val: 'hello' },
    })
  })

  it('capitalizeFirstLetter should return string with first letter capitalized', () => {
    expect(capitalizeFirstLetter('hello world')).toBe('Hello world')
  })

  describe('hasAdminRights', () => {
    it('should return false when user is not provided', () => {
      expect(hasAdminRights()).toBe(false)
    })

    it('should return false when user does not have any roles', () => {
      const user = FactoryUser({ userRoles: [] })
      expect(hasAdminRights(user)).toBe(false)
    })

    it('should return false when user does not have admin or super-admin roles', () => {
      const user = FactoryUser({ userRoles: [UserRole.BETA_TESTER] })
      expect(hasAdminRights(user)).toBe(false)
    })

    it('should return true when user has admin role', () => {
      const user = FactoryUser({ userRoles: [UserRole.ADMIN] })
      expect(hasAdminRights(user)).toBe(true)
    })
  })

  describe('isAllowedToPin Function', () => {
    it('should return false when user is not provided', () => {
      const pin = { _id: 'pinID' } as any
      expect(isAllowedToPin(pin)).toBe(false)
    })

    it('should return true when user has admin rights', () => {
      const pin = { _id: 'pinID' } as any
      expect(
        isAllowedToPin(
          pin,
          FactoryUser({
            userName: 'testUser',
            userRoles: [UserRole.ADMIN],
          }),
        ),
      ).toBe(true)
    })

    it('should return true when pin _id matches user userName', () => {
      const pin = { _id: 'testUser' } as any
      expect(
        isAllowedToPin(
          pin,
          FactoryUser({
            userName: 'testUser',
            userRoles: [],
          }),
        ),
      ).toBe(true)
    })

    it('should return false when user has no admin rights and pin _id does not match user userName', () => {
      const pin = { _id: 'pinID' } as any
      expect(
        isAllowedToPin(
          pin,
          FactoryUser({
            userRoles: [],
          }),
        ),
      ).toBe(false)
    })
  })

  describe('isUserBlockedFromMessaging', () => {
    it('should return true when a user is blocked', () => {
      const user = FactoryUser({ isBlockedFromMessaging: true })
      expect(isUserBlockedFromMessaging(user)).toBe(true)
    })

    it("should return null when a user isn't present", () => {
      expect(isUserBlockedFromMessaging(null)).toBe(null)
    })

    it("should return true when a user isn't blocked", () => {
      const user = FactoryUser({ isBlockedFromMessaging: false })
      expect(isUserBlockedFromMessaging(user)).toBe(false)
    })
  })

  describe('isUserContactable', () => {
    it('should default to true when field empty on user', () => {
      const user = FactoryUser({ isContactableByPublic: undefined })
      expect(isUserContactable(user)).toBe(true)
    })

    it('should return true when a user is contactable', () => {
      const user = FactoryUser({ isContactableByPublic: true })
      expect(isUserContactable(user)).toBe(true)
    })

    it("should return false when a user isn't contactable", () => {
      const user = FactoryUser({ isContactableByPublic: false })
      expect(isUserContactable(user)).toBe(false)
    })
  })

  describe('isContactable', () => {
    it('should default to true when field undefined', () => {
      expect(isContactable(undefined)).toBe(true)
    })

    it('should return true when given true', () => {
      const user = FactoryUser({ isContactableByPublic: true })
      expect(isContactable(user.isContactableByPublic)).toBe(true)
    })

    it('should return false when given false', () => {
      expect(isContactable(false)).toBe(false)
    })
  })

  describe('numberWithCommas', () => {
    it('adds a comma between every three digits', () => {
      const expectation = '1,000'
      expect(numberWithCommas(1000)).toEqual(expectation)
    })
  })
})

describe('getProjectEmail', () => {
  it('returns the right project name at the end', () => {
    const subject = 'Whatever you need'
    expect(getProjectEmail(subject)).toMatch('precious')
    expect(getProjectEmail(subject)).toMatch(subject)
  })
})
