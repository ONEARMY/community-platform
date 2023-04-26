import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
  toJS,
} from 'mobx'
import type {
  IResearchStats,
  IResearchDB,
  IResearch,
} from '../../models/research.models'
import { createContext, useContext } from 'react'
import type { IConvertedFileMeta } from 'src/types'
import { getUserCountry } from 'src/utils/getUserCountry'
import { logger } from 'src/logger'
import type { IComment, IUser } from 'src/models'
import { ModuleStore } from '../common/module.store'
import {
  filterModerableItems,
  hasAdminRights,
  needsModeration,
  randomID,
} from 'src/utils/helpers'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import {
  changeMentionToUserReference,
  changeUserReferenceToPlainText,
} from '../common/mentions'
import type { DocReference } from '../databaseV2/DocReference'

const COLLECTION_NAME = 'research'

export class ResearchStore extends ModuleStore {
  /**
   * @deprecated
   */
  @observable
  public activeResearch: IResearchDB | undefined

  @observable
  public allResearchItems: IResearch.ItemDB[] = []

  @observable
  public activeResearchItem: IResearch.ItemDB | undefined

  @observable
  public selectedCategory: string

  @observable
  public researchUploadStatus: IResearchUploadStatus =
    getInitialResearchUploadStatus()

  @observable
  public updateUploadStatus: IUpdateUploadStatus =
    getInitialUpdateUploadStatus()

  @observable researchStats: IResearchStats | undefined

  public filterResearchesByCategory = (
    collection: IResearch.ItemDB[] = [],
    category: string,
  ) => {
    return category
      ? collection.filter((obj) => {
          return obj.researchCategory?.label === category
        })
      : collection
  }
  constructor() {
    super(null as any, 'research')
    makeObservable(this)
    super.init()

    this.allDocs$.subscribe((docs: IResearch.ItemDB[]) => {
      logger.debug('docs', docs)
      const sortedItems = docs.sort((a, b) =>
        a._modified < b._modified ? 1 : -1,
      )
      runInAction(() => {
        this.allResearchItems = sortedItems
      })
    })
    this.selectedCategory = ''
  }
  @computed get filteredResearches() {
    const researches = this.filterResearchesByCategory(
      this.allResearchItems,
      this.selectedCategory,
    )
    return filterModerableItems(researches, this.activeUser)
  }

  public getActiveResearchUpdateComments(pointer: number): IComment[] {
    const comments = this.activeResearchItem?.updates[pointer]?.comments || []

    return comments.map((comment: IComment) => {
      return {
        ...comment,
        text: changeUserReferenceToPlainText(comment.text),
        isUserVerified:
          !!this.aggregationsStore.aggregations.users_verified?.[
            comment.creatorName
          ],
      }
    })
  }

  public async setActiveResearchItem(slug?: string) {
    if (slug) {
      this.researchStats = undefined
      const collection = await this.db
        .collection<IResearch.ItemDB>(COLLECTION_NAME)
        .getWhere('slug', '==', slug)
      const researchItem: IResearch.ItemDB =
        collection.length > 0 ? collection[0] : undefined
      runInAction(() => {
        this.activeResearchItem = {
          ...researchItem,
          collaborators: researchItem.collaborators || [],
          description: changeUserReferenceToPlainText(researchItem.description),
          updates: researchItem.updates?.map((update) => {
            update.description = changeUserReferenceToPlainText(
              update.description,
            )
            return update
          }),
        }
      })
      // load Research stats which are stored in a separate subcollection
      await this.loadResearchStats(researchItem?._id)
      return researchItem as IResearch.ItemDB
    } else {
      runInAction(() => {
        this.activeResearchItem = undefined
      })
    }
  }

  public async addSubscriberToResearchArticle(
    docId: string,
    userId: string,
  ): Promise<void> {
    const dbRef = this.db.collection<IResearch.Item>(COLLECTION_NAME).doc(docId)

    const researchData = await toJS(dbRef.get('server'))
    if (researchData && !(researchData?.subscribers || []).includes(userId)) {
      await this.updateResearchItem(dbRef, {
        ...researchData,
        subscribers: [userId].concat(researchData?.subscribers || []),
      })

      const createdItem = (await dbRef.get()) as IResearch.ItemDB
      runInAction(() => {
        this.activeResearchItem = createdItem
      })
    }

    return
  }

