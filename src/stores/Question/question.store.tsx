import { action, makeObservable, observable, runInAction } from 'mobx'
import { createContext, useContext } from 'react'
import { logger } from 'src/logger'
import type { IQuestion, IQuestionDB } from '../../models/question.models'
import { changeUserReferenceToPlainText } from '../common/mentions'
import { ModuleStore } from '../common/module.store'
import type { RootStore } from '../index'

const COLLECTION_NAME = 'questions'

export class QuestionStore extends ModuleStore {
  @observable
  public allQuestionItems: IQuestion.Item[] = []

  @observable
  public activeQuestionItem: IQuestion.Item | undefined

  constructor(rootStore: RootStore) {
    super(rootStore, COLLECTION_NAME)
    makeObservable(this)
    super.init()

    this.allDocs$.subscribe((docs: IQuestion.Item[]) => {
      logger.debug('docs', docs)
      const activeItems = [...docs].filter((doc) => {
        return !doc._deleted
      })

      runInAction(() => {
        this.allQuestionItems = activeItems
      })
    })
  }

  @action
  public async setActiveQuestionItemBySlug(slug?: string) {
    logger.debug(`setActiveQuestionItemBySlug:`, { slug })
    let activeQuestionItem: IQuestionDB | undefined = undefined

    if (slug) {
      activeQuestionItem = await this._getQuestionItemBySlug(slug)

      if (activeQuestionItem) {
        activeQuestionItem.description = changeUserReferenceToPlainText(
          activeQuestionItem.description,
        )
      }
    }

    runInAction(() => {
      this.activeQuestionItem = activeQuestionItem
    })
    return activeQuestionItem
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async upsertQuestion(values: IQuestion.FormInput) {
    // eslint-disable-next-line no-console
    console.log(`upsertQuestion:`, { values })
    const dbRef = this.db
      .collection<IQuestion.Item>(COLLECTION_NAME)
      .doc(values?._id)

    await dbRef.set(values as any)
    // eslint-disable-next-line no-console
    console.log(`upsertQuestion.set`, { dbRef })
  }

  private async _getQuestionItemBySlug(
    slug: string,
  ): Promise<IQuestionDB | undefined> {
    const collection = await this.db
      .collection<IQuestion.Item>(COLLECTION_NAME)
      .getWhere('slug', '==', slug)

    if (collection && collection.length) {
      return collection[0]
    }

    const previousSlugCollection = await this.db
      .collection<IQuestion.Item>(COLLECTION_NAME)
      .getWhere('previousSlugs', 'array-contains', slug)

    if (previousSlugCollection && previousSlugCollection.length) {
      return previousSlugCollection[0]
    }

    return undefined
  }
}

/**
 * Export an empty context object to be shared with components
 * The context will be populated with the QuestionStore in the module index
 * (avoids cyclic deps and ensure shared module ready)
 */
export const QuestionStoreContext = createContext<QuestionStore>(null as any)
export const useQuestionStore = () => useContext(QuestionStoreContext)
