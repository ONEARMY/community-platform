/******************************************************************************  
The login container binds to the global user state to pass down logged in
and user properties to LoginButton and LoginModal components   
*******************************************************************************/

import * as React from 'react'
import { auth, IFirebaseUser, db } from '../../../utils/firebase'
import { LoginComponent } from './Login'
import { IUser } from '../../../models/models'
import { UserStore } from 'src/stores/User/user.store'

// internal state properties
interface IInternalState {
  showLoginModal: boolean
}
// own properties - we want to copy the user property from global to state so it can be passed to child components
interface IProps {
  userStore: UserStore
}
// global state properties
interface IStateProps {
  user: IUser
}

export class LoginContainer extends React.Component<IProps, IInternalState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showLoginModal: false,
    }
  }
  // setup listener for user auth events (unsubscribe when component destroyed)
  // if planning to also listen elsewhere then should be moved to higher level app component
  public authListener: any = () => null
  public componentDidMount() {
    this.authListener = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.userSignedIn(authUser)
      }
    })
  }
  public componentWillUnmount() {
    this.authListener = null
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
      this.props.userStore.updateUser(userMeta)
    } else {
      console.log('no user meta retrieved')
      // *** handle user has no profile - shouldn't happen as registration populates before creating user?
      // *** should also handle timeout/no connection potential issue when fetching?
    }
  }

  public async getUserProfile(userEmail: string) {
    const ref = await db.doc(`usermeta/${userEmail}`).get()
    const user: IUser = ref.data() as IUser
    return user
  }

  public render() {
    return (
      <div>
        <LoginComponent user={this.props.userStore.user} />
      </div>
    )
  }
}
