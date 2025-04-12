import { Field } from 'react-final-form'
import { TagsSelectField } from 'src/common/Form/TagsSelect.field'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { COMPARISONS } from 'src/utils/comparisons'

import { intro } from '../../labels'

export const LibraryTagsField = () => {
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
