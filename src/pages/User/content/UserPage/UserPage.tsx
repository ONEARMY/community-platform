import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { inject, observer } from 'mobx-react'
import { IUserPP, ILink, IMAchineBuilderXp } from 'src/models/user_pp.models'
import { UserStore } from 'src/stores/User/user.store'
import Heading from 'src/components/Heading'
import { Box, Link, Image } from 'rebass'
import { Avatar } from 'src/components/Avatar'
import Text from 'src/components/Text'
import Slider from 'react-slick'
import styled from 'styled-components'
import Icon from 'src/components/Icons'
import Flex from 'src/components/Flex'
import ElWithBeforeIcon from 'src/components/ElWithBeforeIcon'

import theme from 'src/themes/styled.theme'
import { capitalizeFirstLetter } from 'src/utils/helpers'
import { littleRadius } from '../../../../components/Flex/index'
import { background } from 'styled-system'
import FlagIconEvents from 'src/components/Icons/FlagIcon/FlagIcon'

// Highlights
import CollectionHighlight from 'src/assets/images/highlights/highlight-collection-point.svg'
import LocalCommunityHighlight from 'src/assets/images/highlights/highlight-local-community.svg'
import MachineHighlight from 'src/assets/images/highlights/highlight-machine-shop.svg'
import WorkspaceHighlight from 'src/assets/images/highlights/highlight-workspace.svg'
import MemberHighlight from 'src/assets/images/highlights/highlight-member.svg'

// assets profileType
import CollectionBadge from 'src/assets/images/badges/pt-collection-point.svg'
import MemberBadge from 'src/assets/images/badges/pt-member.svg'
import MachineBadge from 'src/assets/images/badges/pt-machine-shop.svg'
import WorkspaceBadge from 'src/assets/images/badges/pt-workspace.svg'
import LocalComBadge from 'src/assets/images/badges/pt-local-community.svg'

// Plastic types
import HDPEIcon from 'src/assets/images/plastic-types/hdpe.svg'
import LDPEIcon from 'src/assets/images/plastic-types/ldpe.svg'
import OtherIcon from 'src/assets/images/plastic-types/other.svg'
import PETIcon from 'src/assets/images/plastic-types/pet.svg'
import PPIcon from 'src/assets/images/plastic-types/pp.svg'
import PSIcon from 'src/assets/images/plastic-types/ps.svg'
import PVCIcon from 'src/assets/images/plastic-types/pvc.svg'

import EventsIcon from 'src/assets/icons/icon-events.svg'
import ExpertIcon from 'src/assets/icons/icon-expert.svg'
import HowToCountIcon from 'src/assets/icons/icon-how-to.svg'
import V4MemberIcon from 'src/assets/icons/icon-v4-member.svg'
import DiscordIcon from 'src/assets/icons/icon-discord.svg'
import BazarIcon from 'src/assets/icons/icon-bazar.svg'
import SocialIcon from 'src/assets/icons/icon-social-media.svg'
import IconForum from 'src/assets/icons/icon-forum.svg'
import IconWebsite from 'src/assets/icons/icon-website.svg'
import { IUploadedFileMeta } from 'src/stores/storage'
import { IConvertedFileMeta } from 'src/components/ImageInput/ImageInput'

const MOCK_PROFILE_TYPES = [
  {
    label: 'workspace',
    textLabel: 'I run a workspace',
    imageSrc: WorkspaceBadge,
    highlightSrc: WorkspaceHighlight,
  },
  {
    label: 'member',
    textLabel: 'I am a member',
    imageSrc: MemberBadge,
    highlightSrc: MemberHighlight,
  },
  {
    label: 'machine-builder',
    textLabel: 'I build machines',
    imageSrc: MachineBadge,
    highlightSrc: MachineHighlight,
  },
  {
    label: 'community-builder',
    textLabel: 'I run a local community',
    imageSrc: LocalComBadge,
    highlightSrc: LocalCommunityHighlight,
  },
  {
    label: 'collection-point',
    textLabel: 'I collect & sort plastic',
    imageSrc: CollectionBadge,
    highlightSrc: CollectionHighlight,
  },
]

const MOCK_WORKSPACE_TYPES = [
  {
    label: 'shredder',
    textLabel: 'shredder',
    subText: 'Shredding plastic waste into flakes',
    imageSrc: '',
  },
  {
    label: 'sheetpress',
    textLabel: 'Sheetpress',
    subText: 'Making recycled plastic sheets',
    imageSrc: '',
  },
  {
    label: 'extrusion',
    textLabel: 'Extrusion',
    subText: 'Extruding plastic into beams or products',
    imageSrc: '',
  },
  {
    label: 'injection',
    textLabel: 'Injection',
    subText: 'Making small productions of goods',
    imageSrc: '',
  },
  {
    label: 'mix',
    textLabel: 'Mix',
    subText: 'Running a workspace with multiple machines and goals',
    imageSrc: '',
  },
]

