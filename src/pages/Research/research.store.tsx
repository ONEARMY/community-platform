import { observable, makeObservable } from 'mobx'
import { IResearch } from './research.models'
import { ModuleStore } from 'src/stores/common/module.store'
import { createContext, useContext } from 'react'

export class ResearchStore extends ModuleStore {
  @observable public activeResearchItem: IResearch.ItemDB | undefined
  @observable public allResearchItems: IResearch.ItemDB[] = []

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
