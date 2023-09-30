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
import type {
  IComment,
  UserMention,
  IModerationUpdate,
  IVotedUsefulUpdate,
  IUser,
  IModerationFeedback,
} from 'src/models'
import type {
  IHowToStepFormInput,
  IHowto,
  IHowtoDB,
  IHowtoFormInput,
} from 'src/models/howto.models'
import type { IConvertedFileMeta } from 'src/types'
import { getUserCountry } from 'src/utils/getUserCountry'
import {
  filterModerableItems,
  hasAdminRights,
  needsModeration,
  randomID,
} from 'src/utils/helpers'
import {
  changeMentionToUserReference,
  changeUserReferenceToPlainText,
} from '../common/mentions'
import { ModuleStore } from '../common/module.store'
import type { RootStore } from '../index'
import type { IUploadedFileMeta } from '../storage'
import {
  FilterSorterDecorator,
  ItemSortingOption,
} from '../common/FilterSorterDecorator/FilterSorterDecorator'

const COLLECTION_NAME = 'howtos'

export class HowtoStore extends ModuleStore {
  // we have two property relating to docs that can be observed
  @observable
  public activeHowto: IHowtoDB | null

  @observable
  public allHowtos: IHowtoDB[]

  @observable
  public selectedCategory: string

  @observable
  public searchValue: string

  @observable
  public activeSorter: ItemSortingOption

  @observable
  public referrerSource: string

  @observable
  public uploadStatus: IHowToUploadStatus = getInitialUploadStatus()

  public availableItemSortingOption: ItemSortingOption[]

  @observable
  private filterSorterDecorator: FilterSorterDecorator<IHowtoDB>

  constructor(rootStore: RootStore) {
    // call constructor on common ModuleStore (with db endpoint), which automatically fetches all docs at
    // the given endpoint and emits changes as data is retrieved from cache and live collection
    super(rootStore, COLLECTION_NAME)
    makeObservable(this)
    super.init()

    this.allDocs$.subscribe((docs: IHowtoDB[]) => {
      logger.debug('docs', docs)
      const activeItems = [...docs].filter((doc) => {
        return !doc._deleted
      })

      runInAction(() => {
        this.activeSorter = ItemSortingOption.Random
        this.filterSorterDecorator = new FilterSorterDecorator()
        this.allHowtos = this.filterSorterDecorator.sort(
          this.activeSorter,
          activeItems,
        )
      })
    })
    this.selectedCategory = ''
    this.searchValue = ''
    this.referrerSource = ''
    this.availableItemSortingOption = [
      ItemSortingOption.Newest,
      ItemSortingOption.MostUseful,
      ItemSortingOption.LatestUpdated,
      ItemSortingOption.TotalDownloads,
      ItemSortingOption.Comments,
      ItemSortingOption.Random,
    ]
  }

  public updateActiveSorter(sorter: ItemSortingOption) {
    this.activeSorter = sorter
  }

