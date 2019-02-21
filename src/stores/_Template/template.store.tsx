import { observable, action, computed } from 'mobx'
import { afs } from '../../utils/firebase'

interface IExampleDoc {
  savedNumber: number
}

export class TemplateStore {
  // observables are data variables that can be subscribed to and change over time
  @observable
  public randomNumber: number
  public exampleDoc: IExampleDoc
  public exampleCollection: IExampleDoc[]

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
    const ref = await afs.doc('_Demo/example1').get()
    this.exampleDoc = ref.data() as IExampleDoc
  }
  // example getting a collection of documents from the main database at a given endpoint path
  @action
  public async dbCollectionRequest() {
    const ref = await afs.collection('_Demo').get()
    this.exampleCollection = ref.docs.map(doc => doc.data() as IExampleDoc)
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
