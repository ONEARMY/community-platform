import { MODULE } from 'src/modules'
import type { IPageMeta } from '../PageList'
import QuestionRoutes from './question.routes'
import {
  QuestionStore,
  QuestionStoreContext,
} from 'src/stores/Question/question.store'

export const QuestionModuleContainer = () => {
  return (
    <QuestionStoreContext.Provider value={new QuestionStore()}>
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
