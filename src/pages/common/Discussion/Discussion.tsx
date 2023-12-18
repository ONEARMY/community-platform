import { Card, Heading } from 'theme-ui'

import { setCommentsHeading } from 'src/utils/presenters'

import { DiscussionAdd } from './DiscussionAdd'
import { DiscussionItem } from './DiscussionItem'

import type { CommentableModel, UserComment } from 'src/models'
import type { CommentableStore } from 'src/stores'

interface IProps {
  comments: UserComment[]
  parent: CommentableModel
  store: CommentableStore
}

export const Discussion = ({ comments, parent, store }: IProps) => {
  const heading = setCommentsHeading(comments.length)

  return (
    <Card
    sx={{
      gap: 2,
      padding: 3,
    }}>
      <Heading as="h3">{heading}</Heading>
      {comments.map((comment) => (
        <DiscussionItem
          comment={comment}
          key={comment._id}
          parent={parent}
          store={store}
        />
      ))}

      <DiscussionAdd buttonLabel="Add comment" parent={parent} store={store} />
    </Card>
  )
}
