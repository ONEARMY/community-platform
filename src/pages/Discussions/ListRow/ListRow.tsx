import * as React from 'react'
import differenceInDays from 'date-fns/difference_in_days'
import ReactGA from 'react-ga'

import {
  Avatar,
  Post,
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
import { GOOGLE_ANALYTICS_CONFIG } from '../../../config/config'
import { IDiscussionQuestion } from 'src/models/discussions.models'

interface IProps {
  post: IDiscussionQuestion
}
interface IState {
  isLucky: boolean
}

export default class ListRow extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
  }

  public durationSincePosted(postDate: string) {
    const daysSince: number = differenceInDays(new Date(), postDate)

    return `${daysSince} days`
  }
  public postViewReactGA(postId: string) {
    ReactGA.initialize(GOOGLE_ANALYTICS_CONFIG.trackingCode, { debug: true })
    ReactGA.ga('send', 'pageview', '/discussions/post/' + postId)
  }

  public render() {
    const { post } = this.props
    return (
      <Post>
        <Avatar src={post.createdBy} alt="avatar" />
        <TitleAndTagsContaier>
          <Title
            href={'/discussions/post/' + post._id}
            target="_blank"
            onClick={() => this.postViewReactGA(post._id)}
          >
            {post.title}
          </Title>
          <TagsContainer>
            {post.tags && post.tags.map((tag, j) => <Tag key={j}>{tag}</Tag>)}
          </TagsContainer>
        </TitleAndTagsContaier>
        <InteractionNb>
          {post.type === 'discussionQuestion'
            ? post._commentCount + ' comments'
            : post._commentCount + ' answers'}
        </InteractionNb>
        <UsefullCount>{post._usefullCount}</UsefullCount>
        {/*<Count isViewCounter={true} firebaseHost={FIREBASE_CONFIG.databaseURL}*/}
        {/*firebaseResourceId={'post-' + post._id + '-viewCount'}/>*/}
        <ViewCount>{post._viewCount}</ViewCount>
        <PostDate>
          {this.durationSincePosted(post._created.toString())}
        </PostDate>
        {post.type === 'discussionQuestion' ? <DiscussIcon /> : <QaIcon />}
      </Post>
    )
  }
}
