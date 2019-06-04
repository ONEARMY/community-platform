import { observable, computed } from 'mobx'
import { ModuleStore } from '../common/module.store'
import { Database } from '../database'
import { IMapPin, INewMapPin } from 'src/models/map.model'

export class MapStore extends ModuleStore {
  // observables are data variables that can be subscribed to and change over time
  @observable
  public allMapPins: IMapPin[]

  constructor() {
    super('mapV1')
    this.allDocs$.subscribe((docs: IMapPin[]) => {
      // pins automatically come in ordered by data modified, reordering by country
      this.allMapPins = [
        ...docs.sort((a, b) =>
          a.location.country > b.location.country ? 1 : -1,
        ),
      ]
    })
  }

  public async addPin(values: INewMapPin) {
    try {
      // populate meta data
      const pin: IMapPin = {
        ...Database.generateDocMeta('mapV1'),
        ...values,
      }
      console.log('populating database', pin)
      await Database.setDoc(`mapV1/${pin._id}`, pin)
      console.log('pin added')
      return pin
    } catch (error) {
      console.log('error', error)
      throw new Error(error.message)
    }
  }
}
