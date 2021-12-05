import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
  toJS,
} from 'mobx'
import { createContext, useContext } from 'react'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'
import { logger } from 'src/logger'
import { IUser } from 'src/models'
import { IResearch } from 'src/models/research.models'
import { ModuleStore } from 'src/stores/common/module.store'
import {
  filterModerableItems,
  hasAdminRights,
  needsModeration,
  randomID,
} from 'src/utils/helpers'

const COLLECTION_NAME = 'research'

export class ResearchStore extends ModuleStore {
  @observable public allResearchItems: IResearch.ItemDB[] = []
  @observable public activeResearchItem: IResearch.ItemDB | undefined
  @observable
  public researchUploadStatus: IResearchUploadStatus = getInitialResearchUploadStatus()
  @observable
  public updateUploadStatus: IUpdateUploadStatus = getInitialUpdateUploadStatus()

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
  }
  @computed get filteredResearches() {
    return filterModerableItems(this.allResearchItems, this.activeUser)
  }

  public async setActiveResearchItem(slug?: string) {
    if (slug) {
      const collection = await this.db
        .collection<IResearch.ItemDB>(COLLECTION_NAME)
        .getWhere('slug', '==', slug)
      const researchItem = collection.length > 0 ? collection[0] : undefined
      runInAction(() => {
        this.activeResearchItem = researchItem
      })
      return researchItem
    } else {
      runInAction(() => {
        this.activeResearchItem = undefined
      })
    }
  }

  public deleteResearchItem(id: string) {
    this.db
      .collection('research')
      .doc(id)
      .delete()
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

  public async uploadResearch(values: IResearch.FormInput | IResearch.ItemDB) {
    logger.debug('uploading research')
    this.updateResearchUploadStatus('Start')
    // create a reference either to the existing document (if editing) or a new document if creating
    const dbRef = this.db
      .collection<IResearch.Item>(COLLECTION_NAME)
      .doc((values as IResearch.ItemDB)._id)
    const user = this.activeUser as IUser
    const updates = (await dbRef.get())?.updates || [] // save old updates when editing
    try {
      // populate DB
      // define research
      const research: IResearch.Item = {
        ...values,
        _createdBy: values._createdBy ? values._createdBy : user.userName,
        moderation: values.moderation ? values.moderation : 'accepted', // No moderation needed for researches for now
        updates,
      }
      logger.debug('populating database', research)
      // set the database document
      await dbRef.set(research)
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
      throw new Error(error.message)
    }
  }

  public async uploadUpdate(update: IResearch.Update | IResearch.UpdateDB) {
    // uploads new or edits existing update
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
            update.images.filter(img => !!img) as IConvertedFileMeta[],
            COLLECTION_NAME,
            id,
          )
          updateWithMeta.images = imgMeta
        }
        logger.debug('upload images ok')
        this.updateUpdateUploadStatus('Images')

        // populate DB
        const existingUpdateIndex = item.updates.findIndex(
          upd => upd._id === (update as IResearch.UpdateDB)._id,
        )
        const newItem = {
          ...toJS(item),
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
          })
        } else {
          // editing update
          newItem.updates[existingUpdateIndex] = {
            ...(updateWithMeta as IResearch.UpdateDB),
            _modified: new Date().toISOString(),
          }
        }

        logger.debug(
          'old and new modified:',
          (update as IResearch.UpdateDB)._modified,
          newItem._modified,
        )
        logger.debug('created:', newItem._created)

        // set the database document
        await dbRef.set(newItem)
        logger.debug('populate db ok')
        this.updateUpdateUploadStatus('Database')
        const createdItem = (await dbRef.get()) as IResearch.ItemDB
        runInAction(() => {
          this.activeResearchItem = createdItem
        })
        this.updateUpdateUploadStatus('Complete')
      } catch (error) {
        logger.error('error', error)
        throw new Error(error?.message)
      }
    }
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

function getInitialUpdateUploadStatus(): IUpdateUploadStatus {
  return {
    Start: false,
    Images: false,
    Database: false,
    Complete: false,
  }
}

function getInitialResearchUploadStatus(): IResearchUploadStatus {
  return {
    Start: false,
    Database: false,
    Complete: false,
  }
}

/**
 * Export an empty context object to be shared with components
 * The context will be populated with the researchStore in the module index
 * (avoids cyclic deps and ensure shared module ready)
 */
export const ResearchStoreContext = createContext<ResearchStore>(null as any)
export const useResearchStore = () => useContext(ResearchStoreContext)
