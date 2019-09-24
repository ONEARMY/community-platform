import * as React from 'react'
import Flex from 'src/components/Flex'
import { IUser } from 'src/models/user.models'
import { UserStore } from 'src/stores/User/user.store'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import { UserInfosSection } from './content/formSections/UserInfos.section'
import { ChangePasswordForm } from './content/formSections/ChangePassword.form'
import { ImportDHForm } from './content/formSections/ImportDH.form'
import { FocusSection } from './content/formSections/Focus.section'
import { WorkspaceSection } from './content/formSections/Workspace.section'
import { CollectionSection } from './content/formSections/Collection.section'
import { Button } from 'src/components/Button'
import { PostingGuidelines } from './content/PostingGuidelines'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'

import styled from 'styled-components'
import { TextNotification } from 'src/components/Notification/TextNotification'
import { ProfileDelete } from './content/ProfileDelete'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { UserMapPinSection } from './content/formSections/MapPin.section'

interface IFormValues extends Partial<IUser> {
  // form values are simply subset of user profile fields
}
interface IProps {
  user: IUser
  userStore: UserStore
}
interface IInjectedProps extends IProps {
  userStore: UserStore
}
interface IState {
  editMode: boolean
  formValues: IFormValues
  user: IUser
  showNotification: boolean
  showDeleteDialog?: boolean
  profileType?: string
}

const FormContainer = styled.form`
  width: 100%;
`

@inject('userStore')
@observer
export class UserSettings extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const user = this.injected.userStore.user
    this.state = {
      editMode: false,
      formValues: user ? user : {},
      showNotification: false,
      user: props.user,
    }
  }

  get injected() {
    return this.props as IInjectedProps
  }

  public async saveProfile(values: IFormValues) {
    console.log('profile values :', values)
    await this.injected.userStore.updateUserProfile(values)
    this.setState({ showNotification: true })
  }

  public showSaveNotification() {
    this.setState({ showNotification: true })
  }

  public deleteProfile(reauthPw: string) {
    this.props.userStore.deleteUser(reauthPw)
  }

  render() {
    const user = this.injected.userStore.user
    const { profileType } = this.state
    const readOnly = !this.state.editMode
    // Need to convert mobx observable user object into a Javasrcipt structure using toJS fn
    // to allow final-form-array to display the initial values
    const initialFormValues = toJS(user)

    return user ? (
      <Form
        onSubmit={v => this.saveProfile(v)}
        initialValues={initialFormValues}
        mutators={{
          ...arrayMutators,
        }}
        validateOnBlur
        render={({ submitting, values, invalid, errors, handleSubmit }) => {
          const disabled = invalid || submitting
          return (
            <Flex mx={-2} bg={'inherit'} flexWrap="wrap">
              <Flex bg="inherit" px={2} width={[1, 1, 2 / 3]} my={4}>
                <FormContainer>
                  {/* How To Info */}
                  <Flex flexDirection={'column'}>
                    <Flex card mediumRadius bg={'softblue'} px={3} py={2}>
                      <Heading medium>Edit profile</Heading>
                    </Flex>
                    <FocusSection
                      onInputChange={v => this.setState({ profileType: v })}
                    />
                    {profileType === 'pt-workspace' && (
                      <>
                        <WorkspaceSection />
                        <UserInfosSection user={user} />
                        <UserMapPinSection />
                      </>
                    )}
                    {profileType === 'pt-member' && (
                      <>
                        <UserInfosSection user={user} />
                      </>
                    )}
                    {profileType === undefined && (
                      <>
                        <WorkspaceSection />
                        <CollectionSection />
                        <UserInfosSection user={user} />
                        <UserMapPinSection />
                      </>
                    )}

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
                      {/* <ImportDHForm {...readOnly} /> */}
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
                      {/* <ChangePasswordForm
                        {...readOnly}
                        userStore={this.props.userStore}
                      /> */}
                    </Flex>
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
                      form.dispatchEvent(
                        new Event('submit', { cancelable: true }),
                      )
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
        }}
      />
    ) : null
  }
}
