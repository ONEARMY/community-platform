import { action, makeObservable, observable, runInAction, toJS } from 'mobx'
import { logger } from 'src/logger'
import { getUserCountry } from 'src/utils/getUserCountry'
import { getKeywords } from 'src/utils/searchHelper'

import { changeMentionToUserReference } from '../common/mentions'
import { ModuleStore } from '../common/module.store'
import { toggleDocUsefulByUser } from '../common/toggleDocUsefulByUser'

import type {
  IConvertedFileMeta,
  ILibrary,
  IUploadedFileMeta,
  IUser,
  UserMention,
} from 'oa-shared'
import type { IRootStore } from '../RootStore'

const COLLECTION_NAME = 'library'

export class LibraryStore extends ModuleStore {
  // we have two property relating to docs that can be observed
  public uploadStatus: IitemUploadStatus = getInitialUploadStatus()

  constructor(rootStore: IRootStore) {
    // call constructor on common ModuleStore (with db endpoint), which automatically fetches all docs at
    // the given endpoint and emits changes as data is retrieved from cache and live collection
    super(rootStore, COLLECTION_NAME)
    makeObservable(this, {
      uploadStatus: observable,
      toggleUsefulByUser: action,
      updateUploadStatus: action,
      resetUploadStatus: action,
      delete: action,
    })
  }

  public async toggleUsefulByUser(
    item: ILibrary.DB,
    userName: string,
  ): Promise<void> {
    const updatedItem = (await toggleDocUsefulByUser(
      COLLECTION_NAME,
      item._id,
      userName,
    )) as ILibrary.DB

    runInAction(() => {
      if ((updatedItem.votedUsefulBy || []).includes(userName)) {
        this.userNotificationsStore.triggerNotification(
          'howto_useful',
          item._createdBy,
          '/library/' + item.slug,
          item.title,
        )
      }
    })
  }

  public updateUploadStatus(update: keyof IitemUploadStatus) {
    this.uploadStatus[update] = true
  }

  public resetUploadStatus() {
    this.uploadStatus = getInitialUploadStatus()
  }

  public async incrementDownloadCount(id: string) {
    const dbRef = this.db.collection<ILibrary.Item>(COLLECTION_NAME).doc(id)
    const item = await toJS(dbRef.get('server'))
    const totalDownloads = item?.total_downloads || 0

    if (item) {
      const updatedItem: ILibrary.Item = {
        ...item,
        total_downloads: totalDownloads! + 1,
      }

      await dbRef.set(
        {
          ...updatedItem,
        },
        { keep_modified_timestamp: true },
      )

      return updatedItem.total_downloads
    }
  }

  private async addUserReference(msg: string): Promise<{
    text: string
    users: string[]
  }> {
    const { text, mentionedUsers: users } = await changeMentionToUserReference(
      msg,
      this.userStore,
    )
    return {
      text,
      users,
    }
  }

  private async updateitem(item: ILibrary.Item, setLastEditTimestamp = false) {
    const dbRef = this.db
      .collection<ILibrary.Item>(COLLECTION_NAME)
      .doc(item._id)

    const { text: description, users } = await this.addUserReference(
      item.description || '',
    )

    const mentions = users.map((username) => ({
      username,
      location: 'description',
    }))

    const { steps, stepMentions } = await this.findMentionsInSteps(item.steps)

    mentions.push(...stepMentions)
    const previousSlugs = this.setPreviousSlugs(item, item.slug)

    await dbRef.set(
      {
        ...item,
        previousSlugs,
        description,
        mentions,
        steps,
      },
      { set_last_edit_timestamp: setLastEditTimestamp },
    )

    // After successfully updating the database document queue up all the notifications
    // Should a notification be issued?
    // - Only if the mention did not exist in the document before.
    // How do we decide whether a mention existed in the document previously?
    // - Based on combination of username/location
    // Location: Where in the document does the mention exist?
    // - Introduction
    // - Steps
    const previousMentionsList = item.mentions || []
    logger.debug(`Mentions:`, {
      before: previousMentionsList,
      after: mentions,
    })

    // Previous mentions
    const previousMentions = previousMentionsList.map(
      (mention) => `${mention.username}.${mention.location}`,
    )

    mentions.forEach((mention) => {
      if (
        !previousMentions.includes(`${mention.username}.${mention.location}`)
      ) {
        this.userNotificationsStore.triggerNotification(
          'howto_mention',
          mention.username,
          `/library/${item.slug}#${mention.location}`,
          item.title,
        )
      }
    })

    const $doc = await dbRef.get('server')
    return $doc ? $doc : null
  }

