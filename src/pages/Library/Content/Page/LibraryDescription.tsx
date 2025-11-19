import { useMemo, useState } from 'react'
import { Link, useNavigate } from '@remix-run/react'
import {
  Button,
  Category,
  ConfirmModal,
  ContentStatistics,
  LinkifyText,
  ModerationStatus,
  TagList,
  UsefulStatsButton,
} from 'oa-components'
import { DifficultyLevelRecord } from 'oa-shared'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import DifficultyLevel from 'src/assets/icons/icon-difficulty-level.svg'
import TimeNeeded from 'src/assets/icons/icon-time-needed.svg'
import { trackEvent } from 'src/common/Analytics'
import { DownloadWrapper } from 'src/common/DownloadWrapper'
import { logger } from 'src/logger'
import { UserNameTag } from 'src/pages/common/UserNameTag/UserNameTag'
import { createUsefulStatistic } from 'src/pages/Question/QuestionPage'
import {
  buildStatisticsLabel,
  capitalizeFirstLetter,
  hasAdminRights,
} from 'src/utils/helpers'
import { Alert, Box, Card, Divider, Flex, Heading, Image, Text } from 'theme-ui'

import { libraryService } from '../../library.service'

import type { Profile, Project } from 'oa-shared'

const DELETION_LABEL = 'Project marked for deletion'

interface IProps {
  commentsCount: number
  item: Project
  loggedInUser: Profile | undefined
  votedUsefulCount?: number
  hasUserVotedUseful: boolean
  onUsefulClick: () => Promise<void>
  subscribersCount: number
}

