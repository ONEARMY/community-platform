import { createContext, useContext } from 'react'
import { action, computed, makeObservable, observable } from 'mobx'
import { logger } from 'src/logger'
import { getUserCountry } from 'src/utils/getUserCountry'
import {
  filterModerableItems,
  formatLowerNoSpecial,
  randomID,
} from 'src/utils/helpers'

import { ModuleStore } from '../common/module.store'
import { toggleDocSubscriberStatusByUserName } from '../common/toggleDocSubscriberStatusByUserName'
import { toggleDocUsefulByUser } from '../common/toggleDocUsefulByUser'

import type { IUser } from 'src/models'
import type { IQuestion, IQuestionDB } from '../../models/question.models'
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
  }

  @action
  public async fetchQuestionBySlug(slug: string) {
    logger.debug(`fetchQuestionBySlug:`, { slug })
    return await this._getQuestionItemBySlug(slug)
  }

  @computed
  get votedUsefulCount(): number {
    return (this.activeQuestionItem?.votedUsefulBy || []).length
  }

  @computed
  get userVotedActiveQuestionUseful(): boolean {
    if (!this.activeUser) return false
    return (this.activeQuestionItem?.votedUsefulBy || []).includes(
      this.activeUser.userName,
    )
  }

  public async toggleUsefulByUser(
    docId: string,
    userName: string,
  ): Promise<void> {
    const updatedItem = (await toggleDocUsefulByUser(
      this.db,
      COLLECTION_NAME,
      docId,
      userName,
    )) as IQuestionDB

    this.activeQuestionItem = updatedItem

    return
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async upsertQuestion(values: IQuestion.FormInput) {
    logger.debug(`upsertQuestion:`, { values, activeUser: this.activeUser })
    const dbRef = this.db
      .collection<IQuestion.Item>(COLLECTION_NAME)
      .doc(values?._id)

    // Check for existing document
    let slug = formatLowerNoSpecial(values.title)
    const searchQuery = await this.db
      .collection<IQuestion.Item>(COLLECTION_NAME)
      .getWhere('slug', '==', slug)

    if (searchQuery && searchQuery.length) {
      slug += `-${randomID()}`
    }

    const user = this.activeUser as IUser
    const creatorCountry = this.getCreatorCountry(user, values)

    await dbRef.set({
      ...(values as any),
      creatorCountry,
      _createdBy: values._createdBy ?? this.activeUser?.userName,
      slug,
    })
    logger.debug(`upsertQuestion.set`, { dbRef })

    return dbRef.get() || null
  }

  public async fetchQuestions() {
    const questions = await this.db
      .collection<IQuestion.Item>(COLLECTION_NAME)
      .getWhere('_deleted', '!=', 'true')

    const validQuestions = filterModerableItems(questions, this.activeUser)
    logger.debug(`fetchQuestions:`, { validQuestions })
    return validQuestions
  }

  private getCreatorCountry(user: IUser, values: IQuestion.FormInput) {
    const { creatorCountry, _createdBy } = values
    const userCountry = getUserCountry(user)

    return (_createdBy && _createdBy === user.userName) || !_createdBy
      ? userCountry
      : creatorCountry
      ? creatorCountry
      : ''
  }

  public async toggleSubscriberStatusByUserName(docId, userName) {
    return toggleDocSubscriberStatusByUserName(
      this.db,
      COLLECTION_NAME,
      docId,
      userName,
    )
  }

  private async _getQuestionItemBySlug(
    slug: string,
  ): Promise<IQuestionDB | null> {
    const collection = await this.db
      .collection<IQuestion.Item>(COLLECTION_NAME)
      .getWhere('slug', '==', slug)

    logger.debug(`_getQuestionItemBySlug.collection`, { collection })

    if (collection && collection.length) {
      return collection[0]
    }

    return null
  }
}

/**
 * Export an empty context object to be shared with components
 * The context will be populated with the QuestionStore in the module index
 * (avoids cyclic deps and ensure shared module ready)
 */
export const QuestionStoreContext = createContext<QuestionStore>('boo' as any)
export const useQuestionStore = () => useContext(QuestionStoreContext)
