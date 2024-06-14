import '@testing-library/jest-dom/vitest'

import { describe, expect, it, vi } from 'vitest'

import { exportedForTesting } from './question.service'

const mockWhere = vi.fn()
const mockOrderBy = vi.fn()
const mockLimit = vi.fn()
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  and: vi.fn(),
  where: (path, op, value) => mockWhere(path, op, value),
  limit: (limit) => mockLimit(limit),
  orderBy: (field, direction) => mockOrderBy(field, direction),
}))

vi.mock('../../stores/databaseV2/endpoints', () => ({
  DB_ENDPOINTS: {
    questions: 'questions',
    questionCategories: 'questionCategories',
  },
}))

vi.mock('../../config/config', () => ({
  getConfigurationOption: vi.fn(),
  FIREBASE_CONFIG: {
    apiKey: 'AIyChVN',
    databaseURL: 'https://test.firebaseio.com',
    projectId: 'test',
    storageBucket: 'test.appspot.com',
  },
  localStorage: vi.fn(),
  SITE: 'unit-tests',
}))

describe('question.search', () => {
  it('searches for text', async () => {
    // prepare
    const words = ['test', 'text']

    // act
    exportedForTesting.createQueries(words, '', 'MostRelevant')

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
    exportedForTesting.createQueries([], category, 'MostRelevant')

    // assert
    expect(mockWhere).toHaveBeenCalledWith(
      'questionCategory._id',
      '==',
      category,
    )
  })

  it('should not call orderBy if sorting by most relevant', async () => {
    // act
    exportedForTesting.createQueries(['test'], '', 'MostRelevant')

    // assert
    expect(mockOrderBy).toHaveBeenCalledTimes(0)
  })

  it('should call orderBy when sorting is not MostRelevant', async () => {
    // act
    exportedForTesting.createQueries(['test'], '', 'Newest')

    // assert
    expect(mockOrderBy).toHaveBeenLastCalledWith('_created', 'desc')
  })

  it('should limit results', async () => {
    // prepare
    const take = 12

    // act
    exportedForTesting.createQueries(['test'], '', 'Newest', undefined, take)

    // assert
    expect(mockLimit).toHaveBeenLastCalledWith(take)
  })
})
