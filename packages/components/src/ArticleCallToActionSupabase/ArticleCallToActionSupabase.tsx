import { Flex, Heading, Text } from 'theme-ui'

import { Username } from '../Username/Username'

import type { Author } from 'oa-shared'

export interface IProps {
  author: Author
  children: React.ReactNode
  contributors?: Author[]
}

export const ArticleCallToActionSupabase = (props: IProps) => {
  const { author, children, contributors } = props

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Text variant="body" sx={{ fontSize: 2 }}>
        Made by
        <Username
          user={{ userName: author.username, isVerified: author.isVerified }}
          sx={{ ml: 1 }}
        />
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
              user={{
                userName: contributor.username,
                isVerified: contributor.isVerified,
              }}
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
          flexDirection: ['column', 'row'],
        }}
      >
        {children}
      </Flex>
    </Flex>
  )
}
