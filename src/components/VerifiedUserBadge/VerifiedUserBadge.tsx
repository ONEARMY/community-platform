import { Image, ImageProps } from 'rebass'
import { useCommonStores } from 'src'
import VerifiedBadgeIcon from 'src/assets/icons/icon-verified-badge.svg'

interface IProps extends ImageProps {
  userId: string
}

/** Displays a verified user badge if passed userId is verified */
export const VerifiedUserBadge = (props: IProps) => {
  const { userId, ...imageProps } = props
  const { aggregationsStore } = useCommonStores().stores
  const { users_verified } = aggregationsStore.aggregations
  const isVerified = users_verified[userId]
  return isVerified ? <Image src={VerifiedBadgeIcon} {...imageProps} /> : null
}
