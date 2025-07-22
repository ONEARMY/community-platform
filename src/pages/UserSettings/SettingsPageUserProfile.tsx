import { useMemo, useState } from 'react'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { toJS } from 'mobx'
import { Button, Loader } from 'oa-components'
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

  const { profile, update } = useProfileStore()

  if (!profile) {
    return null
  }

  const saveProfile = async (values: ProfileFormData) => {
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
  }

  const existingCoverImages = profile.coverImages?.map((x) => toJS(x))
  const coverImages = new Array(4 - (existingCoverImages?.length || 0))

  const initialValues = useMemo<ProfileFormData>(
    () => ({
      profileType: profile.type,
      displayName: profile.displayName || '',
      userName: profile.username,
      about: profile.about || '',
      isContactable: isContactable(profile.isContactable),
      coverImages: coverImages,
      existingCoverImages: existingCoverImages,
      existingPhoto: profile.photo ? toJS(profile.photo) : undefined,
      country: profile.country,
      showVisitorPolicy: !!profile.openToVisitors,
      type: profile.type,
      visitorPreferencePolicy: profile.openToVisitors?.policy,
      visitorPreferenceDetails: profile.openToVisitors?.details,
      website: profile.website || '',
      tagIds: profile.tags?.map((x) => x.id) || [],
    }),
    [],
  )
  const formId = 'userProfileForm'

  return (
    <Form
      id={formId}
      onSubmit={async (values) => await saveProfile(values)}
      initialValues={initialValues}
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
        const isMember = values.type === 'member'

        return (
          <Flex sx={{ flexDirection: 'column', gap: 4 }}>
            <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded} />

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
              variant="primary"
              type="submit"
              disabled={submitting}
              sx={{ alignSelf: 'flex-start' }}
            >
              {buttons.save}
            </Button>
            {submitting && <Loader sx={{ alignSelf: 'center' }} />}
            <SettingsFormNotifications
              errors={errors}
              notification={notification}
              submitFailed={submitFailed}
            />
          </Flex>
        )
      }}
    />
  )
}
