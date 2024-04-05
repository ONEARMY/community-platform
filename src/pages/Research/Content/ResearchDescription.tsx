import { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Button,
  Category,
  ConfirmModal,
  ContentStatistics,
  FollowButton,
  LinkifyText,
  ModerationStatus,
  Tag,
  UsefulStatsButton,
  Username,
} from 'oa-components'
import { IModerationStatus } from 'oa-shared'
import { trackEvent } from 'src/common/Analytics'
import { logger } from 'src/logger'
import { useResearchStore } from 'src/stores/Research/research.store'
import { buildStatisticsLabel, researchStatusColour } from 'src/utils/helpers'
import {
  addIDToSessionStorageArray,
  retrieveSessionStorageArray,
} from 'src/utils/sessionStorage'
import { Box, Card, Divider, Flex, Heading, Text } from 'theme-ui'

import { ContentAuthorTimestamp } from '../../common/ContentAuthorTimestamp/ContentAuthorTimestamp'

import type { ITag } from 'src/models'
import type { IResearch } from 'src/models/research.models'
import type { IUser } from 'src/models/user.models'

interface IProps {
  research: IResearch.ItemDB & { tagList?: ITag[] }
  isEditable: boolean
  isDeletable: boolean
  loggedInUser: IUser | undefined
  needsModeration: boolean
  votedUsefulCount?: number
  hasUserVotedUseful: boolean
  hasUserSubscribed: boolean
  subscribersCount: number
  commentsCount: number
  updatesCount: number
  moderateResearch: (accepted: boolean) => void
  onUsefulClick: () => void
  onFollowClick: () => void
  contributors?: { userName: string; isVerified: boolean }[]
}

