import { observable, action } from 'mobx'

type ISWStatus = 'updated' | null

export class PlatformStore {
  @observable
  public serviceWorkerStatus: ISWStatus

  @action
  public setServiceWorkerStatus(status: ISWStatus) {
    console.log('sw update received to store', status)
    this.serviceWorkerStatus = status
  }
}
