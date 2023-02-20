import Fuse from 'fuse.js'
import { action, computed, makeObservable, observable, toJS } from 'mobx'
import type { IConvertedFileMeta } from 'src/types'
import { getUserCountry } from 'src/utils/getUserCountry'
import type {
  IHowto,
  IHowtoDB,
  IHowtoFormInput,
  IHowtoStep,
  IHowToStepFormInput,
} from 'src/models/howto.models'
import type { IComment, IUser } from 'src/models'
import {
  filterModerableItems,
  formatLowerNoSpecial,
  hasAdminRights,
  needsModeration,
  randomID,
} from 'src/utils/helpers'
import type { RootStore } from '../index'
import { ModuleStore } from '../common/module.store'
import type { IUploadedFileMeta } from '../storage'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { logger } from 'src/logger'
import {
  changeMentionToUserReference,
  changeUserReferenceToPlainText,
} from '../common/mentions'

const COLLECTION_NAME = 'howtos'
const HOWTO_SEARCH_WEIGHTS = [
  { name: 'title', weight: 0.5 },
  { name: 'description', weight: 0.2 },
  { name: '_createdBy', weight: 0.15 },
  { name: 'steps.title', weight: 0.1 },
  { name: 'steps.text', weight: 0.05 },
]

export class HowtoStore extends ModuleStore {
  // we have two property relating to docs that can be observed
  @observable
  public activeHowto: IHowtoDB | undefined
  @observable
  public allHowtos: IHowtoDB[]
  @observable
  public selectedCategory: string
  @observable
  public searchValue: string
  @observable
  public referrerSource: string
  @observable
  public uploadStatus: IHowToUploadStatus = getInitialUploadStatus()

  public filterHowtosByCategory = (
    collection: IHowtoDB[] = [],
    category: string,
  ) => {
    return category
      ? collection.filter((obj) => {
          return obj.category?.label === category
        })
      : collection
  }
  constructor(rootStore: RootStore) {
    // call constructor on common ModuleStore (with db endpoint), which automatically fetches all docs at
    // the given endpoint and emits changes as data is retrieved from cache and live collection
    super(rootStore, COLLECTION_NAME)
    makeObservable(this)
    this.allDocs$.subscribe((docs: IHowtoDB[]) => {
      this.sortHowtosByLatest(docs)
    })
    this.selectedCategory = ''
    this.searchValue = ''
    this.referrerSource = ''
  }

  @action
  public sortHowtosByLatest(docs?: IHowtoDB[]) {
    const howtos = docs || this.allHowtos
    this.allHowtos = howtos.sort((a, b) => (a._created < b._created ? 1 : -1))
  }

  @action
  public sortHowtosByUsefulCount(usefulCounts: { [key: string]: number }) {
    this.allHowtos = this.allHowtos.sort((a, b) =>
      (usefulCounts[a._id] || 0) < (usefulCounts[b._id] || 0) ? 1 : -1,
    )
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
  public async setActiveHowtoBySlug(slug: string) {
    // clear any cached data and then load the new howto
    logger.debug(`setActiveHowtoBySlug:`, { slug })

    if (!slug) {
      this.activeHowto = undefined
    }

    let activeHowto: IHowtoDB | undefined = undefined

    const collection = await this.db
      .collection<IHowto>(COLLECTION_NAME)
      .getWhere('slug', '==', slug)
    activeHowto = collection.length > 0 ? collection[0] : undefined
    logger.debug('active howto', activeHowto)

    // try previous slugs if slug is not recognized as primary
    if (!activeHowto) {
      const collection = await this.db
        .collection<IHowto>(COLLECTION_NAME)
        .getWhere('previousSlugs', 'array-contains', slug)

      activeHowto = collection.length > 0 ? collection[0] : undefined
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

    this.activeHowto = activeHowto
    return activeHowto
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
    const howtos = this.filterHowtosByCategory(
      this.allHowtos,
      this.selectedCategory,
    )
    // HACK - ARH - 2019/12/11 filter unaccepted howtos, should be done serverside
    let validHowtos = filterModerableItems(howtos, this.activeUser)

    // If user searched, filter remaining howtos by the search query with Fuse
    if (this.searchValue) {
      const fuse = new Fuse(validHowtos, {
        keys: HOWTO_SEARCH_WEIGHTS,
      })

      // Currently Fuse returns objects containing the search items, hence the need to map. https://github.com/krisk/Fuse/issues/532
      validHowtos = fuse.search(this.searchValue).map((v) => v.item)
    }

    return validHowtos
  }

  public async incrementDownloadCount(howToID: string) {
    const dbRef = this.db.collection<IHowto>(COLLECTION_NAME).doc(howToID)
    const howToData = await toJS(dbRef.get())
    const totalDownloads = howToData?.total_downloads || 0

    if (howToData) {
      const updatedHowto: IHowto = {
        ...howToData,
        total_downloads: totalDownloads! + 1,
      }

      dbRef.set(
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
    const howToData = await toJS(dbRef.get())
    const totalViews = howToData?.total_views || 0

    if (howToData) {
      const updatedHowto: IHowto = {
        ...howToData,
        total_views: totalViews! + 1,
      }

      dbRef.set(
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
      console.log({ err })
      console.error(err)
      throw new Error(err)
    }
  }

  private async updateHowtoItem(howToItem: IHowto) {
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

    await dbRef.set({
      ...howToItem,
      description,
      comments,
      mentions,
      steps,
    })

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

    return await dbRef.get()
  }

  @action
  public async editComment(id: string, newText: string) {
    try {
      const howto = this.activeHowto
      const user = this.activeUser
      if (id && howto && user && howto.comments) {
        const comments = toJS(howto.comments)
        const commentIndex = comments.findIndex(
          (comment) => comment._creatorId === user._id && comment._id === id,
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
      console.error(err)
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
              !(comment._creatorId === user._id && comment._id === id),
          ),
        })

        await this.setActiveHowtoBySlug(howto.slug)
      }
    } catch (err) {
      console.error(err)
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
      if (!values.cover_image.hasOwnProperty('downloadUrl')) {
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
      this.activeHowto = await this.updateHowtoItem(howTo)
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

  /** As users retain their own list of voted howtos lookup the current howto from the active user vote stats */
  @computed
  get userVotedActiveHowToUseful(): boolean {
    const howtoId = this.activeHowto!._id
    return !!this.activeUser?.votedUsefulHowtos?.[howtoId]
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

function getInitialUploadStatus(): IHowToUploadStatus {
  return {
    Start: false,
    Cover: false,
    'Step Images': false,
    Files: false,
    Database: false,
    Complete: false,
  }
}
