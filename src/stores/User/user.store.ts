import { observable, action } from 'mobx'
import { Database } from '../database'
import { IUser, IUserFormInput } from 'src/models/user.models'
import { IFirebaseUser, auth, afs } from 'src/utils/firebase'
import { IFirebaseUploadInfo } from 'src/pages/common/FirebaseFileUploader/FirebaseFileUploader'

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

  public async registerNewUser(email: string, password: string) {
    return auth.createUserWithEmailAndPassword(email, password)
  }

  public async login(email: string, password: string) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  // handle user sign in, when firebase authenticates wnat to also fetch user document from the database
  public async userSignedIn(user: IFirebaseUser | null) {
    let userMeta: IUser | null = null
    if (user && user.uid) {
      userMeta = await this.getUserProfile(user.uid)
      if (!userMeta) {
        console.log('no user meta retrieved. creating empty user doc')
        userMeta = await this._createUserProfile({
          display_name: '',
          first_name: '',
          last_name: '',
          nickname: '',
          country: '',
        } as IUserFormInput)
      }
      this.updateUser(userMeta)
    }
  }

  public async getUserProfile(uid: string) {
    const ref = await afs.doc(`users/${uid}`).get()
    const user: IUser = ref.data() as IUser
    return user
  }

  public async updateUserProfile(values: IUserFormInput) {
    const update = { ...(this.user as IUser), ...values }
    await Database.setDoc(`users/${update._id}`, update)
    this.user = update
    console.log('user updated', update)
  }
  public async changeUserPassword() {
    // (see code in change pw component and move here)
  }

  public async sendEmailVerification() {
    if (this.authUser) {
      return this.authUser.sendEmailVerification()
    }
  }

  public async sendPasswordResetEmail(email) {
    return auth.sendPasswordResetEmail(email)
  }

  public async logout() {
    return auth.signOut()
  }

  private async _createUserProfile(values: IUserFormInput) {
    const authUser = auth.currentUser as firebase.User
    const user: IUser = {
      ...Database.generateDocMeta('users'),
      _id: authUser.uid,
      verified: false,
      avatar: 'https://i.ibb.co/YhRNk4B/avatar-placeholder.gif',
      display_name: values.display_name,
      first_name: values.first_name,
      last_name: values.last_name,
      nickname: values.nickname,
      country: values.country,
    }
    await Database.setDoc(`users/${user._id}`, user)
    return user
  }
}
