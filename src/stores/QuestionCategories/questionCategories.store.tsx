import { observable, action, makeObservable, computed } from 'mobx'
import { arrayToJson } from 'src/utils/helpers'
import { ModuleStore } from '../common/module.store'
import type { RootStore } from '..'
import type { IQuestionCategory } from '../../models/questionCategories.model'

export class QuestionCategoriesStore extends ModuleStore {
  @observable
  public allQuestionCategories: IQuestionCategory[] = []
  @observable
  public allQuestionCategoriesByKey: { [key: string]: IQuestionCategory } = {}

  constructor(rootStore: RootStore) {
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
