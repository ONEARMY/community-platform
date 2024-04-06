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
import { action, computed, makeObservable, observable, toJS } from 'mobx'
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

export class UserStore extends ModuleStore {
  private authUnsubscribe: firebase.default.Unsubscribe
  @observable
  public user: IUserPPDB | null | undefined

  @observable
  public authUser: User | null // TODO: Fix type

  @observable
  public updateStatus: IUserUpdateStatus = getInitialUpdateStatus()

  constructor(rootStore: IRootStore) {
    super(rootStore)
    makeObservable(this)
    this._listenToAuthStateChanges()
    // Update verified users on intial load. use timeout to ensure aggregation store initialised
    setTimeout(() => {
      this.loadUserAggregations()
    }, 50)
  }
  // redirect calls for verifiedUsers to the aggregation store list
  @computed get verifiedUsers(): { [user_id: string]: boolean } {
    return this.aggregationsStore.aggregations.users_verified || {}
  }

  @action
  public getAllUsers() {
    return this.allDocs$
  }

  @action
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

  @action
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
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL: auth.currentUser.photoURL,
      })
      // populate db user profile and resume auth listener
      await this._createUserProfile('registration')
      // when checking auth state change also send confirmation email
      this._listenToAuthStateChanges(true)
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
    const dbRef = this.db.collection<IBadgeUpdate>(COLLECTION_NAME).doc(userId)

    const badgeUpdate = {
      _id: userId,
      badges,
    }

    await dbRef.update(badgeUpdate)
  }

  public async removePatreonConnection(userId: string) {
    await Promise.all([
      this.updateUserBadge(userId, {
        supporter: false,
      }),
      this.db.collection(COLLECTION_NAME).doc(userId).update({
        patreon: null,
      }),
    ])
    await this.refreshActiveUserDetails()
  }

  /**
   * Update a user profile
   * @param values Set of values to merge into user profile
   * @param adminEditableUserId Optionally pass an existing user ID to update with values
   * (default is current logged in user)
   */
  public async updateUserProfile(
    values: Partial<IUserPP> & { _id: string },
    trigger: string,
    adminEditableUserId?: string,
  ) {
    this._setUpdateStatus('Start')
    const dbRef = this.db.collection<IUserPP>(COLLECTION_NAME).doc(values._id)
    const id = dbRef.id

    // If admin updating another user assume full user passed as values, otherwise merge updates with current user.
    // Include a shallow merge of update with existing user, deserialising mobx observables (caused issue previously)
    const updatedUserProfile: IUserPPDB = adminEditableUserId
      ? (values as any)
      : { ...toJS(this.user), ...toJS(values) }

    if (updatedUserProfile.profileType !== 'workspace')
      delete updatedUserProfile['workspaceType']

    // TODO: Remove this once source of duplicate profiles determined
    if (!updatedUserProfile.profileCreationTrigger) {
      updatedUserProfile.profileCreationTrigger = trigger
    }

    // upload any new cover images
    if (values.coverImages) {
      const processedImages = await this.uploadCollectionBatch(
        values.coverImages as IConvertedFileMeta[],
        COLLECTION_NAME,
        id,
      )
      updatedUserProfile.coverImages = processedImages
    }

    // retrieve location data and replace existing with detailed OSM info
    if (
      updatedUserProfile.location?.latlng &&
      Object.keys(updatedUserProfile.location).length == 1
    ) {
      updatedUserProfile.location = await getLocationData(
        updatedUserProfile.location.latlng,
      )
    }

    // update on db and update locally (if targeting self as user)
    await this.db
      .collection(COLLECTION_NAME)
      .doc(updatedUserProfile._id)
      .update(updatedUserProfile)

    if (!adminEditableUserId) {
      this._updateActiveUser(updatedUserProfile)
    }

    // Update user map pin
    // TODO - pattern back and forth from user to map not ideal
    // should try to refactor and possibly generate map pins in backend
    if (values.location) {
      await this.mapsStore.setUserPin(updatedUserProfile)
    }
    this._setUpdateStatus('Complete')
  }

  @action
  public async updateUserImpact(
    fields: IImpactYearFieldList,
    year: IImpactYear,
  ) {
    const user = this.activeUser

    if (!user) {
      throw new Error('User not found')
    }

    await this.db
      .collection(COLLECTION_NAME)
      .doc(user._id)
      .update({ [`impact.${year}`]: fields })

    await this.refreshActiveUserDetails()
  }

  public async unsubscribeUser(unsubscribeToken: string) {
    const [user] = await this.db
      .collection(COLLECTION_NAME)
      .getWhere('unsubscribeToken', '==', unsubscribeToken)

    if (!user) {
      throw new Error('User not found')
    }

    await this.db
      .collection(COLLECTION_NAME)
      .doc(user._id)
      .update({
        _id: user._id,
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

  @action
  public async loadUserAggregations() {
    this.aggregationsStore.updateAggregation('users_verified')
    this.aggregationsStore.updateAggregation('users_totalUseful')
  }


        await dbRef.update(notificationUpdate)
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  // handle user sign in, when firebase authenticates want to also fetch user document from the database
  private async _userSignedIn(
    user: IFirebaseUser | null,
    newUserCreated = false,
  ) {
    if (user) {
      logger.debug('user signed in', user)
      // legacy user formats did not save names so get profile via email - this option be removed in later version
      // (assumes migration strategy and check)
      const userMeta = await this.getUserProfile(user.uid)

      if (userMeta) {
        this._updateActiveUser(userMeta)
        logger.debug('userMeta', userMeta)

        // Update last active for user
        await this.db
          .collection<IUserPP>(COLLECTION_NAME)
          .doc(userMeta._id)
          .update({ ...userMeta, _lastActive: new Date().toISOString() })
      } else {
        await this._createUserProfile('sign-in')
        // now that a profile has been created, run this function again (use `newUserCreated` to avoid inf. loop in case not create not working correctly)
        if (!newUserCreated) {
          return this._userSignedIn(user, true)
        }
        // throw new Error(
        //   `could not find user profile [${user.uid} - ${user.email} - ${user.metadata}]`,
        // )
      }
    }
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
        this._userSignedIn(authUser)
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

  private _unsubscribeFromAuthStateChanges() {
    this.authUnsubscribe()
  }

  /**
   * Do not use.
   * This exists for testing purposes only.
   */
  public _testSetUser(user: IUserPPDB) {
    this.user = user
  }

  @action
  private _setUpdateStatus(update: keyof IUserUpdateStatus) {
    this.updateStatus[update] = true
  }

  @action
  private _updateActiveUser(user?: IUserPPDB | null) {
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
