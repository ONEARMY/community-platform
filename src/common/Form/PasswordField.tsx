import { useState } from 'react'
import { Field } from 'react-final-form'
import { Icon } from 'oa-components'
import { Box } from 'theme-ui'

export const PasswordField = ({ name, component, ...rest }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <Box
      style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
    >
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
          zIndex: 'default',
          opacity: '0.2',
        }}
      >
        <Icon
          glyph={isPasswordVisible ? 'comment' : 'external-link'}
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
        ></Icon>
      </Box>
    </Box>
  )
}
