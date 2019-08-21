import { BehaviorSubject, Subscription } from 'rxjs'
import { Database } from '../database'
import { stripSpecialCharacters } from 'src/utils/helpers'
import isUrl from 'is-url'
import { TagCategory } from 'src/models/tags.model'
import { IDBEndpoint } from 'src/models/common.models'

/*  The module store contains common methods used across modules that access specfic
    collections on the database
*/

export class ModuleStore {
  allDocs$ = new BehaviorSubject<any[]>([])
  activeDoc$ = new BehaviorSubject<any>(null)
  private activeDocSubscription = new Subscription()
  private activeCollectionSubscription = new Subscription()

  // when a module store is initiated automatically load the docs in the collection
  // this can be subscribed to in individual stores
  constructor(public basePath: IDBEndpoint) {
    this.getCollection(basePath)
  }

  /****************************************************************************
   *            Database Management Methods
   * **************************************************************************/

  // when accessing a collection want to call the database getCollection method which
  // efficiently checks the cache first and emits any subsequent updates
  public getCollection(path: IDBEndpoint) {
    this.allDocs$.next([])
    this.activeCollectionSubscription.unsubscribe()
    this.activeCollectionSubscription = Database.getCollection(path).subscribe(
      data => {
        this.allDocs$.next(data)
      },
    )
    return this.activeCollectionSubscription
  }

  // find a doc within the existing persisted collection via key-value match
  // optionally specify a subcollection to load on change
  public setActiveDoc(key: string, value: string) {
    // first emit undefined to clear any old records
    // use undefined instead of null to keep consistent with later find method
    this.activeDoc$.next(undefined)
    this.activeDocSubscription.unsubscribe()
    this.activeDocSubscription = this.allDocs$.subscribe(docs => {
      const doc = docs.find(d => d[key] === value)
      this.activeDoc$.next(doc)
    })
  }

  /****************************************************************************
   *            Data Validation Methods
   * **************************************************************************/

  public isSlugUnique = async (slug: string, endpoint: IDBEndpoint) => {
    try {
      await Database.checkSlugUnique(endpoint, slug)
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
}
