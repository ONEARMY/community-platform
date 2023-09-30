jest.mock('../common/module.store')
import { MapsStore } from './maps.store'

describe('maps.store', () => {
  let store

  beforeEach(() => {
    store = new MapsStore({} as any)
  })

  describe('setUserPin', () => {
    it('adds a new member pin as approved', async () => {
      // Arrange
      store.db.get = jest.fn().mockResolvedValue(null)

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
          moderation: 'accepted',
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
          moderation: 'accepted',
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
      store.db.get = jest.fn().mockResolvedValue(null)

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
          moderation: 'awaiting-moderation',
        }),
      )
    })

    it('sets a non member pin as awaiting moderation if pin type changes', async () => {
      // Arrange
      store.db.get = jest.fn().mockResolvedValue({
        profileType: 'member',
        moderation: 'accepted',
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
          moderation: 'awaiting-moderation',
        }),
      )
    })

    it('sets a non member pin as awaiting moderation if not previously accepted', async () => {
      // Arrange
      store.db.get = jest.fn().mockResolvedValue({
        profileType: 'workspace',
        moderation: 'rejected',
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
          moderation: 'awaiting-moderation',
        }),
      )
    })

    it('sets a non member pin as accepted if previously accepted', async () => {
      // Arrange
      store.db.get = jest.fn().mockResolvedValue({
        type: 'workspace',
        moderation: 'accepted',
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
          moderation: 'accepted',
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
})
