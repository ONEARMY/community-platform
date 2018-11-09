/* tslint:disable:no-eval */
import * as React from 'react'
import { Switch, Route, BrowserRouter } from 'react-router-dom'
import DevTools from 'mobx-react-devtools'

import Docs from './Docs/Docs'
import { HomePage } from './Home/Home'
import { NotFoundPage } from './NotFound/NotFound'
import { TemplatePage } from './_Template/Template'
import ScrollToTop from './../components/ScrollToTop/ScrollToTop'

interface IState {
  singlePageMode: boolean
  displayPageComponent?: any
}

export class Routes extends React.Component<any, IState> {
  constructor(props: any) {
    super(props)
    this.state = this.getDisplayState()
  }

  public render() {
    // we are rendering different pages and navigation dependent on whether the user has navigated directly to view the
    // entire site, or just one page of it via subdomains. This is so we can effectively integrate just parts of this
    // platform into other sites. The first case is direct nav
    return !this.state.singlePageMode ? (
      <div>
        <DevTools />
        <BrowserRouter>
          {/* on page change scroll to top */}
          <ScrollToTop>
            <Switch>
              <Route path="/docs" component={Docs} />
              <Route path="/template" component={TemplatePage} />
              <Route exact path="/" component={HomePage} />
              <Route component={NotFoundPage} />
              <Route component={Docs} />
            </Switch>
          </ScrollToTop>
        </BrowserRouter>
      </div>
    ) : (
      // case display just a single component if viewing on subdomain
      <div>
        <BrowserRouter>
          <Switch>
            <Route component={this.state.displayPageComponent} />
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
  // *** to ensure production site is rendered and not development
  private getSubdomainComponent(subdomain: string) {
    switch (subdomain) {
      case 'documentation':
        return Docs
      default:
        return NotFoundPage
    }
  }
}
