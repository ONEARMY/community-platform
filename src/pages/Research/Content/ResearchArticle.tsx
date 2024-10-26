import { useEffect, useState } from 'react'
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

import {
  getPublicUpdates,
  researchUpdateStatusFilter,
} from '../researchHelpers'
import ResearchDescription from './ResearchDescription'
import ResearchUpdate from './ResearchUpdate'

import type { IResearchDB, IUser } from 'oa-shared'

const areCommentsVisible = (updateId) => {
  return updateId === getResearchUpdateId(window.location.hash)
}

type ResearchArticleProps = {
  research: IResearchDB
}

const ResearchArticle = observer(({ research }: ResearchArticleProps) => {
  const location = useLocation()
  const researchStore = useResearchStore()
  const { aggregationsStore } = useCommonStores().stores
  const loggedInUser = researchStore.activeUser
  const [subscribed, setSubscribed] = useState<boolean>(
    research.subscribers?.includes(loggedInUser?.userName || '') || false,
  )
  const [subscribersCount, setSubscribersCount] = useState<number>(
    research.subscribers?.length || 0,
  )
  const [voted, setVoted] = useState<boolean>(false)
  const [usefulCount, setUsefulCount] = useState<number>(
    research.votedUsefulBy?.length || 0,
  )

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

  const onFollowClick = (researchSlug: string) => {
    if (!loggedInUser?.userName || !research) {
      return null
    }

    let action: string

    if (subscribed) {
      researchStore.removeSubscriberFromResearchArticle(
        research._id,
        loggedInUser?.userName,
      )
      action = 'Unsubscribed'
    } else {
      researchStore.addSubscriberToResearchArticle(
        research._id,
        loggedInUser?.userName,
      )
      action = 'Subscribed'
    }

    setSubscribersCount((prev) => prev + (subscribed ? -1 : 1))
    // toggle subscribed
    setSubscribed((prev) => !prev)

    trackEvent({
      category: 'Research',
      action: action,
      label: researchSlug,
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
        onFollowClick={() => onFollowClick(research.slug)}
        contributors={contributors}
        subscribersCount={subscribersCount}
        commentsCount={research.totalCommentCount}
        updatesCount={
          research.updates?.filter((u) =>
            researchUpdateStatusFilter(research, u, researchStore.activeUser),
          ).length || 0
        }
      />
      <Flex
        sx={{
          flexDirection: 'column',
          marginTop: 8,
          marginBottom: 4,
          gap: [4, 6],
        }}
      >
        {research &&
          getPublicUpdates(research, researchStore.activeUser).map(
            (update, index) => (
              <ResearchUpdate
                research={research}
                update={update}
                key={update._id}
                updateIndex={index}
                isEditable={isEditable}
                slug={research.slug}
                showComments={areCommentsVisible(update._id)}
              />
            ),
          )}
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
                    onFollowClick={() => onFollowClick(research.slug)}
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
})

export default ResearchArticle