  public async removeSubscriberFromResearchArticle(
    docId: string,
    userId: string,
  ): Promise<void> {
    const dbRef = this.db.collection<IResearch.Item>(COLLECTION_NAME).doc(docId)

    const researchData = await toJS(dbRef.get('server'))
    if (researchData) {
      await this.updateResearchItem(dbRef, {
        ...researchData,
        subscribers: (researchData?.subscribers || []).filter(
          (id) => id !== userId,
        ),
      })

      const createdItem = (await dbRef.get()) as IResearch.ItemDB
      runInAction(() => {
        this.activeResearchItem = createdItem
      })
    }

    return
  }

  @action
  private async loadResearchStats(id?: string) {
    if (id) {
      const ref = this.db
        .collection<IResearchStats>('research')
        .doc(`${id}/stats/all`)
      const researchStats = await ref.get('server')
      logger.debug('researchStats', researchStats)
      this.researchStats = researchStats || { votedUsefulCount: 0 }
    }
  }

  public async incrementViewCount(id: string) {
    const dbRef = this.db.collection<IResearchDB>(COLLECTION_NAME).doc(id)
    const researchData = await toJS(dbRef.get('server'))
    const totalViews = researchData?.total_views || 0

    if (researchData) {
      const updatedResearch: IResearchDB = {
        ...researchData,
        total_views: totalViews! + 1,
      }

      await dbRef.set(
        {
          ...updatedResearch,
        },
        { keep_modified_timestamp: true },
      )

      return updatedResearch.total_views
    }
  }

  public deleteResearchItem(id: string) {
    this.db.collection('research').doc(id).delete()
  }

  public async moderateResearch(research: IResearch.ItemDB) {
    if (!hasAdminRights(toJS(this.activeUser))) {
      return false
    }
    const doc = this.db.collection(COLLECTION_NAME).doc(research._id)
    return doc.set(toJS(research))
  }

  public needsModeration(research: IResearch.ItemDB) {
    return needsModeration(research, toJS(this.activeUser))
  }

  @action
  public updateResearchUploadStatus(update: keyof IResearchUploadStatus) {
    this.researchUploadStatus[update] = true
  }

  @action
  public updateUpdateUploadStatus(update: keyof IUpdateUploadStatus) {
    this.updateUploadStatus[update] = true
  }

  @action
  public resetResearchUploadStatus() {
    this.researchUploadStatus = getInitialResearchUploadStatus()
  }

  @action
  public resetUpdateUploadStatus() {
    this.updateUploadStatus = getInitialUpdateUploadStatus()
  }

  @action
  public updateSelectedCategory(category: string) {
    this.selectedCategory = category
  }

  private async addUserReference(str: string): Promise<{
    text: string
    users: string[]
  }> {
    const { text, mentionedUsers: users } = await changeMentionToUserReference(
      str,
      this.userStore,
    )
    return {
      text,
      users,
    }
  }

