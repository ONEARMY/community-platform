import { observable, action } from 'mobx'
import { IUser, IUserDB } from 'src/models/user.models'
import { IUserPP, IUserPPDB } from 'src/models/user_pp.models'
import {
  IFirebaseUser,
  auth,
  EmailAuthProvider,
  functions,
} from 'src/utils/firebase'
import { Storage } from '../storage'
import { notificationPublish } from '../Notifications/notifications.service'
import { RootStore } from '..'
import { loginWithDHCredentials } from 'src/hacks/DaveHakkensNL.hacks'
import { ModuleStore } from '../common/module.store'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'

/*
The user store listens to login events through the firebase api and exposes logged in user information via an observer.
*/

const COLLECTION_NAME = 'v2_users'

export class UserStore extends ModuleStore {
  private authUnsubscribe: firebase.Unsubscribe
  @observable
  public user: IUserPPDB | undefined

  @observable
  public authUser: firebase.User | null

  @action
  public updateUser(user?: IUserPPDB) {
    this.user = user
  }
  constructor(rootStore: RootStore) {
    super(rootStore)
    this._listenToAuthStateChanges()
  }

  // when registering a new user create firebase auth profile as well as database user profile
  public async registerNewUser(
    email: string,
    password: string,
    userName: string,
  ) {
    // stop auto detect of login as will pick up with incomplete information during registration
    this._unsubscribeFromAuthStateChanges()
    const authReq = await auth.createUserWithEmailAndPassword(email, password)
    // once registered populate auth profile displayname with the chosen username
    if (authReq.user) {
      await authReq.user.updateProfile({
        displayName: userName,
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
      // custom login methods for DH site
      case 'DH':
        // unsubscribe from changes as otherwise they will fire in the middle of updating
        this._unsubscribeFromAuthStateChanges()
        await loginWithDHCredentials(email, password, this)
        this._listenToAuthStateChanges()

      default:
        return auth.signInWithEmailAndPassword(email, password)
    }
  }

  // handle user sign in, when firebase authenticates wnat to also fetch user document from the database
  public async userSignedIn(user: IFirebaseUser | null) {
    if (user) {
      // legacy user formats did not save names so get profile via email - this option be removed in later version
      // (assumes migration strategy and check)
      const userMeta = user.displayName
        ? await this.getUserProfile(user.displayName)
        : await this.getUserProfile(user.email as string)
      if (userMeta) {
        this.updateUser(userMeta)
      } else {
        this.createUserProfile()
      }
    }
  }

  public async getUserProfile(userName: string) {
    return this.db
      .collection<IUser>(COLLECTION_NAME)
      .doc(userName)
      .get()
  }

  public async updateUserProfile(values: Partial<IUserPP>) {
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

  // during DHSite migration want to copy existing BP avatar to server
  public async setUserAvatarFromUrl(url: string) {
    console.log('setting user avatar', url)
    try {
      await functions.httpsCallable('DHSite_migrateAvatar')({
        avatarUrl: url,
        user: this.user ? this.user._id : null,
      })
      // use pubsub to let avatar component know new avatar available
      console.log('publishing message')
      notificationPublish('Profile.Avatar.Updated')
    } catch (error) {
      console.log('error', error)
    }
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
    const userName = authUser.displayName as string
    const dbRef = this.db.collection<IUser>(COLLECTION_NAME).doc(userName)
    console.log('creating user profile', userName)
    if (!userName) {
      throw new Error('No Username Provided')
    }
    const user: IUser = {
      _authID: authUser.uid,
      userName,
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
      }
    })
  }

  private _unsubscribeFromAuthStateChanges() {
    this.authUnsubscribe()
  }
}

/***********************************************************************************************
 *    Additional Utils - available without store injection
 **********************************************************************************************/
// take the username and return matching avatar url (includes undefined.jpg match if no user)
export const getUserAvatar = (userName: string | undefined) => {
  return Storage.getPublicDownloadUrl(`avatars/${userName}.jpg`)
}
