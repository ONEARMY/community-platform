import { MODULE } from 'src/modules'
import type { IPageMeta } from '../PageList'
import { Route } from 'react-router'
import questionRoutes from './question.routes'

const QuestionModuleContainer = () => {
  return <Route component={questionRoutes} />
}

export const QuestionModule: IPageMeta = {
  moduleName: MODULE.QUESTION,
  path: '/questions',
  component: <QuestionModuleContainer />,
  title: 'Questions',
  description: 'Welcome to question and answer',
}
