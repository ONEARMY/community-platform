/* tslint:disable:no-eval */
import * as React from 'react'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import DevTools from 'mobx-react-devtools'

import { HowtoPage } from './Howto/Howto'
import { HomePage } from './Home/Home'
import { NotFoundPage } from './NotFound/NotFound'
import { DiscussionsPage } from './Discussions'
import { SignUpPage } from './SignUp'
import ScrollToTop from './../components/ScrollToTop/ScrollToTop'
import { EventsPage } from './Events/Events'
import Header from './common/Header/Header'
import { SITE } from 'src/config/config'
import { DebugEditorPage } from 'src/components/Editor/Debug'
import { DevNotice } from 'src/components/Dev/DevNotice'

interface IState {
  singlePageMode: boolean
  displayPageComponent?: any
}
export interface IPageMeta {
  path: string
  component: any
  title: string
  description: string
  exact?: boolean
}

export const HOME_PAGE: IPageMeta[] = [
  {
    path: '/',
    component: <HomePage />,
    title: 'Home',
    description: "Welcome home, here is all the stuff you're interested in",
    exact: true,
  },
  {
    path: '/sign-up',
    component: <SignUpPage />,
    title: 'Sign up',
    description: '',
    exact: true,
  },
]

export const COMMUNITY_PAGES: IPageMeta[] = [
  {
    path: '/news',
    component: <NotFoundPage />,
    title: 'Newsfeed',
    description: 'Welcome to news',
  },
  {
    path: '/how-to',
    component: <HowtoPage />,
    title: 'How-To',
    description: '',
  },
  {
    path: '/discussions',
    component: <DiscussionsPage />,
    title: 'Discussions',
    description: '',
  },
]

export const DEBUG_PAGES: IPageMeta[] =
  SITE === 'localhost'
    ? [
        {
          path: '/debugEditor',
          component: <DebugEditorPage />,
          title: 'Debug Editor',
          description: '',
        },
      ]
    : []

export const COMMUNITY_PAGES_MORE: IPageMeta[] = [
  {
    path: '/maps',
    component: <NotFoundPage />,
    title: 'Maps',
    description: '',
  },
  {
    path: '/discover',
    component: <NotFoundPage />,
    title: 'Discover',
    description: '',
  },
  {
    path: '/events',
    component: <EventsPage />,
    title: 'Events',
    description: '',
  },
  {
    path: '/about',
    component: <NotFoundPage />,
    title: 'About',
    description: '',
  },
]
export const COMMUNITY_PAGES_PROFILE: IPageMeta[] = [
  {
    path: '/profile',
    component: <NotFoundPage />,
    title: 'Profile',
    description: '',
  },
  {
    path: '/settings',
    component: <NotFoundPage />,
    title: 'Settings',
    description: '',
  },
  {
    path: '/help',
    component: <NotFoundPage />,
    title: 'Help',
    description: '',
  },
]

export class Routes extends React.Component<any, IState> {
  constructor(props: any) {
    super(props)
    this.state = this.getDisplayState()
  }

  public render() {
    const pages = [
      ...HOME_PAGE,
      ...COMMUNITY_PAGES,
      ...COMMUNITY_PAGES_MORE,
      ...COMMUNITY_PAGES_PROFILE,
      ...DEBUG_PAGES,
    ]
    // we are rendering different pages and navigation dependent on whether the user has navigated directly to view the
    // entire site, or just one page of it via subdomains. This is so we can effectively integrate just parts of this
    // platform into other sites. The first case is direct nav
    return !this.state.singlePageMode ? (
      <div>
        {SITE !== 'production' ? <DevTools /> : null}
        <DevNotice />
        <BrowserRouter>
          {/* on page change scroll to top */}
          <ScrollToTop>
            <div
              style={{
                minHeight: '100vh',
                display: 'flex',
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
                        {page.component}
                      </React.Fragment>
                    )}
                  />
                ))}
                <Route component={NotFoundPage} />
              </Switch>
            </div>
          </ScrollToTop>
        </BrowserRouter>
      </div>
    ) : (
      // case display just a single component if viewing on subdomain
      <div>
        <BrowserRouter>
          <Switch>
            {/* <Route component={this.state.displayPageComponent} /> */}
            <Route
              path="/how-to"
              render={() => <this.state.displayPageComponent nonav={true} />}
            />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }

  // identify the current url subdomain, if it matches one of the designated subdomains then we only want
  // to render that component isolated
  private getDisplayState() {
    const availableSubdomains = ['documentation', 'map']
    const subdomain = window.location.hostname.split('.')[0]
    const showSinglePage = availableSubdomains.indexOf(subdomain) > -1
    const state: IState = {
      singlePageMode: showSinglePage,
      displayPageComponent: showSinglePage
        ? this.getSubdomainComponent(subdomain)
        : null,
    }
    return state
  }

  // once we know we are only rendering a single page, identify the page component to render depending on subdomain
  // *** NOTE - if you want to add more subdomains to render specific components also include in src/config.ts
  // to ensure production site is rendered and not development
  private getSubdomainComponent(subdomain: string) {
    switch (subdomain) {
      case 'documentation':
        return HowtoPage
      default:
        return NotFoundPage
    }
  }
}
