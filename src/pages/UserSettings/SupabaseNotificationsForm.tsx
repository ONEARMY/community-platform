import { Field, Form } from 'react-final-form'
import {
  GridForm,
  InformationTooltip,
  InternalLink,
  Loader,
} from 'oa-components'
import { UserContactError } from 'src/pages/User/contact'
import { Button, Flex } from 'theme-ui'

import type { GridFormFields } from 'oa-components'
import type { DBNotificationsPreferences } from 'oa-shared'
import type { SubmitResults } from 'src/pages/User/contact/UserContactError'

const formId = 'SupabaseNotifications'

interface IProps {
  initialValues: DBNotificationsPreferences | null
  isLoading: boolean
  hasMessagingOn?: boolean
  onSubmit: (values: DBNotificationsPreferences) => Promise<void>
  submitResults: SubmitResults | null
}

export const SupabaseNotificationsForm = (props: IProps) => {
  const { initialValues, isLoading, hasMessagingOn, onSubmit, submitResults } =
    props

  const fields: GridFormFields[] = [
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
  ]

  // Temp while firebase profiles are still active
  if (hasMessagingOn !== undefined) {
    fields.push({
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
    })
  }

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

            <GridForm fields={fields} heading="We should email you about..." />
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
