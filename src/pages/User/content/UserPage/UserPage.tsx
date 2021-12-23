import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { inject, observer } from 'mobx-react'
import {
  IUserPP,
  IMAchineBuilderXp,
  IOpeningHours,
  PlasticTypeLabel,
} from 'src/models/user_pp.models'

import { UserStore } from 'src/stores/User/user.store'
import Heading from 'src/components/Heading'
import { Box, Image } from 'rebass/styled-components'
// import slick and styles
import Slider from 'react-slick'
import 'src/assets/css/slick.min.css'
import styled from 'styled-components'
import Icon from 'src/components/Icons'
import Flex from 'src/components/Flex'
import ElWithBeforeIcon from 'src/components/ElWithBeforeIcon'
import Workspace from 'src/pages/User/workspace/Workspace'
import { Text } from 'src/components/Text'
import { Link } from 'src/components/Links'

import theme from 'src/themes/styled.theme'
import { replaceDashesWithSpaces } from 'src/utils/helpers'
import FlagIconEvents from 'src/components/Icons/FlagIcon/FlagIcon'

// Plastic types
import HDPEIcon from 'src/assets/images/plastic-types/hdpe.svg'
import LDPEIcon from 'src/assets/images/plastic-types/ldpe.svg'
import OtherIcon from 'src/assets/images/plastic-types/other.svg'
import PETIcon from 'src/assets/images/plastic-types/pet.svg'
import PPIcon from 'src/assets/images/plastic-types/pp.svg'
import PSIcon from 'src/assets/images/plastic-types/ps.svg'
import PVCIcon from 'src/assets/images/plastic-types/pvc.svg'

import EventsIcon from 'src/assets/icons/icon-events.svg'
import HowToCountIcon from 'src/assets/icons/icon-how-to.svg'
import VerifiedBadgeIcon from 'src/assets/icons/icon-verified-badge.svg'
// import V4MemberIcon from 'src/assets/icons/icon-v4-member.svg'

import { IUploadedFileMeta } from 'src/stores/storage'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'
import { Loader } from 'src/components/Loader'

import type { ThemeStore } from 'src/stores/Theme/theme.store'
import { AuthWrapper } from 'src/components/Auth/AuthWrapper'
import { AdminContact } from 'src/components/AdminContact/AdminContact'
import ProfileLink from './ProfileLink'
import { logger } from 'src/logger'
import { Avatar } from 'src/components/Avatar'

interface IRouterCustomParams {
  id: string
}

interface IBackgroundImageProps {
  bgImg: string
}

interface InjectedProps extends RouteComponentProps<IRouterCustomParams> {
  userStore: UserStore,
  themeStore: ThemeStore
}

interface IState {
  user?: IUserPP
  isLoading: boolean
}

interface IProps {}

const UserCategory = styled.div`
  position: relative;
  display: inline-block;
  z-index: ${theme.zIndex.default};

  &:after {
    content: '';
    height: 100%;
    display: block;
    position: absolute;
    top: 0;

    z-index: ${theme.zIndex.behind};
    background-repeat: no-repeat;
    background-size: contain;
    left: 0;
    right: 0;

    ${(props: IBackgroundImageProps) =>
      props.bgImg &&
      `
      background-image: url(${props.bgImg});
    `}
  }
`

const UserContactInfo = styled.div`
  div {
    margin-bottom: 10px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`

const MobileBadge = styled.div`
  position: relative;
  max-width: 120px;
  margin-bottom: 20px;

  @media only screen and (min-width: ${theme.breakpoints[2]}) {
    max-width: 150px;
    margin-top: -50%;
    margin-left: auto;
    margin-right: auto;
  }
`

const UserStatsBox = styled.div`
  margin-top: 15px;
  border: 2px solid black;
  border-radius: 10px;
  padding: 10px;
  background-color: ${theme.colors.background};
  margin-bottom: 20px;
`

const UserStatsBoxItem = styled.div`
  margin-top: 15px;
  display: flex;
  align-items: center;

  &:first-child {
    margin-top: 0;
  }
`

const ProfileWrapper = styled(Box)`
  /* margin-top: 40px;
  margin-bottom: 40px; */
  border: 2px solid black;
  border-radius: 10px;
  overflow: hidden;
  max-width: 1000px;
  width: 100%;
  align-self: center;
`

const ProfileWrapperCarousel = styled.div``

const OpeningHours = styled.p`
  color: ${theme.colors.grey};
  margin-bottom: 5px;
  margin-top: 5px;
`

const PlasticType = styled.div`
  width: 50px;
  margin-right: 15px;

  &:last-child {
    margin-right: 0;
  }
`

const ProfileContentWrapper = styled(Flex)`
  background-color: ${theme.colors.white};
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  /* margin-top: -112px;

  @media only screen and (min-width: ${theme.breakpoints[1]}) {
      margin-top: 0;
  } */
`

