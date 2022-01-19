export class ModuleStore {
    db = {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
    };

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {
    }
}