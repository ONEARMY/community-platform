import { Link as RouterLink } from 'react-router-dom'
import {
  Category,
  Icon,
  ModerationStatus,
  Tooltip,
  Username,
} from 'oa-components'
import { IModerationStatus } from 'oa-shared'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isUserVerifiedWithStore } from 'src/common/isUserVerified'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { capitalizeFirstLetter } from 'src/utils/helpers'
import { Box, Card, Flex, Heading, Image, Text } from 'theme-ui'

import type { ITag } from 'src/models'
import type { IHowtoDB } from 'src/models/howto.models'

interface IProps {
  howto: IHowtoDB & { tagList?: ITag[] }
  votedUsefulCount: number
}

export const HowToCard = (props: IProps) => {
  const { aggregationsStore } = useCommonStores().stores
  const { howto, votedUsefulCount } = props

  return (
    <Card
      data-cy="card"
      data-cy-howto-slug={howto.slug}
      sx={{ borderRadius: 2, position: 'relative', height: '100%' }}
    >
      <Box>
        {howto.moderation !== IModerationStatus.ACCEPTED && (
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
            <Image
              style={{
                width: '100%',
                height: 'calc(((350px) / 3) * 2)',
                objectFit: 'cover',
              }}
              loading="lazy"
              src={cdnImageUrl(howto.cover_image?.downloadUrl || '', {
                width: 500,
              })}
              crossOrigin=""
            />
          </Flex>
        </RouterLink>

        <Flex sx={{ flexDirection: 'column', padding: 3, paddingBottom: 2 }}>
          <Flex
            sx={{
              flexDirection: 'column',
              height: 'calc(((350px) / 3) * 0.5)',
            }}
          >
            <Heading variant="small" color={'black'}>
              {/* HACK 2021-07-16 - new howtos auto capitalize title but not older */}
              <RouterLink
                key={howto._id}
                to={`/how-to/${encodeURIComponent(howto.slug)}`}
                style={{ width: '100%', color: 'black' }}
              >
                {capitalizeFirstLetter(howto.title)}
              </RouterLink>
            </Heading>
            <Flex sx={{ alignItems: 'center' }}>
              <Username
                user={{
                  userName: howto._createdBy,
                  countryCode: howto.creatorCountry,
                }}
                isVerified={isUserVerifiedWithStore(
                  howto._createdBy,
                  aggregationsStore,
                )}
              />
            </Flex>
          </Flex>
          <Flex mt={5}>
            {howto.category && (
              <Category
                category={howto.category}
                sx={{ mr: 1, display: 'inline' }}
              />
            )}
            {votedUsefulCount > 0 && (
              <Flex
                sx={{ alignItems: 'center', ml: 'auto' }}
                data-tip="How useful is it"
              >
                <Icon glyph="star-active" marginRight="4px" />
                <Text color="black">{votedUsefulCount}</Text>
              </Flex>
            )}
            <Tooltip />
          </Flex>
        </Flex>
      </Box>
    </Card>
  )
}

export default HowToCard
