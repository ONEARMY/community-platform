jest.mock('../common/module.store')
import { FactoryUser } from 'src/test/factories/User'
import { UserStore } from './user.store'
import type { IUserPP } from 'src/models/userPreciousPlastic.models'

describe('userStore', () => {
  let store

  beforeEach(() => {
    store = new UserStore({} as any)
  })

  describe('getUserProfile', () => {
    it('returns a single user object when 2 exist', async () => {
      // Lookup1
      store.db.getWhere.mockReturnValueOnce([
        FactoryUser({
          _authID: 'an-auth-id',
          _id: 'an-auth-id',
          _created: new Date('2023-01-01').toString(),
          _lastActive: new Date('2020-01-01').toString(),
        }),
        FactoryUser({
          _authID: 'an-auth-id',
          _id: 'desired-user-doc',
          _created: new Date('2020-01-01').toString(),
          _lastActive: new Date('2020-01-01').toString(),
        } as any),
      ])

      // Lookup2
      store.db.getWhere.mockReturnValueOnce([])

      // Assert
      expect(await store.getUserProfile('an-auth-id')).toEqual({
        _contentModifiedTimestamp: expect.any(String),
        _created: expect.any(String),
        _deleted: expect.any(Boolean),
        _lastActive: expect.any(String),
        _id: 'desired-user-doc',
        _modified: expect.any(String),
        country: expect.any(String),
        _authID: 'an-auth-id',
        verified: expect.any(Boolean),
        userName: expect.any(String),
        profileType: expect.any(String),
        displayName: expect.any(String),
        moderation: expect.any(String),
        coverImages: expect.any(Array),
        links: expect.any(Array),
        notifications: expect.any(Array),
      })
    })
  })

  describe('updateUserProfile', () => {
    it('update user profile with type of member, previously was workspace', async () => {
      const userProfile = FactoryUser({
        _id: 'my-user-profile',
        _authID: 'my-user-profile',
        profileType: 'workspace',
        workspaceType: 'extrusion',
      })
      // Act
      await store.updateUserProfile(
        FactoryUser({
          ...userProfile,
          profileType: 'member',
        }) as Partial<IUserPP>,
      )

      // Assert
      expect(store.db.set).toHaveBeenCalledWith(
        expect.not.objectContaining({
          subType: 'extrusion',
        }),
      )
    })
  })
})
