import { ModuleStore } from './module.store'
import { RootStore } from '../index'
import { DatabaseV2 } from '../databaseV2'

// Mocked to prevent App initialisation from useCommonStores dependency
jest.mock('react-dom')
// Mocked to prevent indexedDB API not found error message
jest.mock('src/stores/databaseV2/clients/dexie')
// Mocked to prevent circular dependency through useCommonStores
jest.mock('src/index')
// Mocked to mock out RootStore
jest.mock('src/stores/index')

const collectionMock = jest.fn()
class MockDB extends DatabaseV2 {
  collection = collectionMock
}

const rootStoreMock = jest.mocked(new RootStore())
rootStoreMock.dbV2 = new MockDB()
const store = new ModuleStore(rootStoreMock, 'howtos')

const givenMatches = (matches: { _id: string }[]) => {
  collectionMock.mockReturnValue({
    getWhere: () => matches,
  })
}

describe('module.store', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('isTitleThatReusesSlug', () => {
    it('returns true if title reuses the slug of another doc', async () => {
      const title = 'A test title'
      givenMatches([{ _id: 'match-with-previous-slug-a-test-title' }])

      const isReusedSlug = await store.isTitleThatReusesSlug(title)

      expect(isReusedSlug).toBeTruthy()
    })

    it('returns false if only match found has given ID', async () => {
      const title = 'Building a compost toilet'
      const _id = 'unique-identifier'
      givenMatches([{ _id }])

      const isReusedSlug = await store.isTitleThatReusesSlug(title, _id)

      expect(isReusedSlug).toBeFalsy()
    })

    it('returns true if it has matches with and without given ID', async () => {
      const title = 'Writing a unit test'
      const _id = 'unique-identifier'
      givenMatches([{ _id }, { _id: 'another-identifier' }])

      const isReusedSlug = await store.isTitleThatReusesSlug(title, _id)

      expect(isReusedSlug).toBeTruthy()
    })
  })
})
