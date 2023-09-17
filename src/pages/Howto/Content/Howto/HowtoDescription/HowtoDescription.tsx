import { format } from 'date-fns'
import { useState, useEffect, Fragment } from 'react'
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
  DownloadStaticFile,
  Username,
  ViewsCounter,
  DownloadFileFromLink,
  Tooltip,
  ConfirmModal,
} from 'oa-components'
import type { IUser } from 'src/models/user.models'
import {
  isAllowedToEditContent,
  isAllowedToDeleteContent,
  capitalizeFirstLetter,
} from 'src/utils/helpers'
import { Link, useHistory } from 'react-router-dom'
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
import { trackEvent } from 'src/common/Analytics'
import { logger } from 'src/logger'

interface IProps {
  howto: IHowtoDB & { taglist: any }
  loggedInUser: IUser | undefined
  needsModeration: boolean
  votedUsefulCount?: number
  verified?: boolean
  hasUserVotedUseful: boolean
  moderateHowto: (accepted: boolean, feedback?: string) => void
  onUsefulClick: () => void
}

const HowtoDescription = ({ howto, loggedInUser, ...props }: IProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const history = useHistory()

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

  const redirectToSignIn = async () => {
    history.push('/sign-in')
  }

  const handleDownloadClick = async () => {
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

  const handleDelete = async (_id: string) => {
    try {
      await stores.howtoStore.deleteHowTo(_id)
      trackEvent({
        category: 'How-To',
        action: 'Deleted',
        label: stores.howtoStore.activeHowto?.title,
      })
      logger.debug(
        {
          category: 'How-To',
          action: 'Deleted',
          label: stores.howtoStore.activeHowto?.title,
        },
        'How-to marked for deletion',
      )

      history.push('/how-to')
    } catch (err) {
      logger.error(err)
      // at least log the error
    }
  }

  const dateContentModifiedText = (howto: IHowtoDB): string => {
    const contentModifiedDate = format(
      new Date(howto._contentModifiedTimestamp || howto._modified),
      'DD-MM-YYYY',
    )
    const creationDate = format(new Date(howto._created), 'DD-MM-YYYY')
    if (contentModifiedDate !== creationDate) {
      return `Last edit on ${contentModifiedDate}`
    } else {
      return ''
    }
  }
  const dateCreatedText = ` | Published on ${format(
    new Date(howto._created),
    'DD-MM-YYYY',
  )}`

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
        {howto._deleted && (
          <Fragment>
            <Text color="red" pl={2} mb={2} data-cy="how-to-deleted">
              * Marked for deletion
            </Text>
          </Fragment>
        )}
        <Flex sx={{ flexWrap: 'wrap', gap: '10px' }}>
          {props.votedUsefulCount !== undefined &&
            howto.moderation === 'accepted' && (
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
          {/* Check if how to should be moderated */}
          {props.needsModeration && (
            <Flex sx={{ justifyContent: 'space-between' }}>
              <Button
                data-cy={'accept'}
                variant={'primary'}
                icon="check"
                mr={1}
                data-tip={'Accept'}
                onClick={() => props.moderateHowto(true)}
                showIconOnly={true}
              />
              <Button
                data-cy="reject-howto"
                variant={'outline'}
                icon="close"
                data-tip={'Request changes'}
                showIconOnly={true}
                onClick={() => {
                  // Prompt used for testing purposes, will be removed once retool functionality in place
                  const feedback =
                    // eslint-disable-next-line no-alert
                    prompt('Please provide detail of required changes') ||
                    undefined
                  props.moderateHowto(false, feedback)
                }}
              />
              <Tooltip />
            </Flex>
          )}
          {/* Check if logged in user is the creator of the how-to OR a super-admin */}
          {loggedInUser && isAllowedToEditContent(howto, loggedInUser) && (
            <Link to={'/how-to/' + howto.slug + '/edit'}>
              <Button variant={'primary'} data-cy={'edit'}>
                Edit
              </Button>
            </Link>
          )}

          {loggedInUser && isAllowedToDeleteContent(howto, loggedInUser) && (
            <Fragment key={'how-to-delete-action'}>
              <Button
                data-cy="How-To: delete button"
                variant={'secondary'}
                icon="delete"
                disabled={howto._deleted}
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </Button>

              <ConfirmModal
                key={howto._id}
                isOpen={showDeleteModal}
                message="Are you sure you want to delete this How-To?"
                confirmButtonText="Delete"
                handleCancel={() => setShowDeleteModal(false)}
                handleConfirm={() => handleDelete && handleDelete(howto._id)}
              />
            </Fragment>
          )}
        </Flex>
        {howto.moderationFeedback && howto.moderation === 'rejected' && (
          <Flex
            mt={4}
            sx={{
              display: 'block',
              fontSize: 1,
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              padding: 2,
              borderRadius: 1,
              borderBottomRightRadius: 1,
              flexDirection: 'column',
              border: '2px solid red',
              paddingTop: 3,
            }}
          >
            <Heading variant="small" mb={2}>
              Moderator Feedback
            </Heading>
            {howto.moderationFeedback.map((feedback) => {
              return (
                <Flex
                  mb={2}
                  pb={2}
                  sx={{
                    flexDirection: 'column',
                  }}
                  key={feedback.feedbackTimestamp}
                >
                  <Text mb={1} sx={{ fontWeight: 'bold' }}>
                    {format(feedback.feedbackTimestamp, 'DD-MM-YYYY HH:mm')}
                  </Text>
                  <Text key={feedback.feedbackTimestamp} sx={{ fontSize: 2 }}>
                    {feedback.feedbackComments}
                  </Text>
                </Flex>
              )
            })}
          </Flex>
        )}
        <Box mt={3} mb={2}>
          <Flex sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Flex sx={{ flexDirection: 'column' }}>
              <Flex sx={{ alignItems: 'center' }}>
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
                    marginTop: 2,
                    marginBottom: 2,
                  }}
                >
                  {dateCreatedText}
                </Text>
              </Flex>

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
                {dateContentModifiedText(howto)}
              </Text>

              <Heading mt={2} mb={1}>
                {/* HACK 2021-07-16 - new howtos auto capitalize title but not older */}
                {capitalizeFirstLetter(howto.title)}
              </Heading>
              <Text variant="paragraph" sx={{ whiteSpace: 'pre-line' }}>
                <LinkifyText>{howto.description}</LinkifyText>
              </Text>
            </Flex>
          </Flex>
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
              <DownloadFileFromLink
                handleClick={handleDownloadClick}
                link={howto.fileLink}
                redirectToSignIn={!loggedInUser ? redirectToSignIn : undefined}
              />
            )}
            {howto.files &&
              howto.files
                .filter(Boolean)
                .map(
                  (file, index) =>
                    file && (
                      <DownloadStaticFile
                        allowDownload
                        file={file}
                        key={file ? file.name : `file-${index}`}
                        handleClick={handleDownloadClick}
                        redirectToSignIn={
                          !loggedInUser ? redirectToSignIn : undefined
                        }
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
        {howto.cover_image && (
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
        )}
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
