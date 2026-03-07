import { DisplayDate, Username } from 'oa-components';
import type { Author } from 'oa-shared';
import { Flex, Text } from 'theme-ui';

interface IProps {
  author: Author;
  createdAt?: string | number | Date;
  publishedAction?: string;
  modifiedAt?: string | number | Date | null;
  publishedAt?: string | number | Date | null;
}

export const UserNameTag = (props: IProps) => {
  const { author, createdAt, publishedAction = 'Published', modifiedAt, publishedAt } = props;

  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ alignItems: 'center', gap: 1 }}>
        <Username user={author} sx={{ position: 'relative' }} />
        {createdAt && (
          <>
            <Text variant="auxiliary">|</Text>
            <Text variant="auxiliary">
              <DisplayDate
                publishedAction={publishedAction}
                createdAt={createdAt}
                publishedAt={publishedAt}
                modifiedAt={modifiedAt}
              />
            </Text>
          </>
        )}
      </Flex>
    </Flex>
  );
};
