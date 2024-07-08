import { faker } from '@faker-js/faker'
import { DB_ENDPOINTS } from 'src/models/dbEndpoints'
import { describe, expect, it, vi } from 'vitest'

import { mapPinService } from './map.service'

const mockWhere = vi.fn()
const mockLimit = vi.fn()
const mockQuery = vi.fn()
const mockCollection = vi.fn()

const mockQuerySnapshot = {
  docs: [{ data: () => {} }],
}

const mockGetDocs = vi.fn().mockResolvedValue(mockQuerySnapshot)
vi.mock('firebase/firestore', () => ({
  collection: (_firebase, connectionName) => mockCollection(connectionName),
  query: (collectionRef, whereResult) => mockQuery(collectionRef, whereResult),
  where: (path, op, value) => mockWhere(path, op, value),
  limit: (limit) => mockLimit(limit),
  getDocs: (arg) => mockGetDocs(arg),
}))

describe('map.service', () => {
  describe('getMapPins', () => {
    it('fetches map pins', async () => {
      // prepare
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve([{ _id: '1' }]),
      })

      // act
      const result = await mapPinService.getMapPins()

      // assert
      expect(result).toEqual([{ _id: '1' }])
    })

    it('handles errors', async () => {
      // prepare
      global.fetch = vi.fn().mockRejectedValue('error')

      // act
      const result = await mapPinService.getMapPins()

      // assert
      expect(result).toEqual([])
    })
  })

  describe('getMapPinByUserId', () => {
    it('fetches map pin by user id', async () => {
      // prepare
      global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ _id: '1' }),
      })

      // act
      const result = await mapPinService.getMapPinByUserId('1')

      // assert
      expect(result).toEqual({ _id: '1' })
    })

    it('handles errors', async () => {
      // prepare
      global.fetch = vi.fn().mockRejectedValue('error')

      // act
      const result = await mapPinService.getMapPinByUserId('1')

      // assert
      expect(result).toBeNull()
    })
  })

  describe('getMapPinSelf', () => {
    it('fetches user map pin', async () => {
      // prepare
      const userId = faker.internet.userName()

      // act
      await mapPinService.getMapPinSelf(userId)

      // assert
      expect(mockCollection).toHaveBeenCalledWith(DB_ENDPOINTS.mappins)
      expect(mockWhere).toHaveBeenCalledWith('_id', '==', userId)
      expect(mockGetDocs).toHaveBeenCalled()
    })
  })
})
