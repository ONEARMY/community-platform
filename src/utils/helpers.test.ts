import { IModerationStatus, ResearchUpdateStatus, UserRole } from 'oa-shared'
import { FactoryResearchItemUpdate } from 'src/test/factories/ResearchItem'
import { FactoryUser } from 'src/test/factories/User'

import {
  arrayToJson,
  capitalizeFirstLetter,
  filterModerableItems,
  formatLowerNoSpecial,
  getProjectEmail,
  getResearchTotalCommentCount,
  hasAdminRights,
  isAllowedToEditContent,
  isAllowedToPin,
  isContactable,
  isUserBlockedFromMessaging,
  isUserContactable,
  needsModeration,
  numberWithCommas,
  stripSpecialCharacters,
} from './helpers'

import type { IModerable, IResearch } from 'src/models'
import type { IItem } from 'src/stores/common/FilterSorterDecorator/FilterSorterDecorator'

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

  describe('filterModerableItems Function', () => {
    const items = [
      { moderation: IModerationStatus.ACCEPTED, _createdBy: 'user1' },
      { moderation: IModerationStatus.DRAFT, _createdBy: 'user2' },
      { moderation: IModerationStatus.REJECTED, _createdBy: 'user3' },
    ] as IModerable[]

    it('should filter out items that are accepted', () => {
      const result = filterModerableItems(items)
      expect(result).toHaveLength(1)
      expect((result[0] as any).moderation).toBe(IModerationStatus.ACCEPTED)
    })

    it('should include items created by the user', () => {
      const result = filterModerableItems(
        items,
        FactoryUser({ _id: 'user1', userRoles: [UserRole.ADMIN] }),
      )
      expect(result).toHaveLength(1)
      expect((result[0] as any).moderation).toBe(IModerationStatus.ACCEPTED)
    })

    it('should only include non-draft and non-rejected items for admin user', () => {
      const result = filterModerableItems(
        items,
        FactoryUser({
          userName: 'admin',
          userRoles: [UserRole.ADMIN],
        }),
      )
      expect(result).toHaveLength(1)
      expect((result[0] as any).moderation).toBe(IModerationStatus.ACCEPTED)
    })
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

    it('should return true when user has super-admin role', () => {
      const user = FactoryUser({ userRoles: [UserRole.SUPER_ADMIN] })
      expect(hasAdminRights(user)).toBe(true)
    })
  })

  describe('needsModeration', () => {
    it('should return false when user does not have admin rights', () => {
      const doc = {
        moderation: IModerationStatus.AWAITING_MODERATION,
      } as IModerable
      expect(needsModeration(doc, FactoryUser({ userRoles: [] }))).toBe(false)
    })

    it('should return false when doc is already accepted', () => {
      const doc = { moderation: IModerationStatus.ACCEPTED } as IModerable
      expect(
        needsModeration(doc, FactoryUser({ userRoles: [UserRole.ADMIN] })),
      ).toBe(false)
    })

    it('should return true when doc is not accepted and user has admin rights', () => {
      const doc = {
        moderation: IModerationStatus.AWAITING_MODERATION,
      } as IModerable
      expect(
        needsModeration(doc, FactoryUser({ userRoles: [UserRole.ADMIN] })),
      ).toBe(true)
    })
  })

  describe('isAllowedToEditContent', () => {
    it('should return false when user is not provided', () => {
      const doc = { _createdBy: 'anotherUser', collaborators: [] } as any
      expect(isAllowedToEditContent(doc)).toBe(false)
    })

    it('should return true when user is a collaborator', () => {
      const user = FactoryUser({ userName: 'testUser', userRoles: [] })
      const doc = {
        _createdBy: 'anotherUser',
        collaborators: ['testUser'],
      } as any
      expect(isAllowedToEditContent(doc, user)).toBe(true)
    })

    it('should return true when user has created the content', () => {
      const user = FactoryUser({ userName: 'testUser', userRoles: [] })
      const doc = { _createdBy: 'testUser', collaborators: [] } as any
      expect(isAllowedToEditContent(doc, user)).toBe(true)
    })

    it('should return true when user has admin role', () => {
      const user = FactoryUser({
        userName: 'testUser',
        userRoles: [UserRole.ADMIN],
      })
      const doc = { _createdBy: 'anotherUser', collaborators: [] } as any
      expect(isAllowedToEditContent(doc, user)).toBe(true)
    })

    it('should return true when user has super-admin role', () => {
      const user = FactoryUser({
        userName: 'testUser',
        userRoles: [UserRole.SUPER_ADMIN],
      })
      const doc = { _createdBy: 'anotherUser', collaborators: [] } as any
      expect(isAllowedToEditContent(doc, user)).toBe(true)
    })

    it('should return false when user is neither a collaborator, nor the creator, nor an admin', () => {
      const user = FactoryUser({ userName: 'testUser', userRoles: [] })
      const doc = { _createdBy: 'anotherUser', collaborators: [] } as any
      expect(isAllowedToEditContent(doc, user)).toBe(false)
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
      expect(isContactable(user)).toBe(true)
    })

    it('should return false when given false', () => {
      expect(isContactable(false)).toBe(false)
    })
  })

  describe('getResearchTotalCommentCount Function', () => {
    it('should return 0 when item has no updates', () => {
      const item = { item: {} } as any
      expect(getResearchTotalCommentCount(item)).toBe(0)
    })

    it('should return 0 when updates have no comments', () => {
      const item = {
        updates: Array.from({ length: 3 }).fill(
          FactoryResearchItemUpdate({
            status: ResearchUpdateStatus.PUBLISHED,
            _deleted: false,
            comments: [],
          }),
        ),
      } as IResearch.ItemDB | IItem
      expect(getResearchTotalCommentCount(item)).toBe(0)
    })

    it('should use totalCommentCount if present', () => {
      const item = {
        totalCommentCount: 5,
        updates: Array.from({ length: 3 }).fill(
          FactoryResearchItemUpdate({
            status: ResearchUpdateStatus.PUBLISHED,
            _deleted: false,
            comments: Array.from({ length: 3 }),
          }),
        ),
      } as IResearch.ItemDB | IItem
      expect(getResearchTotalCommentCount(item)).toBe(5)
    })

    it('should use totalCommentCount when 0', () => {
      const item = {
        totalCommentCount: 0,
        updates: Array.from({ length: 3 }).fill(
          FactoryResearchItemUpdate({
            status: ResearchUpdateStatus.PUBLISHED,
            _deleted: false,
            comments: Array.from({ length: 3 }),
          }),
        ),
      } as IResearch.ItemDB | IItem
      expect(getResearchTotalCommentCount(item)).toBe(0)
    })

    it('should return the correct amount of comments', () => {
      const item = {
        updates: Array.from({ length: 3 }).fill(
          FactoryResearchItemUpdate({
            status: ResearchUpdateStatus.PUBLISHED,
            _deleted: false,
            comments: Array.from({ length: 3 }),
          }),
        ),
      } as IResearch.ItemDB | IItem
      expect(getResearchTotalCommentCount(item)).toBe(9)
    })

    it('should ignore deleted and draft updates', () => {
      const item = {
        updates: Array.from({ length: 2 })
          .fill(
            FactoryResearchItemUpdate({
              status: ResearchUpdateStatus.PUBLISHED,
              _deleted: false,
              comments: Array.from({ length: 2 }),
            }),
          )
          .concat([
            FactoryResearchItemUpdate({
              status: ResearchUpdateStatus.PUBLISHED,
              _deleted: true,
              comments: Array.from({ length: 3 }),
            }),
            FactoryResearchItemUpdate({
              status: ResearchUpdateStatus.DRAFT,
              _deleted: false,
              comments: Array.from({ length: 6 }),
            }),
          ]),
      } as IResearch.ItemDB | IItem
      expect(getResearchTotalCommentCount(item)).toBe(4)
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
