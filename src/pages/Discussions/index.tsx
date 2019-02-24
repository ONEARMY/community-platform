import * as React from 'react'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { PostCreate } from './PostCreate'
import { PostList } from './PostList'
import { PostView } from './PostView/PostView'

@(withRouter as any)
export class DiscussionsPage extends React.Component<any> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public async componentDidMount() {
    console.log('component mount')
  }
  public render = () => {
    return (
      <Switch>
        <Route exact path="/discussions" render={props => <PostList />} />
        <Route exact path="/discussions/create" component={PostCreate} />
        <Route path="/discussions/:slug" component={PostView} />
      </Switch>
    ) as React.ReactNode
  }
}
