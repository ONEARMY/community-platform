import * as React from 'react'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom'
import { Howto } from './Howto/Howto'
import { CreateHowto } from './CreateHowto/CreateHowto'
import { HowtoList } from './HowtoList/HowtoList'
import { IHowto } from 'src/models/models'
import { observer } from 'mobx-react'
/*
  This component handles routing for tutorial sub-pages and components. More info on the router can be found here:
  https://reacttraining.com/react-router/web/guides/basic-components

  To add stronger typing we have a few different props which will need to be considered by child component.
  The first are additional parameters which the router might inject. e.g. 'slug' is populated when route matches /docs/:slug
  This can be declared as 
  
  interface IRouterCustomParams{slug:string}

  The overall props are then a combination of the injected React router props (RouteCopmonentProps) with custom param 
  and any additional props manually specified in the component. This can be declared as 
  
  interface IProps extends RouteComponentProps<IRouterCustomParams>{
    childProp1: type 
  }
*/

interface IContentProps {
  allHowtos: IHowto[]
  activeHowto?: IHowto
}

// if using the @withRouter decorator for a named export you might have to force typescript
// to register the render output 'as React.ReactNode' as seen below
@withRouter
@observer
export default class TutorialContent extends React.Component<any, any> {
  constructor(props: IContentProps) {
    super(props)
  }
  public render = () => {
    const allHowtos = this.props.allHowtos
    return (
      <Switch>
        <Route
          path="/how-to/list"
          render={props => <HowtoList {...props} allHowtos={allHowtos} />}
        />
        <Route path="/how-to/create" component={CreateHowto} />
        <Route path="/how-to/:slug" render={props => <Howto {...props} />} />

        <Redirect to="/how-to/list" />
      </Switch>
    ) as React.ReactNode
  }
}
