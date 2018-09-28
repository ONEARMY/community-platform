import * as React from "react";
import { Route, Switch } from "react-router-dom";

import Doc from "./Docs/index";

class Routes extends React.Component {
  public shouldComponentUpdate() {
    // Without this the app won't update on route changes, we've tried using
    // `withRouter`, but it caused the app to remount on every route change.
    return true;
  }

  public render() {
    return (
      <Switch>
        <Route path="/doc" component={Doc} />
      </Switch>
    );
  }
}

export default Routes;
