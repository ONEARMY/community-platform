import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { AuthRoute } from '../common/AuthRoute'
import { RESEARCH_EDITOR_ROLES } from './constants'

const CreateResearch = lazy(
  () =>
    import(/* webpackChunkName: "CreateResearch" */ './Content/CreateResearch'),
)
const CreateUpdate = lazy(
  () =>
    import(
      /* webpackChunkName: "CreateResearchUpdate" */ './Content/CreateUpdate/CreateUpdate'
    ),
)
const ResearchItemEditor = lazy(
  () => import(/* webpackChunkName: "EditResearch" */ './Content/EditResearch'),
)
const UpdateItemEditor = lazy(
  () =>
    import(/* webpackChunkName: "EditResearchUpdate" */ './Content/EditUpdate'),
)
const ResearchArticle = lazy(
  () =>
    import(
      /* webpackChunkName: "ResearchArticle" */ './Content/ResearchArticle'
    ),
)
const ResearchList = lazy(
  () => import(/* webpackChunkName: "ResearchList" */ './Content/ResearchList'),
)

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max)
}

export const researchRouteElements = (
  <>
    <Route index element={<ResearchList />} />
    <Route
      path="create"
      element={
        <AuthRoute roleRequired={RESEARCH_EDITOR_ROLES}>
          <CreateResearch />
        </AuthRoute>
      }
    />
    <Route
      path=":slug/new-update"
      element={
        <AuthRoute roleRequired={RESEARCH_EDITOR_ROLES}>
          <CreateUpdate />
        </AuthRoute>
      }
    />
    <Route
      path=":slug/edit"
      element={
        <AuthRoute roleRequired={RESEARCH_EDITOR_ROLES}>
          <ResearchItemEditor />
        </AuthRoute>
      }
    />
    <Route
      path=":slug/edit-update/:update"
      element={
        <AuthRoute roleRequired={RESEARCH_EDITOR_ROLES}>
          <UpdateItemEditor />
        </AuthRoute>
      }
    />
    <Route
      path=":slug"
      key={getRandomInt(55555)}
      element={<ResearchArticle />}
    />
  </>
)

const routes = () => (
  <Suspense fallback={<div></div>}>
    <Routes>{researchRouteElements}</Routes>
  </Suspense>
)

export default routes
