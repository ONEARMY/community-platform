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
import { IUser } from 'src/models'
import { IResearch } from 'src/models/research.models'
import { ModuleStore } from 'src/stores/common/module.store'
import {
  filterModerableItems,
  hasAdminRights,
  needsModeration,
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

    this.allDocs$.subscribe((docs: IResearch.ItemDB[]) => {
      console.log('docs', docs)
      const sortedItems = docs.sort((a, b) =>
        a._created < b._created ? 1 : -1,
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
    return doc.set(research)
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
    console.log('uploading research')
    this.updateResearchUploadStatus('Start')
    // create a reference either to the existing document (if editing) or a new document if creating
    const dbRef = this.db
      .collection<IResearch.Item>(COLLECTION_NAME)
      .doc((values as IResearch.ItemDB)._id)
    const user = this.activeUser as IUser
    try {
      // populate DB
      // define research
      const research: IResearch.Item = {
        ...values,
        _createdBy: values._createdBy ? values._createdBy : user.userName,
        moderation: values.moderation
          ? values.moderation
          : 'awaiting-moderation',
        updates: [],
      }
      console.log('populating database', research)
      // set the database document
      await dbRef.set(research)
      this.updateResearchUploadStatus('Database')
      console.log('post added')
      const newItem = (await dbRef.get()) as IResearch.ItemDB
      runInAction(() => {
        this.activeResearchItem = newItem
      })
      // complete
      this.updateResearchUploadStatus('Complete')
    } catch (error) {
      console.log('error', error)
      throw new Error(error.message)
    }
  }

  public async addUpdate(update: IResearch.Update) {
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
        const updateWithMeta: IResearch.Update = { ...update }
        if (update.images.length > 0) {
          const imgMeta = await this.uploadCollectionBatch(
            update.images.filter(img => !!img) as IConvertedFileMeta[],
            COLLECTION_NAME,
            id,
          )
          updateWithMeta.images = imgMeta
        }
        console.log('upload images ok')
        this.updateUpdateUploadStatus('Images')
        // populate DB
        const updatedItem = {
          ...toJS(item),
          updates: [
            ...toJS(item.updates),
            {
              ...updateWithMeta,
              // TODO - insert metadata into the new update
              _id: Math.random().toString(),
              _created: new Date().toISOString(),
              _modified: new Date().toISOString(),
            },
          ],
        }
        // set the database document
        await dbRef.set(updatedItem)
        console.log('populate db ok')
        this.updateUpdateUploadStatus('Database')
        const newItem = (await dbRef.get()) as IResearch.ItemDB
        runInAction(() => {
          this.activeResearchItem = newItem
        })
        this.updateUpdateUploadStatus('Complete')
      } catch (error) {
        console.log('error', error)
        throw new Error(error.message)
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
