import { useEffect } from 'react'
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

  const moderateResearch = async (accepted: boolean) => {
    const item = researchStore.activeResearchItem
    if (item) {
      item.moderation = accepted
        ? IModerationStatus.ACCEPTED
        : IModerationStatus.REJECTED
      await researchStore.moderateResearch(item)
    }
  }

  const onUsefulClick = async (
    researchId: string,
    researchSlug: string,
    eventCategory = 'Research',
  ) => {
    if (!loggedInUser?.userName) {
      return
    }

    // Trigger update without waiting
    await researchStore.toggleUsefulByUser(researchId, loggedInUser?.userName)
    const hasUserVotedUseful = researchStore.userVotedActiveResearchUseful
    trackEvent({
      category: eventCategory,
      action: hasUserVotedUseful ? 'ResearchUseful' : 'ResearchUsefulRemoved',
      label: researchSlug,
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

    if (research.subscribers?.includes(loggedInUser?.userName || '')) {
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
        votedUsefulCount={researchStore.votedUsefulCount}
        loggedInUser={loggedInUser as IUser}
        isEditable={isEditable}
        isDeletable={isDeletable}
        needsModeration={researchStore.needsModeration(research)}
        hasUserVotedUseful={researchStore.userVotedActiveResearchUseful}
        hasUserSubscribed={researchStore.userHasSubscribed}
        moderateResearch={moderateResearch}
        onUsefulClick={() =>
          onUsefulClick(research._id, research.slug, 'ResearchDescription')
        }
        onFollowClick={() => onFollowClick(research.slug)}
        contributors={contributors}
        subscribersCount={researchStore.subscribersCount}
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
                  votedUsefulCount={researchStore.votedUsefulCount}
                  hasUserVotedUseful={
                    researchStore.userVotedActiveResearchUseful
                  }
                  onUsefulClick={async () =>
                    await onUsefulClick(
                      research._id,
                      research.slug,
                      'ArticleCallToAction',
                    )
                  }
                />
              )}
              <FollowButton
                isLoggedIn={!!loggedInUser}
                hasUserSubscribed={researchStore.userHasSubscribed}
                onFollowClick={() => onFollowClick(research.slug)}
              />
            </ArticleCallToAction>
          )}
        </Box>
      </UserEngagementWrapper>

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
