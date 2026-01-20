import { Link } from 'react-router';
import { IconCountWithTooltip } from 'oa-components';
import { Flex, Image, Text } from 'theme-ui';

interface IProps {
  type: 'library' | 'research' | 'questions';
  item: {
    id: string | number;
    commentCount?: number;
    coverImage?: any;
    title: string;
    slug: string;
    usefulCount: number;
  };
}

const UserDocumentItem = ({ type, item }: IProps) => {
  const { id, commentCount, coverImage, title, slug, usefulCount } = item;
  const url = `/${type}/${encodeURIComponent(slug)}?utm_source=user-profile`;

  return (
    <Flex
      sx={{
        background: 'white',
        borderRadius: 2,
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
          }}
        >
          {coverImage && coverImage.publicUrl && (
            <Image
              loading="lazy"
              src={coverImage.publicUrl}
              sx={{
                objectFit: 'cover',
                height: '100%',
                width: '70px',
                borderRadius: 2,
              }}
              crossOrigin=""
              alt="project cover image"
            />
          )}

          <Flex
            sx={{
              flexDirection: 'row',
              justifyItems: 'center',
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
              padding: 3,
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
                  gap: 3,
                  justifyContent: 'flex-end',
                }}
              >
                <IconCountWithTooltip count={usefulCount} icon="star-active" text="Useful count" />
                {(commentCount || commentCount === 0) && (
                  <IconCountWithTooltip count={commentCount} icon="comment" text="Comment count" />
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Link>
    </Flex>
  );
};

export default UserDocumentItem;
