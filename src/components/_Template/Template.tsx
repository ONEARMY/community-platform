import * as React from 'react'

interface IProps {
  prop: string
}

export class TemplateComponent extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
  }

  public componentDidUpdate(prevProps: IProps) {
    // component updated
  }

  public render() {
    return <div>Template Component</div>
  }
}

/*************************************************************************************  
General Q & A

Q. What are these components for and when should I use them?
src/components are core building blocks for use throughout the app. It is unlikely that many will
be created as we are using the material-ui library for most (e.g. buttons, cards etc.)
You can see the full list of available components at: https://material-ui.com/demos/app-bar/

They should ideally be statesles and could equally be written as functional components as 
well as classes. Classes are required if you intend to bind to lifecycle events.


Anything else you want to know? Add it to a git issue and so we can make the 
template even more useful

**************************************************************************************/
