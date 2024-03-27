import { createContext, useContext } from 'react'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'
import { logger } from 'src/logger'
import { getUserCountry } from 'src/utils/getUserCountry'
import {
  filterModerableItems,
  formatLowerNoSpecial,
  isAllowedToEditContent,
  randomID,
} from 'src/utils/helpers'
import { getKeywords } from 'src/utils/searchHelper'

import {
  FilterSorterDecorator,
  ItemSortingOption,
} from '../common/FilterSorterDecorator/FilterSorterDecorator'
import { incrementDocViewCount } from '../common/incrementDocViewCount'
import { ModuleStore } from '../common/module.store'
import { toggleDocSubscriberStatusByUserName } from '../common/toggleDocSubscriberStatusByUserName'
import { toggleDocUsefulByUser } from '../common/toggleDocUsefulByUser'

import type { IUser } from 'src/models'
import type { IConvertedFileMeta } from 'src/types'
import type { IQuestion, IQuestionDB } from '../../models/question.models'
import type { IRootStore } from '../RootStore'
import type { IUploadedFileMeta } from '../storage'

const COLLECTION_NAME = 'questions'

export class QuestionStore extends ModuleStore {
  @observable
  public allQuestionItems: IQuestionDB[] = []

  @observable
  public activeQuestionItem: IQuestionDB | undefined

  @observable
  public selectedCategory: string

  @observable
  public searchValue: string

  @observable
  public activeSorter: ItemSortingOption

  @observable
  public preSearchSorter: ItemSortingOption

  public availableItemSortingOption: ItemSortingOption[]

  @observable
  private filterSorterDecorator: FilterSorterDecorator<IQuestionDB>

  @observable
  isFetching = true

  constructor(rootStore: IRootStore) {
    super(rootStore, COLLECTION_NAME)
    makeObservable(this)
    super.init()

    this.selectedCategory = ''
    this.searchValue = ''
    this.availableItemSortingOption = [
      ItemSortingOption.Newest,
      ItemSortingOption.MostUseful,
      ItemSortingOption.Comments,
    ]

    this.allDocs$.subscribe((docs: IQuestionDB[]) => {
      logger.debug('docs', docs)
      const activeItems = [...docs].filter((doc) => {
        return !doc._deleted
      })

      runInAction(() => {
        this.activeSorter = ItemSortingOption.Newest
        this.filterSorterDecorator = new FilterSorterDecorator()
        this.allQuestionItems = this.filterSorterDecorator.sort(
          this.activeSorter,
          activeItems,
        )

        this.isFetching = false
      })
    })
  }

  public async incrementViewCount(documentId: string) {
    await incrementDocViewCount(this.db, COLLECTION_NAME, documentId)
  }

  public updateActiveSorter(sorter: ItemSortingOption) {
    this.activeSorter = sorter
  }

  public updatePreSearchSorter() {
    this.preSearchSorter = this.activeSorter
  }

  public updateSearchValue(query: string) {
    this.searchValue = query
  }

  @action
  public updateSelectedCategory(category: string) {
    this.selectedCategory = category
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

  @computed get filteredQuestions() {
    let questions = this.filterSorterDecorator.filterByCategory(
      this.allQuestionItems,
      this.selectedCategory,
    )

    questions = this.filterSorterDecorator.search(questions, this.searchValue)

    return this.filterSorterDecorator.sort(this.activeSorter, questions)
  }

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
    const keywords = getKeywords(values.title + ' ' + values.description)

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
    })
    logger.debug(`upsertQuestion.set`, { dbRef })

    return dbRef.get() || null
  }

  public async fetchQuestions() {
    const questions = await this.db
      .collection<IQuestion.Item>(COLLECTION_NAME)
      .getWhere('_deleted', '!=', 'true')

    const validQuestions = filterModerableItems(
      questions,
      this.activeUser as IUser,
    )
    logger.debug(`fetchQuestions:`, { validQuestions })
    return validQuestions
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
