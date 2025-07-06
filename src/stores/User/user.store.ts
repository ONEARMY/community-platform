import pkg from 'countries-list'
import lodash from 'lodash'
import { action, makeObservable, observable, toJS } from 'mobx'
import { EmailNotificationFrequency } from 'oa-shared'

import { logger } from '../../logger'
import { getLocationData } from '../../utils/getLocationData'
import { ModuleStore } from '../common/module.store'
import { Storage } from '../storage'

import type { User } from 'firebase/auth'
import type {
  IConvertedFileMeta,
  IImpactYear,
  IImpactYearFieldList,
  IUser,
  IUserBadges,
  IUserDB,
} from 'oa-shared'
import type { IRootStore } from '../RootStore'
/*
The user store listens to login events through the firebase api and exposes logged in user information via an observer.
*/

export const COLLECTION_NAME = 'users'

const { countries } = pkg

type PartialUser = Partial<IUserDB>

export class UserStore extends ModuleStore {
  public user: IUserDB | null | undefined = null
  public authUser: User | null = null // TODO: Fix type
  public updateStatus: IUserUpdateStatus = getInitialUpdateStatus()

  constructor(rootStore: IRootStore) {
    super(rootStore)
    makeObservable(this, {
      authUser: observable,
      deleteUserLocation: action,
      user: observable,
      updateStatus: observable,
      getUsersStartingWith: action,
      setUpdateStatus: action,
      updateUserImpact: action,
      _updateActiveUser: action,
    })
  }

  public async getUsersStartingWith(prefix: string, limit?: number) {
    // getWhere with the '>=' operator will return every userName that is lexicographically greater than prefix, so adding filter to avoid getting not relevant userNames
    const users: IUser[] = await this.db
      .collection<IUser>(COLLECTION_NAME)
      .getWhere('userName', '>=', prefix, limit)
    const uniqueUsers: IUser[] = lodash.uniqBy(
      users.filter((user) => user.userName?.startsWith(prefix)),
      (user) => user.userName,
    )
    return uniqueUsers
  }

  public setUpdateStatus(update: keyof IUserUpdateStatus) {
    this.updateStatus[update] = true
  }

  public async getUserByUsername(username: string): Promise<IUserDB | null> {
    const [user] = await this.db
      .collection<IUser>(COLLECTION_NAME)
      .getWhere('_id', '==', username)
    return user || null
  }

  // TODO
  // this is a bit messy due to legacy users having mismatched firebase data and ids
  // should resolve all users so that a single lookup is successful
  // to fix a script should be run to update all firebase_auth display names to correct format
  // which could then be used as a single lookup
  public async getUserProfile(_authID: string) {
    const lookup = await this.db
      .collection<IUser>(COLLECTION_NAME)
      .getWhere('_authID', '==', _authID)

    if (lookup.length === 1) {
      return lookup[0]
    }

    if (lookup.length > 1) {
      logger.warn(
        'Multiple user records fetched',
        lookup && lookup.map((u) => ({ _id: u._id })),
      )
      return lookup.filter((user) => user._id !== user._authID)[0]
    }

    const lookup2 = await this.db
      .collection<IUser>(COLLECTION_NAME)
      .getWhere('_id', '==', _authID)

    return lookup2[0]
  }

  public async updateUserBadge(userId: string, badges: IUserBadges) {
    await this._updateUserRequest(userId, { badges })
  }

  public async updateUserProfile(values: PartialUser, trigger: string) {
    const { _id, coverImages, location, userImage } = values

    if (!_id) throw new Error(`User not found`)
    if (_id !== this.activeUser?._id) {
      throw new Error(`Cannot update a different user record - ${{ _id: _id }}`)
    }

    const updatedUserProfile = toJS(values)
    updatedUserProfile.profileCreationTrigger = trigger
    updatedUserProfile.openToVisitors = values.openToVisitors || null

    if (coverImages) {
      updatedUserProfile.coverImages = await this.uploadCollectionBatch(
        coverImages as any as IConvertedFileMeta[],
        COLLECTION_NAME,
        _id,
      )
    }

    if (userImage) {
      updatedUserProfile.userImage = await this.uploadFileToCollection(
        userImage,
        COLLECTION_NAME,
        _id,
      )
    }

    if (location?.country) {
      const countryCode = Object.keys(countries).find(
        (key) => countries[key].name === location.country,
      )
      updatedUserProfile.location = {
        ...location,
        countryCode: countryCode || '',
      }
    }

    await this._updateUserRequest(_id, updatedUserProfile)
    await this.refreshActiveUserDetails()
    return this.activeUser
  }

