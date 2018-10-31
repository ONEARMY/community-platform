import * as React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";

import Docs from "./Docs/Docs";
import { HomePage } from "./Home/Home";
import { NotFoundPage } from "./NotFound/NotFound";
import ScrollToTop from "./../components/ScrollToTop/ScrollToTop";

export class Routes extends React.Component {
  public shouldComponentUpdate() {
    // Without this the app won't update on route changes, we've tried using
    // `withRouter`, but it caused the app to remount on every route change.
    return true;
  }

  public render() {
    return (
      <BrowserRouter>
        <ScrollToTop>
            <Switch>
              <Route path="/docs" component={Docs} />
              <Route exact path="/" component={HomePage} />
              <Route component={NotFoundPage} />
            </Switch>
        </ScrollToTop>
      </BrowserRouter>
    );
  }
  // more examples of router config and behaviours can be found at:
  // https://reacttraining.com/react-router/web/example/basic
}
