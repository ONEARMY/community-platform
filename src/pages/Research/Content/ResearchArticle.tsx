import React, { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { observer } from 'mobx-react'
import {
  ArticleCallToAction,
  Button,
  FollowButton,
  Loader,
  UsefulStatsButton,
  UserEngagementWrapper,
} from 'oa-components'
import { IModerationStatus, ResearchUpdateStatus } from 'oa-shared'
import { trackEvent } from 'src/common/Analytics'
import { useContributorsData } from 'src/common/hooks/contributorsData'
import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isUserVerifiedWithStore } from 'src/common/isUserVerified'
import { NotFoundPage } from 'src/pages/NotFound/NotFound'
import { useResearchStore } from 'src/stores/Research/research.store'
import {
  getPublicUpdates,
  getResearchTotalCommentCount,
  isAllowedToDeleteContent,
  isAllowedToEditContent,
} from 'src/utils/helpers'
import { seoTagsUpdate } from 'src/utils/seo'
import { Box, Flex } from 'theme-ui'

import { researchCommentUrlPattern } from './helper'
import ResearchDescription from './ResearchDescription'
import ResearchUpdate from './ResearchUpdate'

import type { IComment, IResearch, IUser, UserComment } from 'src/models'
import type { IUploadedFileMeta } from 'src/stores/storage'

const researchCommentUrlRegex = new RegExp(researchCommentUrlPattern)

