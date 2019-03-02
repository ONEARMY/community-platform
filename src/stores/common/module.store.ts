import { BehaviorSubject, Subscription } from 'rxjs'
import { Database } from '../database'

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
  constructor(public basePath: string) {
    console.log('initiating store', basePath)
    this.getCollection(basePath)
  }

  // when accessing a collection want to call the database getCollection method which
  // efficiently checks the cache first and emits any subsequent updates
  // we will stop subscribing
  public getCollection(path: string) {
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
}
