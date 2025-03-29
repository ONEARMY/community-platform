import { BehaviorSubject, Subscription } from 'rxjs'
import { logger } from 'src/logger'
import { includesAll } from 'src/utils/filters'
import { formatLowerNoSpecial, randomID } from 'src/utils/helpers'

import { Storage } from '../storage'

import type {
  DBEndpoint,
  IConvertedFileMeta,
  ILocation,
  ISelectedTags,
  IUploadedFileMeta,
} from 'oa-shared'
import type { IRootStore } from '../RootStore'

/**
 * The module store is used to share methods and data between other stores, including
 * `db` - the common database
 * `activeUser` - the user store user
 * As well as data validation and filtering methods
 *
 * @param basePath - By providing a basepath the documents at that collection endpoint
 * are automatically subscribed to, and available via `allDocs$`
 */

export class ModuleStore {
  allDocs$ = new BehaviorSubject<any[]>([])
  private activeCollectionSubscription = new Subscription()
  isInitialized = false

  // when a module store is initiated automatically load the docs in the collection
  /****************************************************************************
   *            Data Validation Methods
   * **************************************************************************/
  public isTitleThatReusesSlug = async (title: string, originalId?: string) => {
    const slug = this._createSlug(title)

    // check for previous titles
    const previousMatches = await this.db
      .collection(this.basePath!)
      .getWhere('previousSlugs', 'array-contains', slug)
    const previousOtherMatches = previousMatches.filter(
      (match) => match._id !== originalId,
    ) // exclude current document

    if (previousOtherMatches.length > 0) return true

    // check for current titles
    const currentMatches = await this.db
      .collection(this.basePath!)
      .getWhere('slug', '==', slug)
    const currentOtherMatches = currentMatches.filter(
      (match) => match._id !== originalId,
    ) // exclude current document
    return currentOtherMatches.length > 0
  }

  public setPreviousSlugs = (
    doc: ICollectionWithPreviousSlugs,
    slug: string,
  ): string[] => {
    const { previousSlugs } = doc
    if (!previousSlugs) return [slug]

    if (slug && previousSlugs.includes(slug)) {
      return previousSlugs
    }

    return [...previousSlugs, slug]
  }

  public setSlug = async (doc): Promise<string> => {
    const { slug, title, _id } = doc

    if (!doc || !title) throw Error('Document not slug-able')

    const newSlug = this._createSlug(title)
    if (newSlug === slug) return slug

    const isSlugTaken = await this.isTitleThatReusesSlug(title, _id)

    if (isSlugTaken) {
      const slugWithRandomId = `${newSlug}-${randomID().toLocaleLowerCase()}`
      return slugWithRandomId
    }

    return newSlug
  }

  private _createSlug = (title: string) => {
    return formatLowerNoSpecial(title)
  }

  // this can be subscribed to in individual stores
  constructor(
    private rootStore: IRootStore,
    private basePath?: DBEndpoint,
  ) {
    this.rootStore = rootStore

    if (!this.rootStore) {
      throw new Error('Root store is required')
    }
  }

  /**
   * By default all stores are injected and made available on first app load.
   * In order to avoid loading all data immediately, include an init function that can
   * be called from a specific page load instead.
   */
  init() {
    if (!this.isInitialized) {
      if (this.basePath) {
        this.syncAndEmitDocs(this.basePath)
        this.isInitialized = true
      }
    }
  }

  // use getters for root store bindings as will not be available during constructor method
  get db() {
    return this.rootStore!.dbV2
  }

  get activeUser() {
    return this.rootStore!.stores.userStore.user
  }

  get userStore() {
    return this.rootStore!.stores.userStore
  }

  get mapsStore() {
    return this.rootStore!.stores.mapsStore
  }
  get aggregationsStore() {
    return this.rootStore!.stores.aggregationsStore
  }
  get userNotificationsStore() {
    return this.rootStore!.stores.userNotificationsStore
  }

  get discussionStore() {
    return this.rootStore!.stores.discussionStore
  }

  /****************************************************************************
   *            Database Management Methods
   * **************************************************************************/

  // when accessing a collection want to call the database getCollection method which
  /****************************************************************************
   *            Filtering Methods
   * **************************************************************************/
  public filterCollectionByTags<T extends ICollectionWithTags>(
    collection: T[] = [],
    selectedTags: ISelectedTags,
  ) {
    const selectedTagsArr = Object.keys(selectedTags)
    return selectedTagsArr.length > 0
      ? collection.filter((obj) => {
          const tags = obj.tags ? Object.keys(obj.tags) : null
          return tags ? includesAll(selectedTagsArr, tags) : false
        })
      : collection
  }
  public filterCollectionByLocation<T extends ICollectionWithLocation>(
    collection: T[] = [],
    selectedLocation: ILocation,
  ) {
    return collection.filter((obj) => {
      return obj.location.name === selectedLocation.name
    })
  }
  public async uploadFileToCollection(
    file: File | IConvertedFileMeta | IUploadedFileMeta,
    collection: string,
    id: string,
  ) {
    logger.debug('uploading file', file)
    // if already uploaded (e.g. editing but not replaced), skip
    if (Object.prototype.hasOwnProperty.call(file, 'downloadUrl')) {
      logger.debug('file already uploaded, skipping')
      return file as IUploadedFileMeta
    }
    // switch between converted file meta or standard file input
    let data: File | Blob = file as File
    if (Object.prototype.hasOwnProperty.call(file, 'photoData')) {
      file = file as IConvertedFileMeta
      data = file.photoData
    }
    return Storage.uploadFile(
      `uploads/${collection}/${id}`,
      file.name,
      data,
      file.type,
    )
  }
  public uploadCollectionBatch(
    files: (File | IConvertedFileMeta)[],
    collection: string,
    id: string,
  ) {
    const promises = files.map((file) => {
      return this.uploadFileToCollection(file, collection, id)
    })
    return Promise.all(promises)
  }
  /** Sync all server docs locally and stream output changes */
  private syncAndEmitDocs(endpoint: DBEndpoint) {
    this.allDocs$.next([])
    this.activeCollectionSubscription.unsubscribe()
    this.activeCollectionSubscription = this.db
      .collection(endpoint)
      .syncLocally(
        (data) => {
          this.allDocs$.next(data)
        },
        { keepAlive: false },
      )
  }
}

// collection typings to ensure correct fields are available for filter
interface ICollectionWithTags {
  // NOTE - tags field can't be ensured as firebase ignores empty tags:{}
  tags?: ISelectedTags
}
interface ICollectionWithLocation {
  location: ILocation
}

interface ICollectionWithPreviousSlugs {
  previousSlugs?: string[]
}
