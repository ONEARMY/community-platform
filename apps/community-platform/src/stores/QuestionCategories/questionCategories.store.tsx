import { action, computed, makeObservable, observable } from 'mobx'

import { arrayToJson } from '../../utils/helpers'
import { ModuleStore } from '../common/module.store'

import type { IQuestionCategory } from '../../models/questionCategories.model'
import type { IRootStore } from '../RootStore'

export class QuestionCategoriesStore extends ModuleStore {
  public allQuestionCategories: IQuestionCategory[] = []
  public allQuestionCategoriesByKey: { [key: string]: IQuestionCategory } = {}

  constructor(rootStore: IRootStore) {
    super(rootStore, 'questionCategories')
    // call init immediately for tags so they are available to all pages
    super.init()
    makeObservable(this, {
      allQuestionCategories: observable,
      allQuestionCategoriesByKey: observable,
      setAllQuestionCategories: action,
      saveQuestionCategory: action,
      deleteQuestionCategory: action,
      questionCategoriesLabels: computed,
    })
    this.allDocs$.subscribe((docs) => this.setAllQuestionCategories(docs))
  }

  public setAllQuestionCategories(docs: IQuestionCategory[]) {
    this.allQuestionCategories = docs.sort((a, b) =>
      a.label > b.label ? 1 : -1,
    )
    this.allQuestionCategoriesByKey = arrayToJson(docs, '_id')
  }

  public saveQuestionCategory(questionCategory: Partial<IQuestionCategory>) {
    return this.db
      .collection('questionCategories')
      .doc(questionCategory._id)
      .set(questionCategory)
  }

  public deleteQuestionCategory(questionCategory: Partial<IQuestionCategory>) {
    return this.db
      .collection('questionCategories')
      .doc(questionCategory._id)
      .delete()
  }

  get questionCategoriesLabels() {
    return this.allQuestionCategories.map(
      (questionCategory) => questionCategory.label,
    )
  }
}
