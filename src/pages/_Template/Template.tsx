/*************************************************************************************  
This is an example page viewable at /template
For more info on pages see the Q & A at the bottom
**************************************************************************************/

import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { TemplateStore } from 'src/stores/_Template/template.store'
import { IStores } from 'src/stores'
import { ExampleNumberDisplay } from './Content/ExampleNumberDisplay/ExampleNumberDisplay'
import MainLayout from '../common/MainLayout'

// define the page properties with typing information for fields
// properties are things that will have been passed down from parent component
// so for pages are likely to not contain much except perhaps global store objects
interface IProps {
  templateStore: TemplateStore
}

// define the component state with typing information for fields
// as most higher-level operations are handled by mobx global state it is unlikely
// that you will need much in a page's local state
interface IState {
  pageName?: string
}

/*************************************************************************************  
If you want to bind to the global state store use the following injector to populate
store objects to component props. You can then use the @observer decorator to 
automatically track observables and re-render on change
*************************************************************************************/
@inject((allStores: IStores) => ({
  templateStore: allStores.templateStore,
}))
@observer
export class TemplatePage extends React.Component<IProps, IState> {
  /***********************************************************************
  Constructor methods are used to set intial state. If not using state 
  or binding methods this can be ommitted
  ************************************************************************/

  constructor(props: IProps) {
    super(props)
    // initial state can be set here, update later via setState method
    this.state = { pageName: 'Demo Page Template' }
  }

  /***********************************************************************
  Pages are unlikely to require many functions, however you may wish to bind
  to lifecycle events like component mounting
  ************************************************************************/

  public componentDidMount() {
    // call methods you want to fire once when component mounted
    this.props.templateStore.generateRandomNumbers()
  }

  // here is where the main render method goes. store props can be bound here
  // page content is wrapped in the MainLayout to apply consistent header/navbar
  public render() {
    return (
      <MainLayout>
        <div id="TemplatePage">
          <div>This is a template page</div>
          <ExampleNumberDisplay
            number={this.props.templateStore.randomNumber}
          />
        </div>
      </MainLayout>
    )
  }
}

/*************************************************************************************  
General Q & A

Q. What are pages?
These are entry points for different urls, and contain minimal layout and data binding.
They are really only placeholders for the rest of page content, which should ideally sit
across a combination of page-specific content (in a content subfolder), common content and 
general building block components.

Q. How can I get my page to render?
The page needs to be imported into the pages/index.tsx file and attached to the router
for your desired path

Q. What are the interfaces and : I can see?
This is the core of typescript, a system that defines the exact shape data should be in.
Interfaces are defined to modal the shape of data, and then applied using : for parameters
or < > for components. You can also use 'as' to tell typescript the shape of data received
(e.g. const myData:IUserData = this.getData() as IUserData)

If you want to know more about defining interfaces
(e.g. what '?' means or how to specify advanced data types) refer to 
https://www.typescriptlang.org/docs/handbook/basic-types.html

Q. What's up with @inject, @observer etc.
These are decorators that wrap otherwise longer lines of javascript code required to
handle connection to the mobx global state. 

Q. What is global state?
We have data that is persisted across the app in global 'stores' (see stores folder)
which can be read and updated throughout the app. Any data that might be used by
different sections/components should be passed through the global store to avoid lots
of messy data data sharing methods

Q. How should I be naming things?
- Page Component: PascalCase (Capital letter for all words) with 'Page' suffix
- Functions: camelCase
- Interfaces: PascalCase, starting with an 'I' to denote interface



Anything else you want to know? Add it to a git issue and so we can make the 
template even more useful

**************************************************************************************/
