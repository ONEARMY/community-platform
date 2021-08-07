import { LazyLoadImage } from 'react-lazy-load-image-component'
import Text from 'src/components/Text'
import Flex from 'src/components/Flex'
import ModerationStatusText from 'src/components/ModerationStatusText'
import { Link } from 'src/components/Links'
import { FlagIconHowTos } from 'src/components/Icons/FlagIcon/FlagIcon'
import TagDisplay from 'src/components/Tags/TagDisplay/TagDisplay'
import { IHowtoDB } from 'src/models/howto.models'
import Heading from 'src/components/Heading'
import Icon from 'src/components/Icons'
import { capitalizeFirstLetter } from 'src/utils/helpers'

interface IProps {
  howto: IHowtoDB
}
export const HowToCard = (props: IProps) => (
  <Flex
    card
    mediumRadius
    mediumScale
    bg={'white'}
    width={1}
    data-cy="card"
    sx={{ position: 'relative' }}
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
      width={1}
    >
      <Flex width="1" fontSize={'0px'}>
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
      <Flex px={3} py={3} flexDirection="column">
        <Heading small clipped color={'black'}>
          {/* HACK 2021-07-16 - new howtos auto capitalize title but not older */}
          {capitalizeFirstLetter(props.howto.title)}
        </Heading>
        <Flex alignItems="center">
          {props.howto.creatorCountry && (
            <FlagIconHowTos code={props.howto.creatorCountry} />
          )}
          <Text auxiliary my={2} ml={1}>
            By {props.howto._createdBy}
          </Text>
        </Flex>
        <Flex mt={4}>
          <Flex>
            {props.howto.tags &&
              Object.keys(props.howto.tags).map(tag => {
                return <TagDisplay key={tag} tagKey={tag} />
              })}
          </Flex>
          <Flex ml="auto" alignItems="center">
            <Icon glyph="star-active" marginRight="4px" />
            <Text color="black">
              {props.howto.stats?.votedUsefulCount || '0'}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Link>
  </Flex>
)

export default HowToCard
