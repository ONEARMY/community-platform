import * as React from 'react'
import differenceInDays from 'date-fns/difference_in_days'
import {
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
import { Avatar } from 'src/components/Avatar'
import { IDiscussionPost } from 'src/models/discussions.models'
import { Link } from 'react-router-dom'

interface IProps {
  post: IDiscussionPost
}
interface IState {
  isLucky: boolean
}

export default class ListRow extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props)
  }

  public durationSincePosted(postDate: Date) {
    const daysSince: number = differenceInDays(new Date(), new Date(postDate))
    return `${daysSince} days`
  }

  public render() {
    const { post } = this.props
    return (
      <>
        <Link to={`/discussions/${post.slug}`}>
          <Post>
            <Avatar userName={post._createdBy} />
            <TitleAndTagsContaier>
              <Title
              // *** TODO - Build and link to analytics store method
              // onClick={() => this.postViewReactGA(post._id)}
              >
                {post.title}
              </Title>
              <TagsContainer>
                {post.tags &&
                  post.tags.map((tag, j) => <Tag key={j}>{tag}</Tag>)}
              </TagsContainer>
            </TitleAndTagsContaier>
            <InteractionNb>
              {post.type === 'discussionQuestion'
                ? post._commentCount + ' comments'
                : post._commentCount + ' answers'}
            </InteractionNb>
            <UsefullCount>{post._usefulCount}</UsefullCount>
            {/* *** TODO - Build and pull data from analytics */}
            {/*<Count isViewCounter={true} firebaseHost={FIREBASE_CONFIG.databaseURL}*/}
            {/*firebaseResourceId={'post-' + post._id + '-viewCount'}/>*/}
            <ViewCount>{post._viewCount}</ViewCount>
            <PostDate>
              {this.durationSincePosted(new Date(post._created))}
            </PostDate>
            {post.type === 'discussionQuestion' ? <DiscussIcon /> : <QaIcon />}
          </Post>
        </Link>
      </>
    )
  }
}
