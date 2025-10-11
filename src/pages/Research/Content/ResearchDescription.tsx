import { useMemo } from 'react'
import { max } from 'date-fns'
import {
  AuthorDisplay,
  Category,
  ContentStatistics,
  DisplayDate,
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
import { DraftTag } from 'src/pages/common/Drafts/DraftTag'
import { buildStatisticsLabel } from 'src/utils/helpers'
import { Card, Divider, Flex, Heading, Text } from 'theme-ui'

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
    subscribersCount,
    votedUsefulCount,
    commentsCount,
    updatesCount,
  } = props

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
        <Flex
          sx={{
            flexDirection: 'column',
            width: '100%',
            padding: [2, 4],
            gap: 3,
          }}
        >
          {research.deleted && (
            <Text color="red" pl={2} mb={2} data-cy="research-deleted">
              * Marked for deletion
            </Text>
          )}
          <Flex
            sx={{ justifyContent: 'space-between', gap: 3, flexWrap: 'wrap' }}
          >
            <Flex
              sx={{
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <AuthorDisplay author={research.author} />

              {research.collaborators && research.collaborators.length ? (
                <Flex sx={{ alignItems: 'center', gap: 1 }}>
                  <Text variant="auxiliary" sx={{ color: 'lightgrey' }}>
                    With contributions from
                  </Text>
                  {research.collaborators.map((contributor, key) => (
                    <Username key={key} user={contributor} />
                  ))}
                </Flex>
              ) : null}
            </Flex>
            <Flex
              sx={{
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 3,
              }}
            >
              {research.isDraft && <DraftTag />}

              {research.category && (
                <Category category={research.category} sx={{ fontSize: 2 }} />
              )}

              <Flex
                sx={{
                  borderRadius: 1,
                  background: researchStatusColour(research.status),
                }}
              >
                <Text
                  sx={{
                    fontSize: '14px',
                    paddingX: 2,
                    paddingY: 1,
                  }}
                >
                  {research.status
                    ? ResearchStatusRecord[research.status]
                    : 'In progress'}
                </Text>
              </Flex>
            </Flex>
          </Flex>

          <Text variant="auxiliary">
            <DisplayDate
              createdAt={research.createdAt}
              modifiedAt={lastUpdated.toISOString()}
              action="Started"
            />
          </Text>

          <Heading as="h1" data-testid="research-title">
            {research.title}
          </Heading>

          <Text variant="paragraph" sx={{ whiteSpace: 'pre-line' }}>
            <LinkifyText>{research.description}</LinkifyText>
          </Text>

          <TagList tags={research.tags.map((t) => ({ label: t.name }))} />

          <ClientOnly fallback={<></>}>
            {() => (
              <Flex sx={{ gap: 3 }}>
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
              </Flex>
            )}
          </ClientOnly>
        </Flex>
      </Flex>

      <Divider sx={{ border: '1px solid black', margin: 0 }} />

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
