import { IconCountWithTooltip } from 'oa-components';
import type { Image as ImageType } from 'oa-shared';
import { Link } from 'react-router';
import { Box, Flex, Image, Text } from 'theme-ui';

interface IProps {
  type: 'library' | 'research' | 'questions';
  item: {
    id: string | number;
    commentCount?: number;
    coverImage?: ImageType;
    title: string;
    slug: string;
    usefulCount: number;
  };
}

const UserDocumentItem = ({ type, item }: IProps) => {
  const { id, commentCount, coverImage, slug, title, usefulCount } = item;
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
            <Box sx={{ width: '70px' }}>
              <Image
                data-cy={`UserDocumentItem: coverImage for ${title}`}
                loading="lazy"
                src={coverImage.publicUrl}
                sx={{
                  borderRadius: 2,
                  height: '100%',
                  objectFit: 'cover',
                }}
                crossOrigin=""
                alt={`Cover image for ${title}`}
              />
            </Box>
          )}

          <Flex
            sx={{
              flexDirection: 'row',
              justifyItems: 'center',
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
              padding: 3,
              gap: 2,
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
                <IconCountWithTooltip
                  count={commentCount || 0}
                  icon="comment"
                  text="Comment count"
                />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Link>
    </Flex>
  );
};

export default UserDocumentItem;
