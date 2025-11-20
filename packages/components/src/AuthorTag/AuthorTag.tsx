import { Flex, Text } from 'theme-ui';

import { DisplayDate } from '../DisplayDate/DisplayDate';
import { Username } from '../Username/Username';

import type { Author } from 'oa-shared';

interface AuthorTagProps {
  author: Author;
  created: string | number | Date;
  action?: string;
}

export const AuthorTag = ({ author, created, action = 'Published' }: AuthorTagProps) => {
  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ alignItems: 'center' }}>
        <Flex sx={{ alignItems: 'center' }}>
          <Username user={author} sx={{ position: 'relative' }} />
          <Text
            variant="auxiliary"
            sx={{
              marginTop: 2,
              marginBottom: 2,
            }}
          >
            | {action} <DisplayDate createdAt={created} />
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
