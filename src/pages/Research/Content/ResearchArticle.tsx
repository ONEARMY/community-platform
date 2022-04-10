import { observer } from 'mobx-react'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Box, Flex } from 'theme-ui'
import { Button } from 'oa-components'
import { Link } from 'src/components/Links'
import { Loader } from 'src/components/Loader'
import { NotFoundPage } from 'src/pages/NotFound/NotFound'
import { useResearchStore } from 'src/stores/Research/research.store'
import { isAllowToEditContent } from 'src/utils/helpers'
import ResearchDescription from './ResearchDescription'
import ResearchUpdate from './ResearchUpdate'
import { useCommonStores } from 'src/index'

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

  const onUsefulClick = async (researchId: string) => {
    await userStore.updateUsefulResearch(researchId)
  }

  React.useEffect(() => {
    ;(async () => {
      const { slug } = props.match.params
      await researchStore.setActiveResearchItem(slug)
      setIsLoading(false)
    })()

    // Reset the store's active item on component cleanup
    return () => {
      researchStore.setActiveResearchItem()
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
          userVotedUseful={researchStore.userVotedActiveResearchUseful}
          moderateResearch={moderateResearch}
          onUsefulClick={() => onUsefulClick(item._id)}
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
                />
              )
            })}
        </Box>
        {isEditable && (
          <Flex my={4}>
            <Link to={`/research/${item.slug}/new-update`} mb={[3, 3, 0]}>
              <Button large ml={2}>
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
export default ResearchArticle
