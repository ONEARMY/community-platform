/* tslint:disable:no-eval */
import * as React from 'react'
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'
import DevTools from 'mobx-react-devtools'
import { NotFoundPage } from './NotFound/NotFound'
import ScrollToTop from './../components/ScrollToTop/ScrollToTop'
import Header from './common/Header/Header'
import { SITE } from 'src/config/config'
import { DevNotice } from 'src/components/Dev/DevNotice'
import PageContainer from 'src/components/Layout/PageContainer'
import {
  COMMUNITY_PAGES,
  COMMUNITY_PAGES_PROFILE,
  COMMUNITY_PAGES_MORE,
  ADMIN_PAGES,
} from './PageList'

interface IState {
  singlePageMode: boolean
  displayPageComponent?: any
}

export class Routes extends React.Component<any, IState> {
  constructor(props: any) {
    super(props)
  }

  public render() {
    const pages = [
      ...COMMUNITY_PAGES,
      ...COMMUNITY_PAGES_PROFILE,
      ...COMMUNITY_PAGES_MORE,
      ...ADMIN_PAGES,
    ]
    // we are rendering different pages and navigation dependent on whether the user has navigated directly to view the
    // entire site, or just one page of it via subdomains. This is so we can effectively integrate just parts of this
    // platform into other sites. The first case is direct nav
    return (
      <div>
        {SITE !== 'production' ? <DevTools /> : null}
        <DevNotice />
        <BrowserRouter>
          {/* on page change scroll to top */}
          <ScrollToTop>
            <div
              style={{
                minHeight: '100vh',
                maxWidth: '100vw',
                display: 'flex',
                overflowY: 'auto',
                overflowX: 'hidden',
                flexDirection: 'column',
              }}
            >
              <Switch>
                {pages.map(page => (
                  <Route
                    exact={page.exact}
                    path={page.path}
                    key={page.path}
                    render={props => (
                      <React.Fragment>
                        <Header
                          variant="community"
                          title={page.title}
                          description={page.description}
                        />
                        <PageContainer ignoreMaxWidth={page.fullPageWidth}>
                          <>{page.component}</>
                        </PageContainer>
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
                  render={() => <Redirect to="/how-to" />}
                />
              </Switch>
            </div>
          </ScrollToTop>
        </BrowserRouter>
      </div>
    )
  }
}
