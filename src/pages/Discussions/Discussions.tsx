import * as React from 'react'
import moment from 'moment'
import { inject, observer } from 'mobx-react'
import { DISCUSSIONS_MOCK } from 'src/mocks/discussions.mock'

import MaxWidth from 'src/components/Layout/MaxWidth.js'
import Margin from 'src/components/Layout/Margin.js'
import FilterBar from 'src/pages/common/FilterBar/FilterBar'

import {
  Content,
  Main,
  Avatar,
  Post,
  List,
  Title,
  TitleAndTagsContaier,
  TagsContainer,
  Tag,
  InteractionNb,
  UsefullCount,
  ViewCount,
  PostDate,
  DiscussIcon,
  QaIcon,
} from './elements'

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

  public durationSincePosted(postDate: string) {
    // TODO : return the freshness, with minutes/hours/days etc
    const formatedPostDate = moment(postDate)
    const now: any = moment()
    const duration = moment.duration(now.diff(formatedPostDate))
    return Math.round(duration.as('years'))
  }

  public render() {
    return (
      <MaxWidth>
        <Margin vertical={1.5}>
          <Content>
            <FilterBar />
            <Margin vertical={1.5}>
              <Main alignItems="flex-start">
                <List>
                  {DISCUSSIONS_MOCK.map((post, i) => (
                    <Post key={i}>
                      <Avatar src={post.avatar} alt="avatar" />
                      <TitleAndTagsContaier>
                        <Title href={'/discussions/post/' + post._id}>
                          {post.postTitle}
                        </Title>
                        <TagsContainer>
                          {post.tags.map((tag, j) => (
                            <Tag key={j}>{tag}</Tag>
                          ))}
                        </TagsContainer>
                      </TitleAndTagsContaier>
                      <InteractionNb>
                        {post.postType === 'discussion'
                          ? post.commentNumber + ' comments'
                          : post.commentNumber + ' answers'}
                      </InteractionNb>
                      <UsefullCount>{post.usefullCount}</UsefullCount>
                      <ViewCount>{post.viewCount}</ViewCount>
                      <PostDate>
                        {this.durationSincePosted(post.date)} years
                      </PostDate>
                      {post.postType === 'discussion' ? (
                        <DiscussIcon />
                      ) : (
                        <QaIcon />
                      )}
                    </Post>
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
export const DiscussionsPage = withRouter(DiscussionsPageClass)
