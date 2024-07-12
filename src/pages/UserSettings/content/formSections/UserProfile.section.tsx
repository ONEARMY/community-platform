import React, { useEffect, useState } from 'react'
import { Form } from 'react-final-form'
import { useParams } from 'react-router'
import { ARRAY_ERROR, FORM_ERROR } from 'final-form'
import arrayMutators from 'final-form-arrays'
import { toJS } from 'mobx'
import { Button, ExternalLink, TextNotification } from 'oa-components'
import { IModerationStatus } from 'oa-shared'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { logger } from 'src/logger'
import { isModuleSupported, MODULE } from 'src/modules'
import { ProfileType } from 'src/modules/profile/types'
import { Alert, Box, Flex, Text } from 'theme-ui'
import { v4 as uuid } from 'uuid'

import { buttons, headings } from '../../labels'
import INITIAL_VALUES from '../../Template'
import { CollectionSection } from './Collection.section'
import { FlexSectionContainer } from './elements'
import { EmailNotificationsSection } from './EmailNotifications.section'
import { ExpertiseSection } from './Expertise.section'
import { FocusSection } from './Focus.section'
import { PatreonIntegration } from './PatreonIntegration'
import { PublicContactSection } from './PublicContact.section'
import { SettingsErrors } from './SettingsErrors'
import { SettingsMapPinSection } from './SettingsMapPinSection'
import { UserInfosSection } from './UserInfos.section'
import { WorkspaceSection } from './Workspace.section'

import type { IMapPin } from 'src/models'
import type { IUserPP } from 'src/models/userPreciousPlastic.models'

interface IState {
  formValues: IUserPP
  showDeleteDialog?: boolean
  showLocationDropdown: boolean
  user?: IUserPP
  userMapPin: IMapPin | null
}

type INotification = {
  message: string
  icon: string
  show: boolean
  variant: 'success' | 'failure'
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

const WorkspaceMapPinRequiredStars = () => {
  const { description } = headings.workspace
  const { themeStore } = useCommonStores().stores

  return (
    <Alert sx={{ fontSize: 2, textAlign: 'left', my: 2 }} variant="failure">
      <Box>
        <ExternalLink
          href={themeStore?.currentTheme.styles.communityProgramURL}
          sx={{ textDecoration: 'underline', color: 'currentcolor' }}
        >
          {description}
        </ExternalLink>
      </Box>
    </Alert>
  )
}

export const UserProfile = () => {
  const { mapsStore, userStore } = useCommonStores().stores
  const [state, setState] = useState<IState>({} as any)
  const [notification, setNotification] = useState<INotification>({
    message: '',
    icon: '',
    show: false,
    variant: 'success',
  })
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(true)
  const { id } = useParams()

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
      if (!shouldUpdate) return
      if (id) {
        user = await userStore.getUserProfile(id)
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
        user,
        showLocationDropdown: !user?.location?.latlng,
        userMapPin,
      })
      setShouldUpdate(false)
    }

    init()
  }, [shouldUpdate])

  const saveProfile = async (values: IUserPP) => {
    window.scrollTo(0, 0)
    const vals = { ...values }
    vals.coverImages = (vals.coverImages as any[]).filter((cover) =>
      cover ? true : false,
    )
    // Remove undefined vals from obj before sending to firebase
    Object.keys(vals).forEach((key) => {
      if (vals[key] === undefined) {
        delete vals[key]
      }
    })

    try {
      logger.debug({ profile: vals }, 'SettingsPage.saveProfile')
      await userStore.updateUserProfile(vals, 'settings-save-profile', id)

      setShouldUpdate(true)
      return setNotification({
        message: 'Profile Saved',
        icon: 'check',
        show: true,
        variant: 'success',
      })
    } catch (error) {
      logger.warn({ error, profile: vals }, 'SettingsPage.saveProfile.error')
      setNotification({
        message: 'Save Failed',
        icon: 'close',
        show: true,
        variant: 'failure',
      })
      return { [FORM_ERROR]: 'Save Failed' }
    }
  }

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
  const formId = 'userProfileForm'

  return (
    user && (
      <Form
        id={formId}
        onSubmit={async (values) => await saveProfile(values)}
        initialValues={formValues}
        validate={validateForm}
        mutators={{ ...arrayMutators }}
        validateOnBlur
        render={({
          dirty,
          form,
          submitFailed,
          submitting,
          submitSucceeded,
          values,
          handleSubmit,
          invalid,
          errors,
        }) => {
          const isMember = values.profileType === ProfileType.MEMBER

          return (
            <Flex
              bg={'inherit'}
              sx={{ flexDirection: 'column', gap: 2 }}
            >
              <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded} />

              <>
                {notification.show && (
                  <TextNotification
                    isVisible={notification.show}
                    variant={notification.variant}
                  >
                    <Text>{buttons.success}</Text>
                  </TextNotification>
                )}
                {(errors || submitFailed) && (
                  <SettingsErrors
                    errors={errors}
                    isVisible={!!(errors && Object.keys(errors).length > 0)}
                  />
                )}
              </>

              <form id={formId} onSubmit={handleSubmit}>
                <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                  {isModuleSupported(MODULE.MAP) && <FocusSection />}

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

                  <UserInfosSection
                    formValues={values}
                    mutators={form.mutators}
                    showLocationDropdown={state.showLocationDropdown}
                  />

                  {isModuleSupported(MODULE.MAP) && (
                    <SettingsMapPinSection
                      toggleLocationDropdown={toggleLocationDropdown}
                    >
                      <MapPinModerationComments mapPin={userMapPin} />
                      {!isMember && <WorkspaceMapPinRequiredStars />}
                    </SettingsMapPinSection>
                  )}
                </Flex>

                <EmailNotificationsSection
                  notificationSettings={values.notification_settings}
                />
                {!isMember && (
                  <FlexSectionContainer>
                    <PublicContactSection
                      isContactableByPublic={values.isContactableByPublic}
                    />
                  </FlexSectionContainer>
                )}
                <PatreonIntegration user={user} />
              </form>

              <Button
                large
                form={formId}
                data-cy="save"
                title={
                  invalid ? `Errors: ${Object.keys(errors || {})}` : 'Submit'
                }
                variant={'primary'}
                type="submit"
                // disable button when form invalid or during submit.
                // ensure enabled after submit error
                disabled={submitting}
                sx={{ alignSelf: 'flex-start' }}
              >
                {buttons.save}
              </Button>
            </Flex>
          )
        }}
      />
    )
  )
}
