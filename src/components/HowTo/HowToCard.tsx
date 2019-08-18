import React from 'react'
import { Flex, Image, Box } from 'rebass'
import { Link } from 'src/components/Links'
import styled from 'styled-components'
import theme from 'src/themes/styled.preciousplastic'
import TagDisplay from 'src/components/Tags/TagDisplay/TagDisplay'
import { IHowto } from '../../models/howto.models'

const HowToCard = styled.article`
  display: flex;
  background-color: white;
  border-radius: 10px;
  border: 2px solid black;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.02);
  }
`
const HowToImage = styled(Image)`
  width: 100%;
  height: calc(((350px) / 3) * 2);
  object-fit: cover;
`

const HeadingHowToCard = styled.h1`
  font-size: 22px;
  margin: 0px;
  color: ${theme.colors.black};
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-weight: 400;
`

const CreatorText = styled(Box)`
  color: ${theme.colors.grey};
  font-size: 12px;
  margin-top: 5px;
`

interface IProps {
  howto: IHowto
}

export class MoreModal extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
  }
  render() {
    return (
      <>
        <HowToCard>
          <Link
            to={`/how-to/${encodeURIComponent(this.props.howto.slug)}`}
            key={this.props.howto._id}
            width={1}
          >
            <Flex width="1" fontSize={'0px'}>
              <picture>
                <HowToImage src={this.props.howto.cover_image.downloadUrl} />
              </picture>
            </Flex>
            <Flex px={3} py={3} flexDirection="column">
              <HeadingHowToCard>{this.props.howto.title}</HeadingHowToCard>
              <CreatorText>By {this.props.howto._createdBy}</CreatorText>
              <Flex>
                {this.props.howto.tags &&
                  Object.keys(this.props.howto.tags).map(tag => {
                    return <TagDisplay key={tag} tagKey={tag} />
                  })}
              </Flex>
            </Flex>
          </Link>
        </HowToCard>
      </>
    )
  }
}

export default MoreModal
