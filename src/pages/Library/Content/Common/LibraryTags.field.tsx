import { Field } from 'react-final-form'
import { TagsSelectFieldV2 } from 'src/common/Form/TagsSelectFieldV2'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { COMPARISONS } from 'src/utils/comparisons'

import { intro } from '../../labels'

export const LibraryTagsField = () => {
  return (
    <FormFieldWrapper text={intro.tags.title} required>
      <Field
        name="tags"
        component={TagsSelectFieldV2}
        isEqual={COMPARISONS.tags}
      />
    </FormFieldWrapper>
  )
}
