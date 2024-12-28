import { Field } from 'react-final-form'
import { TagsSelectFieldV2 } from 'src/common/Form/TagsSelectFieldV2'
import { FormFieldWrapper } from 'src/pages/Howto/Content/Common'
import { fields } from 'src/pages/Question/labels'
import { COMPARISONS } from 'src/utils/comparisons'

export const QuestionTagsField = () => {
  const name = 'tags'

  return (
    <FormFieldWrapper htmlFor={name} text={fields.tags.title}>
      <Field
        data-cy={`field-${name}`}
        name={name}
        id={name}
        component={TagsSelectFieldV2}
        category="question"
        isEqual={COMPARISONS.tagsV2}
      />
    </FormFieldWrapper>
  )
}
