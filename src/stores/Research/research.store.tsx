import { action, makeObservable, observable, toJS } from 'mobx'
import { createContext, useContext } from 'react'
import { IUser } from 'src/models'
import { ModuleStore } from 'src/stores/common/module.store'
import { IResearch } from '../../models/research.models'

const COLLECTION_NAME = 'research'

export class ResearchStore extends ModuleStore {
  @observable public allResearchItems: IResearch.ItemDB[] = []
  @observable public activeResearchItem: IResearch.ItemDB | undefined
  @observable
  public uploadStatus: IResearchUploadStatus = getInitialUploadStatus()

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

  public async setActiveResearchItem(slug?: string) {
    if (slug) {
      const collection = await this.db
        .collection<IResearch.ItemDB>(COLLECTION_NAME)
        .getWhere('slug', '==', slug)
      const researchItem = collection.length > 0 ? collection[0] : undefined
      this.activeResearchItem = researchItem
    } else {
      this.activeResearchItem = undefined
    }
  }

  public createResearchItem(item: IResearch.Item) {
    console.log('create research item', this.db)
    this.db
      .collection<IResearch.Item>(COLLECTION_NAME)
      .doc()
      .set(item)
  }

  public addUpdate(item: IResearch.ItemDB, update: IResearch.Update) {
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

    this.db
      .collection<IResearch.Item>(COLLECTION_NAME)
      .doc(item._id)
      .set(updatedItem)
  }

  public deleteResearchItem(id: string) {
    this.db
      .collection('research')
      .doc(id)
      .delete()
  }

  @action
  public updateUploadStatus(update: keyof IResearchUploadStatus) {
    this.uploadStatus[update] = true
  }

  @action
  public resetUploadStatus() {
    this.uploadStatus = getInitialUploadStatus()
  }

  public async uploadResearch(values: IResearch.FormInput | IResearch.ItemDB) {
    console.log('uploading research')
    this.updateUploadStatus('Start')
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
        updates: (values as IResearch.ItemDB).updates
          ? (values as IResearch.ItemDB).updates
          : [],
      }
      console.log('populating database', research)
      // set the database document
      await dbRef.set(research)
      this.updateUploadStatus('Database')
      console.log('post added')
      this.activeResearchItem = (await dbRef.get()) as IResearch.ItemDB
      // complete
      this.updateUploadStatus('Complete')
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

function getInitialUploadStatus() {
  const status: IResearchUploadStatus = {
    Start: false,
    Database: false,
    Complete: false,
  }
  return status
}

/**
 * Export an empty context object to be shared with components
 * The context will be populated with the researchStore in the module index
 * (avoids cyclic deps and ensure shared module ready)
 */
export const ResearchStoreContext = createContext<ResearchStore>(null as any)
export const useResearchStore = () => useContext(ResearchStoreContext)
