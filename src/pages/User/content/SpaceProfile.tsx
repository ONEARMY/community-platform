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
import { ExternalLinkLabel, ProfileTypeList } from 'oa-shared'
// Plastic types
import HDPEIcon from 'src/assets/images/plastic-types/hdpe.svg'
import LDPEIcon from 'src/assets/images/plastic-types/ldpe.svg'
import OtherIcon from 'src/assets/images/plastic-types/other.svg'
import PETIcon from 'src/assets/images/plastic-types/pet.svg'
import PPIcon from 'src/assets/images/plastic-types/pp.svg'
import PSIcon from 'src/assets/images/plastic-types/ps.svg'
import PVCIcon from 'src/assets/images/plastic-types/pvc.svg'
import { isPreciousPlastic } from 'src/config/config'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import { formatImagesForGallery } from 'src/utils/formatImageListForGallery'
import { getUserCountry } from 'src/utils/getUserCountry'
import {
  AspectRatio,
  Avatar,
  Box,
  Card,
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
    IUser,
  PlasticTypeLabel,
} from 'oa-shared'
import type { UserCreatedDocs } from '../types'

interface IProps {
  user: IUser
  docs: UserCreatedDocs | undefined
}

const renderPlasticTypes = (plasticTypes: Array<PlasticTypeLabel>) => {
  const renderIcon = (type: string) => {
    const iconMap = {
      hdpe: HDPEIcon,
      ldpe: LDPEIcon,
      other: OtherIcon,
      pet: PETIcon,
      pp: PPIcon,
      ps: PSIcon,
      pvc: PVCIcon,
    }

    const toRender = iconMap[type]
    return (
      toRender && (
        <Image data-cy={`plastic-type-${type}`} loading="lazy" src={toRender} />
      )
    )
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

const renderOpeningHours = (openingHours: IOpeningHours[]) => (
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

const renderMachineBuilderXp = (machineBuilderXp: IMAchineBuilderXp[]) => (
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
          {machineExperience.label}
        </Box>
      )
    })}
  </>
)

const getCoverImages = (user: IUser) => {
  if (user.coverImages && user.coverImages.length) {
    return user.coverImages
  }

  return []
}

export const SpaceProfile = ({ user, docs }: IProps) => {
  const {
    about,
    displayName,
    impact,
    links,
    location,
    profileType,
    userName,
    userImage,
  } = user

  const coverImage = getCoverImages(user)

  const userLinks = links.filter(
    (linkItem) =>
      ![ExternalLinkLabel.DISCORD, ExternalLinkLabel.FORUM].includes(
        linkItem.label,
      ),
  )

  return (
    <Card data-cy="SpaceProfile">
      <Box>
        {coverImage.length ? (
          <ImageGallery
            images={formatImagesForGallery(coverImage) as any}
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
          padding: [2, 4],
          borderTop: '2px solid',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Box sx={{ position: 'relative' }}>
            <Box
              sx={{
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 0,
                transform: 'translateY(-50%)',
              }}
            >
              <Box sx={{ display: ['none', 'none', 'block'] }}>
                <MemberBadge size={150} profileType={profileType} />
              </Box>
              <Box sx={{ display: ['none', 'block', 'none'] }}>
                <MemberBadge size={100} profileType={profileType} />
              </Box>
              <Box sx={{ display: ['block', 'none', 'none'] }}>
                <MemberBadge size={75} profileType={profileType} />
              </Box>
            </Box>

            <Flex sx={{ gap: 2, alignItems: 'center', paddingBottom: [2, 4] }}>
              {userImage?.downloadUrl && (
                <Avatar
                  data-cy="userImage"
                  src={cdnImageUrl(userImage.downloadUrl, { width: 50 })}
                  sx={{
                    objectFit: 'cover',
                    width: '50px',
                    height: '50px',
                  }}
                />
              )}
              <Flex sx={{ flexDirection: 'column' }}>
                <Username
                  user={{
                    ...user,
                    countryCode: getUserCountry(user),
                  }}
                />
                <Heading
                  as="h1"
                  color={'black'}
                  style={{ wordBreak: 'break-word' }}
                  data-cy="userDisplayName"
                >
                  {displayName}
                </Heading>
              </Flex>
            </Flex>
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

                    {profileType === ProfileTypeList.COLLECTION_POINT &&
                      user.collectedPlasticTypes &&
                      renderPlasticTypes(user.collectedPlasticTypes)}

                    {profileType === ProfileTypeList.COLLECTION_POINT &&
                      user.openingHours &&
                      renderOpeningHours(user.openingHours)}

                    {profileType === ProfileTypeList.MACHINE_BUILDER &&
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
    </Card>
  )
}
