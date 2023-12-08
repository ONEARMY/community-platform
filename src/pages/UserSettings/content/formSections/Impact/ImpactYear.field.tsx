import { Button } from 'oa-components'

import { buttons } from 'src/pages/UserSettings/labels'
import { ImpactQuestionField } from './ImpactQuestion.field'
import { impactQuestions } from './impactQuestions'

interface Props {
  id: string
  handleSubmit: () => void
  submitting: boolean
}

export const ImpactYearField = (props: Props) => {
  const { id, handleSubmit, submitting } = props

  return (
    <>
      {impactQuestions.map((field, index) => (
        <ImpactQuestionField id={id} field={field} key={index} />
      ))}

      <Button
        data-cy={`${id}-button-save`}
        disabled={submitting}
        type="submit"
        onClick={handleSubmit}
        form={id}
      >
        {buttons.impact.save}
      </Button>
    </>
  )
}
