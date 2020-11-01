import { observable, action } from 'mobx'
import { IUser, IUserDB } from 'src/models/user.models'
import { IUserPP, IUserPPDB } from 'src/models/user_pp.models'
import { IFirebaseUser, auth, EmailAuthProvider } from 'src/utils/firebase'
import { Storage } from '../storage'
import { RootStore } from '..'
import { ModuleStore } from '../common/module.store'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'
import { formatLowerNoSpecial } from 'src/utils/helpers'

/*
The user store listens to login events through the firebase api and exposes logged in user information via an observer.
*/

const COLLECTION_NAME = 'users'

export class UserStore extends ModuleStore {
  private authUnsubscribe: firebase.Unsubscribe
  @observable
  public user: IUserPPDB | undefined

  @observable
  public authUser: firebase.User | null

  @observable
  public userUpdated: boolean = false /** to know if user's data are ready ! */

  @observable
  public updateStatus: IUserUpdateStatus = getInitialUpdateStatus()

  @action
  public updateUser(user?: IUserPPDB) {
    this.user = user
  }

  @action
  public updateUpdateStatus(update: keyof IUserUpdateStatus) {
    this.updateStatus[update] = true
  }

  constructor(rootStore: RootStore) {
    super(rootStore)
    this._listenToAuthStateChanges()
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

  public async login(provider: string, email: string, password: string) {
    switch (provider) {
      // eslint-disable-next-line
      default:
        return auth.signInWithEmailAndPassword(email, password)
    }
  }

  // handle user sign in, when firebase authenticates wnat to also fetch user document from the database
  public async userSignedIn(user: IFirebaseUser | null) {
    if (user) {
      console.log('user signed in', user)
      // legacy user formats did not save names so get profile via email - this option be removed in later version
      // (assumes migration strategy and check)
      const userMeta = await this.getUserProfile(user.uid)
      if (userMeta) {
        this.updateUser(userMeta)
        console.log('userMeta', userMeta)
      } else {
        throw new Error(
          `could not find user profile [${user.uid} - ${user.email} - ${user.metadata}]`,
        )
      }
      this.userUpdated = true
    }
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

  public async updateUserProfile(values: Partial<IUserPP>) {
    this.updateUpdateStatus('Start')
    const dbRef = this.db
      .collection<IUserPP>(COLLECTION_NAME)
      .doc((values as IUserDB)._id)
    const id = dbRef.id
    const user = this.user as IUserPPDB
    if (values.coverImages) {
      const processedImages = await this.uploadCollectionBatch(
        values.coverImages as IConvertedFileMeta[],
        COLLECTION_NAME,
        id,
      )
      values = { ...values, coverImages: processedImages }
    }
    const update = { ...user, ...values }
    await this.db
      .collection(COLLECTION_NAME)
      .doc(user.userName)
      .set(update)
    this.updateUser(update)
    // Update user map pin
    // TODO - pattern back and forth from user to map not ideal
    // should try to refactor and possibly generate map pins in backend
    if (values.location) {
      await this.mapsStore.setUserPin(update)
    }
    this.updateUpdateStatus('Complete')
  }

  public async sendEmailVerification() {
    if (this.authUser) {
      return this.authUser.sendEmailVerification()
    }
  }

  public async updateUserAvatar() {
    console.log('updating user avatar')
    // *** TODO -
  }

  public async changeUserPassword(oldPassword: string, newPassword: string) {
    // *** TODO - (see code in change pw component and move here)
    const user = this.authUser as firebase.User
    const credentials = EmailAuthProvider.credential(
      user.email as string,
      oldPassword,
    )
    await user.reauthenticateAndRetrieveDataWithCredential(credentials)
    return user.updatePassword(newPassword)
  }

  public async sendPasswordResetEmail(email: string) {
    return auth.sendPasswordResetEmail(email)
  }

  public async logout() {
    return auth.signOut()
  }

  public async deleteUser(reauthPw: string) {
    // as delete operation is sensitive requires user to revalidate credentials first
    const authUser = auth.currentUser as firebase.User
    const credential = EmailAuthProvider.credential(
      authUser.email as string,
      reauthPw,
    )
    try {
      await authUser.reauthenticateAndRetrieveDataWithCredential(credential)
      const user = this.user as IUser
      await this.db
        .collection(COLLECTION_NAME)
        .doc(user.userName)
        .delete()
      await authUser.delete()
      // TODO - delete user avatar
      // TODO - show deleted notification
    } catch (error) {
      // TODO show notification if invalid credential
      throw error
    }
  }

  public async createUserProfile(fields: Partial<IUser> = {}) {
    const authUser = auth.currentUser as firebase.User
    const displayName = authUser.displayName as string
    const userName = formatLowerNoSpecial(displayName)
    const dbRef = this.db.collection<IUser>(COLLECTION_NAME).doc(userName)
    console.log('creating user profile', userName)
    if (!userName) {
      throw new Error('No Username Provided')
    }
    const user: IUser = {
      ...USER_BASE,
      _authID: authUser.uid,
      displayName,
      userName,
      moderation: 'awaiting-moderation',
      verified: false,
      ...fields,
    }
    // update db
    await dbRef.set(user)
    // retrieve from db (to also include generated meta)
    return dbRef.get()
  }

  // use firebase auth to listen to change to signed in user
  // on sign in want to load user profile
  // strange implementation return the unsubscribe object on subscription, so stored
  // to authUnsubscribe variable for use later
  private _listenToAuthStateChanges(checkEmailVerification = false) {
    this.authUnsubscribe = auth.onAuthStateChanged(authUser => {
      this.authUser = authUser
      if (authUser) {
        this.userSignedIn(authUser)
        // send verification email if not verified and after first sign-up only
        if (!authUser.emailVerified && checkEmailVerification) {
          this.sendEmailVerification()
        }
      } else {
        this.updateUser(undefined)
        this.userUpdated = true
      }
    })
  }

  private _unsubscribeFromAuthStateChanges() {
    this.authUnsubscribe()
  }
}

interface IUserUpdateStatus {
  Start: boolean
  Complete: boolean
}

function getInitialUpdateStatus() {
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
