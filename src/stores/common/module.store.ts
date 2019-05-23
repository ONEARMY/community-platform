import { BehaviorSubject, Subscription } from 'rxjs'
import { Database, IDBEndpoints } from '../database'
import { FieldState } from 'final-form'
import { stripSpecialCharacters } from 'src/utils/helpers'

/*  The module store contains common methods used across modules that access specfic
    collections on the database
*/

export class ModuleStore {
  cacheLoaded = false
  allDocs$ = new BehaviorSubject<any[]>([])
  activeDoc$ = new BehaviorSubject<any>(null)
  private activeDocSubscription = new Subscription()
  private activeCollectionSubscription = new Subscription()

  // when a module store is initiated automatically load the docs in the collection
  constructor(public basePath: IDBEndpoints) {
    this.getCollection(basePath)
  }

  // when accessing a collection want to call the database getCollection method which
  // efficiently checks the cache first and emits any subsequent updates
  // we will stop subscribing
  public getCollection(path: IDBEndpoints) {
    this.allDocs$.next([])
    this.activeCollectionSubscription.unsubscribe()
    this.activeCollectionSubscription = Database.getCollection(path).subscribe(
      data => {
        this.allDocs$.next(data)
        // first emit from cache, future emits will be from live but only if data is newer
        if (!this.cacheLoaded) {
          this.cacheLoaded = true
        }
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

  public isSlugUnique = async (slug: string, endpoint: IDBEndpoints) => {
    try {
      await Database.checkSlugUnique(endpoint, slug)
    } catch (e) {
      return 'Titles must be unique, please try being more specific'
    }
  }

  public validateTitle = async (
    value: any,
    endpoint: IDBEndpoints,
    meta?: FieldState,
  ) => {
    if (meta && (!meta.dirty && meta.valid)) {
      return undefined
    }
    if (value) {
      const error = this.isSlugUnique(
        stripSpecialCharacters(value).toLowerCase(),
        endpoint,
      )
      return error
    } else if ((meta && (meta.touched || meta.visited)) || value === '') {
      return 'A title is required'
    }
    return undefined
  }
}
