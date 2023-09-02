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
  text: string
}

export const FormFieldWrapper = (props: IProps) => {
  const { children, htmlFor, required, text } = props

  const heading = required ? `${text} *` : text

  return (
    <Flex sx={{ flexDirection: 'column' }} mb={3}>
      <Label sx={_labelStyle} htmlFor={htmlFor}>
        {heading}
      </Label>
      {children}
    </Flex>
  )
}