const SliderImage = styled.div`
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  /* padding-bottom: 52%; */
  min-height: 300px;
  height: 300px;

  ${(props: IBackgroundImageProps) =>
    props.bgImg &&
    `
    background-image: url(${props.bgImg});
  `}


  @media only screen and (min-width: ${props => props.theme.breakpoints[2]}) {
    height: 500px;
  }
`

const MachineExperienceTab = styled.div`
  display: inline-block;
  padding: 10px;
  border-style: solid;
  border-width: 1px;
  border-color: ${theme.colors.background};
  border-radius: 5px;
  background-color: ${theme.colors.background};
  margin-right: 10px;
`

@inject('userStore', 'themeStore')
@observer
export class UserPage extends React.Component<
  RouteComponentProps<IRouterCustomParams>,
  IState,
  IProps
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

  /* eslint-disable @typescript-eslint/naming-convention*/
  public async UNSAFE_componentWillMount() {
    const userid = this.props.match.params.id
    const userData = await this.injected.userStore.getUserProfile(userid)
    this.setState({
      user: userData ? userData : undefined,
      isLoading: false,
    })
  }
  // Comment on 6.05.20 by BG : renderCommitmentBox commented for now, will be reused with #974
  public renderUserStatsBox(user: IUserPP) {
    let howtoCount = 0
    let eventCount = 0
    try {
      howtoCount = Object.keys(user.stats!.userCreatedHowtos).length
      eventCount = Object.keys(user.stats!.userCreatedEvents).length
    } catch (error) {
      // Comment on 12.10.20 by CC: would be nice if user stats had their own display to make conditional
      // logic easier, but for now will just use a try-catch to also fix cases broken on dev during migration attempts
    }

    return (
      <UserStatsBox>
        {user.badges?.verified && (
          <UserStatsBoxItem style={{ marginBottom: '15px' }}>
            <Image src={VerifiedBadgeIcon} width="22px" height="22px" />
            <Box ml="5px">Verified</Box>
          </UserStatsBoxItem>
        )}
        {user.location && (
          <Link color={'black'} to={'/map/#' + user.userName}>
            <UserStatsBoxItem>
              <Icon glyph="location-on" size="22"></Icon>
              <Box ml="5px">{user.location?.country}</Box>
            </UserStatsBoxItem>
          </Link>
        )}
        {/* {isV4Member && (
          <UserStatsBoxItem>
            <ElWithBeforeIcon IconUrl={V4MemberIcon}>
              V4 Member
            </ElWithBeforeIcon>
          </UserStatsBoxItem>
         )} */}
        {howtoCount > 0 && (
          <UserStatsBoxItem>
            <ElWithBeforeIcon IconUrl={HowToCountIcon} />
            How-to: {howtoCount}
          </UserStatsBoxItem>
        )}
        {eventCount > 0 && (
          <UserStatsBoxItem>
            <ElWithBeforeIcon IconUrl={EventsIcon} />
            Events: {eventCount}
          </UserStatsBoxItem>
        )}
      </UserStatsBox>
    )
  }

  public renderPlasticTypes(plasticTypes: Array<PlasticTypeLabel>) {
    function renderIcon(type: string) {
      switch (type) {
        case 'hdpe':
          return <Image src={HDPEIcon} />
        case 'ldpe':
          return <Image src={LDPEIcon} />
        case 'other':
          return <Image src={OtherIcon} />
        case 'pet':
          return <Image src={PETIcon} />
        case 'pp':
          return <Image src={PPIcon} />
        case 'ps':
          return <Image src={PSIcon} />
        case 'pvc':
          return <Image src={PVCIcon} />
        default:
          return null
      }
    }

    return (
      <div>
        <h4>We collect the following plastic types:</h4>
        <Flex flexWrap="wrap">
          {plasticTypes.map(plasticType => {
            return (
              <PlasticType key={plasticType}>
                {renderIcon(plasticType)}
              </PlasticType>
            )
          })}
        </Flex>
      </div>
    )
  }

  public renderOpeningHours(openingHours: Array<IOpeningHours>) {
    return (
      <div>
        <h4>We're open on:</h4>
        {openingHours.map(openingObj => {
          return (
            <OpeningHours key={openingObj.day}>
              {openingObj.day}: {openingObj.openFrom} - {openingObj.openTo}
            </OpeningHours>
          )
        })}
      </div>
    )
  }

  public renderMachineBuilderXp(machineBuilderXp: Array<IMAchineBuilderXp>) {
    return (
      <>
        <h4>We offer the following services:</h4>
        {machineBuilderXp.map((machineExperience, index) => {
          return (
            <MachineExperienceTab key={`machineXp-${index}`}>
              {machineExperience}
            </MachineExperienceTab>
          )
        })}
      </>
    )
  }

  public renderProfileTypeName(user: IUserPP) {
    const profileTypeNames: { [key in IUserPP['profileType']]: string } = {
      'collection-point': 'Collection Point',
      'community-builder': 'Community Point',
      'machine-builder': 'Machine Builder',
      member: 'Member',
      workspace: 'Workspace',
    }
    return (
      <Heading small bold width={1} capitalize>
        {user.profileType === 'machine-builder' &&
          `${replaceDashesWithSpaces(user.workspaceType!)} `}
        {profileTypeNames[user.profileType]}
      </Heading>
    )
  }

  public render() {
    const { user, isLoading } = this.state
    logger.debug('render', user)
    if (isLoading) {
      return <Loader />
    }
    if (!user) {
      return (
        <Text txtcenter mt="50px" width={1}>
          User not found
        </Text>
      )
    }
    const workspaceHighlightSrc = Workspace.findWordspaceHighlight(
      user.profileType,
    )
    let coverImage = [
      <SliderImage
        key="default-image"
        bgImg="https://i.ibb.co/zhkxbb9/no-image.jpg"
      />,
    ]
    if (user.coverImages && user.coverImages.length > 0) {
      const coverImages: Array<IConvertedFileMeta | IUploadedFileMeta> =
        user.coverImages
      coverImage = coverImages.map(
        (image: IConvertedFileMeta | IUploadedFileMeta) => {
          if ('downloadUrl' in image) {
            return <SliderImage key={image.name} bgImg={image.downloadUrl} />
          }

          return <SliderImage key={image.name} bgImg={image.objectUrl} />
        },
      )
    }
    const shouldRenderUserStatsBox =
      user &&
      (user.location ||
        (user.stats &&
          (user.stats.userCreatedHowtos || user.stats.userCreatedEvents)))
        ? true
        : false

    return (
      <ProfileWrapper mt={4} mb={6}>
        <ProfileWrapperCarousel>
          <Slider {...sliderSettings}>{coverImage}</Slider>
        </ProfileWrapperCarousel>
        <ProfileContentWrapper mt={['-122px', '-122px', 0]} px={[2, 4]} py={4}>
          <Box width={['100%', '100%', '80%']}>
            <Box sx={{ display: ['block', 'block', 'none'] }}>
              <MobileBadge>
                <Avatar profileType={user.profileType}/>
              </MobileBadge>
            </Box>

            <UserCategory bgImg={workspaceHighlightSrc}>
              {this.renderProfileTypeName(user)}
            </UserCategory>

            <Flex alignItems="center">
              {user.location ? (
                <FlagIconEvents code={user.location.countryCode} />
              ) : (
                user.country && (
                  <FlagIconEvents code={user.country.toLowerCase()} />
                )
              )}
              <Heading medium bold color={'black'} my={3} ml={2}>
                {user.displayName}
              </Heading>
            </Flex>
            {user.about && (
              <Text
                preLine
                paragraph
                mt="0"
                mb="20px"
                color={theme.colors.grey}
                width={['80%', '100%']}
              >
                {user.about}
              </Text>
            )}

            {user.profileType === 'collection-point' &&
              user.collectedPlasticTypes &&
              this.renderPlasticTypes(user.collectedPlasticTypes)}

            {user.profileType === 'collection-point' &&
              user.openingHours &&
              this.renderOpeningHours(user.openingHours)}

            {user.profileType === 'machine-builder' &&
              user.machineBuilderXp &&
              this.renderMachineBuilderXp(user.machineBuilderXp)}

            {user.links && user.links.length > 0 && (
              <UserContactInfo>
                <h3>Contact &amp; Links</h3>
                {user.links.map((link, i) => (
                  <ProfileLink link={link} key={'Link-' + i} />
                ))}
              </UserContactInfo>
            )}
            <AuthWrapper roleRequired={'admin'}>
              <Box mt={3}>
                <AdminContact user={user} />
              </Box>
            </AuthWrapper>
          </Box>
          <Box
            width={['100%', '100%', '20%']}
            sx={{ display: ['none', 'none', 'block'] }}
          >
            <MobileBadge>
              <Avatar
                width="150"
                profileType={user.profileType}
                />

              {shouldRenderUserStatsBox && this.renderUserStatsBox(user)}
            </MobileBadge>
          </Box>
        </ProfileContentWrapper>
      </ProfileWrapper>
    )
  }
}

const sliderSettings = {
  dots: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: false,
  nextArrow: (
    <Icon glyph="chevron-right" color={theme.colors.white} size={60} marginRight="4px" />
  ),
  prevArrow: (
    <Icon glyph="chevron-left" color={theme.colors.white} size={60} marginRight="4px" />
  ),
}
