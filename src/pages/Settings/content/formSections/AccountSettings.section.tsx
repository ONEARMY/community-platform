import * as React from 'react'

import { Flex, Heading, Box, Card } from 'theme-ui'
import type { UserStore } from 'src/stores/User/user.store'
import { ChangePasswordForm } from './ChangePassword.form'
import { ChangeEmailForm } from './ChangeEmail.form'
import { ProfileDelete } from '../ProfileDelete'
import { observer, inject } from 'mobx-react'

interface IProps {}
interface IInjectedProps extends IProps {
  userStore: UserStore
}

@inject('userStore')
@observer
export class AccountSettingsSection extends React.Component<any> {
  constructor(props: IProps) {
    super(props)
  }
  get injected() {
    return this.props as IInjectedProps
  }

  public deleteProfile(reauthPw: string) {
    this.props.userStore.deleteUser(reauthPw)
  }

  render() {
    return (
      <Card sx={{ background: 'red2', padding: 4, marginTop: 4 }}>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Heading variant="small">Account settings</Heading>
        </Flex>
        <Box mt={2}>
          <ChangeEmailForm userStore={this.props.userStore} />
          <ChangePasswordForm userStore={this.props.userStore} />
          <ProfileDelete
            onConfirmation={(reauthPw) => this.deleteProfile(reauthPw)}
          />
        </Box>
      </Card>
    )
  }
}