const MOCK_PROPS = {
  userName: 'chris-m-clarke',
  about:
    "Description of user profile, it's a nice workspace where we build products out of recycled plastic",
  country: '',
  profileType:
    MOCK_WORKSPACE_TYPES[
      Math.floor(Math.random() * MOCK_WORKSPACE_TYPES.length)
    ].label,
  workspaceType:
    MOCK_PROFILE_TYPES[Math.floor(Math.random() * MOCK_PROFILE_TYPES.length)]
      .label,
  coverImages: [
    {
      contentType: 'image/jpeg',
      downloadUrl:
        'https://uploads-ssl.webflow.com/5d41aacc625e7f69441ddaff/5d4986d7c03a642fe243f86d_IMG_20181030_110139.jpg',
      fullPath:
        'uploads/howtosV1/cWngQOnxxD3r3oI8TKx8/Screen Shot 2019-03-16 at 20.40.36.png',
      name: 'Screen Shot 2019-03-16 at 20.40.36.png',
      size: 209068,
      timeCreated: '2019-05-08T12:28:27.318Z',
      type: 'image/jpeg',
      updated: '2019-05-08T12:28:27.318Z',
    },
    {
      contentType: 'image/jpeg',
      downloadUrl:
        'https://firebasestorage.googleapis.com/v0/b/precious-plastics-v4-dev.appspot.com/o/uploads%2FhowtosV1%2FcWngQOnxxD3r3oI8TKx8%2FScreen%20Shot%202019-03-16%20at%2020.40.36.png?alt=media&token=51ac3516-064c-4f1d-ac2b-4460ee9f3500',
      fullPath:
        'uploads/howtosV1/cWngQOnxxD3r3oI8TKx8/Screen Shot 2019-03-16 at 20.40.36.png',
      name: 'Screen Shot 2019-03-16 at 20.40.36.png',
      size: 209068,
      timeCreated: '2019-05-08T12:28:27.318Z',
      type: 'image/jpeg',
      updated: '2019-05-08T12:28:27.318Z',
    },
  ],
  links: [
    {
      label: 'discord',
      url: 'https://www.facebook.com/preciousplastic/',
    },
    {
      label: 'forum',
      url: 'https://www.instagram.com/realpreciousplastic/',
    },
    {
      label: 'website',
      url: 'https://www.facebook.com/preciousplastic/',
    },
    {
      label: 'social',
      url: 'https://www.facebook.com/preciousplastic/',
    },
    {
      label: 'bazar',
      url: 'https://www.facebook.com/preciousplastic/',
    },
  ],
  mapPinDescription: 'This is a description to display on the map user card',
  isExpert: true,
  isV4Member: true,
  location: {
    countryCode: 'gb',
  },
  openingHours: [
    { day: 'Mon', openFrom: '10:00', openTo: '18:00' },
    { day: 'Tue', openFrom: '10:00', openTo: '18:00' },
  ],
  collectedPlasticTypes: [
    { label: 'pet', number: '1' },
    { label: 'hdpe', number: '2' },
    { label: 'pvc', number: '3' },
    { label: 'ldpe', number: '4' },
    { label: 'pp', number: '5' },
    { label: 'ps', number: '6' },
    { label: 'other', number: '7' },
  ],
  machineBuilderXp: [
    { label: 'electronics' },
    { label: 'machining' },
    { label: 'welding' },
    { label: 'assembling' },
    { label: 'mould-making' },
  ],
}

interface IRouterCustomParams {
  id: string
}

interface IBackgroundImageProps {
  bgImg: string
}

interface InjectedProps extends RouteComponentProps<IRouterCustomParams> {
  userStore: UserStore
}

interface IPlasticTypes {
  label: string
}

interface IOpeningHours {
  day: string
  openFrom: string
  openTo: string
}

interface IState {
  user?: IUserPP
  isLoading: boolean
}

interface IProps {}

const Circle = styled(Flex)`
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
`

