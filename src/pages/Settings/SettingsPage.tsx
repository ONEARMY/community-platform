import * as React from 'react'
import { Card, Flex, Heading, Box, Text } from 'theme-ui'
import type { IUserPP } from 'src/models/userPreciousPlastic.models'
import type { ThemeStore } from 'src/stores/Theme/theme.store'
import type { UserStore } from 'src/stores/User/user.store'
import { observer, inject } from 'mobx-react'
import { UserInfosSection } from './content/formSections/UserInfos.section'
import { FocusSection } from './content/formSections/Focus.section'
import { ExpertiseSection } from './content/formSections/Expertise.section'
import { WorkspaceSection } from './content/formSections/Workspace.section'
import { CollectionSection } from './content/formSections/Collection.section'
import { AccountSettingsSection } from './content/formSections/AccountSettings.section'
import { EmailNotificationsSection } from './content/formSections/EmailNotifications.section'
import { Button, TextNotification } from 'oa-components'
import { ProfileGuidelines } from './content/PostingGuidelines'
import { Form } from 'react-final-form'
import { ARRAY_ERROR, FORM_ERROR } from 'final-form'
import arrayMutators from 'final-form-arrays'
import { WorkspaceMapPinSection } from './content/formSections/WorkspaceMapPin.section'
import { MemberMapPinSection } from './content/formSections/MemberMapPin.section'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles
import INITIAL_VALUES from './Template'
import { toJS } from 'mobx'
import { isModuleSupported, MODULE } from 'src/modules'
import { logger } from 'src/logger'
import { ProfileType } from 'src/modules/profile/types'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { v4 as uuid } from 'uuid'

interface IProps {
  /** user ID for lookup when editing another user as admin */
  adminEditableUserId?: string
}

interface IInjectedProps extends IProps {
  userStore: UserStore
  themeStore: ThemeStore
}

interface IState {
  formValues: IUserPP
  notification: { message: string; icon: string; show: boolean }
  showDeleteDialog?: boolean
  showLocationDropdown: boolean
  user?: IUserPP
  showFormSubmitResult: boolean
}

@inject('userStore')
@observer
export class SettingsPage extends React.Component<IProps, IState> {
  toggleLocationDropdown = () => {
    this.setState((prevState) => ({
      ...prevState,
      showLocationDropdown: !prevState.showLocationDropdown,
      formValues: {
        ...prevState.formValues,
        mapPinDescription: '',
        location: null,
        country: null,
      },
    }))
  }
  constructor(props: IProps) {
    super(props)
    this.state = {} as any
  }
  async componentDidMount() {
    let user = this.injected.userStore.user as IUserPP
    if (this.props.adminEditableUserId) {
      user = await this.injected.userStore.getUserProfile(
        this.props.adminEditableUserId,
      )
    }

    // ensure user form includes all user fields (merge any legacy user with correct format)
    const baseValues: IUserPP = {
      ...INITIAL_VALUES,
      // use toJS to avoid mobx monitoring of modified fields (e.g. out of bound arrays on link push)
      ...toJS(user),
    }
    const { coverImages, openingHours, links } = baseValues
    // replace empty arrays with placeholders for filling forms
    const formValues: IUserPP = {
      ...baseValues,
      coverImages: new Array(4)
        .fill(null)
        .map((v, i) => (coverImages[i] ? coverImages[i] : v)),
      links: (links.length > 0 ? links : [{} as any]).map((i) => ({
        ...i,
        key: uuid(),
      })),
      openingHours: openingHours!.length > 0 ? openingHours : [{} as any],
    }
    this.setState({
      formValues,
      notification: { message: '', icon: '', show: false },
      user,
      showLocationDropdown: !user?.location?.latlng,
      showFormSubmitResult: false,
    })
  }

  get injected() {
    return this.props as IInjectedProps
  }

  public async saveProfile(values: IUserPP) {
    // use a copy of values to allow manipulsation without re-render
    const vals = { ...values }
    // remove empty images
    vals.coverImages = (vals.coverImages as any[]).filter((cover) =>
      cover ? true : false,
    )
    // // Remove undefined vals from obj before sending to firebase
    Object.keys(vals).forEach((key) => {
      if (vals[key] === undefined) {
        delete vals[key]
      }
    })
    // Submit, show notification update and return any errors to form
    try {
      logger.debug({ profile: vals }, 'SettingsPage.saveProfile')
      const { adminEditableUserId } = this.props
      await this.injected.userStore.updateUserProfile(vals, adminEditableUserId)
      logger.debug(`before setState`)
      this.setState(
        {
          notification: { message: 'Profile Saved', icon: 'check', show: true },
        },
        () => {
          logger.debug(`After setState`, this.state.notification)
        },
      )
      return {}
    } catch (error) {
      logger.warn({ error, profile: vals }, 'SettingsPage.saveProfile.error')
      this.setState({
        notification: { message: 'Save Failed', icon: 'close', show: true },
      })
      return { [FORM_ERROR]: 'Save Failed' }
    }
  }

  /**
   * Check for additional erros not caught by standard validation
   * Return any errors as json object
   */
  public validateForm(v: IUserPP) {
    const errors: any = {}
    // must have at least 1 cover (awkard react final form array format)
    if (!v.coverImages[0]) {
      errors.coverImages = []
      errors.coverImages[ARRAY_ERROR] = 'Must have at least one cover image'
    }
    if (!v.links[0]) {
      errors.links = []
      errors.links[ARRAY_ERROR] = 'Must have at least one link'
    }
    return errors
  }