  public async delete(id: string) {
    try {
      const user = this.activeUser

      if (!user) {
        return
      }

      const dbRef = this.db.collection<ILibrary.Item>(COLLECTION_NAME).doc(id)
      const item = await dbRef.get('server')

      if (id && item) {
        await this.updateitem({
          ...item,
          _deleted: true,
        })
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  // upload a new or update an existing project
  public async upload(
    values: ILibrary.FormInput | ILibrary.DB,
  ): Promise<ILibrary.DB | null> {
    logger.debug('uploading project', { values })
    this.updateUploadStatus('Start')
    // create a reference either to the existing document (if editing) or a new document if creating
    const dbRef = this.db
      .collection<ILibrary.Item>(COLLECTION_NAME)
      .doc((values as ILibrary.DB)._id)
    const id = dbRef.id

    const existingDoc = await dbRef.get('server')
    logger.debug('upload.existingDoc', { existingDoc })

    const user = this.activeUser as IUser

    let item: ILibrary.DB | null = null
    try {
      // upload any pending images, avoid trying to re-upload images previously saved
      // if cover already uploaded stored as object not array
      // file and step image re-uploads handled in uploadFile script
      const cover_image = await this.uploadCoverImage(values.cover_image, id)
      this.updateUploadStatus('Cover')

      const steps = await this.uploadStepImages(values.steps, id)
      this.updateUploadStatus('Step Images')

      const files = await this.uploadCollectionBatch(
        values.files as File[],
        COLLECTION_NAME,
        id,
      )
      this.updateUploadStatus('Files')

      const {
        category,
        description,
        difficulty_level,
        moderation,
        tags,
        time,
        title,
        latestCommentDate,
      } = values
      const _id = id
      const _createdBy = values._createdBy ? values._createdBy : user.userName
      const creatorCountry = this.getCreatorCountry(user, values)
      const fileLink = values.fileLink ?? ''
      const totalComments = values.totalComments ? values.totalComments : 0
      const mentions = (values as ILibrary.DB)?.mentions ?? []
      const slug = await this.setSlug(values)
      const previousSlugs = this.setPreviousSlugs(values, slug)
      const total_downloads = values['total_downloads'] ?? 0
      const cover_image_alt = values.cover_image_alt ?? ''

      const keywords = getKeywords(values.title + ' ' + values.description)
      keywords.push(_createdBy)

      const itemData: ILibrary.Item = {
        ...(existingDoc || {}),
        _id,
        _createdBy,
        creatorCountry,
        totalComments,
        _deleted: false,
        description,
        fileLink,
        files,
        mentions,
        moderation,
        previousSlugs,
        slug,
        steps,
        title,
        keywords,
        cover_image_alt,
        ...(latestCommentDate ? { latestCommentDate } : {}),
        ...(files ? { total_downloads } : {}),
        ...(category ? { category } : {}),
        ...(cover_image ? { cover_image } : {}),
        ...(difficulty_level ? { difficulty_level } : {}),
        ...(tags ? { tags } : {}),
        ...(time ? { time } : {}),
      }

      logger.debug('populating database', itemData)
      // set the database document
      item = await this.updateitem(itemData, true)
      this.updateUploadStatus('Database')
      logger.debug('project added')
      // complete
      this.updateUploadStatus('Complete')
    } catch (error) {
      logger.error('error', error)
      throw new Error(error.message)
    }

    return item
  }

  private async findMentionsInSteps(steps: ILibrary.StepInput[]) {
    const stepMentions: UserMention[] = []

    for (const step of steps) {
      if (step.text) {
        const { text, users } = await this.addUserReference(step.text)

        step.text = text
        users.forEach((username) => {
          stepMentions.push({
            username,
            location: `step`,
          })
        })
      }
    }

    return {
      steps,
      stepMentions,
    }
  }

  private getCreatorCountry(user: IUser, values: ILibrary.FormInput) {
    const { creatorCountry, _createdBy } = values
    const userCountry = getUserCountry(user)

    return (_createdBy && _createdBy === user.userName) || !_createdBy
      ? userCountry
      : creatorCountry
        ? creatorCountry
        : ''
  }

  private async uploadCoverImage(
    cover_image: IConvertedFileMeta | IUploadedFileMeta | undefined,
    id: string,
  ) {
    if (!cover_image) return undefined

    if (!Object.prototype.hasOwnProperty.call(cover_image, 'downloadUrl')) {
      return await this.uploadFileToCollection(cover_image, COLLECTION_NAME, id)
    } else {
      return cover_image as IUploadedFileMeta
    }
  }

  private async uploadStepImages(steps: ILibrary.StepInput[], id: string) {
    for (const step of steps) {
      // determine any new images to upload
      const stepImages = (step.images as IConvertedFileMeta[]).filter(
        (img) => !!img,
      )
      const uploadedImages = await this.uploadCollectionBatch(
        stepImages,
        COLLECTION_NAME,
        id,
      )
      step.images = uploadedImages
    }

    return steps
  }
}

interface IitemUploadStatus {
  Start: boolean
  Cover: boolean
  Files: boolean
  'Step Images': boolean
  Database: boolean
  Complete: boolean
}

const getInitialUploadStatus = (): IitemUploadStatus => ({
  Start: false,
  Cover: false,
  'Step Images': false,
  Files: false,
  Database: false,
  Complete: false,
})
