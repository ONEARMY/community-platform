import { observer } from 'mobx-react'
import {
  ArticleCallToAction,
  Button,
  FollowButton,
  Loader,
  UsefulStatsButton,
} from 'oa-components'
import * as React from 'react'
import type { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { trackEvent } from 'src/common/Analytics'
import { useContributorsData } from 'src/common/hooks/contributorsData'
import type { IComment, IResearch, UserComment, IUser } from 'src/models'
import { NotFoundPage } from 'src/pages/NotFound/NotFound'
import { useResearchStore } from 'src/stores/Research/research.store'
import type { IUploadedFileMeta } from 'src/stores/storage'
import { isAllowToEditContent } from 'src/utils/helpers'
import { seoTagsUpdate } from 'src/utils/seo'
import { Box, Flex } from 'theme-ui'
import ResearchDescription from './ResearchDescription'
import ResearchUpdate from './ResearchUpdate'
import { researchCommentUrlPattern } from './helper'
import { useCommonStores } from 'src'
import { useResearchItem } from './ResearchArticle.hooks'

type IProps = RouteComponentProps<{ slug: string }>

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

const ResearchArticle = observer((props: IProps) => {
  const researchStore = useResearchStore()
  const { aggregationsStore, userStore } = useCommonStores().stores

  const moderateResearch = async (accepted: boolean) => {
    const item = researchStore.activeResearchItem
    if (item) {
      item.moderation = accepted ? 'accepted' : 'rejected'
      await researchStore.moderateResearch(item)
    }
  }

  const onUsefulClick = async (
    researchId: string,
    researchSlug: string,
    eventCategory = 'Research',
  ) => {
    if (!loggedInUser?.userName) {
      return null
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

  const { isLoading, researchItem, activeUser } = useResearchItem(
    props,
    researchStore,
    userStore,
    aggregationsStore,
  )

  React.useEffect(() => {
    ;(async () => {
      const { slug } = props.match.params

      const researchItem = await researchStore.setActiveResearchItemBySlug(slug)
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
    })()

    // Reset the store's active item and seo tags on component cleanup
    return () => {
      researchStore.setActiveResearchItemBySlug()
      seoTagsUpdate({})
    }
  }, [props, researchStore])

  React.useEffect(() => {
    const hash = props.location.hash
    if (new RegExp(/^#update_\d$/).test(props.location.hash)) {
      scrollIntoRelevantSection(hash)
    }
  }, [researchItem])

  const item = researchItem
  const loggedInUser = activeUser

  const collaborators = Array.isArray(item?.collaborators)
    ? item?.collaborators
    : ((item?.collaborators as string | undefined)?.split(',') || []).filter(
        Boolean,
      )

  const contributors = useContributorsData(collaborators || [])

  if (item) {
    const isEditable = !!activeUser && isAllowToEditContent(item, activeUser)

    const onFollowClick = async (researchSlug: string) => {
      if (!loggedInUser?.userName) {
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

    return (
      <Box sx={{ width: '100%', maxWidth: '1000px', alignSelf: 'center' }}>
        <ResearchDescription
          research={item}
          key={item._id}
          votedUsefulCount={researchItem.votedUsefulBy?.length || 0}
          loggedInUser={loggedInUser}
          isEditable={isEditable}
          needsModeration={researchStore.needsModeration(researchItem)}
          hasUserVotedUseful={researchStore.userVotedActiveResearchUseful}
          hasUserSubscribed={researchStore.userHasSubscribed}
          moderateResearch={moderateResearch}
          onUsefulClick={() =>
            onUsefulClick(item._id, item.slug, 'ResearchDescription')
          }
          onFollowClick={() => {
            onFollowClick(item.slug)
          }}
          contributors={contributors}
        />
        <Box my={16}>
          {item &&
            item?.updates
              ?.filter(isUpdateVisible)
              .map((update, index) => (
                <ResearchUpdate
                  update={update}
                  key={update._id}
                  updateIndex={index}
                  isEditable={isEditable}
                  slug={item.slug}
                  comments={transformToUserComment(
                    researchStore.getActiveResearchUpdateComments(index),
                    loggedInUser,
                    item,
                  )}
                  showComments={areCommentVisible(index)}
                />
              ))}
        </Box>
        <Box
          sx={{
            paddingLeft: [null, '12%', '12%'],
            mb: 16,
          }}
        >
          {researchItem.author ? (
            <ArticleCallToAction
              author={researchItem.author}
              contributors={contributors}
            >
              {item.moderation === 'accepted' && (
                <UsefulStatsButton
                  isLoggedIn={!!loggedInUser}
                  votedUsefulCount={researchStore.votedUsefulCount}
                  hasUserVotedUseful={
                    researchStore.userVotedActiveResearchUseful
                  }
                  onUsefulClick={() => {
                    onUsefulClick(item._id, item.slug, 'ArticleCallToAction')
                  }}
                />
              )}
              <FollowButton
                isLoggedIn={!!loggedInUser}
                hasUserSubscribed={researchStore.userHasSubscribed}
                onFollowClick={() => onFollowClick(item.slug)}
              />
            </ArticleCallToAction>
          ) : null}
        </Box>
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
  } else {
    return isLoading ? <Loader /> : <NotFoundPage />
  }
})

const scrollIntoRelevantSection = (hash: string) => {
  setTimeout(() => {
    const section = document.querySelector(hash)
    // the delay is needed, otherwise the scroll is not happening in Firefox
    section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, 500)
}

const isUpdateVisible = (update: IResearch.UpdateDB) => {
  return update.status !== 'draft' && update._deleted === false
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
      isAllowToEditContent(item, loggedInUser),
  }))
}

export default ResearchArticle
