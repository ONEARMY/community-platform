import { MODULE } from 'src/modules'
import type { IPageMeta } from '../PageList'
import { Route } from 'react-router'
import questionRoutes from './question.routes'
import {
  QuestionStore,
  QuestionStoreContext,
} from 'src/stores/Question/question.store'

const QuestionModuleContainer = () => {
  return (
    <QuestionStoreContext.Provider value={new QuestionStore()}>
      <Route component={questionRoutes} />
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