  public async addComment(
    text: string,
    update: IResearch.Update | IResearch.UpdateDB,
  ) {
    const user = this.activeUser
    const item = this.activeResearchItem
    const comment = text.slice(0, MAX_COMMENT_LENGTH).trim()
    if (item && comment && user) {
      const dbRef = this.db
        .collection<IResearch.Item>(COLLECTION_NAME)
        .doc(item._id)
      const id = dbRef.id

      try {
        const userCountry = getUserCountry(user)
        const newComment: IComment = {
          _id: randomID(),
          _created: new Date().toISOString(),
          _creatorId: user._id,
          creatorName: user.userName,
          creatorCountry: userCountry,
          text: comment,
        }

        const updateWithMeta = { ...update }
        if (update.images.length > 0) {
          const imgMeta = await this.uploadCollectionBatch(
            update.images.filter((img) => !!img) as IConvertedFileMeta[],
            COLLECTION_NAME,
            id,
          )
          const newImg = imgMeta.map((img) => ({ ...img }))
          updateWithMeta.images = newImg
        } else {
          updateWithMeta.images = []
        }

        updateWithMeta.comments = updateWithMeta.comments
          ? [...toJS(updateWithMeta.comments), newComment]
          : [newComment]

        const existingUpdateIndex = item.updates.findIndex(
          (upd) => upd._id === (update as IResearch.UpdateDB)._id,
        )

        const newItem = {
          ...toJS(item),
          updates: [...toJS(item.updates)],
        }

        newItem.updates[existingUpdateIndex] = {
          ...(updateWithMeta as IResearch.UpdateDB),
        }

        await this.updateResearchItem(dbRef, newItem)

        // Notify author and contributors
        await this.userNotificationsStore.triggerNotification(
          'new_comment_research',
          newItem._createdBy,
          '/research/' + newItem.slug + '#update_' + existingUpdateIndex,
        )

        newItem.collaborators.map((username) => {
          this.userNotificationsStore.triggerNotification(
            'new_comment_research',
            username,
            '/research/' + newItem.slug + '#update_' + existingUpdateIndex,
          )
        })

        const createdItem = (await dbRef.get()) as IResearch.ItemDB
        runInAction(() => {
          this.activeResearchItem = createdItem
        })
      } catch (error) {
        logger.error(error)
        throw new Error(error?.message)
      }
    }
  }

