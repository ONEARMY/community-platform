import * as React from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Tutorial from "./Tutorial/index";
import TutorialList from "./TutorialList/index";

const Content = () => (
  <Switch>
    <Route path="/docs/list" component={TutorialList} />
    <Route path="/docs/:slug" component={Tutorial} />

    <Redirect to="/docs/list" />
  </Switch>
);

export default withRouter(Content);
