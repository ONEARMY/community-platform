import * as React from 'react'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import Tutorial from './Tutorial/Tutorial'
import { CreateTutorial } from './CreateTutorial/CreateTutorial'
import TutorialList from './TutorialList/TutorialList'
import { ITutorial } from 'src/models/models'

// declare interface so we know what shape the data in the rest of the component will look like
interface IProps {
  allTutorials: ITutorial[]
}

class Content extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
  }
  public render() {
    const allTutorials = this.props.allTutorials
    return (
      <Switch>
        <Route
          path="/docs/list"
          render={props => (
            <TutorialList {...props} allTutorials={allTutorials} />
          )}
        />
        <Route path="/docs/create" component={CreateTutorial} />
        <Route
          path="/docs/:slug"
          render={props => <Tutorial {...props} allTutorials={allTutorials} />}
        />

        <Redirect to="/docs/list" />
      </Switch>
    )
  }
}

export default withRouter(Content)
