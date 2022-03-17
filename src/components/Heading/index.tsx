import styled from '@emotion/styled'
import Text, { ITextProps } from 'src/components/Text'
import { HeadingProps as ThemeUiHeadingProps } from 'theme-ui'

export const large = (props: ITextProps) =>
  props.large ? { fontSize: props.theme?.fontSizes[6] } : null
export const medium = (props: ITextProps) =>
  props.medium ? { fontSize: props.theme?.fontSizes?.[5] } : null
export const small = (props: ITextProps) =>
  props.small ? { fontSize: props.theme?.fontSizes[4] } : null

export const BaseHeading = styled(Text)`
    ${large}
    ${medium}
    ${small}`

type IHeadingProps = ITextProps & ThemeUiHeadingProps

const Heading = (props: IHeadingProps) => (
  <BaseHeading
    {...(props as any)}
    sx={{ ...props?.sx, display: 'block', width: '100%' }}
  >
    {props.children}
  </BaseHeading>
)

export default Heading
