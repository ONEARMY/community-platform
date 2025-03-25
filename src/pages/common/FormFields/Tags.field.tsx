import { Field } from 'react-final-form'
import { TagsSelectFieldV2 } from 'src/common/Form/TagsSelectFieldV2'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { fields } from 'src/pages/News/labels'
import { COMPARISONS } from 'src/utils/comparisons'

export const TagsField = () => {
  const name = 'tags'

  return (
    <FormFieldWrapper htmlFor={name} text={fields.tags.title}>
      <Field
        data-cy={`field-${name}`}
        name={name}
        id={name}
        component={TagsSelectFieldV2}
        category="news"
        isEqual={COMPARISONS.tagsSupabase}
      />
    </FormFieldWrapper>
  )
}
