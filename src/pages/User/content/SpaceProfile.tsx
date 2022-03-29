import {
  IUserPP,
  IMAchineBuilderXp,
  IOpeningHours,
  PlasticTypeLabel,
} from 'src/models/user_pp.models'

import Heading from 'src/components/Heading'
import { Box, Image } from 'theme-ui'
// import slick and styles
import Slider from 'react-slick'
import 'src/assets/css/slick.min.css'
import styled from '@emotion/styled'
import Flex from 'src/components/Flex'
import Workspace from 'src/pages/User/workspace/Workspace'
import { Text } from 'src/components/Text'

import Badge from 'src/components/Badge/Badge';

import theme from 'src/themes/styled.theme'
import { replaceDashesWithSpaces } from 'src/utils/helpers'
import { Icon, FlagIcon } from 'oa-components'

// Plastic types
import HDPEIcon from 'src/assets/images/plastic-types/hdpe.svg'
import LDPEIcon from 'src/assets/images/plastic-types/ldpe.svg'
import OtherIcon from 'src/assets/images/plastic-types/other.svg'
import PETIcon from 'src/assets/images/plastic-types/pet.svg'
import PPIcon from 'src/assets/images/plastic-types/pp.svg'
import PSIcon from 'src/assets/images/plastic-types/ps.svg'
import PVCIcon from 'src/assets/images/plastic-types/pvc.svg'

// import V4MemberIcon from 'src/assets/icons/icon-v4-member.svg'

import type { IUploadedFileMeta } from 'src/stores/storage'
import type { IConvertedFileMeta } from 'src/types'

import { UserStats } from './UserStats'
import UserContactAndLinks from './UserContactAndLinks'

interface IBackgroundImageProps {
  bgImg: string
}

interface IProps {
  user: IUserPP
  adminButton?: JSX.Element
}

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

const sliderSettings = {
  dots: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: false,
  nextArrow: (
    <Icon
      glyph="chevron-right"
      color={theme.colors.white}
      size={60}
      marginRight="4px"
    />
  ),
  prevArrow: (
    <Icon
      glyph="chevron-left"
      color={theme.colors.white}
      size={60}
      marginRight="4px"
    />
  ),
}

// Comment on 6.05.20 by BG : renderCommitmentBox commented for now, will be reused with #974

function renderPlasticTypes(plasticTypes: Array<PlasticTypeLabel>) {
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
      <Flex sx={{flexWrap:"wrap"}}>
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

function renderOpeningHours(openingHours: Array<IOpeningHours>) {
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

function renderMachineBuilderXp(machineBuilderXp: Array<IMAchineBuilderXp>) {
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

function renderProfileTypeName(user: IUserPP) {
  const profileTypeNames: { [key in IUserPP['profileType']]: string } = {
    'collection-point': 'Collection Point',
    'community-builder': 'Community Point',
    'machine-builder': 'Machine Builder',
    member: 'Member',
    workspace: 'Workspace',
  }
  return (
    <Heading small bold capitalize>
      {user.profileType === 'machine-builder' &&
        `${replaceDashesWithSpaces(user.workspaceType!)} `}
      {profileTypeNames[user.profileType]}
    </Heading>
  )
}

export const SpaceProfile = ({ user, adminButton }: IProps) => {
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

  const userLinks = user?.links.filter(
    linkItem => !['discord', 'forum'].includes(linkItem.label),
  )

  const userCountryCode = user.location?.countryCode || user.country?.toLowerCase() || null

  return (
    <ProfileWrapper mt={4} mb={6}>
      <ProfileWrapperCarousel>
        <Slider {...sliderSettings}>{coverImage}</Slider>
      </ProfileWrapperCarousel>
      <ProfileContentWrapper mt={['-122px', '-122px', 0]} px={[2, 4]} py={4}>
        <Box sx={{width:['100%', '100%', '80%']}}>
          <Box sx={{ display: ['block', 'block', 'none'] }}>
            <MobileBadge>
              <Badge profileType={user.profileType} />
            </MobileBadge>
          </Box>

          <UserCategory bgImg={workspaceHighlightSrc}>
            {renderProfileTypeName(user)}
          </UserCategory>

          <Flex sx={{alignItems: "center"}}>
            <Heading medium bold color={'black'} my={3} style={{wordBreak:'break-word'}}>
              {userCountryCode && (
                <FlagIcon mr={2} code={userCountryCode} style={{display: 'inline-block'}} />
              )}
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
              sx={{width:['80%', '100%']}}
            >
              {user.about}
            </Text>
          )}

          {user.profileType === 'collection-point' &&
            user.collectedPlasticTypes &&
            renderPlasticTypes(user.collectedPlasticTypes)}

          {user.profileType === 'collection-point' &&
            user.openingHours &&
            renderOpeningHours(user.openingHours)}

          {user.profileType === 'machine-builder' &&
            user.machineBuilderXp &&
            renderMachineBuilderXp(user.machineBuilderXp)}

          <UserContactAndLinks links={userLinks}/>
          <Box mt={3}>{adminButton}</Box>
        </Box>
        <Box
          sx={{ display: ['none', 'none', 'block'],
          width:['100%', '100%', '20%'] }}
        >
          <MobileBadge>
            <Badge size={150} profileType={user.profileType} />

            <UserStats user={user} />
          </MobileBadge>
        </Box>
      </ProfileContentWrapper>
    </ProfileWrapper>
  )
}
