import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
  toJS,
} from 'mobx'
import { cloneDeep } from 'lodash'
import { createContext, useContext } from 'react'
import { MAX_COMMENT_LENGTH } from 'src/constants'
import { logger } from 'src/logger'
import type { IComment, IUser } from 'src/models'
import type { IConvertedFileMeta } from 'src/types'
import { getUserCountry } from 'src/utils/getUserCountry'
import {
  filterModerableItems,
  formatLowerNoSpecial,
  hasAdminRights,
  needsModeration,
  randomID,
} from 'src/utils/helpers'
import type { IResearch, IResearchDB } from '../../models/research.models'
import {
  changeMentionToUserReference,
  changeUserReferenceToPlainText,
} from '../common/mentions'
import { ModuleStore } from '../common/module.store'
import type { RootStore } from '../index'
import type { DocReference } from '../databaseV2/DocReference'
import {
  FilterSorterDecorator,
  ItemSortingOption,
} from '../common/FilterSorterDecorator/FilterSorterDecorator'
import { toggleDocUsefulByUser } from '../common/toggleDocUsefulByUser'

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
  public selectedAuthor: string

  @observable
  public searchValue: string

  @observable
  public activeSorter: ItemSortingOption

  public availableItemSortingOption: ItemSortingOption[]

  @observable
  private filterSorterDecorator: FilterSorterDecorator<IResearch.ItemDB>

  @observable
  public researchUploadStatus: IResearchUploadStatus =
    getInitialResearchUploadStatus()

  @observable
  public updateUploadStatus: IUpdateUploadStatus =
    getInitialUpdateUploadStatus()

  isFetching = true

  constructor(rootStore: RootStore) {
    super(rootStore, COLLECTION_NAME)
    makeObservable(this)
    super.init()

    this.selectedCategory = ''
    this.selectedAuthor = ''
    this.searchValue = ''
    this.availableItemSortingOption = [
      ItemSortingOption.Newest,
      ItemSortingOption.LatestUpdated,
      ItemSortingOption.MostUseful,
      ItemSortingOption.Comments,
      ItemSortingOption.Updates,
    ]

    this.allDocs$.subscribe((docs: IResearch.ItemDB[]) => {
      logger.debug('docs', docs)
      const activeItems = [...docs].filter((doc) => {
        return !doc._deleted
      })

      runInAction(() => {
        this.activeSorter = ItemSortingOption.LatestUpdated
        this.filterSorterDecorator = new FilterSorterDecorator()
        this.allResearchItems = this.filterSorterDecorator.sort(
          this.activeSorter,
          activeItems,
        )
        if (docs.length) {
          this.isFetching = false
        }
      })
    })
  }

  public updateActiveSorter(sorter: ItemSortingOption) {
    this.activeSorter = sorter
  }

  public updateSelectedAuthor(author: IUser['userName']) {
    this.selectedAuthor = author
  }

  @computed get filteredResearches() {
    const researches = this.filterSorterDecorator.filterByCategory(
      this.allResearchItems,
      this.selectedCategory,
    )

    let validResearches = filterModerableItems(researches, this.activeUser)

    validResearches = this.filterSorterDecorator.search(
      validResearches,
      this.searchValue,
    )

    validResearches = this.filterSorterDecorator.filterByAuthor(
      validResearches,
      this.selectedAuthor,
    )

    return this.filterSorterDecorator.sort(
      this.activeSorter,
      validResearches,
      this.activeUser,
    )
  }

  public formatResearchCommentList(comments: IComment[] = []): IComment[] {
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

  @action
  public async setActiveResearchItemBySlug(slug?: string) {
    logger.debug(`setActiveResearchItemBySlug:`, { slug })
    let activeResearchItem: IResearchDB | undefined = undefined

    if (slug) {
      activeResearchItem = await this._getResearchItemBySlug(slug)

      if (activeResearchItem) {
        activeResearchItem.collaborators =
          activeResearchItem.collaborators || []
        activeResearchItem.description = changeUserReferenceToPlainText(
          activeResearchItem.description,
        )
        activeResearchItem.updates = activeResearchItem.updates?.map(
          (update) => {
            update.description = changeUserReferenceToPlainText(
              update.description,
            )
            return update
          },
        )
      }
    }

    runInAction(() => {
      this.activeResearchItem = activeResearchItem
    })
    return activeResearchItem
  }

  public async addSubscriberToResearchArticle(
    docId: string,
    userId: string,
  ): Promise<void> {
    const dbRef = this.db.collection<IResearch.Item>(COLLECTION_NAME).doc(docId)

    const researchData = await toJS(dbRef.get('server'))
    if (researchData && !(researchData?.subscribers || []).includes(userId)) {
      const updatedItem = await this._updateResearchItem(dbRef, {
        ...researchData,
        subscribers: [userId].concat(researchData?.subscribers || []),
      })

      if (updatedItem) {
        this.setActiveResearchItemBySlug(updatedItem.slug)
      }
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
      const updatedItem = await this._updateResearchItem(dbRef, {
        ...researchData,
        subscribers: (researchData?.subscribers || []).filter(
          (id) => id !== userId,
        ),
      })

      if (updatedItem) {
        this.setActiveResearchItemBySlug(updatedItem.slug)
      }
    }

    return
  }

  @action
  public async toggleUsefulByUser(
    docId: string,
    userName: string,
  ): Promise<void> {
    const updatedItem = (await toggleDocUsefulByUser(
      this.db,
      COLLECTION_NAME,
      docId,
      userName,
    )) as IResearch.ItemDB

    runInAction(() => {
      this.activeResearchItem = updatedItem
      if ((updatedItem?.votedUsefulBy || []).includes(userName)) {
        this.userNotificationsStore.triggerNotification(
          'research_useful',
          this.activeResearchItem._createdBy,
          '/research/' + this.activeResearchItem.slug,
        )
        for (
          let i = 0;
          i < (this.activeResearchItem.collaborators || []).length;
          i++
        ) {
          this.userNotificationsStore.triggerNotification(
            'research_useful',
            this.activeResearchItem.collaborators[i],
            '/research/' + this.activeResearchItem.slug,
          )
        }
      }
    })

    return
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

  @action
  public async deleteResearch(id: string) {
    try {
      const dbRef = this.db.collection<IResearchDB>(COLLECTION_NAME).doc(id)
      const researchData = await toJS(dbRef.get('server'))

      const user = this.activeUser

      if (id && researchData && user) {
        await this._updateResearchItem(dbRef, {
          ...researchData,
          _deleted: true,
        })

        if (this.activeResearchItem !== undefined) {
          this.allResearchItems = this.allResearchItems.filter(
            (researchItem) => {
              return researchItem._id !== researchData._id
            },
          )
        }
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
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

  public updateSearchValue(query: string) {
    this.searchValue = query
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
    const researchItem = this.activeResearchItem
    const comment = text.slice(0, MAX_COMMENT_LENGTH).trim()
    if (researchItem && comment && user) {
      const dbRef = this.db
        .collection<IResearch.Item>(COLLECTION_NAME)
        .doc(researchItem._id)
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

        const existingUpdateIndex = researchItem.updates.findIndex(
          (upd) => upd._id === (update as IResearch.UpdateDB)._id,
        )

        const newItem = {
          ...toJS(researchItem),
          updates: [...toJS(researchItem.updates)],
        }

        newItem.updates[existingUpdateIndex] = {
          ...(updateWithMeta as IResearch.UpdateDB),
        }

        await this._updateResearchItem(dbRef, newItem)

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
        if (createdItem) {
          this.setActiveResearchItemBySlug(createdItem.slug)
        }
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
            !(
              (comment._creatorId === user._id || hasAdminRights(user)) &&
              comment._id === commentId
            ),
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

        const updatedItem = await this._updateResearchItem(dbRef, newItem)
        if (updatedItem) {
          this.setActiveResearchItemBySlug(updatedItem.slug)
        }
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
            (comment._creatorId === user._id || hasAdminRights(user)) &&
            comment._id === commentId,
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

          const updatedItem = await this._updateResearchItem(dbRef, newItem)

          if (updatedItem) {
            this.setActiveResearchItemBySlug(updatedItem.slug)
          }
        }
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
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

      // create previousSlugs based on available slug or title
      const previousSlugs: string[] = []
      if (values.slug) {
        previousSlugs.push(values.slug)
      } else if (values.title) {
        const titleToSlug = formatLowerNoSpecial(values.title)
        previousSlugs.push(titleToSlug)
      }

      const researchItem: IResearch.Item = {
        mentions: [],
        ...values,
        collaborators,
        _createdBy: values._createdBy ? values._createdBy : user.userName,
        _deleted: false,
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
      const updatedItem = await this._updateResearchItem(
        dbRef,
        researchItem,
        true,
      )
      this.updateResearchUploadStatus('Database')
      logger.debug('post added')
      if (updatedItem) {
        this.setActiveResearchItemBySlug(updatedItem.slug)
      }
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

        if ((update.files && update.files.length) || update.fileLink) {
          updateWithMeta.downloadCount = 0
        }

        if (update.files && update.files.length) {
          const fileMeta = await this.uploadCollectionBatch(
            update.files as File[],
            COLLECTION_NAME,
            id,
          )
          updateWithMeta.files = fileMeta
        }
        logger.debug('upload files ok')
        this.updateUpdateUploadStatus('Files')

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
            _contentModifiedTimestamp: new Date().toISOString(),
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
        await this._updateResearchItem(dbRef, newItem, true)
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

  public async deleteUpdate(updateId: string) {
    const item = this.activeResearchItem
    if (item) {
      const dbRef = this.db
        .collection<IResearch.Item>(COLLECTION_NAME)
        .doc(item._id)
      try {
        // populate DB
        const existingUpdateIndex = item.updates.findIndex(
          (upd) => upd._id === updateId,
        )

        if (existingUpdateIndex === -1) {
          logger.debug('No update matching id found')
          return
        }

        const newItem = {
          ...toJS(item),
          updates: [...toJS(item.updates)],
        }

        // editing update
        newItem.updates[existingUpdateIndex]._deleted = true

        // set the database document
        const updatedItem = await this._updateResearchItem(dbRef, newItem, true)

        if (updatedItem) {
          this.setActiveResearchItemBySlug(updatedItem.slug)
        }

        return updatedItem
      } catch (error) {
        logger.error('error deleting article', error)
      }
    }
  }

  /**
   * Increments the download count of files in reasearch update
   *
   * @param updateId
   */
  public async incrementDownloadCount(updateId: string): Promise<number> {
    try {
      let downloadCount = 0
      const item = this.activeResearchItem

      if (item) {
        const dbRef = this.db
          .collection<IResearch.Item>(COLLECTION_NAME)
          .doc(item._id)

        const newUpdates = item.updates.map((update) => {
          if (update._id == updateId) {
            update.downloadCount += 1
            downloadCount = update.downloadCount
          }
          return update
        })

        const newItem = {
          ...toJS(item),
          updates: [...toJS(newUpdates)],
        }

        const updatedItem = await this._updateResearchItem(dbRef, newItem)

        if (updatedItem) {
          this.setActiveResearchItemBySlug(updatedItem.slug)
        }
      }

      return downloadCount
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  @computed
  get userVotedActiveResearchUseful(): boolean {
    if (!this.activeUser) return false
    return (this.activeResearchItem?.votedUsefulBy || []).includes(
      this.activeUser.userName,
    )
  }

  @computed
  get userHasSubscribed(): boolean {
    return (
      this.activeResearchItem?.subscribers?.includes(
        this.activeUser?.userName ?? '',
      ) ?? false
    )
  }

  @computed
  get votedUsefulCount(): number {
    return (this.activeResearchItem?.votedUsefulBy || []).length
  }

  @computed
  get subscribersCount(): number {
    return (this.activeResearchItem?.subscribers || []).length
  }

  @computed
  get commentsCount(): number {
    if (this.activeResearchItem?.updates) {
      const commentOnUpdates = this.activeResearchItem?.updates.reduce(
        (totalComments, update) => {
          const updateCommentsLength = update.comments
            ? update.comments.length
            : 0
          return totalComments + updateCommentsLength
        },
        0,
      )
      return commentOnUpdates ? commentOnUpdates : 0
    } else {
      return 0
    }
  }

  @computed
  get updatesCount(): number {
    return this.activeResearchItem?.updates?.length
      ? this.activeResearchItem?.updates.filter(
          (update) => update.status !== 'draft' && update._deleted !== true,
        ).length
      : 0
  }

  @action
  public async lockResearchItem(username: string) {
    const item = this.activeResearchItem
    if (item) {
      const dbRef = this.db
        .collection<IResearch.Item>(COLLECTION_NAME)
        .doc(item._id)
      const newItem = {
        ...item,
        locked: {
          by: username,
          at: new Date().toISOString(),
        },
      }
      await this._updateResearchItem(dbRef, newItem)
      runInAction(() => {
        this.activeResearchItem = newItem
      })
    }
  }
  @action
  public async unlockResearchItem() {
    const item = this.activeResearchItem
    if (item) {
      const dbRef = this.db
        .collection<IResearch.Item>(COLLECTION_NAME)
        .doc(item._id)
      const newItem = {
        ...item,
        locked: null,
      }
      await this._updateResearchItem(dbRef, newItem)
      runInAction(() => {
        this.activeResearchItem = newItem
      })
    }
  }
  @action
  public async lockResearchUpdate(username: string, updateId: string) {
    const item = this.activeResearchItem
    if (item) {
      const dbRef = this.db
        .collection<IResearch.Item>(COLLECTION_NAME)
        .doc(item._id)
      const updateIndex = item.updates.findIndex((upd) => upd._id === updateId)
      const newItem = {
        ...item,
        updates: [...item.updates],
      }

      if (updateIndex && newItem.updates[updateIndex]) {
        newItem.updates[updateIndex].locked = {
          by: username,
          at: new Date().toISOString(),
        }
      }
      await this._updateResearchItem(dbRef, newItem)
      runInAction(() => {
        this.activeResearchItem = newItem
      })
    }
  }
  @action
  public async unlockResearchUpdate(updateId: string) {
    const item = this.activeResearchItem
    if (item) {
      const dbRef = this.db
        .collection<IResearch.Item>(COLLECTION_NAME)
        .doc(item._id)
      const updateIndex = item.updates.findIndex((upd) => upd._id === updateId)
      const newItem = {
        ...item,
        updates: [...item.updates],
      }

      if (newItem.updates[updateIndex]) {
        newItem.updates[updateIndex].locked = null
      }
      await this._updateResearchItem(dbRef, newItem)
      runInAction(() => {
        this.activeResearchItem = newItem
      })
    }
  }
  /**
   * Updates supplied dbRef after
   * converting @mentions to user references
   * on all required properties within researchItem object.
   *
   */
  private async _updateResearchItem(
    dbRef: DocReference<IResearch.Item>,
    researchItem: IResearch.Item,
    setLastEditTimestamp = false,
  ) {
    const { text: researchDescription, users } = await this.addUserReference(
      researchItem.description,
    )
    logger.debug('updateResearchItem', {
      researchItem,
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

    if (researchItem.previousSlugs === undefined) {
      researchItem.previousSlugs = []
    }

    if (!researchItem.previousSlugs.includes(researchItem.slug)) {
      researchItem.previousSlugs.push(researchItem.slug)
    }

    await dbRef.set(
      {
        ...cloneDeep(researchItem),
        mentions,
        description: researchDescription,
      },
      {
        set_last_edit_timestamp: setLastEditTimestamp,
      },
    )

    // Side effects from updating research item
    // consider moving these out of the store.
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

  private async _getResearchItemBySlug(
    slug: string,
  ): Promise<IResearchDB | undefined> {
    const collection = await this.db
      .collection<IResearch.ItemDB>(COLLECTION_NAME)
      .getWhere('slug', '==', slug)

    if (collection && collection.length) {
      return collection[0]
    }

    const previousSlugCollection = await this.db
      .collection<IResearch.ItemDB>(COLLECTION_NAME)
      .getWhere('previousSlugs', 'array-contains', slug)

    if (previousSlugCollection && previousSlugCollection.length) {
      return previousSlugCollection[0]
    }

    return undefined
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
  Files: boolean
  Database: boolean
  Complete: boolean
}

const getInitialUpdateUploadStatus = (): IUpdateUploadStatus => ({
  Start: false,
  Images: false,
  Files: false,
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
