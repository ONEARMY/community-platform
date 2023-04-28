import { format } from 'date-fns'
import { useState, useEffect } from 'react'
import type { IHowtoDB } from 'src/models/howto.models'
import { Heading, Text, Box, Flex, Image, AspectImage } from 'theme-ui'
import StepsIcon from 'src/assets/icons/icon-steps.svg'
import TimeNeeded from 'src/assets/icons/icon-time-needed.svg'
import DifficultyLevel from 'src/assets/icons/icon-difficulty-level.svg'
import {
  Button,
  ModerationStatus,
  LinkifyText,
  UsefulStatsButton,
  CategoryTag,
  FileInformation,
  Username,
  ViewsCounter,
  DownloadFiles,
} from 'oa-components'
import type { IUser } from 'src/models/user.models'
import { isAllowToEditContent, capitalizeFirstLetter } from 'src/utils/helpers'
import { Link } from 'react-router-dom'
import { useCommonStores } from 'src/index'
import {
  retrieveHowtoDownloadCooldown,
  isHowtoDownloadCooldownExpired,
  addHowtoDownloadCooldown,
  updateHowtoDownloadCooldown,
} from './downloadCooldown'
import {
  retrieveSessionStorageArray,
  addIDToSessionStorageArray,
} from 'src/utils/sessionStorage'
import { AuthWrapper } from 'src/common/AuthWrapper'
import { isUserVerified } from 'src/common/isUserVerified'

interface IProps {
  howto: IHowtoDB & { taglist: any }
  loggedInUser: IUser | undefined
  needsModeration: boolean
  votedUsefulCount?: number
  verified?: boolean
  hasUserVotedUseful: boolean
  moderateHowto: (accepted: boolean) => void
  onUsefulClick: () => void
}

