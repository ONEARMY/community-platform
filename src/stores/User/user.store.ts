import { observable, action } from 'mobx'
import { Database } from '../database'
import { functions } from 'src/utils/firebase'
import { IUser } from 'src/models/user.models'
import { IFirebaseUser, auth, afs, EmailAuthProvider } from 'src/utils/firebase'
import { Storage } from '../storage'
import { notificationPublish } from '../Notifications/notifications.service'

/*
The user store listens to login events through the firebase api and exposes logged in user information via an observer.
*/

export class UserStore {
  private authUnsubscribe: firebase.Unsubscribe
  @observable
  public user: IUser | undefined

  @observable
  public authUser: firebase.User | null

  @action
  public updateUser(user?: IUser) {
    this.user = user
    console.log('user updated', user)
  }
  constructor() {
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
      await this._createUserProfile(userName)
      this._listenToAuthStateChanges()
    }
  }

  public async login(email: string, password: string) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  // handle user sign in, when firebase authenticates wnat to also fetch user document from the database
  public async userSignedIn(user: IFirebaseUser | null) {
    let userMeta: IUser | null = null
    if (user) {
      // legacy user formats did not save names so get profile via email - this option be removed in later version
      // (assumes migration strategy and check)
      userMeta = user.displayName
        ? await this.getUserProfile(user.displayName)
        : await this.getUserProfile(user.email as string)
      if (userMeta) {
        this.updateUser(userMeta)
      }
    }
  }

  public async getUserProfile(userName: string) {
    const ref = await afs.doc(`v2_users/${userName}`).get()
    return ref.exists ? (ref.data() as IUser) : null
  }

  public async updateUserProfile(values: Partial<IUser>) {
    const user = this.user as IUser
    const update = { ...user, ...values }
    await Database.setDoc(`v2_users/${user.userName}`, update)
    this.updateUser(update)
  }

  public async sendEmailVerification() {
    if (this.authUser) {
      return this.authUser.sendEmailVerification()
    }
  }
  // take the username and return matching avatar url (includes undefined.jpg match if no user)
  public async getUserAvatar(userName: string | undefined) {
    const url = Storage.getPublicDownloadUrl(`avatars/${userName}.jpg`)
    return url
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

  private async _createUserProfile(userName: string) {
    const authUser = auth.currentUser as firebase.User
    const user: IUser = {
      ...Database.generateDocMeta('v2_users', userName),
      _authID: authUser.uid,
      userName,
      verified: false,
    }
    await Database.setDoc(`v2_users${userName}`, user)
    this.updateUser(user)
  }

  // use firebase auth to listen to change to signed in user
  // on sign in want to load user profile
  // strange implementation return the unsubscribe object on subscription, so stored
  // to authUnsubscribe variable for use later
  private _listenToAuthStateChanges() {
    this.authUnsubscribe = auth.onAuthStateChanged(authUser => {
      this.authUser = authUser
      if (authUser) {
        this.userSignedIn(authUser)
      } else {
        this.updateUser(undefined)
      }
    })
  }

  private _unsubscribeFromAuthStateChanges() {
    this.authUnsubscribe()
  }
}
