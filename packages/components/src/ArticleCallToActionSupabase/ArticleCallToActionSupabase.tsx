import { Flex, Heading, Text } from 'theme-ui';

import { Username } from '../Username/Username';

import type { Author } from 'oa-shared';

export interface IProps {
  author: Author;
  children: React.ReactNode;
  contributors?: Author[];
}

export const ArticleCallToActionSupabase = (props: IProps) => {
  const { author, children, contributors } = props;

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        alignContent: 'center',
      }}
    >
      <Flex>
        <Text variant="body" sx={{ fontSize: 2, alignContent: 'center' }}>
          Made by
        </Text>
        <Username user={author} sx={{ ml: 1 }} />
      </Flex>
      {contributors && contributors.length ? (
        <Text
          variant="quiet"
          sx={{
            display: 'block',
            marginTop: 2,
            textAlign: 'center',
            fontSize: 2,
            gap: 1,
            alignItems: 'center',
          }}
        >
          With contributions from:{' '}
          {contributors.map((contributor, key) => (
            <Username key={key} user={contributor} />
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
  );
};
