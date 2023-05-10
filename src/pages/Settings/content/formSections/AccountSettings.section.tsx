import { inject, observer } from 'mobx-react'
import * as React from 'react'

import type { UserStore } from 'src/stores/User/user.store'
import { Box, Flex, Heading } from 'theme-ui'
import { ChangeEmailForm } from './ChangeEmail.form'
import { ChangePasswordForm } from './ChangePassword.form'
import { FlexSectionContainer } from './elements'
import { ProfileDelete } from '../ProfileDelete'

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
      <FlexSectionContainer>
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
      </FlexSectionContainer>
    )
  }
}
