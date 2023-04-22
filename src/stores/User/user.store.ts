import { action, computed, makeObservable, observable, toJS } from 'mobx'
import { logger } from '../../logger'
import { auth, EmailAuthProvider } from '../../utils/firebase'
import { getLocationData } from '../../utils/getLocationData'
import { formatLowerNoSpecial } from '../../utils/helpers'

import { ModuleStore } from '../common/module.store'
import { Storage } from '../storage'

import type { IUser, IUserBadges, IUserDB } from 'src/models/user.models'
import type { IUserPP, IUserPPDB } from 'src/models/userPreciousPlastic.models'
import type { IFirebaseUser } from 'src/utils/firebase'
import type { RootStore } from '..'
import type { IConvertedFileMeta } from '../../types'
/*
The user store listens to login events through the firebase api and exposes logged in user information via an observer.
*/

export const COLLECTION_NAME = 'users'

export class UserStore extends ModuleStore {
  private authUnsubscribe: firebase.default.Unsubscribe
  @observable
  public user: IUserPPDB | undefined

  @observable
  public authUser: firebase.default.User | null

  @observable
  public updateStatus: IUserUpdateStatus = getInitialUpdateStatus()

  constructor(rootStore: RootStore) {
    super(rootStore)
    makeObservable(this)
    this._listenToAuthStateChanges()
    // Update verified users on intial load. use timeout to ensure aggregation store initialised
    setTimeout(() => {
      this.loadVerifiedUsers()
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
  private updateActiveUser(user?: IUserPPDB) {
    this.user = user
  }

  @action
  public setUpdateStaus(update: keyof IUserUpdateStatus) {
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
    const authReq = await auth.createUserWithEmailAndPassword(email, password)
    // once registered populate auth profile displayname with the chosen username
    if (authReq.user) {
      await authReq.user.updateProfile({
        displayName,
        photoURL: authReq.user.photoURL,
      })
      // populate db user profile and resume auth listener
      await this.createUserProfile()
      // when checking auth state change also send confirmation email
      this._listenToAuthStateChanges(true)
    }
  }

  public getUserNotifications() {
    return (
      this.user?.notifications
        ?.filter((notification) => !notification.read)
        .sort(
          (a, b) =>
            new Date(b._created).getTime() - new Date(a._created).getTime(),
        ) || []
    )
  }

  public async login(provider: string, email: string, password: string) {
    switch (provider) {
      // eslint-disable-next-line
      default:
        return auth.signInWithEmailAndPassword(email, password)
    }
  }

  // handle user sign in, when firebase authenticates wnat to also fetch user document from the database
  public async userSignedIn(
    user: IFirebaseUser | null,
    newUserCreated = false,
  ) {
    if (user) {
      logger.debug('user signed in', user)
      // legacy user formats did not save names so get profile via email - this option be removed in later version
      // (assumes migration strategy and check)
      const userMeta = await this.getUserProfile(user.uid)
      if (userMeta) {
        this.updateActiveUser(userMeta)
        logger.debug('userMeta', userMeta)

        // Update last active for user
        await this.db
          .collection<IUserPP>(COLLECTION_NAME)
          .doc(userMeta._id)
          .set({ ...userMeta, _lastActive: new Date().toISOString() })
      } else {
        await this.createUserProfile()
        // now that a profile has been created, run this function again (use `newUserCreated` to avoid inf. loop in case not create not working correctly)
        if (!newUserCreated) {
          return this.userSignedIn(user, true)
        }
        // throw new Error(
        //   `could not find user profile [${user.uid} - ${user.email} - ${user.metadata}]`,
        // )
      }
    }
  }

  public async getUserByUsername(username: string) {
    const [user] = await this.db
      .collection<IUserPP>(COLLECTION_NAME)
      .getWhere('_id', '==', username)
    return user
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
    const lookup2 = await this.db
      .collection<IUserPP>(COLLECTION_NAME)
      .getWhere('_id', '==', _authID)
    return lookup2[0]
  }

  public async updateUserBadge(userId: string, badges: IUserBadges) {
    const dbRef = this.db.collection<IUserPP>(COLLECTION_NAME).doc(userId)
    await this.db
      .collection(COLLECTION_NAME)
      .doc(userId)
      .set({
        ...toJS(await dbRef.get('server')),
        badges,
      })
  }

  /**
   * Update a user profile
   * @param values Set of values to merge into user profile
   * @param adminEditableUserId Optionally pass an existing user ID to update with values
   * (default is current logged in user)
   */
  public async updateUserProfile(
    values: Partial<IUserPP>,
    adminEditableUserId?: string,
  ) {
    this.setUpdateStaus('Start')
    const dbRef = this.db
      .collection<IUserPP>(COLLECTION_NAME)
      .doc((values as IUserDB)._id)
    const id = dbRef.id

    // If admin updating another user assume full user passed as values, otherwise merge updates with current user.
    // Include a shallow merge of update with existing user, deserialising mobx observables (caused issue previously)
    const updatedUserProfile: IUserPPDB = adminEditableUserId
      ? (values as any)
      : { ...toJS(this.user), ...toJS(values) }

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
      .doc(updatedUserProfile.userName)
      .set(updatedUserProfile)

    if (!adminEditableUserId) {
      this.updateActiveUser(updatedUserProfile)
    }

    // Update user map pin
    // TODO - pattern back and forth from user to map not ideal
    // should try to refactor and possibly generate map pins in backend
    if (values.location) {
      await this.mapsStore.setUserPin(updatedUserProfile)
    }
    this.setUpdateStaus('Complete')
  }

  public async sendEmailVerification() {
    if (this.authUser) {
      return this.authUser.sendEmailVerification()
    }
  }

  public async getUserEmail() {
    const user = this.authUser as firebase.default.User
    return user.email as string
  }

  public async changeUserPassword(oldPassword: string, newPassword: string) {
    // *** TODO - (see code in change pw component and move here)
    const user = this.authUser as firebase.default.User
    const credentials = EmailAuthProvider.credential(
      user.email as string,
      oldPassword,
    )
    await user.reauthenticateWithCredential(credentials)
    return user.updatePassword(newPassword)
  }

  public async changeUserEmail(password: string, newEmail: string) {
    const user = this.authUser as firebase.default.User
    const credentials = EmailAuthProvider.credential(
      user.email as string,
      password,
    )
    await user.reauthenticateWithCredential(credentials)
    return user.updateEmail(newEmail)
  }

  public async sendPasswordResetEmail(email: string) {
    return auth.sendPasswordResetEmail(email)
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

  private async createUserProfile(fields: Partial<IUser> = {}) {
    const authUser = auth.currentUser as firebase.default.User
    const displayName = authUser.displayName as string
    const userName = formatLowerNoSpecial(displayName)
    const dbRef = this.db.collection<IUser>(COLLECTION_NAME).doc(userName)
    logger.debug('creating user profile', userName)
    if (!userName) {
      throw new Error('No Username Provided')
    }
    const user: IUser = {
      ...USER_BASE,
      _authID: authUser.uid,
      displayName,
      userName,
      moderation: 'awaiting-moderation',
      votedUsefulHowtos: {},
      votedUsefulResearch: {},
      notifications: [],
      ...fields,
    }
    // update db
    await dbRef.set(user)
  }

  @action
  public async updateUsefulHowTos(
    howtoId: string,
    howtoAuthor: string,
    howtoSlug: string,
  ) {
    if (this.user) {
      // toggle entry on user votedUsefulHowtos to either vote or unvote a howto
      // this will updated the main howto via backend `updateUserVoteStats` function
      const votedUsefulHowtos = toJS(this.user.votedUsefulHowtos) || {}
      votedUsefulHowtos[howtoId] = !votedUsefulHowtos[howtoId]

      if (votedUsefulHowtos[howtoId]) {
        //get how to author from howtoid
        this.userNotificationsStore.triggerNotification(
          'howto_useful',
          howtoAuthor,
          '/how-to/' + howtoSlug,
        )
      }
      await this.updateUserProfile({ votedUsefulHowtos })
    }
  }

  @action
  public async loadVerifiedUsers() {
    this.aggregationsStore.updateAggregation('users_verified')
  }

  @action
  public async updateUsefulResearch(
    researchId: string,
    researchAuthor: string,
    researchSlug: string,
  ) {
    if (this.user) {
      // toggle entry on user votedUsefulResearch to either vote or unvote a Research
      // this will updated the main Research via backend `updateUserVoteStats` function
      const votedUsefulResearch = toJS(this.user.votedUsefulResearch) || {}
      votedUsefulResearch[researchId] = !votedUsefulResearch[researchId]

      if (votedUsefulResearch[researchId]) {
        this.userNotificationsStore.triggerNotification(
          'research_useful',
          researchAuthor,
          '/research/' + researchSlug,
        )
      }
      await this.updateUserProfile({ votedUsefulResearch })
    }
  }

  @action
  public async deleteNotification(id: string) {
    try {
      const user = this.activeUser
      if (id && user && user.notifications) {
        const notifications = toJS(user.notifications).filter(
          (notification) => !(notification._id === id),
        )

        const updatedUser: IUser = {
          ...toJS(user),
          notifications,
        }

        const dbRef = this.db
          .collection<IUser>(COLLECTION_NAME)
          .doc(updatedUser._authID)

        await dbRef.set(updatedUser)
        //TODO: ensure current user is updated
      }
    } catch (err) {
      logger.error(err)
      throw new Error(err)
    }
  }

  // use firebase auth to listen to change to signed in user
  // on sign in want to load user profile
  // strange implementation return the unsubscribe object on subscription, so stored
  // to authUnsubscribe variable for use later
  private _listenToAuthStateChanges(checkEmailVerification = false) {
    this.authUnsubscribe = auth.onAuthStateChanged((authUser) => {
      this.authUser = authUser
      if (authUser) {
        this.userSignedIn(authUser)
        // send verification email if not verified and after first sign-up only
        if (!authUser.emailVerified && checkEmailVerification) {
          this.sendEmailVerification()
        }
      } else {
        this.updateActiveUser(undefined)
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

const USER_BASE = {
  coverImages: [],
  links: [],
  moderation: 'awaiting-moderation',
  verified: false,
}
