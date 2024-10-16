import { useState } from 'react'
import { Field } from 'react-final-form'
import { Icon } from 'oa-components'

type PasswordFieldProps = {
  name: string
  placeholder?: string
  component: any
  autoComplete?: 'off' | 'on'
  required?: boolean
  validate?: (value: any) => string | undefined
}

export const PasswordField = ({
  name,
  component,
  placeholder,
  autoComplete,
  required,
  validate,
}: PasswordFieldProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <Field
      name={name}
      placeHolder={placeholder || ''}
      component={component}
      type={isPasswordVisible ? 'text' : 'password'}
      sx={{
        paddingRight: 8,
      }}
      validate={validate}
      autoComplete={autoComplete || 'on'}
      endAdornment={
        <Icon
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
          glyph={isPasswordVisible ? 'hide' : 'show'}
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          size="25"
        />
      }
      required={required}
    />
  )
}