  public async deleteComment(
    commentId: string,
    update: IResearch.Update | IResearch.UpdateDB,
  ) {
    try {
      const item = this.activeResearchItem
      const user = this.activeUser
      if (commentId && item && user && update.comments) {
        const dbRef = this.db
          .collection<IResearch.Item>(COLLECTION_NAME)
          .doc(item._id)
        const id = dbRef.id

        const newComments = toJS(update.comments).filter(
          (comment) =>
            !(comment._creatorId === user._id && comment._id === commentId),
        )

        const updateWithMeta = { ...update }
        if (update.images.length > 0) {
          const imgMeta = await this.uploadCollectionBatch(
            update.images.filter((img) => !!img) as IConvertedFileMeta[],
            COLLECTION_NAME,
            id,
          )
          const newImg = imgMeta.map((img) => ({ ...img }))
          updateWithMeta.images = newImg
        } else {
          updateWithMeta.images = []
        }

        updateWithMeta.comments = newComments

        const existingUpdateIndex = item.updates.findIndex(
          (upd) => upd._id === (update as IResearch.UpdateDB)._id,
        )

        const newItem = {
          ...toJS(item),
          updates: [...toJS(item.updates)],
        }

        newItem.updates[existingUpdateIndex] = {
          ...(updateWithMeta as IResearch.UpdateDB),
        }

        await this.updateResearchItem(dbRef, newItem)
        const createdItem = (await dbRef.get()) as IResearch.ItemDB
        runInAction(() => {
          this.activeResearchItem = createdItem
        })
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  public async editComment(
    commentId: string,
    newText: string,
    update: IResearch.Update | IResearch.UpdateDB,
  ) {
    try {
      const item = this.activeResearchItem
      const user = this.activeUser
      if (commentId && item && user && update.comments) {
        const dbRef = this.db
          .collection<IResearch.Item>(COLLECTION_NAME)
          .doc(item._id)
        const id = dbRef.id

        const pastComments = toJS(update.comments)
        const commentIndex = pastComments.findIndex(
          (comment) =>
            comment._creatorId === user._id && comment._id === commentId,
        )
        const updateWithMeta = { ...update }
        if (update.images.length > 0) {
          const imgMeta = await this.uploadCollectionBatch(
            update.images.filter((img) => !!img) as IConvertedFileMeta[],
            COLLECTION_NAME,
            id,
          )
          const newImg = imgMeta.map((img) => ({ ...img }))
          updateWithMeta.images = newImg
        } else updateWithMeta.images = []

        if (commentIndex !== -1) {
          pastComments[commentIndex].text = newText
            .slice(0, MAX_COMMENT_LENGTH)
            .trim()
          pastComments[commentIndex]._edited = new Date().toISOString()
          updateWithMeta.comments = pastComments

          const existingUpdateIndex = item.updates.findIndex(
            (upd) => upd._id === (update as IResearch.UpdateDB)._id,
          )

          const newItem = {
            ...toJS(item),
            updates: [...toJS(item.updates)],
          }

          newItem.updates[existingUpdateIndex] = {
            ...(updateWithMeta as IResearch.UpdateDB),
          }

          await this.updateResearchItem(dbRef, newItem)
          const createdItem = (await dbRef.get()) as IResearch.ItemDB
          runInAction(() => {
            this.activeResearchItem = createdItem
          })
        }
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  /**
   * Updates supplied dbRef after
   * converting @mentions to user references
   * on all required properties within researchItem object.
   *
   */
  private async updateResearchItem(
    dbRef: DocReference<IResearch.Item>,
    researchItem: IResearch.Item,
  ) {
    const { text: researchDescription, users } = await this.addUserReference(
      researchItem.description,
    )
    logger.debug('updateResearchItem', {
      before: researchItem.description,
      after: researchDescription,
    })

    const previousVersion = toJS(await dbRef.get('server'))

    const mentions: any = []

    await Promise.all(
      researchItem.updates.map(async (up, idx) => {
        const { text: newDescription, users } = await this.addUserReference(
          up.description,
        )

        ;(users || []).map((username) => {
          mentions.push({
            username,
            location: `update-${idx}`,
          })
        })

        researchItem.updates[idx].description = newDescription

        if (researchItem.updates[idx]) {
          await Promise.all(
            (researchItem.updates[idx].comments || ([] as IComment[])).map(
              async (comment, commentIdx) => {
                const { text, users } = await this.addUserReference(
                  comment.text,
                )

                const researchUpdate = researchItem.updates[idx]
                if (researchUpdate.comments) {
                  researchUpdate.comments[commentIdx].text = text

                  users.map((username) => {
                    mentions.push({
                      username,
                      location: `update-${idx}-comment:${comment._id}`,
                    })
                  })
                }
              },
            ),
          )
        }
      }),
    )
    ;(users || []).map((username) => {
      mentions.push({
        username,
        location: 'description',
      })
    })

    await dbRef.set({
      ...researchItem,
      mentions,
      description: researchDescription,
    })

    const previousMentionsList = researchItem.mentions || []
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
          'research_mention',
          mention.username,
          `/research/${researchItem.slug}#${mention.location}`,
        )
      }
    })

    // Notify each subscriber
    const subscribers = researchItem.subscribers || []

    // Only notify subscribers if there is a new update added
    logger.debug('Notify each subscriber', {
      subscribers,
      beforeUpdateNumber: previousVersion?.updates
        ? previousVersion?.updates.length
        : 0,
      afterUpdateNumber: researchItem?.updates.length,
    })

    if (
      researchItem.updates.length >
      (previousVersion?.updates ? previousVersion?.updates.length : 0)
    ) {
      subscribers.forEach((subscriber) =>
        this.userNotificationsStore.triggerNotification(
          'research_update',
          subscriber,
          `/research/${researchItem.slug}`,
        ),
      )
    }

    return await dbRef.get()
  }

  public async uploadResearch(values: IResearch.FormInput) {
    logger.debug('uploading research')
    this.updateResearchUploadStatus('Start')
    // create a reference either to the existing document (if editing) or a new document if creating
    const dbRef = this.db
      .collection<IResearch.Item>(COLLECTION_NAME)
      .doc(values._id)
    const user = this.activeUser as IUser
    const updates = (await dbRef.get())?.updates || [] // save old updates when editing
    const collaborators = Array.isArray(values?.collaborators)
      ? values.collaborators
      : (values.collaborators || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)

    try {
      // populate DB
      // define research
      const userCountry = getUserCountry(user)
      const researchItem: IResearch.Item = {
        mentions: [],
        ...values,
        collaborators,
        _createdBy: values._createdBy ? values._createdBy : user.userName,
        moderation: values.moderation ? values.moderation : 'accepted', // No moderation needed for researches for now
        updates,
        creatorCountry:
          (values._createdBy && values._createdBy === user.userName) ||
          !values._createdBy
            ? userCountry
            : values.creatorCountry
            ? values.creatorCountry
            : '',
      }
      logger.debug('populating database', researchItem)
      // set the database document
      await this.updateResearchItem(dbRef, researchItem)
      this.updateResearchUploadStatus('Database')
      logger.debug('post added')
      const newItem = (await dbRef.get()) as IResearch.ItemDB
      runInAction(() => {
        this.activeResearchItem = newItem
      })
      // complete
      this.updateResearchUploadStatus('Complete')
    } catch (error) {
      logger.debug('error', error)
      //TODO: Add error handling here :(
      //throw new Error(error.message)
    }
  }

  /**
   * Uploads new or edits an existing update
   *
   * @param update
   */
  public async uploadUpdate(update: IResearch.Update | IResearch.UpdateDB) {
    logger.debug(`uploadUpdate`, { update })
    const item = this.activeResearchItem
    if (item) {
      const dbRef = this.db
        .collection<IResearch.Item>(COLLECTION_NAME)
        .doc(item._id)
      const id = dbRef.id
      this.updateUpdateUploadStatus('Start')
      try {
        // upload any pending images, avoid trying to re-upload images previously saved
        // if cover already uploaded stored as object not array
        // file and step image re-uploads handled in uploadFile script
        const updateWithMeta = { ...update }
        if (update.images.length > 0) {
          const imgMeta = await this.uploadCollectionBatch(
            update.images.filter((img) => !!img) as IConvertedFileMeta[],
            COLLECTION_NAME,
            id,
          )
          updateWithMeta.images = imgMeta
        }
        logger.debug('upload images ok')
        this.updateUpdateUploadStatus('Images')

        // populate DB
        const existingUpdateIndex = item.updates.findIndex(
          (upd) => upd._id === (update as IResearch.UpdateDB)._id,
        )
        const newItem = {
          ...toJS(item),
          description: (await this.addUserReference(item.description)).text,
          updates: [...toJS(item.updates)],
        }
        if (existingUpdateIndex === -1) {
          // new update
          newItem.updates.push({
            ...updateWithMeta,
            // TODO - insert metadata into the new update
            _id: randomID(),
            _created: new Date().toISOString(),
            _modified: new Date().toISOString(),
            _deleted: false,
            comments: [],
          })
        } else {
          // editing update
          newItem.updates[existingUpdateIndex] = {
            ...(updateWithMeta as IResearch.UpdateDB),
            _modified: new Date().toISOString(),
          }
        }

        //
        logger.debug(
          'old and new modified:',
          (update as IResearch.UpdateDB)._modified,
          newItem._modified,
        )
        logger.debug('created:', newItem._created)

        // set the database document
        await this.updateResearchItem(dbRef, newItem)
        logger.debug('populate db ok')
        this.updateUpdateUploadStatus('Database')
        const createdItem = (await dbRef.get()) as IResearch.ItemDB
        runInAction(() => {
          this.activeResearchItem = createdItem
        })
        this.updateUpdateUploadStatus('Complete')
      } catch (error) {
        logger.error('error', error)
      }
    }
  }
  get userVotedActiveResearchUseful(): boolean {
    const researchId = this.activeResearchItem!._id
    const userVotedResearch = this.activeUser?.votedUsefulResearch || {}
    return userVotedResearch[researchId] ? true : false
  }
}

interface IResearchUploadStatus {
  Start: boolean
  Database: boolean
  Complete: boolean
}

export interface IUpdateUploadStatus {
  Start: boolean
  Images: boolean
  Database: boolean
  Complete: boolean
}

const getInitialUpdateUploadStatus = (): IUpdateUploadStatus => ({
  Start: false,
  Images: false,
  Database: false,
  Complete: false,
})

const getInitialResearchUploadStatus = (): IResearchUploadStatus => ({
  Start: false,
  Database: false,
  Complete: false,
})

/**
 * Export an empty context object to be shared with components
 * The context will be populated with the researchStore in the module index
 * (avoids cyclic deps and ensure shared module ready)
 */
export const ResearchStoreContext = createContext<ResearchStore>(null as any)
export const useResearchStore = () => useContext(ResearchStoreContext)
