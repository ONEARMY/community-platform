import * as React from "react";

import Docs from "./Docs/index";
import { HomePage } from "./Home";
import { NotFoundPage } from "./NotFound";
import { Switch, Route } from "react-router-dom";

export class Routes extends React.Component {
  public shouldComponentUpdate() {
    // Without this the app won't update on route changes, we've tried using
    // `withRouter`, but it caused the app to remount on every route change.
    return true;
  }

  public render() {
    return (
      <Switch>
        <Route path="/docs" component={Docs} />
        <Route exact path="/" component={HomePage} />
        {/* TODO add notFound page */}
        <Route component={NotFoundPage} />
      </Switch>
    );
  }
  // more examples of router config and behaviours can be found at:
  // https://reacttraining.com/react-router/web/example/basic
}
