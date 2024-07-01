import { action, makeObservable, observable } from 'mobx'
import { arrayToJson } from 'src/utils/helpers'

import { ModuleStore } from '../common/module.store'

import type { ITag } from 'src/models/tags.model'
import type { IRootStore } from '../RootStore'

export class TagsStore extends ModuleStore {
  public allTags: ITag[] = []
  public allTagsByKey: { [key: string]: ITag } = {}

  constructor(rootStore: IRootStore) {
    super(rootStore, 'tags')
    // call init immediately for tags so they are available to all pages
    super.init()
    makeObservable(this, {
      allTags: observable,
      allTagsByKey: observable,
      setAllTags: action,
    })

    this.allDocs$.subscribe(async (docs: ITag[]) => {
      await this.setAllTags(docs)
    })
  }

  public setAllTags(docs: ITag[]) {
    this.allTags = docs.sort((a, b) => (a.label > b.label ? 1 : -1))
    this.allTagsByKey = arrayToJson(docs, '_id')
  }

  public saveTag(tag: Partial<ITag>) {
    return this.db.collection('tags').doc(tag._id).set(tag)
  }
}
