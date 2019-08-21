import React from 'react'
import { Image } from 'rebass'
import Text from 'src/components/Text'
import Flex from 'src/components/Flex'
import { Link } from 'src/components/Links'
import styled from 'styled-components'
import TagDisplay from 'src/components/Tags/TagDisplay/TagDisplay'
import { IHowto } from '../../models/howto.models'

const HowToImage = styled(Image)`
  width: 100%;
  height: calc(((350px) / 3) * 2);
  object-fit: cover;
`

interface IProps {
  howto: IHowto
}

export class HowToCard extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
  }
  render() {
    return (
      <>
        <Flex card mediumRadius mediumScale width={1}>
          <Link
            to={`/how-to/${encodeURIComponent(this.props.howto.slug)}`}
            key={this.props.howto._id}
            width={1}
          >
            <Flex width="1" fontSize={'0px'}>
              <HowToImage src={this.props.howto.cover_image.downloadUrl} />
            </Flex>
            <Flex px={3} py={3} flexDirection="column">
              <Text cardTitle clipped>
                {this.props.howto.title}
              </Text>
              <Text auxiliary>By {this.props.howto._createdBy}</Text>
              <Flex mt={4}>
                {this.props.howto.tags &&
                  Object.keys(this.props.howto.tags).map(tag => {
                    return <TagDisplay key={tag} tagKey={tag} />
                  })}
              </Flex>
            </Flex>
          </Link>
        </Flex>
      </>
    )
  }
}

export default HowToCard
