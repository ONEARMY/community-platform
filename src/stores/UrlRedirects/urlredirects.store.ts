import type { RootStore } from 'src/stores/index'
import { action } from 'mobx'
import { ModuleStore } from '../common/module.store'
import { UrlRedirect } from 'src/models'
import { logger } from 'src/logger'

export class UrlRedirectsStore extends ModuleStore {
  constructor(rootStore: RootStore) {
    super(rootStore, 'urlredirects')
    // call init immediately for tags so they are available to all pages
    super.init()
  }

  @action
  public async getByPath(path: string): Promise<UrlRedirect> {
    const urlRedirect: UrlRedirect[] = await this.db
      .collection<UrlRedirect>('urlredirects')
      .getWhere('path', '==', path);


    if (!urlRedirect?.length) {
      throw new Error('Matching UrlRedirect not found.');
    }

    return urlRedirect[0];
  }

  public async getDestination(redirect: any):Promise<string> {
    logger.debug(`UrlRedirectsStore.getDestination`, {redirect})
    const destinationDocRef = await this.db
      .collection(redirect.documentType)
      .doc(redirect.documentId);

    if (destinationDocRef) {
      const doc: any = await destinationDocRef.get();
      console.log({destinationDocRef});
      return doc && doc?.slug ? `/how-to/${doc?.slug}` : '';
    }

    return '';
  }

  @action
  public add(urlredirect: Partial<UrlRedirect>) {
    const $dbRef = this.db
      .collection('urlredirects')
      .doc(undefined);

    return $dbRef
      .set(urlredirect)
  }
}
