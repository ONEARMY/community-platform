import React, { Suspense } from 'react'
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'
import { Analytics } from 'src/common/Analytics'
import { NotFoundPage } from './NotFound/NotFound'
import ScrollToTop from '../common/ScrollToTop'
import Header from './common/Header/Header'
import { ServiceWorkerUpdateNotification } from 'src/pages/common/ServiceWorkerUpdateNotification/ServiceWorkerUpdateNotification'
import Main from 'src/pages/common/Layout/Main'
import type { IPageMeta } from './PageList'
import {
  COMMUNITY_PAGES_PROFILE,
  ADMIN_PAGES,
  NO_HEADER_PAGES,
  POLICY_PAGES,
  getAvailablePageList,
} from './PageList'
import { Flex, Box } from 'theme-ui'
import DevSiteHeader from 'src/pages/common/DevSiteHeader/DevSiteHeader'
import { getSupportedModules } from 'src/modules'
import GlobalSiteFooter from './common/GlobalSiteFooter/GlobalSiteFooter'
import { AlertIncompleteProfile } from 'src/common/AlertIncompleteProfile'
import { SeoTagsUpdateComponent } from 'src/utils/seo'
import { ExternalLink, Button } from 'oa-components'

export class Routes extends React.Component<
  any,
  {
    singlePageMode: boolean
    displayPageComponent?: any
    supportedRoutes?: IPageMeta[]
  }
> {
  public render() {
    // we are rendering different pages and navigation dependent on whether the user has navigated directly to view the
    // entire site, or just one page of it via subdomains. This is so we can effectively integrate just parts of this
    // platform into other sites. The first case is direct nav
    const menuItems = [
      ...getAvailablePageList(getSupportedModules()),
      ...COMMUNITY_PAGES_PROFILE,
      ...ADMIN_PAGES,
      ...NO_HEADER_PAGES,
      ...POLICY_PAGES,
    ]

    return (
      <Flex
        sx={{ height: '100vh', flexDirection: 'column' }}
        data-cy="page-container"
      >
        <BrowserRouter>
          <ServiceWorkerUpdateNotification />
          <Analytics />
          {/* on page change scroll to top */}
          <ScrollToTop>
            {/* TODO - add better loading fallback */}
            <DevSiteHeader />
            <AlertIncompleteProfile />
            <Header />
            <Suspense
              fallback={
                <div style={{ minHeight: 'calc(100vh - 175px)' }}></div>
              }
            >
              <Switch>
                {menuItems.map((page) => (
                  <Route
                    exact={page.exact}
                    path={page.path}
                    key={page.path}
                    render={() => (
                      <React.Fragment>
                        <SeoTagsUpdateComponent title={page.title} />
                        <Main
                          data-cy="main-layout-container"
                          style={{ flex: 1 }}
                          customStyles={page.customStyles}
                          ignoreMaxWidth={page.fullPageWidth}
                        >
                          <>{page.component}</>
                        </Main>
                      </React.Fragment>
                    )}
                  />
                ))}
                <Route component={NotFoundPage} />
              </Switch>
              <Switch>
                <Route
                  exact
                  path="/"
                  render={() => <Redirect to="/academy" />}
                />
              </Switch>
            </Suspense>
          </ScrollToTop>
          <GlobalSiteFooter />
        </BrowserRouter>
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
      </Flex>
    )
  }
}
