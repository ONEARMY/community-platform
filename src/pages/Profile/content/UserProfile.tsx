import * as React from 'react'
import { Box } from 'rebass'
import { IUser, IUserFormInput } from 'src/models/user.models'
import { Button } from 'src/components/Button'
import { ProfileEditForm } from './ProfileEditForm'
import { UserStore } from 'src/stores/User/user.store'

interface IProps {
  user: IUser
  userStore: UserStore
}
interface IState {
  editMode: boolean
  isSaving: boolean
}
export class UserProfile extends React.Component<IProps, IState> {
  userFormValues: IUserFormInput
  constructor(props: IProps) {
    super(props)
    this.state = { editMode: false, isSaving: false }
  }
  public async saveProfile() {
    console.log('saving profile', this.userFormValues)
    this.setState({ isSaving: true })
    await this.props.userStore.updateUserProfile(this.userFormValues)
    this.setState({ editMode: false, isSaving: false })
  }
  // want to track form values in child component so can trigger save from parent
  public profileFormValueChanged(values: IUserFormInput) {
    this.userFormValues = values
  }
  public render() {
    const user = this.props.user
    return (
      <>
        <Box mb={2}>
          {this.state.editMode ? (
            <Button
              variant={'outline'}
              m={0}
              icon={'check'}
              style={{ float: 'right' }}
              disabled={this.state.isSaving}
              onClick={() => this.saveProfile()}
            >
              Save Profile
            </Button>
          ) : (
            <Button
              variant={'outline'}
              m={0}
              icon={'edit'}
              style={{ float: 'right' }}
              onClick={() => this.setState({ editMode: true })}
              disabled={this.state.isSaving}
            >
              Edit Profile
            </Button>
          )}

          <ProfileEditForm
            user={user}
            readOnly={!this.state.editMode}
            onChange={formValues => this.profileFormValueChanged(formValues)}
            userStore={this.props.userStore}
          />

          <></>
        </Box>
      </>
    )
  }
}
