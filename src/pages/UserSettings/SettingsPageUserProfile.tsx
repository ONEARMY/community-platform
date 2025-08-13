import { useMemo, useState } from 'react'
import { Form } from 'react-final-form'
import arrayMutators from 'final-form-arrays'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { Button, Loader } from 'oa-components'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { logger } from 'src/logger'
import { profileService } from 'src/services/profileService'
import { useProfileStore } from 'src/stores/Profile/profile.store'
import { isContactable, isMessagingModuleOff } from 'src/utils/helpers'
import { Flex } from 'theme-ui'

import { ProfileTypeSection } from './content/sections/ProfileType.section'
import { PublicContactSection } from './content/sections/PublicContact.section'
import { UserImagesSection } from './content/sections/UserImages.section'
import { UserInfosSection } from './content/sections/UserInfos.section'
import { VisitorSection } from './content/sections/VisitorSection'
import { SettingsFormNotifications } from './content/SettingsFormNotifications'
import { buttons } from './labels'

import type { ProfileFormData } from 'oa-shared'
import type { IFormNotification } from './content/SettingsFormNotifications'

export const SettingsPageUserProfile = observer(() => {
  const [notification, setNotification] = useState<
    IFormNotification | undefined
  >(undefined)

  const { profileTypes, profile, update } = useProfileStore()

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
      type: profile.type?.name || 'member',
      displayName: profile.displayName || '',
      userName: profile.username,
      about: profile.about || '',
      isContactable: isContactable(profile.isContactable),
      coverImages: coverImages,
      existingCoverImages: existingCoverImages,
      existingPhoto: profile.photo ? toJS(profile.photo) : undefined,
      country: profile.country,
      showVisitorPolicy: !!profile.visitorPolicy,
      visitorPreferencePolicy: profile.visitorPolicy?.policy,
      visitorPreferenceDetails: profile.visitorPolicy?.details,
      website: profile.website || '',
      tagIds: profile.tags?.map((x) => x.id) || null,
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
        console.log({ profileTypes })
        const isMember = !profileTypes?.find((x) => x.name === values.type)
          ?.isSpace

        return (
          <Flex sx={{ flexDirection: 'column', gap: 4 }}>
            <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded} />
            {submitting && <Loader sx={{ alignSelf: 'center' }} />}
            <SettingsFormNotifications
              errors={errors}
              notification={notification}
              submitFailed={submitFailed}
            />

            <form id={formId} onSubmit={handleSubmit}>
              <Flex sx={{ flexDirection: 'column', gap: [4, 6] }}>
                <ProfileTypeSection profileTypes={profileTypes || []} />
                <UserInfosSection formValues={values} />
                <UserImagesSection
                  isMemberProfile={isMember}
                  values={values}
                  form={form}
                />

                {!isMember && (
                  <VisitorSection
                    visitorPolicy={
                      values.showVisitorPolicy
                        ? {
                            policy: values.visitorPreferencePolicy,
                            details: values.visitorPreferenceDetails,
                          }
                        : undefined
                    }
                  />
                )}

                {!isMessagingModuleOff() && (
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
              variant="primary"
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
})
