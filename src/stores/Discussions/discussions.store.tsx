import { observable, action } from 'mobx'
import { db } from '../../utils/firebase'
import { IDiscussion } from 'src/models/discussions.models'

export class DiscussionStore {
  // observables are data variables that can be subscribed to and change over time
  @observable
  public allDiscussions: IDiscussion[]

  @action
  public async getDiscussionsList() {
    const ref = await db.collection('discussions').get()
    this.allDiscussions = ref.docs.map(doc => doc.data() as IDiscussion)
    console.log('discussions retrieved', this.allDiscussions)
  }
}