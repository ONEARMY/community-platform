import * as React from 'react'
import { Box } from 'rebass'
import { IUser } from 'src/models/user.models'
import { UserStore } from 'src/stores/User/user.store'
import { ProfileEditForm } from './ProfileEdit.form'
import { ChangePasswordForm } from './ChangePassword.form'
import { ImportDHForm } from './ImportDH.form'

interface IProps {
  user: IUser
  userStore: UserStore
}
interface IState {
  editMode: boolean
  isSaving: boolean
  user: IUser
}
export class UserProfile extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { editMode: false, isSaving: false, user: props.user }
  }

  public render() {
    const readOnly = !this.state.editMode
    return (
      <Box mb={2}>
        {/* TODO - add avatar edit form */}
        <ProfileEditForm />
        {/* TODO - add email verification resend button (if user email not verified) */}
        <ChangePasswordForm {...readOnly} userStore={this.props.userStore} />
        <ImportDHForm userStore={this.props.userStore} {...readOnly} />
      </Box>
    )
  }
}
