import { observable, action } from 'mobx'
import { db } from '../../utils/firebase'
import { ITutorial } from 'src/models/models'

export class DocStore {
  // we have two property relating to docs that can be observed
  @observable
  public activeTutorial: ITutorial | undefined
  @observable
  public allTutorials: ITutorial[] = []

  // call getDocList to query 'tutorials' from db and map response to docs observable
  @action
  public async getDocList() {
    const ref = await db.collection('documentation').get()
    this.allTutorials = ref.docs.map(doc => doc.data() as ITutorial)
  }
  @action
  public async getDocBySlug(slug: string) {
    const ref = db
      .collection('documentation')
      .where('slug', '==', slug)
      .limit(1)
    const collection = await ref.get()
    const activeTutorial =
      collection.docs.length > 0
        ? (collection.docs[0].data() as ITutorial)
        : undefined
    this.activeTutorial = activeTutorial
    return activeTutorial
  }
}
