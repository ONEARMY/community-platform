import React, { Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Analytics } from 'src/common/Analytics'
import { getSupportedModules, isModuleSupported, MODULE } from 'src/modules'
import Main from 'src/pages/common/Layout/Main'
import { SeoTagsUpdateComponent } from 'src/utils/seo'
import { Flex } from 'theme-ui'

import { ScrollToTop } from '../common/ScrollToTop'
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
                      <>{page.component}</>
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
