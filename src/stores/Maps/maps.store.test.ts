import { IModerationStatus } from 'oa-shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { MapsStore } from './maps.store'

import type { IUserPPDB } from 'oa-shared'

vi.mock('../common/module.store')

describe('maps.store', () => {
  let store

  beforeEach(() => {
    store = new MapsStore({} as any)
  })

  describe('setUserPin', () => {
    it('adds a new member pin as approved', async () => {
      // Arrange
      store.db.get = vi.fn().mockResolvedValue(null)

      // Act
      await store.setUserPin({
        profileType: 'member',
        location: {
          latlng: {
            lat: 0,
            lng: 0,
          },
        },
      } as any)

      // Assert
      expect(store.db.set).toHaveBeenCalledWith(
        expect.objectContaining({
          moderation: IModerationStatus.ACCEPTED,
        }),
      )
    })

    it('updates a member pin without requiring approval', async () => {
      // Act
      await store.setUserPin({
        profileType: 'member',
        location: {
          latlng: {
            lat: 0,
            lng: 0,
          },
        },
      } as any)

      // Assert
      expect(store.db.set).toHaveBeenCalledWith(
        expect.objectContaining({
          moderation: IModerationStatus.ACCEPTED,
        }),
      )
    })

    it('marks a map pin without a location as deleted', async () => {
      // Act
      await store.setUserPin({
        profileType: 'member',
        location: {
          latlng: null,
        },
      } as any)

      // Assert
      expect(store.db.set).toHaveBeenCalledWith(
        expect.objectContaining({
          _deleted: true,
        }),
      )
    })

    it('sets a non member pin as awaiting moderation', async () => {
      // Arrange
      store.db.get = vi.fn().mockResolvedValue(null)

      // Act
      await store.setUserPin({
        profileType: 'workspace',
        location: {
          latlng: {
            lat: 0,
            lng: 0,
          },
        },
      })

      // Assert
      expect(store.db.set).toHaveBeenCalledWith(
        expect.objectContaining({
          moderation: IModerationStatus.AWAITING_MODERATION,
        }),
      )
    })

    it('sets a non member pin as awaiting moderation if pin type changes', async () => {
      // Arrange
      store.db.get = vi.fn().mockResolvedValue({
        profileType: 'member',
        moderation: IModerationStatus.ACCEPTED,
      })

      // Act
      await store.setUserPin({
        profileType: 'workspace',
        location: {
          latlng: {
            lat: 0,
            lng: 0,
          },
        },
      })

      // Assert
      expect(store.db.set).toHaveBeenCalledWith(
        expect.objectContaining({
          moderation: IModerationStatus.AWAITING_MODERATION,
        }),
      )
    })

    it('sets a non member pin as awaiting moderation if not previously accepted', async () => {
      // Arrange
      store.db.get = vi.fn().mockResolvedValue({
        profileType: 'workspace',
        moderation: IModerationStatus.REJECTED,
      })

      // Act
      await store.setUserPin({
        profileType: 'workspace',
        location: {
          latlng: {
            lat: 0,
            lng: 0,
          },
        },
      })

      // Assert
      expect(store.db.set).toHaveBeenCalledWith(
        expect.objectContaining({
          moderation: IModerationStatus.AWAITING_MODERATION,
        }),
      )
    })

    it('sets a non member pin as accepted if previously accepted', async () => {
      // Arrange
      store.db.get = vi.fn().mockResolvedValue({
        type: 'workspace',
        moderation: IModerationStatus.ACCEPTED,
      })

      // Act
      await store.setUserPin({
        profileType: 'workspace',
        location: {
          latlng: {
            lat: 0,
            lng: 0,
          },
        },
      })

      // Assert
      expect(store.db.set).toHaveBeenCalledWith(
        expect.objectContaining({
          moderation: IModerationStatus.ACCEPTED,
        }),
      )
    })

    it('do not set subType if passed with member profile', async () => {
      await store.setUserPin({
        profileType: 'member',
        workspaceType: 'shredder',
        location: {
          latlng: {
            lat: 0,
            lng: 0,
          },
        },
      })

      // Assert
      expect(store.db.set).toHaveBeenCalledWith(
        expect.not.objectContaining({
          subType: 'shredder',
        }),
      )
    })
  })

  describe('deleteUserPin', () => {
    it('marks a pin as _deleted', async () => {
      // Arrange
      store.db.get = vi.fn().mockResolvedValue([{ _id: 'existing' }])

      // Act
      await store.deleteUserPin({
        userName: 'existing',
      } as IUserPPDB)

      // Assert
      expect(store.db.update).toHaveBeenCalledWith(
        expect.objectContaining({
          _deleted: true,
        }),
      )
    })
  })
})
