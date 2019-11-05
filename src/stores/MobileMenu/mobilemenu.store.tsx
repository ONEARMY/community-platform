import { observable, action } from 'mobx'
import { RootStore } from '..'
import { ModuleStore } from '../common/module.store'

export class MobileMenuStore extends ModuleStore {
  @observable
  public showMobilePanel: boolean

  constructor(rootStore: RootStore) {
    super(rootStore)
  }

  @action
  public toggleMobilePanel() {
    this.showMobilePanel = !this.showMobilePanel
  }
}
