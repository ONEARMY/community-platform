import * as React from 'react'
import { Flex, Heading, Box, Card, Text } from 'theme-ui'
import { observer, inject } from 'mobx-react'
import { ExternalLink } from 'oa-components'

import { ChangePasswordForm } from './ChangePassword.form'
import { ChangeEmailForm } from './ChangeEmail.form'
import { DISCORD_INVITE_URL } from 'src/constants'
import { fields, headings } from 'src/pages/UserSettings/labels'

import type { UserStore } from 'src/stores/User/user.store'

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
    const { description, title } = fields.deleteAccount

    return (
      <Card sx={{ background: 'red2', padding: 4, marginTop: 4 }}>
        <Flex sx={{ justifyContent: 'space-between' }}>
          <Heading variant="small">{headings.accountSettings}</Heading>
        </Flex>
        <Box mt={2}>
          <ChangeEmailForm userStore={this.props.userStore} />
          <ChangePasswordForm userStore={this.props.userStore} />
        </Box>
        <Box mt={2}>
          <Text variant="body">
            {title}
            <ExternalLink
              sx={{ ml: 1, textDecoration: 'underline' }}
              href={DISCORD_INVITE_URL}
            >
              {description}
            </ExternalLink>
          </Text>
        </Box>
      </Card>
    )
  }
}
