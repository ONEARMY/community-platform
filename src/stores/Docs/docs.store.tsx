import { observable, action } from 'mobx'
import { db } from '../../utils/firebase'
import { ITutorial } from 'src/models/models'

export class DocStore {
  // we have one property, namely docs which can be observed
  @observable
  public docs: ITutorial[] = []

  // call getDocList to query 'tutorials' from db and map response to docs observable
  @action
  public async getDocList() {
    const ref = await db.collection('tutorials').get()
    this.docs = ref.docs.map(doc => doc.data() as ITutorial)
  }
}
