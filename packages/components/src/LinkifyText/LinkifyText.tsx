import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import Linkify from 'linkify-react'
import 'linkify-plugin-mention'
import { ExternalLink, InternalLink } from '..'

export interface Props {
  children?: React.ReactNode
}

export const LinkifyText = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme() as any
  const StyledExternalLink = styled(ExternalLink)`
    color: ${theme.colors.grey}!important;
    text-decoration: underline;
  `
  const StyledInternalLink = styled(InternalLink)`
    color: ${theme.colors.grey};
    font-weight: bold;
  `

  const renderExternalLink = ({ attributes = {} as any, content = '' }) => {
    const { href, ...props } = attributes
    return (
      <StyledExternalLink href={href} {...props}>
        {content}
      </StyledExternalLink>
    )
  }
  const renderInternalLink = ({ attributes = {} as any, content = '' }) => {
    const { href, ...props } = attributes
    return (
      <StyledInternalLink to={`/u${href}`} {...props}>
        {content}
      </StyledInternalLink>
    )
  }

  return (
    <Linkify
      options={{
        render: {
          mention: renderInternalLink,
          url: renderExternalLink,
        },
      }}
    >
      {props.children}
    </Linkify>
  )
}
