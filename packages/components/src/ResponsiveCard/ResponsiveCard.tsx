import { Box, Card, Flex, Heading, Image as ThemeUiImage } from 'theme-ui'

import { Category, type CategoryProps } from '../Category/Category'
import { IconCountGroup } from '../IconCountGroup/IconCountGroup'
import { InternalLink } from '../InternalLink/InternalLink'
import { ModerationStatus } from '../ModerationStatus/ModerationStatus'

import type { IconCountGroupProps } from '../IconCountGroup/IconCountGroup'
import type { ModerationStatusProps } from '../ModerationStatus/ModerationStatus'

export interface ResponsiveCardProps {
  additionalContent?: React.ReactNode
  additionalFooterContent?: React.ReactNode // For any footer content such as user info or stats
  additionalStyles?: object // For any additional styling needs
  additionalTopRightElements?: React.ReactNode // For elements like status indicators
  category?: CategoryProps['category']
  creationDate?: string
  dataCy: string
  dataId: string
  iconCounts?: IconCountGroupProps['iconCounts']
  imageAlt?: string
  imageSrc?: string
  link: string
  moderationStatusProps?: ModerationStatusProps
  status?: React.ReactNode
  title: string
  titleAs: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  userName?: string
}

export const ResponsiveCard = (props: ResponsiveCardProps) => {
  const {
    additionalFooterContent,
    additionalStyles,
    additionalTopRightElements,
    category,
    dataCy,
    dataId,
    iconCounts,
    imageAlt,
    imageSrc,
    link,
    moderationStatusProps,
    status,
    title,
    titleAs,
  } = props

  return (
    <Card
      as="li"
      data-cy={dataCy}
      data-id={dataId}
      mb={3}
      sx={{ position: 'relative', listStyleType: 'none' }}
    >
      <Flex sx={{ flex: 1 }}>
        {imageSrc && (
          <Box
            data-cy="card-image"
            sx={{
              display: ['none', 'block'],
              width: '92px',
              height: '92px',
            }}
          >
            <ThemeUiImage
              sx={{ width: '92px', height: '100%' }}
              loading="lazy"
              alt={imageAlt}
              src={imageSrc}
              crossOrigin=""
            />
          </Box>
        )}
        <Flex sx={{ flex: 1 }} data-cy="card-content">
          <Flex
            sx={{
              flex: 1,
              flexDirection: 'column',
              gap: 1,
              padding: 3,
              ...additionalStyles,
            }}
          >
            <Flex
              data-cy="card-header"
              sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}
            >
              <Flex
                sx={{
                  flexDirection: ['column', 'row'],
                  gap: [1, 3],
                  alignItems: 'baseline',
                }}
              >
                {moderationStatusProps && (
                  <ModerationStatus {...moderationStatusProps} />
                )}
                <Heading
                  as={titleAs}
                  sx={{
                    color: 'black',
                    fontSize: [3, 3, 4],
                    marginBottom: 1,
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
                {category && (
                  <Category category={category} sx={{ fontSize: 2 }} />
                )}

                {additionalTopRightElements}
              </Flex>
              {status}
            </Flex>

            <Flex
              data-cy="card-footer"
              sx={{ alignItems: 'center', justifyContent: 'space-between' }}
            >
              {additionalFooterContent}
            </Flex>
          </Flex>
          {iconCounts && <IconCountGroup iconCounts={iconCounts} />}
        </Flex>
      </Flex>
    </Card>
  )
}
