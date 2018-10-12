import * as React from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Tutorial from "./Tutorial/Tutorial";
import CreateTutorial from "./CreateTutorial/CreateTutorial";
import TutorialList from "./TutorialList/TutorialList";

const Content = () => (
  <Switch>
    <Route path="/docs/list" component={TutorialList} />
    <Route path="/docs/create" component={CreateTutorial} />
    <Route path="/docs/:slug" component={Tutorial} />

    <Redirect to="/docs/list" />
  </Switch>
);

export default withRouter(Content);
