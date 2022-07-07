import { observer } from 'mobx-react'
import * as React from 'react'
import type { RouteComponentProps } from 'react-router'
import { Box, Flex } from 'theme-ui'
import { Button } from 'oa-components'
import { Loader } from 'src/components/Loader'
import { NotFoundPage } from 'src/pages/NotFound/NotFound'
import { useResearchStore } from 'src/stores/Research/research.store'
import { isAllowToEditContent } from 'src/utils/helpers'
import ResearchDescription from './ResearchDescription'
import ResearchUpdate from './ResearchUpdate'
import { useCommonStores } from 'src/index'
import { Link } from 'react-router-dom'
import type { IComment, UserComment } from 'src/models'
import { seoTagsUpdate } from 'src/utils/seo'
import type { IUploadedFileMeta } from 'src/stores/storage'

type IProps = RouteComponentProps<{ slug: string }>

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
      if (hash) {
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

    return (
      <Box sx={{ width: '100%', maxWidth: '1000px', alignSelf: 'center' }}>
        <ResearchDescription
          research={item}
          votedUsefulCount={votedUsefulCount}
          loggedInUser={loggedInUser}
          isEditable={isEditable}
          needsModeration={researchStore.needsModeration(item)}
          hasUserVotedUseful={researchStore.userVotedActiveResearchUseful}
          moderateResearch={moderateResearch}
          onUsefulClick={() =>
            onUsefulClick(item._id, item._createdBy, item.slug)
          }
        />
        <Box my={16}>
          {item &&
            item?.updates?.map((update, index) => {
              return (
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
                />
              )
            })}
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

function transformToUserComment(
  comments: IComment[],
  loggedInUsername,
): UserComment[] {
  return comments.map((c) => ({
    ...c,
    isEditable: c.creatorName === loggedInUsername,
  }))
}

export default ResearchArticle
