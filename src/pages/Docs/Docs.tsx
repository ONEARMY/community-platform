import * as React from 'react'
import { inject, observer } from 'mobx-react'

import MainLayout from '../common/MainLayout/'
import Content from './Content'
import { DocStore } from 'src/stores/Docs/docs.store'

interface IDocsPageProps {
  docStore: DocStore
}

// We're connecting to the 'docStore' state object and will pass down through child compoennts
// First we use the @inject decorator to bind to the docStore state
@inject('docStore')
// Then we can use the observer component decorator to automatically tracks observables and re-renders on change
@observer
class DocsPage extends React.Component<IDocsPageProps, any> {
  constructor(props: any) {
    super(props)
  }

  public componentDidMount() {
    // call getDocList to trigger update of database doc data when the page is loaded
    this.props.docStore.getDocList()
  }

  public render() {
    return (
      <MainLayout>
        {this.props.docStore.docs ? (
          <Content allTutorials={this.props.docStore.docs} />
        ) : null}
      </MainLayout>
    )
  }
}

export default DocsPage
