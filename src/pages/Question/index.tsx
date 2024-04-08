import { MODULE } from 'src/modules'
import {
  DiscussionStore,
  DiscussionStoreContext,
} from 'src/stores/Discussions/discussions.store'
import {
  QuestionStore,
  QuestionStoreContext,
} from 'src/stores/Question/question.store'

import { useCommonStores } from '../../common/hooks/useCommonStores'
import QuestionRoutes from './question.routes'

import type { IPageMeta } from 'src/pages/PageList'

export const QuestionModuleContainer = () => {
  const rootStore = useCommonStores()
  return (
    <QuestionStoreContext.Provider value={new QuestionStore(rootStore)}>
      <DiscussionStoreContext.Provider value={new DiscussionStore(rootStore)}>
        <QuestionRoutes />
      </DiscussionStoreContext.Provider>
    </QuestionStoreContext.Provider>
  )
}

export const QuestionModule: IPageMeta = {
  moduleName: MODULE.QUESTION,
  path: '/questions',
  component: <QuestionModuleContainer />,
  title: 'Questions',
  description: 'Welcome to question and answer',
}
