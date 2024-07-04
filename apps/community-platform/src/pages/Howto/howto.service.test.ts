import '@testing-library/jest-dom/vitest'

import { UserRole } from '@onearmy.apps/shared'
import { describe, expect, it, vi } from 'vitest'

import { FactoryUser } from '../../test/factories/User'
import { exportedForTesting } from './howto.service'

const mockWhere = vi.fn()
const mockOrderBy = vi.fn()
const mockLimit = vi.fn()
const mockOr = vi.fn()
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  and: vi.fn(),
  where: (path, op, value) => mockWhere(path, op, value),
  limit: (limit) => mockLimit(limit),
  orderBy: (field, direction) => mockOrderBy(field, direction),
  or: (constraints) => mockOr(constraints),
}))

vi.mock('../../stores/databaseV2/endpoints', () => ({
  DB_ENDPOINTS: {
    howtos: 'howtos',
    categories: 'categories',
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

describe('howtos.search', () => {
  it('searches for text', () => {
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

  it('filters by category', () => {
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

  it('should not call orderBy if sorting by most relevant', () => {
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

  it('should call orderBy when sorting is not MostRelevant', () => {
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
