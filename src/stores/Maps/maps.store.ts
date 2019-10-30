import { observable, action, toJS } from 'mobx'
import { insideBoundingBox, LatLng, BoundingBox } from 'geolocation-utils'

import {
  IMapPin,
  IPinType,
  IMapPinDetail,
  IBoundingBox,
  IMapPinWithType,
  IPinGrouping,
} from 'src/models/maps.models'
import { IDBEndpoint } from 'src/models/common.models'
import { RootStore } from '..'
import { Subscription } from 'rxjs'
import { ModuleStore } from '../common/module.store'
import { getUserAvatar } from '../User/user.store'
import { MAP_GROUPINGS } from './maps.groupings'
import { generatePins } from 'src/mocks/maps.mock'

// TODO - remove mock pins from store once integration complete
const MOCK_PINS = generatePins(250)

export class MapsStore extends ModuleStore {
  mapEndpoint: IDBEndpoint = 'v2_mappins'
  availablePinFilters = MAP_GROUPINGS
  mapPins$: Subscription
  constructor(rootStore: RootStore) {
    super(rootStore)
  }

  @observable
  public activePinFilters: Array<IPinType> = []

  @observable
  private mapPins: Array<IMapPinWithType> = []

  @observable
  public filteredPins: Array<IMapPinWithType> = []

  @action
  private processDBMapPins(pins: IMapPin[]) {
    if (pins.length === 0 || this.availablePinFilters.length === 0) {
      this.mapPins = []
      return
    }
    const filterMap = this.availablePinFilters.reduce(
      (accumulator, current) => {
        accumulator[current.name] = current
        return accumulator
      },
      {} as Record<string, IPinType>,
    )

    // TODO - remove mock pins when integrated
    pins = [...MOCK_PINS, ...pins]

    this.mapPins = pins.map(
      ({ _id, location, pinType, profileType, workspaceType }) => ({
        _id,
        location,
        pinType: filterMap[pinType],
        profileType,
        workspaceType,
      }),
    )

    this.filteredPins = this.mapPins
  }

  // Caching pinDetails in a map to reduce database calls. We don't want to cache
  //  this using firebase since this data could change over time
  private pinDetailCache: Map<string, IMapPinDetail> = new Map()
  @observable
  public pinDetail: IMapPinDetail | undefined = undefined

  @action
  public setMapBoundingBox(boundingBox: IBoundingBox) {
    this.recalculatePinCounts(boundingBox)
  }

  @action
  public async retrieveMapPins() {
    // TODO: make the function accept a bounding box to reduce load from DB
    this.mapPins$ = this.db.collection<IMapPin>('v2_mappins').stream(pins => {
      // TODO - make more efficient by tracking only new pins received and updating
      if (pins.length !== this.mapPins.length) {
        this.processDBMapPins(pins)
      }
    })
  }

  @action
  public async retrievePinFilters() {
    // TODO: get from database
    this.availablePinFilters = MAP_GROUPINGS
    this.activePinFilters = this.availablePinFilters.map(filter => filter)
  }

  @action
  public async setActivePinFilters(
    grouping: IPinGrouping,
    filters: Array<any>,
  ) {
    if (filters.length === 0) {
      this.filteredPins = this.mapPins
      return
    }

    const mapPins = this.mapPins.filter(pin => {
      if (pin.workspaceType && filters.indexOf(pin.workspaceType) > -1) {
        return true
      }

      if (pin.pinType.name && filters.indexOf(pin.pinType.name) > -1) {
        return true
      }

      return false
    })

    this.filteredPins = mapPins
  }

  @action
  public async getPinDetails(pin: IMapPin): Promise<IMapPinDetail> {
    if (!this.pinDetailCache.has(pin._id)) {
      // get from db if not already in cache. note map ids match with user ids
      const pinDetail = await this.getUserProfilePin(pin._id)
      this.pinDetailCache.set(pin._id, { ...pin, ...pinDetail })
      const foundPinDetails = this.getPinDetails(pin)
      return foundPinDetails
    }
    this.pinDetail = this.pinDetailCache.get(pin._id)
    console.log('pin detail', toJS(this.pinDetail))
    return toJS(this.pinDetail as IMapPinDetail)
  }

  // get base pin geo information
  public async getPin(id: string) {
    const pin = await this.db
      .collection<IMapPin>('v2_mappins')
      .doc(id)
      .get()
    return pin as IMapPin
  }

  // add new pin or update existing
  public async setPin(pin: IMapPin) {
    // generate standard doc meta
    console.debug('setting pin', pin)
    return this.db
      .collection('v2_mappins')
      .doc(pin._id)
      .set(pin)
  }

  public removeSubscriptions() {
    if (this.mapPins$) {
      this.mapPins$.unsubscribe()
    }
  }

  private recalculatePinCounts(boundingBox: BoundingBox) {
    const pinTypeMap = this.availablePinFilters.reduce(
      (accumulator, current) => {
        current.count = 0
        if (accumulator[current.name] === undefined) {
          accumulator[current.name] = current
        }
        return accumulator
      },
      {} as Record<string, IPinType>,
    )

    this.mapPins.forEach(pin => {
      if (insideBoundingBox(pin.location as LatLng, boundingBox)) {
        pinTypeMap[pin.pinType.name].count++
      }
    })
  }

  // return subset of profile info used when displaying map pins
  private async getUserProfilePin(username: string) {
    const u: any = await this.userStore.getUserProfile(username)
    if (!u) {
      return {
        heroImageUrl: '',
        lastActive: '',
        profilePicUrl: '',
        shortDescription: '',
        name: username,
        profileUrl: `${location.origin}/u/${username}`,
      }
    }
    const avatar = getUserAvatar(username)
    let heroImageUrl = ''
    if (u.coverImages && u.coverImages.length > 0) {
      heroImageUrl = u.coverImages[0].downloadUrl
    }

    return {
      heroImageUrl,
      lastActive: u._lastActive ? u._lastActive : u._modified,
      profilePicUrl: avatar,
      shortDescription: u.about ? u.about : '',
      name: u.userName,
      profileUrl: `${location.origin}/u/${u.userName}`,
    }
  }
}
