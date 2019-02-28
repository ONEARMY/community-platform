import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { UserStore } from 'src/stores/User/user.store'
import { IUser } from 'src/models/user.models'
import { UserDetail } from 'src/pages/common/User/Detail'

interface InjectedProps {
  userStore: UserStore
}

@inject('userStore')
@observer
export class ProfilePage extends React.Component<any> {
  get injected() {
    return this.props as InjectedProps
  }

  public render() {
    let user = this.injected.userStore.user as IUser
    return user ? (
      <div>
        <UserDetail user={user} />
      </div>
    ) : null
  }
}