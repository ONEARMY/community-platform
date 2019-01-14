import * as React from 'react'
import { inject, observer } from 'mobx-react'
import logo from '../../assets/images/logo.png'

import MainLayout from '../common/MainLayout/'
import TutorialContent from './Content/Tutorial.content'
import { DocStore } from 'src/stores/Docs/docs.store'
import { withRouter } from 'react-router'

interface IProps {
  docStore: DocStore
  nonav: boolean
}

// We're connecting to the 'docStore' state object and will pass down through child compoennts
// First we use the @inject decorator to bind to the docStore state
@inject('docStore')
// Then we can use the observer component decorator to automatically tracks observables and re-renders on change
@observer
class DocsPageClass extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
  }

  public async componentDidMount() {
    // call getDocList to trigger update of database doc data when the page is loaded
    // this will be reflected in the props.docstore.docs object
    // it should automatically update components however for some reason failing to
    // so call force update after first update
    await this.props.docStore.getDocList()
    this.forceUpdate()
  }

  public render() {
    const { nonav } = this.props
    return (
      <div>
        {nonav && (
          <img
            src={logo}
            alt="precious plastic logo"
            style={{ display: 'block', margin: '0 auto', width: '200px' }}
          />
        )}
        <TutorialContent
          allTutorials={this.props.docStore.allTutorials}
          activeTutorial={this.props.docStore.activeTutorial}
        />
      </div>
    )
  }
}
export const DocsPage = withRouter(DocsPageClass)
