import type { ImageProps } from 'theme-ui'
import { Image } from 'theme-ui'
import { useTheme } from '@emotion/react'

interface Props extends ImageProps {
  size?: number
  profileType?: string
}

export const MemberBadge = (props: Props) => {
  const theme: any = useTheme()
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
