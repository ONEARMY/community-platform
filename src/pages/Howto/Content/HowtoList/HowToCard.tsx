import { CategoryTag, Icon, ModerationStatus, Username } from 'oa-components'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link as RouterLink } from 'react-router-dom'
import { isUserVerified } from 'src/common/isUserVerified'
import type { IHowtoDB } from 'src/models/howto.models'
import { capitalizeFirstLetter } from 'src/utils/helpers'
import { Card, Flex, Heading, Text } from 'theme-ui'

interface IProps {
  howto: IHowtoDB & { taglist: any }
  votedUsefulCount: number
}

export const HowToCard = (props: IProps) => {
  const { howto, votedUsefulCount } = props
  return (
    <Card
      data-cy="card"
      sx={{ borderRadius: 2, position: 'relative', height: '100%' }}
    >
      <Flex>
        {howto.moderation !== 'accepted' && (
          <>
            <ModerationStatus
              status={howto.moderation}
              contentType="howto"
              sx={{ top: '62%', position: 'absolute', right: 0 }}
            />
          </>
        )}
        <RouterLink
          key={howto._id}
          to={`/how-to/${encodeURIComponent(howto.slug)}`}
          style={{ width: '100%' }}
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
              <Username
                user={{
                  userName: howto._createdBy,
                  countryCode: howto.creatorCountry,
                }}
                isVerified={isUserVerified(howto._createdBy)}
              />
            </Flex>
            <Flex mt={4}>
              <Flex sx={{ flex: 1, flexWrap: 'wrap' }}>
                {howto.taglist &&
                  howto.taglist.map((tag, idx) => (
                    <CategoryTag key={idx} tag={tag} sx={{ mr: 1 }} />
                  ))}
              </Flex>
              {votedUsefulCount > 0 && (
                <Flex ml={1} sx={{ alignItems: 'center' }}>
                  <Icon glyph="star-active" marginRight="4px" />
                  <Text color="black">{votedUsefulCount}</Text>
                </Flex>
              )}
            </Flex>
          </Flex>
        </RouterLink>
      </Flex>
    </Card>
  )
}

export default HowToCard
