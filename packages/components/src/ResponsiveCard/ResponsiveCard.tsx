import { Box, Card, Flex, Heading, Image } from 'theme-ui'

import { Category, type CategoryProps } from '../Category/Category'
import { IconCountGroup } from '../IconCountGroup/IconCountGroup'
import { InternalLink } from '../InternalLink/InternalLink'
import { ModerationStatus } from '../ModerationStatus/ModerationStatus'

import type { IconCountGroupProps } from '../IconCountGroup/IconCountGroup'
import type { ModerationStatusProps } from '../ModerationStatus/ModerationStatus'

export interface ResponsiveCardProps {
  title: string
  link: string
  imageSrc?: string
  moderationStatus?: string
  category?: CategoryProps['category']
  userName?: string
  creationDate?: string
  additionalContent?: React.ReactNode
  dataCy: string
  dataId: string
  status?: React.ReactNode
  iconCounts?: IconCountGroupProps['iconCounts']
  titleAs: 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  additionalTopRightElements?: React.ReactNode // For elements like status indicators
  additionalFooterContent?: React.ReactNode // For any footer content such as user info or stats
  additionalStyles?: object // For any additional styling needs
  moderationStatusProps?: ModerationStatusProps
}

export const ResponsiveCard = (props: ResponsiveCardProps) => {
  const {
    imageSrc,
    title,
    link,
    titleAs,
    additionalTopRightElements,
    additionalFooterContent,
    additionalStyles,
    iconCounts,
    status,
    dataCy,
    moderationStatusProps,
    dataId,
    category,
  } = props
  return (
    <Card
      as="li"
      data-cy={dataCy}
      data-id={dataId}
      mb={3}
      style={{ position: 'relative' }}
    >
      <Flex sx={{ flex: 1 }}>
        <Flex>
          <Box
            sx={{
              display: ['none', 'block'],
              height: '100%',
              width: '125px',
            }}
          >
            <Image
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                objectFit: 'cover',
                verticalAlign: 'top',
              }}
              loading="eager"
              src={imageSrc}
              crossOrigin=""
            />
          </Box>
        </Flex>

        <Flex sx={{ flex: 1 }}>
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
                  <Box>
                    <ModerationStatus {...moderationStatusProps} />
                  </Box>
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
