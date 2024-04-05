import { Link as RouterLink } from 'react-router-dom'
import {
  Category,
  IconCountWithTooltip,
  ModerationStatus,
  Username,
} from 'oa-components'
import { IModerationStatus } from 'oa-shared'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isUserVerifiedWithStore } from 'src/common/isUserVerified'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { capitalizeFirstLetter } from 'src/utils/helpers'
import { Box, Card, Flex, Heading, Image } from 'theme-ui'

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
      sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column' }}
    >
      <RouterLink
        key={howto._id}
        to={`/how-to/${encodeURIComponent(howto.slug)}`}
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
      </RouterLink>

      <Flex
        sx={{
          alignContent: 'stretch',
          flexDirection: 'column',
          flexGrow: 1,
          gap: 2,
          justifyContent: 'space-between',
          justifyItems: 'stretch',
          padding: 2,
        }}
      >
        {howto.moderation !== IModerationStatus.ACCEPTED && (
          <Flex sx={{ alignSelf: 'flex-end', marginTop: -10, marginBottom: 2 }}>
            <ModerationStatus status={howto.moderation} contentType="howto" />
          </Flex>
        )}
        <Flex sx={{ gap: 1, flexDirection: 'column' }}>
          <Heading variant="small" color={'black'}>
            <RouterLink
              key={howto._id}
              to={`/how-to/${encodeURIComponent(howto.slug)}`}
              style={{ width: '100%', color: 'black' }}
            >
              {capitalizeFirstLetter(howto.title)}
            </RouterLink>
          </Heading>

          <Box>
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
          </Box>
        </Flex>

        <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>{howto.category && <Category category={howto.category} />}</Box>

          <Box>
            {votedUsefulCount > 0 && (
              <IconCountWithTooltip
                count={votedUsefulCount}
                icon="star-active"
                text="How useful is it"
              />
            )}
          </Box>
        </Flex>
      </Flex>
    </Card>
  )
}

export default HowToCard
