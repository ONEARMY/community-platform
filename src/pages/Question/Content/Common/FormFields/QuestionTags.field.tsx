import { Field } from 'react-final-form'
import { TagsSelectField } from 'src/common/Form/TagsSelect.field'
import { FormFieldWrapper } from 'src/pages/Howto/Content/Common'
import { fields } from 'src/pages/Question/labels'
import { COMPARISONS } from 'src/utils/comparisons'

export const QuestionTagsField = () => {
  const { title } = fields.tags
  const name = 'tags'

  return (
    <FormFieldWrapper htmlFor={name} text={title}>
      <Field
        data-cy={`field-${name}`}
        name={name}
        id={name}
        component={TagsSelectField}
        category="question"
        isEqual={COMPARISONS.tags}
      />
    </FormFieldWrapper>
  )
}
