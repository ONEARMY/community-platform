import { useTheme } from '@emotion/react'
import { Card, Flex, Heading, Text } from 'theme-ui'
import type { User } from '../types/common'
import { Username } from '../'

export interface Props {
  author: User & { isVerified: boolean }
  children: React.ReactNode
  contributors?: (User & { isVerified: boolean })[]
}

export const ArticleCallToAction = (props: Props) => {
  const theme = useTheme() as any
  return (
    <Card sx={{ py: 6, px: 4 }}>
      <Flex
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Text variant="body" sx={{ fontSize: 2 }}>
          Made by
          <Username
            isVerified={props.author.isVerified}
            user={props.author}
            sx={{ ml: 1 }}
          />
        </Text>
        {props.contributors && props?.contributors.length ? (
          <Text
            data-testid="ArticleCallToAction: contributors"
            variant="quiet"
            sx={{ display: 'block', mt: 2, textAlign: 'center', fontSize: 2 }}
          >
            With contributions from:{' '}
            {props.contributors.map((contributor, key) => (
              <Username
                key={key}
                user={contributor}
                isVerified={contributor.isVerified}
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
          {props.children}
        </Flex>
      </Flex>
    </Card>
  )
}
