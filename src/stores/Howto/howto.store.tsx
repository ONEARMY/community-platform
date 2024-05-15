import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
  toJS,
} from 'mobx'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { logger } from 'src/logger'
import { getUserCountry } from 'src/utils/getUserCountry'
import { hasAdminRights, needsModeration, randomID } from 'src/utils/helpers'
import { getKeywords } from 'src/utils/searchHelper'

import { incrementDocViewCount } from '../common/incrementDocViewCount'
import {
  changeMentionToUserReference,
  changeUserReferenceToPlainText,
} from '../common/mentions'
import { ModuleStore } from '../common/module.store'
import { toggleDocUsefulByUser } from '../common/toggleDocUsefulByUser'

import type { IComment, IUser, UserMention } from 'src/models'
import type {
  IHowto,
  IHowtoDB,
  IHowtoFormInput,
  IHowToStepFormInput,
} from 'src/models/howto.models'
import type { IConvertedFileMeta } from 'src/types'
import type { IRootStore } from '../RootStore'
import type { IUploadedFileMeta } from '../storage'

const COLLECTION_NAME = 'howtos'

export class HowtoStore extends ModuleStore {
  // we have two property relating to docs that can be observed
  @observable
  public activeHowto: IHowtoDB | null

  @observable
  public uploadStatus: IHowToUploadStatus = getInitialUploadStatus()

  constructor(rootStore: IRootStore) {
    // call constructor on common ModuleStore (with db endpoint), which automatically fetches all docs at
    // the given endpoint and emits changes as data is retrieved from cache and live collection
    super(rootStore, COLLECTION_NAME)
    makeObservable(this)
  }

  public getActiveHowToComments(): IComment[] {
    return this.activeHowto?.comments
      ? this.activeHowto?.comments.map((comment: IComment) => {
          return {
            ...comment,
            text: changeUserReferenceToPlainText(comment.text),
            isUserVerified: !!this.aggregationsStore.isVerified(
              comment.creatorName,
            ),
          }
        })
      : []
  }

  @action
  public removeActiveHowto() {
    this.activeHowto = null
  }

  @action
  public async setActiveHowtoBySlug(slug?: string) {
    // clear any cached data and then load the new howto
    logger.debug(`HowtoStore.setActiveHowtoBySlug:`, { slug })
    let activeHowto: IHowtoDB | null = null

    if (slug) {
      const collection = await this.db
        .collection<IHowto>(COLLECTION_NAME)
        .getWhere('slug', '==', slug)
      activeHowto = collection.length > 0 ? collection[0] : null

      // try previous slugs if slug is not recognized as primary
      if (!activeHowto) {
        const collection = await this.db
          .collection<IHowto>(COLLECTION_NAME)
          .getWhere('previousSlugs', 'array-contains', slug)

        activeHowto = collection.length > 0 ? collection[0] : null
      }

      // Change all UserReferences to mentions
      if (activeHowto) {
        if (activeHowto.description) {
          activeHowto.description = changeUserReferenceToPlainText(
            activeHowto.description,
          )
        }

        activeHowto.steps.forEach((step) => {
          if (!step.text) return
          step.text = changeUserReferenceToPlainText(step.text)
        })
      }
    }

    this.activeHowto = activeHowto
    return activeHowto
  }

  @action
  public async toggleUsefulByUser(
    docId: string,
    userName: string,
  ): Promise<void> {
    const updatedItem = (await toggleDocUsefulByUser(
      COLLECTION_NAME,
      docId,
      userName,
    )) as IHowtoDB

    runInAction(() => {
      this.activeHowto = updatedItem
      if ((updatedItem.votedUsefulBy || []).includes(userName)) {
        this.userNotificationsStore.triggerNotification(
          'howto_useful',
          this.activeHowto._createdBy,
          '/how-to/' + this.activeHowto.slug,
          this.activeHowto.title,
        )
      }
    })
  }

  @action
  public updateUploadStatus(update: keyof IHowToUploadStatus) {
    this.uploadStatus[update] = true
  }

  @action
  public resetUploadStatus() {
    this.uploadStatus = getInitialUploadStatus()
  }

