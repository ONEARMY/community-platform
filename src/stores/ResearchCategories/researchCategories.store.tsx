import { observable, action, makeObservable, computed } from 'mobx'
import type { IResearchCategory } from 'src/models/researchCategories.model'
import { arrayToJson } from 'src/utils/helpers'
import { ModuleStore } from '../common/module.store'
import type { RootStore } from '..'

export class ResearchCategoriesStore extends ModuleStore {
  @observable
  public allResearchCategories: IResearchCategory[] = []
  @observable
  public allResearchCategoriesByKey: { [key: string]: IResearchCategory } = {}

  constructor(rootStore: RootStore) {
    super(rootStore, 'researchCategories')
    // call init immediately for tags so they are available to all pages
    super.init()
    makeObservable(this)
    this.allDocs$.subscribe((docs) => this.setAllResearchCategories(docs))
  }

  @action
  public setAllResearchCategories(docs: IResearchCategory[]) {
    this.allResearchCategories = docs.sort((a, b) =>
      a.label > b.label ? 1 : -1,
    )
    this.allResearchCategoriesByKey = arrayToJson(docs, '_id')
  }

  @action
  public saveResearchCategory(researchCategory: Partial<IResearchCategory>) {
    return this.db
      .collection('researchCategories')
      .doc(researchCategory._id)
      .set(researchCategory)
  }

  @action
  public deleteResearchCategory(researchCategory: Partial<IResearchCategory>) {
    return this.db
      .collection('researchCategories')
      .doc(researchCategory._id)
      .delete()
  }

  @computed get researchCategoriesLabels() {
    return this.allResearchCategories.map(
      (researchCategory) => researchCategory.label,
    )
  }
}
