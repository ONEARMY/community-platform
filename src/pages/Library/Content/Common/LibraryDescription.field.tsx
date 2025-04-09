import { Field } from 'react-final-form'
import { FieldTextarea } from 'oa-components'
import { FormFieldWrapper } from 'src/pages/common/FormFields'
import { COMPARISONS } from 'src/utils/comparisons'
import { draftValidationWrapper, required } from 'src/utils/validators'

import { LIBRARY_DESCRIPTION_MAX_LENGTH } from '../../constants'
import { intro } from '../../labels'

export const LibraryDescriptionField = () => {
  const { description, title } = intro.description
  const name = 'description'

  return (
    <FormFieldWrapper htmlFor={name} text={title} required>
      <Field
        id={name}
        name={name}
        data-cy="intro-description"
        validate={(values, allValues) =>
          draftValidationWrapper(values, allValues, required)
        }
        validateFields={[]}
        modifiers={{ capitalize: true, trim: true }}
        isEqual={COMPARISONS.textInput}
        component={FieldTextarea}
        style={{
          resize: 'none',
          flex: 1,
          minHeight: '150px',
        }}
        maxLength={LIBRARY_DESCRIPTION_MAX_LENGTH}
        showCharacterCount
        placeholder={description}
      />
    </FormFieldWrapper>
  )
}
