import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Button } from 'src/components/Button'
import { AdminStore } from 'src/stores/Admin/admin.store'
import { IUser } from 'src/models/user.models'
import Text from '../Text'

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
export class AdminContact extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { disabled: false }
  }
  getUserEmail = async () => {
    this.setState({ disabled: true, contactDetails: 'Requesting Email...' })
    const contactDetails = await this.props.adminStore!.getUserEmail(
      this.props.user,
    )
    this.setState({ disabled: false, contactDetails })
  }
  public render() {
    const { contactDetails, disabled } = this.state
    return (
      <>
        <Button disabled={disabled} onClick={this.getUserEmail}>
          Email
        </Button>
        {contactDetails && (
          <Text mt={3}>
            <a href={`mailto:${contactDetails}`}>{contactDetails}</a>
          </Text>
        )}
      </>
    )
  }
}
