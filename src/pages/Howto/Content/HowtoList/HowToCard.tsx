import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Text, Card, Flex, Link, Heading } from 'theme-ui'
import ModerationStatusText from 'src/components/ModerationStatusText/ModerationStatustext'
import { FlagIconHowTos, Icon } from 'oa-components'
import TagDisplay from 'src/components/Tags/TagDisplay/TagDisplay'
import type { IHowtoDB } from 'src/models/howto.models'
import { capitalizeFirstLetter } from 'src/utils/helpers'
import { VerifiedUserBadge } from 'src/components/VerifiedUserBadge/VerifiedUserBadge'
import { useTheme } from '@emotion/react'

interface IProps {
  howto: IHowtoDB
  votedUsefulCount: number
}

export const HowToCard = (props: IProps) => {
  const { howto, votedUsefulCount } = props
  const theme = useTheme()
  return (
    <Card data-cy="card" sx={{ borderRadius: 2, position: 'relative' }}>
      <Flex>
        {howto.moderation !== 'accepted' && (
          <ModerationStatusText
            moderatedContent={howto}
            contentType="howto"
            top={'62%'}
          />
        )}
        <Link
          key={howto._id}
          href={`/how-to/${encodeURIComponent(howto.slug)}`}
          sx={{ width: '100%' }}
        >
          <Flex
            sx={{
              width: '100%',
              fontSize: 0,
            }}
          >
            <LazyLoadImage
              style={{
                width: '100%',
                height: 'calc(((350px) / 3) * 2)',
                objectFit: 'cover',
              }}
              threshold={500}
              src={howto.cover_image.downloadUrl}
              crossOrigin=""
            />
          </Flex>
          <Flex sx={{ flexDirection: 'column', padding: 3 }}>
            <Heading variant="small" color={'black'}>
              {/* HACK 2021-07-16 - new howtos auto capitalize title but not older */}
              {capitalizeFirstLetter(howto.title)}
            </Heading>
            <Flex sx={{ alignItems: 'center' }}>
              {howto.creatorCountry && (
                <FlagIconHowTos code={howto.creatorCountry} />
              )}
              <Text
                my={2}
                ml={1}
                sx={{ display: 'flex', ...theme.typography.auxiliary }}
              >
                By {howto._createdBy}
              </Text>
              <VerifiedUserBadge
                userId={howto._createdBy}
                ml={1}
                height="12px"
                width="12px"
              />
            </Flex>
            <Flex mt={4}>
              <Flex sx={{ flex: 1, flexWrap: 'wrap' }}>
                {howto.tags &&
                  Object.keys(howto.tags).map((tag) => {
                    return <TagDisplay key={tag} tagKey={tag} />
                  })}
              </Flex>
              {votedUsefulCount > 0 && (
                <Flex ml={1} sx={{ alignItems: 'center' }}>
                  <Icon glyph="star-active" marginRight="4px" />
                  <Text color="black">{votedUsefulCount}</Text>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Link>
      </Flex>
    </Card>
  )
}

export default HowToCard
