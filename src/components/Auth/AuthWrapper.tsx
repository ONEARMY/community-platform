import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { UserStore } from 'src/stores/User/user.store'

/*
    Simple wrapper to only render a component if the user is logged in
*/

interface IProps {
  userStore?: UserStore
}
interface IState {}
@inject('userStore')
@observer
export class AuthWrapper extends React.Component<IProps, IState> {
  render() {
    // user ! to let typescript know property will exist (injected) instead of additional getter method
    const isAuthenticated = this.props.userStore!.user ? true : false
    return isAuthenticated === true ? this.props.children : null
  }
}
