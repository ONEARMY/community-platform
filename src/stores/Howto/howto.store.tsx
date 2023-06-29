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
import type { IComment, IVotedUsefulUpdate, IUser } from 'src/models'
import type {
  IHowToStepFormInput,
  IHowto,
  IHowtoDB,
  IHowtoFormInput,
  IHowtoStep,
} from 'src/models/howto.models'
import type { IConvertedFileMeta } from 'src/types'
import { getUserCountry } from 'src/utils/getUserCountry'
import {
  filterModerableItems,
  formatLowerNoSpecial,
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
import { FilterSorterDecorator } from '../common/FilterSorterDecorator/FilterSorterDecorator'

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
  public sortValue: string

  @observable
  public referrerSource: string
  @observable
  public uploadStatus: IHowToUploadStatus = getInitialUploadStatus()

  @observable
  private filterSorterDecorator: FilterSorterDecorator<IHowtoDB>

  constructor(rootStore: RootStore) {
    // call constructor on common ModuleStore (with db endpoint), which automatically fetches all docs at
    // the given endpoint and emits changes as data is retrieved from cache and live collection
    super(rootStore, COLLECTION_NAME)
    makeObservable(this)
    this.allDocs$.subscribe((docs: IHowtoDB[]) => {
      this.filterSorterDecorator = new FilterSorterDecorator<any>(docs)
      this.updateActiveSorter('created')
    })
    this.selectedCategory = ''
    this.searchValue = ''
    this.referrerSource = ''
  }

  public updateActiveSorter(query: string) {
    this.allHowtos = this.filterSorterDecorator.sort(query)
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
        activeHowto.description = changeUserReferenceToPlainText(
          activeHowto.description,
        )

        activeHowto.steps.forEach((step) => {
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

    return
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

    return validHowtos
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
  public async moderateHowto(howto: IHowto) {
    if (!hasAdminRights(toJS(this.activeUser))) {
      return false
    }
    return this.updateHowtoItem(toJS(howto))
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
      howToItem.description,
    )

    const mentions = users.map((username) => ({
      username,
      location: 'description',
    }))

    const comments = await Promise.all(
      [...toJS(howToItem.comments || [])].map(async (comment) => {
        const { text, users } = await this.addUserReference(comment.text)
        comment.text = text

        users.forEach((username) => {
          mentions.push({
            username,
            location: `comment:${comment._id}`,
          })
        })

        return comment
      }),
    )

    const steps = await Promise.all(
      [...toJS(howToItem.steps || [])].map(async (step) => {
        const { text, users } = await this.addUserReference(step.text)

        users.forEach((username) => {
          mentions.push({
            username,
            location: `step`,
          })
        })

        return {
          ...step,
          text,
        }
      }),
    )

    if (howToItem.previousSlugs === undefined) {
      howToItem.previousSlugs = []
    }

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
      let processedCover
      if (
        !Object.prototype.hasOwnProperty.call(values.cover_image, 'downloadUrl')
      ) {
        processedCover = await this.uploadFileToCollection(
          values.cover_image,
          COLLECTION_NAME,
          id,
        )
      } else {
        processedCover = values.cover_image as IUploadedFileMeta
      }

      this.updateUploadStatus('Cover')
      const processedSteps = await this.processSteps(values.steps, id)
      this.updateUploadStatus('Step Images')
      // upload files
      const processedFiles = await this.uploadCollectionBatch(
        values.files as File[],
        COLLECTION_NAME,
        id,
      )
      this.updateUploadStatus('Files')
      // populate DB
      // redefine howTo based on processing done above (should match stronger typing)
      const userCountry = getUserCountry(user)

      // create previousSlugs based on available slug or title
      const previousSlugs: string[] = []
      if (values.slug) {
        previousSlugs.push(values.slug)
      } else if (values.title) {
        const titleToSlug = formatLowerNoSpecial(values.title)
        previousSlugs.push(titleToSlug)
      }

      const howTo: IHowto = {
        mentions: [],
        previousSlugs,
        ...values,
        comments,

        _createdBy: values._createdBy ? values._createdBy : user.userName,
        cover_image: processedCover,
        steps: processedSteps,
        fileLink: values.fileLink ?? '',
        files: processedFiles,
        moderation: values.moderation
          ? values.moderation
          : 'awaiting-moderation',
        // Avoid replacing user flag on admin edit
        creatorCountry:
          (values._createdBy && values._createdBy === user.userName) ||
          !values._createdBy
            ? userCountry
            : values.creatorCountry
            ? values.creatorCountry
            : '',
      }
      if (processedFiles && !howTo['total_downloads'])
        howTo['total_downloads'] = 0

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

  // go through each step, upload images and replace data
  private async processSteps(steps: IHowToStepFormInput[], id: string) {
    // NOTE - outer loop could be a map and done in parallel but for loop easier to manage
    const stepsWithImgMeta: IHowtoStep[] = []
    for (const step of steps) {
      // determine any new images to upload
      const stepImages = (step.images as IConvertedFileMeta[]).filter(
        (img) => !!img,
      )
      const imgMeta = await this.uploadCollectionBatch(
        stepImages,
        COLLECTION_NAME,
        id,
      )
      step.images = imgMeta
      stepsWithImgMeta.push({
        ...step,
        images: (imgMeta || []).map((f) => {
          if (f === undefined) {
            return null
          }

          return f
        }),
      })
    }
    return stepsWithImgMeta
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
