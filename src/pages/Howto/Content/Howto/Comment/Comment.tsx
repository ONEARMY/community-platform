import React from 'react'
import { Button } from 'src/components/Button'
import Flex from 'src/components/Flex'
import Heading from 'src/components/Heading'
import { IComment } from 'src/models/howto.models'
import { Text } from 'src/components/Text/index'

interface IProps {
  comment: IComment
  editable: boolean
  onEdit: (id: string, text: string) => void
  onDelete: (id: string) => void
}

const Comment: React.FC<IProps> = ({ comment, editable, onEdit, onDelete }) => {
  return (
    <Flex flexDirection="column">
      <Heading>{comment.creatorName}</Heading>
      <Text>{comment.text}</Text>
      <Text>{comment._created.slice(0, 10)}</Text>
      {editable && (
        <>
          <Button onClick={() => onEdit(comment._id, comment.text + ' edited')}>
            edit
          </Button>
          <Button backgroundColor="red" onClick={() => onDelete(comment._id)}>
            Delete
          </Button>
        </>
      )}
    </Flex>
  )
}

export default Comment
