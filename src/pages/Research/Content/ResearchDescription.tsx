import { useMemo, useState } from 'react'
import { Link, useNavigate } from '@remix-run/react'
import { max } from 'date-fns'
import {
  Button,
  Category,
  ConfirmModal,
  ContentStatistics,
  FollowButton,
  LinkifyText,
  TagList,
  UsefulStatsButton,
  Username,
} from 'oa-components'
import {
  type Profile,
  type ResearchItem,
  ResearchStatusRecord,
} from 'oa-shared'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { trackEvent } from 'src/common/Analytics'
import { logger } from 'src/logger'
import { DraftTag } from 'src/pages/common/Drafts/DraftTag'
import { UserNameTag } from 'src/pages/common/UserNameTag/UserNameTag'
import { buildStatisticsLabel } from 'src/utils/helpers'
import { Box, Card, Divider, Flex, Heading, Text } from 'theme-ui'

import { researchService } from '../research.service'
import { researchStatusColour } from '../researchHelpers'

interface IProps {
  research: ResearchItem
  isEditable: boolean
  isDeletable: boolean
  activeUser: Profile | undefined
  votedUsefulCount?: number
  hasUserVotedUseful: boolean
  hasUserSubscribed: boolean
  subscribersCount: number
  commentsCount: number
  updatesCount: number
  onUsefulClick: () => Promise<void>
  onFollowClick: () => void
}

const ResearchDescription = (props: IProps) => {
  const {
    research,
    isEditable,
    isDeletable,
    subscribersCount,
    votedUsefulCount,
    commentsCount,
    updatesCount,
  } = props
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const navigate = useNavigate()

  const handleDelete = async (research: ResearchItem) => {
    try {
      await researchService.deleteResearch(research.id)
      trackEvent({
        category: 'Research',
        action: 'Deleted',
        label: research.title,
      })

      navigate('/research')
    } catch (err) {
      logger.error(err)
      // at least log the error
    }
  }

  const lastUpdated = useMemo(() => {
    const dates = [
      research?.modifiedAt,
      ...(research?.updates?.map((update) => update?.modifiedAt) || []),
    ]
      .filter((date): date is Date => date !== null)
      .map((date) => new Date(date))

    return dates.length > 0 ? max(dates) : new Date()
  }, [research])

  return (
    <Card variant="responsive">
      <Flex
        data-cy="research-basis"
        data-id={research.id}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          flexDirection: ['column-reverse', 'column-reverse', 'row'],
        }}
      >
        <Flex sx={{ flexDirection: 'column', width: '100%', padding: [2, 4] }}>
          {research.deleted && (
            <Text color="red" pl={2} mb={2} data-cy="research-deleted">
              * Marked for deletion
            </Text>
          )}
          <Flex sx={{ justifyContent: 'space-between' }}>
            <Flex sx={{ flexWrap: 'wrap', gap: 3 }}>
              <ClientOnly fallback={<></>}>
                {() => (
                  <>
                    <UsefulStatsButton
                      votedUsefulCount={votedUsefulCount}
                      hasUserVotedUseful={props.hasUserVotedUseful}
                      isLoggedIn={!!props.activeUser}
                      onUsefulClick={props.onUsefulClick}
                    />
                    <FollowButton
                      hasUserSubscribed={props.hasUserSubscribed}
                      isLoggedIn={!!props.activeUser}
                      onFollowClick={props.onFollowClick}
                      tooltipFollow="Follow to be notified about new updates"
                      tooltipUnfollow="Unfollow to stop be notified about new updates"
                    />
                  </>
                )}
              </ClientOnly>
              {/* Show edit button for the creator of the research OR a super-admin */}
              {isEditable && (
                <Link to={'/research/' + research.slug + '/edit'}>
                  <Button type="button" variant="primary" data-cy="edit">
                    Edit
                  </Button>
                </Link>
              )}

              {isDeletable && (
                <>
                  <Button
                    type="button"
                    data-cy="Research: delete button"
                    variant="secondary"
                    icon="delete"
                    disabled={research.deleted}
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete
                  </Button>

                  <ConfirmModal
                    key={research.id}
                    isOpen={showDeleteModal}
                    message="Are you sure you want to delete this Research?"
                    confirmButtonText="Delete"
                    handleCancel={() => setShowDeleteModal(false)}
                    handleConfirm={() => handleDelete && handleDelete(research)}
                  />
                </>
              )}
            </Flex>
            <Flex sx={{ justifyContent: 'flex-end', gap: 3 }}>
              {research.isDraft && <DraftTag />}
              <Flex
                sx={{
                  marginBottom: 'auto',
                  minWidth: '100px',
                  borderRadius: 1,
                  height: '44px',
                  background: researchStatusColour(research.status),
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
                >
                  {research.status
                    ? ResearchStatusRecord[research.status]
                    : 'In progress'}
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Box sx={{ marginX: 2 }}>
            <Flex sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
              {research.author && (
                <UserNameTag
                  author={research.author}
                  createdAt={research.createdAt}
                  modifiedAt={lastUpdated.toISOString()}
                  action="Started"
                />
              )}

              {research.collaborators && research.collaborators.length ? (
                <Flex
                  sx={{
                    alignItems: 'flex-start',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: 1,
                  }}
                >
                  <Flex sx={{ alignItems: 'center' }}>
                    <Text
                      variant="auxiliary"
                      sx={{
                        mt: 1,
                        mr: 1,
                        color: 'lightgrey',
                      }}
                    >
                      With contributions from
                    </Text>
                  </Flex>
                  {research.collaborators.map((contributor, key) => (
                    <Username key={key} user={contributor} />
                  ))}
                </Flex>
              ) : null}
            </Flex>

            {research.category && (
              <Category
                category={research.category}
                sx={{ fontSize: 2, mt: 2 }}
              />
            )}
            <Heading
              as="h1"
              sx={{
                mt: research.category ? 1 : 2,
                mb: 1,
              }}
              data-testid="research-title"
            >
              {research.title}
            </Heading>
            <Text variant="paragraph" sx={{ whiteSpace: 'pre-line' }}>
              <LinkifyText>{research.description}</LinkifyText>
            </Text>
            <Flex sx={{ mt: 4 }}>
              <TagList tags={research.tags.map((t) => ({ label: t.name }))} />
            </Flex>
          </Box>
        </Flex>
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
              stat: research.totalViews || 0,
              statUnit: 'view',
              usePlural: true,
            }),
          },
          {
            icon: 'thunderbolt-grey',
            label: buildStatisticsLabel({
              stat: subscribersCount || 0,
              statUnit: 'following',
              usePlural: false,
            }),
          },
          {
            icon: 'star',
            label: buildStatisticsLabel({
              stat: votedUsefulCount || 0,
              statUnit: 'useful',
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
              stat: updatesCount || 0,
              statUnit: 'update',
              usePlural: true,
            }),
          },
        ]}
      />
    </Card>
  )
}

export default ResearchDescription
