import { observable, action, makeObservable } from 'mobx'
import type { ICategory } from 'src/models/categories.model'
import { arrayToJson } from 'src/utils/helpers'
import { ModuleStore } from '../common/module.store'
import type { RootStore } from '..'
import { logger } from 'src/logger'

export class CategoriesStore extends ModuleStore {
  @observable
  public allCategories: ICategory[] = []
  @observable
  public allCategoriesByKey: { [key: string]: ICategory } = {}

  constructor(rootStore: RootStore) {
    super(rootStore, 'categories')
    // call init immediately for tags so they are available to all pages
    super.init()
    makeObservable(this)
    this.allDocs$.subscribe(this.setAllCategories)
  }

  @action
  public setAllCategories(docs: ICategory[]) {
    logger.debug(`CategoriesStore.setAllCategories`, { docs })
    this.allCategories = docs.sort((a, b) => (a.label > b.label ? 1 : -1))
    this.allCategoriesByKey = arrayToJson(docs, '_id')
  }

  @action
  public saveCategory(category: Partial<ICategory>) {
    const doc = this.db.collection('categories').doc()
    return doc.set(category)
  }

  @action
  public deleteCategory(category: Partial<ICategory>) {
    return this.db.collection('categories').doc(category._id).delete()
  }
}
