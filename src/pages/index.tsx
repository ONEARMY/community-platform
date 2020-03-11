/* tslint:disable:no-eval */
import * as React from 'react'
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom'
import GoogleAnalytics from 'src/components/GoogleAnalytics'
import { NotFoundPage } from './NotFound/NotFound'
import ScrollToTop from './../components/ScrollToTop/ScrollToTop'
import Header from './common/Header/Header'
import DevHelpers from 'src/components/DevHelpers/DevHelpers'
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
import { Link } from 'rebass'

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
      ...NO_HEADER_PAGES,
      ...POLICY_PAGES,
    ]
    // we are rendering different pages and navigation dependent on whether the user has navigated directly to view the
    // entire site, or just one page of it via subdomains. This is so we can effectively integrate just parts of this
    // platform into other sites. The first case is direct nav
    return (
      <div>
        {/* <DevHelpers /> */}
        <BrowserRouter>
          <GoogleAnalytics />
          {/* on page change scroll to top */}
          <ScrollToTop>
            <Switch>
              {pages.map(page => (
                <Route
                  exact={page.exact}
                  path={page.path}
                  key={page.path}
                  render={props => (
                    <React.Fragment>
                      <Header />
                      <Main
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
              <Route exact path="/" render={() => <Redirect to="/how-to" />} />
            </Switch>
          </ScrollToTop>
        </BrowserRouter>
        {/* <Link
          target="_blank"
          href="https://docs.google.com/forms/d/e/1FAIpQLSd3nevXb6iewap1lkFPWQxyerLsndcRkocv4QXIL3iLIyzazA/viewform?usp=pp_url&entry.1856170488="
          data-cy="feedback"
          sx={{ display: ['none', 'none', 'block'] }}
        >
          <Button
            sx={{ position: 'fixed', bottom: '30px', right: '30px' }}
            variant="primary"
          >
            Have feedback ?
          </Button>
        </Link> */}
        <Link
          target="_blank"
          href="https://preciousplastic.com/survey"
          data-cy="feedback"
          sx={{ display: ['none', 'none', 'block'] }}
        >
          <Button
            sx={{
              position: 'fixed',
              bottom: '30px',
              left: '50%',
              transform: 'translate(-50%, 0)',
            }}
            variant="primary"
          >
            <b>How big is our Impact ? </b>Help us find out! (Only until 20th
            March!) →
          </Button>
        </Link>
      </div>
    )
  }
}
