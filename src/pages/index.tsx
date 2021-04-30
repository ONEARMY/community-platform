/* tslint:disable:no-eval */
import React, { Suspense } from 'react'
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'
import GoogleAnalytics from 'src/components/GoogleAnalytics'
import { NotFoundPage } from './NotFound/NotFound'
import ScrollToTop from './../components/ScrollToTop/ScrollToTop'
import Header from './common/Header/Header'
import Main from 'src/pages/common/Layout/Main'
import { Button } from 'src/components/Button'
import {
  COMMUNITY_PAGES,
  COMMUNITY_PAGES_PROFILE,
  COMMUNITY_PAGES_MORE,
  ADMIN_PAGES,
  NO_HEADER_PAGES,
  POLICY_PAGES,
} from './PageList'
import { Link, Flex } from 'rebass'
import DevSiteHeader from 'src/components/DevSiteHeader/DevSiteHeader'

interface IState {
  singlePageMode: boolean
  displayPageComponent?: any
}

export class Routes extends React.Component<any, IState> {
  // eslint-disable-next-line
  constructor(props: any) {
    super(props)
  }

  public render() {
    const pages = [
      ...COMMUNITY_PAGES,
      ...COMMUNITY_PAGES_PROFILE,
      ...COMMUNITY_PAGES_MORE,
      ...ADMIN_PAGES,
      ...NO_HEADER_PAGES,
      ...POLICY_PAGES,
    ]
    // we are rendering different pages and navigation dependent on whether the user has navigated directly to view the
    // entire site, or just one page of it via subdomains. This is so we can effectively integrate just parts of this
    // platform into other sites. The first case is direct nav
    return (
      <Flex height={'100vh'} flexDirection="column" data-cy="page-container">
        <BrowserRouter>
          <GoogleAnalytics />
          {/* on page change scroll to top */}
          <ScrollToTop>
            {/* TODO - add better loading fallback */}
            <DevSiteHeader />
            <Header />
            <Suspense fallback={<div></div>}>
              <Switch>
                {pages.map(page => (
                  <Route
                    exact={page.exact}
                    path={page.path}
                    key={page.path}
                    render={props => (
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
        </BrowserRouter>
        <Link
          target="_blank"
          href="https://discordapp.com/invite/cGZ5hKP"
          data-cy="feedback"
          sx={{ display: ['none', 'none', 'block'] }}
        >
          <Button
            sx={{ position: 'fixed', bottom: '30px', right: '30px' }}
            variant="primary"
          >
            #Feedback? Join our chat{' '}
            <span role="img" aria-label="talk-bubble">
              💬
            </span>
          </Button>
        </Link>
      </Flex>
    )
  }
}
