import { observable, computed, action, toJS } from 'mobx'
import {
  insideBoundingBox,
  getBoundingBox,
  createLocation,
  LatLng,
  BoundingBox,
} from 'geolocation-utils'

import {
  IMapPin,
  IPinType,
  IMapPinDetail,
  ILatLng,
  IBoundingBox,
  EntityType,
  IMapPinWithType,
} from 'src/models/maps.models'
import { generatePinFilters, generatePins } from 'src/mocks/maps.mock'
import { IUser } from 'src/models/user.models'
import { IDBEndpoint } from 'src/models/common.models'
import { RootStore } from '..'
import { DatabaseV2 } from '../databaseV2'
import { Subscription } from 'rxjs'

export class MapsStore {
  mapEndpoint: IDBEndpoint = 'v2_mappins'
  availablePinFilters = generatePinFilters()
  db: DatabaseV2
  rootStore: RootStore
  mapPins$: Subscription
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    this.db = rootStore.dbV2
  }
  @observable
  public mapBoundingBox: IBoundingBox = {
    topLeft: { lat: -90, lng: -180 },
    bottomRight: { lat: 90, lng: 180 },
  }

  @observable
  public activePinFilters: Array<IPinType> = []

  @observable
  public mapPins: Array<IMapPinWithType> = []

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

    this.mapPins = pins.map(({ _id, location, pinType }) => ({
      _id,
      location,
      pinType: filterMap[pinType],
    }))
  }

  // Caching pinDetails in a map to reduce database calls. We don't want to cache
  //  this using firebase since this data could change over time
  private pinDetailCache: Map<string, IMapPinDetail> = new Map()
  @observable
  public pinDetail: IMapPinDetail | undefined = undefined

  @action
  public setMapBoundingBox(boundingBox: IBoundingBox) {
    this.mapBoundingBox = boundingBox
    this.recalculatePinCounts()
  }

  @action
  public async retrieveMapPins() {
    // TODO: make the function accept a bounding box to reduce load from DB
    // TODO: stream will force repeated recalculation of all pins on any update,
    // really inefficient, should either remove stream or find way just to process new
    this.mapPins$ = this.db.collection('v2_mappins').stream<IMapPin>(pins => {
      this.processDBMapPins(pins)
    })
  }

  @action
  public async retrievePinFilters() {
    // TODO: get from database
    this.availablePinFilters = await generatePinFilters()
    this.activePinFilters = this.availablePinFilters.map(filter => filter)
  }

  @action
  public async setActivePinFilters(
    grouping: EntityType,
    filters: Array<IPinType>,
  ) {
    const newFilters = this.activePinFilters.filter(
      filter => filter.grouping !== grouping,
    )
    this.activePinFilters = newFilters.concat(filters)
  }

  @action
  public async getPinDetails(pin: IMapPin): Promise<IMapPinDetail> {
    if (!this.pinDetailCache.has(pin._id)) {
      // get from db if not already in cache. note map ids match with user ids
      const pinDetail = await this.getUserProfilePin(pin._id)
      this.pinDetailCache.set(pin._id, { ...pin, ...pinDetail })
      return this.getPinDetails(pin)
    }
    this.pinDetail = this.pinDetailCache.get(pin._id)
    return toJS(this.pinDetail as IMapPinDetail)
  }

  // get base pin geo information
  public async getPin(id: string) {
    const pin = await this.db
      .collection('v2_mappins')
      .doc(id)
      .get()
    return pin as IMapPin
  }

  // add new pin or update existing
  public async setPin(pin: IMapPin) {
    // generate standard doc meta
    console.log('setting pin', pin)
    return this.db
      .collection('v2_mappins')
      .doc(pin._id)
      .set(pin)
  }

  public removeSubscriptions() {
    this.mapPins$.unsubscribe()
  }

  private recalculatePinCounts() {
    const boundingBox = getBoundingBox(
      [
        this.mapBoundingBox.topLeft as LatLng,
        this.mapBoundingBox.bottomRight as LatLng,
      ],
      0,
    )

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
    const u = (await this.rootStore.stores.userStore.getUserProfile(
      username,
    )) as IUser
    console.log('user profile retrieved', u)
    const avatar = await this.rootStore.stores.userStore.getUserAvatar(
      u.userName,
    )
    return {
      heroImageUrl: avatar,
      lastActive: u._lastActive ? u._lastActive : u._modified,
      profilePicUrl: avatar,
      shortDescription: u.about ? u.about : '',
      name: u.userName,
      profileUrl: `${location.origin}/u/${u.userName}`,
    }
  }
}
