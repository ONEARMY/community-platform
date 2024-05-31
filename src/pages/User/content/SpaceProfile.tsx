import {
  ImageGallery,
  MemberBadge,
  Tab,
  TabPanel,
  Tabs,
  TabsList,
  Username,
  UserStatistics,
} from 'oa-components'
import { ExternalLinkLabel } from 'oa-shared'
// Plastic types
import HDPEIcon from 'src/assets/images/plastic-types/hdpe.svg'
import LDPEIcon from 'src/assets/images/plastic-types/ldpe.svg'
import OtherIcon from 'src/assets/images/plastic-types/other.svg'
import PETIcon from 'src/assets/images/plastic-types/pet.svg'
import PPIcon from 'src/assets/images/plastic-types/pp.svg'
import PSIcon from 'src/assets/images/plastic-types/ps.svg'
import PVCIcon from 'src/assets/images/plastic-types/pvc.svg'
import { isPreciousPlastic } from 'src/config/config'
import { ProfileType } from 'src/modules/profile/types'
import { formatImagesForGallery } from 'src/utils/formatImageListForGallery'
import { getUserCountry } from 'src/utils/getUserCountry'
import {
  AspectRatio,
  Box,
  Container,
  Flex,
  Heading,
  Image,
  Paragraph,
} from 'theme-ui'

import { UserContactForm } from '../contact/UserContactForm'
import { Impact } from '../impact/Impact'
import { heading } from '../impact/labels'
import UserContactAndLinks from './UserContactAndLinks'
import UserCreatedDocuments from './UserCreatedDocuments'

import type {
  IMAchineBuilderXp,
  IOpeningHours,
  IUserPP,
  PlasticTypeLabel,
} from 'src/models/userPreciousPlastic.models'
import type { UserCreatedDocs } from '../types'

interface IProps {
  user: IUserPP
  docs: UserCreatedDocs | undefined
}

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

const getCoverImages = (user: IUserPP) => {
  if (user.coverImages && user.coverImages.length) {
    return user.coverImages
  }

  return []
}

export const SpaceProfile = ({ user, docs }: IProps) => {
  const { about, displayName, impact, links, location, profileType, userName } =
    user

  const coverImage = getCoverImages(user)

  const userLinks = links.filter(
    (linkItem) =>
      ![ExternalLinkLabel.DISCORD, ExternalLinkLabel.FORUM].includes(
        linkItem.label,
      ),
  )

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
        {coverImage.length ? (
          <ImageGallery
            images={formatImagesForGallery(coverImage)}
            hideThumbnails={true}
            showNextPrevButton={true}
          />
        ) : (
          <AspectRatio ratio={24 / 3}>
            <Flex
              sx={{
                width: '100%',
                height: '100%',
                background: '#ddd',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              No images available.
            </Flex>
          </AspectRatio>
        )}
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
              <MemberBadge profileType={profileType} />
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
              <MemberBadge size={150} profileType={profileType} />
            </Box>
            <Box>
              <Username
                user={{
                  ...user,
                  countryCode: getUserCountry(user),
                }}
              />
              <Heading
                as="h1"
                color={'black'}
                mb={3}
                style={{ wordBreak: 'break-word' }}
                data-cy="userDisplayName"
              >
                {displayName}
              </Heading>
            </Box>
          </Box>

          <Tabs defaultValue={0}>
            <TabsList>
              <Tab>Profile</Tab>
              <Tab>Contributions</Tab>
              {isPreciousPlastic() && <Tab data-cy="ImpactTab">{heading}</Tab>}
              <Tab data-cy="contact-tab">Contact</Tab>
            </TabsList>
            <TabPanel>
              <Box sx={{ mt: 3 }}>
                <Flex
                  sx={{
                    flexDirection: ['column', 'column', 'row'],
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: [0, 0, 6],
                  }}
                >
                  <Box
                    sx={{
                      width: ['100%', '100%', '80%'],
                    }}
                  >
                    {about && <Paragraph>{about}</Paragraph>}

                    {profileType === ProfileType.COLLECTION_POINT &&
                      user.collectedPlasticTypes &&
                      renderPlasticTypes(user.collectedPlasticTypes)}

                    {profileType === ProfileType.COLLECTION_POINT &&
                      user.openingHours &&
                      renderOpeningHours(user.openingHours)}

                    {profileType === ProfileType.MACHINE_BUILDER &&
                      user.machineBuilderXp &&
                      renderMachineBuilderXp(user.machineBuilderXp)}
                  </Box>
                  <Box
                    sx={{
                      width: ['auto', 'auto', '20%'],
                      mt: [3, 3, 0],
                    }}
                  >
                    <UserStatistics
                      userName={userName}
                      country={location?.country}
                      isVerified={user.verified}
                      isSupporter={!!user.badges?.supporter}
                      howtoCount={docs?.howtos.length || 0}
                      usefulCount={user.totalUseful || 0}
                      researchCount={docs?.research.length || 0}
                    />
                  </Box>
                </Flex>
              </Box>
            </TabPanel>
            <TabPanel>
              <UserCreatedDocuments docs={docs} />
            </TabPanel>
            {isPreciousPlastic() && (
              <TabPanel>
                <Impact impact={impact} user={user} />
              </TabPanel>
            )}
            <TabPanel>
              <Box>
                <UserContactForm user={user} />
                <UserContactAndLinks links={userLinks} />
              </Box>
            </TabPanel>
          </Tabs>
        </Box>
      </Flex>
    </Container>
  )
}