const areCommentVisible = (updateIndex) => {
  let showComments = false

  if (researchCommentUrlRegex.test(window.location.hash)) {
    const match = window.location.hash.match(/#update-\d/)
    if (match) {
      showComments =
        updateIndex === parseInt(match[0].replace('#update-', ''), 10)
    }
  }

  return showComments
}

const transformToUserComment = (
  comments: IComment[],
  loggedInUser: IUser | undefined,
  item: IResearch.ItemDB,
): UserComment[] => {
  if (!comments) return []
  return comments.map((c) => ({
    ...c,
    isEditable:
      c.creatorName === loggedInUser?.userName ||
      isAllowedToEditContent(item, loggedInUser),
  }))
}

const ResearchArticle = observer(() => {
  const { slug } = useParams()
  const location = useLocation()
  const researchStore = useResearchStore()
  const { aggregationsStore, tagsStore } = useCommonStores().stores
  const [isLoading, setIsLoading] = React.useState(true)
  const item = researchStore.activeResearchItem
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

  const onUsefulClick = (
    researchId: string,
    researchSlug: string,
    eventCategory = 'Research',
  ) => {
    if (!loggedInUser?.userName) {
      return
    }

    // Trigger update without waiting
    researchStore.toggleUsefulByUser(researchId, loggedInUser?.userName)
    const hasUserVotedUseful = researchStore.userVotedActiveResearchUseful
    trackEvent({
      category: eventCategory,
      action: hasUserVotedUseful ? 'ResearchUseful' : 'ResearchUsefulRemoved',
      label: researchSlug,
    })
  }

  const scrollIntoRelevantSection = (hash: string) => {
    setTimeout(() => {
      const section = document.querySelector(hash)
      // the delay is needed, otherwise the scroll is not happening in Firefox
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 500)
  }

  useEffect(() => {
    const init = async () => {
      const researchItem = await researchStore.setActiveResearchItemBySlug(slug)
      setIsLoading(false)
      const hash = location.hash
      if (new RegExp(/^#update_\d$/).test(location.hash)) {
        scrollIntoRelevantSection(hash)
      }
      // Update SEO tags
      if (researchItem) {
        // Use whatever image used in most recent update for SEO image
        const latestImage = researchItem?.updates
          ?.map((u) => (u.images?.[0] as IUploadedFileMeta)?.downloadUrl)
          .filter((url: string) => !!url)
          .pop()
        seoTagsUpdate({
          title: researchItem.title,
          description: researchItem.description,
          imageUrl: latestImage,
        })
      }
    }
    init()

    // Reset the store's active item and seo tags on component cleanup
    return () => {
      researchStore.setActiveResearchItemBySlug()
      seoTagsUpdate({})
    }
  }, [slug, location.hash])

  const onFollowClick = (researchSlug: string) => {
    if (!loggedInUser?.userName || !item) {
      return null
    }

    let action: string

    if (item.subscribers?.includes(loggedInUser?.userName || '')) {
      researchStore.removeSubscriberFromResearchArticle(
        item._id,
        loggedInUser?.userName,
      )
      action = 'Unsubscribed'
    } else {
      researchStore.addSubscriberToResearchArticle(
        item._id,
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

  const collaborators = Array.isArray(item?.collaborators)
    ? item?.collaborators
    : ((item?.collaborators as string | undefined)?.split(',') || []).filter(
        Boolean,
      )

  const contributors = useContributorsData(collaborators || [])

  const isEditable =
    !!researchStore.activeUser &&
    !!item &&
    isAllowedToEditContent(item, researchStore.activeUser)
  const isDeletable =
    !!researchStore.activeUser &&
    !!item &&
    isAllowedToDeleteContent(item, researchStore.activeUser)

  const researchAuthor = item
    ? {
        userName: item._createdBy,
        countryCode: item.creatorCountry,
        isVerified: isUserVerifiedWithStore(item._createdBy, aggregationsStore),
      }
    : undefined

  if (isLoading) {
    return <Loader />
  }

  if (!item) {
    return <NotFoundPage />
  }

  const { allTagsByKey } = tagsStore
  const research = {
    ...item,
    tagList:
      item.tags &&
      Object.keys(item.tags)
        .map((t) => allTagsByKey[t])
        .filter(Boolean),
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '1000px', alignSelf: 'center' }}>
      <ResearchDescription
        research={research}
        key={item._id}
        votedUsefulCount={researchStore.votedUsefulCount}
        loggedInUser={loggedInUser as IUser}
        isEditable={isEditable}
        isDeletable={isDeletable}
        needsModeration={researchStore.needsModeration(item)}
        hasUserVotedUseful={researchStore.userVotedActiveResearchUseful}
        hasUserSubscribed={researchStore.userHasSubscribed}
        moderateResearch={moderateResearch}
        onUsefulClick={() =>
          onUsefulClick(item._id, item.slug, 'ResearchDescription')
        }
        onFollowClick={() => onFollowClick(item.slug)}
        contributors={contributors}
        subscribersCount={researchStore.subscribersCount}
        commentsCount={getResearchTotalCommentCount(item)}
        updatesCount={
          item.updates?.filter(
            (u) => u.status !== ResearchUpdateStatus.DRAFT && !u._deleted,
          ).length || 0
        }
      />
      <Box sx={{ marginTop: 8, marginBottom: 4 }}>
        {item &&
          getPublicUpdates(item).map((update, index) => (
            <ResearchUpdate
              update={update}
              key={update._id}
              updateIndex={index}
              isEditable={isEditable}
              slug={item.slug}
              comments={transformToUserComment(
                researchStore.formatResearchCommentList(update.comments),
                loggedInUser as IUser,
                item,
              )}
              showComments={areCommentVisible(index)}
            />
          ))}
      </Box>

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
              {item.moderation === IModerationStatus.ACCEPTED && (
                <UsefulStatsButton
                  isLoggedIn={!!loggedInUser}
                  votedUsefulCount={researchStore.votedUsefulCount}
                  hasUserVotedUseful={
                    researchStore.userVotedActiveResearchUseful
                  }
                  onUsefulClick={() =>
                    onUsefulClick(item._id, item.slug, 'ArticleCallToAction')
                  }
                />
              )}
              <FollowButton
                isLoggedIn={!!loggedInUser}
                hasUserSubscribed={researchStore.userHasSubscribed}
                onFollowClick={() => onFollowClick(item.slug)}
              ></FollowButton>
            </ArticleCallToAction>
          )}
        </Box>
      </UserEngagementWrapper>

      {isEditable && (
        <Flex my={4}>
          <Link to={`/research/${item.slug}/new-update`}>
            <Button large ml={2} mb={[3, 3, 0]}>
              Add update
            </Button>
          </Link>
        </Flex>
      )}
    </Box>
  )
})

export default ResearchArticle