const UserCategory = styled.div`
  position: relative;
  display: inline-block;
  z-index: 1;

  &:after {
    content: '';
    height: 100%;
    display: block;
    position: absolute;
    top: 0;

    z-index: -1;
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

const UserName = styled(Flex)``

const UserDescription = styled.p`
  color: ${theme.colors.grey};

  margin-top: 0px;
  margin-bottom: 20px;

  display: block;
  color: ${theme.colors.grey};
  font-size: 16px;
  line-height: 28px;

  @media only screen and (min-width: ${theme.breakpoints[1]}) {
    width: 80%;
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

const UserContactInfoItem = styled(Flex)``

const UserContactInfoItemIcon = styled.div``

const UserContactInfoItemLink = styled.a``

const MobileBadge = styled.div`
  position: relative;
  max-width: 150px;

  @media only screen and (min-width: ${theme.breakpoints[1]}) {
    margin-top: -50%;
    margin-left: auto;
    margin-right: auto;
  }
`

const CommitmentBox = styled.div`
  border: 2px solid black;
  border-radius: 10px;
  padding: 20px;
  background-color: ${theme.colors.background};
  margin-top: 20px;
`

const CommitmentBoxItem = styled.div`
  margin-top: 15px;

  &:first-child {
    margin-top: 0;
  }
`

const ProfileWrapper = styled(Box)`
  /* margin-top: 40px;
  margin-bottom: 40px; */
  border: 2px solid black;
  border-radius: 10px;
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

const ProfileContent = styled(Box)``

const ProfileSidebar = styled(Box)``

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


  @media only screen and (min-width: ${theme.breakpoints[1]}) {
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

const DesktopBadge = styled.div``

@inject('userStore')
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

  public async componentWillMount() {
    const userid = this.props.match.params.id

    console.log('USER STORE', this.injected.userStore)

    const userData = await this.injected.userStore.getUserProfile(userid)
    console.log('userData', userData)
    this.setState({
      user: userData ? userData : undefined,
      isLoading: false,
    })
  }

  public renderLinks(links: ILink[]) {
    return links.map((link: ILink, index) => {
      switch (link.label) {
        case 'forum':
          return (
            <ElWithBeforeIcon
              key="link-forum"
              IconUrl={IconForum}
              height="25px"
            >
              <Link ml={2} color={'black'} href={link.url} target="_blank">
                {capitalizeFirstLetter(link.label)}
              </Link>
            </ElWithBeforeIcon>
          )
        case 'website':
          return (
            <ElWithBeforeIcon
              key="link-website"
              IconUrl={IconWebsite}
              height="25px"
            >
              <Link ml={2} color={'black'} href={link.url} target="_blank">
                {capitalizeFirstLetter(link.label)}
              </Link>
            </ElWithBeforeIcon>
          )
        case 'social':
          return (
            <ElWithBeforeIcon
              key="link-social"
              IconUrl={SocialIcon}
              height="25px"
            >
              <Link ml={2} color={'black'} href={link.url} target="_blank">
                {capitalizeFirstLetter(link.label)}
              </Link>
            </ElWithBeforeIcon>
          )
        case 'bazar':
          return (
            <ElWithBeforeIcon
              key="link-bazar"
              IconUrl={BazarIcon}
              height="25px"
            >
              <Link ml={2} color={'black'} href={link.url} target="_blank">
                {capitalizeFirstLetter(link.label)}
              </Link>
            </ElWithBeforeIcon>
          )
        case 'discord':
          return (
            <ElWithBeforeIcon
              key="link-discord"
              IconUrl={DiscordIcon}
              height="25px"
            >
              <Link ml={2} color={'black'} href={link.url} target="_blank">
                {capitalizeFirstLetter(link.label)}
              </Link>
            </ElWithBeforeIcon>
          )
        case 'other':
          return (
            <ElWithBeforeIcon
              key="link-other"
              IconUrl={OtherIcon}
              height="25px"
            >
              <Link ml={2} color={'black'} href={link.url} target="_blank">
                {capitalizeFirstLetter(link.label)}
              </Link>
            </ElWithBeforeIcon>
          )
        default:
          return null
      }
    })
  }

  public renderCommitmentBox() {
    return (
      <CommitmentBox>
        {MOCK_PROPS.isExpert && (
          <CommitmentBoxItem>
            <ElWithBeforeIcon IconUrl={ExpertIcon} height="25px">
              Expert
            </ElWithBeforeIcon>
          </CommitmentBoxItem>
        )}
        {MOCK_PROPS.isV4Member && (
          <CommitmentBoxItem>
            <ElWithBeforeIcon IconUrl={V4MemberIcon}>
              V4 Member
            </ElWithBeforeIcon>
          </CommitmentBoxItem>
        )}
        <CommitmentBoxItem>
          <ElWithBeforeIcon IconUrl={EventsIcon}>0</ElWithBeforeIcon>
        </CommitmentBoxItem>
        <CommitmentBoxItem>
          <ElWithBeforeIcon IconUrl={HowToCountIcon}>0</ElWithBeforeIcon>
        </CommitmentBoxItem>
      </CommitmentBox>
    )
  }

  public findWorkspaceType(workspaceType?: string) {
    if (!workspaceType) {
      return WorkspaceBadge
    }

    const profileTypeObj = MOCK_PROFILE_TYPES.find(
      type => type.label === workspaceType,
    )

    if (profileTypeObj) {
      return profileTypeObj
    }
  }

  public renderPlasticTypes(plasticTypes: Array<IPlasticTypes>) {
    function renderIcon(label: string) {
      switch (label) {
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
              <PlasticType key={plasticType.label}>
                {renderIcon(plasticType.label)}
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

  public render() {
    const { user, isLoading } = this.state

    if (isLoading) {
      return (
        <Flex>
          <Heading txtcenter width={1}>
            loading...
          </Heading>
        </Flex>
      )
    }

    if (!user) {
      return <div>user not found</div>
    }

    const settings = {
      dots: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      adaptiveHeight: false,
      nextArrow: (
        <Icon glyph="chevron-right" color="#fff" size={60} marginRight="4px" />
      ),
      prevArrow: (
        <Icon glyph="chevron-left" color="#fff" size={60} marginRight="4px" />
      ),
    }

    const workspaceMapping = {
      extrusion: {
        title: 'Extrusion ',
      },
    }

    console.log('USER', user)

    const workspaceImgUrl = this.findWorkspaceType(user.profileType)

    console.log('workspaceImgUrl', workspaceImgUrl)

    const coverImage = (
      <SliderImage bgImg="https://uploads-ssl.webflow.com/5d41aacc625e7f69441ddaff/5d4986d7c03a642fe243f86d_IMG_20181030_110139.jpg" />
    )

    // if(user.coverImages && user.coverImages.length > 0) {
    //   const coverImages: Array<IConvertedFileMeta|IUploadedFileMeta> = user.coverImages;
    //   coverImages.map((image)=> {
    //     if (image.objectUrl) {

    //     } else {

    //     }
    //   })
    //   // coverImage = (
    //   //   <>
    //   //     {user.coverImages.map(() => {
    //   //       return (<div>TEST</div>)
    //   //     })}
    //   //   </>
    //   // )
    // }

    return (
      <ProfileWrapper mt={4} mb={6}>
        <ProfileWrapperCarousel>
          <Slider {...settings}>{coverImage}</Slider>
        </ProfileWrapperCarousel>
        <ProfileContentWrapper mt={['-122px', '-122px', 0]} px={4} py={4}>
          <ProfileContent width={['100%', '100%', '80%']}>
            <Box sx={{ display: ['block', 'block', 'none'] }}>
              <MobileBadge>
                <Image src={workspaceImgUrl.imageSrc} />
              </MobileBadge>
            </Box>

            <UserCategory bgImg={workspaceImgUrl.highlightSrc}>
              <Heading small bold width={1}>
                {capitalizeFirstLetter(user.profileType || 'PP')}
              </Heading>
            </UserCategory>

            <UserName alignItems="center">
              <Heading medium bold color={'black'} my={3} mr={2}>
                {capitalizeFirstLetter(user.userName)}
              </Heading>
              <FlagIconEvents code={MOCK_PROPS.location.countryCode} />
            </UserName>

            <UserDescription>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique. Duis cursus,
              mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
              libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum
              lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
            </UserDescription>

            {user.profileType === 'collection-point' &&
              user.collectedPlasticTypes &&
              this.renderPlasticTypes(MOCK_PROPS.collectedPlasticTypes)}

            {user.profileType === 'collection-point' &&
              user.collectedPlasticTypes &&
              this.renderOpeningHours(MOCK_PROPS.openingHours)}

            {user.profileType === 'machine-builder' &&
              user.machineBuilderXp &&
              this.renderMachineBuilderXp(user.machineBuilderXp)}

            {user.links && (
              <UserContactInfo>
                <h3>Contact &amp; Links</h3>
                {this.renderLinks(user.links)}
              </UserContactInfo>
            )}

            <Box sx={{ display: ['block', 'none'] }}>
              {this.renderCommitmentBox()}
            </Box>
          </ProfileContent>
          <ProfileSidebar
            width={['100%', '100%', '20%']}
            sx={{ display: ['none', 'none', 'block'] }}
          >
            <MobileBadge>
              <Image src={workspaceImgUrl.imageSrc} />
            </MobileBadge>
            {this.renderCommitmentBox()}
          </ProfileSidebar>
        </ProfileContentWrapper>
      </ProfileWrapper>
    )
  }
}
