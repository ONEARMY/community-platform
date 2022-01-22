export class ModuleStore {
  db = {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    getWhere: jest.fn().mockReturnThis(),
  }

  constructor() { }
}
