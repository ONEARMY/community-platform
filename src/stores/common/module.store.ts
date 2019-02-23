import { Subject, BehaviorSubject, Subscription } from 'rxjs'
import { Database } from '../database'

export class ModuleStore {
  cacheLoaded = false
  liveLoaded = false
  allDocs$ = new BehaviorSubject<any[]>([])
  activeDoc$ = new BehaviorSubject<any>(null)
  private activeDocSub: Subscription

  // when a module store is initiated automatically load the docs in the collection
  constructor(basePath: string) {
    console.log('initiating store', basePath)
    this.getCollection(basePath)
  }

  // when accessing a collection want to call the database getCollection method which
  // efficiently checks the cache first and emits any subsequent updates
  // we will stop subscribing
  public getCollection(path: string) {
    const collection$ = Database.getCollection(path)
    collection$.subscribe(data => {
      this.allDocs$.next(data)
      if (this.cacheLoaded) {
        this.liveLoaded = true
      } else {
        this.cacheLoaded = true
      }
    })
  }

  public setActiveDoc(key: string, value: string) {
    this.activeDocSub.unsubscribe()
    this.activeDocSub = this.allDocs$.subscribe(docs => {
      const doc = docs.find(d => d[key] === value)
      this.activeDoc$.next(doc)
    })
  }
}
