import { MODULE } from 'src/modules'
import {
  QuestionStore,
  QuestionStoreContext,
} from 'src/stores/Question/question.store'

import { useCommonStores } from '../../index'
import QuestionRoutes from './question.routes'

import type { IPageMeta } from '../PageList'

export const QuestionModuleContainer = () => {
  const rootStore = useCommonStores()
  return (
    <QuestionStoreContext.Provider value={new QuestionStore(rootStore)}>
      <QuestionRoutes />
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