  public async incrementDownloadCount(howToID: string) {
    const dbRef = this.db.collection<IHowto>(COLLECTION_NAME).doc(howToID)
    const howToData = await toJS(dbRef.get('server'))
    const totalDownloads = howToData?.total_downloads || 0

    if (howToData) {
      const updatedHowto: IHowto = {
        ...howToData,
        total_downloads: totalDownloads! + 1,
      }

      await dbRef.set(
        {
          ...updatedHowto,
        },
        { keep_modified_timestamp: true },
      )

      return updatedHowto.total_downloads
    }
  }

  public async incrementViewCount(howTo: Partial<IHowtoDB>) {
    return await incrementDocViewCount({
      collection: COLLECTION_NAME,
      db: this.db,
      doc: howTo,
    })
  }

  public needsModeration(howto: IHowto) {
    return needsModeration(howto, toJS(this.activeUser))
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

  @action
  public async addComment(text: string) {
    try {
      const user = this.activeUser
      const howto = this.activeHowto
      if (user && howto && text) {
        const newComment: IComment = {
          _id: randomID(),
          _created: new Date().toISOString(),
          _creatorId: user._id,
          creatorName: user.userName,
          creatorCountry: getUserCountry(user),
          text: text.slice(0, MAX_COMMENT_LENGTH).trim(),
        }
        logger.debug('addComment.newComment', { newComment })

        // Update and refresh the active howto
        const updatedComments = [...toJS(howto.comments || []), newComment]
        const updated = await this.updateHowtoItem({
          ...toJS(howto),
          comments: updatedComments,
          totalComments: updatedComments.length,
        })

        await this.addCommentNotification(howto)
        await this.setActiveHowtoBySlug(updated?.slug || '')
      }
    } catch (err) {
      logger.info({ err })
      logger.error(err)
      throw new Error(err)
    }
  }

  private async updateHowtoItem(
    howToItem: IHowto,
    setLastEditTimestamp = false,
  ) {
    const dbRef = this.db.collection<IHowto>(COLLECTION_NAME).doc(howToItem._id)

    logger.debug('updateHowtoItem', {
      before: this.activeHowto,
      after: howToItem,
    })

    const { text: description, users } = await this.addUserReference(
      howToItem.description || '',
    )

    const mentions = users.map((username) => ({
      username,
      location: 'description',
    }))

    const { comments, commentMentions } = await this.findMentionsInComments(
      howToItem.comments,
    )
    const { steps, stepMentions } = await this.findMentionsInSteps(
      howToItem.steps,
    )

    mentions.push(...commentMentions, ...stepMentions)
    const previousSlugs = this.setPreviousSlugs(howToItem, howToItem.slug)

    await dbRef.set(
      {
        ...howToItem,
        previousSlugs,
        description,
        comments,
        totalComments: comments?.length || 0,
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
    // - Comments
    const previousMentionsList = howToItem.mentions || []
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
          `/how-to/${howToItem.slug}#${mention.location}`,
          howToItem.title,
        )
      }
    })

