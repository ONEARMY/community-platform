import { faker } from '@faker-js/faker'
import { DB_ENDPOINTS } from 'src/models'

import { mapPinService } from './map.service'

const mockWhere = jest.fn()
const mockLimit = jest.fn()
const mockQuery = jest.fn()
const mockCollection = jest.fn()

const mockQuerySnapshot = {
  docs: [{ data: () => {} }],
}

const mockGetDocs = jest.fn().mockResolvedValue(mockQuerySnapshot)
jest.mock('firebase/firestore', () => ({
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
      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve([{ _id: '1' }]),
      })

      // act
      const result = await mapPinService.getMapPins()

      // assert
      expect(result).toEqual([{ _id: '1' }])
    })

    it('handles errors', async () => {
      // prepare
      global.fetch = jest.fn().mockRejectedValue('error')

      // act
      const result = await mapPinService.getMapPins()

      // assert
      expect(result).toEqual([])
    })
  })

  describe('getMapPinByUserId', () => {
    it('fetches map pin by user id', async () => {
      // prepare
      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.resolve({ _id: '1' }),
      })

      // act
      const result = await mapPinService.getMapPinByUserId('1')

      // assert
      expect(result).toEqual({ _id: '1' })
    })

    it('handles errors', async () => {
      // prepare
      global.fetch = jest.fn().mockRejectedValue('error')

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
