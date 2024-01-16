import { action, makeObservable, observable } from 'mobx'
import { arrayToJson } from 'src/utils/helpers'

import { ModuleStore } from '../common/module.store'

import type { ITag } from 'src/models/tags.model'
import type { RootStore } from '..'

export class TagsStore extends ModuleStore {
  @observable
  public allTags: ITag[] = []
  @observable
  public allTagsByKey: { [key: string]: ITag } = {}

  constructor(rootStore: RootStore) {
    super(rootStore, 'tags')
    // call init immediately for tags so they are available to all pages
    super.init()
    makeObservable(this)
    this.allDocs$.subscribe((docs: ITag[]) => {
      this.setAllTags(docs)
    })
  }

  @action
  private setAllTags(docs: ITag[]) {
    this.allTags = docs.sort((a, b) => (a.label > b.label ? 1 : -1))
    this.allTagsByKey = arrayToJson(docs, '_id')
  }

  public saveTag(tag: Partial<ITag>) {
    return this.db.collection('tags').doc(tag._id).set(tag)
  }
}
