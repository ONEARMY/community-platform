import type { IModerable, IResearch } from 'src/models'
import type { IItem } from 'src/stores/common/FilterSorterDecorator/FilterSorterDecorator'
import {
  stripSpecialCharacters,
  formatLowerNoSpecial,
  arrayToJson,
  capitalizeFirstLetter,
  filterModerableItems,
  hasAdminRights,
  needsModeration,
  isAllowedToEditContent,
  isAllowedToPin,
  calculateTotalComments,
} from './helpers'
import { FactoryUser } from 'src/test/factories/User'
import { FactoryResearchItemUpdate } from 'src/test/factories/ResearchItem'

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
      { moderation: 'accepted', _createdBy: 'user1' },
      { moderation: 'draft', _createdBy: 'user2' },
      { moderation: 'rejected', _createdBy: 'user3' },
    ] as IModerable[]

    it('should filter out items that are accepted', () => {
      const result = filterModerableItems(items)
      expect(result).toHaveLength(1)
      expect((result[0] as any).moderation).toBe('accepted')
    })

    it('should include items created by the user', () => {
      const result = filterModerableItems(
        items,
        FactoryUser({ _id: 'user1', userRoles: ['admin'] }),
      )
      expect(result).toHaveLength(1)
      expect((result[0] as any).moderation).toBe('accepted')
    })

    it('should only include non-draft and non-rejected items for admin user', () => {
      const result = filterModerableItems(
        items,
        FactoryUser({
          userName: 'admin',
          userRoles: ['admin'],
        }),
      )
      expect(result).toHaveLength(1)
      expect((result[0] as any).moderation).toBe('accepted')
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
      const user = FactoryUser({ userRoles: ['beta-tester'] })
      expect(hasAdminRights(user)).toBe(false)
    })

    it('should return true when user has admin role', () => {
      const user = FactoryUser({ userRoles: ['admin'] })
      expect(hasAdminRights(user)).toBe(true)
    })

    it('should return true when user has super-admin role', () => {
      const user = FactoryUser({ userRoles: ['super-admin'] })
      expect(hasAdminRights(user)).toBe(true)
    })
  })

  describe('needsModeration', () => {
    it('should return false when user does not have admin rights', () => {
      const doc = { moderation: 'awaiting-moderation' } as IModerable
      expect(needsModeration(doc, FactoryUser({ userRoles: [] }))).toBe(false)
    })

    it('should return false when doc is already accepted', () => {
      const doc = { moderation: 'accepted' } as IModerable
      expect(needsModeration(doc, FactoryUser({ userRoles: ['admin'] }))).toBe(
        false,
      )
    })

    it('should return true when doc is not accepted and user has admin rights', () => {
      const doc = { moderation: 'awaiting-moderation' } as IModerable
      expect(needsModeration(doc, FactoryUser({ userRoles: ['admin'] }))).toBe(
        true,
      )
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
      const user = FactoryUser({ userName: 'testUser', userRoles: ['admin'] })
      const doc = { _createdBy: 'anotherUser', collaborators: [] } as any
      expect(isAllowedToEditContent(doc, user)).toBe(true)
    })

    it('should return true when user has super-admin role', () => {
      const user = FactoryUser({
        userName: 'testUser',
        userRoles: ['super-admin'],
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
            userRoles: ['admin'],
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

  describe('calculateTotalComments Function', () => {
    it('should return 0 when item has no updates', () => {
      const item = { item: {} } as any
      expect(calculateTotalComments(item)).toBe('0')
    })

    it('should return 0 when updates have no comments', () => {
      const item = {
        updates: Array.from({ length: 3 }).fill(
          FactoryResearchItemUpdate({
            status: 'published',
            _deleted: false,
            comments: [],
          }),
        ),
      } as IResearch.ItemDB | IItem
      expect(calculateTotalComments(item)).toBe('0')
    })

    it('should return the correct amount of comments', () => {
      const item = {
        updates: Array.from({ length: 3 }).fill(
          FactoryResearchItemUpdate({
            status: 'published',
            _deleted: false,
            comments: Array.from({ length: 3 }),
          }),
        ),
      } as IResearch.ItemDB | IItem
      expect(calculateTotalComments(item)).toBe('9')
    })

    it('should ignore deleted and draft updates', () => {
      const item = {
        updates: Array.from({ length: 2 })
          .fill(
            FactoryResearchItemUpdate({
              status: 'published',
              _deleted: false,
              comments: Array.from({ length: 2 }),
            }),
          )
          .concat([
            FactoryResearchItemUpdate({
              status: 'published',
              _deleted: true,
              comments: Array.from({ length: 3 }),
            }),
            FactoryResearchItemUpdate({
              status: 'draft',
              _deleted: false,
              comments: Array.from({ length: 6 }),
            }),
          ]),
      } as IResearch.ItemDB | IItem
      expect(calculateTotalComments(item)).toBe('4')
    })
  })
})
