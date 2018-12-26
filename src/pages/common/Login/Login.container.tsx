/******************************************************************************  
The login container binds to the global user state to pass down logged in
and user properties to LoginButton and LoginModal components   
*******************************************************************************/

import * as React from 'react'
import { auth, IFirebaseUser, db } from '../../../utils/firebase'
import { LoginComponent } from './Login'
import { IUser } from '../../../models/models'
import { UserStore } from 'src/stores/User/user.store'
import { inject, observer } from 'mobx-react'

// internal state properties
interface IInternalState {
  showLoginModal: boolean
}
// own properties - we want to copy the user property from global to state so it can be passed to child components
// we don't actually have any but want to keep for reference of how to merge with injected store
interface IProps {
  exampleProp?: null
}
// injected properties - defining separately as login container might sit inside a parent component unable to
// pass down the store. See https://medium.com/@prashaantt/strongly-typing-injected-react-props-635a6828acaf
// we later force typescript to accept props as having access to the store despite not being passed from parent
// (it is injected, which causes problems for typescript)
interface InjectedProps extends IProps {
  userStore: UserStore
}

@inject('userStore')
@observer
export class LoginContainer extends React.Component<IProps, IInternalState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      showLoginModal: false,
    }
  }
  // workaround used later so that userStore can be called in render method when not existing on
  get injected() {
    return this.props as InjectedProps
  }

  // setup listener for user auth events (unsubscribe when component destroyed)
  // if planning to also listen elsewhere then should be moved to higher level app component
  public authListener: any = () => null
  public componentDidMount() {
    this.authListener = auth.onAuthStateChanged(authUser => {
      console.log('auth user changed', authUser)
      if (authUser) {
        this.userSignedIn(authUser)
      } else {
        this.injected.userStore.updateUser()
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
      this.injected.userStore.updateUser(userMeta)
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

  public render() {
    const { userStore } = this.injected
    return (
      <div>
        <LoginComponent user={userStore.user ? userStore.user : null} />
      </div>
    )
  }
}
