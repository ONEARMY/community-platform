import React from 'react'
import { Box, Flex, Image, Input, Label, Text } from 'theme-ui'

import { HiddenInput } from '../elements'

import type { FieldRenderProps } from 'react-final-form'

interface IProps {
  value: string
  onChange: (value: string) => void
  isSelected: boolean
  imageSrc?: string
  textLabel?: string
  subText?: string
  name: string
  fullWidth?: boolean
  required?: boolean
  'data-cy'?: string
  theme?: any
}

type FieldProps = FieldRenderProps<any, any> & {
  children?: React.ReactNode
  disabled?: boolean
  'data-cy'?: string
  customOnBlur?: (event) => void
}

const HiddenInputField = ({ input, meta, ...rest }: FieldProps) => (
  <>
    <Input
      type="hidden"
      variant={meta.error && meta.touched ? 'error' : 'input'}
      {...input}
      {...rest}
    />
  </>
)

// validation - return undefined if no error (i.e. valid)
const isRequired = (value: any) => (value ? undefined : 'Required')

export const CustomRadioField = (props: IProps) => {
  const {
    value,
    imageSrc,
    isSelected,
    textLabel,
    subText,
    name,
    fullWidth,
    required,
    'data-cy': dataCy,
  } = props

  const classNames: Array<string> = []
  if (isSelected) {
    classNames.push('selected')
  }
  if (fullWidth) {
    classNames.push('full-width')
  }

  return (
    <Label
      sx={{
        alignItems: 'center',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        py: 2,
        borderRadius: 1,
        border: '1px solid transparent',
        ':hover': {
          backgroundColor: 'background',
          cursor: 'pointer',
        },
        '&.selected': {
          backgroundColor: 'background',
          borderColor: 'green',
        },
      }}
      htmlFor={value}
      className={classNames.join(' ')}
      data-cy={dataCy}
    >
      <HiddenInput
        id={value}
        name={name}
        value={value}
        type="radio"
        component={HiddenInputField}
        checked={isSelected}
        validate={required ? isRequired : undefined}
        validateFields={[]}
        onChange={(v) => {
          props.onChange(v.target.value)
        }}
      />
      {imageSrc && (
        <Image
          loading="lazy"
          px={3}
          src={imageSrc}
          sx={{ width: ['100px', '100px', '100%'] }}
        />
      )}
      <Flex
        sx={{
          alignItems: 'center',
          flexWrap: 'nowrap',
          flexDirection: 'column',
        }}
        px={1}
      >
        <Box mt="auto">
          {textLabel && (
            <Text
              px={1}
              sx={{
                display: 'block',
                fontSize: 1,
                marginTop: 1,
                marginBottom: 1,
                fontWeight: ['bold', 'bold', 'inherit'],
                textAlign: ['center'],
              }}
            >
              {textLabel}
            </Text>
          )}
          {subText && (
            <Text
              sx={{
                textAlign: 'center',
                fontSize: 1,
                display: 'block',
                marginTop: 1,
                marginBottom: 1,
              }}
            >
              {subText}
            </Text>
          )}
        </Box>
      </Flex>
    </Label>
  )
}
