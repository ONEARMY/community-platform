/******************************************************************************  
The login container binds to the global user state to pass down logged in
and user properties to LoginButton and LoginModal components   
*******************************************************************************/

import * as React from 'react'
import { auth, IFirebaseUser, db } from '../../../utils/firebase'
import { LoginComponent } from './Login'
import { IUser } from '../../../models/models'

// internal state properties
interface IInternalState {
  showLoginModal: boolean
}
// own properties - we want to copy the user property from global to state so it can be passed to child components
interface IOwnProps {
  user: IUser
  notifyUserUpdate: any
}
// global state properties
interface IStateProps {
  user: IUser
}

// dispatch events - these are called to trigger redux actions
interface IDispatchProps {
  updateUser: (user: IUser | null) => void
}

// overall component props are a combination of state, dispatch and own props
type IProps = IStateProps & IDispatchProps & IOwnProps

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
      this.userSignedIn(authUser)
    })
    //
  }
  public componentWillUnmount() {
    this.authListener = null
  }
  // handle user sign in, when firebase authenticates wnat to also fetch user document from the database
  public async userSignedIn(user: IFirebaseUser | null) {
    let userMeta: IUser | null = null
    if (user && user.email) {
      userMeta = await this.getUserProfile(user.email)
    }
    this.props.updateUser(userMeta)
    this.props.notifyUserUpdate(userMeta)
  }

  public async getUserProfile(userEmail: string) {
    const ref = await db.doc(`usermeta/${userEmail}`).get()
    const user: IUser = ref.data() as IUser
    return user
  }

  public render() {
    return (
      <div>
        <LoginComponent user={this.props.user} />
      </div>
    )
  }
}
