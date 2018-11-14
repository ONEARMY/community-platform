import * as React from 'react'
import { inject, observer } from 'mobx-react'

import MainLayout from '../common/MainLayout/'
import TutorialContent from './Content/Tutorial.content'
import { DocStore } from 'src/stores/Docs/docs.store'

interface IProps {
  docStore: DocStore
}

// We're connecting to the 'docStore' state object and will pass down through child compoennts
// First we use the @inject decorator to bind to the docStore state
@inject('docStore')
// Then we can use the observer component decorator to automatically tracks observables and re-renders on change
@observer
export class DocsPage extends React.Component<IProps, any> {
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
    const { activeTutorial, allTutorials } = this.props.docStore
    return (
      <MainLayout>
        <TutorialContent
          allTutorials={this.props.docStore.allTutorials}
          activeTutorial={this.props.docStore.activeTutorial}
        />
      </MainLayout>
    )
  }
}
