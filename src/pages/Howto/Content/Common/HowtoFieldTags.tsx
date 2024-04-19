import { Field } from 'react-final-form'
import { TagsSelectField } from 'src/common/Form/TagsSelect.field'
import { FormFieldWrapper } from 'src/pages/Howto/Content/Common/FormFieldWrapper'
import { COMPARISONS } from 'src/utils/comparisons'

import { intro } from '../../labels'

export const HowtoFieldTags = () => {
  return (
    <FormFieldWrapper text={intro.tags.title} required>
      <Field
        name="tags"
        component={TagsSelectField}
        isEqual={COMPARISONS.tags}
      />
    </FormFieldWrapper>
  )
}
