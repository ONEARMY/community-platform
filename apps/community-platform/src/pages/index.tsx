import React, { Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Flex } from 'theme-ui'

import { Analytics } from '../common/Analytics'
import { ScrollToTop } from '../common/ScrollToTop'
import { getSupportedModules, isModuleSupported, MODULE } from '../modules'
import { SeoTagsUpdateComponent } from '../utils/seo'
import Main from './common/Layout/Main'
import { StickyButton } from './common/StickyButton'
import { NotFoundPage } from './NotFound/NotFound'
import {
  COMMUNITY_PAGES_PROFILE,
  getAvailablePageList,
  NO_HEADER_PAGES,
  POLICY_PAGES,
} from './PageList'
import { QuestionModuleContainer } from './Question'

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
  const menuItems = [
    ...getAvailablePageList(getSupportedModules()),
    ...COMMUNITY_PAGES_PROFILE,
    ...NO_HEADER_PAGES,
    ...POLICY_PAGES,
  ]

  return (
    <Flex
      sx={{ height: '100vh', flexDirection: 'column' }}
      data-cy="page-container"
    >
      <BrowserRouter>
        <Analytics />
        <ScrollToTop />
        <Suspense
          fallback={<div style={{ minHeight: 'calc(100vh - 175px)' }}></div>}
        >
          <Routes>
            {menuItems.map((page) => (
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
                      {page.component}
                    </Main>
                  </>
                }
              />
            ))}
            {isModuleSupported(MODULE.QUESTION) ? (
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
              />
            ) : null}
            <Route index element={<Navigate to="/academy" />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <StickyButton />
    </Flex>
  )
}
