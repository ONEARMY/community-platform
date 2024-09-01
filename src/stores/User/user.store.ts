import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateEmail,
  updatePassword,
  updateProfile,
} from 'firebase/auth'
import { uniqBy } from 'lodash'
import { action, makeObservable, observable, toJS } from 'mobx'
import { EmailNotificationFrequency, IModerationStatus } from 'oa-shared'

import { logger } from '../../logger'
import { auth, EmailAuthProvider } from '../../utils/firebase'
import { getLocationData } from '../../utils/getLocationData'
import { formatLowerNoSpecial } from '../../utils/helpers'
import { ModuleStore } from '../common/module.store'
import { Storage } from '../storage'

import type { User } from 'firebase/auth'
import type {
  IImpactYear,
  IImpactYearFieldList,
  IUser,
  IUserBadges,
} from 'src/models/user.models'
import type { IUserPP, IUserPPDB } from 'src/models/userPreciousPlastic.models'
import type { IFirebaseUser } from 'src/utils/firebase'
import type { IConvertedFileMeta } from '../../types'
import type { IRootStore } from '../RootStore'
/*
The user store listens to login events through the firebase api and exposes logged in user information via an observer.
*/

export const COLLECTION_NAME = 'users'

type PartialUser = Partial<IUserPPDB>

export class UserStore extends ModuleStore {
  private authUnsubscribe: firebase.default.Unsubscribe

