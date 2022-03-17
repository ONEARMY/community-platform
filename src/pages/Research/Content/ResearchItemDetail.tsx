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
import Update from './Update'

type IProps = RouteComponentProps<{ slug: string }>

const ResearchItemDetail = observer((props: IProps) => {
  const store = useResearchStore()

  const [isLoading, setIsLoading] = React.useState(true)

  const moderateResearch = async (accepted: boolean) => {
    const item = store.activeResearchItem
    if (item) {
      item.moderation = accepted ? 'accepted' : 'rejected'
      await store.moderateResearch(item)
    }
  }

  React.useEffect(() => {
    ;(async () => {
      const { slug } = props.match.params
      await store.setActiveResearchItem(slug)
      setIsLoading(false)
    })()

    // Reset the store's active item on component cleanup
    return () => {
      store.setActiveResearchItem()
    }
  }, [props, store])

  const item = store.activeResearchItem

  if (item) {
    const isEditable =
      !!store.activeUser && isAllowToEditContent(item, store.activeUser)

    return (
      <Box sx={{ width: '100%', maxWidth: '1000px', alignSelf: 'center' }}>
        <ResearchDescription
          research={item}
          isEditable={isEditable}
          needsModeration={store.needsModeration(item)}
          moderateResearch={moderateResearch}
        />
        <Box my={16}>
          {item &&
            item?.updates?.map((update, index) => {
              return (
                <Update
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
export default ResearchItemDetail
