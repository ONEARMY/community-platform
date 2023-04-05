import { observer } from 'mobx-react'
import * as React from 'react'
import type { RouteComponentProps } from 'react-router'
import { Box, Flex } from 'theme-ui'
import {
  ArticleCallToAction,
  Button,
  Loader,
  UsefulStatsButton,
} from 'oa-components'
import { NotFoundPage } from 'src/pages/NotFound/NotFound'
import { useResearchStore } from 'src/stores/Research/research.store'
import { isAllowToEditContent } from 'src/utils/helpers'
import ResearchDescription from './ResearchDescription'
import ResearchUpdate from './ResearchUpdate'
import { useCommonStores } from '../../../index'
import { Link } from 'react-router-dom'
import type { IComment, UserComment } from 'src/models'
import { seoTagsUpdate } from 'src/utils/seo'
import type { IUploadedFileMeta } from 'src/stores/storage'
import { isUserVerified } from 'src/common/isUserVerified'
import { researchCommentUrlPattern } from './helper'
import { trackEvent } from 'src/common/Analytics'

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
  const { userStore, aggregationsStore } = useCommonStores().stores

  const [isLoading, setIsLoading] = React.useState(true)

  const moderateResearch = async (accepted: boolean) => {
    const item = researchStore.activeResearchItem
    if (item) {
      item.moderation = accepted ? 'accepted' : 'rejected'
      await researchStore.moderateResearch(item)
    }
  }

  const onUsefulClick = async (
    researchId: string,
    researchAuthor: string,
    researchSlug: string,
  ) => {
    // Trigger update without waiting
    userStore.updateUsefulResearch(researchId, researchAuthor, researchSlug)
    // Make an optimistic update of current aggregation to update UI
    const votedUsefulCount =
      aggregationsStore.aggregations.users_votedUsefulResearch![researchId] || 0
    const hasUserVotedUseful = researchStore.userVotedActiveResearchUseful
    aggregationsStore.overrideAggregationValue('users_votedUsefulResearch', {
      [researchId]: votedUsefulCount + (hasUserVotedUseful ? -1 : 1),
    })
    trackEvent({
      category: 'Research',
      action: hasUserVotedUseful ? 'UsefulMarkRemoved' : 'MarkedUseful',
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

  React.useEffect(() => {
    ;(async () => {
      const { slug } = props.match.params
      const researchItem = await researchStore.setActiveResearchItem(slug)
      setIsLoading(false)
      const hash = props.location.hash
      if (new RegExp(/^#update_\d$/).test(props.location.hash)) {
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
    })()

    // Reset the store's active item and seo tags on component cleanup
    return () => {
      researchStore.setActiveResearchItem()
      seoTagsUpdate({})
    }
  }, [props, researchStore])

  const item = researchStore.activeResearchItem
  const loggedInUser = researchStore.activeUser

  if (item) {
    const { aggregations } = aggregationsStore
    // Distinguish between undefined aggregations (not loaded) and undefined aggregation (no votes)
    const votedUsefulCount = aggregations.users_votedUsefulResearch
      ? aggregations.users_votedUsefulResearch[item._id] || 0
      : undefined
    const isEditable =
      !!researchStore.activeUser &&
      isAllowToEditContent(item, researchStore.activeUser)
    const researchAuthor = {
      userName: item._createdBy,
      countryCode: item.creatorCountry,
      isVerified: isUserVerified(item._createdBy),
    }

    const onFollowingClick = async () => {
      if (!loggedInUser?.userName) {
        return null
      }

      if (item.subscribers?.includes(loggedInUser?.userName || '')) {
        researchStore.removeSubscriberFromResearchArticle(
          item._id,
          loggedInUser?.userName,
        )
      } else {
        researchStore.addSubscriberToResearchArticle(
          item._id,
          loggedInUser?.userName,
        )
      }
    }

    const collaborators = Array.isArray(item.collaborators)
      ? item.collaborators
      : ((item.collaborators as string) || '').split(',').filter(Boolean)
    return (
      <Box sx={{ width: '100%', maxWidth: '1000px', alignSelf: 'center' }}>
        <ResearchDescription
          research={item}
          key={item._id}
          votedUsefulCount={votedUsefulCount}
          loggedInUser={loggedInUser}
          isEditable={isEditable}
          needsModeration={researchStore.needsModeration(item)}
          hasUserVotedUseful={researchStore.userVotedActiveResearchUseful}
          moderateResearch={moderateResearch}
          onUsefulClick={() =>
            onUsefulClick(item._id, item._createdBy, item.slug)
          }
          onFollowingClick={() => {
            onFollowingClick()
          }}
        />
        <Box my={16}>
          {item &&
            item?.updates
              ?.filter((update) => update.status !== 'draft')
              .map((update, index) => (
                <ResearchUpdate
                  update={update}
                  key={update._id}
                  updateIndex={index}
                  isEditable={isEditable}
                  slug={item.slug}
                  comments={transformToUserComment(
                    researchStore.getActiveResearchUpdateComments(index),
                    loggedInUser?.userName,
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
          <ArticleCallToAction
            author={researchAuthor}
            contributors={collaborators.map((c) => ({
              userName: c,
              isVerified: false,
            }))}
          >
            <UsefulStatsButton
              isLoggedIn={!!loggedInUser}
              votedUsefulCount={votedUsefulCount}
              hasUserVotedUseful={researchStore.userVotedActiveResearchUseful}
              onUsefulClick={() => {
                trackEvent({
                  category: 'ArticleCallToAction',
                  action: 'ReseachUseful',
                  label: item.slug,
                })
                onUsefulClick(item._id, item._createdBy, item.slug)
              }}
            />
          </ArticleCallToAction>
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

const transformToUserComment = (
  comments: IComment[],
  loggedInUsername,
): UserComment[] => {
  if (!comments) return []
  return comments.map((c) => ({
    ...c,
    isEditable: c.creatorName === loggedInUsername,
  }))
}

export default ResearchArticle
