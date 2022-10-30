import { observable, action, makeObservable } from 'mobx'
import type { RootStore } from '..'

/*
The platform store handles information related to the platform, such as update
status of service workers
*/

type ISWStatus = 'updated' | 'success' | null

export class PlatformStore {
  @observable
  public serviceWorkerStatus: ISWStatus
  @observable
  public registration: ServiceWorkerRegistration
  // eslint-disable-next-line
  constructor(rootStore: RootStore) {
    makeObservable(this)
  }

  @action
  public setServiceWorkerStatus(
    status: ISWStatus,
    registration: ServiceWorkerRegistration,
  ) {
    this.serviceWorkerStatus = status
    this.registration = registration
  }
}
