import * as React from 'react'
import Flex from 'src/components/Flex'
import { IUserPP } from 'src/models/user_pp.models'
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
    this.setState({
      customFormValues: {
        ...this.state.customFormValues,
        profileType: v,
        workspaceType: null,
      },
      isFocusSelected: true,
    })
  }
  public onWorkspaceTypeChange(v) {
    this.setState({
      customFormValues: {
        ...this.state.customFormValues,
        workspaceType: v,
      },
      isWTSelected: true,
    })
  }
  public checkSubmitErrors() {
    if (!this.state.customFormValues.profileType) {
      this.setState({ isFocusSelected: false })
    }
    if (!this.state.customFormValues.workspaceType) {
      this.setState({ isWTSelected: false })
    }
    if (
      this.state.customFormValues.profileType !== 'member' &&
      !this.state.customFormValues.location
    ) {
      this.setState({ isLocationSelected: false })
    }
  }

  render() {
    const user = this.injected.userStore.user
    const {
      initialFormValues,
      isFocusSelected,
      isWTSelected,
      isLocationSelected,
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
                        user={user}
                        onInputChange={v => this.onFocusChange(v)}
                        showSubmitErrors={!isFocusSelected}
                      />
                      {initialFormValues.profileType === 'workspace' && (
                        <>
                          <WorkspaceSection
                            user={user}
                            onInputChange={v => this.onWorkspaceTypeChange(v)}
                            showSubmitErrors={!isWTSelected}
                          />
                          <UserInfosSection
                            onCoverImgChange={v => this.onCoverImgChange(v)}
                            user={user}
                          />
                          <UserMapPinSection
                            onInputChange={v => this.updateLocation(v)}
                            user={user}
                            showSubmitErrors={!isLocationSelected}
                          />
                        </>
                      )}
                      {initialFormValues.profileType === 'collection-point' && (
                        <>
                          <UserInfosSection
                            onCoverImgChange={v => this.onCoverImgChange(v)}
                            user={user}
                          />
                          <CollectionSection
                            required={
                              values.collectedPlasticTypes
                                ? values.collectedPlasticTypes.length === 0
                                : true
                            }
                            user={user}
                          />
                          <UserMapPinSection
                            onInputChange={v => this.updateLocation(v)}
                            user={user}
                            showSubmitErrors={!isLocationSelected}
                          />
                        </>
                      )}
                      {initialFormValues.profileType ===
                        'community-builder' && (
                        <>
                          <UserInfosSection
                            onCoverImgChange={v => this.onCoverImgChange(v)}
                            user={user}
                          />
                          <UserMapPinSection
                            onInputChange={v => this.updateLocation(v)}
                            user={user}
                            showSubmitErrors={!isLocationSelected}
                          />
                        </>
                      )}
                      {initialFormValues.profileType === 'machine-builder' && (
                        <>
                          <UserInfosSection
                            onCoverImgChange={v => this.onCoverImgChange(v)}
                            user={user}
                          />
                          <ExpertiseSection
                            required={
                              values.machineBuilderXp
                                ? values.machineBuilderXp.length === 0
                                : true
                            }
                            user={user}
                          />
                          <UserMapPinSection
                            onInputChange={v => this.updateLocation(v)}
                            user={user}
                            showSubmitErrors={!isLocationSelected}
                          />
                        </>
                      )}
                      {initialFormValues.profileType === 'member' && (
                        <>
                          <UserInfosSection
                            onCoverImgChange={v => this.onCoverImgChange(v)}
                            user={user}
                          />
                        </>
                      )}
                      {initialFormValues.profileType === undefined && <></>}
                    </Flex>
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
