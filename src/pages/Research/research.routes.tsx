import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { isPreciousPlastic } from 'src/config/config'

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

const roles = isPreciousPlastic() ? [] : RESEARCH_EDITOR_ROLES

export const researchRouteElements = (
  <>
    <Route index element={<ResearchList />} />
    <Route
      path="create"
      element={
        <AuthRoute roleRequired={roles}>
          <CreateResearch />
        </AuthRoute>
      }
    />
    <Route
      path=":slug/new-update"
      element={
        <AuthRoute roleRequired={roles}>
          <CreateUpdate />
        </AuthRoute>
      }
    />
    <Route
      path=":slug/edit"
      element={
        <AuthRoute roleRequired={roles}>
          <ResearchItemEditor />
        </AuthRoute>
      }
    />
    <Route
      path=":slug/edit-update/:update"
      element={
        <AuthRoute roleRequired={roles}>
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
