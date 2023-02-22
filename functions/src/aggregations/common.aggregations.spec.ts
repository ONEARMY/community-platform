import { handleDBAggregations, IAggregation } from './common.aggregations'

import { FirebaseEmulatedTest } from '../test/Firebase/emulator'
import { DB_ENDPOINTS } from '../models'

/** Utility for creating a mock aggregation */
const aggregationFactory = (
  overrides: Partial<IAggregation> = {},
): IAggregation => ({
  changeType: 'updated',
  process: ({ dbChange }) => ({ [dbChange.after.id]: true }),
  sourceCollection: 'test_source' as any,
  sourceFields: ['test_field'],
  targetCollection: 'aggregations', // needs to be real endpoint for db lookup
  targetDocId: 'test_aggregation',
  ...overrides,
})

/** Utility to create a mock db change */
const dbChangeFactory = (beforeData: any, afterData: any, docId: string) => {
  return FirebaseEmulatedTest.mockFirestoreChangeObject(
    beforeData,
    afterData,
    'test_source' as any,
    docId,
  )
}

describe('Common Aggregations', () => {
  const db = FirebaseEmulatedTest.admin.firestore()

  beforeEach(async () => {
    // Calls to emulator will fail if collection never created,
    // so initialise required endpoints with a doc and then delete
    await FirebaseEmulatedTest.seedFirestoreDB('test_source' as any)
    await FirebaseEmulatedTest.seedFirestoreDB('aggregations' as any)
  })
  afterEach(async () => {
    jest.resetAllMocks()
    await FirebaseEmulatedTest.clearFirestoreDB()
  })

  it('runs aggregation with initial seed', async () => {
    // Create 2 intial documents
    const ref1 = db.collection('test_source').doc('doc_1')
    const ref2 = db.collection('test_source').doc('doc_2')
    await ref1.set({ test_field: 'before' })
    await ref2.set({ test_field: 'before' })

    // Trigger the aggregation function with a mock change on doc_1
    // This should prompt the seed method to read from both documents
    const before = { test_field: 'before' }
    const after = { test_field: 'after' }
    const mockChange = dbChangeFactory(before, after, 'doc_1')
    const mockProcessor = jest.fn(({ dbChange }) => ({
      [dbChange.after.id]: true,
    }))
    const mockAggregation = aggregationFactory({ process: mockProcessor })
    await handleDBAggregations(mockChange, [mockAggregation])

    // Check that the document processor has been called and that
    expect(mockProcessor).toHaveBeenCalledTimes(2)

    // Check the db populates individual docs into the combined aggregation
    const snapshot = await db
      .collection(DB_ENDPOINTS.aggregations)
      .doc('test_aggregation')
      .get()
    expect(snapshot.data()).toEqual({ doc_1: true, doc_2: true })

    // Create a new update, this time tracking how many times the document processor called
    const ref3 = db.collection('test_source').doc('doc_3')
    await ref3.set({ test_field: 'before' })

    await handleDBAggregations(dbChangeFactory(before, after, 'doc_3'), [
      mockAggregation,
    ])

    // Check that only a single update processed (not re-seeded)
    expect(mockProcessor).toHaveBeenCalledTimes(3)
  })
})
/**
 * TODO
 * - Add checks for ignored fields
 * - Try to split into multiple separate tests (hard due to the nature of seeding)
 */