    const $doc = await dbRef.get()
    return $doc ? $doc : null
  }

  @action
  public async editComment(id: string, newText: string) {
    try {
      const howto = this.activeHowto
      const user = this.activeUser
      if (id && howto && user && howto.comments) {
        const comments = toJS(howto.comments)
        const commentIndex = comments.findIndex(
          (comment) =>
            (comment._creatorId === user._id || hasAdminRights(user)) &&
            comment._id === id,
        )
        if (commentIndex !== -1) {
          comments[commentIndex].text = newText
            .slice(0, MAX_COMMENT_LENGTH)
            .trim()
          comments[commentIndex]._edited = new Date().toISOString()

          // Refresh the active howto
          this.activeHowto = await this.updateHowtoItem({
            ...toJS(howto),
            comments,
          })
        }
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  @action
  public async deleteHowTo(id: string) {
    try {
      const user = this.activeUser

      if (!user) {
        return
      }

      const dbRef = this.db.collection<IHowto>(COLLECTION_NAME).doc(id)
      const howToData = await dbRef.get('server')

      if (id && howToData) {
        await this.updateHowtoItem({
          ...howToData,
          _deleted: true,
        })
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  @action
  public async deleteComment(id: string) {
    try {
      const howto = this.activeHowto
      const user = this.activeUser
      if (id && howto && user && howto.comments) {
        // Refresh the active howto with the updated item

        const updatedComments = toJS(howto.comments).filter(
          (comment) =>
            !(
              (comment._creatorId === user._id || hasAdminRights(user)) &&
              comment._id === id
            ),
        )
        await this.updateHowtoItem({
          ...toJS(howto),
          comments: updatedComments,
          totalComments: updatedComments.length,
        })

        await this.setActiveHowtoBySlug(howto.slug)
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  // upload a new or update an existing how-to
  public async uploadHowTo(values: IHowtoFormInput | IHowtoDB) {
    logger.debug('uploading howto', { values })
    this.updateUploadStatus('Start')
    // create a reference either to the existing document (if editing) or a new document if creating
    const dbRef = this.db
      .collection<IHowto>(COLLECTION_NAME)
      .doc((values as IHowtoDB)._id)
    const id = dbRef.id

    // keep comments if doc existed previously
    const existingDoc = await dbRef.get()
    logger.debug('uploadHowto.existingDoc', { existingDoc })

    const comments =
      existingDoc && existingDoc.comments ? existingDoc.comments : []

    const user = this.activeUser as IUser
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
      } = values
      const _id = id
      const _createdBy = values._createdBy ? values._createdBy : user.userName
      const creatorCountry = this.getCreatorCountry(user, values)
      const fileLink = values.fileLink ?? ''
      const mentions = (values as IHowtoDB)?.mentions ?? []
      const slug = await this.setSlug(values)
      const previousSlugs = this.setPreviousSlugs(values, slug)
      const total_downloads = values['total_downloads'] ?? 0

      const keywords = getKeywords(values.title + ' ' + values.description)
      keywords.push(_createdBy)

      const howTo: IHowto = {
        ...(existingDoc || {}),
        _id,
        _createdBy,
        comments,
        totalComments: comments.length,
        creatorCountry,
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
        ...(files ? { total_downloads } : {}),
        ...(category ? { category } : {}),
        ...(cover_image ? { cover_image } : {}),
        ...(difficulty_level ? { difficulty_level } : {}),
        ...(tags ? { tags } : {}),
        ...(time ? { time } : {}),
      }

      logger.debug('populating database', howTo)
      // set the database document
      this.activeHowto = await this.updateHowtoItem(howTo, true)
      this.updateUploadStatus('Database')
      logger.debug('post added')
      // complete
      this.updateUploadStatus('Complete')
    } catch (error) {
      logger.error('error', error)
      throw new Error(error.message)
    }
  }

  private async addCommentNotification(howto: IHowto) {
    await this.userNotificationsStore.triggerNotification(
      'new_comment_discussion',
      howto._createdBy,
      '/how-to/' + howto.slug,
      howto.title,
    )
  }

  private async findMentionsInComments(rawComments: IComment[] | undefined) {
    const commentMentions: UserMention[] = []

    if (rawComments === undefined) {
      return {
        comments: [],
        commentMentions,
      }
    }

    const comments = await Promise.all(
      [...toJS(rawComments || [])].map(async (comment) => {
        const { text, users } = await this.addUserReference(comment.text)
        comment.text = text

        users.forEach((username) => {
          commentMentions.push({
            username,
            location: `comment:${comment._id}`,
          })
        })

        return comment
      }),
    )

    return {
      comments,
      commentMentions,
    }
  }

  private async findMentionsInSteps(steps: IHowToStepFormInput[]) {
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

  private getCreatorCountry(user: IUser, values: IHowtoFormInput) {
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

  private async uploadStepImages(steps: IHowToStepFormInput[], id: string) {
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

  @computed
  get userVotedActiveHowToUseful(): boolean {
    if (!this.activeUser) return false
    return (this.activeHowto?.votedUsefulBy || []).includes(
      this.activeUser.userName,
    )
  }

  @computed
  get votedUsefulCount(): number {
    return (this.activeHowto?.votedUsefulBy || []).length
  }

  @computed
  get commentsCount(): number {
    return (this.activeHowto?.comments || []).length
  }
}

interface IHowToUploadStatus {
  Start: boolean
  Cover: boolean
  Files: boolean
  'Step Images': boolean
  Database: boolean
  Complete: boolean
}

const getInitialUploadStatus = (): IHowToUploadStatus => ({
  Start: false,
  Cover: false,
  'Step Images': false,
  Files: false,
  Database: false,
  Complete: false,
})
