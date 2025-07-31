import { Image } from 'theme-ui'

import type { ProfileBadge } from 'oa-shared'

interface IProps {
  badge: ProfileBadge
}

export const UserBadge = ({ badge }: IProps) => {
  return (
    <Image
      src={badge.imageUrl}
      sx={{ ml: 1, height: 16, width: 16 }}
      data-testid={`Username: ${badge.name} badge`}
    />
  )
}
