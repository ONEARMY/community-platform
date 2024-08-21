import { useTheme } from '@emotion/react'
import { Image } from 'theme-ui'

import badge from '../../assets/icons/icon-star-active.svg'

import type { IProfileTypeName } from 'oa-shared'
import type { ImageProps } from 'theme-ui'

export interface Props extends ImageProps {
  size?: number
  profileType?: IProfileTypeName
  useLowDetailVersion?: boolean
}

const MINIMUM_SIZE = 40

export const MemberBadge = (props: Props) => {
  const theme: any = useTheme()
  const { size, style, useLowDetailVersion } = props
  const profileType = props.profileType || 'member'
  const badgeSize = size ? size : MINIMUM_SIZE

  return (
    <Image
      loading="lazy"
      className="avatar"
      data-cy={`MemberBadge-${profileType}`}
      sx={{ width: badgeSize, borderRadius: '50%' }}
      width={badgeSize}
      height={badgeSize}
      src={
        (badgeSize > MINIMUM_SIZE && !useLowDetailVersion
          ? theme.badges[profileType]?.normal
          : theme.badges[profileType]?.lowDetail) || badge
      }
      style={style}
    />
  )
}
