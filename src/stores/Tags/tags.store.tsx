import { observable, action, computed } from 'mobx'
import { afs } from '../../utils/firebase'
import { TAGS_MOCK } from 'src/mocks/tags.mock'
import { ITagQuery, ITag } from 'src/models/tags.model'
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
    afs.collection('tags').onSnapshot(snapshot => {
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
    const batch = afs.batch()
    TAGS_MOCK.forEach(tag => {
      if (tag._key) {
        const ref = afs.doc(`tags/${tag._key}`)
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
