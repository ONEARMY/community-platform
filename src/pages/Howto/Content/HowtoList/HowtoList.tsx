import * as React from 'react'
import { Image, Flex, Box } from 'rebass'
// TODO add loader (and remove this material-ui dep)
import LinearProgress from '@material-ui/core/LinearProgress'
import Text from 'src/components/Text'
import { Link } from 'src/components/Links'
import styled from 'styled-components'
import { Button } from 'src/components/Button'
import { IHowto } from 'src/models/howto.models'
import { TagDisplay } from 'src/components/Tags/TagDisplay/TagDisplay'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import theme from 'src/themes/styled.theme'
import WhiteBubble0 from 'src/assets/images/white-bubble_0.svg'
import WhiteBubble1 from 'src/assets/images/white-bubble_1.svg'
import WhiteBubble2 from 'src/assets/images/white-bubble_2.svg'
import WhiteBubble3 from 'src/assets/images/white-bubble_3.svg'

interface IProps {
  allHowtos: IHowto[]
}

const HowToCard = styled(Flex)`
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

const MoreBox = styled(Box)`
  position: relative;
  &:after {
    content: '';
    background-image: url(${WhiteBubble0});
    width: 100%;
    height: 100%;
    z-index: -1;
    background-size: contain;
    background-repeat: no-repeat;
    position: absolute;
    top: 55%;
    transform: translate(-50%, -50%);
    left: 50%;
    max-width: 850px;
    background-position: center 10%;
  }

  @media only screen and (min-width: ${theme.breakpoints[0]}) {
    &:after {
      background-image: url(${WhiteBubble1});
    }
  }

  @media only screen and (min-width: ${theme.breakpoints[1]}) {
    &:after {
      background-image: url(${WhiteBubble2});
    }
  }

  @media only screen and (min-width: ${theme.breakpoints[2]}) {
    &:after {
      background-image: url(${WhiteBubble3});
    }
  }
`

export class HowtoList extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    const { allHowtos } = this.props
    return (
      <>
        <Flex>
          <Text flex={1} py={26} txtcenter xxlarge bold>
            Learn & share how to recycle, make and hack plastic
          </Text>
        </Flex>
        <Flex justifyContent={'flex-end'} mb={8}>
          <AuthWrapper>
            <Link to={'/how-to/create'}>
              <Button>Create a How-to</Button>
            </Link>
          </AuthWrapper>
        </Flex>
        <React.Fragment>
          {allHowtos.length === 0 ? (
            <LinearProgress />
          ) : (
            <Flex flexWrap="wrap" mx={-4}>
              {allHowtos.map((howto: IHowto) => (
                <Flex px={4} py={4} width={[1, 1 / 2, 1 / 3]}>
                  <HowToCard width={1} bg={'white'}>
                    <Link
                      to={`/how-to/${encodeURIComponent(howto.slug)}`}
                      key={howto._id}
                      width={1}
                    >
                      <Flex width="1" fontSize={'0px'}>
                        <picture>
                          <HowToImage src={howto.cover_image.downloadUrl} />
                        </picture>
                      </Flex>

                      <Flex px={3} py={3} flexDirection="column">
                        <Text
                          clipped
                          fontSize={4}
                          bold
                          color={'black'}
                          width={1}
                        >
                          {howto.title}
                        </Text>
                        <Text
                          capitalize
                          fontSize={1}
                          mt={2}
                          mb={3}
                          color={'grey'}
                        >
                          By <Text inline>{howto._createdBy}</Text>
                        </Text>
                        <Flex width={1} mt={4}>
                          {howto.tags &&
                            Object.keys(howto.tags).map(tag => {
                              return <TagDisplay key={tag} tagKey={tag} />
                            })}
                        </Flex>
                      </Flex>
                    </Link>
                  </HowToCard>
                </Flex>
              ))}
            </Flex>
          )}
          <Flex justifyContent={'center'} py={20}>
            <Button px={3} variant={'secondary'}>
              More How-Tos
            </Button>
          </Flex>
          <MoreBox py={20}>
            <Text bold txtcenter fontSize={[4, 4, 5]}>
              Connect with a likeminded community.
              <br />
              All around the planet.
            </Text>
            <Flex justifyContent={'center'}>
              <Button px={3} mt={5}>
                Create an Event
              </Button>
            </Flex>
          </MoreBox>
        </React.Fragment>
      </>
    )
  }
}
