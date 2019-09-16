import * as React from 'react'
import Flex from 'src/components/Flex'
import { IUser } from 'src/models/user.models'
import { UserStore } from 'src/stores/User/user.store'
import { SettingsEditForm } from './content/SettingsEdit.form'
import { ChangePasswordForm } from './content/ChangePassword.form'
import { ImportDHForm } from './content/ImportDH.form'
import { Button } from 'src/components/Button'
import { PostingGuidelines } from './content/PostingGuidelines'
import Heading from 'src/components/Heading'
import styled from 'styled-components'
import { TextNotification } from 'src/components/Notification/TextNotification'
import { ProfileDelete } from './content/ProfileDelete'

interface IProps {
  user: IUser
  userStore: UserStore
}
interface IState {
  editMode: boolean
  user: IUser
  showNotification: boolean
  showDeleteDialog?: boolean
}

const FormContainer = styled.div`
  width: 100%;
`
export class UserSettings extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { editMode: false, showNotification: false, user: props.user }
  }

  public showSaveNotification() {
    this.setState({ showNotification: true })
  }

  public deleteProfile(reauthPw: string) {
    this.props.userStore.deleteUser(reauthPw)
  }

  public render() {
    const readOnly = !this.state.editMode

    return (
      <Flex mx={-2} bg={'inherit'} flexWrap="wrap">
        <Flex bg="inherit" px={2} width={[1, 1, 2 / 3]} my={4}>
          <FormContainer>
            {/* How To Info */}
            <Flex flexDirection={'column'}>
              <Flex card mediumRadius bg={'softblue'} px={3} py={2}>
                <Heading medium>Edit profile</Heading>
              </Flex>
              <Flex
                card
                mediumRadius
                bg={'white'}
                mt={5}
                flexWrap="wrap"
                flexDirection="column"
              >
                <Heading small arrowDown p={4}>
                  Focus
                </Heading>
              </Flex>
              <Flex
                card
                mediumRadius
                bg={'white'}
                mt={5}
                p={4}
                flexWrap="wrap"
                flexDirection="column"
              >
                <Heading small>Workspace</Heading>
              </Flex>
              <Flex
                card
                mediumRadius
                bg={'white'}
                mt={5}
                p={4}
                flexWrap="wrap"
                flexDirection="column"
              >
                <Heading small>Info</Heading>
              </Flex>

              <Flex
                card
                mediumRadius
                bg={'white'}
                mt={5}
                p={4}
                flexWrap="wrap"
                flexDirection="column"
              >
                <Heading small mb={3}>
                  Import profile from davehakkens.nl
                </Heading>
                {/* <Text mb={3}>{this.state.user.userName}</Text> */}
                <ImportDHForm {...readOnly} />
              </Flex>
              <Flex
                card
                mediumRadius
                bg={'white'}
                mt={5}
                p={4}
                flexWrap="wrap"
                flexDirection="column"
              >
                <Heading small mb={3}>
                  Account settings
                </Heading>
                <ChangePasswordForm
                  {...readOnly}
                  userStore={this.props.userStore}
                />
              </Flex>
              <SettingsEditForm
                onProfileSave={() => this.showSaveNotification()}
              />
            </Flex>
          </FormContainer>
        </Flex>
        {/* post guidelines container */}
        <Flex
          flexDirection={'column'}
          width={[1, 1, 1 / 3]}
          height={'100%'}
          bg="inherit"
          px={2}
          mt={4}
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
            variant={'primary'}
            type="submit"
          >
            Save profile
          </Button>
          <div style={{ float: 'right' }}>
            <TextNotification
              text="profile saved"
              icon="check"
              show={this.state.showNotification}
            />
          </div>
        </Flex>
        <ProfileDelete
          onConfirmation={reauthPw => this.deleteProfile(reauthPw)}
        />
      </Flex>
    )
  }
}
