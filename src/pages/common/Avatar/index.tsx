import React from 'react'
import { Image, ImageProps } from 'rebass'

type AvatarProps = ImageProps

export const Avatar = (props: AvatarProps) => <Image {...props} />

// Default styling container props
Avatar.defaultProps = {
  className: 'avatar',
  width: 50,
  borderRadius: 4,
  src: 'http://i.pravatar.cc/200',
}
