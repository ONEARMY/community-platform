import { observable, action, makeObservable } from 'mobx'
import type {
  IMapPin,
  IMapGrouping,
  IMapPinWithDetail,
  IMapPinDetail,
  IBoundingBox,
} from 'src/models/maps.models'
import type { IDBEndpoint, IModerationStatus } from 'src/models/common.models'
import type { RootStore } from '../index'
import type { Subscription } from 'rxjs'
import { ModuleStore } from '../common/module.store'
import { getUserAvatar } from '../User/user.store'
import { MAP_GROUPINGS } from './maps.groupings'
import type { IUserPP } from 'src/models/userPreciousPlastic.models'
import type { IUploadedFileMeta } from '../storage'
import {
  hasAdminRights,
  needsModeration,
  isAllowedToPin,
} from 'src/utils/helpers'
import { logger } from 'src/logger'
import { filterMapPinsByType } from './filter'

const COLLECTION_NAME: IDBEndpoint = 'mappins'
export class MapsStore extends ModuleStore {
  mapPins$: Subscription
  @observable
  public activePinFilters: Array<IMapGrouping> = []
  @observable
  public activePin: IMapPin | IMapPinWithDetail | undefined = undefined
  @observable
  private mapPins: Array<IMapPin> = []
  @observable
  public filteredPins: Array<IMapPin> = []
  // eslint-disable-next-line
  constructor(rootStore: RootStore) {
    super(rootStore)
    makeObservable(this)
  }

  @action
  private processDBMapPins(pins: IMapPin[]) {
    if (pins.length === 0) {
      this.mapPins = []
      return
    }
    // HACK - CC - 2019/11/04 changed pins api, so any old mappins will break
    // this filters out. In future should run an upgrade script (easier once deployed)
    // HACK - ARH - 2019/12/09 filter unaccepted pins, should be done serverside
    const activeUser = this.activeUser
    const isAdmin = hasAdminRights(activeUser)
    pins = pins
      .filter((p) => {
        const isDeleted = p._deleted || false
        const isPinAccepted = p.moderation === 'accepted'
        const wasCreatedByUser = activeUser && p._id === activeUser.userName
        const isAdminAndAccepted = isAdmin && p.moderation !== 'rejected'
        return (
          p.type &&
          !isDeleted &&
          (isPinAccepted || wasCreatedByUser || isAdminAndAccepted)
        )
      })
      .map((p) => {
        return { ...p, verified: this.userStore.verifiedUsers[p._id] === true }
      })
    this.mapPins = pins
    this.filteredPins = this.mapPins
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  /** TODO CC 2021-05-28 review if still useful to keep */
  @action
  public setMapBoundingBox(boundingBox: IBoundingBox) {
    // this.recalculatePinCounts(boundingBox)
  }
  @action
  public async retrieveMapPins() {
    // TODO: make the function accept a bounding box to reduce load from DB
    /*
       TODO: unaccepted pins should be filtered in DB, before reaching the client
             It would need to modifiy:
              - stream in stores/databaseV2/clients/firestore.tsx
              - streamCollection in stores/databaseV2/clients/firestore.tsx
             to support where clause.
    */
    this.mapPins$ = this.db
      .collection<IMapPin>(COLLECTION_NAME)
      .stream((pins) => {
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

    const mapPins = filterMapPinsByType(this.mapPins, filters)
    this.filteredPins = mapPins
  }

  /**
   * Set the location and id of current active pin, and automatically
   * generate full pin details from database
   * @param pin - map pin meta containing location and id for detail lookup
   * set undefined to remove any active popup
   */
  @action
  public async setActivePin(pin?: IMapPin | IMapPinWithDetail) {
    // HACK - CC - 2021-07-14 ignore hardcoded pin details, should be retrieved
    // from profile on open instead (needs cleaning from DB)
    if (pin && Object.prototype.hasOwnProperty.call(pin, 'detail')) {
      delete pin['detail']
    }
    this.activePin = pin
    if (pin) {
      const pinWithDetail = await this.getPinDetail(pin)
      this.activePin = pinWithDetail
    }
  }
  // call additional action when pin detail received to inform mobx correctly of update
  private async getPinDetail(pin: IMapPin) {
    const detail: IMapPinDetail = await this.getUserProfilePin(pin._id)
    const pinWithDetail: IMapPinWithDetail = { ...pin, detail }
    return pinWithDetail
  }

  // get base pin geo information
  public async getPin(id: string, source: 'server' | 'cache' = 'cache') {
    const pin = await this.db
      .collection<IMapPin>(COLLECTION_NAME)
      .doc(id)
      .get(source)
    logger.debug({ pin }, 'MapsStore.getPin')
    return pin as IMapPin
  }

  public needsModeration(pin: IMapPin) {
    return needsModeration(pin, this.activeUser)
  }
  public canSeePin(pin: IMapPin) {
    return pin.moderation === 'accepted' || isAllowedToPin(pin, this.activeUser)
  }

  public async setUserPin(user: IUserPP) {
    const type = user.profileType || 'member'
    const existingPin = await this.getPin(user.userName, 'server')
    const existingModeration = existingPin?.moderation
    const existingPinType = existingPin?.type

    let moderation: IModerationStatus = existingModeration

    // Member pins do not require moderation.
    if (type === 'member') {
      moderation = 'accepted'
    }

    // Require re-moderation for non-member pins if pin type changes or if pin was not previously accepted.
    if (
      type !== 'member' &&
      (existingModeration !== 'accepted' || existingPinType !== type)
    ) {
      moderation = 'awaiting-moderation'
    }

    const pin: IMapPin = {
      _id: user.userName,
      _deleted: !user.location?.latlng,
      location: user.location!.latlng,
      type,
      moderation,
      verified: user.verified,
    }

    if (type !== 'member' && user.workspaceType) {
      pin.subType = user.workspaceType
    }
    logger.debug('setting user pin', pin)
    await this.db.collection<IMapPin>(COLLECTION_NAME).doc(pin._id).set(pin)
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
        profilePicUrl: '',
        shortDescription: '',
        name: username,
        displayName: username,
        profileUrl: `${window.location.origin}/u/${username}`,
        verifiedBadge: false,
        country: null,
      }
    }
    const avatar = getUserAvatar(username)
    let heroImageUrl = ''
    if (u.coverImages && u.coverImages.length > 0) {
      heroImageUrl = (u.coverImages[0] as IUploadedFileMeta).downloadUrl
    }

    return {
      heroImageUrl,
      profilePicUrl: avatar,
      shortDescription: u.mapPinDescription ? u.mapPinDescription : '',
      name: u.userName,
      displayName: u.displayName,
      profileUrl: `${window.location.origin}/u/${u.userName}`,
      verifiedBadge: !!u.badges?.verified,
      country: u.location?.countryCode || u.country?.toLowerCase() || null,
    }
  }
  @action
  public getPinsNumberByFilterType(filter: Array<string>): number {
    return filterMapPinsByType(this.mapPins, filter).length
  }
}
