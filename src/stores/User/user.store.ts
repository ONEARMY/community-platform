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
    this.authListener = auth.onAuthStateChanged(authUser => {
      console.log('auth user changed', authUser)
      if (authUser && authUser.emailVerified) {
        this.userSignedIn(authUser)
      } else {
        this.updateUser()
      }
    })
  }

  // handle user sign in, when firebase authenticates wnat to also fetch user document from the database
  public async userSignedIn(user: IFirebaseUser | null) {
    console.log('user signed in, getting meta', user)
    let userMeta: IUser | null = null
    if (user && user.email) {
      userMeta = await this.getUserProfile(user.email)
    }
    if (userMeta) {
      console.log('user meta retrieved', userMeta)
      this.updateUser(userMeta)
    } else {
      console.log('no user meta retrieved')
      // *** TODO handle user has no profile - shouldn't happen as registration populates before creating user?
      // *** TODO should also handle timeout/no connection potential issue when fetching?
    }
  }

  public async getUserProfile(userEmail: string) {
    const ref = await afs.doc(`users/${userEmail}`).get()
    const user: IUser = ref.data() as IUser
    return user
  }

  private async _createUserProfile(values: IUserFormInput) {
    const user: IUser = {
      ...Database.generateDocMeta('users'),
      verified: false,
      email: values.email,
      display_name: values.display_name,
      first_name: values.first_name,
      last_name: values.last_name,
      nickname: values.nickname,
      country: values.country,
    }
    await Database.setDoc(`users/${user.email}`, user)
  }

  @action
  public async signUpUser(userForm: IUserFormInput) {
    try {
      await auth.createUserWithEmailAndPassword(userForm.email, String(userForm.password))
      await this._createUserProfile(userForm)
      await this.sendEmailVerification()
    } catch(error) {
      console.log(error)
      var { code, message } = error;
      if (code === 'auth/weak-password') {
        throw 'The password is too weak.';
      }
      else if (code === 'auth/email-already-in-use') {
        throw 'The email address is already in use by another account.';
      } else {
        throw message;
      }
    }
  }

  public get authUser() {
    return auth.currentUser as firebase.User;
  }

  public async sendEmailVerification() {
    await this.authUser.sendEmailVerification()
  }

  public async sendPasswordResetEmail(email) {
    await auth.sendPasswordResetEmail(email)
  }

  public async logout() {
    await auth.signOut()
  }
}
