import * as React from 'react'
import Flex from 'src/components/Flex'
import { IUserPP, IProfileType } from 'src/models/user_pp.models'
import { UserStore } from 'src/stores/User/user.store'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import { UserInfosSection } from './content/formSections/UserInfos.section'
import { FocusSection } from './content/formSections/Focus.section'
import { ExpertiseSection } from './content/formSections/Expertise.section'
import { WorkspaceSection } from './content/formSections/Workspace.section'
import { CollectionSection } from './content/formSections/Collection.section'
import { AccountSettingsSection } from './content/formSections/AccountSettings.section'
import { Button } from 'src/components/Button'
import {
  CreateProfileGuidelines,
  EditProfileGuidelines,
} from './content/PostingGuidelines'
import Heading from 'src/components/Heading'
import Text from 'src/components/Text'
import { Modal } from 'src/components/Modal/Modal'
import { TextNotification } from 'src/components/Notification/TextNotification'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { UserMapPinSection } from './content/formSections/MapPin.section'
import theme from 'src/themes/styled.theme'
import { INITIAL_VALUES } from './Template'
import { Box } from 'rebass'
import { ILocation } from 'src/models/common.models'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'

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
  customFormValues: Partial<IFormValues>
  initialFormValues: IFormValues
  user: IUserPP
  showNotification: boolean
  showDeleteDialog?: boolean
  isFocusSelected: boolean
  isWTSelected: boolean
  isLocationSelected: boolean
  showResetFocusModal: boolean
}

