import * as React from 'react'
import Flex from 'src/components/Flex'
import { IUserPP } from 'src/models/user_pp.models'
import { UserStore } from 'src/stores/User/user.store'
import { observer, inject } from 'mobx-react'
import { UserInfosSection } from './content/formSections/UserInfos.section'
import { FocusSection } from './content/formSections/Focus.section'
import { ExpertiseSection } from './content/formSections/Expertise.section'
import { WorkspaceSection } from './content/formSections/Workspace.section'
import { CollectionSection } from './content/formSections/Collection.section'
import { AccountSettingsSection } from './content/formSections/AccountSettings.section'
import { Button } from 'src/components/Button'
import { ProfileGuidelines } from './content/PostingGuidelines'
import Heading from 'src/components/Heading'
import { TextNotification } from 'src/components/Notification/TextNotification'
import { Form, Field } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { UserMapPinSection } from './content/formSections/MapPin.section'
import theme from 'src/themes/styled.theme'
import INITIAL_VALUES from './Template'
import { Box } from 'rebass'
import { ILocation } from 'src/models/common.models'
import { addProtocol } from 'src/utils/validators'
import { Prompt } from 'react-router'
import { toJS } from 'mobx'
import { IUser } from 'src/models/user.models'

interface IProps {}

interface IInjectedProps extends IProps {
  userStore: UserStore
}

interface IState {
  formValues: IUserPP
  showNotification: boolean
  showDeleteDialog?: boolean
}

@inject('userStore')
@observer
export class UserSettings extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const user = this.injected.userStore.user as IUserPP

    // ensure user form includes all user fields (merge any legacy user with correct format)
    const baseValues: IUserPP = {
      ...INITIAL_VALUES,
      // use toJS to avoid mobx monitoring of modified fields (e.g. out of bound arrays on link push)
      ...toJS(user),
    }
    const { coverImages, openingHours, links, location } = baseValues
    // replace empty arrays with placeholders for filling forms
    const formValues: IUserPP = {
      ...baseValues,
      coverImages: new Array(4)
        .fill(null)
        .map((v, i) => (coverImages[i] ? coverImages[i] : v)),
      links: links.length > 0 ? links : [{} as any],
      openingHours: openingHours!.length > 0 ? openingHours : [{} as any],
    }
    console.log('formValues', formValues)
    this.state = {
      formValues,
      showNotification: false,
    }
  }

  get injected() {
    return this.props as IInjectedProps
  }

  public async saveProfile(values: IUserPP) {
    // remove empty images
    values.coverImages = (values.coverImages as any[]).filter(cover =>
      cover ? true : false,
    )
    // Remove undefined values from obj before sending to firebase
    Object.keys(values).forEach(key => {
      if (values[key] === undefined) {
        delete values[key]
      }
    })
    await this.injected.userStore.updateUserProfile(values)
    this.setState({ showNotification: true, formValues: values })
  }

  public showSaveNotification() {
    this.setState({ showNotification: true })
  }

  public checkSubmitErrors() {
    // TODO
  }

  render() {
    const user = this.injected.userStore.user
    const { formValues } = this.state
    return (
      user && (
        <Form
          onSubmit={v => this.saveProfile(v)}
          initialValues={formValues}
          mutators={{
            ...arrayMutators,
            addProtocol,
          }}
          validateOnBlur
          render={({
            form: { mutators },
            submitting,
            values,
            handleSubmit,
          }) => {
            return (
              <Flex mx={-2} bg={'inherit'} flexWrap="wrap">
                <Prompt
                  when={!this.injected.userStore.updateStatus.Complete}
                  message={
                    'You are leaving this page without saving. Do you want to continue ?'
                  }
                />
                <Flex
                  width={[1, 1, 2 / 3]}
                  sx={{
                    my: 4,
                    bg: 'inherit',
                    px: 2,
                  }}
                >
                  <Box width="100%">
                    <form id="userProfileForm" onSubmit={handleSubmit}>
                      <Flex flexDirection={'column'}>
                        <Flex
                          card
                          mediumRadius
                          bg={theme.colors.softblue}
                          px={3}
                          py={2}
                        >
                          {user.profileType ? (
                            <Heading medium>Edit profile</Heading>
                          ) : (
                            <Heading medium>Create profile</Heading>
                          )}
                        </Flex>
                        <Box
                          sx={{
                            display: ['block', 'block', 'none'],
                            mt: 3,
                          }}
                        >
                          <ProfileGuidelines />
                        </Box>
                        {/* Note - for fields without fieldwrapper can just render via props method and bind to input */}
                        <FocusSection />
                        {/* Specific profile type fields */}
                        {values.profileType === 'workspace' && (
                          <WorkspaceSection />
                        )}
                        {values.profileType === 'collection-point' && (
                          <CollectionSection
                            required={
                              values.collectedPlasticTypes
                                ? values.collectedPlasticTypes.length === 0
                                : true
                            }
                            formValues={values}
                          />
                        )}
                        {values.profileType === 'machine-builder' && (
                          <ExpertiseSection
                            required={
                              values.machineBuilderXp
                                ? values.machineBuilderXp.length === 0
                                : true
                            }
                          />
                        )}
                        {/* General fields */}
                        {values.profileType !== 'member' && (
                          <UserMapPinSection />
                        )}
                        <UserInfosSection
                          formValues={values}
                          mutators={mutators}
                        />
                      </Flex>
                    </form>
                    <AccountSettingsSection />
                  </Box>
                </Flex>
                {/* desktop guidelines container */}
                <Flex
                  width={[1, 1, 1 / 3]}
                  sx={{
                    flexDirection: 'column',
                    bg: 'inherit',
                    px: 2,
                    height: '100%',
                    mt: [0, 0, 4],
                  }}
                >
                  <Box
                    sx={{
                      position: ['relative', 'relative', 'fixed'],
                      maxWidth: ['100%', '100%', '400px'],
                    }}
                  >
                    <Box sx={{ display: ['none', 'none', 'block'] }}>
                      <ProfileGuidelines />
                    </Box>
                    <Button
                      data-cy="save"
                      onClick={() => {
                        if (
                          !formValues.profileType ||
                          (formValues.profileType === 'workspace' &&
                            !formValues.workspaceType)
                        ) {
                          this.checkSubmitErrors()
                        } else {
                          const form = document.getElementById(
                            'userProfileForm',
                          )
                          if (typeof form !== 'undefined' && form !== null) {
                            form.dispatchEvent(
                              new Event('submit', { cancelable: true }),
                            )
                          }
                        }
                      }}
                      width={1}
                      my={3}
                      variant={'primary'}
                      type="submit"
                      disabled={submitting}
                    >
                      Save profile
                    </Button>
                    <div style={{ float: 'right' }}>
                      <TextNotification
                        data-cy="profile-saved"
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
      )
    )
  }
}
