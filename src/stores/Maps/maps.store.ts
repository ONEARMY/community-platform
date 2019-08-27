import { observable, computed, action } from 'mobx'
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
import {
  generatePins,
  generatePinDetails,
  generatePinFilters,
} from 'src/mocks/maps.mock'
import { RootStore } from '..'

export class MapsStore {
  constructor(rootStore: RootStore) {}
  @observable
  public mapBoundingBox: IBoundingBox = {
    topLeft: { lat: -90, lng: -180 },
    bottomRight: { lat: 90, lng: 180 },
  }

  @observable
  public availablePinFilters: Array<IPinType> = []
  @observable
  public activePinFilters: Array<IPinType> = []

  private pinData: Array<IDatabaseMapPin> = []

  @computed
  get mapPins(): Array<IMapPin> {
    // TODO: for some reason it only computes the below when the console is
    // there?
    console.log(this.pinData, this.availablePinFilters)
    if (this.pinData.length === 0 || this.availablePinFilters.length === 0) {
      return []
    }

    const filterMap = this.availablePinFilters.reduce(
      (accumulator, current) => {
        accumulator[current.name] = current
        return accumulator
      },
      {} as Record<string, IPinType>,
    )

    return this.pinData.map(({ id, location, pinType }) => ({
      id,
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
    // TODO: make the database callout instead of random mocks
    this.pinData = await generatePins(10)
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
  public async getPinDetails(pin: IMapPin) {
    const { id } = pin
    if (!this.pinDetailCache.has(id)) {
      // TODO: get from database
      this.pinDetailCache.set(id, generatePinDetails(pin))
    }
    this.pinDetail = this.pinDetailCache.get(id)
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

    this.pinData.forEach(pin => {
      if (insideBoundingBox(pin.location as LatLng, boundingBox)) {
        pinTypeMap[pin.pinType].count++
      }
    })
  }
}
