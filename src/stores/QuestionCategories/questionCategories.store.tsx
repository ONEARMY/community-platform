import { action, computed, makeObservable, observable } from 'mobx'
import { arrayToJson } from 'src/utils/helpers'

import { ModuleStore } from '../common/module.store'

import type { IQuestionCategory } from '../../models/questionCategories.model'
import type { IRootStore } from '../RootStore'

export class QuestionCategoriesStore extends ModuleStore {
  @observable
  public allQuestionCategories: IQuestionCategory[] = []
  @observable
  public allQuestionCategoriesByKey: { [key: string]: IQuestionCategory } = {}

  constructor(rootStore: IRootStore) {
    super(rootStore, 'questionCategories')
    // call init immediately for tags so they are available to all pages
    super.init()
    makeObservable(this)
    this.allDocs$.subscribe((docs) => this.setAllQuestionCategories(docs))
  }

  @action
  public setAllQuestionCategories(docs: IQuestionCategory[]) {
    this.allQuestionCategories = docs.sort((a, b) =>
      a.label > b.label ? 1 : -1,
    )
    this.allQuestionCategoriesByKey = arrayToJson(docs, '_id')
  }

  @action
  public saveQuestionCategory(questionCategory: Partial<IQuestionCategory>) {
    return this.db
      .collection('questionCategories')
      .doc(questionCategory._id)
      .set(questionCategory)
  }

  @action
  public deleteQuestionCategory(questionCategory: Partial<IQuestionCategory>) {
    return this.db
      .collection('questionCategories')
      .doc(questionCategory._id)
      .delete()
  }

  @computed get questionCategoriesLabels() {
    return this.allQuestionCategories.map(
      (questionCategory) => questionCategory.label,
    )
  }
}
