import { Flex, Label } from 'theme-ui'

const _labelStyle = {
  fontSize: 2,
  marginBottom: 2,
  display: 'block',
}

interface IProps {
  children: React.ReactNode
  htmlFor?: string
  required?: boolean
  flexDirection?: 'column' | 'row' | 'row-reverse' | 'column-reverse'
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  text: string
}

export const FormFieldWrapper = (props: IProps) => {
  const {
    children,
    htmlFor,
    required,
    text,
    flexDirection = 'column',
    flexWrap = 'nowrap',
  } = props

  const heading = required ? `${text} *` : text

  return (
    <Flex sx={{ flexDirection, flexWrap }} mb={3}>
      <Label sx={_labelStyle} htmlFor={htmlFor}>
        {heading}
      </Label>
      {children}
    </Flex>
  )
}
