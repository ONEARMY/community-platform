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
  IDatabaseMapPin,
  IBoundingBox,
  EntityType,
} from 'src/models/maps.models'
import { generatePinFilters, generatePins } from 'src/mocks/maps.mock'
import { Database, IDBEndpoints } from '../database'
import { IUser } from 'src/models/user.models'
import { UserStore } from '../User/user.store'
import { toDate } from 'src/utils/helpers'

export class MapsStore {
  mapEndpoint: IDBEndpoints = 'mapPinsV1'
  availablePinFilters = generatePinFilters()
  constructor(private userStore: UserStore) {}
  @observable
  public mapBoundingBox: IBoundingBox = {
    topLeft: { lat: -90, lng: -180 },
    bottomRight: { lat: 90, lng: 180 },
  }

  @observable
  public activePinFilters: Array<IPinType> = []

  @observable
  public mapPins: Array<IMapPin> = []

  @action
  private processDBMapPins(pins: IDatabaseMapPin[]) {
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
    Database.getLargeCollection<IDatabaseMapPin>(this.mapEndpoint).subscribe(
      data => {
        console.log('setting pin data', data)
        this.processDBMapPins(data)
      },
    )
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
    const pin = (await Database.getDoc(
      `${this.mapEndpoint}/${id}`,
      'once',
    )) as IDatabaseMapPin
    return pin
  }

  // add new pin or update existing
  public async setPin(pin: Partial<IDatabaseMapPin>) {
    // generate standard doc meta
    const meta = Database.generateDocMeta(this.mapEndpoint, pin._id)
    await Database.setDoc(`${this.mapEndpoint}/${meta._id}`, {
      ...meta,
      ...pin,
    })
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
    const u = (await this.userStore.getUserProfile(username)) as IUser
    console.log('user profile retrieved', u)
    const avatar = await this.userStore.getUserAvatar(u.userName)
    return {
      heroImageUrl: avatar,
      lastActive: toDate(u._lastActive ? u._lastActive : u._modified),
      profilePicUrl: avatar,
      shortDescription: u.about ? u.about : '',
      name: u.userName,
      profileUrl: `${location.origin}/u/${u.userName}`,
    }
  }
}
