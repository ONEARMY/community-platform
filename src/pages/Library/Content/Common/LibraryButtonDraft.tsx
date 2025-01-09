import { Button } from 'oa-components'
import { Flex, Text } from 'theme-ui'

import { buttons } from '../../labels'

import type { FormApi } from 'final-form'
import type { IModerationStatus } from 'oa-shared'

interface IProps {
  form: FormApi
  formId: string
  moderation: IModerationStatus
  submitting: boolean
}

export const LibraryButtonDraft = (props: IProps) => {
  const { form, formId, submitting } = props
  const { create, description } = buttons.draft

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
        <span>{create}</span>
      </Button>
      <Text sx={{ fontSize: 1, textAlign: 'center' }}>{description}</Text>
    </Flex>
  )
}
