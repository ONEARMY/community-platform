import { action, computed, makeObservable, observable } from 'mobx'

import { arrayToJson } from '../../utils/helpers'
import { ModuleStore } from '../common/module.store'

import type { ICategory } from '../../models/categories.model'
import type { IRootStore } from '../RootStore'

export class CategoriesStore extends ModuleStore {
  public allCategories: ICategory[] = []
  public allCategoriesByKey: { [key: string]: ICategory } = {}

  constructor(rootStore: IRootStore) {
    super(rootStore, 'categories')
    // call init immediately for tags so they are available to all pages
    super.init()
    makeObservable(this, {
      allCategories: observable,
      allCategoriesByKey: observable,
      setAllCategories: action,
      saveCategory: action,
      deleteCategory: action,
      categoriesLabels: computed,
    })
    this.allDocs$.subscribe((docs) => this.setAllCategories(docs))
  }

  public setAllCategories(docs: ICategory[]) {
    this.allCategories = docs.sort((a, b) => (a.label > b.label ? 1 : -1))
    this.allCategoriesByKey = arrayToJson(docs, '_id')
  }

  public saveCategory(category: Partial<ICategory>) {
    return this.db.collection('categories').doc(category._id).set(category)
  }

  public deleteCategory(category: Partial<ICategory>) {
    return this.db.collection('categories').doc(category._id).delete()
  }

  get categoriesLabels() {
    return this.allCategories.map((category) => category.label)
  }
}
