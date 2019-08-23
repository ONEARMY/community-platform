import React from 'react'
import { Image } from 'rebass'
import Text from 'src/components/Text'
import Flex from 'src/components/Flex'
import { Link } from 'src/components/Links'
import styled from 'styled-components'
import TagDisplay from 'src/components/Tags/TagDisplay/TagDisplay'
import { IHowto } from '../../models/howto.models'
import Heading from 'src/components/Heading'

const HowToImage = styled(Image)`
  width: 100%;
  height: calc(((350px) / 3) * 2);
  object-fit: cover;
`

interface IProps {
  howto: IHowto
}

export const HowToCard = (props: IProps) => (
  <Flex card mediumRadius mediumScale bg={'white'} width={1}>
    <Link
      to={`/how-to/${encodeURIComponent(props.howto.slug)}`}
      key={props.howto._id}
      width={1}
    >
      <Flex width="1" fontSize={'0px'}>
        <HowToImage src={props.howto.cover_image.downloadUrl} />
      </Flex>
      <Flex px={3} py={3} flexDirection="column">
        <Heading small clipped color={'black'}>
          {props.howto.title}
        </Heading>
        <Text auxiliary>By {props.howto._createdBy}</Text>
        <Flex mt={4}>
          {props.howto.tags &&
            Object.keys(props.howto.tags).map(tag => {
              return <TagDisplay key={tag} tagKey={tag} />
            })}
        </Flex>
      </Flex>
    </Link>
  </Flex>
)

export default HowToCard
