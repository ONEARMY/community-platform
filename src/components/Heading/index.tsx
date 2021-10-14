import styled from 'styled-components'
import Text, { ITextProps } from 'src/components/Text'
import { HeadingProps as RebassHeadingProps } from 'rebass/styled-components'
import { observer } from 'mobx-react'
import { useCommonStores } from 'src'

type IHeadingProps = ITextProps & RebassHeadingProps

const Heading = observer((props: IHeadingProps) => {
  const theme = useCommonStores().stores.themeStore.currentTheme.styles
  const large = (props: ITextProps) =>
    props.large ? { fontSize: theme.fontSizes[6] } : null
  const medium = (props: ITextProps) =>
    props.medium ? { fontSize: theme.fontSizes[5] } : null
  const small = (props: ITextProps) =>
    props.small ? { fontSize: theme.fontSizes[4] } : null

  const BaseHeading = styled(Text)`
    ${large}
    ${medium}
    ${small}`

  return <BaseHeading {...(props as any)}>{props.children}</BaseHeading>
})

export default Heading
