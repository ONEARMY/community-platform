import { observable, action, makeObservable } from 'mobx'
import { ICategory } from 'src/models/categories.model'
import { arrayToJson } from 'src/utils/helpers'
import { ModuleStore } from '../common/module.store'
import { RootStore } from '..'

export class CategoriesStore extends ModuleStore {
  @observable
  public allCategories: ICategory[] = []
  @observable
  public allCategoriesByKey: { [key: string]: ICategory } = {}

  constructor(rootStore: RootStore) {
    super(rootStore, 'categories')
    this.allDocs$.subscribe((docs: ICategory[]) => {
      this.setAllCategories(docs)
    })
    makeObservable(this)
  }

  @action
  public setAllCategories(docs: ICategory[]) {
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