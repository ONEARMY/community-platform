import { Field } from 'react-final-form'
import { FieldTextarea } from '@onearmy.apps/components'

import { FormFieldWrapper } from '../../../../pages/Howto/Content/Common/FormFieldWrapper'
import { COMPARISONS } from '../../../../utils/comparisons'
import { draftValidationWrapper, required } from '../../../../utils/validators'
import { HOWTO_MAX_LENGTH } from '../../constants'
import { intro } from '../../labels'

export const HowtoFieldDescription = () => {
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
        maxLength={HOWTO_MAX_LENGTH}
        showCharacterCount
        placeholder={description}
      />
    </FormFieldWrapper>
  )
}
