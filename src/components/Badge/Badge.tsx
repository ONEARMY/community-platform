import { Image, ImageProps } from 'theme-ui'
import { ProfileTypeLabel } from 'src/models/user_pp.models'
import Workspace from 'src/pages/User/workspace/Workspace'

import MemberBadge from 'src/assets/images/badges/pt-member.svg'

interface IProps extends ImageProps {
  size?: number
  profileType?: ProfileTypeLabel
}

const Avatar = function(props: IProps) {
  const { size, style } = props
  const badgeProfileSrc = Workspace.findWorkspaceBadgeNullable(
    props.profileType,
  )
  const avatarUrl = badgeProfileSrc || MemberBadge

  return (
    <Image
      className="avatar"
      sx={{ width: size ? size : 40, borderRadius: '50%' }}
      height={size ? size : 40}
      src={avatarUrl}
      style={style}
    />
  )
}

export default Avatar
