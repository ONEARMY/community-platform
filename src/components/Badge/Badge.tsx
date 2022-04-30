import { Image } from 'theme-ui'
import type { ImageProps } from 'theme-ui'
import type { ProfileTypeLabel } from 'src/models/user_pp.models'
import Workspace from 'src/pages/User/workspace/Workspace'

import MemberBadge from 'src/assets/images/badges/pt-member.svg'
import { useTheme } from '@emotion/react'

interface IProps extends ImageProps {
  size?: number
  profileType?: ProfileTypeLabel
}

const Badge = function (props: IProps) {
  const theme = useTheme()
  const { size, style } = props
  const profileType = props.profileType || 'member'

  return (
    <Image
      className="avatar"
      sx={{ width: size ? size : 40, borderRadius: '50%' }}
      height={size ? size : 40}
      src={theme.badges[profileType]}
      style={style}
    />
  )
}

export default Badge
