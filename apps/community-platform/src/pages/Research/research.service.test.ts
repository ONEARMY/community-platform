import '@testing-library/jest-dom/vitest'

import { ResearchStatus } from '@onearmy.apps/shared'
import { describe, expect, it, vi } from 'vitest'

import { exportedForTesting } from './research.service'

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
    research: 'research',
    researchCategories: 'researchCategories',
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

describe('research.search', () => {
  it('searches for text', () => {
    // prepare
    const words = ['test', 'text']

    // act
    exportedForTesting.createSearchQuery(words, '', 'MostRelevant', null)

    // assert
    expect(mockWhere).toHaveBeenCalledWith(
      'keywords',
      'array-contains-any',
      words,
    )
  })

  it('filters by category', () => {
    // prepare
    const category = 'cat1'

    // act
    exportedForTesting.createSearchQuery([], category, 'MostRelevant', null)

    // assert
    expect(mockWhere).toHaveBeenCalledWith(
      'researchCategory._id',
      '==',
      category,
    )
  })

  it('should not call orderBy if sorting by most relevant', () => {
    // act
    exportedForTesting.createSearchQuery(['test'], '', 'MostRelevant', null)

    // assert
    expect(mockOrderBy).toHaveBeenCalledTimes(0)
  })

  it('should call orderBy when sorting is not MostRelevant', () => {
    // act
    exportedForTesting.createSearchQuery(['test'], '', 'Newest', null)

    // assert
    expect(mockOrderBy).toHaveBeenLastCalledWith('_created', 'desc')
  })

  it('should filter by research status', () => {
    // act
    exportedForTesting.createSearchQuery(
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

  it('should limit results', () => {
    // prepare
    const take = 12

    // act
    exportedForTesting.createSearchQuery(
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
