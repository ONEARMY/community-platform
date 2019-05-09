import * as React from 'react'
import { observer, inject } from 'mobx-react'

import PageContainer from 'src/components/Layout/PageContainer'
import FilterBar from 'src/pages/common/FilterBar/FilterBar'

import { withRouter } from 'react-router'
import { IStores } from 'src/stores'
import { DiscussionsStore } from 'src/stores/Discussions/discussions.store'
import { computed } from 'mobx'
import { PostList2 } from './List'

interface IProps {
  discussionsStore: DiscussionsStore
}
interface IState {
  orderBy: string | null
}

@inject((allStores: IStores) => ({
  discussionsStore: allStores.discussionsStore,
}))
// Then we can use the observer component decorator to automatically tracks observables and re-renders on change
@observer
class PostListClass extends React.Component<IProps, IState> {
  @computed get discussions() {
    return this.props.discussionsStore.allDiscussions
  }
  constructor(props: any) {
    super(props)
    this.state = {
      orderBy: null,
    }
  }

  public updateResultsList() {
    console.log('Change on filters')
  }

  public render() {
    return (
      <PageContainer>
        <FilterBar
          section={'discussions'}
          onChange={() => this.updateResultsList()}
        />
        <PostList2 posts={this.discussions} />
      </PageContainer>
    )
  }
}
export const PostList = withRouter(PostListClass as any)
