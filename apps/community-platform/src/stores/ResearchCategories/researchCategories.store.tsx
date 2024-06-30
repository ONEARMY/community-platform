import { action, computed, makeObservable, observable } from 'mobx'

import { arrayToJson } from '../../utils/helpers'
import { ModuleStore } from '../common/module.store'

import type { IResearchCategory } from '../../models/researchCategories.model'
import type { IRootStore } from '../RootStore'

export class ResearchCategoriesStore extends ModuleStore {
  public allResearchCategories: IResearchCategory[] = []
  public allResearchCategoriesByKey: { [key: string]: IResearchCategory } = {}

  constructor(rootStore: IRootStore) {
    super(rootStore, 'researchCategories')
    // call init immediately for tags so they are available to all pages
    super.init()
    makeObservable(this, {
      allResearchCategories: observable,
      allResearchCategoriesByKey: observable,
      setAllResearchCategories: action,
      saveResearchCategory: action,
      deleteResearchCategory: action,
      researchCategoriesLabels: computed,
    })
    this.allDocs$.subscribe((docs) => this.setAllResearchCategories(docs))
  }

  public setAllResearchCategories(docs: IResearchCategory[]) {
    this.allResearchCategories = docs.sort((a, b) =>
      a.label > b.label ? 1 : -1,
    )
    this.allResearchCategoriesByKey = arrayToJson(docs, '_id')
  }

  public saveResearchCategory(researchCategory: Partial<IResearchCategory>) {
    return this.db
      .collection('researchCategories')
      .doc(researchCategory._id)
      .set(researchCategory)
  }

  public deleteResearchCategory(researchCategory: Partial<IResearchCategory>) {
    return this.db
      .collection('researchCategories')
      .doc(researchCategory._id)
      .delete()
  }

  get researchCategoriesLabels() {
    return this.allResearchCategories.map(
      (researchCategory) => researchCategory.label,
    )
  }
}
