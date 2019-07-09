import * as React from 'react'
import { BoxContainer } from 'src/components/Layout/BoxContainer'
import { FlexContainer } from 'src/components/Layout/FlexContainer'
import { IUser } from 'src/models/user.models'
import { UserStore } from 'src/stores/User/user.store'
import { SettingsEditForm } from './content/SettingsEdit.form'
import { ChangePasswordForm } from './content/ChangePassword.form'
import { ImportDHForm } from './content/ImportDH.form'
import { Button } from 'src/components/Button'
import { PostingGuidelines } from './content/PostingGuidelines'
import Heading from 'src/components/Heading'
import { TextNotification } from 'src/components/Notification/TextNotification'
import { Flex } from 'rebass'
import { Avatar } from 'src/components/Avatar'
import Text from 'src/components/Text'

interface IProps {
  user: IUser
  userStore: UserStore
}
interface IState {
  editMode: boolean
  user: IUser
  showNotification: boolean
}
export class UserSettings extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { editMode: false, showNotification: false, user: props.user }
  }

  public showSaveNotification() {
    this.setState({ showNotification: true })
  }

  public render() {
    const readOnly = !this.state.editMode
    console.log('user', this.state.user)

    return (
      <FlexContainer m={'0'} bg={'inherit'} flexWrap="wrap">
        <BoxContainer bg={'inherit'} p={'0'} width={[1, 1, 2 / 3]}>
          <BoxContainer mb={2}>
            <Heading small bold>
              Your details
            </Heading>
            <Flex alignItems={'center'}>
              <Avatar userName={this.state.user.userName} width="60px" />
              <Text inline bold ml={3}>
                {this.state.user.userName}
              </Text>
            </Flex>
            {/* TODO - add avatar edit form */}
            {/* TODO - add email verification resend button (if user email not verified) */}
            <ChangePasswordForm
              {...readOnly}
              userStore={this.props.userStore}
            />
            <ImportDHForm {...readOnly} />
          </BoxContainer>

          <SettingsEditForm onProfileSave={() => this.showSaveNotification()} />
        </BoxContainer>
        {/* post guidelines container */}
        <BoxContainer
          width={[1, 1, 1 / 3]}
          height={'100%'}
          bg="inherit"
          p={0}
          pl={2}
        >
          <PostingGuidelines />
          <Button
            onClick={() => {
              const form = document.getElementById('userProfileForm')
              if (typeof form !== 'undefined' && form !== null) {
                form.dispatchEvent(new Event('submit', { cancelable: true }))
              }
            }}
            width={1}
            mt={3}
            variant={'secondary'}
            type="submit"
          >
            save profile
          </Button>
          <div style={{ float: 'right' }}>
            <TextNotification
              text="profile saved"
              icon="check"
              show={this.state.showNotification}
            />
          </div>
        </BoxContainer>
      </FlexContainer>
    )
  }
}
