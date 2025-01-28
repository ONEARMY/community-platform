import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from '@remix-run/react'
import { observer } from 'mobx-react'
import {
  ArticleCallToAction,
  Button,
  FollowButton,
  UsefulStatsButton,
  UserEngagementWrapper,
} from 'oa-components'
import { IModerationStatus } from 'oa-shared'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { trackEvent } from 'src/common/Analytics'
import { useContributorsData } from 'src/common/hooks/contributorsData'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { Breadcrumbs } from 'src/pages/common/Breadcrumbs/Breadcrumbs'
import {
  getResearchCommentId,
  getResearchUpdateId,
} from 'src/pages/Research/Content/helper'
import { useResearchStore } from 'src/stores/Research/research.store'
import {
  isAllowedToDeleteContent,
  isAllowedToEditContent,
} from 'src/utils/helpers'
import { Box, Flex } from 'theme-ui'

import { researchUpdateStatusFilter } from '../researchHelpers'
import ResearchDescription from './ResearchDescription'
import ResearchUpdate from './ResearchUpdate'

import type { IResearch, IResearchDB, IUser } from 'oa-shared'

interface IProps {
  research: IResearchDB
  publicUpdates: IResearch.UpdateDB[]
}

export const ResearchArticlePage = observer(
  ({ research, publicUpdates }: IProps) => {
    const location = useLocation()
    const researchStore = useResearchStore()
    const { aggregationsStore } = useCommonStores().stores
    const loggedInUser = researchStore.activeUser
    const [subscribed, setSubscribed] = useState<boolean>(false)
    const [voted, setVoted] = useState<boolean>(false)
    const [subscribersCount, setSubscribersCount] = useState<number>(
      research.subscribers?.length || 0,
    )
    const [usefulCount, setUsefulCount] = useState<number>(
      research.votedUsefulBy?.length || 0,
    )

    const updates = useMemo(() => {
      // Only public updates (non draft) are server-side rendered.
      // But we still need to display the draft updates when the currentUser is the author/contributor.
      // Since the current user is only loaded client-side, we need to check and re-set the updates.
      if (!researchStore.activeUser) {
        return publicUpdates
      }

      return research.updates?.filter((update) =>
        researchUpdateStatusFilter(research, update, researchStore.activeUser),
      )
    }, [researchStore.activeUser, publicUpdates, research.updates])

    useEffect(() => {
      // This could be improved if we can load the user profile server-side
      if (researchStore?.activeUser) {
        if (research.votedUsefulBy?.includes(researchStore.activeUser._id)) {
          setVoted(true)
        }

        if (research.subscribers?.includes(researchStore.activeUser._id)) {
          setSubscribed(true)
        }
      }
    }, [researchStore?.activeUser])

    const onUsefulClick = async (
      vote: 'add' | 'delete',
      eventCategory = 'Research',
    ) => {
      if (!loggedInUser?.userName) {
        return
      }

      // Trigger update without waiting
      await researchStore.toggleUsefulByUser(research, loggedInUser?.userName)
      setVoted((prev) => !prev)

      setUsefulCount((prev) => {
        return vote === 'add' ? prev + 1 : prev - 1
      })

      trackEvent({
        category: eventCategory,
        action: vote === 'add' ? 'ResearchUseful' : 'ResearchUsefulRemoved',
        label: research.slug,
      })
    }

    const scrollIntoRelevantSection = () => {
      if (getResearchCommentId(location.hash) === '') return
      const section = document.getElementById(
        `update_${getResearchUpdateId(location.hash)}`,
      )
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    useEffect(() => {
      scrollIntoRelevantSection()
    }, [location.hash])

    const onFollowClick = async () => {
      if (!loggedInUser?._id) {
        return
      }
      await researchStore.toggleSubscriber(research._id, loggedInUser._id)
      const action = subscribed ? 'Unsubscribed' : 'Subscribed'

      setSubscribersCount((prev) => prev + (subscribed ? -1 : 1))
      // toggle subscribed
      setSubscribed((prev) => !prev)

      trackEvent({
        category: 'Research',
        action: action,
        label: research.slug,
      })
    }

    const collaborators = Array.isArray(research?.collaborators)
      ? research?.collaborators
      : (
          (research?.collaborators as string | undefined)?.split(',') || []
        ).filter(Boolean)

    const contributors = useContributorsData(collaborators || [])

    const isEditable =
      !!researchStore.activeUser &&
      isAllowedToEditContent(research, researchStore.activeUser)
    const isDeletable =
      !!researchStore.activeUser &&
      isAllowedToDeleteContent(research, researchStore.activeUser)

    const researchAuthor = {
      userName: research._createdBy,
      countryCode: research.creatorCountry,
      isVerified: aggregationsStore.isVerified(research._createdBy),
    }

    return (
      <Box sx={{ width: '100%', maxWidth: '1000px', alignSelf: 'center' }}>
        <Breadcrumbs content={research} variant="research" />
        <ResearchDescription
          research={research}
          key={research._id}
          votedUsefulCount={usefulCount}
          loggedInUser={loggedInUser as IUser}
          isEditable={isEditable}
          isDeletable={isDeletable}
          hasUserVotedUseful={voted}
          hasUserSubscribed={subscribed}
          onUsefulClick={() =>
            onUsefulClick(voted ? 'delete' : 'add', 'ResearchDescription')
          }
          onFollowClick={onFollowClick}
          contributors={contributors}
          subscribersCount={subscribersCount}
          commentsCount={research.totalCommentCount}
          updatesCount={publicUpdates.length}
        />
        <Flex
          sx={{
            flexDirection: 'column',
            marginTop: [2, 4],
            marginBottom: 4,
            gap: [4, 6],
          }}
        >
          {updates.map((update, index) => (
            <ResearchUpdate
              research={research}
              update={update}
              key={update._id}
              updateIndex={index}
              isEditable={isEditable}
              slug={research.slug}
            />
          ))}
        </Flex>

        <ClientOnly fallback={<></>}>
          {() => (
            <UserEngagementWrapper>
              <Box
                sx={{
                  marginBottom: [6, 6, 12],
                }}
              >
                {researchAuthor && (
                  <ArticleCallToAction
                    author={researchAuthor}
                    contributors={contributors}
                  >
                    {research.moderation === IModerationStatus.ACCEPTED && (
                      <UsefulStatsButton
                        isLoggedIn={!!loggedInUser}
                        votedUsefulCount={usefulCount}
                        hasUserVotedUseful={voted}
                        onUsefulClick={() =>
                          onUsefulClick(
                            voted ? 'delete' : 'add',
                            'ArticleCallToAction',
                          )
                        }
                      />
                    )}
                    <FollowButton
                      isLoggedIn={!!loggedInUser}
                      hasUserSubscribed={subscribed}
                      onFollowClick={onFollowClick}
                    />
                  </ArticleCallToAction>
                )}
              </Box>
            </UserEngagementWrapper>
          )}
        </ClientOnly>

        {isEditable && (
          <Flex my={4}>
            <Link to={`/research/${research.slug}/new-update`}>
              <Button
                type="button"
                large
                ml={2}
                mb={[3, 3, 0]}
                data-cy="addResearchUpdateButton"
              >
                Add update
              </Button>
            </Link>
          </Flex>
        )}
      </Box>
    )
  },
)
