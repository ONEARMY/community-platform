import { Field } from 'react-final-form'
import { FieldInput } from 'oa-components'
import { FormFieldWrapper } from 'src/pages/Library/Content/Common/FormFieldWrapper'
import { Box, Text } from 'theme-ui'

import { intro } from '../../labels'

export const HowtoFieldCoverImageAlt = () => {
  const { description, placeholder, title } = intro.cover_image_alt
  const name = 'cover_image_alt'

  return (
    <FormFieldWrapper htmlFor={name} text={title} required>
      <Box>
        <Field
          id={name}
          name={name}
          component={FieldInput}
          placeholder={placeholder}
        />
      </Box>
      <Text color="grey" mt={4} sx={{ fontSize: 1 }}>
        {description}
      </Text>
    </FormFieldWrapper>
  )
}
