import { useState } from 'react'
import { Field } from 'react-final-form'
import { Icon } from 'oa-components'
import { Box } from 'theme-ui'

export const PasswordField = ({ name, component, ...rest }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <Box style={{ position: 'relative' }}>
      <Field
        {...rest}
        name={name}
        component={component}
        type={isPasswordVisible ? 'text' : 'password'}
        required
      />
      <Box
        sx={{
          position: 'absolute',
          right: 2,
          top: 1,
          opacity: 0.7,
        }}
      >
        <Icon
          glyph={isPasswordVisible ? 'hide' : 'show'}
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          size="25"
        ></Icon>
      </Box>
    </Box>
  )
}
