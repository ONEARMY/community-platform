import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { UserStore } from 'src/stores/User/user.store'
import { IUser } from 'src/models/user.models'
import { UserDetail } from 'src/pages/common/User/Detail'
import PageContainer from 'src/components/Layout/PageContainer'
import { BoxContainer } from 'src/components/Layout/BoxContainer'

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
      <PageContainer>
        <BoxContainer>
          <UserDetail user={user} />
        </BoxContainer>
      </PageContainer>
    ) : null
  }
}
