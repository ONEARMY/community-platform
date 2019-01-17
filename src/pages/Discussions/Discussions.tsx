import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { DISCUSSIONS_MOCK } from 'src/mocks/discussions.mock'

import { DocStore } from 'src/stores/Docs/docs.store'
import { withRouter } from 'react-router'

interface IProps {
  docStore: DocStore
}

// We're connecting to the 'docStore' state object and will pass down through child compoennts
// First we use the @inject decorator to bind to the docStore state
@inject('docStore')
// Then we can use the observer component decorator to automatically tracks observables and re-renders on change
@observer
class DiscussionsPageClass extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)
  }

  public async componentDidMount() {
    // load mocks
    console.log('mocks:', DISCUSSIONS_MOCK)
  }

  public render() {
    return (
      <div>
        <span>DISCUSSION</span>
      </div>
    )
  }
}
export const DiscussionsPage = withRouter(DiscussionsPageClass)
