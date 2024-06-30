import { Button } from '@onearmy.apps/components'
import { IModerationStatus } from '@onearmy.apps/shared'
import { Flex, Text } from 'theme-ui'

import { buttons } from '../../labels'

import type { FormApi } from 'final-form'

interface IProps {
  form: FormApi
  formId: string
  moderation: IModerationStatus
  submitting: boolean
}

export const HowtoButtonDraft = (props: IProps) => {
  const { form, formId, moderation, submitting } = props
  const { create, description, update } = buttons.draft

  const text = moderation !== IModerationStatus.DRAFT ? create : update

  return (
    <Flex sx={{ flexDirection: 'column', alignItems: 'center' }}>
      <Button
        data-cy="draft"
        onClick={() => form.mutators.setAllowDraftSaveTrue()}
        mt={[0, 0, 3]}
        variant="secondary"
        type="submit"
        disabled={submitting}
        sx={{ width: '100%', display: 'block' }}
        form={formId}
      >
        <span>{text}</span>
      </Button>
      <Text sx={{ fontSize: 1, textAlign: 'center' }}>{description}</Text>
    </Flex>
  )
}
