import React, { useEffect, useState } from 'react'
import { Form } from 'react-final-form'
import { useParams } from 'react-router'
import { ARRAY_ERROR, FORM_ERROR } from 'final-form'
import arrayMutators from 'final-form-arrays'
import { toJS } from 'mobx'
import { Button } from 'oa-components'
import { UnsavedChangesDialog } from 'src/common/Form/UnsavedChangesDialog'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { logger } from 'src/logger'
import { isModuleSupported, MODULE } from 'src/modules'
import { ProfileType } from 'src/modules/profile/types'
import { Flex } from 'theme-ui'
import { v4 as uuid } from 'uuid'

import { buttons } from '../../labels'
import INITIAL_VALUES from '../../Template'
import { CollectionSection } from './Collection.section'
import { FlexSectionContainer } from './elements'
import { ExpertiseSection } from './Expertise.section'
import { FocusSection } from './Focus.section'
import { PublicContactSection } from './PublicContact.section'
import { SettingsFormNotifications } from './SettingsFormNotifications'
import { UserImagesSection } from './UserImages.section'
import { UserInfosSection } from './UserInfos.section'
import { WorkspaceSection } from './Workspace.section'

import type { IUserPP } from 'src/models/userPreciousPlastic.models'
import type { IFormNotification } from './SettingsFormNotifications'

interface IState {
  formValues: IUserPP
  showDeleteDialog?: boolean
  showLocationDropdown: boolean
  user?: IUserPP
}

export const UserProfile = () => {
  const { userStore } = useCommonStores().stores
  const [state, setState] = useState<IState>({} as any)
  const [notification, setNotification] = useState<IFormNotification>({
    message: '',
    icon: '',
    show: false,
    variant: 'success',
  })
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(true)
  const { id } = useParams()

  useEffect(() => {
    let user = userStore.user as IUserPP

    const init = async () => {
      if (!shouldUpdate) return
      if (id) {
        user = await userStore.getUserProfile(id)
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
      })
      setShouldUpdate(false)
    }

    init()
  }, [shouldUpdate])

  const saveProfile = async (values: IUserPP) => {
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
    if (!v.coverImages[0] && v.profileType !== ProfileType.MEMBER) {
      errors.coverImages = []
      errors.coverImages[ARRAY_ERROR] = 'Must have at least one cover image'
    }
    if (!v.links[0]) {
      errors.links = []
      errors.links[ARRAY_ERROR] = 'Must have at least one link'
    }
    return errors
  }

  const coverImages = new Array(4)
    .fill(null)
    .map((v, i) => (user?.coverImages[i] ? user?.coverImages[i] : v))

  const links = (
    user && user?.links?.length > 0 ? user.links : [{} as any]
  ).map((i) => ({
    ...i,
    key: uuid(),
  }))

  const initialValues = {
    profileType: user?.profileType || ProfileType.MEMBER,
    displayName: user?.displayName || null,
    links,
    location: user?.location || null,
    about: user?.about || null,
    openingHours: user?.openingHours || [{}],
    workspaceType: user?.workspaceType || null,
    collectedPlasticTypes: user?.collectedPlasticTypes || null,
    machineBuilderXp: user?.machineBuilderXp || null,
    isContactableByPublic:
      user?.isContactableByPublic || DEFAULT_PUBLIC_CONTACT_PREFERENCE,
    userImage: user?.userImage || null,
    coverImages,
  }

  const formId = 'userProfileForm'

  if (!user) return

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

        const isMember = values.profileType === ProfileType.MEMBER

        return (
          <Flex sx={{ flexDirection: 'column', gap: 4 }}>
            <UnsavedChangesDialog hasChanges={dirty && !submitSucceeded} />

            <SettingsFormNotifications
              errors={errors}
              notification={notification}
              submitFailed={submitFailed}
            />

            <form id={formId} onSubmit={handleSubmit}>
              <Flex sx={{ flexDirection: 'column', gap: 4 }}>
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

                <UserInfosSection formValues={values} />

                {!isMember && (
                  <PublicContactSection
                    isContactableByPublic={values.isContactableByPublic}
                  />
                )}

                <UserImagesSection isMemberProfile={isMember} values={values} />
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
              sx={{ alignSelf: 'flex-start', paddingTop: 4 }}
            >
              {buttons.save}
            </Button>
          </Flex>
        )
      }}
    />
  )
}
