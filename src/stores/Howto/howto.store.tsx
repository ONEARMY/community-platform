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
  IComment,
} from 'src/models/howto.models'
import type { ISelectedTags } from 'src/models/tags.model'
import type { IUser } from 'src/models/user.models'
import {
  filterModerableItems,
  hasAdminRights,
  needsModeration,
  randomID,
} from 'src/utils/helpers'
import type { RootStore } from '../index'
import { ModuleStore } from '../common/module.store'
import type { IUploadedFileMeta } from '../storage'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { logger } from 'src/logger'

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
  public selectedTags: ISelectedTags
  @observable
  public selectedCategory: string
  @observable
  public searchValue: string
  @observable
  public referrerSource: string
  @observable
  public uploadStatus: IHowToUploadStatus = getInitialUploadStatus()

  constructor(rootStore: RootStore) {
    // call constructor on common ModuleStore (with db endpoint), which automatically fetches all docs at
    // the given endpoint and emits changes as data is retrieved from cache and live collection
    super(rootStore, COLLECTION_NAME)
    makeObservable(this)
    this.allDocs$.subscribe((docs: IHowtoDB[]) => {
      this.sortHowtosByLatest(docs)
    })
    this.selectedTags = {}
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
    this.activeHowto = undefined
    const collection = await this.db
      .collection<IHowto>(COLLECTION_NAME)
      .getWhere('slug', '==', slug)
    const activeHowto = collection.length > 0 ? collection[0] : undefined
    logger.debug('active howto', activeHowto)
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
    let howtos = this.filterCollectionByTags(this.allHowtos, this.selectedTags)
    howtos = this.filterHowtosByCategory(howtos, this.selectedCategory)
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

  public updateSearchValue(query: string) {
    this.searchValue = query
  }

  public updateReferrerSource(source: string) {
    this.referrerSource = source
  }

  public updateSelectedTags(tagKey: ISelectedTags) {
    this.selectedTags = tagKey
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
    const ref = this.db.collection(COLLECTION_NAME).doc(howto._id)
    // NOTE CC - 2021-07-06 mobx updates try write to db as observable, so need to convert toJS
    return ref.set(toJS(howto))
  }

  public needsModeration(howto: IHowto) {
    return needsModeration(howto, toJS(this.activeUser))
  }

  @action
  public async addComment(text: string) {
    try {
      const user = this.activeUser
      const howto = this.activeHowto
      let comment = text.slice(0, MAX_COMMENT_LENGTH).trim()

      if (user && howto && comment) {
        const mentions = await this.parseMentions(comment)
        comment = mentions.text
        const userCountry = getUserCountry(user)
        const newComment: IComment = {
          _id: randomID(),
          _created: new Date().toISOString(),
          _creatorId: user._id,
          creatorName: user.userName,
          creatorCountry: userCountry,
          text: comment,
        }

        const updatedHowto: IHowto = {
          ...toJS(howto),
          comments: howto.comments
            ? [...toJS(howto.comments), newComment]
            : [newComment],
        }

        const dbRef = this.db
          .collection<IHowto>(COLLECTION_NAME)
          .doc(updatedHowto._id)

        await dbRef.set(updatedHowto)

        // Refresh the active howto
        this.activeHowto = await dbRef.get()
        this.notifyMentionedUsers(
          mentions.mentionedUsers,
          'comment_mention_howto',
          '/how-to/' + howto.slug + '#comment_' + newComment._id,
        )
        // trigger notification for comment only
        // if how-to author wasn't mentioned in the comment
        // to avoid duplicated notifications
        if (!mentions.mentionedUsers.has(howto._createdBy)) {
          await this.userStore.triggerNotification(
            'new_comment',
            howto._createdBy,
            '/how-to/' + howto.slug,
          )
        }
      }
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
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

          const updatedHowto: IHowto = {
            ...toJS(howto),
            comments,
          }

          const dbRef = this.db
            .collection<IHowto>(COLLECTION_NAME)
            .doc(updatedHowto._id)

          await dbRef.set(updatedHowto)

          // Refresh the active howto
          this.activeHowto = await dbRef.get()
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
        const comments = toJS(howto.comments).filter(
          (comment) => !(comment._creatorId === user._id && comment._id === id),
        )

        const updatedHowto: IHowto = {
          ...toJS(howto),
          comments,
        }

        const dbRef = this.db
          .collection<IHowto>(COLLECTION_NAME)
          .doc(updatedHowto._id)

        await dbRef.set(updatedHowto)

        // Refresh the active howto
        this.activeHowto = await dbRef.get()
      }
    } catch (err) {
      console.error(err)
      throw new Error(err)
    }
  }

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

  // upload a new or update an existing how-to
  public async uploadHowTo(values: IHowtoFormInput | IHowtoDB) {
    logger.debug('uploading howto')
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
      const howTo: IHowto = {
        ...values,
        _createdBy: values._createdBy ? values._createdBy : user.userName,
        comments,
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
      logger.debug('populating database', howTo)
      // set the database document
      await dbRef.set(howTo)
      this.updateUploadStatus('Database')
      logger.debug('post added')
      this.activeHowto = await dbRef.get()
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
        images: imgMeta.map((f) => {
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

function getInitialUploadStatus() {
  const status: IHowToUploadStatus = {
    Start: false,
    Cover: false,
    'Step Images': false,
    Files: false,
    Database: false,
    Complete: false,
  }
  return status
}
