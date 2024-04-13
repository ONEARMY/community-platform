import { createContext, useContext } from 'react'
import { action, computed } from 'mobx'
import { logger } from 'src/logger'
import { getUserCountry } from 'src/utils/getUserCountry'
import { isAllowedToEditContent } from 'src/utils/helpers'
import { getKeywords } from 'src/utils/searchHelper'

import { incrementDocViewCount } from '../common/incrementDocViewCount'
import { ModuleStore } from '../common/module.store'
import { toggleDocSubscriberStatusByUserName } from '../common/toggleDocSubscriberStatusByUserName'
import { toggleDocUsefulByUser } from '../common/toggleDocUsefulByUser'

import type { IUser } from 'src/models'
import type { IConvertedFileMeta } from 'src/types'
import type { IQuestion, IQuestionDB } from '../../models/question.models'
import type { DBEndpoint } from '../databaseV2/endpoints'
import type { IRootStore } from '../RootStore'
import type { IUploadedFileMeta } from '../storage'

const COLLECTION_NAME = 'questions' as DBEndpoint

export class QuestionStore extends ModuleStore {
  public activeQuestionItem: IQuestionDB | undefined

  constructor(rootStore: IRootStore) {
    super(rootStore, COLLECTION_NAME)
  }

  public async incrementViewCount(question: Partial<IQuestionDB>) {
    await incrementDocViewCount({
      collection: COLLECTION_NAME,
      db: this.db,
      doc: question,
    })
  }

  @action
  public async fetchQuestionBySlug(slug: string) {
    logger.debug(`fetchQuestionBySlug:`, { slug })
    return await this._getQuestionItemBySlug(slug)
  }

  @computed
  get votedUsefulCount(): number {
    if (!this.activeQuestionItem || !this.activeQuestionItem.votedUsefulBy) {
      return 0
    }
    return this.activeQuestionItem?.votedUsefulBy.length
  }

  @computed
  get userVotedActiveQuestionUseful(): boolean {
    if (!this.activeUser) return false
    return (this.activeQuestionItem?.votedUsefulBy || []).includes(
      this.activeUser.userName,
    )
  }

  @computed
  get subscriberCount(): number {
    return (this.activeQuestionItem?.subscribers || []).length
  }

  @computed
  get userCanEditQuestion(): boolean {
    if (!this.activeQuestionItem) return false
    return isAllowedToEditContent(this.activeQuestionItem, this.activeUser)
  }

  @computed
  get userHasSubscribed(): boolean {
    return (
      this.activeQuestionItem?.subscribers?.includes(
        this.activeUser?.userName ?? '',
      ) ?? false
    )
  }

  public async upsertQuestion(values: IQuestion.FormInput) {
    logger.debug(`upsertQuestion:`, { values, activeUser: this.activeUser })
    const dbRef = this.db
      .collection<IQuestion.Item>(COLLECTION_NAME)
      .doc(values?._id)

    const slug = await this.setSlug(values)
    const previousSlugs = this.setPreviousSlugs(values, slug)
    const user = this.activeUser as IUser
    const creatorCountry = this.getCreatorCountry(user, values)
    const keywords = getKeywords(values.title + ' ' + values.description)
    if (values._createdBy) {
      keywords.push(values._createdBy)
    }

    const images = values.images
      ? await this.loadImages(values.images, dbRef.id)
      : null

    await dbRef.set({
      ...(values as any),
      creatorCountry,
      _createdBy: values._createdBy ?? this.activeUser?.userName,
      slug,
      keywords: keywords,
      images: images,
      previousSlugs,
    })
    logger.debug(`upsertQuestion.set`, { dbRef })

    return dbRef.get() || null
  }

  public async toggleSubscriberStatusByUserName() {
    if (!this.activeQuestionItem || !this.activeUser) return

    const updatedQuestion = await toggleDocSubscriberStatusByUserName(
      this.db,
      COLLECTION_NAME,
      this.activeQuestionItem._id,
      this.activeUser.userName,
    )

    if (updatedQuestion) {
      this.activeQuestionItem = updatedQuestion
      return updatedQuestion
    }
  }

  public async toggleUsefulByUser() {
    if (!this.activeQuestionItem || !this.activeUser) return

    const updatedQuestion = await toggleDocUsefulByUser(
      this.db,
      COLLECTION_NAME,
      this.activeQuestionItem._id,
      this.activeUser.userName,
    )

    if (updatedQuestion) {
      this.activeQuestionItem = updatedQuestion
      return updatedQuestion
    }
  }

  private async loadImages(
    images: Array<IUploadedFileMeta | IConvertedFileMeta | File | null>,
    id: string,
  ) {
    if (images?.length > 0) {
      const imgMeta = await this.uploadCollectionBatch(
        images.filter((img) => !!img) as IConvertedFileMeta[],
        COLLECTION_NAME,
        id,
      )
      images = imgMeta
      logger.debug('upload images ok')
      return images
    }
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

  private async _getQuestionItemBySlug(
    slug: string,
  ): Promise<IQuestionDB | null> {
    if (this.activeQuestionItem?.slug === slug) return this.activeQuestionItem

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
export const QuestionStoreContext = createContext<QuestionStore>(null as any)
export const useQuestionStore = () => useContext(QuestionStoreContext)
