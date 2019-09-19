import * as React from 'react'
import Flex from 'src/components/Flex'
import { IUser } from 'src/models/user.models'
import { UserStore } from 'src/stores/User/user.store'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import { SettingsEditForm } from './content/SettingsEdit.form'
import { ChangePasswordForm } from './content/ChangePassword.form'
import { ImportDHForm } from './content/ImportDH.form'
import { Button } from 'src/components/Button'
import { PostingGuidelines } from './content/PostingGuidelines'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'

import styled from 'styled-components'
import { TextNotification } from 'src/components/Notification/TextNotification'
import { ProfileDelete } from './content/ProfileDelete'
import { Box, Image } from 'rebass'
import { InputField } from 'src/components/Form/Fields'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { UserMapPinEdit } from './content/UserMapPinEdit'
import CollectionBadge from 'src/assets/images/badges/pt-collection-point.jpg'
import MemberBadge from 'src/assets/images/badges/pt-member.jpg'
import MachineBadge from 'src/assets/images/badges/pt-machine-shop.jpg'
import WorkspaceBadge from 'src/assets/images/badges/pt-workspace.jpg'
import LocalComBadge from 'src/assets/images/badges/pt-local-community.jpg'

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
}

const FormContainer = styled.form`
  width: 100%;
`

const Label = styled.label`
  display: block;
  margin: 10px;
`

const InputStyles = { position: 'absolute', opacity: 0, width: 0, height: 0 }

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
                    <Flex
                      card
                      mediumRadius
                      bg={'white'}
                      mt={5}
                      flexWrap="wrap"
                      flexDirection="column"
                    >
                      <Heading small p={4}>
                        Focus
                      </Heading>
                      <Box px={4}>
                        <Text regular m={4}>
                          What is your main Precious Plastic activity?
                        </Text>
                        <Flex wrap="nowrap">
                          <Label htmlFor="pt-workspace">
                            <Field
                              id="pt-workspace"
                              name="title"
                              type="radio"
                              // validate={value => this.validateTitle(value)}
                              validateFields={[]}
                              component={InputField}
                              style={InputStyles}
                            />
                            <Image src={WorkspaceBadge} />
                            <Text small>I run a workspace</Text>
                          </Label>
                          <Label htmlFor="pt-community">
                            <Field
                              id="pt-community"
                              name="title"
                              type="radio"
                              // validate={value => this.validateTitle(value)}
                              validateFields={[]}
                              component={InputField}
                              style={InputStyles}
                            />
                            <Image src={LocalComBadge} />
                            <Text small>I run a local community</Text>
                          </Label>
                          <Label htmlFor="pt-collection">
                            <Field
                              id="pt-collection"
                              name="title"
                              type="radio"
                              // validate={value => this.validateTitle(value)}
                              validateFields={[]}
                              component={InputField}
                              style={InputStyles}
                            />
                            <Image src={CollectionBadge} />
                            <Text small>I collect & sort plastic</Text>
                          </Label>
                          <Label htmlFor="pt-machine">
                            <Field
                              id="pt-machine"
                              name="title"
                              type="radio"
                              // validate={value => this.validateTitle(value)}
                              validateFields={[]}
                              component={InputField}
                              style={InputStyles}
                            />
                            <Image src={MachineBadge} />
                            <Text small>I build machines</Text>
                          </Label>
                          <Label htmlFor="pt-member">
                            <Field
                              id="pt-member"
                              name="title"
                              type="radio"
                              // validate={value => this.validateTitle(value)}
                              validateFields={[]}
                              component={InputField}
                              style={InputStyles}
                            />
                            <Image src={MemberBadge} />
                            <Text small>I am a member</Text>
                          </Label>
                        </Flex>
                      </Box>
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
                    <SettingsEditForm user={user} />
                    <Flex
                      card
                      mediumRadius
                      bg={'white'}
                      mt={5}
                      p={4}
                      flexWrap="wrap"
                      flexDirection="column"
                    >
                      <UserMapPinEdit />
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