const ResearchDescription = ({
  research,
  isEditable,
  isDeletable,
  subscribersCount,
  votedUsefulCount,
  commentsCount,
  updatesCount,
  ...props
}: IProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const navigate = useNavigate()

  let didInit = false
  const store = useResearchStore()
  const [viewCount, setViewCount] = useState<number | undefined>(0)

  const incrementViewCount = async () => {
    const sessionStorageArray = retrieveSessionStorageArray('research')

    if (!sessionStorageArray.includes(research._id)) {
      const updatedViewCount = await store.incrementViewCount(research._id)
      setViewCount(updatedViewCount)
      addIDToSessionStorageArray('research', research._id)
    } else {
      setViewCount(research.total_views)
    }
  }

  const handleDelete = async (_id: string) => {
    try {
      await store.deleteResearch(_id)
      trackEvent({
        category: 'Research',
        action: 'Deleted',
        label: store.activeResearchItem?.title,
      })
      logger.debug(
        {
          category: 'Research',
          action: 'Deleted',
          label: store.activeResearchItem?.title,
        },
        'Research marked for deletion',
      )

      navigate('/research')
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
  }, [research._id])

  return (
    <Card
      sx={{
        mt: 4,
      }}
    >
      <Flex
        data-cy="research-basis"
        data-id={research._id}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          flexDirection: ['column-reverse', 'column-reverse', 'row'],
        }}
      >
        <Flex px={4} py={4} sx={{ flexDirection: 'column', width: '100%' }}>
          {research._deleted && (
            <Fragment>
              <Text color="red" pl={2} mb={2} data-cy="research-deleted">
                * Marked for deletion
              </Text>
            </Fragment>
          )}
          <Flex sx={{ justifyContent: 'space-between' }}>
            <Flex sx={{ flexWrap: 'wrap', gap: '10px' }}>
              {research.moderation === IModerationStatus.ACCEPTED && (
                <UsefulStatsButton
                  votedUsefulCount={votedUsefulCount}
                  hasUserVotedUseful={props.hasUserVotedUseful}
                  isLoggedIn={props.loggedInUser ? true : false}
                  onUsefulClick={props.onUsefulClick}
                />
              )}
              <FollowButton
                hasUserSubscribed={props.hasUserSubscribed}
                isLoggedIn={props.loggedInUser ? true : false}
                onFollowClick={props.onFollowClick}
              ></FollowButton>
              {/* Check if research should be moderated */}
              {props.needsModeration &&
                research.moderation ===
                  IModerationStatus.AWAITING_MODERATION && (
                  <Flex sx={{ justifyContent: 'space-between' }}>
                    <Button
                      data-cy={'accept'}
                      variant={'primary'}
                      icon="check"
                      mr={1}
                      onClick={() => props.moderateResearch(true)}
                    />
                    <Button
                      data-cy="reject-research"
                      variant={'outline'}
                      icon="delete"
                      onClick={() => props.moderateResearch(false)}
                    />
                  </Flex>
                )}
              {/* Show edit button for the creator of the research OR a super-admin */}
              {isEditable && (
                <Link to={'/research/' + research.slug + '/edit'}>
                  <Button variant={'primary'} data-cy={'edit'}>
                    Edit
                  </Button>
                </Link>
              )}

              {isDeletable && (
                <Fragment>
                  <Button
                    data-cy="Research: delete button"
                    variant={'secondary'}
                    icon="delete"
                    disabled={research._deleted}
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete
                  </Button>

                  <ConfirmModal
                    key={research._id}
                    isOpen={showDeleteModal}
                    message="Are you sure you want to delete this Research?"
                    confirmButtonText="Delete"
                    handleCancel={() => setShowDeleteModal(false)}
                    handleConfirm={() =>
                      handleDelete && handleDelete(research._id)
                    }
                  />
                </Fragment>
              )}
            </Flex>
            <Flex
              sx={{
                marginBottom: 'auto',
                minWidth: '100px',
                borderRadius: 1,
                height: '44px',
                background: researchStatusColour(research.researchStatus),
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
                data-cy="research-status"
              >
                {research.researchStatus || 'In progress'}
              </Text>
            </Flex>
          </Flex>
          <Box mt={3} mb={2}>
            <Flex sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
              <ContentAuthorTimestamp
                userName={research._createdBy}
                countryCode={research.creatorCountry}
                created={research._created}
                modified={
                  research._contentModifiedTimestamp || research._modified
                }
                action="Started"
              />

              {props.contributors && props?.contributors.length ? (
                <Flex
                  mt={1}
                  sx={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                  }}
                >
                  <Flex sx={{ alignItems: 'center' }}>
                    <Text
                      variant="auxiliary"
                      mt={1}
                      mr={1}
                      sx={{
                        color: 'lightgrey',
                      }}
                    >
                      With contributions from
                    </Text>
                  </Flex>
                  {props.contributors.map((contributor, key) => (
                    <Username
                      key={key}
                      user={contributor}
                      isVerified={contributor.isVerified}
                    />
                  ))}
                </Flex>
              ) : null}
            </Flex>

            {research.researchCategory && (
              <Category
                category={research.researchCategory}
                sx={{ fontSize: 2, mt: 2 }}
              />
            )}
            <Heading mt={research.researchCategory ? 1 : 2} mb={1}>
              {research.title}
            </Heading>
            <Text variant="paragraph" sx={{ whiteSpace: 'pre-line' }}>
              <LinkifyText>{research.description}</LinkifyText>
            </Text>
            <Flex mt={4}>
              {research.tagList &&
                research.tagList.map((tag, idx) => (
                  <Tag key={idx} tag={tag} sx={{ mr: 1 }} />
                ))}
            </Flex>
          </Box>
        </Flex>
        {research.moderation !== IModerationStatus.ACCEPTED && (
          <ModerationStatus
            status={research.moderation}
            contentType="research"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}
          />
        )}
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
              stat: viewCount || 0,
              statUnit: 'view',
              usePlural: true,
            }),
          },
          {
            icon: 'thunderbolt',
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
            icon: 'comment',
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
              statUnit: 'step',
              usePlural: true,
            }),
          },
        ]}
      />
    </Card>
  )
}

export default ResearchDescription
