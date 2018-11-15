import { observable, action } from 'mobx'

type ISWStatus = 'updated'

export class PlatformStore {
  @observable
  public serviceWorkerStatus: ISWStatus

  @action
  public setServiceWorkerStatus(status: ISWStatus) {
    console.log('sw update received to store')
    this.serviceWorkerStatus = status
  }
}