  public user: IUserPPDB | null | undefined = null
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
    this._listenToAuthStateChanges()
  }

  public async getUsersStartingWith(prefix: string, limit?: number) {
    // getWhere with the '>=' operator will return every userName that is lexicographically greater than prefix, so adding filter to avoid getting not relvant userNames
    const users: IUserPP[] = await this.db
      .collection<IUserPP>(COLLECTION_NAME)
      .getWhere('userName', '>=', prefix, limit)
    const uniqueUsers: IUserPP[] = uniqBy(
      users.filter((user) => user.userName?.startsWith(prefix)),
      (user) => user.userName,
    )
    return uniqueUsers
  }

  public setUpdateStatus(update: keyof IUserUpdateStatus) {
    this.updateStatus[update] = true
  }

  // when registering a new user create firebase auth profile as well as database user profile
  public async registerNewUser(
    email: string,
    password: string,
    displayName: string,
  ) {
    // stop auto detect of login as will pick up with incomplete information during registration
    this._unsubscribeFromAuthStateChanges()
    await createUserWithEmailAndPassword(auth, email, password)
    // once registered populate auth profile displayname with the chosen username
    if (auth?.currentUser) {
      await this.safeUpdateProfile(auth.currentUser, displayName)
      // populate db user profile and resume auth listener
      await this._createUserProfile('registration')
      // when checking auth state change also send confirmation email
      this._listenToAuthStateChanges(true)
    }
  }

  private async safeUpdateProfile(currentUser: User, displayName: string) {
    // It should be possible to pass photoURL as null to updateProfile
    // but the emulator counts this as an error:
    //   auth/invalid-json-payload-received.-/photourl-must-be-string
    //
    // source: https://github.com/firebase/firebase-tools/issues/6424
    if (currentUser.photoURL === null) {
      await updateProfile(currentUser, {
        displayName,
      })
    } else {
      await updateProfile(currentUser, {
        displayName,
        photoURL: currentUser.photoURL,
      })
    }
  }

  public async login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  public async getUserByUsername(username: string): Promise<IUserPPDB | null> {
    const [user] = await this.db
      .collection<IUserPP>(COLLECTION_NAME)
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
      .collection<IUserPP>(COLLECTION_NAME)
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
      .collection<IUserPP>(COLLECTION_NAME)
      .getWhere('_id', '==', _authID)

    return lookup2[0]
  }

  public async getUserCreatedDocs(userID: string) {
    const howtos = await this.db
      .collection('howtos')
      .getWhere('_createdBy', '==', userID)
    const research = await this.db
      .collection('research')
      .getWhere('_createdBy', '==', userID)
    const researchCollaborated = await this.db
      .collection('research')
      .getWhere('collaborators', 'array-contains', userID)
    const researchCombined = [...research, ...researchCollaborated]

    const howtosFiltered = howtos.filter(
      (doc) => doc.moderation === IModerationStatus.ACCEPTED,
    )
    const researchFiltered = researchCombined.filter(
      (doc) => doc.moderation === IModerationStatus.ACCEPTED,
    )

    return {
      howtos: howtosFiltered,
      research: researchFiltered,
    }
  }

  public async updateUserBadge(userId: string, badges: IUserBadges) {
    await this._updateUserRequest(userId, { badges })
  }

  public async removePatreonConnection(userId: string) {
    await this._updateUserRequest(userId, {
      badges: { supporter: false },
      patreon: null,
    })
    await this.refreshActiveUserDetails()
  }

  public async updateUserProfile(values: PartialUser, trigger: string) {
    const { _id, coverImages, userImage } = values

    if (!_id) throw new Error(`User not found`)
    if (_id !== this.activeUser?._id) {
      throw new Error(`Cannot update a different user record - ${{ _id: _id }}`)
    }

    const updatedUserProfile = toJS(values)
    updatedUserProfile.profileCreationTrigger = trigger

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
      .collection<IUserPP>(COLLECTION_NAME)
      .doc(this.activeUser._id)
      .get('server')

    this._updateActiveUser(user)
  }

  public async sendEmailVerification() {
    logger.info('sendEmailVerification', { authCurrentUser: auth.currentUser })
    if (auth.currentUser) {
      return sendEmailVerification(auth.currentUser)
    }
  }

  public async getUserEmail() {
    const user = this.authUser as firebase.default.User
    return user.email as string
  }

  public async getUserEmailIsVerified() {
    if (!this.authUser) return
    return this.authUser.emailVerified
  }

  public async changeUserPassword(oldPassword: string, newPassword: string) {
    if (!this.authUser) return

    const user = this.authUser as firebase.default.User
    const credentials = EmailAuthProvider.credential(
      user.email as string,
      oldPassword,
    )
    await reauthenticateWithCredential(user, credentials)
    return updatePassword(user, newPassword)
  }

  public async changeUserEmail(password: string, newEmail: string) {
    if (!this.authUser) return

    const user = this.authUser as firebase.default.User
    const credentials = EmailAuthProvider.credential(
      user.email as string,
      password,
    )
    await reauthenticateWithCredential(user, credentials)
    await updateEmail(user, newEmail)
    return this.sendEmailVerification()
  }

  public async sendPasswordResetEmail(email: string) {
    return sendPasswordResetEmail(auth, email)
  }

  public async logout() {
    return auth.signOut()
  }

  public async deleteUser(reauthPw: string) {
    // as delete operation is sensitive requires user to revalidate credentials first
    const authUser = auth.currentUser as firebase.default.User
    const credential = EmailAuthProvider.credential(
      authUser.email as string,
      reauthPw,
    )
    await authUser.reauthenticateWithCredential(credential)
    const user = this.user as IUser
    await this.db.collection(COLLECTION_NAME).doc(user.userName).delete()
    await authUser.delete()
    // TODO - delete user avatar
    // TODO - show deleted notification
    // TODO show notification if invalid credential
  }

  // handle user sign in, when firebase authenticates want to also fetch user document from the database
  private async _userSignedIn(user: IFirebaseUser | null) {
    if (!user) return null

    // legacy user formats did not save names so get profile via email - this option be removed in later version
    // (assumes migration strategy and check)
    const userMeta = await this.getUserProfile(user.uid)
    if (!userMeta) return

    this._updateActiveUser(userMeta)
    logger.debug('user signed in', user)

    await this._updateUserRequest(userMeta._id, {})
    return userMeta
  }

  private async _createUserProfile(trigger: string) {
    const authUser = auth.currentUser as firebase.default.User
    const displayName = authUser.displayName as string
    const userName = formatLowerNoSpecial(displayName)
    const dbRef = this.db.collection<IUser>(COLLECTION_NAME).doc(userName)

    if (userName === authUser.uid) {
      logger.error(
        'attempted to create duplicate user record with authId',
        userName,
      )
      throw new Error('attempted to create duplicate user')
    }

    logger.debug('creating user profile', userName)
    if (!userName) {
      throw new Error('No Username Provided')
    }
    const user: IUser = {
      coverImages: [],
      links: [],
      moderation: IModerationStatus.AWAITING_MODERATION,
      verified: false,
      _authID: authUser.uid,
      displayName,
      userName,
      notifications: [],
      profileCreated: new Date().toISOString(),
      profileCreationTrigger: trigger,
      notification_settings: {
        emailFrequency: EmailNotificationFrequency.WEEKLY,
      },
    }
    // update db
    await dbRef.set(user)
  }

  // use firebase auth to listen to change to signed in user
  // on sign in want to load user profile
  // strange implementation return the unsubscribe object on subscription, so stored
  // to authUnsubscribe variable for use later
  private _listenToAuthStateChanges(checkEmailVerification = false) {
    this.authUnsubscribe = onAuthStateChanged(auth, (authUser) => {
      this.authUser = authUser
      if (authUser) {
        this._userSignedIn(authUser as firebase.default.User)
        // send verification email if not verified and after first sign-up only
        if (!authUser.emailVerified && checkEmailVerification) {
          this.sendEmailVerification()
        }
      } else {
        // Explicitly update user to null when logged out
        this._updateActiveUser(null)
      }
    })
  }

  private async _updateUserRequest(userId: string, updateFields: PartialUser) {
    const _lastActive = new Date().toISOString()

    return await this.db
      .collection<PartialUser>(COLLECTION_NAME)
      .doc(userId)
      .update({
        _lastActive,
        ...updateFields,
      })
  }

  private _unsubscribeFromAuthStateChanges() {
    this.authUnsubscribe()
  }

  public _updateActiveUser(user?: IUserPPDB | null) {
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
