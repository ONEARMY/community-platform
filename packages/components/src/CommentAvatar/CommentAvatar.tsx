import { Avatar, Image } from 'theme-ui'

import defaultBaloonUrl from '../../assets/images/author.svg'
import defaultProfileImage from '../../assets/images/default_member.svg'

type CommentAvatarProps = {
  displayName?: string
  isCommentAuthor?: boolean
  photo?: string | null
}

export const CommentAvatar = (props: CommentAvatarProps) => {
  const { displayName, isCommentAuthor = false, photo } = props

  const alt = displayName
    ? `Avatar of ${displayName}`
    : 'Avatar of comment author'

  return (
    <>
      {isCommentAuthor && (
        <Image
          src={defaultBaloonUrl}
          ml={1}
          mt={-10}
          sx={{
            marginLeft: ['-10px', '5px'],
            marginTop: ['-35px', '-35px'],
            width: ['85px', '85px'],
            zIndex: 1,
            position: 'absolute',
            pointerEvents: 'none',
            maxWidth: 'none',
          }}
        />
      )}
      <Avatar
        data-cy="commentAvatarImage"
        src={photo ?? defaultProfileImage}
        sx={{
          objectFit: 'cover',
          width: ['30px', '50px'],
          height: ['30px', '50px'],
          ...(isCommentAuthor && {
            zIndex: 2,
            position: 'relative',
          }),
        }}
        alt={alt}
        loading="lazy"
      />
    </>
  )
}
