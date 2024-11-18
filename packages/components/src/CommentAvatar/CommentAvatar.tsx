import { Avatar } from 'theme-ui'

import defaultProfileImage from '../../assets/images/default_member.svg'

type CommentAvatarProps = {
  name?: string
  photoUrl?: string
}

export const CommentAvatar = ({ name, photoUrl }: CommentAvatarProps) => {
  return (
    <Avatar
      data-cy="commentAvatarImage"
      src={photoUrl ?? defaultProfileImage}
      sx={{
        objectFit: 'cover',
        width: ['30px', '50px'],
        height: ['30px', '50px'],
      }}
      alt={name ? `Avatar of ${name}` : 'Avatar of comment author'}
    />
  )
}
