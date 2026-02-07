import { DisplayDate, Username } from 'oa-components';
import type { Author } from 'oa-shared';
import { Flex, Text } from 'theme-ui';

interface IProps {
  author: Author;
  createdAt?: string | number | Date;
  action?: string;
  modifiedAt?: string | number | Date | null;
}

export const UserNameTag = (props: IProps) => {
  const { author, createdAt, action = 'Published', modifiedAt } = props;

  return (
    <Flex sx={{ flexDirection: 'column' }}>
      <Flex sx={{ alignItems: 'center' }}>
        <Flex sx={{ alignItems: 'center' }}>
          <Username user={author} sx={{ position: 'relative' }} />
          {createdAt && (
            <Text
              variant="auxiliary"
              sx={{
                marginTop: 2,
                marginBottom: 2,
              }}
            >
              | <DisplayDate action={action} createdAt={createdAt} modifiedAt={modifiedAt} />
            </Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