const HowtoDescription = ({ howto, loggedInUser, ...props }: IProps) => {
  const [fileDownloadCount, setFileDownloadCount] = useState(
    howto.total_downloads,
  )
  let didInit = false
  const [viewCount, setViewCount] = useState<number | undefined>()
  const { stores } = useCommonStores()

  const incrementDownloadCount = async () => {
    const updatedDownloadCount = await stores.howtoStore.incrementDownloadCount(
      howto._id,
    )
    setFileDownloadCount(updatedDownloadCount!)
  }

  const incrementViewCount = async () => {
    const sessionStorageArray = retrieveSessionStorageArray('howto')

    if (!sessionStorageArray.includes(howto._id)) {
      const updatedViewCount = await stores.howtoStore.incrementViewCount(
        howto._id,
      )
      setViewCount(updatedViewCount)
      addIDToSessionStorageArray('howto', howto._id)
    } else {
      setViewCount(howto.total_views)
    }
  }

  const handleClick = async () => {
    const howtoDownloadCooldown = retrieveHowtoDownloadCooldown(howto._id)

    if (
      howtoDownloadCooldown &&
      isHowtoDownloadCooldownExpired(howtoDownloadCooldown)
    ) {
      updateHowtoDownloadCooldown(howto._id)
      incrementDownloadCount()
    } else if (!howtoDownloadCooldown) {
      addHowtoDownloadCooldown(howto._id)
      incrementDownloadCount()
    }
  }

  const dateLastEditText = (howto: IHowtoDB): string => {
    const lastModifiedDate = format(new Date(howto._modified), 'DD-MM-YYYY')
    const creationDate = format(new Date(howto._created), 'DD-MM-YYYY')
    if (lastModifiedDate !== creationDate) {
      return 'Last edit on ' + format(new Date(howto._modified), 'DD-MM-YYYY')
    } else {
      return ''
    }
  }

  useEffect(() => {
    if (!didInit) {
      didInit = true
      incrementViewCount()
    }
  }, [howto._id])

  return (
    <Flex
      data-cy="how-to-basis"
      data-id={howto._id}
      className="howto-description-container"
      sx={{
        borderRadius: 2,
        bg: 'white',
        borderColor: 'black',
        borderStyle: 'solid',
        borderWidth: '2px',
        overflow: 'hidden',
        flexDirection: ['column-reverse', 'column-reverse', 'row'],
        mt: 4,
      }}
    >
      <Flex
        px={4}
        py={4}
        sx={{
          flexDirection: 'column',
          width: ['100%', '100%', `${(1 / 2) * 100}%`],
        }}
      >
        <Flex sx={{ flexWrap: 'wrap', gap: '10px' }}>
          <Link to={'/how-to/'}>
            <Button
              variant="subtle"
              sx={{ fontSize: '14px' }}
              data-cy="go-back"
              icon="arrow-back"
            >
              Back
            </Button>
          </Link>
          {props.votedUsefulCount !== undefined && (
            <Box>
              <UsefulStatsButton
                votedUsefulCount={props.votedUsefulCount}
                hasUserVotedUseful={props.hasUserVotedUseful}
                isLoggedIn={loggedInUser ? true : false}
                onUsefulClick={props.onUsefulClick}
              />
            </Box>
          )}
          {viewCount ? (
            <AuthWrapper roleRequired="beta-tester">
              <Box>
                <ViewsCounter viewsCount={viewCount!} />
              </Box>
            </AuthWrapper>
          ) : null}
          {/* Check if pin should be moderated */}
          {props.needsModeration && (
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Button
                data-cy={'accept'}
                variant={'primary'}
                icon="check"
                mr={1}
                onClick={() => props.moderateHowto(true)}
              />
              <Button
                data-cy="reject-howto"
                variant={'outline'}
                icon="delete"
                onClick={() => props.moderateHowto(false)}
              />
            </Flex>
          )}
          {/* Check if logged in user is the creator of the how-to OR a super-admin */}
          {loggedInUser && isAllowToEditContent(howto, loggedInUser) && (
            <Link to={'/how-to/' + howto.slug + '/edit'}>
              <Button variant={'primary'} data-cy={'edit'}>
                Edit
              </Button>
            </Link>
          )}
        </Flex>
        <Box mt={4} mb={2}>
          <Username
            user={{
              userName: howto._createdBy,
              countryCode: howto.creatorCountry,
            }}
            isVerified={isUserVerified(howto._createdBy)}
          />
          <Text
            variant="auxiliary"
            sx={{
              color: 'lightgrey',
              '&!important': {
                color: 'lightgrey',
              },
            }}
            mt={1}
            mb={2}
          >
            {dateLastEditText(howto)}
          </Text>
          <Heading mt={2} mb={1}>
            {/* HACK 2021-07-16 - new howtos auto capitalize title but not older */}
            {capitalizeFirstLetter(howto.title)}
          </Heading>
          <Text variant="paragraph" sx={{ whiteSpace: 'pre-line' }}>
            <LinkifyText>{howto.description}</LinkifyText>
          </Text>
        </Box>

        <Flex mt="4">
          <Flex mr="4" sx={{ flexDirection: ['column', 'row', 'row'] }}>
            <Image
              loading="lazy"
              src={StepsIcon}
              height="16"
              width="23"
              mr="2"
              mb="2"
            />
            {howto.steps.length === 1
              ? `${howto.steps.length} step`
              : `${howto.steps.length} steps`}
          </Flex>
          <Flex mr="4" sx={{ flexDirection: ['column', 'row', 'row'] }}>
            <Image
              loading="lazy"
              src={TimeNeeded}
              height="16"
              width="16"
              mr="2"
              mb="2"
            />
            {howto.time}
          </Flex>
          <Flex mr="4" sx={{ flexDirection: ['column', 'row', 'row'] }}>
            <Image
              loading="lazy"
              src={DifficultyLevel}
              height="15"
              width="16"
              mr="2"
              mb="2"
            />
            {howto.difficulty_level}
          </Flex>
        </Flex>
        <Flex mt={4}>
          {howto.taglist &&
            howto.taglist.map((tag, idx) => (
              <CategoryTag key={idx} tag={tag} sx={{ mr: 1 }} />
            ))}
        </Flex>
        {((howto.files && howto.files.length > 0) || howto.fileLink) && (
          <Flex
            className="file-container"
            mt={3}
            sx={{ flexDirection: 'column' }}
          >
            {howto.fileLink && (
              <DownloadFiles handleClick={handleClick} link={howto.fileLink} />
            )}
            {howto.files
              .filter(Boolean)
              .map(
                (file, index) =>
                  file && (
                    <FileInformation
                      allowDownload
                      file={file}
                      key={file ? file.name : `file-${index}`}
                      handleClick={handleClick}
                    />
                  ),
              )}
            {typeof fileDownloadCount === 'number' && (
              <Text
                data-cy="file-download-counter"
                sx={{
                  fontSize: 1,
                  color: 'grey',
                  paddingLeft: 1,
                }}
              >
                {fileDownloadCount}
                {fileDownloadCount !== 1 ? ' downloads' : ' download'}
              </Text>
            )}
          </Flex>
        )}
      </Flex>
      <Box
        sx={{
          width: ['100%', '100%', `${(1 / 2) * 100}%`],
          position: 'relative',
        }}
      >
        <AspectImage
          loading="lazy"
          ratio={12 / 9}
          sx={{
            objectFit: 'cover',
            width: '100%',
          }}
          src={howto.cover_image.downloadUrl}
          crossOrigin=""
          alt="how-to cover"
        />
        {howto.moderation !== 'accepted' && (
          <ModerationStatus
            status={howto.moderation}
            contentType="howto"
            sx={{ top: 0, position: 'absolute', right: 0 }}
          />
        )}
      </Box>
    </Flex>
  )
}

export default HowtoDescription
