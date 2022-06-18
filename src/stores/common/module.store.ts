import { BehaviorSubject, Subscription } from 'rxjs'
import { stripSpecialCharacters } from 'src/utils/helpers'
import isUrl from 'is-url'
import type { ISelectedTags } from 'src/models/tags.model'
import type { IDBEndpoint, ILocation } from 'src/models/common.models'
import { includesAll } from 'src/utils/filters'
import type { RootStore } from '../index'
import type { IConvertedFileMeta } from 'src/types'
import type { IUploadedFileMeta } from '../storage'
import { Storage } from '../storage'
import { useCommonStores } from 'src/index'
import { logger } from 'src/logger'
import type { NotificationType } from 'src/models'

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
  // this can be subscribed to in individual stores
  constructor(private rootStore: RootStore, private basePath?: IDBEndpoint) {
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
    return this.rootStore.dbV2
  }

  get activeUser() {
    return this.rootStore.stores.userStore.user
  }

  get userStore() {
    return this.rootStore.stores.userStore
  }

  get mapsStore() {
    return this.rootStore.stores.mapsStore
  }
  get aggregationsStore() {
    return this.rootStore.stores.aggregationsStore
  }

  /****************************************************************************
   *            Database Management Methods
   * **************************************************************************/

  // when accessing a collection want to call the database getCollection method which
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

  /****************************************************************************
   *            Data Validation Methods
   * **************************************************************************/

  public checkIsUnique = async (
    endpoint: IDBEndpoint,
    field: string,
    value: string,
    originalId?: string,
  ) => {
    const matches = await this.db
      .collection(endpoint)
      .getWhere(field, '==', value)
    if (
      typeof originalId !== 'undefined' &&
      matches.length === 1 &&
      matches[0]._id === originalId
    ) {
      return true
    }
    return matches.length > 0 ? false : true
  }

  /** Validator method to pass to react-final-form. Takes a given title,
   *  converts to corresponding slug and checks uniqueness.
   *  Provide originalId to prevent matching against own entry.
   *  NOTE - return value represents the error, so FALSE actually means valid
   */
  public validateTitleForSlug = async (
    title: string,
    endpoint: IDBEndpoint,
    originalId?: string,
  ) => {
    if (title) {
      const slug = stripSpecialCharacters(title).toLowerCase()
      const unique = await this.checkIsUnique(
        endpoint,
        'slug',
        slug,
        originalId,
      )
      return unique
        ? false
        : 'Titles must be unique, please try being more specific'
    } else {
      // if no title submitted, simply return message to say that it is required
      return 'Required'
    }
  }

  public validateUrl = async (value: any) => {
    return value ? (isUrl(value) ? undefined : 'Invalid url') : 'Required'
  }
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
    if (file.hasOwnProperty('downloadUrl')) {
      logger.debug('file already uploaded, skipping')
      return file as IUploadedFileMeta
    }
    // switch between converted file meta or standard file input
    let data: File | Blob = file as File
    if (file.hasOwnProperty('photoData')) {
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

  public async parseMentions(
    text: string,
  ): Promise<{ text: string; mentionedUsers: Set<string> }> {
    let mentions = text.split(' ')
    mentions = mentions.map((w) => w.trim())
    mentions = mentions.filter((w) => w.startsWith('@'))
    const mentionedUsers = new Set<string>()
    for (const mention of mentions) {
      const userId = mention.replace('@', '')
      const userProfile = await this.userStore.getUserProfile(userId)
      if (userProfile) {
        const username = userProfile.userName
        const link = '/u/' + userProfile.userName
        text = text.replace(mention, `@[${username}:${link}]`)
        console.log(text)
        mentionedUsers.add(userId)
      }
    }
    return { text, mentionedUsers }
  }

  public async notifyMentionedUsers(
    mentionedUsers: Set<string>,
    mentionType: NotificationType,
    relevantLink: string,
  ) {
    const mentionedUsersArr = Array.from(mentionedUsers)
    for (const mentionedUserId of mentionedUsersArr) {
      await this.userStore.triggerNotification(
        mentionType,
        mentionedUserId,
        relevantLink,
      )
    }
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
