import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { DISCUSSION_QUESTION_MOCKS } from 'src/mocks/discussions.mock'

import MaxWidth from 'src/components/Layout/MaxWidth.js'
import Margin from 'src/components/Layout/Margin.js'
import FilterBar from 'src/pages/common/FilterBar/FilterBar'
import ListRow from 'src/pages/Discussions/PostList/ListRow'

import { Content, Main, ListHeader, PostCount, List, OrderBy } from './elements'

import { withRouter } from 'react-router'
import { IStores } from 'src/stores'
import { DiscussionsStore } from 'src/stores/Discussions/discussions.store'
import { computed } from 'mobx'
import { IDiscussionPost } from 'src/models/discussions.models'

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

  public orderList(list: IDiscussionPost[]) {
    // mobx observable must first be sliced in order to sort properly
    // TODO - Replace repeated code with filter util (WiP) - see discussion in #215
    list = list.slice()
    switch (this.state.orderBy) {
      case 'repliesCount':
        list.sort((a, b) => {
          return b._commentCount - a._commentCount
        })
        break
      case 'usefulCount':
        list.sort((a, b) => {
          return b._usefullCount - a._usefullCount
        })
        break
      case 'viewsCount':
        list.sort((a, b) => {
          return b._viewCount - a._viewCount
        })
        break
      case 'date':
        // TODO : order by date
        break
      default:
        break
    }
    return list
  }

  public updateResultsList() {
    console.log('Change on filters')
  }

  public render() {
    return (
      <MaxWidth>
        <Margin vertical={1.5}>
          <Content>
            <FilterBar
              section={'discussions'}
              onChange={() => this.updateResultsList()}
            />
            <Margin vertical={1.5} horizontal={1.5}>
              <ListHeader>
                <PostCount>
                  Showing {DISCUSSION_QUESTION_MOCKS.length} posts
                </PostCount>
                <OrderBy
                  onClick={() => this.setState({ orderBy: 'repliesCount' })}
                >
                  Replies
                </OrderBy>
                <OrderBy
                  onClick={() => this.setState({ orderBy: 'usefulCount' })}
                >
                  Useful
                </OrderBy>
                <OrderBy
                  onClick={() => this.setState({ orderBy: 'viewsCount' })}
                >
                  Views
                </OrderBy>
                <OrderBy onClick={() => this.setState({ orderBy: 'date' })}>
                  Freshness
                </OrderBy>
              </ListHeader>
              <Main alignItems="flex-start">
                <List>
                  {this.orderList(this.discussions).map((post, i) =>
                    post._id ? <ListRow post={post} key={i} /> : null,
                  )}
                </List>
              </Main>
            </Margin>
          </Content>
        </Margin>
      </MaxWidth>
    )
  }
}
export const PostList = withRouter(PostListClass as any)
