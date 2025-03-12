import { useState } from 'react'
import { Form } from 'react-final-form'
import { ARRAY_ERROR } from 'final-form'
import arrayMutators from 'final-form-arrays'
import { toJS } from 'mobx'
import { Button, Loader } from 'oa-components'
import { ProfileTypeList } from 'oa-shared'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { logger } from 'src/logger'
import { isContactable, isMessagingBlocked } from 'src/utils/helpers'
import { Flex } from 'theme-ui'

import { FocusSection } from './content/sections/Focus.section'
import { PublicContactSection } from './content/sections/PublicContact.section'
import { UserImagesSection } from './content/sections/UserImages.section'
import { UserInfosSection } from './content/sections/UserInfos.section'
import { SettingsFormNotifications } from './content/SettingsFormNotifications'
import { buttons } from './labels'

import type { IUser } from 'oa-shared'
import type { IFormNotification } from './content/SettingsFormNotifications'

export const SettingsPageUserProfile = () => {
  const [notification, setNotification] = useState<
    IFormNotification | undefined
  >(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { userStore } = useCommonStores().stores
  const user = toJS(userStore.activeUser)

  if (!user) return null

  const saveProfile = async (values: IUser) => {
    setIsLoading(true)

    const toUpdate = {
      _id: user._id,
      ...values,
    }

    toUpdate.coverImages = (toUpdate.coverImages as any[]).filter((cover) =>
      cover ? true : false,
    )

    toUpdate.links = toUpdate.links || []

    try {
      logger.debug({ profile: toUpdate }, 'SettingsPage.saveProfile')
      await userStore.updateUserProfile(toUpdate, 'settings-save-profile')

      setNotification({
        message: 'Profile Saved',
        icon: 'check',
        show: true,
        variant: 'success',
      })
    } catch (error) {
      logger.warn(
        { error, profile: toUpdate },
        'SettingsPage.saveProfile.error',
      )
      setNotification({
        message: `Save Failed - ${error}`,
        icon: 'close',
        show: true,
        variant: 'failure',
      })
    }
    setIsLoading(false)
  }

  const validateForm = (v: IUser) => {
    const errors: any = {}
    // must have at least 1 cover (awkard react final form array format)
    if (!v.coverImages[0] && v.profileType !== ProfileTypeList.MEMBER) {
      errors.coverImages = []
      errors.coverImages[ARRAY_ERROR] = 'Must have at least one cover image'
    }
    return errors
  }

  const emptyArray = new Array(4).fill(null)
  const coverImages = user.coverImages
    ? emptyArray.map((v, i) => (user.coverImages[i] ? user.coverImages[i] : v))
    : emptyArray

  const initialValues = {
    profileType: user.profileType || ProfileTypeList.MEMBER,
    displayName: user.displayName || null,
    userName: user.userName,
    links: user.links || [],
    location: user.location || null,
    about: user.about || null,
    isContactableByPublic: isContactable(user.isContactableByPublic),
    userImage: user.userImage || null,
    coverImages,
    tags: user.tags || {},
  }

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
      }) => {
        if (isLoading) return <Loader sx={{ alignSelf: 'center' }} />

        const isMember = values.profileType === ProfileTypeList.MEMBER

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

                <UserImagesSection isMemberProfile={isMember} values={values} />

                {!isMessagingBlocked() && (
                  <PublicContactSection
                    isContactableByPublic={values.isContactableByPublic}
                  />
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
