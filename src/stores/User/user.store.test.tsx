jest.mock('../common/module.store')
import { faker } from '@faker-js/faker'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { EmailNotificationFrequency } from 'oa-shared'
import { FactoryHowto } from 'src/test/factories/Howto'
import { FactoryResearchItem } from 'src/test/factories/ResearchItem'
import { FactoryUser } from 'src/test/factories/User'

import { UserStore } from './user.store'

import type { IUserPP } from 'src/models/userPreciousPlastic.models'

jest.mock('firebase/auth', () => {
  const auth = jest.requireActual('firebase/auth')
  return {
    ...auth,
    getAuth: () => ({
      ...auth,
      currentUser: {
        displayName: 'testDisplayName',
        uid: 'testUid',
      },
    }),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithEmailAndPassword: jest.fn(),
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn(),
    updateProfile: jest.fn(),
  }
})

describe('userStore', () => {
  let store

  beforeEach(() => {
    store = new UserStore({} as any)
  })

  describe('login', () => {
    it('hands off to firebase auth', async () => {
      const userName = faker.internet.userName()
      const password = faker.internet.password()

      await store.login(userName, password)

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        userName,
        password,
      )
    })
  })

  describe('getUserByUsername', () => {
    it('returns a well formed user object', async () => {
      store.db.getWhere.mockReturnValueOnce([
        FactoryUser({
          _authID: 'an-auth-id',
          _id: 'an-auth-id',
          _created: new Date('2023-01-01').toString(),
          _lastActive: new Date('2020-01-01').toString(),
        }),
      ])

      // Act
      const res = await store.getUserByUsername('testUserName')

      // Assert
      expect(res).toEqual(
        expect.objectContaining({
          _id: 'an-auth-id',
        }),
      )
    })
  })

  describe('getUserProfile', () => {
    it('returns a well formed user object', async () => {
      // Lookup1
      store.db.getWhere.mockReturnValueOnce([
        FactoryUser({
          _authID: 'an-auth-id',
          _id: 'an-auth-id',
          _created: new Date('2023-01-01').toString(),
          _lastActive: new Date('2020-01-01').toString(),
        }),
      ])

      // Lookup2
      store.db.getWhere.mockReturnValueOnce([])

      // Assert
      expect(await store.getUserProfile('an-auth-id')).toEqual({
        _contentModifiedTimestamp: expect.any(String),
        _created: expect.any(String),
        _deleted: expect.any(Boolean),
        _lastActive: expect.any(String),
        _id: 'an-auth-id',
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

    it('falls back to auth property for lookup when no user found', async () => {
      // Lookup1
      store.db.getWhere.mockReturnValueOnce([])

      // Lookup2
      store.db.getWhere.mockReturnValueOnce([
        FactoryUser({
          _authID: 'an-auth-id',
          _id: 'an-auth-id',
          _created: new Date('2023-01-01').toString(),
          _lastActive: new Date('2020-01-01').toString(),
        }),
      ])

      // Assert
      expect(await store.getUserProfile('an-auth-id')).toEqual({
        _contentModifiedTimestamp: expect.any(String),
        _created: expect.any(String),
        _deleted: expect.any(Boolean),
        _lastActive: expect.any(String),
        _id: 'an-auth-id',
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

  describe('getUserCreatedDocs', () => {
    it('returns documents created and collaborated on by the user, with accepted moderation status', async () => {
      // Mock database calls
      store.db.getWhere.mockReturnValueOnce([
        FactoryHowto({ _createdBy: 'testUserID', moderation: 'accepted' }),
      ])
      store.db.getWhere.mockReturnValueOnce([
        FactoryResearchItem({
          _createdBy: 'testUserID',
          moderation: 'accepted',
        }),
      ])
      store.db.getWhere.mockReturnValueOnce([
        FactoryResearchItem({
          collaborators: ['testUserID'],
          moderation: 'accepted',
        }),
      ])

      // Act
      const res = await store.getUserCreatedDocs('testUserID')

      // Assert
      expect(res).toEqual({
        howtos: [
          expect.objectContaining({
            _createdBy: 'testUserID',
            moderation: 'accepted',
          }),
        ],
        research: [
          expect.objectContaining({
            _createdBy: 'testUserID',
            moderation: 'accepted',
          }),
          expect.objectContaining({
            collaborators: ['testUserID'],
            moderation: 'accepted',
          }),
        ],
      })
    })

    it('returns an empty object if no documents are found', async () => {
      // Mock database calls to return empty arrays
      store.db.getWhere.mockReturnValueOnce([])
      store.db.getWhere.mockReturnValueOnce([])
      store.db.getWhere.mockReturnValueOnce([])

      // Act
      const res = await store.getUserCreatedDocs('testUserID')

      // Assert
      expect(res).toEqual({ howtos: [], research: [] })
    })

    it('filters out documents with moderation status other than "accepted"', async () => {
      // Mock database calls to include documents with different moderation statuses
      store.db.getWhere.mockReturnValueOnce([
        FactoryHowto({ _createdBy: 'testUserID', moderation: 'draft' }),
        FactoryHowto({ _createdBy: 'testUserID', moderation: 'rejected' }),
        FactoryHowto({ _createdBy: 'testUserID', moderation: 'accepted' }),
      ])
      store.db.getWhere.mockReturnValueOnce([
        FactoryResearchItem({ moderation: 'draft' }),
        FactoryResearchItem({ moderation: 'accepted' }),
      ])
      store.db.getWhere.mockReturnValueOnce([
        FactoryResearchItem({ moderation: 'draft' }),
      ])

      // Act
      const res = await store.getUserCreatedDocs('testUserID')

      // Assert
      expect(res.howtos).toHaveLength(1) // Only the accepted howto should be included
      expect(res.research).toHaveLength(1) // Only the accepted research document should be included
    })
  })

  describe('updateUserBadge', () => {
    it('updates the user badges in the database', async () => {
      // Act

      await store.updateUserBadge('testUserId', { badge1: true, badge2: false })

      // Assert
      expect(store.db.update).toHaveBeenCalledWith(
        expect.objectContaining({
          _id: 'testUserId',
          badges: { badge1: true, badge2: false },
        }),
      )
    })
  })

  describe('getUserEmail', () => {
    it('fetches correct property off authUser', async () => {
      // Act
      const email = faker.internet.email()
      store.authUser = {
        email,
      }
      const res = await store.getUserEmail()

      // Assert
      expect(res).toBe(email)
    })
  })

  describe('updateUserImpact', () => {
    it('throws an error if user undefined', async () => {
      // Act
      expect(async () => {
        await store.updateUserImpact(
          {
            impact: { total: 100, totalPreciousPlastic: 100 },
          },
          '2024',
          'testUserId',
        )
      }).rejects.toThrow()
    })

    it('updates the user impact in the database', async () => {
      store.user = FactoryUser({
        _id: 'testUserId',
      })
      const impactYear = faker.datatype.number({ min: 2019, max: 2023 })
      // Act
      await store.updateUserImpact(
        { impact: { total: 100, totalPreciousPlastic: 100 } },
        impactYear,
        'testUserId',
      )

      // Assert
      expect(store.db.update).toHaveBeenCalledWith(
        expect.objectContaining({
          [`impact.${impactYear}`]: {
            impact: { total: 100, totalPreciousPlastic: 100 },
          },
        }),
      )
    })
  })

  describe('unsubscribeUser', () => {
    it('throws error for user not found', async () => {
      // Arrange
      store.db.getWhere.mockReturnValueOnce([])

      // Act
      expect(async () => {
        await store.unsubscribeUser('testUserId')
      }).rejects.toThrow('User not found')
    })

    it('unsubscribes the user', async () => {
      // Arrange
      store.db.getWhere.mockReturnValueOnce([FactoryUser()])

      // Act
      await store.unsubscribeUser('testUserId')

      // Assert
      expect(store.db.update).toHaveBeenCalledWith(
        expect.objectContaining({
          notification_settings: {
            emailFrequency: EmailNotificationFrequency.NEVER,
          },
        }),
      )
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
          workspaceType: 'extrusion',
        }),
      )
    })
  })

  describe('registerNewUser', () => {
    it('registers a new user', async () => {
      store.loadUserAggregations = jest.fn()
      store.authUnsubscribe = jest.fn()

      await store.registerNewUser(
        'newuser@example.com',
        'password',
        'testDisplayName',
      )

      expect(store.db.set).toHaveBeenCalledWith({
        coverImages: [],
        links: [],
        moderation: 'awaiting-moderation',
        verified: false,
        _authID: 'testUid',
        displayName: 'testDisplayName',
        userName: 'testdisplayname',
        notifications: [],
        profileCreated: expect.any(String),
        profileCreationTrigger: 'registration',
        notification_settings: {
          emailFrequency: EmailNotificationFrequency.WEEKLY,
        },
      })
    })
  })
})
