import { QuestionForm } from '../../pages/Question/Content/Common/QuestionForm'

export const QuestionCreate = (props) => {
  return (
    <QuestionForm
      data-testid="question-create-form"
      parentType="create"
      {...props}
    ></QuestionForm>
  )
}
