import { observable, action } from 'mobx'
import { IUser } from 'src/models/user.models'
import { IFirebaseUser, auth, db } from 'src/utils/firebase'

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
      if (authUser) {
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
    const ref = await db.doc(`users/${userEmail}`).get()
    const user: IUser = ref.data() as IUser
    return user
  }

  public async logout() {
    await auth.signOut()
  }
}
