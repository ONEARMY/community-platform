import { useState } from 'react'
import { Box } from 'theme-ui'

import { CreateComment } from '..'

export interface Props {
  commentId: string
  isLoggedIn: boolean
  maxLength: number
  onSubmit: (_id: string, reply: string) => Promise<void>
}

export const CreateReply = (props: Props) => {
  const [reply, setReply] = useState<string>('')
  const { commentId, isLoggedIn, maxLength, onSubmit } = props

  const handleSubmit = async () => {
    await onSubmit(commentId, reply)
    setReply('')
  }

  return (
    <Box
      sx={{
        background: 'softblue',
        borderRadius: 2,
        marginBottom: 3,
        padding: 3,
      }}
    >
      <CreateComment
        maxLength={maxLength}
        comment={reply}
        onChange={(text) => setReply(text)}
        onSubmit={handleSubmit}
        isLoggedIn={isLoggedIn}
        buttonLabel="Leave a reply"
      />
    </Box>
  )
}
