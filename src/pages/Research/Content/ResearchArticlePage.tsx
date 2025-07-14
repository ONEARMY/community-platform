import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from '@remix-run/react'
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
import { useProfileStore } from 'src/stores/User/profile.store'
import { hasAdminRights } from 'src/utils/helpers'
import { Box, Flex } from 'theme-ui'

import ResearchDescription from './ResearchDescription'
import ResearchUpdate from './ResearchUpdate'

import type { ResearchItem } from 'oa-shared'

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

  const onUsefulClick = async (
    vote: 'add' | 'delete',
    eventCategory = 'Research',
  ) => {
    if (!activeUser) {
      return
    }

    // Trigger update without waiting
    if (vote === 'add') {
      await usefulService.add('research', research.id)
    } else {
      await usefulService.remove('research', research.id)
    }

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
    return research?.updates?.toSorted(
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
          onUsefulClick(voted ? 'delete' : 'add', 'ResearchDescription')
        }
        onFollowClick={() => onFollowClick(subscribed ? 'remove' : 'add')}
        contributors={research.collaborators?.map((x) => ({
          userName: x.username,
          isVerified: x.isVerified,
          countryCode: x.country,
        }))}
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
                      onUsefulClick(
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
