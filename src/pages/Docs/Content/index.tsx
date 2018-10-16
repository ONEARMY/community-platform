import * as React from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import Tutorial from "./Tutorial/Tutorial";
import CreateTutorial from "./CreateTutorial/CreateTutorial";
import TutorialList from "./TutorialList/TutorialList";

class Content extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }
  public render() {
    const { allTutorials } = this.props;

    return (
      <Switch>
        <Route
          path="/docs/list"
          render={props => (
            <TutorialList {...props} allTutorials={allTutorials} />
          )}
        />
        <Route path="/docs/create" component={CreateTutorial} />
        <Route path="/docs/:slug" component={Tutorial} />

        <Redirect to="/docs/list" />
      </Switch>
    );
  }
}

export default withRouter(Content);
