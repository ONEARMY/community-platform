import * as React from 'react'

import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import { UserStore } from 'src/stores/User/user.store'
import { Box } from 'theme-ui'
import { FlexSectionContainer, ArrowIsSectionOpen } from './elements'
import { ChangePasswordForm } from './ChangePassword.form'
import { ChangeEmailForm } from './ChangeEmail.form'
import { ProfileDelete } from '../ProfileDelete'
import { observer, inject } from 'mobx-react'

interface IProps {}
interface IInjectedProps extends IProps {
  userStore: UserStore
}
interface IState {
  isOpen: boolean
}
@inject('userStore')
@observer
export class AccountSettingsSection extends React.Component<any, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = {
      isOpen: false,
    }
  }
  get injected() {
    return this.props as IInjectedProps
  }

  public deleteProfile(reauthPw: string) {
    this.props.userStore.deleteUser(reauthPw)
  }

  render() {
    const { isOpen } = this.state
    return (
      <FlexSectionContainer>
        <Flex sx={{justifyContent: "space-between"}}>
          <Heading small>Account settings</Heading>
          <ArrowIsSectionOpen
            onClick={() => {
              this.setState({ isOpen: !isOpen })
            }}
            isOpen={isOpen}
          />
        </Flex>
        <Box mt={2} sx={{ display: isOpen ? 'block' : 'none' }}>
          <ChangeEmailForm userStore={this.props.userStore} />
          <ChangePasswordForm userStore={this.props.userStore} />
          <ProfileDelete
            onConfirmation={reauthPw => this.deleteProfile(reauthPw)}
          />
        </Box>
      </FlexSectionContainer>
    )
  }
}
