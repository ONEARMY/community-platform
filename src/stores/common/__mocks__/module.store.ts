/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable max-classes-per-file */
export class MockDBStore {
  collection = jest.fn().mockReturnThis()
  doc = jest.fn().mockReturnThis()
  set = jest.fn().mockReturnThis()
  get = jest.fn().mockReturnThis()
  getWhere = jest.fn().mockReturnThis()
  update = jest.fn().mockReturnThis()
}

export class ModuleStore {
  /**
   * Rough mock of firestore methods to allow chaining
   * collection(name).doc(id)
   **/
  db = new MockDBStore()
  activeUser = {}
  allDocs$ = {
    subscribe: jest.fn(),
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
