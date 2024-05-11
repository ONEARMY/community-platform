import React, { useEffect, useState } from 'react'
import { Form } from 'react-final-form'
import { ARRAY_ERROR, FORM_ERROR } from 'final-form'
import arrayMutators from 'final-form-arrays'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { Button, Loader, TextNotification } from 'oa-components'
import { IModerationStatus } from 'oa-shared'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isPreciousPlastic } from 'src/config/config'
import { logger } from 'src/logger'
import { isModuleSupported, MODULE } from 'src/modules'
import { ProfileType } from 'src/modules/profile/types'
import { Alert, Box, Card, Flex, Heading, Text } from 'theme-ui'
import { v4 as uuid } from 'uuid'

import { AccountSettingsSection } from './content/formSections/AccountSettings.section'
import { CollectionSection } from './content/formSections/Collection.section'
import { EmailNotificationsSection } from './content/formSections/EmailNotifications.section'
import { ExpertiseSection } from './content/formSections/Expertise.section'
import { FocusSection } from './content/formSections/Focus.section'
import { ImpactSection } from './content/formSections/Impact/Impact.section'
import { MemberMapPinSection } from './content/formSections/MemberMapPin.section'
import { PatreonIntegration } from './content/formSections/PatreonIntegration'
import { PublicContactSection } from './content/formSections/PublicContact.section'
import { SettingsErrors } from './content/formSections/SettingsErrors'
import { UserInfosSection } from './content/formSections/UserInfos.section'
import { WorkspaceSection } from './content/formSections/Workspace.section'
import { WorkspaceMapPinSection } from './content/formSections/WorkspaceMapPin.section'
import { ProfileGuidelines } from './content/PostingGuidelines'
import { buttons, headings } from './labels'
import INITIAL_VALUES from './Template'

import type { IMapPin } from 'src/models'
import type { IUserPP } from 'src/models/userPreciousPlastic.models'

interface IProps {
  /** user ID for lookup when editing another user as admin */
  adminEditableUserId?: string
}

interface IState {
  formValues: IUserPP
  notification: { message: string; icon: string; show: boolean }
  showDeleteDialog?: boolean
  showLocationDropdown: boolean
  user?: IUserPP
  userMapPin: IMapPin | null
  showFormSubmitResult: boolean
}

const MapPinModerationComments = (props: { mapPin: IMapPin | null }) => {
  const { mapPin } = props
  return mapPin?.comments &&
    mapPin.moderation == IModerationStatus.IMPROVEMENTS_NEEDED ? (
    <Alert variant="info" sx={{ mt: 3, fontSize: 2, textAlign: 'left' }}>
      <Box>
        This map pin has been marked as requiring further changes. Specifically
        the moderator comments are:
        <br />
        <em>{mapPin?.comments}</em>
      </Box>
    </Alert>
  ) : null
}

export const SettingsPage = observer((props: IProps) => {
  const { mapsStore, userStore } = useCommonStores().stores
  const [state, setState] = useState<IState>({} as any)

  const toggleLocationDropdown = () => {
    setState((prevState) => ({
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

  useEffect(() => {
    let user = userStore.user as IUserPP
    let userMapPin: IMapPin | null = null

    const init = async () => {
      if (props.adminEditableUserId) {
        user = await userStore.getUserProfile(props.adminEditableUserId)
      }

      if (isModuleSupported(MODULE.MAP)) {
        userMapPin = (await mapsStore.getPin(user.userName)) || null
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

      // remove as updated by sub-form
      if (formValues.impact) {
        delete formValues.impact
      }

      setState({
        formValues,
        notification: { message: '', icon: '', show: false },
        user,
        showLocationDropdown: !user?.location?.latlng,
        showFormSubmitResult: false,
        userMapPin,
      })
    }

    init()
  }, [])

  const saveProfile = async (values: IUserPP) => {
    // use a copy of values to allow manipulation without re-render
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
      const { adminEditableUserId } = props
      await userStore.updateUserProfile(
        vals,
        'settings-save-profile',
        adminEditableUserId,
      )
      logger.debug(`before setState`)
      setState((state) => ({
        ...state,
        notification: { message: 'Profile Saved', icon: 'check', show: true },
      }))
      return {}
    } catch (error) {
      logger.warn({ error, profile: vals }, 'SettingsPage.saveProfile.error')
      setState((state) => ({
        ...state,
        notification: { message: 'Save Failed', icon: 'close', show: true },
      }))
      return { [FORM_ERROR]: 'Save Failed' }
    }
  }

  /**
   * Check for additional erros not caught by standard validation
   * Return any errors as json object
   */
  const validateForm = (v: IUserPP) => {
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

  const { formValues, user, userMapPin } = state

  return user ? (
    <Form
      onSubmit={(v) =>
        // return any errors (or success) on submit
        saveProfile(v).then((res) => {
          return res
        })
      }
      initialValues={formValues}
      validate={(v) => validateForm(v)}
      mutators={{
        ...arrayMutators,
      }}
      validateOnBlur
      render={({
        form,
        submitFailed,
        submitting,
        values,
        handleSubmit,
        hasValidationErrors,
        valid,
        errors,
        ...rest
      }) => {
        const { createProfile, editProfile } = headings
        const heading = user.profileType ? editProfile : createProfile
        const isMember = values.profileType === ProfileType.MEMBER

        return (
          <Flex mx={-2} bg={'inherit'} sx={{ flexWrap: 'wrap' }}>
            <UnsavedChangesDialog
              uploadComplete={userStore.updateStatus.Complete}
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
                    <Card
                      sx={{
                        background: 'softblue',
                      }}
                    >
                      <Flex px={3} py={2}>
                        <Heading as="h1">{heading}</Heading>
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

                    <UserInfosSection
                      formValues={values}
                      mutators={form.mutators}
                      showLocationDropdown={state.showLocationDropdown}
                    />

                    {!isMember && isModuleSupported(MODULE.MAP) && (
                      <WorkspaceMapPinSection>
                        <MapPinModerationComments mapPin={userMapPin} />
                      </WorkspaceMapPinSection>
                    )}

                    {isMember && isModuleSupported(MODULE.MAP) && (
                      <MemberMapPinSection
                        toggleLocationDropdown={toggleLocationDropdown}
                      >
                        <MapPinModerationComments mapPin={userMapPin} />
                      </MemberMapPinSection>
                    )}
                  </Flex>

                  {!isMember && isPreciousPlastic() && <ImpactSection />}

                  <EmailNotificationsSection
                    notificationSettings={values.notification_settings}
                  />
                  {!isMember && (
                    <PublicContactSection
                      isContactableByPublic={values.isContactableByPublic}
                    />
                  )}
                  <PatreonIntegration user={user} />
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
                      setState((state) => ({
                        ...state,
                        showFormSubmitResult: true,
                      }))
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
                  {buttons.save}
                </Button>

                <SettingsErrors
                  errors={errors}
                  isVisible={submitFailed && hasValidationErrors}
                />

                {state.showFormSubmitResult && valid && (
                  <TextNotification
                    isVisible={state.showFormSubmitResult}
                    variant={valid ? 'success' : 'failure'}
                  >
                    <Text>{buttons.success}</Text>
                  </TextNotification>
                )}
              </Box>
            </Flex>
          </Flex>
        )
      }}
    />
  ) : (
    <Loader />
  )
})
