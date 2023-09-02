import { Button } from 'oa-components'

import { buttons } from '../../labels'

export const HowtoButtonPublish = (props) => {
  const { form, formId, submitting } = props

  return (
    <Button
      large
      data-cy={'submit'}
      data-testid="submit-form"
      onClick={() => form.mutators.setAllowDraftSaveFalse()}
      mt={3}
      variant="primary"
      type="submit"
      disabled={submitting}
      sx={{
        width: '100%',
        display: 'block',
        mb: ['40px', '40px', 0],
      }}
      form={formId}
    >
      {buttons.publish}
    </Button>
  )
}
