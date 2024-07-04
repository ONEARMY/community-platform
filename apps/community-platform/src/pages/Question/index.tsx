import { useCommonStores } from '../../common/hooks/useCommonStores'
import { MODULE } from '../../modules'
import {
  DiscussionStore,
  DiscussionStoreContext,
} from '../../stores/Discussions/discussions.store'
import {
  QuestionStore,
  QuestionStoreContext,
} from '../../stores/Question/question.store'
import QuestionRoutes from './question.routes'

import type { IPageMeta } from '../PageList'

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
