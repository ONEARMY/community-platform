import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Button } from 'src/components/Button'
import { AdminStore } from 'src/stores/Admin/admin.store'
import { IUser } from 'src/models/user.models'

/*
    Button to request a user's email from the firebase auth database and open in default mail client
*/

interface IProps {
  user: IUser
  adminStore?: AdminStore
}
interface IState {
  disabled: boolean
}
@inject('adminStore')
@observer
export class AdminContact extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { disabled: false }
  }
  getUserEmail = async () => {
    this.setState({ disabled: true })
    const email = await this.props.adminStore!.getUserEmail(this.props.user)
    this.setState({ disabled: false })
    window.location.href = `mailto:${email}`
  }
  public render() {
    return (
      <Button disabled={this.state.disabled} onClick={this.getUserEmail}>
        Email
      </Button>
    )
  }
}
