import React, { Suspense } from 'react'
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'
import GoogleAnalytics from 'src/components/GoogleAnalytics'
import { NotFoundPage } from './NotFound/NotFound'
import ScrollToTop from './../components/ScrollToTop/ScrollToTop'
import Header from './common/Header/Header'
import { SWUpdateNotification } from 'src/pages/common/SWUpdateNotification/SWUpdateNotification'
import Main from 'src/pages/common/Layout/Main'
import type {
  IPageMeta
} from './PageList'
import {
  COMMUNITY_PAGES_PROFILE,
  ADMIN_PAGES,
  NO_HEADER_PAGES,
  POLICY_PAGES,
  getAvailablePageList,
} from './PageList'
import { Flex, Box } from 'rebass'
import DevSiteHeader from 'src/components/DevSiteHeader/DevSiteHeader'
import { getSupportedModules } from 'src/modules'
import GlobalSiteFooter from './common/GlobalSiteFooter/GlobalSiteFooter'
import DiscordLink from 'src/components/DiscordLink/DiscordLink'


export class Routes extends React.Component<any, {
  singlePageMode: boolean
  displayPageComponent?: any
  supportedRoutes?: IPageMeta[]
}> {

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
      ];

    return (
      <Flex height={'100vh'} flexDirection="column" data-cy="page-container">
        <BrowserRouter>
          <SWUpdateNotification />
          <GoogleAnalytics />
          {/* on page change scroll to top */}
          <ScrollToTop>
            {/* TODO - add better loading fallback */}
            <DevSiteHeader />
            <Header />
            <Suspense fallback={<div style={{ minHeight: 'calc(100vh - 175px)' }}>
            </div>}>
              <Switch>
                {menuItems.map(page => (
                  <Route
                    exact={page.exact}
                    path={page.path}
                    key={page.path}
                    render={() => (
                      <React.Fragment>
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
        <Box sx={{ position: 'fixed', bottom: '30px', right: '30px', display: ['none', 'none', 'block']  }}>
          <DiscordLink/>
        </Box>
      </Flex>
    )
  }
}
