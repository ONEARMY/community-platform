import { BehaviorSubject, Subscription } from 'rxjs'
import { stripSpecialCharacters } from 'src/utils/helpers'
import isUrl from 'is-url'
import { ISelectedTags } from 'src/models/tags.model'
import { IDBEndpoint, ILocation } from 'src/models/common.models'
import { includesAll } from 'src/utils/filters'
import { RootStore } from '..'
import { DBEndpoint } from '../databaseV2/types'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'
import { IUploadedFileMeta, Storage } from '../storage'

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

  // when a module store is initiated automatically load the docs in the collection
  // this can be subscribed to in individual stores
  constructor(private rootStore: RootStore, basePath?: IDBEndpoint) {
    if (basePath) {
      this._subscribeToCollection(basePath)
    }
  }

  // use getters for root store bindings as will not be available during constructor method
  get db() {
    return this.rootStore.dbV2
  }
  get activeUser() {
    return this.rootStore.stores.userStore.user
  }

  /****************************************************************************
   *            Database Management Methods
   * **************************************************************************/

  // when accessing a collection want to call the database getCollection method which
  // efficiently checks the cache first and emits any subsequent updates
  private _subscribeToCollection(endpoint: DBEndpoint) {
    this.allDocs$.next([])
    this.activeCollectionSubscription.unsubscribe()
    this.activeCollectionSubscription = this.db
      .collection(endpoint)
      .stream(data => {
        this.allDocs$.next(data)
      })
  }

  /****************************************************************************
   *            Data Validation Methods
   * **************************************************************************/

  public isSlugUnique = async (slug: string, endpoint: IDBEndpoint) => {
    try {
      const matches = await this.db
        .collection(endpoint)
        .getWhere('slug', '==', slug)
      return false
      // TODO - Pending code merge
      // return matches.length > 0
    } catch (e) {
      return 'Titles must be unique, please try being more specific'
    }
  }

  public validateTitle = async (value: any, endpoint: IDBEndpoint) => {
    if (value) {
      const error = this.isSlugUnique(
        stripSpecialCharacters(value).toLowerCase(),
        endpoint,
      )
      return error
    } else {
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
      ? collection.filter(obj => {
          const tags = obj.tags ? Object.keys(obj.tags) : null
          return tags ? includesAll(selectedTagsArr, tags) : false
        })
      : collection
  }
  public filterCollectionByLocation<T extends ICollectionWithLocation>(
    collection: T[] = [],
    selectedLocation: ILocation,
  ) {
    return collection.filter(obj => {
      return obj.location.name === selectedLocation.name
    })
  }

  public uploadFileToCollection(
    file: File | IConvertedFileMeta | IUploadedFileMeta,
    collection: string,
    id: string,
  ) {
    console.log('uploading file', file)
    // if already uploaded (e.g. editing but not replaced), skip
    if (file.hasOwnProperty('downloadUrl')) {
      console.log('file already uploaded, skipping')
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
    const promises = files.map(async file => {
      return this.uploadFileToCollection(file, collection, id)
    })
    return Promise.all(promises)
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
