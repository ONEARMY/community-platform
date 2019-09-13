import { observable, action } from 'mobx'
import { ITag, TagCategory } from 'src/models/tags.model'
import { arrayToJson } from 'src/utils/helpers'
import { ModuleStore } from '../common/module.store'
import { RootStore } from '..'

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

  constructor(rootStore: RootStore) {
    super('v2_tags', rootStore)
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
}
