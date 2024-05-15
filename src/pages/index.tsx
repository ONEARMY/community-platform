import React, { Suspense } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
} from 'react-router-dom'
import { Button, ExternalLink } from 'oa-components'
import { Alerts } from 'src/common/Alerts/Alerts'
import { Analytics } from 'src/common/Analytics'
import { getSupportedModules, isModuleSupported, MODULE } from 'src/modules'
import DevSiteHeader from 'src/pages/common/DevSiteHeader/DevSiteHeader'
import Main from 'src/pages/common/Layout/Main'
import { SeoTagsUpdateComponent } from 'src/utils/seo'
import { Box, Flex } from 'theme-ui'

import { ScrollToTop } from '../common/ScrollToTop'
import GlobalSiteFooter from './common/GlobalSiteFooter/GlobalSiteFooter'
import Header from './common/Header/Header'
import { NotFoundPage } from './NotFound/NotFound'
import {
  COMMUNITY_PAGES_PROFILE,
  getAvailablePageList,
  NO_HEADER_PAGES,
  POLICY_PAGES,
} from './PageList'
import { QuestionModuleContainer } from './Question'

const routes = [
  //   any,
  //   {
  //     singlePageMode: boolean
  //     displayPageComponent?: any
  //     supportedRoutes?: IPageMeta[]
  //   }
  // > {
  // we are rendering different pages and navigation dependent on whether the user has navigated directly to view the
  // entire site, or just one page of it via subdomains. This is so we can effectively integrate just parts of this
  // platform into other sites. The first case is direct nav
  ...getAvailablePageList(getSupportedModules()),
  ...COMMUNITY_PAGES_PROFILE,
  ...NO_HEADER_PAGES,
  ...POLICY_PAGES,
].map((page) => (
  <Route
    path={page.exact ? page.path : `${page.path}/*`}
    key={page.path}
    element={
      <>
        <SeoTagsUpdateComponent title={page.title} />
        <Main
          data-cy="main-layout-container"
          style={{ flex: 1 }}
          customStyles={page.customStyles}
          ignoreMaxWidth={page.fullPageWidth}
        >
          <>{page.component}</>
        </Main>
      </>
    }
  />
))

if (isModuleSupported(MODULE.QUESTION)) {
  routes.push(
    <Route
      path="/questions/*"
      key="questions"
      element={
        <>
          <SeoTagsUpdateComponent title="Question" />
          <Main data-cy="main-layout-container" style={{ flex: 1 }}>
            <QuestionModuleContainer />
          </Main>
        </>
      }
    />,
  )
}

routes.push(
  <Route index element={<Navigate to="/academy" />} />,
  <Route path="*" element={<NotFoundPage />} />,
)

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <>
          <Analytics />
          {/* on page change scroll to top */}
          <ScrollToTop />

          {/* TODO - add better loading fallback */}
          <DevSiteHeader />
          <Alerts />
          <Header />
          <Suspense
            fallback={<div style={{ minHeight: 'calc(100vh - 175px)' }}></div>}
          >
            <Outlet />
          </Suspense>
          <GlobalSiteFooter />
          <Box
            sx={{
              position: 'fixed',
              bottom: '30px',
              right: '30px',
              display: ['none', 'none', 'block'],
            }}
          >
            <ExternalLink href="https://discord.gg/gJ7Yyk4" data-cy="feedback">
              <Button variant="primary" icon="comment">
                Join our chat
              </Button>
            </ExternalLink>
          </Box>
        </>
      }
    >
      {routes}
    </Route>,
  ),
)

export const Pages = () => {
  //   any,
  //   {
  //     singlePageMode: boolean
  //     displayPageComponent?: any
  //     supportedRoutes?: IPageMeta[]
  //   }
  // > {
  // we are rendering different pages and navigation dependent on whether the user has navigated directly to view the
  // entire site, or just one page of it via subdomains. This is so we can effectively integrate just parts of this
  // platform into other sites. The first case is direct nav

  return (
    <Flex
      sx={{ height: '100vh', flexDirection: 'column' }}
      data-cy="page-container"
    >
      <RouterProvider router={router} />
    </Flex>
  )
}
