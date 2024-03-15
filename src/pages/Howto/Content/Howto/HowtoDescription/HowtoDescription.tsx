import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Button,
  Category,
  ConfirmModal,
  ContentStatistics,
  DownloadFileFromLink,
  DownloadStaticFile,
  LinkifyText,
  ModerationStatus,
  Tag,
  UsefulStatsButton,
} from 'oa-components'
import { IModerationStatus } from 'oa-shared'
import DifficultyLevel from 'src/assets/icons/icon-difficulty-level.svg'
import TimeNeeded from 'src/assets/icons/icon-time-needed.svg'
import { trackEvent } from 'src/common/Analytics'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { logger } from 'src/logger'
import { cdnImageUrl } from 'src/utils/cdnImageUrl'
import {
  buildStatisticsLabel,
  capitalizeFirstLetter,
  isAllowedToDeleteContent,
  isAllowedToEditContent,
} from 'src/utils/helpers'
import {
  addIDToSessionStorageArray,
  retrieveSessionStorageArray,
} from 'src/utils/sessionStorage'
import {
  Alert,
  AspectImage,
  Box,
  Card,
  Divider,
  Flex,
  Heading,
  Image,
  Text,
} from 'theme-ui'

import { ContentAuthorTimestamp } from '../../../../common/ContentAuthorTimestamp/ContentAuthorTimestamp'
import {
  addHowtoDownloadCooldown,
  isHowtoDownloadCooldownExpired,
  retrieveHowtoDownloadCooldown,
  updateHowtoDownloadCooldown,
} from './downloadCooldown'

import type { ITag } from 'src/models'
import type { IHowtoDB } from 'src/models/howto.models'
import type { IUser } from 'src/models/user.models'

interface IProps {
  howto: IHowtoDB & { tagList?: ITag[] }
  loggedInUser: IUser | undefined
  needsModeration: boolean
  commentsCount: number
  votedUsefulCount?: number
  verified?: boolean
  hasUserVotedUseful: boolean
  onUsefulClick: () => void
}

const HowtoDescription = ({ howto, loggedInUser, ...props }: IProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const navigate = useNavigate()

  const [fileDownloadCount, setFileDownloadCount] = useState(
    howto.total_downloads,
  )
  let didInit = false
  const [viewCount, setViewCount] = useState<number>(0)
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
      if (updatedViewCount) {
        setViewCount(updatedViewCount)
      }
      addIDToSessionStorageArray('howto', howto._id)
    } else {
      setViewCount(howto.total_views || 0)
    }
  }

  const redirectToSignIn = async () => {
    navigate('/sign-in')
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

      navigate('/how-to')
    } catch (err) {
      logger.error(err)
      // at least log the error
    }
  }

  useEffect(() => {
    if (!didInit) {
      didInit = true
      incrementViewCount()
    }
  }, [howto._id])

  return (
    <Card>
      <Flex
        data-cy="how-to-basis"
        data-id={howto._id}
        className="howto-description-container"
        sx={{
          overflow: 'hidden',
          flexDirection: ['column-reverse', 'column-reverse', 'row'],
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
              howto.moderation === IModerationStatus.ACCEPTED && (
                <Box>
                  <UsefulStatsButton
                    votedUsefulCount={props.votedUsefulCount}
                    hasUserVotedUseful={props.hasUserVotedUseful}
                    isLoggedIn={loggedInUser ? true : false}
                    onUsefulClick={props.onUsefulClick}
                  />
                </Box>
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
          {howto.moderatorFeedback &&
          howto.moderation !== IModerationStatus.ACCEPTED ? (
            <Alert
              variant="info"
              sx={{
                my: 2,
              }}
            >
              <Box
                sx={{
                  textAlign: 'left',
                }}
              >
                <Heading variant="small" mb={2}>
                  Moderator Feedback
                </Heading>
                <Text sx={{ fontSize: 2 }}>{howto.moderatorFeedback}</Text>
              </Box>
            </Alert>
          ) : null}
          <Box mt={3} mb={2}>
            <Flex sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <Flex sx={{ flexDirection: 'column' }}>
                <ContentAuthorTimestamp
                  userName={howto._createdBy}
                  countryCode={howto.creatorCountry}
                  created={howto._created}
                  modified={howto._contentModifiedTimestamp || howto._modified}
                  action="Published"
                />
                {howto.category && (
                  <Category
                    category={howto.category}
                    sx={{ fontSize: 2, mt: 2 }}
                  />
                )}
                <Heading mt={howto.category ? 1 : 2} mb={1}>
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
            {howto.tagList &&
              howto.tagList.map((tag, idx) => (
                <Tag key={idx} tag={tag} sx={{ mr: 1 }} />
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
                  redirectToSignIn={
                    !loggedInUser ? redirectToSignIn : undefined
                  }
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
                height: '100%',
              }}
              src={cdnImageUrl(howto.cover_image.downloadUrl, {
                width: 780,
              })}
              crossOrigin=""
              alt="how-to cover"
            />
          )}
          {howto.moderation !== IModerationStatus.ACCEPTED && (
            <ModerationStatus
              status={howto.moderation}
              contentType="howto"
              sx={{ top: 0, position: 'absolute', right: 0 }}
            />
          )}
        </Box>
      </Flex>
      <Divider
        sx={{
          m: 0,
          border: '1px solid black',
        }}
      />
      <ContentStatistics
        statistics={[
          {
            icon: 'view',
            label: buildStatisticsLabel({
              stat: viewCount,
              statUnit: 'view',
              usePlural: true,
            }),
          },
          {
            icon: 'star',
            label: buildStatisticsLabel({
              stat: props.votedUsefulCount || 0,
              statUnit: 'useful',
              usePlural: false,
            }),
          },
          {
            icon: 'comment',
            label: buildStatisticsLabel({
              stat: props.commentsCount || 0,
              statUnit: 'comment',
              usePlural: true,
            }),
          },
          {
            icon: 'update',
            label: buildStatisticsLabel({
              stat: howto.steps.length,
              statUnit: 'step',
              usePlural: true,
            }),
          },
        ]}
      />
    </Card>
  )
}

export default HowtoDescription
