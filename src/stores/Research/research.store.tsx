import { makeObservable, observable, toJS } from 'mobx'
import { createContext, useContext } from 'react'
import { ModuleStore } from 'src/stores/common/module.store'
import { IResearch } from '../../models/research.models'

const COLLECTION_NAME = 'research'

export class ResearchStore extends ModuleStore {
  @observable public allResearchItems: IResearch.ItemDB[] = []
  @observable public activeResearchItem: IResearch.ItemDB | undefined

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
}
/**
 * Export an empty context object to be shared with components
 * The context will be populated with the researchStore in the module index
 * (avoids cyclic deps and ensure shared module ready)
 */
export const ResearchStoreContext = createContext<ResearchStore>(null as any)
export const UseResearchStore = () => useContext(ResearchStoreContext)
