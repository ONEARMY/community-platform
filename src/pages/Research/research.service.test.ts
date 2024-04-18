import '@testing-library/jest-dom'

import { ResearchStatus } from 'oa-shared'

import { exportedForTesting } from './research.service'

const mockWhere = jest.fn()
const mockOrderBy = jest.fn()
const mockLimit = jest.fn()
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  and: jest.fn(),
  where: (path, op, value) => mockWhere(path, op, value),
  limit: (limit) => mockLimit(limit),
  orderBy: (field, direction) => mockOrderBy(field, direction),
}))

jest.mock('../../stores/databaseV2/endpoints', () => ({
  DB_ENDPOINTS: {
    research: 'research',
    researchCategories: 'researchCategories',
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

describe('research.search', () => {
  it('searches for text', async () => {
    // prepare
    const words = ['test', 'text']

    // act
    exportedForTesting.createQueries(words, '', 'MostRelevant', null)

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
    exportedForTesting.createQueries([], category, 'MostRelevant', null)

    // assert
    expect(mockWhere).toHaveBeenCalledWith(
      'researchCategory._id',
      '==',
      category,
    )
  })

  it('should not call orderBy if sorting by most relevant', async () => {
    // act
    exportedForTesting.createQueries(['test'], '', 'MostRelevant', null)

    // assert
    expect(mockOrderBy).toHaveBeenCalledTimes(0)
  })

  it('should call orderBy when sorting is not MostRelevant', async () => {
    // act
    exportedForTesting.createQueries(['test'], '', 'Newest', null)

    // assert
    expect(mockOrderBy).toHaveBeenLastCalledWith('_created', 'desc')
  })

  it('should call orderBy when sorting is not MostRelevant', async () => {
    // act
    exportedForTesting.createQueries(
      ['test'],
      '',
      'Newest',
      ResearchStatus.COMPLETED,
    )

    // assert
    expect(mockWhere).toHaveBeenCalledWith(
      'researchStatus',
      '==',
      ResearchStatus.COMPLETED,
    )
  })

  it('should limit results', async () => {
    // prepare
    const take = 12

    // act
    exportedForTesting.createQueries(
      ['test'],
      '',
      'Newest',
      null,
      undefined,
      take,
    )

    // assert
    expect(mockLimit).toHaveBeenLastCalledWith(take)
  })
})
