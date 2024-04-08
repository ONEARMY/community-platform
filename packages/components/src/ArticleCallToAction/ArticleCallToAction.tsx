import { useTheme } from '@emotion/react'
import { Flex, Heading, Text } from 'theme-ui'

import { Username } from '..'

import type { User } from '..'

export interface IProps {
  author: User
  children: React.ReactNode
  contributors?: User[]
}

export const ArticleCallToAction = (props: IProps) => {
  const { author, children, contributors } = props
  const theme = useTheme() as any

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Text variant="body" sx={{ fontSize: 2 }}>
        Made by
        <Username user={author} sx={{ ml: 1 }} />
      </Text>
      {contributors && contributors.length ? (
        <Text
          data-testid="ArticleCallToAction: contributors"
          variant="quiet"
          sx={{ display: 'block', mt: 2, textAlign: 'center', fontSize: 2 }}
        >
          With contributions from:{' '}
          {contributors.map((contributor, key) => (
            <Username
              key={key}
              user={contributor}
              sx={{
                mr: 1,
              }}
            />
          ))}
        </Text>
      ) : null}
      <Heading sx={{ my: 4 }}>Like what you see? 👇</Heading>
      <Flex
        sx={{
          gap: 2,
          [`@media screen and (max-width: ${theme.breakpoints[0]})`]: {
            flexDirection: 'column',
          },
        }}
      >
        {children}
      </Flex>
    </Flex>
  )
}
