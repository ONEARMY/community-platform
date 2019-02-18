import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { DISCUSSIONS_MOCK } from 'src/mocks/discussions.mock'

import MaxWidth from 'src/components/Layout/MaxWidth.js'
import Margin from 'src/components/Layout/Margin.js'
import FilterBar from 'src/pages/common/FilterBar/FilterBar'
import ListRow from 'src/pages/Discussions/ListRow/ListRow'

import { Content, Main, ListHeader, PostCount, List, OrderBy } from './elements'

import { withRouter } from 'react-router'
import { DiscussionStore } from '../../stores/Discussions/discussions.store'
import { IStores } from '../../stores'

interface IProps {
  discussionStore: DiscussionStore
}

@inject((allStores: IStores) => ({
  discussionStore: allStores.discussionStore,
}))
@observer
class DiscussionsPageClass extends React.Component<IProps, any> {
  constructor(props: any) {
    super(props)

    // initial state
    this.state = {
      posts: [],
    }
  }

  public async componentDidMount() {
    // load mocks
    console.log('mocks:', DISCUSSIONS_MOCK)
    await this.props.discussionStore.getDiscussionsList()
    this.setState({posts: this.props.discussionStore.allDiscussions})
  }

  public orderListBy(orderType: string) {
    let sortedList = []
    switch (orderType) {
      case 'repliesCount':
        sortedList = this.state.posts.sort((a, b) => {
          return b.commentCount - a.commentCount
        })
        this.setState({ posts: sortedList })
        break
      case 'usefulCount':
        sortedList = this.state.posts.sort((a, b) => {
          return b.usefullCount - a.usefullCount
        })
        this.setState({ posts: sortedList })
        break
      case 'viewsCount':
        sortedList = this.state.posts.sort((a, b) => {
          return b.viewCount - a.viewCount
        })
        this.setState({ posts: sortedList })
        break
      case 'date':
        // TODO : order by date
        break
    }
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
              section={'discussion'}
              onChange={() => this.updateResultsList()}
            />
            <Margin vertical={1.5} horizontal={1.5}>
              <ListHeader>
                <PostCount>Showing {this.state.posts.length} posts</PostCount>
                <OrderBy onClick={() => this.orderListBy('repliesCount')}>
                  Replies
                </OrderBy>
                <OrderBy onClick={() => this.orderListBy('usefulCount')}>
                  Useful
                </OrderBy>
                <OrderBy onClick={() => this.orderListBy('viewsCount')}>
                  Views
                </OrderBy>
                <OrderBy onClick={() => this.orderListBy('date')}>
                  Freshness
                </OrderBy>
              </ListHeader>
              <Main alignItems="flex-start">
                <List>
                  {this.state.posts.map((post, i) => (
                    <ListRow post={post} key={i} />
                  ))}
                </List>
              </Main>
            </Margin>
          </Content>
        </Margin>
      </MaxWidth>
    )
  }
}
export const DiscussionsPage = withRouter(DiscussionsPageClass as any)
