import type {
  IUserPP,
  IMAchineBuilderXp,
  IOpeningHours,
  PlasticTypeLabel,
} from 'src/models/userPreciousPlastic.models'

import { Heading, Box, Image, Flex, Paragraph } from 'theme-ui'
// import slick and styles
import Slider from 'react-slick'
import 'src/assets/css/slick.min.css'
import styled from '@emotion/styled'

import { MemberBadge, Icon, Username, UserStatistics } from 'oa-components'

// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles

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

import UserContactAndLinks from './UserContactAndLinks'
import { UserAdmin } from './UserAdmin'
import { ProfileType } from 'src/modules/profile/types'
import { isUserVerified } from 'src/common/isUserVerified'
import { useUserUsefulCount } from 'src/common/userUsefulCount'

interface IBackgroundImageProps {
  bgImg: string
}

interface IProps {
  user: IUserPP
}

const MobileBadge = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 0;

  @media only screen and (min-width: ${theme.breakpoints[1]}) {
    align-items: center;
  }

  @media only screen and (min-width: ${theme.breakpoints[2]}) {
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

const ProfileWrapperCarousel = styled.div`
  line-height: 0;
`

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

  @media only screen and (min-width: ${(props) => props.theme.breakpoints[2]}) {
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

const renderPlasticTypes = (plasticTypes: Array<PlasticTypeLabel>) => {
  const renderIcon = (type: string) => {
    switch (type) {
      case 'hdpe':
        return <Image loading="lazy" src={HDPEIcon} />
      case 'ldpe':
        return <Image loading="lazy" src={LDPEIcon} />
      case 'other':
        return <Image loading="lazy" src={OtherIcon} />
      case 'pet':
        return <Image loading="lazy" src={PETIcon} />
      case 'pp':
        return <Image loading="lazy" src={PPIcon} />
      case 'ps':
        return <Image loading="lazy" src={PSIcon} />
      case 'pvc':
        return <Image loading="lazy" src={PVCIcon} />
      default:
        return null
    }
  }

  return (
    <div>
      <h4>We collect the following plastic types:</h4>
      <Flex sx={{ flexWrap: 'wrap' }}>
        {plasticTypes.map((plasticType) => {
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

const renderOpeningHours = (openingHours: Array<IOpeningHours>) => (
  <div>
    <h4>We're open on:</h4>
    {openingHours.map((openingObj) => {
      return (
        <OpeningHours key={openingObj.day}>
          {openingObj.day}: {openingObj.openFrom} - {openingObj.openTo}
        </OpeningHours>
      )
    })}
  </div>
)

const renderMachineBuilderXp = (machineBuilderXp: Array<IMAchineBuilderXp>) => (
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

export const SpaceProfile = ({ user }: IProps) => {
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
    (linkItem) => !['discord', 'forum'].includes(linkItem.label),
  )

  const userCountryCode =
    user.location?.countryCode || user.country?.toLowerCase() || undefined

  return (
    <ProfileWrapper mt={4} mb={6} data-cy="SpaceProfile">
      <ProfileWrapperCarousel>
        <Slider {...sliderSettings}>{coverImage}</Slider>
      </ProfileWrapperCarousel>
      <Flex
        sx={{
          px: [2, 4],
          py: 4,
          background: 'white',
          borderTop: '2px solid',
        }}
      >
        <Box sx={{ width: ['100%', '100%', '80%'] }}>
          <Box sx={{ display: ['block', 'block', 'none'] }}>
            <MobileBadge>
              <MemberBadge profileType={user.profileType} />
            </MobileBadge>
          </Box>

          <Flex
            sx={{
              alignItems: 'center',
              pt: ['0', '40px', '0'],
            }}
          >
            <Username
              user={{
                userName: user.userName,
                countryCode: userCountryCode,
              }}
              isVerified={isUserVerified(user.userName)}
            />
          </Flex>

          <Flex sx={{ alignItems: 'center' }}>
            <Heading
              color={'black'}
              mb={3}
              style={{ wordBreak: 'break-word' }}
              data-cy="userDisplayName"
            >
              {user.displayName}
            </Heading>
          </Flex>
          {user.about && <Paragraph>{user.about}</Paragraph>}

          {user.profileType === ProfileType.COLLECTION_POINT &&
            user.collectedPlasticTypes &&
            renderPlasticTypes(user.collectedPlasticTypes)}

          {user.profileType === ProfileType.COLLECTION_POINT &&
            user.openingHours &&
            renderOpeningHours(user.openingHours)}

          {user.profileType === ProfileType.MACHINE_BUILDER &&
            user.machineBuilderXp &&
            renderMachineBuilderXp(user.machineBuilderXp)}

          <UserContactAndLinks links={userLinks} />
          <Box mt={3}>
            <UserAdmin user={user} />
          </Box>
        </Box>
        <Box
          sx={{
            display: ['none', 'none', 'block'],
            width: ['100%', '100%', '20%'],
          }}
        >
          <MobileBadge>
            <MemberBadge size={150} profileType={user.profileType} />

            <Box
              sx={{
                mt: 3,
              }}
            >
              <UserStatistics
                userName={user.userName}
                country={user.location?.country}
                isVerified={isUserVerified(user.userName)}
                isSupporter={!!user.badges?.supporter}
                howtoCount={
                  user.stats
                    ? Object.keys(user.stats!.userCreatedHowtos).length
                    : 0
                }
                eventCount={
                  user.stats
                    ? Object.keys(user.stats!.userCreatedEvents).length
                    : 0
                }
                // ** TODO: Beta-tester Authentication needs to be removed from useUserUsefulCount
                // ** once aggregations are fixed
                usefulCount={useUserUsefulCount(user) ?? 0}
              />
            </Box>
          </MobileBadge>
        </Box>
      </Flex>
    </ProfileWrapper>
  )
}