@inject('userStore')
@observer
export class UserSettings extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const user = this.injected.userStore.user
    const initValues =
      user && user.profileType
        ? toJS(user)
        : { ...toJS(user), ...INITIAL_VALUES }
    this.state = {
      initialFormValues: initValues,
      customFormValues: {},
      showNotification: false,
      user: props.user,
      isFocusSelected: user ? true : false,
      isLocationSelected: user ? user.location !== undefined : false,
      isWTSelected: true,
      showResetFocusModal: false,
    }
  }

  get injected() {
    return this.props as IInjectedProps
  }

  public async saveProfile(values: any) {
    const formValuesConcat = { ...values, ...this.state.customFormValues }
    // Remove undefined values from obj before sending to firebase
    Object.keys(formValuesConcat).forEach(key => {
      if (formValuesConcat[key] === undefined) {
        delete formValuesConcat[key]
      }
    })
    await this.injected.userStore.updateUserProfile(formValuesConcat)
    this.setState({ showNotification: true })
  }

  public showSaveNotification() {
    this.setState({ showNotification: true })
  }
  public updateLocation(l: ILocation) {
    this.setState({
      customFormValues: {
        ...this.state.customFormValues,
        location: l,
      },
      isLocationSelected: true,
    })
  }
  public onCoverImgChange(v: IConvertedFileMeta) {
    // TODO always use an array of coverImages (will do when allow multiple cover images)
    const coverImagesArray: IConvertedFileMeta[] = []
    coverImagesArray.push(v)
    this.setState({
      customFormValues: {
        ...this.state.customFormValues,
        coverImages: coverImagesArray,
      },
    })
  }
  public onFocusChange(v) {
    if (this.state.initialFormValues.profileType) {
      this.setState({
        showResetFocusModal: true,
        isFocusSelected: true,
      })
    } else {
      this.setState({
        initialFormValues: {
          ...this.state.initialFormValues,
          profileType: v,
        },
        isFocusSelected: true,
      })
    }
  }
  public onWorkspaceTypeChange(v) {
    this.setState({
      initialFormValues: {
        ...this.state.initialFormValues,
        workspaceType: v,
      },
      isWTSelected: true,
    })
  }
  public checkSubmitErrors() {
    if (!this.state.initialFormValues.profileType) {
      this.setState({ isFocusSelected: false })
    }
    if (!this.state.initialFormValues.workspaceType) {
      this.setState({ isWTSelected: false })
    }
    if (
      this.state.initialFormValues.profileType !== 'member' &&
      !this.state.initialFormValues.location
    ) {
      this.setState({ isLocationSelected: false })
    }
  }
  public onModalDismiss(confirmed: boolean) {
    if (confirmed) {
      // Reset the profile values to INITIAL_VALUES
      // but keep userRoles, verified and userName
      this.setState({
        initialFormValues: {
          ...INITIAL_VALUES,
          ...this.injected.userStore.user!.userRoles,
          verified: this.injected.userStore.user!.verified,
          userName: this.injected.userStore.user!.userName,
        },
        showResetFocusModal: false,
        isFocusSelected: false,
        isWTSelected: false,
      })
    } else {
      this.setState({
        showResetFocusModal: false,
        isFocusSelected: true,
      })
    }
  }

  render() {
    const user = this.injected.userStore.user
    const {
      initialFormValues,
      isFocusSelected,
      isWTSelected,
      isLocationSelected,
      showResetFocusModal,
    } = this.state

    return user ? (
      <Form
        onSubmit={v => this.saveProfile(v)}
        initialValues={initialFormValues}
        mutators={{
          ...arrayMutators,
        }}
        validateOnBlur
        render={({ submitting, values, invalid, errors, handleSubmit }) => {
          return (
            <Flex mx={-2} bg={'inherit'} flexWrap="wrap">
              <Flex bg="inherit" px={2} width={[1, 1, 2 / 3]} my={4}>
                <Box width="100%">
                  <form id="userProfileForm" onSubmit={handleSubmit}>
                    {/* How To Info */}
                    <Flex flexDirection={'column'}>
                      <Flex
                        card
                        mediumRadius
                        bg={theme.colors.softblue}
                        px={3}
                        py={2}
                      >
                        {!user.profileType ? (
                          <Heading medium>Create profile</Heading>
                        ) : (
                          <Heading medium>Edit profile</Heading>
                        )}
                      </Flex>
                      <FocusSection
                        initialFormValues={initialFormValues}
                        onInputChange={v => this.onFocusChange(v)}
                        isSelected={isFocusSelected}
                        showSubmitErrors={!isFocusSelected}
                      />
                      {initialFormValues.profileType === 'workspace' && (
                        <>
                          <WorkspaceSection
                            initialFormValues={initialFormValues}
                            onInputChange={v => this.onWorkspaceTypeChange(v)}
                            isSelected={isWTSelected}
                            showSubmitErrors={!isWTSelected}
                          />
                          <UserInfosSection
                            onCoverImgChange={v => this.onCoverImgChange(v)}
                            initialFormValues={initialFormValues}
                          />
                          <UserMapPinSection
                            onInputChange={v => this.updateLocation(v)}
                            initialFormValues={initialFormValues}
                            showSubmitErrors={!isLocationSelected}
                          />
                        </>
                      )}
                      {initialFormValues.profileType === 'collection-point' && (
                        <>
                          <UserInfosSection
                            onCoverImgChange={v => this.onCoverImgChange(v)}
                            initialFormValues={initialFormValues}
                          />
                          <CollectionSection
                            required={
                              values.collectedPlasticTypes
                                ? values.collectedPlasticTypes.length === 0
                                : true
                            }
                            initialFormValues={initialFormValues}
                          />
                          <UserMapPinSection
                            onInputChange={v => this.updateLocation(v)}
                            initialFormValues={initialFormValues}
                            showSubmitErrors={!isLocationSelected}
                          />
                        </>
                      )}
                      {initialFormValues.profileType ===
                        'community-builder' && (
                        <>
                          <UserInfosSection
                            onCoverImgChange={v => this.onCoverImgChange(v)}
                            initialFormValues={initialFormValues}
                          />
                          <UserMapPinSection
                            onInputChange={v => this.updateLocation(v)}
                            initialFormValues={initialFormValues}
                            showSubmitErrors={!isLocationSelected}
                          />
                        </>
                      )}
                      {initialFormValues.profileType === 'machine-builder' && (
                        <>
                          <UserInfosSection
                            onCoverImgChange={v => this.onCoverImgChange(v)}
                            initialFormValues={initialFormValues}
                          />
                          <ExpertiseSection
                            required={
                              values.machineBuilderXp
                                ? values.machineBuilderXp.length === 0
                                : true
                            }
                            initialFormValues={initialFormValues}
                          />
                          <UserMapPinSection
                            onInputChange={v => this.updateLocation(v)}
                            initialFormValues={initialFormValues}
                            showSubmitErrors={!isLocationSelected}
                          />
                        </>
                      )}
                      {initialFormValues.profileType === 'member' && (
                        <>
                          <UserInfosSection
                            onCoverImgChange={v => this.onCoverImgChange(v)}
                            initialFormValues={initialFormValues}
                          />
                        </>
                      )}
                      {initialFormValues.profileType === undefined && <></>}
                    </Flex>
                    {showResetFocusModal && (
                      <Modal
                        onDidDismiss={confirm => this.onModalDismiss(confirm)}
                      >
                        <Text my="10px">
                          Change your focus will reset your previous profile, do
                          you confirm ?
                        </Text>
                        <Button
                          onClick={() => {
                            this.onModalDismiss(false)
                          }}
                          variant="secondary"
                        >
                          cancel
                        </Button>
                        <Button
                          onClick={() => {
                            this.onModalDismiss(true)
                          }}
                          variant="tertiary"
                          ml={1}
                        >
                          Yes I confirm
                        </Button>
                      </Modal>
                    )}
                  </form>
                  <AccountSettingsSection />
                </Box>
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
                  {!user.profileType ? (
                    <CreateProfileGuidelines />
                  ) : (
                    <EditProfileGuidelines />
                  )}
                  <Button
                    data-cy="save"
                    onClick={() => {
                      if (
                        !initialFormValues.profileType ||
                        (initialFormValues.profileType === 'workspace' &&
                          !initialFormValues.workspaceType)
                      ) {
                        this.checkSubmitErrors()
                      } else {
                        const form = document.getElementById('userProfileForm')
                        if (typeof form !== 'undefined' && form !== null) {
                          form.dispatchEvent(
                            new Event('submit', { cancelable: true }),
                          )
                        }
                      }
                    }}
                    width={1}
                    mt={3}
                    variant={'primary'}
                    type="submit"
                    disabled={submitting}
                  >
                    Save profile
                  </Button>
                  <div style={{ float: 'right' }}>
                    <TextNotification
                      text="profile saved"
                      icon="check"
                      show={this.state.showNotification}
                      hideNotificationCb={() =>
                        this.setState({
                          showNotification: false,
                        })
                      }
                    />
                  </div>
                </Box>
              </Flex>
            </Flex>
          )
        }}
      />
    ) : null
  }
}
