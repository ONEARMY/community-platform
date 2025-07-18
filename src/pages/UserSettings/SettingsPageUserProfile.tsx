import { useState } from 'react'
import { Form } from 'react-final-form'
import { ARRAY_ERROR } from 'final-form'
import arrayMutators from 'final-form-arrays'
import { Button, Loader } from 'oa-components'
import { ProfileTypeList } from 'oa-shared'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { logger } from 'src/logger'
import { profileService } from 'src/services/profileService'
import { useProfileStore } from 'src/stores/Profile/profile.store'
import { isContactable, isMessagingBlocked } from 'src/utils/helpers'
import { Flex } from 'theme-ui'

import { FocusSection } from './content/sections/Focus.section'
import { PublicContactSection } from './content/sections/PublicContact.section'
import { UserImagesSection } from './content/sections/UserImages.section'
import { UserInfosSection } from './content/sections/UserInfos.section'
import { VisitorSection } from './content/sections/VisitorSection'
import { SettingsFormNotifications } from './content/SettingsFormNotifications'
import { buttons } from './labels'

import type { ProfileFormData } from 'oa-shared'
import type { IFormNotification } from './content/SettingsFormNotifications'

export const SettingsPageUserProfile = () => {
  const [notification, setNotification] = useState<
    IFormNotification | undefined
  >(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { profile, update } = useProfileStore()

  if (!profile) return null

  const saveProfile = async (values: ProfileFormData) => {
    setIsLoading(true)

    values.coverImages = values.coverImages?.filter((cover) => !!cover) || []

    try {
      const updatedProfile = await profileService.update(values)

      update(updatedProfile) // update local store

      setNotification({
        message: 'Profile Saved',
        icon: 'check',
        show: true,
        variant: 'success',
      })
    } catch (error) {
      logger.error(error, 'SettingsPage.saveProfile.error')
      setNotification({
        message: `Save Failed - ${error}`,
        icon: 'close',
        show: true,
        variant: 'failure',
      })
    }
    setIsLoading(false)
  }

  const validateForm = (v: ProfileFormData) => {
    const errors: any = {}
    // must have at least 1 cover (awkward react final form array format)
    if (!v.coverImages?.at(0) && v.type !== ProfileTypeList.MEMBER) {
      errors.coverImages = []
      errors.coverImages[ARRAY_ERROR] = 'Must have at least one cover image'
    }
    return errors
  }

  const emptyArray = new Array(4).fill(null)
  const coverImages = profile.coverImages
    ? emptyArray.map((v, i) =>
        profile.coverImages?.at(i) ? profile.coverImages[i] : v,
      )
    : emptyArray

  const initialValues = {
    profileType: profile.type,
    displayName: profile.displayName || null,
    userName: profile.username,
    about: profile.about || null,
    isContactable: isContactable(profile.isContactable),
    coverImages,
    existingPhoto: profile.photo,
    country: profile.country,
    showVisitorPolicy: !!profile.openToVisitors,
    type: profile.type,
    visitorPreferencePolicy: profile.openToVisitors?.policy,
    visitorPreferenceDetails: profile.openToVisitors?.details,
    website: profile.website,
    tagIds: profile.tags?.map((x) => x.id) || [],
  } as ProfileFormData

  const formId = 'userProfileForm'

  return (
    <Form
      id={formId}
      onSubmit={async (values) => await saveProfile(values)}
      initialValues={initialValues}
      validate={validateForm}
      mutators={{ ...arrayMutators }}
      validateOnBlur
      render={({
        dirty,
        submitFailed,
        submitting,
        submitSucceeded,
        values,
        handleSubmit,
        invalid,
        errors,
        form,
      }) => {
        if (isLoading) {
          return <Loader sx={{ alignSelf: 'center' }} />
        }

        const isMember = values.type === 'member'

        return (
          <Flex sx={{ flexDirection: 'column', gap: 4 }}>
            <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded} />

            <SettingsFormNotifications
              errors={errors}
              notification={notification}
              submitFailed={submitFailed}
            />

            <form id={formId} onSubmit={handleSubmit}>
              <Flex sx={{ flexDirection: 'column', gap: [4, 6] }}>
                <FocusSection />
                <UserInfosSection formValues={values} />
                <UserImagesSection
                  isMemberProfile={isMember}
                  values={values}
                  form={form}
                />

                {!isMember && (
                  <VisitorSection
                    openToVisitors={{
                      policy: values.visitorPreferencePolicy,
                      details: values.visitorPreferenceDetails,
                    }}
                  />
                )}

                {!isMessagingBlocked() && (
                  <PublicContactSection isContactable={values.isContactable} />
                )}
              </Flex>
            </form>

            <Button
              large
              form={formId}
              data-cy="save"
              title={
                invalid ? `Errors: ${Object.keys(errors || {})}` : 'Submit'
              }
              onClick={() => window.scrollTo(0, 0)}
              variant={'primary'}
              type="submit"
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
}
