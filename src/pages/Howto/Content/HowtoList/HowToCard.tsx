import { LazyLoadImage } from 'react-lazy-load-image-component'
import Text from 'src/components/Text'
import Flex from 'src/components/Flex'
import ModerationStatusText from 'src/components/ModerationStatusText'
import { Link } from 'src/components/Links'
import { FlagIconHowTos, Icon } from 'oa-components'
import TagDisplay from 'src/components/Tags/TagDisplay/TagDisplay'
import { IHowtoDB } from 'src/models/howto.models'
import Heading from 'src/components/Heading'
import { capitalizeFirstLetter } from 'src/utils/helpers'
import { VerifiedUserBadge } from 'src/components/VerifiedUserBadge/VerifiedUserBadge'

interface IProps {
  howto: IHowtoDB
  votedUsefulCount: number
}
export const HowToCard = (props: IProps) => (
  <Flex
    card
    mediumRadius
    mediumScale
    bg={'white'}
    data-cy="card"
    sx={{ position: 'relative', width: '100%' }}
  >
    {props.howto.moderation !== 'accepted' && (
      <ModerationStatusText
        moderatedContent={props.howto}
        contentType="howto"
        top={'62%'}
      />
    )}
    <Link
      to={`/how-to/${encodeURIComponent(props.howto.slug)}`}
      key={props.howto._id}
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
            borderRadius: '8px 8px 0px 0px',
            objectFit: 'cover',
          }}
          threshold={500}
          src={props.howto.cover_image.downloadUrl}
          crossOrigin=""
        />
      </Flex>
      <Flex px={3} py={3} sx={{ flexDirection: 'column' }}>
        <Heading small clipped color={'black'}>
          {/* HACK 2021-07-16 - new howtos auto capitalize title but not older */}
          {capitalizeFirstLetter(props.howto.title)}
        </Heading>
        <Flex sx={{ alignItems: 'center' }}>
          {props.howto.creatorCountry && (
            <FlagIconHowTos code={props.howto.creatorCountry} />
          )}
          <Text auxiliary my={2} ml={1} sx={{ display: 'flex' }}>
            By {props.howto._createdBy}
          </Text>
          <VerifiedUserBadge
            userId={props.howto._createdBy}
            ml={1}
            height="12px"
            width="12px"
          />
        </Flex>
        <Flex mt={4}>
          <Flex sx={{ flex: 1, flexWrap: 'wrap' }}>
            {props.howto.tags &&
              Object.keys(props.howto.tags).map(tag => {
                return <TagDisplay key={tag} tagKey={tag} />
              })}
          </Flex>
          {props.votedUsefulCount > 0 && (
            <Flex ml={1} sx={{ alignItems: 'center' }}>
              <Icon glyph="star-active" marginRight="4px" />
              <Text color="black">{props.votedUsefulCount}</Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Link>
  </Flex>
)

export default HowToCard
