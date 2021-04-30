import { observable, action, makeObservable } from 'mobx'
import { RootStore } from '..'
import { ModuleStore } from '../common/module.store'
import { DBDoc } from '../databaseV2/types'

// example interface for the structure of data expected
interface IExampleDoc {
  savedNumber: number
}
// additional type used as a reminder that data that is populated in the db also contains
// additional metadata fields such as `_id` and `_modified` fields
type IExampleDocDB = IExampleDoc & DBDoc

/**
 * An example store used to provide observable data and actions.
 * By extending the ModuleStore a number of common methods and properties are made available,
 * including the current `activeUser` and the global database, or `db` objects
 */
export class TemplateStore extends ModuleStore {
  // eslint-disable-next-line
  constructor(rootStore: RootStore) {
    super(rootStore)
    // tell mobx to process the decorators and handle observers
    makeObservable(this)
  }
  // observables are data variables that can be subscribed to and change over time
  @observable
  public randomNumber: number
  public exampleDoc: IExampleDocDB
  public exampleCollection: IExampleDocDB[]

  // actions change observables
  @action
  public async generateRandomNumbers() {
    this.randomNumber = Math.round(Math.random() * 100)
    setTimeout(() => {
      this.generateRandomNumbers()
    }, 5000)
  }
  // example getting a document from the main database at a given endpoint path
  @action
  public async dbDocRequest() {
    const doc = await this.db
      // optional - specify <IExampleDocDB> to assert the types expected from the database return
      .collection<IExampleDocDB>('tags')
      .doc('myDoc')
      .get()
    this.exampleDoc = doc as IExampleDocDB
  }
  // example of getting an entire collection of documents and listening to live updates on the collection
  @action
  public async dbCollectionRequest() {
    // eslint-disable-next-line
    const docs$ = await this.db.collection<IExampleDoc>('tags').stream(docs => {
      this.exampleCollection = docs
    })
  }
}

/*************************************************************************************  
General Q & A

Q. Explain the different @ decorators
These are shorthand to wrap more complex javascript. Most are described inline but
for more information see: https://mobx.js.org/refguide

Q. How can I make the store accessbile throughout the app?
Stores created here should be added to the stores/index.tsx file and then can
be bound to via @inject (see example on template page)

Q. How can I track what is happening in the store whilst previewing the app
It is recommended you use the chrome mobx developer tools extension
https://chrome.google.com/webstore/detail/mobx-developer-tools 


Anything else you want to know? Add it to a git issue and so we can make the 
template even more useful

**************************************************************************************/
