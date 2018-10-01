import * as React from "react";

import Docs from "./Docs/index";
import { Switch, Route } from "react-router";

class Routes extends React.Component {
  public shouldComponentUpdate() {
    // Without this the app won't update on route changes, we've tried using
    // `withRouter`, but it caused the app to remount on every route change.
    return true;
  }

  public render() {
    return (
      <Switch>
        <Route path="/docs" component={Docs} />

        {/* TODO add notFound page */}
        {/* <Route component={NotFound} /> */}
      </Switch>
    );
  }
}

export default Routes;
