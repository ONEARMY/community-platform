import * as React from 'react'
import moment from 'moment'

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

export interface IPostInfos {
  _id: string
  index: number
  avatar: string
  tags: string[]
  date: string
  postTitle: string
  commentCount: number
  viewCount: number
  usefullCount: number
  postType: string
}

interface IProps {
  post: IPostInfos
}
interface IState {
  isLucky: boolean
}
export default class ListRow extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
  }

  public durationSincePosted(postDate: string) {
    // TODO : return the freshness, with minutes/hours/days etc
    const formatedPostDate = moment(postDate)
    const now: any = moment()
    const duration = moment.duration(now.diff(formatedPostDate))
    return Math.round(duration.as('years'))
  }

  public render() {
    const { post } = this.props
    return (
      <Post>
        <Avatar src={post.avatar} alt="avatar" />
        <TitleAndTagsContaier>
          <Title href={'/discussions/post/' + post._id}>{post.postTitle}</Title>
          <TagsContainer>
            {post.tags.map((tag, j) => (
              <Tag key={j}>{tag}</Tag>
            ))}
          </TagsContainer>
        </TitleAndTagsContaier>
        <InteractionNb>
          {post.postType === 'discussion'
            ? post.commentCount + ' comments'
            : post.commentCount + ' answers'}
        </InteractionNb>
        <UsefullCount>{post.usefullCount}</UsefullCount>
        <ViewCount>{post.viewCount}</ViewCount>
        <PostDate>{this.durationSincePosted(post.date)} years</PostDate>
        {post.postType === 'discussion' ? <DiscussIcon /> : <QaIcon />}
      </Post>
    )
  }
}
