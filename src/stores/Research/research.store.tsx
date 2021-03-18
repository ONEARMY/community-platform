import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
  toJS,
} from 'mobx'
import { createContext, useContext } from 'react'
import { IUser } from 'src/models'
import { ModuleStore } from 'src/stores/common/module.store'
import { IResearch } from '../../models/research.models'
import { filterModerableItems } from '../../utils/helpers'

const COLLECTION_NAME = 'research'

export class ResearchStore extends ModuleStore {
  @observable public allResearchItems: IResearch.ItemDB[] = []
  @observable public activeResearchItem: IResearch.ItemDB | undefined
  @observable
  public researchUploadStatus: IResearchUploadStatus = getInitialResearchUploadStatus()
  public updateUploadStatus: IUpdateUploadStatus = getInitialUpdateUploadStatus()

  constructor() {
    super(null as any, 'research')
    makeObservable(this)

    this.allDocs$.subscribe((docs: IResearch.ItemDB[]) => {
      console.log('docs', docs)
      this.allResearchItems = docs.sort((a, b) =>
        a._created < b._created ? 1 : -1,
      )
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

  public createResearchItem(item: IResearch.Item) {
    console.log('create research item', this.db)
    this.db
      .collection<IResearch.Item>(COLLECTION_NAME)
      .doc()
      .set(item)
  }

  public async addUpdate(update: IResearch.Update) {
    const item = this.activeResearchItem
    if (item) {
      const updatedItem = {
        ...toJS(item),
        updates: [
          ...toJS(item.updates),
          {
            ...update,
            // TODO - insert metadata into the new update
            _id: Math.random().toString(),
            _created: new Date().toISOString(),
            _modified: new Date().toISOString(),
          },
        ],
      }

      await this.db
        .collection<IResearch.Item>(COLLECTION_NAME)
        .doc(item._id)
        .set(updatedItem)
    }
  }

  public deleteResearchItem(id: string) {
    this.db
      .collection('research')
      .doc(id)
      .delete()
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
      this.activeResearchItem = (await dbRef.get()) as IResearch.ItemDB
      // complete
      this.updateResearchUploadStatus('Complete')
    } catch (error) {
      console.log('error', error)
      throw new Error(error.message)
    }
  }
}

interface IResearchUploadStatus {
  Start: boolean
  Database: boolean
  Complete: boolean
}

interface IUpdateUploadStatus {
  Start: boolean
  Files: boolean
  Database: boolean
  Complete: boolean
}

function getInitialUpdateUploadStatus(): IUpdateUploadStatus {
  return {
    Start: false,
    Files: false,
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
