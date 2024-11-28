import { Image } from 'theme-ui'

import VerifiedBadgeIcon from '../../assets/icons/icon-verified-badge.svg'
import SupporterBadgeIcon from '../../assets/icons/supporter.svg'

interface IProps {
  badgeName: string
}

export const UserBadge = ({ badgeName }: IProps) => {
  const options: { [key: string]: string } = {
    verified: VerifiedBadgeIcon,
    supporter: SupporterBadgeIcon,
  }
  const src: string | null = options[badgeName] || null

  if (!src) {
    return
  }

  return (
    <Image
      src={src}
      sx={{ ml: 1, height: 16, width: 16 }}
      data-testid={`Username: ${badgeName} badge`}
    />
  )
}
