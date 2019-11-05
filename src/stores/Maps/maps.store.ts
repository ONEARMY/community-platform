import { observable, action } from 'mobx'
import {
  IMapPin,
  IBoundingBox,
  IMapGrouping,
  IMapPinWithDetail,
  IMapPinDetail,
} from 'src/models/maps.models'
import { IDBEndpoint } from 'src/models/common.models'
import { RootStore } from '..'
import { Subscription } from 'rxjs'
import { ModuleStore } from '../common/module.store'
import { getUserAvatar } from '../User/user.store'
import { MAP_GROUPINGS } from './maps.groupings'
import { generatePins, generatePinDetails } from 'src/mocks/maps.mock'
import { IUserPP } from 'src/models/user_pp.models'
import { IUploadedFileMeta } from '../storage'

// NOTE - toggle below variable to use larger mock dataset
const IS_MOCK = false
const MOCK_PINS = generatePins(250)

export class MapsStore extends ModuleStore {
  mapEndpoint: IDBEndpoint = 'v2_mappins'
  mapPins$: Subscription
  constructor(rootStore: RootStore) {
    super(rootStore)
  }

  @observable
  public activePinFilters: Array<IMapGrouping> = []

  @observable
  public activePin: IMapPin | IMapPinWithDetail | undefined = undefined

  @observable
  private mapPins: Array<IMapPin> = []

  @observable
  public filteredPins: Array<IMapPin> = []

  @action
  private processDBMapPins(pins: IMapPin[]) {
    if (pins.length === 0) {
      this.mapPins = []
      return
    }
    // HACK - CC - 2019/11/04 changed pins api, so any old mappins will break
    // this filters out. In future should run an upgrade script (easier once deployed)
    pins = pins.filter(p => {
      return p.type
    })

    if (IS_MOCK) {
      pins = MOCK_PINS
    }
    this.mapPins = pins
    this.filteredPins = this.mapPins
  }

  @action
  public setMapBoundingBox(boundingBox: IBoundingBox) {
    // this.recalculatePinCounts(boundingBox)
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
    this.activePinFilters = MAP_GROUPINGS
  }

  @action
  public async setActivePinFilters(filters: Array<string>) {
    if (filters.length === 0) {
      this.filteredPins = this.mapPins
      return
    }

    // filter pins to include matched pin type or subtype
    const mapPins = this.mapPins.filter(pin => {
      return pin.subType
        ? filters.includes(pin.subType)
        : filters.includes(pin.type)
    })
    this.filteredPins = mapPins
  }

  /**
   * Set the location and id of current active pin, and automatically
   * generate full pin details from database
   * @param pin - map pin meta containing location and id for detail lookup
   * set undefined to remove any active popup
   */
  @action
  public async setActivePin(pin?: IMapPin) {
    this.activePin = pin
    if (pin) {
      const detail: IMapPinDetail = IS_MOCK
        ? generatePinDetails(pin)
        : await this.getUserProfilePin(pin._id)
      this.activePin = { ...pin, detail }
    }
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
    return this.db
      .collection('v2_mappins')
      .doc(pin._id)
      .set(pin)
  }

  public async setUserPin(user: IUserPP) {
    const pin: IMapPin = {
      _id: user.userName,
      location: user.location!.latlng,
      type: user.profileType ? user.profileType : 'member',
    }
    if (user.workspaceType) {
      pin.subType = user.workspaceType
    }
    console.log('setting user pin', pin)
    await this.db
      .collection<IMapPin>('v2_mappins')
      .doc(pin._id)
      .set(pin)
  }

  public removeSubscriptions() {
    if (this.mapPins$) {
      this.mapPins$.unsubscribe()
    }
  }

  // return subset of profile info used when displaying map pins
  private async getUserProfilePin(username: string): Promise<IMapPinDetail> {
    const u = await this.userStore.getUserProfile(username)
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
      heroImageUrl = (u.coverImages[0] as IUploadedFileMeta).downloadUrl
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

/**********************************************************************************
 *  Deprecated - CC - 2019/11/04
 *
 * The code below was previously used to help calculate the number of pins currently
 * within view, however not fully implemented. It is retained in case this behaviour
 * is wanted in the future
 *********************************************************************************/

// private recalculatePinCounts(boundingBox: BoundingBox) {
//   const pinTypeMap = this.availablePinFilters.reduce(
//     (accumulator, current) => {
//       current.count = 0
//       if (accumulator[current.type] === undefined) {
//         accumulator[current.type] = current
//       }
//       return accumulator
//     },
//     {} as Record<string, IPinType>,
//   )

//   this.mapPins.forEach(pin => {
//     if (insideBoundingBox(pin.location as LatLng, boundingBox)) {
//       pinTypeMap[pin.type].count++
//     }
//   })
// }
