import { observable, action } from 'mobx'

/*
The platform store handles information related to the platform, such as update
status of service workers
*/

type ISWStatus = 'updated' | null

export class PlatformStore {
  @observable
  public serviceWorkerStatus: ISWStatus

  @action
  public setServiceWorkerStatus(status: ISWStatus) {
    this.serviceWorkerStatus = status
  }
}
