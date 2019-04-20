import { observable, action } from 'mobx'
import { Database } from '../database'
import { IUser, IUserFormInput } from 'src/models/user.models'
import { IFirebaseUser, auth, afs } from 'src/utils/firebase'
import { Storage } from '../storage'

/*
The user store listens to login events through the firebase api and exposes logged in user information via an observer.
*/

export class UserStore {
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

  private _listenToAuthStateChanges() {
    auth.onAuthStateChanged(authUser => {
      console.log('auth user changed', authUser)
      this.authUser = authUser
      if (authUser) {
        this.userSignedIn(authUser)
      } else {
        this.updateUser(undefined)
      }
    })
  }

  public async registerNewUser(
    email: string,
    password: string,
    userName: string,
  ) {
    const req = await auth.createUserWithEmailAndPassword(email, password)
    // once registered populate displayname with the chosen username
    if (req.user) {
      console.log('updating user display name')
      req.user.updateProfile({
        displayName: userName,
        photoURL: req.user.photoURL,
      })
    }
  }

  public async login(email: string, password: string) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  // handle user sign in, when firebase authenticates wnat to also fetch user document from the database
  public async userSignedIn(user: IFirebaseUser | null) {
    let userMeta: IUser | null = null
    if (user) {
      if (user.displayName) {
        userMeta = await this.getUserProfile(user.displayName)
        if (!userMeta) {
          console.log('no user meta retrieved. creating empty user doc')
          userMeta = await this._createUserProfile({
            userName: user.displayName,
          })
        }
        this.updateUser(userMeta)
      } else {
        console.log('no user display name')
        // if user just registered there might be a delay before their display name has been updated
        return setTimeout(() => {
          this.userSignedIn(user)
        }, 500)
      }
    }
  }

  public async getUserProfile(userName: string) {
    const ref = await afs.doc(`users/${userName}`).get()
    return ref.exists ? (ref.data() as IUser) : null
  }

  public async updateUserProfile(values: IUserFormInput) {
    const user = this.user as IUser
    const update = { ...user, ...values }
    await Database.setDoc(`users/${user.userName}`, update)
    this.updateUser(update)
    console.log('user updated', update)
  }
  public async changeUserPassword() {
    // *** TODO - (see code in change pw component and move here)
  }

  public async sendEmailVerification() {
    if (this.authUser) {
      return this.authUser.sendEmailVerification()
    }
  }

  public async updateUserAvatar() {
    // TODO
  }
  // take the username and return matching avatar url (includes undefined.jpg match if no user)
  public async getUserAvatar(userName: string | undefined) {
    const url = Storage.getPublicDownloadUrl(`avatars/${userName}.jpg`)
    return url
  }
  public async setUserAvatarFromUrl(url: string) {}

  public async sendPasswordResetEmail(email: string) {
    return auth.sendPasswordResetEmail(email)
  }

  public async logout() {
    return auth.signOut()
  }

  private async _createUserProfile(values: IUserFormInput) {
    const authUser = auth.currentUser as firebase.User
    const user: IUser = {
      ...Database.generateDocMeta('users', values.userName),
      _authID: authUser.uid,
      userName: values.userName as string,
      verified: false,
    }
    await Database.setDoc(`users/${values.userName}`, user)
    return user
  }
}
