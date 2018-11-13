import { observable, action, computed } from 'mobx'
import { db } from '../../utils/firebase'
import { ITag } from 'src/models/models'
import { TAGS_MOCK } from 'src/mocks/tags.mock'
import { ITagQuery } from 'src/models/tags.model'
import helpers from '../../utils/helpers'

export class TagsStore {
  @observable
  public tags: ITag[] = []
  public tagsByKey: { [key: string]: ITag } = {}

  constructor() {
    this.subscribeToTags()
  }

  // when tags are received from the database we want to populate the _key field and
  // dispatch back to the observable tags property
  public subscribeToTags() {
    db.collection('tags').onSnapshot(snapshot => {
      const tags: ITag[] = snapshot.docs.map(doc => {
        const data = doc.data() as ITagQuery
        const tag: ITag = { ...data, _key: doc.id }
        return tag
      })
      this.updateTags(tags)
    })
  }

  @action
  public updateTags(tags: ITag[]) {
    this.tags = tags
    this.tagsByKey = helpers.arrayToJson(tags, '_key')
    console.log('tags', tags)
    console.log('tagsByKey', this.tagsByKey)
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
