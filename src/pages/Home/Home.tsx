/******************************************************************************  
This is the Home Page main component, rendering content seen at '/'
*******************************************************************************/

import * as React from 'react'
import './Home.scss'
import { UserStore } from 'src/stores/User/user.store'
import { IStores } from 'src/stores'
import { inject } from 'mobx-react'
import { IUser } from 'src/models/user.models'
import { withRouter } from 'react-router'

interface IState {
  isLoggedIn: boolean
  userStore: UserStore
}
@inject((allStores: IStores) => ({
  userStore: allStores.userStore,
}))
class HomePageClass extends React.Component<IState, any> {
  // userUpdated is a callback function passed back up from the login container to track if the user has logged in
  // we could also use the global state for this, but for now sufficient
  public userUpdated = (user: IUser) => {
    this.setState({ isLoggedIn: user ? true : false })
  }
  public render() {
    return <div id="HomePage" />
  }
}

export const HomePage: any = withRouter(HomePageClass as any)
