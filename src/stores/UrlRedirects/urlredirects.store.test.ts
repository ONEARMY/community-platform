jest.mock('../common/module.store')
import { UrlRedirectsStore } from "./urlredirects.store"

describe('urlredirects.store', () => {
  let store;

  beforeEach(() => {
    store = new UrlRedirectsStore({} as any);
  })

  describe('getTargetDocument', () => {
    it('returns a null document', async () => {
      expect(await store.getTargetDocument()).toBeNull();
    });

    it('returns a null document if there are no matching urlredirect documents', async () => {
      // Arrange
      jest.spyOn(UrlRedirectsStore.prototype as any, 'getCollection').mockImplementation(() => {
        return Promise.resolve({
          getWhere: jest.fn().mockResolvedValue([])
        })
      });

      // Act
      expect(await store.getTargetDocument())
        .toBeNull();
    });

    it('returns a well formed document', async () => {
      // Arrange
      jest.spyOn(UrlRedirectsStore.prototype as any, 'getCollection').mockImplementation(() => {
        return Promise.resolve({
          getWhere: jest.fn().mockResolvedValue([
            {
              documentType: 'howto',
              documentId: 'exampleId',
            }
          ])
        })
      });

      // Act
      await store.getTargetDocument('/how-to/abc');

      // Assert
      expect(store.db.collection).toHaveBeenCalledWith('howto')
      expect(store.db.doc).toHaveBeenCalledWith('exampleId');
    })
  });
});