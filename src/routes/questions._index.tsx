import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isModuleSupported, MODULE } from 'src/modules'
import Main from 'src/pages/common/Layout/Main'
import { Layout } from 'src/pages/Layout'
import { QuestionListing } from 'src/pages/Question/QuestionListing'
import {
  DiscussionStore,
  DiscussionStoreContext,
} from 'src/stores/Discussions/discussions.store'
import {
  QuestionStore,
  QuestionStoreContext,
} from 'src/stores/Question/question.store'
import { SeoTagsUpdateComponent } from 'src/utils/seo'

export async function clientLoader() {
  return null
}

export default function Index() {
  const rootStore = useCommonStores()

  if (!isModuleSupported(MODULE.QUESTION)) {
    return null
  }

  return (
    <Layout>
      <Main data-cy="main-layout-container" style={{ flex: 1 }}>
        <SeoTagsUpdateComponent title="Questions" />
        <QuestionStoreContext.Provider value={new QuestionStore(rootStore)}>
          <DiscussionStoreContext.Provider
            value={new DiscussionStore(rootStore)}
          >
            <QuestionListing />
          </DiscussionStoreContext.Provider>
        </QuestionStoreContext.Provider>
      </Main>
    </Layout>
  )
}
