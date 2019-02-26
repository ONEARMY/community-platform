import { Avatar } from '@material-ui/core'
import * as React from 'react'
import { postViewReactGA, durationSincePosted } from '../common/'
import {
  InteractionNb,
  Title,
  UsefullCount,
  TitleAndTagsContaier,
  TagsContainer,
  Tag,
  DiscussIcon,
  QaIcon,
  PostDate,
} from './ListRow/elements'

import { EPostFields } from '../common'
import { Link } from 'react-router-dom'

const UserCell = ({ value, ...restProps }): any => {
  const { row } = restProps
  return (
    <Avatar style={{ margin: '0 auto' }} src={row._createdBy} alt="avatar" />
  )
}

const TitleCell = ({ value, ...restProps }): any => {
  const { row } = restProps
  return (
    <TitleAndTagsContaier>
      <Link to={`/discussions/${row.slug}`}>
        <Title
          href={'/discussions/post/' + row._id}
          target="_blank"
          onClick={() => postViewReactGA(row._id)}
        >
          {row.title}
        </Title>
        <TagsContainer>
          {row.tags && row.tags.map((tag, j) => <Tag key={j}>{tag}</Tag>)}
        </TagsContainer>
      </Link>
    </TitleAndTagsContaier>
  )
}

const CommentsCell = ({ value, ...restProps }): any => {
  const { row } = restProps
  return (
    <InteractionNb>
      {row.type === 'discussionQuestion'
        ? row._commentCount + ' comments'
        : row._commentCount + ' answers'}
    </InteractionNb>
  )
}

const UseCell = ({ value, ...restProps }): any => {
  const { row } = restProps
  return <UsefullCount>{row._usefullCount}</UsefullCount>
}

const IconCell = ({ value, ...restProps }): any => {
  const { row } = restProps
  return row.type === 'discussionQuestion' ? <DiscussIcon /> : <QaIcon />
}

const DateCell = ({ value, ...restProps }): any => {
  const { row } = restProps
  return <PostDate>{durationSincePosted(row._created.toDate())}</PostDate>
}

export const render = (field, props) => {
  switch (field) {
    case EPostFields.Avatar:
      return <UserCell {...props} />
    case EPostFields.TITLE:
      return <TitleCell {...props} />
    case EPostFields.DATE:
      return <DateCell {...props} />
    case EPostFields.COMMENTS:
      return <CommentsCell {...props} />
    case EPostFields.UCOUNT:
      return <UseCell {...props} />
    case 'icon':
      return <IconCell {...props} />
    default:
      return <div>{props.value}</div>
  }
}
