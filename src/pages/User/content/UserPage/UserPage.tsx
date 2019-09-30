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
        <Box>
          <Avatar userName={user.userName} width="120px" />
          <Heading large color={'black'} my={3}>
            {user.userName}
          </Heading>
          <Text small color={'grey'}>
            @{user.userName}
          </Text>
          <Flex wrap={'nowrap'} alignItems={'center'}>
            <Circle bg={'blue'} my={3}>
              <Text color={'white'} m={'auto'}>
                C
              </Text>
            </Circle>
            <Heading small inline ml={2} my={0}>
              Community builder
            </Heading>
            {user.year && (
              <Heading small inline color={'grey'} ml={2} my={0}>
                Since {new Date(user.year).getFullYear()}
              </Heading>
            )}
          </Flex>
          <Text lineHeight={2}>{user.about}</Text>
          {user.location && (
            <Flex alignItems={'center'}>
              <Icon size={25} glyph={'location-on'} />
              <Heading small m={3}>
                {user.location.value}
              </Heading>
            </Flex>
          )}
          {user.links ? (
            <Box mt={4}>
              <Heading large>My Links</Heading>
              {this.renderLinks(user.links)}
            </Box>
          ) : null}
        </Box>
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
