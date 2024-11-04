import { createContext, useContext } from 'react'
import lodash from 'lodash'
import { action, makeObservable, observable, runInAction, toJS } from 'mobx'
import { IModerationStatus } from 'oa-shared'
import { logger } from 'src/logger'
import { getUserCountry } from 'src/utils/getUserCountry'
import { hasAdminRights, randomID } from 'src/utils/helpers'
import { getKeywords } from 'src/utils/searchHelper'

import { incrementDocViewCount } from '../common/incrementDocViewCount'
import { changeMentionToUserReference } from '../common/mentions'
import { ModuleStore } from '../common/module.store'
import { toggleDocSubscriberStatusByUserName } from '../common/toggleDocSubscriberStatusByUserName'
import { toggleDocUsefulByUser } from '../common/toggleDocUsefulByUser'
import { setCollaboratorPermission } from './researchEvents'

import type {
  IConvertedFileMeta,
  IResearch,
  IResearchDB,
  IUser,
  UserMention,
} from 'oa-shared'
import type { DocReference } from '../databaseV2/DocReference'
import type { IRootStore } from '../RootStore'

const { cloneDeep } = lodash

const COLLECTION_NAME = 'research'

export class ResearchStore extends ModuleStore {
  public researchUploadStatus: IResearchUploadStatus =
    getInitialResearchUploadStatus()
  public updateUploadStatus: IUpdateUploadStatus =
    getInitialUpdateUploadStatus()

  constructor(rootStore: IRootStore) {
    super(rootStore, COLLECTION_NAME)
    makeObservable(this, {
      researchUploadStatus: observable,
      updateUploadStatus: observable,
      toggleUsefulByUser: action,
      deleteResearch: action,
      updateResearchUploadStatus: action,
      updateUpdateUploadStatus: action,
      resetResearchUploadStatus: action,
      resetUpdateUploadStatus: action,
      lockResearchItem: action,
      unlockResearchItem: action,
    })
  }

  public async toggleSubscriber(
    docId: string,
    username: string,
  ): Promise<void> {
    if (!username) {
      throw Error('Requires a logged in user')
    }

    await toggleDocSubscriberStatusByUserName(
      this.db,
      COLLECTION_NAME,
      docId,
      username,
    )
  }

  public async toggleUsefulByUser(
    research: IResearchDB,
    userName: string,
  ): Promise<void> {
    const updatedItem = (await toggleDocUsefulByUser(
      COLLECTION_NAME,
      research._id,
      userName,
    )) as IResearch.ItemDB

    runInAction(() => {
      if ((updatedItem?.votedUsefulBy || []).includes(userName)) {
        this.userNotificationsStore.triggerNotification(
          'research_useful',
          research._createdBy,
          '/research/' + research.slug,
          research.title,
        )
        for (let i = 0; i < (research.collaborators || []).length; i++) {
          this.userNotificationsStore.triggerNotification(
            'research_useful',
            research.collaborators[i],
            '/research/' + research.slug,
            research.title,
          )
        }
      }
    })

    return
  }

  public async incrementViewCount(researchItem: Partial<IResearch.ItemDB>) {
    return await incrementDocViewCount({
      collection: COLLECTION_NAME,
      db: this.db,
      doc: researchItem,
    })
  }

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
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  public async moderateResearch(research: IResearch.ItemDB) {
    if (!this.activeUser || !hasAdminRights(toJS(this.activeUser))) {
      return false
    }
    const doc = this.db.collection(COLLECTION_NAME).doc(research._id)
    return doc.set(toJS(research))
  }

  public updateResearchUploadStatus(update: keyof IResearchUploadStatus) {
    this.researchUploadStatus[update] = true
  }
  public updateUpdateUploadStatus(update: keyof IUpdateUploadStatus) {
    this.updateUploadStatus[update] = true
  }

  public resetResearchUploadStatus() {
    this.researchUploadStatus = getInitialResearchUploadStatus()
  }

  public resetUpdateUploadStatus() {
    this.updateUploadStatus = getInitialUpdateUploadStatus()
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

  public async uploadResearch(values: IResearch.FormInput) {
    logger.debug('uploading research')
    this.updateResearchUploadStatus('Start')
    // create a reference either to the existing document (if editing) or a new document if creating
    const dbRef = this.db
      .collection<IResearch.Item>(COLLECTION_NAME)
      .doc(values._id)
    const user = this.activeUser as IUser
    const updates = (await dbRef.get('server'))?.updates || [] // save old updates when editing
    const collaborators = await this._setCollaborators(values.collaborators)
    let updatedResearch: IResearchDB | null = null

    try {
      const userCountry = getUserCountry(user)
      const slug = await this.setSlug(values)
      const previousSlugs = this.setPreviousSlugs(values, slug)

      const researchItem: Partial<IResearch.Item> = {
        mentions: [],
        ...values,
        slug,
        previousSlugs,
        collaborators,
        _createdBy: values._createdBy ? values._createdBy : user.userName,
        _deleted: false,
        moderation: values.moderation
          ? values.moderation
          : IModerationStatus.ACCEPTED, // No moderation needed for researches for now
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
      updatedResearch = await this._updateResearchItem(
        dbRef,
        researchItem,
        true,
      )
      this.updateResearchUploadStatus('Database')
      logger.debug('post added')
      // complete
      this.updateResearchUploadStatus('Complete')
    } catch (error) {
      logger.debug('error', error)
      //TODO: Add error handling here :(
      //throw new Error(error.message)
    }

    return updatedResearch
  }

  /**
   * Uploads new or edits an existing update
   *
   * @param update
   */
  public async uploadUpdate(
    item: IResearchDB,
    update: IResearch.Update | IResearch.UpdateDB,
  ) {
    logger.debug(`uploadUpdate`, { update })
    let updatedItem: IResearchDB | null = null
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
          })
        } else {
          // editing update
          newItem.updates[existingUpdateIndex] = {
            ...(updateWithMeta as IResearch.UpdateDB),
            _modified: new Date().toISOString(),
          }
        }

