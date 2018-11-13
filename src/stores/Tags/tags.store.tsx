import { observable, action, computed } from 'mobx'
import { db } from '../../utils/firebase'
import { ITag } from 'src/models/models'
import { TAGS_MOCK } from 'src/mocks/tags.mock'

export class TagsStore {
  @observable
  public tags: ITag[] = []

  constructor() {
    this.subscribeToTags()
  }

  public subscribeToTags() {
    db.collection('tags').onSnapshot(snapshot => {
      const tags: ITag[] = snapshot.docs.map(doc => doc.data() as ITag)
      this.updateTags(tags)
    })
  }

  @action
  public updateTags(tags: ITag[]) {
    this.tags = tags
  }

  // sometimes during testing we might want to put the mock data in the database
  // if so call this method
  private uploadTagsMockToDatabase() {
    const batch = db.batch()
    TAGS_MOCK.forEach(tag => {
      if (tag._key) {
        const ref = db.doc(`tags/${tag._key}`)
        batch.set(ref, tag)
      }
    })
    batch
      .commit()
      .then(
        () => console.log('commit successful'),
        err => console.log('commit rejected', err),
      )
      .catch(err => console.log('batch commit err', err))
  }
}
