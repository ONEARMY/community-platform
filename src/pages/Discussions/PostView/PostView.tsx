import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { IStores } from 'src/stores'
import { computed } from 'mobx'
import { DiscussionsStore } from 'src/stores/Discussions/discussions.store'
import { withRouter, RouteComponentProps } from 'react-router'

interface IProps extends RouteComponentProps {
  discussionsStore: DiscussionsStore
}

@inject((allStores: IStores) => ({
  discussionsStore: allStores.discussionsStore,
}))
// Then we can use the observer component decorator to automatically tracks observables and re-renders on change
@observer
class PostViewClass extends React.Component<IProps> {
  @computed get post() {
    return this.props.discussionsStore.activeDiscussion
  }
  constructor(props: any) {
    super(props)
  }
  componentDidMount() {
    const params = this.props.match.params as any
    this.props.discussionsStore.setActiveDiscussion(params.slug)
  }

  public updateResultsList() {
    console.log('Change on filters')
  }

  public render() {
    if (this.post) {
      const p = this.post
      return (
        <>
          <div>{p.title}</div>
          <div dangerouslySetInnerHTML={{ __html: p.content }} />
        </>
      )
    } else {
      return null
    }
  }
}
export const PostView = withRouter(PostViewClass as any)
