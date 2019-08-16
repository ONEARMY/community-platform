import { observable, action } from 'mobx'
import { afs } from 'src/utils/firebase'
import { TAGS_MOCK } from 'src/mocks/tags.mock'
import { ITag, TagCategory } from 'src/models/tags.model'
import { arrayToJson } from 'src/utils/helpers'
import { ModuleStore } from '../common/module.store'

export class TagsStore extends ModuleStore {
  activeCategory?: TagCategory
  @observable
  public allTags: ITag[] = []
  @observable
  public allTagsByKey: { [key: string]: ITag } = {}
  @observable
  public categoryTags: ITag[] = []
  @action public setTagsCategory(category?: TagCategory) {
    this.activeCategory = category
    this._filterTags()
  }

  constructor() {
    super('v2_tags')
    this.allDocs$.subscribe((docs: ITag[]) => {
      this.allTags = docs.sort((a, b) => (a.label > b.label ? 1 : -1))
      this.allTagsByKey = arrayToJson(docs, '_id')
      this._filterTags()
    })
  }

  private _filterTags() {
    let tags = [...this.allTags]
    if (this.activeCategory) {
      tags = tags.filter(tag =>
        tag.categories.includes(this.activeCategory as TagCategory),
      )
    }
    this.categoryTags = [...tags]
  }

  // sometimes during testing we might want to put the mock data in the database
  // currently called from super-admin page
  uploadTagsMockToDatabase() {
    const batch = afs.batch()
    TAGS_MOCK.forEach(tag => {
      if (tag._id) {
        const ref = afs.doc(`v2_tags/${tag._id}`)
        batch.set(ref, tag)
      }
    })
    return batch.commit()
  }
}
