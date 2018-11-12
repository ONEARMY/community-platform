import { observable, action } from 'mobx'
import { db } from '../../utils/firebase'
import { ITutorial } from 'src/models/models'

export class DocStore {
  // we have two property relating to docs that can be observed
  @observable
  public activeTutorial: ITutorial | undefined
  public allTutorials: ITutorial[] = []

  // call getDocList to query 'tutorials' from db and map response to docs observable
  @action
  public async getDocList() {
    console.log('getting doc list')
    const ref = await db.collection('documentation').get()
    this.allTutorials = ref.docs.map(doc => doc.data() as ITutorial)
    console.log('tutorials retrieved', this.allTutorials)
  }
  public async getDocBySlug(slug: string) {
    const ref = db
      .collection('documentation')
      .where('slug', '==', slug)
      .limit(1)
    const collection = await ref.get()
    this.activeTutorial =
      collection.docs.length > 0
        ? (collection.docs[0].data() as ITutorial)
        : undefined
    return this.activeTutorial
  }
}
