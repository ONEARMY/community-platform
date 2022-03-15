import { Image, ImageProps } from 'rebass'
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
        size={size ? size : 40}
        height={size ? size : 40}
        sx={{ borderRadius: '50%' }}
        src={avatarUrl}
        style={style}
      />
  )
}

export default Avatar
