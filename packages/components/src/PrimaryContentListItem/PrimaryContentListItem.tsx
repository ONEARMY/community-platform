import { Box, Card, Flex, Heading, Image } from 'theme-ui'

import { Category, type CategoryProps } from '../Category/Category'
import { IconCountGroup } from '../IconCountGroup/IconCountGroup'
import { InternalLink } from '../InternalLink/InternalLink'
import { ModerationStatus } from '../ModerationStatus/ModerationStatus'

import type { IconCountGroupProps } from '../IconCountGroup/IconCountGroup'
import type { ModerationStatusProps } from '../ModerationStatus/ModerationStatus'

export interface IProps {
  additionalFooterContent?: React.ReactNode
  category?: CategoryProps['category']
  creator: React.ReactNode
  dataCy: string
  iconCounts?: IconCountGroupProps['iconCounts']
  imageAlt?: string
  imageSrc?: string
  link: string
  moderationStatusProps?: ModerationStatusProps
  status?: React.ReactNode
  title: string
  userName?: string
}

export const PrimaryContentListItem = (props: IProps) => {
  const {
    additionalFooterContent,
    category,
    creator,
    dataCy,
    iconCounts,
    imageAlt,
    imageSrc,
    link,
    moderationStatusProps,
    status,
    title,
  } = props

  return (
    <Card
      as="li"
      data-cy={dataCy}
      sx={{ position: 'relative', listStyleType: 'none' }}
    >
      <Flex sx={{justifyContent: 'stretch'}}>
        {imageSrc && (
          <Flex
            sx={{
              alignItems: 'center',
              width: '110px',
            }}
          >
            <Image
              sx={{
                width: '100%',
                height: '100%',
                maxHeight: ['120px', '120px', '110px'],
                objectFit: 'cover',
              }}
              loading="lazy"
              alt={imageAlt || title}
              src={imageSrc}
              crossOrigin=""
            />
          </Flex>
        )}

        <Flex
          sx={{
            justifyContent: 'space-between',
            flexDirection: ['column', 'column', 'row'],
            gap: 2,
            padding: [2, 3, 4],
            flex: 1,
          }}
        >
          <Flex
            sx={{
              flexDirection: 'column',
              flex: 1,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Flex
              sx={{
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              {moderationStatusProps && (
                <ModerationStatus {...moderationStatusProps} />
              )}

              <Heading
                as='h2'
                sx={{
                  color: 'black',
                  fontSize: [3, 3, 4],
                  wordBreak: 'break-all',
                }}
              >
                <InternalLink
                  to={link}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:focus': {
                      outline: 'none',
                      textDecoration: 'none',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      right: 0,
                      bottom: 0,
                    },
                  }}
                >
                  {title}
                </InternalLink>
              </Heading>
            </Flex>
            <Flex
              sx={{ alignItems: 'center', gap: [2, 2, 4], flexWrap: 'wrap' }}
            >
              {creator}
              {status}
              {category && (
                <Category category={category} sx={{ fontSize: 2 }} />
              )}
            </Flex>
          </Flex>

          <Box
            sx={{
              alignSelf: ['flex-start', 'flex-start', 'center'],
              paddingX: [0, 0, 4],
            }}
          >
            {iconCounts && <IconCountGroup iconCounts={iconCounts} />}
          </Box>
        </Flex>
      </Flex>

      <Flex
        data-cy="card-footer"
        sx={{ alignItems: 'center', justifyContent: 'space-between' }}
      >
        {additionalFooterContent}
      </Flex>
    </Card>
  )
}
