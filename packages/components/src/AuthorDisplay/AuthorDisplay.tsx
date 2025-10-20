import { Avatar, Flex } from 'theme-ui'

import { Username } from '../Username/Username'

import type { Author } from 'oa-shared'

interface IProps {
  author: Author | null
}

export const AuthorDisplay = ({ author }: IProps) => {
  if (!author) {
    return <></>
  }

  return (
    <Flex sx={{ gap: 2 }}>
      {author.photo && (
        <Avatar
          data-cy="authorAvatar"
          src={author.photo.publicUrl}
          sx={{
            objectFit: 'cover',
            width: '40px',
            height: '40px',
          }}
          alt={author.displayName}
          loading="lazy"
        />
      )}

      <Username user={author} sx={{ alignSelf: 'center' }} />
    </Flex>
  )
}
