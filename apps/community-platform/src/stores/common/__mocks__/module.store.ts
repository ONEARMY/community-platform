// eslint-disable-next-line max-classes-per-file
import { vi } from 'vitest'

export class MockDBStore {
  collection = vi.fn().mockReturnThis()
  doc = vi.fn().mockReturnThis()
  set = vi.fn().mockReturnThis()
  get = vi.fn().mockReturnThis()
  getWhere = vi.fn().mockReturnThis()
  update = vi.fn().mockReturnThis()
}

export class ModuleStore {
  /**
   * Rough mock of firestore methods to allow chaining
   * collection(name).doc(id)
   **/
  db = new MockDBStore()
  activeUser = {}
  allDocs$ = {
    subscribe: vi.fn(),
  }

  constructor() {}

  public uploadCollectionBatch() {}

  public init() {}

  public setActiveUser(user: any) {
    this.activeUser = user
  }

  public isTitleThatReusesSlug() {}

  public setPreviousSlugs(doc) {
    return doc.previousSlugs
  }

  public setSlug(doc) {
    return doc.slug
  }
}

export type IMockDB = typeof ModuleStore.prototype.db
