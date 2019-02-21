import { observable, action } from 'mobx'
import {
  IDiscussionQuestion,
  IDiscussionComment,
} from 'src/models/discussions.models'
import { Database } from '../database'

export class DiscussionsStore {
  // we have two property relating to docs that can be observed
  @observable
  public activeDiscussion: IDiscussionQuestion | undefined
  @observable
  public allDiscussionComments: IDiscussionComment[] = []
  @observable
  public allDiscussions: IDiscussionQuestion[] = []

  // call getDocList to query 'discussions' from db and map response to docs observable
  @action
  public async getDocList() {
    Database.getCollection('discussions').subscribe(data => {
      console.log('data received', data)
      this.allDiscussions = data as IDiscussionQuestion[]
    })
  }
  // @action
  // public async getDocBySlug(slug: string) {
  //   const ref = db
  //     .collection('documentation')
  //     .where('slug', '==', slug)
  //     .limit(1)
  //   const collection = await ref.get()
  //   const activeHowto =
  //     collection.docs.length > 0
  //       ? (collection.docs[0].data() as IHowto)
  //       : undefined
  //   this.activeHowto = activeHowto
  //   return activeHowto
  // }
}
