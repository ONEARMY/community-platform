import { useEffect, useState } from 'react'
import { Field, Form } from 'react-final-form'
import {
  GridForm,
  InformationTooltip,
  InternalLink,
  Loader,
} from 'oa-components'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { UserContactError } from 'src/pages/User/contact'
import { form } from 'src/pages/UserSettings/labels'
import { notificationsPreferencesService } from 'src/services/notificationsPreferencesService'
import { Button, Flex } from 'theme-ui'

import type { DBNotificationsPreferences } from 'oa-shared'
import type { SubmitResults } from 'src/pages/User/contact/UserContactError'

const formId = 'SupabaseNotifications'

export const SupabaseNotifications = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [initialValues, setInitialValues] =
    useState<DBNotificationsPreferences | null>(null)
  const [submitResults, setSubmitResults] = useState<SubmitResults | null>(null)

  const { userStore } = useCommonStores().stores
  const user = userStore.activeUser
  const hasMessagingOn =
    user?.isContactableByPublic === undefined
      ? true
      : user?.isContactableByPublic

  const getPreferences = async () => {
    const preferences = await notificationsPreferencesService.getPreferences()
    setInitialValues(preferences)
    setIsLoading(false)
  }

  useEffect(() => {
    getPreferences()
  }, [])

  const onSubmit = async (values: DBNotificationsPreferences) => {
    setIsLoading(true)
    setSubmitResults(null)

    try {
      await notificationsPreferencesService.setPreferences(values)
      await getPreferences()
      setSubmitResults({
        type: 'success',
        message: form.saveNotificationPreferences,
      })
    } catch (error) {
      setSubmitResults({ type: 'error', message: error.message })
    }
  }

  if (!user) return null

  return (
    <Form
      id={formId}
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ submitting, handleSubmit }) => {
        if (isLoading) return <Loader />

        return (
          <Flex sx={{ flexDirection: 'column', gap: 2 }}>
            <UserContactError submitResults={submitResults} />

            <GridForm
              fields={[
                {
                  component: (
                    <Field
                      component="input"
                      data-cy={`${formId}-field-comments`}
                      initialValue={initialValues?.comments}
                      name="comments"
                      type="checkbox"
                    />
                  ),
                  description:
                    'Top-level comments on your contributions or contributions you follow',
                  glyph: 'discussion',
                  name: 'New comments',
                },
                {
                  component: (
                    <Field
                      component="input"
                      data-cy={`${formId}-field-replies`}
                      initialValue={initialValues?.replies}
                      name="replies"
                      type="checkbox"
                    />
                  ),
                  description:
                    "Replies under your comment or a comment thread that you follow. Note that you can always choose to follow or unfollow a single reply thread in the comment's options.",
                  glyph: 'arrow-curved-bottom-right',
                  name: 'New replies',
                },
                {
                  component: (
                    <Field
                      component="input"
                      data-cy={`${formId}-field-research_updates`}
                      initialValue={initialValues?.research_updates}
                      name="research_updates"
                      type="checkbox"
                    />
                  ),
                  description: 'Updates for the research that you follow.',
                  glyph: 'thunderbolt',
                  name: 'Research Updates',
                },
                {
                  component: (
                    <InternalLink
                      data-cy="messages-link"
                      to="/settings/profile/#public-contact"
                      sx={{ textAlign: 'center' }}
                    >
                      {hasMessagingOn
                        ? 'Stop receiving messages'
                        : 'Start receiving messages'}
                    </InternalLink>
                  ),
                  description: 'Through the contact form on your profile page',
                  glyph: 'comment',
                  name: 'Receiving messages',
                },
                {
                  component: (
                    <InformationTooltip
                      glyph="information"
                      size={22}
                      tooltip="Afriad we've got to send these to you, so you can't opt-out"
                    />
                  ),
                  description:
                    'Password resets, email verifications and other service emails',
                  glyph: 'email-outline',
                  name: 'Service emails',
                },
              ]}
              heading="We should email you about..."
            />
            <Button
              type="submit"
              form={formId}
              data-cy="save-notifications-preferences"
              variant="primary"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{ alignSelf: 'flex-start' }}
            >
              Update preferences
            </Button>
          </Flex>
        )
      }}
    />
  )
}
