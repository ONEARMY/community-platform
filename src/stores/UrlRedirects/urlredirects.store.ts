import type { RootStore } from 'src/stores/index'
import { action } from 'mobx'
import { ModuleStore } from '../common/module.store'
import { IHowtoDB, UrlRedirect } from 'src/models'
import { logger } from 'src/logger'

export class UrlRedirectsStore extends ModuleStore {
  constructor(rootStore: RootStore) {
    super(rootStore, 'urlredirects')
  }

  private async getCollection() {
    return await this.db
      .collection<UrlRedirect>('urlredirects')
  }

  @action
  public async getByPath(path: string): Promise<UrlRedirect | null> {
    logger.debug('urlredirect.store.getByPath', { path });
    const collection = await this.getCollection();
    const [urlRedirect]: UrlRedirect[] = await collection
      .getWhere('path', '==', path);

    if (!urlRedirect) {
      return null;
    }

    return urlRedirect;
  }

  @action
  public async getTargetDocument(path = '') {
    if (!path) {
      return null;
    }

    const urlRedirect = await this.getByPath(path);

    if (!urlRedirect) {
      logger.debug(`urlredirect.store.getTargetDocument`, `No redirects found`);
      return null;
    }

    const destinationDocRef = await this.db
      .collection(urlRedirect.documentType)
      .doc(urlRedirect.documentId);

    if (!destinationDocRef) {
      logger.debug('urlredirect.store.getTargetDocument', 'No matching document found')
      return null
    }

    return await destinationDocRef.get() as IHowtoDB;
  }
}
