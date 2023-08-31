import { Field } from 'react-final-form'

import { TagsSelectField } from 'src/common/Form/TagsSelect.field'
import { COMPARISONS } from 'src/utils/comparisons'
import { intro } from '../../labels'
import { FormFieldWrapper } from '.'

export const HowtoFieldTags = () => {
  return (
    <FormFieldWrapper text={intro.tags.title} required>
      <Field
        name="tags"
        component={TagsSelectField}
        category="how-to"
        isEqual={COMPARISONS.tags}
      />
    </FormFieldWrapper>
  )
}
