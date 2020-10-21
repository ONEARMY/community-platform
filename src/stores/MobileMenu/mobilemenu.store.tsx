import { observable, action, makeObservable } from 'mobx'
import { RootStore } from '..'
import { ModuleStore } from '../common/module.store'

export class MobileMenuStore extends ModuleStore {
  @observable
  public showMobilePanel: boolean
  // eslint-disable-next-line
  constructor(rootStore: RootStore) {
    super(rootStore)
    makeObservable(this)
  }

  @action
  public toggleMobilePanel() {
    this.showMobilePanel = !this.showMobilePanel
  }
}