export const LibraryDescription = (props: IProps) => {
  const {
    commentsCount,
    hasUserVotedUseful,
    item,
    loggedInUser,
    onUsefulClick,
    subscribersCount,
    votedUsefulCount,
  } = props

  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const navigate = useNavigate()

  const handleDelete = async () => {
    try {
      await libraryService.deleteProject(item.id)
      trackEvent({
        category: 'Library',
        action: 'Deleted',
        label: item.title,
      })
      logger.debug(
        {
          category: 'Library',
          action: 'Deleted',
          label: item.title,
        },
        DELETION_LABEL,
      )

      navigate('/library')
    } catch (err) {
      logger.error(err)
      // at least log the error
    }
  }

  const isEditable = useMemo(() => {
    return (
      !!loggedInUser &&
      (hasAdminRights(loggedInUser) ||
        item.author?.username === loggedInUser.username)
    )
  }, [loggedInUser, item.author])

  const showFeedback =
    item.moderationFeedback && item.moderation !== 'accepted' && isEditable

  return (
    <Card variant="responsive">
      <Flex
        data-cy="library-basis"
        data-id={item.id}
        sx={{
          overflow: 'hidden',
          flexDirection: ['column-reverse', 'column-reverse', 'row'],
        }}
      >
        <Flex
          sx={{
            padding: 3,
            gap: 3,
            flexDirection: 'column',
            width: ['100%', '100%', `${(1 / 2) * 100}%`],
          }}
        >
          {item.deleted && (
            <Text color="red" pl={2} mb={2} data-cy="how-to-deleted">
              * Marked for deletion
            </Text>
          )}
          <Flex sx={{ flexWrap: 'wrap', gap: 3 }}>
            <ClientOnly fallback={<></>}>
              {() => (
                <>
                  {item.moderation === 'accepted' && (
                    <UsefulStatsButton
                      votedUsefulCount={votedUsefulCount}
                      hasUserVotedUseful={hasUserVotedUseful}
                      isLoggedIn={loggedInUser ? true : false}
                      onUsefulClick={onUsefulClick}
                    />
                  )}
                </>
              )}
            </ClientOnly>
            {/* Check if logged in user is the creator of the project OR a super-admin */}
            {isEditable && (
              <Link to={'/library/' + item.slug + '/edit'} data-cy="edit">
                <Button type="button" variant="primary">
                  Edit
                </Button>
              </Link>
            )}

            {isEditable && (
              <>
                <Button
                  type="button"
                  data-cy="Library: delete button"
                  variant={'secondary'}
                  icon="delete"
                  disabled={item.deleted}
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete
                </Button>

                <ConfirmModal
                  isOpen={showDeleteModal}
                  message="Are you sure you want to delete this project?"
                  confirmButtonText="Delete"
                  handleCancel={() => setShowDeleteModal(false)}
                  handleConfirm={() => handleDelete()}
                />
              </>
            )}

            {item.isDraft && (
              <Flex
                sx={{
                  marginBottom: 'auto',
                  minWidth: '100px',
                  borderRadius: 1,
                  height: '44px',
                  background: 'lightgrey',
                }}
              >
                <Text
                  sx={{
                    display: 'inline-block',
                    verticalAlign: 'middle',
                    color: 'black',
                    fontSize: [2, 2, 3],
                    padding: 2,
                    margin: 'auto',
                  }}
                  data-cy="status-draft"
                >
                  Draft
                </Text>
              </Flex>
            )}
          </Flex>
          {showFeedback && (
            <Alert variant="info">
              <Box sx={{ textAlign: 'left' }} data-cy="moderationFeedback">
                <Heading as="p" variant="small">
                  Moderator Feedback
                </Heading>
                <Text sx={{ fontSize: 2 }}>{item.moderationFeedback}</Text>
              </Box>
            </Alert>
          )}
          <Box>
            <Flex sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <Flex sx={{ flexDirection: 'column', gap: 2 }}>
                {item.author && (
                  <UserNameTag
                    author={item.author}
                    createdAt={item.createdAt}
                    modifiedAt={item.modifiedAt}
                    action="Published"
                  />
                )}
                {item.category && (
                  <Category category={item.category} sx={{ fontSize: 2 }} />
                )}
                <Heading as="h1" data-cy="project-title">
                  {capitalizeFirstLetter(item.title)}
                </Heading>
                <Text
                  variant="paragraph"
                  sx={{ whiteSpace: 'pre-line' }}
                  data-cy="project-description"
                >
                  <LinkifyText>{item.description}</LinkifyText>
                </Text>
              </Flex>
            </Flex>
          </Box>

          <Flex sx={{ gap: 3, fontSize: 2 }}>
            <Flex sx={{ flexDirection: ['column', 'row', 'row'] }}>
              <Image
                loading="lazy"
                src={TimeNeeded}
                height="16"
                width="16"
                mr="2"
                mb="2"
              />
              {item.time}
            </Flex>
            {item.difficultyLevel && (
              <Flex
                sx={{ flexDirection: ['column', 'row', 'row'] }}
                data-cy="difficulty-level"
              >
                <Image
                  loading="lazy"
                  src={DifficultyLevel}
                  height="15"
                  width="16"
                  mr="2"
                  mb="2"
                />
                {DifficultyLevelRecord[item.difficultyLevel]}
              </Flex>
            )}
          </Flex>

          <Flex sx={{ marginTop: 'auto', flexDirection: 'column', gap: 1 }}>
            <TagList tags={item.tags.map((t) => ({ label: t.name }))} />
            <DownloadWrapper
              fileDownloadCount={item.fileDownloadCount}
              fileLink={
                item.hasFileLink
                  ? `/api/documents/project/${item.id}/link`
                  : undefined
              }
              files={item.files?.map((x) => ({
                id: x.id,
                name: x.name,
                size: x.size,
                url: `/api/documents/project/${item.id}/${x.id}`,
              }))}
            />
          </Flex>
        </Flex>
        <Box
          sx={{
            width: ['100%', '100%', `${(1 / 2) * 100}%`],
            position: 'relative',
          }}
        >
          <Box sx={{ overflow: 'hidden' }}>
            <Box
              sx={{
                width: '100%',
                height: '0',
                paddingBottom: '75%',
              }}
            ></Box>
            <Box
              sx={{
                position: 'absolute',
                top: '0',
                bottom: '0',
                left: '0',
                right: '0',
              }}
            >
              {item.coverImage && (
                // 3407 - AspectImage creates divs that can mess up page layout,
                // so using Image here instead and recreating the div layout
                // that was created by AspectImage
                <Image
                  loading="lazy"
                  src={item.coverImage.publicUrl}
                  sx={{
                    objectFit: 'cover',
                    height: '100%',
                    width: '100%',
                  }}
                  crossOrigin=""
                  alt="project cover image"
                />
              )}
            </Box>
          </Box>

          {!item.isDraft && item.moderation !== 'accepted' && (
            <ModerationStatus
              status={item.moderation}
              sx={{ top: 3, position: 'absolute', right: 3, fontSize: 2 }}
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
            icon: 'show',
            label: buildStatisticsLabel({
              stat: item.totalViews,
              statUnit: 'view',
              usePlural: true,
            }),
          },
          createUsefulStatistic('projects', item.id, item.usefulCount),
          {
            icon: 'thunderbolt-grey',
            label: buildStatisticsLabel({
              stat: subscribersCount,
              statUnit: 'following',
              usePlural: false,
            }),
          },
          {
            icon: 'comment-outline',
            label: buildStatisticsLabel({
              stat: commentsCount || 0,
              statUnit: 'comment',
              usePlural: true,
            }),
          },
          {
            icon: 'update',
            label: buildStatisticsLabel({
              stat: item.steps.length,
              statUnit: 'step',
              usePlural: true,
            }),
          },
        ]}
      />
    </Card>
  )
}