  public getActiveHowToComments(): IComment[] {
    return this.activeHowto?.comments
      ? this.activeHowto?.comments.map((comment: IComment) => {
          return {
            ...comment,
            text: changeUserReferenceToPlainText(comment.text),
            isUserVerified:
              !!this.aggregationsStore.aggregations.users_verified?.[
                comment.creatorName
              ],
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
    logger.debug(`setActiveHowtoBySlug:`, { slug })
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
    const dbRef = this.db
      .collection<IVotedUsefulUpdate>(COLLECTION_NAME)
      .doc(docId)

    const howtoData = await toJS(dbRef.get('server'))
    if (!howtoData) return

    const votedUsefulBy = !(howtoData?.votedUsefulBy || []).includes(userName)
      ? [userName].concat(howtoData?.votedUsefulBy || [])
      : (howtoData?.votedUsefulBy || []).filter((uName) => uName !== userName)

    const votedUsefulUpdate = {
      _id: docId,
      votedUsefulBy: votedUsefulBy,
    }

    await dbRef.update(votedUsefulUpdate)

    const updatedItem = (await dbRef.get()) as IHowtoDB
    runInAction(() => {
      this.activeHowto = updatedItem
      if ((updatedItem.votedUsefulBy || []).includes(userName)) {
        this.userNotificationsStore.triggerNotification(
          'howto_useful',
          this.activeHowto._createdBy,
          '/how-to/' + this.activeHowto.slug,
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

  @computed get filteredHowtos() {
    const howtos = this.filterSorterDecorator.filterByCategory(
      this.allHowtos,
      this.selectedCategory,
    )
    // HACK - ARH - 2019/12/11 filter unaccepted howtos, should be done serverside
    let validHowtos = filterModerableItems(howtos, this.activeUser)

    validHowtos = this.filterSorterDecorator.search(
      validHowtos,
      this.searchValue,
    )

    return this.filterSorterDecorator.sort(
      this.activeSorter,
      validHowtos,
      this.activeUser,
    )
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

  public async incrementViewCount(howToID: string) {
    const dbRef = this.db.collection<IHowto>(COLLECTION_NAME).doc(howToID)
    const howToData = await toJS(dbRef.get('server'))
    const totalViews = howToData?.total_views || 0

    if (howToData) {
      const updatedHowto: IHowto = {
        ...howToData,
        total_views: totalViews! + 1,
      }

      await dbRef.set(
        {
          ...updatedHowto,
        },
        { keep_modified_timestamp: true },
      )

      return updatedHowto.total_views
    }
  }

  public updateSearchValue(query: string) {
    this.searchValue = query
  }

  public updateReferrerSource(source: string) {
    this.referrerSource = source
  }

  @action
  public updateSelectedCategory(category: string) {
    this.selectedCategory = category
  }

  // Moderate Howto
  @action
  public async moderateHowto(
    docId: string,
    accepted: boolean,
    feedback?: string,
  ): Promise<void> {
    if (!hasAdminRights(toJS(this.activeUser))) {
      return
    }
    const dbRef = this.db
      .collection<IModerationUpdate>(COLLECTION_NAME)
      .doc(docId)

    const howtoData = await toJS(dbRef.get('server'))
    if (!howtoData) return

    const moderationUpdate: IModerationUpdate = {
      _id: docId,
      moderation: accepted ? 'accepted' : 'rejected',
    }

    if (feedback) {
      const newFeedback: IModerationFeedback[] = [
        {
          feedbackTimestamp: new Date().toISOString(),
          feedbackComments: feedback,
          adminUsername: this.activeUser?.userName || '',
        },
      ]

      moderationUpdate.moderationFeedback = [
        ...(howtoData.moderationFeedback || []),
        ...newFeedback,
      ]
    }

    await dbRef.update(moderationUpdate)

    this.activeHowto = (await dbRef.get()) as IHowtoDB

    return
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
        const updated = await this.updateHowtoItem({
          ...toJS(howto),
          comments: [...toJS(howto.comments || []), newComment],
        })

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

    if (!howToItem.previousSlugs.includes(howToItem.slug)) {
      howToItem.previousSlugs.push(howToItem.slug)
    }

    await dbRef.set(
      {
        ...howToItem,
        description,
        comments,
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

        if (this.allHowtos && this.activeHowto !== null) {
          this.allHowtos = this.allHowtos.filter((howto) => {
            return howToData._id !== howto._id
          })
        }
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
        await this.updateHowtoItem({
          ...toJS(howto),
          comments: toJS(howto.comments).filter(
            (comment) =>
              !(
                (comment._creatorId === user._id || hasAdminRights(user)) &&
                comment._id === id
              ),
          ),
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

      // populate DB

      let { slug } = values

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

      const previousSlug =
        existingDoc && existingDoc.slug ? existingDoc.slug : undefined
      // check for duplicate only if updated title/slug
      if (previousSlug != slug) {
        const titleReusesSlug = await this.isTitleThatReusesSlug(title, _id)
        slug = titleReusesSlug ? slug + '-' + this.generateUniqueID(5) : slug
      }
      const previousSlugs = (values as IHowtoDB).previousSlugs ?? []
      if (!previousSlugs.includes(slug)) {
        previousSlugs.push(slug)
      }
      const total_downloads = values['total_downloads'] ?? 0

      const howTo: IHowto = {
        _id,
        _createdBy,
        comments,
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

  // generate a numeric unique ID
  private generateUniqueID(length: number) {
    const chars = '0123456789'
    let autoId = ''
    for (let i = 0; i < length; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return autoId
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
