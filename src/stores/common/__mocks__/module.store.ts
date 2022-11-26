export class ModuleStore {
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
