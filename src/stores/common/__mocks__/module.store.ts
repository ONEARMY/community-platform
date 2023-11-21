/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable max-classes-per-file */
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
}

export type IMockDB = typeof ModuleStore.prototype.db
