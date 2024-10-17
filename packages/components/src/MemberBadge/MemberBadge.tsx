import { Image, useThemeUI } from 'theme-ui'

import badge from '../../assets/icons/icon-star-active.svg'

import type { ProfileTypeName } from 'oa-shared'
import type { ImageProps, ThemeUIStyleObject } from 'theme-ui'

export interface Props extends ImageProps {
  size?: number
  profileType?: ProfileTypeName
  useLowDetailVersion?: boolean
  sx?: ThemeUIStyleObject | undefined
}

const MINIMUM_SIZE = 40

export const MemberBadge = (props: Props) => {
  const { theme } = useThemeUI() as any
  const { size, useLowDetailVersion, sx } = props
  const profileType = props.profileType || 'member'
  const badgeSize = size ? size : MINIMUM_SIZE

  const title =
    profileType.charAt(0).toUpperCase() +
    profileType.slice(1).replace(/-/g, ' ')

  return (
    <Image
      loading="lazy"
      className="avatar"
      data-cy={`MemberBadge-${profileType}`}
      sx={{ width: badgeSize, borderRadius: '50%', ...sx }}
      width={badgeSize}
      height={badgeSize}
      title={title}
      src={
        (badgeSize > MINIMUM_SIZE && !useLowDetailVersion
          ? theme.badges[profileType]?.normal
          : theme.badges[profileType]?.lowDetail) || badge
      }
    />
  )
}