  render() {
    const { formValues, user } = this.state
    return user ? (
      <Form
        onSubmit={(v) =>
          // return any errors (or success) on submit
          this.saveProfile(v).then((res) => {
            return res
          })
        }
        initialValues={formValues}
        validate={(v) => this.validateForm(v)}
        mutators={{
          ...arrayMutators,
        }}
        validateOnBlur
        render={({
          form,
          submitting,
          values,
          handleSubmit,
          valid,
          errors,
          ...rest
        }) => {
          const heading = user.profileType ? 'Edit profile' : 'Create profile'
          return (
            <Flex mx={-2} bg={'inherit'} sx={{ flexWrap: 'wrap' }}>
              <UnsavedChangesDialog
                uploadComplete={this.injected.userStore.updateStatus.Complete}
                message={
                  'You are leaving this page without saving. Do you want to continue ?'
                }
              />
              <Flex
                sx={{
                  width: ['100%', '100%', `${(2 / 3) * 100}%`],
                  my: 4,
                  bg: 'inherit',
                  px: 2,
                }}
              >
                <Box sx={{ width: '100%' }}>
                  <form id="userProfileForm" onSubmit={handleSubmit}>
                    <Flex sx={{ flexDirection: 'column' }}>
                      <Card bg={theme.colors.softblue}>
                        <Flex px={3} py={2}>
                          <Heading>{heading}</Heading>
                        </Flex>
                      </Card>
                      <Box
                        sx={{
                          display: ['block', 'block', 'none'],
                          mt: 3,
                        }}
                      >
                        <ProfileGuidelines />
                      </Box>
                      {/* Note - for fields without fieldwrapper can just render via props method and bind to input */}
                      {isModuleSupported(MODULE.MAP) && <FocusSection />}

                      {/* Specific profile type fields */}
                      {values.profileType === ProfileType.WORKSPACE && (
                        <WorkspaceSection />
                      )}
                      {values.profileType === ProfileType.COLLECTION_POINT && (
                        <CollectionSection
                          required={
                            values.collectedPlasticTypes
                              ? values.collectedPlasticTypes.length === 0
                              : true
                          }
                          formValues={values}
                        />
                      )}
                      {values.profileType === ProfileType.MACHINE_BUILDER && (
                        <ExpertiseSection
                          required={
                            values.machineBuilderXp
                              ? values.machineBuilderXp.length === 0
                              : true
                          }
                        />
                      )}
                      {/* General fields */}
                      {values.profileType !== ProfileType.MEMBER &&
                        isModuleSupported(MODULE.MAP) && (
                          <WorkspaceMapPinSection />
                        )}

                      {values.profileType === ProfileType.MEMBER &&
                        isModuleSupported(MODULE.MAP) && (
                          <MemberMapPinSection
                            toggleLocationDropdown={this.toggleLocationDropdown}
                          />
                        )}
                      <UserInfosSection
                        formValues={values}
                        mutators={form.mutators}
                        showLocationDropdown={this.state.showLocationDropdown}
                      />
                    </Flex>
                    <AuthWrapper roleRequired="beta-tester">
                      <EmailNotificationsSection
                        notificationSettings={values.notification_settings}
                      />
                    </AuthWrapper>
                  </form>
                  <AccountSettingsSection />
                </Box>
              </Flex>
              {/* desktop guidelines container */}
              <Flex
                sx={{
                  width: ['100%', '100%', `${100 / 3}%`],
                  flexDirection: 'column',
                  bg: 'inherit',
                  px: 2,
                  height: 'auto',
                  mt: [0, 0, 4],
                }}
              >
                <Box
                  sx={{
                    position: ['relative', 'relative', 'sticky'],
                    top: 3,
                    maxWidth: ['100%', '100%', '400px'],
                  }}
                >
                  {isModuleSupported(MODULE.MAP) && (
                    <Box mb={3} sx={{ display: ['none', 'none', 'block'] }}>
                      <ProfileGuidelines />
                    </Box>
                  )}
                  <Button
                    large
                    data-cy="save"
                    title={
                      rest.invalid
                        ? `Errors: ${Object.keys(errors || {})}`
                        : 'Submit'
                    }
                    onClick={() => {
                      // workaround for issues described:
                      // https://github.com/final-form/react-final-form/blob/master/docs/faq.md#how-can-i-trigger-a-submit-from-outside-my-form
                      const formEl = document.getElementById('userProfileForm')
                      if (typeof formEl !== 'undefined' && formEl !== null) {
                        this.setState({
                          showFormSubmitResult: true,
                        })
                        formEl.dispatchEvent(
                          new Event('submit', {
                            cancelable: true,
                            bubbles: true,
                          }),
                        )
                      }
                    }}
                    mb={3}
                    sx={{ width: '100%', justifyContent: 'center' }}
                    variant={'primary'}
                    type="submit"
                    // disable button when form invalid or during submit.
                    // ensure enabled after submit error
                    disabled={submitting}
                  >
                    Save profile
                  </Button>
                  {this.state.showFormSubmitResult && (
                    <TextNotification
                      isVisible={this.state.showFormSubmitResult}
                      variant={valid ? 'success' : 'failure'}
                    >
                      <Text>
                        {valid ? (
                          <>Profile saved successfully</>
                        ) : (
                          <>
                            Ouch, something's wrong. Make sure all fields are
                            filled correctly to save your profile.
                          </>
                        )}
                      </Text>
                    </TextNotification>
                  )}
                </Box>
              </Flex>
            </Flex>
          )
        }}
      />
    ) : null
  }
}
