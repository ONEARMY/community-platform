import * as React from 'react'
import differenceInDays from 'date-fns/difference_in_days'

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
import { IDiscussionPost } from 'src/models/discussions.models'
import { Link, RouteComponentProps } from 'react-router-dom'
import { computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import { IStores } from '../../../../stores'
import { DiscussionsStore } from '../../../../stores/Discussions/discussions.store'

interface IProps extends RouteComponentProps {
  discussionsStore: DiscussionsStore
}
interface IProps {
  post: IDiscussionPost
}
interface IState {
  isLucky: boolean
}

@inject((allStores: IStores) => ({
  discussionsStore: allStores.discussionsStore,
}))
@observer
export default class ListRow extends React.Component<IProps, IState> {
  // @computed get comments() {
  //   return this.props.discussionsStore.allDiscussionComments
  // }
  constructor(props: any) {
    super(props)
    this.state = { editorInput: '', isSaving: false }
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
            <Avatar src={post._createdBy} alt="avatar" />
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
              {this.durationSincePosted(post._created.toDate())}
            </PostDate>
            {post.type === 'discussionQuestion' ? <DiscussIcon /> : <QaIcon />}
          </Post>
        </Link>
      </>
    )
  }
}
