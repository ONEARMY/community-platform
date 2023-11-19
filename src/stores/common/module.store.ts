import isUrl from 'is-url'
import { BehaviorSubject, Subscription } from 'rxjs'
import { useCommonStores } from 'src/index'
import { logger } from 'src/logger'
import { includesAll } from 'src/utils/filters'
import { stripSpecialCharacters } from 'src/utils/helpers'

import { Storage } from '../storage'

import type { ISelectedTags } from 'src/models/tags.model'
import type { IDBEndpoint, ILocation } from 'src/models/common.models'
import type { RootStore } from '../index'
import type { IConvertedFileMeta } from '../../types'
import type { IUploadedFileMeta } from '../storage'
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
    const slug = stripSpecialCharacters(title).toLowerCase()

    // check for previous titles
    const previousMatches = await this.db
      .collection(this.basePath!)
      .getWhere('previousSlugs', 'array-contains', slug)
    const previousOtherMatches = previousMatches.filter(
      (match) => match._id !== originalId,
    ) // exclude current document

    // check for current titles
    const currentMatches = await this.db
      .collection(this.basePath!)
      .getWhere('slug', '==', slug)
    const currentOtherMatches = currentMatches.filter(
      (match) => match._id !== originalId,
    ) // exclude current document
    return currentOtherMatches.length > 0 || previousOtherMatches.length > 0
  }

  public validateUrl = async (value: any) => {
    return value ? (isUrl(value) ? undefined : 'Invalid url') : 'Required'
  }
  // this can be subscribed to in individual stores
  constructor(private rootStore?: RootStore, private basePath?: IDBEndpoint) {
    if (!rootStore) {
      this.rootStore = useCommonStores()
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
        this._subscribeToCollection(this.basePath)
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
  public async uploadCollectionBatch(
    files: (File | IConvertedFileMeta)[],
    collection: string,
    id: string,
  ) {
    const promises = files.map(async (file) => {
      return this.uploadFileToCollection(file, collection, id)
    })
    return Promise.all(promises)
  }
  // efficiently checks the cache first and emits any subsequent updates
  private _subscribeToCollection(endpoint: IDBEndpoint) {
    this.allDocs$.next([])
    this.activeCollectionSubscription.unsubscribe()
    this.activeCollectionSubscription = this.db
      .collection(endpoint)
      .stream((data) => {
        this.allDocs$.next(data)
      })
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
