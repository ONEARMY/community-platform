import styled from '@emotion/styled'
import { Text } from 'theme-ui'
import type { HeadingProps as ThemeUiHeadingProps } from 'theme-ui'

const large = (props: any) =>
  props.large ? { fontSize: props.theme?.fontSizes[6] } : null
const medium = (props: any) =>
  props.medium ? { fontSize: props.theme?.fontSizes?.[5] } : null
const small = (props: any) =>
  props.small ? { fontSize: props.theme?.fontSizes[4] } : null

export const BaseHeading = styled(Text, {
  shouldForwardProp(prop: keyof ThemeUiHeadingProps) {
    return !['medium', 'small', 'large', 'bold', 'txtcenter'].includes(
      prop.toLowerCase(),
    )
  },
})`
  ${large}
  ${medium}
  ${small}
`

type IHeadingProps = any & ThemeUiHeadingProps

const Heading = (props: IHeadingProps) => {
  return (
    <BaseHeading
      {...(props as any)}
      sx={{ ...props?.sx, display: 'block', width: '100%' }}
    >
      {props.children}
    </BaseHeading>
  )
}

export default Heading