  public async updateUserLocation(user: PartialUser) {
    const { _id, location, mapPinDescription } = user

    if (!_id) throw new Error(`User not found`)
    if (_id !== this.activeUser?._id) {
      throw new Error(`Cannot update a different user record - ${{ _id: _id }}`)
    }

    if (!location || (!location.latlng && Object.keys(location).length !== 1)) {
      throw new Error('Location data not found')
    }

    const fullLocationData = await getLocationData(location.latlng)
    await this._updateUserRequest(_id, {
      location: fullLocationData,
      mapPinDescription,
    })
    await this.refreshActiveUserDetails()

    return this.activeUser
  }

  public async updateUserNotificationSettings(user: PartialUser) {
    const { _id, notification_settings } = user

    if (!_id) throw new Error(`User not found`)
    if (_id !== this.activeUser?._id) {
      throw new Error(`Cannot update a different user record - ${{ _id: _id }}`)
    }

    if (!notification_settings) {
      throw new Error('notification_settings not found')
    }

    const unsubscribeToken =
      notification_settings.emailFrequency === EmailNotificationFrequency.NEVER
        ? this.activeUser.unsubscribeToken
        : null

    await this._updateUserRequest(_id, {
      notification_settings,
      unsubscribeToken,
    })
    await this.refreshActiveUserDetails()

    return this.activeUser
  }

  public async deleteUserLocation({ _id }: PartialUser) {
    if (!_id) throw new Error(`User not found`)
    if (_id !== this.activeUser?._id) {
      throw new Error(`Cannot update a different user record - ${{ _id: _id }}`)
    }

    await this._updateUserRequest(_id, {
      location: null,
      mapPinDescription: null,
    })
    await this.refreshActiveUserDetails()
    return this.activeUser
  }

  public async updateUserImpact(
    fields: IImpactYearFieldList,
    year: IImpactYear,
  ) {
    const user = this.activeUser

    if (!user) {
      throw new Error('User not found')
    }

    await this._updateUserRequest(user._id, { [`impact.${year}`]: fields })
    await this.refreshActiveUserDetails()
  }

  public async unsubscribeUser(unsubscribeToken: string) {
    const [user] = await this.db
      .collection(COLLECTION_NAME)
      .getWhere('unsubscribeToken', '==', unsubscribeToken)

    if (!user) {
      throw new Error('User not found')
    }

    await this._updateUserRequest(user._id, {
      notification_settings: {
        emailFrequency: EmailNotificationFrequency.NEVER,
      },
    })
  }

  public async refreshActiveUserDetails() {
    if (!this.activeUser) return

    const user = await this.db
      .collection<IUser>(COLLECTION_NAME)
      .doc(this.activeUser._id)
      .get('server')

    this._updateActiveUser(user)
  }

  public async refreshActiveUserDetailsById(id: string) {
    let user = await this.db
      .collection<IUser>(COLLECTION_NAME)
      .doc(id)
      .get('server')

    // TODO: remove this once profiles are migrated to supabase
    if (!user) {
      await this._createUserProfile(id)

      user = await this.db
        .collection<IUser>(COLLECTION_NAME)
        .doc(id)
        .get('server')
    }

    this._updateActiveUser(user)
  }

  public async getUserEmailIsVerified() {
    if (!this.authUser) return
    return this.authUser.emailVerified
  }

  private async _createUserProfile(userName: string) {
    const dbRef = this.db.collection<IUser>(COLLECTION_NAME).doc(userName)

    logger.debug('creating user profile', userName)
    if (!userName) {
      throw new Error('No Username Provided')
    }
    const user: IUser = {
      coverImages: [],
      verified: false,
      _authID: '',
      displayName: userName,
      userName,
      notifications: [],
      profileCreated: new Date().toISOString(),
      profileCreationTrigger: 'supabase',
      profileType: 'member',
      notification_settings: {
        emailFrequency: EmailNotificationFrequency.WEEKLY,
      },
    }
    // update db
    await dbRef.set(user)
  }

  private async _updateUserRequest(userId: string, updateFields: PartialUser) {
    return await this.db
      .collection<PartialUser>(COLLECTION_NAME)
      .doc(userId)
      .update({
        ...updateFields,
      })
  }

  public _updateActiveUser(user?: IUserDB | null) {
    this.user = user
  }
}

interface IUserUpdateStatus {
  Start: boolean
  Complete: boolean
}

const getInitialUpdateStatus = () => {
  const status: IUserUpdateStatus = {
    Start: false,
    Complete: false,
  }
  return status
}

/***********************************************************************************************
 *    Additional Utils - available without store injection
 **********************************************************************************************/
// take the username and return matching avatar url (includes undefined.jpg match if no user)
export const getUserAvatar = (userName: string | undefined) => {
  return Storage.getPublicDownloadUrl(`avatars/${userName}.jpg`)
}
