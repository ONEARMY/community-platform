import { makeObservable, observable } from 'mobx'
import { createContext, useContext } from 'react'
import { ModuleStore } from 'src/stores/common/module.store'
import { IResearch } from '../../models/research.models'

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
  public async setActiveResearchItem(slug: string) {
    const collection = await this.db
      .collection<IResearch.ItemDB>('research')
      .getWhere('slug', '==', slug)
    const researchItem = collection.length > 0 ? collection[0] : undefined
    this.activeResearchItem = researchItem
  }

  public createResearchItem(item: IResearch.Item) {
    console.log('create research item', this.db)
    this.db
      .collection<IResearch.Item>('research')
      .doc()
      .set(item)
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
