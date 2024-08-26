import { ProfileTypeList } from 'oa-shared'

import type { IUserPPDB } from 'src/models'

const nonMemberProfileTypes = Object.values(ProfileTypeList).filter(
  (type) => type !== 'member',
)

export const isProfileComplete = (user: IUserPPDB): boolean => {
  const { about, coverImages, displayName, links, userImage } = user

  const isBasicInfoFilled = !!(about && displayName && links?.length !== 0)

  const isMember = user.profileType === ProfileTypeList.MEMBER
  const isSpace = !!nonMemberProfileTypes.find(
    (type) => type === user.profileType,
  )

  const isMemberFilled = isMember && !!userImage?.downloadUrl
  const isSpaceFilled = isSpace && coverImages && !!coverImages[0]?.downloadUrl

  return isBasicInfoFilled && (isMemberFilled || isSpaceFilled)
}
