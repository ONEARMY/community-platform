import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Button } from 'oa-components'
import type { AdminStore } from 'src/stores/Admin/admin.store'
import type { IUser } from 'src/models/user.models'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { Text } from 'theme-ui'
import { Link } from 'react-router-dom'

/*
    Button to request a user's email from the firebase auth database and open in default mail client
*/

interface IProps {
  user: IUser
  adminStore?: AdminStore
}
interface IState {
  disabled: boolean
  contactDetails?: string
}

@inject('adminStore')
@observer
export class UserAdmin extends React.Component<IProps, IState> {
  getUserEmail = async () => {
    this.setState({ disabled: true, contactDetails: 'Requesting Email...' })
    const contactDetails = await this.props.adminStore!.getUserEmail(
      this.props.user,
    )
    this.setState({ disabled: false, contactDetails })
  }
  constructor(props: IProps) {
    super(props)
    this.state = { disabled: false }
  }

  public render() {
    const { contactDetails, disabled } = this.state
    return (
      <AuthWrapper roleRequired={'admin'}>
        <Button
          disabled={disabled}
          onClick={this.getUserEmail}
          data-cy="UserAdminEmail"
        >
          Email
        </Button>
        {/* LADEBUG */}
        <Link
          to={`/u/${this.props.user.userName}/edit`}
          data-cy="UserAdminEdit"
        >
          <Button ml={2}>Edit</Button>
        </Link>

        {contactDetails && (
          <Text mt={3}>
            <a href={`mailto:${contactDetails}`}>{contactDetails}</a>
          </Text>
        )}
      </AuthWrapper>
    )
  }
}
