import { ProfileType } from 'src/modules/profile/types'

import type { IUserPPDB } from 'src/models'

const noMemberProfileTypes = Object.values(ProfileType).filter(
  (type) => type !== 'member',
)

export const isProfileComplete = (user: IUserPPDB): boolean => {
  const { about, coverImages, displayName, links, userImage } = user

  const isBasicInfoFilled = !!(about && displayName && links?.length !== 0)

  const isMember = user.profileType === ProfileType.MEMBER
  const isSpace = !!noMemberProfileTypes.find(
    (type) => type === user.profileType,
  )

  const isMemberFilled = isMember && !!userImage?.downloadUrl
  const isSpaceFilled = isSpace && coverImages && !!coverImages[0]?.downloadUrl

  return isBasicInfoFilled && (isMemberFilled || isSpaceFilled)
}
