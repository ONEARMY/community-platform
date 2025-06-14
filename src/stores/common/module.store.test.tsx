import { afterEach, describe, expect, it, vi } from 'vitest'

import { DatabaseV2 } from '../databaseV2/DatabaseV2'
import { RootStore } from '../RootStore'
import { ModuleStore } from './module.store'

// Mocked to prevent App initialisation from useCommonStores dependency
vi.mock('react-dom')
// Mocked to prevent indexedDB API not found error message
vi.mock('src/stores/databaseV2/clients/DexieClient')
// Mocked to prevent circular dependency through useCommonStores
vi.mock('src/common/hooks/useCommonStores')
// Mocked to mock out RootStore
vi.mock('src/stores/RootStore')

const collectionMock = vi.fn()
class MockDB extends DatabaseV2 {
  collection = collectionMock
}

const rootStoreMock = vi.mocked(new RootStore())
rootStoreMock.dbV2 = new MockDB()
const store = new ModuleStore(rootStoreMock)

const givenMatches = (matches: { _id: string }[]) => {
  collectionMock.mockReturnValue({
    getWhere: () => matches,
  })
}

describe('module.store', () => {
  afterEach(() => {
    vi.restoreAllMocks()
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

  describe('setPreviousSlugs', () => {
    it('returns an array with the slug when list is undefined', () => {
      const slug = 'whatever'
      const doc = {
        previousSlugs: undefined,
      }

      const previousSlugs = store.setPreviousSlugs(doc, slug)
      const expectation = [slug]

      expect(previousSlugs).toEqual(expectation)
    })

    it('returns an array with the slug in when a list is provided', () => {
      const slug = 'whatever'
      const previousSlugs = ['old-thing', 'another-one']
      const doc = {
        previousSlugs,
      }

      const newPreviousSlugs = store.setPreviousSlugs(doc, slug)
      const expectation = [...previousSlugs, slug]

      expect(newPreviousSlugs).toEqual(expectation)
    })

    it('returns an array with the slug when in the list already', () => {
      const slug = 'old-thing'
      const previousSlugs = ['old-thing', 'another-one']
      const doc = {
        previousSlugs,
      }

      const newPreviousSlugs = store.setPreviousSlugs(doc, slug)

      expect(newPreviousSlugs).toEqual(previousSlugs)
    })
  })

  describe('setSlug', () => {
    it('throws an error if an empty document is provided', async () => {
      expect(async () => await store.setSlug({})).rejects.toThrow()
    })

    it('returns a slug based on the title', async () => {
      givenMatches([])

      const doc = {
        title: 'Words with Gaps',
        slug: 'old-slug',
      }
      const expectedSlug = 'words-with-gaps'

      const newSlug = await store.setSlug(doc)

      expect(newSlug).toEqual(expectedSlug)
    })

    it('returns the slug without checks if already the same as set', async () => {
      givenMatches([])
      const spy = vi.spyOn(store, 'isTitleThatReusesSlug')

      const slug = 'same-slug'
      const doc = {
        _id: 'hdfg8721',
        title: 'Same Slug',
        slug,
      }

      const newSlug = await store.setSlug(doc)

      expect(newSlug).toEqual(slug)
      expect(spy.mock.calls.length).toBe(0)
    })

    it('adds a random id if the simple slug is taken already', async () => {
      givenMatches([{ _id: 'another-identifier' }])

      const doc = {
        _id: 'agfh412',
        title: 'Slug Taken',
        slug: 'old-slug',
      }

      const newSlug = await store.setSlug(doc)

      expect(newSlug).not.toEqual('slug-taken')
      expect(newSlug).toContain('slug-taken-')
    })
  })
})
