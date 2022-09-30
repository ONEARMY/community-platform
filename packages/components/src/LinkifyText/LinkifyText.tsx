import { useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import Linkify from 'linkify-react'
import 'linkify-plugin-mention'

export interface Props {
  children?: React.ReactNode
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const LinkifyText = (props: Props) => {
  const theme = useTheme() as any
  const ThemedLinkify = styled(Linkify)`
    a {
      color: ${theme.colors.grey};
      text-decoration: underline;
    }

    a:hover {
      text-decoration: none;
    }
  ` as any

  return (
    <ThemedLinkify
      properties={{ target: '_blank' }}
      options={{
        formatHref: {
          mention: (href: string) => '/u' + href,
        },
      }}
    >
      {props.children}
    </ThemedLinkify>
  )
}
