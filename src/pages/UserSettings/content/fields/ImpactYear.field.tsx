import { Button } from 'oa-components'
import { buttons } from 'src/pages/UserSettings/labels'

import { impactQuestions } from '../impactQuestions'
import { ImpactQuestionField } from './ImpactQuestion.field'

interface Props {
  formId: string
  handleSubmit: () => void
  submitting: boolean
}

export const ImpactYearField = (props: Props) => {
  const { formId, handleSubmit, submitting } = props

  return (
    <>
      {impactQuestions.map((field, index) => (
        <ImpactQuestionField field={field} formId={formId} key={index} />
      ))}

      <Button
        data-cy={`${formId}-button-save`}
        disabled={submitting}
        type="submit"
        onClick={handleSubmit}
        form={formId}
        sx={{ alignSelf: 'start' }}
      >
        {buttons.impact.save}
      </Button>
    </>
  )
}
