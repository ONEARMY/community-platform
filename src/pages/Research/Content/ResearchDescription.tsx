import { useState } from 'react'
import { Link, useNavigate } from '@remix-run/react'
import {
  Button,
  Category,
  ConfirmModal,
  ContentStatistics,
  FollowButton,
  LinkifyText,
  ModerationStatus,
  UsefulStatsButton,
  Username,
} from 'oa-components'
import { IModerationStatus } from 'oa-shared'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { trackEvent } from 'src/common/Analytics'
import { TagList } from 'src/common/Tags/TagsList'
import { logger } from 'src/logger'
import { useResearchStore } from 'src/stores/Research/research.store'
import { buildStatisticsLabel } from 'src/utils/helpers'
import { Box, Card, Divider, Flex, Heading, Text } from 'theme-ui'

import { ContentAuthorTimestamp } from '../../common/ContentAuthorTimestamp/ContentAuthorTimestamp'
import { researchStatusColour } from '../researchHelpers'

import type { IResearch, IResearchDB, ITag, IUser } from 'oa-shared'

interface IProps {
  research: IResearch.ItemDB & { tagList?: ITag[] }
  isEditable: boolean
  isDeletable: boolean
  loggedInUser: IUser | undefined
  votedUsefulCount?: number
  hasUserVotedUseful: boolean
  hasUserSubscribed: boolean
  subscribersCount: number
  commentsCount: number
  updatesCount: number
  onUsefulClick: () => Promise<void>
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

  const store = useResearchStore()

  const handleDelete = async (research: IResearchDB) => {
    try {
      await store.deleteResearch(research._id)
      trackEvent({
        category: 'Research',
        action: 'Deleted',
        label: research.title,
      })
      logger.debug(
        {
          category: 'Research',
          action: 'Deleted',
          label: research.title,
        },
        'Research marked for deletion',
      )

      navigate('/research')
    } catch (err) {
      logger.error(err)
      // at least log the error
    }
  }

  return (
    <Card variant="responsive">
      <Flex
        data-cy="research-basis"
        data-id={research._id}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          flexDirection: ['column-reverse', 'column-reverse', 'row'],
        }}
      >
        <Flex sx={{ flexDirection: 'column', width: '100%', padding: [2, 4] }}>
          {research._deleted && (
            <Text color="red" pl={2} mb={2} data-cy="research-deleted">
              * Marked for deletion
            </Text>
          )}
          <Flex sx={{ justifyContent: 'space-between' }}>
            <Flex sx={{ flexWrap: 'wrap', gap: 3 }}>
              <ClientOnly fallback={<></>}>
                {() => (
                  <>
                    {research.moderation === IModerationStatus.ACCEPTED && (
                      <UsefulStatsButton
                        votedUsefulCount={votedUsefulCount}
                        hasUserVotedUseful={props.hasUserVotedUseful}
                        isLoggedIn={!!props.loggedInUser}
                        onUsefulClick={props.onUsefulClick}
                      />
                    )}
                    <FollowButton
                      hasUserSubscribed={props.hasUserSubscribed}
                      isLoggedIn={!!props.loggedInUser}
                      onFollowClick={props.onFollowClick}
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
                    handleConfirm={() => handleDelete && handleDelete(research)}
                  />
                </>
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
          <Box sx={{ marginX: 2 }}>
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
                    <Username key={key} user={contributor} />
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
            <Heading
              as="h1"
              mt={research.researchCategory ? 1 : 2}
              mb={1}
              data-testid="research-title"
            >
              {research.title}
            </Heading>
            <Text variant="paragraph" sx={{ whiteSpace: 'pre-line' }}>
              <LinkifyText>{research.description}</LinkifyText>
            </Text>
            <Flex mt={4}>
              <TagList tags={research.tags} />
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
              stat: research.total_views,
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
