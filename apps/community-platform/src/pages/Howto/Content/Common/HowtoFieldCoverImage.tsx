import { Field } from 'react-final-form'
import { Box, Text } from 'theme-ui'

import { ImageInputField } from '../../../../common/Form/ImageInput.field'
import { FormFieldWrapper } from '../../../../pages/Howto/Content/Common/FormFieldWrapper'
import { COMPARISONS } from '../../../../utils/comparisons'
import { draftValidationWrapper, required } from '../../../../utils/validators'
import { intro } from '../../labels'

export const HowtoFieldCoverImage = () => {
  const { description, title } = intro.cover_image
  const name = 'cover_image'

  return (
    <FormFieldWrapper htmlFor={name} text={title} required>
      <Box sx={{ height: '230px' }}>
        <Field
          id={name}
          name={name}
          validate={(values, allValues) =>
            draftValidationWrapper(values, allValues, required)
          }
          isEqual={COMPARISONS.image}
          component={ImageInputField}
        />
      </Box>

      <Text color={'grey'} mt={4} sx={{ fontSize: 1 }}>
        {description}
      </Text>
    </FormFieldWrapper>
  )
}
