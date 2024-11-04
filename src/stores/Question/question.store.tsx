import { createContext, useContext } from 'react'
import { logger } from 'src/logger'
import { getUserCountry } from 'src/utils/getUserCountry'
import { getKeywords } from 'src/utils/searchHelper'

import { ModuleStore } from '../common/module.store'
import { toggleDocSubscriberStatusByUserName } from '../common/toggleDocSubscriberStatusByUserName'
import { toggleDocUsefulByUser } from '../common/toggleDocUsefulByUser'

import type {
  IConvertedFileMeta,
  IModerationStatus,
  IQuestion,
  IUploadedFileMeta,
} from 'oa-shared'
import type { DBEndpoint } from '../databaseV2/endpoints'
import type { IRootStore } from '../RootStore'

const COLLECTION_NAME = 'questions' as DBEndpoint

export class QuestionStore extends ModuleStore {
  constructor(rootStore: IRootStore) {
    super(rootStore, COLLECTION_NAME)
  }

  public async upsertQuestion(values: IQuestion.FormInput) {
    logger.info(`upsertQuestion:`, { values, activeUser: this.activeUser })

    const user = this.activeUser
    if (!user) return

    const dbRef = this.db
      .collection<IQuestion.Item>(COLLECTION_NAME)
      .doc(values?._id)

    const isTitleAlreadyInUse = await this.isTitleThatReusesSlug(
      values.title,
      values?._id,
    )
    if (isTitleAlreadyInUse) {
      throw new Error('Question title already in use.')
    }

    const slug = await this.setSlug(values)
    const previousSlugs = this.setPreviousSlugs(values, slug)
    const _createdBy = user.userName
    const creatorCountry = getUserCountry(user)

    const moderation =
      values.moderation || ('accepted' as IModerationStatus.ACCEPTED)

    const keywords = getKeywords(values.title + ' ' + values.description)
    keywords.push(_createdBy)

    const images = values.images
      ? await this.loadImages(values.images, dbRef.id)
      : null

    await dbRef.set({
      ...(values as any),
      creatorCountry,
      _createdBy,
      slug,
      previousSlugs,
      keywords,
      images,
      moderation,
    })

    logger.info(`upsertQuestion.set`, { dbRef })

    return dbRef.get('server') || null
  }

  public async toggleSubscriber(id: string, username: string) {
    if (!username) {
      throw Error('Requires a logged in user')
    }

    return await toggleDocSubscriberStatusByUserName(
      this.db,
      COLLECTION_NAME,
      id,
      username,
    )
  }

  public async toggleUsefulByUser(questionId: string, userName: string) {
    return await toggleDocUsefulByUser(COLLECTION_NAME, questionId, userName)
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
}

/**
 * Export an empty context object to be shared with components
 * The context will be populated with the QuestionStore in the module index
 * (avoids cyclic deps and ensure shared module ready)
 */
export const QuestionStoreContext = createContext<QuestionStore>(null as any)
export const useQuestionStore = () => useContext(QuestionStoreContext)