        newItem.totalUpdates = newItem.updates.length

        logger.debug(
          'old and new modified:',
          (update as IResearch.UpdateDB)._modified,
          newItem._modified,
        )
        logger.debug('created:', newItem._created)

        // set the database document
        updatedItem = await this._updateResearchItem(dbRef, newItem, true)
        logger.debug('populate db ok')
        this.updateUpdateUploadStatus('Database')
        this.updateUpdateUploadStatus('Complete')
      } catch (error) {
        logger.error('error', error)
      }
    }

    return updatedItem
  }

  public async deleteUpdate(item: IResearchDB, updateId: string) {
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
        await this._updateResearchItem(dbRef, newItem, true)
      } catch (error) {
        logger.error('error deleting article', error)
      }
    }
  }

  /**
   * Increments the download count of files in research update
   *
   * @param updateId
   */
  public async incrementDownloadCount(
    item: IResearchDB,
    updateId: string,
  ): Promise<number> {
    try {
      let downloadCount = 0

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

        await this._updateResearchItem(dbRef, newItem)
      }

      return downloadCount
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  public async lockResearchItem(item: IResearchDB, username: string) {
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
    }
  }

  public async unlockResearchItem(item: IResearchDB) {
    if (item) {
      const dbRef = this.db
        .collection<IResearch.Item>(COLLECTION_NAME)
        .doc(item._id)
      const newItem = {
        ...item,
        locked: null,
      }
      await this._updateResearchItem(dbRef, newItem)
    }
  }

  public async toggleLockResearchUpdate(
    researchId: string,
    username: string,
    updateId: string,
    lock: boolean,
  ) {
    const dbRef = this.db
      .collection<IResearch.Item>(COLLECTION_NAME)
      .doc(researchId)

    const item = toJS(await dbRef.get('server')) as IResearchDB
    const updateIndex = item.updates.findIndex((upd) => upd._id === updateId)
    const updatedItem = {
      ...item,
      updates: [...item.updates],
    }

    if (updatedItem.updates[updateIndex]) {
      updatedItem.updates[updateIndex].locked = lock
        ? {
            by: username,
            at: new Date().toISOString(),
          }
        : null
    }

    await dbRef.set(updatedItem)
  }

  private async _setCollaborators(
    collaborators: IResearch.Item['collaborators'] | string | undefined,
  ) {
    if (!collaborators) return []

    const list = Array.isArray(collaborators)
      ? collaborators
      : (collaborators || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)

    await Promise.all(
      list.map((collaborator) =>
        setCollaboratorPermission(this.db, collaborator),
      ),
    )

    return list
  }

  /**
   * Updates supplied dbRef after
   * converting @mentions to user references
   * on all required properties within researchItem object.
   *
   */
  private async _updateResearchItem(
    dbRef: DocReference<IResearch.Item>,
    researchDoc: Partial<IResearch.Item>,
    setLastEditTimestamp = false,
  ) {
    const researchItem = cloneDeep(researchDoc)
    const { text: researchDescription, users } = await this.addUserReference(
      researchItem.description || '',
    )
    logger.debug('updateResearchItem', {
      researchItem,
    })

    const previousVersion = toJS(await dbRef.get('server'))

    const mentions: UserMention[] = researchItem.mentions
      ? cloneDeep(researchItem.mentions)
      : []

    if (researchItem.updates && researchItem.updates.length > 0) {
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

          researchItem.updates![idx].description = newDescription
        }),
      )
    }
    ;(users || []).map((username) => {
      mentions.push({
        username,
        location: 'description',
      })
    })

    const keywords = getKeywords(
      researchItem.title + ' ' + researchItem.description,
    )

    if (researchItem._createdBy) {
      keywords.push(researchItem._createdBy)
    }

    await dbRef.set(
      {
        ...cloneDeep(researchItem),
        previousSlugs: getPreviousSlugs(
          researchItem.slug!,
          researchItem.previousSlugs,
        ),
        mentions,
        description: researchDescription,
        keywords,
      } as IResearch.Item,
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
          researchItem.title!,
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
      afterUpdateNumber: researchItem?.updates!.length,
    })

    if (
      researchItem.updates!.length >
      (previousVersion?.updates ? previousVersion?.updates.length : 0)
    ) {
      subscribers.forEach((subscriber) =>
        this.userNotificationsStore.triggerNotification(
          'research_update',
          subscriber,
          `/research/${researchItem.slug}`,
          researchItem.title!,
        ),
      )
    }

    return (await dbRef.get('server')) as IResearchDB
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

const getPreviousSlugs = (
  slug: string,
  previousSlugs = [] as string[],
): string[] => {
  const newSlugList = cloneDeep(previousSlugs)

  if (previousSlugs.includes(slug)) {
    return newSlugList
  }

  return [...newSlugList, slug]
}
