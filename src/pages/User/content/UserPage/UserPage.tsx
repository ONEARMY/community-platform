import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { inject, observer } from 'mobx-react'
import { IUser, ILink } from 'src/models/user.models'
import { UserStore } from 'src/stores/User/user.store'
import Heading from 'src/components/Heading'
import { Box, Link, Image } from 'rebass'
import { Avatar } from 'src/components/Avatar'
import Text from 'src/components/Text'
import styled from 'styled-components'
import Icon from 'src/components/Icons'
import Flex from 'src/components/Flex'
import { littleRadius } from '../../../../components/Flex/index'
import { background } from 'styled-system'
import FlagIconEvents from 'src/components/Icons/FlagIcon/FlagIcon'

interface IRouterCustomParams {
  id: string
}
interface InjectedProps extends RouteComponentProps<IRouterCustomParams> {
  userStore: UserStore
}

interface IState {
  user?: IUser
  isLoading: boolean
}

const Circle = styled(Flex)`
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
`

const ProfileImage = styled(Image)`
  width: 100%;
  height: 450px;
  object-fit: cover;
  border-radius: 8px 8px 0px 0px;
`

const BadgeImage = styled(Image)`
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 2px solid black;
`

@inject('userStore')
@observer
export class UserPage extends React.Component<
  RouteComponentProps<IRouterCustomParams>,
  IState
> {
  constructor(props: any) {
    super(props)
    this.state = {
      user: undefined,
      isLoading: true,
    }
  }
  get injected() {
    return this.props as InjectedProps
  }
  public async componentWillMount() {
    const userid = this.props.match.params.id

    const userData = await this.injected.userStore.getUserProfile(userid)
    console.log('userData', userData)
    this.setState({
      user: userData ? userData : undefined,
      isLoading: false,
    })
  }

  public renderLinks(links: ILink[]) {
    return links.map((link: ILink, index) => {
      console.log('link.label', link.label)
      switch (link.label) {
        case 'email':
          return (
            <Flex m={2} key={index} alignItems={'center'}>
              <Circle bg={'black'}>
                <Icon color={'white'} glyph={'email'} />
              </Circle>
              <Link
                ml={2}
                color={'black'}
                href={'mailto:' + link.url}
                target="_blank"
              >
                {link.label}
              </Link>
            </Flex>
          )
        case 'facebook':
          return (
            <Flex m={2} key={index} alignItems={'center'}>
              <Circle bg={'black'}>
                <Icon color={'white'} glyph={'facebook'} />
              </Circle>
              <Link ml={2} color={'black'} href={'' + link.url} target="_blank">
                {link.label}
              </Link>
            </Flex>
          )
        case 'instagram':
          return (
            <Flex m={2} key={index} alignItems={'center'}>
              <Circle bg={'black'}>
                <Icon color={'white'} glyph={'instagram'} />
              </Circle>
              <Link ml={2} color={'black'} href={'' + link.url} target="_blank">
                {link.label}
              </Link>
            </Flex>
          )
        case 'slack':
          return (
            <Flex m={2} key={index} alignItems={'center'}>
              <Circle bg={'black'}>
                <Icon color={'white'} glyph={'slack'} />
              </Circle>
              <Link ml={2} color={'black'} href={'' + link.url} target="_blank">
                {link.label}
              </Link>
            </Flex>
          )
        case 'discord':
          return (
            <Flex m={2} key={index} alignItems={'center'}>
              <Circle bg={'black'}>
                <Icon color={'white'} glyph={'discord'} />
              </Circle>
              <Link ml={2} color={'black'} href={'' + link.url} target="_blank">
                {link.label}
              </Link>
            </Flex>
          )
        case 'other':
          return (
            <Flex m={2} key={index} alignItems={'center'}>
              <Circle bg={'black'}>
                <Icon color={'white'} glyph={'external-link'} />
              </Circle>
              <Link ml={2} color={'black'} href={'' + link.url} target="_blank">
                {link.label}
              </Link>
            </Flex>
          )
        default:
          return null
      }
    })
  }

  public render() {
    const { user, isLoading } = this.state
    if (user) {
      return (
        <>
          <Flex card mediumRadius my={5} bg={'white'} flexDirection={'column'}>
            <ProfileImage bg={'background'} />
            <Flex
              p={5}
              mx={-2}
              flexDirection={['column-reverse', 'row', 'row']}
            >
              <Flex
                flex={[1, 4, 6]}
                mt={[5, 0, 0]}
                px={2}
                flexDirection={'column'}
              >
                <Heading large>Extrusion Workspace</Heading>
                <Flex mt={6}>
                  <Heading large bold>
                    {user.userName}
                  </Heading>
                  <FlagIconEvents code="DE" />
                </Flex>
                <Flex flexDirection={'column'} mt={2}>
                  <Text large color={'grey'}>
                    Discord: mattia-io#2124
                  </Text>
                  <Text large color={'grey'}>
                    Forums: @vincentvega231029
                  </Text>
                </Flex>
                <Flex mt={6}>
                  <Text
                    large
                    color={'grey'}
                    css={`
                      max-width: 620px;
                    `}
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Suspendisse varius enim in eros elementum tristique. Duis
                    cursus, mi quis viverra ornare, eros dolor interdum nulla,
                    ut commodo diam libero vitae erat. Aenean faucibus nibh et
                    justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae
                    risus tristique posuere.
                  </Text>
                </Flex>
                <Flex flexDirection={'column'}>
                  {user.links ? (
                    <Flex mt={4}>
                      <Heading large>My Links</Heading>
                      {this.renderLinks(user.links)}
                    </Flex>
                  ) : null}
                </Flex>
              </Flex>
              <Flex
                flex={[1, 3, 2]}
                px={2}
                flexDirection={'column'}
                alignItems={'center'}
              >
                <BadgeImage bg={'background'} mt={-20} />
                <Flex
                  card
                  littleRadius
                  width={1}
                  flexDirection={'column'}
                  p={3}
                  bg={'background'}
                  height={'fit-content'}
                  mt={4}
                >
                  <Text mb={2}>Expert</Text>
                  <Text mb={2}>V4 member</Text>
                  <Text mb={2}>How-to: 8</Text>
                  <Text>Events: 12</Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </>
      )
    } else {
      return isLoading ? (
        <Flex>
          <Heading txtcenter width={1}>
            loading...
          </Heading>
        </Flex>
      ) : (
        <div>user not found</div>
      )
    }
  }
}
