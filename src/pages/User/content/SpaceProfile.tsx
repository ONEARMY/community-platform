import type {
  IUserPP,
  IMAchineBuilderXp,
  IOpeningHours,
  PlasticTypeLabel,
} from 'src/models/userPreciousPlastic.models'

import { Box, Container, Flex, Heading, Image, Paragraph } from 'theme-ui'
// import slick and styles
import Slider from 'react-slick'
import 'src/assets/css/slick.min.css'

import {
  MemberBadge,
  Icon,
  Username,
  UserStatistics,
  Tab,
  TabsList,
  Tabs,
  TabPanel,
} from 'oa-components'
import UserCreatedDocuments from './UserCreatedDocuments'
import { useCommonStores } from 'src/index'

// Plastic types
import HDPEIcon from 'src/assets/images/plastic-types/hdpe.svg'
import LDPEIcon from 'src/assets/images/plastic-types/ldpe.svg'
import OtherIcon from 'src/assets/images/plastic-types/other.svg'
import PETIcon from 'src/assets/images/plastic-types/pet.svg'
import PPIcon from 'src/assets/images/plastic-types/pp.svg'
import PSIcon from 'src/assets/images/plastic-types/ps.svg'
import PVCIcon from 'src/assets/images/plastic-types/pvc.svg'

import type { IUploadedFileMeta } from 'src/stores/storage'
import type { IConvertedFileMeta } from 'src/types'

import UserContactAndLinks from './UserContactAndLinks'
import { ProfileType } from 'src/modules/profile/types'
import { userStats } from 'src/common/hooks/userStats'
import { UserContactForm } from 'src/pages/User/contact'
import { AuthWrapper } from 'src/common/AuthWrapper'

import type { UserCreatedDocs } from '.'

interface IBackgroundImageProps {
  bgImg: string
}

interface IProps {
  user: IUserPP
  docs: UserCreatedDocs | undefined
}

const SliderImage = (props: IBackgroundImageProps) => (
  <Box
    sx={{
      backgroundImage: `url(${props.bgImg})`,
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      height: ['300px', '300px', '300px', '500px'],
      width: '100%',
    }}
    {...props}
  ></Box>
)

const MobileBadge = ({ children }) => (
  <Flex
    sx={{
      alignItems: ['left', 'left', 'center'],
      flexDirection: 'column',
      marginBottom: 0,
      marginLeft: [0, 0, 'auto'],
      marginRight: [0, 0, 'auto'],
      marginTop: [0, 0, '-50%'],
      position: 'relative',
    }}
  >
    {children}
  </Flex>
)

const sliderSettings = {
  dots: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  adaptiveHeight: false,
  nextArrow: (
    <Icon glyph="chevron-right" color="white" size={60} marginRight="4px" />
  ),
  prevArrow: (
    <Icon glyph="chevron-left" color="white" size={60} marginRight="4px" />
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
      <Flex
        sx={{
          flexWrap: 'wrap',
          columnGap: '15px',
        }}
      >
        {plasticTypes.map((plasticType) => {
          return (
            <Box
              key={plasticType}
              sx={{
                width: '50px',
              }}
            >
              {renderIcon(plasticType)}
            </Box>
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
        <p key={openingObj.day}>
          {openingObj.day}: {openingObj.openFrom} - {openingObj.openTo}
        </p>
      )
    })}
  </div>
)

const renderMachineBuilderXp = (machineBuilderXp: Array<IMAchineBuilderXp>) => (
  <>
    <h4>We offer the following services:</h4>
    {machineBuilderXp.map((machineExperience, index) => {
      return (
        <Box
          sx={{
            backgroundColor: 'background',
            borderColor: 'background',
            borderRadius: '5px',
            borderStyle: 'solid',
            borderWidth: '1px',
            display: 'inline-block',
            marginRight: '10px',
            padding: '10px',
          }}
          key={`machineXp-${index}`}
        >
          {machineExperience}
        </Box>
      )
    })}
  </>
)

export const SpaceProfile = ({ user, docs }: IProps) => {
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

  const stats = userStats(user.userName)

  const userLinks = user?.links.filter(
    (linkItem) => !['discord', 'forum'].includes(linkItem.label),
  )

  const userCountryCode =
    user.location?.countryCode || user.country?.toLowerCase() || undefined

  const { stores } = useCommonStores()
  const showContactForm =
    user.isContactableByPublic && !!stores.userStore.activeUser

  return (
    <Container
      mt={4}
      mb={6}
      sx={{
        border: '2px solid black',
        borderRadius: '10px',
        overflow: 'hidden',
        maxWidth: '1000px',
      }}
      data-cy="SpaceProfile"
    >
      <Box sx={{ lineHeight: 0 }}>
        <Slider {...sliderSettings}>{coverImage}</Slider>
      </Box>
      <Flex
        sx={{
          px: [2, 4],
          py: 4,
          background: 'white',
          borderTop: '2px solid',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: ['block', 'block', 'none'] }}>
            <MobileBadge>
              <MemberBadge profileType={user.profileType} />
            </MobileBadge>
          </Box>

          <Box
            sx={{
              position: 'relative',
              pt: ['0', '40px', '0'],
            }}
          >
            <Box
              sx={{
                display: ['none', 'none', 'block'],
                position: 'absolute',
                top: 0,
                right: 0,
                transform: 'translateY(-100px)',
              }}
            >
              <MemberBadge size={150} profileType={user.profileType} />
            </Box>
            <Box>
              <Username
                user={{
                  userName: user.userName,
                  countryCode: userCountryCode,
                }}
                isVerified={stats.verified}
              />
              <Heading
                color={'black'}
                mb={3}
                style={{ wordBreak: 'break-word' }}
                data-cy="userDisplayName"
              >
                {user.displayName}
              </Heading>
            </Box>
          </Box>

          <Tabs defaultValue={0}>
            <TabsList>
              <Tab>Profile</Tab>
              <Tab>Contributions</Tab>
              <AuthWrapper roleRequired={'beta-tester'}>
                {showContactForm && <Tab data-cy="contact-tab">Contact</Tab>}
              </AuthWrapper>
            </TabsList>
            <TabPanel>
              <Box sx={{ mt: 3 }}>
                <Flex
                  sx={{
                    flexDirection: ['column', 'column', 'row'],
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      width: ['100%', '100%', '80%'],
                    }}
                  >
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
                  </Box>
                  <Box
                    sx={{
                      width: ['auto', 'auto', '20%'],
                      mt: [3, 3, 0],
                    }}
                  >
                    <UserStatistics
                      userName={user.userName}
                      country={user.location?.country}
                      isVerified={stats.verified}
                      isSupporter={!!user.badges?.supporter}
                      howtoCount={docs?.howtos.length || 0}
                      usefulCount={stats.totalUseful}
                      researchCount={docs?.research.length || 0}
                    />
                  </Box>
                </Flex>
              </Box>
            </TabPanel>
            <TabPanel>
              <UserCreatedDocuments docs={docs} />
            </TabPanel>
            <AuthWrapper roleRequired={'beta-tester'}>
              <TabPanel>
                <UserContactForm user={user} />
              </TabPanel>
            </AuthWrapper>
          </Tabs>
        </Box>
      </Flex>
    </Container>
  )
}
