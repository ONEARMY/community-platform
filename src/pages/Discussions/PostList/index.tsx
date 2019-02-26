import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { DISCUSSION_QUESTION_MOCKS } from 'src/mocks/discussions.mock'

import MaxWidth from 'src/components/Layout/MaxWidth.js'
import Margin from 'src/components/Layout/Margin.js'
import FilterBar from 'src/pages/common/FilterBar/FilterBar'

import { Content, Main, ListHeader, PostCount } from './elements'

import { withRouter } from 'react-router'
import { IStores } from 'src/stores'
import { DiscussionsStore } from 'src/stores/Discussions/discussions.store'
import { computed } from 'mobx'
import { PostList2 } from './List'

import { Box, Flex } from 'rebass'

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
      <MaxWidth>
        <Box my={1.5}>
          <Content>
            <FilterBar
              section={'discussions'}
              onChange={() => this.updateResultsList()}
            />
            <Box m={1.5}>
              <ListHeader>
                <PostCount>
                  Showing {DISCUSSION_QUESTION_MOCKS.length} posts
                </PostCount>
              </ListHeader>
              <Flex alignItems="flex-start">
                <PostList2 posts={this.discussions} />
              </Flex>
            </Box>
          </Content>
        </Box>
      </MaxWidth>
    )
  }
}
export const PostList = withRouter(PostListClass as any)
