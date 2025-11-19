import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router';
import { observer } from 'mobx-react'
import {
  ArticleCallToActionSupabase,
  Button,
  FollowButton,
  UsefulStatsButton,
  UserEngagementWrapper,
} from 'oa-components'
// eslint-disable-next-line import/no-unresolved
import { ClientOnly } from 'remix-utils/client-only'
import { trackEvent } from 'src/common/Analytics'
import { Breadcrumbs } from 'src/pages/common/Breadcrumbs/Breadcrumbs'
import {
  getResearchCommentId,
  getResearchUpdateId,
} from 'src/pages/Research/Content/helper'
import { subscribersService } from 'src/services/subscribersService'
import { usefulService } from 'src/services/usefulService'
import { useProfileStore } from 'src/stores/Profile/profile.store'
import { hasAdminRights } from 'src/utils/helpers'
import { onUsefulClick } from 'src/utils/onUsefulClick'
import { Box, Flex } from 'theme-ui'

import ResearchDescription from './ResearchDescription'
import ResearchUpdate from './ResearchUpdate'

import type { ContentType, ResearchItem } from 'oa-shared'

interface IProps {
  research: ResearchItem
}

export const ResearchArticlePage = observer(({ research }: IProps) => {
  const location = useLocation()
  const { profile: activeUser } = useProfileStore()
  const [subscribed, setSubscribed] = useState<boolean>(false)
  const [voted, setVoted] = useState<boolean>(false)
  const [subscribersCount, setSubscribersCount] = useState<number>(
    research.subscriberCount,
  )
  const [usefulCount, setUsefulCount] = useState<number>(research.usefulCount)

  const configOnUsefulClick = {
    contentType: 'research' as ContentType,
    contentId: research.id,
    eventCategory: 'Research',
    slug: research.slug,
    setVoted,
    setUsefulCount,
    loggedInUser: activeUser,
  }

  const handleUsefulClick = async (
    vote: 'add' | 'delete',
    eventCategory = 'Library',
  ) => {
    await onUsefulClick({
      vote,
      config: { ...configOnUsefulClick, eventCategory },
    })
  }

  useEffect(() => {
    const getSubscribed = async () => {
      const subscribed = await subscribersService.isSubscribed(
        'research',
        research.id,
      )
      setSubscribed(subscribed)
    }

    const getVoted = async () => {
      const voted = await usefulService.hasVoted('research', research.id)
      setVoted(voted)
    }

    if (activeUser) {
      getSubscribed()
      getVoted()
    }
  }, [activeUser, research])

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

  const onFollowClick = async (value: 'add' | 'remove') => {
    if (!activeUser) {
      return
    }
    if (value === 'add') {
      await subscribersService.add('research', research.id)
    } else {
      await subscribersService.remove('research', research.id)
    }
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

  const isEditable = useMemo(() => {
    return (
      !!activeUser &&
      (hasAdminRights(activeUser) ||
        research.author?.username === activeUser.username ||
        research.collaborators
          ?.map((c) => c.username)
          .includes(activeUser.username))
    )
  }, [activeUser, research.author])

  const isDeletable = useMemo(() => {
    return (
      !!activeUser &&
      (hasAdminRights(activeUser) ||
        research.author?.username === activeUser.username)
    )
  }, [activeUser, research.author])

  const sortedUpdates = useMemo(() => {
    return research?.updates
      ?.slice()
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
  }, [research?.updates])

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', alignSelf: 'center' }}>
      <Breadcrumbs content={research} variant="research" />
      <ResearchDescription
        research={research}
        key={research.id}
        votedUsefulCount={usefulCount}
        activeUser={activeUser}
        isEditable={isEditable}
        isDeletable={isDeletable}
        hasUserVotedUseful={voted}
        hasUserSubscribed={subscribed}
        onUsefulClick={() =>
          handleUsefulClick(voted ? 'delete' : 'add', 'ResearchDescription')
        }
        onFollowClick={() => onFollowClick(subscribed ? 'remove' : 'add')}
        subscribersCount={subscribersCount}
        commentsCount={research.commentCount}
        updatesCount={research.updates.length}
      />
      <Flex
        sx={{
          flexDirection: 'column',
          marginTop: [2, 4],
          marginBottom: 4,
          gap: [4, 6],
        }}
      >
        {sortedUpdates?.map((update, index) => (
          <ResearchUpdate
            research={research}
            update={update}
            key={update.id}
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
              {research.author && (
                <ArticleCallToActionSupabase
                  author={research.author}
                  contributors={research.collaborators}
                >
                  <UsefulStatsButton
                    isLoggedIn={!!activeUser}
                    votedUsefulCount={usefulCount}
                    hasUserVotedUseful={voted}
                    onUsefulClick={() =>
                      handleUsefulClick(
                        voted ? 'delete' : 'add',
                        'ArticleCallToAction',
                      )
                    }
                  />
                  <FollowButton
                    isLoggedIn={!!activeUser}
                    hasUserSubscribed={subscribed}
                    onFollowClick={() =>
                      onFollowClick(subscribed ? 'remove' : 'add')
                    }
                    tooltipFollow="Follow to be notified about new updates"
                    tooltipUnfollow="Unfollow to stop be notified about new updates"
                  />
                </ArticleCallToActionSupabase>
              )}
            </Box>
          </UserEngagementWrapper>
        )}
      </ClientOnly>

      {isEditable && (
        <Flex sx={{ my: 4 }}>
          <Link to={`/research/${research.slug}/new-update`}>
            <Button
              type="button"
              large
              sx={{
                marginLeft: 2,
                marginBottom: [3, 3, 0],
              }}
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
