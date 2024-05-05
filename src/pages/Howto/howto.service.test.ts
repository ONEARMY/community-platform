import '@testing-library/jest-dom'

import { UserRole } from 'oa-shared/models'
import { FactoryUser } from 'src/test/factories/User'

import { exportedForTesting } from './howto.service'

const mockWhere = jest.fn()
const mockOrderBy = jest.fn()
const mockLimit = jest.fn()
const mockOr = jest.fn()
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  and: jest.fn(),
  where: (path, op, value) => mockWhere(path, op, value),
  limit: (limit) => mockLimit(limit),
  orderBy: (field, direction) => mockOrderBy(field, direction),
  or: (constraints) => mockOr(constraints),
}))

jest.mock('../../stores/databaseV2/endpoints', () => ({
  DB_ENDPOINTS: {
    howtos: 'howtos',
    categories: 'categories',
  },
}))

jest.mock('../../config/config', () => ({
  getConfigurationOption: jest.fn(),
  FIREBASE_CONFIG: {
    apiKey: 'AIyChVN',
    databaseURL: 'https://test.firebaseio.com',
    projectId: 'test',
    storageBucket: 'test.appspot.com',
  },
  localStorage: jest.fn(),
}))

describe('howtos.search', () => {
  it('searches for text', async () => {
    // prepare
    const words = ['test', 'text']

    // act
    exportedForTesting.createQueries(
      words,
      '',
      'MostRelevant',
      undefined,
      undefined,
    )

    // assert
    expect(mockWhere).toHaveBeenCalledWith(
      'keywords',
      'array-contains-any',
      words,
    )
  })

  it('filters by category', async () => {
    // prepare
    const category = 'cat1'

    // act
    exportedForTesting.createQueries(
      [],
      category,
      'MostRelevant',
      undefined,
      undefined,
    )

    // assert
    expect(mockWhere).toHaveBeenCalledWith('category._id', '==', category)
  })

  it('should not call orderBy if sorting by most relevant', async () => {
    // act
    exportedForTesting.createQueries(
      ['test'],
      '',
      'MostRelevant',
      undefined,
      undefined,
    )

    // assert
    expect(mockOrderBy).toHaveBeenCalledTimes(0)
  })

  it('should call orderBy when sorting is not MostRelevant', async () => {
    // act
    exportedForTesting.createQueries(
      ['test'],
      '',
      'Newest',
      undefined,
      undefined,
    )

    // assert
    expect(mockOrderBy).toHaveBeenLastCalledWith('_created', 'desc')
  })

  it('should limit results', () => {
    // prepare
    const take = 12

    // act
    exportedForTesting.createQueries(
      ['test'],
      '',
      'Newest',
      undefined,
      undefined,
      take,
    )

    // assert
    expect(mockLimit).toHaveBeenLastCalledWith(take)
  })

  it('should filter by moderation status when user is admin', () => {
    // act
    exportedForTesting.createQueries(
      ['test'],
      '',
      'Newest',
      FactoryUser({
        userRoles: [UserRole.ADMIN],
      }),
      undefined,
    )

    // assert
    expect(mockWhere).toHaveBeenCalledWith('moderation', '==', 'accepted')
    expect(mockWhere).toHaveBeenCalledWith(
      'moderation',
      '==',
      'awaiting-moderation',
    )
    expect(mockWhere).toHaveBeenCalledWith(
      'moderation',
      '==',
      'improvements-needed',
    )
  })

  it('should only filter by accepted if user is not authenticated', () => {
    // act
    exportedForTesting.createQueries([], '', 'Newest', undefined, undefined)

    // assert
    expect(mockWhere).toHaveBeenLastCalledWith('moderation', '==', 'accepted')
  })
})
