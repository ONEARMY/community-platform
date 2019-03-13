import { observable, action } from 'mobx'
import { Database } from '../database'
import { IUser, IUserFormInput } from 'src/models/user.models'
import { IFirebaseUser, auth, afs } from 'src/utils/firebase'

/*
The user store listens to login events through the firebase api and exposes logged in user information via an observer.
*/

export class UserStore {
  // listener not strictly types as firebase coupling defined in complex way
  authListener: any
  @observable
  public user: IUser | undefined

  @observable
  public authUser: firebase.User | null

  @action
  public updateUser(user?: IUser) {
    if (user) {
      this.user = user
    } else {
      this.user = undefined
    }
  }
  constructor() {
    console.log('listening for auth state chagnes')
    this.authListener = action(
      auth.onAuthStateChanged(authUser => {
        console.log('auth user changed', authUser)
        this.authUser = authUser
        if (authUser && authUser.emailVerified) {
          this.userSignedIn(authUser)
        } else {
          this.updateUser()
        }
      }),
    )
  }

  // handle user sign in, when firebase authenticates wnat to also fetch user document from the database
  public async userSignedIn(user: IFirebaseUser | null) {
    console.log('user signed in, getting meta', user)
    let userMeta: IUser | null = null
    if (user && user.uid) {
      userMeta = await this.getUserProfile(user.uid)
      if (userMeta) {
        console.log('user meta retrieved', userMeta)
        userMeta.email = user.email as string
      } else {
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
      // *** TODO should also handle timeout/no connection potential issue when fetching?
    }
  }

  public async getUserProfile(uid: string) {
    const ref = await afs.doc(`users/${uid}`).get()
    const user: IUser = ref.data() as IUser
    return user
  }

  public async updateUserProfile(user: IUser, values: IUserFormInput) {
    user.display_name = values.display_name
    user.country = values.country
    await Database.setDoc(`users/${user._id}`, user)
  }

  private async _createUserProfile(values: IUserFormInput) {
    let authUser = auth.currentUser as firebase.User
    const user: IUser = {
      ...Database.generateDocMeta('users'),
      _id: authUser.uid,
      verified: false,
      display_name: values.display_name,
      first_name: values.first_name,
      last_name: values.last_name,
      nickname: values.nickname,
      country: values.country,
    }
    await Database.setDoc(`users/${user._id}`, user)
    return user
  }

  @action
  public async signUpUser(userForm: IUserFormInput) {
    try {
      await auth.createUserWithEmailAndPassword(
        userForm.email,
        String(userForm.password),
      )
      await this._createUserProfile(userForm)
      await this.sendEmailVerification()
    } catch (error) {
      console.log(error)
      const { code, message } = error
      if (code === 'auth/weak-password') {
        throw new Error('The password is too weak.')
      } else if (code === 'auth/email-already-in-use') {
        throw new Error(
          'The email address is already in use by another account.',
        )
      } else {
        throw message
      }
    }
  }

  public async sendEmailVerification() {
    this.authUser && (await this.authUser.sendEmailVerification())
  }

  public async sendPasswordResetEmail(email) {
    await auth.sendPasswordResetEmail(email)
  }

  public async logout() {
    await auth.signOut()
  }
}
