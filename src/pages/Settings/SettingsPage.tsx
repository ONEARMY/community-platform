import * as React from 'react'
import Flex from 'src/components/Flex'
import { IUserPP } from 'src/models/user_pp.models'
import { UserStore } from 'src/stores/User/user.store'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import { UserInfosSection } from './content/formSections/UserInfos.section'
import { ChangePasswordForm } from './content/formSections/ChangePassword.form'
import { ImportDHForm } from './content/formSections/ImportDH.form'
import { FocusSection } from './content/formSections/Focus.section'
import { ExpertiseSection } from './content/formSections/Expertise.section'
import { WorkspaceSection } from './content/formSections/Workspace.section'
import { CollectionSection } from './content/formSections/Collection.section'
import { Button } from 'src/components/Button'
import { PostingGuidelines } from './content/PostingGuidelines'
import Heading from 'src/components/Heading'

import { TextNotification } from 'src/components/Notification/TextNotification'
import { ProfileDelete } from './content/ProfileDelete'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { UserMapPinSection } from './content/formSections/MapPin.section'
import theme from 'src/themes/styled.theme'
import { INITIAL_VALUES } from './Template'
import { Box } from 'rebass'

export interface IFormValues extends Partial<IUserPP> {
  // form values are simply subset of user profile fields
}
interface IProps {
  user: IUserPP
  userStore: UserStore
}
interface IInjectedProps extends IProps {
  userStore: UserStore
}

interface IState {
  editMode: boolean
  customFormValues: IFormValues
  user: IUserPP
  showNotification: boolean
  showDeleteDialog?: boolean
}

@inject('userStore')
@observer
export class UserSettings extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const user = this.injected.userStore.user
    this.state = {
      editMode: false,
      customFormValues: user ? user : {},
      showNotification: false,
      user: props.user,
    }
  }

  get injected() {
    return this.props as IInjectedProps
  }

  public async saveProfile(values: any) {
    const formValuesConcat = { ...values, ...this.state.customFormValues }
    await this.injected.userStore.updateUserProfile(formValuesConcat)
    this.setState({ showNotification: true })
  }

  public showSaveNotification() {
    this.setState({ showNotification: true })
  }

  public deleteProfile(reauthPw: string) {
    this.props.userStore.deleteUser(reauthPw)
  }

  render() {
    const user = this.injected.userStore.user!
    const { customFormValues } = this.state
    const readOnly = !this.state.editMode
    // Need to convert mobx observable user object into a Javasrcipt structure using toJS fn
    // to allow final-form-array to display the initial values
    const initialFormValues = user.profileType
      ? toJS(user)
      : { ...toJS(user), ...INITIAL_VALUES }

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
                <form
                  id="userProfileForm"
                  onSubmit={handleSubmit}
                  style={{ width: '100%' }}
                >
                  {/* How To Info */}
                  <Flex flexDirection={'column'}>
                    <Flex
                      card
                      mediumRadius
                      bg={theme.colors.softblue}
                      px={3}
                      py={2}
                    >
                      <Heading medium>Edit profile</Heading>
                    </Flex>
                    <FocusSection
                      user={user}
                      onInputChange={v =>
                        this.setState({
                          customFormValues: {
                            ...this.state.customFormValues,
                            profileType: v,
                          },
                        })
                      }
                    />
                    {customFormValues.profileType === 'workspace' && (
                      <>
                        <WorkspaceSection
                          user={user}
                          onInputChange={v =>
                            this.setState({
                              customFormValues: {
                                ...this.state.customFormValues,
                                workspaceType: v,
                              },
                            })
                          }
                        />
                        <UserInfosSection user={user} />
                        <UserMapPinSection user={user} />
                      </>
                    )}
                    {customFormValues.profileType === 'collection-point' && (
                      <>
                        <UserInfosSection user={user} />
                        <CollectionSection
                          onInputChange={v => console.log(v)}
                        />
                        <UserMapPinSection user={user} />
                      </>
                    )}
                    {customFormValues.profileType === 'community-builder' && (
                      <>
                        <UserInfosSection user={user} />
                        <UserMapPinSection user={user} />
                      </>
                    )}
                    {customFormValues.profileType === 'machine-builder' && (
                      <>
                        <UserInfosSection user={user} />
                        <ExpertiseSection />
                        <UserMapPinSection user={user} />
                      </>
                    )}
                    {customFormValues.profileType === 'member' && (
                      <>
                        <UserInfosSection user={user} />
                      </>
                    )}
                    {customFormValues.profileType === undefined && <></>}

                    {/* <Flex
                      card
                      mediumRadius
                      bg={'white'}
                      mt={5}
                      p={4}
                      flexWrap="wrap"
                      flexDirection="column"
                    >
                      <Heading small>
                        Import profile from davehakkens.nl
                      </Heading>
                      <Text mb={3}>{this.state.user.userName}</Text>
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
                      <Heading small>Account settings</Heading>
                       <ChangePasswordForm
                        {...readOnly}
                        userStore={this.props.userStore}
                      /> 
                    </Flex>*/}
                  </Flex>
                </form>
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
                <Box sx={{ position: 'fixed', maxWidth: '400px' }}>
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
                </Box>
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
