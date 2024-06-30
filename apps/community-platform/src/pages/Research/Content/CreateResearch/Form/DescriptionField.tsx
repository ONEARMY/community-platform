import { Field } from 'react-final-form'
import { FieldTextarea } from '@onearmy.apps/components'
import { Flex, Label } from 'theme-ui'

import { COMPARISONS } from '../../../../../utils/comparisons'
import {
  draftValidationWrapper,
  required,
} from '../../../../../utils/validators'
import { RESEARCH_MAX_LENGTH } from '../../../constants'
import { update as updateLabels } from '../../../labels'

export const DescriptionField = () => {
  const { title, placeholder } = updateLabels.description

  return (
    <Flex sx={{ flexDirection: 'column' }} mb={3}>
      <Label htmlFor="description" sx={{ mb: 2 }}>
        {title}
      </Label>
      <Field
        id="description"
        name="description"
        data-cy="intro-description"
        validate={(value, allValues) =>
          draftValidationWrapper(value, allValues, required)
        }
        validateFields={[]}
        isEqual={COMPARISONS.textInput}
        component={FieldTextarea}
        style={{
          resize: 'none',
          flex: 1,
          minHeight: '150px',
        }}
        maxLength={RESEARCH_MAX_LENGTH}
        showCharacterCount
        placeholder={placeholder}
      />
    </Flex>
  )
}
