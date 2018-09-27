import * as React from "react";
import { Route, Switch } from "react-router-dom";

// import Home from "../components/app/App";
import Doc from "../components/doc/Doc";

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
