import * as React from 'react'
import Flex from 'src/components/Flex'
import { IUserPP } from 'src/models/user_pp.models'
import type { ThemeStore } from 'src/stores/Theme/theme.store'
import type { UserStore } from 'src/stores/User/user.store'
import { observer, inject } from 'mobx-react'
import { UserInfosSection } from './content/formSections/UserInfos.section'
import { FocusSection } from './content/formSections/Focus.section'
import { ExpertiseSection } from './content/formSections/Expertise.section'
import { WorkspaceSection } from './content/formSections/Workspace.section'
import { CollectionSection } from './content/formSections/Collection.section'
import { AccountSettingsSection } from './content/formSections/AccountSettings.section'
import { Button } from 'oa-components'
import { ProfileGuidelines } from './content/PostingGuidelines'
import Heading from 'src/components/Heading'
import { TextNotification } from 'src/components/Notification/TextNotification'
import { Form } from 'react-final-form'
import { ARRAY_ERROR, FORM_ERROR } from 'final-form'
import arrayMutators from 'final-form-arrays'
import { WorkspaceMapPinSection } from './content/formSections/WorkspaceMapPin.section'
import { MemberMapPinSection } from './content/formSections/MemberMapPin.section'
import theme from 'src/themes/styled.theme'
import INITIAL_VALUES from './Template'
import { Box } from 'rebass'
import { Prompt } from 'react-router'
import { toJS } from 'mobx'
import { isModuleSupported, MODULE } from 'src/modules'
import { logger } from 'src/logger'

interface IProps {}

interface IInjectedProps extends IProps {
  userStore: UserStore,
  themeStore: ThemeStore
}

interface IState {
  formValues: IUserPP
  notification: { message: string; icon: string; show: boolean }
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
    const { coverImages, openingHours, links } = baseValues
    // replace empty arrays with placeholders for filling forms
    const formValues: IUserPP = {
      ...baseValues,
      coverImages: new Array(4)
        .fill(null)
        .map((v, i) => (coverImages[i] ? coverImages[i] : v)),
      links: links.length > 0 ? links : [{} as any],
      openingHours: openingHours!.length > 0 ? openingHours : [{} as any],
    }
    this.state = {
      formValues,
      notification: { message: '', icon: '', show: false },
    }
  }

  get injected() {
    return this.props as IInjectedProps
  }

  public async saveProfile(values: IUserPP) {
    // use a copy of values to allow manipulsation without re-render
    const vals = { ...values }
    // remove empty images
    vals.coverImages = (vals.coverImages as any[]).filter(cover =>
      cover ? true : false,
    )
    // // Remove undefined vals from obj before sending to firebase
    Object.keys(vals).forEach(key => {
      if (vals[key] === undefined) {
        delete vals[key]
      }
    })
    // Submit, show notification update and return any errors to form
    try {
      logger.debug({profile: vals}, 'UserSettings.saveProfile');
      await this.injected.userStore.updateUserProfile(vals)
      this.setState({
        notification: { message: 'Profile Saved', icon: 'check', show: true },
      })
      return {}
    } catch (error) {
      logger.warn({error, profile: vals}, 'UserSettings.saveProfile.error')
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
    const user = this.injected.userStore.user
    const { formValues, notification } = this.state
    return (
      user && (
        <Form
          onSubmit={v =>
            // return any errors (or success) on submit
            this.saveProfile(v).then(res => {
              return res
            })
          }
          initialValues={formValues}
          validate={v => this.validateForm(v)}
          mutators={{
            ...arrayMutators,
          }}
          validateOnBlur
          render={({
            form,
            submitting,
            values,
            handleSubmit,
            submitError,
            valid,
            errors,
            ...rest
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
                        {isModuleSupported(MODULE.MAP) && <FocusSection />}
                        
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
                        {(values.profileType !== 'member' && isModuleSupported(MODULE.MAP)) && (
                          <WorkspaceMapPinSection />
                        )}

                        {(values.profileType === 'member' && isModuleSupported(MODULE.MAP)) && (
                          <MemberMapPinSection />
                        )}
                        <UserInfosSection
                          formValues={values}
                          mutators={form.mutators}
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
                    {isModuleSupported(MODULE.MAP) && (<Box mb={3}
                       sx={{ display: ['none', 'none', 'block'] }}>
                      <ProfileGuidelines />
                    </Box>)}
                    <Button
                      data-cy="save"
                      title={
                        rest.invalid
                          ? `Errors: ${Object.keys(errors || {})}`
                          : 'Submit'
                      }
                      onClick={() => {
                        // workaround for issues described:
                        // https://github.com/final-form/react-final-form/blob/master/docs/faq.md#how-can-i-trigger-a-submit-from-outside-my-form
                        const formEl = document.getElementById(
                          'userProfileForm',
                        )
                        if (typeof formEl !== 'undefined' && formEl !== null) {
                          formEl.dispatchEvent(
                            new Event('submit', {
                              cancelable: true,
                              bubbles: true,
                            }),
                          )
                        }
                      }}
                      width={1}
                      variant={'primary'}
                      type="submit"
                      // disable button when form invalid or during submit.
                      // ensure enabled after submit error
                      disabled={submitError ? false : !valid || submitting}
                    >
                      Save profile
                    </Button>
                    <div style={{ float: 'right' }}>
                      <TextNotification
                        data-cy="profile-saved"
                        text={notification.message}
                        icon={submitError ? 'close' : 'check'}
                        show={notification.show}
                        hideNotificationCb={() =>
                          this.setState({
                            notification: { ...notification, show: false },
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
