import { Link } from 'react-router';
import { IconCountWithTooltip } from 'oa-components';
import { Flex, Text } from 'theme-ui';

interface IProps {
  type: 'library' | 'research' | 'questions';
  item: {
    id: string | number;
    title: string;
    slug: string;
    usefulCount: number;
  };
}

const UserDocumentItem = ({ type, item }: IProps) => {
  const { id, title, slug, usefulCount } = item;
  const url = `/${type}/${encodeURIComponent(slug)}?utm_source=user-profile`;

  return (
    <Flex
      sx={{
        background: 'white',
        borderRadius: 2,
        padding: 3,
      }}
    >
      <Link
        to={url}
        key={id}
        style={{ width: '100%' }}
        data-testid={`${type}-link`}
        data-cy={`${item.slug}-link`}
      >
        <Flex
          sx={{
            flexDirection: 'row',
            justifyItems: 'center',
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          <Text
            as="p"
            color="black"
            sx={{
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            {title}
          </Text>
          <Flex
            sx={{
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Flex
              sx={{
                flex: 1,
                justifyContent: 'flex-end',
              }}
            >
              <IconCountWithTooltip count={usefulCount} icon="star-active" text="Useful count" />
            </Flex>
          </Flex>
        </Flex>
      </Link>
    </Flex>
  );
};

export default UserDocumentItem;
