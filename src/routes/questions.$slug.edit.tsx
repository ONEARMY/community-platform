import { useCommonStores } from 'src/common/hooks/useCommonStores'
import { isModuleSupported, MODULE } from 'src/modules'
import { AuthRoute } from 'src/pages/common/AuthRoute'
import Main from 'src/pages/common/Layout/Main'
import { Layout } from 'src/pages/Layout'
import { QuestionEdit } from 'src/pages/Question/QuestionEdit'
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
          <AuthRoute>
            <QuestionEdit />
          </AuthRoute>
        </QuestionStoreContext.Provider>
      </Main>
    </Layout>
  )
}
