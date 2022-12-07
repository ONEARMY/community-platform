export class ModuleStore {
  /**
   * Rough mock of firestore methods to allow chaining
   * collection(name).doc(id)
   **/
  db = {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    getWhere: jest.fn().mockReturnThis(),
  }
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
}

export type IMockDB = typeof ModuleStore.prototype.db
